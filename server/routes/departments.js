const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get all departments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [departments] = await pool.execute(
      `SELECT d.*, 
              u.first_name as head_doctor_first_name, u.last_name as head_doctor_last_name,
              COUNT(doc.id) as doctor_count
       FROM departments d
       LEFT JOIN users u ON d.head_doctor_id = u.id
       LEFT JOIN doctors doc ON d.id = doc.department_id
       WHERE d.is_active = true
       GROUP BY d.id
       ORDER BY d.name`
    );

    res.json(departments);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ message: 'Server error fetching departments' });
  }
});

// Get department by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [departments] = await pool.execute(
      `SELECT d.*, 
              u.first_name as head_doctor_first_name, u.last_name as head_doctor_last_name
       FROM departments d
       LEFT JOIN users u ON d.head_doctor_id = u.id
       WHERE d.id = ? AND d.is_active = true`,
      [req.params.id]
    );

    if (departments.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Get department doctors
    const [doctors] = await pool.execute(
      `SELECT doc.*, u.first_name, u.last_name, u.email, u.phone
       FROM doctors doc
       JOIN users u ON doc.user_id = u.id
       WHERE doc.department_id = ? AND u.is_active = true
       ORDER BY u.first_name, u.last_name`,
      [req.params.id]
    );

    // Get department statistics
    const [stats] = await pool.execute(
      `SELECT 
         COUNT(DISTINCT a.id) as total_appointments,
         COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completed_appointments,
         COUNT(DISTINCT CASE WHEN a.appointment_date >= CURDATE() THEN a.id END) as upcoming_appointments
       FROM appointments a
       WHERE a.department_id = ?`,
      [req.params.id]
    );

    res.json({
      ...departments[0],
      doctors,
      statistics: stats[0]
    });
  } catch (error) {
    console.error('Get department error:', error);
    res.status(500).json({ message: 'Server error fetching department' });
  }
});

// Create new department
router.post('/', authenticateToken, authorizeRoles('admin'), [
  body('name').notEmpty().trim(),
  body('description').optional().isString(),
  body('location').optional().isString(),
  body('phone').optional().isMobilePhone(),
  body('email').optional().isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, headDoctorId, location, phone, email } = req.body;

    // Check if department name already exists
    const [existingDepts] = await pool.execute(
      'SELECT id FROM departments WHERE name = ?',
      [name]
    );

    if (existingDepts.length > 0) {
      return res.status(400).json({ message: 'Department with this name already exists' });
    }

    const [result] = await pool.execute(
      `INSERT INTO departments (name, description, head_doctor_id, location, phone, email) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, headDoctorId, location, phone, email]
    );

    res.status(201).json({
      message: 'Department created successfully',
      departmentId: result.insertId
    });
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({ message: 'Server error creating department' });
  }
});

// Update department
router.put('/:id', authenticateToken, authorizeRoles('admin'), [
  body('name').optional().notEmpty().trim(),
  body('description').optional().isString(),
  body('location').optional().isString(),
  body('phone').optional().isMobilePhone(),
  body('email').optional().isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const departmentId = req.params.id;
    const updateFields = [];
    const updateValues = [];

    const allowedFields = [
      'name', 'description', 'headDoctorId', 'location', 'phone', 'email'
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

    updateValues.push(departmentId);

    const [result] = await pool.execute(
      `UPDATE departments SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json({ message: 'Department updated successfully' });
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({ message: 'Server error updating department' });
  }
});

// Delete department (soft delete)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const [result] = await pool.execute(
      'UPDATE departments SET is_active = false WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json({ message: 'Department deactivated successfully' });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({ message: 'Server error deleting department' });
  }
});

module.exports = router;
