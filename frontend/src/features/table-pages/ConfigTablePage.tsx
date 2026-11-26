"use client";

import React, { useState } from 'react';
import { LayoutGrid, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';
import type { BadgeColor, TablePageData } from './types';

// Status badge colours. Each page's config says which colour its status values use.
const BADGE_CLASS: Record<BadgeColor, string> = {
  emerald: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
  amber: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  red: 'bg-red-500/10 text-red-500 border border-red-500/20',
  gray: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
};

export default function ConfigTablePage({ ui, title, description, stats, columns: plain, badge, actions, rows }: TablePageData) {
  const [searchTerm, setSearchTerm] = useState('');
  const [headerClass, cardClass, toolbarClass] = ui;

  const columns: any[] = plain.map(([header, field]) => ({ header, accessor: field, sortable: true }));
  if (badge) {
    const [header, field, colors] = badge;
    columns.push({
      header,
      accessor: (row: any) => (
        <span className={"px-2 py-1 rounded text-xs font-medium " + BADGE_CLASS[colors[String(row[field])] ?? 'gray']}>
          {row[field]}
        </span>
      ),
      sortable: true,
    });
  }
  if (actions != null) {
    columns.push({
      header: actions,
      accessor: () => (
        <div className="flex justify-end gap-2">
          <button className="p-1.5 hover:bg-dark-tertiary rounded text-gray-400 hover:text-white transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      ),
    });
  }

  return (
    <div className="space-y-6">
      <div className={headerClass}>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            {title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-dark-secondary border border-gray-700 rounded-lg text-sm font-medium hover:bg-dark-tertiary transition-colors text-white">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20 transition-all">
            <Plus size={16} /> Create New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div key={i} className={cardClass}>
            <p className="text-sm text-gray-400 font-medium">{s.label}</p>
            <p className={"text-2xl font-bold mt-2 " + s.color}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="">
        <div className={toolbarClass}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-white w-64 transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm hover:bg-gray-800 transition-colors text-white">
            <Filter size={16} /> Filter
          </button>
        </div>
        <DataTable
          columns={columns}
          data={rows}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
}
