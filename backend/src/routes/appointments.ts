import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

// Helper to generate sequential token per doctor per day
const getNextTokenNumber = async (connection: any, doctorId: string, date: string): Promise<string> => {
  const query = 'SELECT COUNT(*) as count FROM appointments WHERE doctorId = ? AND DATE(date) = DATE(?)';
  const [rows]: any = await connection.query(query, [doctorId, new Date(date)]);
  const count = rows[0].count;
  
  // Get doctor's specialization to create a professional prefix (e.g., CARD-001)
  const [doc]: any = await connection.query('SELECT specialization FROM doctors WHERE id = ?', [doctorId]);
  const spec = doc[0]?.specialization || 'GEN';
  const code = spec.trim().split(' ')[0].slice(0, 4).toUpperCase(); // e.g. Cardiology -> CARD
  
  return `${code}-${String(count + 1).padStart(3, '0')}`;
};

router.post('/create', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role === 'doctor' || req.user?.doctorId) {
      return res.status(403).json({ error: 'Access denied: Doctors are not authorized to create appointments.' });
    }

    const { doctorId, patientId, date, time, roomId, notes, department, visitType } = req.body;

    const targetDoctorId = doctorId;

    if (!targetDoctorId || !patientId || !date || !time) {
      return res.status(400).json({ error: 'Missing required fields: doctorId, patientId, date, time' });
    }

    const connection = await pool.getConnection();
    
    // Auto-generate token number sequentially per doctor per day
    const token = await getNextTokenNumber(connection, targetDoctorId, date);
    const appointmentStatus = 'Scheduled'; // Force status to Scheduled for new bookings

    const query = `INSERT INTO appointments (id, doctorId, patientId, date, time, roomId, tokenNumber, status, notes, department, visitType, createdAt, updatedAt)
                   VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    
    await connection.query(query, [targetDoctorId, patientId, new Date(date), time, roomId || null, token, appointmentStatus, notes || null, department || null, visitType || null]);

    const [appointment]: any = await connection.query(
      `SELECT a.*, d.name as doctorName, d.specialization, p.name as patientName 
       FROM appointments a 
       LEFT JOIN doctors d ON a.doctorId = d.id
       LEFT JOIN patients p ON a.patientId = p.id
       WHERE a.doctorId = ? AND a.patientId = ? ORDER BY a.createdAt DESC LIMIT 1`,
      [targetDoctorId, patientId]
    );
    connection.release();

    res.status(201).json({ 
      success: true, 
      appointment: appointment[0],
      message: 'Appointment created successfully'
    });
  } catch (error: any) {
    console.error('[APPOINTMENTS CREATE] Error:', error);
    res.status(500).json({ error: 'Failed to create appointment', details: error.message });
  }
});

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, status, doctorId, patientId, startDate, endDate } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let targetDoctorId = doctorId;
    if (req.user?.role === 'doctor' || req.user?.doctorId) {
      targetDoctorId = req.user.doctorId;
    }

    let query = `SELECT 
                  a.id, a.doctorId, a.patientId, a.date, a.time, a.roomId, a.tokenNumber, a.status, a.notes, 
                  a.department, a.visitType, a.createdAt, a.updatedAt,
                  d.name as doctorName,
                  p.name as patientName, p.email as patientEmail, p.phone as patientPhone,
                  (SELECT status FROM records WHERE appointmentId = a.id AND type = 'Lab Test' LIMIT 1) as labTestStatus,
                  (SELECT status FROM records WHERE appointmentId = a.id AND type = 'Admission Request' LIMIT 1) as admissionStatus,
                  (SELECT status FROM prescriptions WHERE appointmentId = a.id LIMIT 1) as prescriptionStatus
                FROM appointments a
                LEFT JOIN doctors d ON a.doctorId = d.id
                LEFT JOIN patients p ON a.patientId = p.id
                WHERE 1=1`;
    const params: any[] = [];

    if (status) {
      query += ' AND a.status = ?';
      params.push(String(status));
    }

    if (targetDoctorId) {
      query += ' AND a.doctorId = ?';
      params.push(String(targetDoctorId));
    }

    if (patientId) {
      query += ' AND a.patientId = ?';
      params.push(String(patientId));
    }

    if (startDate) {
      query += ' AND a.date >= ?';
      params.push(new Date(String(startDate)));
    }

    if (endDate) {
      query += ' AND a.date <= ?';
      params.push(new Date(String(endDate)));
    }

    const countParams = params.slice();
    query += ' ORDER BY a.date DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), skip);

    const connection = await pool.getConnection();
    
    const [appointments]: any = await connection.query(query, params);
    
    let countSql = `SELECT COUNT(*) as total FROM appointments a
                   LEFT JOIN doctors d ON a.doctorId = d.id
                   LEFT JOIN patients p ON a.patientId = p.id
                   WHERE 1=1`;
    if (status) {
      countSql += ' AND a.status = ?';
    }
    if (targetDoctorId) {
      countSql += ' AND a.doctorId = ?';
    }
    if (patientId) {
      countSql += ' AND a.patientId = ?';
    }
    if (startDate) {
      countSql += ' AND a.date >= ?';
    }
    if (endDate) {
      countSql += ' AND a.date <= ?';
    }
    
    const result: any = await connection.query(countSql, countParams);
    const total = result[0][0].total;
    
    connection.release();

    const formattedAppointments = appointments.map((apt: any) => ({
      ...apt,
      patient: {
        id: apt.patientId,
        name: apt.patientName || 'Unknown',
        email: apt.patientEmail || null,
        phone: apt.patientPhone || null
      },
      doctor: {
        id: apt.doctorId,
        name: apt.doctorName || 'Unassigned'
      }
    }));

    res.json({ appointments: formattedAppointments, total, page: Number(page), limit: Number(limit) });
  } catch (error: any) {
    console.error('[APPOINTMENTS GET] Error:', error);
    res.status(500).json({ error: 'Failed to fetch appointments', details: error.message });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const query = `
      SELECT a.*, d.name as doctorName, d.specialization, p.name as patientName,
             (SELECT status FROM prescriptions WHERE appointmentId = a.id LIMIT 1) as prescriptionStatus
      FROM appointments a
      LEFT JOIN doctors d ON a.doctorId = d.id
      LEFT JOIN patients p ON a.patientId = p.id
      WHERE a.id = ?
    `;
    const [appointments]: any = await connection.query(query, [req.params.id]);
    connection.release();

    if (appointments.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if ((req.user?.role === 'doctor' || req.user?.doctorId) && appointments[0].doctorId !== req.user.doctorId) {
      return res.status(403).json({ error: 'Access denied: You are not authorized to view this appointment.' });
    }

    res.json(appointments[0]);
  } catch (error: any) {
    console.error('[APPOINTMENTS GET BY ID] Error:', error);
    res.status(500).json({ error: 'Failed to fetch appointment', details: error.message });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role === 'doctor' || req.user?.doctorId) {
      return res.status(403).json({ error: 'Access denied: Doctors are not authorized to create appointments.' });
    }

    const { doctorId, patientId, date, time, roomId, notes, department, visitType } = req.body;

    const targetDoctorId = doctorId;

    const connection = await pool.getConnection();
    
    // Auto-generate token number sequentially per doctor per day
    const token = await getNextTokenNumber(connection, targetDoctorId, date);
    const appointmentStatus = 'Scheduled'; // Force status to Scheduled for new bookings

    const query = `INSERT INTO appointments (id, doctorId, patientId, date, time, roomId, tokenNumber, status, notes, department, visitType, createdAt, updatedAt)
                   VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    
    await connection.query(query, [targetDoctorId, patientId, new Date(date), time, roomId || null, token, appointmentStatus, notes || null, department || null, visitType || null]);

    const [appointment]: any = await connection.query('SELECT * FROM appointments WHERE doctorId = ? AND patientId = ? ORDER BY createdAt DESC LIMIT 1', [targetDoctorId, patientId]);
    connection.release();

    res.status(201).json(appointment[0]);
  } catch (error: any) {
    console.error('[APPOINTMENTS POST] Error:', error);
    res.status(500).json({ error: 'Failed to create appointment', details: error.message });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { doctorId, patientId, date, time, roomId, tokenNumber, status, notes, department, visitType } = req.body;
    const connection = await pool.getConnection();

    const [existing]: any = await connection.query('SELECT doctorId FROM appointments WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Appointment not found' });
    }
    if ((req.user?.role === 'doctor' || req.user?.doctorId) && existing[0].doctorId !== req.user.doctorId) {
      connection.release();
      return res.status(403).json({ error: 'Access denied: You cannot edit another doctor\'s appointment.' });
    }
    
    const updates: string[] = [];
    const values: any[] = [];

    if (doctorId) { updates.push('doctorId = ?'); values.push(doctorId); }
    if (patientId) { updates.push('patientId = ?'); values.push(patientId); }
    if (date) { updates.push('date = ?'); values.push(new Date(date)); }
    if (time) { updates.push('time = ?'); values.push(time); }
    if (roomId !== undefined) { updates.push('roomId = ?'); values.push(roomId || null); }
    if (tokenNumber !== undefined) { updates.push('tokenNumber = ?'); values.push(tokenNumber || null); }
    if (status) { updates.push('status = ?'); values.push(status); }
    if (notes !== undefined) { updates.push('notes = ?'); values.push(notes); }
    if (department !== undefined) { updates.push('department = ?'); values.push(department || null); }
    if (visitType !== undefined) { updates.push('visitType = ?'); values.push(visitType || null); }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updatedAt = NOW()');
    values.push(req.params.id);

    const query = `UPDATE appointments SET ${updates.join(', ')} WHERE id = ?`;
    const result = await connection.query(query, values);
    
    if ((result[0] as any).affectedRows === 0) {
      connection.release();
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const [appointment]: any = await connection.query('SELECT * FROM appointments WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(appointment[0]);
  } catch (error: any) {
    console.error('[APPOINTMENTS PUT] Error:', error);
    res.status(500).json({ error: 'Failed to update appointment', details: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [existing]: any = await connection.query('SELECT doctorId FROM appointments WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Appointment not found' });
    }
    if ((req.user?.role === 'doctor' || req.user?.doctorId) && existing[0].doctorId !== req.user.doctorId) {
      connection.release();
      return res.status(403).json({ error: 'Access denied: You cannot delete another doctor\'s appointment.' });
    }

    const result = await connection.query('DELETE FROM appointments WHERE id = ?', [req.params.id]);
    connection.release();

    if ((result[0] as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error: any) {
    console.error('[APPOINTMENTS DELETE] Error:', error);
    res.status(500).json({ error: 'Failed to delete appointment', details: error.message });
  }
});

router.post('/:id/complete', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const appointmentId = req.params.id;
    const {
      symptoms,
      diagnosis,
      observations,
      advice,
      prescriptions, // Array of { name, dosage, duration, instructions }
      labTestsActive, // boolean
      labTests, // Array of strings (e.g. ['Blood Test', 'X-Ray'])
      otherLabTests, // string
      followUpDate, // string
      admissionRecommended, // boolean
      admissionNotes // string
    } = req.body;

    const doctorId = req.user?.doctorId;
    if (!doctorId) {
      return res.status(403).json({ error: 'Access denied: Only doctors can complete a consultation.' });
    }

    connection = await pool.getConnection();
    
    // 1. Fetch appointment to verify ownership and eligibility
    const [apts]: any = await connection.query(
      'SELECT a.*, p.name as patientName FROM appointments a LEFT JOIN patients p ON a.patientId = p.id WHERE a.id = ?',
      [appointmentId]
    );

    if (apts.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const appointment = apts[0];
    if (appointment.doctorId !== doctorId) {
      connection.release();
      return res.status(403).json({ error: 'Access denied: You are not authorized to complete this consultation.' });
    }

    if (appointment.status?.toLowerCase() === 'completed') {
      connection.release();
      return res.status(400).json({ error: 'This appointment has already been completed.' });
    }

    // Begin Transaction
    await connection.beginTransaction();

    // 2. Update appointment status and save structured notes
    const formattedNotesObj = {
      symptoms: symptoms || '',
      diagnosis: diagnosis || '',
      observations: observations || '',
      advice: advice || '',
      followUpDate: followUpDate || null,
      labTestsActive: !!labTestsActive,
      labTests: labTests || [],
      otherLabTests: otherLabTests || '',
      labRequestSent: false,
      admissionRecommended: !!admissionRecommended,
      admissionNotes: admissionNotes || '',
      admissionRequestSent: false,
      priority: req.body.priority || 'Routine',
      requestedDepartment: req.body.requestedDepartment || '',
      recommendedRoomType: req.body.recommendedRoomType || 'General',
      admissionReason: req.body.admissionReason || '',
      clinicalNotes: req.body.clinicalNotes || req.body.admissionNotes || ''
    };

    // Save notes as JSON so we can easily parse it in the consultation view
    const notesJson = JSON.stringify(formattedNotesObj);

    await connection.query(
      'UPDATE appointments SET status = ?, notes = ?, updatedAt = NOW() WHERE id = ?',
      ['Completed', notesJson, appointmentId]
    );

    // 3. Create prescription if medicines were added
    if (prescriptions && Array.isArray(prescriptions) && prescriptions.length > 0) {
      const medicationsStr = JSON.stringify(prescriptions);
      // Generate standard prescription
      await connection.query(
        `INSERT INTO prescriptions (id, patientId, doctorId, prescriptionType, diagnosis, medications, notesForPharmacist, prescriptionDate, status, appointmentId, createdAt, updatedAt)
         VALUES (UUID(), ?, ?, ?, ?, ?, ?, NOW(), 'Active', ?, NOW(), NOW())`,
        [appointment.patientId, doctorId, admissionRecommended ? 'IPD' : 'OPD', diagnosis || 'Consultation Summary', medicationsStr, advice || '', appointmentId]
      );
    }

    // Commit Transaction
    await connection.commit();
    connection.release();

    res.json({
      success: true,
      message: 'Consultation completed successfully, and appointment marked as Completed.',
      appointmentId
    });

  } catch (error: any) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error('[APPOINTMENTS COMPLETE] Error:', error);
    res.status(500).json({ error: 'Failed to complete consultation', details: error.message });
  }
});

