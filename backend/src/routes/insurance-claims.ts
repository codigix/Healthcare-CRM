import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

// Columns that may be written through the API (id/createdAt/updatedAt are managed here).
const WRITABLE = ['patientId', 'provider', 'policyNumber', 'type', 'amount', 'status', 'notes'] as const;

const SELECT_CLAIMS = `
  SELECT c.*, p.name AS patientName
  FROM insurance_claims c
  LEFT JOIN patients p ON p.id = c.patientId`;

// Shape the page expects: amount as a number and the patient as a nested object.
const shape = (row: any) => {
  const { patientName, ...claim } = row;
  return {
    ...claim,
    amount: Number(claim.amount),
    patient: { id: claim.patientId, name: patientName || null },
  };
};

// Summary cards. Declared before any "/:id" route so it is not read as an id.
router.get('/statistics/summary', authMiddleware, async (req: AuthRequest, res: Response) => {
  const connection = await pool.getConnection();
  try {
    const [rows]: any = await connection.query(`
      SELECT
        COUNT(*) AS totalClaims,
        COALESCE(SUM(CASE WHEN status IN ('Approved', 'Settlement Received') THEN amount END), 0) AS approvedAmount,
        SUM(CASE WHEN status IN ('Pending', 'Under Review', 'Submitted') THEN 1 ELSE 0 END) AS pendingClaims,
        SUM(CASE WHEN status IN ('Approved', 'Settlement Received') THEN 1 ELSE 0 END) AS approvedClaims
      FROM insurance_claims`);
    const r = rows[0];
    const total = Number(r.totalClaims) || 0;
    res.json({
      totalClaims: total,
      approvedAmount: Number(r.approvedAmount) || 0,
      pendingClaims: Number(r.pendingClaims) || 0,
      successRate: total ? ((Number(r.approvedClaims) / total) * 100).toFixed(1) : '0.0',
    });
  } catch (error) {
    console.error('[INSURANCE CLAIMS STATS] Error:', error);
    res.status(500).json({ error: 'Failed to fetch insurance claim statistics' });
  } finally {
    connection.release();
  }
});

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const connection = await pool.getConnection();
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(500, Math.max(1, Number(req.query.limit) || 100));
    const [claims]: any = await connection.query(
      `${SELECT_CLAIMS} ORDER BY c.createdAt DESC LIMIT ? OFFSET ?`,
      [limit, (page - 1) * limit]
    );
    const [[{ total }]]: any = await connection.query('SELECT COUNT(*) AS total FROM insurance_claims');
    res.json({ claims: claims.map(shape), total, page, limit });
  } catch (error) {
    console.error('[INSURANCE CLAIMS LIST] Error:', error);
    res.status(500).json({ error: 'Failed to fetch insurance claims' });
  } finally {
    connection.release();
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const connection = await pool.getConnection();
  try {
    const { patientId, provider, policyNumber, type, amount, notes } = req.body;
    const status = req.body.status || 'Pending';
    if (!patientId) return res.status(400).json({ error: 'patientId is required' });

    await connection.query(
      `INSERT INTO insurance_claims (id, patientId, provider, policyNumber, type, amount, status, notes, submittedDate, createdAt, updatedAt)
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [patientId, provider ?? null, policyNumber ?? null, type ?? null, amount ?? 0, status, notes ?? null, status === 'Draft' ? null : new Date()]
    );
    const [rows]: any = await connection.query(
      `${SELECT_CLAIMS} WHERE c.patientId = ? ORDER BY c.createdAt DESC LIMIT 1`,
      [patientId]
    );
    res.status(201).json(rows[0] ? shape(rows[0]) : null);
  } catch (error) {
    console.error('[INSURANCE CLAIMS CREATE] Error:', error);
    res.status(500).json({ error: 'Failed to create insurance claim' });
  } finally {
    connection.release();
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const connection = await pool.getConnection();
  try {
    const sets: string[] = [];
    const values: any[] = [];
    for (const col of WRITABLE) {
      if (req.body[col] !== undefined) { sets.push(`${col} = ?`); values.push(req.body[col]); }
    }
    if (sets.length) {
      await connection.query(`UPDATE insurance_claims SET ${sets.join(', ')}, updatedAt = NOW() WHERE id = ?`, [...values, req.params.id]);
    }
    const [rows]: any = await connection.query(`${SELECT_CLAIMS} WHERE c.id = ?`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Insurance claim not found' });
    res.json(shape(rows[0]));
  } catch (error) {
    console.error('[INSURANCE CLAIMS UPDATE] Error:', error);
    res.status(500).json({ error: 'Failed to update insurance claim' });
  } finally {
    connection.release();
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const connection = await pool.getConnection();
  try {
    await connection.query('DELETE FROM insurance_claims WHERE id = ?', [req.params.id]);
    res.json({ message: 'Insurance claim deleted' });
  } catch (error) {
    console.error('[INSURANCE CLAIMS DELETE] Error:', error);
    res.status(500).json({ error: 'Failed to delete insurance claim' });
  } finally {
    connection.release();
  }
});

export default router;
