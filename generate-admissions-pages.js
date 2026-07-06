const fs = require('fs');
const path = require('path');

const config = [
  {
    path: 'admissions/ipd', title: 'Inpatient (IPD) Admissions', desc: 'Live registry of all admitted patients in the facility.',
    cols: ['Admission ID', 'Patient Name', 'Attending Doctor', 'Ward/Room', 'Admitted On', 'Status'],
    stats: [{ label: 'Total IPD Patients', val: '245', col: 'text-blue-400' }, { label: 'Critical Condition', val: '12', col: 'text-red-400' }, { label: 'Ready for Discharge', val: '28', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const pats = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
      const docs = ['Dr. Strange', 'Dr. Banner', 'Dr. Palmer', 'Dr. Strange', 'Dr. Palmer'];
      const wards = ['ICU-01', 'General Med-12', 'Surg-B4', 'ICU-02', 'Ortho-C1'];
      const admitted = ['12 Jun, 2026', '14 Jun, 2026', '15 Jun, 2026', '10 Jun, 2026', '16 Jun, 2026'];
      const statuses = ['Critical', 'Stable', 'Stable', 'Critical', 'Ready for Discharge'];
      return { admissionid: 'IPD-' + (1001+i), patientname: pats[i], attendingdoctor: docs[i], wardroom: wards[i], admittedon: admitted[i], status: statuses[i] };
    })`
  },
  {
    path: 'admissions/bed-status', title: 'Live Bed Status', desc: 'Real-time overview of bed availability and cleaning cycles.',
    cols: ['Bed Number', 'Ward/Zone', 'Type', 'Current Patient', 'Turnover Time', 'Status'],
    stats: [{ label: 'Total Beds', val: '1,200', col: 'text-blue-400' }, { label: 'Occupied', val: '840', col: 'text-amber-400' }, { label: 'Available', val: '315', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const beds = ['ICU-B01', 'GEN-B12', 'GEN-B14', 'MAT-B05', 'PED-B02'];
      const zones = ['Intensive Care Unit', 'General Medicine', 'General Medicine', 'Maternity Ward', 'Pediatrics Ward'];
      const types = ['Ventilator Bed', 'Standard Bed', 'Standard Bed', 'Maternity Suite', 'Crib/Cot'];
      const pats = ['Tony Stark', 'Steve Rogers', '-', '-', 'Baby Miles'];
      const statuses = ['Occupied', 'Occupied', 'Cleaning', 'Available', 'Occupied'];
      return { bednumber: beds[i], wardzone: zones[i], type: types[i], currentpatient: pats[i], turnovertime: '45 mins', status: statuses[i] };
    })`
  },
  {
    path: 'room-allotment', title: 'Global Room Allotment', desc: 'High-level facility layout and room management.',
    cols: ['Room Number', 'Floor/Building', 'Room Category', 'Daily Rate', 'Current Patient', 'Status'],
    stats: [{ label: 'VIP Suites', val: '12 / 15', col: 'text-blue-400' }, { label: 'Private Rooms', val: '45 / 50', col: 'text-emerald-400' }, { label: 'General Wards', val: '240 / 300', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const rooms = ['Room 101', 'Room 102', 'Suite 501', 'Suite 502', 'Ward A-1'];
      const floors = ['1st Floor / North', '1st Floor / North', '5th Floor / VIP', '5th Floor / VIP', 'Ground / East'];
      const cats = ['Private', 'Private', 'VIP Suite', 'VIP Suite', 'General Ward'];
      const rates = ['$200/day', '$200/day', '$850/day', '$850/day', '$50/day'];
      const pats = ['Clark Kent', '-', 'Bruce Wayne', 'Lex Luthor', 'Multiple (8/10)'];
      const statuses = ['Occupied', 'Available', 'Occupied', 'Occupied', 'Available'];
      return { roomnumber: rooms[i], floorbuilding: floors[i], roomcategory: cats[i], dailyrate: rates[i], currentpatient: pats[i], status: statuses[i] };
    })`
  },
  {
    path: 'admissions/transfer', title: 'Patient Transfers', desc: 'Manage inter-ward and inter-department patient movements.',
    cols: ['Transfer ID', 'Patient', 'From Ward', 'To Ward', 'Reason', 'Status'],
    stats: [{ label: 'Active Transfers', val: '8', col: 'text-blue-400' }, { label: 'Completed Today', val: '24', col: 'text-emerald-400' }, { label: 'Pending Approval', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const pats = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
      const froms = ['ER', 'ICU', 'General Med', 'Surgery', 'ER'];
      const tos = ['ICU', 'General Med', 'Cardiology', 'Discharge', 'VIP Suite'];
      const reasons = ['Condition Worsened', 'Condition Stable', 'Specialized Care', 'Post-Op Recovery', 'Requested Upgrade'];
      const statuses = ['In Transit', 'Completed', 'Pending Approval', 'Completed', 'Pending Approval'];
      return { transferid: 'TRF-' + (2001+i), patient: pats[i], fromward: froms[i], toward: tos[i], reason: reasons[i], status: statuses[i] };
    })`
  },
  {
    path: 'admissions/room-allotment', title: 'Admission Room Allotment', desc: 'Assign and allocate rooms for new inbound admissions.',
    cols: ['Allotment ID', 'Patient', 'Requested Type', 'Assigned Room', 'Allotted By', 'Status'],
    stats: [{ label: 'Pending Allotments', val: '14', col: 'text-amber-400' }, { label: 'Rooms Allotted', val: '86', col: 'text-emerald-400' }, { label: 'Waitlist', val: '4', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const pats = ['Arthur Curry', 'Barry Allen', 'Victor Stone', 'Diana Prince', 'Bruce Wayne'];
      const reqs = ['General Ward', 'Private Room', 'ICU', 'VIP Suite', 'VIP Suite'];
      const assigned = ['Ward C-12', '-', 'ICU-B04', 'Suite 505', 'Suite 501'];
      const statuses = ['Allotted', 'Waitlisted', 'Allotted', 'Allotted', 'Occupied'];
      return { allotmentid: 'ALM-' + (3001+i), patient: pats[i], requestedtype: reqs[i], assignedroom: assigned[i], allottedby: 'Admin Desk', status: statuses[i] };
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
        const isGood = val === 'Stable' || val === 'Available' || val === 'Completed' || val === 'Allotted' || val === 'Ready for Discharge';
        const isWarning = val === 'Cleaning' || val === 'In Transit' || val === 'Pending Approval' || val === 'Occupied';
        const isNeutral = val === 'Waitlisted';
        
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
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
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
