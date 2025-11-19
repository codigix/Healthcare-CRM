import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, status, doctorId, patientId, startDate, endDate } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query = `SELECT 
                  a.id, a.doctorId, a.patientId, a.date, a.time, a.status, a.notes, 
                  a.createdAt, a.updatedAt,
                  d.name as doctorName,
                  p.name as patientName, p.email as patientEmail, p.phone as patientPhone
                FROM appointments a
                LEFT JOIN doctors d ON a.doctorId = d.id
                LEFT JOIN patients p ON a.patientId = p.id
                WHERE 1=1`;
    const params: any[] = [];

    if (status) {
      query += ' AND a.status = ?';
      params.push(String(status));
    }

    if (doctorId) {
      query += ' AND a.doctorId = ?';
      params.push(String(doctorId));
    }

    if (patientId) {
      query += ' AND a.patientId = ?';
      params.push(String(patientId));
    }

    if (startDate) {
      query += ' AND a.date >= ?';
      params.push(new Date(String(startDate)));
    }

    if (endDate) {
      query += ' AND a.date <= ?';
      params.push(new Date(String(endDate)));
    }

    const countParams = params.slice();
    query += ' ORDER BY a.date DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), skip);

    const connection = await pool.getConnection();
    
    const [appointments]: any = await connection.query(query, params);
    
    let countSql = `SELECT COUNT(*) as total FROM appointments a
                   LEFT JOIN doctors d ON a.doctorId = d.id
                   LEFT JOIN patients p ON a.patientId = p.id
                   WHERE 1=1`;
    if (status) {
      countSql += ' AND a.status = ?';
    }
    if (doctorId) {
      countSql += ' AND a.doctorId = ?';
    }
    if (patientId) {
      countSql += ' AND a.patientId = ?';
    }
    if (startDate) {
      countSql += ' AND a.date >= ?';
    }
    if (endDate) {
      countSql += ' AND a.date <= ?';
    }
    
    const result: any = await connection.query(countSql, countParams);
    const total = result[0][0].total;
    
    connection.release();

    const formattedAppointments = appointments.map((apt: any) => ({
      ...apt,
      patient: {
        id: apt.patientId,
        name: apt.patientName || 'Unknown',
        email: apt.patientEmail || null,
        phone: apt.patientPhone || null
      },
      doctor: {
        id: apt.doctorId,
        name: apt.doctorName || 'Unassigned'
      }
    }));

    res.json({ appointments: formattedAppointments, total, page: Number(page), limit: Number(limit) });
  } catch (error: any) {
    console.error('[APPOINTMENTS GET] Error:', error);
    res.status(500).json({ error: 'Failed to fetch appointments', details: error.message });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [appointments]: any = await connection.query('SELECT * FROM appointments WHERE id = ?', [req.params.id]);
    connection.release();

    if (appointments.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(appointments[0]);
  } catch (error: any) {
    console.error('[APPOINTMENTS GET BY ID] Error:', error);
    res.status(500).json({ error: 'Failed to fetch appointment', details: error.message });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { doctorId, patientId, date, time, status, notes } = req.body;

    const connection = await pool.getConnection();
    
    const query = `INSERT INTO appointments (id, doctorId, patientId, date, time, status, notes, createdAt, updatedAt)
                   VALUES (UUID(), ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    
    await connection.query(query, [doctorId, patientId, new Date(date), time, status || 'pending', notes]);

    const [appointment]: any = await connection.query('SELECT * FROM appointments WHERE doctorId = ? AND patientId = ? ORDER BY createdAt DESC LIMIT 1', [doctorId, patientId]);
    connection.release();

    res.status(201).json(appointment[0]);
  } catch (error: any) {
    console.error('[APPOINTMENTS POST] Error:', error);
    res.status(500).json({ error: 'Failed to create appointment', details: error.message });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { doctorId, patientId, date, time, status, notes } = req.body;
    const connection = await pool.getConnection();
    
    const updates: string[] = [];
    const values: any[] = [];

    if (doctorId) { updates.push('doctorId = ?'); values.push(doctorId); }
    if (patientId) { updates.push('patientId = ?'); values.push(patientId); }
    if (date) { updates.push('date = ?'); values.push(new Date(date)); }
    if (time) { updates.push('time = ?'); values.push(time); }
    if (status) { updates.push('status = ?'); values.push(status); }
    if (notes !== undefined) { updates.push('notes = ?'); values.push(notes); }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updatedAt = NOW()');
    values.push(req.params.id);

    const query = `UPDATE appointments SET ${updates.join(', ')} WHERE id = ?`;
    const result = await connection.query(query, values);
    
    if ((result[0] as any).affectedRows === 0) {
      connection.release();
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const [appointment]: any = await connection.query('SELECT * FROM appointments WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(appointment[0]);
  } catch (error: any) {
    console.error('[APPOINTMENTS PUT] Error:', error);
    res.status(500).json({ error: 'Failed to update appointment', details: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('DELETE FROM appointments WHERE id = ?', [req.params.id]);
    connection.release();

    if ((result[0] as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error: any) {
    console.error('[APPOINTMENTS DELETE] Error:', error);
    res.status(500).json({ error: 'Failed to delete appointment', details: error.message });
  }
});

export default router;
