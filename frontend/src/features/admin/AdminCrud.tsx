"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Download, Pencil, Trash2, Inbox } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';
import Modal from '@/components/UI/Modal';
import { useDb, create, update, remove, DbError, type CollectionName, type Db, type Row } from '@/data/db';

// ----------------------------------------------------------------------------- definitions
export interface Opt { value: string; label: string }
export interface FieldDef {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'email' | 'tel' | 'date' | 'time' | 'textarea' | 'select' | 'heading';
  required?: boolean;
  /** Fixed choices for a select. */
  options?: (string | Opt)[];
  /** Choices that come from another collection (parent records). */
  from?: { col: CollectionName; label: (r: Row, db: Db) => string; filter?: (r: Row, db: Db) => boolean };
  placeholder?: string;
  help?: string;
  half?: boolean;
  /** Cannot be changed once the record exists. */
  lockOnEdit?: boolean;
  min?: number;
}
export interface ColumnDef {
  header: string;
  /** A field of the record (sortable, searchable). */
  key?: string;
  /** Computed text for the cell (used for search, sorting and export). */
  value?: (r: Row, db: Db) => string | number;
  /** Custom cell (badges, links). Falls back to `value` / `key`. */
  render?: (r: Row, db: Db) => React.ReactNode;
}
export interface StatDef { label: string; value: (rows: Row[], db: Db) => string | number; color: string }
export interface FilterDef { label: string; options: (string | Opt)[] | ((db: Db) => Opt[]); match: (r: Row, value: string, db: Db) => boolean }

export interface AdminCrudProps {
  collection: CollectionName;
  title: string;
  singular: string;
  icon: LucideIcon;
  description: string;
  columns: ColumnDef[];
  fields: FieldDef[];
  stats: StatDef[];
  filters?: FilterDef[];
  /** Starting values for a new record. */
  defaults?: (db: Db) => Record<string, any>;
  /** Last chance to adjust the data before it is saved (generate numbers, set status ...). */
  beforeSave?: (data: Record<string, any>, ctx: { editing: Row | null; db: Db }) => Record<string, any>;
  afterSave?: (row: Row, isNew: boolean) => void;
  /** Extra buttons on each row (Approve, Submit ...). */
  rowActions?: (r: Row, db: Db, notify: (t: 'ok' | 'err', text: string) => void) => React.ReactNode;
  canEditRow?: (r: Row) => boolean;
  canDeleteRow?: (r: Row) => boolean;
  /** Embedded in a tab: no big page title. */
  embedded?: boolean;
  addLabel?: string;
  hideAdd?: boolean;
  emptyHint?: string;
}

// ----------------------------------------------------------------------------- helpers
export const StatusBadge = ({ value }: { value: string }) => {
  const v = String(value || '');
  const cls = /^(active|available|approved|current|done|in use|open)$/i.test(v) ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    : /^(occupied|reserved|pending|under review|draft|in progress|cleaning)$/i.test(v) ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    : /^(rejected|out of service|maintenance|overdue|retired|over budget)$/i.test(v) ? 'bg-red-500/10 text-red-500 border-red-500/20'
    : 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  return <span className={`px-2 py-1 rounded text-xs font-medium border whitespace-nowrap ${cls}`}>{v || '-'}</span>;
};

const toOpts = (o: (string | Opt)[] = []): Opt[] => o.map((x) => (typeof x === 'string' ? { value: x, label: x } : x));
const errText = (e: unknown) => (e instanceof DbError ? e.message : 'Something went wrong. Please try again.');
const plain = (v: unknown) => (v === undefined || v === null ? '' : String(v));

function downloadCsv(name: string, headers: string[], lines: string[][]) {
  const cell = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const text = [headers.map(cell).join(','), ...lines.map((l) => l.map(cell).join(','))].join('\n');
  const url = URL.createObjectURL(new Blob([text], { type: 'text/csv' }));
  const a = document.createElement('a'); a.href = url; a.download = `${name}.csv`; a.click(); URL.revokeObjectURL(url);
}
export { downloadCsv };

