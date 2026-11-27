import { Router, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { z, ZodTypeAny } from 'zod';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

/**
 * Hospital structure: Profile -> Branch -> Building -> Floor -> Ward -> Room -> Bed.
 * Every list/create/update/delete reads and writes the database (no sample data).
 * Reads: any logged-in user. Writes: administrators only.
 * Deletes are refused (409) while child records still depend on the row.
 */
const router = Router();
router.use(authMiddleware);

const ADMIN_LEVEL = ['superadmin', 'super admin', 'admin', 'administration', 'administrator'];
const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const role = String(req.user?.role || '').trim().toLowerCase();
  const dept = String(req.user?.department || '').trim().toLowerCase();
  if (ADMIN_LEVEL.includes(role) || ADMIN_LEVEL.includes(dept)) return next();
  return res.status(403).json({ error: 'Only administrators can change the hospital structure' });
};

const STATUS = z.enum(['Active', 'Inactive']);
const opt = (max = 191) => z.string().trim().max(max).optional().nullable().transform((v) => (v ? v : null));
const req = (label: string, max = 191) => z.string({ required_error: `${label} is required` }).trim().min(1, `${label} is required`).max(max);

/** Validate the body against a schema; on failure answer 400 with the first message. */
function parse<T extends ZodTypeAny>(schema: T, body: unknown, res: Response): z.infer<T> | null {
  const r = schema.safeParse(body);
  if (r.success) return r.data;
  res.status(400).json({ error: r.error.issues[0]?.message || 'Invalid input', field: r.error.issues[0]?.path.join('.') });
  return null;
}

/** Map MySQL constraint errors to clear 409 messages. */
function dbError(res: Response, e: any, what: string) {
  if (e?.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: `A ${what} with the same code/number already exists` });
  if (e?.code === 'ER_ROW_IS_REFERENCED_2' || e?.code === 'ER_ROW_IS_REFERENCED') return res.status(409).json({ error: `This ${what} is still in use and cannot be deleted` });
  if (e?.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ error: `The selected parent for this ${what} does not exist` });
  console.error(`[hospital ${what}]`, e);
  return res.status(500).json({ error: `Failed to save ${what}` });
}

const like = (s: unknown) => `%${String(s ?? '').trim()}%`;

// ---------------------------------------------------------------- summary
router.get('/summary', async (_req, res) => {
  try {
    const [[r]]: any = await pool.query(`
      SELECT (SELECT COUNT(*) FROM branches) branches, (SELECT COUNT(*) FROM buildings) buildings,
             (SELECT COUNT(*) FROM floors) floors, (SELECT COUNT(*) FROM wards) wards,
             (SELECT COUNT(*) FROM rooms) rooms, (SELECT COUNT(*) FROM beds) beds,
             (SELECT COUNT(*) FROM beds WHERE status = 'Available') availableBeds,
             (SELECT COUNT(*) FROM beds WHERE status = 'Occupied') occupiedBeds`);
    res.json(r);
  } catch (e) { dbError(res, e, 'summary'); }
});

