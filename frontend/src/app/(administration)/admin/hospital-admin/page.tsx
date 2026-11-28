"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Building2, CheckCircle2, Circle, Lock, ArrowRight, Download, Upload, RotateCcw, Trash2, GitBranch, Network, Wallet, Layers, DoorOpen, BedDouble, Users, Receipt, FileText, ClipboardCheck, BarChart3, Database } from 'lucide-react';
import { useDb, exportJson, importJson, resetToStarterData, clearAllData, countRows, DbError } from '@/data/db';
import { computeWorkflow, type StepStatus } from '@/data/workflow';
import { ADMIN_ROLES } from '@/data/actions';
import { PageHeader, Panel, useMounted } from '@/features/admin/ui';

const BASE = '/admin/hospital-admin';
const STATUS_STYLE: Record<StepStatus, { label: string; cls: string }> = {
  done: { label: 'Done', cls: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  'in-progress': { label: 'In progress', cls: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  'not-started': { label: 'Not started', cls: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
  locked: { label: 'Waiting for setup', cls: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
};

export default function HospitalAdministrationHome() {
  const db = useDb();
  const mounted = useMounted();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ t: 'ok' | 'err'; text: string } | null>(null);
  const flow = computeWorkflow(db);

  const submodules = [
    { icon: Building2, title: 'Hospital Profile', href: `${BASE}/profile`, count: db.hospitalProfile.length ? 'Saved' : 'Not set' },
    { icon: Network, title: 'Department Management', href: `${BASE}/departments`, count: db.departments.length },
    { icon: Layers, title: 'Building & Floor Management', href: `${BASE}/buildings`, count: `${db.buildings.length} / ${db.floors.length}` },
    { icon: DoorOpen, title: 'Ward & Room Management', href: `${BASE}/wards-rooms`, count: `${db.wards.length} / ${db.rooms.length}` },
    { icon: BedDouble, title: 'Bed Management', href: `${BASE}/beds`, count: db.beds.length },
    { icon: Users, title: 'Doctor & Staff Master', href: `${BASE}/staff`, count: db.staff.length },
    { icon: FileText, title: 'Hospital Policies & SOPs', href: `${BASE}/policies`, count: db.policies.length },
    { icon: ClipboardCheck, title: 'Approval Management', href: `${BASE}/approvals`, count: `${db.approvalRequests.filter((r) => r.status === 'Pending').length} pending` },
    { icon: Wallet, title: 'Cost Centre Management', href: `${BASE}/cost-centres`, count: db.costCentres.length },
    { icon: Receipt, title: 'Service & Tariff Management', href: `${BASE}/services`, count: `${db.services.length} / ${db.tariffs.length}` },
    { icon: GitBranch, title: 'Branch Configuration', href: `${BASE}/branches`, count: db.branches.length },
    { icon: BarChart3, title: 'Hospital Operational Reports', href: `${BASE}/reports`, count: 'Live' },
  ];

  const download = () => {
    const url = URL.createObjectURL(new Blob([exportJson()], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = `hospital-admin-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url);
    setMsg({ t: 'ok', text: 'Backup downloaded.' });
  };
  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; e.target.value = '';
    if (!file) return;
    if (!window.confirm('Replace all current data with the data in this file?')) return;
    try { importJson(await file.text()); setMsg({ t: 'ok', text: 'Data restored from the file.' }); } catch (err) { setMsg({ t: 'err', text: err instanceof DbError ? err.message : 'Could not read this file.' }); }
  };

  if (!mounted) return <div className="py-16 text-center text-sm text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader icon={Building2} title="Hospital Administration" description="Control the overall hospital operation. Follow the seven steps in order, or open any submodule directly." />

      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
        <span>Roles:</span>
        {ADMIN_ROLES.map((r) => <span key={r} className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{r}</span>)}
      </div>

      <Panel title={`Setup progress: ${flow.percent}%`} actions={flow.next ? (
        <Link href={flow.next.href} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium">
          Continue with step {flow.next.number}: {flow.next.title} <ArrowRight size={14} />
        </Link>
      ) : <span className="text-xs text-emerald-500 font-medium">Setup complete</span>}>
        <div className="h-3 rounded-full bg-gray-500/20 overflow-hidden"><div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${flow.percent}%` }} /></div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" data-testid="workflow-steps">
        {flow.steps.map((s) => {
          const st = STATUS_STYLE[s.status];
          return (
            <section key={s.id} data-step={s.id} data-status={s.status} className={`bg-dark-secondary border rounded-lg p-5 ${s.status === 'done' ? 'border-emerald-500/30' : 'border-gray-800'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${s.status === 'done' ? 'bg-emerald-500 text-white' : 'bg-blue-500/15 text-blue-400'}`}>{s.status === 'done' ? <CheckCircle2 size={18} /> : s.number}</span>
                  <div>
                    <h3 className="text-base font-semibold text-white">{s.title}</h3>
                    <p className="text-sm text-gray-400 mt-0.5">{s.purpose}</p>
                    <p className="text-xs text-gray-500 mt-1">{s.module}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium border whitespace-nowrap ${st.cls}`}>{st.label}</span>
              </div>
              <ul className="mt-4 space-y-1.5">
                {s.checks.map((c) => (
                  <li key={c.label} className="flex items-center gap-2 text-sm">
                    {c.done ? <CheckCircle2 size={15} className="text-emerald-500 shrink-0" /> : s.status === 'locked' ? <Lock size={15} className="text-gray-500 shrink-0" /> : <Circle size={15} className="text-gray-500 shrink-0" />}
                    {c.href && !c.done ? <Link href={c.href} className="text-gray-300 hover:text-blue-400 underline decoration-dotted">{c.label}</Link> : <span className={c.done ? 'text-gray-400' : 'text-gray-300'}>{c.label}</span>}
                  </li>
                ))}
              </ul>
              <Link href={s.href} className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-blue-400 hover:text-blue-300">Open {s.number === 7 ? 'reports' : 'this step'} <ArrowRight size={14} /></Link>
            </section>
          );
        })}
      </div>

      <Panel title="Submodules">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {submodules.map((m) => (
            <Link key={m.title} href={m.href} className="flex items-center gap-3 p-3 rounded-lg border border-gray-800 hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors">
              <span className="p-2 rounded bg-blue-500/10 text-blue-400"><m.icon size={18} /></span>
              <span className="min-w-0"><span className="block text-sm font-medium text-white truncate">{m.title}</span><span className="block text-xs text-gray-500">{m.count}</span></span>
            </Link>
          ))}
        </div>
      </Panel>

      <Panel title="Saved data">
        <p className="text-sm text-gray-400 flex items-start gap-2"><Database size={16} className="mt-0.5 shrink-0" />
          This module saves its data as JSON in this browser ({countRows(db)} records). It is not sent to a server, so it stays on this computer. Download a backup before clearing your browser data.</p>
        {msg && <p className={`mt-3 text-sm ${msg.t === 'ok' ? 'text-emerald-500' : 'text-red-500'}`} role="status">{msg.text}</p>}
        <div className="flex flex-wrap gap-3 mt-4">
          <button onClick={download} className="flex items-center gap-2 px-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm text-white hover:bg-gray-800"><Download size={16} /> Download backup (JSON)</button>
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm text-white hover:bg-gray-800"><Upload size={16} /> Restore from file</button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={upload} />
          <button onClick={() => { if (window.confirm('Replace everything with the starter hospital data?')) { resetToStarterData(); setMsg({ t: 'ok', text: 'Starter data loaded.' }); } }} className="flex items-center gap-2 px-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm text-white hover:bg-gray-800"><RotateCcw size={16} /> Load starter data</button>
          <button onClick={() => { if (window.confirm('Delete ALL hospital administration data? You can then build the hospital from step 1.')) { clearAllData(); setMsg({ t: 'ok', text: 'All data cleared. Start with step 1.' }); } }} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-500 hover:bg-red-500/20"><Trash2 size={16} /> Clear all data</button>
        </div>
      </Panel>
    </div>
  );
}
