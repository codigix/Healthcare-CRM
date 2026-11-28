import type { AdminCrudProps, ColumnDef, FieldDef, FilterDef, StatDef } from './AdminCrud';
import { StatusBadge } from './AdminCrud';
import { nextCode, type Db, type Row } from '@/data/db';
import { ADMIN_ROLES, STAFF_ROLES, REQUEST_TYPES, money, fmtDate, today, nameOf, bedsInWard, bedsInBuilding, pct, routeApproval } from '@/data/actions';

type Def = Pick<AdminCrudProps, 'columns' | 'fields' | 'stats'> & Partial<Pick<AdminCrudProps, 'filters' | 'defaults' | 'beforeSave' | 'emptyHint' | 'canEditRow' | 'canDeleteRow'>>;
const ACTIVE = ['Active', 'Inactive'];
const status = (key = 'status'): ColumnDef => ({ header: 'Status', key, render: (r) => <StatusBadge value={r[key]} /> });
const sum = (rows: Row[], k: string) => rows.reduce((a, r) => a + Number(r[k] || 0), 0);
const count = (rows: Row[], k: string, v: string) => rows.filter((r) => r[k] === v).length;
const upper = (d: Record<string, any>, k: string) => ({ ...d, [k]: String(d[k] ?? '').toUpperCase() });
const staffOpt = (r: Row, db: Db) => `${r.name} (${r.designation})`;
const activeOnly = (r: Row) => String(r.status || 'Active') !== 'Inactive';
const floorLabel = (db: Db, id: string) => { const f = db.floors.find((x) => x.id === id); return f ? `${f.name}, ${nameOf(db, 'buildings', f.buildingId)}` : ''; };
const wardOf = (db: Db, roomId: string) => db.wards.find((w) => w.id === db.rooms.find((r) => r.id === roomId)?.wardId);

// ------------------------------------------------------------------ Branch configuration
export const branchesDef: Def = {
  columns: [
    { header: 'Code', key: 'code' }, { header: 'Branch', key: 'name' }, { header: 'City', key: 'city' },
    { header: 'Manager', value: (r, db) => nameOf(db, 'staff', r.managerId) }, { header: 'Hours', value: (r) => (r.openingTime && r.closingTime ? `${r.openingTime} - ${r.closingTime}` : '') },
    { header: 'Buildings', value: (r, db) => db.buildings.filter((b) => b.branchId === r.id).length }, { header: 'Beds', value: (r, db) => db.buildings.filter((b) => b.branchId === r.id).reduce((a, b) => a + bedsInBuilding(db, b.id).length, 0) }, status(),
  ],
  fields: [
    { name: 'name', label: 'Branch name', required: true, half: true }, { name: 'code', label: 'Branch code', required: true, half: true, placeholder: 'e.g. PUNE-01' },
    { name: 'address', label: 'Address' }, { name: 'city', label: 'City', half: true }, { name: 'state', label: 'State', half: true },
    { name: 'phone', label: 'Phone', type: 'tel', half: true }, { name: 'email', label: 'Email', type: 'email', half: true },
    { name: 'managerId', label: 'Branch manager', type: 'select', half: true, from: { col: 'staff', label: staffOpt, filter: activeOnly } },
    { name: 'status', label: 'Status', type: 'select', options: ACTIVE, required: true, half: true },
    { name: 'openingTime', label: 'Opens at', type: 'time', half: true }, { name: 'closingTime', label: 'Closes at', type: 'time', half: true },
  ],
  stats: [
    { label: 'Branches', value: (r) => r.length, color: 'text-blue-400' }, { label: 'Active', value: (r) => count(r, 'status', 'Active'), color: 'text-emerald-400' },
    { label: 'Buildings', value: (_r, db) => db.buildings.length, color: 'text-indigo-400' }, { label: 'Beds', value: (_r, db) => db.beds.length, color: 'text-amber-400' },
  ],
  defaults: () => ({ status: 'Active', openingTime: '00:00', closingTime: '23:59' }),
  beforeSave: (d) => upper(d, 'code'),
};

