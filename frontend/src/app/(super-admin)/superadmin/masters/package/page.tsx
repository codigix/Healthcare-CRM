"use client";

import { useState } from "react";
import { Layers, Plus, Search, Edit2, Trash2 } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function PackageMasterPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const mockPackages = [
    { id: "PKG-100", name: "Comprehensive Health Checkup", type: "Health Package", dept: "Preventive Health", price: "$499", status: "Active" },
    { id: "PKG-101", name: "Normal Delivery Package", type: "Maternity", dept: "Obstetrics", price: "$2,500", status: "Active" },
    { id: "PKG-102", name: "CABG Surgery Package", type: "Surgical", dept: "Cardiac Surgery", price: "$15,000", status: "Active" },
  ];
  const columns = [
    { header: "Package Code", accessor: "id", sortable: true },
    { header: "Package Name", accessor: "name", sortable: true },
    { header: "Category", accessor: "type", sortable: true },
    { header: "Linked Dept", accessor: "dept", sortable: true },
    { header: "Bundle Price", accessor: "price", sortable: true },
    { header: "Actions", accessor: () => <div className="flex items-center justify-end gap-2"><button className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button><button className="p-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div>, sortable: false },
  ];


  return (
    <div className="p-2 space-y-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <Layers className="text-blue-500" />
            Treatment Packages
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Configure bundled services and procedural packages</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Plus size={20} />
          <span>Add Package</span>
        </button>
      </div>

      <div className="">
        <div className="flex justify-between my-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search packages..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none text-xs" />
          </div>
        </div>
        <DataTable columns={columns} data={mockPackages} searchTerm={searchTerm} />
      </div>
    </div>
  );
}
