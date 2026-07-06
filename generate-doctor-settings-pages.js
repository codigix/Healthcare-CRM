const fs = require('fs');
const path = require('path');

const config = [
  {
    path: 'settings/profile', title: 'User Profiles', desc: 'Manage basic user profiles and directory information.',
    cols: ['User ID', 'Full Name', 'Role', 'Department', 'Last Login', 'Status'],
    stats: [{ label: 'Total Profiles', val: '840', col: 'text-blue-400' }, { label: 'Active Users', val: '795', col: 'text-emerald-400' }, { label: 'Locked Accounts', val: '4', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['John Admin', 'Sarah Reception', 'Peter HR', 'Mary Manager', 'Tony IT'];
      const roles = ['Super Admin', 'Receptionist', 'HR Executive', 'Operations Manager', 'IT Support'];
      const depts = ['Administration', 'Front Desk', 'Human Resources', 'Operations', 'IT'];
      const logins = ['2 mins ago', '1 hour ago', 'Yesterday', 'Just now', '3 days ago'];
      const statuses = ['Active', 'Active', 'Active', 'Active', 'Locked'];
      return { userid: 'USR-' + (1001+i), fullname: names[i], role: roles[i], department: depts[i], lastlogin: logins[i], status: statuses[i] };
    })`
  },
  {
    path: 'settings/preferences', title: 'System Preferences', desc: 'Global configurations and user preference settings.',
    cols: ['Setting ID', 'Configuration Name', 'Category', 'Current Value', 'Last Modified', 'Status'],
    stats: [{ label: 'Total Settings', val: '145', col: 'text-blue-400' }, { label: 'System Overrides', val: '12', col: 'text-amber-400' }, { label: 'Default Status', val: '92%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const configs = ['Default Timezone', 'Date Format', 'Theme (Global)', 'Session Timeout', 'Notification Sound'];
      const cats = ['Localization', 'Localization', 'UI/UX', 'Security', 'Alerts'];
      const vals = ['UTC-05:00', 'DD/MM/YYYY', 'Dark Mode', '30 Minutes', 'Chime 1'];
      const mods = ['By System', 'By John Admin', 'By System', 'By System', 'By John Admin'];
      const statuses = ['Active', 'Active', 'Active', 'Active', 'Active'];
      return { settingid: 'CFG-' + (2001+i), configurationname: configs[i], category: cats[i], currentvalue: vals[i], lastmodified: mods[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/settings/profile', title: 'Doctor Profiles', desc: 'Directory of clinical staff profiles, credentials, and settings.',
    cols: ['Doctor ID', 'Name', 'Specialty', 'License No', 'Consultation Fee', 'Status'],
    stats: [{ label: 'Total Doctors', val: '124', col: 'text-blue-400' }, { label: 'Active/On-Duty', val: '85', col: 'text-emerald-400' }, { label: 'Licenses Expiring', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const docs = ['Dr. Sarah Jenkins', 'Dr. Mark Sloan', 'Dr. Derek Shepherd', 'Dr. Meredith Grey', 'Dr. Cristina Yang'];
      const specs = ['Cardiology', 'Plastic Surgery', 'Neurosurgery', 'General Surgery', 'Cardiothoracic'];
      const lics = ['MED-109283', 'MED-293847', 'MED-948273', 'MED-102938', 'MED-584739'];
      const fees = ['$150', '$200', '$250', '$150', '$300'];
      const statuses = ['Active', 'Active', 'Active', 'Active', 'Expiring Soon'];
      return { doctorid: 'DOC-' + (3001+i), name: docs[i], specialty: specs[i], licenseno: lics[i], consultationfee: fees[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/schedule/today', title: "Today's Schedule", desc: 'Live overview of all doctor appointments scheduled for today.',
    cols: ['Appt ID', 'Doctor', 'Patient Name', 'Time Slot', 'Room/Ward', 'Status'],
    stats: [{ label: 'Total Appts Today', val: '312', col: 'text-blue-400' }, { label: 'Completed', val: '145', col: 'text-emerald-400' }, { label: 'Cancellations', val: '8', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const docs = ['Dr. Sarah Jenkins', 'Dr. Mark Sloan', 'Dr. Derek Shepherd', 'Dr. Meredith Grey', 'Dr. Cristina Yang'];
      const pats = ['Alice Cooper', 'Bob Marley', 'Elvis Presley', 'John Lennon', 'Jimi Hendrix'];
      const times = ['09:00 AM - 09:30 AM', '10:00 AM - 10:15 AM', '11:00 AM - 12:00 PM', '01:00 PM - 01:30 PM', '02:00 PM - 02:45 PM'];
      const rooms = ['Room 101', 'Room 102', 'OR-1', 'Room 105', 'ICU-B'];
      const statuses = ['Completed', 'Checked In', 'Scheduled', 'Scheduled', 'Scheduled'];
      return { apptid: 'APT-T' + (4001+i), doctor: docs[i], patientname: pats[i], timeslot: times[i], roomward: rooms[i], status: statuses[i] };
    })`
  },
  {
    path: 'doctor/schedule/availability', title: 'Doctor Availability Matrix', desc: 'Configure and monitor shifts, leaves, and time slots.',
    cols: ['Doctor', 'Specialty', 'Current Shift', 'Available Slots', 'Next Leave', 'Status'],
    stats: [{ label: 'Doctors On Shift', val: '45', col: 'text-blue-400' }, { label: 'On Leave Today', val: '12', col: 'text-amber-400' }, { label: 'Total Open Slots', val: '124', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const docs = ['Dr. Sarah Jenkins', 'Dr. Mark Sloan', 'Dr. Derek Shepherd', 'Dr. Meredith Grey', 'Dr. Cristina Yang'];
      const specs = ['Cardiology', 'Plastic Surgery', 'Neurosurgery', 'General Surgery', 'Cardiothoracic'];
      const shifts = ['Morning (08-16)', 'Evening (16-00)', 'Morning (08-16)', 'Off Duty', 'Morning (08-16)'];
      const slots = ['4 Slots Open', '12 Slots Open', '0 Slots (Full)', '0 Slots', '2 Slots Open'];
      const leaves = ['15 Aug, 2026', 'None Scheduled', '22 Jul, 2026', 'Today', 'None Scheduled'];
      const statuses = ['Available', 'Available', 'Fully Booked', 'On Leave', 'Available'];
      return { doctor: docs[i], specialty: specs[i], currentshift: shifts[i], availableslots: slots[i], nextleave: leaves[i], status: statuses[i] };
    })`
  }
];

const template = (page, componentName) => {
  let columnsGen = "";
  page.cols.forEach(col => {
    const accessorKey = col.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (col === 'Status') {
      columnsGen += `
    { 
      header: '${col}', 
      accessor: (row: any) => {
        const val = row.${accessorKey};
        const isGood = val === 'Active' || val === 'Completed' || val === 'Available' || val === 'Checked In';
        const isWarning = val === 'Locked' || val === 'Expiring Soon' || val === 'Fully Booked' || val === 'Scheduled';
        const isNeutral = val === 'On Leave';
        
        let colorClass = 'bg-red-500/10 text-red-500 border border-red-500/20';
        if (isGood) colorClass = 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
        else if (isWarning) colorClass = 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
        else if (isNeutral) colorClass = 'bg-gray-500/10 text-gray-400 border border-gray-500/20';

        return (
          <span className={"px-2 py-1 rounded text-xs font-medium " + colorClass}>
            {val}
          </span>
        )
      },
      sortable: true 
    },`;
    } else {
      columnsGen += `
    { header: '${col}', accessor: '${accessorKey}', sortable: true },`;
    }
  });


  let statsGen = "";
  page.stats.forEach(stat => {
    statsGen += `
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">${stat.label}</p>
          <p className={"text-2xl font-bold mt-2 " + "${stat.col}"}>${stat.val}</p>
        </div>`;
  });

  return `"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function ${componentName}Page() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [${columnsGen}
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
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            ${page.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">${page.desc}</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">${statsGen}
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
};

config.forEach(page => {
  const dir = path.join(__dirname, 'frontend', 'src', 'app', ...page.path.split('/'));
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const componentName = page.title.replace(/[^a-zA-Z0-9]/g, '');
  fs.writeFileSync(path.join(dir, 'page.tsx'), template(page, componentName));
  console.log('Generated: ' + page.path);
});
