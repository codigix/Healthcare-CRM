"use client";

import React, { useState } from 'react';
import { Ticket } from 'lucide-react';
import { useDb, type Row } from '@/data/db';
import { callPatient, deptName, fullName, patientOf, queueOrder, tokenLabel } from '@/data/receptionActions';
import { leaveOn, sessionsOn, todayStr } from '@/data/slots';
import { PageHeader, useMounted } from '@/features/admin/ui';
import { Alert, CompleteVisitModal, Pill, SmallBtn, TokenSlip, btnPrimary, doctorOptions, errMsg } from '@/features/reception/parts';

export default function TokenManagementPage() {
  const db = useDb();
  const mounted = useMounted();
  const [msg, setMsg] = useState<{ k: 'ok' | 'err'; t: string } | null>(null);
  const [slip, setSlip] = useState<Row | null>(null);
  const [completing, setCompleting] = useState<Row | null>(null);
  if (!mounted) return <div className="py-16 text-center text-sm text-gray-400">Loading...</div>;
  const t = todayStr();
  const cards = doctorOptions(db).map((d) => {
    const mine = db.appointments.filter((a) => a.doctorId === d.id && a.date === t);
    const serving = mine.find((a) => a.status === 'In consultation');
    const queue = mine.filter((a) => a.status === 'Checked-in').sort(queueOrder);
    return { d, mine, serving, queue, onLeave: !!leaveOn(db, d.id, t), hasOpd: sessionsOn(db, d.id, t).length > 0 };
  }).filter((c) => c.mine.length || c.hasOpd || c.onLeave);

  return (
    <div className="space-y-6">
      <PageHeader icon={Ticket} step="Step 8 · Generate token" title="Token Management" description="One token per patient per doctor per day, issued when the appointment is booked. See who is being served, who is next, and reprint a slip." />
      {msg && <Alert kind={msg.k}>{msg.t}</Alert>}
      {cards.length === 0 && <Alert kind="info">No doctor has OPD or tokens today.</Alert>}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6" data-testid="token-board">
        {cards.map((c) => (
          <section key={c.d.id} data-doctor={c.d.name} className="bg-dark-secondary border border-gray-800 rounded-lg">
            <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-gray-800">
              <div><h2 className="text-sm font-semibold text-white">{c.d.name}</h2><p className="text-xs text-gray-400">{deptName(db, c.d.departmentId)} · {c.mine.length} token{c.mine.length === 1 ? '' : 's'} issued</p></div>
              {c.onLeave ? <Pill value="Overdue" label="On leave" /> : <button type="button" className={btnPrimary} disabled={!c.queue.length || !!c.serving} data-testid={`call-next-${c.d.id}`}
                onClick={() => { try { callPatient(c.queue[0].id); setMsg({ k: 'ok', t: `${tokenLabel(c.queue[0].tokenNo)} called for ${c.d.name}` }); } catch (e) { setMsg({ k: 'err', t: errMsg(e) }); } }}>Call next</button>}
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20"><p className="text-xs text-gray-400">Now serving</p><p className="text-2xl font-bold text-indigo-400" data-testid="now-serving">{c.serving ? tokenLabel(c.serving.tokenNo) : '-'}</p></div>
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20"><p className="text-xs text-gray-400">Next</p><p className="text-2xl font-bold text-amber-400">{c.queue[0] ? tokenLabel(c.queue[0].tokenNo) : '-'}</p></div>
                <div className="p-3 rounded-lg bg-gray-500/10 border border-gray-500/20"><p className="text-xs text-gray-400">Waiting</p><p className="text-2xl font-bold text-gray-200">{c.queue.length}</p></div>
              </div>
              {c.serving && <div className="flex items-center justify-between text-sm"><span className="text-gray-300">{fullName(patientOf(db, c.serving.patientId))} is with the doctor</span><SmallBtn onClick={() => setCompleting(c.serving!)}>Complete</SmallBtn></div>}
              <div className="flex flex-wrap gap-2">
                {[...c.mine].sort((a, b) => Number(a.tokenNo) - Number(b.tokenNo)).map((a) => (
                  <button key={a.id} type="button" onClick={() => setSlip(a)} title={`${fullName(patientOf(db, a.patientId))} - ${a.status}`} data-token={tokenLabel(a.tokenNo)}
                    className={`px-2.5 py-1.5 rounded border text-xs font-medium ${a.status === 'In consultation' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10' : a.status === 'Checked-in' ? 'border-amber-500/60 text-amber-400' : a.status === 'Completed' ? 'border-emerald-500/40 text-emerald-500' : ['Cancelled', 'No-show'].includes(a.status) ? 'border-gray-700 text-gray-600 line-through' : 'border-gray-600 text-gray-300'}`}>{tokenLabel(a.tokenNo)}</button>
                ))}
                {!c.mine.length && <span className="text-sm text-gray-500">No token issued yet.</span>}
              </div>
              <p className="text-xs text-gray-500">Click a token to open its slip. Amber = waiting, blue = with doctor, green = done, struck out = cancelled or no-show.</p>
            </div>
          </section>
        ))}
      </div>
      <TokenSlip appt={slip} onClose={() => setSlip(null)} />
      <CompleteVisitModal appt={completing} onClose={() => setCompleting(null)} onDone={(m) => setMsg({ k: 'ok', t: m })} />
    </div>
  );
}
