"use client";

import { useState } from "react";
import { BadgeCheck, Plus, Search, Filter, Edit2, MoreVertical, Trash2 } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function DesignationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const mockDesignations = [
    { id: "DSG-01", title: "Chief Medical Officer", level: "L1 - Executive", dept: "Management", headCount: 1 },
    { id: "DSG-02", title: "Senior Consultant", level: "L3 - Senior Clinical", dept: "Clinical", headCount: 45 },
    { id: "DSG-03", title: "Staff Nurse", level: "L5 - Operational", dept: "Nursing", headCount: 320 },
    { id: "DSG-04", title: "IT Administrator", level: "L4 - Specialist", dept: "IT & Systems", headCount: 12 },
  ];
  const columns = [
    { header: "Code", accessor: "id", sortable: true },
    { header: "Job Title", accessor: "title", sortable: true },
    { header: "Hierarchy Level", accessor: "level", sortable: true },
    { header: "Default Dept", accessor: "dept", sortable: true },
    { header: "Current Headcount", accessor: "headCount", sortable: true },
    { header: "Actions", accessor: () => <div className="flex items-center justify-end gap-2"><button className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button><button className="p-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div>, sortable: false },
  ];


  return (
    <div className="p-2 space-y-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <BadgeCheck className="text-blue-500" />
            Designations
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Manage job titles, reporting levels, and roles</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Plus size={20} />
          <span>Add Designation</span>
        </button>
      </div>

      <div className="">
        <div className="flex justify-between my-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search designations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none text-xs" />
          </div>
        </div>
        <DataTable columns={columns} data={mockDesignations} searchTerm={searchTerm} />
      </div>
    </div>
  );
}
