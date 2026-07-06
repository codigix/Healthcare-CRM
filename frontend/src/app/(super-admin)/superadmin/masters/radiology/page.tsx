"use client";

import { useState } from "react";
import { ScanSearch, Plus, Search, Edit2, Trash2 } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function RadiologyMasterPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const mockRadiology = [
    { id: "RAD-001", name: "X-Ray Chest PA View", category: "X-Ray", modality: "CR/DR", price: "$50", status: "Active" },
    { id: "RAD-002", name: "MRI Brain without Contrast", category: "MRI", modality: "MRI 1.5T", price: "$450", status: "Active" },
    { id: "RAD-003", name: "CT Scan Abdomen", category: "CT Scan", modality: "CT 64 Slice", price: "$300", status: "Active" },
  ];
  const columns = [
    { header: "Code", accessor: "id", sortable: true },
    { header: "Investigation Name", accessor: "name", sortable: true },
    { header: "Category", accessor: "category", sortable: true },
    { header: "Modality", accessor: "modality", sortable: true },
    { header: "Base Price", accessor: "price", sortable: true },
    { header: "Actions", accessor: () => <div className="flex items-center justify-end gap-2"><button className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button><button className="p-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div>, sortable: false },
  ];


  return (
    <div className="p-2 space-y-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <ScanSearch className="text-blue-500" />
            Radiology Test Master
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Configure imaging tests, modalities, and pricing</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Plus size={20} />
          <span>Add Radiology Test</span>
        </button>
      </div>

      <div className="">
        <div className="flex justify-between my-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search radiology tests..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none text-xs" />
          </div>
        </div>
        <DataTable columns={columns} data={mockRadiology} searchTerm={searchTerm} />
      </div>
    </div>
  );
}
