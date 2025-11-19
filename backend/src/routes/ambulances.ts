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
      whereClause += ' AND (name LIKE ? OR registrationNumber LIKE ? OR driverName LIKE ?)';
      const searchTerm = `%${String(search)}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const connection = await pool.getConnection();
    
    const dataParams = [...params, Number(limit), skip];
    const query = `SELECT * FROM ambulances WHERE ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    const [ambulances]: any = await connection.query(query, dataParams);
    
    const countSql = `SELECT COUNT(*) as total FROM ambulances WHERE ${whereClause}`;
    const result: any = await connection.query(countSql, params);
    const total = result[0][0].total;
    
    connection.release();

    res.json({ ambulances, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ambulances' });
  }
});

router.get('/:id', async (req: any, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [ambulances]: any = await connection.query('SELECT * FROM ambulances WHERE id = ?', [req.params.id]);
    connection.release();

    if (ambulances.length === 0) {
      return res.status(404).json({ error: 'Ambulance not found' });
    }

    res.json(ambulances[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ambulance' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, registrationNumber, driverName, driverPhone, status, location } = req.body;

    const connection = await pool.getConnection();
    
    const query = `INSERT INTO ambulances (id, name, registrationNumber, driverName, driverPhone, status, location, createdAt, updatedAt)
                   VALUES (UUID(), ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    
    await connection.query(query, [name, registrationNumber, driverName, driverPhone, status || 'available', location]);

    const [ambulance]: any = await connection.query('SELECT * FROM ambulances WHERE registrationNumber = ? ORDER BY createdAt DESC LIMIT 1', [registrationNumber]);
    connection.release();

    res.status(201).json(ambulance[0]);
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Registration number already exists' });
    }
    res.status(500).json({ error: 'Failed to create ambulance' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, registrationNumber, driverName, driverPhone, status, location } = req.body;
    const connection = await pool.getConnection();
    
    const updates: string[] = [];
    const values: any[] = [];

    if (name) { updates.push('name = ?'); values.push(name); }
    if (registrationNumber) { updates.push('registrationNumber = ?'); values.push(registrationNumber); }
    if (driverName) { updates.push('driverName = ?'); values.push(driverName); }
    if (driverPhone) { updates.push('driverPhone = ?'); values.push(driverPhone); }
    if (status) { updates.push('status = ?'); values.push(status); }
    if (location) { updates.push('location = ?'); values.push(location); }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updatedAt = NOW()');
    values.push(req.params.id);

    const query = `UPDATE ambulances SET ${updates.join(', ')} WHERE id = ?`;
    const result = await connection.query(query, values);
    
    if ((result[0] as any).affectedRows === 0) {
      connection.release();
      return res.status(404).json({ error: 'Ambulance not found' });
    }

    const [ambulance]: any = await connection.query('SELECT * FROM ambulances WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(ambulance[0]);
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Registration number already exists' });
    }
    res.status(500).json({ error: 'Failed to update ambulance' });
  }
});

router.patch('/:id/status', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const connection = await pool.getConnection();
    await connection.query('UPDATE ambulances SET status = ?, updatedAt = NOW() WHERE id = ?', [status, req.params.id]);
    const [ambulance]: any = await connection.query('SELECT * FROM ambulances WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(ambulance[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ambulance status' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('DELETE FROM ambulances WHERE id = ?', [req.params.id]);
    connection.release();

    if ((result[0] as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Ambulance not found' });
    }

    res.json({ message: 'Ambulance deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete ambulance' });
  }
});

export default router;
