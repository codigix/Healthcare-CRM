import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let whereClause = '1=1';
    const params: any[] = [];

    if (search) {
      whereClause += ' AND (bloodType LIKE ? OR status LIKE ?)';
      const searchTerm = `%${String(search)}%`;
      params.push(searchTerm, searchTerm);
    }

    const connection = await pool.getConnection();
    
    const dataParams = [...params, Number(limit), skip];
    const query = `SELECT * FROM blood_units WHERE ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    const [inventory]: any = await connection.query(query, dataParams);
    
    const countSql = `SELECT COUNT(*) as total FROM blood_units WHERE ${whereClause}`;
    const result: any = await connection.query(countSql, params);
    const total = result[0][0].total;
    
    connection.release();

    res.json({ inventory, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error('Error fetching blood inventory:', error);
    res.status(500).json({ error: 'Failed to fetch blood inventory' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { bloodType, quantity = 1, collectionDate, expiryDate, status, donorId } = req.body;
    const connection = await pool.getConnection();
    
    const collection = collectionDate ? new Date(collectionDate) : new Date();
    let expiry = expiryDate ? new Date(expiryDate) : new Date(collection);
    
    if (!expiryDate) {
      expiry.setDate(expiry.getDate() + 35);
    }
    
    let validDonorId = null;
    if (donorId) {
      const [donor]: any = await connection.query('SELECT id FROM blood_donors WHERE id = ?', [donorId]);
      if (donor && donor.length > 0) {
        validDonorId = donorId;
      }
    }
    
    const query = `INSERT INTO blood_units (id, unitId, bloodType, donorId, quantity, collectionDate, expiryDate, status, createdAt, updatedAt)
                   VALUES (UUID(), CONCAT('BU', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')), ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    await connection.query(query, [bloodType, validDonorId, quantity, collection, expiry, status || 'available']);
    const [item]: any = await connection.query('SELECT * FROM blood_units WHERE bloodType = ? ORDER BY createdAt DESC LIMIT 1', [bloodType]);
    connection.release();
    res.status(201).json({ success: true, data: item[0] });
  } catch (error) {
    console.error('Error creating blood inventory:', error);
    res.status(500).json({ success: false, error: 'Failed to create blood inventory' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { quantity, status, expiryDate, notes } = req.body;
    const connection = await pool.getConnection();
    const updates: string[] = [];
    const values: any[] = [];
    if (quantity !== undefined) { updates.push('quantity = ?'); values.push(quantity); }
    if (status) { updates.push('status = ?'); values.push(status); }
    if (expiryDate) { updates.push('expiryDate = ?'); values.push(expiryDate); }
    if (notes !== undefined) { updates.push('notes = ?'); values.push(notes); }
    updates.push('updatedAt = NOW()');
    values.push(req.params.id);
    if (updates.length > 1) {
      await connection.query(`UPDATE blood_units SET ${updates.join(', ')} WHERE id = ?`, values);
    }
    const [item]: any = await connection.query('SELECT * FROM blood_units WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ success: true, data: item[0] });
  } catch (error) {
    console.error('Error updating blood inventory:', error);
    res.status(500).json({ success: false, error: 'Failed to update blood inventory' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM blood_units WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ success: true, message: 'Blood inventory deleted' });
  } catch (error) {
    console.error('Error deleting blood inventory:', error);
    res.status(500).json({ success: false, error: 'Failed to delete blood inventory' });
  }
});

router.get('/blood-stock', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [data]: any = await connection.query('SELECT * FROM blood_units WHERE status = "available" ORDER BY createdAt DESC');
    const [stats]: any = await connection.query(`
      SELECT bloodType, COUNT(*) as count, SUM(quantity) as units 
      FROM blood_units 
      WHERE status = "available"
      GROUP BY bloodType
    `);
    connection.release();
    
    const statsObj = stats.reduce((acc: any, stat: any) => {
      acc[stat.bloodType] = { units: stat.units || 0, count: stat.count || 0 };
      return acc;
    }, {});
    
    res.json({ success: true, data, stats: statsObj, total: data.length });
  } catch (error) {
    console.error('Error fetching blood stock:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch blood stock' });
  }
});

