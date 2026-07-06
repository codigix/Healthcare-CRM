"use client";

import { useState } from "react";
import { LineChart, Calendar, Save } from "lucide-react";
import DataTable from "@/components/UI/DataTable";

export default function FinancialYearPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [years] = useState([
    { id: 1, name: "FY 2026-2027", start: "01 Apr 2026", end: "31 Mar 2027", status: "Active" },
    { id: 2, name: "FY 2025-2026", start: "01 Apr 2025", end: "31 Mar 2026", status: "Closed" },
    { id: 3, name: "FY 2024-2025", start: "01 Apr 2024", end: "31 Mar 2025", status: "Closed" },
  ]);

  const columns = [
    { header: "Year Name", accessor: "name", sortable: true },
    { header: "Start Date", accessor: "start", sortable: true },
    { header: "End Date", accessor: "end", sortable: true },
    {
      header: "Status",
      accessor: (y: any) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${y.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>
          {y.status}
        </span>
      ),
      sortable: true
    }
  ];

  return (
    <div className=" space-y-2 mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <LineChart className="text-blue-500" />
            Financial Year Settings
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Manage global financial year periods for accounting and billing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Active Year Settings */}
        <div className="lg:col-span-1  p-2 space-y-2">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
            <Calendar className="text-blue-500" size={20} />
            <h2 className="text-lg  text-white">Current Period</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded">
              <p className="text-sm text-gray-400">Active Financial Year</p>
              <p className="text-xl  text-emerald-400 mt-1">FY 2026-2027</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Set New Active Year</label>
              <select className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none">
                <option>FY 2026-2027</option>
                <option>FY 2025-2026</option>
              </select>
            </div>

            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center justify-center gap-2">
              <Save size={15} />
              <span>Update Setting</span>
            </button>
          </div>
        </div>

        {/* History */}
        <div className="lg:col-span-2 ">
          <div className="">
            <h2 className="text-lg  text-white">Financial Year History</h2>
          </div>
          <div className="overflow-x-auto">
            <DataTable columns={columns} data={years} searchTerm={searchTerm} enablePagination={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
