"use client";

import { useState, useEffect } from "react";
import { prescriptionAPI } from "@/lib/api";
import { ArrowLeft, RefreshCw, Loader, Receipt, Check, Eye, X, User, Clock, FileText, Pill } from "lucide-react";
import Link from "next/link";

export default function IPDMedicineSupplyPage() {
  const [completedSupplies, setCompletedSupplies] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [selectedSupply, setSelectedSupply] = useState<any | null>(null);

  useEffect(() => {
    fetchCompletedSupplies();
  }, []);

  const fetchCompletedSupplies = async () => {
    try {
      setHistoryLoading(true);
      const response = await prescriptionAPI.list(1, 100);
      const list = response.data.prescriptions || [];
      const ipdCompleted = list.filter(
        (p: any) =>
          (p.status === "Completed" || p.status === "Dispensed") &&
          p.prescriptionType === "IPD"
      );
      setCompletedSupplies(ipdCompleted);
    } catch (err) {
      console.error("Failed to load completed supplies:", err);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/pharmacy"
            className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">IPD Medicine Supply</h1>
            <p className="text-gray-400">Track and inspect past inpatient (IPD) prescription supply and ward clinical logs</p>
          </div>
        </div>
      </div>

      {/* Inpatient (IPD) Supply Logs Section */}
      <div className="card space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Receipt className="text-[#1abc9c]" size={20} />
            <h2 className="text-xl font-bold text-white">Inpatient (IPD) Medicine Supply Logs</h2>
          </div>
          <button
            onClick={fetchCompletedSupplies}
            className="btn-secondary py-1.5 px-3 flex items-center gap-1.5 text-xs text-gray-400 hover:text-white"
          >
            <RefreshCw size={14} className={historyLoading ? "animate-spin" : ""} /> Refresh Logs
          </button>
        </div>

        {historyLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="animate-spin text-[#1abc9c]" size={24} />
          </div>
        ) : completedSupplies.length === 0 ? (
          <div className="text-center py-12 text-gray-500 italic text-sm">
            No recently dispensed IPD supply prescriptions found in history logs.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-xs text-gray-500 uppercase">
                  <th className="text-left py-3 px-4">Patient Name</th>
                  <th className="text-left py-3 px-4">Attending Doctor</th>
                  <th className="text-center py-3 px-4">Date</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-center py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {completedSupplies.map((supply) => (
                  <tr key={supply.id} className="border-b border-white/5 text-sm hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {supply.patient?.name || "Admitted Patient"}
                    </td>
                    <td className="py-3.5 px-4 text-gray-300">
                      {supply.doctor?.name ? `Dr. ${supply.doctor.name}` : "General Pharmacy Staff"}
                    </td>
                    <td className="py-3.5 px-4 text-center text-gray-400 font-mono text-xs">
                      {new Date(supply.prescriptionDate || supply.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold font-mono">
                        <Check size={12} /> Supplied
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedSupply(supply)}
                        className="btn-primary py-1 px-3 font-bold text-xs flex items-center gap-1.5 inline-flex justify-center shadow-lg transition-all rounded-lg"
                      >
                        <Eye size={12} /> View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* IPD Ward Supply Details Modal */}
      {selectedSupply && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#13141b] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative shadow-emerald-500/5 transition-all">
            
            {/* Header banner */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-emerald-950/20 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-emerald-500/10 border border-emerald-500/20 text-[#1abc9c] rounded-xl flex items-center justify-center">
                  <Receipt size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">IPD Ward Supply Record</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Dispensation Ref: RX-{selectedSupply.id.substring(0, 5).toUpperCase()}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSupply(null)}
                className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Demographics Overview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                <div>
                  <span className="text-gray-500 text-xs uppercase font-bold tracking-wider block">Patient</span>
                  <span className="text-white font-bold text-sm block mt-1">{selectedSupply.patient?.name || "Admitted Patient"}</span>
                  <span className="text-gray-400 text-xs font-mono">{selectedSupply.patient?.gender || "N/A"} • {selectedSupply.patient?.uhid || "No UHID"}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs uppercase font-bold tracking-wider block">Attending Doctor</span>
                  <span className="text-white font-semibold text-sm block mt-1">{selectedSupply.doctor?.name ? `Dr. ${selectedSupply.doctor.name}` : "General Pharmacy Staff"}</span>
                  <span className="text-gray-500 text-xs block">Clinical Ward Lead</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs uppercase font-bold tracking-wider block">Type & Date</span>
                  <span className="text-blue-400 font-bold text-sm block mt-1">IPD Admission</span>
                  <span className="text-gray-400 text-xs block mt-0.5">
                    {new Date(selectedSupply.prescriptionDate || selectedSupply.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </span>
                </div>
              </div>

              {/* Diagnosis and Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#181920]/50 p-4 rounded-xl border border-white/5">
                  <span className="text-[#1abc9c] font-bold text-xs uppercase tracking-wider block">Clinical Diagnosis</span>
                  <p className="text-gray-300 text-sm mt-1.5 italic">"{selectedSupply.diagnosis || "General Consult Details"}"</p>
                </div>
                <div className="bg-[#181920]/50 p-4 rounded-xl border border-white/5">
                  <span className="text-amber-400 font-bold text-xs uppercase tracking-wider block">Special Instructions</span>
                  <p className="text-gray-300 text-sm mt-1.5">
                    {selectedSupply.notesForPharmacist ? `"${selectedSupply.notesForPharmacist}"` : "No special clinical instructions recorded."}
                  </p>
                </div>
              </div>

              {/* Medications Table */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <Pill size={16} className="text-[#1abc9c]" /> Medications Supplied Checklist
                </h4>
                <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.01]">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/5 text-gray-400 font-bold">
                        <th className="py-3 px-4">Medication Name</th>
                        <th className="py-3 px-4 text-center">Dosage Schedule</th>
                        <th className="py-3 px-4 text-center">Duration</th>
                        <th className="py-3 px-4 text-center">Quantity</th>
                        <th className="py-3 px-4">Special Instructions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {getMedicationsList(selectedSupply.medications).map((med: any, idx: number) => (
                        <tr key={idx} className="hover:bg-white/5">
                          <td className="py-3.5 px-4 font-semibold text-white">{med.name}</td>
                          <td className="py-3.5 px-4 text-center text-gray-300 font-mono">{med.dosage || "N/A"}</td>
                          <td className="py-3.5 px-4 text-center text-gray-300">{med.duration || "N/A"}</td>
                          <td className="py-3.5 px-4 text-center text-[#1abc9c] font-bold font-mono">{med.qty || 10}</td>
                          <td className="py-3.5 px-4 text-gray-400">{med.instructions || "None"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setSelectedSupply(null)}
                className="btn-secondary py-2.5 px-6 rounded-xl font-bold text-sm"
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
