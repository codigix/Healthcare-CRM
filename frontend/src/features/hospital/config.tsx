import type { ColumnDef, FieldDef, FilterDef, StatDef } from './CrudPage';
import { StatusBadge } from './CrudPage';

// Shared definitions for the Hospital Management screens (kept outside components so they are stable).
const sum = (rows: any[], k: string) => rows.reduce((a, r) => a + Number(r[k] || 0), 0);
const count = (rows: any[], k: string, v: string) => rows.filter((r) => r[k] === v).length;
const pct = (part: number, whole: number) => (whole ? `${Math.round((part / whole) * 100)}%` : '0%');
const status = (key = 'status'): ColumnDef => ({ header: 'Status', key, render: (r) => <StatusBadge value={r[key]} /> });
const ACTIVE = ['Active', 'Inactive'];

export const branchesDef = {
  columns: [{ header: 'Code', key: 'code' }, { header: 'Branch', key: 'name' }, { header: 'City', key: 'city' }, { header: 'Manager', key: 'managerName' }, { header: 'Phone', key: 'phone' }, { header: 'Buildings', key: 'buildingCount' }, status()] as ColumnDef[],
  fields: [
    { name: 'name', label: 'Branch name', required: true, half: true }, { name: 'code', label: 'Branch code', required: true, half: true, placeholder: 'e.g. PUNE-01' },
    { name: 'city', label: 'City', half: true }, { name: 'phone', label: 'Phone', half: true },
    { name: 'email', label: 'Email', type: 'email', half: true }, { name: 'managerName', label: 'Branch manager', half: true },
    { name: 'address', label: 'Address', type: 'textarea' },
    { name: 'status', label: 'Status', type: 'select', options: ACTIVE, defaultValue: 'Active', required: true, half: true },
  ] as FieldDef[],
  stats: [{ label: 'Total Branches', value: (r) => r.length, color: 'text-blue-400' }, { label: 'Active', value: (r) => count(r, 'status', 'Active'), color: 'text-emerald-400' }, { label: 'Buildings', value: (r) => sum(r, 'buildingCount'), color: 'text-indigo-400' }] as StatDef[],
};

export const buildingsDef = {
  columns: [{ header: 'Code', key: 'code' }, { header: 'Building', key: 'name' }, { header: 'Branch', key: 'branchName' }, { header: 'Planned Floors', key: 'totalFloors' }, { header: 'Floors Added', key: 'floorCount' }, status()] as ColumnDef[],
  fields: [
    { name: 'branchId', label: 'Branch', type: 'select', required: true, optionsFrom: { entity: 'branches', label: (r: any) => `${r.name} (${r.code})` } },
    { name: 'name', label: 'Building name', required: true, half: true }, { name: 'code', label: 'Building code', required: true, half: true, placeholder: 'e.g. BLK-A' },
    { name: 'totalFloors', label: 'Number of floors', type: 'number', required: true, defaultValue: 1, half: true },
    { name: 'status', label: 'Status', type: 'select', options: ACTIVE, defaultValue: 'Active', required: true, half: true },
    { name: 'description', label: 'Description', type: 'textarea' },
  ] as FieldDef[],
  stats: [{ label: 'Total Buildings', value: (r) => r.length, color: 'text-blue-400' }, { label: 'Active', value: (r) => count(r, 'status', 'Active'), color: 'text-emerald-400' }, { label: 'Floors Added', value: (r) => sum(r, 'floorCount'), color: 'text-indigo-400' }] as StatDef[],
  filters: [{ param: 'branchId', label: 'branches', optionsFrom: { entity: 'branches', label: (r: any) => r.name } }] as FilterDef[],
};

