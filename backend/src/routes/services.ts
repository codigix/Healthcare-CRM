import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, status, search, departmentId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let whereClause = '';
    const params: any[] = [];

    if (status) {
      whereClause += ' AND status = ?';
      params.push(String(status));
    }

    if (departmentId) {
      whereClause += ' AND departmentId = ?';
      params.push(String(departmentId));
    }

    if (search) {
      whereClause += ' AND (name LIKE ? OR description LIKE ? OR type LIKE ?)';
      const searchTerm = `%${String(search)}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const countParams = [...params];
    const countSql = `SELECT COUNT(*) as total FROM services WHERE 1=1${whereClause}`;
    
    const query = `SELECT * FROM services WHERE 1=1${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), skip);

    const connection = await pool.getConnection();
    
    const [countResult]: any = await connection.query(countSql, countParams);
    const total = countResult[0].total;
    
    const [services]: any = await connection.query(query, params);
    
    connection.release();

    res.json({ services, total, page: Number(page), limit: Number(limit) });
  } catch (error: any) {
    console.error('[SERVICES GET] Error:', error);
    res.status(500).json({ error: 'Failed to fetch services', details: error.message });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.query('SELECT * FROM services WHERE id = ?', [req.params.id]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(rows[0]);
  } catch (error: any) {
    console.error('[SERVICES GET BY ID] Error:', error);
    res.status(500).json({ error: 'Failed to fetch service', details: error.message });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      departmentId,
      type,
      duration,
      price,
      description,
      status,
    } = req.body;

    if (!name || !departmentId || !type || !duration || !price) {
      return res.status(400).json({ error: 'Missing required fields: name, departmentId, type, duration, price' });
    }

    const connection = await pool.getConnection();
    
    const query = `INSERT INTO services (
      id, name, departmentId, type, duration, price, description, status, createdAt, updatedAt
    ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

    await connection.query(query, [
      name,
      departmentId,
      type,
      Number(duration),
      Number(price),
      description || null,
      status || 'Active',
    ]);

    const [result]: any = await connection.query('SELECT * FROM services WHERE name = ? ORDER BY createdAt DESC LIMIT 1', [name]);
    connection.release();

    res.status(201).json(result[0]);
  } catch (error: any) {
    console.error('[SERVICES POST] Error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Service name already exists' });
    }
    res.status(500).json({ error: 'Failed to create service', details: error.message });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      type,
      duration,
      price,
      description,
      status,
    } = req.body;

    const connection = await pool.getConnection();
    
    const updates: string[] = [];
    const values: any[] = [];

    if (name) { updates.push('name = ?'); values.push(name); }
    if (type) { updates.push('type = ?'); values.push(type); }
    if (duration !== undefined) { updates.push('duration = ?'); values.push(Number(duration)); }
    if (price !== undefined) { updates.push('price = ?'); values.push(Number(price)); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (status) { updates.push('status = ?'); values.push(status); }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updatedAt = NOW()');
    values.push(req.params.id);

    const query = `UPDATE services SET ${updates.join(', ')} WHERE id = ?`;
    const result = await connection.query(query, values);
    
    if ((result[0] as any).affectedRows === 0) {
      connection.release();
      return res.status(404).json({ error: 'Service not found' });
    }

    const [service]: any = await connection.query('SELECT * FROM services WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(service[0]);
  } catch (error: any) {
    console.error('[SERVICES PUT] Error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Service name already exists' });
    }
    res.status(500).json({ error: 'Failed to update service', details: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('DELETE FROM services WHERE id = ?', [req.params.id]);
    connection.release();

    if ((result[0] as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error: any) {
    console.error('[SERVICES DELETE] Error:', error);
    res.status(500).json({ error: 'Failed to delete service', details: error.message });
  }
});

export default router;
