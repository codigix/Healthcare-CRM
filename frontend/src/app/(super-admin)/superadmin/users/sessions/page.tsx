"use client";

import { useState } from "react";
import { Activity, Search, ShieldAlert, MonitorX, Edit2, Trash2 } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function SessionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const mockSessions = [
    { id: "SESS-991", user: "sarah.j@medixpro.com", ip: "192.168.1.105", device: "Chrome / Windows 11", activeTime: "4h 12m", lastSeen: "Just now", risk: "Low" },
    { id: "SESS-992", user: "robert.c@medixpro.com", ip: "10.0.0.42", device: "Safari / macOS", activeTime: "1h 05m", lastSeen: "2 mins ago", risk: "Low" },
    { id: "SESS-993", user: "emily.w@medixpro.com", ip: "172.16.0.5", device: "Firefox / Windows 10", activeTime: "8h 45m", lastSeen: "15 mins ago", risk: "Medium" },
  ];
  const columns = [
    { header: "Session ID", accessor: "id", sortable: true },
    { header: "User", accessor: "user", sortable: true },
    { header: "IP Address", accessor: "ip", sortable: true },
    { header: "Client / Device", accessor: "device", sortable: true },
    { header: "Active Duration", accessor: "activeTime", sortable: true },
    { header: "Risk Profile", accessor: "lastSeen", sortable: true },
    { header: "Actions", accessor: () => <div className="flex items-center justify-end gap-2"><button className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button><button className="p-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div>, sortable: false },
  ];


  return (
    <div className="p-2 space-y-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <Activity className="text-blue-500" />
            Active User Sessions
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Monitor currently connected users and forcefully terminate rogue sessions</p>
        </div>
        <button className="p-2 bg-red-600/10 text-red-500 hover:bg-red-600/20 border border-red-500/20 rounded transition-colors flex items-center gap-2">
          <MonitorX size={20} />
          <span>Terminate All Sessions</span>
        </button>
      </div>

      <div className="">
        <div className="flex justify-between my-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search active sessions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none text-xs" />
          </div>
        </div>
        <DataTable columns={columns} data={mockSessions} searchTerm={searchTerm} />
      </div>
    </div>
  );
}
