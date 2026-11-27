"use client";

import React, { useEffect, useState } from 'react';
import { Building2, Save, AlertTriangle, GitBranch, Layers, Activity, DoorOpen, BedDouble } from 'lucide-react';
import { hospitalAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

const ADMIN_LEVEL = ['superadmin', 'super admin', 'admin', 'administration', 'administrator'];
const FIELDS: { name: string; label: string; type?: string; required?: boolean; full?: boolean }[] = [
  { name: 'name', label: 'Hospital name', required: true, full: true },
  { name: 'registrationNo', label: 'Registration number' }, { name: 'type', label: 'Hospital type (e.g. Multi-speciality)' },
  { name: 'email', label: 'Email', type: 'email' }, { name: 'phone', label: 'Phone' },
  { name: 'website', label: 'Website' }, { name: 'gstNumber', label: 'GST number' },
  { name: 'address', label: 'Address', full: true },
  { name: 'city', label: 'City' }, { name: 'state', label: 'State' }, { name: 'pincode', label: 'PIN code' },
  { name: 'establishedYear', label: 'Established year', type: 'number' }, { name: 'totalBedCapacity', label: 'Licensed bed capacity', type: 'number' },
];

export default function HospitalProfilePage() {
  const user = useAuthStore((s) => s.user);
  const canEdit = ADMIN_LEVEL.includes(String(user?.role || '').toLowerCase()) || ADMIN_LEVEL.includes(String(user?.department || '').toLowerCase());
  const [form, setForm] = useState<Record<string, any>>({});
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [p, s] = await Promise.all([hospitalAPI.getProfile(), hospitalAPI.summary()]);
        setForm(p.data || {}); setSummary(s.data);
      } catch (e: any) { setMessage({ type: 'err', text: e?.response?.data?.error || 'Could not load the hospital profile. Is the backend running?' }); }
      finally { setLoading(false); }
    })();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!String(form.name || '').trim()) { setMessage({ type: 'err', text: 'Hospital name is required' }); return; }
    setSaving(true); setMessage(null);
    try {
      const payload = Object.fromEntries(FIELDS.map((f) => [f.name, form[f.name] ?? '']));
      const res = await hospitalAPI.saveProfile(payload);
      setForm(res.data); setMessage({ type: 'ok', text: 'Hospital profile saved' });
    } catch (err: any) { setMessage({ type: 'err', text: err?.response?.data?.error || 'Could not save the profile' }); }
    finally { setSaving(false); }
  };

  const tiles = summary ? [
    { label: 'Branches', value: summary.branches, icon: GitBranch }, { label: 'Floors', value: summary.floors, icon: Layers },
    { label: 'Wards', value: summary.wards, icon: Activity }, { label: 'Rooms', value: summary.rooms, icon: DoorOpen },
    { label: 'Beds', value: summary.beds, icon: BedDouble }, { label: 'Beds available', value: summary.availableBeds, icon: BedDouble },
  ] : [];
  const inputCls = 'w-full px-3 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 disabled:opacity-70';

  return (
    <div className="space-y-6">
      <div className="my-3">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Building2 className="text-blue-500" size={24} />Hospital Profile</h1>
        <p className="text-sm text-gray-400 mt-1">Official details of the hospital, shown on invoices, reports and patient documents.</p>
      </div>

      {tiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {tiles.map((t) => (
            <div key={t.label} className="bg-dark-secondary rounded p-4 border border-gray-800">
              <p className="text-sm text-gray-400 font-medium flex items-center gap-1.5"><t.icon size={14} />{t.label}</p>
              <p className="text-2xl font-bold mt-2 text-blue-400">{t.value}</p>
            </div>
          ))}
        </div>
      )}

      {message && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm border ${message.type === 'ok' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
          {message.type === 'err' && <AlertTriangle size={16} />}{message.text}
        </div>
      )}

      <form onSubmit={save} className="bg-dark-secondary border border-gray-800 rounded-lg p-6 space-y-4">
        {loading ? <p className="text-sm text-gray-400">Loading…</p> : (
          <>
            {!form.id && canEdit && <p className="text-sm text-amber-500">No hospital profile has been saved yet. Fill in the details and save.</p>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {FIELDS.map((f) => (
                <label key={f.name} className={`block ${f.full ? 'md:col-span-3' : ''}`}>
                  <span className="block text-sm font-medium text-gray-300 mb-1">{f.label}{f.required && <span className="text-red-500"> *</span>}</span>
                  <input type={f.type || 'text'} value={form[f.name] ?? ''} disabled={!canEdit}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} className={inputCls} />
                </label>
              ))}
            </div>
            {canEdit ? (
              <div className="flex justify-end">
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-60">
                  <Save size={16} /> {saving ? 'Saving…' : 'Save profile'}
                </button>
              </div>
            ) : <p className="text-sm text-gray-400">Only administrators can change these details.</p>}
          </>
        )}
      </form>
    </div>
  );
}
