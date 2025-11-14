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
        { patient: { name: { contains: String(search), mode: 'insensitive' } } },
        { doctor: { name: { contains: String(search), mode: 'insensitive' } } },
        { diagnosis: { contains: String(search), mode: 'insensitive' } },
      ],
    } : {};

    const prescriptions = await prisma.prescription.findMany({
      where,
      skip,
      take: Number(limit),
      include: {
        patient: {
          select: { id: true, name: true, gender: true, dob: true },
        },
        doctor: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.prescription.count({ where });

    res.json({ prescriptions, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const prescription = await prisma.prescription.findUnique({
      where: { id: req.params.id },
      include: {
        patient: {
          select: { id: true, name: true, gender: true, dob: true },
        },
        doctor: {
          select: { id: true, name: true },
        },
      },
    });

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    res.json(prescription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prescription' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { patientId, doctorId, prescriptionDate, prescriptionType, diagnosis, notesForPharmacist, medications, status = 'Active' } = req.body;

    if (!patientId || !doctorId || !prescriptionDate || !medications) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prescription = await prisma.prescription.create({
      data: {
        patientId,
        doctorId,
        prescriptionDate: new Date(prescriptionDate),
        prescriptionType,
        diagnosis: diagnosis || null,
        notesForPharmacist: notesForPharmacist || null,
        medications: JSON.stringify(medications),
        status,
      },
      include: {
        patient: {
          select: { id: true, name: true, gender: true, dob: true },
        },
        doctor: {
          select: { id: true, name: true },
        },
      },
    });

    res.status(201).json(prescription);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create prescription' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { patientId, doctorId, prescriptionDate, prescriptionType, diagnosis, notesForPharmacist, medications, status } = req.body;

    const prescription = await prisma.prescription.update({
      where: { id: req.params.id },
      data: {
        ...(patientId && { patientId }),
        ...(doctorId && { doctorId }),
        ...(prescriptionDate && { prescriptionDate: new Date(prescriptionDate) }),
        ...(prescriptionType && { prescriptionType }),
        ...(diagnosis !== undefined && { diagnosis: diagnosis || null }),
        ...(notesForPharmacist !== undefined && { notesForPharmacist: notesForPharmacist || null }),
        ...(medications && { medications: JSON.stringify(medications) }),
        ...(status && { status }),
      },
      include: {
        patient: {
          select: { id: true, name: true, gender: true, dob: true },
        },
        doctor: {
          select: { id: true, name: true },
        },
      },
    });

    res.json(prescription);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    res.status(500).json({ error: 'Failed to update prescription' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.prescription.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Prescription deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    res.status(500).json({ error: 'Failed to delete prescription' });
  }
});

export default router;
