import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, status, patientId, provider } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status) where.status = String(status);
    if (patientId) where.patientId = String(patientId);
    if (provider) where.provider = String(provider);

    const claims = await prisma.insuranceClaim.findMany({
      where,
      skip,
      take: Number(limit),
      include: { patient: true },
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.insuranceClaim.count({ where });

    res.json({ claims, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch insurance claims' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const claim = await prisma.insuranceClaim.findUnique({
      where: { id: req.params.id },
      include: { patient: true },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Insurance claim not found' });
    }

    res.json(claim);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch insurance claim' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { patientId, provider, policyNumber, type, amount, status, notes } = req.body;

    if (!patientId || !provider || !policyNumber || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const claim = await prisma.insuranceClaim.create({
      data: {
        patientId,
        provider,
        policyNumber,
        type: type || 'Medical',
        amount: parseFloat(amount),
        status: status || 'Draft',
        submittedDate: status === 'Pending' || status === 'Approved' || status === 'Rejected' ? new Date() : null,
        notes,
      },
      include: { patient: true },
    });

    res.status(201).json(claim);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.status(500).json({ error: 'Failed to create insurance claim' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { patientId, provider, policyNumber, type, amount, status, notes } = req.body;

    const claim = await prisma.insuranceClaim.update({
      where: { id: req.params.id },
      data: {
        patientId,
        provider,
        policyNumber,
        type,
        amount: amount ? parseFloat(amount) : undefined,
        status,
        submittedDate: status && (status === 'Pending' || status === 'Approved' || status === 'Rejected') 
          ? new Date() 
          : undefined,
        notes,
      },
      include: { patient: true },
    });

    res.json(claim);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Insurance claim not found' });
    }
    res.status(500).json({ error: 'Failed to update insurance claim' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.insuranceClaim.delete({ where: { id: req.params.id } });
    res.json({ message: 'Insurance claim deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Insurance claim not found' });
    }
    res.status(500).json({ error: 'Failed to delete insurance claim' });
  }
});

router.get('/statistics/summary', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const totalClaims = await prisma.insuranceClaim.count();
    const approvedAmount = await prisma.insuranceClaim.aggregate({
      where: { status: 'Approved' },
      _sum: { amount: true },
    });
    const pendingClaims = await prisma.insuranceClaim.count({ where: { status: 'Pending' } });
    const approvedClaims = await prisma.insuranceClaim.count({ where: { status: 'Approved' } });

    const successRate = totalClaims > 0 ? ((approvedClaims / totalClaims) * 100).toFixed(0) : '0';

    res.json({
      totalClaims,
      approvedAmount: approvedAmount._sum.amount || 0,
      pendingClaims,
      successRate,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
