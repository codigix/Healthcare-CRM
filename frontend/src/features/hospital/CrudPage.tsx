"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Search, Download, Pencil, Trash2, RefreshCw, AlertTriangle, Inbox } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';
import Modal from '@/components/UI/Modal';
import { hospitalAPI, type HospitalEntity } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

// ----------------------------------------------------------------------------- types
export interface Option { value: string; label: string }
export interface FieldDef {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'email' | 'textarea' | 'select';
  required?: boolean;
  options?: string[] | Option[];
  /** Load select options from another hospital entity, e.g. the parent branch list. */
  optionsFrom?: { entity: HospitalEntity; label: (row: any) => string };
  placeholder?: string;
  defaultValue?: string | number;
  /** Fields shown side by side take half width. */
  half?: boolean;
}
/** `key` = plain field (sortable, searchable, exported); `render` = custom cell (searched/exported via `key` when given). */
export interface ColumnDef { header: string; key?: string; render?: (row: any) => React.ReactNode }
const cellText = (c: ColumnDef, row: any): string => {
  if (c.key) return row[c.key] == null ? '' : String(row[c.key]);
  const v = c.render ? c.render(row) : '';
  return typeof v === 'string' || typeof v === 'number' ? String(v) : '';
};
export interface FilterDef { param: string; label: string; options?: string[]; optionsFrom?: FieldDef['optionsFrom'] }
export interface StatDef { label: string; value: (rows: any[]) => string | number; color: string }

interface Props {
  entity: HospitalEntity;
  title: string;
  description: string;
  icon: LucideIcon;
  singular: string;
  columns: ColumnDef[];
  fields: FieldDef[];
  stats: StatDef[];
  filters?: FilterDef[];
}

const ADMIN_LEVEL = ['superadmin', 'super admin', 'admin', 'administration', 'administrator'];

const STATUS_STYLE: Record<string, string> = {
  Active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  Available: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  Occupied: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Reserved: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  Cleaning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  Maintenance: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  Inactive: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  'Out of Service': 'bg-red-500/10 text-red-500 border-red-500/20',
};
export const StatusBadge = ({ value }: { value: string }) => (
  <span className={`px-2 py-1 rounded text-xs font-medium border ${STATUS_STYLE[value] || STATUS_STYLE.Inactive}`}>{value}</span>
);

const errorText = (e: any) => e?.response?.data?.error || (e?.code === 'ERR_NETWORK' ? 'Cannot reach the server. Is the backend running?' : 'Something went wrong. Please try again.');
const toOptions = (o: string[] | Option[] = []): Option[] => o.map((x: any) => (typeof x === 'string' ? { value: x, label: x } : x));

function downloadCsv(name: string, columns: ColumnDef[], rows: any[]) {
  const cell = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = [columns.map((c) => cell(c.header)).join(','), ...rows.map((r) => columns.map((c) => cell(cellText(c, r))).join(','))];
  const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' }));
  const a = document.createElement('a'); a.href = url; a.download = `${name}.csv`; a.click(); URL.revokeObjectURL(url);
}

