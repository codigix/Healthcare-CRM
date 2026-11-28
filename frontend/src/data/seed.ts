/**
 * Starter data for the Hospital Administration module: a small, believable hospital so every screen has
 * something to show. Everything here can be edited or deleted, or wiped with "Clear all data" on the
 * Hospital Administration home page, which lets you walk the setup workflow from zero.
 * (Self-contained on purpose: db.ts imports this file, so it must not import db.ts.)
 */
import type { Db, Row } from './db';
import { addDays, localDate, todayStr, weekdayOf, WEEKDAYS } from './slots';

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

  const base = { hospitalProfile, branches, departments, costCentres, buildings, floors, wards, rooms, beds, staff, services, tariffs, policies, approvalRules, approvalRequests } as Partial<Db>;
  return { ...emptyReception(), ...base, ...buildReceptionSeed({ ...emptyReception(), ...base } as Db) } as Db;
}

const emptyReception = (): Partial<Db> => ({
  receptionSettings: [], patients: [], enquiries: [], doctorSchedules: [], doctorLeaves: [], appointments: [], admissions: [], patientDocuments: [], transfers: [], dischargeRegs: [], feedback: [],
});

/**
 * Starter data for Module B (Reception): a few patients, today's appointments, OPD sessions, admitted patients
 * (one per bed that is already Occupied), enquiries, documents and feedback. Dates are relative to today.
 * Built from whatever hospital data exists, so it also works for data saved before Module B was added.
 */