// ------------------------------------------------------------------ Department management
export const departmentsDef: Def = {
  columns: [
    { header: 'Code', key: 'code' }, { header: 'Department', key: 'name' }, { header: 'Type', key: 'type' },
    { header: 'Head', value: (r, db) => nameOf(db, 'staff', r.headId) || 'Not assigned' }, { header: 'Staff', value: (r, db) => db.staff.filter((s) => s.departmentId === r.id).length },
    { header: 'Beds', value: (r, db) => db.wards.filter((w) => w.departmentId === r.id).reduce((a, w) => a + bedsInWard(db, w.id).length, 0) },
    { header: 'Cost centres', value: (r, db) => db.costCentres.filter((c) => c.departmentId === r.id).length }, status(),
  ],
  fields: [
    { name: 'name', label: 'Department name', required: true, half: true }, { name: 'code', label: 'Department code', required: true, half: true, placeholder: 'e.g. CARD' },
    { name: 'type', label: 'Type', type: 'select', options: ['Clinical', 'Diagnostic', 'Support', 'Administrative'], required: true, half: true },
    { name: 'headId', label: 'Department head', type: 'select', half: true, from: { col: 'staff', label: staffOpt, filter: activeOnly }, help: 'Add the person in Doctor & Staff Master first.' },
    { name: 'location', label: 'Location', placeholder: 'e.g. Main Building, Second Floor' }, { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'status', label: 'Status', type: 'select', options: ACTIVE, required: true, half: true },
  ],
  stats: [
    { label: 'Departments', value: (r) => r.length, color: 'text-blue-400' }, { label: 'Clinical', value: (r) => count(r, 'type', 'Clinical'), color: 'text-emerald-400' },
    { label: 'With a head', value: (r) => r.filter((d) => d.headId).length, color: 'text-indigo-400' }, { label: 'Without a head', value: (r) => r.filter((d) => !d.headId).length, color: 'text-amber-400' },
  ],
  filters: [{ label: 'types', options: ['Clinical', 'Diagnostic', 'Support', 'Administrative'], match: (r, v) => r.type === v }],
  defaults: () => ({ status: 'Active', type: 'Clinical' }),
  beforeSave: (d) => upper(d, 'code'),
  emptyHint: 'Step 2 of the workflow. A department needs a head, so add staff first if you want to name one now.',
};

// ------------------------------------------------------------------ Cost centre management
const usedPct = (r: Row) => (Number(r.monthlyBudget) ? Math.round((Number(r.mtdSpend || 0) / Number(r.monthlyBudget)) * 100) : 0);
export const costCentresDef: Def = {
  columns: [
    { header: 'Code', key: 'code' }, { header: 'Cost centre', key: 'name' }, { header: 'Department', value: (r, db) => nameOf(db, 'departments', r.departmentId) },
    { header: 'Monthly budget', value: (r) => money(r.monthlyBudget) }, { header: 'Spent this month', value: (r) => money(r.mtdSpend) },
    { header: 'Used', value: (r) => `${usedPct(r)}%`, render: (r) => <StatusBadge value={usedPct(r) > 100 ? 'Over budget' : usedPct(r) >= 85 ? 'Pending' : 'Active'} /> }, status(),
  ],
  fields: [
    { name: 'code', label: 'Cost centre code', required: true, half: true }, { name: 'name', label: 'Cost centre name', required: true, half: true },
    { name: 'departmentId', label: 'Department', type: 'select', required: true, half: true, from: { col: 'departments', label: (r) => r.name } },
    { name: 'ownerId', label: 'Owner', type: 'select', half: true, from: { col: 'staff', label: staffOpt, filter: activeOnly } },
    { name: 'monthlyBudget', label: 'Monthly budget (Rs.)', type: 'number', required: true, half: true, min: 0 }, { name: 'mtdSpend', label: 'Spent this month (Rs.)', type: 'number', half: true, min: 0 },
    { name: 'status', label: 'Status', type: 'select', options: ACTIVE, required: true, half: true },
  ],
  stats: [
    { label: 'Total monthly budget', value: (r) => money(sum(r, 'monthlyBudget')), color: 'text-blue-400' }, { label: 'Spent this month', value: (r) => money(sum(r, 'mtdSpend')), color: 'text-amber-400' },
    { label: 'Budget used', value: (r) => pct(sum(r, 'mtdSpend'), sum(r, 'monthlyBudget')), color: 'text-emerald-400' }, { label: 'Over budget', value: (r) => r.filter((c) => usedPct(c) > 100).length, color: 'text-red-400' },
  ],
  filters: [{ label: 'departments', options: (db) => db.departments.map((d) => ({ value: d.id, label: d.name })), match: (r, v) => r.departmentId === v }],
  defaults: () => ({ code: nextCode('costCentres', 'code', 'CC-'), status: 'Active', mtdSpend: 0 }),
  beforeSave: (d) => upper(d, 'code'),
};

