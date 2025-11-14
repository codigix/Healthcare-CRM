import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req: any, res: Response) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = search ? {
      OR: [
        { patientName: { contains: String(search), mode: 'insensitive' } },
        { location: { contains: String(search), mode: 'insensitive' } },
        { emergencyType: { contains: String(search), mode: 'insensitive' } },
      ],
    } : {};

    const emergencyCalls = await prisma.emergencyCall.findMany({
      where,
      skip,
      take: Number(limit),
      include: {
        ambulance: true,
      },
      orderBy: { callTime: 'desc' },
    });

    const total = await prisma.emergencyCall.count({ where });

    res.json({ emergencyCalls, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch emergency calls' });
  }
});

router.get('/:id', async (req: any, res: Response) => {
  try {
    const emergencyCall = await prisma.emergencyCall.findUnique({
      where: { id: req.params.id },
      include: {
        ambulance: true,
      },
    });

    if (!emergencyCall) {
      return res.status(404).json({ error: 'Emergency call not found' });
    }

    res.json(emergencyCall);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch emergency call' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { patientName, phone, location, emergencyType, priority, status, callTime, notes } = req.body;

    if (!patientName || !location || !emergencyType) {
      return res.status(400).json({ error: 'Patient name, location, and emergency type are required' });
    }

    const emergencyCall = await prisma.emergencyCall.create({
      data: {
        patientName,
        phone,
        location,
        emergencyType,
        priority: priority || 'Medium',
        status: status || 'Pending',
        callTime: callTime ? new Date(callTime) : new Date(),
        notes,
      },
      include: {
        ambulance: true,
      },
    });

    res.status(201).json(emergencyCall);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create emergency call' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { patientName, phone, location, emergencyType, priority, status, notes, ambulanceId } = req.body;

    const emergencyCall = await prisma.emergencyCall.update({
      where: { id: req.params.id },
      data: {
        patientName,
        phone,
        location,
        emergencyType,
        priority,
        status,
        notes,
        ambulanceId,
      },
      include: {
        ambulance: true,
      },
    });

    res.json(emergencyCall);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update emergency call' });
  }
});

router.patch('/:id/status', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const emergencyCall = await prisma.emergencyCall.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        ambulance: true,
      },
    });

    res.json(emergencyCall);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update emergency call status' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.emergencyCall.delete({ where: { id: req.params.id } });
    res.json({ message: 'Emergency call deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete emergency call' });
  }
});

export default router;
