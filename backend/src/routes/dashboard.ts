import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/stats', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [[{ totalDoctors }]]: any = await connection.query('SELECT COUNT(*) as totalDoctors FROM doctors');
    const [[{ totalPatients }]]: any = await connection.query('SELECT COUNT(*) as totalPatients FROM patients');
    const [[{ totalAppointments }]]: any = await connection.query('SELECT COUNT(*) as totalAppointments FROM appointments');
    const [[{ pendingAppointments }]]: any = await connection.query('SELECT COUNT(*) as pendingAppointments FROM appointments WHERE status = "pending"');
    const [[{ totalRevenue }]]: any = await connection.query('SELECT COALESCE(SUM(amount), 0) as totalRevenue FROM invoices WHERE status = "paid"');
    connection.release();

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
  try {
    const connection = await pool.getConnection();
    const [appointments]: any = await connection.query(`
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
      ORDER BY a.date DESC LIMIT 10
    `);
    connection.release();

    res.json(appointments);
  } catch (error: any) {
    console.error('[DASHBOARD RECENT APPOINTMENTS] Error:', error);
    res.status(500).json({ error: 'Failed to fetch recent appointments', details: error.message });
  }
});

router.get('/revenue-chart', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [invoices]: any = await connection.query('SELECT amount, createdAt FROM invoices');
    connection.release();

    const monthlyData = new Map<string, number>();

    invoices.forEach((invoice: any) => {
      const month = new Date(invoice.createdAt).toLocaleDateString('en-US', { month: 'short' });
      const current = monthlyData.get(month) || 0;
      monthlyData.set(month, current + Number(invoice.amount));
    });

    const chartData = Array.from(monthlyData, ([name, value]) => ({ name, value }));

    res.json(chartData);
  } catch (error: any) {
    console.error('[DASHBOARD REVENUE CHART] Error:', error);
    res.status(500).json({ error: 'Failed to fetch revenue chart', details: error.message });
  }
});

router.get('/patient-growth', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [patients]: any = await connection.query('SELECT createdAt FROM patients ORDER BY createdAt ASC');
    connection.release();

    const monthlyData = new Map<string, number>();
    let cumulative = 0;

    patients.forEach((patient: any) => {
      const month = new Date(patient.createdAt).toLocaleDateString('en-US', { month: 'short' });
      cumulative++;
      monthlyData.set(month, cumulative);
    });

    const chartData = Array.from(monthlyData, ([name, value]) => ({ name, value }));

    res.json(chartData);
  } catch (error: any) {
    console.error('[DASHBOARD PATIENT GROWTH] Error:', error);
    res.status(500).json({ error: 'Failed to fetch patient growth', details: error.message });
  }
});

export default router;
