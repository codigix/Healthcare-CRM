import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/stats', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const totalDoctors = await prisma.doctor.count();
    const totalPatients = await prisma.patient.count();
    const totalAppointments = await prisma.appointment.count();
    const pendingAppointments = await prisma.appointment.count({ where: { status: 'pending' } });

    const totalRevenue = await prisma.invoice.aggregate({
      where: { status: 'paid' },
      _sum: { amount: true },
    });

    res.json({
      totalDoctors,
      totalPatients,
      totalAppointments,
      pendingAppointments,
      totalRevenue: totalRevenue._sum.amount || 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.get('/recent-appointments', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const appointments = await prisma.appointment.findMany({
      take: 10,
      orderBy: { date: 'desc' },
      include: { doctor: true, patient: true },
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent appointments' });
  }
});

router.get('/revenue-chart', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { patient: true },
    });

    const monthlyData = new Map<string, number>();

    invoices.forEach((invoice: any) => {
      const month = invoice.createdAt.toLocaleDateString('en-US', { month: 'short' });
      const current = monthlyData.get(month) || 0;
      monthlyData.set(month, current + Number(invoice.amount));
    });

    const chartData = Array.from(monthlyData, ([name, value]) => ({ name, value }));

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch revenue chart' });
  }
});

router.get('/patient-growth', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const patients = await prisma.patient.findMany({ orderBy: { createdAt: 'asc' } });

    const monthlyData = new Map<string, number>();
    let cumulative = 0;

    patients.forEach((patient: any) => {
      const month = patient.createdAt.toLocaleDateString('en-US', { month: 'short' });
      cumulative++;
      monthlyData.set(month, cumulative);
    });

    const chartData = Array.from(monthlyData, ([name, value]) => ({ name, value }));

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patient growth' });
  }
});

export default router;
