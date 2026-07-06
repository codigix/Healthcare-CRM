"use client";

import { useState } from "react";
import {
  Building2,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  MapPin,
  Network,
  Users,
  Activity,
  PhoneCall,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import DataTable from "@/components/UI/DataTable";

const mockBranches = [
  {
    id: "BR-001",
    name: "MedixPro East Wing",
    parent: "MedixPro Central Hospital",
    branchHead: "Dr. Sarah Jenkins",
    location: "Boston, USA",
    contact: "+1 (555) 234-5678",
    departments: 12,
    staffCount: 145,
    status: "Active",
    networkStatus: "Connected",
  },
  {
    id: "BR-002",
    name: "MedixPro Downtown Clinic",
    parent: "MedixPro Central Hospital",
    branchHead: "Dr. Robert Chen",
    location: "New York, USA",
    contact: "+1 (555) 345-6789",
    departments: 5,
    staffCount: 32,
    status: "Active",
    networkStatus: "Connected",
  },
  {
    id: "BR-003",
    name: "MedixPro Care Clinic",
    parent: "MedixPro Global Health",
    branchHead: "Dr. Emily Wong",
    location: "Toronto, CA",
    contact: "+1 (416) 555-0192",
    departments: 4,
    staffCount: 28,
    status: "Inactive",
    networkStatus: "Disconnected",
  },
  {
    id: "BR-004",
    name: "MedixPro West Diagnostics",
    parent: "MedixPro Central Hospital",
    branchHead: "Dr. Alan Turing",
    location: "San Francisco, USA",
    contact: "+1 (555) 456-7890",
    departments: 2,
    staffCount: 45,
    status: "Maintenance",
    networkStatus: "Syncing",
  },
];

export default function BranchManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterParent, setFilterParent] = useState("");

  const filteredBranches = mockBranches.filter((b) => {
    const matchesParent = filterParent ? b.parent === filterParent : true;
    return matchesParent;
  });

  const columns = [
    {
      header: "Branch Info",
      accessor: (branch: any) => (
        <div>
          <div className="text-white font-medium flex items-center gap-2">
            {branch.name}
            <Link href={`/superadmin/hospital/branch/${branch.id}`} className="text-gray-500 hover:text-blue-400">
              <ExternalLink size={14} />
            </Link>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
            <MapPin size={12} />
            {branch.location}
          </div>
          <div className="text-gray-500 text-xs font-mono mt-1">ID: {branch.id}</div>
        </div>
      ),
      sortable: true
    },
    { header: "Parent Facility", accessor: "parent", sortable: true },
    {
      header: "Branch Head & Contact",
      accessor: (branch: any) => (
        <>
          <div className="text-gray-200 text-sm font-medium flex items-center gap-2">
            <Users size={14} className="text-gray-400" />
            {branch.branchHead}
          </div>
          <div className="text-gray-400 text-sm flex items-center gap-2 mt-1">
            <PhoneCall size={12} />
            {branch.contact}
          </div>
        </>
      ),
      sortable: true
    },
    {
      header: "Depts / Staff",
      accessor: (branch: any) => (
        <div className="flex flex-col items-center gap-1 text-sm">
          <span className="text-gray-200">{branch.departments} Depts</span>
          <span className="text-gray-500 text-xs">{branch.staffCount} Staff</span>
        </div>
      ),
      sortable: true
    },
    {
      header: "Network Sync",
      accessor: (branch: any) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${branch.networkStatus === 'Connected' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
            branch.networkStatus === 'Syncing' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse' :
              'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
            }`} />
          <span className={`text-sm ${branch.networkStatus === 'Connected' ? 'text-emerald-400' :
            branch.networkStatus === 'Syncing' ? 'text-amber-400' :
              'text-red-400'
            }`}>
            {branch.networkStatus}
          </span>
        </div>
      ),
      sortable: true
    },
    {
      header: "Status",
      accessor: (branch: any) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${branch.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
          branch.status === 'Maintenance' ? 'bg-amber-500/10 text-amber-400' :
            'bg-red-500/10 text-red-400'
          }`}>
          {branch.status}
        </span>
      ),
      sortable: true
    },
    {
      header: "Actions",
      accessor: () => (
        <div className="flex items-center justify-end gap-2">
          <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors">
            <Edit2 size={16} />
          </button>
          <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors">
            <Trash2 size={16} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
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
            <Network className="text-blue-500" />
            Branch Management
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Configure and monitor subsidiary branches across the hospital network</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20 whitespace-nowrap">
          <Plus size={20} />
          <span>Add New Branch</span>
        </button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-dark-secondary rounded-xl p-2 border border-gray-800 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded bg-blue-500/10 text-blue-400">
              <Building2 size={24} />
            </div>
            <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">+2 this quarter</span>
          </div>
          <div>
            <h3 className="text-2xl  text-white mt-2">18</h3>
            <p className="text-gray-400 text-sm font-medium">Total Branches</p>
          </div>
        </div>

        <div className="bg-dark-secondary rounded-xl p-2 border border-gray-800 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded bg-emerald-500/10 text-emerald-400">
              <Activity size={24} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl  text-white mt-2">16</h3>
            <p className="text-gray-400 text-sm font-medium">Active & Operational</p>
          </div>
        </div>

        <div className="bg-dark-secondary rounded-xl p-2 border border-gray-800 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded bg-purple-500/10 text-purple-400">
              <Users size={24} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl  text-white mt-2">1,245</h3>
            <p className="text-gray-400 text-sm font-medium">Total Branch Staff</p>
          </div>
        </div>

        <div className="bg-dark-secondary rounded-xl p-2 border border-gray-800 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded bg-amber-500/10 text-amber-400">
              <Network size={24} />
            </div>
            <span className="text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full">1 Syncing</span>
          </div>
          <div>
            <h3 className="text-2xl  text-white mt-2">100%</h3>
            <p className="text-gray-400 text-sm font-medium">Network Uptime</p>
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
                placeholder="Search branches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors text-xs"
              />
            </div>
            <select
              value={filterParent}
              onChange={(e) => setFilterParent(e.target.value)}
              className="bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs"
            >
              <option value="">All Parent Hospitals</option>
              <option value="MedixPro Central Hospital">MedixPro Central Hospital</option>
              <option value="MedixPro Global Health">MedixPro Global Health</option>
            </select>
          </div>
          <button className="p-2 bg-dark-tertiary hover:bg-gray-700 text-gray-300 rounded transition-colors flex items-center gap-2 border border-gray-700 whitespace-nowrap text-xs">
            <Filter size={20} />
            <span>More Filters</span>
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <DataTable columns={columns} data={filteredBranches} searchTerm={searchTerm} />
        </div>
      </div>
    </div>
  );
}

