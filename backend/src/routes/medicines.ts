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
      department,
    } = req.body;

    if (
      !name ||
      !genericName ||
      !category ||
      !medicineType ||
      !medicineForm ||
      purchasePrice === undefined ||
      purchasePrice === null ||
      sellingPrice === undefined ||
      sellingPrice === null
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await pool.getConnection();
    
    const query = `INSERT INTO medicines (
      id, name, genericName, category, medicineType, description, medicineForm,
      manufacturer, supplier, manufacturingDate, expiryDate, batchNumber, dosage,
      sideEffects, precautions, initialQuantity, reorderLevel, maximumLevel,
      purchasePrice, sellingPrice, taxRate, roomTemperature, frozen, refrigerated,
      protectFromLight, status, department, createdAt, updatedAt
    ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

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
      department || 'Pharmacy',
    ]);

    const [result]: any = await connection.query('SELECT * FROM medicines WHERE name = ? ORDER BY createdAt DESC LIMIT 1', [name]);
    const newMedicine = result[0];
    
    // Auto-create initial batch in medicine_batches if stock is supplied
    const qty = Number(initialQuantity) || 0;
    if (qty > 0) {
      const batchNumToUse = batchNumber && batchNumber.trim() ? batchNumber.trim() : 'INITIAL-BATCH';
      const formattedExpiry = expiryDate 
        ? new Date(expiryDate).toISOString().slice(0, 19).replace('T', ' ') 
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
      
      await connection.query(
        `INSERT INTO medicine_batches (id, medicineId, batchNumber, expiryDate, purchasePrice, sellingPrice, quantity, createdAt, updatedAt)
         VALUES (UUID(), ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          newMedicine.id, 
          batchNumToUse, 
          formattedExpiry, 
          Number(purchasePrice || 0), 
          Number(sellingPrice || 0), 
          qty
        ]
      );
    }

    connection.release();
    res.status(201).json(newMedicine);
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
      department,
    } = req.body;

    const connection = await pool.getConnection();
    
    // Fetch current medicine row to get previous values before update
    const [currentRows]: any = await connection.query('SELECT * FROM medicines WHERE id = ?', [req.params.id]);
    if (currentRows.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Medicine not found' });
    }
    const oldMedicine = currentRows[0];
    const oldQty = Number(oldMedicine.initialQuantity);
    const oldBatchNumber = oldMedicine.batchNumber;

    // Check if initialQuantity is being updated to log a transaction
    let stockLogData: any = null;
    if (initialQuantity !== undefined) {
      const newQty = Number(initialQuantity);
      const diff = newQty - oldQty;
      if (diff !== 0) {
        stockLogData = {
          type: diff < 0 ? 'DISPENSE' : 'ADJUSTMENT',
          quantity: diff,
          previousStock: oldQty,
          newStock: newQty,
          notes: req.body.transactionNotes || (diff < 0 ? 'Medicine dispensed' : 'Manual stock adjustment')
        };

        // If batchNumber is not in body (e.g. prescription dispensing), apply FEFO / manual deduction
        if (batchNumber === undefined) {
          if (diff < 0) {
            let reductionAmount = Math.abs(diff);
            // Fetch active batches sorted by expiryDate ASC
            const [batches]: any = await connection.query(
              'SELECT * FROM medicine_batches WHERE medicineId = ? AND quantity > 0 ORDER BY expiryDate ASC',
              [req.params.id]
            );

            for (const batch of batches) {
              if (reductionAmount <= 0) break;
              const batchQty = Number(batch.quantity);

              if (batchQty <= reductionAmount) {
                // Deduct entire batch qty
                await connection.query(
                  'UPDATE medicine_batches SET quantity = 0, updatedAt = NOW() WHERE id = ?',
                  [batch.id]
                );
                reductionAmount -= batchQty;
              } else {
                // Deduct partial qty from this batch
                await connection.query(
                  'UPDATE medicine_batches SET quantity = quantity - ?, updatedAt = NOW() WHERE id = ?',
                  [reductionAmount, batch.id]
                );
                reductionAmount = 0;
              }
            }
          } else {
            // Manual quantity adjustment increase (diff > 0):
            // Add the increased quantity to the latest batch or fallback INITIAL-BATCH
            const [latestBatches]: any = await connection.query(
              'SELECT * FROM medicine_batches WHERE medicineId = ? ORDER BY expiryDate DESC LIMIT 1',
              [req.params.id]
            );
            if (latestBatches.length > 0) {
              await connection.query(
                'UPDATE medicine_batches SET quantity = quantity + ?, updatedAt = NOW() WHERE id = ?',
                [diff, latestBatches[0].id]
              );
            } else {
              const fallbackExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
              await connection.query(
                `INSERT INTO medicine_batches (id, medicineId, batchNumber, expiryDate, purchasePrice, sellingPrice, quantity)
                 VALUES (UUID(), ?, 'INITIAL-BATCH', ?, ?, ?, ?)`,
                [req.params.id, fallbackExpiry, Number(oldMedicine.purchasePrice || 0), Number(oldMedicine.sellingPrice || 0), diff]
              );
            }
          }
        }
      }
    }

    // Sync medicine_batches if batchNumber is provided in body (meaning medicine details are updated via Edit form)
    if (batchNumber !== undefined) {
      const finalBatchNumber = batchNumber ? batchNumber.trim() : null;
      const finalExpiryDate = expiryDate !== undefined ? expiryDate : oldMedicine.expiryDate;
      const finalPurchasePrice = purchasePrice !== undefined ? parseFloat(purchasePrice) : parseFloat(oldMedicine.purchasePrice);
      const finalSellingPrice = sellingPrice !== undefined ? parseFloat(sellingPrice) : parseFloat(oldMedicine.sellingPrice);
      const finalQuantity = initialQuantity !== undefined ? Number(initialQuantity) : oldQty;

      if (finalBatchNumber) {
        const formattedExpiry = finalExpiryDate 
          ? new Date(finalExpiryDate).toISOString().slice(0, 19).replace('T', ' ') 
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');

        // Check if a batch with oldBatchNumber exists
        const [existingBatches]: any = await connection.query(
          'SELECT * FROM medicine_batches WHERE medicineId = ? AND batchNumber = ?',
          [req.params.id, oldBatchNumber || finalBatchNumber]
        );

        if (existingBatches.length > 0) {
          // Update the existing batch
          await connection.query(
            `UPDATE medicine_batches 
             SET batchNumber = ?, expiryDate = ?, purchasePrice = ?, sellingPrice = ?, quantity = ?, updatedAt = NOW()
             WHERE id = ?`,
            [finalBatchNumber, formattedExpiry, finalPurchasePrice, finalSellingPrice, finalQuantity, existingBatches[0].id]
          );
        } else {
          // If no batch exists, create one
          await connection.query(
            `INSERT INTO medicine_batches (id, medicineId, batchNumber, expiryDate, purchasePrice, sellingPrice, quantity, createdAt, updatedAt)
             VALUES (UUID(), ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [req.params.id, finalBatchNumber, formattedExpiry, finalPurchasePrice, finalSellingPrice, finalQuantity]
          );
        }
      }
    }
    
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
    if (department) { updates.push('department = ?'); values.push(department); }

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

    // Insert stock transaction if logged
    if (stockLogData) {
      await connection.query(
        `INSERT INTO medicine_stock_transactions (id, medicineId, type, quantity, previousStock, newStock, notes)
         VALUES (UUID(), ?, ?, ?, ?, ?, ?)`,
        [req.params.id, stockLogData.type, stockLogData.quantity, stockLogData.previousStock, stockLogData.newStock, stockLogData.notes]
      );
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

router.post('/:id/add-stock', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      addedQuantity,
      batchNumber,
      expiryDate,
      purchasePrice,
      sellingPrice,
      supplier,
      notes
    } = req.body;

    const qty = parseInt(addedQuantity);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ error: 'addedQuantity must be a positive integer' });
    }

    if (!batchNumber || !batchNumber.trim()) {
      return res.status(400).json({ error: 'batchNumber is required' });
    }

    if (!expiryDate) {
      return res.status(400).json({ error: 'expiryDate is required' });
    }

    const connection = await pool.getConnection();

    // 1. Fetch current medicine to verify it exists
    const [meds]: any = await connection.query('SELECT * FROM medicines WHERE id = ?', [req.params.id]);
    if (meds.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Medicine not found' });
    }
    const medicine = meds[0];
    const previousStock = Number(medicine.initialQuantity);

    const formattedExpiry = new Date(expiryDate).toISOString().slice(0, 19).replace('T', ' ');
    const pPrice = purchasePrice !== undefined && purchasePrice !== '' ? parseFloat(purchasePrice) : Number(medicine.purchasePrice || 0);
    const sPrice = sellingPrice !== undefined && sellingPrice !== '' ? parseFloat(sellingPrice) : Number(medicine.sellingPrice || 0);

    // 2. Insert or update the specific batch
    const [existingBatches]: any = await connection.query(
      'SELECT * FROM medicine_batches WHERE medicineId = ? AND batchNumber = ?',
      [req.params.id, batchNumber.trim()]
    );

    if (existingBatches.length > 0) {
      const batch = existingBatches[0];
      await connection.query(
        `UPDATE medicine_batches 
         SET quantity = quantity + ?, expiryDate = ?, purchasePrice = ?, sellingPrice = ?, updatedAt = NOW()
         WHERE id = ?`,
        [qty, formattedExpiry, pPrice, sPrice, batch.id]
      );
    } else {
      await connection.query(
        `INSERT INTO medicine_batches (id, medicineId, batchNumber, expiryDate, purchasePrice, sellingPrice, quantity)
         VALUES (UUID(), ?, ?, ?, ?, ?, ?)`,
        [req.params.id, batchNumber.trim(), formattedExpiry, pPrice, sPrice, qty]
      );
    }

    // 3. Recalculate total quantity for the medicine
    const [totalRows]: any = await connection.query(
      'SELECT SUM(quantity) as totalQty FROM medicine_batches WHERE medicineId = ?',
      [req.params.id]
    );
    const newStock = Number(totalRows[0].totalQty || 0);

    // 4. Update the core medicine record with new totals and latest batch details
    const medUpdates = [
      'initialQuantity = ?',
      'batchNumber = ?',
      'expiryDate = ?',
      'purchasePrice = ?',
      'sellingPrice = ?',
      'updatedAt = NOW()'
    ];
    const medParams: any[] = [newStock, batchNumber.trim(), formattedExpiry, pPrice, sPrice];

    if (supplier) {
      medUpdates.push('supplier = ?');
      medParams.push(supplier);
    }
    medParams.push(req.params.id);

    await connection.query(
      `UPDATE medicines SET ${medUpdates.join(', ')} WHERE id = ?`,
      medParams
    );

    // 5. Log the stock transaction in audit ledger
    const transactionNotes = notes || `Batch ${batchNumber.trim()} restock (+${qty} units)`;
    await connection.query(
      `INSERT INTO medicine_stock_transactions (id, medicineId, type, quantity, previousStock, newStock, notes)
       VALUES (UUID(), ?, 'RESTOCK', ?, ?, ?, ?)`,
      [req.params.id, qty, previousStock, newStock, transactionNotes]
    );

    // 6. Fetch and return updated medicine
    const [updatedMedicine]: any = await connection.query('SELECT * FROM medicines WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(updatedMedicine[0]);
  } catch (error: any) {
    console.error('[MEDICINES ADD STOCK] Error:', error);
    res.status(500).json({ error: 'Failed to add stock', details: error.message });
  }
});

router.get('/:id/batches', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.query(
      'SELECT * FROM medicine_batches WHERE medicineId = ? AND quantity > 0 ORDER BY expiryDate ASC',
      [req.params.id]
    );
    connection.release();
    res.json(rows);
  } catch (error: any) {
    console.error('[MEDICINES BATCHES GET] Error:', error);
    res.status(500).json({ error: 'Failed to fetch medicine batches', details: error.message });
  }
});

router.get('/:id/transactions', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.query(
      'SELECT * FROM medicine_stock_transactions WHERE medicineId = ? ORDER BY createdAt DESC',
      [req.params.id]
    );
    connection.release();
    res.json(rows);
  } catch (error: any) {
    console.error('[MEDICINES TRANSACTIONS GET] Error:', error);
    res.status(500).json({ error: 'Failed to fetch stock transactions', details: error.message });
  }
});

export default router;
