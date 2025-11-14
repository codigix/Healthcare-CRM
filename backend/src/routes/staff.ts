import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search, department, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: String(search), mode: 'insensitive' } },
        { lastName: { contains: String(search), mode: 'insensitive' } },
        { email: { contains: String(search), mode: 'insensitive' } },
        { role: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    if (department) {
      where.department = String(department);
    }

    if (status) {
      where.status = String(status);
    }

    const staff = await prisma.staff.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.staff.count({ where });

    res.json({ staff, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const staff = await prisma.staff.findUnique({
      where: { id: req.params.id },
      include: { attendanceRecords: { orderBy: { date: 'desc' }, take: 10 } },
    });

    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff member' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      city,
      postalCode,
      country,
      emergencyContact,
      emergencyPhone,
      relationship,
      role,
      department,
      joinedDate,
      status,
    } = req.body;

    const staff = await prisma.staff.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        address,
        city,
        postalCode,
        country,
        emergencyContact,
        emergencyPhone,
        relationship,
        role,
        department,
        joinedDate: joinedDate ? new Date(joinedDate) : new Date(),
        status: status || 'Active',
      },
    });

    res.status(201).json(staff);
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create staff member' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      city,
      postalCode,
      country,
      emergencyContact,
      emergencyPhone,
      relationship,
      role,
      department,
      status,
    } = req.body;

    const staff = await prisma.staff.update({
      where: { id: req.params.id },
      data: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        email: email || undefined,
        phone: phone || undefined,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender: gender || undefined,
        address: address || undefined,
        city: city || undefined,
        postalCode: postalCode || undefined,
        country: country || undefined,
        emergencyContact: emergencyContact || undefined,
        emergencyPhone: emergencyPhone || undefined,
        relationship: relationship || undefined,
        role: role || undefined,
        department: department || undefined,
        status: status || undefined,
      },
    });

    res.json(staff);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to update staff member' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.staff.delete({ where: { id: req.params.id } });
    res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete staff member' });
  }
});

export default router;
