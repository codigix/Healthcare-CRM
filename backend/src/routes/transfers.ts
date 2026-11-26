import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

// Ensure patient_transfers table exists
const ensureTable = async () => {
  const connection = await pool.getConnection();
  try {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS patient_transfers (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      transferId VARCHAR(30) UNIQUE,
      patientId VARCHAR(36),
      patientName VARCHAR(255) NOT NULL,
      patientUhid VARCHAR(100),
      ipdNo VARCHAR(100),
      fromDepartment VARCHAR(255),
      fromRoom VARCHAR(100),
      fromBed VARCHAR(100),
      toDepartment VARCHAR(255),
      toRoom VARCHAR(100),
      toBed VARCHAR(100),
      reason VARCHAR(255),
      transferBy VARCHAR(255),
      status ENUM('Pending','In Progress','Completed','Cancelled') DEFAULT 'Pending',
      notes TEXT,
      transferDate DATETIME,
      completedDate DATETIME,
      createdAt DATETIME DEFAULT NOW(),
      updatedAt DATETIME DEFAULT NOW() ON UPDATE NOW()
    )
  `);
  } finally {
    // Release even when the DDL fails; startup runs outside any request, so the
    // per-request safety net in db.ts can't reclaim this connection.
    connection.release();
  }
};
ensureTable().catch(console.error);

// ── GET /api/transfers ──────────────────────────────────────────────────────
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search, status, fromDept, toDept, fromDate, toDate } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let where = 'WHERE 1=1';
    const params: any[] = [];

    if (search) {
      where += ' AND (patientName LIKE ? OR patientUhid LIKE ? OR ipdNo LIKE ? OR transferId LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }
    if (status && String(status) !== 'All Status') {
      where += ' AND status = ?';
      params.push(String(status));
    }
    if (fromDept && String(fromDept) !== 'All Departments') {
      where += ' AND fromDepartment = ?';
      params.push(String(fromDept));
    }
    if (toDept && String(toDept) !== 'All Departments') {
      where += ' AND toDepartment = ?';
      params.push(String(toDept));
    }
    if (fromDate) {
      where += ' AND DATE(transferDate) >= ?';
      params.push(String(fromDate));
    }
    if (toDate) {
      where += ' AND DATE(transferDate) <= ?';
      params.push(String(toDate));
    }

    const connection = await pool.getConnection();
    const countParams = [...params];
    const [countRows]: any = await connection.query(
      `SELECT COUNT(*) as total FROM patient_transfers ${where}`, countParams
    );
    const total = countRows[0].total;

    const [transfers]: any = await connection.query(
      `SELECT * FROM patient_transfers ${where} ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
      [...params, Number(limit), skip]
    );
    connection.release();

    res.json({ transfers, total, page: Number(page), limit: Number(limit) });
  } catch (err: any) {
    console.error('[TRANSFERS GET]', err);
    res.status(500).json({ error: 'Failed to fetch transfers', details: err.message });
  }
});

// ── GET /api/transfers/:id ──────────────────────────────────────────────────
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.query(
      'SELECT * FROM patient_transfers WHERE id = ? OR transferId = ?',
      [req.params.id, req.params.id]
    );
    connection.release();
    if (!rows.length) return res.status(404).json({ error: 'Transfer not found' });
    res.json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch transfer' });
  }
});

// ── POST /api/transfers ─────────────────────────────────────────────────────
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      patientId, patientName, patientUhid, ipdNo,
      fromDepartment, fromRoom, fromBed,
      toDepartment, toRoom, toBed,
      reason, transferBy, notes, transferDate
    } = req.body;

    if (!patientName || !fromDepartment || !toDepartment) {
      return res.status(400).json({ error: 'patientName, fromDepartment and toDepartment are required' });
    }

    const connection = await pool.getConnection();

    // Generate sequential transfer ID
    const [last]: any = await connection.query(
      `SELECT transferId FROM patient_transfers ORDER BY createdAt DESC LIMIT 1`
    );
    let nextNum = 2405200;
    if (last.length && last[0].transferId) {
      const match = last[0].transferId.match(/TRF(\d+)/);
      if (match) nextNum = parseInt(match[1]) + 1;
    }
    const transferId = `TRF${nextNum}`;

    await connection.query(
      `INSERT INTO patient_transfers
         (id, transferId, patientId, patientName, patientUhid, ipdNo,
          fromDepartment, fromRoom, fromBed, toDepartment, toRoom, toBed,
          reason, transferBy, notes, status, transferDate)
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?)`,
      [
        transferId, patientId || null, patientName, patientUhid || null, ipdNo || null,
        fromDepartment, fromRoom || null, fromBed || null,
        toDepartment, toRoom || null, toBed || null,
        reason || null, transferBy || null, notes || null,
        transferDate ? new Date(transferDate) : new Date()
      ]
    );

    const [row]: any = await connection.query(
      'SELECT * FROM patient_transfers WHERE transferId = ?', [transferId]
    );
    connection.release();
    res.status(201).json(row[0]);
  } catch (err: any) {
    console.error('[TRANSFERS POST]', err);
    res.status(500).json({ error: 'Failed to create transfer', details: err.message });
  }
});

// ── PUT /api/transfers/:id ──────────────────────────────────────────────────
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      status, fromDepartment, fromRoom, fromBed,
      toDepartment, toRoom, toBed, reason, transferBy, notes, transferDate
    } = req.body;

    const connection = await pool.getConnection();
    const sets: string[] = ['updatedAt = NOW()'];
    const params: any[] = [];

    if (status) { sets.push('status = ?'); params.push(status); }
    if (fromDepartment) { sets.push('fromDepartment = ?'); params.push(fromDepartment); }
    if (fromRoom !== undefined) { sets.push('fromRoom = ?'); params.push(fromRoom); }
    if (fromBed !== undefined) { sets.push('fromBed = ?'); params.push(fromBed); }
    if (toDepartment) { sets.push('toDepartment = ?'); params.push(toDepartment); }
    if (toRoom !== undefined) { sets.push('toRoom = ?'); params.push(toRoom); }
    if (toBed !== undefined) { sets.push('toBed = ?'); params.push(toBed); }
    if (reason !== undefined) { sets.push('reason = ?'); params.push(reason); }
    if (transferBy !== undefined) { sets.push('transferBy = ?'); params.push(transferBy); }
    if (notes !== undefined) { sets.push('notes = ?'); params.push(notes); }
    if (transferDate) { sets.push('transferDate = ?'); params.push(new Date(transferDate)); }
    if (status === 'Completed') { sets.push('completedDate = NOW()'); }

    params.push(req.params.id, req.params.id);
    await connection.query(
      `UPDATE patient_transfers SET ${sets.join(', ')} WHERE id = ? OR transferId = ?`,
      params
    );

    const [row]: any = await connection.query(
      'SELECT * FROM patient_transfers WHERE id = ? OR transferId = ?',
      [req.params.id, req.params.id]
    );
    connection.release();
    res.json(row[0]);
  } catch (err: any) {
    console.error('[TRANSFERS PUT]', err);
    res.status(500).json({ error: 'Failed to update transfer' });
  }
});

// ── DELETE /api/transfers/:id ───────────────────────────────────────────────
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    await connection.query(
      'DELETE FROM patient_transfers WHERE id = ? OR transferId = ?',
      [req.params.id, req.params.id]
    );
    connection.release();
    res.json({ message: 'Transfer deleted' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete transfer' });
  }
});

export default router;
