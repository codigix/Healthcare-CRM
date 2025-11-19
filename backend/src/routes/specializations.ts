import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let whereClause = '1=1';
    const params: any[] = [];

    if (search) {
      whereClause += ' AND (name LIKE ? OR description LIKE ? OR department LIKE ?)';
      const searchTerm = `%${String(search)}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const query = `SELECT * FROM Specialization WHERE ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    const queryParams = [...params, Number(limit), skip];

    const connection = await pool.getConnection();
    
    const [specializations]: any = await connection.query(query, queryParams);
    const countSql = `SELECT COUNT(*) as total FROM Specialization WHERE ${whereClause}`;
    const [countResult]: any = await connection.query(countSql, params);
    const total = countResult[0].total;
    
    connection.release();

    res.json({ specializations, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error('Specializations fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch specializations' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [specializations]: any = await connection.query('SELECT * FROM Specialization WHERE id = ?', [req.params.id]);
    connection.release();

    if (specializations.length === 0) {
      return res.status(404).json({ error: 'Specialization not found' });
    }

    res.json(specializations[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch specialization' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, department, doctorCount = 0, status = 'active' } = req.body;

    if (!name || !department) {
      return res.status(400).json({ error: 'Name and department are required' });
    }

    const connection = await pool.getConnection();
    
    const query = `INSERT INTO Specialization (id, name, description, department, doctorCount, status, createdAt, updatedAt)
                   VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), NOW())`;
    
    await connection.query(query, [name, description || null, department, Number(doctorCount), status]);

    const [specialization]: any = await connection.query('SELECT * FROM Specialization WHERE name = ? ORDER BY createdAt DESC LIMIT 1', [name]);
    connection.release();

    res.status(201).json(specialization[0]);
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Specialization name already exists' });
    }
    res.status(500).json({ error: 'Failed to create specialization' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, department, doctorCount, status } = req.body;

    if (!name || !department) {
      return res.status(400).json({ error: 'Name and department are required' });
    }

    const connection = await pool.getConnection();
    
    const updates: string[] = [];
    const values: any[] = [];

    if (name) { updates.push('name = ?'); values.push(name); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (department) { updates.push('department = ?'); values.push(department); }
    if (doctorCount !== undefined) { updates.push('doctorCount = ?'); values.push(Number(doctorCount)); }
    if (status) { updates.push('status = ?'); values.push(status); }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updatedAt = NOW()');
    values.push(req.params.id);

    const query = `UPDATE Specialization SET ${updates.join(', ')} WHERE id = ?`;
    const result = await connection.query(query, values);
    
    if ((result[0] as any).affectedRows === 0) {
      connection.release();
      return res.status(404).json({ error: 'Specialization not found' });
    }

    const [specialization]: any = await connection.query('SELECT * FROM Specialization WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(specialization[0]);
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Specialization name already exists' });
    }
    res.status(500).json({ error: 'Failed to update specialization' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('DELETE FROM Specialization WHERE id = ?', [req.params.id]);
    connection.release();

    if ((result[0] as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Specialization not found' });
    }

    res.json({ message: 'Specialization deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete specialization' });
  }
});

export default router;
