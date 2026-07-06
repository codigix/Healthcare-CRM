"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Building,
} from "lucide-react";
import Link from "next/link";
import DataTable from "@/components/UI/DataTable";

const mockLicenses = [
  {
    id: "LIC-001",
    facility: "MedixPro Central Hospital",
    type: "Clinical Establishment Registration",
    number: "CER-2021-08991",
    authority: "State Health Dept",
    issueDate: "2021-05-10",
    expiryDate: "2026-05-10",
    status: "Active",
  },
  {
    id: "LIC-002",
    facility: "MedixPro Central Hospital",
    type: "NABH Accreditation",
    number: "NABH-HO-2022-110",
    authority: "Quality Council of India",
    issueDate: "2022-08-15",
    expiryDate: "2025-08-14",
    status: "Active",
  },
  {
    id: "LIC-003",
    facility: "MedixPro East Wing",
    type: "Fire Safety NOC",
    number: "FSNOC-2023-445",
    authority: "Fire Department",
    issueDate: "2023-01-20",
    expiryDate: "2024-01-19",
    status: "Expired",
  },
  {
    id: "LIC-004",
    facility: "MedixPro Downtown Clinic",
    type: "Bio-Medical Waste Authorization",
    number: "BMW-2022-990",
    authority: "Pollution Control Board",
    issueDate: "2022-11-01",
    expiryDate: "2026-07-25", // Expiring Soon Example
    status: "Expiring Soon",
  },
  {
    id: "LIC-005",
    facility: "MedixPro Global Health",
    type: "Pharmacy License (Retail)",
    number: "DL-20Z-88992",
    authority: "Drug Control Authority",
    issueDate: "2020-03-10",
    expiryDate: "2025-03-09",
    status: "Active",
  },
  {
    id: "LIC-006",
    facility: "MedixPro Central Hospital",
    type: "Blood Bank License",
    number: "BBL-2021-105",
    authority: "Central Drugs Standard Control",
    issueDate: "2021-09-01",
    expiryDate: "2026-08-31",
    status: "Active",
  },
];

export default function LicenseManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredLicenses = mockLicenses.filter((l) => {
    const matchesStatus = filterStatus ? l.status === filterStatus : true;
    return matchesStatus;
  });

  const columns = [
    {
      header: "Facility",
      accessor: (license: any) => (
        <div className="flex items-center gap-2 text-white font-medium">
          <Building size={16} className="text-gray-400" />
          {license.facility}
        </div>
      ),
      sortable: true
    },
    {
      header: "License Type & Number",
      accessor: (license: any) => (
        <>
          <div className="text-gray-200 font-medium">{license.type}</div>
          <div className="text-gray-500 font-mono text-sm mt-1">{license.number}</div>
        </>
      ),
      sortable: true
    },
    { header: "Issuing Authority", accessor: "authority", sortable: true },
    { header: "Issue Date", accessor: "issueDate", sortable: true },
    {
      header: "Expiry Date",
      accessor: (license: any) => (
        <div className={`text-sm font-medium ${license.status === 'Expired' ? 'text-red-400' :
          license.status === 'Expiring Soon' ? 'text-amber-400' :
            'text-gray-300'
          }`}>
          {license.expiryDate}
        </div>
      ),
      sortable: true
    },
    {
      header: "Status",
      accessor: (license: any) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-max ${license.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
          license.status === 'Expiring Soon' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse' :
            'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
          {license.status === 'Active' && <CheckCircle2 size={12} />}
          {license.status === 'Expiring Soon' && <Clock size={12} />}
          {license.status === 'Expired' && <AlertTriangle size={12} />}
          {license.status}
        </span>
      ),
      sortable: true
    },
    {
      header: "Actions",
      accessor: () => (
        <div className="flex items-center justify-end gap-2">
          <button title="Download Document" className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors">
            <Download size={16} />
          </button>
          <button title="Edit Record" className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
            <Edit2 size={16} />
          </button>
          <button title="More Options" className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      ),
      sortable: false
    }
  ];

  return (
    <div className="space-y-2">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-xl  text-white flex items-center gap-2">
            <ShieldCheck className="text-blue-500" />
            Hospital Licenses & Accreditations
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Track, manage, and renew regulatory compliance documents across all facilities</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20 whitespace-nowrap">
          <Plus size={20} />
          <span>Upload New License</span>
        </button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-dark-secondary rounded-xl p-2 border border-gray-800 flex items-center gap-4">
          <div className="p-4 rounded bg-blue-500/10 text-blue-400">
            <FileText size={28} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Total Tracked Licenses</p>
            <h3 className="text-2xl  text-white mt-1">48</h3>
          </div>
        </div>
        <div className="bg-dark-secondary rounded-xl p-2 border border-gray-800 flex items-center gap-4">
          <div className="p-4 rounded bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Active & Valid</p>
            <h3 className="text-2xl  text-white mt-1">42</h3>
          </div>
        </div>
        <div className="bg-dark-secondary rounded-xl p-2 border border-red-500/30 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>
          <div className="p-4 rounded bg-red-500/10 text-red-400 animate-pulse">
            <AlertTriangle size={28} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Expired</p>
            <h3 className="text-2xl  text-red-400 mt-1">2</h3>
          </div>
        </div>
        <div className="bg-dark-secondary rounded-xl p-2 border border-amber-500/30 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-amber-500"></div>
          <div className="p-4 rounded bg-amber-500/10 text-amber-400">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Expiring Soon (90 Days)</p>
            <h3 className="text-2xl  text-amber-400 mt-1">4</h3>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center my-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search facility, type, or license no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors text-xs"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
          <button className="p-2 bg-dark-tertiary hover:bg-gray-700 text-gray-300 rounded transition-colors flex items-center gap-2 border border-gray-700 whitespace-nowrap text-xs">
            <Filter size={20} />
            <span>More Filters</span>
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <DataTable columns={columns} data={filteredLicenses} searchTerm={searchTerm} />
        </div>
      </div>
    </div>
  );
}

