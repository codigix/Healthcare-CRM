import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, status, search, category } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query = 'SELECT * FROM inventory_items WHERE 1=1';
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
      query += ' AND (name LIKE ? OR category LIKE ?)';
      const searchTerm = `%${String(search)}%`;
      params.push(searchTerm, searchTerm);
    }

    const countParams = params.slice();
    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), skip);

    const connection = await pool.getConnection();
    
    const [items]: any = await connection.query(query, params);
    
    let countQuery = 'SELECT COUNT(*) as total FROM inventory_items WHERE 1=1';
    if (status) {
      countQuery += ' AND status = ?';
    }
    if (category) {
      countQuery += ' AND category = ?';
    }
    if (search) {
      countQuery += ' AND (name LIKE ? OR category LIKE ?)';
    }
    
    const result: any = await connection.query(countQuery, countParams);
    const total = result[0][0].total;
    
    connection.release();

    res.json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (error: any) {
    console.error('[INVENTORY GET] Error:', error);
    res.status(500).json({ error: 'Failed to fetch inventory items', details: error.message });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.query('SELECT * FROM inventory_items WHERE id = ?', [req.params.id]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    res.json(rows[0]);
  } catch (error: any) {
    console.error('[INVENTORY GET BY ID] Error:', error);
    res.status(500).json({ error: 'Failed to fetch inventory item', details: error.message });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      category,
      description,
      unitType,
      supplier,
      purchaseDate,
      expiryDate,
      initialQuantity,
      reorderLevel,
      maximumLevel,
      purchasePrice,
      sellingPrice,
      status,
      notes,
    } = req.body;

    if (
      !name ||
      !category ||
      !unitType ||
      purchasePrice === undefined ||
      purchasePrice === null ||
      sellingPrice === undefined ||
      sellingPrice === null
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await pool.getConnection();
    
    const query = `INSERT INTO inventory_items (
      id, name, category, description, unitType, supplier, purchaseDate, expiryDate,
      initialQuantity, reorderLevel, maximumLevel, purchasePrice, sellingPrice,
      status, notes, createdAt, updatedAt
    ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

    const formattedPurchaseDate = purchaseDate ? new Date(purchaseDate).toISOString().slice(0, 19).replace('T', ' ') : null;
    const formattedExpiryDate = expiryDate ? new Date(expiryDate).toISOString().slice(0, 19).replace('T', ' ') : null;

    await connection.query(query, [
      name,
      category,
      description || null,
      unitType,
      supplier || null,
      formattedPurchaseDate,
      formattedExpiryDate,
      initialQuantity || 0,
      reorderLevel || 0,
      maximumLevel || 0,
      purchasePrice,
      sellingPrice,
      status || 'Active',
      notes || null,
    ]);

    const [result]: any = await connection.query('SELECT * FROM inventory_items WHERE name = ? ORDER BY createdAt DESC LIMIT 1', [name]);
    connection.release();

    res.status(201).json(result[0]);
  } catch (error: any) {
    console.error('[INVENTORY POST] Error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Inventory item name already exists' });
    }
    res.status(500).json({ error: 'Failed to create inventory item', details: error.message });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      category,
      description,
      unitType,
      supplier,
      purchaseDate,
      expiryDate,
      initialQuantity,
      reorderLevel,
      maximumLevel,
      purchasePrice,
      sellingPrice,
      status,
      notes,
    } = req.body;

    const connection = await pool.getConnection();
    
    const updates: string[] = [];
    const values: any[] = [];

    if (name) { updates.push('name = ?'); values.push(name); }
    if (category) { updates.push('category = ?'); values.push(category); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (unitType) { updates.push('unitType = ?'); values.push(unitType); }
    if (supplier !== undefined) { updates.push('supplier = ?'); values.push(supplier); }
    if (purchaseDate !== undefined) { 
      const formatted = purchaseDate ? new Date(purchaseDate).toISOString().slice(0, 19).replace('T', ' ') : null;
      updates.push('purchaseDate = ?'); 
      values.push(formatted); 
    }
    if (expiryDate !== undefined) { 
      const formatted = expiryDate ? new Date(expiryDate).toISOString().slice(0, 19).replace('T', ' ') : null;
      updates.push('expiryDate = ?'); 
      values.push(formatted); 
    }
    if (initialQuantity !== undefined) { updates.push('initialQuantity = ?'); values.push(Number(initialQuantity)); }
    if (reorderLevel !== undefined) { updates.push('reorderLevel = ?'); values.push(Number(reorderLevel)); }
    if (maximumLevel !== undefined) { updates.push('maximumLevel = ?'); values.push(Number(maximumLevel)); }
    if (purchasePrice !== undefined) { updates.push('purchasePrice = ?'); values.push(parseFloat(purchasePrice)); }
    if (sellingPrice !== undefined) { updates.push('sellingPrice = ?'); values.push(parseFloat(sellingPrice)); }
    if (status) { updates.push('status = ?'); values.push(status); }
    if (notes !== undefined) { updates.push('notes = ?'); values.push(notes); }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updatedAt = NOW()');
    values.push(req.params.id);

    const query = `UPDATE inventory_items SET ${updates.join(', ')} WHERE id = ?`;
    const result = await connection.query(query, values);
    
    if ((result[0] as any).affectedRows === 0) {
      connection.release();
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    const [item]: any = await connection.query('SELECT * FROM inventory_items WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(item[0]);
  } catch (error: any) {
    console.error('[INVENTORY PUT] Error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Inventory item name already exists' });
    }
    res.status(500).json({ error: 'Failed to update inventory item', details: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('DELETE FROM inventory_items WHERE id = ?', [req.params.id]);
    connection.release();

    if ((result[0] as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error: any) {
    console.error('[INVENTORY DELETE] Error:', error);
    res.status(500).json({ error: 'Failed to delete inventory item', details: error.message });
  }
});

export default router;
