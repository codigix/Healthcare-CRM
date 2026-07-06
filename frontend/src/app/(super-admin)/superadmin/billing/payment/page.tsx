"use client";

import { useState } from "react";
import { CreditCard, Plus, Search, Edit2, Trash2 } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function PaymentModesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const mockModes = [
    { id: "PM-01", name: "Cash", type: "Offline", fee: "0%", status: "Active" },
    { id: "PM-02", name: "Credit/Debit Card", type: "Gateway", fee: "1.5%", status: "Active" },
    { id: "PM-03", name: "Bank Transfer (NEFT/RTGS)", type: "Offline", fee: "0%", status: "Active" },
    { id: "PM-04", name: "Stripe Gateway", type: "Gateway", fee: "2.9% + $0.30", status: "Active" },
  ];
  const columns = [
    { header: "Mode ID", accessor: "id", sortable: true },
    { header: "Payment Method", accessor: "name", sortable: true },
    { header: "Type", accessor: "type", sortable: true },
    { header: "Transaction Fee", accessor: "fee", sortable: true },
    { header: "Status", accessor: (row: any) => <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : row.status === "Pending" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>{row.status}</span>, sortable: true },
    { header: "Actions", accessor: () => <div className="flex items-center justify-end gap-2"><button className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button><button className="p-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div>, sortable: false },
  ];


  return (
    <div className="p-2 space-y-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <CreditCard className="text-blue-500" />
            Payment Modes & Gateways
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Configure accepted payment methods and payment gateway fees</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Plus size={20} />
          <span>Add Payment Mode</span>
        </button>
      </div>

      <div className="">
        <div className="flex justify-between my-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search payment modes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none text-xs" />
          </div>
        </div>
        <DataTable columns={columns} data={mockModes} searchTerm={searchTerm} />
      </div>
    </div>
  );
}
