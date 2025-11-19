import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/', async (req: any, res: Response) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let whereClause = '1=1';
    const params: any[] = [];

    if (search) {
      whereClause += ' AND (patientName LIKE ? OR location LIKE ? OR emergencyType LIKE ?)';
      const searchTerm = `%${String(search)}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const connection = await pool.getConnection();
    
    const dataParams = [...params, Number(limit), skip];
    const query = `SELECT * FROM emergency_calls WHERE ${whereClause} ORDER BY callTime DESC LIMIT ? OFFSET ?`;
    const [emergencyCalls]: any = await connection.query(query, dataParams);
    
    const countSql = `SELECT COUNT(*) as total FROM emergency_calls WHERE ${whereClause}`;
    const result: any = await connection.query(countSql, params);
    const total = result[0][0].total;
    
    connection.release();

    res.json({ emergencyCalls, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error('Error fetching emergency calls:', error);
    res.status(500).json({ error: 'Failed to fetch emergency calls' });
  }
});

router.get('/:id', async (req: any, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [calls]: any = await connection.query('SELECT * FROM emergency_calls WHERE id = ?', [req.params.id]);
    connection.release();

    if (calls.length === 0) {
      return res.status(404).json({ error: 'Emergency call not found' });
    }

    res.json(calls[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch emergency call' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { patientName, phone, location, emergencyType, priority, status, callTime, notes } = req.body;

    const connection = await pool.getConnection();
    const query = `INSERT INTO emergency_calls (id, patientName, phone, location, emergencyType, priority, status, callTime, notes, createdAt, updatedAt)
                   VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    
    await connection.query(query, [patientName, phone, location, emergencyType, priority || 'High', status || 'Pending', callTime ? new Date(callTime) : new Date(), notes]);

    const [call]: any = await connection.query('SELECT * FROM emergency_calls WHERE phone = ? ORDER BY createdAt DESC LIMIT 1', [phone]);
    connection.release();

    res.status(201).json(call[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create emergency call' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status, priority, notes } = req.body;
    const connection = await pool.getConnection();
    
    const updates: string[] = [];
    const values: any[] = [];

    if (status) { updates.push('status = ?'); values.push(status); }
    if (priority) { updates.push('priority = ?'); values.push(priority); }
    if (notes !== undefined) { updates.push('notes = ?'); values.push(notes); }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updatedAt = NOW()');
    values.push(req.params.id);

    const query = `UPDATE emergency_calls SET ${updates.join(', ')} WHERE id = ?`;
    await connection.query(query, values);
    
    const [call]: any = await connection.query('SELECT * FROM emergency_calls WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(call[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update emergency call' });
  }
});

router.patch('/:id/status', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const connection = await pool.getConnection();
    
    if (!status) {
      connection.release();
      return res.status(400).json({ error: 'Status is required' });
    }

    const query = `UPDATE emergency_calls SET status = ?, updatedAt = NOW() WHERE id = ?`;
    const result = await connection.query(query, [status, req.params.id]);
    
    if ((result[0] as any).affectedRows === 0) {
      connection.release();
      return res.status(404).json({ error: 'Emergency call not found' });
    }
    
    const [call]: any = await connection.query('SELECT * FROM emergency_calls WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(call[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update emergency call status' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM emergency_calls WHERE id = ?', [req.params.id]);
    connection.release();

    res.json({ message: 'Emergency call deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete emergency call' });
  }
});

export default router;
