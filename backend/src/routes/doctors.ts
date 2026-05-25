import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import pool from '../db';

const router = Router();

router.get('/search', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({ error: 'Doctor search term is required', doctors: [] });
    }

    const connection = await pool.getConnection();
    
    const query = `SELECT d.*, COUNT(a.id) as patients 
                   FROM doctors d
                   LEFT JOIN appointments a ON d.id = a.doctorId
                   WHERE LOWER(d.name) LIKE LOWER(?) OR LOWER(d.email) LIKE LOWER(?) OR LOWER(d.specialization) LIKE LOWER(?)
                   GROUP BY d.id
                   ORDER BY d.createdAt DESC
                   LIMIT 20`;
    const searchTerm = `%${String(search)}%`;
    
    console.log('[DOCTORS SEARCH] Searching for:', search);
    const [doctors]: any = await connection.query(query, [searchTerm, searchTerm, searchTerm]);
    connection.release();

    console.log('[DOCTORS SEARCH] Found', doctors.length, 'doctors');
    if (doctors && doctors.length > 0) {
      res.json({ success: true, doctors });
    } else {
      res.json({ success: false, error: `No doctors found matching "${search}"`, doctors: [] });
    }
  } catch (error: any) {
    console.error('[DOCTORS SEARCH] Error:', error);
    res.status(500).json({ error: 'Failed to search doctors', details: error.message, doctors: [] });
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
    
    console.log('[DOCTORS AVAILABLE] Fetching available doctors', specialization ? `for ${specialization}` : 'for all specializations');
    const [doctors]: any = await connection.query(query, params);
    connection.release();

    console.log('[DOCTORS AVAILABLE] Found', doctors.length, 'available doctors');
    if (doctors && doctors.length > 0) {
      res.json({ success: true, doctors });
    } else {
      res.json({ success: false, error: `No doctors available for ${specialization || 'this'} specialization`, doctors: [] });
    }
  } catch (error: any) {
    console.error('[DOCTORS AVAILABLE] Error:', error);
    res.status(500).json({ error: 'Failed to fetch available doctors', details: error.message, doctors: [] });
  }
});

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query = `SELECT d.*, COUNT(a.id) as patients 
                 FROM doctors d
                 LEFT JOIN appointments a ON d.id = a.doctorId
                 WHERE 1=1`;
    const params: any[] = [];

    if (search) {
      query += ' AND (d.name LIKE ? OR d.email LIKE ? OR d.specialization LIKE ?)';
      const searchTerm = `%${String(search)}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const countParams = params.slice();
    query += ' GROUP BY d.id ORDER BY d.createdAt DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), skip);

    const connection = await pool.getConnection();
    
    const [doctors]: any = await connection.query(query, params);
    
    let countSql = 'SELECT COUNT(DISTINCT d.id) as total FROM doctors d WHERE 1=1';
    if (search) {
      countSql += ' AND (d.name LIKE ? OR d.email LIKE ? OR d.specialization LIKE ?)';
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
    const { name, email, phone, specialization, experience, schedule, avatar, departmentId, password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password is required and must be at least 6 characters' });
    }

    const connection = await pool.getConnection();
    
    const doctorId = require('uuid').v4();
    const query = `INSERT INTO doctors (id, name, email, phone, specialization, experience, schedule, avatar, departmentId, createdAt, updatedAt)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    
    await connection.query(query, [doctorId, name, email, phone, specialization, Number(experience), schedule, avatar, departmentId || null]);

    // Automatically create corresponding User credentials
    const hashedPassword = await bcrypt.hash(password, 10);
    const [existingUsers]: any = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length === 0) {
      const userQuery = `INSERT INTO users (id, name, email, password, role, department, createdAt, updatedAt)
                         VALUES (UUID(), ?, ?, ?, 'doctor', 'Doctor', NOW(), NOW())`;
      await connection.query(userQuery, [name, email, hashedPassword]);
    }

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
    const { name, email, phone, specialization, experience, schedule, avatar, departmentId, password } = req.body;
    const connection = await pool.getConnection();
    
    // Fetch doctor's old email first to locate user
    const [oldDoc]: any = await connection.query('SELECT email FROM doctors WHERE id = ?', [req.params.id]);
    const oldEmail = oldDoc[0]?.email;

    const updates: string[] = [];
    const values: any[] = [];

    if (name) { updates.push('name = ?'); values.push(name); }
    if (email) { updates.push('email = ?'); values.push(email); }
    if (phone) { updates.push('phone = ?'); values.push(phone); }
    if (specialization) { updates.push('specialization = ?'); values.push(specialization); }
    if (experience) { updates.push('experience = ?'); values.push(Number(experience)); }
    if (schedule) { updates.push('schedule = ?'); values.push(schedule); }
    if (avatar) { updates.push('avatar = ?'); values.push(avatar); }
    if (departmentId !== undefined) { updates.push('departmentId = ?'); values.push(departmentId); }

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

    // Synchronize User profile details and password
    if (oldEmail) {
      const userUpdates: string[] = [];
      const userValues: any[] = [];
      
      if (name) { userUpdates.push('name = ?'); userValues.push(name); }
      if (email) { userUpdates.push('email = ?'); userValues.push(email); }
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        userUpdates.push('password = ?');
        userValues.push(hashedPassword);
      }
      
      if (userUpdates.length > 0) {
        userValues.push(oldEmail);
        await connection.query(`UPDATE users SET ${userUpdates.join(', ')}, updatedAt = NOW() WHERE email = ? AND role = 'doctor'`, userValues);
      }
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
    
    // Fetch doctor's email first
    const [doc]: any = await connection.query('SELECT email FROM doctors WHERE id = ?', [req.params.id]);
    const email = doc[0]?.email;
    
    const result = await connection.query('DELETE FROM doctors WHERE id = ?', [req.params.id]);
    
    if ((result[0] as any).affectedRows === 0) {
      connection.release();
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Delete corresponding user credentials
    if (email) {
      await connection.query('DELETE FROM users WHERE email = ? AND role = "doctor"', [email]);
    }
    
    connection.release();

    res.json({ message: 'Doctor deleted successfully' });
  } catch (error: any) {
    console.error('[DOCTORS DELETE] Error:', error);
    res.status(500).json({ error: 'Failed to delete doctor', details: error.message });
  }
});

export default router;
