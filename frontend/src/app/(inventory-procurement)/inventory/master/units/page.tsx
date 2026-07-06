"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function UnitsofMeasurePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Unit Code', accessor: 'unitcode', sortable: true },
    { header: 'Unit Name', accessor: 'unitname', sortable: true },
    { header: 'Base Unit', accessor: 'baseunit', sortable: true },
    { header: 'Conversion Rate', accessor: 'conversionrate', sortable: true },
    { header: 'Used For', accessor: 'usedfor', sortable: true },
    {
      header: 'Status',
      accessor: (row: any) => {
        const val = row.status;
        const isGood = val === 'Active' || val === 'Approved' || val === 'Mapped' || val === 'In Stock' || val === 'Available' || val === 'Finalized' || val === 'Optimal' || val === 'Stock Updated' || val === 'Verified' || val === 'Issued' || val === 'Stock Credited' || val === 'Completed' || val === 'Resolved';
        const isWarning = val === 'Pending Approval' || val === 'Pending Review' || val === 'Pending' || val === 'Processing' || val === 'Pending PR' || val === 'PR Raised' || val === 'PO Generated' || val === 'Low Stock' || val === 'Expiring Soon' || val === 'Monitoring' || val === 'Pending Write-off' || val === 'Active Investigation' || val === 'Quarantined' || val === 'Draft' || val === 'Pending QA' || val === 'Pending Verification' || val === 'Ready to Pick' || val === 'Picking' || val === 'Ready for Dispatch' || val === 'Pending Signature' || val === 'Awaiting Auth' || val === 'Under Review';
        const isNeutral = val === 'Written Off' || val === 'Consumed' || val === 'Destroyed' || val === 'Returned to Vendor' || val === 'Closed';
        const isDanger = val === 'At Capacity' || val === 'Out of Stock' || val === 'Critical Low' || val === 'Overstocked' || val === 'Expired' || val === 'Rejected' || val === 'Rejected (Damage)';

        let colorClass = 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
        if (isGood) colorClass = 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
        else if (isWarning) colorClass = 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
        else if (isNeutral) colorClass = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
        else if (isDanger) colorClass = 'bg-red-500/10 text-red-500 border border-red-500/20';

        return (
          <span className={"px-2 py-1 rounded text-xs font-medium " + colorClass}>
            {val}
          </span>
        )
      },
      sortable: true
    },
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

  const mockData = Array.from({ length: 5 }).map((_, i) => {
    const units = ['Box (100)', 'Pack (50)', 'Dozen', 'Kilogram', 'Liter'];
    const bases = ['Piece', 'Piece', 'Piece', 'Gram', 'Milliliter'];
    const rates = ['1 Box = 100 Pcs', '1 Pack = 50 Pcs', '1 Doz = 12 Pcs', '1 Kg = 1000 g', '1 L = 1000 ml'];
    return { unitcode: 'UOM-' + (4001 + i), unitname: units[i], baseunit: bases[i], conversionrate: rates[i], usedfor: 'Purchasing', status: 'Active' };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            Units of Measure
          </h1>
          <p className="text-sm text-gray-400 mt-1">Base units and conversion mapping (e.g., Box to Pieces).</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Total Units</p>
          <p className={"text-2xl font-bold mt-2 " + "text-blue-400"}>35</p>
        </div>
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Conversion Rules</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>85</p>
        </div>
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Pending Sync</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>0</p>
        </div>
      </div>

      <div className="">
        <div className="flex justify-between items-center my-3
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
      </div >
    </div >
  );
}