"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftRight, BedDouble } from 'lucide-react';
import Modal from '@/components/UI/Modal';
import { useDb, type Row } from '@/data/db';
import { admitPatient, activeAdmission, bedLabel, dateTimeOf, deptName, doctorsOf, fullName, patientOf, staffName, transferPatient, freeBeds } from '@/data/receptionActions';
import { TRANSFER_TYPES } from '@/data/lists';
import { fmtDate } from '@/data/actions';
import { PageHeader, Panel, Tabs, useMounted } from '@/features/admin/ui';
import { Alert, Field, PatientSearchBox, Pill, SmallBtn, Table, Td, Tr, btnGhost, btnPrimary, errMsg, inputCls } from '@/features/reception/parts';

function BedSelect({ value, onChange, exclude }: { value: string; onChange: (v: string) => void; exclude?: string }) {
  const db = useDb();
  const beds = freeBeds(db).filter((b) => b.id !== exclude);
  const byWard = new Map<string, Row[]>();
  beds.forEach((b) => { const w = db.wards.find((x) => x.id === db.rooms.find((r) => r.id === b.roomId)?.wardId)?.name || 'No ward'; byWard.set(w, [...(byWard.get(w) || []), b]); });
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} data-testid="bed-select">
      <option value="">Select an available bed</option>
      {[...byWard.entries()].map(([w, list]) => <optgroup key={w} label={`${w} (${list.length} free)`}>{list.map((b) => <option key={b.id} value={b.id}>{b.bedNumber}</option>)}</optgroup>)}
    </select>
  );
}

function AdmitModal({ open, onClose, onDone }: { open: boolean; onClose: () => void; onDone: (m: string) => void }) {
  const db = useDb();
  const [patient, setPatient] = useState<Row | null>(null); const [doctor, setDoctor] = useState(''); const [bed, setBed] = useState(''); const [type, setType] = useState('Planned'); const [reason, setReason] = useState(''); const [err, setErr] = useState('');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return setErr('Choose the patient');
    try { const a = admitPatient({ patientId: patient.id, bedId: bed, doctorId: doctor, diagnosis: reason, admissionType: type }); onDone(`${fullName(patient)} admitted to bed ${a.bedNumber}`); setPatient(null); setDoctor(''); setBed(''); setReason(''); setErr(''); onClose(); }
    catch (x) { setErr(errMsg(x)); }
  };
  return (
    <Modal isOpen={open} onClose={onClose} title="Admit patient" size="2xl">
      <form onSubmit={submit} noValidate className="space-y-4" data-testid="admit-form">
        <Field label="Patient" required half={false}><PatientSearchBox value={patient} onChange={setPatient} filter={(p) => !activeAdmission(db, p.id) && (p.status || 'Active') === 'Active'} placeholder="Search a registered patient (not already admitted)" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Admitting doctor" required><select value={doctor} onChange={(e) => setDoctor(e.target.value)} className={inputCls} data-testid="admit-doctor"><option value="">Select doctor</option>{doctorsOf(db).map((d) => <option key={d.id} value={d.id}>{d.name} - {deptName(db, d.departmentId)}</option>)}</select></Field>
          <Field label="Bed" required><BedSelect value={bed} onChange={setBed} /></Field>
          <Field label="Admission type"><select value={type} onChange={(e) => setType(e.target.value)} className={inputCls}>{['Planned', 'Emergency', 'Day care'].map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Reason for admission" required><input value={reason} onChange={(e) => setReason(e.target.value)} className={inputCls} data-testid="admit-reason" /></Field>
        </div>
        {err && <Alert kind="err">{err}</Alert>}
        <div className="flex justify-end gap-3"><button type="button" className={btnGhost} onClick={onClose}>Cancel</button><button type="submit" className={btnPrimary} data-testid="admit-submit">Admit and occupy bed</button></div>
      </form>
    </Modal>
  );
}

