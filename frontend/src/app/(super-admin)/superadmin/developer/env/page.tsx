"use client";

import { useState } from "react";
import { Code, Search, Edit2, Trash2, Plus } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function EnvironmentVariablesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data] = useState([
    {
      "c0": "ID-8283",
      "c1": "Sample Scope 1",
      "c2": "Sample Last Modified 1",
      "c3": "Active"
    },
    {
      "c0": "ID-1351",
      "c1": "Sample Scope 2",
      "c2": "Sample Last Modified 2",
      "c3": "Active"
    },
    {
      "c0": "ID-5439",
      "c1": "Sample Scope 3",
      "c2": "Sample Last Modified 3",
      "c3": "Inactive"
    },
    {
      "c0": "ID-9064",
      "c1": "Sample Scope 4",
      "c2": "Sample Last Modified 4",
      "c3": "Active"
    },
    {
      "c0": "ID-7965",
      "c1": "Sample Scope 5",
      "c2": "Sample Last Modified 5",
      "c3": "Active"
    },
    {
      "c0": "ID-1135",
      "c1": "Sample Scope 6",
      "c2": "Sample Last Modified 6",
      "c3": "Active"
    },
    {
      "c0": "ID-2196",
      "c1": "Sample Scope 7",
      "c2": "Sample Last Modified 7",
      "c3": "Active"
    },
    {
      "c0": "ID-4548",
      "c1": "Sample Scope 8",
      "c2": "Sample Last Modified 8",
      "c3": "Active"
    },
    {
      "c0": "ID-8818",
      "c1": "Sample Scope 9",
      "c2": "Sample Last Modified 9",
      "c3": "Inactive"
    },
    {
      "c0": "ID-3992",
      "c1": "Sample Scope 10",
      "c2": "Sample Last Modified 10",
      "c3": "Active"
    },
    {
      "c0": "ID-9374",
      "c1": "Sample Scope 11",
      "c2": "Sample Last Modified 11",
      "c3": "Active"
    },
    {
      "c0": "ID-5320",
      "c1": "Sample Scope 12",
      "c2": "Sample Last Modified 12",
      "c3": "Active"
    }
  ]);

  const columns = [
    { header: "Key Name", accessor: "c0", sortable: true },
    { header: "Scope", accessor: "c1", sortable: true },
    { header: "Last Modified", accessor: "c2", sortable: true },
    { header: "Status", accessor: (row: any) => <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.c3 === "Active" ? "bg-emerald-500/10 text-emerald-400" : row.c3 === "Pending" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>{row.c3}</span>, sortable: true },
    { header: "Actions", accessor: () => <div className="flex items-center justify-end gap-2"><button className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button><button className="p-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div>, sortable: false }
  ];

  return (
    <div className="">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <Code className="text-blue-500" />
            Environment Variables
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Manage environment variables configurations globally</p>
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