// ---------------------------------------------------------------- profile (single row)
const profileSchema = z.object({
  name: req('Hospital name'),
  registrationNo: opt(100), type: opt(100), email: z.string().trim().email('Enter a valid email').optional().or(z.literal('')).nullable().transform((v) => v || null),
  phone: opt(50), website: opt(), address: opt(500), city: opt(100), state: opt(100), pincode: opt(20), gstNumber: opt(50),
  establishedYear: z.coerce.number().int().min(1800).max(2100).optional().nullable().or(z.literal('').transform(() => null)),
  totalBedCapacity: z.coerce.number().int().min(0).optional().nullable().or(z.literal('').transform(() => null)),
});
router.get('/profile', async (_req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM hospital_profile ORDER BY createdAt LIMIT 1');
    res.json(rows[0] || null);
  } catch (e) { dbError(res, e, 'hospital profile'); }
});
router.put('/profile', requireAdmin, async (req, res) => {
  const d = parse(profileSchema, req.body, res); if (!d) return;
  try {
    const [rows]: any = await pool.query('SELECT id FROM hospital_profile ORDER BY createdAt LIMIT 1');
    const cols = Object.keys(d);
    if (rows[0]) {
      await pool.query(`UPDATE hospital_profile SET ${cols.map((c) => `\`${c}\` = ?`).join(', ')} WHERE id = ?`, [...cols.map((c) => (d as any)[c]), rows[0].id]);
    } else {
      await pool.query(`INSERT INTO hospital_profile (id, ${cols.map((c) => `\`${c}\``).join(', ')}) VALUES (?, ${cols.map(() => '?').join(', ')})`, [randomUUID(), ...cols.map((c) => (d as any)[c])]);
    }
    const [[saved]]: any = await pool.query('SELECT * FROM hospital_profile ORDER BY createdAt LIMIT 1');
    res.json(saved);
  } catch (e) { dbError(res, e, 'hospital profile'); }
});

// ---------------------------------------------------------------- generic CRUD for the hierarchy
interface Entity {
  path: string; table: string; what: string;
  schema: z.ZodObject<any>;
  list: (q: any) => { sql: string; params: unknown[] };
  /** SQL returning a count of dependants; delete is refused when > 0. */
  dependants?: { sql: string; message: string }[];
}

function mount(e: Entity) {
  router.get(`/${e.path}`, async (req, res) => {
    try { const { sql, params } = e.list(req.query); const [rows] = await pool.query(sql, params); res.json(rows); }
    catch (err) { dbError(res, err, e.what); }
  });
  router.post(`/${e.path}`, requireAdmin, async (req, res) => {
    const d = parse(e.schema, req.body, res); if (!d) return;
    const id = randomUUID(); const cols = Object.keys(d);
    try {
      await pool.query(`INSERT INTO ${e.table} (id, ${cols.map((c) => `\`${c}\``).join(', ')}) VALUES (?, ${cols.map(() => '?').join(', ')})`, [id, ...cols.map((c) => (d as any)[c])]);
      const [[row]]: any = await pool.query(`SELECT * FROM ${e.table} WHERE id = ?`, [id]);
      res.status(201).json(row);
    } catch (err) { dbError(res, err, e.what); }
  });
  router.put(`/${e.path}/:id`, requireAdmin, async (req, res) => {
    const d = parse(e.schema, req.body, res); if (!d) return;
    const cols = Object.keys(d);
    try {
      const [r]: any = await pool.query(`UPDATE ${e.table} SET ${cols.map((c) => `\`${c}\` = ?`).join(', ')} WHERE id = ?`, [...cols.map((c) => (d as any)[c]), req.params.id]);
      if (!r.affectedRows) return res.status(404).json({ error: `${e.what} not found` });
      const [[row]]: any = await pool.query(`SELECT * FROM ${e.table} WHERE id = ?`, [req.params.id]);
      res.json(row);
    } catch (err) { dbError(res, err, e.what); }
  });
  router.delete(`/${e.path}/:id`, requireAdmin, async (req, res) => {
    try {
      for (const dep of e.dependants || []) {
        const [[c]]: any = await pool.query(dep.sql, [req.params.id]);
        if (Number(c.n) > 0) return res.status(409).json({ error: dep.message.replace('{n}', String(c.n)) });
      }
      const [r]: any = await pool.query(`DELETE FROM ${e.table} WHERE id = ?`, [req.params.id]);
      if (!r.affectedRows) return res.status(404).json({ error: `${e.what} not found` });
      res.json({ success: true });
    } catch (err) { dbError(res, err, e.what); }
  });
}

mount({
  path: 'branches', table: 'branches', what: 'branch',
  schema: z.object({ name: req('Branch name'), code: req('Branch code', 50).transform((v) => v.toUpperCase()), address: opt(500), city: opt(100), phone: opt(50), email: opt(), managerName: opt(), status: STATUS.default('Active') }),
  list: (q) => ({ sql: `SELECT b.*, (SELECT COUNT(*) FROM buildings x WHERE x.branchId = b.id) buildingCount FROM branches b WHERE (? = '' OR b.name LIKE ? OR b.code LIKE ? OR b.city LIKE ?) ORDER BY b.name`, params: [String(q.search || ''), like(q.search), like(q.search), like(q.search)] }),
  dependants: [{ sql: 'SELECT COUNT(*) n FROM buildings WHERE branchId = ?', message: 'This branch has {n} building(s). Move or delete them first.' }],
});

mount({
  path: 'buildings', table: 'buildings', what: 'building',
  schema: z.object({ branchId: req('Branch', 36), name: req('Building name'), code: req('Building code', 50).transform((v) => v.toUpperCase()), totalFloors: z.coerce.number().int().min(1, 'At least 1 floor').max(200), description: opt(500), status: STATUS.default('Active') }),
  list: (q) => ({ sql: `SELECT bl.*, br.name branchName, (SELECT COUNT(*) FROM floors f WHERE f.buildingId = bl.id) floorCount FROM buildings bl JOIN branches br ON br.id = bl.branchId WHERE (? = '' OR bl.branchId = ?) AND (? = '' OR bl.name LIKE ? OR bl.code LIKE ?) ORDER BY br.name, bl.name`, params: [String(q.branchId || ''), String(q.branchId || ''), String(q.search || ''), like(q.search), like(q.search)] }),
  dependants: [{ sql: 'SELECT COUNT(*) n FROM floors WHERE buildingId = ?', message: 'This building has {n} floor(s). Delete them first.' }],
});

mount({
  path: 'floors', table: 'floors', what: 'floor',
  schema: z.object({ buildingId: req('Building', 36), name: req('Floor name'), floorNumber: z.coerce.number().int().min(-5).max(200), description: opt(500), status: STATUS.default('Active') }),
  list: (q) => ({ sql: `SELECT f.*, bl.name buildingName, br.name branchName, (SELECT COUNT(*) FROM wards w WHERE w.floorId = f.id) wardCount FROM floors f JOIN buildings bl ON bl.id = f.buildingId JOIN branches br ON br.id = bl.branchId WHERE (? = '' OR f.buildingId = ?) AND (? = '' OR f.name LIKE ?) ORDER BY bl.name, f.floorNumber`, params: [String(q.buildingId || ''), String(q.buildingId || ''), String(q.search || ''), like(q.search)] }),
  dependants: [{ sql: 'SELECT COUNT(*) n FROM wards WHERE floorId = ?', message: 'This floor has {n} ward(s). Move or delete them first.' }],
});

mount({
  path: 'wards', table: 'wards', what: 'ward',
  schema: z.object({ floorId: req('Floor', 36), name: req('Ward name'), code: req('Ward code', 50).transform((v) => v.toUpperCase()), wardType: z.enum(['General', 'Private', 'Semi-Private', 'ICU', 'NICU', 'PICU', 'Emergency', 'Maternity', 'Isolation', 'Day Care']).default('General'), department: opt(), nurseInCharge: opt(), status: STATUS.default('Active') }),
  list: (q) => ({ sql: `SELECT w.*, f.name floorName, f.floorNumber, bl.name buildingName, (SELECT COUNT(*) FROM rooms r WHERE r.wardId = w.id) roomCount, (SELECT COUNT(*) FROM beds b JOIN rooms r ON r.id = b.roomId WHERE r.wardId = w.id) bedCount, (SELECT COUNT(*) FROM beds b JOIN rooms r ON r.id = b.roomId WHERE r.wardId = w.id AND b.status = 'Occupied') occupiedBeds FROM wards w JOIN floors f ON f.id = w.floorId JOIN buildings bl ON bl.id = f.buildingId WHERE (? = '' OR w.floorId = ?) AND (? = '' OR w.name LIKE ? OR w.code LIKE ? OR w.department LIKE ?) ORDER BY f.floorNumber, w.name`, params: [String(q.floorId || ''), String(q.floorId || ''), String(q.search || ''), like(q.search), like(q.search), like(q.search)] }),
  dependants: [{ sql: 'SELECT COUNT(*) n FROM rooms WHERE wardId = ?', message: 'This ward has {n} room(s). Move or delete them first.' }],
});

// ---------------------------------------------------------------- rooms (existing table, shared with Room Allotment / Bed Status)
const ROOM_STATUS = z.enum(['Available', 'Occupied', 'Reserved', 'Maintenance', 'Out of Service']);
const roomSchema = z.object({
  wardId: req('Ward', 36), roomNumber: req('Room number', 50), roomType: req('Room type', 50), department: req('Department'),
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1 bed').max(50), pricePerDay: z.coerce.number().min(0, 'Price cannot be negative'),
  status: ROOM_STATUS.default('Available'), description: opt(500),
});

/** Make the room have exactly `capacity` beds: add missing ones, remove surplus Available ones. */
async function syncBeds(roomId: string, roomNumber: string, roomType: string, capacity: number) {
  const [beds]: any = await pool.query('SELECT id, bedNumber, status FROM beds WHERE roomId = ? ORDER BY createdAt, bedNumber', [roomId]);
  if (beds.length < capacity) {
    const taken = new Set(beds.map((b: any) => b.bedNumber));
    let n = 1;
    for (let k = beds.length; k < capacity; k++) {
      while (taken.has(`${roomNumber}-B${n}`)) n++;
      taken.add(`${roomNumber}-B${n}`);
      await pool.query('INSERT INTO beds (id, roomId, bedNumber, bedType, status) VALUES (?, ?, ?, ?, ?)', [randomUUID(), roomId, `${roomNumber}-B${n}`, roomType === 'ICU' ? 'ICU' : 'Standard', 'Available']);
    }
  } else if (beds.length > capacity) {
    const removable = beds.filter((b: any) => b.status === 'Available').slice(-(beds.length - capacity));
    for (const b of removable) await pool.query('DELETE FROM beds WHERE id = ?', [b.id]);
  }
}

router.get('/rooms', async (req, res) => {
  try {
    const q = req.query;
    const [rows] = await pool.query(`
      SELECT r.id, r.roomNumber, r.roomType, r.department, r.floor, r.capacity, r.pricePerDay, r.status, r.description, r.wardId,
             w.name wardName, (SELECT COUNT(*) FROM beds b WHERE b.roomId = r.id) bedCount,
             (SELECT COUNT(*) FROM beds b WHERE b.roomId = r.id AND b.status = 'Occupied') occupiedBeds
      FROM rooms r LEFT JOIN wards w ON w.id = r.wardId
      WHERE (? = '' OR r.wardId = ?) AND (? = '' OR r.status = ?) AND (? = '' OR r.roomNumber LIKE ? OR r.department LIKE ? OR r.roomType LIKE ?)
      ORDER BY CAST(r.floor AS SIGNED), r.roomNumber`,
      [String(q.wardId || ''), String(q.wardId || ''), String(q.status || ''), String(q.status || ''), String(q.search || ''), like(q.search), like(q.search), like(q.search)]);
    res.json(rows);
  } catch (e) { dbError(res, e, 'room'); }
});

router.post('/rooms', requireAdmin, async (req, res) => {
  const d = parse(roomSchema, req.body, res); if (!d) return;
  try {
    const [[ward]]: any = await pool.query('SELECT f.floorNumber FROM wards w JOIN floors f ON f.id = w.floorId WHERE w.id = ?', [d.wardId]);
    if (!ward) return res.status(400).json({ error: 'The selected ward does not exist' });
    const id = randomUUID();
    await pool.query(`INSERT INTO rooms (id, roomNumber, roomType, department, floor, capacity, pricePerDay, status, description, wardId, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3))`,
      [id, d.roomNumber, d.roomType, d.department, String(ward.floorNumber), d.capacity, d.pricePerDay, d.status, d.description, d.wardId]);
    await syncBeds(id, d.roomNumber, d.roomType, d.capacity);
    const [[row]]: any = await pool.query('SELECT * FROM rooms WHERE id = ?', [id]);
    res.status(201).json(row);
  } catch (e) { dbError(res, e, 'room'); }
});

router.put('/rooms/:id', requireAdmin, async (req, res) => {
  const d = parse(roomSchema, req.body, res); if (!d) return;
  try {
    const [[ward]]: any = await pool.query('SELECT f.floorNumber FROM wards w JOIN floors f ON f.id = w.floorId WHERE w.id = ?', [d.wardId]);
    if (!ward) return res.status(400).json({ error: 'The selected ward does not exist' });
    const [[occ]]: any = await pool.query("SELECT COUNT(*) n FROM beds WHERE roomId = ? AND status <> 'Available'", [req.params.id]);
    if (d.capacity < Number(occ.n)) return res.status(409).json({ error: `Capacity cannot be lower than the ${occ.n} bed(s) currently in use` });
    const [r]: any = await pool.query(`UPDATE rooms SET roomNumber = ?, roomType = ?, department = ?, floor = ?, capacity = ?, pricePerDay = ?, status = ?, description = ?, wardId = ?, updatedAt = NOW(3) WHERE id = ?`,
      [d.roomNumber, d.roomType, d.department, String(ward.floorNumber), d.capacity, d.pricePerDay, d.status, d.description, d.wardId, req.params.id]);
    if (!r.affectedRows) return res.status(404).json({ error: 'room not found' });
    await syncBeds(req.params.id, d.roomNumber, d.roomType, d.capacity);
    const [[row]]: any = await pool.query('SELECT * FROM rooms WHERE id = ?', [req.params.id]);
    res.json(row);
  } catch (e) { dbError(res, e, 'room'); }
});

router.delete('/rooms/:id', requireAdmin, async (req, res) => {
  try {
    // Deleting a room would cascade-delete its allotment history, so refuse while any exists.
    const [[a]]: any = await pool.query('SELECT COUNT(*) n FROM room_allotments WHERE roomId = ?', [req.params.id]);
    if (Number(a.n) > 0) return res.status(409).json({ error: `This room has ${a.n} patient allotment record(s). Set its status to "Out of Service" instead of deleting it.` });
    const [[b]]: any = await pool.query("SELECT COUNT(*) n FROM beds WHERE roomId = ? AND status = 'Occupied'", [req.params.id]);
    if (Number(b.n) > 0) return res.status(409).json({ error: `This room has ${b.n} occupied bed(s).` });
    const [r]: any = await pool.query('DELETE FROM rooms WHERE id = ?', [req.params.id]);
    if (!r.affectedRows) return res.status(404).json({ error: 'room not found' });
    res.json({ success: true });
  } catch (e) { dbError(res, e, 'room'); }
});

// ---------------------------------------------------------------- beds
const BED_STATUS = z.enum(['Available', 'Occupied', 'Reserved', 'Maintenance', 'Cleaning']);
mount({
  path: 'beds', table: 'beds', what: 'bed',
  schema: z.object({ roomId: req('Room', 191), bedNumber: req('Bed number', 50), bedType: z.enum(['Standard', 'ICU', 'Pediatric', 'Electric', 'Bariatric', 'Cradle']).default('Standard'), status: BED_STATUS.default('Available'), notes: opt(500) }),
  list: (q) => ({ sql: `SELECT b.*, r.roomNumber, r.roomType, r.department, w.name wardName FROM beds b JOIN rooms r ON r.id = b.roomId LEFT JOIN wards w ON w.id = r.wardId WHERE (? = '' OR b.roomId = ?) AND (? = '' OR r.wardId = ?) AND (? = '' OR b.status = ?) AND (? = '' OR b.bedNumber LIKE ? OR r.roomNumber LIKE ? OR r.department LIKE ?) ORDER BY CAST(r.floor AS SIGNED), r.roomNumber, b.bedNumber`, params: [String(q.roomId || ''), String(q.roomId || ''), String(q.wardId || ''), String(q.wardId || ''), String(q.status || ''), String(q.status || ''), String(q.search || ''), like(q.search), like(q.search), like(q.search)] }),
  dependants: [{ sql: "SELECT COUNT(*) n FROM beds WHERE id = ? AND status = 'Occupied'", message: 'This bed is occupied. Discharge or transfer the patient first.' }],
});

export default router;
