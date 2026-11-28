/** Business actions of Module B (Reception). Several of them change more than one record; those run as one all-or-nothing save. */
import { create, update, getDb, transaction, DbError, type Db, type Row } from './db';
import { addDays, nextTokenNo, nowTime, todayStr, FREED } from './slots';

const pad = (n: number, w: number) => String(n).padStart(w, '0');
export const tokenLabel = (n: unknown) => `T-${pad(Number(n) || 0, 3)}`;
export const ageOf = (dob?: string) => {
  if (!dob) return '';
  const d = new Date(`${dob}T00:00:00`), n = new Date();
  let y = n.getFullYear() - d.getFullYear();
  if (n.getMonth() < d.getMonth() || (n.getMonth() === d.getMonth() && n.getDate() < d.getDate())) y--;
  if (y >= 2) return `${y} y`;
  const months = (n.getFullYear() - d.getFullYear()) * 12 + n.getMonth() - d.getMonth() - (n.getDate() < d.getDate() ? 1 : 0);
  return `${Math.max(0, months)} m`;
};
export const fullName = (p?: Row) => (p ? [p.title, p.firstName, p.middleName, p.lastName].filter(Boolean).join(' ') : '');
export const patientOf = (db: Db, id?: string) => db.patients.find((p) => p.id === id);
export const staffName = (db: Db, id?: string) => db.staff.find((s) => s.id === id)?.name || '';
export const deptName = (db: Db, id?: string) => db.departments.find((d) => d.id === id)?.name || '';
export const doctorsOf = (db: Db) => db.staff.filter((s) => s.staffType === 'Doctor' && String(s.status || 'Active') === 'Active');
export const timeOf = (iso?: string) => (iso ? new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '');
export const dateTimeOf = (iso?: string) => (iso ? new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '');
export const minutesSince = (iso?: string) => (iso ? Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000)) : 0);

// ---------------------------------------------------------------- UHID / MRN
export interface ReceptionSettings { uhidPrefix: string; uhidDigits: number; mrnPrefix: string; mrnDigits: number; registrationFee: number }
export const settingsOf = (db: Db): ReceptionSettings => {
  const s = db.receptionSettings[0];
  return { uhidPrefix: s?.uhidPrefix || 'UHID', uhidDigits: Number(s?.uhidDigits) || 6, mrnPrefix: s?.mrnPrefix || 'MRN', mrnDigits: Number(s?.mrnDigits) || 6, registrationFee: Number(s?.registrationFee) || 0 };
};
const nextSeq = (rows: Row[], field: string) => rows.reduce((m, r) => { const x = String(r[field] ?? '').match(/(\d+)\s*$/); return x ? Math.max(m, Number(x[1])) : m; }, 0) + 1;
export const previewUhid = (db: Db) => { const s = settingsOf(db); return `${s.uhidPrefix.toUpperCase()}-${pad(nextSeq(db.patients, 'uhid'), s.uhidDigits)}`; };
export const previewMrn = (db: Db) => { const s = settingsOf(db); return `${s.mrnPrefix.toUpperCase()}-${pad(nextSeq(db.patients, 'mrn'), s.mrnDigits)}`; };

/** Patients that look like the one being registered (same mobile number, or same name and date of birth). */
export function findDuplicates(db: Db, q: { phone?: string; firstName?: string; lastName?: string; dob?: string }, ignoreId?: string): Row[] {
  const phone = String(q.phone || '').replace(/\D/g, '');
  const fn = String(q.firstName || '').trim().toLowerCase(), ln = String(q.lastName || '').trim().toLowerCase();
  return db.patients.filter((p) => p.id !== ignoreId && ((phone.length >= 10 && String(p.phone).replace(/\D/g, '') === phone) || (fn && ln && q.dob && p.firstName.toLowerCase() === fn && p.lastName.toLowerCase() === ln && p.dob === q.dob)));
}

