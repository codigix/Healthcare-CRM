import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, status, search, category } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query = 'SELECT * FROM Supplier WHERE 1=1';
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
      query += ' AND (name LIKE ? OR contact LIKE ? OR email LIKE ? OR category LIKE ?)';
      const searchTerm = `%${String(search)}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    let countQuery = query;
    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), skip);

    const connection = await pool.getConnection();
    
    const [suppliers]: any = await connection.query(query, params);
    const countParams = params.slice(0, params.length - 2);
    const countSql = `SELECT COUNT(*) as total FROM Supplier WHERE 1=1` + countQuery.substring(countQuery.indexOf('WHERE')).replace('ORDER BY createdAt DESC LIMIT ? OFFSET ?', '');
    const result: any = await connection.query(countSql, countParams);
    const total = result[0][0].total;
    
    connection.release();

    res.json({ suppliers, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.query('SELECT * FROM Supplier WHERE id = ?', [req.params.id]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch supplier' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      category,
      contact,
      email,
      phone,
      location,
      rating,
      status,
      description,
      contactPerson,
    } = req.body;

    if (!name || !category || !contact || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await pool.getConnection();
    
    const query = `INSERT INTO Supplier (
      id, name, category, contact, email, phone, location, rating, status, description, contactPerson, createdAt, updatedAt
    ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

    await connection.query(query, [
      name,
      category,
      contact,
      email,
      phone || null,
      location || null,
      rating ? Number(rating) : 0,
      status || 'Active',
      description || null,
      contactPerson || null,
    ]);

    const [result]: any = await connection.query('SELECT * FROM Supplier WHERE name = ? ORDER BY createdAt DESC LIMIT 1', [name]);
    connection.release();

    res.status(201).json(result[0]);
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Supplier name already exists' });
    }
    res.status(500).json({ error: 'Failed to create supplier' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      category,
      contact,
      email,
      phone,
      location,
      rating,
      status,
      description,
      contactPerson,
    } = req.body;

    const connection = await pool.getConnection();
    
    const updates: string[] = [];
    const values: any[] = [];

    if (name) { updates.push('name = ?'); values.push(name); }
    if (category) { updates.push('category = ?'); values.push(category); }
    if (contact) { updates.push('contact = ?'); values.push(contact); }
    if (email) { updates.push('email = ?'); values.push(email); }
    if (phone !== undefined) { updates.push('phone = ?'); values.push(phone); }
    if (location !== undefined) { updates.push('location = ?'); values.push(location); }
    if (rating !== undefined) { updates.push('rating = ?'); values.push(Number(rating)); }
    if (status) { updates.push('status = ?'); values.push(status); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (contactPerson !== undefined) { updates.push('contactPerson = ?'); values.push(contactPerson); }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updatedAt = NOW()');
    values.push(req.params.id);

    const query = `UPDATE Supplier SET ${updates.join(', ')} WHERE id = ?`;
    const result = await connection.query(query, values);
    
    if ((result[0] as any).affectedRows === 0) {
      connection.release();
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const [supplier]: any = await connection.query('SELECT * FROM Supplier WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(supplier[0]);
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Supplier name already exists' });
    }
    res.status(500).json({ error: 'Failed to update supplier' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('DELETE FROM Supplier WHERE id = ?', [req.params.id]);
    connection.release();

    if ((result[0] as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json({ message: 'Supplier deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete supplier' });
  }
});

export default router;
