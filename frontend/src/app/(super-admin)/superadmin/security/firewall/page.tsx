"use client";

import { useState } from "react";
import { ShieldCheck, Search, Edit2, Trash2, Plus } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function FirewallRulesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data] = useState([
    {
      "c0": "ID-2409",
      "c1": "Sample Source 1",
      "c2": "Sample Destination 1",
      "c3": "Inactive"
    },
    {
      "c0": "ID-4672",
      "c1": "Sample Source 2",
      "c2": "Sample Destination 2",
      "c3": "Active"
    },
    {
      "c0": "ID-4948",
      "c1": "Sample Source 3",
      "c2": "Sample Destination 3",
      "c3": "Active"
    },
    {
      "c0": "ID-1848",
      "c1": "Sample Source 4",
      "c2": "Sample Destination 4",
      "c3": "Active"
    },
    {
      "c0": "ID-3414",
      "c1": "Sample Source 5",
      "c2": "Sample Destination 5",
      "c3": "Active"
    },
    {
      "c0": "ID-3653",
      "c1": "Sample Source 6",
      "c2": "Sample Destination 6",
      "c3": "Active"
    },
    {
      "c0": "ID-2683",
      "c1": "Sample Source 7",
      "c2": "Sample Destination 7",
      "c3": "Active"
    },
    {
      "c0": "ID-2288",
      "c1": "Sample Source 8",
      "c2": "Sample Destination 8",
      "c3": "Inactive"
    },
    {
      "c0": "ID-9421",
      "c1": "Sample Source 9",
      "c2": "Sample Destination 9",
      "c3": "Inactive"
    },
    {
      "c0": "ID-7189",
      "c1": "Sample Source 10",
      "c2": "Sample Destination 10",
      "c3": "Active"
    },
    {
      "c0": "ID-8320",
      "c1": "Sample Source 11",
      "c2": "Sample Destination 11",
      "c3": "Active"
    },
    {
      "c0": "ID-5287",
      "c1": "Sample Source 12",
      "c2": "Sample Destination 12",
      "c3": "Pending"
    }
  ]);

  const columns = [
    { header: "Rule ID", accessor: "c0", sortable: true },
    { header: "Source", accessor: "c1", sortable: true },
    { header: "Destination", accessor: "c2", sortable: true },
    { header: "Status", accessor: (row: any) => <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.c3 === "Active" ? "bg-emerald-500/10 text-emerald-400" : row.c3 === "Pending" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>{row.c3}</span>, sortable: true },
    { header: "Actions", accessor: () => <div className="flex items-center justify-end gap-2"><button className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button><button className="p-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div>, sortable: false }
  ];

  return (
    <div className="">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <ShieldCheck className="text-blue-500" />
            Firewall Rules
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Manage firewall rules configurations globally</p>
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