/** Step 3 + 4 of the reception flow: register the patient and issue a unique UHID and MRN. */
export function registerPatient(data: Record<string, any>): Row {
  const db = getDb();
  return create('patients', {
    patientType: 'OPD', isVip: 'No', hasInsurance: 'No', ...data,
    uhid: previewUhid(db), mrn: previewMrn(db), status: 'Active', registeredAt: new Date().toISOString(),
  });
}

// ---------------------------------------------------------------- appointments, tokens, queue
export interface BookingInput { patientId: string; doctorId: string; date: string; time?: string; visitType: string; source: string; reason?: string; status?: string }

/** Step 6 to 8: pick the doctor, book the slot, and the system issues the token. */
export function bookAppointment(input: BookingInput): Row {
  const db = getDb();
  const doc = db.staff.find((s) => s.id === input.doctorId);
  if (!doc) throw new DbError('Choose a doctor');
  const walkIn = input.source === 'Walk-in';
  const checkedIn = walkIn || input.status === 'Checked-in';
  return create('appointments', {
    patientId: input.patientId, doctorId: doc.id, departmentId: doc.departmentId, date: input.date, time: walkIn ? nowTime() : input.time || '',
    visitType: input.visitType, source: input.source, reason: input.reason || '', status: checkedIn ? 'Checked-in' : 'Booked', tokenNo: nextTokenNo(db, doc.id, input.date),
    fee: Number(doc.consultationFee) || 0, bookedAt: new Date().toISOString(), checkedInAt: checkedIn ? new Date().toISOString() : '', calledAt: '', completedAt: '', followUpDate: '', skipped: 0, notes: '',
  });
}

const apptOf = (id: string) => { const a = getDb().appointments.find((x) => x.id === id); if (!a) throw new DbError('This appointment no longer exists'); return a; };

export function cancelAppointment(id: string, reason: string): Row {
  const a = apptOf(id);
  if (!['Booked', 'Checked-in'].includes(a.status)) throw new DbError(`A ${String(a.status).toLowerCase()} appointment cannot be cancelled`);
  if (!reason.trim()) throw new DbError('Please give a reason for cancelling');
  return update('appointments', id, { status: 'Cancelled', notes: `Cancelled: ${reason.trim()}` });
}
export function markNoShow(id: string): Row {
  const a = apptOf(id);
  if (a.status !== 'Booked') throw new DbError('Only a booked appointment can be marked as no-show');
  if (a.date > todayStr()) throw new DbError('This appointment is in the future');
  return update('appointments', id, { status: 'No-show' });
}
/** Step 9: the patient arrives and joins the OPD queue. */
export function checkIn(id: string): Row {
  const a = apptOf(id);
  if (a.status !== 'Booked') throw new DbError(`This appointment is already ${String(a.status).toLowerCase()}`);
  if (a.date !== todayStr()) throw new DbError('Check-in is only possible on the day of the appointment');
  return update('appointments', id, { status: 'Checked-in', checkedInAt: new Date().toISOString() });
}
export function callPatient(id: string): Row {
  const db = getDb(); const a = apptOf(id);
  if (a.status !== 'Checked-in') throw new DbError(a.status === 'Booked' ? 'The patient has not been checked in yet' : `This token is ${String(a.status).toLowerCase()}`);
  const busy = db.appointments.find((x) => x.doctorId === a.doctorId && x.date === a.date && x.status === 'In consultation');
  if (busy) throw new DbError(`${staffName(db, a.doctorId)} is already seeing token ${tokenLabel(busy.tokenNo)}. Complete that visit first.`);
  return update('appointments', id, { status: 'In consultation', calledAt: new Date().toISOString() });
}
export function skipToken(id: string): Row {
  const a = apptOf(id);
  if (a.status !== 'Checked-in') throw new DbError('Only a waiting patient can be skipped');
  return update('appointments', id, { skipped: (Number(a.skipped) || 0) + 1 });
}
export function completeVisit(id: string, followUpDate = '', notes = ''): Row {
  const a = apptOf(id);
  if (a.status !== 'In consultation') throw new DbError('Only a patient who is with the doctor can be completed');
  if (followUpDate && followUpDate <= todayStr()) throw new DbError('The follow-up date must be after today');
  return update('appointments', id, { status: 'Completed', completedAt: new Date().toISOString(), followUpDate, notes: notes.trim() || a.notes });
}
export function rescheduleAppointment(id: string, date: string, time: string): Row {
  const db = getDb(); const a = apptOf(id);
  if (a.status !== 'Booked') throw new DbError('Only a booked appointment can be rescheduled');
  return update('appointments', id, { date, time, tokenNo: date === a.date ? a.tokenNo : nextTokenNo(db, a.doctorId, date) });
}

