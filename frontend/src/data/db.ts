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
import { buildSeed, buildReceptionSeed } from './seed';
import { slotError, todayStr } from './slots';

export type Row = { id: string; createdAt: string; updatedAt: string; [key: string]: any };

// Module A: Hospital Administration. Module B: Reception (patients, appointments, queue, admissions ...).
export const ADMIN_COLLECTIONS = [
  'hospitalProfile', 'branches', 'departments', 'costCentres', 'buildings', 'floors', 'wards', 'rooms', 'beds',
  'staff', 'services', 'tariffs', 'policies', 'approvalRules', 'approvalRequests',
] as const;
export const RECEPTION_COLLECTIONS = [
  'receptionSettings', 'patients', 'enquiries', 'doctorSchedules', 'doctorLeaves', 'appointments',
  'admissions', 'patientDocuments', 'transfers', 'dischargeRegs', 'feedback',
] as const;
export const COLLECTIONS = [...ADMIN_COLLECTIONS, ...RECEPTION_COLLECTIONS] as const;
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
    if (raw) {
      const saved = JSON.parse(raw);
      const merged: Db = { ...emptyDb(), ...saved };
      // Data saved before Module B existed: add the reception starter data, keep every admin edit.
      const missing = RECEPTION_COLLECTIONS.filter((c) => saved[c] === undefined);
      if (missing.length) {
        const seed = buildReceptionSeed(merged);
        for (const c of missing) merged[c] = seed[c];
        state = merged;
        try { persist(); } catch { /* storage unavailable: keep working in memory */ }
      }
      state = merged;
      return state;
    }
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
  /** Extra rule that needs the whole database. Throw a DbError to refuse the save. `existingId` is set on edits. */
  check?: (data: Record<string, any>, db: Db, existingId?: string) => void;
}

