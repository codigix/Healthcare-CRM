"use client";

import { useState } from "react";
import { HandCoins, Plus, Search, Edit2, Trash2 } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function SalaryComponentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const mockComponents = [
    { id: "SAL-01", name: "Basic Pay", type: "Earning", calculation: "Fixed Flat", taxable: "Yes", status: "Active" },
    { id: "SAL-02", name: "House Rent Allowance (HRA)", type: "Earning", calculation: "% of Basic (40%)", taxable: "Partial", status: "Active" },
    { id: "SAL-03", name: "Provident Fund (PF)", type: "Deduction", calculation: "% of Basic (12%)", taxable: "No", status: "Active" },
    { id: "SAL-04", name: "Professional Tax", type: "Deduction", calculation: "Fixed Slab", taxable: "No", status: "Active" },
  ];
  const columns = [
    { header: "Component Code", accessor: "id", sortable: true },
    { header: "Component Name", accessor: "name", sortable: true },
    { header: "Type", accessor: "type", sortable: true },
    { header: "Calculation Method", accessor: "calculation", sortable: true },
    { header: "Taxable?", accessor: "taxable", sortable: true },
    { header: "Status", accessor: (row: any) => <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : row.status === "Pending" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>{row.status}</span>, sortable: true },
    { header: "Actions", accessor: () => <div className="flex items-center justify-end gap-2"><button className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button><button className="p-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div>, sortable: false },
  ];


  return (
    <div className="p-2 space-y-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <HandCoins className="text-blue-500" />
            Salary Components Master
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Configure earnings, deductions, taxes, and allowances</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Plus size={20} />
          <span>Add Component</span>
        </button>
      </div>

      <div className="">
        <div className="flex justify-between my-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search components..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none text-xs" />
          </div>
        </div>
        <DataTable columns={columns} data={mockComponents} searchTerm={searchTerm} />
      </div>
    </div>
  );
}
