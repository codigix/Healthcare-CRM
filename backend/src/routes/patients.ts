import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/search', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ error: 'Patient name is required' });
    }

    const connection = await pool.getConnection();
    
    let query = `SELECT 
                    p.*,
                    (SELECT a.date FROM appointments a WHERE a.patientId = p.id ORDER BY a.date DESC, a.time DESC LIMIT 1) as lastVisitDate,
                    (SELECT d.name FROM appointments a JOIN doctors d ON a.doctorId = d.id WHERE a.patientId = p.id ORDER BY a.date DESC, a.time DESC LIMIT 1) as lastVisitedDoctor,
                    (SELECT d.specialization FROM appointments a JOIN doctors d ON a.doctorId = d.id WHERE a.patientId = p.id ORDER BY a.date DESC, a.time DESC LIMIT 1) as lastVisitedDepartment
                  FROM patients p
                  WHERE LOWER(p.name) LIKE LOWER(?)`;
    const params: any[] = [`%${String(name)}%`];

    if (req.user?.role === 'doctor' || req.user?.doctorId) {
      const docId = req.user.doctorId;
      query += ` AND (p.doctorId = ? OR p.id IN (SELECT DISTINCT patientId FROM appointments WHERE doctorId = ?) OR p.id IN (SELECT DISTINCT patientId FROM prescriptions WHERE doctorId = ?))`;
      params.push(docId, docId, docId);
    }

    query += ` ORDER BY p.createdAt DESC LIMIT 10`;
    
    const [patients]: any = await connection.query(query, params);
    connection.release();

    if (patients.length === 0) {
      return res.status(404).json({ error: 'Patient not found', patients: [] });
    }

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

    const enrichedPatients = patients.map((patient: any) => ({
      ...patient,
      age: calculateAge(patient.dob),
      lastVisit: patient.lastVisitDate ? formatDate(patient.lastVisitDate) : null,
      medicalHistory: patient.history || null,
      doctor: patient.lastVisitedDoctor || null,
      doctorSpecialty: patient.lastVisitedDepartment || null,
    }));

    res.json({ success: true, patients: enrichedPatients });
  } catch (error: any) {
    console.error('[PATIENTS SEARCH] Error:', error);
    res.status(500).json({ error: 'Failed to search patients', details: error.message });
  }
});

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const params: any[] = [];
    let whereClause = ' WHERE 1=1';

    if (search) {
      whereClause += ' AND (p.name LIKE ? OR p.email LIKE ? OR p.phone LIKE ?)';
      const searchTerm = `%${String(search)}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (req.user?.role === 'doctor' || req.user?.doctorId) {
      const docId = req.user.doctorId;
      whereClause += ` AND (p.doctorId = ? OR p.id IN (SELECT DISTINCT patientId FROM appointments WHERE doctorId = ?) OR p.id IN (SELECT DISTINCT patientId FROM prescriptions WHERE doctorId = ?))`;
      params.push(docId, docId, docId);
    }

    const countParams = params.slice();
    
    let query = `SELECT 
                  p.*, 
                  (SELECT a.date FROM appointments a WHERE a.patientId = p.id ORDER BY a.date DESC, a.time DESC LIMIT 1) as lastVisitDate,
                  (SELECT d.name FROM appointments a JOIN doctors d ON a.doctorId = d.id WHERE a.patientId = p.id ORDER BY a.date DESC, a.time DESC LIMIT 1) as lastVisitedDoctor,
                  (SELECT d.specialization FROM appointments a JOIN doctors d ON a.doctorId = d.id WHERE a.patientId = p.id ORDER BY a.date DESC, a.time DESC LIMIT 1) as lastVisitedDepartment
                FROM patients p
                ${whereClause}`;

    const countQuery = `SELECT COUNT(DISTINCT p.id) as total FROM patients p ${whereClause}`;
    
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
        status: patient.status || 'Active',
        lastVisit: patient.lastVisitDate ? formatDate(patient.lastVisitDate) : null,
        condition: patient.history || null,
        doctor: patient.lastVisitedDoctor || null,
        doctorSpecialty: patient.lastVisitedDepartment || null,
      };
    });

    res.json({ patients: enrichedPatients, total, page: Number(page), limit: Number(limit) });
  } catch (error: any) {
    console.error('[PATIENTS GET] Error:', error);
    res.status(500).json({ error: 'Failed to fetch patients', details: error.message });
  }
});

router.get('/registration-meta', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Recent 4 registrations
        const recentRegistrations = await prisma.patient.findMany({
            take: 4,
            orderBy: { createdAt: 'desc' },
            select: { id: true, name: true, patientType: true, createdAt: true }
        });

        // Footer stats
        const todaysReg = await prisma.patient.count({ where: { createdAt: { gte: today, lt: tomorrow } } });
        const opdReg = await prisma.patient.count({ where: { createdAt: { gte: today, lt: tomorrow }, patientType: 'OPD' } });
        const emergencyReg = await prisma.patient.count({ where: { createdAt: { gte: today, lt: tomorrow }, patientType: 'Emergency' } });
        const ipdAdmissions = await prisma.roomAllotment.count({ where: { allotmentDate: { gte: today, lt: tomorrow } } });
        
        // Mock returning/new patients for today
        const returningPatients = Math.floor(todaysReg * 0.3);
        const newPatients = todaysReg - returningPatients;
        const returningPercent = todaysReg ? ((returningPatients / todaysReg) * 100).toFixed(1) : 0;
        const newPercent = todaysReg ? ((newPatients / todaysReg) * 100).toFixed(1) : 0;

        res.json({
            recentRegistrations,
            footerStats: {
                today: todaysReg,
                opd: opdReg,
                ipd: ipdAdmissions,
                emergency: emergencyReg,
                returning: { count: returningPatients, percent: returningPercent },
                new: { count: newPatients, percent: newPercent }
            }
        });
    } catch (error: any) {
        console.error('[PATIENTS META] Error:', error);
        res.status(500).json({ error: 'Failed to fetch registration meta', details: error.message });
    }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [patients]: any = await connection.query('SELECT * FROM patients WHERE id = ?', [req.params.id]);

    if (patients.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Patient not found' });
    }

    if (req.user?.role === 'doctor' || req.user?.doctorId) {
      const docId = req.user.doctorId;
      const [hasAccess]: any = await connection.query(
        `SELECT id FROM patients 
         WHERE id = ? AND (
           doctorId = ? 
           OR id IN (SELECT DISTINCT patientId FROM appointments WHERE doctorId = ?) 
           OR id IN (SELECT DISTINCT patientId FROM prescriptions WHERE doctorId = ?)
         )`,
        [req.params.id, docId, docId, docId]
      );
      if (hasAccess.length === 0) {
        connection.release();
        return res.status(403).json({ error: 'Access denied: You are not authorized to view this patient\'s clinical record.' });
      }
    }

    connection.release();
    res.json(patients[0]);
  } catch (error: any) {
    console.error('[PATIENTS GET BY ID] Error:', error);
    res.status(500).json({ error: 'Failed to fetch patient', details: error.message });
  }
});

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role === 'doctor' || req.user?.doctorId) {
      return res.status(403).json({ error: 'Access denied: Doctors are not permitted to register patients. Patient profiles are created exclusively by the reception staff.' });
    }

    const data = req.body;
    
    // Auto-generate name if first/last are provided
    if (!data.name && (data.firstName || data.lastName)) {
        data.name = `${data.title ? data.title + ' ' : ''}${data.firstName || ''} ${data.lastName || ''}`.trim();
    }
    
    // Make sure dob is a date
    if (data.dob) {
        data.dob = new Date(data.dob);
    }
    if (data.policyValidTill) {
        data.policyValidTill = new Date(data.policyValidTill);
    }

    const newPatient = await prisma.patient.create({
        data: {
            name: data.name || "Unknown",
            email: data.email || `temp${Date.now()}@medixpro.com`,
            phone: data.phone || "0000000000",
            dob: data.dob || new Date(),
            gender: data.gender || "Unknown",
            address: data.address,
            bloodGroup: data.bloodGroup,
            status: data.status || "Active",
            firstName: data.firstName,
            middleName: data.middleName,
            lastName: data.lastName,
            title: data.title,
            maritalStatus: data.maritalStatus,
            nationality: data.nationality,
            religion: data.religion,
            language: data.language,
            photoUrl: data.photoUrl,
            isVip: data.isVip || false,
            patientType: data.patientType || "OPD",
            alternateMobile: data.alternateMobile,
            landline: data.landline,
            city: data.city,
            state: data.state,
            pincode: data.pincode,
            country: data.country,
            idProofType: data.idProofType,
            idProofNumber: data.idProofNumber,
            idProofUrl: data.idProofUrl,
            emergencyContactName: data.emergencyContactName,
            emergencyContactRel: data.emergencyContactRel,
            emergencyContactMobile: data.emergencyContactMobile,
            occupation: data.occupation,
            employerName: data.employerName,
            annualIncome: data.annualIncome,
            registrationType: data.registrationType,
            referredBy: data.referredBy,
            referralDoctor: data.referralDoctor,
            notes: data.notes,
            hasInsurance: data.hasInsurance || false,
            insuranceProvider: data.insuranceProvider,
            policyNumber: data.policyNumber,
            tpaName: data.tpaName,
            policyRelation: data.policyRelation,
            policyValidTill: data.policyValidTill,
            policyDocumentUrl: data.policyDocumentUrl
        }
    });

    res.status(201).json(newPatient);
  } catch (error: any) {
    console.error('[PATIENTS POST] Error:', error);
    res.status(500).json({ error: 'Failed to create patient', details: error.message });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role === 'doctor' || req.user?.doctorId) {
      return res.status(403).json({ error: 'Access denied: Doctors are not permitted to update patient profiles.' });
    }

    const { name, email, phone, dob, gender, address, history, bloodGroup, status } = req.body;
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
    if (bloodGroup !== undefined) { updates.push('bloodGroup = ?'); values.push(bloodGroup); }
    if (status !== undefined) { updates.push('status = ?'); values.push(status); }

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
    if (req.user?.role === 'doctor' || req.user?.doctorId) {
      return res.status(403).json({ error: 'Access denied: Doctors are not permitted to delete patient profiles.' });
    }

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
