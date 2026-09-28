import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

// Seed data if empty
async function seedDocuments() {
  const connection = await pool.getConnection();
  try {
    const [countRows]: any = await connection.query('SELECT COUNT(*) as count FROM patient_documents');
    if (countRows[0].count === 0) {
      console.log('Seeding dummy patient documents...');
      const [patients]: any = await connection.query('SELECT id FROM patients LIMIT 20');
      if (patients.length === 0) return;

      const dummyDocs = [
        { name: 'Aadhaar Card.pdf', cat: 'Identity Proof', type: 'PDF', by: 'Receptionist', size: '1.2 MB', tags: 'Identity, KYC' },
        { name: 'Passport Size Photo.jpg', cat: 'Photo', type: 'Image', by: 'Receptionist', size: '245 KB', tags: 'Photo' },
        { name: 'Insurance Card.pdf', cat: 'Insurance', type: 'PDF', by: 'Insurance Dept.', size: '1.5 MB', tags: 'Insurance' },
        { name: 'Prescription - Dr. Amit Verma.pdf', cat: 'Prescription', type: 'PDF', by: 'Dr. Amit Verma', size: '980 KB', tags: 'Prescription' },
        { name: 'Lab Report - Blood Test.pdf', cat: 'Lab Report', type: 'PDF', by: 'Lab Technician', size: '750 KB', tags: 'Lab' },
        { name: 'X-Ray Chest PA View.pdf', cat: 'Radiology', type: 'PDF', by: 'Radiology Dept.', size: '1.8 MB', tags: 'X-Ray' },
        { name: 'Discharge Summary.pdf', cat: 'Discharge', type: 'PDF', by: 'Dr. Amit Verma', size: '1.1 MB', tags: 'Summary' },
        { name: 'Consent Form - Surgery.pdf', cat: 'Consent', type: 'PDF', by: 'Receptionist', size: '600 KB', tags: 'Consent' },
        { name: 'ECG Report.pdf', cat: 'Cardiology', type: 'PDF', by: 'Cardiology Dept.', size: '1.0 MB', tags: 'ECG' },
        { name: 'Blood Group Report.pdf', cat: 'Lab Report', type: 'PDF', by: 'Lab Technician', size: '540 KB', tags: 'Blood Test' },
        { name: 'profile_photo_current.jpg', cat: 'Profile Photo', type: 'Image', by: 'Receptionist', size: '145 KB', tags: 'Profile', status: 'Current' },
        { name: 'profile_photo_prev1.jpg', cat: 'Profile Photo', type: 'Image', by: 'Receptionist', size: '132 KB', tags: 'Profile', status: 'Previous' },
        { name: 'profile_photo_prev2.jpg', cat: 'Profile Photo', type: 'Image', by: 'Admin', size: '128 KB', tags: 'Profile', status: 'Previous' }
      ];
      
      for (const p of patients) {
          for (let i = 0; i < dummyDocs.length; i++) {
            const doc = dummyDocs[i];
            const date = new Date(Date.now() - Math.random() * 31536000000);
            await connection.query(
              `INSERT INTO patient_documents (id, documentType, fileName, patientId, dateOfService, source, status, version, actions, category, fileSize, uploadedBy, tags, description, createdAt, updatedAt) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
              [
                `cuid_doc_${Math.random().toString(36).substring(7)}`,
                doc.type,
                doc.name,
                p.id,
                date,
                doc.by, // source
                doc.status || 'Final',
                '1.0',
                JSON.stringify(['View', 'Download']),
                doc.cat,
                doc.size,
                doc.by, // uploadedBy
                doc.tags,
                'Auto-generated dummy document',
              ]
            );
          }
      }

      console.log('Seeding complete.');
    }
  } catch (e) {
    console.error('Error seeding patient documents:', e);
  } finally {
    connection.release();
  }
}

// Run seeder asynchronously
seedDocuments();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 25, search, type, status, patientId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const connection = await pool.getConnection();
    
    let query = `
      SELECT 
        d.*, 
        p.name as patientName, 
        p.id as patientUHID,
        p.gender as patientGender,
        p.dob as patientDob
      FROM patient_documents d 
      JOIN patients p ON d.patientId = p.id
      WHERE 1=1
    `;
    const params: any[] = [];
    
    if (patientId) {
      query += ` AND p.id = ?`;
      params.push(patientId);
    }
    
    if (search) {
      query += ` AND (d.documentType LIKE ? OR d.fileName LIKE ? OR p.name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (type) {
      query += ` AND d.documentType = ?`;
      params.push(type);
    }
    if (status) {
      query += ` AND d.status = ?`;
      params.push(status);
    }
    
    query += ` ORDER BY d.createdAt DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(skip));
    
    const [documents]: any = await connection.query(query, params);
    
    // Count total
    let countQuery = `SELECT COUNT(*) as count FROM patient_documents d JOIN patients p ON d.patientId = p.id WHERE 1=1`;
    const countParams: any[] = [];
    if (patientId) {
      countQuery += ` AND p.id = ?`;
      countParams.push(patientId);
    }
    if (search) {
      countQuery += ` AND (d.documentType LIKE ? OR d.fileName LIKE ? OR p.name LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (type) {
      countQuery += ` AND d.documentType = ?`;
      countParams.push(type);
    }
    if (status) {
      countQuery += ` AND d.status = ?`;
      countParams.push(status);
    }
    
    const [countRows]: any = await connection.query(countQuery, countParams);
    
    connection.release();
    
    res.json({
      success: true,
      documents,
      total: countRows[0].count
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch patient documents', details: error.message });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { documentType, fileName, patientId, dateOfService, source } = req.body;
    
    const connection = await pool.getConnection();
    const id = `cuid_doc_${Math.random().toString(36).substring(7)}`;
    
    await connection.query(
      `INSERT INTO patient_documents (id, documentType, fileName, patientId, dateOfService, source, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [id, documentType, fileName, patientId, new Date(dateOfService), source]
    );
    
    connection.release();
    
    res.status(201).json({ success: true, message: 'Document added successfully', id });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to add document', details: error.message });
  }
});

export default router;
