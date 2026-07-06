"use client";

import { useState } from "react";
import { CalendarRange, Plus, Search, Edit2, Trash2 } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function LeaveMasterPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const mockLeaves = [
    { id: "LV-01", name: "Annual Leave", days: 21, carryForward: "Yes (Max 10)", encashable: "No", status: "Active" },
    { id: "LV-02", name: "Sick Leave", days: 14, carryForward: "No", encashable: "No", status: "Active" },
    { id: "LV-03", name: "Maternity Leave", days: 180, carryForward: "No", encashable: "No", status: "Active" },
  ];
  const columns = [
    { header: "Leave Code", accessor: "id", sortable: true },
    { header: "Leave Name", accessor: "name", sortable: true },
    { header: "Yearly Quota (Days)", accessor: "days", sortable: true },
    { header: "Carry Forward?", accessor: "carryForward", sortable: true },
    { header: "Encashable?", accessor: "encashable", sortable: true },
    { header: "Status", accessor: (row: any) => <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : row.status === "Pending" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>{row.status}</span>, sortable: true },
    { header: "Actions", accessor: () => <div className="flex items-center justify-end gap-2"><button className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button><button className="p-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div>, sortable: false },
  ];


  return (
    <div className="p-2 space-y-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <CalendarRange className="text-blue-500" />
            Leave Type Master
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Configure employee leave quotas, encashment, and carry-forward rules</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Plus size={20} />
          <span>Add Leave Type</span>
        </button>
      </div>

      <div className="">
        <div className="flex justify-between my-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search leave types..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none text-xs" />
          </div>
        </div>
        <DataTable columns={columns} data={mockLeaves} searchTerm={searchTerm} />
      </div>
    </div>
  );
}
