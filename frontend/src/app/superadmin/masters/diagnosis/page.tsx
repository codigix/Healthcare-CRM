"use client";

import { useState } from "react";
import { FileHeart, Plus, Search, Filter, Edit2, Trash2 } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function DiagnosisMasterPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const mockDiagnoses = [
    { id: "ICD-I10", name: "Essential (primary) hypertension", system: "ICD-10", category: "Circulatory", status: "Active" },
    { id: "ICD-E11.9", name: "Type 2 diabetes mellitus without complications", system: "ICD-10", category: "Endocrine", status: "Active" },
    { id: "ICD-J01.90", name: "Acute sinusitis, unspecified", system: "ICD-10", category: "Respiratory", status: "Active" },
  ];
  const columns = [
    { header: "Code", accessor: "id", sortable: true },
    { header: "Coding System", accessor: "name", sortable: true },
    { header: "Diagnosis Description", accessor: "system", sortable: true },
    { header: "Category", accessor: "category", sortable: true },
    { header: "Actions", accessor: () => <div className="flex items-center justify-end gap-2"><button className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button><button className="p-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div>, sortable: false },
  ];


  return (
    <div className="p-2 space-y-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <FileHeart className="text-blue-500" />
            Diagnosis Master (ICD)
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Manage global International Classification of Diseases codes</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Plus size={20} />
          <span>Add Code</span>
        </button>
      </div>

      <div className="">
        <div className="flex justify-between my-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search ICD codes or descriptions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none text-xs" />
          </div>
        </div>
        <DataTable columns={columns} data={mockDiagnoses} searchTerm={searchTerm} />
      </div>
    </div>
  );
}
