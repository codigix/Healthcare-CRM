"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FileText } from 'lucide-react';
import AdminCrud, { type AdminCrudProps } from '@/features/admin/AdminCrud';
import { update, DbError } from '@/data/db';
import { fullName } from '@/data/receptionActions';
import { DOC_TYPES } from '@/data/lists';
import { fmtDate } from '@/data/actions';
import { PageHeader } from '@/features/admin/ui';
import { Alert, Pill, SmallBtn } from '@/features/reception/parts';

const patientOpt = { col: 'patients' as const, label: (r: any) => `${fullName(r)} (${r.uhid})` };
const patientCol = (r: any, db: any) => { const p = db.patients.find((x: any) => x.id === r.patientId); return p ? `${fullName(p)} (${p.uhid})` : ''; };

const def: Pick<AdminCrudProps, 'columns' | 'fields' | 'stats' | 'filters'> = {
  columns: [
    { header: 'Patient', value: patientCol }, { header: 'Type', key: 'docType' }, { header: 'Title', key: 'title' }, { header: 'File', key: 'fileName' },
    { header: 'Size', value: (r) => (r.fileSize ? `${Math.max(1, Math.round(Number(r.fileSize) / 1024))} KB` : '') }, { header: 'Added', value: (r) => fmtDate(r.createdAt) },
    { header: 'Verified', key: 'verified', render: (r) => <Pill value={r.verified === 'Yes' ? 'Cleared' : 'Pending'} label={r.verified === 'Yes' ? 'Verified' : 'Not verified'} /> },
  ],
  fields: [
    { name: 'patientId', label: 'Patient', type: 'select', required: true, from: patientOpt, lockOnEdit: true },
    { name: 'docType', label: 'Document type', type: 'select', options: DOC_TYPES, required: true, half: true }, { name: 'title', label: 'Title', required: true, half: true, placeholder: 'e.g. Aadhaar card' },
    { name: 'fileName', label: 'File', type: 'file', required: true, help: 'Up to 5 MB. This version of the module keeps the file name and size only, not the file itself.' },
    { name: 'verified', label: 'Verified by reception', type: 'select', options: ['No', 'Yes'], half: true }, { name: 'notes', label: 'Notes', type: 'textarea' },
  ],
  stats: [
    { label: 'Documents', value: (r) => r.length, color: 'text-blue-400' }, { label: 'Patients with documents', value: (r) => new Set(r.map((x) => x.patientId)).size, color: 'text-emerald-400' },
    { label: 'Verified', value: (r) => r.filter((x) => x.verified === 'Yes').length, color: 'text-indigo-400' }, { label: 'Not verified', value: (r) => r.filter((x) => x.verified !== 'Yes').length, color: 'text-amber-400' },
  ],
  filters: [
    { label: 'patients', options: (db) => db.patients.map((p) => ({ value: p.id, label: `${fullName(p)} (${p.uhid})` })), match: (r, v) => r.patientId === v },
    { label: 'types', options: DOC_TYPES, match: (r, v) => r.docType === v },
  ],
};

function Inner() {
  const patient = useSearchParams().get('patient') || '';
  return (
    <div className="space-y-4">
      <PageHeader icon={FileText} step="Patient documents" title="Patient Documents" description="ID proofs, insurance cards, referral letters and consent forms collected at the desk." />
      {patient && <Alert kind="info">Showing the documents of one patient. Clear the patient filter to see everyone's.</Alert>}
      <AdminCrud embedded collection="patientDocuments" title="Documents" singular="Document" icon={FileText} {...def} addLabel="Add document" initialFilters={patient ? { 0: patient } : undefined}
        defaults={() => ({ patientId: patient, verified: 'No', docType: 'ID proof' })} description="Choose a file, say what it is, and mark it verified once the original has been seen."
        rowActions={(r, _db, notify) => (r.verified === 'Yes' ? null : <SmallBtn tone="green" onClick={() => { try { update('patientDocuments', r.id, { verified: 'Yes' }); notify('ok', 'Document marked as verified'); } catch (e) { notify('err', e instanceof DbError ? e.message : 'Could not update'); } }}>Verify</SmallBtn>)} />
    </div>
  );
}
export default function PatientDocumentsPage() { return <Suspense fallback={<div className="py-16 text-center text-sm text-gray-400">Loading...</div>}><Inner /></Suspense>; }
