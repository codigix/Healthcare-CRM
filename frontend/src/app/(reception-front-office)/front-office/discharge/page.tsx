"use client";

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useDb } from '@/data/db';
import { dateTimeOf, deptName, fullName, markBedReady, minutesSince, patientOf, registerDischarge, staffName } from '@/data/receptionActions';
import { addDays, todayStr } from '@/data/slots';
import { DISCHARGE_TYPES } from '@/data/lists';
import { fmtDate } from '@/data/actions';
import { PageHeader, Panel, Tabs, useMounted } from '@/features/admin/ui';
import { Alert, Field, Pill, SmallBtn, Table, Td, Tr, btnPrimary, errMsg, inputCls } from '@/features/reception/parts';

const CONDITIONS = ['Recovered', 'Improved', 'Stable', 'Critical', 'Deceased'];

function Register({ preselect, onDone }: { preselect: string; onDone: (m: string) => void }) {
  const db = useDb();
  const admitted = db.admissions.filter((a) => a.status === 'Admitted');
  const [id, setId] = useState(admitted.some((a) => a.id === preselect) ? preselect : '');
  const [type, setType] = useState(DISCHARGE_TYPES[0]); const [cond, setCond] = useState(''); const [bill, setBill] = useState(''); const [note, setNote] = useState(''); const [follow, setFollow] = useState(''); const [err, setErr] = useState('');
  const adm = admitted.find((a) => a.id === id);
  const days = adm ? Math.max(1, Math.ceil(minutesSince(adm.admittedAt) / 1440)) : 0;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adm) return setErr('Choose the admitted patient');
    try { const r = registerDischarge({ admissionId: adm.id, dischargeType: type, condition: cond, billStatus: bill, summaryNote: note, followUpDate: follow }); onDone(`${fullName(patientOf(db, adm.patientId))} discharged. Bed ${r.bedNumber} is now being cleaned.`); setId(''); setCond(''); setBill(''); setNote(''); setFollow(''); setErr(''); }
    catch (x) { setErr(errMsg(x)); }
  };
  return (
    <form onSubmit={submit} noValidate className="space-y-6" data-testid="discharge-form">
      <Panel title="1. Admitted patient">
        <Field label="Patient" required half={false}><select value={id} onChange={(e) => setId(e.target.value)} className={inputCls} data-testid="discharge-patient"><option value="">Select an admitted patient</option>{admitted.map((a) => <option key={a.id} value={a.id}>{fullName(patientOf(db, a.patientId))} · {patientOf(db, a.patientId)?.uhid} · bed {a.bedNumber}</option>)}</select></Field>
        {adm && <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm" data-testid="discharge-summary">
          <div><dt className="text-gray-400 text-xs">Bed</dt><dd>{adm.bedNumber} ({adm.wardName})</dd></div><div><dt className="text-gray-400 text-xs">Doctor</dt><dd>{staffName(db, adm.doctorId)}</dd></div>
          <div><dt className="text-gray-400 text-xs">Admitted</dt><dd>{dateTimeOf(adm.admittedAt)}</dd></div><div><dt className="text-gray-400 text-xs">Stay</dt><dd>{days} day{days === 1 ? '' : 's'}</dd></div>
          <div className="col-span-2 md:col-span-4"><dt className="text-gray-400 text-xs">Reason for admission</dt><dd>{adm.diagnosis}</dd></div></dl>}
        {admitted.length === 0 && <div className="mt-3"><Alert kind="info">Nobody is admitted right now.</Alert></div>}
      </Panel>
      <Panel title="2. Discharge details">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Type of discharge" required><select value={type} onChange={(e) => setType(e.target.value)} className={inputCls} data-testid="discharge-type">{DISCHARGE_TYPES.map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Condition at discharge" required><select value={cond} onChange={(e) => setCond(e.target.value)} className={inputCls} data-testid="discharge-condition"><option value="">Select</option>{CONDITIONS.map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Bill status" required help="A normal discharge needs the bill cleared."><select value={bill} onChange={(e) => setBill(e.target.value)} className={inputCls} data-testid="discharge-bill"><option value="">Select</option><option>Cleared</option><option>Pending</option></select></Field>
          <Field label="Follow-up date" help="Optional. Must be after today."><input type="date" min={addDays(todayStr(), 1)} value={follow} onChange={(e) => setFollow(e.target.value)} className={inputCls} /></Field>
          <Field label="Summary note" half={false}><textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} className={inputCls} placeholder="Short note for the discharge file (the doctor's summary is written in the clinical module)" /></Field>
        </div>
      </Panel>
      {err && <Alert kind="err">{err}</Alert>}
      <div className="flex justify-end"><button type="submit" className={btnPrimary} data-testid="discharge-submit">Register discharge</button></div>
    </form>
  );
}