router.post('/:id/send-lab-request', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const appointmentId = req.params.id;
    const doctorId = req.user?.doctorId;
    if (!doctorId) {
      return res.status(403).json({ error: 'Access denied: Only doctors can send test requests.' });
    }

    connection = await pool.getConnection();
    const [apts]: any = await connection.query(
      'SELECT a.*, p.name as patientName FROM appointments a LEFT JOIN patients p ON a.patientId = p.id WHERE a.id = ?',
      [appointmentId]
    );

    if (apts.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const appointment = apts[0];
    if (appointment.doctorId !== doctorId) {
      connection.release();
      return res.status(403).json({ error: 'Access denied: You are not authorized to send requests for this encounter.' });
    }

    let notesObj: any = {};
    try {
      notesObj = JSON.parse(appointment.notes || '{}');
    } catch (e) {
      connection.release();
      return res.status(400).json({ error: 'No structured consultation notes found for this appointment.' });
    }

    if (notesObj.labRequestSent) {
      connection.release();
      return res.status(400).json({ error: 'Laboratory request has already been sent.' });
    }

    const labTests = notesObj.labTests || [];
    const otherLabTests = notesObj.otherLabTests || "";

    // Begin Transaction
    await connection.beginTransaction();

    // Create record
    const testsCombined = [...labTests];
    if (otherLabTests && otherLabTests.trim() !== '') {
      testsCombined.push(otherLabTests.trim());
    }
    const detailsStr = `Recommended Laboratory Tests: ${testsCombined.join(', ')}`;
    
    await connection.query(
      `INSERT INTO records (id, type, patientName, date, details, status, appointmentId, patientId, doctorId, createdAt, updatedAt)
       VALUES (UUID(), 'Lab Test', ?, NOW(), ?, 'Pending', ?, ?, ?, NOW(), NOW())`,
      [appointment.patientName || 'Unknown Patient', detailsStr, appointmentId, appointment.patientId, doctorId]
    );

    // Fetch doctor's name to personalize the notification
    const [doctors]: any = await connection.query('SELECT name FROM doctors WHERE id = ?', [doctorId]);
    const doctorName = doctors[0]?.name || 'Attending Doctor';

    // Dispatch notification to Laboratory department
    const notifMsg = `A new laboratory test request has been submitted for patient ${appointment.patientName || 'Unknown Patient'} by Dr. ${doctorName}.`;
    await connection.query(
      `INSERT INTO notifications (id, title, message, type, senderId, senderName, department, isRead, createdAt, updatedAt)
       VALUES (UUID(), 'New Laboratory Request', ?, 'info', ?, ?, 'laboratory', 0, NOW(3), NOW(3))`,
      [notifMsg, req.user?.id || null, `Dr. ${doctorName}`]
    );

    // Update notes JSON
    notesObj.labRequestSent = true;
    const updatedNotesJson = JSON.stringify(notesObj);

    await connection.query(
      'UPDATE appointments SET notes = ?, updatedAt = NOW() WHERE id = ?',
      [updatedNotesJson, appointmentId]
    );

    await connection.commit();
    connection.release();

    res.json({ success: true, message: 'Laboratory test request successfully sent to Laboratory department.' });
  } catch (error: any) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error('[APPOINTMENTS SEND LAB] Error:', error);
    res.status(500).json({ error: 'Failed to send laboratory request', details: error.message });
  }
});

