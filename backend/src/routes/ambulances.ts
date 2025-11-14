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
        { name: { contains: String(search), mode: 'insensitive' } },
        { registrationNumber: { contains: String(search), mode: 'insensitive' } },
        { driverName: { contains: String(search), mode: 'insensitive' } },
      ],
    } : {};

    const ambulances = await prisma.ambulance.findMany({
      where,
      skip,
      take: Number(limit),
      include: {
        emergencyCalls: {
          orderBy: { callTime: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.ambulance.count({ where });

    res.json({ ambulances, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ambulances' });
  }
});

router.get('/:id', async (req: any, res: Response) => {
  try {
    const ambulance = await prisma.ambulance.findUnique({
      where: { id: req.params.id },
      include: {
        emergencyCalls: {
          orderBy: { callTime: 'desc' },
        },
      },
    });

    if (!ambulance) {
      return res.status(404).json({ error: 'Ambulance not found' });
    }

    res.json(ambulance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ambulance' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, registrationNumber, driverName, driverPhone, status, location } = req.body;

    const ambulance = await prisma.ambulance.create({
      data: {
        name,
        registrationNumber,
        driverName,
        driverPhone,
        status: status || 'available',
        location,
      },
    });

    res.status(201).json(ambulance);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Registration number already exists' });
    }
    res.status(500).json({ error: 'Failed to create ambulance' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, registrationNumber, driverName, driverPhone, status, location } = req.body;

    const ambulance = await prisma.ambulance.update({
      where: { id: req.params.id },
      data: {
        name,
        registrationNumber,
        driverName,
        driverPhone,
        status,
        location,
        lastUpdated: new Date(),
      },
    });

    res.json(ambulance);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Registration number already exists' });
    }
    res.status(500).json({ error: 'Failed to update ambulance' });
  }
});

router.patch('/:id/status', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const ambulance = await prisma.ambulance.update({
      where: { id: req.params.id },
      data: {
        status,
        lastUpdated: new Date(),
      },
    });

    res.json(ambulance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ambulance status' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.ambulance.delete({ where: { id: req.params.id } });
    res.json({ message: 'Ambulance deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete ambulance' });
  }
});

export default router;
