import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/search', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({ error: 'Doctor search term is required' });
    }

    const connection = await pool.getConnection();
    
    const query = `SELECT * FROM doctors 
                   WHERE LOWER(name) LIKE LOWER(?) OR LOWER(email) LIKE LOWER(?) OR LOWER(specialization) LIKE LOWER(?)
                   ORDER BY createdAt DESC
                   LIMIT 20`;
    const searchTerm = `%${String(search)}%`;
    
    const [doctors]: any = await connection.query(query, [searchTerm, searchTerm, searchTerm]);
    connection.release();

    if (doctors.length === 0) {
      return res.status(404).json({ error: 'Doctor not found', doctors: [] });
    }

    res.json({ success: true, doctors });
  } catch (error: any) {
    console.error('[DOCTORS SEARCH] Error:', error);
    res.status(500).json({ error: 'Failed to search doctors', details: error.message });
  }
});

router.get('/available', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { specialization } = req.query;

    let query = 'SELECT * FROM doctors WHERE 1=1';
    const params: any[] = [];

    if (specialization) {
      query += ' AND specialization = ?';
      params.push(String(specialization));
    }

    query += ' ORDER BY createdAt DESC LIMIT 20';

    const connection = await pool.getConnection();
    
    const [doctors]: any = await connection.query(query, params);
    connection.release();

    if (doctors.length === 0) {
      return res.status(404).json({ error: 'No doctors available for this specialization', doctors: [] });
    }

    res.json({ success: true, doctors });
  } catch (error: any) {
    console.error('[DOCTORS AVAILABLE] Error:', error);
    res.status(500).json({ error: 'Failed to fetch available doctors', details: error.message });
  }
});

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query = 'SELECT * FROM doctors WHERE 1=1';
    const params: any[] = [];

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR specialization LIKE ?)';
      const searchTerm = `%${String(search)}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const countParams = params.slice();
    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), skip);

    const connection = await pool.getConnection();
    
    const [doctors]: any = await connection.query(query, params);
    
    let countSql = 'SELECT COUNT(*) as total FROM doctors WHERE 1=1';
    if (search) {
      countSql += ' AND (name LIKE ? OR email LIKE ? OR specialization LIKE ?)';
    }
    
    const result: any = await connection.query(countSql, countParams);
    const total = result[0][0].total;
    
    connection.release();

    res.json({ doctors, total, page: Number(page), limit: Number(limit) });
  } catch (error: any) {
    console.error('[DOCTORS GET] Error:', error);
    res.status(500).json({ error: 'Failed to fetch doctors', details: error.message });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [doctors]: any = await connection.query('SELECT * FROM doctors WHERE id = ?', [req.params.id]);
    connection.release();

    if (doctors.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json(doctors[0]);
  } catch (error: any) {
    console.error('[DOCTORS GET BY ID] Error:', error);
    res.status(500).json({ error: 'Failed to fetch doctor', details: error.message });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, specialization, experience, schedule, avatar } = req.body;

    const connection = await pool.getConnection();
    
    const doctorId = require('uuid').v4();
    const query = `INSERT INTO doctors (id, name, email, phone, specialization, experience, schedule, avatar, createdAt, updatedAt)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    
    await connection.query(query, [doctorId, name, email, phone, specialization, Number(experience), schedule, avatar]);

    const [doctor]: any = await connection.query('SELECT * FROM doctors WHERE id = ?', [doctorId]);
    connection.release();

    res.status(201).json(doctor[0]);
  } catch (error: any) {
    console.error('[DOCTORS POST] Error:', error);
    res.status(500).json({ error: 'Failed to create doctor', details: error.message });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, specialization, experience, schedule, avatar } = req.body;
    const connection = await pool.getConnection();
    
    const updates: string[] = [];
    const values: any[] = [];

    if (name) { updates.push('name = ?'); values.push(name); }
    if (email) { updates.push('email = ?'); values.push(email); }
    if (phone) { updates.push('phone = ?'); values.push(phone); }
    if (specialization) { updates.push('specialization = ?'); values.push(specialization); }
    if (experience) { updates.push('experience = ?'); values.push(Number(experience)); }
    if (schedule) { updates.push('schedule = ?'); values.push(schedule); }
    if (avatar) { updates.push('avatar = ?'); values.push(avatar); }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updatedAt = NOW()');
    values.push(req.params.id);

    const query = `UPDATE doctors SET ${updates.join(', ')} WHERE id = ?`;
    const result = await connection.query(query, values);
    
    if ((result[0] as any).affectedRows === 0) {
      connection.release();
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const [doctor]: any = await connection.query('SELECT * FROM doctors WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(doctor[0]);
  } catch (error: any) {
    console.error('[DOCTORS PUT] Error:', error);
    res.status(500).json({ error: 'Failed to update doctor', details: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('DELETE FROM doctors WHERE id = ?', [req.params.id]);
    connection.release();

    if ((result[0] as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json({ message: 'Doctor deleted successfully' });
  } catch (error: any) {
    console.error('[DOCTORS DELETE] Error:', error);
    res.status(500).json({ error: 'Failed to delete doctor', details: error.message });
  }
});

export default router;
