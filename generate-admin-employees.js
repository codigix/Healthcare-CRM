const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'frontend', 'src', 'app', 'admin', 'employees');

const pages = [
  {
    path: 'directory', title: 'Employee Directory', desc: 'Comprehensive staff and employee database.',
    cols: ['Emp ID', 'Full Name', 'Role', 'Department', 'Contact', 'Status'],
    stats: [{ label: 'Total Employees', val: '1,240', col: 'text-blue-400' }, { label: 'Medical Staff', val: '850', col: 'text-emerald-400' }, { label: 'Support Staff', val: '390', col: 'text-purple-400' }],
    mockDataGenerator: `Array.from({ length: 8 }).map((_, i) => {
      const names = ['Dr. Sarah Jenkins', 'Michael Chang', 'Jessica Roberts', 'Dr. Mark Sloan', 'Amanda Clarke', 'David Foster', 'Dr. Emily Chen', 'James Wilson'];
      const roles = ['Chief Surgeon', 'Senior Nurse', 'HR Manager', 'Head of Neurology', 'Receptionist', 'IT Support', 'Oncologist', 'Paramedic'];
      const depts = ['Cardiology', 'ICU', 'Human Resources', 'Neurology', 'Front Desk', 'IT Services', 'Oncology', 'Emergency'];
      const contacts = ['555-0101', '555-0102', '555-0103', '555-0104', '555-0105', '555-0106', '555-0107', '555-0108'];
      const statuses = ['Active', 'Active', 'On Leave', 'Active', 'Active', 'Inactive', 'Active', 'Active'];
      return {
        empid: \`EMP-\${1001 + i}\`,
        fullname: names[i],
        role: roles[i],
        department: depts[i],
        contact: contacts[i],
        status: statuses[i]
      };
    })`
  },
  {
    path: 'allocation', title: 'Department Allocation', desc: 'Manage staff assignments across departments.',
    cols: ['Alloc ID', 'Employee', 'Assigned Dept', 'Primary Role', 'Shift Type', 'Status'],
    stats: [{ label: 'Active Allocations', val: '1,180', col: 'text-blue-400' }, { label: 'Pending Reassignments', val: '12', col: 'text-amber-400' }, { label: 'Unassigned', val: '4', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 6 }).map((_, i) => {
      const emps = ['Michael Chang', 'Jessica Roberts', 'Amanda Clarke', 'David Foster', 'James Wilson', 'Lisa Cuddy'];
      const depts = ['ICU', 'Human Resources', 'Front Desk', 'IT Services', 'Emergency', 'Administration'];
      const roles = ['Senior Nurse', 'HR Manager', 'Receptionist', 'IT Support', 'Paramedic', 'Admin Officer'];
      const shifts = ['Night Shift', 'Day Shift', 'Morning Shift', 'Rotational', 'Night Shift', 'Day Shift'];
      const statuses = ['Active', 'Active', 'Pending', 'Active', 'Active', 'Unassigned'];
      return {
        allocid: \`ALC-\${2001 + i}\`,
        employee: emps[i],
        assigneddept: depts[i],
        primaryrole: roles[i],
        shifttype: shifts[i],
        status: statuses[i]
      };
    })`
  },
  {
    path: 'transfers', title: 'Staff Transfers', desc: 'Process internal transfers and promotions.',
    cols: ['Req ID', 'Employee', 'From Dept', 'To Dept', 'Effective Date', 'Status'],
    stats: [{ label: 'Pending Transfers', val: '8', col: 'text-amber-400' }, { label: 'Completed This Month', val: '24', col: 'text-emerald-400' }, { label: 'Rejected', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 6 }).map((_, i) => {
      const emps = ['Michael Chang', 'Jessica Roberts', 'Amanda Clarke', 'David Foster', 'James Wilson', 'Lisa Cuddy'];
      const froms = ['General Ward', 'Recruitment', 'Billing', 'Helpdesk', 'Ambulance 1', 'Records'];
      const tos = ['ICU', 'Employee Relations', 'Front Desk', 'IT Sec Ops', 'Emergency', 'Administration'];
      const dates = ['12 Aug, 2026', '15 Aug, 2026', '01 Sep, 2026', '10 Aug, 2026', '05 Aug, 2026', '01 Aug, 2026'];
      const statuses = ['Approved', 'Pending', 'Rejected', 'Approved', 'Completed', 'Completed'];
      return {
        reqid: \`TRF-\${3001 + i}\`,
        employee: emps[i],
        fromdept: froms[i],
        todept: tos[i],
        effectivedate: dates[i],
        status: statuses[i]
      };
    })`
  },
  {
    path: 'duty', title: 'Duty Assignment', desc: 'Manage daily duty rosters and shift timings.',
    cols: ['Duty ID', 'Employee', 'Shift', 'Location', 'Date', 'Status'],
    stats: [{ label: 'Staff on Duty Today', val: '450', col: 'text-blue-400' }, { label: 'Night Shift Staff', val: '120', col: 'text-indigo-400' }, { label: 'Call Outs', val: '14', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 6 }).map((_, i) => {
      const emps = ['Michael Chang', 'Jessica Roberts', 'Amanda Clarke', 'David Foster', 'James Wilson', 'Lisa Cuddy'];
      const shifts = ['08:00 - 16:00', '09:00 - 17:00', '16:00 - 00:00', '00:00 - 08:00', '12:00 - 20:00', '09:00 - 17:00'];
      const locations = ['ICU - Bed 1-5', 'Admin Block', 'Reception A', 'Server Room', 'ER Triage', 'Admin Block'];
      const dates = ['Today', 'Today', 'Today', 'Tomorrow', 'Today', 'Yesterday'];
      const statuses = ['Assigned', 'On Duty', 'Assigned', 'Assigned', 'Call Out', 'Completed'];
      return {
        dutyid: \`DTY-\${4001 + i}\`,
        employee: emps[i],
        shift: shifts[i],
        location: locations[i],
        date: dates[i],
        status: statuses[i]
      };
    })`
  },
  {
    path: 'id-cards', title: 'ID Cards', desc: 'Generate and manage staff ID cards.',
    cols: ['Card ID', 'Employee', 'Role', 'Access Level', 'Issue Date', 'Status'],
    stats: [{ label: 'Active Cards', val: '1,210', col: 'text-emerald-400' }, { label: 'Pending Print', val: '15', col: 'text-amber-400' }, { label: 'Lost/Revoked', val: '4', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 6 }).map((_, i) => {
      const emps = ['Dr. Sarah Jenkins', 'Michael Chang', 'Jessica Roberts', 'Dr. Mark Sloan', 'Amanda Clarke', 'David Foster'];
      const roles = ['Chief Surgeon', 'Senior Nurse', 'HR Manager', 'Head of Neurology', 'Receptionist', 'IT Support'];
      const access = ['Level 5 (All)', 'Level 3 (Clinical)', 'Level 2 (Admin)', 'Level 5 (All)', 'Level 1 (Basic)', 'Level 4 (IT)'];
      const dates = ['10 Jan, 2024', '15 Feb, 2025', '20 Mar, 2026', '05 Apr, 2022', '12 Jul, 2026', '01 Aug, 2026'];
      const statuses = ['Active', 'Active', 'Active', 'Revoked', 'Pending Print', 'Active'];
      return {
        cardid: \`IDC-\${5001 + i}\`,
        employee: emps[i],
        role: roles[i],
        accesslevel: access[i],
        issuedate: dates[i],
        status: statuses[i]
      };
    })`
  }
];

const template = (page, componentName) => `"use client";

import React, { useState } from 'react';
import { Users, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function ${componentName}Page() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    ${page.cols.map((col) => {
  const accessorKey = col.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (col === 'Status' || col === 'Status') {
    return `{ 
      header: '${col}', 
      accessor: (row: any) => (
        <span className={\`px-2 py-1 rounded text-xs font-medium \${
          row.${accessorKey} === 'Active' || row.${accessorKey} === 'Completed' || row.${accessorKey} === 'Approved' || row.${accessorKey} === 'On Duty' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
          row.${accessorKey} === 'Pending' || row.${accessorKey} === 'On Leave' || row.${accessorKey} === 'Assigned' || row.${accessorKey} === 'Pending Print' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
          'bg-red-500/10 text-red-500 border border-red-500/20'
        }\`}>
          {row.${accessorKey}}
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

  const mockData = ${page.mockDataGenerator};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3">
        <div>
          <h1 className="text-2xl  text-white flex items-center gap-2">
            <Users className="text-blue-500" size={24} />
            ${page.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">${page.desc}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-dark-secondary border border-gray-700 rounded-lg text-sm font-medium hover:bg-dark-tertiary transition-colors text-white">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20 transition-all">
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
              className="pl-9 pr-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-white w-64 transition-colors"
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

pages.forEach(page => {
  const dir = path.join(basePath, page.path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const componentName = page.title.replace(/[^a-zA-Z0-9]/g, '');
  const filePath = path.join(dir, 'page.tsx');

  fs.writeFileSync(filePath, template(page, componentName));
  console.log(`Updated custom detailed page for employees/${page.path}/page.tsx`);
});
