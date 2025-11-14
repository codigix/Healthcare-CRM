import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = '', filter = 'all' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { category: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    if (filter === 'recent') {
      whereClause.lastUsed = { not: null };
    }

    const [templates, total] = await Promise.all([
      prisma.prescriptionTemplate.findMany({
        where: whereClause,
        skip,
        take: Number(limit),
        orderBy: filter === 'recent' ? { lastUsed: 'desc' } : { createdAt: 'desc' },
      }),
      prisma.prescriptionTemplate.count({ where: whereClause }),
    ]);

    const formattedTemplates = templates.map((template: any) => ({
      ...template,
      medications: typeof template.medications === 'string' ? JSON.parse(template.medications) : template.medications,
    }));

    res.json({
      data: formattedTemplates,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch templates' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const template = await prisma.prescriptionTemplate.findUnique({
      where: { id: req.params.id },
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json({
      ...template,
      medications: typeof template.medications === 'string' ? JSON.parse(template.medications) : template.medications,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch template' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, category, medications, createdBy } = req.body;

    if (!name || !category || !medications || !createdBy) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const template = await prisma.prescriptionTemplate.create({
      data: {
        name,
        category,
        medications: typeof medications === 'string' ? medications : JSON.stringify(medications),
        createdBy,
      },
    });

    res.status(201).json({
      ...template,
      medications: typeof template.medications === 'string' ? JSON.parse(template.medications) : template.medications,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create template' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, category, medications } = req.body;

    const template = await prisma.prescriptionTemplate.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(medications && { medications: typeof medications === 'string' ? medications : JSON.stringify(medications) }),
      },
    });

    res.json({
      ...template,
      medications: typeof template.medications === 'string' ? JSON.parse(template.medications) : template.medications,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update template' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.prescriptionTemplate.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Template deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete template' });
  }
});

router.post('/:id/use', async (req: Request, res: Response) => {
  try {
    const template = await prisma.prescriptionTemplate.update({
      where: { id: req.params.id },
      data: {
        lastUsed: new Date(),
        usageCount: { increment: 1 },
      },
    });

    res.json({
      ...template,
      medications: typeof template.medications === 'string' ? JSON.parse(template.medications) : template.medications,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update template usage' });
  }
});

export default router;