router.post('/:id/send-admission-request', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const appointmentId = req.params.id;
    const doctorId = req.user?.doctorId;
    if (!doctorId) {
      return res.status(403).json({ error: 'Access denied: Only doctors can send admission requests.' });
    }

    connection = await pool.getConnection();
    const [apts]: any = await connection.query(
      'SELECT a.*, p.name as patientName FROM appointments a LEFT JOIN patients p ON a.patientId = p.id WHERE a.id = ?',
      [appointmentId]
    );

    if (apts.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const appointment = apts[0];
    if (appointment.doctorId !== doctorId) {
      connection.release();
      return res.status(403).json({ error: 'Access denied: You are not authorized to send requests for this encounter.' });
    }

    let notesObj: any = {};
    try {
      notesObj = JSON.parse(appointment.notes || '{}');
    } catch (e) {
      connection.release();
      return res.status(400).json({ error: 'No structured consultation notes found.' });
    }

    if (notesObj.admissionRequestSent) {
      connection.release();
      return res.status(400).json({ error: 'Admission request has already been sent.' });
    }

    // Begin Transaction
    await connection.beginTransaction();

    // Fetch doctor's name to personalize the notification
    const [doctors]: any = await connection.query('SELECT name FROM doctors WHERE id = ?', [doctorId]);
    const doctorName = doctors[0]?.name || 'Attending Doctor';

    const priority = notesObj.priority || 'Routine';
    const requestedDepartment = notesObj.requestedDepartment || '';
    const recommendedRoomType = notesObj.recommendedRoomType || 'General';
    const admissionReason = notesObj.admissionReason || '';
    const clinicalNotes = notesObj.clinicalNotes || notesObj.admissionNotes || '';

    // Create record JSON details
    const detailsJson = JSON.stringify({
      priority,
      requestedDepartment,
      recommendedRoomType,
      admissionReason,
      clinicalNotes,
      attendingDoctorName: doctorName,
      attendingDoctorId: doctorId,
      appointmentId
    });

    // Create record with 'Pending Review' status
    await connection.query(
      `INSERT INTO records (id, type, patientName, date, details, status, appointmentId, patientId, doctorId, createdAt, updatedAt)
       VALUES (UUID(), 'Admission Request', ?, NOW(), ?, 'Pending Review', ?, ?, ?, NOW(), NOW())`,
      [appointment.patientName || 'Unknown Patient', detailsJson, appointmentId, appointment.patientId, doctorId]
    );

    // Dispatch notification to Receptionist department
    const notifMsg = `Emergency Admission Request submitted for patient ${appointment.patientName || 'Unknown Patient'} by Dr. ${doctorName}.`;
    await connection.query(
      `INSERT INTO notifications (id, title, message, type, senderId, senderName, department, isRead, createdAt, updatedAt)
       VALUES (UUID(), 'Emergency Admission Request', ?, 'warning', ?, ?, 'receptionist', 0, NOW(3), NOW(3))`,
      [notifMsg, req.user?.id || null, `Dr. ${doctorName}`]
    );

    // Update notes JSON
    notesObj.admissionRequestSent = true;
    const updatedNotesJson = JSON.stringify(notesObj);

    await connection.query(
      'UPDATE appointments SET notes = ?, updatedAt = NOW() WHERE id = ?',
      [updatedNotesJson, appointmentId]
    );

    await connection.commit();
    connection.release();

    res.json({ success: true, message: 'Emergency Admission Request successfully sent to Receptionist.' });
  } catch (error: any) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error('[APPOINTMENTS SEND ADMISSION] Error:', error);
    res.status(500).json({ error: 'Failed to send admission request', details: error.message });
  }
});

export default router;
