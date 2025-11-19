import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [claims]: any = await connection.query('SELECT * FROM InsuranceClaim ORDER BY createdAt DESC LIMIT 100');
    connection.release();
    res.json({ claims });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch insurance claims' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { patientId, amount, status, claimNumber, notes } = req.body;
    const connection = await pool.getConnection();
    const query = `INSERT INTO InsuranceClaim (id, patientId, amount, status, claimNumber, notes, createdAt, updatedAt)
                   VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), NOW())`;
    await connection.query(query, [patientId, amount, status || 'pending', claimNumber, notes]);
    const [claim]: any = await connection.query('SELECT * FROM InsuranceClaim WHERE patientId = ? ORDER BY createdAt DESC LIMIT 1', [patientId]);
    connection.release();
    res.status(201).json(claim[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create insurance claim' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const connection = await pool.getConnection();
    await connection.query('UPDATE InsuranceClaim SET status = ?, updatedAt = NOW() WHERE id = ?', [status, req.params.id]);
    const [claim]: any = await connection.query('SELECT * FROM InsuranceClaim WHERE id = ?', [req.params.id]);
    connection.release();
    res.json(claim[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update insurance claim' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM InsuranceClaim WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Insurance claim deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete insurance claim' });
  }
});

export default router;
