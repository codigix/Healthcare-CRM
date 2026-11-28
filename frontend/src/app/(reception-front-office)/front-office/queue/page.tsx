"use client";

import React, { useMemo, useState } from 'react';
import { ListOrdered } from 'lucide-react';
import { useDb, type Row } from '@/data/db';
import { callPatient, checkIn, deptName, fullName, markNoShow, minutesSince, patientOf, queueOrder, skipToken, staffName, timeOf, tokenLabel } from '@/data/receptionActions';
import { todayStr } from '@/data/slots';
import { PageHeader, Panel, Tile, useMounted } from '@/features/admin/ui';
import { Alert, CompleteVisitModal, Pill, SmallBtn, Table, Td, Tr, doctorOptions, errMsg, inputCls } from '@/features/reception/parts';

const GROUPS = [['waiting', 'Waiting room'], ['expected', 'Not arrived yet'], ['done', 'Finished'], ['all', 'All today']] as const;

export default function OpdQueuePage() {
  const db = useDb();
  const mounted = useMounted();
  const [group, setGroup] = useState<(typeof GROUPS)[number][0]>('waiting');
  const [doctor, setDoctor] = useState(''); const [dept, setDept] = useState('');
  const [msg, setMsg] = useState<{ k: 'ok' | 'err'; t: string } | null>(null);
  const [completing, setCompleting] = useState<Row | null>(null);
  const t = todayStr();
  const today = useMemo(() => db.appointments.filter((a) => a.date === t && (!doctor || a.doctorId === doctor) && (!dept || a.departmentId === dept)), [db.appointments, t, doctor, dept]);
  if (!mounted) return <div className="py-16 text-center text-sm text-gray-400">Loading...</div>;
  const waiting = today.filter((a) => a.status === 'Checked-in'), withDoctor = today.filter((a) => a.status === 'In consultation'), expected = today.filter((a) => a.status === 'Booked');
  const done = today.filter((a) => ['Completed', 'Cancelled', 'No-show'].includes(a.status));
  const list = (group === 'waiting' ? [...withDoctor.sort(queueOrder), ...waiting.sort(queueOrder)] : group === 'expected' ? expected.sort(queueOrder) : group === 'done' ? done.sort(queueOrder) : [...today].sort(queueOrder));
  const run = (fn: () => any, ok: string) => { try { fn(); setMsg({ k: 'ok', t: ok }); } catch (e) { setMsg({ k: 'err', t: errMsg(e) }); } };
  const count = (g: string) => (g === 'waiting' ? waiting.length + withDoctor.length : g === 'expected' ? expected.length : g === 'done' ? done.length : today.length);
  const avg = (() => { const w = today.filter((a) => a.calledAt && a.checkedInAt).map((a) => (new Date(a.calledAt).getTime() - new Date(a.checkedInAt).getTime()) / 60000); return w.length ? Math.round(w.reduce((s, x) => s + x, 0) / w.length) : 0; })();

  return (
    <div className="space-y-6">
      <PageHeader icon={ListOrdered} step="Step 9 · Send patient to OPD" title="OPD Queue" description="Today's patients by doctor. Check patients in when they arrive, call the next one, and complete the visit when the doctor is done." />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4" data-testid="queue-tiles">
        <Tile label="Waiting" value={waiting.length} color="text-amber-400" /><Tile label="With doctor" value={withDoctor.length} color="text-indigo-400" /><Tile label="Not arrived" value={expected.length} color="text-blue-400" />
        <Tile label="Completed" value={today.filter((a) => a.status === 'Completed').length} color="text-emerald-400" /><Tile label="Average wait" value={`${avg} min`} color="text-gray-300" />
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex border border-gray-700 rounded-lg overflow-hidden">{GROUPS.map(([k, label]) => <button key={k} type="button" data-group={k} onClick={() => setGroup(k)} className={`px-4 py-2 text-sm ${group === k ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>{label} ({count(k)})</button>)}</div>
        <select value={dept} onChange={(e) => { setDept(e.target.value); setDoctor(''); }} className={`${inputCls} !w-auto`}><option value="">All departments</option>{db.departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
        <select value={doctor} onChange={(e) => setDoctor(e.target.value)} className={`${inputCls} !w-auto`}><option value="">All doctors</option>{doctorOptions(db, dept).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
      </div>
      {msg && <Alert kind={msg.k}>{msg.t}</Alert>}
      <Panel title={GROUPS.find((g) => g[0] === group)![1]}>
        <Table head={['Token', 'Patient', 'Doctor', 'Time', 'Waiting', 'Status', '']} empty={group === 'waiting' ? 'Nobody is waiting.' : 'Nothing to show.'}>
          {list.map((a) => (
            <Tr key={a.id}>
              <Td><b data-testid="queue-token">{tokenLabel(a.tokenNo)}</b>{Number(a.skipped) > 0 && <span className="ml-1 text-xs text-amber-500">skipped {a.skipped}x</span>}</Td>
              <Td>{fullName(patientOf(db, a.patientId))}<span className="block text-xs text-gray-500">{patientOf(db, a.patientId)?.uhid} · {a.source === 'Walk-in' ? 'Walk-in' : a.visitType}</span></Td>
              <Td>{staffName(db, a.doctorId)}<span className="block text-xs text-gray-500">{deptName(db, a.departmentId)}</span></Td><Td>{a.time}</Td>
              <Td>{a.status === 'Checked-in' ? `${minutesSince(a.checkedInAt)} min` : a.status === 'In consultation' ? `since ${timeOf(a.calledAt)}` : '-'}</Td><Td><Pill value={a.status} /></Td>
              <Td className="whitespace-nowrap">
                {a.status === 'Booked' && <SmallBtn tone="green" onClick={() => run(() => checkIn(a.id), `${tokenLabel(a.tokenNo)} checked in`)}>Check in</SmallBtn>}
                {a.status === 'Booked' && <SmallBtn tone="gray" onClick={() => run(() => markNoShow(a.id), 'Marked as no-show')}>No-show</SmallBtn>}
                {a.status === 'Checked-in' && <SmallBtn tone="green" onClick={() => run(() => callPatient(a.id), `${tokenLabel(a.tokenNo)} sent in to the doctor`)}>Call</SmallBtn>}
                {a.status === 'Checked-in' && <SmallBtn tone="gray" onClick={() => run(() => skipToken(a.id), `${tokenLabel(a.tokenNo)} moved after the others`)}>Skip</SmallBtn>}
                {a.status === 'In consultation' && <SmallBtn onClick={() => setCompleting(a)}>Complete</SmallBtn>}
              </Td>
            </Tr>
          ))}
        </Table>
      </Panel>
      <CompleteVisitModal appt={completing} onClose={() => setCompleting(null)} onDone={(m) => setMsg({ k: 'ok', t: m })} />
    </div>
  );
}
