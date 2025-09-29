const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get all appointments
router.get('/', authenticateToken, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show']),
  query('date').optional().isISO8601()
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const date = req.query.date;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let queryParams = [];

    if (status) {
      whereClause = 'WHERE a.status = ?';
      queryParams.push(status);
    }

    if (date) {
      whereClause += whereClause ? ' AND a.appointment_date = ?' : 'WHERE a.appointment_date = ?';
      queryParams.push(date);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM appointments a ${whereClause}`,
      queryParams
    );
    const total = countResult[0].total;

    // Get appointments
    const [appointments] = await pool.execute(
      `SELECT a.*, 
              p.first_name as patient_first_name, p.last_name as patient_last_name, p.patient_id,
              d.first_name as doctor_first_name, d.last_name as doctor_last_name,
              dept.name as department_name
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       JOIN doctors doc ON a.doctor_id = doc.id
       JOIN users d ON doc.user_id = d.id
       LEFT JOIN departments dept ON a.department_id = dept.id
       ${whereClause}
       ORDER BY a.appointment_date DESC, a.appointment_time DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    res.json({
      appointments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Server error fetching appointments' });
  }
});

// Get appointment by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [appointments] = await pool.execute(
      `SELECT a.*, 
              p.first_name as patient_first_name, p.last_name as patient_last_name, p.patient_id,
              p.email as patient_email, p.phone as patient_phone,
              d.first_name as doctor_first_name, d.last_name as doctor_last_name,
              dept.name as department_name
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       JOIN doctors doc ON a.doctor_id = doc.id
       JOIN users d ON doc.user_id = d.id
       LEFT JOIN departments dept ON a.department_id = dept.id
       WHERE a.id = ?`,
      [req.params.id]
    );

    if (appointments.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointments[0]);
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ message: 'Server error fetching appointment' });
  }
});

// Create new appointment
router.post('/', authenticateToken, authorizeRoles('admin', 'receptionist', 'doctor'), [
  body('patientId').isInt(),
  body('doctorId').isInt(),
  body('appointmentDate').isISO8601(),
  body('appointmentTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('type').optional().isIn(['consultation', 'follow_up', 'emergency', 'surgery'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      patientId,
      doctorId,
      departmentId,
      appointmentDate,
      appointmentTime,
      durationMinutes = 30,
      type = 'consultation',
      notes
    } = req.body;

    // Check if patient exists
    const [patients] = await pool.execute('SELECT id FROM patients WHERE id = ?', [patientId]);
    if (patients.length === 0) {
      return res.status(400).json({ message: 'Patient not found' });
    }

    // Check if doctor exists
    const [doctors] = await pool.execute('SELECT id FROM doctors WHERE id = ?', [doctorId]);
    if (doctors.length === 0) {
      return res.status(400).json({ message: 'Doctor not found' });
    }

    // Check for conflicting appointments
    const [conflicts] = await pool.execute(
      `SELECT id FROM appointments 
       WHERE doctor_id = ? AND appointment_date = ? AND status IN ('scheduled', 'confirmed')
       AND (
         (appointment_time <= ? AND ADDTIME(appointment_time, INTERVAL duration_minutes MINUTE) > ?) OR
         (? < ADDTIME(appointment_time, INTERVAL duration_minutes MINUTE) AND ADDTIME(?, INTERVAL ? MINUTE) > appointment_time)
       )`,
      [doctorId, appointmentDate, appointmentTime, appointmentTime, appointmentTime, appointmentTime, durationMinutes]
    );

    if (conflicts.length > 0) {
      return res.status(400).json({ message: 'Appointment time conflicts with existing appointment' });
    }

    const [result] = await pool.execute(
      `INSERT INTO appointments (
        patient_id, doctor_id, department_id, appointment_date, appointment_time,
        duration_minutes, type, notes, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [patientId, doctorId, departmentId, appointmentDate, appointmentTime, durationMinutes, type, notes, req.user.id]
    );

    res.status(201).json({
      message: 'Appointment created successfully',
      appointmentId: result.insertId
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Server error creating appointment' });
  }
});

// Update appointment
router.put('/:id', authenticateToken, authorizeRoles('admin', 'receptionist', 'doctor'), [
  body('appointmentDate').optional().isISO8601(),
  body('appointmentTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('status').optional().isIn(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const appointmentId = req.params.id;
    const updateFields = [];
    const updateValues = [];

    const allowedFields = [
      'patientId', 'doctorId', 'departmentId', 'appointmentDate', 'appointmentTime',
      'durationMinutes', 'status', 'type', 'notes'
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

    updateValues.push(appointmentId);

    const [result] = await pool.execute(
      `UPDATE appointments SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment updated successfully' });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Server error updating appointment' });
  }
});

// Delete appointment
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'receptionist'), async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM appointments WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ message: 'Server error deleting appointment' });
  }
});

// Get appointment statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const [totalAppointments] = await pool.execute('SELECT COUNT(*) as total FROM appointments');
    const [statusStats] = await pool.execute(
      'SELECT status, COUNT(*) as count FROM appointments GROUP BY status'
    );
    const [todayAppointments] = await pool.execute(
      'SELECT COUNT(*) as total FROM appointments WHERE appointment_date = CURDATE()'
    );
    const [upcomingAppointments] = await pool.execute(
      'SELECT COUNT(*) as total FROM appointments WHERE appointment_date > CURDATE() AND status IN ("scheduled", "confirmed")'
    );

    res.json({
      totalAppointments: totalAppointments[0].total,
      todayAppointments: todayAppointments[0].total,
      upcomingAppointments: upcomingAppointments[0].total,
      statusDistribution: statusStats
    });
  } catch (error) {
    console.error('Appointment stats error:', error);
    res.status(500).json({ message: 'Server error fetching appointment statistics' });
  }
});

module.exports = router;
