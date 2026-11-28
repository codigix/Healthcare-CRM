"use client";

import React, { useState } from 'react';
import { Stethoscope } from 'lucide-react';
import AdminCrud, { type AdminCrudProps } from '@/features/admin/AdminCrud';
import { useDb } from '@/data/db';
import { computeSlots, leaveOn, sessionsOn, todayStr, WEEKDAYS } from '@/data/slots';
import { deptName, doctorsOf } from '@/data/receptionActions';
import { PageHeader, Panel, Tabs, useMounted } from '@/features/admin/ui';
import { Pill, Table, Td, Tr, inputCls } from '@/features/reception/parts';

const docOpt = { col: 'staff' as const, label: (r: any) => `${r.name} (${r.specialization || r.designation})`, filter: (r: any) => r.staffType === 'Doctor' && String(r.status || 'Active') === 'Active' };
const docName = (db: any, id: string) => db.staff.find((s: any) => s.id === id)?.name || '';

const sessionsDef: Pick<AdminCrudProps, 'columns' | 'fields' | 'stats' | 'filters' | 'defaults'> = {
  columns: [
    { header: 'Doctor', value: (r, db) => docName(db, r.doctorId) }, { header: 'Department', value: (r, db) => deptName(db, db.staff.find((s: any) => s.id === r.doctorId)?.departmentId) }, { header: 'Day', key: 'weekday' },
    { header: 'Timing', value: (r) => `${r.startTime} - ${r.endTime}` }, { header: 'Minutes / patient', key: 'slotMinutes' },
    { header: 'Slots', value: (r) => { const a = Number(r.slotMinutes) || 15; const m = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5)); return Math.floor((m(r.endTime) - m(r.startTime)) / a); } },
    { header: 'Room', key: 'room' }, { header: 'Status', key: 'status', render: (r) => <Pill value={r.status === 'Inactive' ? 'Closed' : 'Cleared'} /> },
  ],
  fields: [
    { name: 'doctorId', label: 'Doctor', type: 'select', required: true, from: docOpt },
    { name: 'weekday', label: 'Day', type: 'select', options: WEEKDAYS, required: true, half: true }, { name: 'room', label: 'OPD room', half: true, placeholder: 'e.g. OPD-3' },
    { name: 'startTime', label: 'Starts at', type: 'time', required: true, half: true }, { name: 'endTime', label: 'Ends at', type: 'time', required: true, half: true },
    { name: 'slotMinutes', label: 'Minutes per patient', type: 'number', required: true, half: true, min: 5, help: 'Slots are created from the start time at this interval.' },
    { name: 'maxPatients', label: 'Maximum patients (optional)', type: 'number', half: true, min: 1, help: 'Leave empty to allow every slot.' },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], required: true, half: true },
  ],
  stats: [
    { label: 'OPD sessions', value: (r) => r.length, color: 'text-blue-400' }, { label: 'Doctors scheduled', value: (r) => new Set(r.map((x) => x.doctorId)).size, color: 'text-emerald-400' },
    { label: 'Doctors without OPD', value: (_r, db) => doctorsOf(db).filter((d) => !db.doctorSchedules.some((s) => s.doctorId === d.id)).length, color: 'text-amber-400' }, { label: 'Today\'s sessions', value: (r) => r.filter((x) => x.weekday === WEEKDAYS[(new Date().getDay() + 6) % 7]).length, color: 'text-indigo-400' },
  ],
  filters: [{ label: 'doctors', options: (db) => doctorsOf(db).map((d) => ({ value: d.id, label: d.name })), match: (r, v) => r.doctorId === v }, { label: 'days', options: WEEKDAYS, match: (r, v) => r.weekday === v }],
  defaults: () => ({ slotMinutes: 15, status: 'Active', room: 'OPD', weekday: 'Monday', startTime: '09:00', endTime: '12:00' }),
};

