"use client";

import { useState } from "react";
import { LogIn, Search, Ban, CheckCircle2 } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function LoginsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const mockLogins = [
    { id: 1, user: "sarah.j@medixpro.com", ip: "192.168.1.105", location: "New York, US", time: "2 mins ago", status: "Success", device: "Chrome / Windows" },
    { id: 2, user: "robert.c@medixpro.com", ip: "10.0.0.42", location: "Internal Network", time: "15 mins ago", status: "Success", device: "Safari / macOS" },
    { id: 3, user: "unknown", ip: "185.15.22.4", location: "Moscow, RU", time: "1 hour ago", status: "Failed (Bad Password)", device: "Firefox / Linux" },
    { id: 4, user: "emily.w@medixpro.com", ip: "192.168.1.22", location: "New York, US", time: "3 hours ago", status: "Success", device: "MedixPro Mobile / iOS" },
  ];
  const columns = [
    { header: "Timestamp", accessor: "id", sortable: true },
    { header: "User / Email", accessor: "user", sortable: true },
    { header: "IP Address", accessor: "ip", sortable: true },
    { header: "Location", accessor: "location", sortable: true },
    { header: "Device", accessor: "time", sortable: true },
    { header: "Auth Status", accessor: (row: any) => <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : row.status === "Pending" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>{row.status}</span>, sortable: true },
  ];


  return (
    <div className="p-2 space-y-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <LogIn className="text-blue-500" />
            Login Audit Logs
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Track user authentications, IP addresses, and identify suspicious activity</p>
        </div>
      </div>

      <div className="">
        <div className="flex justify-between my-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search by email or IP..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none text-xs" />
          </div>
        </div>
        <DataTable columns={columns} data={mockLogins} searchTerm={searchTerm} />
      </div>
    </div>
  );
}