// ------------------------------------------------------------------ Building & floor management
export const buildingsDef: Def = {
  columns: [
    { header: 'Code', key: 'code' }, { header: 'Building', key: 'name' }, { header: 'Branch', value: (r, db) => nameOf(db, 'branches', r.branchId) },
    { header: 'Planned floors', key: 'totalFloors' }, { header: 'Floors added', value: (r, db) => db.floors.filter((f) => f.buildingId === r.id).length }, { header: 'Beds', value: (r, db) => bedsInBuilding(db, r.id).length }, status(),
  ],
  fields: [
    { name: 'branchId', label: 'Branch', type: 'select', required: true, from: { col: 'branches', label: (r) => `${r.name} (${r.code})` } },
    { name: 'name', label: 'Building name', required: true, half: true }, { name: 'code', label: 'Building code', required: true, half: true, placeholder: 'e.g. MB' },
    { name: 'totalFloors', label: 'Number of floors', type: 'number', required: true, half: true, min: 1 }, { name: 'status', label: 'Status', type: 'select', options: ACTIVE, required: true, half: true },
    { name: 'description', label: 'Description', type: 'textarea' },
  ],
  stats: [
    { label: 'Buildings', value: (r) => r.length, color: 'text-blue-400' }, { label: 'Active', value: (r) => count(r, 'status', 'Active'), color: 'text-emerald-400' }, { label: 'Floors added', value: (_r, db) => db.floors.length, color: 'text-indigo-400' },
  ],
  defaults: () => ({ status: 'Active', totalFloors: 1 }),
  beforeSave: (d) => upper(d, 'code'),
  emptyHint: 'Step 3 of the workflow. Add a branch first (Hospital Setup), then a building, then its floors.',
};

export const floorsDef: Def = {
  columns: [
    { header: 'Floor', key: 'name' }, { header: 'Number', key: 'floorNumber' }, { header: 'Building', value: (r, db) => nameOf(db, 'buildings', r.buildingId) },
    { header: 'Wards', value: (r, db) => db.wards.filter((w) => w.floorId === r.id).length }, status(),
  ],
  fields: [
    { name: 'buildingId', label: 'Building', type: 'select', required: true, from: { col: 'buildings', label: (r, db) => `${r.name} - ${nameOf(db, 'branches', r.branchId)}` } },
    { name: 'name', label: 'Floor name', required: true, half: true, placeholder: 'e.g. Ground Floor' }, { name: 'floorNumber', label: 'Floor number', type: 'number', required: true, half: true, min: -5, help: '0 = ground floor' },
    { name: 'status', label: 'Status', type: 'select', options: ACTIVE, required: true, half: true }, { name: 'description', label: 'Description', type: 'textarea' },
  ],
  stats: [
    { label: 'Floors', value: (r) => r.length, color: 'text-blue-400' }, { label: 'Active', value: (r) => count(r, 'status', 'Active'), color: 'text-emerald-400' }, { label: 'Wards', value: (_r, db) => db.wards.length, color: 'text-indigo-400' },
  ],
  filters: [{ label: 'buildings', options: (db) => db.buildings.map((b) => ({ value: b.id, label: b.name })), match: (r, v) => r.buildingId === v }],
  defaults: () => ({ status: 'Active' }),
};

