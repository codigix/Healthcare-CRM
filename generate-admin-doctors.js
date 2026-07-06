const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'frontend', 'src', 'app', 'admin', 'doctors');

const pages = [
  {
    path: 'directory', title: 'Doctor Directory', desc: 'Comprehensive list of all doctors and consultants.',
    cols: ['Doc ID', 'Doctor Name', 'Specialty', 'Department', 'Contact', 'Status'],
    stats: [{ label: 'Total Doctors', val: '245', col: 'text-blue-400' }, { label: 'Consultants', val: '180', col: 'text-emerald-400' }, { label: 'Resident Doctors', val: '65', col: 'text-purple-400' }],
    mockDataGenerator: `Array.from({ length: 8 }).map((_, i) => {
      const names = ['Dr. Sarah Jenkins', 'Dr. Mark Sloan', 'Dr. Emily Chen', 'Dr. Robert King', 'Dr. Lisa Cuddy', 'Dr. Peter Benton', 'Dr. Susan Lewis', 'Dr. Gregory House'];
      const specialties = ['Cardiologist', 'Neurologist', 'Pediatrician', 'Orthopedic Surgeon', 'Endocrinologist', 'Trauma Surgeon', 'Emergency Physician', 'Diagnostician'];
      const depts = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Internal Medicine', 'Surgery', 'Emergency', 'Diagnostics'];
      const contacts = ['555-0201', '555-0202', '555-0203', '555-0204', '555-0205', '555-0206', '555-0207', '555-0208'];
      const statuses = ['Active', 'Active', 'On Leave', 'Active', 'Active', 'Inactive', 'Active', 'Active'];
      return {
        docid: \`DOC-\${1001 + i}\`,
        doctorname: names[i],
        specialty: specialties[i],
        department: depts[i],
        contact: contacts[i],
        status: statuses[i]
      };
    })`
  },
  {
    path: 'schedule', title: 'Doctor Schedule', desc: 'Manage OP clinic schedules and surgical hours.',
    cols: ['Schedule ID', 'Doctor', 'Department', 'Clinic Days', 'Timing', 'Status'],
    stats: [{ label: 'Active Schedules', val: '210', col: 'text-blue-400' }, { label: 'OPD Clinics Today', val: '45', col: 'text-emerald-400' }, { label: 'Cancellations', val: '3', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 6 }).map((_, i) => {
      const docs = ['Dr. Sarah Jenkins', 'Dr. Mark Sloan', 'Dr. Emily Chen', 'Dr. Robert King', 'Dr. Lisa Cuddy', 'Dr. Peter Benton'];
      const depts = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Internal Medicine', 'Surgery'];
      const days = ['Mon, Wed, Fri', 'Tue, Thu', 'Mon to Fri', 'Wed, Fri', 'Mon, Thu', 'Mon, Wed'];
      const timings = ['09:00 - 13:00', '14:00 - 18:00', '10:00 - 14:00', '08:00 - 12:00', '11:00 - 15:00', '09:00 - 17:00'];
      const statuses = ['Active', 'Active', 'Cancelled', 'Active', 'Active', 'Modified'];
      return {
        scheduleid: \`SCH-\${2001 + i}\`,
        doctor: docs[i],
        department: depts[i],
        clinicdays: days[i],
        timing: timings[i],
        status: statuses[i]
      };
    })`
  },
  {
    path: 'availability', title: 'Doctor Availability', desc: 'Real-time tracking of doctor availability and leaves.',
    cols: ['Track ID', 'Doctor', 'Current Status', 'Next Available', 'Location', 'Updates'],
    stats: [{ label: 'Doctors Available', val: '142', col: 'text-emerald-400' }, { label: 'In Surgery', val: '28', col: 'text-amber-400' }, { label: 'On Leave', val: '15', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 6 }).map((_, i) => {
      const docs = ['Dr. Sarah Jenkins', 'Dr. Mark Sloan', 'Dr. Emily Chen', 'Dr. Robert King', 'Dr. Lisa Cuddy', 'Dr. Peter Benton'];
      const statuses = ['Available', 'In Surgery', 'Consulting', 'On Leave', 'Available', 'In Surgery'];
      const nextAvail = ['Now', '14:30 Today', '11:15 Today', '12 Aug, 2026', 'Now', '16:00 Today'];
      const locs = ['OPD Room 12', 'OR 3', 'OPD Room 4', 'Out of Office', 'OPD Room 2', 'OR 1'];
      const updates = ['Updated 5m ago', 'Updated 1h ago', 'Updated 10m ago', 'Updated 2d ago', 'Updated 2m ago', 'Updated 3h ago'];
      return {
        trackid: \`TRK-\${3001 + i}\`,
        doctor: docs[i],
        currentstatus: statuses[i],
        nextavailable: nextAvail[i],
        location: locs[i],
        updates: updates[i]
      };
    })`
  },
  {
    path: 'roster', title: 'On-call Roster', desc: 'Manage after-hours and emergency on-call doctors.',
    cols: ['Roster ID', 'Doctor', 'Specialty', 'Shift Timing', 'On-Call Type', 'Status'],
    stats: [{ label: 'Doctors on Call', val: '24', col: 'text-blue-400' }, { label: 'Primary Call', val: '12', col: 'text-emerald-400' }, { label: 'Backup Call', val: '12', col: 'text-purple-400' }],
    mockDataGenerator: `Array.from({ length: 6 }).map((_, i) => {
      const docs = ['Dr. Sarah Jenkins', 'Dr. Mark Sloan', 'Dr. Emily Chen', 'Dr. Robert King', 'Dr. Lisa Cuddy', 'Dr. Peter Benton'];
      const specs = ['Cardiologist', 'Neurologist', 'Pediatrician', 'Orthopedic Surgeon', 'Endocrinologist', 'Trauma Surgeon'];
      const timings = ['20:00 - 08:00', '20:00 - 08:00', '20:00 - 08:00', '20:00 - 08:00', '20:00 - 08:00', '20:00 - 08:00'];
      const types = ['Primary', 'Backup', 'Primary', 'Primary', 'Backup', 'Primary'];
      const statuses = ['Active', 'Active', 'Active', 'Active', 'Active', 'Active'];
      return {
        rosterid: \`RST-\${4001 + i}\`,
        doctor: docs[i],
        specialty: specs[i],
        shifttiming: timings[i],
        oncalltype: types[i],
        status: statuses[i]
      };
    })`
  },
  {
    path: 'consultants', title: 'Visiting Consultants', desc: 'Track and manage external visiting specialists.',
    cols: ['Consult ID', 'Consultant Name', 'Specialty', 'Affiliation', 'Visit Frequency', 'Status'],
    stats: [{ label: 'Total Consultants', val: '32', col: 'text-blue-400' }, { label: 'Weekly Visits', val: '18', col: 'text-emerald-400' }, { label: 'Monthly Visits', val: '14', col: 'text-purple-400' }],
    mockDataGenerator: `Array.from({ length: 6 }).map((_, i) => {
      const names = ['Dr. Arthur Dent', 'Dr. Ford Prefect', 'Dr. Zaphod Beeblebrox', 'Dr. Trillian Astra', 'Dr. Marvin', 'Dr. Slartibartfast'];
      const specs = ['Neurosurgery', 'Cardio-Thoracic', 'Oncology', 'Dermatology', 'Psychiatry', 'Plastic Surgery'];
      const affils = ['City Gen Hospital', 'Heart Institute', 'Cancer Care Center', 'Skin Clinic', 'Mind Wellness', 'Aesthetic Center'];
      const freqs = ['Weekly (Tue)', 'Bi-Weekly (Mon)', 'Monthly (1st Wed)', 'Weekly (Thu)', 'Weekly (Fri)', 'Monthly (Last Fri)'];
      const statuses = ['Active', 'Active', 'Active', 'Active', 'Inactive', 'Active'];
      return {
        consultid: \`VCN-\${5001 + i}\`,
        consultantname: names[i],
        specialty: specs[i],
        affiliation: affils[i],
        visitfrequency: freqs[i],
        status: statuses[i]
      };
    })`
  }
];

const template = (page, componentName) => `"use client";

import React, { useState } from 'react';
import { UserCheck, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function ${componentName}Page() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    ${page.cols.map((col) => {
  const accessorKey = col.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (col === 'Status' || col === 'Status' || col === 'Current Status') {
    return `{ 
      header: '${col}', 
      accessor: (row: any) => (
        <span className={\`px-2 py-1 rounded text-xs font-medium \${
          row.${accessorKey} === 'Active' || row.${accessorKey} === 'Available' || row.${accessorKey} === 'Consulting' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
          row.${accessorKey} === 'In Surgery' || row.${accessorKey} === 'On Leave' || row.${accessorKey} === 'Modified' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
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
            <UserCheck className="text-emerald-500" size={24} />
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
  console.log(`Updated custom detailed page for doctors/${page.path}/page.tsx`);
});