const leavesDef: Pick<AdminCrudProps, 'columns' | 'fields' | 'stats' | 'filters' | 'defaults'> = {
  columns: [
    { header: 'Doctor', value: (r, db) => docName(db, r.doctorId) }, { header: 'From', key: 'fromDate' }, { header: 'To', key: 'toDate' }, { header: 'Days', value: (r) => Math.round((new Date(r.toDate).getTime() - new Date(r.fromDate).getTime()) / 86400000) + 1 },
    { header: 'Reason', key: 'reason' }, { header: 'When', value: (r) => (r.toDate < todayStr() ? 'Past' : r.fromDate <= todayStr() ? 'On leave now' : 'Upcoming') },
  ],
  fields: [
    { name: 'doctorId', label: 'Doctor', type: 'select', required: true, from: docOpt }, { name: 'fromDate', label: 'From', type: 'date', required: true, half: true }, { name: 'toDate', label: 'To', type: 'date', required: true, half: true },
    { name: 'reason', label: 'Reason', half: true, placeholder: 'e.g. Conference, personal' },
  ],
  stats: [
    { label: 'Leave records', value: (r) => r.length, color: 'text-blue-400' }, { label: 'On leave now', value: (r) => r.filter((x) => x.fromDate <= todayStr() && x.toDate >= todayStr()).length, color: 'text-amber-400' },
    { label: 'Upcoming', value: (r) => r.filter((x) => x.fromDate > todayStr()).length, color: 'text-indigo-400' },
  ],
  filters: [{ label: 'doctors', options: (db) => doctorsOf(db).map((d) => ({ value: d.id, label: d.name })), match: (r, v) => r.doctorId === v }],
  defaults: () => ({ fromDate: todayStr(), toDate: todayStr() }),
};

function Availability() {
  const db = useDb();
  const [date, setDate] = useState(todayStr());
  const [dept, setDept] = useState('');
  const rows = doctorsOf(db).filter((d) => !dept || d.departmentId === dept).map((d) => {
    const leave = leaveOn(db, d.id, date); const sessions = sessionsOn(db, d.id, date); const slots = computeSlots(db, d.id, date);
    const free = slots.filter((s) => s.state === 'free').length;
    const state = leave ? 'On leave' : !sessions.length ? 'No OPD' : free === 0 ? 'Full' : 'Available';
    return { d, leave, sessions, free, total: slots.length, state };
  });
  return (
    <Panel title="Who can see patients on a date" actions={
      <div className="flex gap-3"><select value={dept} onChange={(e) => setDept(e.target.value)} className={`${inputCls} !w-auto`}><option value="">All departments</option>{db.departments.filter((x) => doctorsOf(db).some((d) => d.departmentId === x.id)).map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`${inputCls} !w-auto`} data-testid="avail-date" /></div>}>
      <Table head={['Doctor', 'Department', 'OPD timing', 'Slots free', 'State']} empty="No doctors.">
        {rows.map((x) => (
          <Tr key={x.d.id} ><Td>{x.d.name}</Td><Td>{deptName(db, x.d.departmentId)}</Td><Td>{x.sessions.map((s) => `${s.startTime}-${s.endTime}`).join(', ') || '-'}</Td><Td>{x.total ? `${x.free} / ${x.total}` : '-'}</Td>
            <Td><span data-state={x.state}><Pill value={x.state === 'Available' ? 'Cleared' : x.state === 'Full' ? 'Pending' : x.state === 'On leave' ? 'Overdue' : 'Closed'} /> <span className="text-xs text-gray-400 ml-1">{x.state}</span></span></Td></Tr>
        ))}
      </Table>
    </Panel>
  );
}

export default function DoctorSchedulingPage() {
  const mounted = useMounted();
  if (!mounted) return <div className="py-16 text-center text-sm text-gray-400">Loading...</div>;
  return (
    <div className="space-y-4">
      <PageHeader icon={Stethoscope} step="Step 6 · Select department & doctor" title="Doctor Scheduling" description="OPD sessions per doctor and day, leave, and who is available on a date. Appointment slots are created from these sessions." />
      <Tabs tabs={[
        { id: 'sessions', label: 'OPD sessions', node: <AdminCrud embedded collection="doctorSchedules" title="OPD sessions" singular="Session" icon={Stethoscope} {...sessionsDef} addLabel="Add session" description="A session is a doctor's OPD hours on one weekday. Sessions of the same doctor cannot overlap." emptyHint="Add an OPD session for each doctor so patients can be booked." /> },
        { id: 'leave', label: 'Leave', node: <AdminCrud embedded collection="doctorLeaves" title="Leave" singular="Leave" icon={Stethoscope} {...leavesDef} addLabel="Add leave" description="No appointments can be booked on a doctor's leave days. A leave cannot be added over booked appointments." /> },
        { id: 'availability', label: 'Availability', node: <Availability /> },
      ]} />
    </div>
  );
}