/** Today's queue order: patients who were skipped go after the others, then by appointment time, then by token. */
export const queueOrder = (a: Row, b: Row) => (Number(a.skipped) || 0) - (Number(b.skipped) || 0) || String(a.time).localeCompare(String(b.time)) || Number(a.tokenNo) - Number(b.tokenNo);

// ---------------------------------------------------------------- enquiry
export function convertEnquiry(enquiryId: string, patientId: string): Row { return update('enquiries', enquiryId, { status: 'Converted', patientId }); }

// ---------------------------------------------------------------- admission, transfer, discharge
export const bedLabel = (db: Db, bedId: string) => {
  const bed = db.beds.find((b) => b.id === bedId); if (!bed) return '';
  const room = db.rooms.find((r) => r.id === bed.roomId); const ward = db.wards.find((w) => w.id === room?.wardId);
  return `${bed.bedNumber}${ward ? ` - ${ward.name}` : ''}`;
};
export const wardOfBedId = (db: Db, bedId: string) => { const bed = db.beds.find((b) => b.id === bedId); const room = db.rooms.find((r) => r.id === bed?.roomId); return db.wards.find((w) => w.id === room?.wardId); };
export const freeBeds = (db: Db) => db.beds.filter((b) => b.status === 'Available');
export const activeAdmission = (db: Db, patientId: string) => db.admissions.find((a) => a.patientId === patientId && a.status === 'Admitted');

export function admitPatient(input: { patientId: string; bedId: string; doctorId: string; diagnosis: string; admissionType: string }): Row {
  let out: Row | undefined;
  transaction((tx) => {
    const db = getDb();
    const patient = patientOf(db, input.patientId); if (!patient) throw new DbError('Choose a patient');
    if (activeAdmission(db, patient.id)) throw new DbError(`${fullName(patient)} is already admitted`);
    const bed = db.beds.find((b) => b.id === input.bedId); if (!bed) throw new DbError('Choose a bed');
    if (bed.status !== 'Available') throw new DbError(`Bed ${bed.bedNumber} is ${String(bed.status).toLowerCase()}. Choose an available bed.`);
    const doc = db.staff.find((s) => s.id === input.doctorId); if (!doc) throw new DbError('Choose the admitting doctor');
    if (!input.diagnosis.trim()) throw new DbError('Enter the reason for admission');
    const ward = wardOfBedId(db, bed.id);
    tx.update('beds', bed.id, { status: 'Occupied' });
    tx.update('patients', patient.id, { patientType: 'IPD' });
    out = tx.create('admissions', {
      patientId: patient.id, bedId: bed.id, bedNumber: bed.bedNumber, wardName: ward?.name || '', doctorId: doc.id, departmentId: doc.departmentId, admissionType: input.admissionType || 'Planned',
      diagnosis: input.diagnosis.trim(), admittedAt: new Date().toISOString(), status: 'Admitted', dischargedAt: '', notes: '',
    });
  });
  return out!;
}

