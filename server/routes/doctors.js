const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get all doctors
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [doctors] = await pool.execute(
      `SELECT d.*, u.first_name, u.last_name, u.email, u.phone, u.avatar, 
              dept.name as department_name
       FROM doctors d
       JOIN users u ON d.user_id = u.id
       LEFT JOIN departments dept ON d.department_id = dept.id
       WHERE u.is_active = true
       ORDER BY u.first_name, u.last_name`
    );

    res.json(doctors);
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Server error fetching doctors' });
  }
});

// Get doctor by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [doctors] = await pool.execute(
      `SELECT d.*, u.first_name, u.last_name, u.email, u.phone, u.avatar,
              dept.name as department_name, dept.description as department_description
       FROM doctors d
       JOIN users u ON d.user_id = u.id
       LEFT JOIN departments dept ON d.department_id = dept.id
       WHERE d.id = ? AND u.is_active = true`,
      [req.params.id]
    );

    if (doctors.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Get doctor's upcoming appointments
    const [appointments] = await pool.execute(
      `SELECT a.*, p.first_name as patient_first_name, p.last_name as patient_last_name,
              p.patient_id
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       WHERE a.doctor_id = ? AND a.appointment_date >= CURDATE()
       ORDER BY a.appointment_date, a.appointment_time`,
      [req.params.id]
    );

    res.json({
      ...doctors[0],
      upcomingAppointments: appointments
    });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ message: 'Server error fetching doctor' });
  }
});

// Create doctor profile
router.post('/', authenticateToken, authorizeRoles('admin'), [
  body('userId').isInt(),
  body('departmentId').optional().isInt(),
  body('specialization').notEmpty().trim(),
  body('licenseNumber').notEmpty().trim(),
  body('experienceYears').isInt({ min: 0 }),
  body('consultationFee').isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      userId,
      departmentId,
      specialization,
      licenseNumber,
      experienceYears,
      consultationFee,
      bio,
      availabilitySchedule
    } = req.body;

    // Check if user exists and is a doctor
    const [users] = await pool.execute(
      'SELECT role FROM users WHERE id = ? AND role = "doctor"',
      [userId]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'User not found or not a doctor' });
    }

    // Check if doctor profile already exists
    const [existingDoctors] = await pool.execute(
      'SELECT id FROM doctors WHERE user_id = ?',
      [userId]
    );

    if (existingDoctors.length > 0) {
      return res.status(400).json({ message: 'Doctor profile already exists' });
    }

    const [result] = await pool.execute(
      `INSERT INTO doctors (
        user_id, department_id, specialization, license_number, 
        experience_years, consultation_fee, bio, availability_schedule
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, departmentId, specialization, licenseNumber,
        experienceYears, consultationFee, bio, JSON.stringify(availabilitySchedule)
      ]
    );

    res.status(201).json({
      message: 'Doctor profile created successfully',
      doctorId: result.insertId
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({ message: 'Server error creating doctor profile' });
  }
});

// Update doctor profile
router.put('/:id', authenticateToken, authorizeRoles('admin', 'doctor'), [
  body('specialization').optional().notEmpty().trim(),
  body('experienceYears').optional().isInt({ min: 0 }),
  body('consultationFee').optional().isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const doctorId = req.params.id;
    const updateFields = [];
    const updateValues = [];

    const allowedFields = [
      'departmentId', 'specialization', 'licenseNumber', 'experienceYears',
      'consultationFee', 'bio', 'availabilitySchedule'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        const dbField = field.replace(/([A-Z])/g, '_$1').toLowerCase();
        if (field === 'availabilitySchedule') {
          updateFields.push(`${dbField} = ?`);
          updateValues.push(JSON.stringify(req.body[field]));
        } else {
          updateFields.push(`${dbField} = ?`);
          updateValues.push(req.body[field]);
        }
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    updateValues.push(doctorId);

    const [result] = await pool.execute(
      `UPDATE doctors SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ message: 'Doctor profile updated successfully' });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({ message: 'Server error updating doctor profile' });
  }
});

// Get doctor statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const [totalDoctors] = await pool.execute('SELECT COUNT(*) as total FROM doctors');
    const [specializations] = await pool.execute(
      'SELECT specialization, COUNT(*) as count FROM doctors GROUP BY specialization ORDER BY count DESC'
    );
    const [departmentStats] = await pool.execute(
      `SELECT d.name as department_name, COUNT(doc.id) as doctor_count
       FROM departments d
       LEFT JOIN doctors doc ON d.id = doc.department_id
       GROUP BY d.id, d.name
       ORDER BY doctor_count DESC`
    );

    res.json({
      totalDoctors: totalDoctors[0].total,
      specializationDistribution: specializations,
      departmentDistribution: departmentStats
    });
  } catch (error) {
    console.error('Doctor stats error:', error);
    res.status(500).json({ message: 'Server error fetching doctor statistics' });
  }
});

module.exports = router;