// ----------------------------------------------------------------------------- component
export default function CrudPage({ entity, title, description, icon: Icon, singular, columns, fields, stats, filters = [] }: Props) {
  const user = useAuthStore((s) => s.user);
  const canEdit = ADMIN_LEVEL.includes(String(user?.role || '').toLowerCase()) || ADMIN_LEVEL.includes(String(user?.department || '').toLowerCase());

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [options, setOptions] = useState<Record<string, Option[]>>({});

  const [editing, setEditing] = useState<any | null>(null); // {} = new, row = edit
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setLoadError('');
    try {
      const params = Object.fromEntries(Object.entries(filterValues).filter(([, v]) => v));
      const res = await hospitalAPI.list(entity, params);
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (e) { setLoadError(errorText(e)); }
    finally { setLoading(false); }
  }, [entity, filterValues]);
  useEffect(() => { load(); }, [load]);

  // Parent lists for selects and filters (e.g. branches for the building form).
  useEffect(() => {
    const sources = [...fields.map((f) => f.optionsFrom), ...filters.map((f) => f.optionsFrom)].filter(Boolean) as NonNullable<FieldDef['optionsFrom']>[];
    const unique = Array.from(new Map(sources.map((s) => [s.entity, s])).values());
    unique.forEach(async (s) => {
      try {
        const res = await hospitalAPI.list(s.entity);
        setOptions((o) => ({ ...o, [s.entity]: (res.data || []).map((r: any) => ({ value: r.id, label: s.label(r) })) }));
      } catch { /* the form shows an empty list; saving will report the problem */ }
    });
  }, [fields, filters]);

  const openForm = (row: any | null) => {
    const initial: Record<string, any> = {};
    for (const f of fields) initial[f.name] = row ? (row[f.name] ?? '') : (f.defaultValue ?? '');
    setForm(initial); setFormError(''); setEditing(row || {});
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = fields.find((f) => f.required && String(form[f.name] ?? '').trim() === '');
    if (missing) { setFormError(`${missing.label} is required`); return; }
    setSaving(true); setFormError('');
    try {
      if (editing?.id) await hospitalAPI.update(entity, editing.id, form);
      else await hospitalAPI.create(entity, form);
      setEditing(null);
      setNotice({ type: 'ok', text: `${singular} ${editing?.id ? 'updated' : 'created'} successfully` });
      await load();
    } catch (err) { setFormError(errorText(err)); }
    finally { setSaving(false); }
  };

  const remove = async (row: any) => {
    const label = row.name || row.roomNumber || row.bedNumber || singular;
    if (!window.confirm(`Delete ${singular.toLowerCase()} "${label}"? This cannot be undone.`)) return;
    try {
      await hospitalAPI.remove(entity, row.id);
      setNotice({ type: 'ok', text: `${singular} deleted` });
      await load();
    } catch (err) { setNotice({ type: 'err', text: errorText(err) }); }
  };

  const tableColumns = useMemo(() => {
    const cols: any[] = columns.map((c) => (c.render ? { header: c.header, accessor: (row: any) => c.render!(row) } : { header: c.header, accessor: c.key, sortable: true }));
    if (canEdit) cols.push({
      header: 'Actions',
      accessor: (row: any) => (
        <div className="flex justify-end gap-1">
          <button title="Edit" onClick={() => openForm(row)} className="p-1.5 rounded text-gray-400 hover:text-blue-500 hover:bg-blue-500/10"><Pencil size={15} /></button>
          <button title="Delete" onClick={() => remove(row)} className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-500/10"><Trash2 size={15} /></button>
        </div>
      ),
    });
    return cols;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, canEdit]);

  // Text search across every column's visible value.
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => columns.some((c) => cellText(c, r).toLowerCase().includes(q)));
  }, [rows, search, columns]);

  const fieldOptions = (f: FieldDef) => {
    const list = f.optionsFrom ? options[f.optionsFrom.entity] || [] : toOptions(f.options);
    const current = String(form[f.name] ?? '');
    // Keep an existing value selectable even if it is not in the standard list (older data).
    return current && !f.optionsFrom && !list.some((o) => o.value === current) ? [...list, { value: current, label: current }] : list;
  };
  const inputCls = 'w-full px-3 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3 my-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Icon className="text-blue-500" size={24} />{title}</h1>
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => downloadCsv(title, columns, visible)} disabled={!visible.length} className="flex items-center gap-2 px-4 py-2 bg-dark-secondary border border-gray-700 rounded-lg text-sm font-medium hover:bg-dark-tertiary text-white disabled:opacity-50">
            <Download size={16} /> Export
          </button>
          {canEdit && (
            <button onClick={() => openForm(null)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20">
              <Plus size={16} /> Add {singular}
            </button>
          )}
        </div>
      </div>

      {notice && (
        <div className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm border ${notice.type === 'ok' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
          <span>{notice.text}</span>
          <button onClick={() => setNotice(null)} className="text-xs underline">Dismiss</button>
        </div>
      )}

      <div className={`grid grid-cols-1 gap-4 ${stats.length >= 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
        {stats.map((s) => (
          <div key={s.label} className="bg-dark-secondary rounded p-4 border border-gray-800">
            <p className="text-sm text-gray-400 font-medium">{s.label}</p>
            <p className={`text-2xl font-bold mt-2 ${s.color}`}>{loading ? '…' : s.value(rows)}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex flex-wrap justify-between items-center gap-3 my-3">
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder={`Search ${title.toLowerCase()}...`} value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-white w-64" />
            </div>
            {filters.map((f) => (
              <select key={f.param} value={filterValues[f.param] || ''} onChange={(e) => setFilterValues((v) => ({ ...v, [f.param]: e.target.value }))}
                className="px-3 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500">
                <option value="">All {f.label}</option>
                {(f.optionsFrom ? options[f.optionsFrom.entity] || [] : toOptions(f.options)).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ))}
          </div>
          <button onClick={load} className="flex items-center gap-2 px-3 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm hover:bg-gray-800 text-white">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {loadError ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center bg-dark-secondary border border-gray-800 rounded-lg">
            <AlertTriangle className="text-red-500" size={32} />
            <p className="text-white font-medium">Could not load {title.toLowerCase()}</p>
            <p className="text-sm text-gray-400">{loadError}</p>
            <button onClick={load} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Try again</button>
          </div>
        ) : !loading && rows.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center bg-dark-secondary border border-gray-800 rounded-lg">
            <Inbox className="text-gray-400" size={32} />
            <p className="text-white font-medium">No {title.toLowerCase()} yet</p>
            {canEdit && <button onClick={() => openForm(null)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Add the first {singular.toLowerCase()}</button>}
          </div>
        ) : (
          <DataTable columns={tableColumns} data={visible} isLoading={loading} />
        )}
      </div>

      <Modal isOpen={editing !== null} onClose={() => !saving && setEditing(null)} title={`${editing?.id ? 'Edit' : 'Add'} ${singular}`} size="2xl">
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {fields.map((f) => (
              <label key={f.name} className={`block ${f.half ? 'col-span-1' : 'col-span-2'}`}>
                <span className="block text-sm font-medium text-gray-300 mb-1">{f.label}{f.required && <span className="text-red-500"> *</span>}</span>
                {f.type === 'select' ? (
                  <select value={form[f.name] ?? ''} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} className={inputCls}>
                    <option value="">Select {f.label.toLowerCase()}</option>
                    {fieldOptions(f).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : f.type === 'textarea' ? (
                  <textarea rows={3} value={form[f.name] ?? ''} placeholder={f.placeholder} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} className={inputCls} />
                ) : (
                  <input type={f.type || 'text'} value={form[f.name] ?? ''} placeholder={f.placeholder} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} className={inputCls} />
                )}
              </label>
            ))}
          </div>
          {formError && <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{formError}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setEditing(null)} disabled={saving} className="px-4 py-2 border border-gray-700 rounded-lg text-sm text-gray-300">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-60">
              {saving ? 'Saving…' : editing?.id ? 'Save changes' : `Create ${singular.toLowerCase()}`}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
