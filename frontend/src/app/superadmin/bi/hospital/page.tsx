"use client";

import { useState } from "react";
import { BarChart3, Search, Edit2, Trash2, Plus } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function HospitalComparisonPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data] = useState([
    {
      "c0": "ID-6392",
      "c1": "Sample Hospital A 1",
      "c2": "Sample Hospital B 1",
      "c3": "Pending"
    },
    {
      "c0": "ID-5317",
      "c1": "Sample Hospital A 2",
      "c2": "Sample Hospital B 2",
      "c3": "Active"
    },
    {
      "c0": "ID-7218",
      "c1": "Sample Hospital A 3",
      "c2": "Sample Hospital B 3",
      "c3": "Pending"
    },
    {
      "c0": "ID-8304",
      "c1": "Sample Hospital A 4",
      "c2": "Sample Hospital B 4",
      "c3": "Pending"
    },
    {
      "c0": "ID-2672",
      "c1": "Sample Hospital A 5",
      "c2": "Sample Hospital B 5",
      "c3": "Pending"
    },
    {
      "c0": "ID-2444",
      "c1": "Sample Hospital A 6",
      "c2": "Sample Hospital B 6",
      "c3": "Pending"
    },
    {
      "c0": "ID-8978",
      "c1": "Sample Hospital A 7",
      "c2": "Sample Hospital B 7",
      "c3": "Active"
    },
    {
      "c0": "ID-1288",
      "c1": "Sample Hospital A 8",
      "c2": "Sample Hospital B 8",
      "c3": "Active"
    },
    {
      "c0": "ID-2603",
      "c1": "Sample Hospital A 9",
      "c2": "Sample Hospital B 9",
      "c3": "Active"
    },
    {
      "c0": "ID-8250",
      "c1": "Sample Hospital A 10",
      "c2": "Sample Hospital B 10",
      "c3": "Active"
    },
    {
      "c0": "ID-4504",
      "c1": "Sample Hospital A 11",
      "c2": "Sample Hospital B 11",
      "c3": "Inactive"
    },
    {
      "c0": "ID-6259",
      "c1": "Sample Hospital A 12",
      "c2": "Sample Hospital B 12",
      "c3": "Inactive"
    }
  ]);

  const columns = [
    { header: "Metric", accessor: "c0", sortable: true },
    { header: "Hospital A", accessor: "c1", sortable: true },
    { header: "Hospital B", accessor: "c2", sortable: true },
    { header: "Status", accessor: (row: any) => <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.c3 === "Active" ? "bg-emerald-500/10 text-emerald-400" : row.c3 === "Pending" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>{row.c3}</span>, sortable: true },
    { header: "Actions", accessor: () => <div className="flex items-center justify-end gap-2"><button className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button><button className="p-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div>, sortable: false }
  ];

  return (
    <div className="">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <BarChart3 className="text-blue-500" />
            Hospital Comparison
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Manage hospital comparison configurations globally</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Plus size={20} />
          <span>Add New</span>
        </button>
      </div>

      <div className="">
        <div className="flex justify-between my-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none text-xs" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <DataTable columns={columns} data={data} searchTerm={searchTerm} />
        </div>
      </div>
    </div>
  );
}
