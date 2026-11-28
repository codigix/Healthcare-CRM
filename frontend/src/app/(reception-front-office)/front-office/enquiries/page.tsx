"use client";

import Link from 'next/link';
import { MessageSquare, UserPlus, XCircle } from 'lucide-react';
import AdminCrud, { type AdminCrudProps } from '@/features/admin/AdminCrud';
import { update, DbError } from '@/data/db';
import { ENQUIRY_SOURCES, ENQUIRY_STATUS, ENQUIRY_TYPES } from '@/data/lists';
import { fmtDate } from '@/data/actions';
import { PageHeader } from '@/features/admin/ui';
import { Pill, SmallBtn } from '@/features/reception/parts';

const def: Pick<AdminCrudProps, 'columns' | 'fields' | 'stats' | 'filters' | 'defaults'> = {
  columns: [
    { header: 'Received', value: (r) => fmtDate(r.createdAt) }, { header: 'Caller', key: 'name' }, { header: 'Phone', key: 'phone' }, { header: 'About', key: 'enquiryType' }, { header: 'Source', key: 'source' },
    { header: 'Message', key: 'message' }, { header: 'Status', key: 'status', render: (r) => <Pill value={r.status} /> },
    { header: 'Patient', value: (r, db) => db.patients.find((p) => p.id === r.patientId)?.uhid || '' },
  ],
  fields: [
    { name: 'name', label: 'Caller name', required: true, half: true }, { name: 'phone', label: 'Phone', type: 'tel', required: true, half: true, help: '10 digit mobile number' },
    { name: 'enquiryType', label: 'Enquiry about', type: 'select', options: ENQUIRY_TYPES, required: true, half: true }, { name: 'source', label: 'How did they reach us', type: 'select', options: ENQUIRY_SOURCES, required: true, half: true },
    { name: 'message', label: 'What did they ask', type: 'textarea' }, { name: 'status', label: 'Status', type: 'select', options: ENQUIRY_STATUS, required: true, half: true },
    { name: 'handledBy', label: 'Handled by', half: true },
  ],
  stats: [
    { label: 'Enquiries', value: (r) => r.length, color: 'text-blue-400' }, { label: 'New', value: (r) => r.filter((x) => x.status === 'New').length, color: 'text-amber-400' },
    { label: 'In progress', value: (r) => r.filter((x) => x.status === 'In progress').length, color: 'text-indigo-400' }, { label: 'Converted to patients', value: (r) => r.filter((x) => x.status === 'Converted').length, color: 'text-emerald-400' },
  ],
  filters: [{ label: 'statuses', options: ENQUIRY_STATUS, match: (r, v) => r.status === v }, { label: 'types', options: ENQUIRY_TYPES, match: (r, v) => r.enquiryType === v }],
  defaults: () => ({ status: 'New', source: 'Phone', enquiryType: 'Appointment' }),
};

export default function PatientEnquiryPage() {
  return (
    <div className="space-y-4">
      <PageHeader icon={MessageSquare} step="Step 1 · Patient Enquiry" title="Patient Enquiry" description="Record every call and walk-in question. When the caller wants to be seen, register them straight from the enquiry." />
      <AdminCrud embedded collection="enquiries" title="Enquiries" singular="Enquiry" icon={MessageSquare} {...def} addLabel="New enquiry" description="Newest enquiries are kept in the list; filter by status to see what still needs a reply."
        rowActions={(r, _db, notify) => (
          <>
            {r.status !== 'Converted' && r.status !== 'Closed' && <Link href={`/front-office/registration?enquiry=${r.id}`} className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-emerald-500 hover:bg-emerald-500/10"><UserPlus size={13} /> Register</Link>}
            {r.status === 'New' && <SmallBtn onClick={() => { try { update('enquiries', r.id, { status: 'In progress' }); } catch (e) { notify('err', e instanceof DbError ? e.message : 'Could not update'); } }}>Start</SmallBtn>}
            {(r.status === 'New' || r.status === 'In progress') && <SmallBtn tone="gray" title="Close without registering" onClick={() => { try { update('enquiries', r.id, { status: 'Closed' }); notify('ok', 'Enquiry closed'); } catch (e) { notify('err', e instanceof DbError ? e.message : 'Could not update'); } }}><XCircle size={13} className="inline mr-1" />Close</SmallBtn>}
          </>
        )} />
    </div>
  );
}
