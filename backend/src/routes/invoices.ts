import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, status, patientId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query = 'SELECT * FROM invoices WHERE 1=1';
    const params: any[] = [];

    if (status) {
      query += ' AND status = ?';
      params.push(String(status));
    }

    if (patientId) {
      query += ' AND patientId = ?';
      params.push(String(patientId));
    }

    let countQuery = query;
    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), skip);

    const connection = await pool.getConnection();
    
    const [invoices]: any = await connection.query(query, params);
    const countParams = params.slice(0, params.length - 2);
    const countSql = `SELECT COUNT(*) as total FROM invoices WHERE 1=1` + countQuery.substring(countQuery.indexOf('WHERE')).replace('ORDER BY createdAt DESC LIMIT ? OFFSET ?', '');
    const result: any = await connection.query(countSql, countParams);
    const total = result[0][0].total;
    
    connection.release();

    res.json({ invoices, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [invoices]: any = await connection.query('SELECT * FROM invoices WHERE id = ?', [req.params.id]);
    connection.release();

    if (invoices.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(invoices[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { patientId, amount, status, dueDate, notes } = req.body;

    const connection = await pool.getConnection();
    const query = `INSERT INTO Invoice (id, patientId, amount, status, dueDate, notes, createdAt, updatedAt)
                   VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), NOW())`;
    
    await connection.query(query, [patientId, parseFloat(amount), status || 'pending', dueDate ? new Date(dueDate) : null, notes]);

    const [invoice]: any = await connection.query('SELECT * FROM invoices WHERE patientId = ? ORDER BY createdAt DESC LIMIT 1', [patientId]);
    connection.release();

    res.status(201).json(invoice[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { amount, status, dueDate, notes } = req.body;
    const connection = await pool.getConnection();
    
    const updates: string[] = [];
    const values: any[] = [];

    if (amount !== undefined) { updates.push('amount = ?'); values.push(parseFloat(amount)); }
    if (status) { updates.push('status = ?'); values.push(status); }
    if (dueDate) { updates.push('dueDate = ?'); values.push(new Date(dueDate)); }
    if (notes !== undefined) { updates.push('notes = ?'); values.push(notes); }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updatedAt = NOW()');
    values.push(req.params.id);

    const query = `UPDATE invoices SET ${updates.join(', ')} WHERE id = ?`;
    await connection.query(query, values);
    
    const [invoice]: any = await connection.query('SELECT * FROM invoices WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(invoice[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM invoices WHERE id = ?', [req.params.id]);
    connection.release();

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

export default router;
