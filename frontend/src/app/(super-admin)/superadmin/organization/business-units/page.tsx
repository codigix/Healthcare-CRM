"use client";

import { useState } from "react";
import { Briefcase, Plus, Search, Edit2, MoreVertical, LayoutGrid, Trash2 } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function BusinessUnitsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const mockBUs = [
    { id: "BU-01", name: "Clinical Operations", head: "Dr. E. Williams", facilities: 12, revenue: "$145M" },
    { id: "BU-02", name: "Diagnostics & Imaging", head: "Dr. M. Chang", facilities: 8, revenue: "$65M" },
    { id: "BU-03", name: "Retail Pharmacy", head: "S. Peterson", facilities: 24, revenue: "$85M" },
    { id: "BU-04", name: "Corporate Health Services", head: "J. Davies", facilities: 4, revenue: "$30M" },
  ];
  const columns = [
    { header: "BU Code", accessor: "id", sortable: true },
    { header: "Business Unit Name", accessor: "name", sortable: true },
    { header: "BU Head", accessor: "head", sortable: true },
    { header: "Linked Facilities", accessor: "facilities", sortable: true },
    { header: "Target Revenue", accessor: "revenue", sortable: true },
    { header: "Actions", accessor: () => <div className="flex items-center justify-end gap-2"><button className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button><button className="p-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div>, sortable: false },
  ];


  return (
    <div className="p-2 space-y-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <LayoutGrid className="text-blue-500" />
            Business Units
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Manage strategic business units and revenue divisions</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Plus size={20} />
          <span>Add Business Unit</span>
        </button>
      </div>

      <div className="">
        <div className="flex justify-between my-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search business units..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none text-xs" />
          </div>
        </div>
        <DataTable columns={columns} data={mockBUs} searchTerm={searchTerm} />
      </div>
    </div>
  );
}
