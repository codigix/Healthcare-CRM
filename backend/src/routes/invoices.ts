import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import PDFDocument from 'pdfkit';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, status, patientId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status) where.status = String(status);
    if (patientId) where.patientId = String(patientId);

    const invoices = await prisma.invoice.findMany({
      where,
      skip,
      take: Number(limit),
      include: { patient: true },
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.invoice.count({ where });

    res.json({ invoices, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: { patient: true },
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { patientId, amount, status, dueDate, notes } = req.body;

    const invoice = await prisma.invoice.create({
      data: {
        patientId,
        amount: parseFloat(amount),
        status: status || 'pending',
        dueDate: dueDate ? new Date(dueDate) : undefined,
        notes,
      },
      include: { patient: true },
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { patientId, amount, status, dueDate, notes } = req.body;

    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: {
        patientId,
        amount: amount ? parseFloat(amount) : undefined,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        notes,
      },
      include: { patient: true },
    });

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.invoice.delete({ where: { id: req.params.id } });
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

router.get('/:id/pdf', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: { patient: true },
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.id}.pdf"`);
    doc.pipe(res);

    doc.fontSize(25).text('MedixPro Invoice', 100, 100);
    doc.fontSize(12).text(`Invoice ID: ${invoice.id}`, 100, 150);
    doc.text(`Patient: ${invoice.patient.name}`, 100, 170);
    doc.text(`Amount: $${invoice.amount}`, 100, 190);
    doc.text(`Status: ${invoice.status}`, 100, 210);
    doc.text(`Date: ${invoice.createdAt.toLocaleDateString()}`, 100, 230);

    doc.end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

export default router;
