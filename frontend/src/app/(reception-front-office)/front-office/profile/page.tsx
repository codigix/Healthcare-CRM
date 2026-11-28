"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';
import { useDb, type Row } from '@/data/db';
import { ageOf, fullName } from '@/data/receptionActions';
import { fmtDate } from '@/data/actions';
import { PageHeader, Panel, useMounted } from '@/features/admin/ui';
import { PatientSearchBox, Pill, Table, Td, Tr } from '@/features/reception/parts';
import Link from 'next/link';

export default function PatientProfilePicker() {
  const db = useDb();
  const mounted = useMounted();
  const router = useRouter();
  const [sel, setSel] = useState<Row | null>(null);
  if (!mounted) return <div className="py-16 text-center text-sm text-gray-400">Loading...</div>;
  const recent = [...db.patients].sort((a, b) => String(b.registeredAt).localeCompare(String(a.registeredAt))).slice(0, 10);
  return (
    <div className="space-y-6">
      <PageHeader icon={FileText} step="Step 5 · Create patient profile" title="Patient Profile" description="Open a patient's profile: details, visits, documents, admissions and feedback in one place." />
      <Panel title="Find a patient"><PatientSearchBox value={sel} onChange={(p) => { setSel(p); if (p) router.push(`/front-office/profile/${p.id}`); }} /></Panel>
      <Panel title="Recently registered">
        <Table head={['UHID', 'Patient', 'Age / sex', 'Mobile', 'Registered', 'Status']} empty="No patients yet.">
          {recent.map((p) => <Tr key={p.id}><Td><Link href={`/front-office/profile/${p.id}`} className="text-blue-400 font-medium">{p.uhid}</Link></Td><Td>{fullName(p)}</Td><Td>{ageOf(p.dob)} / {p.gender}</Td><Td>{p.phone}</Td><Td>{fmtDate(p.registeredAt)}</Td><Td><Pill value={p.status || 'Active'} /></Td></Tr>)}
        </Table>
      </Panel>
    </div>
  );
}