// ----------------------------------------------------------------------------- component
export default function AdminCrud(p: AdminCrudProps) {
  const db = useDb();
  const rows = db[p.collection];
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const [search, setSearch] = useState('');
  const [filterVals, setFilterVals] = useState<Record<number, string>>({});
  const [editing, setEditing] = useState<Row | null | undefined>(undefined); // undefined = closed, null = new
  const [form, setForm] = useState<Record<string, any>>({});
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState<{ t: 'ok' | 'err'; text: string } | null>(null);
  const notify = (t: 'ok' | 'err', text: string) => setNotice({ t, text });

  const cellText = (c: ColumnDef, r: Row) => (c.value ? plain(c.value(r, db)) : c.key ? plain(r[c.key]) : '');

  const visible = useMemo(() => {
    let list = rows;
    (p.filters || []).forEach((f, i) => { const v = filterVals[i]; if (v) list = list.filter((r) => f.match(r, v, db)); });
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((r) => p.columns.some((c) => cellText(c, r).toLowerCase().includes(q)));
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, db, search, filterVals]);

  const openForm = (r: Row | null) => {
    const init: Record<string, any> = {};
    for (const f of p.fields) if (f.type !== 'heading') init[f.name] = r ? (r[f.name] ?? '') : '';
    if (!r && p.defaults) Object.assign(init, p.defaults(db));
    setForm(init); setFormError(''); setEditing(r);
  };

  const fieldOptions = (f: FieldDef): Opt[] => {
    if (f.from) return db[f.from.col].filter((r) => (f.from!.filter ? f.from!.filter(r, db) : true)).map((r) => ({ value: r.id, label: f.from!.label(r, db) }));
    return toOpts(f.options);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const missing = p.fields.find((f) => f.type !== 'heading' && f.required && plain(form[f.name]).trim() === '');
    if (missing) { setFormError(`${missing.label} is required`); return; }
    let data: Record<string, any> = { ...form };
    for (const f of p.fields) if (f.type === 'number' && plain(data[f.name]).trim() !== '') {
      const n = Number(data[f.name]);
      if (Number.isNaN(n)) { setFormError(`${f.label} must be a number`); return; }
      if (f.min !== undefined && n < f.min) { setFormError(`${f.label} cannot be less than ${f.min}`); return; }
      data[f.name] = n;
    }
    try {
      if (p.beforeSave) data = p.beforeSave(data, { editing: editing || null, db });
      const saved = editing ? update(p.collection, editing.id, data) : create(p.collection, data);
      p.afterSave?.(saved, !editing);
      setEditing(undefined);
      notify('ok', `${p.singular} ${editing ? 'updated' : 'created'} successfully`);
    } catch (err) { setFormError(errText(err)); }
  };

  const del = (r: Row) => {
    const label = cellText(p.columns[0], r) || p.singular;
    if (!window.confirm(`Delete ${p.singular.toLowerCase()} "${label}"? This cannot be undone.`)) return;
    try { remove(p.collection, r.id); notify('ok', `${p.singular} deleted`); } catch (err) { notify('err', errText(err)); }
  };

  const tableData = useMemo(() => visible.map((r) => {
    const x: Record<string, any> = { ...r };
    p.columns.forEach((c, i) => { x[`__c${i}`] = cellText(c, r); });
    return x;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [visible, db]);

  const tableColumns = useMemo(() => {
    const cols: any[] = p.columns.map((c, i) => (c.render
      ? { header: c.header, accessor: (row: any) => c.render!(rows.find((r) => r.id === row.id) || row, db) }
      : { header: c.header, accessor: `__c${i}`, sortable: true }));
    cols.push({
      header: 'Actions',
      accessor: (row: any) => {
        const r = rows.find((x) => x.id === row.id) || row;
        return (
          <div className="flex justify-end items-center gap-1">
            {p.rowActions?.(r, db, notify)}
            {(p.canEditRow ? p.canEditRow(r) : true) && <button title="Edit" onClick={() => openForm(r)} className="p-1.5 rounded text-gray-400 hover:text-blue-500 hover:bg-blue-500/10"><Pencil size={15} /></button>}
            {(p.canDeleteRow ? p.canDeleteRow(r) : true) && <button title="Delete" onClick={() => del(r)} className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-500/10"><Trash2 size={15} /></button>}
          </div>
        );
      },
    });
    return cols;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, db]);

  const inputCls = 'w-full px-3 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 disabled:opacity-60';
  const Icon = p.icon;

  if (!ready) return <div className="py-16 text-center text-sm text-gray-400">Loading {p.title.toLowerCase()}...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3 my-3">
        {p.embedded ? <p className="text-sm text-gray-400">{p.description}</p> : (
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Icon className="text-blue-500" size={24} />{p.title}</h1>
            <p className="text-sm text-gray-400 mt-1">{p.description}</p>
          </div>
        )}
        <div className="flex gap-3">
          <button
            onClick={() => downloadCsv(p.title, p.columns.map((c) => c.header), visible.map((r) => p.columns.map((c) => cellText(c, r))))}
            disabled={!visible.length}
            className="flex items-center gap-2 px-4 py-2 bg-dark-secondary border border-gray-700 rounded-lg text-sm font-medium hover:bg-dark-tertiary text-white disabled:opacity-50"
          ><Download size={16} /> Export CSV</button>
          {!p.hideAdd && (
            <button onClick={() => openForm(null)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20">
              <Plus size={16} /> {p.addLabel || `Add ${p.singular}`}
            </button>
          )}
        </div>
      </div>

      {notice && (
        <div className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm border ${notice.t === 'ok' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`} role="status">
          <span>{notice.text}</span><button onClick={() => setNotice(null)} className="text-xs underline">Dismiss</button>
        </div>
      )}

      {p.stats.length > 0 && (
        <div className={`grid grid-cols-1 gap-4 ${p.stats.length >= 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
          {p.stats.map((s) => (
            <div key={s.label} className="bg-dark-secondary rounded p-4 border border-gray-800">
              <p className="text-sm text-gray-400 font-medium">{s.label}</p>
              <p className={`text-2xl font-bold mt-2 ${s.color}`}>{s.value(rows, db)}</p>
            </div>
          ))}
        </div>
      )}

      <div>
        <div className="flex flex-wrap items-center gap-3 my-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder={`Search ${p.title.toLowerCase()}...`} value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-white w-64" />
          </div>
          {(p.filters || []).map((f, i) => (
            <select key={i} value={filterVals[i] || ''} onChange={(e) => setFilterVals((v) => ({ ...v, [i]: e.target.value }))}
              className="px-3 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500">
              <option value="">All {f.label}</option>
              {toOpts(typeof f.options === 'function' ? f.options(db) : f.options).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ))}
        </div>

        {rows.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center bg-dark-secondary border border-gray-800 rounded-lg">
            <Inbox className="text-gray-400" size={32} />
            <p className="text-white font-medium">No {p.title.toLowerCase()} yet</p>
            {p.emptyHint && <p className="text-sm text-gray-400 max-w-md">{p.emptyHint}</p>}
            {!p.hideAdd && <button onClick={() => openForm(null)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Add the first {p.singular.toLowerCase()}</button>}
          </div>
        ) : visible.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400 bg-dark-secondary border border-gray-800 rounded-lg">Nothing matches your search or filters.</div>
        ) : (
          <DataTable columns={tableColumns} data={tableData} />
        )}
      </div>

      <Modal isOpen={editing !== undefined} onClose={() => setEditing(undefined)} title={`${editing ? 'Edit' : 'Add'} ${p.singular}`} size="3xl">
        <form onSubmit={save} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            {p.fields.map((f) => f.type === 'heading' ? (
              <h3 key={f.name} className="col-span-2 text-sm font-semibold text-blue-400 border-b border-gray-700/50 pb-1 mt-2">{f.label}</h3>
            ) : (
              <label key={f.name} className={`block ${f.half ? 'col-span-1' : 'col-span-2'}`}>
                <span className="block text-sm font-medium text-gray-300 mb-1">{f.label}{f.required && <span className="text-red-500"> *</span>}</span>
                {f.type === 'select' ? (
                  <select value={form[f.name] ?? ''} disabled={!!editing && f.lockOnEdit} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} className={inputCls}>
                    <option value="">{f.required ? `Select ${f.label.toLowerCase()}` : 'None'}</option>
                    {fieldOptions(f).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : f.type === 'textarea' ? (
                  <textarea rows={3} value={form[f.name] ?? ''} placeholder={f.placeholder} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} className={inputCls} />
                ) : (
                  <input type={f.type || 'text'} value={form[f.name] ?? ''} placeholder={f.placeholder} min={f.min} disabled={!!editing && f.lockOnEdit}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} className={inputCls} />
                )}
                {f.help && <span className="block text-xs text-gray-500 mt-1">{f.help}</span>}
              </label>
            ))}
          </div>
          {formError && <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2" role="alert">{formError}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setEditing(undefined)} className="px-4 py-2 border border-gray-700 rounded-lg text-sm text-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">{editing ? 'Save changes' : `Create ${p.singular.toLowerCase()}`}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
