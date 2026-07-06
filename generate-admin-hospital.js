const fs = require('fs');
const path = require('path');

const hospitalPages = [
  {
    path: 'profile',
    title: 'Hospital Profile',
    desc: 'Manage core hospital identity, accreditation, and global settings.',
    stats: [
      { label: 'Total Branches', value: '4', color: 'text-emerald-400' },
      { label: 'Total Beds', value: '1,250', color: 'text-blue-400' },
      { label: 'Accreditations', value: '2 Active', color: 'text-amber-400' }
    ],
    cols: ['ID', 'Hospital Name', 'Registration Number', 'Tax ID', 'Primary Contact', 'Status']
  },
  {
    path: 'branch',
    title: 'Branch Management',
    desc: 'Manage multiple hospital branches and regional facilities.',
    stats: [
      { label: 'Active Branches', value: '12', color: 'text-blue-400' },
      { label: 'Total Capacity', value: '3,400', color: 'text-emerald-400' },
      { label: 'Under Maintenance', value: '1', color: 'text-red-400' }
    ],
    cols: ['Branch Code', 'Branch Name', 'City', 'Head/Director', 'Total Beds', 'Status']
  },
  {
    path: 'buildings',
    title: 'Building Management',
    desc: 'Manage structural buildings within specific branches.',
    stats: [
      { label: 'Total Buildings', value: '24', color: 'text-indigo-400' },
      { label: 'Active', value: '22', color: 'text-emerald-400' },
      { label: 'Under Construction', value: '2', color: 'text-amber-400' }
    ],
    cols: ['Building ID', 'Building Name', 'Branch', 'Total Floors', 'Departments', 'Status']
  },
  {
    path: 'floors',
    title: 'Floor Management',
    desc: 'Manage floors and spatial distribution across buildings.',
    stats: [
      { label: 'Total Floors', value: '142', color: 'text-blue-400' },
      { label: 'Operational', value: '138', color: 'text-emerald-400' },
      { label: 'Restricted', value: '4', color: 'text-red-400' }
    ],
    cols: ['Floor Code', 'Floor Name', 'Building', 'Total Wards', 'Capacity', 'Status']
  },
  {
    path: 'wards',
    title: 'Ward Management',
    desc: 'Manage specific medical wards and specialized units.',
    stats: [
      { label: 'Total Wards', value: '86', color: 'text-purple-400' },
      { label: 'ICU/Critical', value: '14', color: 'text-red-400' },
      { label: 'General/Recovery', value: '72', color: 'text-emerald-400' }
    ],
    cols: ['Ward ID', 'Ward Type', 'Floor', 'Total Rooms', 'Available Beds', 'Status']
  },
  {
    path: 'rooms',
    title: 'Room Allocation',
    desc: 'Manage individual rooms and bed tracking.',
    stats: [
      { label: 'Total Rooms', value: '840', color: 'text-blue-400' },
      { label: 'Occupied', value: '620', color: 'text-amber-400' },
      { label: 'Available', value: '220', color: 'text-emerald-400' }
    ],
    cols: ['Room No', 'Room Type', 'Ward', 'Bed Count', 'Current Occupancy', 'Status']
  }
];

const basePath = path.join(__dirname, 'frontend', 'src', 'app', 'admin', 'hospital');

if (!fs.existsSync(basePath)) {
  fs.mkdirSync(basePath, { recursive: true });
}

const template = (page, componentName) => `"use client";

import React, { useState } from 'react';
import { Building2, Plus, Search, Filter, MoreVertical, Download, MapPin } from 'lucide-react';
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
          row.status === 'Active' || row.status === 'Operational' || row.status === 'Available' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
          row.status === 'Pending' || row.status === 'Occupied' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
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
    return `status: i % 4 === 0 ? 'Maintenance' : (i % 3 === 0 ? 'Occupied' : 'Active')`;
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
      <div className="flex justify-between items-center my-3 my-3">
        <div>
          <h1 className="text-2xl  text-white flex items-center gap-2">
            <Building2 className="text-emerald-500" size={24} />
            ${page.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">${page.desc}</p>
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
        ${page.stats.map(stat => `
        <div className="bg-dark-secondary rounded p-4 border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 font-medium">${stat.label}</p>
            <p className="text-2xl  mt-1 ${stat.color}">${stat.value}</p>
          </div>
          <div className="p-3 bg-dark-tertiary rounded">
            <MapPin className="${stat.color}" size={20} />
          </div>
        </div>`).join('')}
      </div>

      <div className="">
        <div className="flex justify-between items-center my-3 my-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search ${page.title.toLowerCase()}..." 
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

hospitalPages.forEach(page => {
  const dir = path.join(basePath, page.path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const componentName = page.title.replace(/[^a-zA-Z0-9]/g, '');
  const filePath = path.join(dir, 'page.tsx');

  fs.writeFileSync(filePath, template(page, componentName));
  console.log(`Created ${page.path}/page.tsx`);
});

console.log('All admin hospital pages generated successfully!');
