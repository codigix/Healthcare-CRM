/**
 * Doctor scheduling rules: which time slots exist, which are free, and why a booking is refused.
 * Pure functions over the saved data (no storage here), so the data layer and the screens share them.
 */
import type { Db, Row } from './db';

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const pad = (n: number) => String(n).padStart(2, '0');
export const localDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayStr = () => localDate(new Date());
export const nowTime = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
export const weekdayOf = (date: string) => WEEKDAYS[(new Date(`${date}T00:00:00`).getDay() + 6) % 7];
export const toMin = (t: string) => { const [h, m] = String(t).split(':').map(Number); return h * 60 + (m || 0); };
const fromMin = (n: number) => `${pad(Math.floor(n / 60))}:${pad(n % 60)}`;
export const addDays = (date: string, n: number) => { const d = new Date(`${date}T00:00:00`); d.setDate(d.getDate() + n); return localDate(d); };

/** Appointments in these states do not hold a slot. */
export const FREED = ['Cancelled', 'No-show'];
const activeRow = (r: Row) => String(r.status || 'Active') !== 'Inactive';

export const leaveOn = (db: Db, doctorId: string, date: string) => db.doctorLeaves.find((l) => l.doctorId === doctorId && l.fromDate <= date && date <= l.toDate);
export const sessionsOn = (db: Db, doctorId: string, date: string) =>
  db.doctorSchedules.filter((s) => s.doctorId === doctorId && s.weekday === weekdayOf(date) && activeRow(s)).sort((a, b) => toMin(a.startTime) - toMin(b.startTime));

export interface Slot { time: string; state: 'free' | 'booked' | 'past' | 'full'; sessionId: string; appointmentId?: string }

export function computeSlots(db: Db, doctorId: string, date: string, ignoreApptId?: string): Slot[] {
  if (leaveOn(db, doctorId, date)) return [];
  const taken = new Map<string, Row>();
  for (const a of db.appointments) if (a.doctorId === doctorId && a.date === date && !FREED.includes(a.status) && a.id !== ignoreApptId && a.source !== 'Walk-in') taken.set(a.time, a);
  const isToday = date === todayStr(); const now = nowTime();
  const out: Slot[] = [];
  for (const s of sessionsOn(db, doctorId, date)) {
    const step = Math.max(5, Number(s.slotMinutes) || 15);
    const times: string[] = [];
    for (let t = toMin(s.startTime); t + step <= toMin(s.endTime); t += step) times.push(fromMin(t));
    const bookedInSession = times.filter((t) => taken.has(t)).length;
    const full = bookedInSession >= (Number(s.maxPatients) || times.length);
    for (const t of times) {
      const a = taken.get(t);
      out.push({ time: t, sessionId: s.id, appointmentId: a?.id, state: a ? 'booked' : isToday && t < now ? 'past' : full ? 'full' : 'free' });
    }
  }
  return out;
}

/** Why this booking cannot be made ('' when it can). Walk-ins only need the doctor to be present. */
export function slotError(db: Db, data: Record<string, any>, ignoreId?: string): string {
  const doc = db.staff.find((s) => s.id === data.doctorId);
  if (!doc) return 'Choose a doctor';
  if (!data.date) return 'Choose a date';
  const leave = leaveOn(db, doc.id, data.date);
  if (leave) return `${doc.name} is on leave on this date${leave.reason ? ` (${leave.reason})` : ''}`;
  // The same patient cannot hold two live visits with the same doctor on one day (booked or walk-in).
  const dup = db.appointments.find((a) => a.id !== ignoreId && a.patientId === data.patientId && a.doctorId === doc.id && a.date === data.date && !FREED.includes(a.status) && a.status !== 'Completed');
  if (dup) return 'This patient already has an appointment with this doctor on this date';
  if (data.source === 'Walk-in') return sessionsOn(db, doc.id, data.date).length ? '' : `${doc.name} has no OPD schedule on ${weekdayOf(data.date)}, so a walk-in cannot be added`;
  if (data.date < todayStr()) return 'Appointments cannot be booked for a past date';
  if (!sessionsOn(db, doc.id, data.date).length) return `${doc.name} has no OPD schedule on ${weekdayOf(data.date)}`;
  const slot = computeSlots(db, doc.id, data.date, ignoreId).find((s) => s.time === data.time);
  if (!slot) return 'That time is not one of the doctor\'s slots. Pick a slot from the list';
  if (slot.state === 'booked') return 'This slot is already booked';
  if (slot.state === 'past') return 'This time has already passed';
  if (slot.state === 'full') return 'The doctor\'s list for this session is full';
  return '';
}

export const nextTokenNo = (db: Db, doctorId: string, date: string) =>
  db.appointments.filter((a) => a.doctorId === doctorId && a.date === date).reduce((m, a) => Math.max(m, Number(a.tokenNo) || 0), 0) + 1;
