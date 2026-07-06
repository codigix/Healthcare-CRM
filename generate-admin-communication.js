const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'frontend', 'src', 'app', 'admin', 'communication');

const pages = [
  {
    path: 'notices', title: 'Internal Notices', desc: 'Manage and distribute internal hospital notices.',
    cols: ['Notice ID', 'Subject', 'Target Audience', 'Published By', 'Date', 'Status'],
    stats: [{ label: 'Active Notices', val: '12', col: 'text-blue-400' }, { label: 'Drafts', val: '4', col: 'text-amber-400' }, { label: 'Archived', val: '156', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 6 }).map((_, i) => {
      const subjects = ['Updated Scrub Policy', 'Cafeteria Hours Change', 'New Parking Guidelines', 'IT System Maintenance', 'Annual Leave Policy', 'Fire Drill Schedule'];
      const audiences = ['All Staff', 'All Staff', 'Doctors', 'All Staff', 'Nurses', 'All Staff'];
      const publishers = ['HR Dept', 'Admin Dept', 'Facilities', 'IT Dept', 'HR Dept', 'Safety Comm'];
      const dates = ['Today', 'Yesterday', '12 Aug', '10 Aug', '05 Aug', '01 Aug'];
      const statuses = ['Active', 'Active', 'Active', 'Archived', 'Draft', 'Archived'];
      return {
        noticeid: \`NOT-\${1001 + i}\`,
        subject: subjects[i],
        targetaudience: audiences[i],
        publishedby: publishers[i],
        date: dates[i],
        status: statuses[i]
      };
    })`
  },
  {
    path: 'circulars', title: 'Circulars', desc: 'Distribute official management circulars.',
    cols: ['Circular ID', 'Title', 'Department', 'Issued By', 'Issue Date', 'Status'],
    stats: [{ label: 'Total Circulars', val: '45', col: 'text-indigo-400' }, { label: 'Action Required', val: '3', col: 'text-amber-400' }, { label: 'Acknowledged', val: '98%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 6 }).map((_, i) => {
      const titles = ['Q3 Budget Allocations', 'New Compliance Standards', 'Staff Training Mandate', 'COVID Protocol Update', 'Shift Handover Rules', 'Medical Equipment Usage'];
      const depts = ['Finance', 'Compliance', 'HR', 'Infection Control', 'Nursing', 'Biomedical'];
      const issuers = ['CFO Office', 'Compliance Officer', 'HR Director', 'Chief Medical Officer', 'Head Nurse', 'Facilities Head'];
      const dates = ['15 Aug, 2026', '12 Aug, 2026', '10 Aug, 2026', '01 Aug, 2026', '25 Jul, 2026', '10 Jul, 2026'];
      const statuses = ['Active', 'Active', 'Action Required', 'Active', 'Archived', 'Active'];
      return {
        circularid: \`CIR-\${2001 + i}\`,
        title: titles[i],
        department: depts[i],
        issuedby: issuers[i],
        issuedate: dates[i],
        status: statuses[i]
      };
    })`
  },
  {
    path: 'announcements', title: 'Announcements', desc: 'Hospital-wide major announcements.',
    cols: ['Announce ID', 'Headline', 'Category', 'Posted By', 'Visibility', 'Status'],
    stats: [{ label: 'Live Announcements', val: '5', col: 'text-emerald-400' }, { label: 'Scheduled', val: '2', col: 'text-blue-400' }, { label: 'Expired', val: '34', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 6 }).map((_, i) => {
      const headlines = ['Hospital Awarded NABH A+', 'Welcome New Chief Surgeon', 'Blood Donation Camp', 'Free Health Checkup Drive', 'Townhall Meeting Reminder', 'New MRI Machine Installed'];
      const categories = ['Achievement', 'HR', 'Event', 'Event', 'Internal', 'Facility'];
      const posters = ['PR Dept', 'HR Dept', 'Community Outreach', 'Admin', 'CEO Office', 'Radiology Dept'];
      const visibilities = ['Public', 'Internal', 'Public', 'Public', 'Internal', 'Public'];
      const statuses = ['Live', 'Live', 'Scheduled', 'Live', 'Expired', 'Live'];
      return {
        announceid: \`ANN-\${3001 + i}\`,
        headline: headlines[i],
        category: categories[i],
        postedby: posters[i],
        visibility: visibilities[i],
        status: statuses[i]
      };
    })`
  },
  {
    path: 'broadcast', title: 'Broadcast Messages', desc: 'Send SMS and push broadcasts to specific groups.',
    cols: ['Broadcast ID', 'Message Snippet', 'Channel', 'Recipients', 'Sent At', 'Status'],
    stats: [{ label: 'Messages Sent', val: '1.2M', col: 'text-blue-400' }, { label: 'Delivery Rate', val: '99.8%', col: 'text-emerald-400' }, { label: 'Failed', val: '0.2%', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 6 }).map((_, i) => {
      const messages = ['Reminder: OPD is closed tomorrow...', 'Your appointment is confirmed...', 'Please check your email for...', 'Urgent: Blood type O- needed...', 'Server maintenance starting in...', 'Holiday greetings from MedixPro...'];
      const channels = ['SMS', 'SMS & Email', 'Email', 'Push Notification', 'SMS', 'Email'];
      const recipients = ['All Patients', 'Cardiology Patients', 'All Staff', 'Surgeons', 'IT Staff', 'All Patients'];
      const times = ['10:00 AM Today', '09:00 AM Today', 'Yesterday 5:00 PM', 'Yesterday 2:00 PM', '12 Aug 10:00 AM', '01 Aug 08:00 AM'];
      const statuses = ['Delivered', 'Sending...', 'Delivered', 'Delivered', 'Failed', 'Delivered'];
      return {
        broadcastid: \`BRD-\${4001 + i}\`,
        messagesnippet: messages[i],
        channel: channels[i],
        recipients: recipients[i],
        sentat: times[i],
        status: statuses[i]
      };
    })`
  },
  {
    path: 'alerts', title: 'Emergency Alerts', desc: 'Trigger and monitor critical hospital-wide emergency alerts.',
    cols: ['Alert ID', 'Alert Code', 'Location', 'Triggered By', 'Time Elapsed', 'Status'],
    stats: [{ label: 'Active Alerts', val: '1', col: 'text-red-500' }, { label: 'Resolved Today', val: '3', col: 'text-emerald-400' }, { label: 'Avg Response Time', val: '2.4 mins', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 6 }).map((_, i) => {
      const codes = ['Code Blue (Cardiac)', 'Code Red (Fire)', 'Code Black (Bomb Threat)', 'Code Pink (Abduction)', 'Code Orange (Hazmat)', 'Code Blue (Cardiac)'];
      const locations = ['ICU Bed 4', 'Kitchen Area', 'Main Lobby', 'Maternity Ward', 'Bio-Waste Zone', 'ER Bay 2'];
      const triggers = ['Nurse Ratched', 'Smoke Detector 12', 'Security Post A', 'Nurse Joy', 'Janitorial Staff', 'Dr. Carter'];
      const times = ['04m 12s', 'Resolved', 'Resolved', 'Resolved', 'Resolved', 'Resolved'];
      const statuses = ['Active', 'Resolved', 'False Alarm', 'Resolved', 'Resolved', 'Resolved'];
      return {
        alertid: \`ALT-\${5001 + i}\`,
        alertcode: codes[i],
        location: locations[i],
        triggeredby: triggers[i],
        timeelapsed: times[i],
        status: statuses[i]
      };
    })`
  }
];

const template = (page, componentName) => `"use client";

import React, { useState } from 'react';
import { MessageSquare, Plus, Search, Filter, MoreVertical, Download, AlertTriangle } from 'lucide-react';
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
          row.${accessorKey} === 'Active' || row.${accessorKey} === 'Live' || row.${accessorKey} === 'Delivered' || row.${accessorKey} === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
          row.${accessorKey} === 'Draft' || row.${accessorKey} === 'Action Required' || row.${accessorKey} === 'Scheduled' || row.${accessorKey} === 'Sending...' || row.${accessorKey} === 'False Alarm' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
          row.${accessorKey} === 'Archived' || row.${accessorKey} === 'Expired' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' : 
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
            { '${page.title}' === 'Emergency Alerts' ? <AlertTriangle className="text-red-500 animate-pulse" size={24} /> : <MessageSquare className="text-violet-500" size={24} /> }
            ${page.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">${page.desc}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-dark-secondary border border-gray-700 rounded-lg text-sm font-medium hover:bg-dark-tertiary transition-colors text-white">
            <Download size={16} /> Export
          </button>
          <button className={\`flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-all \${'${page.title}' === 'Emergency Alerts' ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20' : 'bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-500/20'}\`}>
            <Plus size={16} /> ${page.title === 'Emergency Alerts' ? 'Trigger Alert' : 'Create New'}
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

      <div className="">
        <div className="flex justify-between items-center my-3 my-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search records..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-violet-500 text-white w-64 transition-colors"
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
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const componentName = page.title.replace(/[^a-zA-Z0-9]/g, '');
  fs.writeFileSync(path.join(dir, 'page.tsx'), template(page, componentName));
  console.log(`Updated detailed page for communication/${page.path}`);
});
