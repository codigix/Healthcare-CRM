import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = search ? {
      OR: [
        { name: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
        { department: { contains: String(search), mode: 'insensitive' } },
      ],
    } : {};

    const specializations = await prisma.specialization.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.specialization.count({ where });

    res.json({ specializations, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch specializations' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const specialization = await prisma.specialization.findUnique({
      where: { id: req.params.id },
    });

    if (!specialization) {
      return res.status(404).json({ error: 'Specialization not found' });
    }

    res.json(specialization);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch specialization' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, department, doctorCount = 0, status = 'active' } = req.body;

    if (!name || !department) {
      return res.status(400).json({ error: 'Name and department are required' });
    }

    const specialization = await prisma.specialization.create({
      data: {
        name,
        description: description || null,
        department,
        doctorCount: Number(doctorCount),
        status,
      },
    });

    res.status(201).json(specialization);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Specialization name already exists' });
    }
    res.status(500).json({ error: 'Failed to create specialization' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, department, doctorCount, status } = req.body;

    if (!name || !department) {
      return res.status(400).json({ error: 'Name and department are required' });
    }

    const specialization = await prisma.specialization.update({
      where: { id: req.params.id },
      data: {
        name,
        description: description || null,
        department,
        ...(doctorCount !== undefined && { doctorCount: Number(doctorCount) }),
        status,
      },
    });

    res.json(specialization);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Specialization not found' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Specialization name already exists' });
    }
    res.status(500).json({ error: 'Failed to update specialization' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.specialization.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Specialization deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Specialization not found' });
    }
    res.status(500).json({ error: 'Failed to delete specialization' });
  }
});

export default router;
