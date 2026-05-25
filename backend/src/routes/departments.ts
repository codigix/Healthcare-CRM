import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query = `SELECT d.*, 
                 (SELECT COUNT(*) FROM doctors WHERE departmentId = d.id) as doctorsCount,
                 (SELECT COUNT(*) FROM appointments a JOIN doctors doc ON a.doctorId = doc.id WHERE doc.departmentId = d.id AND DATE(a.date) = CURRENT_DATE()) as appointmentsToday
                 FROM departments d WHERE 1=1`;
    const params: any[] = [];

    if (status) {
      query += ' AND d.status = ?';
      params.push(String(status));
    }

    if (search) {
      query += ' AND (d.name LIKE ? OR d.head LIKE ?)';
      const searchTerm = `%${String(search)}%`;
      params.push(searchTerm, searchTerm);
    }

    const countParams = params.slice();
    query += ' ORDER BY d.createdAt DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), skip);

    const connection = await pool.getConnection();
    
    const [departments]: any = await connection.query(query, params);
    
    let countSql = 'SELECT COUNT(*) as total FROM departments WHERE 1=1';
    if (status) {
      countSql += ' AND status = ?';
    }
    if (search) {
      countSql += ' AND (name LIKE ? OR head LIKE ?)';
    }
    
    const result: any = await connection.query(countSql, countParams);
    const total = result[0][0].total;
    
    connection.release();

    res.json({ departments, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error('[DEPARTMENTS GET] Error:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [departments]: any = await connection.query('SELECT * FROM departments WHERE id = ?', [req.params.id]);
    
    if (departments.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Department not found' });
    }

    // Fetch assigned doctor IDs
    const [doctors]: any = await connection.query('SELECT id FROM doctors WHERE departmentId = ?', [req.params.id]);
    connection.release();

    const department = departments[0];
    department.assignedDoctors = doctors.map((doc: any) => doc.id);

    res.json(department);
  } catch (error) {
    console.error('[DEPARTMENTS GET BY ID] Error:', error);
    res.status(500).json({ error: 'Failed to fetch department' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, head, status, description, assignedDoctors = [] } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Missing required field: name' });
    }

    const connection = await pool.getConnection();
    
    const deptId = require('uuid').v4();
    const staffCount = assignedDoctors.length;
    
    const query = `INSERT INTO departments (id, name, head, location, staffCount, services, status, description, createdAt, updatedAt)
                   VALUES (?, ?, ?, NULL, ?, 0, ?, ?, NOW(), NOW())`;
    
    await connection.query(query, [deptId, name, head || '', staffCount, status || 'Active', description || null]);

    // Update doctor assignments
    if (assignedDoctors.length > 0) {
      await connection.query('UPDATE doctors SET departmentId = ? WHERE id IN (?)', [deptId, assignedDoctors]);
    }

    const [department]: any = await connection.query('SELECT * FROM departments WHERE id = ?', [deptId]);
    connection.release();

    res.status(201).json(department[0]);
  } catch (error: any) {
    console.error('[DEPARTMENTS POST] Error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Department name already exists' });
    }
    res.status(500).json({ error: 'Failed to create department' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, head, status, description, assignedDoctors } = req.body;
    const connection = await pool.getConnection();
    
    const updates: string[] = [];
    const values: any[] = [];

    if (name) { updates.push('name = ?'); values.push(name); }
    if (head !== undefined) { updates.push('head = ?'); values.push(head); }
    if (status) { updates.push('status = ?'); values.push(status); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    
    if (assignedDoctors !== undefined) {
      updates.push('staffCount = ?');
      values.push(assignedDoctors.length);
    }

    if (updates.length > 0) {
      updates.push('updatedAt = NOW()');
      values.push(req.params.id);

      const query = `UPDATE departments SET ${updates.join(', ')} WHERE id = ?`;
      await connection.query(query, values);
    }

    // Handle doctor assignment updates
    if (assignedDoctors !== undefined) {
      // 1. Reset previous doctors assigned to this department
      await connection.query('UPDATE doctors SET departmentId = NULL WHERE departmentId = ?', [req.params.id]);

      // 2. Assign the new doctors
      if (assignedDoctors.length > 0) {
        await connection.query('UPDATE doctors SET departmentId = ? WHERE id IN (?)', [req.params.id, assignedDoctors]);
      }
    }

    const [department]: any = await connection.query('SELECT * FROM departments WHERE id = ?', [req.params.id]);
    connection.release();

    if (department.length === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json(department[0]);
  } catch (error: any) {
    console.error('[DEPARTMENTS PUT] Error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Department name already exists' });
    }
    res.status(500).json({ error: 'Failed to update department' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    
    // Reset any doctors assigned to this department
    await connection.query('UPDATE doctors SET departmentId = NULL WHERE departmentId = ?', [req.params.id]);
    
    const result = await connection.query('DELETE FROM departments WHERE id = ?', [req.params.id]);
    connection.release();

    if ((result[0] as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json({ message: 'Department deleted successfully' });
  } catch (error: any) {
    console.error('[DEPARTMENTS DELETE] Error:', error);
    res.status(500).json({ error: 'Failed to delete department' });
  }
});

router.get('/doctors/list', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { departmentId } = req.query;
    const connection = await pool.getConnection();
    
    let query = 'SELECT id, name, specialization, email, departmentId FROM doctors';
    const params: any[] = [];
    
    if (departmentId) {
      query += ' WHERE departmentId = ?';
      params.push(String(departmentId));
    }
    
    query += ' ORDER BY name ASC';
    
    const [doctors]: any = await connection.query(query, params);
    connection.release();
    res.json(doctors);
  } catch (error) {
    console.error('[DEPARTMENTS DOCTORS LIST] Error:', error);
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
    console.error('[DEPARTMENTS STATS] Error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
