"use client";

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CalendarCheck, Ticket } from 'lucide-react';
import Modal from '@/components/UI/Modal';
import { useDb, DbError, type Row } from '@/data/db';
import { bookAppointment, cancelAppointment, checkIn, deptName, fullName, markNoShow, patientOf, rescheduleAppointment, staffName, tokenLabel } from '@/data/receptionActions';
import { addDays, FREED, todayStr } from '@/data/slots';
import { VISIT_TYPES, BOOKING_SOURCES } from '@/data/lists';
import { fmtDate } from '@/data/actions';
import { PageHeader, Panel, Tabs, useMounted } from '@/features/admin/ui';
import { Alert, Field, PatientSearchBox, Pill, SlotPicker, SmallBtn, Table, Td, TokenSlip, Tr, btnGhost, btnPrimary, doctorOptions, errMsg, inputCls } from '@/features/reception/parts';

function BookingForm({ patientId, onBooked }: { patientId: string; onBooked: (a: Row) => void }) {
  const db = useDb();
  const params = useSearchParams();
  const [patient, setPatient] = useState<Row | null>(null);
  const [dept, setDept] = useState(''); const [doctor, setDoctor] = useState(''); const [date, setDate] = useState(todayStr()); const [time, setTime] = useState('');
  const [visit, setVisit] = useState('New'); const [source, setSource] = useState('Counter'); const [reason, setReason] = useState(''); const [err, setErr] = useState('');
  useEffect(() => { if (patientId) { const p = patientOf(db, patientId); if (p) setPatient(p); } }, [patientId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const d = params.get('doctor'); if (d) { const doc = db.staff.find((s) => s.id === d); if (doc) { setDept(doc.departmentId); setDoctor(doc.id); } } const v = params.get('type'); if (v) setVisit(v); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const doctors = doctorOptions(db, dept);
  const deptList = db.departments.filter((d) => doctorOptions(db, d.id).length);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return setErr('Choose the patient. Search by name, UHID or mobile number.');
    if (!doctor) return setErr('Choose a doctor');
    if (!date) return setErr('Choose a date');
    if (!time) return setErr('Choose a time slot');
    try {
      const a = bookAppointment({ patientId: patient.id, doctorId: doctor, date, time, visitType: visit, source, reason });
      setErr(''); setTime(''); setReason(''); onBooked(a);
    } catch (x) { setErr(errMsg(x)); }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-6" data-testid="booking-form">
      <Panel title="1. Patient">
        <PatientSearchBox value={patient} onChange={setPatient} />
        {patient && patient.status === 'Inactive' && <div className="mt-3"><Alert kind="warn">This patient is marked Inactive. Make the patient Active before booking.</Alert></div>}
      </Panel>
      <Panel title="2. Department and doctor">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Department" required><select value={dept} onChange={(e) => { setDept(e.target.value); setDoctor(''); setTime(''); }} className={inputCls} data-testid="dept"><option value="">All departments</option>{deptList.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></Field>
          <Field label="Doctor" required><select value={doctor} onChange={(e) => { setDoctor(e.target.value); setTime(''); }} className={inputCls} data-testid="doctor"><option value="">Select doctor</option>{doctors.map((d) => <option key={d.id} value={d.id}>{d.name} - {deptName(db, d.departmentId)}{Number(d.consultationFee) ? ` (Rs. ${d.consultationFee})` : ''}</option>)}</select></Field>
        </div>
      </Panel>
      <Panel title="3. Date and time">
        <div className="space-y-4">
          <Field label="Date" required half={false}><input type="date" min={todayStr()} value={date} onChange={(e) => { setDate(e.target.value); setTime(''); }} className={`${inputCls} !w-auto`} data-testid="date" /></Field>
          <SlotPicker doctorId={doctor} date={date} value={time} onChange={setTime} onJump={(d) => { setDate(d); setTime(''); }} />
        </div>
      </Panel>
      <Panel title="4. Visit">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Visit type"><select value={visit} onChange={(e) => setVisit(e.target.value)} className={inputCls}>{VISIT_TYPES.filter((v) => v !== 'Walk-in' && v !== 'Emergency').map((v) => <option key={v}>{v}</option>)}</select></Field>
          <Field label="Booked through"><select value={source} onChange={(e) => setSource(e.target.value)} className={inputCls}>{BOOKING_SOURCES.filter((s) => s !== 'Walk-in').map((s) => <option key={s}>{s}</option>)}</select></Field>
          <Field label="Reason for visit" half={false}><input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Fever for 3 days" className={inputCls} /></Field>
        </div>
      </Panel>
      {err && <Alert kind="err">{err}</Alert>}
      <div className="flex justify-end"><button type="submit" className={btnPrimary} data-testid="book-submit"><Ticket size={16} /> Book appointment and generate token</button></div>
    </form>
  );
}

function AppointmentList({ onSlip }: { onSlip: (a: Row) => void }) {
  const db = useDb();
  const [date, setDate] = useState(''); const [doctor, setDoctor] = useState(''); const [status, setStatus] = useState(''); const [q, setQ] = useState('');
  const [msg, setMsg] = useState<{ k: 'ok' | 'err'; t: string } | null>(null);
  const [cancelling, setCancelling] = useState<Row | null>(null); const [reason, setReason] = useState(''); const [cancelErr, setCancelErr] = useState('');
  const [moving, setMoving] = useState<Row | null>(null); const [newDate, setNewDate] = useState(''); const [newTime, setNewTime] = useState(''); const [moveErr, setMoveErr] = useState('');
  const rows = useMemo(() => db.appointments.filter((a) => (!date || a.date === date) && (!doctor || a.doctorId === doctor) && (!status || a.status === status)
    && (!q.trim() || `${fullName(patientOf(db, a.patientId))} ${patientOf(db, a.patientId)?.uhid} ${tokenLabel(a.tokenNo)}`.toLowerCase().includes(q.trim().toLowerCase())))
    .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`)), [db, date, doctor, status, q]);
  const run = (fn: () => any, ok: string) => { try { fn(); setMsg({ k: 'ok', t: ok }); } catch (e) { setMsg({ k: 'err', t: errMsg(e) }); } };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[['Today', db.appointments.filter((a) => a.date === todayStr() && !FREED.includes(a.status)).length, 'text-blue-400'], ['Upcoming', db.appointments.filter((a) => a.date > todayStr() && a.status === 'Booked').length, 'text-indigo-400'], ['Completed', db.appointments.filter((a) => a.status === 'Completed').length, 'text-emerald-400'], ['Cancelled / no-show', db.appointments.filter((a) => FREED.includes(a.status)).length, 'text-red-400']].map(([l, v, c]) => (
          <div key={String(l)} className="bg-dark-secondary rounded p-4 border border-gray-800"><p className="text-sm text-gray-400">{l}</p><p className={`text-2xl font-bold mt-2 ${c}`}>{v}</p></div>))}
      </div>
      <div className="flex flex-wrap gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search patient, UHID or token" className={`${inputCls} !w-64`} data-testid="appt-search" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`${inputCls} !w-auto`} />
        <select value={doctor} onChange={(e) => setDoctor(e.target.value)} className={`${inputCls} !w-auto`}><option value="">All doctors</option>{doctorOptions(db).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${inputCls} !w-auto`}><option value="">All statuses</option>{['Booked', 'Checked-in', 'In consultation', 'Completed', 'Cancelled', 'No-show'].map((s) => <option key={s}>{s}</option>)}</select>
        {(date || doctor || status || q) && <button type="button" className={btnGhost} onClick={() => { setDate(''); setDoctor(''); setStatus(''); setQ(''); }}>Clear</button>}
      </div>
      {msg && <Alert kind={msg.k}>{msg.t}</Alert>}
      <Panel title={`${rows.length} appointment${rows.length === 1 ? '' : 's'}`}>
        <Table head={['Date', 'Time', 'Token', 'Patient', 'Doctor', 'Type', 'Status', '']} empty="No appointments match.">
          {rows.map((a) => (
            <Tr key={a.id}>
              <Td>{fmtDate(a.date)}</Td><Td>{a.time}</Td><Td><b>{tokenLabel(a.tokenNo)}</b></Td><Td>{fullName(patientOf(db, a.patientId))}<span className="block text-xs text-gray-500">{patientOf(db, a.patientId)?.uhid}</span></Td>
              <Td>{staffName(db, a.doctorId)}<span className="block text-xs text-gray-500">{deptName(db, a.departmentId)}</span></Td><Td>{a.source === 'Walk-in' ? 'Walk-in' : a.visitType}</Td><Td><Pill value={a.status} /></Td>
              <Td className="whitespace-nowrap">
                <SmallBtn tone="gray" onClick={() => onSlip(a)}>Token</SmallBtn>
                {a.status === 'Booked' && a.date === todayStr() && <SmallBtn tone="green" onClick={() => run(() => checkIn(a.id), `${tokenLabel(a.tokenNo)} checked in and sent to the OPD queue`)}>Check in</SmallBtn>}
                {a.status === 'Booked' && <SmallBtn onClick={() => { setMoving(a); setNewDate(a.date); setNewTime(''); setMoveErr(''); }}>Reschedule</SmallBtn>}
                {a.status === 'Booked' && a.date <= todayStr() && <SmallBtn tone="gray" onClick={() => run(() => markNoShow(a.id), 'Marked as no-show')}>No-show</SmallBtn>}
                {['Booked', 'Checked-in'].includes(a.status) && <SmallBtn tone="red" onClick={() => { setCancelling(a); setReason(''); setCancelErr(''); }}>Cancel</SmallBtn>}
              </Td>
            </Tr>
          ))}
        </Table>
      </Panel>
      <Modal isOpen={!!cancelling} onClose={() => setCancelling(null)} title={cancelling ? `Cancel ${tokenLabel(cancelling.tokenNo)}` : ''} size="md">
        <form noValidate className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (!cancelling) return; try { cancelAppointment(cancelling.id, reason); setMsg({ k: 'ok', t: `${tokenLabel(cancelling.tokenNo)} cancelled. The slot is free again.` }); setCancelling(null); } catch (x) { setCancelErr(errMsg(x)); } }}>
          <Field label="Reason" required half={false}><input value={reason} onChange={(e) => setReason(e.target.value)} className={inputCls} data-testid="cancel-reason" /></Field>
          {cancelErr && <Alert kind="err">{cancelErr}</Alert>}
          <div className="flex justify-end gap-3"><button type="button" className={btnGhost} onClick={() => setCancelling(null)}>Keep appointment</button><button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">Cancel appointment</button></div>
        </form>
      </Modal>
      <Modal isOpen={!!moving} onClose={() => setMoving(null)} title={moving ? `Reschedule ${tokenLabel(moving.tokenNo)} - ${fullName(patientOf(db, moving.patientId))}` : ''} size="2xl">
        {moving && (
          <form noValidate className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (!newTime) return setMoveErr('Choose a new time slot'); try { rescheduleAppointment(moving.id, newDate, newTime); setMsg({ k: 'ok', t: 'Appointment rescheduled' }); setMoving(null); } catch (x) { setMoveErr(errMsg(x)); } }}>
            <p className="text-sm text-gray-400">{staffName(db, moving.doctorId)}, now on {fmtDate(moving.date)} at {moving.time}</p>
            <Field label="New date" half={false}><input type="date" min={todayStr()} value={newDate} onChange={(e) => { setNewDate(e.target.value); setNewTime(''); }} className={`${inputCls} !w-auto`} /></Field>
            <SlotPicker doctorId={moving.doctorId} date={newDate} value={newTime} onChange={setNewTime} ignoreApptId={moving.id} onJump={(d) => { setNewDate(d); setNewTime(''); }} />
            {moveErr && <Alert kind="err">{moveErr}</Alert>}
            <div className="flex justify-end gap-3"><button type="button" className={btnGhost} onClick={() => setMoving(null)}>Cancel</button><button type="submit" className={btnPrimary}>Move appointment</button></div>
          </form>
        )}
      </Modal>
    </div>
  );
}

