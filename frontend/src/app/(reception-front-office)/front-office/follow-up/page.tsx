"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { HeartHandshake } from 'lucide-react';
import AdminCrud, { type AdminCrudProps } from '@/features/admin/AdminCrud';
import { useDb } from '@/data/db';
import { deptName, followUps, fullName, patientOf, staffName, tokenLabel, type FollowUpState } from '@/data/receptionActions';
import { FEEDBACK_CATEGORIES } from '@/data/lists';
import { fmtDate } from '@/data/actions';
import { PageHeader, Panel, Tabs, Tile, useMounted } from '@/features/admin/ui';
import { Pill, Table, Td, Tr, inputCls } from '@/features/reception/parts';

const stars = (n: unknown) => '★'.repeat(Number(n) || 0) + '☆'.repeat(5 - (Number(n) || 0));
const fbDef: Pick<AdminCrudProps, 'columns' | 'fields' | 'stats' | 'filters' | 'defaults'> = {
  columns: [
    { header: 'Date', value: (r) => fmtDate(r.createdAt) }, { header: 'Patient', value: (r, db) => { const p = patientOf(db, r.patientId); return p ? `${fullName(p)} (${p.uhid})` : ''; } }, { header: 'Category', key: 'category' },
    { header: 'Rating', value: (r) => Number(r.rating), render: (r) => <span className="text-amber-400 whitespace-nowrap">{stars(r.rating)}</span> }, { header: 'Comments', key: 'comments' },
    { header: 'Needs call back', key: 'followUp', render: (r) => <Pill value={r.followUp === 'Yes' ? 'Pending' : 'Cleared'} label={r.followUp === 'Yes' ? 'Yes' : 'No'} /> },
  ],
  fields: [
    { name: 'patientId', label: 'Patient', type: 'select', required: true, from: { col: 'patients', label: (r) => `${fullName(r)} (${r.uhid})` } },
    { name: 'appointmentId', label: 'Visit (optional)', type: 'select', from: { col: 'appointments', label: (r, db) => `${fmtDate(r.date)} ${tokenLabel(r.tokenNo)} ${staffName(db, r.doctorId)} - ${fullName(patientOf(db, r.patientId))}`, filter: (r) => r.status === 'Completed' } },
    { name: 'rating', label: 'Rating', type: 'select', options: [{ value: '5', label: '5 - Excellent' }, { value: '4', label: '4 - Good' }, { value: '3', label: '3 - Average' }, { value: '2', label: '2 - Poor' }, { value: '1', label: '1 - Very poor' }], required: true, half: true },
    { name: 'category', label: 'About', type: 'select', options: FEEDBACK_CATEGORIES, required: true, half: true }, { name: 'comments', label: 'Comments', type: 'textarea' },
    { name: 'followUp', label: 'Needs a call back', type: 'select', options: ['No', 'Yes'], half: true },
  ],
  stats: [
    { label: 'Feedback received', value: (r) => r.length, color: 'text-blue-400' }, { label: 'Average rating', value: (r) => (r.length ? (r.reduce((s, x) => s + Number(x.rating || 0), 0) / r.length).toFixed(1) : '-'), color: 'text-amber-400' },
    { label: 'Low ratings (1-2)', value: (r) => r.filter((x) => Number(x.rating) <= 2).length, color: 'text-red-400' }, { label: 'Need a call back', value: (r) => r.filter((x) => x.followUp === 'Yes').length, color: 'text-indigo-400' },
  ],
  filters: [{ label: 'ratings', options: ['5', '4', '3', '2', '1'], match: (r, v) => String(r.rating) === v }, { label: 'categories', options: FEEDBACK_CATEGORIES, match: (r, v) => r.category === v }],
  defaults: () => ({ rating: '5', followUp: 'No', category: 'Reception / registration' }),
};

export default function FollowUpFeedbackPage() {
  const db = useDb();
  const mounted = useMounted();
  const [state, setState] = useState('');
  if (!mounted) return <div className="py-16 text-center text-sm text-gray-400">Loading...</div>;
  const all = followUps(db);
  const list = all.filter((f) => !state || f.state === (state as FollowUpState));
  const count = (s: FollowUpState) => all.filter((f) => f.state === s).length;
  const followTab = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="followup-tiles">
        <Tile label="Overdue" value={count('Overdue')} color="text-red-400" /><Tile label="Due today" value={count('Due today')} color="text-amber-400" /><Tile label="Upcoming" value={count('Upcoming')} color="text-blue-400" /><Tile label="Already booked" value={count('Booked')} color="text-emerald-400" />
      </div>
      <Panel title={`${list.length} follow-up${list.length === 1 ? '' : 's'}`} actions={<select value={state} onChange={(e) => setState(e.target.value)} className={`${inputCls} !w-auto`}><option value="">All</option>{['Overdue', 'Due today', 'Upcoming', 'Booked'].map((s) => <option key={s}>{s}</option>)}</select>}>
        <Table head={['Follow-up on', 'Patient', 'Mobile', 'Doctor', 'Last visit', 'State', '']} empty="No follow-up is pending. A follow-up date is set when a visit is completed in the OPD queue.">
          {list.map(({ appointment: a, state: s }) => {
            const p = patientOf(db, a.patientId);
            return <Tr key={a.id}><Td><b>{fmtDate(a.followUpDate)}</b></Td><Td>{fullName(p)}<span className="block text-xs text-gray-500">{p?.uhid}</span></Td><Td>{p?.phone}</Td><Td>{staffName(db, a.doctorId)}<span className="block text-xs text-gray-500">{deptName(db, a.departmentId)}</span></Td><Td>{fmtDate(a.date)}</Td><Td><Pill value={s} /></Td>
              <Td>{s !== 'Booked' && <Link className="text-emerald-500 text-xs font-medium" href={`/front-office/appointments?patient=${a.patientId}&doctor=${a.doctorId}&type=Follow-up`}>Book follow-up</Link>}</Td></Tr>;
          })}
        </Table>
      </Panel>
    </div>
  );
  return (
    <div className="space-y-4">
      <PageHeader icon={HeartHandshake} step="Step 10 · Follow-up / patient feedback" title="Follow-up & Feedback" description="Call patients back for their follow-up visit, and record how they rate the service at reception and in OPD." />
      <Tabs tabs={[
        { id: 'follow', label: `Follow-ups (${all.filter((f) => f.state === 'Overdue' || f.state === 'Due today').length} due)`, node: followTab },
        { id: 'feedback', label: `Feedback (${db.feedback.length})`, node: <AdminCrud embedded collection="feedback" title="Feedback" singular="Feedback" icon={HeartHandshake} {...fbDef} addLabel="Add feedback" description="Rating from 1 (very poor) to 5 (excellent). Tick 'needs a call back' when the patient asked to be contacted." /> },
      ]} />
    </div>
  );
}
