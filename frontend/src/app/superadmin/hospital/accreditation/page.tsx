"use client";

import { useState } from "react";
import {
  Award,
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  FileText,
  CalendarDays,
  ShieldCheck,
  Building,
  CheckCircle,
  ExternalLink,
  Star,
} from "lucide-react";
import Link from "next/link";

const mockAccreditations = [
  {
    id: "ACC-001",
    facility: "MedixPro Central Hospital",
    body: "NABH",
    standard: "Full Accreditation",
    certificateNo: "NABH-H-2022-0182",
    validFrom: "Oct 15, 2022",
    validTill: "Oct 14, 2025",
    nextAudit: "Sep 01, 2024",
    status: "Active",
    score: "98%",
  },
  {
    id: "ACC-002",
    facility: "MedixPro Global Health",
    body: "JCI",
    standard: "Gold Seal of Approval",
    certificateNo: "JCI-778921",
    validFrom: "Jan 10, 2021",
    validTill: "Jan 09, 2024",
    nextAudit: "Dec 05, 2023",
    status: "Under Renewal",
    score: "A+",
  },
  {
    id: "ACC-003",
    facility: "MedixPro Central Labs",
    body: "NABL",
    standard: "ISO 15189:2012",
    certificateNo: "NABL-M-8891",
    validFrom: "Mar 22, 2023",
    validTill: "Mar 21, 2025",
    nextAudit: "Feb 10, 2024",
    status: "Active",
    score: "95%",
  },
  {
    id: "ACC-004",
    facility: "MedixPro Downtown Clinic",
    body: "ISO",
    standard: "ISO 9001:2015 (QMS)",
    certificateNo: "ISO-QMS-4451",
    validFrom: "Jun 01, 2020",
    validTill: "May 31, 2023",
    nextAudit: "Expired",
    status: "Expired",
    score: "B",
  },
];

export default function AccreditationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBody, setFilterBody] = useState("");

  const filteredAccreditations = mockAccreditations.filter((a) => {
    const matchesSearch = a.facility.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.certificateNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBody = filterBody ? a.body === filterBody : true;
    return matchesSearch && matchesBody;
  });

  return (
    <div className="space-y-2">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-xl  text-white flex items-center gap-2">
            <Award className="text-blue-500" />
            Quality Accreditations
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Manage hospital quality certifications, audit schedules, and compliance scores</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20 whitespace-nowrap">
          <Plus size={20} />
          <span>Add Accreditation</span>
        </button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-dark-secondary rounded-xl p-2 border border-gray-800 flex items-center gap-4">
          <div className="p-4 rounded bg-blue-500/10 text-blue-400">
            <ShieldCheck size={28} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Total Certifications</p>
            <h3 className="text-2xl  text-white mt-1">12</h3>
          </div>
        </div>
        <div className="bg-dark-secondary rounded-xl p-2 border border-gray-800 flex items-center gap-4">
          <div className="p-4 rounded bg-emerald-500/10 text-emerald-400">
            <CheckCircle size={28} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Active Standards</p>
            <h3 className="text-2xl  text-white mt-1">10</h3>
          </div>
        </div>
        <div className="bg-dark-secondary rounded-xl p-2 border border-gray-800 flex items-center gap-4">
          <div className="p-4 rounded bg-purple-500/10 text-purple-400">
            <Star size={28} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Top Tier (JCI/NABH)</p>
            <h3 className="text-2xl  text-white mt-1">6</h3>
          </div>
        </div>
        <div className="bg-dark-secondary rounded-xl p-2 border border-amber-500/30 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-amber-500"></div>
          <div className="p-4 rounded bg-amber-500/10 text-amber-400">
            <CalendarDays size={28} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Upcoming Audits</p>
            <h3 className="text-2xl  text-amber-400 mt-1">2</h3>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className=" p-4 flex flex-col md:flex-row gap-4 justify-between items-center my-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search facility or certificate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors text-xs"
            />
          </div>
          <select
            value={filterBody}
            onChange={(e) => setFilterBody(e.target.value)}
            className="bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs"
          >
            <option value="">All Accreditation Bodies</option>
            <option value="NABH">NABH</option>
            <option value="JCI">JCI</option>
            <option value="NABL">NABL</option>
            <option value="ISO">ISO</option>
          </select>
        </div>
      </div>

      {/* Accreditation Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAccreditations.map((acc) => (
          <div key={acc.id} className=" flex flex-col hover:border-gray-600 transition-colors">

            {/* Card Header */}
            <div className="p-6 border-b border-gray-800 relative bg-dark-tertiary/20">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center  text-xl shadow-lg ${acc.body === 'NABH' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    acc.body === 'JCI' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      acc.body === 'NABL' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    }`}>
                    {acc.body}
                  </div>
                  <div>
                    <h2 className="text-xl  text-white">{acc.standard}</h2>
                    <div className="text-gray-400 text-sm mt-1">{acc.certificateNo}</div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${acc.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  acc.status === 'Under Renewal' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse' :
                    'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                  {acc.status}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-300 font-medium bg-dark-tertiary/50 w-fit px-3 py-1.5 rounded border border-gray-700/50">
                <Building size={16} className="text-gray-400" />
                {acc.facility}
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 flex-grow">
              <div className="space-y-1">
                <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Valid From</div>
                <div className="text-gray-200 text-sm">{acc.validFrom}</div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Valid Till</div>
                <div className="text-gray-200 text-sm font-medium">{acc.validTill}</div>
              </div>
              <div className="space-y-1 border-l border-gray-800 pl-4">
                <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Next Audit</div>
                <div className={`text-sm font-medium ${acc.nextAudit === 'Expired' ? 'text-red-400' : 'text-amber-400'}`}>
                  {acc.nextAudit}
                </div>
              </div>
              <div className="space-y-1 border-l border-gray-800 pl-4">
                <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Grade/Score</div>
                <div className="text-emerald-400 text-lg ">
                  {acc.score}
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="bg-dark-tertiary/30 p-4 border-t border-gray-800 flex items-center justify-between">
              <button className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                <FileText size={16} />
                View Certificate
              </button>
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

        {filteredAccreditations.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 ">
            No accreditations found matching your search.
          </div>
        )}
      </div>

    </div>
  );
}
