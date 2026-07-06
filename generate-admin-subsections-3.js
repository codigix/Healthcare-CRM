const fs = require('fs');
const path = require('path');

const sections = [
  // Resource Management
  {
    path: 'resource/rooms', title: 'Room Allocation', desc: 'Manage meeting and clinical rooms.',
    cols: ['Room ID', 'Room Type', 'Location', 'Capacity', 'Current Booking', 'Status'],
    stats: [{ label: 'Total Rooms', val: '142', col: 'text-blue-400' }, { label: 'Available', val: '45', col: 'text-emerald-400' }, { label: 'In Maintenance', val: '4', col: 'text-red-400' }]
  },
  {
    path: 'resource/equipment', title: 'Equipment Allocation', desc: 'Track medical and non-medical equipment.',
    cols: ['Asset ID', 'Equipment Name', 'Category', 'Assigned To', 'Last Serviced', 'Status'],
    stats: [{ label: 'Total Equipment', val: '4,250', col: 'text-purple-400' }, { label: 'In Use', val: '3,840', col: 'text-blue-400' }, { label: 'Repair Needed', val: '24', col: 'text-red-400' }]
  },
  {
    path: 'resource/vehicles', title: 'Vehicle Allocation', desc: 'Manage hospital transport vehicles.',
    cols: ['Vehicle No', 'Type', 'Driver', 'Current Location', 'Next Service', 'Status'],
    stats: [{ label: 'Fleet Size', val: '28', col: 'text-blue-400' }, { label: 'On Route', val: '12', col: 'text-emerald-400' }, { label: 'Available', val: '14', col: 'text-amber-400' }]
  },
  {
    path: 'resource/ambulance', title: 'Ambulance Allocation', desc: 'Emergency ambulance dispatch and tracking.',
    cols: ['Ambulance ID', 'Type (ALS/BLS)', 'Current EMT', 'Location', 'Last Disinfected', 'Status'],
    stats: [{ label: 'Total Ambulances', val: '14', col: 'text-indigo-400' }, { label: 'Dispatched', val: '4', col: 'text-red-400' }, { label: 'Standby', val: '8', col: 'text-emerald-400' }]
  },
  {
    path: 'resource/conference', title: 'Conference Rooms', desc: 'Meeting and conference room bookings.',
    cols: ['Room Name', 'Capacity', 'AV Equipment', 'Booked By', 'Time Slot', 'Status'],
    stats: [{ label: 'Conference Rooms', val: '8', col: 'text-blue-400' }, { label: 'Booked Today', val: '5', col: 'text-amber-400' }, { label: 'Available', val: '3', col: 'text-emerald-400' }]
  },

  // Hospital Calendar
  {
    path: 'calendar/holidays', title: 'Hospital Holidays', desc: 'Manage official hospital holidays.',
    cols: ['Holiday Name', 'Date', 'Day', 'Applicable To', 'Notification Sent', 'Status'],
    stats: [{ label: 'Upcoming Holidays', val: '3', col: 'text-blue-400' }, { label: 'Total This Year', val: '14', col: 'text-emerald-400' }, { label: 'Next Holiday', val: 'In 12 Days', col: 'text-purple-400' }]
  },
  {
    path: 'calendar/events', title: 'Events', desc: 'Hospital events and blood donation camps.',
    cols: ['Event ID', 'Event Name', 'Organizer', 'Date', 'Venue', 'Status'],
    stats: [{ label: 'Planned Events', val: '8', col: 'text-indigo-400' }, { label: 'This Month', val: '2', col: 'text-amber-400' }, { label: 'Completed YTD', val: '14', col: 'text-emerald-400' }]
  },
  {
    path: 'calendar/meetings', title: 'Meetings', desc: 'Inter-departmental and board meetings.',
    cols: ['Meeting ID', 'Subject', 'Chairperson', 'Date & Time', 'Room', 'Status'],
    stats: [{ label: 'Meetings Today', val: '4', col: 'text-amber-400' }, { label: 'This Week', val: '18', col: 'text-blue-400' }, { label: 'Canceled', val: '1', col: 'text-red-400' }]
  },
  {
    path: 'calendar/training', title: 'Training Programs', desc: 'Staff and medical training schedules.',
    cols: ['Program ID', 'Topic', 'Trainer', 'Target Audience', 'Schedule', 'Status'],
    stats: [{ label: 'Active Programs', val: '6', col: 'text-emerald-400' }, { label: 'Enrolled Staff', val: '142', col: 'text-blue-400' }, { label: 'Pending Certs', val: '24', col: 'text-amber-400' }]
  },
  {
    path: 'calendar/maintenance', title: 'Maintenance Schedule', desc: 'Preventive maintenance calendar.',
    cols: ['Job ID', 'Equipment/Area', 'Assigned Team', 'Scheduled Date', 'Est Duration', 'Status'],
    stats: [{ label: 'Scheduled Jobs', val: '42', col: 'text-blue-400' }, { label: 'Critical Today', val: '4', col: 'text-red-400' }, { label: 'Completed', val: '128', col: 'text-emerald-400' }]
  },

  // Communication Center
  {
    path: 'communication/notices', title: 'Internal Notices', desc: 'Internal memos and staff notices.',
    cols: ['Notice ID', 'Subject', 'Issued By', 'Date', 'Target Depts', 'Status'],
    stats: [{ label: 'Active Notices', val: '12', col: 'text-amber-400' }, { label: 'Read Rate', val: '84%', col: 'text-emerald-400' }, { label: 'Urgent', val: '1', col: 'text-red-400' }]
  },
  {
    path: 'communication/circulars', title: 'Circulars', desc: 'Official administrative circulars.',
    cols: ['Circular No', 'Title', 'Category', 'Publish Date', 'Valid Till', 'Status'],
    stats: [{ label: 'Active Circulars', val: '45', col: 'text-blue-400' }, { label: 'New This Week', val: '2', col: 'text-purple-400' }, { label: 'Archived', val: '320', col: 'text-gray-400' }]
  },
  {
    path: 'communication/announcements', title: 'Announcements', desc: 'Public and staff announcements.',
    cols: ['Announcement ID', 'Message', 'Channel', 'Scheduled For', 'Author', 'Status'],
    stats: [{ label: 'Live Announcements', val: '4', col: 'text-emerald-400' }, { label: 'Scheduled', val: '2', col: 'text-amber-400' }, { label: 'Reach', val: '4.2k', col: 'text-blue-400' }]
  },
  {
    path: 'communication/broadcast', title: 'Broadcast Messages', desc: 'SMS and Email broadcasts.',
    cols: ['Broadcast ID', 'Campaign Name', 'Type', 'Recipients', 'Sent On', 'Status'],
    stats: [{ label: 'Total Sent YTD', val: '1.2M', col: 'text-indigo-400' }, { label: 'Delivery Rate', val: '98.4%', col: 'text-emerald-400' }, { label: 'Failed', val: '1.6%', col: 'text-red-400' }]
  },
  {
    path: 'communication/emergency', title: 'Emergency Alerts', desc: 'Code Blue and critical alerts.',
    cols: ['Alert ID', 'Code Type', 'Location', 'Triggered By', 'Time', 'Status'],
    stats: [{ label: 'Active Alerts', val: '0', col: 'text-emerald-400' }, { label: 'Past 24h', val: '2', col: 'text-amber-400' }, { label: 'Avg Response', val: '1.4m', col: 'text-blue-400' }]
  },

  // Vendor Administration
  {
    path: 'vendor/directory', title: 'Vendor Directory', desc: 'Supplier and vendor database.',
    cols: ['Vendor ID', 'Company Name', 'Category', 'Contact Person', 'Rating', 'Status'],
    stats: [{ label: 'Total Vendors', val: '245', col: 'text-blue-400' }, { label: 'Preferred', val: '42', col: 'text-emerald-400' }, { label: 'Blacklisted', val: '3', col: 'text-red-400' }]
  },
  {
    path: 'vendor/service-contracts', title: 'Service Contracts', desc: 'Outsourced service agreements.',
    cols: ['Contract ID', 'Service Type', 'Vendor', 'Start Date', 'End Date', 'Status'],
    stats: [{ label: 'Active Contracts', val: '86', col: 'text-indigo-400' }, { label: 'Expiring <30d', val: '8', col: 'text-amber-400' }, { label: 'Value (Annual)', val: '$1.2M', col: 'text-emerald-400' }]
  },
  {
    path: 'vendor/amc-contracts', title: 'AMC Contracts', desc: 'Annual Maintenance Contracts for equipment.',
    cols: ['AMC ID', 'Equipment', 'Vendor', 'Cost', 'Next Service Due', 'Status'],
    stats: [{ label: 'Total AMCs', val: '142', col: 'text-blue-400' }, { label: 'Service Due', val: '12', col: 'text-amber-400' }, { label: 'Expired', val: '4', col: 'text-red-400' }]
  },
  {
    path: 'vendor/evaluation', title: 'Vendor Evaluation', desc: 'Performance and quality tracking.',
    cols: ['Eval ID', 'Vendor', 'Audit Date', 'Score (out of 100)', 'Evaluator', 'Status'],
    stats: [{ label: 'Avg Score', val: '88/100', col: 'text-emerald-400' }, { label: 'Pending Evals', val: '14', col: 'text-amber-400' }, { label: 'Critical Failures', val: '1', col: 'text-red-400' }]
  },

  // Compliance
  {
    path: 'compliance/nabh', title: 'NABH Compliance', desc: 'National accreditation standards tracking.',
    cols: ['Chapter', 'Standard', 'Objective Element', 'Compliance %', 'Last Audit', 'Status'],
    stats: [{ label: 'Overall Compliance', val: '94%', col: 'text-emerald-400' }, { label: 'Non-Compliant OEs', val: '12', col: 'text-red-400' }, { label: 'Next Assessment', val: '45 Days', col: 'text-amber-400' }]
  },
  {
    path: 'compliance/fire-safety', title: 'Fire Safety', desc: 'Fire department NOC and safety drills.',
    cols: ['Record ID', 'Check Type', 'Location', 'Last Inspection', 'Next Due', 'Status'],
    stats: [{ label: 'NOC Status', val: 'Valid', col: 'text-emerald-400' }, { label: 'Pending Checks', val: '4', col: 'text-amber-400' }, { label: 'Critical Findings', val: '0', col: 'text-blue-400' }]
  },
  {
    path: 'compliance/biomedical', title: 'Biomedical Waste', desc: 'BMW disposal logs and compliance.',
    cols: ['Log ID', 'Category (Color)', 'Weight (kg)', 'Handed Over To', 'Date', 'Status'],
    stats: [{ label: 'Total Waste YTD', val: '4,250 kg', col: 'text-amber-400' }, { label: 'Disposal Rate', val: '100%', col: 'text-emerald-400' }, { label: 'Vendor Compliance', val: 'Met', col: 'text-blue-400' }]
  },
  {
    path: 'compliance/government', title: 'Government Compliance', desc: 'Local health authority and statutory regulations.',
    cols: ['Reg ID', 'Authority', 'Requirement', 'Filing Frequency', 'Last Filed Date', 'Status'],
    stats: [{ label: 'Active Licenses', val: '24', col: 'text-blue-400' }, { label: 'Renewals Due', val: '2', col: 'text-amber-400' }, { label: 'Violations', val: '0', col: 'text-emerald-400' }]
  },
  {
    path: 'compliance/audit', title: 'Audit Compliance', desc: 'Internal and external audit tracking.',
    cols: ['Audit ID', 'Audit Type', 'Auditor', 'Date Conducted', 'Score', 'Status'],
    stats: [{ label: 'Audits This Year', val: '14', col: 'text-purple-400' }, { label: 'Open NCs', val: '8', col: 'text-amber-400' }, { label: 'Avg Score', val: '92%', col: 'text-emerald-400' }]
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
  if (col === 'Status' || col === 'Status') {
    return `{ 
      header: '${col}', 
      accessor: (row: any) => (
        <span className={\`px-2 py-1 rounded text-xs font-medium \${
          row.${accessorKey} === 'Active' || row.${accessorKey} === 'Operational' || row.${accessorKey} === 'Available' || row.${accessorKey} === 'Compliant' || row.${accessorKey} === 'Valid' || row.${accessorKey} === 'Sent' || row.${accessorKey} === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
          row.${accessorKey} === 'Pending' || row.${accessorKey} === 'Scheduled' || row.${accessorKey} === 'In Progress' || row.${accessorKey} === 'Booked' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
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

  const mockData = Array.from({ length: 12 }).map((_, i) => ({
    ${page.cols.map((col, idx) => {
  const accessorKey = col.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (col === 'Status') {
    return `${accessorKey}: i % 5 === 0 ? 'Pending' : (i % 7 === 0 ? 'Expired' : 'Active')`;
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

console.log('All 24 final admin subsections generated with proper detailed info!');
