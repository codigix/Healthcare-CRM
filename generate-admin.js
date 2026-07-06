const fs = require('fs');
const path = require('path');

const adminPages = [
  { path: 'hospital', title: 'Hospital Management', desc: 'Manage hospital branches and facilities.' },
  { path: 'department', title: 'Department Management', desc: 'Manage clinical and non-clinical departments.' },
  { path: 'employee', title: 'Employee Administration', desc: 'Manage hospital staff and records.' },
  { path: 'doctor', title: 'Doctor Administration', desc: 'Manage doctors and specialists.' },
  { path: 'patient', title: 'Patient Administration', desc: 'Manage patient records and demographics.' },
  { path: 'operation', title: 'Operation Management', desc: 'Manage daily hospital operations.' },
  { path: 'approval', title: 'Approval Center', desc: 'Pending approvals and requests.' },
  { path: 'policy', title: 'Policy & SOP Management', desc: 'Hospital policies and standard operating procedures.' },
  { path: 'committee', title: 'Committee Management', desc: 'Hospital committees and meetings.' },
  { path: 'incident', title: 'Incident Management', desc: 'Track and resolve hospital incidents.' },
  { path: 'resource', title: 'Resource Management', desc: 'Manage hospital resources and assets.' },
  { path: 'calendar', title: 'Hospital Calendar', desc: 'Events and schedules.' },
  { path: 'communication', title: 'Communication Center', desc: 'Internal hospital communication.' },
  { path: 'vendor', title: 'Vendor Administration', desc: 'Manage suppliers and vendors.' },
  { path: 'compliance', title: 'Compliance', desc: 'Regulatory and compliance tracking.' },
  { path: 'reports/daily', title: 'Daily Hospital Report', desc: 'Daily operational reports.' },
  { path: 'reports/bed', title: 'Bed Occupancy Report', desc: 'Bed availability and occupancy rates.' },
  { path: 'reports/department', title: 'Department Performance', desc: 'Departmental KPIs and metrics.' },
  { path: 'reports/doctor', title: 'Doctor Performance', desc: 'Doctor KPIs and metrics.' },
  { path: 'reports/patient', title: 'Patient Statistics', desc: 'Patient demographics and stats.' },
  { path: 'reports/incident', title: 'Incident Reports', desc: 'Detailed incident reporting.' },
  { path: 'reports/admin', title: 'Administrative Reports', desc: 'General administrative reports.' },
  { path: 'analytics', title: 'Analytics', desc: 'Advanced data analytics.' },
  { path: 'settings', title: 'Settings', desc: 'Admin module settings.' },
];

const basePath = path.join(__dirname, 'frontend', 'src', 'app', 'admin');

if (!fs.existsSync(basePath)) {
  fs.mkdirSync(basePath, { recursive: true });
}

const template = (title, desc, name) => `"use client";

import React, { useState } from 'react';
import { Activity, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function ${name}Page() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'ID', accessor: 'id', sortable: true },
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'Status', accessor: 'status', sortable: true },
    { header: 'Last Updated', accessor: 'updatedAt', sortable: true },
    { 
      header: 'Actions', 
      accessor: (row: any) => (
        <div className="flex justify-end gap-2">
          <button className="p-1 hover:bg-dark-tertiary rounded text-gray-400 hover:text-white transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      )
    }
  ];

  const mockData = Array.from({ length: 12 }).map((_, i) => ({
    id: \`\${title.substring(0, 3).toUpperCase()}-\${1000 + i}\`,
    name: \`Sample \${title} \${i + 1}\`,
    status: i % 3 === 0 ? 'Pending' : 'Active',
    updatedAt: new Date(Date.now() - i * 86400000).toLocaleDateString()
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3 my-3">
        <div>
          <h1 className="text-2xl  text-white">${title}</h1>
          <p className="text-sm text-gray-400 mt-1">${desc}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-dark-secondary border border-gray-700 rounded text-sm font-medium hover:bg-dark-tertiary transition-colors text-white">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm font-medium shadow-lg shadow-emerald-500/20 transition-all">
            <Plus size={16} /> Add New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Records', value: '1,234', color: 'text-blue-400' },
          { label: 'Active', value: '856', color: 'text-emerald-400' },
          { label: 'Pending Review', value: '45', color: 'text-amber-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
            <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
            <p className={\`text-2xl  mt-2 \${stat.color}\`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="">
        <div className="flex justify-between items-center my-3 my-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search records..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-dark-tertiary border border-gray-700 rounded text-sm focus:outline-none focus:border-emerald-500 text-white w-64 transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 p-2 bg-dark-tertiary border border-gray-700 rounded text-sm hover:bg-gray-800 transition-colors text-white">
            <Filter size={16} /> Filter
          </button>
        </div>
        <DataTable 
          columns={columns} 
          data={mockData} 
          searchTerm={searchTerm} 
        />
      </div>
    </div>
  );
}`;

adminPages.forEach(page => {
  const dir = path.join(basePath, page.path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const componentName = page.title.replace(/[^a-zA-Z0-9]/g, '');
  const filePath = path.join(dir, 'page.tsx');

  fs.writeFileSync(filePath, template(page.title, page.desc, componentName));
  console.log(`Created ${page.path}/page.tsx`);
});

console.log('All admin pages generated successfully!');
