import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query = 'SELECT * FROM reviews WHERE 1=1';
    const params: any[] = [];

    if (type) {
      query += ' AND type = ?';
      params.push(String(type));
    }

    const countParams = params.slice();
    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), skip);

    const connection = await pool.getConnection();
    
    const [reviews]: any = await connection.query(query, params);
    
    let countSql = 'SELECT COUNT(*) as total FROM reviews WHERE 1=1';
    if (type) {
      countSql += ' AND type = ?';
    }
    
    const result: any = await connection.query(countSql, countParams);
    const total = result[0][0].total;
    
    connection.release();

    res.json({ reviews, total, page: Number(page), limit: Number(limit) });
  } catch (error: any) {
    console.error('[REVIEWS GET] Error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews', details: error.message });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [reviews]: any = await connection.query('SELECT * FROM reviews WHERE id = ?', [req.params.id]);
    connection.release();

    if (reviews.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json(reviews[0]);
  } catch (error: any) {
    console.error('[REVIEWS GET BY ID] Error:', error);
    res.status(500).json({ error: 'Failed to fetch review', details: error.message });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { type, subjectName, rating, comment, reviewerName, status } = req.body;

    if (!type || !subjectName || rating === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await pool.getConnection();
    
    const query = `INSERT INTO reviews (id, type, subjectName, rating, comment, reviewerName, status, createdAt, updatedAt)
                   VALUES (UUID(), ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    
    await connection.query(query, [type, subjectName, Number(rating), comment || null, reviewerName || null, status || 'Active']);

    const [review]: any = await connection.query('SELECT * FROM reviews WHERE subjectName = ? ORDER BY createdAt DESC LIMIT 1', [subjectName]);
    connection.release();

    res.status(201).json(review[0]);
  } catch (error: any) {
    console.error('[REVIEWS POST] Error:', error);
    res.status(500).json({ error: 'Failed to create review', details: error.message });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { type, subjectName, rating, comment, reviewerName, status } = req.body;
    const connection = await pool.getConnection();
    
    const updates: string[] = [];
    const values: any[] = [];

    if (type) { updates.push('type = ?'); values.push(type); }
    if (subjectName) { updates.push('subjectName = ?'); values.push(subjectName); }
    if (rating !== undefined) { updates.push('rating = ?'); values.push(Number(rating)); }
    if (comment !== undefined) { updates.push('comment = ?'); values.push(comment); }
    if (reviewerName !== undefined) { updates.push('reviewerName = ?'); values.push(reviewerName); }
    if (status) { updates.push('status = ?'); values.push(status); }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updatedAt = NOW()');
    values.push(req.params.id);

    const query = `UPDATE reviews SET ${updates.join(', ')} WHERE id = ?`;
    const result = await connection.query(query, values);
    
    if ((result[0] as any).affectedRows === 0) {
      connection.release();
      return res.status(404).json({ error: 'Review not found' });
    }

    const [review]: any = await connection.query('SELECT * FROM reviews WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(review[0]);
  } catch (error: any) {
    console.error('[REVIEWS PUT] Error:', error);
    res.status(500).json({ error: 'Failed to update review', details: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    connection.release();

    if ((result[0] as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error: any) {
    console.error('[REVIEWS DELETE] Error:', error);
    res.status(500).json({ error: 'Failed to delete review', details: error.message });
  }
});

export default router;
