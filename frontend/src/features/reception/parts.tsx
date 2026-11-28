"use client";

import React, { useMemo, useState } from 'react';
import { Search, X, Printer, ArrowRight } from 'lucide-react';
import Modal from '@/components/UI/Modal';
import { useDb, DbError, type Row } from '@/data/db';
import { ageOf, completeVisit, deptName, doctorsOf, fullName, patientOf, staffName, tokenLabel } from '@/data/receptionActions';
import { addDays, computeSlots, leaveOn, sessionsOn, todayStr, weekdayOf } from '@/data/slots';
import { fmtDate } from '@/data/actions';

export const inputCls = 'w-full px-3 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 disabled:opacity-60';
export const btnPrimary = 'flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50';
export const btnGhost = 'flex items-center gap-2 px-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm text-white hover:bg-gray-800 disabled:opacity-50';
export const errMsg = (e: unknown) => (e instanceof DbError ? e.message : 'Something went wrong. Please try again.');

export function Field({ label, required, help, children, half = true }: { label: string; required?: boolean; help?: string; children: React.ReactNode; half?: boolean }) {
  return (
    <label className={`block ${half ? 'col-span-2 md:col-span-1' : 'col-span-2'}`}>
      <span className="block text-sm font-medium text-gray-300 mb-1">{label}{required && <span className="text-red-500"> *</span>}</span>
      {children}
      {help && <span className="block text-xs text-gray-500 mt-1">{help}</span>}
    </label>
  );
}

export function Alert({ kind, children }: { kind: 'ok' | 'err' | 'warn' | 'info'; children: React.ReactNode }) {
  const cls = kind === 'ok' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : kind === 'err' ? 'bg-red-500/10 border-red-500/30 text-red-500' : kind === 'warn' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-blue-500/10 border-blue-500/30 text-blue-400';
  return <div className={`px-4 py-3 rounded-lg text-sm border ${cls}`} role={kind === 'err' ? 'alert' : 'status'}>{children}</div>;
}

const APPT_STYLE: Record<string, string> = {
  Booked: 'bg-blue-500/10 text-blue-400 border-blue-500/20', 'Checked-in': 'bg-amber-500/10 text-amber-500 border-amber-500/20', 'In consultation': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', Cancelled: 'bg-gray-500/10 text-gray-400 border-gray-500/20', 'No-show': 'bg-red-500/10 text-red-500 border-red-500/20',
  Admitted: 'bg-blue-500/10 text-blue-400 border-blue-500/20', Discharged: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', Referred: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  New: 'bg-blue-500/10 text-blue-400 border-blue-500/20', 'In progress': 'bg-amber-500/10 text-amber-500 border-amber-500/20', Converted: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', Closed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  Overdue: 'bg-red-500/10 text-red-500 border-red-500/20', 'Due today': 'bg-amber-500/10 text-amber-500 border-amber-500/20', Upcoming: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  Cleared: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', Pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
};
export const Pill = ({ value, label }: { value: string; label?: string }) => <span className={`px-2 py-1 rounded text-xs font-medium border whitespace-nowrap ${APPT_STYLE[value] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>{label || value || '-'}</span>;

export const Th = ({ children }: { children?: React.ReactNode }) => <th className="py-2 pr-4 font-medium text-left text-xs uppercase text-gray-500">{children}</th>;
export const Table = ({ head, children, empty }: { head: string[]; children: React.ReactNode; empty?: string }) => {
  const has = React.Children.count(children) > 0 && !(Array.isArray(children) && children.length === 0);
  return has ? (
    <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-gray-800">{head.map((h) => <Th key={h}>{h}</Th>)}</tr></thead><tbody>{children}</tbody></table></div>
  ) : <p className="py-8 text-center text-sm text-gray-400">{empty || 'Nothing to show.'}</p>;
};
export const Tr = ({ children }: { children: React.ReactNode }) => <tr className="border-b border-gray-800/60 last:border-0 hover:bg-white/[0.02]">{children}</tr>;
export const Td = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => <td className={`py-2.5 pr-4 text-gray-200 align-middle ${className}`}>{children}</td>;
export const SmallBtn = ({ children, onClick, tone = 'blue', title, disabled }: { children: React.ReactNode; onClick?: () => void; tone?: 'blue' | 'green' | 'red' | 'gray'; title?: string; disabled?: boolean }) => (
  <button type="button" title={title} disabled={disabled} onClick={onClick}
    className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap disabled:opacity-40 ${tone === 'green' ? 'text-emerald-500 hover:bg-emerald-500/10' : tone === 'red' ? 'text-red-500 hover:bg-red-500/10' : tone === 'gray' ? 'text-gray-300 hover:bg-gray-500/10' : 'text-blue-400 hover:bg-blue-500/10'}`}>{children}</button>
);

