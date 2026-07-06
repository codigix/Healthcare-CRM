"use client";

import { useState } from "react";
import { Activity, Plus, Search, Filter, Edit2, Trash2 } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function ProcedureMasterPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const mockProcedures = [
    { id: "PROC-101", name: "Coronary Angioplasty", dept: "Cardiology", duration: "120 mins", riskLevel: "High", status: "Active" },
    { id: "PROC-102", name: "Appendectomy", dept: "General Surgery", duration: "90 mins", riskLevel: "Medium", status: "Active" },
    { id: "PROC-103", name: "Cataract Surgery", dept: "Ophthalmology", duration: "45 mins", riskLevel: "Low", status: "Active" },
    { id: "PROC-104", name: "Knee Replacement", dept: "Orthopedics", duration: "180 mins", riskLevel: "High", status: "Active" },
  ];
  const columns = [
    { header: "Proc ID", accessor: "id", sortable: true },
    { header: "Procedure Name", accessor: "name", sortable: true },
    { header: "Linked Dept", accessor: "dept", sortable: true },
    { header: "Avg Duration", accessor: "duration", sortable: true },
    { header: "Risk Level", accessor: "riskLevel", sortable: true },
    { header: "Actions", accessor: () => <div className="flex items-center justify-end gap-2"><button className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button><button className="p-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div>, sortable: false },
  ];


  return (
    <div className="p-2 space-y-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <Activity className="text-blue-500" />
            Global Procedure Master
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Standardize surgical and medical procedures across the network</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Plus size={20} />
          <span>Add Procedure</span>
        </button>
      </div>

      <div className="">
        <div className="flex justify-between my-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search procedures..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none text-xs" />
          </div>
        </div>
        <DataTable columns={columns} data={mockProcedures} searchTerm={searchTerm} />
      </div>
    </div>
  );
}