// ------------------------------------------------------------------ Ward & room management
export const WARD_TYPES = ['General', 'Private', 'Semi-Private', 'Pediatric', 'ICU', 'NICU', 'PICU', 'Emergency', 'Maternity', 'Isolation', 'Day Care'];
export const wardsDef: Def = {
  columns: [
    { header: 'Code', key: 'code' }, { header: 'Ward', key: 'name' }, { header: 'Type', key: 'wardType' }, { header: 'Department', value: (r, db) => nameOf(db, 'departments', r.departmentId) },
    { header: 'Floor', value: (r, db) => floorLabel(db, r.floorId) }, { header: 'Beds', value: (r, db) => bedsInWard(db, r.id).length },
    { header: 'Occupied', value: (r, db) => bedsInWard(db, r.id).filter((b) => b.status === 'Occupied').length }, status(),
  ],
  fields: [
    { name: 'floorId', label: 'Floor', type: 'select', required: true, from: { col: 'floors', label: (r, db) => `${r.name} - ${nameOf(db, 'buildings', r.buildingId)}` } },
    { name: 'name', label: 'Ward name', required: true, half: true }, { name: 'code', label: 'Ward code', required: true, half: true, placeholder: 'e.g. ICU-W' },
    { name: 'wardType', label: 'Ward type', type: 'select', options: WARD_TYPES, required: true, half: true },
    { name: 'departmentId', label: 'Department', type: 'select', required: true, half: true, from: { col: 'departments', label: (r) => r.name } },
    { name: 'nurseInChargeId', label: 'Nurse in charge', type: 'select', half: true, from: { col: 'staff', label: staffOpt, filter: (r) => r.staffType === 'Nurse' && activeOnly(r) } },
    { name: 'status', label: 'Status', type: 'select', options: ACTIVE, required: true, half: true },
  ],
  stats: [
    { label: 'Wards', value: (r) => r.length, color: 'text-blue-400' }, { label: 'Beds', value: (r, db) => r.reduce((a, w) => a + bedsInWard(db, w.id).length, 0), color: 'text-indigo-400' },
    { label: 'Occupied beds', value: (r, db) => r.reduce((a, w) => a + bedsInWard(db, w.id).filter((b) => b.status === 'Occupied').length, 0), color: 'text-amber-400' },
    { label: 'Occupancy', value: (r, db) => pct(r.reduce((a, w) => a + bedsInWard(db, w.id).filter((b) => b.status === 'Occupied').length, 0), r.reduce((a, w) => a + bedsInWard(db, w.id).length, 0)), color: 'text-emerald-400' },
  ],
  filters: [{ label: 'ward types', options: WARD_TYPES, match: (r, v) => r.wardType === v }, { label: 'departments', options: (db) => db.departments.map((d) => ({ value: d.id, label: d.name })), match: (r, v) => r.departmentId === v }],
  defaults: () => ({ status: 'Active', wardType: 'General' }),
  beforeSave: (d) => upper(d, 'code'),
};

export const ROOM_TYPES = ['General Ward', 'Semi-Private', 'Private', 'Deluxe', 'ICU', 'NICU', 'Emergency', 'Isolation', 'Suite'];
export const ROOM_STATUS = ['Available', 'Reserved', 'Maintenance', 'Out of Service'];
export const roomsDef: Def = {
  columns: [
    { header: 'Room', key: 'roomNumber' }, { header: 'Type', key: 'roomType' }, { header: 'Ward', value: (r, db) => nameOf(db, 'wards', r.wardId) },
    { header: 'Beds', value: (r, db) => db.beds.filter((b) => b.roomId === r.id).length },
    { header: 'Occupied', value: (r, db) => db.beds.filter((b) => b.roomId === r.id && b.status === 'Occupied').length }, { header: 'Price / day', value: (r) => money(r.pricePerDay) }, status(),
  ],
  fields: [
    { name: 'wardId', label: 'Ward', type: 'select', required: true, from: { col: 'wards', label: (r) => `${r.name} (${r.code})` } },
    { name: 'roomNumber', label: 'Room number', required: true, half: true }, { name: 'roomType', label: 'Room type', type: 'select', options: ROOM_TYPES, required: true, half: true },
    { name: 'capacity', label: 'Number of beds', type: 'number', required: true, half: true, min: 1, help: 'Beds are created for you. The Bed Management page shows them.' },
    { name: 'pricePerDay', label: 'Price per day (Rs.)', type: 'number', required: true, half: true, min: 0 },
    { name: 'status', label: 'Status', type: 'select', options: ROOM_STATUS, required: true, half: true }, { name: 'description', label: 'Description', type: 'textarea' },
  ],
  stats: [
    { label: 'Rooms', value: (r) => r.length, color: 'text-blue-400' }, { label: 'Available rooms', value: (r) => count(r, 'status', 'Available'), color: 'text-emerald-400' },
    { label: 'Beds', value: (_r, db) => db.beds.length, color: 'text-indigo-400' }, { label: 'Occupied beds', value: (_r, db) => db.beds.filter((b) => b.status === 'Occupied').length, color: 'text-amber-400' },
  ],
  filters: [{ label: 'wards', options: (db) => db.wards.map((w) => ({ value: w.id, label: w.name })), match: (r, v) => r.wardId === v }, { label: 'statuses', options: ROOM_STATUS, match: (r, v) => r.status === v }],
  defaults: () => ({ status: 'Available', capacity: 1, pricePerDay: 0, roomType: 'General Ward' }),
  emptyHint: 'Step 3 of the workflow. Add a ward first, then its rooms. Beds are created from the number of beds.',
};

