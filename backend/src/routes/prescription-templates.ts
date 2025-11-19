import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search, filter } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    let whereClause = '1=1';
    const params: any[] = [];
    
    if (search && String(search).trim()) {
      whereClause += ' AND (name LIKE ?)';
      const searchTerm = `%${String(search)}%`;
      params.push(searchTerm);
    }

    const connection = await pool.getConnection();
    const dataParams = [...params, Number(limit), skip];
    const query = `SELECT * FROM prescription_templates WHERE ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    const [templates]: any = await connection.query(query, dataParams);
    
    const countSql = `SELECT COUNT(*) as total FROM prescription_templates WHERE ${whereClause}`;
    const [countResult]: any = await connection.query(countSql, params);
    const total = countResult[0].total;
    
    connection.release();
    res.json({ templates, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [templates]: any = await connection.query('SELECT * FROM prescription_templates WHERE id = ?', [req.params.id]);
    connection.release();
    res.json(templates[0] || { error: 'Not found' });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, medicines } = req.body;
    const connection = await pool.getConnection();
    await connection.query(`UPDATE prescription_templates SET name = ?, category = ?, medications = ?, updatedAt = NOW() WHERE id = ?`, 
      [name, category, JSON.stringify(medicines), req.params.id]);
    const [template]: any = await connection.query('SELECT * FROM prescription_templates WHERE id = ?', [req.params.id]);
    connection.release();
    res.json(template[0]);
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: 'Failed to update template' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, medicines } = req.body;
    const connection = await pool.getConnection();
    const query = `INSERT INTO prescription_templates (id, name, category, medications, createdBy, createdAt, updatedAt)
                   VALUES (UUID(), ?, ?, ?, ?, NOW(), NOW())`;
    await connection.query(query, [name, category, JSON.stringify(medicines), req.user!.id]);
    const [template]: any = await connection.query('SELECT * FROM prescription_templates WHERE name = ? ORDER BY createdAt DESC LIMIT 1', [name]);
    connection.release();
    res.status(201).json(template[0]);
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
});

router.post('/:id/use', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [template]: any = await connection.query('SELECT * FROM prescription_templates WHERE id = ?', [req.params.id]);
    if (!template[0]) {
      connection.release();
      return res.status(404).json({ error: 'Template not found' });
    }
    connection.release();
    res.json({ message: 'Template usage recorded', template: template[0] });
  } catch (error) {
    console.error('Error using template:', error);
    res.status(500).json({ error: 'Failed to use template' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM prescription_templates WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Template deleted' });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

export default router;
