"use client";

import { useState } from "react";
import { ArrowDownToLine, Search, Edit2, AlertCircle, Trash2 } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function ReorderRulesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const mockReorder = [
    { id: "ITEM-001", name: "Paracetamol 500mg (Strip)", store: "Pharmacy Main", minLevel: "500", maxLevel: "2000", reorderQty: "1000", status: "Active" },
    { id: "ITEM-002", name: "Surgical Masks (Box 100)", store: "Central Store", minLevel: "50", maxLevel: "500", reorderQty: "300", status: "Active" },
    { id: "ITEM-003", name: "IV Fluid (NS 500ml)", store: "ER Storage", minLevel: "100", maxLevel: "1000", reorderQty: "500", status: "Active" },
  ];
  const columns = [
    { header: "Item Code", accessor: "id", sortable: true },
    { header: "Item Name", accessor: "name", sortable: true },
    { header: "Target Store", accessor: "store", sortable: true },
    { header: "Min Level (Alert)", accessor: "minLevel", sortable: true },
    { header: "Max Level", accessor: "maxLevel", sortable: true },
    { header: "Default Reorder Qty", accessor: "reorderQty", sortable: true },
    { header: "Actions", accessor: () => <div className="flex items-center justify-end gap-2"><button className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button><button className="p-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div>, sortable: false },
  ];


  return (
    <div className="p-2 space-y-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <ArrowDownToLine className="text-blue-500" />
            Reorder Level Rules
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Configure minimum/maximum thresholds and auto-indent generation</p>
        </div>
      </div>

      <div className="">
        <div className="flex justify-between my-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none text-xs" />
          </div>
        </div>
        <DataTable columns={columns} data={mockReorder} searchTerm={searchTerm} />
      </div>
    </div>
  );
}
