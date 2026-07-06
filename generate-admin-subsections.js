const fs = require('fs');
const path = require('path');

const sections = [
  // Department Management
  {
    path: 'department/list', title: 'Departments Directory', desc: 'Comprehensive list of all departments.',
    cols: ['Dept ID', 'Department Name', 'Category', 'HOD', 'Staff Count', 'Status'],
    stats: [{ label: 'Total Departments', val: '42', col: 'text-blue-400' }, { label: 'Clinical', val: '28', col: 'text-emerald-400' }, { label: 'Non-Clinical', val: '14', col: 'text-purple-400' }]
  },
  {
    path: 'department/specialties', title: 'Specialties', desc: 'Manage medical and surgical specialties.',
    cols: ['Specialty ID', 'Specialty Name', 'Department', 'Lead Specialist', 'Total Consultants', 'Status'],
    stats: [{ label: 'Total Specialties', val: '36', col: 'text-blue-400' }, { label: 'Surgical', val: '14', col: 'text-red-400' }, { label: 'Medical', val: '22', col: 'text-emerald-400' }]
  },
  {
    path: 'department/units', title: 'Clinical Units', desc: 'Sub-divisions within clinical departments.',
    cols: ['Unit ID', 'Unit Name', 'Parent Dept', 'Unit Head', 'Beds Allocated', 'Status'],
    stats: [{ label: 'Total Units', val: '86', col: 'text-blue-400' }, { label: 'ICU Units', val: '12', col: 'text-red-400' }, { label: 'General Units', val: '74', col: 'text-emerald-400' }]
  },
  {
    path: 'department/cost-centers', title: 'Cost Centers', desc: 'Financial tracking for departments.',
    cols: ['Cost Center ID', 'Name', 'Department', 'Budget Allocated', 'Current Spend', 'Status'],
    stats: [{ label: 'Total Centers', val: '45', col: 'text-blue-400' }, { label: 'Over Budget', val: '3', col: 'text-red-400' }, { label: 'On Track', val: '42', col: 'text-emerald-400' }]
  },
  {
    path: 'department/heads', title: 'Department Heads', desc: 'Manage HODs and leadership.',
    cols: ['Emp ID', 'Name', 'Department', 'Appointed Date', 'Term End', 'Status'],
    stats: [{ label: 'Total Heads', val: '42', col: 'text-blue-400' }, { label: 'Clinical HODs', val: '28', col: 'text-emerald-400' }, { label: 'Interim Heads', val: '4', col: 'text-amber-400' }]
  },
  // Employee Administration
  {
    path: 'employee/directory', title: 'Employee Directory', desc: 'Complete staff database.',
    cols: ['Emp ID', 'Name', 'Designation', 'Department', 'Contact', 'Status'],
    stats: [{ label: 'Total Employees', val: '1,240', col: 'text-blue-400' }, { label: 'Medical Staff', val: '850', col: 'text-emerald-400' }, { label: 'Support Staff', val: '390', col: 'text-purple-400' }]
  },
  {
    path: 'employee/allocation', title: 'Department Allocation', desc: 'Staff deployment across departments.',
    cols: ['Allocation ID', 'Employee Name', 'Primary Dept', 'Secondary Dept', 'FTE', 'Status'],
    stats: [{ label: 'Total Allocations', val: '1,320', col: 'text-blue-400' }, { label: 'Cross-functional', val: '80', col: 'text-amber-400' }, { label: 'Pending Requests', val: '14', col: 'text-red-400' }]
  },
  {
    path: 'employee/transfers', title: 'Staff Transfers', desc: 'Manage internal department transfers.',
    cols: ['Transfer ID', 'Employee', 'From Dept', 'To Dept', 'Effective Date', 'Status'],
    stats: [{ label: 'Total Transfers', val: '245', col: 'text-blue-400' }, { label: 'Pending Approval', val: '12', col: 'text-amber-400' }, { label: 'Completed', val: '233', col: 'text-emerald-400' }]
  },
  {
    path: 'employee/duty', title: 'Duty Assignment', desc: 'Shift and roster management.',
    cols: ['Roster ID', 'Employee', 'Department', 'Shift Type', 'Week', 'Status'],
    stats: [{ label: 'Active Rosters', val: '1,240', col: 'text-blue-400' }, { label: 'Night Shifts', val: '280', col: 'text-indigo-400' }, { label: 'On Leave', val: '45', col: 'text-amber-400' }]
  },
  {
    path: 'employee/id-cards', title: 'ID Cards', desc: 'Staff identity card issuance.',
    cols: ['Card ID', 'Employee', 'Card Type', 'Issued Date', 'Valid Until', 'Status'],
    stats: [{ label: 'Active Cards', val: '1,240', col: 'text-emerald-400' }, { label: 'Expiring Soon', val: '85', col: 'text-amber-400' }, { label: 'Revoked', val: '12', col: 'text-red-400' }]
  },
  // Doctor Administration
  {
    path: 'doctor/directory', title: 'Doctor Directory', desc: 'Comprehensive list of all doctors.',
    cols: ['Dr ID', 'Name', 'Specialty', 'Experience', 'Consultation Fee', 'Status'],
    stats: [{ label: 'Total Doctors', val: '320', col: 'text-blue-400' }, { label: 'Senior Consultants', val: '85', col: 'text-indigo-400' }, { label: 'Resident Doctors', val: '235', col: 'text-emerald-400' }]
  },
  {
    path: 'doctor/schedule', title: 'Doctor Schedule', desc: 'OPD and IPD timings.',
    cols: ['Schedule ID', 'Doctor Name', 'Department', 'Day', 'Timing', 'Status'],
    stats: [{ label: 'Total Schedules', val: '1,840', col: 'text-blue-400' }, { label: 'Morning OPD', val: '840', col: 'text-emerald-400' }, { label: 'Evening OPD', val: '620', col: 'text-indigo-400' }]
  },
  {
    path: 'doctor/availability', title: 'Doctor Availability', desc: 'Real-time doctor presence tracking.',
    cols: ['Log ID', 'Doctor Name', 'Current Location', 'Check-in Time', 'Expected Free Time', 'Status'],
    stats: [{ label: 'Currently Available', val: '142', col: 'text-emerald-400' }, { label: 'In Surgery', val: '28', col: 'text-red-400' }, { label: 'On Rounds', val: '64', col: 'text-amber-400' }]
  },
  {
    path: 'doctor/roster', title: 'On-call Roster', desc: 'Emergency and night duty roster.',
    cols: ['Roster ID', 'Doctor Name', 'Specialty', 'Date', 'Shift Time', 'Status'],
    stats: [{ label: 'On-Call Today', val: '45', col: 'text-blue-400' }, { label: 'Emergency Response', val: '12', col: 'text-red-400' }, { label: 'Backup Doctors', val: '24', col: 'text-amber-400' }]
  },
  {
    path: 'doctor/consultants', title: 'Visiting Consultants', desc: 'Manage external and visiting doctors.',
    cols: ['Consultant ID', 'Name', 'Specialty', 'Base Hospital', 'Visit Frequency', 'Status'],
    stats: [{ label: 'Total Visiting', val: '48', col: 'text-blue-400' }, { label: 'Visiting Today', val: '8', col: 'text-emerald-400' }, { label: 'Pending Agreements', val: '3', col: 'text-amber-400' }]
  },
  // Patient Administration
  {
    path: 'patient/overview', title: 'Patient Overview', desc: 'General patient registry and dashboard.',
    cols: ['Patient ID', 'Name', 'Age/Gender', 'Admitted Date', 'Attending Doctor', 'Status'],
    stats: [{ label: 'Total Admitted', val: '840', col: 'text-blue-400' }, { label: 'New Today', val: '124', col: 'text-emerald-400' }, { label: 'Discharges Today', val: '98', col: 'text-purple-400' }]
  },
  {
    path: 'patient/vip', title: 'VIP Patients', desc: 'Special care and VIP patient tracking.',
    cols: ['VIP ID', 'Patient Name', 'Category', 'Room/Suite', 'Primary Consultant', 'Status'],
    stats: [{ label: 'Total VIPs', val: '42', col: 'text-indigo-400' }, { label: 'Admitted', val: '14', col: 'text-emerald-400' }, { label: 'High Security', val: '2', col: 'text-red-400' }]
  },
  {
    path: 'patient/international', title: 'International Patients', desc: 'Medical tourism and foreign patients.',
    cols: ['File ID', 'Patient Name', 'Country', 'Passport No', 'Treatment', 'Status'],
    stats: [{ label: 'Total International', val: '128', col: 'text-blue-400' }, { label: 'Active Cases', val: '45', col: 'text-emerald-400' }, { label: 'Visa Pending', val: '12', col: 'text-amber-400' }]
  },
  {
    path: 'patient/corporate', title: 'Corporate Patients', desc: 'Company sponsored and TPA patients.',
    cols: ['Corp ID', 'Patient Name', 'Company', 'TPA/Insurance', 'Pre-Auth', 'Status'],
    stats: [{ label: 'Total Corporate', val: '3,450', col: 'text-blue-400' }, { label: 'Active Admitted', val: '240', col: 'text-emerald-400' }, { label: 'Pending Pre-Auth', val: '45', col: 'text-amber-400' }]
  },
  {
    path: 'patient/mlc', title: 'Medico Legal Cases', desc: 'Police and legal case tracking.',
    cols: ['MLC ID', 'Patient Name', 'Police Station', 'FIR/Diary No', 'Admitted By', 'Status'],
    stats: [{ label: 'Total MLCs', val: '842', col: 'text-red-400' }, { label: 'Active Cases', val: '124', col: 'text-amber-400' }, { label: 'Closed Cases', val: '718', col: 'text-emerald-400' }]
  }
];

