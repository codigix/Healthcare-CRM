/**
 * Starter data for the Hospital Administration module: a small, believable hospital so every screen has
 * something to show. Everything here can be edited or deleted, or wiped with "Clear all data" on the
 * Hospital Administration home page, which lets you walk the setup workflow from zero.
 * (Self-contained on purpose: db.ts imports this file, so it must not import db.ts.)
 */
import type { Db, Row } from './db';

const T = '2026-01-05T09:00:00.000Z';
const row = (id: string, data: Record<string, any>): Row => ({ id, createdAt: T, updatedAt: T, ...data });
const pad = (n: number, w = 3) => String(n).padStart(w, '0');

export function buildSeed(): Db {
  // ---------------------------------------------------------------- departments + staff
  const deptDefs: [string, string, string, string, string][] = [
    // key, name, code, type, location
    ['adm', 'Administration', 'ADM', 'Administrative', 'Main Building, Ground Floor'],
    ['gm', 'General Medicine', 'GM', 'Clinical', 'Main Building, First Floor'],
    ['card', 'Cardiology', 'CARD', 'Clinical', 'Main Building, Second Floor'],
    ['neuro', 'Neurology', 'NEURO', 'Clinical', 'Main Building, Third Floor'],
    ['ortho', 'Orthopedics', 'ORTHO', 'Clinical', 'Main Building, Third Floor'],
    ['peds', 'Pediatrics', 'PEDS', 'Clinical', 'Main Building, First Floor'],
    ['gyn', 'Gynecology & Obstetrics', 'GYN', 'Clinical', 'Main Building, Second Floor'],
    ['emerg', 'Emergency', 'EMG', 'Clinical', 'Main Building, Ground Floor'],
    ['radio', 'Radiology', 'RAD', 'Diagnostic', 'OPD Block, Ground Floor'],
    ['lab', 'Laboratory', 'LAB', 'Diagnostic', 'OPD Block, Ground Floor'],
    ['pharm', 'Pharmacy', 'PHARM', 'Support', 'OPD Block, Ground Floor'],
  ];
  const staffDefs: { key: string; name: string; type: string; dept: string; designation: string; role: string; spec?: string; fee?: number }[] = [
    { key: 's1', name: 'Dr. Anil Deshmukh', type: 'Doctor', dept: 'gm', designation: 'Senior Consultant', role: 'Department Head', spec: 'General Medicine', fee: 600 },
    { key: 's2', name: 'Dr. Sarah Johnson', type: 'Doctor', dept: 'card', designation: 'Senior Consultant', role: 'Department Head', spec: 'Cardiology', fee: 900 },
    { key: 's3', name: 'Dr. Michael Chen', type: 'Doctor', dept: 'neuro', designation: 'Senior Consultant', role: 'Department Head', spec: 'Neurology', fee: 900 },
    { key: 's4', name: 'Dr. James Wilson', type: 'Doctor', dept: 'ortho', designation: 'Senior Consultant', role: 'Department Head', spec: 'Orthopedics', fee: 800 },
    { key: 's5', name: 'Dr. Emily Rodriguez', type: 'Doctor', dept: 'peds', designation: 'Senior Consultant', role: 'Department Head', spec: 'Pediatrics', fee: 700 },
    { key: 's6', name: 'Dr. Priya Kulkarni', type: 'Doctor', dept: 'gyn', designation: 'Senior Consultant', role: 'Department Head', spec: 'Gynecology', fee: 800 },
    { key: 's7', name: 'Dr. Rohit Patil', type: 'Doctor', dept: 'emerg', designation: 'Emergency Physician', role: 'Department Head', spec: 'Emergency Medicine', fee: 500 },
    { key: 's8', name: 'Dr. Neha Joshi', type: 'Doctor', dept: 'radio', designation: 'Radiologist', role: 'Department Head', spec: 'Radiology', fee: 0 },
    { key: 's9', name: 'Mr. Sandeep Rane', type: 'Technician', dept: 'lab', designation: 'Laboratory Manager', role: 'Department Head' },
    { key: 's10', name: 'Ms. Kavita Shah', type: 'Support', dept: 'pharm', designation: 'Chief Pharmacist', role: 'Department Head' },
    { key: 's11', name: 'Mr. Rajesh Mehta', type: 'Administrative', dept: 'adm', designation: 'Hospital Administrator', role: 'Hospital Administrator' },
    { key: 's12', name: 'Mrs. Sunita Nair', type: 'Administrative', dept: 'adm', designation: 'Hospital Manager', role: 'Hospital Manager' },
    { key: 's13', name: 'Mr. Vikram Singh', type: 'Administrative', dept: 'adm', designation: 'Operations Manager', role: 'Operations Manager' },
    { key: 's14', name: 'Sr. Nurse Anjali Deshpande', type: 'Nurse', dept: 'gm', designation: 'Senior Staff Nurse', role: 'Nurse' },
    { key: 's15', name: 'Sr. Nurse Meera Iyer', type: 'Nurse', dept: 'card', designation: 'Senior Staff Nurse', role: 'Nurse' },
    { key: 's16', name: 'Sr. Nurse Pooja Bhosale', type: 'Nurse', dept: 'peds', designation: 'Senior Staff Nurse', role: 'Nurse' },
  ];
  const headOf: Record<string, string> = { gm: 's1', card: 's2', neuro: 's3', ortho: 's4', peds: 's5', gyn: 's6', emerg: 's7', radio: 's8', lab: 's9', pharm: 's10', adm: 's11' };

  const departments = deptDefs.map(([k, name, code, type, location]) => row(`dept-${k}`, { name, code, type, headId: `staff-${headOf[k]}`, location, description: '', status: 'Active' }));
  const staff = staffDefs.map((s, i) => row(`staff-${s.key}`, {
    employeeId: `EMP-${pad(i + 1)}`, name: s.name, staffType: s.type, departmentId: `dept-${s.dept}`, designation: s.designation, role: s.role,
    specialization: s.spec || '', consultationFee: s.fee ?? '', phone: `98000${pad(i + 1, 5)}`, email: `${s.name.toLowerCase().replace(/^(dr|mr|mrs|ms|sr)\.?\s+(nurse\s+)?/, '').replace(/[^a-z]+/g, '.')}@hospital.example`,
    joiningDate: '2024-04-01', status: 'Active',
  }));

  const costCentres = deptDefs.map(([k, name], i) => row(`cc-${k}`, {
    code: `CC-${pad(i + 1)}`, name: `${name} Cost Centre`, departmentId: `dept-${k}`, monthlyBudget: [150000, 450000, 900000, 600000, 550000, 400000, 500000, 650000, 700000, 350000, 450000][i],
    mtdSpend: [90000, 280000, 520000, 410000, 330000, 220000, 360000, 300000, 480000, 200000, 330000][i], ownerId: `staff-${headOf[k]}`, status: 'Active',
  }));

  // ---------------------------------------------------------------- structure
  const branches = [row('branch-main', { name: 'Main Branch', code: 'MAIN', address: 'Hospital Road', city: 'Pune', state: 'Maharashtra', phone: '020-40000000', email: 'main@hospital.example', managerId: 'staff-s12', openingTime: '00:00', closingTime: '23:59', status: 'Active' })];
  const buildings = [
    row('bld-mb', { branchId: 'branch-main', name: 'Main Building', code: 'MB', totalFloors: 4, description: 'Wards, ICU, emergency and operation theatres', status: 'Active' }),
    row('bld-opd', { branchId: 'branch-main', name: 'OPD Block', code: 'OPD', totalFloors: 2, description: 'Outpatient clinics, laboratory, radiology and pharmacy', status: 'Active' }),
  ];
  const floorDefs: [string, string, string, number][] = [
    ['mb0', 'bld-mb', 'Ground Floor', 0], ['mb1', 'bld-mb', 'First Floor', 1], ['mb2', 'bld-mb', 'Second Floor', 2], ['mb3', 'bld-mb', 'Third Floor', 3],
    ['opd0', 'bld-opd', 'Ground Floor', 0], ['opd1', 'bld-opd', 'First Floor', 1],
  ];
  const floors = floorDefs.map(([k, b, name, n]) => row(`floor-${k}`, { buildingId: b, name, floorNumber: n, description: '', status: 'Active' }));

  // key, floor, name, code, type, dept, nurse, room prefix, rooms, beds per room, room type, price/day
  const wardDefs: [string, string, string, string, string, string, string | null, string, number, number, string, number][] = [
    ['emg', 'mb0', 'Emergency Ward', 'EMG-W', 'Emergency', 'emerg', null, 'E', 4, 2, 'Emergency', 2000],
    ['gen', 'mb1', 'General Ward', 'GEN-W', 'General', 'gm', 'staff-s14', 'G', 6, 4, 'General Ward', 1500],
    ['ped', 'mb1', 'Pediatric Ward', 'PED-W', 'Pediatric', 'peds', 'staff-s16', 'P', 4, 3, 'Semi-Private', 1800],
    ['ccu', 'mb2', 'Cardiac Care Unit', 'CCU-W', 'ICU', 'card', 'staff-s15', 'C', 4, 1, 'ICU', 6500],
    ['mat', 'mb2', 'Maternity Ward', 'MAT-W', 'Maternity', 'gyn', null, 'M', 4, 2, 'Semi-Private', 2500],
    ['neu', 'mb3', 'Neuro Ward', 'NEU-W', 'General', 'neuro', null, 'N', 3, 2, 'Semi-Private', 2200],
    ['ort', 'mb3', 'Orthopedic Ward', 'ORT-W', 'General', 'ortho', null, 'O', 3, 2, 'Semi-Private', 2000],
    ['pvt', 'opd1', 'Private Wing', 'PVT-W', 'Private', 'gm', null, 'V', 5, 1, 'Private', 4500],
  ];
  const wards: Row[] = [], rooms: Row[] = [], beds: Row[] = [];
  let occupiedLeft = 6;
  for (const [k, fl, name, code, type, dept, nurse, pre, nRooms, cap, rtype, price] of wardDefs) {
    wards.push(row(`ward-${k}`, { floorId: `floor-${fl}`, name, code, wardType: type, departmentId: `dept-${dept}`, nurseInChargeId: nurse || '', status: 'Active' }));
    for (let r = 1; r <= nRooms; r++) {
      const roomNumber = `${pre}-${100 + r}`; const rid = `room-${k}-${r}`;
      rooms.push(row(rid, { wardId: `ward-${k}`, roomNumber, roomType: rtype, capacity: cap, pricePerDay: price, status: 'Available', description: '' }));
      for (let b = 1; b <= cap; b++) {
        const occupied = occupiedLeft > 0 && b === 1 && r % 3 === 1 && (k === 'gen' || k === 'ccu' || k === 'mat');
        if (occupied) occupiedLeft--;
        beds.push(row(`bed-${k}-${r}-${b}`, { roomId: rid, bedNumber: `${roomNumber}-B${b}`, bedType: rtype === 'ICU' ? 'ICU' : 'Standard', status: occupied ? 'Occupied' : 'Available', notes: '' }));
      }
    }
  }

  // ---------------------------------------------------------------- services + tariffs
  const svc: [string, string, string, string, string, number][] = [
    // code, name, dept, category, unit, base price
    ['CON-001', 'OPD Consultation - General Medicine', 'gm', 'Consultation', 'per visit', 600], ['CON-002', 'OPD Consultation - Cardiology', 'card', 'Consultation', 'per visit', 900],
    ['CON-003', 'OPD Consultation - Neurology', 'neuro', 'Consultation', 'per visit', 900], ['CON-004', 'OPD Consultation - Orthopedics', 'ortho', 'Consultation', 'per visit', 800],
    ['CON-005', 'OPD Consultation - Pediatrics', 'peds', 'Consultation', 'per visit', 700], ['CON-006', 'OPD Consultation - Gynecology', 'gyn', 'Consultation', 'per visit', 800],
    ['CON-007', 'Emergency Consultation', 'emerg', 'Consultation', 'per visit', 500],
    ['LAB-001', 'Complete Blood Count (CBC)', 'lab', 'Laboratory', 'per test', 350], ['LAB-002', 'Blood Sugar - Fasting', 'lab', 'Laboratory', 'per test', 120],
    ['LAB-003', 'Lipid Profile', 'lab', 'Laboratory', 'per test', 650], ['LAB-004', 'Liver Function Test', 'lab', 'Laboratory', 'per test', 700],
    ['LAB-005', 'Kidney Function Test', 'lab', 'Laboratory', 'per test', 700], ['LAB-006', 'Urine Routine', 'lab', 'Laboratory', 'per test', 150],
    ['RAD-001', 'Chest X-Ray', 'radio', 'Radiology', 'per study', 400], ['RAD-002', 'Ultrasound - Abdomen', 'radio', 'Radiology', 'per study', 900],
    ['RAD-003', 'CT Scan - Head', 'radio', 'Radiology', 'per study', 3500], ['RAD-004', 'MRI - Brain', 'radio', 'Radiology', 'per study', 6500],
    ['PRC-001', 'ECG', 'card', 'Procedure', 'per procedure', 300], ['PRC-002', '2D Echo', 'card', 'Procedure', 'per procedure', 1800],
    ['PRC-003', 'Fracture Plaster Application', 'ortho', 'Procedure', 'per procedure', 1500], ['PRC-004', 'Normal Delivery Package', 'gyn', 'Procedure', 'per package', 25000],
    ['PRC-005', 'Nebulisation', 'emerg', 'Procedure', 'per procedure', 200],
    ['RMS-001', 'General Ward Bed', 'gm', 'Room', 'per day', 1500], ['RMS-002', 'ICU Bed', 'card', 'Room', 'per day', 6500], ['RMS-003', 'Private Room', 'gm', 'Room', 'per day', 4500],
  ];
  const services = svc.map(([code, name, dept, category, unit], i) => row(`svc-${pad(i + 1)}`, { code, name, departmentId: `dept-${dept}`, category, unit, description: '', status: 'Active' }));
  const payers: [string, number][] = [['General', 1], ['Insurance / TPA', 1.1], ['Corporate', 0.95]];
  const tariffs: Row[] = [];
  svc.forEach(([, , , , , base], i) => payers.forEach(([payerType, factor]) => tariffs.push(row(`tar-${pad(i + 1)}-${payerType[0]}`, { serviceId: `svc-${pad(i + 1)}`, payerType, price: Math.round(base * factor), effectiveFrom: '2026-01-01', status: 'Active' }))));

  // ---------------------------------------------------------------- governance
  const policies = [
    row('pol-1', { code: 'POL-001', title: 'Infection Prevention & Control Policy', docType: 'Policy', version: '2.1', departmentId: '', ownerId: 'staff-s1', effectiveDate: '2026-01-01', reviewDate: '2027-01-01', status: 'Approved', content: 'Hand hygiene, isolation precautions, sterilisation and surveillance rules for all areas.' }),
    row('pol-2', { code: 'SOP-001', title: 'Fire Safety & Evacuation SOP', docType: 'SOP', version: '1.3', departmentId: '', ownerId: 'staff-s13', effectiveDate: '2026-01-01', reviewDate: '2026-12-31', status: 'Approved', content: 'Alarm response, evacuation routes, assembly points and drills.' }),
    row('pol-3', { code: 'SOP-002', title: 'Biomedical Waste Management SOP', docType: 'SOP', version: '3.0', departmentId: '', ownerId: 'staff-s13', effectiveDate: '2026-01-01', reviewDate: '2027-01-01', status: 'Approved', content: 'Segregation, colour coding, storage and disposal of biomedical waste.' }),
    row('pol-4', { code: 'POL-002', title: 'Patient Rights & Responsibilities', docType: 'Policy', version: '1.0', departmentId: '', ownerId: 'staff-s12', effectiveDate: '2026-01-01', reviewDate: '2027-01-01', status: 'Approved', content: 'Rights and responsibilities displayed and explained to every patient.' }),
    row('pol-5', { code: 'SOP-003', title: 'Medication Administration SOP', docType: 'SOP', version: '1.1', departmentId: 'dept-gm', ownerId: 'staff-s14', effectiveDate: '', reviewDate: '2027-03-01', status: 'Under review', content: 'Five rights of medication administration and double-check for high-risk drugs.' }),
    row('pol-6', { code: 'POL-003', title: 'Patient Discharge Policy', docType: 'Policy', version: '1.0', departmentId: '', ownerId: 'staff-s12', effectiveDate: '', reviewDate: '', status: 'Draft', content: '' }),
  ];
  const rule = (id: string, name: string, requestType: string, minAmount: number, approverRole: string, slaHours: number) => row(id, { name, requestType, departmentId: '', minAmount, approverRole, slaHours, status: 'Active' });
  const approvalRules = [
    rule('rule-1', 'Purchase up to Rs. 50,000', 'Purchase', 0, 'Department Head', 24), rule('rule-2', 'Purchase Rs. 50,000 and above', 'Purchase', 50000, 'Hospital Manager', 48),
    rule('rule-3', 'Purchase Rs. 5,00,000 and above', 'Purchase', 500000, 'Hospital Administrator', 72), rule('rule-4', 'Discount or refund', 'Discount / Refund', 0, 'Hospital Manager', 24),
    rule('rule-5', 'Staff leave', 'Leave', 0, 'Department Head', 24), rule('rule-6', 'Policy or SOP release', 'Policy / SOP', 0, 'Hospital Administrator', 72),
    rule('rule-7', 'Equipment or asset', 'Equipment / Asset', 0, 'Operations Manager', 48),
  ];
  const req = (id: string, no: string, title: string, requestType: string, dept: string, requester: string, amount: number, status: string, approverRole: string, extra: Record<string, any> = {}) =>
    row(id, { requestNo: no, title, requestType, departmentId: `dept-${dept}`, requesterId: `staff-${requester}`, amount, details: '', status, approverRole, decidedBy: '', decidedAt: '', remarks: '', refCollection: '', refId: '', ...extra });
  const approvalRequests = [
    req('req-1', 'REQ-0001', 'Surgical gloves, 2000 pieces', 'Purchase', 'gm', 's14', 28000, 'Pending', 'Department Head'),
    req('req-2', 'REQ-0002', 'ICU ventilator annual service contract', 'Purchase', 'card', 's2', 650000, 'Pending', 'Hospital Administrator'),
    req('req-3', 'REQ-0003', 'Annual leave, 5 days', 'Leave', 'peds', 's16', 0, 'Approved', 'Department Head', { decidedBy: 'Dr. Emily Rodriguez', decidedAt: '2026-02-10T10:30:00.000Z', remarks: 'Approved' }),
    req('req-4', 'REQ-0004', 'Medication Administration SOP v1.1', 'Policy / SOP', 'gm', 's1', 0, 'Pending', 'Hospital Administrator', { refCollection: 'policies', refId: 'pol-5' }),
  ];

  const hospitalProfile = [row('profile-1', {
    name: 'MedixPro Multispeciality Hospital', type: 'Multi-speciality', registrationNo: 'REG-0001', gstNumber: '', email: 'info@hospital.example', phone: '020-40000000', website: '',
    address: 'Hospital Road', city: 'Pune', state: 'Maharashtra', pincode: '411001', establishedYear: 2010, licensedBeds: 100, accreditation: 'NABH (in progress)', about: '',
  })];

  return { hospitalProfile, branches, departments, costCentres, buildings, floors, wards, rooms, beds, staff, services, tariffs, policies, approvalRules, approvalRequests };
}
