import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, staffId, date, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    if (staffId) {
      where.staffId = String(staffId);
    }

    if (date) {
      const startDate = new Date(String(date));
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(String(date));
      endDate.setHours(23, 59, 59, 999);

      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (status) {
      where.status = String(status);
    }

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        staff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            department: true,
          },
        },
      },
      skip,
      take: Number(limit),
      orderBy: { date: 'desc' },
    });

    const total = await prisma.attendance.count({ where });

    res.json({ attendance, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});

router.get('/staff/:staffId/daily', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.query;
    const staffId = req.params.staffId;

    const startDate = date ? new Date(String(date)) : new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);

    const attendance = await prisma.attendance.findFirst({
      where: {
        staffId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    res.json(attendance || { staffId, date: startDate, status: 'Not recorded' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch daily attendance' });
  }
});

router.post('/check-in', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { staffId } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endToday = new Date(today);
    endToday.setHours(23, 59, 59, 999);

    let attendance = await prisma.attendance.findFirst({
      where: {
        staffId,
        date: {
          gte: today,
          lte: endToday,
        },
      },
    });

    if (attendance) {
      return res.status(400).json({ error: 'Already checked in today' });
    }

    attendance = await prisma.attendance.create({
      data: {
        staffId,
        checkIn: new Date(),
        status: 'Present',
      },
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to check in' });
  }
});

router.post('/check-out/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const attendance = await prisma.attendance.findUnique({
      where: { id },
    });

    if (!attendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ error: 'Already checked out' });
    }

    const checkOut = new Date();
    const checkIn = attendance.checkIn || new Date();
    const hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);

    const updated = await prisma.attendance.update({
      where: { id },
      data: {
        checkOut,
        hours: Math.round(hours * 100) / 100,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to check out' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { staffId, checkIn, checkOut, status, date } = req.body;

    let hours = 0;
    if (checkIn && checkOut) {
      hours = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60);
      hours = Math.round(hours * 100) / 100;
    }

    const attendance = await prisma.attendance.create({
      data: {
        staffId,
        checkIn: checkIn ? new Date(checkIn) : undefined,
        checkOut: checkOut ? new Date(checkOut) : undefined,
        hours,
        status: status || 'Present',
        date: date ? new Date(date) : new Date(),
      },
    });

    res.status(201).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create attendance record' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { checkIn, checkOut, status, date } = req.body;

    let hours = undefined;
    if (checkIn && checkOut) {
      hours = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60);
      hours = Math.round(hours * 100) / 100;
    }

    const updated = await prisma.attendance.update({
      where: { id: req.params.id },
      data: {
        checkIn: checkIn ? new Date(checkIn) : undefined,
        checkOut: checkOut ? new Date(checkOut) : undefined,
        hours: hours || undefined,
        status: status || undefined,
        date: date ? new Date(date) : undefined,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update attendance record' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.attendance.delete({ where: { id: req.params.id } });
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete attendance record' });
  }
});

export default router;
