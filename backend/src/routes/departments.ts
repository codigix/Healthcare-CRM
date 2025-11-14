import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status) where.status = String(status);
    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { head: { contains: String(search) } },
      ];
    }

    const departments = await prisma.department.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.department.count({ where });

    res.json({ departments, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});



router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, head, location, staffCount, services, status, description } = req.body;

    if (!name || !head || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const department = await prisma.department.create({
      data: {
        name,
        head,
        location,
        staffCount: staffCount || 0,
        services: services || 0,
        status: status || 'Active',
        description,
      },
    });

    res.status(201).json(department);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Department name already exists' });
    }
    res.status(500).json({ error: 'Failed to create department' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, head, location, staffCount, services, status, description } = req.body;

    const department = await prisma.department.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(head && { head }),
        ...(location && { location }),
        ...(staffCount !== undefined && { staffCount }),
        ...(services !== undefined && { services }),
        ...(status && { status }),
        ...(description !== undefined && { description }),
      },
    });

    res.json(department);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Department not found' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Department name already exists' });
    }
    res.status(500).json({ error: 'Failed to update department' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.department.delete({ where: { id: req.params.id } });
    res.json({ message: 'Department deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.status(500).json({ error: 'Failed to delete department' });
  }
});

router.get('/doctors/list', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const doctors = await prisma.doctor.findMany({
      select: {
        id: true,
        name: true,
        specialization: true,
        email: true,
      },
      orderBy: { name: 'asc' },
    });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

router.get('/statistics/summary', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const totalDepartments = await prisma.department.count();
    const activeDepartments = await prisma.department.count({ where: { status: 'Active' } });
    const totalStaff = await prisma.department.aggregate({
      _sum: { staffCount: true },
    });
    const totalServices = await prisma.department.aggregate({
      _sum: { services: true },
    });

    res.json({
      totalDepartments,
      activeDepartments,
      totalStaff: totalStaff._sum.staffCount || 0,
      totalServices: totalServices._sum.services || 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

router.get('/services', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, departmentId, type, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (departmentId) where.departmentId = String(departmentId);
    if (type) where.type = String(type);
    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
      ];
    }

    const services = await prisma.service.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: { 
        department: true
      },
    });

    const total = await prisma.service.count({ where });

    res.json({ services, total, page: Number(page), limit: Number(limit) });
  } catch (error: any) {
    console.error('GET /services error:', error);
    res.status(500).json({ error: 'Failed to fetch services', details: error.message });
  }
});

router.get('/services/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: req.params.id },
      include: { 
        department: true
      },
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

router.post('/services', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, departmentId, type, duration, price, description, status } = req.body;

    if (!name || !departmentId || !type || !duration || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const service = await prisma.service.create({
      data: {
        name,
        departmentId,
        type,
        duration: Number(duration),
        price: parseFloat(price),
        description,
        status: status || 'Active',
      },
      include: { 
        department: true
      },
    });

    res.status(201).json(service);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Service name already exists' });
    }
    res.status(500).json({ error: 'Failed to create service' });
  }
});

router.put('/services/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, departmentId, type, duration, price, description, status } = req.body;

    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(departmentId && { departmentId }),
        ...(type && { type }),
        ...(duration !== undefined && { duration: Number(duration) }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
      },
      include: { 
        department: true
      },
    });

    res.json(service);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Service not found' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Service name already exists' });
    }
    res.status(500).json({ error: 'Failed to update service' });
  }
});

router.delete('/services/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.service.delete({ where: { id: req.params.id } });
    res.json({ message: 'Service deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const department = await prisma.department.findUnique({
      where: { id: req.params.id },
    });

    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json(department);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch department' });
  }
});

export default router;
