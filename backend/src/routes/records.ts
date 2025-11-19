import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query = 'SELECT * FROM records WHERE 1=1';
    const params: any[] = [];

    if (type) {
      query += ' AND type = ?';
      params.push(String(type));
    }

    const countParams = params.slice();
    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), skip);

    const connection = await pool.getConnection();
    
    const [records]: any = await connection.query(query, params);
    
    let countSql = 'SELECT COUNT(*) as total FROM records WHERE 1=1';
    if (type) {
      countSql += ' AND type = ?';
    }
    
    const result: any = await connection.query(countSql, countParams);
    const total = result[0][0].total;
    
    connection.release();

    res.json({ records, total, page: Number(page), limit: Number(limit) });
  } catch (error: any) {
    console.error('[RECORDS GET] Error:', error);
    res.status(500).json({ error: 'Failed to fetch records', details: error.message });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [records]: any = await connection.query('SELECT * FROM records WHERE id = ?', [req.params.id]);
    connection.release();

    if (records.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json(records[0]);
  } catch (error: any) {
    console.error('[RECORDS GET BY ID] Error:', error);
    res.status(500).json({ error: 'Failed to fetch record', details: error.message });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { type, patientName, date, details, status } = req.body;

    if (!type || !patientName || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await pool.getConnection();
    
    const query = `INSERT INTO records (id, type, patientName, date, details, status, createdAt, updatedAt)
                   VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), NOW())`;
    
    await connection.query(query, [type, patientName, new Date(date), details || null, status || 'Active']);

    const [record]: any = await connection.query('SELECT * FROM records WHERE patientName = ? ORDER BY createdAt DESC LIMIT 1', [patientName]);
    connection.release();

    res.status(201).json(record[0]);
  } catch (error: any) {
    console.error('[RECORDS POST] Error:', error);
    res.status(500).json({ error: 'Failed to create record', details: error.message });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { type, patientName, date, details, status } = req.body;
    const connection = await pool.getConnection();
    
    const updates: string[] = [];
    const values: any[] = [];

    if (type) { updates.push('type = ?'); values.push(type); }
    if (patientName) { updates.push('patientName = ?'); values.push(patientName); }
    if (date) { updates.push('date = ?'); values.push(new Date(date)); }
    if (details !== undefined) { updates.push('details = ?'); values.push(details); }
    if (status) { updates.push('status = ?'); values.push(status); }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updatedAt = NOW()');
    values.push(req.params.id);

    const query = `UPDATE records SET ${updates.join(', ')} WHERE id = ?`;
    const result = await connection.query(query, values);
    
    if ((result[0] as any).affectedRows === 0) {
      connection.release();
      return res.status(404).json({ error: 'Record not found' });
    }

    const [record]: any = await connection.query('SELECT * FROM records WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(record[0]);
  } catch (error: any) {
    console.error('[RECORDS PUT] Error:', error);
    res.status(500).json({ error: 'Failed to update record', details: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('DELETE FROM records WHERE id = ?', [req.params.id]);
    connection.release();

    if ((result[0] as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ message: 'Record deleted successfully' });
  } catch (error: any) {
    console.error('[RECORDS DELETE] Error:', error);
    res.status(500).json({ error: 'Failed to delete record', details: error.message });
  }
});

router.patch('/:id/status', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const connection = await pool.getConnection();
    const result = await connection.query('UPDATE records SET status = ?, updatedAt = NOW() WHERE id = ?', [status, req.params.id]);
    
    if ((result[0] as any).affectedRows === 0) {
      connection.release();
      return res.status(404).json({ error: 'Record not found' });
    }

    const [record]: any = await connection.query('SELECT * FROM records WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(record[0]);
  } catch (error: any) {
    console.error('[RECORDS PATCH STATUS] Error:', error);
    res.status(500).json({ error: 'Failed to update record status', details: error.message });
  }
});

export default router;