// ------------------------------------------------------------------ Bed management
export const BED_STATUS = ['Available', 'Occupied', 'Reserved', 'Cleaning', 'Maintenance'];
export const bedsDef: Def = {
  columns: [
    { header: 'Bed', key: 'bedNumber' }, { header: 'Room', value: (r, db) => db.rooms.find((x) => x.id === r.roomId)?.roomNumber || '' }, { header: 'Ward', value: (r, db) => wardOf(db, r.roomId)?.name || '' },
    { header: 'Type', key: 'bedType' }, status(), { header: 'Notes', key: 'notes' },
  ],
  fields: [
    { name: 'roomId', label: 'Room', type: 'select', required: true, lockOnEdit: true, from: { col: 'rooms', label: (r, db) => `Room ${r.roomNumber} - ${wardOf(db, r.id)?.name || ''}` } },
    { name: 'bedNumber', label: 'Bed number', required: true, half: true, placeholder: 'e.g. G-101-B2' },
    { name: 'bedType', label: 'Bed type', type: 'select', options: ['Standard', 'ICU', 'Pediatric', 'Electric', 'Bariatric', 'Cradle'], required: true, half: true },
    { name: 'status', label: 'Status', type: 'select', options: BED_STATUS, required: true, half: true, help: 'Admissions will set Occupied automatically later.' }, { name: 'notes', label: 'Notes', type: 'textarea' },
  ],
  stats: [
    { label: 'Beds', value: (r) => r.length, color: 'text-blue-400' }, { label: 'Available', value: (r) => count(r, 'status', 'Available'), color: 'text-emerald-400' },
    { label: 'Occupied', value: (r) => count(r, 'status', 'Occupied'), color: 'text-amber-400' }, { label: 'Occupancy', value: (r) => pct(count(r, 'status', 'Occupied'), r.length), color: 'text-indigo-400' },
  ],
  filters: [{ label: 'wards', options: (db) => db.wards.map((w) => ({ value: w.id, label: w.name })), match: (r, v, db) => wardOf(db, r.roomId)?.id === v }, { label: 'statuses', options: BED_STATUS, match: (r, v) => r.status === v }],
  defaults: () => ({ status: 'Available', bedType: 'Standard' }),
  emptyHint: 'Beds appear when you add a room with its number of beds.',
};

// ------------------------------------------------------------------ Doctor & staff master
const STAFF_TYPES = ['Doctor', 'Nurse', 'Technician', 'Administrative', 'Support'];
export const staffDef: Def = {
  columns: [
    { header: 'Employee ID', key: 'employeeId' }, { header: 'Name', key: 'name' }, { header: 'Type', key: 'staffType' }, { header: 'Department', value: (r, db) => nameOf(db, 'departments', r.departmentId) },
    { header: 'Designation', key: 'designation' }, { header: 'Role', key: 'role' }, { header: 'Phone', key: 'phone' }, status(),
  ],
  fields: [
    { name: 'h1', label: 'Identity', type: 'heading' },
    { name: 'employeeId', label: 'Employee ID', required: true, half: true }, { name: 'name', label: 'Full name', required: true, half: true },
    { name: 'staffType', label: 'Staff type', type: 'select', options: STAFF_TYPES, required: true, half: true }, { name: 'status', label: 'Status', type: 'select', options: ['Active', 'On leave', 'Inactive'], required: true, half: true },
    { name: 'h2', label: 'Posting', type: 'heading' },
    { name: 'departmentId', label: 'Department', type: 'select', required: true, half: true, from: { col: 'departments', label: (r) => r.name } },
    { name: 'designation', label: 'Designation', required: true, half: true, placeholder: 'e.g. Senior Consultant' },
    { name: 'role', label: 'Role in the system', type: 'select', options: STAFF_ROLES, required: true, half: true, help: 'The four administration roles approve requests and run the hospital.' },
    { name: 'joiningDate', label: 'Joining date', type: 'date', half: true },
    { name: 'h3', label: 'Doctors only', type: 'heading' },
    { name: 'specialization', label: 'Specialisation', half: true }, { name: 'consultationFee', label: 'Consultation fee (Rs.)', type: 'number', half: true, min: 0 },
    { name: 'h4', label: 'Contact', type: 'heading' },
    { name: 'phone', label: 'Phone', type: 'tel', half: true }, { name: 'email', label: 'Email', type: 'email', half: true },
  ],
  stats: [
    { label: 'Staff', value: (r) => r.length, color: 'text-blue-400' }, { label: 'Doctors', value: (r) => count(r, 'staffType', 'Doctor'), color: 'text-emerald-400' },
    { label: 'Nurses', value: (r) => count(r, 'staffType', 'Nurse'), color: 'text-indigo-400' }, { label: 'Active', value: (r) => count(r, 'status', 'Active'), color: 'text-amber-400' },
  ],
  filters: [
    { label: 'types', options: STAFF_TYPES, match: (r, v) => r.staffType === v }, { label: 'departments', options: (db) => db.departments.map((d) => ({ value: d.id, label: d.name })), match: (r, v) => r.departmentId === v },
    { label: 'roles', options: STAFF_ROLES, match: (r, v) => r.role === v },
  ],
  defaults: () => ({ employeeId: nextCode('staff', 'employeeId', 'EMP-'), status: 'Active', joiningDate: today(), staffType: 'Doctor', role: 'Doctor' }),
  emptyHint: 'Step 4 of the workflow. Add the people first; then a department head can be chosen on the Departments page.',
};

