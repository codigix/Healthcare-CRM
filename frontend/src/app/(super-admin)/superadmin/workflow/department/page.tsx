"use client";

import { useState } from "react";
import { GitPullRequest, Search, FileSymlink, Edit2, Trash2 } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function DepartmentWorkflowPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const mockRoutings = [
    { id: "RTE-001", source: "ER Admission", target: "Inpatient Ward", trigger: "Bed Assigned", status: "Active" },
    { id: "RTE-002", source: "Consultation Room", target: "Pharmacy", trigger: "Prescription Signed", status: "Active" },
    { id: "RTE-003", source: "Operating Theater", target: "ICU", trigger: "Surgery Complete", status: "Active" },
  ];
  const columns = [
    { header: "Routing ID", accessor: "id", sortable: true },
    { header: "Source Dept.", accessor: "source", sortable: true },
    { header: "Flow", accessor: "target", sortable: true },
    { header: "Target Dept.", accessor: "trigger", sortable: true },
    { header: "Trigger Event", accessor: (row: any) => <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : row.status === "Pending" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>{row.status}</span>, sortable: true },
    { header: "Status", accessor: "c5", sortable: true },
    { header: "Actions", accessor: () => <div className="flex items-center justify-end gap-2"><button className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button><button className="p-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div>, sortable: false },
  ];


  return (
    <div className="p-2 space-y-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <GitPullRequest className="text-blue-500" />
            Inter-Department Routing
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Configure automated patient and document handoffs between departments</p>
        </div>
      </div>

      <div className="">
        <div className="flex justify-between my-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search routing rules..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none text-xs" />
          </div>
        </div>
        <DataTable columns={columns} data={mockRoutings} searchTerm={searchTerm} />
      </div>
    </div>
  );
}