export const floorsDef = {
  columns: [{ header: 'Floor', key: 'name' }, { header: 'Number', key: 'floorNumber' }, { header: 'Building', key: 'buildingName' }, { header: 'Branch', key: 'branchName' }, { header: 'Wards', key: 'wardCount' }, status()] as ColumnDef[],
  fields: [
    { name: 'buildingId', label: 'Building', type: 'select', required: true, optionsFrom: { entity: 'buildings', label: (r: any) => `${r.name} - ${r.branchName}` } },
    { name: 'name', label: 'Floor name', required: true, half: true, placeholder: 'e.g. Ground Floor' }, { name: 'floorNumber', label: 'Floor number', type: 'number', required: true, half: true, placeholder: '0 = ground' },
    { name: 'status', label: 'Status', type: 'select', options: ACTIVE, defaultValue: 'Active', required: true, half: true },
    { name: 'description', label: 'Description', type: 'textarea' },
  ] as FieldDef[],
  stats: [{ label: 'Total Floors', value: (r) => r.length, color: 'text-blue-400' }, { label: 'Active', value: (r) => count(r, 'status', 'Active'), color: 'text-emerald-400' }, { label: 'Wards', value: (r) => sum(r, 'wardCount'), color: 'text-indigo-400' }] as StatDef[],
  filters: [{ param: 'buildingId', label: 'buildings', optionsFrom: { entity: 'buildings', label: (r: any) => r.name } }] as FilterDef[],
};

const WARD_TYPES = ['General', 'Private', 'Semi-Private', 'ICU', 'NICU', 'PICU', 'Emergency', 'Maternity', 'Isolation', 'Day Care'];
export const wardsDef = {
  columns: [{ header: 'Code', key: 'code' }, { header: 'Ward', key: 'name' }, { header: 'Type', key: 'wardType' }, { header: 'Department', key: 'department' }, { header: 'Floor', key: 'floorName' }, { header: 'Rooms', key: 'roomCount' }, { header: 'Beds', key: 'bedCount' }, { header: 'Occupied', key: 'occupiedBeds' }, status()] as ColumnDef[],
  fields: [
    { name: 'floorId', label: 'Floor', type: 'select', required: true, optionsFrom: { entity: 'floors', label: (r: any) => `${r.name} - ${r.buildingName}` } },
    { name: 'name', label: 'Ward name', required: true, half: true }, { name: 'code', label: 'Ward code', required: true, half: true, placeholder: 'e.g. ICU-F2' },
    { name: 'wardType', label: 'Ward type', type: 'select', options: WARD_TYPES, defaultValue: 'General', required: true, half: true },
    { name: 'department', label: 'Department', half: true }, { name: 'nurseInCharge', label: 'Nurse in charge', half: true },
    { name: 'status', label: 'Status', type: 'select', options: ACTIVE, defaultValue: 'Active', required: true, half: true },
  ] as FieldDef[],
  stats: [
    { label: 'Total Wards', value: (r) => r.length, color: 'text-blue-400' }, { label: 'Total Beds', value: (r) => sum(r, 'bedCount'), color: 'text-indigo-400' },
    { label: 'Occupied Beds', value: (r) => sum(r, 'occupiedBeds'), color: 'text-amber-400' }, { label: 'Occupancy', value: (r) => pct(sum(r, 'occupiedBeds'), sum(r, 'bedCount')), color: 'text-emerald-400' },
  ] as StatDef[],
  filters: [{ param: 'floorId', label: 'floors', optionsFrom: { entity: 'floors', label: (r: any) => `${r.name} - ${r.buildingName}` } }] as FilterDef[],
};

