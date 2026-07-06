"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function ResourceForecastPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Critical Resource', accessor: 'criticalresource', sortable: true },
    { header: 'Current Availability', accessor: 'currentavailability', sortable: true },
    { header: 'Predicted Exhaustion', accessor: 'predictedexhaustion', sortable: true },
    { header: 'Alternative Options', accessor: 'alternativeoptions', sortable: true },
    { header: 'Confidence', accessor: 'confidence', sortable: true },
    { 
      header: 'Status', 
      accessor: (row: any) => {
        const val = row.status;
        const isGood = val === 'On Target' || val === 'Positive' || val === 'Positive Trend' || val === 'Stable' || val === 'Optimal' || val === 'Normal' || val === 'Growing' || val === 'Efficient' || val === 'Strong' || val === 'Excellent' || val === 'Within Limits' || val === 'Compliant' || val === 'Better than Expected' || val === 'Reconciled' || val === 'Profitable' || val === 'Paid' || val === 'Healthy' || val === 'Active' || val === 'Resolved' || val === 'Reviewed' || val === 'Clean' || val === 'Operational' || val === 'Expanding' || val === 'Leader' || val === 'Ready' || val === 'Finalized' || val === 'Closed' || val === 'Published' || val === 'Audited' || val === 'Syncing' || val === 'Analyzed';
        const isWarning = val === 'Needs Attention' || val === 'Needs Improvement' || val === 'At Risk' || val === 'High Utilization' || val === 'Requires Review' || val === 'Review Required' || val === 'Review Suggested' || val === 'Near Capacity' || val === 'High Variance' || val === 'Payment Delayed' || val === 'Action Required' || val === 'Monitor Detractors' || val === 'High Overtime' || val === 'Over Budget' || val === 'Improvement Needed' || val === 'Overdue Follow-up' || val === 'Sourcing' || val === 'Monitored' || val === 'Monitor' || val === 'High Volume' || val === 'Expiring Soon' || val === 'Service Due' || val === 'Approval Pending' || val === 'Planning Phase' || val === 'Surge Alert' || val === 'Epidemic Alert' || val === 'Draft' || val === 'New Insight';
        const isNeutral = val === 'Acknowledged' || val === 'Manageable' || val === 'Review' || val === 'Approve' || val === 'Download' || val === 'View Deck' || val === 'View Details' || val === 'View Report' || val === 'View Annual Report' || val === 'Run Now' || val === 'Open Dashboard' || val === 'Edit' || val === 'Update';
        const isDanger = val === 'Action Needed' || val === 'Negative Trend' || val === 'Critical' || val === 'Critical Monitored' || val === 'Critical Risk' || val === 'High Impact' || val === 'Inefficient' || val === 'Loss Making' || val === 'High Disallowance' || val === 'High Risk' || val === 'Underutilized' || val === 'Understaffed' || val === 'Hard to Fill' || val === 'Underperforming' || val === 'Order Immediately';
        
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
      return { criticalresource: ['MICU Beds', 'Ventilators', 'O-Negative Blood', 'Modular OT-1', 'Dialysis Machines'][i], currentavailability: i===0?'2 Beds':'Adequate', predictedexhaustion: i===0?'48 Hours':'> 7 Days', alternativeoptions: i===0?'Step-down Unit':'Supplier Call', confidence: '88%', status: i===0?'Critical Risk':'Stable' };
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="text-blue-500" size={24} />
            Resource Forecast
          </h1>
          <p className="text-sm text-gray-400 mt-1">Predicting shortages in beds, OTs, or ventilators before they happen.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-dark-secondary border border-gray-700 rounded-lg text-sm font-medium hover:bg-dark-tertiary transition-colors text-white">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">ICU Bed Risk</p>
          <p className={"text-2xl font-bold mt-2 " + "text-red-400"}>High (Next 48h)</p>
        </div>
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">Ventilator Buffer</p>
          <p className={"text-2xl font-bold mt-2 " + "text-amber-400"}>3 Units</p>
        </div>
        <div className="bg-dark-secondary rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">OT Slots Open</p>
          <p className={"text-2xl font-bold mt-2 " + "text-emerald-400"}>12</p>
        </div>
      </div>

      <div className="bg-dark-secondary rounded-xl border border-gray-800 overflow-hidden">
        <div className="flex justify-between items-center my-3">
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
}