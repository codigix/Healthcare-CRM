"use client";

import React, { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';

export function PageHeader({ icon: Icon, title, description, step }: { icon: LucideIcon; title: string; description: string; step?: string }) {
  return (
    <div className="my-3">
      {step && <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">{step}</p>}
      <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Icon className="text-blue-500" size={24} />{title}</h1>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
  );
}

export interface TabDef { id: string; label: string; node: React.ReactNode }
export function Tabs({ tabs }: { tabs: TabDef[] }) {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active) || tabs[0];
  return (
    <div className="space-y-4">
      <div className="flex gap-1 border-b border-gray-700/60" role="tablist">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={t.id === active} onClick={() => setActive(t.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${t.id === active ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div key={current.id}>{current.node}</div>
    </div>
  );
}

export function Panel({ title, actions, children }: { title: string; actions?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-dark-secondary border border-gray-800 rounded-lg">
      <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-gray-800">
        <h2 className="text-sm font-semibold text-white">{title}</h2>{actions}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Meter({ value, warn = 85 }: { value: number; warn?: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-2 min-w-[110px]" title={`${value}%`}>
      <div className="flex-1 h-2 rounded-full bg-gray-500/20 overflow-hidden"><div className={`h-full rounded-full ${value > 100 ? 'bg-red-500' : value >= warn ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${v}%` }} /></div>
      <span className="text-xs text-gray-400 w-9 text-right">{value}%</span>
    </div>
  );
}

/** True after the first browser render: the saved data is only available then (avoids a flash of "0"). */
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

export const Tile = ({ label, value, color = 'text-blue-400', note }: { label: string; value: React.ReactNode; color?: string; note?: string }) => (
  <div className="bg-dark-secondary rounded p-4 border border-gray-800">
    <p className="text-sm text-gray-400 font-medium">{label}</p>
    <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
    {note && <p className="text-xs text-gray-500 mt-1">{note}</p>}
  </div>
);
