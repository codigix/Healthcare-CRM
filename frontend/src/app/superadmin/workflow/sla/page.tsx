"use client";

import { useState } from "react";
import { Timer, Search, Edit2, Trash2 } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function SLAPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const mockSLA = [
    { id: "SLA-01", category: "Emergency Admission", metric: "Time to triage", target: "< 10 Mins", penalty: "Critical Incident", status: "Active" },
    { id: "SLA-02", category: "Lab Results (STAT)", metric: "Time to report", target: "< 60 Mins", penalty: "Escalation", status: "Active" },
    { id: "SLA-03", category: "Patient Discharge", metric: "Billing to exit", target: "< 120 Mins", penalty: "Warning", status: "Active" },
  ];
  const columns = [
    { header: "SLA ID", accessor: "id", sortable: true },
    { header: "Process Category", accessor: "category", sortable: true },
    { header: "Measured Metric", accessor: "metric", sortable: true },
    { header: "Target Time", accessor: "target", sortable: true },
    { header: "Breach Penalty", accessor: "penalty", sortable: true },
    { header: "Actions", accessor: () => <div className="flex items-center justify-end gap-2"><button className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button><button className="p-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div>, sortable: false },
  ];


  return (
    <div className="p-2 space-y-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <Timer className="text-blue-500" />
            Service Level Agreements (SLA)
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Define operational time thresholds and performance metrics</p>
        </div>
      </div>

      <div className="">
        <div className="flex justify-between my-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search SLAs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none text-xs" />
          </div>
        </div>
        <DataTable columns={columns} data={mockSLA} searchTerm={searchTerm} />
      </div>
    </div>
  );
}
