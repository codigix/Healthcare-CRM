import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query = 'SELECT * FROM reports WHERE 1=1';
    const params: any[] = [];

    if (type) {
      query += ' AND type = ?';
      params.push(String(type));
    }

    const countParams = params.slice();
    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), skip);

    const connection = await pool.getConnection();
    
    const [reports]: any = await connection.query(query, params);
    
    let countSql = 'SELECT COUNT(*) as total FROM reports WHERE 1=1';
    if (type) {
      countSql += ' AND type = ?';
    }
    
    const result: any = await connection.query(countSql, countParams);
    const total = result[0][0].total;
    
    connection.release();

    res.json({ reports, total, page: Number(page), limit: Number(limit) });
  } catch (error: any) {
    console.error('[REPORTS GET] Error:', error);
    res.status(500).json({ error: 'Failed to fetch reports', details: error.message });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [reports]: any = await connection.query('SELECT * FROM reports WHERE id = ?', [req.params.id]);
    connection.release();

    if (reports.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(reports[0]);
  } catch (error: any) {
    console.error('[REPORTS GET BY ID] Error:', error);
    res.status(500).json({ error: 'Failed to fetch report', details: error.message });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { type, title, data, period, generatedBy } = req.body;

    if (!type || !title) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await pool.getConnection();
    
    const query = `INSERT INTO reports (id, type, title, data, period, generatedBy, createdAt, updatedAt)
                   VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), NOW())`;
    
    await connection.query(query, [type, title, JSON.stringify(data || {}), period || null, generatedBy || null]);

    const [report]: any = await connection.query('SELECT * FROM reports WHERE title = ? ORDER BY createdAt DESC LIMIT 1', [title]);
    connection.release();

    res.status(201).json(report[0]);
  } catch (error: any) {
    console.error('[REPORTS POST] Error:', error);
    res.status(500).json({ error: 'Failed to create report', details: error.message });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { type, title, data, period, generatedBy } = req.body;
    const connection = await pool.getConnection();
    
    const updates: string[] = [];
    const values: any[] = [];

    if (type) { updates.push('type = ?'); values.push(type); }
    if (title) { updates.push('title = ?'); values.push(title); }
    if (data !== undefined) { updates.push('data = ?'); values.push(JSON.stringify(data)); }
    if (period !== undefined) { updates.push('period = ?'); values.push(period); }
    if (generatedBy !== undefined) { updates.push('generatedBy = ?'); values.push(generatedBy); }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updatedAt = NOW()');
    values.push(req.params.id);

    const query = `UPDATE reports SET ${updates.join(', ')} WHERE id = ?`;
    const result = await connection.query(query, values);
    
    if ((result[0] as any).affectedRows === 0) {
      connection.release();
      return res.status(404).json({ error: 'Report not found' });
    }

    const [report]: any = await connection.query('SELECT * FROM reports WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(report[0]);
  } catch (error: any) {
    console.error('[REPORTS PUT] Error:', error);
    res.status(500).json({ error: 'Failed to update report', details: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('DELETE FROM reports WHERE id = ?', [req.params.id]);
    connection.release();

    if ((result[0] as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ message: 'Report deleted successfully' });
  } catch (error: any) {
    console.error('[REPORTS DELETE] Error:', error);
    res.status(500).json({ error: 'Failed to delete report', details: error.message });
  }
});

export default router;