function TransferModal({ adm, onClose, onDone }: { adm: Row | null; onClose: () => void; onDone: (m: string) => void }) {
  const db = useDb();
  const [type, setType] = useState(TRANSFER_TYPES[0]); const [bed, setBed] = useState(''); const [dept, setDept] = useState(''); const [doctor, setDoctor] = useState(''); const [hospital, setHospital] = useState(''); const [reason, setReason] = useState(''); const [err, setErr] = useState('');
  if (!adm) return null;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    try { const t = transferPatient({ admissionId: adm.id, transferType: type, toBedId: bed, toDepartmentId: dept, toDoctorId: doctor, hospitalName: hospital, reason }); onDone(`${type}: ${t.fromText} to ${t.toText}`); setBed(''); setDept(''); setDoctor(''); setHospital(''); setReason(''); setErr(''); onClose(); }
    catch (x) { setErr(errMsg(x)); }
  };
  return (
    <Modal isOpen onClose={onClose} title={`Transfer ${fullName(patientOf(db, adm.patientId))}`} size="2xl">
      <form onSubmit={submit} noValidate className="space-y-4" data-testid="transfer-form">
        <p className="text-sm text-gray-400">Now: bed {adm.bedNumber} ({adm.wardName}), {deptName(db, adm.departmentId)}, {staffName(db, adm.doctorId)}</p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Type of transfer" required half={false}><select value={type} onChange={(e) => setType(e.target.value)} className={inputCls} data-testid="transfer-type">{TRANSFER_TYPES.map((x) => <option key={x}>{x}</option>)}</select></Field>
          {type === 'Bed transfer' && <Field label="New bed" required half={false}><BedSelect value={bed} onChange={setBed} exclude={adm.bedId} /></Field>}
          {type === 'Department transfer' && (<>
            <Field label="New department" required><select value={dept} onChange={(e) => { setDept(e.target.value); setDoctor(''); }} className={inputCls}><option value="">Select department</option>{db.departments.filter((d) => d.id !== adm.departmentId).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></Field>
            <Field label="Doctor of that department" required><select value={doctor} onChange={(e) => setDoctor(e.target.value)} className={inputCls}><option value="">Select doctor</option>{doctorsOf(db).filter((d) => d.departmentId === dept).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></Field>
          </>)}
          {type === 'Doctor change' && <Field label="New doctor" required half={false}><select value={doctor} onChange={(e) => setDoctor(e.target.value)} className={inputCls}><option value="">Select doctor</option>{doctorsOf(db).filter((d) => d.id !== adm.doctorId).map((d) => <option key={d.id} value={d.id}>{d.name} - {deptName(db, d.departmentId)}</option>)}</select></Field>}
          {type === 'Referral to another hospital' && <Field label="Referred to (hospital)" required half={false}><input value={hospital} onChange={(e) => setHospital(e.target.value)} className={inputCls} /></Field>}
          <Field label="Reason" required half={false}><input value={reason} onChange={(e) => setReason(e.target.value)} className={inputCls} data-testid="transfer-reason" /></Field>
        </div>
        {type === 'Referral to another hospital' && <Alert kind="warn">The patient leaves this hospital: the admission closes and the bed goes to cleaning.</Alert>}
        {err && <Alert kind="err">{err}</Alert>}
        <div className="flex justify-end gap-3"><button type="button" className={btnGhost} onClick={onClose}>Cancel</button><button type="submit" className={btnPrimary} data-testid="transfer-submit">Transfer patient</button></div>
      </form>
    </Modal>
  );
}

export default function PatientTransferPage() {
  const db = useDb();
  const mounted = useMounted();
  const [admitting, setAdmitting] = useState(false); const [transferring, setTransferring] = useState<Row | null>(null); const [msg, setMsg] = useState<{ k: 'ok' | 'err'; t: string } | null>(null);
  if (!mounted) return <div className="py-16 text-center text-sm text-gray-400">Loading...</div>;
  const admitted = db.admissions.filter((a) => a.status === 'Admitted').sort((a, b) => String(b.admittedAt).localeCompare(String(a.admittedAt)));
  const transfers = [...db.transfers].sort((a, b) => `${b.transferDate}${b.transferTime}`.localeCompare(`${a.transferDate}${a.transferTime}`));
  const free = freeBeds(db).length;

  const admittedTab = (
    <Panel title={`${admitted.length} admitted patient${admitted.length === 1 ? '' : 's'} · ${free} bed${free === 1 ? '' : 's'} free`} actions={<button type="button" className={btnPrimary} onClick={() => setAdmitting(true)} data-testid="admit-open"><BedDouble size={16} /> Admit patient</button>}>
      <Table head={['Patient', 'Bed', 'Department', 'Doctor', 'Admitted', 'Reason', '']} empty="Nobody is admitted. Use Admit patient.">
        {admitted.map((a) => (
          <Tr key={a.id}>
            <Td><Link className="text-blue-400 font-medium" href={`/front-office/profile/${a.patientId}`}>{fullName(patientOf(db, a.patientId))}</Link><span className="block text-xs text-gray-500">{patientOf(db, a.patientId)?.uhid}</span></Td>
            <Td>{a.bedNumber}<span className="block text-xs text-gray-500">{a.wardName}</span></Td><Td>{deptName(db, a.departmentId)}</Td><Td>{staffName(db, a.doctorId)}</Td><Td>{dateTimeOf(a.admittedAt)}</Td><Td>{a.diagnosis}</Td>
            <Td className="whitespace-nowrap"><SmallBtn onClick={() => setTransferring(a)}>Transfer</SmallBtn><Link href={`/front-office/discharge?admission=${a.id}`} className="px-2.5 py-1 rounded text-xs font-medium text-emerald-500 hover:bg-emerald-500/10">Discharge</Link></Td>
          </Tr>
        ))}
      </Table>
    </Panel>
  );
  const historyTab = (
    <Panel title={`${transfers.length} transfer${transfers.length === 1 ? '' : 's'}`}>
      <Table head={['Date', 'Patient', 'Type', 'From', 'To', 'Reason']} empty="No transfers yet.">
        {transfers.map((t) => <Tr key={t.id}><Td>{fmtDate(t.transferDate)} {t.transferTime}</Td><Td>{fullName(patientOf(db, t.patientId))}</Td><Td><Pill value="Upcoming" label={t.transferType} /></Td><Td>{t.fromText}</Td><Td>{t.toText}</Td><Td>{t.reason}</Td></Tr>)}
      </Table>
    </Panel>
  );
  void bedLabel;
  return (
    <div className="space-y-4">
      <PageHeader icon={ArrowLeftRight} step="Patient transfer" title="Patient Transfer" description="Admit a patient to a bed, then move them to another bed, department or doctor, or refer them to another hospital. Bed status updates by itself." />
      {msg && <Alert kind={msg.k}>{msg.t}</Alert>}
      <Tabs tabs={[{ id: 'admitted', label: `Admitted patients (${admitted.length})`, node: admittedTab }, { id: 'history', label: `Transfer history (${transfers.length})`, node: historyTab }]} />
      <AdmitModal open={admitting} onClose={() => setAdmitting(false)} onDone={(m) => setMsg({ k: 'ok', t: m })} />
      <TransferModal adm={transferring} onClose={() => setTransferring(null)} onDone={(m) => setMsg({ k: 'ok', t: m })} />
    </div>
  );
}
