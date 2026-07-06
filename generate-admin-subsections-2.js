const fs = require('fs');
const path = require('path');

const sections = [
  // Operation Management
  {
    path: 'operation/daily', title: 'Daily Operations', desc: 'Track day-to-day hospital operations.',
    cols: ['Date', 'Shift Manager', 'Total Admissions', 'Total Discharges', 'Emergencies', 'Status'],
    stats: [{ label: 'Admissions Today', val: '142', col: 'text-blue-400' }, { label: 'Discharges', val: '98', col: 'text-emerald-400' }, { label: 'Active Ops', val: '24', col: 'text-amber-400' }]
  },
  {
    path: 'operation/census', title: 'Hospital Census', desc: 'Real-time patient census data.',
    cols: ['Census ID', 'Department', 'Inpatients', 'Outpatients', 'Expected Discharges', 'Status'],
    stats: [{ label: 'Total Inpatients', val: '840', col: 'text-purple-400' }, { label: 'Today OPD', val: '1,240', col: 'text-blue-400' }, { label: 'Census Rate', val: '88%', col: 'text-emerald-400' }]
  },
  {
    path: 'operation/bed-occupancy', title: 'Bed Occupancy', desc: 'Detailed bed utilization analytics.',
    cols: ['Ward', 'Total Beds', 'Occupied', 'Available', 'Maintenance', 'Status'],
    stats: [{ label: 'Overall Occupancy', val: '84%', col: 'text-amber-400' }, { label: 'Available Beds', val: '245', col: 'text-emerald-400' }, { label: 'ICU Beds Available', val: '12', col: 'text-red-400' }]
  },
  {
    path: 'operation/flow', title: 'Patient Flow', desc: 'Track patient movement through departments.',
    cols: ['Flow ID', 'Patient Name', 'Current Dept', 'Wait Time', 'Next Step', 'Status'],
    stats: [{ label: 'Avg Wait Time', val: '18 mins', col: 'text-emerald-400' }, { label: 'Bottlenecks', val: 'Radiology', col: 'text-red-400' }, { label: 'Patients in Queue', val: '45', col: 'text-amber-400' }]
  },
  {
    path: 'operation/resource', title: 'Resource Allocation', desc: 'Manage dynamic operational resources.',
    cols: ['Resource ID', 'Type', 'Assigned To', 'Start Time', 'End Time', 'Status'],
    stats: [{ label: 'Active Resources', val: '1,240', col: 'text-blue-400' }, { label: 'Utilization', val: '92%', col: 'text-emerald-400' }, { label: 'Shortages', val: '3', col: 'text-red-400' }]
  },
  // Approval Center
  {
    path: 'approval/admission', title: 'Admission Approvals', desc: 'Review and approve patient admissions.',
    cols: ['Req ID', 'Patient Name', 'Doctor', 'Requested Time', 'Priority', 'Status'],
    stats: [{ label: 'Pending Admissions', val: '14', col: 'text-amber-400' }, { label: 'Approved Today', val: '142', col: 'text-emerald-400' }, { label: 'Rejected', val: '2', col: 'text-red-400' }]
  },
  {
    path: 'approval/transfer', title: 'Transfer Approvals', desc: 'Internal ward and bed transfers.',
    cols: ['Req ID', 'Patient Name', 'From Ward', 'To Ward', 'Reason', 'Status'],
    stats: [{ label: 'Pending Transfers', val: '8', col: 'text-amber-400' }, { label: 'Completed', val: '45', col: 'text-emerald-400' }, { label: 'Critical', val: '2', col: 'text-red-400' }]
  },
  {
    path: 'approval/discharge', title: 'Discharge Approvals', desc: 'Medical and billing discharge clearance.',
    cols: ['Req ID', 'Patient Name', 'Doctor Clearance', 'Billing Status', 'Pharmacy', 'Status'],
    stats: [{ label: 'Pending Discharges', val: '24', col: 'text-amber-400' }, { label: 'Cleared Today', val: '98', col: 'text-emerald-400' }, { label: 'Awaiting Billing', val: '12', col: 'text-purple-400' }]
  },
  {
    path: 'approval/discount', title: 'Discount Approvals', desc: 'Financial discounts and concessions.',
    cols: ['Req ID', 'Patient Name', 'Bill Amount', 'Discount Requested', 'Reason', 'Status'],
    stats: [{ label: 'Pending Discounts', val: '12', col: 'text-amber-400' }, { label: 'Approved Value', val: '$4,250', col: 'text-blue-400' }, { label: 'Rejected', val: '4', col: 'text-red-400' }]
  },
  {
    path: 'approval/refund', title: 'Refund Approvals', desc: 'Process patient refunds and returns.',
    cols: ['Req ID', 'Patient Name', 'Amount', 'Mode', 'Requested By', 'Status'],
    stats: [{ label: 'Pending Refunds', val: '8', col: 'text-amber-400' }, { label: 'Processed Today', val: '$1,200', col: 'text-emerald-400' }, { label: 'Escalated', val: '1', col: 'text-red-400' }]
  },
  {
    path: 'approval/purchase', title: 'Purchase Approvals', desc: 'Procurement and supply chain requests.',
    cols: ['Req ID', 'Department', 'Item', 'Estimated Cost', 'Vendor', 'Status'],
    stats: [{ label: 'Pending POs', val: '24', col: 'text-amber-400' }, { label: 'High Value', val: '3', col: 'text-red-400' }, { label: 'Approved Value', val: '$45k', col: 'text-blue-400' }]
  },
  {
    path: 'approval/leave', title: 'Leave Approvals', desc: 'Staff time-off and leave requests.',
    cols: ['Req ID', 'Employee Name', 'Leave Type', 'Start Date', 'End Date', 'Status'],
    stats: [{ label: 'Pending Leaves', val: '45', col: 'text-amber-400' }, { label: 'Approved Today', val: '12', col: 'text-emerald-400' }, { label: 'Doctors on Leave', val: '8', col: 'text-purple-400' }]
  },
  {
    path: 'approval/asset', title: 'Asset Approvals', desc: 'Equipment and asset requisition.',
    cols: ['Req ID', 'Department', 'Asset Name', 'Quantity', 'Purpose', 'Status'],
    stats: [{ label: 'Pending Requests', val: '14', col: 'text-amber-400' }, { label: 'Approved', val: '42', col: 'text-emerald-400' }, { label: 'Capital Assets', val: '2', col: 'text-indigo-400' }]
  },
  // Policy & SOP Management
  {
    path: 'policy/hospital', title: 'Hospital Policies', desc: 'Core hospital-wide policies.',
    cols: ['Policy ID', 'Title', 'Category', 'Version', 'Last Updated', 'Status'],
    stats: [{ label: 'Active Policies', val: '142', col: 'text-emerald-400' }, { label: 'Under Review', val: '8', col: 'text-amber-400' }, { label: 'New Drafts', val: '4', col: 'text-blue-400' }]
  },
  {
    path: 'policy/sop', title: 'SOP Library', desc: 'Standard Operating Procedures library.',
    cols: ['SOP ID', 'Title', 'Department', 'Author', 'Next Review', 'Status'],
    stats: [{ label: 'Total SOPs', val: '345', col: 'text-blue-400' }, { label: 'Review Overdue', val: '12', col: 'text-red-400' }, { label: 'Updated This Month', val: '24', col: 'text-emerald-400' }]
  },
  {
    path: 'policy/department', title: 'Department SOPs', desc: 'Department-specific procedures.',
    cols: ['Doc ID', 'Department', 'Title', 'Approved By', 'Date', 'Status'],
    stats: [{ label: 'Clinical SOPs', val: '210', col: 'text-indigo-400' }, { label: 'Admin SOPs', val: '85', col: 'text-purple-400' }, { label: 'Pending Approval', val: '14', col: 'text-amber-400' }]
  },
  {
    path: 'policy/acknowledgement', title: 'Policy Acknowledgement', desc: 'Track staff policy adherence.',
    cols: ['Ack ID', 'Employee Name', 'Policy Name', 'Sent Date', 'Signed Date', 'Status'],
    stats: [{ label: 'Pending Signs', val: '142', col: 'text-amber-400' }, { label: 'Compliance Rate', val: '94%', col: 'text-emerald-400' }, { label: 'Overdue', val: '28', col: 'text-red-400' }]
  },
  {
    path: 'policy/document', title: 'Document Control', desc: 'Version history and document tracking.',
    cols: ['Doc ID', 'Document Name', 'Current Version', 'Changes', 'Modified By', 'Status'],
    stats: [{ label: 'Total Documents', val: '840', col: 'text-blue-400' }, { label: 'In Circulation', val: '720', col: 'text-emerald-400' }, { label: 'Archived', val: '120', col: 'text-gray-400' }]
  },
  // Committee Management
  {
    path: 'committee/infection', title: 'Infection Control Committee', desc: 'Manage hospital infection protocols.',
    cols: ['Meeting ID', 'Date', 'Chairperson', 'Key Agenda', 'Attendees', 'Status'],
    stats: [{ label: 'Active Protocols', val: '24', col: 'text-emerald-400' }, { label: 'Reported Cases', val: '3', col: 'text-amber-400' }, { label: 'Next Meeting', val: 'In 2 Days', col: 'text-blue-400' }]
  },
  {
    path: 'committee/pharmacy', title: 'Pharmacy Committee', desc: 'Drug formulary and pharmacy governance.',
    cols: ['Agenda ID', 'Topic', 'Proposed By', 'Review Date', 'Decision', 'Status'],
    stats: [{ label: 'Formulary Items', val: '1,420', col: 'text-blue-400' }, { label: 'Pending Reviews', val: '14', col: 'text-amber-400' }, { label: 'Recent Approvals', val: '8', col: 'text-emerald-400' }]
  },
  {
    path: 'committee/ethics', title: 'Ethics Committee', desc: 'Medical ethics and clinical trials review.',
    cols: ['Case ID', 'Subject', 'Primary Investigator', 'Submission Date', 'Review Status', 'Status'],
    stats: [{ label: 'Active Trials', val: '12', col: 'text-indigo-400' }, { label: 'Pending Reviews', val: '4', col: 'text-amber-400' }, { label: 'Approved', val: '42', col: 'text-emerald-400' }]
  },
  {
    path: 'committee/quality', title: 'Quality Committee', desc: 'Hospital quality assurance and standards.',
    cols: ['Audit ID', 'Department', 'Audit Type', 'Score', 'Findings', 'Status'],
    stats: [{ label: 'Overall Quality', val: '96%', col: 'text-emerald-400' }, { label: 'Pending Audits', val: '3', col: 'text-amber-400' }, { label: 'Corrective Actions', val: '8', col: 'text-red-400' }]
  },
  {
    path: 'committee/mortality', title: 'Mortality Committee', desc: 'Review of mortality cases and outcomes.',
    cols: ['Review ID', 'Patient ID', 'Department', 'Date of Death', 'Review Date', 'Status'],
    stats: [{ label: 'Cases to Review', val: '4', col: 'text-amber-400' }, { label: 'Reviewed YTD', val: '42', col: 'text-blue-400' }, { label: 'Preventable', val: '0', col: 'text-emerald-400' }]
  },
  {
    path: 'committee/safety', title: 'Safety Committee', desc: 'Workplace and patient safety standards.',
    cols: ['Inspection ID', 'Area', 'Inspector', 'Date', 'Hazard Level', 'Status'],
    stats: [{ label: 'Safety Score', val: '98%', col: 'text-emerald-400' }, { label: 'Open Hazards', val: '2', col: 'text-red-400' }, { label: 'Resolved', val: '142', col: 'text-blue-400' }]
  },
  // Incident Management
  {
    path: 'incident/reports', title: 'Incident Reports', desc: 'Log and track all hospital incidents.',
    cols: ['Incident ID', 'Category', 'Location', 'Severity', 'Reported Date', 'Status'],
    stats: [{ label: 'Total Incidents', val: '42', col: 'text-purple-400' }, { label: 'High Severity', val: '2', col: 'text-red-400' }, { label: 'Resolved', val: '34', col: 'text-emerald-400' }]
  },
  {
    path: 'incident/risk', title: 'Risk Management', desc: 'Proactive risk identification and mitigation.',
    cols: ['Risk ID', 'Description', 'Department', 'Probability', 'Impact', 'Status'],
    stats: [{ label: 'Active Risks', val: '14', col: 'text-amber-400' }, { label: 'Critical Risks', val: '1', col: 'text-red-400' }, { label: 'Mitigated', val: '28', col: 'text-emerald-400' }]
  },
  {
    path: 'incident/sentinel', title: 'Sentinel Events', desc: 'Tracking and analysis of critical sentinel events.',
    cols: ['Event ID', 'Event Type', 'Patient ID', 'Date Occurred', 'Reported To Auth', 'Status'],
    stats: [{ label: 'Total Events YTD', val: '2', col: 'text-red-400' }, { label: 'Under Investigation', val: '1', col: 'text-amber-400' }, { label: 'Closed', val: '1', col: 'text-emerald-400' }]
  },
  {
    path: 'incident/rca', title: 'Root Cause Analysis', desc: 'In-depth investigation of incidents.',
    cols: ['RCA ID', 'Related Incident', 'Lead Investigator', 'Started', 'Due Date', 'Status'],
    stats: [{ label: 'Active RCAs', val: '4', col: 'text-amber-400' }, { label: 'Overdue', val: '0', col: 'text-emerald-400' }, { label: 'Completed', val: '12', col: 'text-blue-400' }]
  },
  {
    path: 'incident/capa', title: 'CAPA Tracking', desc: 'Corrective and Preventive Actions.',
    cols: ['CAPA ID', 'Source', 'Action Required', 'Assigned To', 'Deadline', 'Status'],
    stats: [{ label: 'Open CAPAs', val: '18', col: 'text-amber-400' }, { label: 'Past Due', val: '2', col: 'text-red-400' }, { label: 'Verified Closed', val: '45', col: 'text-emerald-400' }]
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
          row.${accessorKey} === 'Active' || row.${accessorKey} === 'Operational' || row.${accessorKey} === 'Approved' || row.${accessorKey} === 'Resolved' || row.${accessorKey} === 'Closed' || row.${accessorKey} === 'Cleared' || row.${accessorKey} === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
          row.${accessorKey} === 'Pending' || row.${accessorKey} === 'In Progress' || row.${accessorKey} === 'Under Review' || row.${accessorKey} === 'Open' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
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
    return `${accessorKey}: i % 5 === 0 ? 'Pending' : (i % 7 === 0 ? 'Rejected' : 'Approved')`;
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

console.log('All 29 individual admin subsections generated with proper detailed info!');
