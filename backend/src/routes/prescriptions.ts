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
      whereClause += ' AND (pr.medications LIKE ? OR pr.diagnosis LIKE ? OR pr.status LIKE ?)';
      const searchTerm = `%${String(search)}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const connection = await pool.getConnection();
    
    const dataParams = [...params, Number(limit), skip];
    const query = `
      SELECT 
        pr.*,
        p.id as patientId,
        p.name as patientName,
        p.gender as patientGender,
        p.dob as patientDob,
        d.id as doctorId,
        d.name as doctorName
      FROM prescriptions pr
      LEFT JOIN patients p ON pr.patientId = p.id
      LEFT JOIN doctors d ON pr.doctorId = d.id
      WHERE ${whereClause}
      ORDER BY pr.createdAt DESC
      LIMIT ? OFFSET ?
    `;
    const [prescriptions]: any = await connection.query(query, dataParams);
    
    const countSql = `SELECT COUNT(*) as total FROM prescriptions pr WHERE ${whereClause}`;
    const result: any = await connection.query(countSql, params);
    const total = result[0][0].total;
    
    const formattedPrescriptions = prescriptions.map((p: any) => ({
      id: p.id,
      patientId: p.patientId,
      doctorId: p.doctorId,
      prescriptionType: p.prescriptionType,
      prescriptionDate: p.prescriptionDate,
      diagnosis: p.diagnosis,
      medications: p.medications,
      notesForPharmacist: p.notesForPharmacist,
      status: p.status,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      patient: p.patientId ? {
        id: p.patientId,
        name: p.patientName,
        gender: p.patientGender,
        dob: p.patientDob,
      } : null,
      doctor: p.doctorId ? {
        id: p.doctorId,
        name: p.doctorName,
      } : null,
    }));
    
    connection.release();

    res.json({ prescriptions: formattedPrescriptions, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [prescriptions]: any = await connection.query(`
      SELECT 
        pr.*,
        p.id as patientId,
        p.name as patientName,
        p.gender as patientGender,
        p.dob as patientDob,
        d.id as doctorId,
        d.name as doctorName
      FROM prescriptions pr
      LEFT JOIN patients p ON pr.patientId = p.id
      LEFT JOIN doctors d ON pr.doctorId = d.id
      WHERE pr.id = ?
    `, [req.params.id]);
    connection.release();
    
    if (!prescriptions[0]) {
      return res.json({ error: 'Not found' });
    }
    
    const p = prescriptions[0];
    const formatted = {
      id: p.id,
      patientId: p.patientId,
      doctorId: p.doctorId,
      prescriptionType: p.prescriptionType,
      prescriptionDate: p.prescriptionDate,
      diagnosis: p.diagnosis,
      medications: p.medications,
      notesForPharmacist: p.notesForPharmacist,
      status: p.status,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      patient: p.patientId ? {
        id: p.patientId,
        name: p.patientName,
        gender: p.patientGender,
        dob: p.patientDob,
      } : null,
      doctor: p.doctorId ? {
        id: p.doctorId,
        name: p.doctorName,
      } : null,
    };
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prescription' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { patientId, doctorId, prescriptionType, diagnosis, medications, notesForPharmacist } = req.body;
    const connection = await pool.getConnection();
    const query = `INSERT INTO prescriptions (id, patientId, doctorId, prescriptionType, diagnosis, medications, notesForPharmacist, prescriptionDate, status, createdAt, updatedAt)
                   VALUES (UUID(), ?, ?, ?, ?, ?, ?, NOW(), ?, NOW(), NOW())`;
    await connection.query(query, [patientId, doctorId, prescriptionType || 'Standard', diagnosis, medications, notesForPharmacist, 'Active']);
    const [prescription]: any = await connection.query(`
      SELECT 
        pr.*,
        p.id as patientId,
        p.name as patientName,
        p.gender as patientGender,
        p.dob as patientDob,
        d.id as doctorId,
        d.name as doctorName
      FROM prescriptions pr
      LEFT JOIN patients p ON pr.patientId = p.id
      LEFT JOIN doctors d ON pr.doctorId = d.id
      WHERE pr.patientId = ?
      ORDER BY pr.createdAt DESC
      LIMIT 1
    `, [patientId]);
    
    if (!prescription[0]) {
      connection.release();
      return res.status(500).json({ error: 'Failed to create prescription' });
    }
    
    const p = prescription[0];
    const formatted = {
      id: p.id,
      patientId: p.patientId,
      doctorId: p.doctorId,
      prescriptionType: p.prescriptionType,
      prescriptionDate: p.prescriptionDate,
      diagnosis: p.diagnosis,
      medications: p.medications,
      notesForPharmacist: p.notesForPharmacist,
      status: p.status,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      patient: p.patientId ? {
        id: p.patientId,
        name: p.patientName,
        gender: p.patientGender,
        dob: p.patientDob,
      } : null,
      doctor: p.doctorId ? {
        id: p.doctorId,
        name: p.doctorName,
      } : null,
    };
    
    connection.release();
    res.status(201).json(formatted);
  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({ error: 'Failed to create prescription' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { medications, diagnosis, notesForPharmacist, status } = req.body;
    const connection = await pool.getConnection();
    const updates: string[] = ['updatedAt = NOW()'];
    const values: any[] = [];
    if (medications) { updates.unshift('medications = ?'); values.push(medications); }
    if (diagnosis) { updates.unshift('diagnosis = ?'); values.push(diagnosis); }
    if (notesForPharmacist) { updates.unshift('notesForPharmacist = ?'); values.push(notesForPharmacist); }
    if (status) { updates.unshift('status = ?'); values.push(status); }
    values.push(req.params.id);
    await connection.query(`UPDATE prescriptions SET ${updates.join(', ')} WHERE id = ?`, values);
    const [prescription]: any = await connection.query(`
      SELECT 
        pr.*,
        p.id as patientId,
        p.name as patientName,
        p.gender as patientGender,
        p.dob as patientDob,
        d.id as doctorId,
        d.name as doctorName
      FROM prescriptions pr
      LEFT JOIN patients p ON pr.patientId = p.id
      LEFT JOIN doctors d ON pr.doctorId = d.id
      WHERE pr.id = ?
    `, [req.params.id]);
    
    if (!prescription[0]) {
      connection.release();
      return res.status(500).json({ error: 'Prescription not found' });
    }
    
    const p = prescription[0];
    const formatted = {
      id: p.id,
      patientId: p.patientId,
      doctorId: p.doctorId,
      prescriptionType: p.prescriptionType,
      prescriptionDate: p.prescriptionDate,
      diagnosis: p.diagnosis,
      medications: p.medications,
      notesForPharmacist: p.notesForPharmacist,
      status: p.status,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      patient: p.patientId ? {
        id: p.patientId,
        name: p.patientName,
        gender: p.patientGender,
        dob: p.patientDob,
      } : null,
      doctor: p.doctorId ? {
        id: p.doctorId,
        name: p.doctorName,
      } : null,
    };
    
    connection.release();
    res.json(formatted);
  } catch (error) {
    console.error('Error updating prescription:', error);
    res.status(500).json({ error: 'Failed to update prescription' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM prescriptions WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Prescription deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete prescription' });
  }
});

export default router;