// ------------------------------------------------------------------ Service & tariff management
export const SERVICE_CATEGORIES = ['Consultation', 'Procedure', 'Laboratory', 'Radiology', 'Room', 'Pharmacy', 'Other'];
export const PAYER_TYPES = ['General', 'Insurance / TPA', 'Corporate', 'Government Scheme'];
const latestPrice = (db: Db, serviceId: string, payer: string) => db.tariffs.filter((t) => t.serviceId === serviceId && t.payerType === payer && String(t.status || 'Active') !== 'Inactive').sort((a, b) => String(b.effectiveFrom).localeCompare(String(a.effectiveFrom)))[0];
export const servicesDef: Def = {
  columns: [
    { header: 'Code', key: 'code' }, { header: 'Service', key: 'name' }, { header: 'Department', value: (r, db) => nameOf(db, 'departments', r.departmentId) }, { header: 'Category', key: 'category' },
    { header: 'General price', value: (r, db) => { const t = latestPrice(db, r.id, 'General'); return t ? money(t.price) : 'No price'; } },
    { header: 'Prices set', value: (r, db) => db.tariffs.filter((t) => t.serviceId === r.id).length }, status(),
  ],
  fields: [
    { name: 'code', label: 'Service code', required: true, half: true }, { name: 'name', label: 'Service name', required: true, half: true },
    { name: 'departmentId', label: 'Department', type: 'select', required: true, half: true, from: { col: 'departments', label: (r) => r.name } },
    { name: 'category', label: 'Category', type: 'select', options: SERVICE_CATEGORIES, required: true, half: true },
    { name: 'unit', label: 'Charged', half: true, placeholder: 'per visit, per day, per test ...' }, { name: 'status', label: 'Status', type: 'select', options: ACTIVE, required: true, half: true },
    { name: 'description', label: 'Description', type: 'textarea' },
  ],
  stats: [
    { label: 'Services', value: (r) => r.length, color: 'text-blue-400' }, { label: 'Active', value: (r) => count(r, 'status', 'Active'), color: 'text-emerald-400' },
    { label: 'With a price', value: (r, db) => r.filter((s) => db.tariffs.some((t) => t.serviceId === s.id)).length, color: 'text-indigo-400' },
    { label: 'Without a price', value: (r, db) => r.filter((s) => !db.tariffs.some((t) => t.serviceId === s.id)).length, color: 'text-amber-400' },
  ],
  filters: [{ label: 'categories', options: SERVICE_CATEGORIES, match: (r, v) => r.category === v }, { label: 'departments', options: (db) => db.departments.map((d) => ({ value: d.id, label: d.name })), match: (r, v) => r.departmentId === v }],
  defaults: () => ({ code: nextCode('services', 'code', 'SRV-'), status: 'Active', category: 'Consultation' }),
  beforeSave: (d) => upper(d, 'code'),
  emptyHint: 'Step 5 of the workflow. Add the services first, then give each one a price on the Tariffs tab.',
};

