const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'frontend', 'src', 'app', 'admin', 'department');

const pages = [
  {
    path: 'list', title: 'Departments Directory', desc: 'Comprehensive list of all hospital departments.',
    cols: ['Dept ID', 'Department Name', 'Category', 'HOD', 'Staff Count', 'Status'],
    stats: [{ label: 'Total Departments', val: '42', col: 'text-blue-400' }, { label: 'Clinical', val: '28', col: 'text-emerald-400' }, { label: 'Non-Clinical', val: '14', col: 'text-purple-400' }],
    mockDataGenerator: `Array.from({ length: 8 }).map((_, i) => {
      const depts = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology', 'Emergency', 'Radiology', 'IT Services'];
      const categories = ['Clinical', 'Clinical', 'Clinical', 'Clinical', 'Clinical', 'Clinical', 'Diagnostic', 'Non-Clinical'];
      const hods = ['Dr. Sarah Jenkins', 'Dr. Mark Sloan', 'Dr. Emily Chen', 'Dr. Robert King', 'Dr. Lisa Cuddy', 'Dr. Peter Benton', 'Dr. Susan Lewis', 'Alan Turing'];
      const staff = [142, 85, 96, 120, 75, 210, 45, 30];
      return {
        deptid: \`DPT-\${1001 + i}\`,
        departmentname: depts[i],
        category: categories[i],
        hod: hods[i],
        staffcount: staff[i],
        status: i === 7 ? 'Pending' : 'Active'
      };
    })`
  },
  {
    path: 'specialties', title: 'Specialties', desc: 'Manage clinical specialties and sub-specialties.',
    cols: ['Specialty ID', 'Specialty Name', 'Parent Dept', 'Specialists', 'Wait Time (Avg)', 'Status'],
    stats: [{ label: 'Total Specialties', val: '64', col: 'text-blue-400' }, { label: 'Surgical', val: '24', col: 'text-emerald-400' }, { label: 'Consultation', val: '40', col: 'text-purple-400' }],
    mockDataGenerator: `Array.from({ length: 6 }).map((_, i) => {
      const specs = ['Interventional Cardiology', 'Neuro-Surgery', 'Pediatric Oncology', 'Trauma Surgery', 'MRI Diagnostics', 'Neonatology'];
      const parents = ['Cardiology', 'Neurology', 'Oncology', 'Emergency', 'Radiology', 'Pediatrics'];
      const specialists = [12, 8, 6, 24, 15, 18];
      const waitTimes = ['15 mins', '45 mins', '20 mins', '5 mins', '30 mins', '10 mins'];
      return {
        specialtyid: \`SPC-\${2001 + i}\`,
        specialtyname: specs[i],
        parentdept: parents[i],
        specialists: specialists[i],
        waittimeavg: waitTimes[i],
        status: 'Active'
      };
    })`
  },
  {
    path: 'units', title: 'Department Units', desc: 'Manage functional units within departments.',
    cols: ['Unit ID', 'Unit Name', 'Department', 'Location', 'Capacity', 'Status'],
    stats: [{ label: 'Total Units', val: '124', col: 'text-blue-400' }, { label: 'Occupied', val: '98', col: 'text-amber-400' }, { label: 'Maintenance', val: '4', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 6 }).map((_, i) => {
      const units = ['Cardiac ICU', 'Stroke Unit', 'Chemotherapy Wing', 'Triage Unit', 'CT Scan Room 1', 'NICU'];
      const depts = ['Cardiology', 'Neurology', 'Oncology', 'Emergency', 'Radiology', 'Pediatrics'];
      const locations = ['Building A, Floor 3', 'Building B, Floor 2', 'Building A, Floor 4', 'Ground Floor, Block C', 'Basement 1', 'Building B, Floor 3'];
      const capacities = ['24 Beds', '15 Beds', '30 Recliners', '50 Beds', '1 Machine', '40 Incubators'];
      const statuses = ['Active', 'Active', 'Active', 'Critical', 'Maintenance', 'Active'];
      return {
        unitid: \`UNT-\${3001 + i}\`,
        unitname: units[i],
        department: depts[i],
        location: locations[i],
        capacity: capacities[i],
        status: statuses[i]
      };
    })`
  },
  {
    path: 'cost-centers', title: 'Cost Centers', desc: 'Financial tracking and cost centers per department.',
    cols: ['Center ID', 'Center Name', 'Department', 'Monthly Budget', 'MTD Spend', 'Status'],
    stats: [{ label: 'Total Budget', val: '$4.2M', col: 'text-emerald-400' }, { label: 'MTD Spend', val: '$2.1M', col: 'text-amber-400' }, { label: 'Over Budget', val: '3', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 6 }).map((_, i) => {
      const centers = ['Cardio-Thoracic CC', 'Neuro-Surg CC', 'Oncology Care CC', 'ER Ops CC', 'Imaging CC', 'IT Infrastructure'];
      const depts = ['Cardiology', 'Neurology', 'Oncology', 'Emergency', 'Radiology', 'IT Services'];
      const budgets = ['$450,000', '$320,000', '$600,000', '$800,000', '$500,000', '$150,000'];
      const spends = ['$210,000', '$315,000', '$250,000', '$810,000', '$200,000', '$140,000'];
      const statuses = ['On Track', 'Warning', 'On Track', 'Over Budget', 'On Track', 'On Track'];
      return {
        centerid: \`CC-\${4001 + i}\`,
        centername: centers[i],
        department: depts[i],
        monthlybudget: budgets[i],
        mtdspend: spends[i],
        status: statuses[i]
      };
    })`
  },
  {
    path: 'heads', title: 'Department Heads', desc: 'Directory of all Head of Departments (HODs).',
    cols: ['Emp ID', 'HOD Name', 'Department', 'Tenure', 'Direct Reports', 'Status'],
    stats: [{ label: 'Total HODs', val: '42', col: 'text-blue-400' }, { label: 'Interim', val: '4', col: 'text-amber-400' }, { label: 'Vacant', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 6 }).map((_, i) => {
      const hods = ['Dr. Sarah Jenkins', 'Dr. Mark Sloan', 'Dr. Emily Chen', 'Dr. Robert King', 'Dr. Lisa Cuddy', 'Alan Turing'];
      const depts = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology', 'IT Services'];
      const tenures = ['4 Years', '8 Years', '2 Years', '12 Years', '5 Years', '1 Year'];
      const reports = ['14', '8', '12', '24', '18', '5'];
      const statuses = ['Active', 'Active', 'Active', 'Interim', 'Active', 'Active'];
      return {
        empid: \`EMP-\${1001 + i}\`,
        hodname: hods[i],
        department: depts[i],
        tenure: tenures[i],
        directreports: reports[i],
        status: statuses[i]
      };
    })`
  }
];

const template = (page, componentName) => `"use client";

import React, { useState } from 'react';
import { Activity, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
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
          row.${accessorKey} === 'Active' || row.${accessorKey} === 'On Track' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
          row.${accessorKey} === 'Pending' || row.${accessorKey} === 'Interim' || row.${accessorKey} === 'Warning' || row.${accessorKey} === 'Maintenance' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
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
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
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

pages.forEach(page => {
  const dir = path.join(basePath, page.path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const componentName = page.title.replace(/[^a-zA-Z0-9]/g, '');
  const filePath = path.join(dir, 'page.tsx');

  fs.writeFileSync(filePath, template(page, componentName));
  console.log(`Updated custom detailed page for department/${page.path}/page.tsx`);
});