const basePath = path.join(__dirname, 'frontend', 'src', 'app', 'admin');

const template = (page, componentName) => `"use client";

import React, { useState } from 'react';
import { Activity, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function ${componentName}Page() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    ${page.cols.map((col, idx) => {
  const accessorKey = col.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (col === 'Status') {
    return `{ 
      header: 'Status', 
      accessor: (row: any) => (
        <span className={\`px-2 py-1 rounded text-xs font-medium \${
          row.status === 'Active' || row.status === 'Completed' || row.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
          row.status === 'Pending' || row.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
          'bg-red-500/10 text-red-500 border border-red-500/20'
        }\`}>
          {row.status}
        </span>
      ),
      sortable: true 
    }`;
  } else {
    return `{ header: '${col}', accessor: '${accessorKey}', sortable: true }`;
  }
}).join(',\n    ')},
    { 
      header: 'Actions', 
      accessor: (row: any) => (
        <div className="flex justify-end gap-2">
          <button className="p-1.5 hover:bg-dark-tertiary rounded text-gray-400 hover:text-white transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      )
    }
  ];

  const mockData = Array.from({ length: 12 }).map((_, i) => ({
    ${page.cols.map((col, idx) => {
  const accessorKey = col.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (col === 'Status') {
    return `status: i % 5 === 0 ? 'Pending' : (i % 7 === 0 ? 'Inactive' : 'Active')`;
  } else if (idx === 0) {
    return `${accessorKey}: \`\${'${page.title}'.substring(0, 3).toUpperCase()}-\${1000 + i}\``;
  } else if (idx === 1) {
    return `${accessorKey}: \`Sample \${'${page.title}'} \${i + 1}\``;
  } else {
    return `${accessorKey}: \`Sample Data \${i + 1}\``;
  }
}).join(',\n    ')}
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3">
        <div>
          <h1 className="text-2xl  text-white flex items-center gap-2">
            <Activity className="text-emerald-500" size={24} />
            ${page.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">${page.desc}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-dark-secondary border border-gray-700 rounded-lg text-sm font-medium hover:bg-dark-tertiary transition-colors text-white">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-emerald-500/20 transition-all">
            <Plus size={16} /> Add New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${page.stats.map(stat => `
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">${stat.label}</p>
          <p className="text-2xl  mt-2 ${stat.col}">${stat.val}</p>
        </div>`).join('')}
      </div>

      <div className="my-3">
        <div className="my-3 flex justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search records..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500 text-white w-64 transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm hover:bg-gray-800 transition-colors text-white">
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

sections.forEach(page => {
  const dir = path.join(basePath, page.path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const componentName = page.title.replace(/[^a-zA-Z0-9]/g, '');
  const filePath = path.join(dir, 'page.tsx');

  fs.writeFileSync(filePath, template(page, componentName));
  console.log(`Created custom detailed page for ${page.path}/page.tsx`);
});

console.log('All 20 individual admin subsections generated with proper detailed info!');
