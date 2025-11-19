import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, status, search, category } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query = 'SELECT * FROM InventoryAlert WHERE 1=1';
    const params: any[] = [];

    if (status) {
      query += ' AND status = ?';
      params.push(String(status));
    }

    if (category) {
      query += ' AND category = ?';
      params.push(String(category));
    }

    if (search) {
      query += ' AND (name LIKE ? OR medicineId LIKE ? OR category LIKE ?)';
      const searchTerm = `%${String(search)}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    let countQuery = query;
    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), skip);

    const connection = await pool.getConnection();
    
    const [alerts]: any = await connection.query(query, params);
    const countParams = params.slice(0, params.length - 2);
    const countSql = `SELECT COUNT(*) as total FROM InventoryAlert WHERE 1=1` + countQuery.substring(countQuery.indexOf('WHERE')).replace('ORDER BY createdAt DESC LIMIT ? OFFSET ?', '');
    const result: any = await connection.query(countSql, countParams);
    const total = result[0][0].total;
    
    connection.release();

    res.json({ alerts, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory alerts' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.query('SELECT * FROM InventoryAlert WHERE id = ?', [req.params.id]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alert' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      medicineId,
      name,
      category,
      currentStock,
      minLevel,
      status,
      supplier,
    } = req.body;

    if (!medicineId || !name || !category || currentStock === undefined || minLevel === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await pool.getConnection();
    
    const query = `INSERT INTO InventoryAlert (
      id, medicineId, name, category, currentStock, minLevel, status, supplier, createdAt, updatedAt
    ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

    await connection.query(query, [
      medicineId,
      name,
      category,
      Number(currentStock),
      Number(minLevel),
      status || 'Low Stock',
      supplier || null,
    ]);

    const [result]: any = await connection.query('SELECT * FROM InventoryAlert WHERE medicineId = ? ORDER BY createdAt DESC LIMIT 1', [medicineId]);
    connection.release();

    res.status(201).json(result[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      category,
      currentStock,
      minLevel,
      status,
      supplier,
    } = req.body;

    const connection = await pool.getConnection();
    
    const updates: string[] = [];
    const values: any[] = [];

    if (name) { updates.push('name = ?'); values.push(name); }
    if (category) { updates.push('category = ?'); values.push(category); }
    if (currentStock !== undefined) { updates.push('currentStock = ?'); values.push(Number(currentStock)); }
    if (minLevel !== undefined) { updates.push('minLevel = ?'); values.push(Number(minLevel)); }
    if (status) { updates.push('status = ?'); values.push(status); }
    if (supplier !== undefined) { updates.push('supplier = ?'); values.push(supplier); }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updatedAt = NOW()');
    values.push(req.params.id);

    const query = `UPDATE InventoryAlert SET ${updates.join(', ')} WHERE id = ?`;
    const result = await connection.query(query, values);
    
    if ((result[0] as any).affectedRows === 0) {
      connection.release();
      return res.status(404).json({ error: 'Alert not found' });
    }

    const [alert]: any = await connection.query('SELECT * FROM InventoryAlert WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(alert[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update alert' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('DELETE FROM InventoryAlert WHERE id = ?', [req.params.id]);
    connection.release();

    if ((result[0] as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({ message: 'Alert deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});

export default router;
