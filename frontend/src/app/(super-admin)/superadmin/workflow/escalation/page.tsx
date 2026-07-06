"use client";

import { useState } from "react";
import { Flame, Plus, Search, Edit2, Trash2 } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function EscalationMatrixPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const mockEscalations = [
    { id: "ESC-01", trigger: "Unassigned Emergency Bed", duration: "15 Mins", level1: "Duty Manager", level2: "Hospital Admin", status: "Active" },
    { id: "ESC-02", trigger: "Critical Lab Value Unread", duration: "30 Mins", level1: "Head of Dept", level2: "Chief Medical Officer", status: "Active" },
    { id: "ESC-03", trigger: "IT System Downtime", duration: "10 Mins", level1: "IT Manager", level2: "COO", status: "Active" },
  ];
  const columns = [
    { header: "Matrix ID", accessor: "id", sortable: true },
    { header: "Trigger Event", accessor: "trigger", sortable: true },
    { header: "Timeout Duration", accessor: "duration", sortable: true },
    { header: "Level 1 Escalation", accessor: "level1", sortable: true },
    { header: "Level 2 Escalation", accessor: "level2", sortable: true },
    { header: "Actions", accessor: () => <div className="flex items-center justify-end gap-2"><button className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button><button className="p-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div>, sortable: false },
  ];


  return (
    <div className="p-2 space-y-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <Flame className="text-red-500" />
            Escalation Matrix
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Configure automated timeout escalations and alert paths</p>
        </div>
        <button className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/20 rounded transition-colors flex items-center gap-2">
          <Plus size={20} />
          <span>Add Matrix Path</span>
        </button>
      </div>

      <div className="">
        <div className="flex justify-between my-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search escalations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none text-xs" />
          </div>
        </div>
        <DataTable columns={columns} data={mockEscalations} searchTerm={searchTerm} />
      </div>
    </div>
  );
}
