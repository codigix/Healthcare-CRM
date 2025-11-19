import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query = 'SELECT * FROM departments WHERE 1=1';
    const params: any[] = [];

    if (status) {
      query += ' AND status = ?';
      params.push(String(status));
    }

    if (search) {
      query += ' AND (name LIKE ? OR head LIKE ?)';
      const searchTerm = `%${String(search)}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), skip);

    const connection = await pool.getConnection();
    
    const [departments]: any = await connection.query(query, params);
    const countParams = params.slice(0, params.length - 2);
    const countSql = 'SELECT COUNT(*) as total FROM departments WHERE 1=1' + query.substring(query.indexOf('WHERE') + 5, query.indexOf('ORDER BY'));
    const [countResult]: any = await connection.query(countSql, countParams);
    const total = countResult[0].total;
    
    connection.release();

    res.json({ departments, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [departments]: any = await connection.query('SELECT * FROM departments WHERE id = ?', [req.params.id]);
    connection.release();

    if (departments.length === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json(departments[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch department' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, head, location, staffCount, services, status, description } = req.body;

    if (!name || !head || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await pool.getConnection();
    
    const query = `INSERT INTO departments (id, name, head, location, staffCount, services, status, description, createdAt, updatedAt)
                   VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    
    await connection.query(query, [name, head, location, staffCount || 0, services || 0, status || 'Active', description || null]);

    const [department]: any = await connection.query('SELECT * FROM departments WHERE name = ? ORDER BY createdAt DESC LIMIT 1', [name]);
    connection.release();

    res.status(201).json(department[0]);
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Department name already exists' });
    }
    res.status(500).json({ error: 'Failed to create department' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, head, location, staffCount, services, status, description } = req.body;
    const connection = await pool.getConnection();
    
    const updates: string[] = [];
    const values: any[] = [];

    if (name) { updates.push('name = ?'); values.push(name); }
    if (head) { updates.push('head = ?'); values.push(head); }
    if (location) { updates.push('location = ?'); values.push(location); }
    if (staffCount !== undefined) { updates.push('staffCount = ?'); values.push(staffCount); }
    if (services !== undefined) { updates.push('services = ?'); values.push(services); }
    if (status) { updates.push('status = ?'); values.push(status); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updatedAt = NOW()');
    values.push(req.params.id);

    const query = `UPDATE departments SET ${updates.join(', ')} WHERE id = ?`;
    const result = await connection.query(query, values);
    
    if ((result[0] as any).affectedRows === 0) {
      connection.release();
      return res.status(404).json({ error: 'Department not found' });
    }

    const [department]: any = await connection.query('SELECT * FROM departments WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(department[0]);
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Department name already exists' });
    }
    res.status(500).json({ error: 'Failed to update department' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('DELETE FROM departments WHERE id = ?', [req.params.id]);
    connection.release();

    if ((result[0] as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json({ message: 'Department deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete department' });
  }
});

router.get('/doctors/list', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [doctors]: any = await connection.query('SELECT id, name, specialization, email FROM doctors ORDER BY name ASC');
    connection.release();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

router.get('/statistics/summary', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const result1: any = await connection.query('SELECT COUNT(*) as totalDepartments FROM departments');
    const totalDepartments = result1[0][0].totalDepartments;
    const result2: any = await connection.query('SELECT COUNT(*) as activeDepartments FROM departments WHERE status = "Active"');
    const activeDepartments = result2[0][0].activeDepartments;
    const result3: any = await connection.query('SELECT COALESCE(SUM(staffCount), 0) as totalStaff FROM departments');
    const totalStaff = result3[0][0].totalStaff;
    const result4: any = await connection.query('SELECT COALESCE(SUM(services), 0) as totalServices FROM departments');
    const totalServices = result4[0][0].totalServices;
    connection.release();

    res.json({
      totalDepartments,
      activeDepartments,
      totalStaff,
      totalServices,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
