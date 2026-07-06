const fs = require('fs');
const path = require('path');

const config = [
  // VENDOR
  {
    path: 'admin/vendor/amc', title: 'AMC Contracts', desc: 'Annual Maintenance Contracts for equipment and facilities.',
    cols: ['Contract ID', 'Vendor', 'Equipment/System', 'Start Date', 'End Date', 'Status'],
    stats: [{ label: 'Active Contracts', val: '45', col: 'text-blue-400' }, { label: 'Expiring Soon', val: '4', col: 'text-amber-400' }, { label: 'Expired', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const vendors = ['Siemens Health', 'GE Medical', 'Johnson Controls', 'Elevator Co', 'IT Infra Services'];
      const systems = ['MRI Scanner', 'CT Scanner', 'HVAC System', 'Lifts 1-4', 'Server Racks'];
      const starts = ['01 Jan, 2026', '15 Mar, 2026', '01 Jun, 2025', '12 Aug, 2025', '01 Nov, 2025'];
      const ends = ['31 Dec, 2027', '14 Mar, 2028', '31 May, 2026', '11 Aug, 2026', '31 Oct, 2026'];
      const statuses = ['Active', 'Active', 'Expiring Soon', 'Active', 'Active'];
      return { contractid: 'AMC-' + (1001+i), vendor: vendors[i], equipmentsystem: systems[i], startdate: starts[i], enddate: ends[i], status: statuses[i] };
    })`
  },

  // COMPLIANCE
  {
    path: 'admin/compliance/fire', title: 'Fire Safety Compliance', desc: 'Monitor fire safety drills, equipment checks, and audits.',
    cols: ['Audit ID', 'Zone/Building', 'Last Audit', 'Next Due', 'Inspector', 'Status'],
    stats: [{ label: 'Overall Safety', val: '98%', col: 'text-emerald-400' }, { label: 'Pending Fixes', val: '2', col: 'text-amber-400' }, { label: 'Overdue Audits', val: '0', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const zones = ['Main Building A', 'Outpatient Wing', 'ER Block', 'Admin Block', 'Parking Garage'];
      const last = ['15 Jun, 2026', '12 Jun, 2026', '10 Jun, 2026', '05 Jun, 2026', '01 Jun, 2026'];
      const next = ['15 Dec, 2026', '12 Dec, 2026', '10 Dec, 2026', '05 Dec, 2026', '01 Dec, 2026'];
      const statuses = ['Compliant', 'Action Required', 'Compliant', 'Compliant', 'Warning'];
      return { auditid: 'FSA-' + (1001+i), zonebuilding: zones[i], lastaudit: last[i], nextdue: next[i], inspector: 'Capt. Rogers', status: statuses[i] };
    })`
  },
  {
    path: 'admin/compliance/waste', title: 'Waste Management', desc: 'Track biomedical and hazardous waste disposal compliance.',
    cols: ['Log ID', 'Waste Category', 'Weight (kg)', 'Collection Date', 'Disposal Vendor', 'Status'],
    stats: [{ label: 'Total Generated', val: '1,240 kg', col: 'text-blue-400' }, { label: 'Properly Disposed', val: '1,240 kg', col: 'text-emerald-400' }, { label: 'Violations', val: '0', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const cats = ['Bio-hazardous (Red)', 'Sharps (White)', 'Chemical', 'General (Black)', 'Bio-hazardous (Red)'];
      const weights = ['45.2', '12.4', '5.1', '120.5', '38.0'];
      const vendors = ['SafeDisposal Inc', 'SafeDisposal Inc', 'ChemClear', 'City Waste Dept', 'SafeDisposal Inc'];
      const statuses = ['Processed', 'Processed', 'Pending Pickup', 'Processed', 'Processed'];
      return { logid: 'WST-' + (2001+i), wastecategory: cats[i], weightkg: weights[i], collectiondate: 'Today', disposalvendor: vendors[i], status: statuses[i] };
    })`
  },

  // RESOURCE
  {
    path: 'admin/resource/room', title: 'Room Allocation', desc: 'Manage meeting rooms, conference halls, and multi-purpose rooms.',
    cols: ['Room Name', 'Capacity', 'Type', 'Current Booking', 'Next Booking', 'Status'],
    stats: [{ label: 'Total Rooms', val: '24', col: 'text-blue-400' }, { label: 'Available Now', val: '15', col: 'text-emerald-400' }, { label: 'Booked Today', val: '8', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const rooms = ['Conference Hall A', 'Meeting Room 1', 'Meeting Room 2', 'Board Room', 'Auditorium'];
      const caps = ['150', '10', '10', '25', '300'];
      const types = ['Conference', 'Meeting', 'Meeting', 'Executive', 'Event'];
      const curr = ['Nursing Seminar', 'None', 'IT Sync', 'Board Meeting', 'None'];
      const next = ['None', 'HR Interviews', 'None', 'None', 'Annual General Meeting'];
      const statuses = ['In Use', 'Available', 'In Use', 'In Use', 'Available'];
      return { roomname: rooms[i], capacity: caps[i], type: types[i], currentbooking: curr[i], nextbooking: next[i], status: statuses[i] };
    })`
  },
  {
    path: 'admin/resource/vehicle', title: 'Vehicle & Fleet Management', desc: 'Monitor hospital ambulances and transport vehicles.',
    cols: ['Vehicle No', 'Type', 'Driver Assigned', 'Current Location', 'Last Service', 'Status'],
    stats: [{ label: 'Total Fleet', val: '18', col: 'text-blue-400' }, { label: 'Active/On-trip', val: '5', col: 'text-amber-400' }, { label: 'Available', val: '12', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const vehs = ['AMB-01 (ICU)', 'AMB-02 (BLS)', 'AMB-03 (BLS)', 'VAN-01 (Staff)', 'VAN-02 (Staff)'];
      const types = ['Advanced Life Support', 'Basic Life Support', 'Basic Life Support', 'Staff Transport', 'Staff Transport'];
      const drivers = ['John D.', 'Mike S.', 'Unassigned', 'Sarah T.', 'Unassigned'];
      const locs = ['En route (North St)', 'Base Station', 'Base Station', 'City Center Drop', 'Maintenance Bay'];
      const statuses = ['Active', 'Available', 'Available', 'Active', 'Maintenance'];
      return { vehicleno: vehs[i], type: types[i], driverassigned: drivers[i], currentlocation: locs[i], lastservice: '12 May, 2026', status: statuses[i] };
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
        const isGood = val === 'Active' || val === 'Normal' || val === 'Optimal' || val === 'Approved' || val === 'Exceeding' || val === 'Excellent' || val === 'Leading' || val === 'Processed' || val === 'On Track' || val === 'Improving' || val === 'Reviewed' || val === 'Completed' || val === 'Compliant' || val === 'Available';
        const isWarning = val === 'Pending' || val === 'High' || val === 'Warning' || val === 'Action Required' || val === 'Review Needed' || val === 'Pending Review' || val === 'High Alert' || val === 'Under Review' || val === 'Delayed' || val === 'High Volume' || val === 'Expiring Soon' || val === 'In Use';
        const isNeutral = val === 'Stable' || val === 'Archived' || val === 'Maintenance' || val === 'Pending Pickup';
        
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
