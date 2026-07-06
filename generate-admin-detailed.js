const fs = require('fs');
const path = require('path');

const adminPages = [
  {
    path: 'department', title: 'Department Management', desc: 'Manage clinical and non-clinical departments.',
    cols: ['Department ID', 'Department Name', 'HOD', 'Staff Count', 'Beds', 'Status'],
    stats: [{ label: 'Total Departments', val: '42', col: 'text-blue-400' }, { label: 'Clinical', val: '28', col: 'text-emerald-400' }, { label: 'Non-Clinical', val: '14', col: 'text-purple-400' }]
  },
  {
    path: 'employee', title: 'Employee Administration', desc: 'Manage hospital staff and records.',
    cols: ['Emp ID', 'Name', 'Role', 'Department', 'Shift', 'Status'],
    stats: [{ label: 'Total Employees', val: '1,450', col: 'text-blue-400' }, { label: 'On Duty', val: '420', col: 'text-emerald-400' }, { label: 'On Leave', val: '35', col: 'text-amber-400' }]
  },
  {
    path: 'doctor', title: 'Doctor Administration', desc: 'Manage doctors and specialists.',
    cols: ['Dr ID', 'Name', 'Specialization', 'Department', 'Consultation Fee', 'Status'],
    stats: [{ label: 'Total Doctors', val: '320', col: 'text-indigo-400' }, { label: 'Available', val: '145', col: 'text-emerald-400' }, { label: 'In Surgery', val: '24', col: 'text-red-400' }]
  },
  {
    path: 'patient', title: 'Patient Administration', desc: 'Manage patient records and demographics.',
    cols: ['Patient ID', 'Name', 'Age/Gender', 'Blood Group', 'Last Visit', 'Status'],
    stats: [{ label: 'Registered Patients', val: '45k+', col: 'text-blue-400' }, { label: 'Active IPD', val: '850', col: 'text-emerald-400' }, { label: 'Today OPD', val: '1,240', col: 'text-purple-400' }]
  },
  {
    path: 'operation', title: 'Operation Management', desc: 'Manage daily hospital operations.',
    cols: ['OT ID', 'Operation Name', 'Surgeon', 'Date', 'Duration', 'Status'],
    stats: [{ label: 'Scheduled Surgeries', val: '45', col: 'text-blue-400' }, { label: 'In Progress', val: '12', col: 'text-amber-400' }, { label: 'Completed Today', val: '28', col: 'text-emerald-400' }]
  },
  {
    path: 'approval', title: 'Approval Center', desc: 'Pending approvals and requests.',
    cols: ['Request ID', 'Type', 'Requested By', 'Date', 'Priority', 'Status'],
    stats: [{ label: 'Pending Approvals', val: '86', col: 'text-amber-400' }, { label: 'High Priority', val: '14', col: 'text-red-400' }, { label: 'Approved Today', val: '124', col: 'text-emerald-400' }]
  },
  {
    path: 'policy', title: 'Policy & SOP Management', desc: 'Hospital policies and standard operating procedures.',
    cols: ['Policy ID', 'Title', 'Category', 'Last Updated', 'Version', 'Status'],
    stats: [{ label: 'Active Policies', val: '142', col: 'text-blue-400' }, { label: 'Under Review', val: '8', col: 'text-amber-400' }, { label: 'Updates Needed', val: '12', col: 'text-red-400' }]
  },
  {
    path: 'committee', title: 'Committee Management', desc: 'Hospital committees and meetings.',
    cols: ['Committee ID', 'Name', 'Chairperson', 'Members', 'Next Meeting', 'Status'],
    stats: [{ label: 'Active Committees', val: '18', col: 'text-blue-400' }, { label: 'Meetings This Week', val: '4', col: 'text-purple-400' }, { label: 'Pending Actions', val: '22', col: 'text-amber-400' }]
  },
  {
    path: 'incident', title: 'Incident Management', desc: 'Track and resolve hospital incidents.',
    cols: ['Incident ID', 'Type', 'Location', 'Reported By', 'Date', 'Status'],
    stats: [{ label: 'Total Incidents', val: '42', col: 'text-red-400' }, { label: 'Unresolved', val: '8', col: 'text-amber-400' }, { label: 'Resolved', val: '34', col: 'text-emerald-400' }]
  },
  {
    path: 'resource', title: 'Resource Management', desc: 'Manage hospital resources and assets.',
    cols: ['Asset ID', 'Name', 'Category', 'Location', 'Last Serviced', 'Status'],
    stats: [{ label: 'Total Assets', val: '12.4k', col: 'text-blue-400' }, { label: 'In Use', val: '11.8k', col: 'text-emerald-400' }, { label: 'Needs Maintenance', val: '142', col: 'text-red-400' }]
  },
  {
    path: 'calendar', title: 'Hospital Calendar', desc: 'Events and schedules.',
    cols: ['Event ID', 'Event Name', 'Date', 'Time', 'Location', 'Status'],
    stats: [{ label: 'Upcoming Events', val: '24', col: 'text-blue-400' }, { label: 'This Week', val: '8', col: 'text-purple-400' }, { label: 'Holidays', val: '3', col: 'text-emerald-400' }]
  },
  {
    path: 'communication', title: 'Communication Center', desc: 'Internal hospital communication.',
    cols: ['Message ID', 'Subject', 'Sender', 'Recipient', 'Date', 'Status'],
    stats: [{ label: 'Unread Messages', val: '142', col: 'text-amber-400' }, { label: 'Announcements', val: '12', col: 'text-blue-400' }, { label: 'Urgent', val: '5', col: 'text-red-400' }]
  },
  {
    path: 'vendor', title: 'Vendor Administration', desc: 'Manage suppliers and vendors.',
    cols: ['Vendor ID', 'Company Name', 'Category', 'Contact Person', 'Rating', 'Status'],
    stats: [{ label: 'Active Vendors', val: '245', col: 'text-emerald-400' }, { label: 'Contracts Expiring', val: '14', col: 'text-amber-400' }, { label: 'Pending Invoices', val: '86', col: 'text-purple-400' }]
  },
  {
    path: 'compliance', title: 'Compliance', desc: 'Regulatory and compliance tracking.',
    cols: ['Record ID', 'Regulation', 'Category', 'Last Audit', 'Next Audit', 'Status'],
    stats: [{ label: 'Compliance Score', val: '98%', col: 'text-emerald-400' }, { label: 'Upcoming Audits', val: '3', col: 'text-amber-400' }, { label: 'Violations', val: '0', col: 'text-blue-400' }]
  },
  {
    path: 'reports/daily', title: 'Daily Hospital Report', desc: 'Daily operational reports.',
    cols: ['Report ID', 'Date', 'Generated By', 'Total Admissions', 'Total Discharges', 'Status'],
    stats: [{ label: 'Admissions Today', val: '142', col: 'text-blue-400' }, { label: 'Discharges Today', val: '98', col: 'text-emerald-400' }, { label: 'Net Change', val: '+44', col: 'text-purple-400' }]
  },
  {
    path: 'reports/bed', title: 'Bed Occupancy Report', desc: 'Bed availability and occupancy rates.',
    cols: ['Report ID', 'Date', 'Ward', 'Total Beds', 'Occupied', 'Available'],
    stats: [{ label: 'Occupancy Rate', val: '84%', col: 'text-amber-400' }, { label: 'Available Beds', val: '245', col: 'text-emerald-400' }, { label: 'ICU Availability', val: '12', col: 'text-red-400' }]
  },
  {
    path: 'reports/department', title: 'Department Performance', desc: 'Departmental KPIs and metrics.',
    cols: ['Report ID', 'Department', 'Patients Seen', 'Revenue', 'Avg Wait Time', 'Status'],
    stats: [{ label: 'Top Performing', val: 'Cardiology', col: 'text-blue-400' }, { label: 'Avg Wait Time', val: '18 mins', col: 'text-emerald-400' }, { label: 'Total Revenue', val: '$145k', col: 'text-purple-400' }]
  },
  {
    path: 'reports/doctor', title: 'Doctor Performance', desc: 'Doctor KPIs and metrics.',
    cols: ['Report ID', 'Doctor', 'Consultations', 'Operations', 'Revenue', 'Status'],
    stats: [{ label: 'Avg Consultations', val: '32/day', col: 'text-blue-400' }, { label: 'Patient Rating', val: '4.8/5', col: 'text-emerald-400' }, { label: 'Successful OTs', val: '99.2%', col: 'text-purple-400' }]
  },
  {
    path: 'reports/patient', title: 'Patient Statistics', desc: 'Patient demographics and stats.',
    cols: ['Report ID', 'Category', 'Total Patients', 'New Registrations', 'Follow-ups', 'Status'],
    stats: [{ label: 'New Patients (M)', val: '1,240', col: 'text-blue-400' }, { label: 'Retention Rate', val: '86%', col: 'text-emerald-400' }, { label: 'Avg Age', val: '42', col: 'text-purple-400' }]
  },
  {
    path: 'reports/incident', title: 'Incident Reports', desc: 'Detailed incident reporting.',
    cols: ['Report ID', 'Period', 'Total Incidents', 'Resolved', 'Pending', 'Status'],
    stats: [{ label: 'Critical Incidents', val: '2', col: 'text-red-400' }, { label: 'Resolution Rate', val: '94%', col: 'text-emerald-400' }, { label: 'Avg Resolution Time', val: '4 hrs', col: 'text-blue-400' }]
  },
  {
    path: 'reports/admin', title: 'Administrative Reports', desc: 'General administrative reports.',
    cols: ['Report ID', 'Title', 'Generated By', 'Date', 'Category', 'Status'],
    stats: [{ label: 'Reports Generated', val: '1,245', col: 'text-blue-400' }, { label: 'Scheduled Reports', val: '42', col: 'text-purple-400' }, { label: 'Failed Deliveries', val: '0', col: 'text-emerald-400' }]
  },
  {
    path: 'analytics', title: 'Analytics', desc: 'Advanced data analytics.',
    cols: ['Metric ID', 'Metric Name', 'Current Value', 'Previous Value', 'Change %', 'Status'],
    stats: [{ label: 'Overall Growth', val: '+12.4%', col: 'text-emerald-400' }, { label: 'Revenue YTD', val: '$4.2M', col: 'text-blue-400' }, { label: 'Patient Satisfaction', val: '92%', col: 'text-purple-400' }]
  },
  {
    path: 'settings', title: 'Settings', desc: 'Admin module settings.',
    cols: ['Setting ID', 'Module', 'Key', 'Value', 'Last Updated', 'Status'],
    stats: [{ label: 'System Status', val: 'Healthy', col: 'text-emerald-400' }, { label: 'Last Backup', val: '2 hrs ago', col: 'text-blue-400' }, { label: 'Active Users', val: '142', col: 'text-purple-400' }]
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
  if (col === 'Status' || col === 'Available') {
    return `{ 
      header: '${col}', 
      accessor: (row: any) => (
        <span className={\`px-2 py-1 rounded text-xs font-medium \${
          row.${accessorKey} === 'Active' || row.${accessorKey} === 'Operational' || row.${accessorKey} === 'Approved' || row.${accessorKey} === 'Resolved' || row.${accessorKey} === 'Available' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
          row.${accessorKey} === 'Pending' || row.${accessorKey} === 'In Progress' || row.${accessorKey} === 'Occupied' || row.${accessorKey} === 'Under Review' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
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
    return `${accessorKey}: i % 5 === 0 ? 'Pending' : (i % 7 === 0 ? 'Inactive' : 'Active')`;
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
            <Activity className="text-emerald-500" size={24} />
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
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">${stat.label}</p>
          <p className="text-2xl  mt-2 ${stat.col}">${stat.val}</p>
        </div>`).join('')}
      </div>

      <div className="my-3">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center my-3 my-3 bg-dark-tertiary/20">
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

adminPages.forEach(page => {
  const dir = path.join(basePath, page.path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const componentName = page.title.replace(/[^a-zA-Z0-9]/g, '');
  const filePath = path.join(dir, 'page.tsx');

  fs.writeFileSync(filePath, template(page, componentName));
  console.log(`Created custom detailed page for ${page.path}/page.tsx`);
});

console.log('All individual admin pages generated with proper detailed info!');
