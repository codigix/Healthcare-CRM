import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query = `SELECT 
                  p.*, 
                  MAX(a.date) as lastVisitDate,
                  ANY_VALUE(d.name) as doctorName
                FROM patients p
                LEFT JOIN appointments a ON p.id = a.patientId
                LEFT JOIN doctors d ON a.doctorId = d.id
                WHERE 1=1`;
    const params: any[] = [];

    if (search) {
      query += ' AND (p.name LIKE ? OR p.email LIKE ? OR p.phone LIKE ?)';
      const searchTerm = `%${String(search)}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' GROUP BY p.id';

    const countParams = params.slice();
    const countSql = `SELECT COUNT(DISTINCT p.id) as total FROM patients p
                     WHERE 1=1`;
    
    const countQuery = countSql + (search ? ' AND (p.name LIKE ? OR p.email LIKE ? OR p.phone LIKE ?)' : '');
    
    query += ' ORDER BY p.createdAt DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), skip);

    const connection = await pool.getConnection();
    
    const [patients]: any = await connection.query(query, params);
    
    const [countResult]: any = await connection.query(countQuery, countParams);
    const total = countResult[0].total;
    
    connection.release();

    const calculateAge = (dob: Date) => {
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      return age;
    };

    const formatDate = (date: Date | null) => {
      if (!date) return null;
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    };

    const enrichedPatients = patients.map((patient: any) => {
      return {
        ...patient,
        age: calculateAge(patient.dob),
        status: 'Active',
        lastVisit: patient.lastVisitDate ? formatDate(patient.lastVisitDate) : null,
        condition: patient.history || null,
        doctor: patient.doctorName || null,
      };
    });

    res.json({ patients: enrichedPatients, total, page: Number(page), limit: Number(limit) });
  } catch (error: any) {
    console.error('[PATIENTS GET] Error:', error);
    res.status(500).json({ error: 'Failed to fetch patients', details: error.message });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [patients]: any = await connection.query('SELECT * FROM patients WHERE id = ?', [req.params.id]);
    connection.release();

    if (patients.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(patients[0]);
  } catch (error: any) {
    console.error('[PATIENTS GET BY ID] Error:', error);
    res.status(500).json({ error: 'Failed to fetch patient', details: error.message });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, dob, gender, address, history } = req.body;

    const connection = await pool.getConnection();
    
    const query = `INSERT INTO patients (id, name, email, phone, dob, gender, address, history, createdAt, updatedAt)
                   VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    
    await connection.query(query, [name, email, phone, new Date(dob), gender, address, history]);

    const [patient]: any = await connection.query('SELECT * FROM patients WHERE email = ? ORDER BY createdAt DESC LIMIT 1', [email]);
    connection.release();

    res.status(201).json(patient[0]);
  } catch (error: any) {
    console.error('[PATIENTS POST] Error:', error);
    res.status(500).json({ error: 'Failed to create patient', details: error.message });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, dob, gender, address, history } = req.body;
    const connection = await pool.getConnection();
    
    const updates: string[] = [];
    const values: any[] = [];

    if (name) { updates.push('name = ?'); values.push(name); }
    if (email) { updates.push('email = ?'); values.push(email); }
    if (phone) { updates.push('phone = ?'); values.push(phone); }
    if (dob) { updates.push('dob = ?'); values.push(new Date(dob)); }
    if (gender) { updates.push('gender = ?'); values.push(gender); }
    if (address) { updates.push('address = ?'); values.push(address); }
    if (history !== undefined) { updates.push('history = ?'); values.push(history); }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updatedAt = NOW()');
    values.push(req.params.id);

    const query = `UPDATE patients SET ${updates.join(', ')} WHERE id = ?`;
    const result = await connection.query(query, values);
    
    if ((result[0] as any).affectedRows === 0) {
      connection.release();
      return res.status(404).json({ error: 'Patient not found' });
    }

    const [patient]: any = await connection.query('SELECT * FROM patients WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(patient[0]);
  } catch (error: any) {
    console.error('[PATIENTS PUT] Error:', error);
    res.status(500).json({ error: 'Failed to update patient', details: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('DELETE FROM patients WHERE id = ?', [req.params.id]);
    connection.release();

    if ((result[0] as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({ message: 'Patient deleted successfully' });
  } catch (error: any) {
    console.error('[PATIENTS DELETE] Error:', error);
    res.status(500).json({ error: 'Failed to delete patient', details: error.message });
  }
});

export default router;