router.post('/blood-stock', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { bloodType, quantity = 1, collectionDate, expiryDate, status, donorId } = req.body;
    const connection = await pool.getConnection();
    
    const collection = collectionDate ? new Date(collectionDate) : new Date();
    let expiry = expiryDate ? new Date(expiryDate) : new Date(collection);
    
    if (!expiryDate) {
      expiry.setDate(expiry.getDate() + 35);
    }
    
    let validDonorId = null;
    if (donorId) {
      const [donor]: any = await connection.query('SELECT id FROM blood_donors WHERE id = ?', [donorId]);
      if (donor && donor.length > 0) {
        validDonorId = donorId;
      }
    }
    
    const query = `INSERT INTO blood_units (id, unitId, bloodType, donorId, quantity, collectionDate, expiryDate, status, createdAt, updatedAt)
                   VALUES (UUID(), CONCAT('BU', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')), ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    await connection.query(query, [bloodType, validDonorId, quantity, collection, expiry, status || 'available']);
    const [item]: any = await connection.query('SELECT * FROM blood_units WHERE bloodType = ? ORDER BY createdAt DESC LIMIT 1', [bloodType]);
    connection.release();
    res.status(201).json({ success: true, data: item[0] });
  } catch (error) {
    console.error('Error creating blood stock:', error);
    res.status(500).json({ success: false, error: 'Failed to create blood stock' });
  }
});

router.put('/blood-stock/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { quantity, status, expiryDate, notes } = req.body;
    const connection = await pool.getConnection();
    const updates: string[] = [];
    const values: any[] = [];
    if (quantity !== undefined) { updates.push('quantity = ?'); values.push(quantity); }
    if (status) { updates.push('status = ?'); values.push(status); }
    if (expiryDate) { updates.push('expiryDate = ?'); values.push(expiryDate); }
    if (notes !== undefined) { updates.push('notes = ?'); values.push(notes); }
    updates.push('updatedAt = NOW()');
    values.push(req.params.id);
    if (updates.length > 1) {
      await connection.query(`UPDATE blood_units SET ${updates.join(', ')} WHERE id = ?`, values);
    }
    const [item]: any = await connection.query('SELECT * FROM blood_units WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ success: true, data: item[0] });
  } catch (error) {
    console.error('Error updating blood stock:', error);
    res.status(500).json({ success: false, error: 'Failed to update blood stock' });
  }
});

router.delete('/blood-stock/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM blood_units WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ success: true, message: 'Blood stock deleted' });
  } catch (error) {
    console.error('Error deleting blood stock:', error);
    res.status(500).json({ success: false, error: 'Failed to delete blood stock' });
  }
});

router.get('/blood-donors', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [donors]: any = await connection.query('SELECT * FROM blood_donors ORDER BY createdAt DESC');
    connection.release();
    res.json({ success: true, data: donors, total: donors.length });
  } catch (error) {
    console.error('Error fetching blood donors:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch blood donors' });
  }
});

router.post('/blood-donors', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, bloodType, contact, email, dateOfBirth, gender, address, city, phoneNumber } = req.body;
    const connection = await pool.getConnection();
    const query = `INSERT INTO blood_donors (id, name, bloodType, contact, email, dateOfBirth, gender, address, city, phoneNumber, status, createdAt, updatedAt)
                   VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', NOW(), NOW())`;
    await connection.query(query, [name, bloodType, contact, email, dateOfBirth ? new Date(dateOfBirth) : null, gender || null, address || null, city || null, phoneNumber || null]);
    const [item]: any = await connection.query('SELECT * FROM blood_donors WHERE email = ? ORDER BY createdAt DESC LIMIT 1', [email]);
    connection.release();
    res.status(201).json({ success: true, data: item[0] });
  } catch (error) {
    console.error('Error creating blood donor record:', error);
    res.status(500).json({ success: false, error: 'Failed to create blood donor record' });
  }
});

router.get('/blood-issues', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [issues]: any = await connection.query('SELECT * FROM blood_issues ORDER BY createdAt DESC');
    connection.release();
    res.json({ success: true, data: issues, total: issues.length });
  } catch (error) {
    console.error('Error fetching blood issues:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch blood issues' });
  }
});

router.post('/blood-issues', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { bloodType, units = 1, recipient, recipientId, bloodUnitId, requestingDoctor, purpose, department } = req.body;
    const connection = await pool.getConnection();
    const query = `INSERT INTO blood_issues (id, issueId, recipient, recipientId, bloodType, bloodUnitId, units, issueDate, requestingDoctor, purpose, department, status, createdAt, updatedAt)
                   VALUES (UUID(), CONCAT('BI', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')), ?, ?, ?, ?, ?, NOW(), ?, ?, ?, 'Pending', NOW(), NOW())`;
    await connection.query(query, [recipient || 'Unknown', recipientId || null, bloodType, bloodUnitId || null, units, requestingDoctor || 'Unknown', purpose || 'Medical', department || 'General']);
    const [item]: any = await connection.query('SELECT * FROM blood_issues WHERE bloodType = ? ORDER BY createdAt DESC LIMIT 1', [bloodType]);
    connection.release();
    res.status(201).json({ success: true, data: item[0] });
  } catch (error) {
    console.error('Error creating blood issue record:', error);
    res.status(500).json({ success: false, error: 'Failed to create blood issue record' });
  }
});

router.put('/blood-issues/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status, units } = req.body;
    const connection = await pool.getConnection();
    const updates: string[] = [];
    const values: any[] = [];
    if (status) { updates.push('status = ?'); values.push(status); }
    if (units !== undefined) { updates.push('units = ?'); values.push(units); }
    updates.push('updatedAt = NOW()');
    values.push(req.params.id);
    if (updates.length > 1) {
      await connection.query(`UPDATE blood_issues SET ${updates.join(', ')} WHERE id = ?`, values);
    }
    const [item]: any = await connection.query('SELECT * FROM blood_issues WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ success: true, data: item[0] });
  } catch (error) {
    console.error('Error updating blood issue:', error);
    res.status(500).json({ success: false, error: 'Failed to update blood issue' });
  }
});

router.delete('/blood-issues/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM blood_issues WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ success: true, message: 'Blood issue deleted' });
  } catch (error) {
    console.error('Error deleting blood issue:', error);
    res.status(500).json({ success: false, error: 'Failed to delete blood issue' });
  }
});

export default router;
