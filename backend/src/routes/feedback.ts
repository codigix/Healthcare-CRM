import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query = 'SELECT * FROM feedback WHERE 1=1';
    const params: any[] = [];

    if (status) {
      query += ' AND status = ?';
      params.push(String(status));
    }

    const countParams = params.slice();
    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), skip);

    const connection = await pool.getConnection();
    
    const [feedbacks]: any = await connection.query(query, params);
    
    let countSql = 'SELECT COUNT(*) as total FROM feedback WHERE 1=1';
    if (status) {
      countSql += ' AND status = ?';
    }
    
    const result: any = await connection.query(countSql, countParams);
    const total = result[0][0].total;
    
    connection.release();

    res.json({ feedbacks, total, page: Number(page), limit: Number(limit) });
  } catch (error: any) {
    console.error('[FEEDBACK GET] Error:', error);
    res.status(500).json({ error: 'Failed to fetch feedbacks', details: error.message });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [feedbacks]: any = await connection.query('SELECT * FROM feedback WHERE id = ?', [req.params.id]);
    connection.release();

    if (feedbacks.length === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json(feedbacks[0]);
  } catch (error: any) {
    console.error('[FEEDBACK GET BY ID] Error:', error);
    res.status(500).json({ error: 'Failed to fetch feedback', details: error.message });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { subject, message, senderName, senderEmail, category, status } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await pool.getConnection();
    
    const query = `INSERT INTO feedback (id, subject, message, senderName, senderEmail, category, status, createdAt, updatedAt)
                   VALUES (UUID(), ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    
    await connection.query(query, [subject, message, senderName || null, senderEmail || null, category || 'General', status || 'Pending']);

    const [feedback]: any = await connection.query('SELECT * FROM feedback WHERE subject = ? ORDER BY createdAt DESC LIMIT 1', [subject]);
    connection.release();

    res.status(201).json(feedback[0]);
  } catch (error: any) {
    console.error('[FEEDBACK POST] Error:', error);
    res.status(500).json({ error: 'Failed to create feedback', details: error.message });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { subject, message, senderName, senderEmail, category, status } = req.body;
    const connection = await pool.getConnection();
    
    const updates: string[] = [];
    const values: any[] = [];

    if (subject) { updates.push('subject = ?'); values.push(subject); }
    if (message) { updates.push('message = ?'); values.push(message); }
    if (senderName !== undefined) { updates.push('senderName = ?'); values.push(senderName); }
    if (senderEmail !== undefined) { updates.push('senderEmail = ?'); values.push(senderEmail); }
    if (category) { updates.push('category = ?'); values.push(category); }
    if (status) { updates.push('status = ?'); values.push(status); }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updatedAt = NOW()');
    values.push(req.params.id);

    const query = `UPDATE feedback SET ${updates.join(', ')} WHERE id = ?`;
    const result = await connection.query(query, values);
    
    if ((result[0] as any).affectedRows === 0) {
      connection.release();
      return res.status(404).json({ error: 'Feedback not found' });
    }

    const [feedback]: any = await connection.query('SELECT * FROM feedback WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(feedback[0]);
  } catch (error: any) {
    console.error('[FEEDBACK PUT] Error:', error);
    res.status(500).json({ error: 'Failed to update feedback', details: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('DELETE FROM feedback WHERE id = ?', [req.params.id]);
    connection.release();

    if ((result[0] as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error: any) {
    console.error('[FEEDBACK DELETE] Error:', error);
    res.status(500).json({ error: 'Failed to delete feedback', details: error.message });
  }
});

export default router;
