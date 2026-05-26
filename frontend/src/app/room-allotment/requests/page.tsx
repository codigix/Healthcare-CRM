"use client";

import { useState, useEffect } from "react";
import { recordsAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { Hotel, Search, FileText, CheckCircle2, AlertCircle, Clock, Check, Plus, ExternalLink, Bed } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AdmissionRecord {
  id: string;
  type: string;
  patientName: string;
  date: string;
  details: string;
  status: string;
  createdAt: string;
  patientId?: string;
  doctorId?: string;
}

export default function AdmissionRequestsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [records, setRecords] = useState<AdmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchAdmissionRequests = async () => {
    try {
      setLoading(true);
      // Query records of type 'Admission Request'
      const res = await recordsAPI.list(page, 10, "Admission Request", searchQuery);
      setRecords(res.data.records || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Failed to fetch admission requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissionRequests();
  }, [page, statusFilter, searchQuery]);

  const handleAllocateRoom = (record: AdmissionRecord) => {
    // Extract clinical notes for pre-filling
    const notesStr = record.details 
      ? record.details.replace("Admission Recommended.\nJustification/Instructions: ", "")
      : "";
    
    // Redirect receptionist to allotment creation page with pre-filled clinical metadata
    router.push(
      `/room-allotment/new?patientId=${record.patientId || ""}&patientName=${encodeURIComponent(record.patientName)}&notes=${encodeURIComponent(notesStr)}&recordId=${record.id}`
    );
  };

  const getStatusStyle = (status: string) => {
    if (status?.toLowerCase() === "completed") {
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    }
    return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
  };

  const filteredRecords = records.filter(r => {
    if (statusFilter === "all") return true;
    return r.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Clinical Admission Requests</h1>
          <p className="text-gray-400">Manage inpatient room allotment requests recommended by doctors</p>
        </div>
      </div>

      <div className="card bg-dark-secondary border border-dark-tertiary p-6 rounded-xl">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 flex items-center gap-2 bg-dark-tertiary/45 border border-dark-tertiary/20 rounded-lg px-4">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="bg-transparent py-3 flex-1 outline-none text-white text-sm"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="input-field py-2 bg-dark-tertiary/30 w-full md:w-48 text-xs h-[46px]"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending Bed Allocation</option>
            <option value="completed">Allotted Patients</option>
          </select>
        </div>

        {loading && records.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Loading admission requests...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-tertiary text-left">
                  <th className="py-4 px-4 text-gray-400 font-medium text-sm">Date</th>
                  <th className="py-4 px-4 text-gray-400 font-medium text-sm">Patient Name</th>
                  <th className="py-4 px-4 text-gray-400 font-medium text-sm">Clinical Justification & Notes</th>
                  <th className="py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="py-4 px-4 text-gray-400 font-medium text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-500 text-sm">
                      No clinical admission requests found.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-dark-tertiary hover:bg-dark-tertiary/20 transition-colors"
                    >
                      <td className="py-4 px-4 text-gray-300 text-sm">
                        {new Date(record.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-semibold text-sm">{record.patientName}</span>
                      </td>
                      <td className="py-4 px-4 text-gray-300 text-sm font-medium leading-relaxed max-w-sm truncate" title={record.details}>
                        {record.details ? record.details.replace("Admission Recommended.\nJustification/Instructions: ", "") : "N/A"}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(record.status)}`}>
                          {record.status === "Pending" ? "Pending Bed" : "Allotted"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {record.status?.toLowerCase() === "pending" ? (
                          <button
                            onClick={() => handleAllocateRoom(record)}
                            className="px-3.5 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all shadow shadow-emerald-500/10 flex items-center gap-1.5 ml-auto active:scale-95"
                          >
                            <Bed size={13} />
                            Allocate Bed / Room
                          </button>
                        ) : (
                          <span className="text-xs text-gray-500 font-bold italic pr-2">Room Assigned</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-dark-tertiary">
          <p className="text-gray-400 text-sm">
            Showing {filteredRecords.length > 0 ? (page - 1) * 10 + 1 : 0} to{" "}
            {Math.min(page * 10, total)} of {total} requests
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-dark-tertiary rounded-lg hover:bg-dark-tertiary/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              Previous
            </button>
            <button
              disabled={page * 10 >= total}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-dark-tertiary rounded-lg hover:bg-dark-tertiary/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