export interface TransferInput { admissionId: string; transferType: string; toBedId?: string; toDepartmentId?: string; toDoctorId?: string; hospitalName?: string; reason: string }
export function transferPatient(input: TransferInput): Row {
  let out: Row | undefined;
  transaction((tx) => {
    const db = getDb();
    const adm = db.admissions.find((a) => a.id === input.admissionId);
    if (!adm || adm.status !== 'Admitted') throw new DbError('Choose a patient who is currently admitted');
    if (!input.reason.trim()) throw new DbError('Enter the reason for the transfer');
    let from = '', to = '';
    const now = new Date();
    if (input.transferType === 'Bed transfer') {
      const bed = db.beds.find((b) => b.id === input.toBedId); if (!bed) throw new DbError('Choose the new bed');
      if (bed.id === adm.bedId) throw new DbError('The patient is already in this bed');
      if (bed.status !== 'Available') throw new DbError(`Bed ${bed.bedNumber} is ${String(bed.status).toLowerCase()}. Choose an available bed.`);
      from = bedLabel(db, adm.bedId); to = bedLabel(db, bed.id);
      tx.update('beds', adm.bedId, { status: 'Cleaning' });
      tx.update('beds', bed.id, { status: 'Occupied' });
      tx.update('admissions', adm.id, { bedId: bed.id, bedNumber: bed.bedNumber, wardName: wardOfBedId(db, bed.id)?.name || '' });
    } else if (input.transferType === 'Department transfer') {
      const dept = db.departments.find((d) => d.id === input.toDepartmentId); if (!dept) throw new DbError('Choose the new department');
      if (dept.id === adm.departmentId) throw new DbError('The patient is already under this department');
      const doc = db.staff.find((s) => s.id === input.toDoctorId && s.departmentId === dept.id); if (!doc) throw new DbError('Choose a doctor of the new department');
      from = `${deptName(db, adm.departmentId)}, ${staffName(db, adm.doctorId)}`; to = `${dept.name}, ${doc.name}`;
      tx.update('admissions', adm.id, { departmentId: dept.id, doctorId: doc.id });
    } else if (input.transferType === 'Doctor change') {
      const doc = db.staff.find((s) => s.id === input.toDoctorId && s.staffType === 'Doctor'); if (!doc) throw new DbError('Choose the new doctor');
      if (doc.id === adm.doctorId) throw new DbError('This doctor is already treating the patient');
      from = staffName(db, adm.doctorId); to = doc.name;
      tx.update('admissions', adm.id, { doctorId: doc.id, departmentId: doc.departmentId });
    } else if (input.transferType === 'Referral to another hospital') {
      if (!(input.hospitalName || '').trim()) throw new DbError('Enter the name of the hospital the patient is referred to');
      from = bedLabel(db, adm.bedId); to = input.hospitalName!.trim();
      tx.update('beds', adm.bedId, { status: 'Cleaning' });
      tx.update('admissions', adm.id, { status: 'Referred', dischargedAt: now.toISOString() });
      tx.update('patients', adm.patientId, { patientType: 'OPD' });
    } else throw new DbError('Choose the type of transfer');
    out = tx.create('transfers', { patientId: adm.patientId, admissionId: adm.id, transferType: input.transferType, fromText: from, toText: to, reason: input.reason.trim(), transferDate: todayStr(), transferTime: nowTime() });
  });
  return out!;
}

export interface DischargeInput { admissionId: string; dischargeType: string; condition: string; billStatus: string; summaryNote: string; followUpDate: string }
export function registerDischarge(input: DischargeInput): Row {
  let out: Row | undefined;
  transaction((tx) => {
    const db = getDb();
    const adm = db.admissions.find((a) => a.id === input.admissionId);
    if (!adm || adm.status !== 'Admitted') throw new DbError('Choose a patient who is currently admitted');
    if (!input.dischargeType) throw new DbError('Choose the type of discharge');
    if (!input.condition) throw new DbError('Choose the condition at discharge');
    if (input.dischargeType === 'Normal discharge' && input.billStatus !== 'Cleared') throw new DbError('The bill must be cleared before a normal discharge. Choose "Cleared", or use another discharge type.');
    if (input.dischargeType === 'Death' && input.condition !== 'Deceased') throw new DbError('Choose "Deceased" as the condition for a death discharge');
    if (input.dischargeType !== 'Death' && input.condition === 'Deceased') throw new DbError('The condition "Deceased" needs the discharge type "Death"');
    if (input.followUpDate && input.followUpDate <= todayStr()) throw new DbError('The follow-up date must be after today');
    tx.update('admissions', adm.id, { status: 'Discharged', dischargedAt: new Date().toISOString() });
    tx.update('beds', adm.bedId, { status: 'Cleaning' });
    tx.update('patients', adm.patientId, { patientType: 'OPD', ...(input.dischargeType === 'Death' ? { status: 'Inactive' } : {}) });
    out = tx.create('dischargeRegs', {
      admissionId: adm.id, patientId: adm.patientId, dischargeType: input.dischargeType, dischargeDate: todayStr(), dischargeTime: nowTime(), condition: input.condition,
      billStatus: input.billStatus, summaryNote: input.summaryNote.trim(), followUpDate: input.followUpDate, bedNumber: adm.bedNumber,
    });
  });
  return out!;
}
export function markBedReady(bedId: string): Row {
  const bed = getDb().beds.find((b) => b.id === bedId);
  if (!bed) throw new DbError('This bed no longer exists');
  if (bed.status !== 'Cleaning') throw new DbError('Only a bed that is being cleaned can be marked ready');
  return update('beds', bedId, { status: 'Available' });
}

