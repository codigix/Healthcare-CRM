import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/dummy-logins', async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [users]: any = await connection.query(`
      SELECT id, email, role, department 
      FROM users 
      WHERE email IN (
        'superadmin@medixpro.com', 'admin@medixpro.com', 'receptionist@medixpro.com',
        'doctor@medixpro.com', 'nurse@medixpro.com', 'laboratory@medixpro.com',
        'ot@medixpro.com', 'pharmacy@medixpro.com', 'inventory@medixpro.com',
        'finance@medixpro.com', 'hr@medixpro.com', 'records@medixpro.com',
        'crm@medixpro.com', 'facilities@medixpro.com', 'it@medixpro.com',
        'executive@medixpro.com'
      )
    `);
    res.json(users);
  } catch (error) {
    console.error('Error fetching dummy logins:', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    if (connection) connection.release();
  }
});

router.post('/register', async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { name, email, password, role, department, phone, specialization, experience, avatar } = req.body;

    connection = await pool.getConnection();
    
    const [existing]: any = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (id, name, email, password, role, department, createdAt, updatedAt) 
                   VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), NOW())`;
    
    const resolvedRole = role || 'doctor';
    await connection.query(query, [name, email, hashedPassword, resolvedRole, department || null]);

    if (resolvedRole === 'doctor') {
      const [existingDoc]: any = await connection.query('SELECT id FROM doctors WHERE email = ?', [email]);
      if (existingDoc.length === 0) {
        const doctorUuid = require('uuid').v4();
        const docQuery = `INSERT INTO doctors (id, name, email, phone, specialization, experience, schedule, avatar, createdAt, updatedAt)
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
        await connection.query(docQuery, [
          doctorUuid,
          name,
          email,
          phone || '',
          specialization || 'General Medicine',
          Number(experience) || 0,
          'Monday-Friday, 9:00 AM - 5:00 PM',
          avatar || null
        ]);
      }
    }

    const [user]: any = await connection.query('SELECT id, name, email, role, department FROM users WHERE email = ?', [email]);
    
    let doctorId = null;
    if (user[0].role === 'doctor') {
      const [doctors]: any = await connection.query('SELECT id FROM doctors WHERE email = ?', [email]);
      if (doctors.length > 0) {
        doctorId = doctors[0].id;
      }
    }
    
    const resolvedRoleToken = user[0].department ? user[0].department.toLowerCase() : user[0].role;
    const token = jwt.sign(
      { id: user[0].id, email: user[0].email, role: resolvedRoleToken, department: user[0].department, doctorId },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user: { id: user[0].id, name: user[0].name, email: user[0].email, role: resolvedRoleToken, department: user[0].department, doctorId } });
  } catch (error: any) {
    console.error('[AUTH REGISTER] Error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  } finally {
    if (connection) connection.release();
  }
});

router.post('/login', async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { email, password } = req.body;
    console.log('[LOGIN] Received:', { email });

    if (!email || !password) {
      console.log('[LOGIN] Missing email or password');
      return res.status(400).json({ error: 'Email and password required' });
    }

    connection = await pool.getConnection();
    const [users]: any = await connection.query('SELECT id, name, email, password, role, department FROM users WHERE email = ?', [email]);

    console.log('[LOGIN] User found:', users.length > 0);
    
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('[LOGIN] Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    let doctorId = null;
    if (user.role === 'doctor') {
      const [doctors]: any = await connection.query('SELECT id FROM doctors WHERE email = ?', [user.email]);
      if (doctors.length > 0) {
        doctorId = doctors[0].id;
      }
    }
    
    const resolvedRole = user.department ? user.department.toLowerCase() : user.role;
    const token = jwt.sign(
      { id: user.id, email: user.email, role: resolvedRole, department: user.department, doctorId },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    console.log('[LOGIN] Success for:', email);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: resolvedRole, department: user.department, doctorId } });
  } catch (error: any) {
    console.error('[LOGIN] Error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  } finally {
    if (connection) connection.release();
  }
});

router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [users]: any = await connection.query('SELECT id, name, email, role, department, avatar FROM users WHERE id = ?', [req.user?.id]);
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    
    let doctorId = null;
    if (user.role === 'doctor') {
      const [doctors]: any = await connection.query('SELECT id FROM doctors WHERE email = ?', [user.email]);
      if (doctors.length > 0) {
        doctorId = doctors[0].id;
      }
    }
    
    const resolvedRole = user.department ? user.department.toLowerCase() : user.role;
    res.json({ id: user.id, name: user.name, email: user.email, role: resolvedRole, department: user.department, doctorId, avatar: user.avatar });
  } catch (error: any) {
    console.error('[AUTH PROFILE GET] Error:', error);
    res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
  } finally {
    if (connection) connection.release();
  }
});

router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { name, avatar } = req.body;
    connection = await pool.getConnection();
    
    const query = 'UPDATE users SET name = ?, avatar = ?, updatedAt = NOW() WHERE id = ?';
    await connection.query(query, [name, avatar, req.user?.id]);

    const [users]: any = await connection.query('SELECT id, name, email, role, department, avatar FROM users WHERE id = ?', [req.user?.id]);
    
    const user = users[0];
    
    let doctorId = null;
    if (user.role === 'doctor') {
      const [doctors]: any = await connection.query('SELECT id FROM doctors WHERE email = ?', [user.email]);
      if (doctors.length > 0) {
        doctorId = doctors[0].id;
      }
    }
    
    const resolvedRole = user.department ? user.department.toLowerCase() : user.role;
    res.json({ id: user.id, name: user.name, email: user.email, role: resolvedRole, department: user.department, doctorId, avatar: user.avatar });
  } catch (error: any) {
    console.error('[AUTH PROFILE UPDATE] Error:', error);
    res.status(500).json({ error: 'Failed to update profile', details: error.message });
  } finally {
    if (connection) connection.release();
  }
});

router.post('/change-password', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const connection = await pool.getConnection();
    
    const [users]: any = await connection.query('SELECT password FROM users WHERE id = ?', [req.user?.id]);
    
    if (users.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      connection.release();
      return res.status(400).json({ error: 'Incorrect old password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await connection.query('UPDATE users SET password = ?, updatedAt = NOW() WHERE id = ?', [hashedPassword, req.user?.id]);
    connection.release();

    res.json({ message: 'Password changed successfully' });
  } catch (error: any) {
    console.error('[AUTH CHANGE PASSWORD] Error:', error);
    res.status(500).json({ error: 'Failed to change password', details: error.message });
  }
});

export default router;
