"use client";

import { useState } from "react";
import { Stethoscope, Plus, Search, Filter, Edit2, Trash2 } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function ServiceMasterPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const mockServices = [
    { id: "SRV-001", name: "Cardiology Consultation", category: "Consultation", basePrice: "$150", status: "Active" },
    { id: "SRV-002", name: "Neurology Follow-up", category: "Consultation", basePrice: "$100", status: "Active" },
    { id: "SRV-003", name: "Emergency Room Visit", category: "Emergency", basePrice: "$500", status: "Active" },
    { id: "SRV-004", name: "Physiotherapy Session", category: "Therapy", basePrice: "$80", status: "Active" },
  ];
  const columns = [
    { header: "Service ID", accessor: "id", sortable: true },
    { header: "Service Name", accessor: "name", sortable: true },
    { header: "Category", accessor: "category", sortable: true },
    { header: "Global Base Price", accessor: "basePrice", sortable: true },
    { header: "Status", accessor: (row: any) => <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : row.status === "Pending" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>{row.status}</span>, sortable: true },
    { header: "Actions", accessor: () => <div className="flex items-center justify-end gap-2"><button className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button><button className="p-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div>, sortable: false },
  ];


  return (
    <div className="p-2 space-y-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <Stethoscope className="text-blue-500" />
            Global Service Master
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Define billable hospital services and standard pricing</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Plus size={20} />
          <span>Add Service</span>
        </button>
      </div>

      <div className="">
        <div className="flex justify-between my-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search services..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none text-xs" />
          </div>
        </div>
        <DataTable columns={columns} data={mockServices} searchTerm={searchTerm} />
      </div>
    </div>
  );
}