const digits = (v: any) => String(v ?? '').replace(/\D/g, '');
const mobileOk = (v: any) => /^[6-9]\d{9}$/.test(digits(v)) && digits(v).length === 10;
const needMobile = (label: string, v: any, optional = false) => {
  if (blank(v)) { if (optional) return; throw new DbError(`${label} is required`); }
  if (!mobileOk(v)) throw new DbError(`${label} must be a 10 digit mobile number starting with 6, 7, 8 or 9`);
};

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
      { col: 'doctorSchedules', field: 'doctorId', message: 'This doctor has {n} OPD session(s) in Doctor Scheduling. Delete them first.' },
      { col: 'doctorLeaves', field: 'doctorId', message: 'This doctor has {n} leave record(s). Delete them first.' },
      { col: 'appointments', field: 'doctorId', message: 'This doctor has {n} appointment(s). Make the doctor Inactive instead of deleting.' },
      { col: 'admissions', field: 'doctorId', message: 'This doctor has {n} admission(s). Make the doctor Inactive instead of deleting.' },
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

  // ------------------------------------------------------------ Module B: Reception
  receptionSettings: {
    label: 'reception settings', required: { uhidPrefix: 'UHID prefix', mrnPrefix: 'MRN prefix', uhidDigits: 'UHID digits', mrnDigits: 'MRN digits' },
    check: (d) => {
      for (const [k, label] of [['uhidPrefix', 'UHID prefix'], ['mrnPrefix', 'MRN prefix']] as const) if (!/^[A-Za-z0-9-]{1,8}$/.test(String(d[k]))) throw new DbError(`${label} can have 1 to 8 letters, digits or dashes`);
      for (const [k, label] of [['uhidDigits', 'UHID digits'], ['mrnDigits', 'MRN digits']] as const) if (!(Number(d[k]) >= 4 && Number(d[k]) <= 10)) throw new DbError(`${label} must be between 4 and 10`);
    },
  },
  patients: {
    label: 'patient',
    required: { firstName: 'First name', lastName: 'Last name', gender: 'Gender', dob: 'Date of birth', phone: 'Mobile number', uhid: 'UHID' },
    unique: [
      { fields: ['uhid'], message: 'This UHID is already used by another patient' },
      { fields: ['firstName', 'lastName', 'dob', 'phone'], message: 'A patient with the same name, date of birth and mobile number is already registered' },
    ],
    check: (d) => {
      needMobile('Mobile number', d.phone); needMobile('Alternate mobile', d.altPhone, true); needMobile('Emergency contact mobile', d.emergencyPhone, true);
      if (d.dob > todayStr()) throw new DbError('Date of birth cannot be in the future');
      if (d.dob < '1900-01-01') throw new DbError('Enter a valid date of birth');
      if (!blank(d.email) && !/^\S+@\S+\.\S+$/.test(String(d.email))) throw new DbError('Enter a valid email address');
      if (!blank(d.pincode) && !/^\d{6}$/.test(String(d.pincode))) throw new DbError('PIN code must be 6 digits');
      if (!blank(d.idProofType) && blank(d.idProofNumber)) throw new DbError('Enter the ID proof number');
      if (d.idProofType === 'Aadhaar Card' && !blank(d.idProofNumber) && digits(d.idProofNumber).length !== 12) throw new DbError('Aadhaar number must be 12 digits');
      if (d.hasInsurance === 'Yes') {
        if (blank(d.insuranceProvider)) throw new DbError('Choose the insurance provider');
        if (blank(d.policyNumber)) throw new DbError('Enter the policy number');
      }
    },
    dependants: [
      { col: 'appointments', field: 'patientId', message: 'This patient has {n} appointment(s), so the record cannot be deleted. Mark the patient Inactive instead.' },
      { col: 'admissions', field: 'patientId', message: 'This patient has {n} admission(s), so the record cannot be deleted. Mark the patient Inactive instead.' },
      { col: 'patientDocuments', field: 'patientId', message: 'This patient has {n} document(s). Delete them first.' },
      { col: 'feedback', field: 'patientId', message: 'This patient has {n} feedback record(s). Delete them first.' },
    ],
  },
  enquiries: {
    label: 'enquiry', required: { name: 'Caller name', phone: 'Phone', enquiryType: 'Enquiry type', source: 'Source', status: 'Status' },
    parents: [{ field: 'patientId', col: 'patients', label: 'The patient' }],
    check: (d) => { if (!mobileOk(d.phone)) throw new DbError('Phone must be a 10 digit mobile number starting with 6, 7, 8 or 9'); },
  },
  doctorSchedules: {
    label: 'OPD session', required: { doctorId: 'Doctor', weekday: 'Day', startTime: 'Start time', endTime: 'End time', slotMinutes: 'Minutes per patient' },
    parents: [{ field: 'doctorId', col: 'staff', label: 'The doctor' }],
    check: (d, db, id) => {
      const doc = db.staff.find((s) => s.id === d.doctorId);
      if (doc && doc.staffType !== 'Doctor') throw new DbError('Only doctors can have an OPD schedule');
      if (!(d.startTime < d.endTime)) throw new DbError('The end time must be after the start time');
      const step = Number(d.slotMinutes);
      if (!(step >= 5 && step <= 120)) throw new DbError('Minutes per patient must be between 5 and 120');
      const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
      if (toMin(d.endTime) - toMin(d.startTime) < step) throw new DbError('The session is shorter than one patient slot');
      if (!blank(d.maxPatients) && !(Number(d.maxPatients) >= 1)) throw new DbError('Maximum patients must be at least 1');
      const clash = db.doctorSchedules.find((s) => s.id !== id && s.doctorId === d.doctorId && s.weekday === d.weekday && String(s.status || 'Active') !== 'Inactive' && s.startTime < d.endTime && s.endTime > d.startTime);
      if (clash && String(d.status || 'Active') !== 'Inactive') throw new DbError(`This overlaps another ${d.weekday} session (${clash.startTime} - ${clash.endTime}) of the same doctor`);
    },
    dependants: [],
  },
  doctorLeaves: {
    label: 'leave', required: { doctorId: 'Doctor', fromDate: 'From date', toDate: 'To date' },
    parents: [{ field: 'doctorId', col: 'staff', label: 'The doctor' }],
    check: (d, db) => {
      if (d.fromDate > d.toDate) throw new DbError('The "to" date cannot be before the "from" date');
      const n = db.appointments.filter((a) => a.doctorId === d.doctorId && a.date >= d.fromDate && a.date <= d.toDate && ['Booked', 'Checked-in'].includes(a.status)).length;
      if (n > 0) throw new DbError(`This doctor has ${n} booked appointment(s) in this period. Cancel or reschedule them first.`);
    },
  },
  appointments: {
    label: 'appointment',
    required: { patientId: 'Patient', doctorId: 'Doctor', departmentId: 'Department', date: 'Date', status: 'Status', source: 'Source', visitType: 'Visit type', tokenNo: 'Token' },
    unique: [{ fields: ['doctorId', 'date', 'tokenNo'], message: 'This token number is already issued to another patient of this doctor today' }],
    parents: [{ field: 'patientId', col: 'patients', label: 'The patient' }, { field: 'doctorId', col: 'staff', label: 'The doctor' }, { field: 'departmentId', col: 'departments', label: 'The department' }],
    check: (d, db, id) => {
      const old = id ? db.appointments.find((a) => a.id === id) : undefined;
      // Only re-check the slot when the booking itself changes (not for check-in, call, complete ...).
      const moved = !old || ['patientId', 'doctorId', 'date', 'time', 'source'].some((k) => old[k] !== d[k]);
      if (!moved) return;
      const patient = db.patients.find((p) => p.id === d.patientId);
      if (patient && String(patient.status || 'Active') === 'Inactive') throw new DbError('This patient is marked Inactive. Make the patient Active first.');
      const err = slotError(db, d, id);
      if (err) throw new DbError(err);
    },
  },
  admissions: {
    label: 'admission', required: { patientId: 'Patient', bedId: 'Bed', doctorId: 'Doctor', departmentId: 'Department', admittedAt: 'Admission date', status: 'Status' },
    parents: [{ field: 'patientId', col: 'patients', label: 'The patient' }, { field: 'doctorId', col: 'staff', label: 'The doctor' }, { field: 'departmentId', col: 'departments', label: 'The department' }],
  },
  patientDocuments: {
    label: 'document', required: { patientId: 'Patient', docType: 'Document type', title: 'Title', fileName: 'File' },
    parents: [{ field: 'patientId', col: 'patients', label: 'The patient' }],
  },
  transfers: {
    label: 'transfer', required: { patientId: 'Patient', admissionId: 'Admission', transferType: 'Transfer type', transferDate: 'Date' },
    parents: [{ field: 'patientId', col: 'patients', label: 'The patient' }],
  },
  dischargeRegs: {
    label: 'discharge', required: { admissionId: 'Admission', patientId: 'Patient', dischargeType: 'Discharge type', dischargeDate: 'Discharge date' },
    unique: [{ fields: ['admissionId'], message: 'The discharge of this admission is already registered' }],
    parents: [{ field: 'patientId', col: 'patients', label: 'The patient' }],
  },
  feedback: {
    label: 'feedback', required: { patientId: 'Patient', rating: 'Rating', category: 'Category' },
    parents: [{ field: 'patientId', col: 'patients', label: 'The patient' }],
    check: (d) => { if (!(Number(d.rating) >= 1 && Number(d.rating) <= 5)) throw new DbError('Rating must be from 1 to 5'); },
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
  rule.check?.(data, all, existingId);
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
function commit(next: Db) { state = next; if (suspend) return; persist(); emit(); }

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

/** A collection that holds a single record (hospital profile, reception settings): create it, then update it. */
export function saveSingle(c: CollectionName, data: Record<string, any>): Row {
  const existing = load()[c][0];
  return existing ? update(c, existing.id, data) : create(c, data);
}
export const saveProfile = (data: Record<string, any>) => saveSingle('hospitalProfile', data);

/**
 * Apply several changes as ONE save: either all of them happen or none. Each step is validated with the
 * same rules as a single write, against the data as the earlier steps left it.
 */
export function transaction(work: (tx: { create: typeof create; update: typeof update; remove: typeof remove }) => void): void {
  const before = load(); // writes replace the data object instead of changing it, so this is a safe rollback point
  try {
    suspend = true;
    work({ create, update, remove });
  } catch (e) {
    state = before; suspend = false;
    emit();
    throw e;
  }
  suspend = false;
  persist(); emit();
}
let suspend = false;

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
