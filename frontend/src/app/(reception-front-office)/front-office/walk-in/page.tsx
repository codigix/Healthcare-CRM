"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Footprints } from 'lucide-react';
import { useDb, type Row } from '@/data/db';
import { bookAppointment, deptName, fullName, patientOf, staffName, timeOf, tokenLabel } from '@/data/receptionActions';
import { leaveOn, sessionsOn, todayStr } from '@/data/slots';
import { PageHeader, Panel, useMounted } from '@/features/admin/ui';
import { Alert, Field, PatientSearchBox, Pill, Table, Td, TokenSlip, Tr, btnPrimary, errMsg, inputCls } from '@/features/reception/parts';

export default function WalkInPatientPage() {
  const db = useDb();
  const mounted = useMounted();
  const [patient, setPatient] = useState<Row | null>(null);
  const [dept, setDept] = useState(''); const [doctor, setDoctor] = useState(''); const [reason, setReason] = useState('');
  const [err, setErr] = useState(''); const [slip, setSlip] = useState<Row | null>(null);
  if (!mounted) return <div className="py-16 text-center text-sm text-gray-400">Loading...</div>;
  const t = todayStr();
  const available = db.staff.filter((s) => s.staffType === 'Doctor' && String(s.status || 'Active') === 'Active' && sessionsOn(db, s.id, t).length > 0 && !leaveOn(db, s.id, t) && (!dept || s.departmentId === dept));
  const waitingOf = (id: string) => db.appointments.filter((a) => a.doctorId === id && a.date === t && a.status === 'Checked-in').length;
  const todays = db.appointments.filter((a) => a.date === t && a.source === 'Walk-in').sort((a, b) => String(b.checkedInAt).localeCompare(String(a.checkedInAt)));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return setErr('Choose the patient. If the patient is new, register them first.');
    if (!doctor) return setErr('Choose a doctor');
    try { const a = bookAppointment({ patientId: patient.id, doctorId: doctor, date: t, visitType: 'Walk-in', source: 'Walk-in', reason }); setErr(''); setSlip(a); setPatient(null); setDoctor(''); setReason(''); }
    catch (x) { setErr(errMsg(x)); }
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={Footprints} step="Walk-in patient" title="Walk-in Patient" description="A patient who arrives without an appointment. The system issues a token and puts the patient straight into the OPD queue." />
      <Alert kind="info">New patient? <Link href="/front-office/registration" className="underline font-medium">Register first</Link>, then come back here. Only doctors with OPD today who are not on leave are listed.</Alert>
      <form onSubmit={submit} noValidate className="space-y-6" data-testid="walkin-form">
        <Panel title="1. Patient"><PatientSearchBox value={patient} onChange={setPatient} /></Panel>
        <Panel title="2. Doctor">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Department"><select value={dept} onChange={(e) => { setDept(e.target.value); setDoctor(''); }} className={inputCls}><option value="">All departments</option>{db.departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></Field>
            <Field label="Doctor" required><select value={doctor} onChange={(e) => setDoctor(e.target.value)} className={inputCls} data-testid="walkin-doctor"><option value="">Select doctor</option>{available.map((d) => <option key={d.id} value={d.id}>{d.name} - {deptName(db, d.departmentId)} ({waitingOf(d.id)} waiting)</option>)}</select></Field>
            <Field label="Reason for visit" half={false}><input value={reason} onChange={(e) => setReason(e.target.value)} className={inputCls} /></Field>
          </div>
          {available.length === 0 && <div className="mt-3"><Alert kind="warn">No doctor has OPD right now. Check Doctor Scheduling.</Alert></div>}
        </Panel>
        {err && <Alert kind="err">{err}</Alert>}
        <div className="flex justify-end"><button type="submit" className={btnPrimary} data-testid="walkin-submit">Generate token and send to OPD</button></div>
      </form>
      <Panel title={`Walk-ins today (${todays.length})`}>
        <Table head={['Token', 'Patient', 'Doctor', 'Arrived', 'Status']} empty="No walk-in yet today.">
          {todays.map((a) => <Tr key={a.id}><Td><b>{tokenLabel(a.tokenNo)}</b></Td><Td>{fullName(patientOf(db, a.patientId))}</Td><Td>{staffName(db, a.doctorId)}</Td><Td>{timeOf(a.checkedInAt)}</Td><Td><Pill value={a.status} /></Td></Tr>)}
        </Table>
      </Panel>
      <TokenSlip appt={slip} onClose={() => setSlip(null)} />
    </div>
  );
}
