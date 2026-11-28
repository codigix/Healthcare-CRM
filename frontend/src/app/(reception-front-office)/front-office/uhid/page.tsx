"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Fingerprint, Save } from 'lucide-react';
import { useDb, saveSingle, DbError } from '@/data/db';
import { fullName, previewMrn, previewUhid, settingsOf } from '@/data/receptionActions';
import { fmtDate } from '@/data/actions';
import { PageHeader, Panel, Tile, useMounted } from '@/features/admin/ui';
import { Alert, Field, Table, Td, Tr, btnPrimary, inputCls } from '@/features/reception/parts';

export default function UhidMrnPage() {
  const db = useDb();
  const mounted = useMounted();
  const s = settingsOf(db);
  const [f, setF] = useState<Record<string, any>>({});
  const [msg, setMsg] = useState<{ k: 'ok' | 'err'; t: string } | null>(null);
  const [q, setQ] = useState('');
  useEffect(() => { if (mounted) setF({ ...s }); }, [mounted, db.receptionSettings[0]?.updatedAt]); // eslint-disable-line react-hooks/exhaustive-deps
  const issued = useMemo(() => db.patients.filter((p) => !q.trim() || `${p.uhid} ${p.mrn} ${fullName(p)}`.toLowerCase().includes(q.trim().toLowerCase())).sort((a, b) => String(b.uhid).localeCompare(String(a.uhid))), [db.patients, q]);
  if (!mounted) return <div className="py-16 text-center text-sm text-gray-400">Loading...</div>;

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      saveSingle('receptionSettings', { uhidPrefix: String(f.uhidPrefix || '').toUpperCase(), uhidDigits: Number(f.uhidDigits), mrnPrefix: String(f.mrnPrefix || '').toUpperCase(), mrnDigits: Number(f.mrnDigits), registrationFee: Number(f.registrationFee) || 0 });
      setMsg({ k: 'ok', t: 'ID format saved. It applies to patients registered from now on; existing IDs never change.' });
    } catch (x) { setMsg({ k: 'err', t: x instanceof DbError ? x.message : 'Could not save' }); }
  };
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setF((x) => ({ ...x, [k]: e.target.value }));
  const preview = (prefix: string, digits: number, n: number) => `${String(prefix || '').toUpperCase()}-${String(n).padStart(Number(digits) || 6, '0')}`;

  return (
    <div className="space-y-6">
      <PageHeader icon={Fingerprint} step="Step 4 · Generate unique UHID" title="UHID / MRN Generation" description="Every patient gets a Unique Health ID (UHID) and a Medical Record Number (MRN) when registered. Set the format here." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Tile label="Next UHID" value={<span data-testid="preview-uhid">{previewUhid(db)}</span>} color="text-blue-400" /><Tile label="Next MRN" value={previewMrn(db)} color="text-blue-400" />
        <Tile label="IDs issued" value={db.patients.length} color="text-emerald-400" /><Tile label="Registration fee" value={`Rs. ${s.registrationFee}`} color="text-amber-400" />
      </div>
      <Panel title="ID format">
        <form onSubmit={save} noValidate className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="UHID prefix" required help="Letters, digits or dashes (1 to 8)"><input value={f.uhidPrefix ?? ''} onChange={set('uhidPrefix')} className={inputCls} /></Field>
            <Field label="UHID digits" required help="Length of the number, 4 to 10"><input type="number" value={f.uhidDigits ?? ''} onChange={set('uhidDigits')} className={inputCls} /></Field>
            <Field label="MRN prefix" required><input value={f.mrnPrefix ?? ''} onChange={set('mrnPrefix')} className={inputCls} /></Field>
            <Field label="MRN digits" required><input type="number" value={f.mrnDigits ?? ''} onChange={set('mrnDigits')} className={inputCls} /></Field>
            <Field label="Registration fee (Rs.)"><input type="number" min={0} value={f.registrationFee ?? ''} onChange={set('registrationFee')} className={inputCls} /></Field>
          </div>
          <p className="text-sm text-gray-400">Example: <b className="text-white">{preview(f.uhidPrefix, f.uhidDigits, nextNumber(db.patients, 'uhid'))}</b> and <b className="text-white">{preview(f.mrnPrefix, f.mrnDigits, nextNumber(db.patients, 'mrn'))}</b></p>
          {msg && <Alert kind={msg.k}>{msg.t}</Alert>}
          <div className="flex justify-end"><button type="submit" className={btnPrimary}><Save size={16} /> Save format</button></div>
        </form>
      </Panel>
      <Panel title="Issued IDs" actions={<input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search UHID, MRN or name" className={`${inputCls} !w-64`} />}>
        <Table head={['UHID', 'MRN', 'Patient', 'Registered', '']} empty="No ID has been issued yet.">
          {issued.map((p) => <Tr key={p.id}><Td><b>{p.uhid}</b></Td><Td>{p.mrn}</Td><Td>{fullName(p)}</Td><Td>{fmtDate(p.registeredAt)}</Td><Td><Link className="text-blue-400 text-xs" href={`/front-office/profile/${p.id}`}>Profile</Link></Td></Tr>)}
        </Table>
      </Panel>
    </div>
  );
}
const nextNumber = (rows: { [k: string]: any }[], field: string) => rows.reduce((m, r) => { const x = String(r[field] ?? '').match(/(\d+)\s*$/); return x ? Math.max(m, Number(x[1])) : m; }, 0) + 1;