function Inner() {
  const db = useDb();
  const mounted = useMounted();
  const pre = useSearchParams().get('admission') || '';
  const [msg, setMsg] = useState<{ k: 'ok' | 'err'; t: string } | null>(null);
  if (!mounted) return <div className="py-16 text-center text-sm text-gray-400">Loading...</div>;
  const regs = [...db.dischargeRegs].sort((a, b) => `${b.dischargeDate}${b.dischargeTime}`.localeCompare(`${a.dischargeDate}${a.dischargeTime}`));
  const cleaning = db.beds.filter((b) => b.status === 'Cleaning');
  const ward = (bedId: string) => db.wards.find((w) => w.id === db.rooms.find((r) => r.id === db.beds.find((b) => b.id === bedId)?.roomId)?.wardId)?.name || '';
  return (
    <div className="space-y-4">
      <PageHeader icon={LogOut} step="Patient discharge registration" title="Patient Discharge Registration" description="Register the discharge of an admitted patient. The bed goes to cleaning and the patient returns to OPD status." />
      {msg && <Alert kind={msg.k}>{msg.t}</Alert>}
      <Tabs tabs={[
        { id: 'register', label: 'Register discharge', node: <Register preselect={pre} onDone={(m) => setMsg({ k: 'ok', t: m })} /> },
        { id: 'register-list', label: `Discharge register (${regs.length})`, node: (
          <Panel title="Discharges"><Table head={['Date', 'Patient', 'Bed', 'Type', 'Condition', 'Bill', 'Follow-up']} empty="No discharge registered yet.">
            {regs.map((r) => <Tr key={r.id}><Td>{fmtDate(r.dischargeDate)} {r.dischargeTime}</Td><Td><Link className="text-blue-400" href={`/front-office/profile/${r.patientId}`}>{fullName(patientOf(db, r.patientId))}</Link></Td><Td>{r.bedNumber}</Td><Td>{r.dischargeType}</Td><Td>{r.condition}</Td><Td><Pill value={r.billStatus} /></Td><Td>{fmtDate(r.followUpDate)}</Td></Tr>)}
          </Table></Panel>) },
        { id: 'clean', label: `Beds to clean (${cleaning.length})`, node: (
          <Panel title="Beds waiting to be cleaned"><Table head={['Bed', 'Ward', '']} empty="No bed is waiting to be cleaned.">
            {cleaning.map((b) => <Tr key={b.id}><Td><b>{b.bedNumber}</b></Td><Td>{ward(b.id)}</Td><Td><SmallBtn tone="green" onClick={() => { try { markBedReady(b.id); setMsg({ k: 'ok', t: `Bed ${b.bedNumber} is ready for the next patient` }); } catch (e) { setMsg({ k: 'err', t: errMsg(e) }); } }}>Mark ready</SmallBtn></Td></Tr>)}
          </Table></Panel>) },
      ]} />
    </div>
  );
}
export default function DischargeRegistrationPage() { return <Suspense fallback={<div className="py-16 text-center text-sm text-gray-400">Loading...</div>}><Inner /></Suspense>; }