export function buildReceptionSeed(base: Db): Pick<Db, 'receptionSettings' | 'patients' | 'enquiries' | 'doctorSchedules' | 'doctorLeaves' | 'appointments' | 'admissions' | 'patientDocuments' | 'transfers' | 'dischargeRegs' | 'feedback'> {
  const today = todayStr();
  const stamp = (date: string, time: string) => new Date(`${date}T${time}:00`).toISOString();
  const doctors = base.staff.filter((s) => s.staffType === 'Doctor');

  const receptionSettings = [row('rset-1', { uhidPrefix: 'UHID', uhidDigits: 6, mrnPrefix: 'MRN', mrnDigits: 6, registrationFee: 100 })];

  // ---------------------------------------------------------------- patients
  const people: [string, string, string, string, string, string, string][] = [
    // first, last, gender, dob, blood group, city, mobile
    ['Rahul', 'Sharma', 'Male', '1990-03-14', 'B+', 'Pune', '9876500001'], ['Priya', 'Patil', 'Female', '1996-07-02', 'O+', 'Pune', '9876500002'],
    ['Amit', 'Deshmukh', 'Male', '1972-11-21', 'A+', 'Pimpri', '9876500003'], ['Sneha', 'Kulkarni', 'Female', '1985-05-30', 'AB+', 'Pune', '9876500004'],
    ['Vikas', 'Joshi', 'Male', '1961-01-09', 'O-', 'Satara', '9876500005'], ['Anjali', 'Mehta', 'Female', '1978-09-18', 'A-', 'Pune', '9876500006'],
    ['Suresh', 'Pawar', 'Male', '1969-12-05', 'B-', 'Nashik', '9876500007'], ['Kavita', 'Naik', 'Female', '1992-04-22', 'O+', 'Pune', '9876500008'],
    ['Ramesh', 'Gupta', 'Male', '1955-08-11', 'AB-', 'Mumbai', '9876500009'], ['Neha', 'Bhosale', 'Female', '2001-02-27', 'B+', 'Pune', '9876500010'],
    ['Mahesh', 'Kale', 'Male', '1980-06-16', 'A+', 'Pune', '9876500011'], ['Sunita', 'Rane', 'Female', '1974-10-03', 'O+', 'Thane', '9876500012'],
    ['Aarav', 'Singh', 'Male', '2018-01-25', 'B+', 'Pune', '9876500013'], ['Lata', 'Jadhav', 'Female', '1966-03-08', 'A+', 'Pune', '9876500014'],
  ];
  const patients = people.map(([firstName, lastName, gender, dob, bloodGroup, city, phone], i) => row(`pat-${i + 1}`, {
    uhid: `UHID-${String(i + 1).padStart(6, '0')}`, mrn: `MRN-${String(i + 1).padStart(6, '0')}`, title: gender === 'Male' ? (dob > '2010' ? 'Master' : 'Mr.') : dob > '2010' ? 'Baby' : 'Ms.', firstName, middleName: '', lastName, gender, dob, bloodGroup,
    maritalStatus: dob > '2010' ? 'Single' : 'Married', religion: 'Hindu', language: 'Marathi', phone, altPhone: '', email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@mail.example`, address: `${10 + i} Station Road`, city, state: 'Maharashtra', pincode: '411001',
    idProofType: 'Aadhaar Card', idProofNumber: `5000${String(1000 + i).padStart(4, '0')}${String(2000 + i).padStart(4, '0')}`, emergencyName: `${firstName} family`, emergencyRelation: 'Spouse', emergencyPhone: `98221${String(10000 + i).slice(-5)}`.replace(/^98221/, '98221'),
    patientType: 'OPD', registrationType: 'Self', referredBy: '', occupation: '', hasInsurance: i % 4 === 0 ? 'Yes' : 'No', insuranceProvider: i % 4 === 0 ? 'Star Health' : '', policyNumber: i % 4 === 0 ? `POL-${5000 + i}` : '', policyValidTill: i % 4 === 0 ? '2027-03-31' : '',
    isVip: 'No', status: 'Active', notes: '', registeredAt: stamp(addDays(today, -(20 - i)), '10:00'),
  }));
  // phone numbers must be unique-looking and valid; emergency phone must be a valid mobile number
  patients.forEach((p, i) => { p.emergencyPhone = `98221${String(10000 + i).slice(-5)}`; });

  // ---------------------------------------------------------------- admitted patients: one per Occupied bed
  const occupied = base.beds.filter((b) => b.status === 'Occupied');
  const wardOfBed = (bedId: string) => { const bed = base.beds.find((b) => b.id === bedId); const room = base.rooms.find((r) => r.id === bed?.roomId); return base.wards.find((w) => w.id === room?.wardId); };
  const admissions: Row[] = [];
  occupied.slice(0, 6).forEach((bed, i) => {
    const pat = patients[8 + i]; if (!pat) return;
    const ward = wardOfBed(bed.id); const doc = doctors.find((d) => d.departmentId === ward?.departmentId) || doctors[0]; if (!doc) return;
    pat.patientType = 'IPD';
    admissions.push(row(`adm-${i + 1}`, {
      patientId: pat.id, bedId: bed.id, bedNumber: bed.bedNumber, wardName: ward?.name || '', doctorId: doc.id, departmentId: ward?.departmentId || doc.departmentId, admissionType: 'Planned', diagnosis: ['Pneumonia', 'Chest pain, under observation', 'Post-delivery care', 'Fracture, post-op', 'Dengue fever', 'Cardiac monitoring'][i] || 'Under evaluation',
      admittedAt: stamp(addDays(today, -(i % 4)), '11:30'), status: 'Admitted', dischargedAt: '', notes: '',
    }));
  });

  // ---------------------------------------------------------------- OPD sessions: every doctor, Monday to Saturday
  const doctorSchedules: Row[] = [];
  doctors.forEach((d) => {
    WEEKDAYS.slice(0, 6).forEach((day) => {
      const sat = day === 'Saturday';
      doctorSchedules.push(row(`sch-${d.id}-${day}-am`, { doctorId: d.id, weekday: day, startTime: '09:00', endTime: sat ? '13:00' : '12:30', slotMinutes: 15, maxPatients: '', room: 'OPD', status: 'Active' }));
      if (!sat) doctorSchedules.push(row(`sch-${d.id}-${day}-pm`, { doctorId: d.id, weekday: day, startTime: '16:00', endTime: '18:00', slotMinutes: 15, maxPatients: '', room: 'OPD', status: 'Active' }));
    });
  });
  const lastDoc = doctors[doctors.length - 1];
  const doctorLeaves = lastDoc ? [row('leave-1', { doctorId: lastDoc.id, fromDate: addDays(today, 10), toDate: addDays(today, 12), reason: 'Conference', status: 'Approved' })] : [];

  // ---------------------------------------------------------------- appointments: some today, some upcoming, some past
  const appointments: Row[] = [];
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  const doc = (i: number) => doctors[i % Math.max(1, doctors.length)];
  const mk = (id: string, pi: number, di: number, date: string, time: string, visitType: string, source: string, status: string, extra: Record<string, any> = {}) => {
    const d = doc(di); if (!d) return;
    const token = appointments.filter((a) => a.doctorId === d.id && a.date === date).length + 1;
    appointments.push(row(id, {
      patientId: patients[pi].id, doctorId: d.id, departmentId: d.departmentId, date, time, visitType, source, status, tokenNo: token, reason: ['Fever and cough', 'Routine check-up', 'Chest discomfort', 'Knee pain', 'Headache', 'Follow-up visit'][pi % 6],
      fee: d.consultationFee || 0, bookedAt: stamp(addDays(date, -1), '17:00'), checkedInAt: '', calledAt: '', completedAt: '', followUpDate: '', skipped: 0, notes: '', ...extra,
    }));
  };
  if (doctors.length) {
    mk('apt-1', 0, 0, today, '09:00', 'New', 'Counter', 'Completed', { checkedInAt: stamp(today, '08:50'), calledAt: stamp(today, '09:02'), completedAt: stamp(today, '09:15'), followUpDate: addDays(today, 14) });
    mk('apt-2', 1, 1, today, '09:15', 'New', 'Phone', 'Completed', { checkedInAt: stamp(today, '09:05'), calledAt: stamp(today, '09:18'), completedAt: stamp(today, '09:35') });
    mk('apt-3', 2, 0, today, '09:30', 'Follow-up', 'Online', 'In consultation', { checkedInAt: stamp(today, '09:20'), calledAt: stamp(today, '09:32') });
    mk('apt-4', 3, 1, today, '09:45', 'New', 'Counter', 'Checked-in', { checkedInAt: stamp(today, '09:40') });
    mk('apt-5', 4, 0, today, '10:00', 'Follow-up', 'Counter', 'Checked-in', { checkedInAt: stamp(today, '09:55') });
    mk('apt-6', 5, 2, today, '10:15', 'New', 'Phone', 'Booked');
    mk('apt-7', 6, 1, today, '10:30', 'New', 'Online', 'Booked');
    mk('apt-8', 7, 2, today, '10:45', 'Follow-up', 'Counter', 'No-show');
    // Appointments on other days avoid Sundays (no OPD sessions) and the patients who are admitted.
    const workday = (n: number) => { let d = addDays(today, n); while (weekdayOf(d) === 'Sunday') d = addDays(d, n < 0 ? -1 : 1); return d; };
    mk('apt-9', 0, 0, workday(1), '09:30', 'Follow-up', 'Phone', 'Booked');
    mk('apt-10', 1, 1, workday(1), '10:00', 'Follow-up', 'Online', 'Booked');
    mk('apt-11', 2, 3, workday(2), '09:15', 'New', 'Counter', 'Booked');
    mk('apt-12', 3, 0, workday(-3), '10:00', 'New', 'Counter', 'Completed', { checkedInAt: stamp(workday(-3), '09:50'), calledAt: stamp(workday(-3), '10:05'), completedAt: stamp(workday(-3), '10:20'), followUpDate: today });
    mk('apt-13', 4, 1, workday(-2), '11:00', 'New', 'Phone', 'Cancelled', { notes: 'Cancelled: patient unwell' });
  }
  void nowMin; void hhmm; void localDate;

  // ---------------------------------------------------------------- enquiries, documents, feedback
  const enquiries = [
    row('enq-1', { name: 'Manoj Chavan', phone: '9822000001', enquiryType: 'Appointment', source: 'Phone', message: 'Wants a cardiology appointment this week.', status: 'New', patientId: '', handledBy: '' }),
    row('enq-2', { name: 'Rekha Salunkhe', phone: '9822000002', enquiryType: 'Health check-up', source: 'Walk-in', message: 'Asked about the full body check-up package.', status: 'In progress', patientId: '', handledBy: '' }),
    row('enq-3', { name: 'Imran Shaikh', phone: '9822000003', enquiryType: 'Billing / estimate', source: 'WhatsApp', message: 'Estimate for knee surgery.', status: 'In progress', patientId: '', handledBy: '' }),
    row('enq-4', { name: 'Pooja Thakur', phone: '9822000004', enquiryType: 'General information', source: 'Website', message: 'OPD timings and visiting hours.', status: 'Closed', patientId: '', handledBy: '' }),
    row('enq-5', { name: 'Neha Bhosale', phone: '9876500010', enquiryType: 'Appointment', source: 'Phone', message: 'Booked a general medicine visit.', status: 'Converted', patientId: 'pat-10', handledBy: '' }),
  ];
  const patientDocuments = [
    row('doc-1', { patientId: 'pat-1', docType: 'ID proof', title: 'Aadhaar card', fileName: 'aadhaar-rahul.pdf', fileSize: 182000, notes: '', verified: 'Yes' }),
    row('doc-2', { patientId: 'pat-1', docType: 'Insurance card', title: 'Star Health card', fileName: 'star-health.jpg', fileSize: 95000, notes: '', verified: 'Yes' }),
    row('doc-3', { patientId: 'pat-5', docType: 'Previous report', title: 'ECG report, March', fileName: 'ecg-vikas.pdf', fileSize: 240000, notes: '', verified: 'No' }),
  ];
  const feedback = [
    row('fb-1', { patientId: 'pat-1', appointmentId: 'apt-1', rating: 5, category: 'Reception / registration', comments: 'Quick registration, polite staff.', followUp: 'No' }),
    row('fb-2', { patientId: 'pat-2', appointmentId: 'apt-2', rating: 3, category: 'Waiting time', comments: 'Waited more than 30 minutes.', followUp: 'Yes' }),
  ].filter((f) => appointments.some((a) => a.id === f.appointmentId));

  return { receptionSettings, patients, enquiries, doctorSchedules, doctorLeaves, appointments, admissions, patientDocuments, transfers: [], dischargeRegs: [], feedback };
}
