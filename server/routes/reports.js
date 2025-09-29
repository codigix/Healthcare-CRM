const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get all reports
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [reports] = await pool.execute(
      `SELECT ar.*, u.first_name, u.last_name 
       FROM ai_reports ar
       LEFT JOIN users u ON ar.generated_by = u.id
       ORDER BY ar.created_at DESC`
    );

    res.json(reports);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Server error fetching reports' });
  }
});

// Get report by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [reports] = await pool.execute(
      `SELECT ar.*, u.first_name, u.last_name 
       FROM ai_reports ar
       LEFT JOIN users u ON ar.generated_by = u.id
       WHERE ar.id = ?`,
      [req.params.id]
    );

    if (reports.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(reports[0]);
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ message: 'Server error fetching report' });
  }
});

// Delete report
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM ai_reports WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ message: 'Server error deleting report' });
  }
});

module.exports = router;
