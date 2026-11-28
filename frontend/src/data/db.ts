/**
 * Browser JSON database for the Hospital Administration module (frontend only, no backend, no SQL).
 *
 * - Everything lives in ONE JSON document saved in localStorage, so it survives a refresh.
 * - Pages use `useDb()` / `useCollection()` to read and `create` / `update` / `remove` to write.
 * - Rules (required fields, unique values, parent must exist, delete protection) live here, so every
 *   screen behaves the same. A rule failure throws a `DbError` whose message is shown to the user.
 * - When the backend is built, only this file changes: the same functions will call the API.
 */
import { useSyncExternalStore } from 'react';
import { buildSeed } from './seed';

export type Row = { id: string; createdAt: string; updatedAt: string; [key: string]: any };

export const COLLECTIONS = [
  'hospitalProfile', 'branches', 'departments', 'costCentres', 'buildings', 'floors', 'wards', 'rooms', 'beds',
  'staff', 'services', 'tariffs', 'policies', 'approvalRules', 'approvalRequests',
] as const;
export type CollectionName = (typeof COLLECTIONS)[number];
export type Db = Record<CollectionName, Row[]>;

export class DbError extends Error {
  constructor(message: string) { super(message); this.name = 'DbError'; }
}

const STORAGE_KEY = 'medixpro.hospital-admin.v1';
export const emptyDb = (): Db => Object.fromEntries(COLLECTIONS.map((c) => [c, [] as Row[]])) as unknown as Db;
const SERVER_DB: Db = emptyDb();

let state: Db | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch { throw new DbError('The browser storage is full, so this change could not be saved. Export your data and clear old records.'); }
}

function load(): Db {
  if (state) return state;
  if (typeof window === 'undefined') return SERVER_DB;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { state = { ...emptyDb(), ...JSON.parse(raw) }; return state!; }
  } catch { /* damaged data: fall through to the starter data */ }
  state = buildSeed();
  try { persist(); } catch { /* storage unavailable: keep working in memory */ }
  return state;
}

if (typeof window !== 'undefined') {
  // Another browser tab changed the data: reload it.
  window.addEventListener('storage', (e) => { if (e.key === STORAGE_KEY) { state = null; emit(); } });
}

const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
export const getDb = (): Db => load();
export const useDb = (): Db => useSyncExternalStore(subscribe, load, () => SERVER_DB);
export const useCollection = (c: CollectionName): Row[] => useDb()[c];

