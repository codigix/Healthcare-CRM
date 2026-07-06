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
  ShieldCheck,
  Building,
} from "lucide-react";
import DataTable from "@/components/UI/DataTable";

const mockHospitals = [
  {
    id: "HSP-001",
    name: "MedixPro Central Hospital",
    type: "Main Branch",
    location: "New York, USA",
    license: "LIC-2023-8991",
    capacity: 500,
    status: "Active",
  },
  {
    id: "HSP-002",
    name: "MedixPro East Wing",
    type: "Sub Branch",
    location: "Boston, USA",
    license: "LIC-2023-8992",
    capacity: 250,
    status: "Active",
  },
  {
    id: "HSP-003",
    name: "MedixPro Global Health",
    type: "Multi-Specialty",
    location: "London, UK",
    license: "LIC-2023-8993",
    capacity: 800,
    status: "Maintenance",
  },
  {
    id: "HSP-004",
    name: "MedixPro Care Clinic",
    type: "Clinic",
    location: "Toronto, CA",
    license: "LIC-2023-8994",
    capacity: 50,
    status: "Inactive",
  },
];

export default function HospitalMasterPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHospitals = mockHospitals.filter(h =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: "Hospital ID", accessor: "id", sortable: true },
    { header: "Facility Name", accessor: "name", sortable: true },
    { header: "Type", accessor: "type", sortable: true },
    {
      header: "Location",
      accessor: (hospital: any) => (
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <MapPin size={14} />
          {hospital.location}
        </div>
      ),
      sortable: true
    },
    { header: "License No.", accessor: "license", sortable: true },
    { header: "Bed Capacity", accessor: "capacity", sortable: true },
    {
      header: "Status",
      accessor: (hospital: any) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${hospital.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
          hospital.status === 'Maintenance' ? 'bg-amber-500/10 text-amber-400' :
            'bg-red-500/10 text-red-400'
          }`}>
          {hospital.status}
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
            <Building2 className="text-blue-500" />
            Hospital Master
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Manage all registered hospitals, clinics, and branches across the network</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20 whitespace-nowrap">
          <Plus size={20} />
          <span>Register New Hospital</span>
        </button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-secondary rounded-xl p-2 border border-gray-800 flex items-center gap-4">
          <div className="p-4 rounded bg-blue-500/10 text-blue-400">
            <Building size={28} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Total Facilities</p>
            <h3 className="text-2xl  text-white mt-1">24</h3>
          </div>
        </div>
        <div className="bg-dark-secondary rounded-xl p-2 border border-gray-800 flex items-center gap-4">
          <div className="p-4 rounded bg-emerald-500/10 text-emerald-400">
            <ShieldCheck size={28} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Active Licenses</p>
            <h3 className="text-2xl  text-white mt-1">22</h3>
          </div>
        </div>
        <div className="bg-dark-secondary rounded-xl p-2 border border-gray-800 flex items-center gap-4">
          <div className="p-4 rounded bg-purple-500/10 text-purple-400">
            <MapPin size={28} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Global Regions</p>
            <h3 className="text-2xl  text-white mt-1">8</h3>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="">
        {/* Toolbar */}
        <div className=" flex flex-col sm:flex-row gap-4 justify-between items-center mb-3">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search hospitals by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors text-xs"
            />
          </div>
          <button className="p-2 bg-dark-tertiary hover:bg-gray-700 text-gray-300 rounded transition-colors flex items-center gap-2 border border-gray-700 whitespace-nowrap text-xs">
            <Filter size={20} />
            <span>Advanced Filters</span>
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <DataTable columns={columns} data={filteredHospitals} searchTerm={searchTerm} />
        </div>
      </div>
    </div>
  );
}

