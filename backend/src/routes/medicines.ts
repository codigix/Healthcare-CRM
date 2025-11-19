import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, status, search, category } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query = 'SELECT * FROM medicines WHERE 1=1';
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
      query += ' AND (name LIKE ? OR genericName LIKE ? OR category LIKE ?)';
      const searchTerm = `%${String(search)}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const countParams = params.slice();
    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), skip);

    const connection = await pool.getConnection();
    
    const [medicines]: any = await connection.query(query, params);
    
    let countQuery = 'SELECT COUNT(*) as total FROM medicines WHERE 1=1';
    if (status) {
      countQuery += ' AND status = ?';
    }
    if (category) {
      countQuery += ' AND category = ?';
    }
    if (search) {
      countQuery += ' AND (name LIKE ? OR genericName LIKE ? OR category LIKE ?)';
    }
    
    const result: any = await connection.query(countQuery, countParams);
    const total = result[0][0].total;
    
    connection.release();

    res.json({ medicines, total, page: Number(page), limit: Number(limit) });
  } catch (error: any) {
    console.error('[MEDICINES GET] Error:', error);
    res.status(500).json({ error: 'Failed to fetch medicines', details: error.message });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.query('SELECT * FROM medicines WHERE id = ?', [req.params.id]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    res.json(rows[0]);
  } catch (error: any) {
    console.error('[MEDICINES GET BY ID] Error:', error);
    res.status(500).json({ error: 'Failed to fetch medicine', details: error.message });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      genericName,
      category,
      medicineType,
      description,
      medicineForm,
      manufacturer,
      supplier,
      manufacturingDate,
      expiryDate,
      batchNumber,
      dosage,
      sideEffects,
      precautions,
      initialQuantity,
      reorderLevel,
      maximumLevel,
      purchasePrice,
      sellingPrice,
      taxRate,
      roomTemperature,
      frozen,
      refrigerated,
      protectFromLight,
      status,
    } = req.body;

    if (!name || !genericName || !category || !medicineType || !medicineForm || !purchasePrice || !sellingPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await pool.getConnection();
    
    const query = `INSERT INTO medicines (
      id, name, genericName, category, medicineType, description, medicineForm,
      manufacturer, supplier, manufacturingDate, expiryDate, batchNumber, dosage,
      sideEffects, precautions, initialQuantity, reorderLevel, maximumLevel,
      purchasePrice, sellingPrice, taxRate, roomTemperature, frozen, refrigerated,
      protectFromLight, status, createdAt, updatedAt
    ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

    await connection.query(query, [
      name,
      genericName,
      category,
      medicineType,
      description || null,
      medicineForm,
      manufacturer || null,
      supplier || null,
      manufacturingDate || null,
      expiryDate || null,
      batchNumber || null,
      dosage || null,
      sideEffects || null,
      precautions || null,
      initialQuantity || 0,
      reorderLevel || 0,
      maximumLevel || 0,
      purchasePrice,
      sellingPrice,
      taxRate || 0,
      roomTemperature || false,
      frozen || false,
      refrigerated || false,
      protectFromLight || false,
      status || 'Active',
    ]);

    const [result]: any = await connection.query('SELECT * FROM medicines WHERE name = ? ORDER BY createdAt DESC LIMIT 1', [name]);
    connection.release();

    res.status(201).json(result[0]);
  } catch (error: any) {
    console.error('[MEDICINES POST] Error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Medicine name already exists' });
    }
    res.status(500).json({ error: 'Failed to create medicine', details: error.message });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      genericName,
      category,
      medicineType,
      description,
      medicineForm,
      manufacturer,
      supplier,
      manufacturingDate,
      expiryDate,
      batchNumber,
      dosage,
      sideEffects,
      precautions,
      initialQuantity,
      reorderLevel,
      maximumLevel,
      purchasePrice,
      sellingPrice,
      taxRate,
      roomTemperature,
      frozen,
      refrigerated,
      protectFromLight,
      status,
    } = req.body;

    const connection = await pool.getConnection();
    
    const updates: string[] = [];
    const values: any[] = [];

    if (name) { updates.push('name = ?'); values.push(name); }
    if (genericName) { updates.push('genericName = ?'); values.push(genericName); }
    if (category) { updates.push('category = ?'); values.push(category); }
    if (medicineType) { updates.push('medicineType = ?'); values.push(medicineType); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (medicineForm) { updates.push('medicineForm = ?'); values.push(medicineForm); }
    if (manufacturer) { updates.push('manufacturer = ?'); values.push(manufacturer); }
    if (supplier) { updates.push('supplier = ?'); values.push(supplier); }
    if (manufacturingDate) { updates.push('manufacturingDate = ?'); values.push(manufacturingDate); }
    if (expiryDate) { updates.push('expiryDate = ?'); values.push(expiryDate); }
    if (batchNumber) { updates.push('batchNumber = ?'); values.push(batchNumber); }
    if (dosage) { updates.push('dosage = ?'); values.push(dosage); }
    if (sideEffects !== undefined) { updates.push('sideEffects = ?'); values.push(sideEffects); }
    if (precautions !== undefined) { updates.push('precautions = ?'); values.push(precautions); }
    if (initialQuantity !== undefined) { updates.push('initialQuantity = ?'); values.push(Number(initialQuantity)); }
    if (reorderLevel !== undefined) { updates.push('reorderLevel = ?'); values.push(Number(reorderLevel)); }
    if (maximumLevel !== undefined) { updates.push('maximumLevel = ?'); values.push(Number(maximumLevel)); }
    if (purchasePrice !== undefined) { updates.push('purchasePrice = ?'); values.push(parseFloat(purchasePrice)); }
    if (sellingPrice !== undefined) { updates.push('sellingPrice = ?'); values.push(parseFloat(sellingPrice)); }
    if (taxRate !== undefined) { updates.push('taxRate = ?'); values.push(parseFloat(taxRate)); }
    if (roomTemperature !== undefined) { updates.push('roomTemperature = ?'); values.push(roomTemperature); }
    if (frozen !== undefined) { updates.push('frozen = ?'); values.push(frozen); }
    if (refrigerated !== undefined) { updates.push('refrigerated = ?'); values.push(refrigerated); }
    if (protectFromLight !== undefined) { updates.push('protectFromLight = ?'); values.push(protectFromLight); }
    if (status) { updates.push('status = ?'); values.push(status); }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updatedAt = NOW()');
    values.push(req.params.id);

    const query = `UPDATE medicines SET ${updates.join(', ')} WHERE id = ?`;
    const result = await connection.query(query, values);
    
    if ((result[0] as any).affectedRows === 0) {
      connection.release();
      return res.status(404).json({ error: 'Medicine not found' });
    }

    const [medicine]: any = await connection.query('SELECT * FROM medicines WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(medicine[0]);
  } catch (error: any) {
    console.error('[MEDICINES PUT] Error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Medicine name already exists' });
    }
    res.status(500).json({ error: 'Failed to update medicine', details: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('DELETE FROM medicines WHERE id = ?', [req.params.id]);
    connection.release();

    if ((result[0] as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    res.json({ message: 'Medicine deleted successfully' });
  } catch (error: any) {
    console.error('[MEDICINES DELETE] Error:', error);
    res.status(500).json({ error: 'Failed to delete medicine', details: error.message });
  }
});

export default router;
