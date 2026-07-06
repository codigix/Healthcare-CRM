"use client";

import { useState } from "react";
import { BarChart3, Search, Edit2, Trash2, Plus } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function AIInsightsModelPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data] = useState([
    {
      "c0": "ID-5758",
      "c1": "Sample Accuracy 1",
      "c2": "Sample Last Trained 1",
      "c3": "Inactive"
    },
    {
      "c0": "ID-2782",
      "c1": "Sample Accuracy 2",
      "c2": "Sample Last Trained 2",
      "c3": "Active"
    },
    {
      "c0": "ID-9552",
      "c1": "Sample Accuracy 3",
      "c2": "Sample Last Trained 3",
      "c3": "Inactive"
    },
    {
      "c0": "ID-6822",
      "c1": "Sample Accuracy 4",
      "c2": "Sample Last Trained 4",
      "c3": "Active"
    },
    {
      "c0": "ID-3374",
      "c1": "Sample Accuracy 5",
      "c2": "Sample Last Trained 5",
      "c3": "Active"
    },
    {
      "c0": "ID-8274",
      "c1": "Sample Accuracy 6",
      "c2": "Sample Last Trained 6",
      "c3": "Active"
    },
    {
      "c0": "ID-7255",
      "c1": "Sample Accuracy 7",
      "c2": "Sample Last Trained 7",
      "c3": "Active"
    },
    {
      "c0": "ID-8674",
      "c1": "Sample Accuracy 8",
      "c2": "Sample Last Trained 8",
      "c3": "Active"
    },
    {
      "c0": "ID-9505",
      "c1": "Sample Accuracy 9",
      "c2": "Sample Last Trained 9",
      "c3": "Active"
    },
    {
      "c0": "ID-9870",
      "c1": "Sample Accuracy 10",
      "c2": "Sample Last Trained 10",
      "c3": "Inactive"
    },
    {
      "c0": "ID-8596",
      "c1": "Sample Accuracy 11",
      "c2": "Sample Last Trained 11",
      "c3": "Active"
    },
    {
      "c0": "ID-9616",
      "c1": "Sample Accuracy 12",
      "c2": "Sample Last Trained 12",
      "c3": "Inactive"
    }
  ]);

  const columns = [
    { header: "Model Name", accessor: "c0", sortable: true },
    { header: "Accuracy", accessor: "c1", sortable: true },
    { header: "Last Trained", accessor: "c2", sortable: true },
    { header: "Status", accessor: (row: any) => <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.c3 === "Active" ? "bg-emerald-500/10 text-emerald-400" : row.c3 === "Pending" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>{row.c3}</span>, sortable: true },
    { header: "Actions", accessor: () => <div className="flex items-center justify-end gap-2"><button className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button><button className="p-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div>, sortable: false }
  ];

  return (
    <div className="">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <BarChart3 className="text-blue-500" />
            AI Insights Model
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Manage ai insights model configurations globally</p>
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
