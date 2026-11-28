"use client";

import React, { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, UserPlus } from 'lucide-react';
import { useDb, DbError, type Row } from '@/data/db';
import { convertEnquiry, findDuplicates, fullName, previewMrn, previewUhid, registerPatient } from '@/data/receptionActions';
import { PageHeader, Panel, useMounted } from '@/features/admin/ui';
import PatientForm, { emptyPatient } from '@/features/reception/PatientForm';
import { Alert, btnGhost, btnPrimary } from '@/features/reception/parts';

function RegistrationInner() {
  const db = useDb();
  const mounted = useMounted();
  const enquiryId = useSearchParams().get('enquiry') || '';
  const enquiry = db.enquiries.find((e) => e.id === enquiryId);
  const [values, setValues] = useState<Record<string, any>>({});
  const [confirmDifferent, setConfirmDifferent] = useState(false);
  const [done, setDone] = useState<Row | null>(null);
  const [formKey, setFormKey] = useState(0);

  const dups = useMemo(() => findDuplicates(db, values), [db, values]);
  const initial = useMemo(() => {
    const base: Record<string, any> = { ...emptyPatient() };
    if (enquiry) { const parts = String(enquiry.name).trim().split(/\s+/); base.firstName = parts[0] || ''; base.lastName = parts.slice(1).join(' '); base.phone = enquiry.phone; base.registrationType = 'Walk-in'; }
    return base;
  }, [enquiry?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!mounted) return <div className="py-16 text-center text-sm text-gray-400">Loading...</div>;

  if (done) {
    return (
      <div className="space-y-6">
        <PageHeader icon={UserPlus} step="Step 3 · Patient Registration" title="Patient registered" description="The patient now has a unique UHID and a profile." />
        <Panel title="Registration complete">
          <div className="flex flex-col items-center text-center gap-3 py-4" data-testid="registration-done">
            <CheckCircle2 className="text-emerald-500" size={40} />
            <p className="text-lg font-semibold text-white">{fullName(done)}</p>
            <div className="flex gap-8"><div><p className="text-xs text-gray-400">UHID</p><p className="text-2xl font-bold text-blue-500" data-testid="new-uhid">{done.uhid}</p></div><div><p className="text-xs text-gray-400">MRN</p><p className="text-2xl font-bold text-blue-500">{done.mrn}</p></div></div>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link href={`/front-office/appointments?patient=${done.id}`} className={btnPrimary}>Book appointment</Link>
              <Link href={`/front-office/profile/${done.id}`} className={btnGhost}>Open profile</Link>
              <Link href={`/front-office/documents?patient=${done.id}`} className={btnGhost}>Add documents</Link>
              <button type="button" className={btnGhost} onClick={() => { setDone(null); setValues({}); setConfirmDifferent(false); setFormKey((k) => k + 1); }}>Register another</button>
            </div>
          </div>
        </Panel>
      </div>
    );
  }

  const onSubmit = (v: Record<string, any>) => {
    const phoneMatches = findDuplicates(db, { phone: v.phone });
    if (phoneMatches.length && !confirmDifferent) return `A patient with this mobile number is already registered (${phoneMatches.map((p) => `${fullName(p)}, ${p.uhid}`).join('; ')}). If this is a different person, for example a family member, tick the box above and save again.`;
    try {
      const p = registerPatient(v);
      if (enquiry) convertEnquiry(enquiry.id, p.id);
      setDone(p);
    } catch (e) { return e instanceof DbError ? e.message : 'Could not register the patient'; }
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={UserPlus} step="Step 3 · Patient Registration" title="Patient Registration" description="Register a new patient. The system issues the UHID and MRN when you save." />
      <Alert kind="info">Search first: <Link href="/front-office/search" className="underline font-medium">check whether the patient is already registered</Link>. Existing patients are not registered again. Next UHID: <b data-testid="next-uhid">{previewUhid(db)}</b>, next MRN: <b>{previewMrn(db)}</b>.</Alert>
      {enquiry && <Alert kind="ok">Registering from enquiry of <b>{enquiry.name}</b> ({enquiry.phone}). The enquiry will be marked Converted.</Alert>}
      {dups.length > 0 && (
        <div className="space-y-2" data-testid="duplicate-warning">
          <Alert kind="warn">
            <p className="font-medium mb-1">Possible existing patient{dups.length > 1 ? 's' : ''}:</p>
            <ul className="space-y-1">{dups.map((p) => <li key={p.id}>{fullName(p)} · {p.uhid} · {p.phone} · <Link className="underline" href={`/front-office/profile/${p.id}`}>Open profile</Link> · <Link className="underline" href={`/front-office/appointments?patient=${p.id}`}>Book appointment</Link></li>)}</ul>
            <label className="flex items-center gap-2 mt-2"><input type="checkbox" checked={confirmDifferent} onChange={(e) => setConfirmDifferent(e.target.checked)} data-testid="confirm-different" /> This is a different person (for example a family member sharing the mobile number)</label>
          </Alert>
        </div>
      )}
      <PatientForm key={`${formKey}-${enquiry?.id || ''}`} initial={initial} submitLabel="Register patient and generate UHID" onSubmit={onSubmit} onValues={setValues} />
    </div>
  );
}

export default function PatientRegistrationPage() {
  return <Suspense fallback={<div className="py-16 text-center text-sm text-gray-400">Loading...</div>}><RegistrationInner /></Suspense>;
}