function Inner() {
  const db = useDb();
  const mounted = useMounted();
  const params = useSearchParams();
  const [slip, setSlip] = useState<Row | null>(null);
  const [tab, setTab] = useState(0);
  const [formKey, setFormKey] = useState(0);
  if (!mounted) return <div className="py-16 text-center text-sm text-gray-400">Loading...</div>;
  const onBooked = (a: Row) => setSlip(a);
  const slipActions = slip && slip.status === 'Booked' && slip.date === todayStr() ? (
    <button type="button" className={btnGhost} data-testid="send-to-opd" onClick={() => { try { checkIn(slip.id); setSlip(null); setFormKey((k) => k + 1); } catch { /* shown in the list */ } }}>Patient is here: send to OPD</button>
  ) : null;
  void tab; void setTab; void db; void addDays;
  return (
    <div className="space-y-4">
      <PageHeader icon={CalendarCheck} step="Step 7 · Book appointment" title="Appointment Booking" description="Book a slot with a doctor. The token is generated automatically, and a booking cannot clash with another patient or the doctor's leave." />
      <Tabs tabs={[
        { id: 'book', label: 'Book appointment', node: <BookingForm key={formKey} patientId={params.get('patient') || ''} onBooked={onBooked} /> },
        { id: 'list', label: 'All appointments', node: <AppointmentList onSlip={setSlip} /> },
      ]} />
      <TokenSlip appt={slip} onClose={() => { setSlip(null); setFormKey((k) => k + 1); }} actions={slipActions} />
    </div>
  );
}

export default function AppointmentBookingPage() {
  return <Suspense fallback={<div className="py-16 text-center text-sm text-gray-400">Loading...</div>}><Inner /></Suspense>;
}
