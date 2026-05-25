import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/stats', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const docId = req.user?.doctorId;
    const isDoctor = req.user?.role === 'doctor';

    const [
      [[{ totalDoctors }]],
      [[{ totalPatients }]],
      [[{ totalAppointments }]],
      [[{ pendingAppointments }]],
      [[{ totalRevenue }]]
    ]: any = await Promise.all([
      pool.query('SELECT COUNT(*) as totalDoctors FROM doctors'),
      isDoctor 
        ? pool.query(
            `SELECT COUNT(DISTINCT p.id) as totalPatients FROM patients p 
             WHERE p.doctorId = ? 
             OR p.id IN (SELECT DISTINCT patientId FROM appointments WHERE doctorId = ?) 
             OR p.id IN (SELECT DISTINCT patientId FROM prescriptions WHERE doctorId = ?)`,
            [docId, docId, docId]
          )
        : pool.query('SELECT COUNT(*) as totalPatients FROM patients'),
      isDoctor
        ? pool.query('SELECT COUNT(*) as totalAppointments FROM appointments WHERE doctorId = ?', [docId])
        : pool.query('SELECT COUNT(*) as totalAppointments FROM appointments'),
      isDoctor
        ? pool.query('SELECT COUNT(*) as pendingAppointments FROM appointments WHERE doctorId = ? AND status = "pending"', [docId])
        : pool.query('SELECT COUNT(*) as pendingAppointments FROM appointments WHERE status = "pending"'),
      isDoctor
        ? pool.query('SELECT COALESCE(SUM(amount), 0) as totalRevenue FROM invoices WHERE status = "paid" AND patientId IN (SELECT DISTINCT patientId FROM appointments WHERE doctorId = ?)', [docId])
        : pool.query('SELECT COALESCE(SUM(amount), 0) as totalRevenue FROM invoices WHERE status = "paid"')
    ]);

    res.json({
      totalDoctors,
      totalPatients,
      totalAppointments,
      pendingAppointments,
      totalRevenue,
    });
  } catch (error: any) {
    console.error('[DASHBOARD STATS] Error:', error);
    res.status(500).json({ error: 'Failed to fetch stats', details: error.message });
  }
});

router.get('/recent-appointments', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    connection = await pool.getConnection();
    let query = `
      SELECT 
        a.id,
        a.date,
        a.status,
        a.notes,
        JSON_OBJECT('name', d.name) as doctor,
        JSON_OBJECT('name', p.name) as patient
      FROM appointments a
      LEFT JOIN doctors d ON a.doctorId = d.id
      LEFT JOIN patients p ON a.patientId = p.id
    `;
    const params: any[] = [];
    if (req.user?.role === 'doctor') {
      query += ' WHERE a.doctorId = ?';
      params.push(req.user.doctorId);
    }
    query += ' ORDER BY a.date DESC LIMIT 10';
    
    const [appointments]: any = await connection.query(query, params);

    res.json(appointments);
  } catch (error: any) {
    console.error('[DASHBOARD RECENT APPOINTMENTS] Error:', error);
    res.status(500).json({ error: 'Failed to fetch recent appointments', details: error.message });
  } finally {
    if (connection) connection.release();
  }
});

router.get('/revenue-chart', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    connection = await pool.getConnection();
    let query = `
      SELECT DATE_FORMAT(createdAt, '%b') as name, SUM(amount) as value 
      FROM invoices
    `;
    const params: any[] = [];
    if (req.user?.role === 'doctor') {
      query += ' WHERE patientId IN (SELECT DISTINCT patientId FROM appointments WHERE doctorId = ?)';
      params.push(req.user.doctorId);
    }
    query += `
      GROUP BY DATE_FORMAT(createdAt, '%Y-%m'), DATE_FORMAT(createdAt, '%b')
      ORDER BY DATE_FORMAT(createdAt, '%Y-%m') ASC
    `;
    const [results]: any = await connection.query(query, params);

    const chartData = results.map((row: any) => ({ name: row.name, value: Number(row.value) }));

    res.json(chartData);
  } catch (error: any) {
    console.error('[DASHBOARD REVENUE CHART] Error:', error);
    res.status(500).json({ error: 'Failed to fetch revenue chart', details: error.message });
  } finally {
    if (connection) connection.release();
  }
});

router.get('/patient-growth', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    connection = await pool.getConnection();
    let query = `
      SELECT DATE_FORMAT(p.createdAt, '%b') as name, COUNT(*) as newPatients
      FROM patients p
    `;
    const params: any[] = [];
    if (req.user?.role === 'doctor') {
      const docId = req.user.doctorId;
      query += ` WHERE p.doctorId = ? 
                 OR p.id IN (SELECT DISTINCT patientId FROM appointments WHERE doctorId = ?) 
                 OR p.id IN (SELECT DISTINCT patientId FROM prescriptions WHERE doctorId = ?)`;
      params.push(docId, docId, docId);
    }
    query += `
      GROUP BY DATE_FORMAT(p.createdAt, '%Y-%m'), DATE_FORMAT(p.createdAt, '%b')
      ORDER BY DATE_FORMAT(p.createdAt, '%Y-%m') ASC
    `;
    const [results]: any = await connection.query(query, params);

    let cumulative = 0;
    const chartData = results.map((row: any) => {
      cumulative += Number(row.newPatients);
      return { name: row.name, value: cumulative };
    });

    res.json(chartData);
  } catch (error: any) {
    console.error('[DASHBOARD PATIENT GROWTH] Error:', error);
    res.status(500).json({ error: 'Failed to fetch patient growth', details: error.message });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