const ROOM_STATUS = ['Available', 'Occupied', 'Reserved', 'Maintenance', 'Out of Service'];
const ROOM_TYPES = ['General Ward', 'Standard', 'Semi-Private', 'Private', 'Deluxe', 'ICU', 'NICU', 'Isolation', 'Suite'];
export const roomsDef = {
  columns: [
    { header: 'Room', key: 'roomNumber' }, { header: 'Type', key: 'roomType' }, { header: 'Department', key: 'department' }, { header: 'Ward', key: 'wardName' },
    { header: 'Floor', key: 'floor' }, { header: 'Beds', key: 'bedCount' }, { header: 'Occupied', key: 'occupiedBeds' },
    { header: 'Price / Day', key: 'pricePerDay', render: (r: any) => `Rs. ${Number(r.pricePerDay || 0).toLocaleString('en-IN')}` }, status(),
  ] as ColumnDef[],
  fields: [
    { name: 'wardId', label: 'Ward', type: 'select', required: true, optionsFrom: { entity: 'wards', label: (r: any) => `${r.name} (${r.code})` } },
    { name: 'roomNumber', label: 'Room number', required: true, half: true }, { name: 'roomType', label: 'Room type', type: 'select', options: ROOM_TYPES, required: true, half: true },
    { name: 'department', label: 'Department', required: true, half: true }, { name: 'capacity', label: 'Number of beds', type: 'number', required: true, defaultValue: 1, half: true },
    { name: 'pricePerDay', label: 'Price per day (Rs.)', type: 'number', required: true, defaultValue: 0, half: true },
    { name: 'status', label: 'Status', type: 'select', options: ROOM_STATUS, defaultValue: 'Available', required: true, half: true },
    { name: 'description', label: 'Description', type: 'textarea' },
  ] as FieldDef[],
  stats: [
    { label: 'Total Rooms', value: (r) => r.length, color: 'text-blue-400' }, { label: 'Available Rooms', value: (r) => count(r, 'status', 'Available'), color: 'text-emerald-400' },
    { label: 'Total Beds', value: (r) => sum(r, 'bedCount'), color: 'text-indigo-400' }, { label: 'Occupied Beds', value: (r) => sum(r, 'occupiedBeds'), color: 'text-amber-400' },
  ] as StatDef[],
  filters: [
    { param: 'wardId', label: 'wards', optionsFrom: { entity: 'wards', label: (r: any) => r.name } },
    { param: 'status', label: 'statuses', options: ROOM_STATUS },
  ] as FilterDef[],
};

const BED_STATUS = ['Available', 'Occupied', 'Reserved', 'Maintenance', 'Cleaning'];
export const bedsDef = {
  columns: [
    { header: 'Bed', key: 'bedNumber' }, { header: 'Room', key: 'roomNumber' }, { header: 'Ward', key: 'wardName' }, { header: 'Department', key: 'department' },
    { header: 'Bed Type', key: 'bedType' }, status(), { header: 'Notes', key: 'notes' },
  ] as ColumnDef[],
  fields: [
    { name: 'roomId', label: 'Room', type: 'select', required: true, optionsFrom: { entity: 'rooms', label: (r: any) => `Room ${r.roomNumber} - ${r.wardName || r.department}` } },
    { name: 'bedNumber', label: 'Bed number', required: true, half: true, placeholder: 'e.g. 101-B3' },
    { name: 'bedType', label: 'Bed type', type: 'select', options: ['Standard', 'ICU', 'Pediatric', 'Electric', 'Bariatric', 'Cradle'], defaultValue: 'Standard', required: true, half: true },
    { name: 'status', label: 'Status', type: 'select', options: BED_STATUS, defaultValue: 'Available', required: true, half: true },
    { name: 'notes', label: 'Notes', type: 'textarea' },
  ] as FieldDef[],
  stats: [
    { label: 'Total Beds', value: (r) => r.length, color: 'text-blue-400' }, { label: 'Available', value: (r) => count(r, 'status', 'Available'), color: 'text-emerald-400' },
    { label: 'Occupied', value: (r) => count(r, 'status', 'Occupied'), color: 'text-amber-400' }, { label: 'Occupancy', value: (r) => pct(count(r, 'status', 'Occupied'), r.length), color: 'text-indigo-400' },
  ] as StatDef[],
  filters: [
    { param: 'wardId', label: 'wards', optionsFrom: { entity: 'wards', label: (r: any) => r.name } },
    { param: 'status', label: 'statuses', options: BED_STATUS },
  ] as FilterDef[],
};
