"use client";

import { useState } from "react";
import { Building2, Plus, Search, Filter, Edit2, MoreVertical, Trash2 } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function DepartmentMasterPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockDepts = [
    { id: "DEPT-001", name: "Cardiology", type: "Clinical", code: "CARD", status: "Active" },
    { id: "DEPT-002", name: "Neurology", type: "Clinical", code: "NEURO", status: "Active" },
    { id: "DEPT-003", name: "Radiology", type: "Diagnostic", code: "RAD", status: "Active" },
    { id: "DEPT-004", name: "Human Resources", type: "Administrative", code: "HR", status: "Active" },
  ];
  const columns = [
    { header: "Dept ID", accessor: "id", sortable: true },
    { header: "Short Code", accessor: "name", sortable: true },
    { header: "Department Name", accessor: "type", sortable: true },
    { header: "Category", accessor: "code", sortable: true },
    { header: "Global Status", accessor: (row: any) => <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : row.status === "Pending" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>{row.status}</span>, sortable: true },
    { header: "Actions", accessor: () => <div className="flex items-center justify-end gap-2"><button className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button><button className="p-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div>, sortable: false },
  ];


  return (
    <div className="p-2 space-y-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <Building2 className="text-blue-500" />
            Global Department Master
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Define global departments available across all hospital branches</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Plus size={20} />
          <span>Add Department</span>
        </button>
      </div>

      <div className="">
        <div className="flex justify-between my-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search departments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none text-xs" />
          </div>
          <button className="p-2 bg-dark-tertiary text-gray-300 rounded flex items-center gap-2 border border-gray-700 text-xs">
            <Filter size={20} /> Filters
          </button>
        </div>
        <DataTable columns={columns} data={mockDepts} searchTerm={searchTerm} />
      </div>
    </div>
  );
}
