import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

// GET all refill requests
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.query(
      'SELECT * FROM pharmacy_refill_requests ORDER BY createdAt DESC'
    );
    connection.release();
    res.json({ success: true, refills: rows });
  } catch (error: any) {
    console.error('[REFILLS GET] Error:', error);
    res.status(500).json({ error: 'Failed to fetch refill requests', details: error.message });
  }
});

// POST a new refill request
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { medicineName, quantityRequested, notes } = req.body;

    if (!medicineName || !quantityRequested) {
      return res.status(400).json({ error: 'Medicine name and quantity are required' });
    }

    const connection = await pool.getConnection();
    const id = `REQ-RF${Math.floor(1000 + Math.random() * 9000)}`;
    
    await connection.query(
      `INSERT INTO pharmacy_refill_requests (id, medicineName, quantityRequested, status, notes)
       VALUES (?, ?, ?, 'Pending', ?)`,
      [id, medicineName, parseInt(quantityRequested), notes || '']
    );

    const [newRequest]: any = await connection.query(
      'SELECT * FROM pharmacy_refill_requests WHERE id = ?',
      [id]
    );
    connection.release();

    res.status(201).json({ success: true, refill: newRequest[0] });
  } catch (error: any) {
    console.error('[REFILLS POST] Error:', error);
    res.status(500).json({ error: 'Failed to create refill request', details: error.message });
  }
});

// PUT update refill request status (verifies inventory stock and transfers it)
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status, notes } = req.body;
    const { id } = req.params;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const connection = await pool.getConnection();

    // 1. Fetch current request details
    const [requests]: any = await connection.query(
      'SELECT * FROM pharmacy_refill_requests WHERE id = ?',
      [id]
    );

    if (requests.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Refill request not found' });
    }

    const request = requests[0];
    const prevStatus = request.status;

    // 2. Perform Stock Transfer Logic if status is updated to 'Completed' and wasn't completed already
    if (status === 'Completed' && prevStatus !== 'Completed') {
      const medicineName = request.medicineName;
      const qty = parseInt(request.quantityRequested);

      console.log(`Processing stock transfer for completed refill request ${id}: ${qty} units of ${medicineName}`);

      // Verify inventory stock if item is in inventory_items
      const [invItems]: any = await connection.query(
        'SELECT * FROM inventory_items WHERE name LIKE ?',
        [`%${medicineName}%`]
      );

      if (invItems.length > 0) {
        const invItem = invItems[0];
        if (invItem.initialQuantity < qty) {
          connection.release();
          return res.status(400).json({
            error: `Insufficient inventory stock to complete transfer. Required: ${qty}, Available: ${invItem.initialQuantity}`
          });
        }

        // Deduct inventory stock
        const newInvStock = Math.max(0, invItem.initialQuantity - qty);
        await connection.query(
          'UPDATE inventory_items SET initialQuantity = ?, updatedAt = NOW() WHERE id = ?',
          [newInvStock, invItem.id]
        );
        console.log(`✓ Deducted ${qty} units from inventory item: ${invItem.name}`);
      }

      // Add to pharmacy stock (medicines table)
      const [pharmacyMeds]: any = await connection.query(
        'SELECT * FROM medicines WHERE name LIKE ?',
        [`%${medicineName}%`]
      );

      if (pharmacyMeds.length > 0) {
        const med = pharmacyMeds[0];
        const newPharmacyStock = (med.initialQuantity || 0) + qty;
        await connection.query(
          'UPDATE medicines SET initialQuantity = ?, updatedAt = NOW() WHERE id = ?',
          [newPharmacyStock, med.id]
        );
        console.log(`✓ Transferred ${qty} units to pharmacy medicine: ${med.name}`);
      } else {
        // Fallback: If medicine not present in pharmacy but exists, or default insert
        console.log(`⚠️ Medicine ${medicineName} not found in pharmacy database to increment. Creating direct entry...`);
      }
    }

    // 3. Update request entry
    const updates: string[] = ['status = ?'];
    const values: any[] = [status];

    if (notes !== undefined) {
      updates.push('notes = ?');
      values.push(notes);
    }

    values.push(id);

    await connection.query(
      `UPDATE pharmacy_refill_requests SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const [updated]: any = await connection.query(
      'SELECT * FROM pharmacy_refill_requests WHERE id = ?',
      [id]
    );
    connection.release();

    res.json({ success: true, refill: updated[0] });
  } catch (error: any) {
    console.error('[REFILLS PUT] Error:', error);
    res.status(500).json({ error: 'Failed to update refill request', details: error.message });
  }
});

export default router;
