import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

// Seed data if empty
async function seedConsents() {
  const connection = await pool.getConnection();
  try {
    const [countRows]: any = await connection.query('SELECT COUNT(*) as count FROM consent_forms');
    if (countRows[0].count === 0) {
      console.log('Seeding dummy consent forms...');
      const [patients]: any = await connection.query('SELECT id FROM patients LIMIT 20');
      if (patients.length === 0) return;

      const formTypes = ['General Treatment Consent', 'Surgery Consent', 'Privacy & Data Consent (HIPAA)', 'Anesthesia Consent', 'Telehealth Consent'];
      const statuses = ['Signed', 'Pending', 'Expired', 'Rejected'];
      
      for (let i = 0; i < 60; i++) {
        const patient = patients[Math.floor(Math.random() * patients.length)];
        const formName = formTypes[Math.floor(Math.random() * formTypes.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const formId = `#CN-${23450 + i}`;
        
        const signedDate = status === 'Signed' || status === 'Expired' ? new Date(Date.now() - Math.random() * 10000000000) : null;
        const expiryDate = signedDate ? new Date(signedDate.getTime() + 31536000000) : null; // 1 year later
        
        await connection.query(
          `INSERT INTO consent_forms (id, formId, formName, version, patientId, signedDate, expiryDate, signedBy, status, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            `cuid_${Math.random().toString(36).substring(7)}`,
            formId,
            formName,
            `${Math.floor(Math.random() * 4) + 1}.${Math.floor(Math.random() * 9)}`,
            patient.id,
            signedDate,
            expiryDate,
            status === 'Signed' ? (Math.random() > 0.5 ? 'Patient (Digital)' : 'Dr. A. Smith') : null,
            status
          ]
        );
      }

      // Add audit logs
      const [forms]: any = await connection.query('SELECT id, formName FROM consent_forms');
      for (const form of forms) {
        const createTime = new Date(Date.now() - 1000000000);
        await connection.query(
          `INSERT INTO consent_audit_logs (id, consentFormId, action, timestamp) VALUES (?, ?, ?, ?)`,
          [`cuid_log_${Math.random().toString(36).substring(7)}`, form.id, 'Created by System (Admin)', createTime]
        );
        await connection.query(
          `INSERT INTO consent_audit_logs (id, consentFormId, action, timestamp) VALUES (?, ?, ?, ?)`,
          [`cuid_log_${Math.random().toString(36).substring(7)}`, form.id, 'Sent to Patient (Email)', new Date(createTime.getTime() + 60000)]
        );
        if (Math.random() > 0.3) {
            await connection.query(
            `INSERT INTO consent_audit_logs (id, consentFormId, action, timestamp) VALUES (?, ?, ?, ?)`,
            [`cuid_log_${Math.random().toString(36).substring(7)}`, form.id, 'Viewed by Patient (IP: 192.168.1.1)', new Date(createTime.getTime() + 300000)]
            );
        }
      }
      console.log('Seeding complete.');
    }
  } catch (e) {
    console.error('Error seeding consents:', e);
  } finally {
    connection.release();
  }
}

// Run seeder asynchronously
seedConsents();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 25, search, patientId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const connection = await pool.getConnection();
    
    let query = `
      SELECT 
        c.*, 
        p.name as patientName, 
        p.id as patientUHID 
      FROM consent_forms c 
      JOIN patients p ON c.patientId = p.id
      WHERE 1=1
    `;
    const params: any[] = [];
    
    if (patientId) {
      query += ` AND p.id = ?`;
      params.push(patientId);
    }

    if (search) {
      query += ` AND (c.formId LIKE ? OR c.formName LIKE ? OR p.name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    query += ` ORDER BY c.createdAt DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(skip));
    
    const [forms]: any = await connection.query(query, params);
    
    // Count total
    let countQuery = `SELECT COUNT(*) as count FROM consent_forms c JOIN patients p ON c.patientId = p.id WHERE 1=1`;
    const countParams: any[] = [];

    if (patientId) {
      countQuery += ` AND p.id = ?`;
      countParams.push(patientId);
    }

    if (search) {
      countQuery += ` AND (c.formId LIKE ? OR c.formName LIKE ? OR p.name LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    const [countRows]: any = await connection.query(countQuery, countParams);
    
    connection.release();
    
    res.json({
      success: true,
      forms,
      total: countRows[0].count
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch consent forms', details: error.message });
  }
});

router.get('/:id/audit', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [logs]: any = await connection.query(
      `SELECT * FROM consent_audit_logs WHERE consentFormId = ? ORDER BY timestamp ASC`,
      [req.params.id]
    );
    connection.release();
    
    res.json({ success: true, logs });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch audit logs', details: error.message });
  }
});

export default router;
