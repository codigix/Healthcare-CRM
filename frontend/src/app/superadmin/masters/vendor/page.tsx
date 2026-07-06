"use client";

import { useState } from "react";
import { Truck, Plus, Search, Edit2, Trash2 } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function VendorMasterPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const mockVendors = [
    { id: "VND-001", name: "PharmaCorp Supplies", category: "Pharmacy", rating: "4.8", contact: "supplies@pharmacorp.com", status: "Active" },
    { id: "VND-002", name: "MediEquip Tech", category: "Biomedical Equipment", rating: "4.5", contact: "sales@mediequip.com", status: "Active" },
    { id: "VND-003", name: "CleanCare Services", category: "Housekeeping", rating: "3.9", contact: "admin@cleancare.com", status: "Blacklisted" },
  ];
  const columns = [
    { header: "Vendor ID", accessor: "id", sortable: true },
    { header: "Vendor Name", accessor: "name", sortable: true },
    { header: "Category", accessor: "category", sortable: true },
    { header: "Contact Email", accessor: "rating", sortable: true },
    { header: "Rating", accessor: "contact", sortable: true },
    { header: "Status", accessor: (row: any) => <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : row.status === "Pending" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>{row.status}</span>, sortable: true },
    { header: "Actions", accessor: () => <div className="flex items-center justify-end gap-2"><button className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button><button className="p-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div>, sortable: false },
  ];


  return (
    <div className="p-2 space-y-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <Truck className="text-blue-500" />
            Vendor Master
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Manage suppliers, contractors, and service providers</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Plus size={20} />
          <span>Add Vendor</span>
        </button>
      </div>

      <div className="">
        <div className="flex justify-between my-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search vendors..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none text-xs" />
          </div>
        </div>
        <DataTable columns={columns} data={mockVendors} searchTerm={searchTerm} />
      </div>
    </div>
  );
}
