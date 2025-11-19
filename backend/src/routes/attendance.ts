import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, staffId, date, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query = `SELECT 
                  a.*,
                  s.id as staffId, s.firstName, s.lastName, s.email, s.department
                FROM attendance a
                LEFT JOIN Staff s ON a.staffId = s.id
                WHERE 1=1`;
    const params: any[] = [];

    if (staffId) {
      query += ' AND a.staffId = ?';
      params.push(String(staffId));
    }

    if (date) {
      query += ' AND DATE(a.date) = ?';
      params.push(String(date));
    }

    if (status) {
      query += ' AND a.status = ?';
      params.push(String(status));
    }

    query += ' ORDER BY a.date DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), skip);

    const connection = await pool.getConnection();
    
    const [attendance]: any = await connection.query(query, params);
    
    let countSql = `SELECT COUNT(*) as total FROM attendance a
                   LEFT JOIN Staff s ON a.staffId = s.id
                   WHERE 1=1`;
    const countParams = params.slice(0, params.length - 2);
    
    if (staffId) {
      countSql += ' AND a.staffId = ?';
    }
    if (date) {
      countSql += ' AND DATE(a.date) = ?';
    }
    if (status) {
      countSql += ' AND a.status = ?';
    }
    
    const result: any = await connection.query(countSql, countParams);
    const total = result[0][0].total;
    
    connection.release();

    const formattedAttendance = attendance.map((record: any) => ({
      ...record,
      staff: {
        id: record.staffId,
        firstName: record.firstName,
        lastName: record.lastName,
        email: record.email,
        role: record.role,
        department: record.department
      }
    }));

    res.json({ attendance: formattedAttendance, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { staffId, date, status, checkIn, checkOut, hours } = req.body;

    const connection = await pool.getConnection();
    const query = `INSERT INTO attendance (id, staffId, date, status, checkIn, checkOut, hours, createdAt, updatedAt)
                   VALUES (UUID(), ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    
    await connection.query(query, [staffId, date ? new Date(date) : new Date(), status || 'Present', checkIn, checkOut, hours || 0]);

    const [attendance]: any = await connection.query('SELECT * FROM attendance WHERE staffId = ? ORDER BY createdAt DESC LIMIT 1', [staffId]);
    connection.release();

    res.status(201).json(attendance[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create attendance record' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status, checkIn, checkOut, hours } = req.body;
    const connection = await pool.getConnection();
    
    const updates: string[] = [];
    const values: any[] = [];

    if (status) { updates.push('status = ?'); values.push(status); }
    if (checkIn) { updates.push('checkIn = ?'); values.push(checkIn); }
    if (checkOut) { updates.push('checkOut = ?'); values.push(checkOut); }
    if (hours !== undefined) { updates.push('hours = ?'); values.push(hours); }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updatedAt = NOW()');
    values.push(req.params.id);

    const query = `UPDATE attendance SET ${updates.join(', ')} WHERE id = ?`;
    await connection.query(query, values);
    
    const [attendance]: any = await connection.query('SELECT * FROM attendance WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(attendance[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update attendance record' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM attendance WHERE id = ?', [req.params.id]);
    connection.release();

    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete attendance record' });
  }
});

export default router;