export const tariffsDef: Def = {
  columns: [
    { header: 'Service code', value: (r, db) => nameOf(db, 'services', r.serviceId, 'code') }, { header: 'Service', value: (r, db) => nameOf(db, 'services', r.serviceId) },
    { header: 'Payer type', key: 'payerType' }, { header: 'Price', value: (r) => money(r.price) }, { header: 'Effective from', value: (r) => fmtDate(r.effectiveFrom) }, status(),
  ],
  fields: [
    { name: 'serviceId', label: 'Service', type: 'select', required: true, from: { col: 'services', label: (r) => `${r.code} - ${r.name}` } },
    { name: 'payerType', label: 'Payer type', type: 'select', options: PAYER_TYPES, required: true, half: true }, { name: 'price', label: 'Price (Rs.)', type: 'number', required: true, half: true, min: 0 },
    { name: 'effectiveFrom', label: 'Effective from', type: 'date', required: true, half: true }, { name: 'status', label: 'Status', type: 'select', options: ACTIVE, required: true, half: true },
  ],
  stats: [
    { label: 'Prices', value: (r) => r.length, color: 'text-blue-400' }, { label: 'Payer types', value: (r) => new Set(r.map((t) => t.payerType)).size, color: 'text-emerald-400' },
    { label: 'Services priced', value: (r) => new Set(r.map((t) => t.serviceId)).size, color: 'text-indigo-400' }, { label: 'Services without price', value: (_r, db) => db.services.filter((s) => !db.tariffs.some((t) => t.serviceId === s.id)).length, color: 'text-amber-400' },
  ],
  filters: [{ label: 'payer types', options: PAYER_TYPES, match: (r, v) => r.payerType === v }, { label: 'services', options: (db) => db.services.map((s) => ({ value: s.id, label: `${s.code} - ${s.name}` })), match: (r, v) => r.serviceId === v }],
  defaults: () => ({ payerType: 'General', effectiveFrom: today(), status: 'Active' }),
};

// ------------------------------------------------------------------ Hospital policies & SOPs
const reviewOverdue = (r: Row) => !!r.reviewDate && r.reviewDate < today() && r.status === 'Approved';
export const policiesDef: Def = {
  columns: [
    { header: 'Code', key: 'code' }, { header: 'Title', key: 'title' }, { header: 'Type', key: 'docType' }, { header: 'Version', key: 'version' },
    { header: 'Department', value: (r, db) => nameOf(db, 'departments', r.departmentId) || 'Hospital-wide' },
    { header: 'Review due', value: (r) => fmtDate(r.reviewDate), render: (r) => (reviewOverdue(r) ? <StatusBadge value="Overdue" /> : <span className="text-sm">{fmtDate(r.reviewDate) || '-'}</span>) }, status(),
  ],
  fields: [
    { name: 'code', label: 'Document code', required: true, half: true, placeholder: 'e.g. SOP-004' }, { name: 'docType', label: 'Type', type: 'select', options: ['Policy', 'SOP', 'Protocol', 'Circular'], required: true, half: true },
    { name: 'title', label: 'Title', required: true }, { name: 'version', label: 'Version', required: true, half: true }, { name: 'status', label: 'Status', type: 'select', options: ['Draft', 'Under review', 'Approved', 'Retired'], required: true, half: true, help: 'Use "Submit for approval" on the list so the right person approves it.' },
    { name: 'departmentId', label: 'Department', type: 'select', half: true, from: { col: 'departments', label: (r) => r.name }, help: 'Leave empty for a hospital-wide document.' },
    { name: 'ownerId', label: 'Document owner', type: 'select', half: true, from: { col: 'staff', label: staffOpt, filter: activeOnly } },
    { name: 'effectiveDate', label: 'Effective from', type: 'date', half: true }, { name: 'reviewDate', label: 'Next review', type: 'date', half: true },
    { name: 'content', label: 'Summary / content', type: 'textarea' },
  ],
  stats: [
    { label: 'Documents', value: (r) => r.length, color: 'text-blue-400' }, { label: 'Approved', value: (r) => count(r, 'status', 'Approved'), color: 'text-emerald-400' },
    { label: 'Under review', value: (r) => count(r, 'status', 'Under review'), color: 'text-amber-400' }, { label: 'Review overdue', value: (r) => r.filter(reviewOverdue).length, color: 'text-red-400' },
  ],
  filters: [{ label: 'types', options: ['Policy', 'SOP', 'Protocol', 'Circular'], match: (r, v) => r.docType === v }, { label: 'statuses', options: ['Draft', 'Under review', 'Approved', 'Retired'], match: (r, v) => r.status === v }],
  defaults: () => ({ code: nextCode('policies', 'code', 'DOC-'), docType: 'Policy', version: '1.0', status: 'Draft' }),
  beforeSave: (d) => upper(d, 'code'),
};

