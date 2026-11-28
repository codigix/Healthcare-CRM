"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useDb } from '@/data/db';
import { ageOf, fullName } from '@/data/receptionActions';
import { BLOOD_GROUPS, GENDERS, PATIENT_TYPES } from '@/data/lists';
import { fmtDate } from '@/data/actions';
import { PageHeader, Panel, useMounted } from '@/features/admin/ui';
import { Table, Td, Tr, Pill, inputCls } from '@/features/reception/parts';

export default function PatientSearchPage() {
  const db = useDb();
  const mounted = useMounted();
  const [q, setQ] = useState(''); const [gender, setGender] = useState(''); const [blood, setBlood] = useState(''); const [type, setType] = useState(''); const [status, setStatus] = useState(''); const [ins, setIns] = useState('');
  const results = useMemo(() => {
    const t = q.trim().toLowerCase(); const d = t.replace(/\D/g, '');
    return db.patients.filter((p) =>
      (!t || `${fullName(p)} ${p.uhid} ${p.mrn} ${p.email} ${p.idProofNumber}`.toLowerCase().includes(t) || (d.length >= 3 && String(p.phone).includes(d))) &&
      (!gender || p.gender === gender) && (!blood || p.bloodGroup === blood) && (!type || p.patientType === type) && (!status || (p.status || 'Active') === status) && (!ins || p.hasInsurance === ins))
      .sort((a, b) => String(b.registeredAt).localeCompare(String(a.registeredAt)));
  }, [db.patients, q, gender, blood, type, status, ins]);
  if (!mounted) return <div className="py-16 text-center text-sm text-gray-400">Loading...</div>;
  const sel = (v: string, set: (x: string) => void, label: string, list: string[]) => <select value={v} onChange={(e) => set(e.target.value)} className={`${inputCls} !w-auto`}><option value="">All {label}</option>{list.map((o) => <option key={o} value={o}>{o}</option>)}</select>;
  return (
    <div className="space-y-6">
      <PageHeader icon={Search} step="Step 2 · Check existing / new patient" title="Patient Search" description="Find a patient by name, UHID, MRN, mobile number, email or ID number before registering a new one." />
      <Panel title="Search">
        <div className="space-y-3">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input autoFocus data-testid="search-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type a name, UHID, MRN or mobile number" className={`${inputCls} pl-9`} /></div>
          <div className="flex flex-wrap gap-3">{sel(gender, setGender, 'genders', GENDERS)}{sel(blood, setBlood, 'blood groups', BLOOD_GROUPS)}{sel(type, setType, 'patient types', PATIENT_TYPES)}{sel(status, setStatus, 'statuses', ['Active', 'Inactive'])}{sel(ins, setIns, 'insurance', ['Yes', 'No'])}</div>
        </div>
      </Panel>
      <Panel title={`${results.length} patient${results.length === 1 ? '' : 's'} found`} actions={<Link href="/front-office/registration" className="text-xs text-blue-400">Not found? Register a new patient</Link>}>
        <Table head={['UHID', 'Patient', 'Age / sex', 'Mobile', 'Blood', 'Type', 'Registered', 'Status', '']} empty="No patient matches. Check the spelling or register a new patient.">
          {results.map((p) => (
            <Tr key={p.id}>
              <Td><b>{p.uhid}</b></Td><Td>{fullName(p)}{p.isVip === 'Yes' && <span className="ml-2 text-xs text-amber-500">VIP</span>}</Td><Td>{ageOf(p.dob)} / {p.gender}</Td><Td>{p.phone}</Td><Td>{p.bloodGroup || '-'}</Td><Td>{p.patientType}</Td><Td>{fmtDate(p.registeredAt)}</Td>
              <Td><Pill value={p.status || 'Active'} /></Td>
              <Td className="whitespace-nowrap"><Link className="text-blue-400 text-xs mr-3" href={`/front-office/profile/${p.id}`}>Profile</Link><Link className="text-emerald-500 text-xs" href={`/front-office/appointments?patient=${p.id}`}>Book appointment</Link></Td>
            </Tr>
          ))}
        </Table>
      </Panel>
    </div>
  );
}
