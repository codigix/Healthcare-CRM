const fs = require('fs');
const path = require('path');

const config = [
  {
    path: 'patients/demographics', title: 'Patient Demographics', desc: 'Comprehensive demographic data for registered patients.',
    cols: ['Patient ID', 'Full Name', 'Age/Gender', 'Contact', 'City', 'Status'],
    stats: [{ label: 'Total Registered', val: '12,450', col: 'text-blue-400' }, { label: 'New Today', val: '42', col: 'text-emerald-400' }, { label: 'Incomplete Profiles', val: '15', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Robert Brown', 'Emily Davis'];
      const details = ['45/M', '32/F', '28/F', '56/M', '41/F'];
      const contacts = ['+1 555-010' + i, '+1 555-020' + i, '+1 555-030' + i, '+1 555-040' + i, '+1 555-050' + i];
      const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
      const statuses = ['Active', 'Active', 'Incomplete', 'Active', 'Active'];
      return { patientid: 'PAT-' + (1001+i), fullname: names[i], agegender: details[i], contact: contacts[i], city: cities[i], status: statuses[i] };
    })`
  },
  {
    path: 'patients/consents', title: 'Patient Consents', desc: 'Manage legal and medical consent forms signed by patients.',
    cols: ['Consent ID', 'Patient Name', 'Form Type', 'Date Signed', 'Witness', 'Status'],
    stats: [{ label: 'Active Consents', val: '8,420', col: 'text-blue-400' }, { label: 'Pending Signature', val: '45', col: 'text-amber-400' }, { label: 'Expired', val: '12', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'];
      const forms = ['Surgical Consent', 'Data Privacy (HIPAA)', 'General Admission', 'Blood Transfusion', 'Research Study'];
      const dates = ['12 May, 2026', '14 May, 2026', '15 May, 2026', '10 May, 2026', '01 May, 2026'];
      const statuses = ['Approved', 'Approved', 'Pending', 'Approved', 'Expired'];
      return { consentid: 'CST-' + (2001+i), patientname: names[i], formtype: forms[i], datesigned: dates[i], witness: 'Dr. Vance', status: statuses[i] };
    })`
  },
  {
    path: 'patients/documents', title: 'Patient Documents', desc: 'Digital repository of patient medical and identity documents.',
    cols: ['Doc ID', 'Patient Name', 'Document Type', 'Upload Date', 'Size', 'Status'],
    stats: [{ label: 'Total Documents', val: '45,210', col: 'text-blue-400' }, { label: 'Storage Used', val: '124 GB', col: 'text-emerald-400' }, { label: 'Unverified Docs', val: '18', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Clark Kent', 'Bruce Wayne', 'Diana Prince', 'Barry Allen', 'Hal Jordan'];
      const types = ['Identity Proof (ID)', 'Previous Records', 'Insurance Card', 'Lab Results', 'Discharge Summary'];
      const sizes = ['2.4 MB', '15.1 MB', '1.2 MB', '4.5 MB', '3.1 MB'];
      const statuses = ['Verified', 'Verified', 'Pending Review', 'Verified', 'Verified'];
      return { docid: 'DOC-' + (3001+i), patientname: names[i], documenttype: types[i], uploaddate: 'Today', size: sizes[i], status: statuses[i] };
    })`
  },
  {
    path: 'patients/photo', title: 'Patient Photos', desc: 'Manage patient profile photos for identification.',
    cols: ['Record ID', 'Patient Name', 'Photo Hash/Ref', 'Upload Date', 'Quality Check', 'Status'],
    stats: [{ label: 'Total Photos', val: '11,200', col: 'text-blue-400' }, { label: 'Missing Photos', val: '1,250', col: 'text-amber-400' }, { label: 'Rejected', val: '14', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Clint Barton'];
      const hashes = ['IMG_8492.jpg', 'IMG_8493.jpg', 'IMG_8494.jpg', 'N/A', 'IMG_8496.jpg'];
      const qualities = ['Passed', 'Passed', 'Passed', 'Failed', 'Pending'];
      const statuses = ['Approved', 'Approved', 'Approved', 'Rejected', 'Under Review'];
      return { recordid: 'PHO-' + (4001+i), patientname: names[i], photohashref: hashes[i], uploaddate: '12 Jun, 2026', qualitycheck: qualities[i], status: statuses[i] };
    })`
  },
  {
    path: 'patients/id-card', title: 'Patient ID Cards', desc: 'Generate and print physical or digital ID cards for patients.',
    cols: ['Card ID', 'Patient Name', 'Card Type', 'Issue Date', 'Validity', 'Status'],
    stats: [{ label: 'Cards Issued', val: '10,500', col: 'text-blue-400' }, { label: 'Print Queue', val: '24', col: 'text-amber-400' }, { label: 'Digital Only', val: '3,200', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Peter Parker', 'Mary Jane', 'Harry Osborn', 'Gwen Stacy', 'Miles Morales'];
      const types = ['Physical PVC', 'Digital Wallet', 'Physical PVC', 'Digital Wallet', 'Physical PVC'];
      const issues = ['10 Jun, 2026', '12 Jun, 2026', '14 Jun, 2026', '-', '01 Jun, 2026'];
      const statuses = ['Active', 'Active', 'Active', 'Pending Print', 'Active'];
      return { cardid: 'IDC-' + (5001+i), patientname: names[i], cardtype: types[i], issuedate: issues[i], validity: 'Lifetime', status: statuses[i] };
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
        const isGood = val === 'Active' || val === 'Approved' || val === 'Verified' || val === 'Processed' || val === 'Passed';
        const isWarning = val === 'Incomplete' || val === 'Pending' || val === 'Pending Review' || val === 'Under Review' || val === 'Pending Print' || val === 'Pending Signature';
        const isNeutral = val === 'Stable' || val === 'Archived';
        
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
