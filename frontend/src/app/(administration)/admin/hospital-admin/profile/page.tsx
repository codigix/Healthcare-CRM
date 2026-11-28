"use client";

import React, { useEffect, useState } from 'react';
import { Building2, Save } from 'lucide-react';
import { useDb, saveProfile, DbError } from '@/data/db';
import { fmtDate } from '@/data/actions';
import { PageHeader, Panel, useMounted } from '@/features/admin/ui';

type F = { name: string; label: string; type?: string; required?: boolean; half?: boolean; placeholder?: string; help?: string };
const SECTIONS: { title: string; fields: F[] }[] = [
  { title: 'Basic details', fields: [
    { name: 'name', label: 'Hospital name', required: true }, { name: 'type', label: 'Hospital type', placeholder: 'e.g. Multi-speciality', half: true },
    { name: 'registrationNo', label: 'Registration number', half: true }, { name: 'gstNumber', label: 'GST number', half: true, help: '15 characters' },
    { name: 'establishedYear', label: 'Established year', type: 'number', half: true }, { name: 'licensedBeds', label: 'Licensed bed capacity', type: 'number', half: true }, { name: 'accreditation', label: 'Accreditation', half: true, placeholder: 'e.g. NABH' },
  ] },
  { title: 'Contact', fields: [{ name: 'email', label: 'Email', type: 'email', half: true }, { name: 'phone', label: 'Phone', type: 'tel', half: true }, { name: 'website', label: 'Website', half: true }] },
  { title: 'Address', fields: [{ name: 'address', label: 'Address' }, { name: 'city', label: 'City', half: true }, { name: 'state', label: 'State', half: true }, { name: 'pincode', label: 'PIN code', half: true }] },
];

export default function HospitalProfilePage() {
  const db = useDb();
  const mounted = useMounted();
  const profile = db.hospitalProfile[0];
  const [form, setForm] = useState<Record<string, any>>({});
  const [msg, setMsg] = useState<{ t: 'ok' | 'err'; text: string } | null>(null);
  useEffect(() => { if (mounted) setForm({ ...(profile || {}) }); }, [mounted, profile?.id, profile?.updatedAt]);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const v = (k: string) => String(form[k] ?? '').trim();
    if (!v('name')) return setMsg({ t: 'err', text: 'Hospital name is required' });
    if (v('email') && !/^\S+@\S+\.\S+$/.test(v('email'))) return setMsg({ t: 'err', text: 'Enter a valid email address' });
    if (v('pincode') && !/^\d{6}$/.test(v('pincode'))) return setMsg({ t: 'err', text: 'PIN code must be 6 digits' });
    if (v('gstNumber') && !/^[0-9A-Za-z]{15}$/.test(v('gstNumber'))) return setMsg({ t: 'err', text: 'GST number must be 15 letters and digits' });
    if (v('phone') && !/^[0-9+()\-\s]{7,15}$/.test(v('phone'))) return setMsg({ t: 'err', text: 'Enter a valid phone number' });
    if (v('establishedYear') && (Number(v('establishedYear')) < 1800 || Number(v('establishedYear')) > new Date().getFullYear())) return setMsg({ t: 'err', text: 'Enter a valid established year' });
    try {
      const data = { ...form, establishedYear: v('establishedYear') === '' ? '' : Number(v('establishedYear')), licensedBeds: v('licensedBeds') === '' ? '' : Number(v('licensedBeds')) };
      saveProfile(data); setMsg({ t: 'ok', text: 'Hospital profile saved' });
    } catch (err) { setMsg({ t: 'err', text: err instanceof DbError ? err.message : 'Could not save' }); }
  };

  const inputCls = 'w-full px-3 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500';
  if (!mounted) return <div className="py-16 text-center text-sm text-gray-400">Loading...</div>;
  return (
    <div className="space-y-6">
      <PageHeader icon={Building2} step="Step 1 · Hospital Setup" title="Hospital Profile" description="Official details of the hospital, used on bills, reports and documents." />
      {msg && <div className={`px-4 py-3 rounded-lg text-sm border ${msg.t === 'ok' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`} role={msg.t === 'ok' ? 'status' : 'alert'}>{msg.text}</div>}
      <form onSubmit={save} noValidate className="space-y-6">
        {SECTIONS.map((s) => (
          <Panel key={s.title} title={s.title}>
            <div className="grid grid-cols-2 gap-4">
              {s.fields.map((f) => (
                <label key={f.name} className={`block ${f.half ? 'col-span-2 md:col-span-1' : 'col-span-2'}`}>
                  <span className="block text-sm font-medium text-gray-300 mb-1">{f.label}{f.required && <span className="text-red-500"> *</span>}</span>
                  <input type={f.type || 'text'} value={form[f.name] ?? ''} placeholder={f.placeholder} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} className={inputCls} />
                  {f.help && <span className="block text-xs text-gray-500 mt-1">{f.help}</span>}
                </label>
              ))}
            </div>
          </Panel>
        ))}
        <Panel title="About the hospital">
          <textarea rows={4} value={form.about ?? ''} onChange={(e) => setForm({ ...form, about: e.target.value })} className={inputCls} placeholder="A short description for reports and the patient portal" />
        </Panel>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{profile ? `Last saved ${fmtDate(profile.updatedAt)}` : 'Not saved yet'}</span>
          <button type="submit" className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"><Save size={16} /> Save profile</button>
        </div>
      </form>
    </div>
  );
}
