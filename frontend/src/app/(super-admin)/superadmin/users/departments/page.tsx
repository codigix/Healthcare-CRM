"use client";

import { useState } from "react";
import { Building, Plus, Search, Edit2, Users } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function UserDepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const mockDeptAlloc = [
    { id: "DPT-01", deptName: "Cardiology", head: "Dr. A. Sharma", totalUsers: 45, status: "Active" },
    { id: "DPT-02", deptName: "IT & Systems", head: "R. Patel", totalUsers: 12, status: "Active" },
    { id: "DPT-03", deptName: "Administration", head: "M. Johnson", totalUsers: 28, status: "Active" },
  ];
  const columns = [
    { header: "Dept ID", accessor: "id", sortable: true },
    { header: "Department Name", accessor: "deptName", sortable: true },
    { header: "Department Head", accessor: "head", sortable: true },
    { header: "Allocated Users", accessor: "totalUsers", sortable: true },
    { header: "Status", accessor: (row: any) => <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : row.status === "Pending" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>{row.status}</span>, sortable: true },
    { header: "Manage Allocation", accessor: "c5", sortable: true },
  ];


  return (
    <div className="p-2 space-y-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <Building className="text-blue-500" />
            User Department Allocation
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Manage user distribution across organizational departments</p>
        </div>
      </div>

      <div className="">
        <div className="flex justify-between my-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search departments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none text-xs" />
          </div>
        </div>
        <DataTable columns={columns} data={mockDeptAlloc} searchTerm={searchTerm} />
      </div>
    </div>
  );
}
