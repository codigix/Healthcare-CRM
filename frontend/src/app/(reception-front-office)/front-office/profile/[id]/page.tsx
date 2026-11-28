"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Pencil, Trash2, CalendarCheck, Star } from 'lucide-react';
import Modal from '@/components/UI/Modal';
import { useDb, update, remove, DbError } from '@/data/db';
import { ageOf, dateTimeOf, deptName, fullName, staffName, tokenLabel, activeAdmission } from '@/data/receptionActions';
import { fmtDate } from '@/data/actions';
import { PageHeader, Panel, Tabs, useMounted } from '@/features/admin/ui';
import PatientForm from '@/features/reception/PatientForm';
import { Alert, Pill, SmallBtn, Table, Td, Tr, btnGhost, btnPrimary } from '@/features/reception/parts';

const Row2 = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="flex justify-between gap-4 py-1.5 border-b border-gray-800/60 last:border-0"><span className="text-sm text-gray-400">{label}</span><span className="text-sm text-gray-100 text-right">{value || '-'}</span></div>
);

export default function PatientProfilePage() {
  const { id } = useParams<{ id: string }>();
  const db = useDb();
  const mounted = useMounted();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState<{ k: 'ok' | 'err'; t: string } | null>(null);
  const p = db.patients.find((x) => x.id === id);
  if (!mounted) return <div className="py-16 text-center text-sm text-gray-400">Loading...</div>;
  if (!p) return <div className="space-y-4"><Alert kind="err">This patient was not found. The record may have been deleted.</Alert><Link href="/front-office/search" className={btnGhost}>Back to patient search</Link></div>;

  const visits = db.appointments.filter((a) => a.patientId === p.id).sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));
  const docs = db.patientDocuments.filter((d) => d.patientId === p.id);
  const adms = db.admissions.filter((a) => a.patientId === p.id).sort((a, b) => String(b.admittedAt).localeCompare(String(a.admittedAt)));
  const fbs = db.feedback.filter((f) => f.patientId === p.id);
  const adm = activeAdmission(db, p.id);
  const inactive = (p.status || 'Active') === 'Inactive';

  const toggleStatus = () => { try { update('patients', p.id, { status: inactive ? 'Active' : 'Inactive' }); setMsg({ k: 'ok', t: `Patient marked ${inactive ? 'Active' : 'Inactive'}` }); } catch (e) { setMsg({ k: 'err', t: e instanceof DbError ? e.message : 'Could not update' }); } };
  const del = () => {
    if (!window.confirm(`Delete the record of ${fullName(p)} (${p.uhid})? This cannot be undone.`)) return;
    try { remove('patients', p.id); router.push('/front-office/search'); } catch (e) { setMsg({ k: 'err', t: e instanceof DbError ? e.message : 'Could not delete' }); }
  };
  const save = (v: Record<string, any>) => { try { update('patients', p.id, v); setEditing(false); setMsg({ k: 'ok', t: 'Profile updated' }); } catch (e) { return e instanceof DbError ? e.message : 'Could not save'; } };

  const overview = (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Panel title="Personal">
        <Row2 label="Full name" value={fullName(p)} /><Row2 label="Gender" value={p.gender} /><Row2 label="Date of birth" value={`${fmtDate(p.dob)} (${ageOf(p.dob)})`} /><Row2 label="Blood group" value={p.bloodGroup} /><Row2 label="Marital status" value={p.maritalStatus} />
        <Row2 label="Religion" value={p.religion} /><Row2 label="Language" value={p.language} /><Row2 label="Occupation" value={p.occupation} />
      </Panel>
      <Panel title="Contact and address">
        <Row2 label="Mobile" value={p.phone} /><Row2 label="Alternate mobile" value={p.altPhone} /><Row2 label="Email" value={p.email} /><Row2 label="Address" value={[p.address, p.city, p.state, p.pincode].filter(Boolean).join(', ')} />
        <Row2 label="Emergency contact" value={p.emergencyName ? `${p.emergencyName} (${p.emergencyRelation || 'contact'}), ${p.emergencyPhone || ''}` : ''} />
      </Panel>
      <Panel title="Identification and registration">
        <Row2 label="UHID" value={p.uhid} /><Row2 label="MRN" value={p.mrn} /><Row2 label="ID proof" value={p.idProofType ? `${p.idProofType}: ${p.idProofNumber}` : ''} /><Row2 label="Registered on" value={dateTimeOf(p.registeredAt)} />
        <Row2 label="Registration type" value={p.registrationType} /><Row2 label="Referred by" value={p.referredBy} />
      </Panel>
      <Panel title="Insurance and notes">
        <Row2 label="Insurance" value={p.hasInsurance === 'Yes' ? `${p.insuranceProvider}, policy ${p.policyNumber}${p.policyValidTill ? `, valid till ${fmtDate(p.policyValidTill)}` : ''}` : 'No insurance'} /><Row2 label="Notes" value={p.notes} />
      </Panel>
    </div>
  );
  const visitsTab = (
    <Panel title={`${visits.length} visit${visits.length === 1 ? '' : 's'}`} actions={<Link href={`/front-office/appointments?patient=${p.id}`} className="text-xs text-blue-400">Book appointment</Link>}>
      <Table head={['Date', 'Time', 'Token', 'Doctor', 'Department', 'Type', 'Status']} empty="No visits yet.">
        {visits.map((a) => <Tr key={a.id}><Td>{fmtDate(a.date)}</Td><Td>{a.time}</Td><Td>{tokenLabel(a.tokenNo)}</Td><Td>{staffName(db, a.doctorId)}</Td><Td>{deptName(db, a.departmentId)}</Td><Td>{a.visitType}</Td><Td><Pill value={a.status} /></Td></Tr>)}
      </Table>
    </Panel>
  );
  const docsTab = (
    <Panel title={`${docs.length} document${docs.length === 1 ? '' : 's'}`} actions={<Link href={`/front-office/documents?patient=${p.id}`} className="text-xs text-blue-400">Manage documents</Link>}>
      <Table head={['Type', 'Title', 'File', 'Verified']} empty="No documents uploaded.">{docs.map((d) => <Tr key={d.id}><Td>{d.docType}</Td><Td>{d.title}</Td><Td>{d.fileName}</Td><Td>{d.verified || 'No'}</Td></Tr>)}</Table>
    </Panel>
  );
  const admTab = (
    <Panel title={`${adms.length} admission${adms.length === 1 ? '' : 's'}`} actions={<Link href="/front-office/transfers" className="text-xs text-blue-400">Admit / transfer</Link>}>
      <Table head={['Admitted', 'Bed', 'Doctor', 'Reason', 'Status', 'Left']} empty="Never admitted.">
        {adms.map((a) => <Tr key={a.id}><Td>{dateTimeOf(a.admittedAt)}</Td><Td>{a.bedNumber} {a.wardName && `(${a.wardName})`}</Td><Td>{staffName(db, a.doctorId)}</Td><Td>{a.diagnosis}</Td><Td><Pill value={a.status} /></Td><Td>{dateTimeOf(a.dischargedAt)}</Td></Tr>)}
      </Table>
    </Panel>
  );
  const fbTab = (
    <Panel title={`${fbs.length} feedback`} actions={<Link href="/front-office/follow-up" className="text-xs text-blue-400">Add feedback</Link>}>
      <Table head={['Category', 'Rating', 'Comments']} empty="No feedback yet.">{fbs.map((f) => <Tr key={f.id}><Td>{f.category}</Td><Td><span className="text-amber-400"><Star size={13} className="inline -mt-0.5" /> {f.rating}/5</span></Td><Td>{f.comments}</Td></Tr>)}</Table>
    </Panel>
  );

  return (
    <div className="space-y-6">
      <PageHeader icon={Pencil} step="Step 5 · Create patient profile" title={fullName(p)} description={`${p.uhid} · MRN ${p.mrn} · ${ageOf(p.dob)} / ${p.gender}${p.bloodGroup ? ` · ${p.bloodGroup}` : ''} · ${p.phone}`} />
      <div className="flex flex-wrap items-center gap-3">
        <Pill value={p.status || 'Active'} /><span className="text-xs text-gray-400">{p.patientType}{p.isVip === 'Yes' ? ' · VIP' : ''}</span>
        {adm && <Alert kind="info">Admitted in {adm.wardName}, bed {adm.bedNumber} under {staffName(db, adm.doctorId)}</Alert>}
        <div className="ml-auto flex flex-wrap gap-2">
          <Link href={`/front-office/appointments?patient=${p.id}`} className={btnPrimary} data-testid="profile-book"><CalendarCheck size={16} /> Book appointment</Link>
          <button type="button" onClick={() => setEditing(true)} className={btnGhost} data-testid="profile-edit"><Pencil size={16} /> Edit</button>
          <button type="button" onClick={toggleStatus} className={btnGhost}>{inactive ? 'Mark Active' : 'Mark Inactive'}</button>
          <button type="button" onClick={del} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-500 hover:bg-red-500/20" data-testid="profile-delete"><Trash2 size={16} /> Delete</button>
        </div>
      </div>
      {msg && <Alert kind={msg.k}>{msg.t}</Alert>}
      <Tabs tabs={[{ id: 'overview', label: 'Overview', node: overview }, { id: 'visits', label: `Visits (${visits.length})`, node: visitsTab }, { id: 'docs', label: `Documents (${docs.length})`, node: docsTab }, { id: 'adm', label: `Admissions (${adms.length})`, node: admTab }, { id: 'fb', label: `Feedback (${fbs.length})`, node: fbTab }]} />
      <Modal isOpen={editing} onClose={() => setEditing(false)} title={`Edit ${fullName(p)}`} size="5xl">
        <PatientForm initial={p} submitLabel="Save changes" onSubmit={save} onCancel={() => setEditing(false)} />
      </Modal>
    </div>
  );
}
void SmallBtn;