// ---------------------------------------------------------------- follow-up
export type FollowUpState = 'Booked' | 'Overdue' | 'Due today' | 'Upcoming';
export function followUps(db: Db) {
  const t = todayStr();
  return db.appointments.filter((a) => a.status === 'Completed' && a.followUpDate).map((a) => {
    const booked = db.appointments.find((x) => x.patientId === a.patientId && x.id !== a.id && !FREED.includes(x.status) && x.date >= a.date && x.date > a.completedAt.slice(0, 10) && x.visitType === 'Follow-up');
    const state: FollowUpState = booked ? 'Booked' : a.followUpDate < t ? 'Overdue' : a.followUpDate === t ? 'Due today' : 'Upcoming';
    return { appointment: a, state, booked };
  }).sort((x, y) => String(x.appointment.followUpDate).localeCompare(String(y.appointment.followUpDate)));
}

// ---------------------------------------------------------------- today at a glance
export function todaySummary(db: Db) {
  const t = todayStr();
  const appts = db.appointments.filter((a) => a.date === t);
  const live = appts.filter((a) => !FREED.includes(a.status));
  return {
    enquiriesToday: db.enquiries.filter((e) => String(e.createdAt).slice(0, 10) === t).length,
    enquiriesOpen: db.enquiries.filter((e) => ['New', 'In progress'].includes(e.status)).length,
    registeredToday: db.patients.filter((p) => String(p.registeredAt).slice(0, 10) === t).length,
    patients: db.patients.length,
    appointments: live.length,
    tokens: appts.length,
    waiting: appts.filter((a) => a.status === 'Checked-in').length,
    inConsultation: appts.filter((a) => a.status === 'In consultation').length,
    completed: appts.filter((a) => a.status === 'Completed').length,
    expected: appts.filter((a) => a.status === 'Booked').length,
    noShow: appts.filter((a) => a.status === 'No-show').length,
    cancelled: appts.filter((a) => a.status === 'Cancelled').length,
    walkIns: appts.filter((a) => a.source === 'Walk-in').length,
    admitted: db.admissions.filter((a) => a.status === 'Admitted').length,
    bedsFree: db.beds.filter((b) => b.status === 'Available').length,
    bedsCleaning: db.beds.filter((b) => b.status === 'Cleaning').length,
    followUpsDue: followUps(db).filter((f) => f.state === 'Overdue' || f.state === 'Due today').length,
    feedbackAvg: db.feedback.length ? (db.feedback.reduce((s, f) => s + Number(f.rating || 0), 0) / db.feedback.length).toFixed(1) : '-',
    avgWait: (() => { const w = appts.filter((a) => a.calledAt && a.checkedInAt).map((a) => (new Date(a.calledAt).getTime() - new Date(a.checkedInAt).getTime()) / 60000); return w.length ? Math.round(w.reduce((s, x) => s + x, 0) / w.length) : 0; })(),
  };
}
export { addDays };