// ---------------------------------------------------------------- helpers
const nowIso = () => new Date().toISOString();
export const uid = (prefix: string) => `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
const clean = (data: Record<string, any>) => {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(data)) { if (k === 'id' || k === 'createdAt' || k === 'updatedAt') continue; out[k] = typeof v === 'string' ? v.trim() : v; }
  return out;
};
const blank = (v: any) => v === undefined || v === null || String(v).trim() === '';
const norm = (v: any) => String(v ?? '').trim().toLowerCase();

/** Next code such as EMP-0007 for a collection field. */
export function nextCode(c: CollectionName, field: string, prefix: string, width = 3): string {
  let max = 0;
  for (const r of load()[c]) { const m = String(r[field] ?? '').match(/(\d+)\s*$/); if (m) max = Math.max(max, Number(m[1])); }
  return `${prefix}${String(max + 1).padStart(width, '0')}`;
}

// ---------------------------------------------------------------- rules
interface Rule {
  label: string;
  required?: Record<string, string>;                                   // field -> label
  unique?: { fields: string[]; message: string }[];
  parents?: { field: string; col: CollectionName; label: string }[];   // the referenced row must exist
  dependants?: { col: CollectionName; field: string; message: string }[]; // delete refused while rows point here ({n} = count)
}

const RULES: Partial<Record<CollectionName, Rule>> = {
  hospitalProfile: { label: 'hospital profile', required: { name: 'Hospital name' } },
  branches: {
    label: 'branch', required: { name: 'Branch name', code: 'Branch code' },
    unique: [{ fields: ['code'], message: 'A branch with this code already exists' }],
    dependants: [{ col: 'buildings', field: 'branchId', message: 'This branch has {n} building(s). Move or delete them first.' }],
  },
  departments: {
    label: 'department', required: { name: 'Department name', code: 'Department code', type: 'Department type' },
    unique: [{ fields: ['name'], message: 'A department with this name already exists' }, { fields: ['code'], message: 'A department with this code already exists' }],
    parents: [{ field: 'headId', col: 'staff', label: 'The department head' }],
    dependants: [
      { col: 'staff', field: 'departmentId', message: 'This department has {n} staff member(s). Reassign them first.' },
      { col: 'wards', field: 'departmentId', message: 'This department has {n} ward(s). Reassign them first.' },
      { col: 'services', field: 'departmentId', message: 'This department has {n} service(s). Reassign them first.' },
      { col: 'costCentres', field: 'departmentId', message: 'This department has {n} cost centre(s). Reassign them first.' },
    ],
  },
  costCentres: {
    label: 'cost centre', required: { code: 'Cost centre code', name: 'Cost centre name', departmentId: 'Department' },
    unique: [{ fields: ['code'], message: 'A cost centre with this code already exists' }],
    parents: [{ field: 'departmentId', col: 'departments', label: 'The department' }, { field: 'ownerId', col: 'staff', label: 'The owner' }],
  },
  buildings: {
    label: 'building', required: { branchId: 'Branch', name: 'Building name', code: 'Building code' },
    unique: [{ fields: ['branchId', 'code'], message: 'This branch already has a building with this code' }],
    parents: [{ field: 'branchId', col: 'branches', label: 'The branch' }],
    dependants: [{ col: 'floors', field: 'buildingId', message: 'This building has {n} floor(s). Delete them first.' }],
  },
  floors: {
    label: 'floor', required: { buildingId: 'Building', name: 'Floor name', floorNumber: 'Floor number' },
    unique: [{ fields: ['buildingId', 'floorNumber'], message: 'This building already has a floor with this number' }],
    parents: [{ field: 'buildingId', col: 'buildings', label: 'The building' }],
    dependants: [{ col: 'wards', field: 'floorId', message: 'This floor has {n} ward(s). Move or delete them first.' }],
  },
  wards: {
    label: 'ward', required: { floorId: 'Floor', name: 'Ward name', code: 'Ward code', wardType: 'Ward type', departmentId: 'Department' },
    unique: [{ fields: ['code'], message: 'A ward with this code already exists' }],
    parents: [{ field: 'floorId', col: 'floors', label: 'The floor' }, { field: 'departmentId', col: 'departments', label: 'The department' }, { field: 'nurseInChargeId', col: 'staff', label: 'The nurse in charge' }],
    dependants: [{ col: 'rooms', field: 'wardId', message: 'This ward has {n} room(s). Move or delete them first.' }],
  },
  rooms: {
    label: 'room', required: { wardId: 'Ward', roomNumber: 'Room number', roomType: 'Room type', capacity: 'Number of beds', pricePerDay: 'Price per day' },
    unique: [{ fields: ['wardId', 'roomNumber'], message: 'This ward already has a room with this number' }],
    parents: [{ field: 'wardId', col: 'wards', label: 'The ward' }],
  },
  beds: {
    label: 'bed', required: { roomId: 'Room', bedNumber: 'Bed number', bedType: 'Bed type', status: 'Status' },
    unique: [{ fields: ['roomId', 'bedNumber'], message: 'This room already has a bed with this number' }],
    parents: [{ field: 'roomId', col: 'rooms', label: 'The room' }],
  },
  staff: {
    label: 'staff member', required: { employeeId: 'Employee ID', name: 'Name', staffType: 'Staff type', departmentId: 'Department', designation: 'Designation', role: 'Role' },
    unique: [{ fields: ['employeeId'], message: 'A staff member with this employee ID already exists' }, { fields: ['email'], message: 'A staff member with this email already exists' }],
    parents: [{ field: 'departmentId', col: 'departments', label: 'The department' }],
    dependants: [
      { col: 'departments', field: 'headId', message: 'This person is the head of {n} department(s). Choose another head first.' },
      { col: 'wards', field: 'nurseInChargeId', message: 'This person is the nurse in charge of {n} ward(s). Choose another first.' },
      { col: 'costCentres', field: 'ownerId', message: 'This person owns {n} cost centre(s). Choose another owner first.' },
      { col: 'branches', field: 'managerId', message: 'This person manages {n} branch(es). Choose another manager first.' },
      { col: 'policies', field: 'ownerId', message: 'This person owns {n} policy document(s). Choose another owner first.' },
    ],
  },
  services: {
    label: 'service', required: { code: 'Service code', name: 'Service name', departmentId: 'Department', category: 'Category' },
    unique: [{ fields: ['code'], message: 'A service with this code already exists' }],
    parents: [{ field: 'departmentId', col: 'departments', label: 'The department' }],
    dependants: [{ col: 'tariffs', field: 'serviceId', message: 'This service has {n} tariff price(s). Delete them first.' }],
  },
  tariffs: {
    label: 'tariff', required: { serviceId: 'Service', payerType: 'Payer type', price: 'Price', effectiveFrom: 'Effective from' },
    unique: [{ fields: ['serviceId', 'payerType', 'effectiveFrom'], message: 'This service already has a price for this payer type from this date' }],
    parents: [{ field: 'serviceId', col: 'services', label: 'The service' }],
  },
  policies: {
    label: 'policy', required: { code: 'Document code', title: 'Title', docType: 'Type', version: 'Version' },
    unique: [{ fields: ['code'], message: 'A document with this code already exists' }],
    parents: [{ field: 'ownerId', col: 'staff', label: 'The owner' }, { field: 'departmentId', col: 'departments', label: 'The department' }],
  },
  approvalRules: {
    label: 'approval rule', required: { name: 'Rule name', requestType: 'Request type', approverRole: 'Approver role' },
    unique: [{ fields: ['requestType', 'minAmount'], message: 'There is already a rule for this request type and amount' }],
  },
  approvalRequests: {
    label: 'approval request', required: { requestNo: 'Request number', title: 'Title', requestType: 'Request type', status: 'Status' },
    unique: [{ fields: ['requestNo'], message: 'A request with this number already exists' }],
    parents: [{ field: 'requesterId', col: 'staff', label: 'The requester' }],
  },
};

function validate(c: CollectionName, data: Record<string, any>, all: Db, existingId?: string) {
  const rule = RULES[c]; if (!rule) return;
  for (const [f, label] of Object.entries(rule.required || {})) if (blank(data[f])) throw new DbError(`${label} is required`);
  for (const u of rule.unique || []) {
    if (u.fields.some((f) => blank(data[f]))) continue;
    const clash = all[c].find((r) => r.id !== existingId && u.fields.every((f) => norm(r[f]) === norm(data[f])));
    if (clash) throw new DbError(u.message);
  }
  for (const p of rule.parents || []) {
    if (blank(data[p.field])) continue;
    if (!all[p.col].some((r) => r.id === data[p.field])) throw new DbError(`${p.label} you selected no longer exists`);
  }
}

// ---------------------------------------------------------------- beds follow the room's number of beds
function syncBeds(next: Db, room: Row) {
  const beds = next.beds.filter((b) => b.roomId === room.id);
  const cap = Math.max(1, Number(room.capacity) || 1);
  if (beds.length < cap) {
    const taken = new Set(beds.map((b) => b.bedNumber));
    const add: Row[] = [];
    let n = 1;
    for (let k = beds.length; k < cap; k++) {
      while (taken.has(`${room.roomNumber}-B${n}`)) n++;
      taken.add(`${room.roomNumber}-B${n}`);
      const t = nowIso();
      add.push({ id: uid('bed'), createdAt: t, updatedAt: t, roomId: room.id, bedNumber: `${room.roomNumber}-B${n}`, bedType: room.roomType === 'ICU' ? 'ICU' : 'Standard', status: 'Available', notes: '' });
    }
    next.beds = [...next.beds, ...add];
  } else if (beds.length > cap) {
    const drop = new Set(beds.filter((b) => b.status === 'Available').slice(-(beds.length - cap)).map((b) => b.id));
    next.beds = next.beds.filter((b) => !drop.has(b.id));
  }
}
// ---------------------------------------------------------------- writes
function commit(next: Db) { state = next; persist(); emit(); }

export function create(c: CollectionName, data: Record<string, any>): Row {
  const cur = load(); const d = clean(data);
  validate(c, d, cur);
  const next: Db = { ...cur };
  if (c === 'beds') {
    const room = cur.rooms.find((r) => r.id === d.roomId)!;
    const count = cur.beds.filter((b) => b.roomId === d.roomId).length;
    if (count >= Number(room.capacity)) throw new DbError(`Room ${room.roomNumber} already has ${count} bed(s), which is its number of beds. Increase the number of beds on the room first.`);
  }
  const t = nowIso();
  const row: Row = { id: uid(c.slice(0, 4)), createdAt: t, updatedAt: t, ...d };
  next[c] = [...cur[c], row];
  if (c === 'rooms') syncBeds(next, row);
  commit(next);
  return row;
}

export function update(c: CollectionName, id: string, data: Record<string, any>): Row {
  const cur = load(); const d = clean(data);
  const old = cur[c].find((r) => r.id === id);
  if (!old) throw new DbError('This record no longer exists');
  const merged = { ...old, ...d };
  validate(c, merged, cur, id);
  const next: Db = { ...cur };
  if (c === 'rooms') {
    const used = cur.beds.filter((b) => b.roomId === id && b.status !== 'Available').length;
    if (Number(merged.capacity) < used) throw new DbError(`${used} bed(s) in this room are in use, so the number of beds cannot be lower than ${used}.`);
  }
  if (c === 'beds' && d.roomId && d.roomId !== old.roomId) throw new DbError('A bed cannot be moved to another room. Delete it and add it to the other room.');
  const row: Row = { ...merged, id, updatedAt: nowIso() };
  next[c] = cur[c].map((r) => (r.id === id ? row : r));
  if (c === 'rooms') syncBeds(next, row);
  commit(next);
  return row;
}

export function remove(c: CollectionName, id: string): void {
  const cur = load();
  if (!cur[c].some((r) => r.id === id)) throw new DbError('This record no longer exists');
  for (const dep of RULES[c]?.dependants || []) {
    const n = cur[dep.col].filter((r) => r[dep.field] === id).length;
    if (n > 0) throw new DbError(dep.message.replace('{n}', String(n)));
  }
  const next: Db = { ...cur };
  if (c === 'rooms') {
    const used = cur.beds.filter((b) => b.roomId === id && b.status === 'Occupied').length;
    if (used > 0) throw new DbError(`This room has ${used} occupied bed(s). Discharge or transfer the patients first.`);
    next.beds = cur.beds.filter((b) => b.roomId !== id);
  }
  if (c === 'beds') {
    const bed = cur.beds.find((b) => b.id === id)!;
    if (bed.status === 'Occupied') throw new DbError('This bed is occupied. Discharge or transfer the patient first.');
    const siblings = cur.beds.filter((b) => b.roomId === bed.roomId);
    if (siblings.length <= 1) throw new DbError('A room needs at least one bed. Delete the room instead.');
    next.rooms = cur.rooms.map((r) => (r.id === bed.roomId ? { ...r, capacity: siblings.length - 1, updatedAt: nowIso() } : r));
  }
  next[c] = cur[c].filter((r) => r.id !== id);
  commit(next);
}

/** The hospital profile is a single record: create it the first time, then update it. */
export function saveProfile(data: Record<string, any>): Row {
  const cur = load();
  const existing = cur.hospitalProfile[0];
  return existing ? update('hospitalProfile', existing.id, data) : create('hospitalProfile', data);
}

// ---------------------------------------------------------------- backup, restore, reset
export function exportJson(): string {
  return JSON.stringify({ app: 'medixpro-hospital-admin', version: 1, exportedAt: nowIso(), data: load() }, null, 2);
}

export function importJson(text: string): void {
  let parsed: any;
  try { parsed = JSON.parse(text); } catch { throw new DbError('This file is not valid JSON.'); }
  const data = parsed?.data;
  if (!data || typeof data !== 'object') throw new DbError('This file is not a MedixPro export.');
  const next = emptyDb();
  for (const c of COLLECTIONS) {
    const rows = data[c];
    if (rows === undefined) continue;
    if (!Array.isArray(rows) || rows.some((r) => !r || typeof r.id !== 'string')) throw new DbError(`The "${c}" data in this file is damaged.`);
    next[c] = rows;
  }
  commit(next);
}

export function resetToStarterData() { commit(buildSeed()); }
export function clearAllData() { commit(emptyDb()); }
export const countRows = (db: Db) => COLLECTIONS.reduce((a, c) => a + db[c].length, 0);
