import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const prisma = new PrismaClient();

// Ensure uploads/consents directory exists
const uploadDir = path.join(process.cwd(), 'uploads', 'consents');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.pdf';
    cb(null, `consent_${req.params.id}_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// Get consents (optionally filter by patientId)
router.get('/', async (req, res) => {
  try {
    const { patientId } = req.query;
    
    let whereClause = {};
    if (patientId) {
      whereClause = { patientId: String(patientId) };
    }

    const consents = await prisma.consent.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        patient: {
          select: { name: true, dob: true, gender: true, status: true, bloodGroup: true, updatedAt: true, id: true }
        }
      }
    });
    
    res.json(consents);
  } catch (error: any) {
    console.error('Error fetching consents:', error);
    res.status(500).json({ error: 'Failed to fetch consents', details: error.message });
  }
});

// Create a new consent
router.post('/', async (req, res) => {
  try {
    const {
      patientId, type, department, visitType, doctorId,
      signedBy, witness, status, version
    } = req.body;

    if (!patientId || !type || !department || !visitType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const consent = await prisma.consent.create({
      data: {
        patientId,
        type,
        department,
        visitType,
        doctorId,
        signedBy: signedBy || 'Pending',
        witness: witness || 'Pending',
        status: status || 'Pending Signature',
        version: version || 'v1.0'
      }
    });
    
    res.status(201).json(consent);
  } catch (error: any) {
    console.error('Error creating consent:', error);
    res.status(500).json({ error: 'Failed to create consent', details: error.message });
  }
});

// Upload a signed consent document
router.post('/:id/upload', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Since we don't have fileUrl in DB, we'll just update status to Signed
    const consent = await prisma.consent.update({
      where: { id },
      data: { status: 'Signed' }
    });
    
    res.json({ message: 'File uploaded successfully', consent, file: req.file.filename });
  } catch (error: any) {
    console.error('Error uploading consent:', error);
    res.status(500).json({ error: 'Failed to upload consent', details: error.message });
  }
});

// Download a signed consent document
router.get('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find latest file for this consent ID
    const files = fs.readdirSync(uploadDir);
    const consentFiles = files.filter(f => f.startsWith(`consent_${id}_`)).sort().reverse();
    
    if (consentFiles.length === 0) {
      return res.status(404).json({ error: 'No document found for this consent' });
    }
    
    const filePath = path.join(uploadDir, consentFiles[0]);
    res.download(filePath);
  } catch (error: any) {
    console.error('Error downloading consent:', error);
    res.status(500).json({ error: 'Failed to download consent', details: error.message });
  }
});

// Update an existing consent
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const consent = await prisma.consent.update({
      where: { id },
      data: updateData
    });
    
    res.json(consent);
  } catch (error: any) {
    console.error('Error updating consent:', error);
    res.status(500).json({ error: 'Failed to update consent', details: error.message });
  }
});

// Delete a consent
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.consent.delete({
      where: { id }
    });
    
    res.json({ message: 'Consent deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting consent:', error);
    res.status(500).json({ error: 'Failed to delete consent', details: error.message });
  }
});

export default router;
