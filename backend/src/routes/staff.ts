import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search, department, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query = 'SELECT * FROM Staff WHERE 1=1';
    const params: any[] = [];

    if (search) {
      query += ' AND (firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR role LIKE ?)';
      const searchTerm = `%${String(search)}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (department) {
      query += ' AND department = ?';
      params.push(String(department));
    }

    if (status) {
      query += ' AND status = ?';
      params.push(String(status));
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), skip);

    const connection = await pool.getConnection();
    
    const [staff]: any = await connection.query(query, params);
    const countParams = params.slice(0, params.length - 2);
    const countSql = 'SELECT COUNT(*) as total FROM Staff WHERE 1=1' + query.substring(query.indexOf('WHERE 1=1') + 9, query.indexOf('ORDER BY'));
    const [countResult]: any = await connection.query(countSql, countParams);
    const total = countResult[0].total;
    
    connection.release();

    res.json({ staff, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [staff]: any = await connection.query('SELECT * FROM Staff WHERE id = ?', [req.params.id]);
    connection.release();

    if (staff.length === 0) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json(staff[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff member' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      city,
      postalCode,
      country,
      emergencyContact,
      emergencyPhone,
      relationship,
      role,
      department,
      joinedDate,
      status,
    } = req.body;

    const connection = await pool.getConnection();
    
    const query = `INSERT INTO Staff (id, firstName, lastName, email, phone, dateOfBirth, gender, address, city, postalCode, country, emergencyContact, emergencyPhone, relationship, role, department, joinedDate, status, createdAt, updatedAt)
                   VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    
    await connection.query(query, [
      firstName, lastName, email, phone, new Date(dateOfBirth), gender, address, city, postalCode, country, emergencyContact, emergencyPhone, relationship, role, department, joinedDate ? new Date(joinedDate) : new Date(), status || 'Active'
    ]);

    const [staff]: any = await connection.query('SELECT * FROM Staff WHERE email = ? ORDER BY createdAt DESC LIMIT 1', [email]);
    connection.release();

    res.status(201).json(staff[0]);
  } catch (error: any) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create staff member' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      city,
      postalCode,
      country,
      emergencyContact,
      emergencyPhone,
      relationship,
      role,
      department,
      status,
    } = req.body;

    const connection = await pool.getConnection();
    
    const updates: string[] = [];
    const values: any[] = [];

    if (firstName) { updates.push('firstName = ?'); values.push(firstName); }
    if (lastName) { updates.push('lastName = ?'); values.push(lastName); }
    if (email) { updates.push('email = ?'); values.push(email); }
    if (phone) { updates.push('phone = ?'); values.push(phone); }
    if (dateOfBirth) { updates.push('dateOfBirth = ?'); values.push(new Date(dateOfBirth)); }
    if (gender) { updates.push('gender = ?'); values.push(gender); }
    if (address) { updates.push('address = ?'); values.push(address); }
    if (city) { updates.push('city = ?'); values.push(city); }
    if (postalCode) { updates.push('postalCode = ?'); values.push(postalCode); }
    if (country) { updates.push('country = ?'); values.push(country); }
    if (emergencyContact) { updates.push('emergencyContact = ?'); values.push(emergencyContact); }
    if (emergencyPhone) { updates.push('emergencyPhone = ?'); values.push(emergencyPhone); }
    if (relationship) { updates.push('relationship = ?'); values.push(relationship); }
    if (role) { updates.push('role = ?'); values.push(role); }
    if (department) { updates.push('department = ?'); values.push(department); }
    if (status) { updates.push('status = ?'); values.push(status); }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updatedAt = NOW()');
    values.push(req.params.id);

    const query = `UPDATE Staff SET ${updates.join(', ')} WHERE id = ?`;
    const result = await connection.query(query, values);
    
    if ((result[0] as any).affectedRows === 0) {
      connection.release();
      return res.status(404).json({ error: 'Staff member not found' });
    }

    const [staff]: any = await connection.query('SELECT * FROM Staff WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(staff[0]);
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to update staff member' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('DELETE FROM Staff WHERE id = ?', [req.params.id]);
    connection.release();

    if ((result[0] as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete staff member' });
  }
});

export default router;
