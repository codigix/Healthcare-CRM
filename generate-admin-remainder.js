const fs = require('fs');
const path = require('path');

const basePaths = {
  patients: path.join(__dirname, 'frontend', 'src', 'app', 'admin', 'patients'),
  hospital: path.join(__dirname, 'frontend', 'src', 'app', 'admin', 'hospital')
};

const patientsPages = [
  {
    path: 'overview', title: 'Patient Overview', desc: 'General patient registry and comprehensive dashboard.',
    cols: ['Patient ID', 'Full Name', 'Age / Gender', 'Admitted Date', 'Attending Doctor', 'Status'],
    stats: [{ label: 'Total Admitted', val: '840', col: 'text-blue-400' }, { label: 'New Today', val: '124', col: 'text-emerald-400' }, { label: 'Discharges Today', val: '98', col: 'text-purple-400' }],
    mockDataGenerator: `Array.from({ length: 8 }).map((_, i) => {
      const names = ['John Doe', 'Jane Smith', 'Michael Johnson', 'Emily Davis', 'Robert Wilson', 'Sophia Taylor', 'James Anderson', 'Olivia Thomas'];
      const ages = ['45 / M', '32 / F', '58 / M', '29 / F', '65 / M', '41 / F', '50 / M', '24 / F'];
      const dates = ['10 Aug, 2026', '12 Aug, 2026', '15 Aug, 2026', '16 Aug, 2026', '17 Aug, 2026', '18 Aug, 2026', '19 Aug, 2026', '20 Aug, 2026'];
      const doctors = ['Dr. Sarah Jenkins', 'Dr. Mark Sloan', 'Dr. Emily Chen', 'Dr. Robert King', 'Dr. Lisa Cuddy', 'Dr. Peter Benton', 'Dr. Susan Lewis', 'Dr. Gregory House'];
      const statuses = ['Admitted', 'Admitted', 'Discharged', 'Critical', 'Admitted', 'Stable', 'Under Obs', 'Discharged'];
      return {
        patientid: \`PAT-\${1001 + i}\`,
        fullname: names[i],
        agegender: ages[i],
        admitteddate: dates[i],
        attendingdoctor: doctors[i],
        status: statuses[i]
      };
    })`
  },
  {
    path: 'vip', title: 'VIP Patients', desc: 'Special registry for high-profile and VIP patients.',
    cols: ['VIP ID', 'Patient Name', 'Security Level', 'Suite Assigned', 'Primary Consultant', 'Status'],
    stats: [{ label: 'Active VIPs', val: '12', col: 'text-amber-400' }, { label: 'Suites Occupied', val: '8', col: 'text-blue-400' }, { label: 'Special Requests', val: '3', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 6 }).map((_, i) => {
      const names = ['Alexander Sterling', 'Victoria Crown', 'Senator Richard', 'CEO Jonathan Vance', 'Isabella Montague', 'Ambassador Chen'];
      const levels = ['Level 1 (Max)', 'Level 2 (High)', 'Level 2 (High)', 'Level 3 (Med)', 'Level 2 (High)', 'Level 1 (Max)'];
      const suites = ['Presidential Suite 1', 'Diamond Suite 3', 'Diamond Suite 2', 'Platinum Room 5', 'Platinum Room 1', 'Presidential Suite 2'];
      const docs = ['Dr. Sarah Jenkins', 'Dr. Gregory House', 'Dr. Mark Sloan', 'Dr. Peter Benton', 'Dr. Emily Chen', 'Dr. Robert King'];
      const statuses = ['Admitted', 'Stable', 'Discharged', 'Admitted', 'Stable', 'Admitted'];
      return {
        vipid: \`VIP-\${2001 + i}\`,
        patientname: names[i],
        securitylevel: levels[i],
        suiteassigned: suites[i],
        primaryconsultant: docs[i],
        status: statuses[i]
      };
    })`
  },
  {
    path: 'international', title: 'International Patients', desc: 'Manage patients traveling from overseas for medical tourism.',
    cols: ['Case ID', 'Patient Name', 'Country', 'Visa Expiry', 'Coordinator', 'Status'],
    stats: [{ label: 'International Patients', val: '45', col: 'text-indigo-400' }, { label: 'Arrivals This Week', val: '8', col: 'text-emerald-400' }, { label: 'Visa Issues', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 6 }).map((_, i) => {
      const names = ['Carlos Ramirez', 'Li Wei', 'Aisha Al-Fayed', 'Hans Gruber', 'Priya Sharma', 'Dmitry Volkov'];
      const countries = ['Mexico', 'China', 'UAE', 'Germany', 'India', 'Russia'];
      const visas = ['15 Sep, 2026', '20 Oct, 2026', '12 Dec, 2026', '05 Nov, 2026', '30 Aug, 2026', '18 Sep, 2026'];
      const coords = ['Maria Garcia', 'Jason Lin', 'Sarah Connor', 'Maria Garcia', 'Raj Patel', 'Jason Lin'];
      const statuses = ['In Treatment', 'Arriving Soon', 'Discharged', 'In Treatment', 'Visa Pending', 'In Treatment'];
      return {
        caseid: \`INT-\${3001 + i}\`,
        patientname: names[i],
        country: countries[i],
        visaexpiry: visas[i],
        coordinator: coords[i],
        status: statuses[i]
      };
    })`
  },
  {
    path: 'corporate', title: 'Corporate Patients', desc: 'Track patients associated with corporate tie-ups and insurance.',
    cols: ['Corp ID', 'Patient Name', 'Company', 'Insurance TPA', 'Policy Max', 'Status'],
    stats: [{ label: 'Corporate Ties', val: '120', col: 'text-blue-400' }, { label: 'Active Patients', val: '315', col: 'text-emerald-400' }, { label: 'Pending Approvals', val: '18', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 6 }).map((_, i) => {
      const names = ['Michael Chang', 'Jessica Roberts', 'David Foster', 'Amanda Clarke', 'James Wilson', 'Lisa Cuddy'];
      const companies = ['TechCorp Inc.', 'Global Logistics', 'Stark Industries', 'Wayne Enterprises', 'TechCorp Inc.', 'Massive Dynamic'];
      const tpas = ['BlueCross', 'Aetna', 'MediShield', 'UnitedHealth', 'BlueCross', 'Cigna'];
      const maxes = ['$500,000', '$250,000', '$1,000,000', '$750,000', '$500,000', '$1,000,000'];
      const statuses = ['Approved', 'Pending', 'Approved', 'Discharged', 'Rejected', 'Approved'];
      return {
        corpid: \`CRP-\${4001 + i}\`,
        patientname: names[i],
        company: companies[i],
        insurancetpa: tpas[i],
        policymax: maxes[i],
        status: statuses[i]
      };
    })`
  },
  {
    path: 'mlc', title: 'Medico Legal Cases', desc: 'Securely track and manage medico-legal cases (MLC).',
    cols: ['MLC ID', 'Patient Name', 'Incident Type', 'Police Station', 'FIR No', 'Status'],
    stats: [{ label: 'Active MLCs', val: '24', col: 'text-amber-400' }, { label: 'Police Notified', val: '24', col: 'text-emerald-400' }, { label: 'Court Summons', val: '3', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 6 }).map((_, i) => {
      const names = ['Unknown Male', 'John Doe', 'Robert Smith', 'Jane Doe', 'Michael Johnson', 'Unknown Female'];
      const incidents = ['RTA (Road Traffic)', 'Assault', 'Industrial Accident', 'Poisoning', 'Assault', 'RTA (Road Traffic)'];
      const stations = ['Central Station', 'North Precinct', 'East District', 'West Division', 'Central Station', 'South Precinct'];
      const firs = ['FIR-10293', 'Pending', 'FIR-10245', 'FIR-10555', 'FIR-10294', 'Pending'];
      const statuses = ['Active', 'Police Notified', 'Closed', 'Active', 'Court Case', 'Police Notified'];
      return {
        mlcid: \`MLC-\${5001 + i}\`,
        patientname: names[i],
        incidenttype: incidents[i],
        policestation: stations[i],
        firno: firs[i],
        status: statuses[i]
      };
    })`
  }
];

const hospitalPages = [
  {
    path: 'profile', title: 'Hospital Profile', desc: 'Manage core hospital identity, accreditation, and global settings.',
    cols: ['ID', 'Hospital Name', 'Registration Number', 'Tax ID', 'Primary Contact', 'Status'],
    stats: [{ label: 'Total Branches', val: '4', col: 'text-emerald-400' }, { label: 'Total Beds', val: '1,250', col: 'text-blue-400' }, { label: 'Accreditations', val: '2 Active', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 4 }).map((_, i) => {
      const names = ['MedixPro Central (HQ)', 'MedixPro North Wing', 'MedixPro East Campus', 'MedixPro South Annex'];
      const regs = ['REG-0019283-A', 'REG-0019283-B', 'REG-0019283-C', 'REG-0019283-D'];
      const taxes = ['TAX-998811', 'TAX-998811', 'TAX-998811', 'TAX-998811'];
      const contacts = ['+1 (555) 100-0000', '+1 (555) 200-0000', '+1 (555) 300-0000', '+1 (555) 400-0000'];
      const statuses = ['Active', 'Active', 'Maintenance', 'Active'];
      return {
        id: \`HOS-00\${1 + i}\`,
        hospitalname: names[i],
        registrationnumber: regs[i],
        taxid: taxes[i],
        primarycontact: contacts[i],
        status: statuses[i]
      };
    })`
  },
  {
    path: 'branch', title: 'Branch Management', desc: 'Manage hospital branches and regional centers.',
    cols: ['Branch ID', 'Branch Name', 'City', 'Head Admin', 'Bed Capacity', 'Status'],
    stats: [{ label: 'Active Branches', val: '4', col: 'text-emerald-400' }, { label: 'Under Construction', val: '1', col: 'text-amber-400' }, { label: 'Total Capacity', val: '1,250 Beds', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const names = ['Central Branch', 'North Wing Center', 'East Campus Facility', 'South Annex', 'West Metro (New)'];
      const cities = ['Metropolis', 'Gotham', 'Star City', 'Central City', 'Coast City'];
      const admins = ['Richard Webber', 'Miranda Bailey', 'Owen Hunt', 'Teddy Altman', 'Pending'];
      const beds = ['500', '250', '300', '200', 'N/A'];
      const statuses = ['Active', 'Active', 'Active', 'Maintenance', 'Construction'];
      return {
        branchid: \`BRN-100\${1 + i}\`,
        branchname: names[i],
        city: cities[i],
        headadmin: admins[i],
        bedcapacity: beds[i],
        status: statuses[i]
      };
    })`
  },
  {
    path: 'buildings', title: 'Building Management', desc: 'Manage hospital buildings and physical structures.',
    cols: ['Bldg ID', 'Building Name', 'Branch', 'Floors', 'Fire Clearance', 'Status'],
    stats: [{ label: 'Total Buildings', val: '12', col: 'text-blue-400' }, { label: 'Fully Operational', val: '10', col: 'text-emerald-400' }, { label: 'Pending Inspection', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 6 }).map((_, i) => {
      const names = ['Main Tower', 'Outpatient Block', 'Emergency Wing', 'Research Facility', 'Staff Quarters', 'Parking Garage'];
      const branches = ['Central Branch', 'Central Branch', 'Central Branch', 'East Campus', 'North Wing', 'Central Branch'];
      const floors = ['12', '5', '3', '8', '6', '4'];
      const clearances = ['Valid (2028)', 'Valid (2027)', 'Valid (2027)', 'Expiring Soon', 'Valid (2029)', 'Valid (2028)'];
      const statuses = ['Active', 'Active', 'Active', 'Inspection Required', 'Active', 'Maintenance'];
      return {
        bldgid: \`BLD-200\${1 + i}\`,
        buildingname: names[i],
        branch: branches[i],
        floors: floors[i],
        fireclearance: clearances[i],
        status: statuses[i]
      };
    })`
  },
  {
    path: 'floors', title: 'Floor Management', desc: 'Manage floor layouts and department zoning.',
    cols: ['Floor ID', 'Floor Name', 'Building', 'Primary Dept', 'Zone Type', 'Status'],
    stats: [{ label: 'Total Floors Managed', val: '48', col: 'text-blue-400' }, { label: 'Clinical Floors', val: '32', col: 'text-emerald-400' }, { label: 'Restricted Zones', val: '5', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 6 }).map((_, i) => {
      const names = ['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor', 'Fourth Floor', 'Fifth Floor'];
      const buildings = ['Emergency Wing', 'Main Tower', 'Main Tower', 'Main Tower', 'Main Tower', 'Outpatient Block'];
      const depts = ['ER / Triage', 'Cardiology', 'Neurology', 'Oncology', 'Surgery / OR', 'Diagnostics'];
      const zones = ['High Traffic', 'Sterile', 'Clinical', 'Clinical', 'Restricted', 'Clinical'];
      const statuses = ['Active', 'Active', 'Active', 'Active', 'Deep Cleaning', 'Active'];
      return {
        floorid: \`FLR-300\${1 + i}\`,
        floorname: names[i],
        building: buildings[i],
        primarydept: depts[i],
        zonetype: zones[i],
        status: statuses[i]
      };
    })`
  },
  {
    path: 'wards', title: 'Ward Management', desc: 'Manage inpatient wards and nursing stations.',
    cols: ['Ward ID', 'Ward Name', 'Floor', 'Ward Type', 'Bed Capacity', 'Status'],
    stats: [{ label: 'Total Wards', val: '36', col: 'text-blue-400' }, { label: 'General Wards', val: '24', col: 'text-indigo-400' }, { label: 'ICUs', val: '8', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 6 }).map((_, i) => {
      const names = ['General Medical A', 'Surgical Ward B', 'Cardiac ICU', 'Neonatal ICU', 'Pediatric Ward', 'Maternity Wing'];
      const floors = ['Second Floor', 'Fourth Floor', 'First Floor', 'Third Floor', 'Second Floor', 'Third Floor'];
      const types = ['General', 'Surgical', 'Intensive Care', 'Intensive Care', 'General', 'Specialty'];
      const capacities = ['40 Beds', '30 Beds', '15 Beds', '20 Incubators', '25 Beds', '30 Beds'];
      const statuses = ['Active', 'Active', 'Full Capacity', 'Active', 'Maintenance', 'Active'];
      return {
        wardid: \`WRD-400\${1 + i}\`,
        wardname: names[i],
        floor: floors[i],
        wardtype: types[i],
        bedcapacity: capacities[i],
        status: statuses[i]
      };
    })`
  },
  {
    path: 'rooms', title: 'Room Allocation', desc: 'Manage private, semi-private, and VIP patient rooms.',
    cols: ['Room No', 'Room Type', 'Ward/Floor', 'Amenities', 'Current Rate', 'Status'],
    stats: [{ label: 'Private Rooms', val: '120', col: 'text-blue-400' }, { label: 'Occupied', val: '95', col: 'text-amber-400' }, { label: 'Available', val: '25', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 6 }).map((_, i) => {
      const rooms = ['Room 101', 'Room 102', 'Suite 201', 'Room 305', 'Suite 401 (VIP)', 'Room 105'];
      const types = ['Semi-Private', 'Private', 'Deluxe Suite', 'Private', 'Presidential VIP', 'Semi-Private'];
      const wards = ['General Medical A', 'Surgical Ward B', 'Maternity Wing', 'Pediatric Ward', 'Main Tower (Top)', 'General Medical A'];
      const amenities = ['TV, AC', 'TV, AC, Fridge', 'Lounge, Kitchenette', 'TV, AC, Sofa', 'Full Apartment Setup', 'TV, AC'];
      const rates = ['$150/day', '$300/day', '$800/day', '$300/day', '$2,500/day', '$150/day'];
      const statuses = ['Occupied', 'Available', 'Occupied', 'Cleaning', 'Reserved', 'Occupied'];
      return {
        roomno: rooms[i],
        roomtype: types[i],
        wardfloor: wards[i],
        amenities: amenities[i],
        currentrate: rates[i],
        status: statuses[i]
      };
    })`
  },
  {
    path: 'beds', title: 'Bed Allocation', desc: 'Granular tracking of individual bed occupancy across wards.',
    cols: ['Bed ID', 'Ward/Room', 'Bed Type', 'Current Patient', 'Admit Date', 'Status'],
    stats: [{ label: 'Total Beds', val: '1,250', col: 'text-blue-400' }, { label: 'Occupied', val: '980', col: 'text-amber-400' }, { label: 'Available', val: '270', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 8 }).map((_, i) => {
      const beds = ['BED-101-A', 'BED-101-B', 'BED-201 (Suite)', 'ICU-BED-01', 'ICU-BED-02', 'BED-305', 'BED-105-A', 'BED-105-B'];
      const wards = ['General Med A', 'General Med A', 'Maternity Wing', 'Cardiac ICU', 'Cardiac ICU', 'Pediatric Ward', 'General Med A', 'General Med A'];
      const types = ['Standard', 'Standard', 'Motorized Deluxe', 'Critical Care', 'Critical Care', 'Pediatric Cot', 'Standard', 'Standard'];
      const patients = ['John Doe', 'Available', 'Emily Davis', 'Michael Johnson', 'Available', 'Cleaning', 'Robert Wilson', 'Jane Smith'];
      const dates = ['10 Aug, 2026', '-', '15 Aug, 2026', '16 Aug, 2026', '-', '-', '12 Aug, 2026', '14 Aug, 2026'];
      const statuses = ['Occupied', 'Available', 'Occupied', 'Occupied', 'Available', 'Cleaning', 'Occupied', 'Occupied'];
      return {
        bedid: beds[i],
        wardroom: wards[i],
        bedtype: types[i],
        currentpatient: patients[i],
        admitdate: dates[i],
        status: statuses[i]
      };
    })`
  }
];

const template = (page, componentName) => `"use client";

import React, { useState } from 'react';
import { Activity, Building2, Users, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
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
          row.${accessorKey} === 'Active' || row.${accessorKey} === 'Available' || row.${accessorKey} === 'Stable' || row.${accessorKey} === 'Approved' || row.${accessorKey} === 'Discharged' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
          row.${accessorKey} === 'Admitted' || row.${accessorKey} === 'Occupied' || row.${accessorKey} === 'Under Obs' || row.${accessorKey} === 'Pending' || row.${accessorKey} === 'Visa Pending' || row.${accessorKey} === 'Cleaning' || row.${accessorKey} === 'Maintenance' || row.${accessorKey} === 'Reserved' || row.${accessorKey} === 'Inspection Required' || row.${accessorKey} === 'Full Capacity' || row.${accessorKey} === 'Police Notified' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
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
            <Activity className="text-indigo-500" size={24} />
            ${page.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">${page.desc}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-dark-secondary border border-gray-700 rounded-lg text-sm font-medium hover:bg-dark-tertiary transition-colors text-white">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-500/20 transition-all">
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
              className="pl-9 pr-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-indigo-500 text-white w-64 transition-colors"
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

patientsPages.forEach(page => {
  const dir = path.join(basePaths.patients, page.path);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const componentName = page.title.replace(/[^a-zA-Z0-9]/g, '');
  fs.writeFileSync(path.join(dir, 'page.tsx'), template(page, componentName));
  console.log(`Updated detailed page for patients/${page.path}`);
});

hospitalPages.forEach(page => {
  const dir = path.join(basePaths.hospital, page.path);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const componentName = page.title.replace(/[^a-zA-Z0-9]/g, '');
  fs.writeFileSync(path.join(dir, 'page.tsx'), template(page, componentName));
  console.log(`Updated detailed page for hospital/${page.path}`);
});
