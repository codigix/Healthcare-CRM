const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get all patients with pagination and search
router.get('/', authenticateToken, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString()
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    let whereClause = '';
    let queryParams = [];

    if (search) {
      whereClause = `WHERE CONCAT(first_name, ' ', last_name) LIKE ? OR patient_id LIKE ? OR email LIKE ? OR phone LIKE ?`;
      const searchPattern = `%${search}%`;
      queryParams = [searchPattern, searchPattern, searchPattern, searchPattern];
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM patients ${whereClause}`,
      queryParams
    );
    const total = countResult[0].total;

    // Get patients
    const [patients] = await pool.execute(
      `SELECT p.*, u.first_name as created_by_name, u.last_name as created_by_surname 
       FROM patients p 
       LEFT JOIN users u ON p.created_by = u.id 
       ${whereClause}
       ORDER BY p.created_at DESC 
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    res.json({
      patients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ message: 'Server error fetching patients' });
  }
});

// Get patient by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [patients] = await pool.execute(
      `SELECT p.*, u.first_name as created_by_name, u.last_name as created_by_surname 
       FROM patients p 
       LEFT JOIN users u ON p.created_by = u.id 
       WHERE p.id = ?`,
      [req.params.id]
    );

    if (patients.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Get patient's appointments
    const [appointments] = await pool.execute(
      `SELECT a.*, d.first_name as doctor_first_name, d.last_name as doctor_last_name,
              dept.name as department_name
       FROM appointments a
       JOIN doctors doc ON a.doctor_id = doc.id
       JOIN users d ON doc.user_id = d.id
       LEFT JOIN departments dept ON a.department_id = dept.id
       WHERE a.patient_id = ?
       ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [req.params.id]
    );

    // Get patient's medical records
    const [medicalRecords] = await pool.execute(
      `SELECT mr.*, d.first_name as doctor_first_name, d.last_name as doctor_last_name
       FROM medical_records mr
       JOIN doctors doc ON mr.doctor_id = doc.id
       JOIN users d ON doc.user_id = d.id
       WHERE mr.patient_id = ?
       ORDER BY mr.created_at DESC`,
      [req.params.id]
    );

    res.json({
      ...patients[0],
      appointments,
      medicalRecords
    });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ message: 'Server error fetching patient' });
  }
});

// Create new patient
router.post('/', authenticateToken, authorizeRoles('admin', 'receptionist', 'doctor'), [
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().isMobilePhone(),
  body('dateOfBirth').optional().isISO8601(),
  body('gender').optional().isIn(['male', 'female', 'other'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      emergencyContactName,
      emergencyContactPhone,
      bloodType,
      allergies,
      medicalHistory,
      insuranceProvider,
      insuranceNumber
    } = req.body;

    // Generate unique patient ID
    const patientId = `PAT${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const [result] = await pool.execute(
      `INSERT INTO patients (
        patient_id, first_name, last_name, email, phone, date_of_birth, gender,
        address, emergency_contact_name, emergency_contact_phone, blood_type,
        allergies, medical_history, insurance_provider, insurance_number, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patientId, firstName, lastName, email, phone, dateOfBirth, gender,
        address, emergencyContactName, emergencyContactPhone, bloodType,
        allergies, medicalHistory, insuranceProvider, insuranceNumber, req.user.id
      ]
    );

    res.status(201).json({
      message: 'Patient created successfully',
      patientId: result.insertId,
      patientNumber: patientId
    });
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ message: 'Server error creating patient' });
  }
});

// Update patient
router.put('/:id', authenticateToken, authorizeRoles('admin', 'receptionist', 'doctor'), [
  body('firstName').optional().notEmpty().trim(),
  body('lastName').optional().notEmpty().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().isMobilePhone(),
  body('dateOfBirth').optional().isISO8601(),
  body('gender').optional().isIn(['male', 'female', 'other'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const patientId = req.params.id;
    const updateFields = [];
    const updateValues = [];

    const allowedFields = [
      'firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender',
      'address', 'emergencyContactName', 'emergencyContactPhone', 'bloodType',
      'allergies', 'medicalHistory', 'insuranceProvider', 'insuranceNumber'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        const dbField = field.replace(/([A-Z])/g, '_$1').toLowerCase();
        updateFields.push(`${dbField} = ?`);
        updateValues.push(req.body[field]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    updateValues.push(patientId);

    const [result] = await pool.execute(
      `UPDATE patients SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ message: 'Patient updated successfully' });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ message: 'Server error updating patient' });
  }
});

// Delete patient
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM patients WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({ message: 'Server error deleting patient' });
  }
});

// Get patient statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const [totalPatients] = await pool.execute('SELECT COUNT(*) as total FROM patients');
    const [newThisMonth] = await pool.execute(
      'SELECT COUNT(*) as total FROM patients WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())'
    );
    const [genderStats] = await pool.execute(
      'SELECT gender, COUNT(*) as count FROM patients WHERE gender IS NOT NULL GROUP BY gender'
    );
    const [ageGroups] = await pool.execute(`
      SELECT 
        CASE 
          WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) < 18 THEN 'Under 18'
          WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 18 AND 35 THEN '18-35'
          WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 36 AND 60 THEN '36-60'
          ELSE 'Over 60'
        END as age_group,
        COUNT(*) as count
      FROM patients 
      WHERE date_of_birth IS NOT NULL 
      GROUP BY age_group
    `);

    res.json({
      totalPatients: totalPatients[0].total,
      newThisMonth: newThisMonth[0].total,
      genderDistribution: genderStats,
      ageDistribution: ageGroups
    });
  } catch (error) {
    console.error('Patient stats error:', error);
    res.status(500).json({ message: 'Server error fetching patient statistics' });
  }
});

module.exports = router;
