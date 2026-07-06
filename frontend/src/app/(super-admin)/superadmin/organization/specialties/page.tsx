"use client";

import { useState } from "react";
import { Stethoscope, Plus, Search, Filter, Edit2, MoreVertical, Trash2 } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function SpecialtiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const mockSpecialties = [
    { id: "SPC-01", name: "Interventional Cardiology", dept: "Cardiology", isPrimary: true },
    { id: "SPC-02", name: "Pediatric Cardiology", dept: "Cardiology", isPrimary: false },
    { id: "SPC-03", name: "Neurosurgery", dept: "Neurology", isPrimary: true },
    { id: "SPC-04", name: "Orthopedic Surgery", dept: "Orthopedics", isPrimary: true },
  ];
  const columns = [
    { header: "Code", accessor: "id", sortable: true },
    { header: "Specialty Name", accessor: "name", sortable: true },
    { header: "Parent Department", accessor: "dept", sortable: true },
    { header: "Primary?", accessor: "isPrimary", sortable: true },
    { header: "Actions", accessor: () => <div className="flex items-center justify-end gap-2"><button className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button><button className="p-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div>, sortable: false },
  ];


  return (
    <div className="p-2 space-y-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <Stethoscope className="text-blue-500" />
            Medical Specialties
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Configure clinical specialties and sub-specialties</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Plus size={20} />
          <span>Add Specialty</span>
        </button>
      </div>

      <div className="">
        <div className="flex justify-between my-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search specialties..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none text-xs" />
          </div>
          <button className="p-2 bg-dark-tertiary text-gray-300 rounded flex items-center gap-2 border border-gray-700 text-xs">
            <Filter size={20} /> Filters
          </button>
        </div>
        <DataTable columns={columns} data={mockSpecialties} searchTerm={searchTerm} />
      </div>
    </div>
  );
}
