"use client";

import { useState, useEffect } from "react";
import { prescriptionAPI } from "@/lib/api";
import { ArrowLeft, RefreshCw, Loader, Receipt, Check, Eye, X, User, Clock, FileText, Pill } from "lucide-react";
import Link from "next/link";
import DataTable, { Column } from "@/components/ui/DataTable";

export default function OPDMedicineIssuePage() {
  const [completedIssues, setCompletedIssues] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);

  useEffect(() => {
    fetchCompletedIssues();
  }, []);

  const fetchCompletedIssues = async () => {
    try {
      setHistoryLoading(true);
      const response = await prescriptionAPI.list(1, 100);
      const list = response.data.prescriptions || [];
      const opdCompleted = list.filter(
        (p: any) =>
          (p.status === "Completed" || p.status === "Dispensed") &&
          (p.prescriptionType === "OPD" || p.prescriptionType === "Standard" || !p.prescriptionType)
      );
      setCompletedIssues(opdCompleted);
    } catch (err) {
      console.error("Failed to load completed issues:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const getMedicationsList = (medStr: string) => {
    try {
      return JSON.parse(medStr) || [];
    } catch (e) {
      return [];
    }
  };

  const columns_1: Column<any>[] = [
    { header: "Medication Name", accessor: "name" },
    { header: "Dosage Schedule", accessor: (med) => (<>{med.dosage || "N/A"}</>) },
    { header: "Duration", accessor: (med) => (<>{med.duration || "N/A"}</>) },
    { header: "Quantity", accessor: (med) => (<>{med.qty || 10}</>) },
    { header: "Special Instructions", accessor: (med) => (<>{med.instructions || "None"}</>) },
  ];

  const columns_0: Column<any>[] = [
    { header: "Patient Name", accessor: (issue) => (<>\n{issue.patient?.name || "Walk-In Patient"}\n</>) },
    { header: "Attending Doctor", accessor: (issue) => (<>\n{issue.doctor?.name ? `Dr. ${issue.doctor.name}` : "General Pharmacy Staff"}\n</>) },
    {
      header: "Date", accessor: (issue) => (<>\n{new Date(issue.prescriptionDate || issue.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })}\n</>)
    },
    {
      header: "Status", accessor: (issue) => (<>\n<span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs  font-mono">
        <Check size={12} /> Dispensed
      </span>\n</>)
    },
    {
      header: "Actions", accessor: (issue) => (<>\n<button
        onClick={() => setSelectedIssue(issue)}
        className="btn-primary py-1 px-3  text-xs flex items-center gap-1.5 inline-flex justify-center shadow-lg transition-all rounded"
      >
        <Eye size={12} /> View Details
      </button>\n</>)
    },
  ];



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3 my-3">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/pharmacy"
            className="p-2 hover:bg-dark-tertiary rounded transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl ">OPD Medicine Issue</h1>
            <p className="text-gray-400">Track and inspect past outpatient (OPD) prescription dispensation logs</p>
          </div>
        </div>
      </div>

      {/* Dispensation History Logs Section */}
      <div className="card space-y-6">
        <div className="flex justify-between items-center my-3 my-3 pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Receipt className="text-[#1abc9c]" size={20} />
            <h2 className="text-xl  text-white">Outpatient (OPD) Dispensation History Logs</h2>
          </div>
          <button
            onClick={fetchCompletedIssues}
            className="btn-secondary py-1.5 px-3 flex items-center gap-1.5 text-xs text-gray-400 hover:text-white"
          >
            <RefreshCw size={14} className={historyLoading ? "animate-spin" : ""} /> Refresh Logs
          </button>
        </div>

        {historyLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="animate-spin text-[#1abc9c]" size={24} />
          </div>
        ) : completedIssues.length === 0 ? (
          <div className="text-center py-12 text-gray-500 italic text-sm">
            No recently dispensed OPD prescriptions found in history logs.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <DataTable columns={columns_0} data={completedIssues} enableLocalSearch enableLocalPagination />
          </div>
        )}
      </div>

      {/* OPD Dispensation Details Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#13141b] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative shadow-emerald-500/5 transition-all">

            {/* Header banner */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-emerald-950/20 to-transparent">
              <div className="flex items-center gap-2">
                <div className="w-11 h-11 bg-emerald-500/10 border border-emerald-500/20 text-[#1abc9c] roundedex items-center justify-center">
                  <Receipt size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">OPD Dispensation Record</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Dispensation Ref: RX-{selectedIssue.id.substring(0, 5).toUpperCase()}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedIssue(null)}
                className="p-2 hover:bg-card/5 rounded text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2">
              {/* Demographics Overview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-card/5 p-4 roundedrder border-white/5">
                <div>
                  <span className="text-gray-500 text-xs uppercase  tracking-wider block">Patient</span>
                  <span className="text-white  text-sm block mt-1">{selectedIssue.patient?.name || "Walk-In"}</span>
                  <span className="text-gray-400 text-xs font-mono">{selectedIssue.patient?.gender || "N/A"} • {selectedIssue.patient?.uhid || "No UHID"}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs uppercase  tracking-wider block">Attending Doctor</span>
                  <span className="text-white font-semibold text-sm block mt-1">{selectedIssue.doctor?.name ? `Dr. ${selectedIssue.doctor.name}` : "General Pharmacy Staff"}</span>
                  <span className="text-gray-500 text-xs block">Consultation Lead</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs uppercase  tracking-wider block">Type & Date</span>
                  <span className="text-[#1abc9c]  text-sm block mt-1">OPD Outpatient</span>
                  <span className="text-gray-400 text-xs block mt-0.5">
                    {new Date(selectedIssue.prescriptionDate || selectedIssue.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </span>
                </div>
              </div>

              {/* Diagnosis and Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#181920]/50 p-4 roundedrder border-white/5">
                  <span className="text-[#1abc9c]  text-xs uppercase tracking-wider block">Clinical Diagnosis</span>
                  <p className="text-gray-300 text-sm mt-1.5 italic">"{selectedIssue.diagnosis || "General Consult Details"}"</p>
                </div>
                <div className="bg-[#181920]/50 p-4 roundedrder border-white/5">
                  <span className="text-purple-400  text-xs uppercase tracking-wider block">Special Instructions</span>
                  <p className="text-gray-300 text-sm mt-1.5">
                    {selectedIssue.notesForPharmacist ? `"${selectedIssue.notesForPharmacist}"` : "No special pharmacist instructions recorded."}
                  </p>
                </div>
              </div>

              {/* Medications Table */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <Pill size={16} className="text-[#1abc9c]" /> Medications Dispensed Checklist
                </h4>
                <div className="border border-white/5 roundederflow-hidden bg-card/[0.01]">
                  <DataTable columns={columns_1} data={getMedicationsList(selectedIssue.medications)} enableLocalSearch enableLocalPagination />
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-6 border-t border-white/5 bg-card/[0.01] flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setSelectedIssue(null)}
                className="btn-secondary py-2.5 px-6 roundedext-sm"
              >
                Close Receipt
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
