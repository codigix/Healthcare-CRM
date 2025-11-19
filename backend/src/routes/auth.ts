import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const connection = await pool.getConnection();
    
    const [existing]: any = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (id, name, email, password, role, createdAt, updatedAt) 
                   VALUES (UUID(), ?, ?, ?, ?, NOW(), NOW())`;
    
    await connection.query(query, [name, email, hashedPassword, role || 'doctor']);

    const [user]: any = await connection.query('SELECT id, name, email, role FROM users WHERE email = ?', [email]);
    connection.release();

    const token = jwt.sign(
      { id: user[0].id, email: user[0].email, role: user[0].role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user: { id: user[0].id, name: user[0].name, email: user[0].email, role: user[0].role } });
  } catch (error: any) {
    console.error('[AUTH REGISTER] Error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('[LOGIN] Received:', { email, passwordLength: password?.length });

    if (!email || !password) {
      console.log('[LOGIN] Missing email or password');
      return res.status(400).json({ error: 'Email and password required' });
    }

    const connection = await pool.getConnection();
    const [users]: any = await connection.query('SELECT id, name, email, password, role FROM users WHERE email = ?', [email]);
    connection.release();

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

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    console.log('[LOGIN] Success for:', email);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error: any) {
    console.error('[LOGIN] Error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [users]: any = await connection.query('SELECT id, name, email, role, avatar FROM users WHERE id = ?', [req.user?.id]);
    connection.release();

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar });
  } catch (error: any) {
    console.error('[AUTH PROFILE GET] Error:', error);
    res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
  }
});

router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, avatar } = req.body;
    const connection = await pool.getConnection();
    
    const query = 'UPDATE users SET name = ?, avatar = ?, updatedAt = NOW() WHERE id = ?';
    await connection.query(query, [name, avatar, req.user?.id]);

    const [users]: any = await connection.query('SELECT id, name, email, role, avatar FROM users WHERE id = ?', [req.user?.id]);
    connection.release();

    const user = users[0];
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar });
  } catch (error: any) {
    console.error('[AUTH PROFILE UPDATE] Error:', error);
    res.status(500).json({ error: 'Failed to update profile', details: error.message });
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
