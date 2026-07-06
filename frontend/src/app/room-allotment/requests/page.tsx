"use client";

import { useState, useEffect } from "react";
import { recordsAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { Search, FileText, CheckCircle2, AlertCircle, Clock, Check, Plus, ExternalLink, Bed, ShieldAlert, Activity, ChevronRight } from "lucide-react";
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
  doctorName?: string;
}

export default function AdmissionRequestsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [records, setRecords] = useState<AdmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Pending Review");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchAdmissionRequests = async () => {
    try {
      setLoading(true);
      // Query records of type 'Admission Request'
      const res = await recordsAPI.list(1, 100, "Admission Request", searchQuery);
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
    setPage(1);
  }, [searchQuery]);

  const parseDetails = (detailsStr: string) => {
    try {
      if (detailsStr && detailsStr.startsWith("{")) {
        return JSON.parse(detailsStr);
      }
    } catch (e) { }

    // Fallback parsing for legacy text format
    const cleanNotes = detailsStr
      ? detailsStr.replace("Admission Recommended.\nJustification/Instructions: ", "")
      : "";
    return {
      priority: "Routine",
      requestedDepartment: "General Ward",
      recommendedRoomType: "General",
      admissionReason: "Clinical Assessment",
      clinicalNotes: cleanNotes || "Immediate room allotment advised.",
      attendingDoctorName: "Attending Doctor"
    };
  };

  const handleAllocateRoom = (record: AdmissionRecord) => {
    const parsed = parseDetails(record.details);
    const doctorNameToShow = record.doctorName || parsed.attendingDoctorName || "Unassigned";

    // Redirect receptionist with rich clinical context
    router.push(
      `/room-allotment/new?patientId=${record.patientId || ""}&patientName=${encodeURIComponent(record.patientName)}&notes=${encodeURIComponent(parsed.clinicalNotes || "")}&recordId=${record.id}&doctor=${encodeURIComponent(doctorNameToShow)}&department=${encodeURIComponent(parsed.requestedDepartment || "")}&roomType=${encodeURIComponent(parsed.recommendedRoomType || "")}&reason=${encodeURIComponent(parsed.admissionReason || "")}&priority=${encodeURIComponent(parsed.priority || "Routine")}`
    );
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending review":
      case "pending":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "bed assigned":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "admitted":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "discharged":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
      case "rejected":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "emergency":
        return "bg-rose-500/15 text-rose-400 border border-rose-500/25";
      case "urgent":
        return "bg-amber-500/15 text-amber-400 border border-amber-500/25";
      default:
        return "bg-blue-500/15 text-blue-400 border border-blue-500/25";
    }
  };

  // Filter records based on selected status tab (with fallback handling for 'Pending' -> 'Pending Review')
  const itemsPerPage = 10;
  const filteredRecords = records.filter(r => {
    const recStatus = r.status?.toLowerCase() === "pending" ? "pending review" : r.status?.toLowerCase();
    const filterVal = statusFilter.toLowerCase();
    if (filterVal === "all requests" || filterVal === "all") return true;
    return recStatus === filterVal;
  });

  const paginatedRecords = filteredRecords.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalFiltered = filteredRecords.length;

  const statuses = [
    { label: "Pending Review", count: records.filter(r => ["pending", "pending review"].includes(r.status?.toLowerCase())).length },
    { label: "Admitted", count: records.filter(r => r.status?.toLowerCase() === "admitted").length },
    { label: "Discharged", count: records.filter(r => r.status?.toLowerCase() === "discharged").length },
    { label: "All Requests", count: records.length }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="text-emerald-400 animate-pulse" size={24} />
            <h1 className="text-3xl  text-white font-outfit">Clinical Admission Requests</h1>
          </div>
          <p className="text-gray-400 mt-1 text-xs">Receptionist Desk • Review, manage, and allot beds for inpatient recommendations</p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-2 border-b border-dark-tertiary/60 pb-px flex-wrap">
        {statuses.map(tab => (
          <button
            key={tab.label}
            onClick={() => {
              setStatusFilter(tab.label);
              setPage(1);
            }}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all relative ${statusFilter === tab.label
              ? "border-emerald-500 text-emerald-400 "
              : "border-transparent text-gray-400 hover:text-white"
              }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-2 bg-dark-tertiary px-2 py-0.5 rounded-full text-xs text-gray-300 ">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="card bg-dark-secondary border border-dark-tertiary p-6 rounded-xl shadow-lg">
        {/* Search bar */}
        <div className="flex items-center gap-2 bg-dark-tertiary/40 border border-dark-tertiary/20 rounded px-4 mb-6 max-w-md">
          <Search size={15} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="bg-transparent py-3 flex-1 outline-none text-white text-xs placeholder-gray-500"
          />
        </div>

        {loading && records.length === 0 ? (
          <div className="text-center py-16 text-gray-400 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-medium animate-pulse text-sm">Retrieving admission recommendations...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-dark-tertiary/80 text-gray-400 text-xs  uppercase tracking-wider">
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Patient details</th>
                  <th className="py-4 px-4">Priority</th>
                  <th className="py-4 px-4">Department & Doctor</th>
                  <th className="py-4 px-4">Room Type</th>
                  <th className="py-4 px-4">Reason / Notes</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-tertiary/40">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-gray-500 text-sm italic">
                      No clinical admission requests found in this category.
                    </td>
                  </tr>
                ) : (
                  paginatedRecords.map((record) => {
                    const parsed = parseDetails(record.details);
                    const isEmergency = parsed.priority?.toLowerCase() === "emergency";

                    return (
                      <tr
                        key={record.id}
                        className={`hover:bg-dark-tertiary/15 transition-colors group ${isEmergency && record.status?.toLowerCase() === "pending review"
                          ? "bg-rose-500/[0.02]"
                          : ""
                          }`}
                      >
                        <td className="py-4 px-4 text-gray-300 text-xs whitespace-nowrap">
                          {new Date(record.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {isEmergency && (
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                              </span>
                            )}
                            <span className="text-white  text-sm block group-hover:text-emerald-400 transition-colors">
                              {record.patientName}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-mono mt-0.5 block uppercase">
                            UHID: {record.patientId ? record.patientId.slice(0, 8) : "N/A"}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px]  border ${getPriorityStyle(parsed.priority)}`}>
                            {parsed.priority || "Routine"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-200 font-semibold text-xs block">
                            {parsed.requestedDepartment || "General Ward"}
                          </span>
                          <span className="text-[10px] text-purple-400 mt-0.5 block font-medium">
                            Dr. {record.doctorName || parsed.attendingDoctorName || "Unassigned"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="bg-dark-tertiary border border-dark-tertiary/80 text-gray-300 px-2 py-0.5 rounded text-[10px]  uppercase tracking-wider">
                            {parsed.recommendedRoomType || "General"}
                          </span>
                        </td>
                        <td className="py-4 px-4 max-w-xs">
                          <p className="text-gray-300 text-xs font-semibold truncate" title={parsed.admissionReason}>
                            {parsed.admissionReason}
                          </p>
                          <p className="text-[10px] text-gray-500 mt-0.5 truncate leading-normal" title={parsed.clinicalNotes}>
                            {parsed.clinicalNotes || "No notes."}
                          </p>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px]  border ${getStatusStyle(record.status)}`}>
                            {record.status === "Pending" ? "Pending Review" : record.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          {["pending review", "pending"].includes(record.status?.toLowerCase()) ? (
                            <button
                              onClick={() => handleAllocateRoom(record)}
                              className="px-3 py-1.5 text-xs  bg-emerald-500 hover:bg-emerald-600 text-white rounded transition-all shadow-md shadow-emerald-500/10 flex items-center gap-1.5 ml-auto active:scale-95 group-hover:shadow-emerald-500/25"
                            >
                              <Bed size={13} />
                              Allocate Bed
                              <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          ) : (
                            <span className="text-[10px] text-gray-500  italic pr-2">Assigned</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-between items-center my-3 my-3 mt-6 pt-4 border-t border-dark-tertiary">
          <p className="text-gray-400 text-xs">
            Showing {filteredRecords.length > 0 ? (page - 1) * 10 + 1 : 0} to{" "}
            {Math.min(page * 10, totalFiltered)} of {totalFiltered} requests
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3.5 py-1.5 bg-dark-tertiary rounded hover:bg-dark-tertiary/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-semibold text-white"
            >
              Previous
            </button>
            <button
              disabled={page * 10 >= totalFiltered}
              onClick={() => setPage(page + 1)}
              className="px-3.5 py-1.5 bg-dark-tertiary rounded hover:bg-dark-tertiary/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-semibold text-white"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
