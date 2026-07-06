"use client";

import { useState } from "react";
import {
  Building2,
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  MapPin,
  Users,
  Activity,
  Globe,
  Briefcase,
  ExternalLink,
  Building,
} from "lucide-react";
import Link from "next/link";

const mockGroups = [
  {
    id: "GRP-001",
    name: "MedixPro Healthcare Group",
    ceo: "Dr. Jonathan Smith",
    hq: "New York, USA",
    founded: "1998",
    facilitiesCount: 12,
    totalStaff: "4,500+",
    status: "Active",
    website: "www.medixpro-group.com",
    revenue: "$1.2B"
  },
  {
    id: "GRP-002",
    name: "Global Health Alliance",
    ceo: "Sarah Chen",
    hq: "London, UK",
    founded: "2005",
    facilitiesCount: 8,
    totalStaff: "2,800+",
    status: "Active",
    website: "www.globalhealth-alliance.co.uk",
    revenue: "$850M"
  },
  {
    id: "GRP-003",
    name: "Apex Regional Care",
    ceo: "Marcus Johnson",
    hq: "Toronto, Canada",
    founded: "2010",
    facilitiesCount: 4,
    totalStaff: "1,200+",
    status: "Merger Pending",
    website: "www.apex-regional.ca",
    revenue: "$320M"
  },
];

export default function GroupHospitalsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGroups = mockGroups.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.hq.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-xl  text-white flex items-center gap-2">
            <Globe className="text-blue-500" />
            Hospital Groups
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Manage parent healthcare groups, alliances, and holding entities</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20 whitespace-nowrap">
          <Plus size={20} />
          <span>Register New Group</span>
        </button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-dark-secondary rounded-xl p-2 border border-gray-800 flex items-center gap-4">
          <div className="p-4 rounded bg-blue-500/10 text-blue-400">
            <Globe size={28} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Total Groups</p>
            <h3 className="text-2xl  text-white mt-1">3</h3>
          </div>
        </div>
        <div className="bg-dark-secondary rounded-xl p-2 border border-gray-800 flex items-center gap-4">
          <div className="p-4 rounded bg-emerald-500/10 text-emerald-400">
            <Building size={28} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Facilities Under Groups</p>
            <h3 className="text-2xl  text-white mt-1">24</h3>
          </div>
        </div>
        <div className="bg-dark-secondary rounded-xl p-2 border border-gray-800 flex items-center gap-4">
          <div className="p-4 rounded bg-purple-500/10 text-purple-400">
            <Users size={28} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Network Staff</p>
            <h3 className="text-2xl  text-white mt-1">8.5k+</h3>
          </div>
        </div>
        <div className="bg-dark-secondary rounded-xl p-2 border border-gray-800 flex items-center gap-4">
          <div className="p-4 rounded bg-amber-500/10 text-amber-400">
            <Activity size={28} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Combined Revenue</p>
            <h3 className="text-2xl  text-white mt-1">$2.3B</h3>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className=" p-4 flex flex-col md:flex-row gap-4 justify-between items-center my-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search healthcare groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors text-xs"
          />
        </div>
      </div>

      {/* Group Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <div key={group.id} className=" flex flex-col hover:border-gray-600 transition-colors">

            {/* Card Header */}
            <div className="p-6 border-b border-gray-800 relative">
              <div className="absolute top-6 right-6">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${group.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
                  group.status === 'Merger Pending' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                  {group.status}
                </span>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-dark-tertiary border border-gray-700 flex items-center justify-center mb-4 text-blue-500">
                <Globe size={32} />
              </div>

              <h2 className="text-xl  text-white">{group.name}</h2>
              <div className="text-gray-500 text-xs font-mono mt-1">Group ID: {group.id}</div>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-4 flex-grow">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-400 text-xs font-medium mb-1 flex items-center gap-1">
                    <Briefcase size={12} /> CEO / Director
                  </div>
                  <div className="text-gray-200 text-sm font-medium">{group.ceo}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs font-medium mb-1 flex items-center gap-1">
                    <MapPin size={12} /> Headquarters
                  </div>
                  <div className="text-gray-200 text-sm">{group.hq}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-4 border-y border-gray-800/50">
                <div className="text-center">
                  <div className="text-gray-400 text-xs mb-1">Facilities</div>
                  <div className="text-white  text-lg">{group.facilitiesCount}</div>
                </div>
                <div className="text-center border-x border-gray-800/50">
                  <div className="text-gray-400 text-xs mb-1">Staff</div>
                  <div className="text-white  text-lg">{group.totalStaff}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-xs mb-1">Founded</div>
                  <div className="text-white  text-lg">{group.founded}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <a href={`https://${group.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  <ExternalLink size={14} /> {group.website}
                </a>
              </div>
            </div>

            {/* Card Footer */}
            <div className="bg-dark-tertiary/30 p-4 border-t border-gray-800 flex items-center justify-between">
              <Link
                href={`/superadmin/hospital/group/${group.id}`}
                className="text-xs font-medium text-gray-300 hover:text-white transition-colors"
              >
                View Details
              </Link>
              <div className="flex items-center gap-2">
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
            </div>

          </div>
        ))}

        {filteredGroups.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 ">
            No healthcare groups found matching your search.
          </div>
        )}
      </div>

    </div>
  );
}