// ----------------------------------------------------------------------------- patient search box
export function patientLine(p: Row) { return `${fullName(p)} · ${p.uhid} · ${p.phone} · ${ageOf(p.dob)} ${String(p.gender || '')[0] || ''}`; }

export function PatientSearchBox({ value, onChange, filter, placeholder = 'Search by name, UHID, MRN or mobile number' }: { value: Row | null; onChange: (p: Row | null) => void; filter?: (p: Row) => boolean; placeholder?: string }) {
  const db = useDb();
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    const t = q.trim().toLowerCase(); if (t.length < 2) return [];
    const d = t.replace(/\D/g, '');
    return db.patients.filter((p) => (!filter || filter(p)) && (`${fullName(p)} ${p.uhid} ${p.mrn}`.toLowerCase().includes(t) || (d.length >= 3 && String(p.phone).includes(d)))).slice(0, 8);
  }, [db.patients, q, filter]);
  if (value) {
    return (
      <div className="flex items-center justify-between gap-3 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg" data-testid="selected-patient">
        <div><p className="text-sm font-medium text-white">{fullName(value)}</p><p className="text-xs text-gray-400">{value.uhid} · {value.phone} · {ageOf(value.dob)} {value.gender}</p></div>
        <button type="button" onClick={() => onChange(null)} className="text-gray-400 hover:text-white" title="Change patient"><X size={16} /></button>
      </div>
    );
  }
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} className={`${inputCls} pl-9`} data-testid="patient-search" />
      {q.trim().length >= 2 && (
        <div className="absolute z-20 mt-1 w-full bg-dark-secondary border border-gray-700 rounded-lg shadow-xl max-h-72 overflow-auto">
          {results.length === 0 ? <p className="px-3 py-3 text-sm text-gray-400">No patient found. Check the spelling, or register the patient first.</p>
            : results.map((p) => <button key={p.id} type="button" onClick={() => { onChange(p); setQ(''); }} className="block w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-blue-500/10">{patientLine(p)}</button>)}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------- doctor + slot picker
export function nextAvailableDate(db: ReturnType<typeof useDb>, doctorId: string, from = todayStr()): string {
  for (let i = 0; i < 21; i++) { const d = addDays(from, i); if (computeSlots(db, doctorId, d).some((s) => s.state === 'free')) return d; }
  return '';
}

export function SlotPicker({ doctorId, date, value, onChange, ignoreApptId, onJump }: { doctorId: string; date: string; value: string; onChange: (t: string) => void; ignoreApptId?: string; onJump?: (d: string) => void }) {
  const db = useDb();
  if (!doctorId || !date) return <p className="text-sm text-gray-500">Choose a doctor and a date to see the free slots.</p>;
  const doc = db.staff.find((s) => s.id === doctorId);
  const leave = leaveOn(db, doctorId, date);
  if (leave) return <Alert kind="warn">{doc?.name} is on leave on this date{leave.reason ? ` (${leave.reason})` : ''}. Choose another date.</Alert>;
  if (!sessionsOn(db, doctorId, date).length) {
    const next = nextAvailableDate(db, doctorId, date);
    return <Alert kind="warn">{doc?.name} has no OPD on {weekdayOf(date)}.{next && onJump ? <> Next free day: <button type="button" className="underline font-medium" onClick={() => onJump(next)}>{fmtDate(next)}</button></> : ''}</Alert>;
  }
  const slots = computeSlots(db, doctorId, date, ignoreApptId);
  const free = slots.filter((s) => s.state === 'free').length;
  if (free === 0) {
    const next = nextAvailableDate(db, doctorId, addDays(date, 1));
    return <Alert kind="warn">No free slot on this date.{next && onJump ? <> Next free day: <button type="button" className="underline font-medium" onClick={() => onJump(next)}>{fmtDate(next)}</button></> : ''}</Alert>;
  }
  return (
    <div data-testid="slot-picker">
      <p className="text-xs text-gray-400 mb-2">{free} of {slots.length} slots free</p>
      <div className="flex flex-wrap gap-2">
        {slots.map((s) => (
          <button key={s.time} type="button" disabled={s.state !== 'free'} onClick={() => onChange(s.time)} data-slot={s.time} data-state={s.state}
            title={s.state === 'booked' ? 'Already booked' : s.state === 'past' ? 'Time has passed' : s.state === 'full' ? 'Session is full' : 'Free'}
            className={`px-2.5 py-1.5 rounded border text-xs font-medium ${value === s.time ? 'bg-blue-600 text-white border-blue-600' : s.state === 'free' ? 'border-gray-600 text-gray-200 hover:border-blue-500' : 'border-gray-800 text-gray-600 line-through cursor-not-allowed'}`}>{s.time}</button>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------- token slip
export function TokenSlip({ appt, onClose, actions }: { appt: Row | null; onClose: () => void; actions?: React.ReactNode }) {
  const db = useDb();
  const patient = patientOf(db, appt?.patientId);
  return (
    <Modal isOpen={!!appt} onClose={onClose} title="Token slip" size="md">
      {appt && (
        <div className="space-y-4">
          <style>{`@media print { body * { visibility: hidden !important; } .print-area, .print-area * { visibility: visible !important; } .print-area { position: fixed; left: 0; top: 0; width: 100%; color: #000 !important; background: #fff !important; } }`}</style>
          <div className="print-area border border-dashed border-gray-600 rounded-lg p-5 text-center space-y-2" data-testid="token-slip">
            <p className="text-sm text-gray-400">{db.hospitalProfile[0]?.name || 'Hospital'}</p>
            <p className="text-5xl font-bold text-blue-500" data-testid="token-number">{tokenLabel(appt.tokenNo)}</p>
            <p className="text-lg font-semibold text-white">{fullName(patient)}</p>
            <p className="text-sm text-gray-400">{patient?.uhid} · {ageOf(patient?.dob)} {patient?.gender}</p>
            <div className="text-sm text-gray-300 pt-2 border-t border-gray-700/60">
              <p>{staffName(db, appt.doctorId)} · {deptName(db, appt.departmentId)}</p>
              <p>{fmtDate(appt.date)}{appt.time ? `, ${appt.time}` : ''} · {appt.source === 'Walk-in' ? 'Walk-in' : appt.visitType}</p>
              {Number(appt.fee) > 0 && <p>Consultation fee: Rs. {Number(appt.fee).toLocaleString('en-IN')}</p>}
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-3">
            {actions}
            <button type="button" onClick={() => window.print()} className={btnGhost}><Printer size={16} /> Print</button>
            <button type="button" onClick={onClose} className={btnPrimary}>Done</button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ----------------------------------------------------------------------------- complete a visit
export function CompleteVisitModal({ appt, onClose, onDone }: { appt: Row | null; onClose: () => void; onDone: (msg: string) => void }) {
  const db = useDb();
  const [follow, setFollow] = useState(''); const [notes, setNotes] = useState(''); const [err, setErr] = useState('');
  const patient = patientOf(db, appt?.patientId);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appt) return;
    try { completeVisit(appt.id, follow, notes); onDone(`${tokenLabel(appt.tokenNo)} completed${follow ? `, follow-up on ${fmtDate(follow)}` : ''}`); setFollow(''); setNotes(''); setErr(''); onClose(); }
    catch (x) { setErr(errMsg(x)); }
  };
  return (
    <Modal isOpen={!!appt} onClose={onClose} title={appt ? `Complete ${tokenLabel(appt.tokenNo)} - ${fullName(patient)}` : ''} size="lg">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <p className="text-sm text-gray-400">The doctor has finished. Add a follow-up date if one was advised.</p>
        <Field label="Follow-up date" help="Leave empty if no follow-up is needed." half={false}><input type="date" min={addDays(todayStr(), 1)} value={follow} onChange={(e) => setFollow(e.target.value)} className={inputCls} /></Field>
        <Field label="Notes" half={false}><textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className={inputCls} /></Field>
        {err && <Alert kind="err">{err}</Alert>}
        <div className="flex justify-end gap-3"><button type="button" onClick={onClose} className={btnGhost}>Cancel</button><button type="submit" className={btnPrimary}>Mark completed <ArrowRight size={16} /></button></div>
      </form>
    </Modal>
  );
}

export const doctorOptions = (db: ReturnType<typeof useDb>, departmentId = '') => doctorsOf(db).filter((d) => !departmentId || d.departmentId === departmentId);
