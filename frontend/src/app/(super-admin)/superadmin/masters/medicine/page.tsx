"use client";

import { useState } from "react";
import { Pill, Plus, Search, Edit2, Trash2 } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function MedicineMasterPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const mockMedicines = [
    { id: "MED-001", name: "Paracetamol 500mg", type: "Tablet", generic: "Acetaminophen", brand: "Tylenol", status: "Active" },
    { id: "MED-002", name: "Amoxicillin 250mg", type: "Capsule", generic: "Amoxicillin", brand: "Amoxil", status: "Active" },
    { id: "MED-003", name: "Cough Syrup 100ml", type: "Syrup", generic: "Dextromethorphan", brand: "Robitussin", status: "Active" },
  ];
  const columns = [
    { header: "Item Code", accessor: "id", sortable: true },
    { header: "Medicine Name", accessor: "name", sortable: true },
    { header: "Type", accessor: "type", sortable: true },
    { header: "Generic Name", accessor: "generic", sortable: true },
    { header: "Brand", accessor: "brand", sortable: true },
    { header: "Actions", accessor: () => <div className="flex items-center justify-end gap-2"><button className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button><button className="p-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div>, sortable: false },
  ];


  return (
    <div className="p-2 space-y-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <Pill className="text-blue-500" />
            Medicine Master
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Manage pharmacy drugs, generic formulas, and brands</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Plus size={20} />
          <span>Add Medicine</span>
        </button>
      </div>

      <div className="">
        <div className="flex justify-between my-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search medicines..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none text-xs" />
          </div>
        </div>
        <DataTable columns={columns} data={mockMedicines} searchTerm={searchTerm} />
      </div>
    </div>
  );
}