// ------------------------------------------------------------------ Approval management
export const approvalRulesDef: Def = {
  columns: [
    { header: 'Rule', key: 'name' }, { header: 'Request type', key: 'requestType' }, { header: 'Department', value: (r, db) => nameOf(db, 'departments', r.departmentId) || 'All' },
    { header: 'From amount', value: (r) => (Number(r.minAmount) ? money(r.minAmount) : 'Any') }, { header: 'Approver', key: 'approverRole' }, { header: 'Decide within', value: (r) => `${r.slaHours || 24} hours` }, status(),
  ],
  fields: [
    { name: 'name', label: 'Rule name', required: true }, { name: 'requestType', label: 'Request type', type: 'select', options: REQUEST_TYPES, required: true, half: true },
    { name: 'departmentId', label: 'Only for department', type: 'select', half: true, from: { col: 'departments', label: (r) => r.name }, help: 'Leave empty for all departments.' },
    { name: 'minAmount', label: 'Applies from amount (Rs.)', type: 'number', half: true, min: 0, help: 'The highest amount a request reaches decides the rule.' },
    { name: 'approverRole', label: 'Approver', type: 'select', options: [...ADMIN_ROLES], required: true, half: true },
    { name: 'slaHours', label: 'Decide within (hours)', type: 'number', half: true, min: 1 }, { name: 'status', label: 'Status', type: 'select', options: ACTIVE, required: true, half: true },
  ],
  stats: [
    { label: 'Rules', value: (r) => r.length, color: 'text-blue-400' }, { label: 'Active', value: (r) => count(r, 'status', 'Active'), color: 'text-emerald-400' },
    { label: 'Request types covered', value: (r) => new Set(r.filter(activeOnly).map((x) => x.requestType)).size, color: 'text-indigo-400' }, { label: 'Approver roles', value: (r) => new Set(r.map((x) => x.approverRole)).size, color: 'text-amber-400' },
  ],
  filters: [{ label: 'request types', options: REQUEST_TYPES, match: (r, v) => r.requestType === v }],
  defaults: () => ({ minAmount: 0, slaHours: 24, status: 'Active', requestType: 'Purchase', approverRole: 'Department Head' }),
  emptyHint: 'Step 6 of the workflow. A rule says who approves which kind of request.',
};

export const approvalRequestsDef: Def = {
  columns: [
    { header: 'Request', key: 'requestNo' }, { header: 'Title', key: 'title' }, { header: 'Type', key: 'requestType' },
    { header: 'Requested by', value: (r, db) => nameOf(db, 'staff', r.requesterId) }, { header: 'Amount', value: (r) => (Number(r.amount) ? money(r.amount) : '-') }, { header: 'Approver', key: 'approverRole' },
    // The decision (who, when, remarks) shows when you hover the status.
    { header: 'Status', key: 'status', render: (r) => <span title={r.decidedBy ? `${r.status} by ${r.decidedBy} on ${fmtDate(r.decidedAt)}${r.remarks ? ': ' + r.remarks : ''}` : r.status === 'Pending' ? `Waiting for the ${r.approverRole}` : ''}><StatusBadge value={r.status} /></span> },
  ],
  fields: [
    { name: 'requestNo', label: 'Request number', required: true, half: true, lockOnEdit: true }, { name: 'requestType', label: 'Request type', type: 'select', options: REQUEST_TYPES, required: true, half: true },
    { name: 'title', label: 'Title', required: true },
    { name: 'departmentId', label: 'Department', type: 'select', half: true, from: { col: 'departments', label: (r) => r.name } }, { name: 'requesterId', label: 'Requested by', type: 'select', required: true, half: true, from: { col: 'staff', label: staffOpt, filter: activeOnly } },
    { name: 'amount', label: 'Amount (Rs.)', type: 'number', half: true, min: 0, help: 'Decides which rule and approver apply.' }, { name: 'details', label: 'Details', type: 'textarea' },
  ],
  stats: [
    { label: 'Requests', value: (r) => r.length, color: 'text-blue-400' }, { label: 'Pending', value: (r) => count(r, 'status', 'Pending'), color: 'text-amber-400' },
    { label: 'Approved', value: (r) => count(r, 'status', 'Approved'), color: 'text-emerald-400' }, { label: 'Rejected', value: (r) => count(r, 'status', 'Rejected'), color: 'text-red-400' },
  ],
  filters: [{ label: 'statuses', options: ['Pending', 'Approved', 'Rejected'], match: (r, v) => r.status === v }, { label: 'request types', options: REQUEST_TYPES, match: (r, v) => r.requestType === v }],
  defaults: () => ({ requestNo: nextCode('approvalRequests', 'requestNo', 'REQ-', 4), requestType: 'Purchase', amount: 0 }),
  beforeSave: (d, { editing, db }) => {
    const route = routeApproval(db, d.requestType, Number(d.amount) || 0, d.departmentId);
    return { ...d, status: editing ? editing.status : 'Pending', approverRole: route.approverRole, slaHours: route.slaHours };
  },
  canEditRow: (r) => r.status === 'Pending',
  canDeleteRow: (r) => r.status === 'Pending',
};
