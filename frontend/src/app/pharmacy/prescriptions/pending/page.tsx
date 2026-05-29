"use client";

import { useState, useEffect } from "react";
import { prescriptionAPI, patientAPI } from "@/lib/api";
import { Clipboard, ArrowLeft, RefreshCw, Loader, Eye, CheckCircle2, User, FileText, Pill } from "lucide-react";
import Link from "next/link";

interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  prescriptionDate: string;
  prescriptionType: string;
  diagnosis: string;
  notesForPharmacist?: string;
  status: string;
  medications: string; // JSON string
  patient?: { name: string; uhid?: string };
  doctor?: { name: string };
}

export default function PendingPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [dispenseLoading, setDispenseLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchPendingPrescriptions();
  }, []);

  const fetchPendingPrescriptions = async () => {
    try {
      setLoading(true);
      setError("");
      // Fetch prescriptions list (status: Active or Pending)
      const response = await prescriptionAPI.list(1, 100);
      const list = response.data.prescriptions || [];
      
      // Filter for pending or active prescriptions
      const activeList = list.filter((p: any) => p.status === "Active" || p.status === "Pending");
      setPrescriptions(activeList);
    } catch (err) {
      console.error("Failed to load prescriptions:", err);
      setError("Failed to fetch active prescriptions queue");
    } finally {
      setLoading(false);
    }
  };

  const handleDispense = async (prescription: Prescription) => {
    try {
      setDispenseLoading(true);
      setSuccessMsg("");

      // Update prescription status to Dispensed/Inactive
      await prescriptionAPI.update(prescription.id, {
        status: "Dispensed",
      });

      setSuccessMsg(`✓ Prescription for ${prescription.patient?.name || "Patient"} successfully dispensed and billed!`);
      setSelectedPrescription(null);
      fetchPendingPrescriptions();
      
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Failed to dispense prescription:", err);
      setError("Dispensation failed. Please check stock level.");
    } finally {
      setDispenseLoading(false);
    }
  };

  // Helper to parse medications JSON string
  const parseMedications = (medStr: string) => {
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
            <h1 className="text-3xl font-bold">Pending Prescriptions</h1>
            <p className="text-gray-400">Dispense active patient prescriptions, dosage checks, and drug bill dispatches</p>
          </div>
        </div>
        <button
          onClick={fetchPendingPrescriptions}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw size={18} /> Refresh Queue
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle2 size={20} className="flex-shrink-0" />
          <p className="font-semibold">{successMsg}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prescriptions List queue */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-64 card">
              <Loader className="animate-spin text-emerald-500" size={32} />
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="card text-center py-16">
              <Clipboard className="mx-auto text-gray-500 mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">Prescription Queue Empty</h3>
              <p className="text-gray-400 max-w-sm mx-auto">
                No active or pending patient prescriptions found in the clinic queues.
              </p>
            </div>
          ) : (
            prescriptions.map((pres) => (
              <div
                key={pres.id}
                onClick={() => setSelectedPrescription(pres)}
                className={`card cursor-pointer hover:border-[#1abc9c]/50 transition-all border ${
                  selectedPrescription?.id === pres.id ? "border-[#1abc9c]" : "border-white/5"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-[#1abc9c]/10 rounded-lg flex items-center justify-center text-[#1abc9c]">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{pres.patient?.name || "Unregistered Patient"}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">Prescribed on {new Date(pres.prescriptionDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-xs font-semibold">
                    {pres.prescriptionType}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {parseMedications(pres.medications).map((med: any, idx: number) => (
                    <span key={idx} className="px-2 py-1 bg-white/5 border border-white/5 rounded text-xs text-gray-300 flex items-center gap-1.5">
                      <Pill size={12} className="text-[#1abc9c]" />
                      {med.name} ({med.qty || med.dosage || "1 Unit"})
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Prescription Dispense Console */}
        <div className="lg:col-span-1">
          {selectedPrescription ? (
            <div className="card space-y-6 sticky top-6 border border-[#1abc9c]/20">
              <div className="flex items-center gap-2 pb-4 border-b border-white/5">
                <FileText className="text-[#1abc9c]" size={22} />
                <h3 className="text-xl font-bold text-white">Dispense Console</h3>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-gray-500 block">Patient Name</span>
                  <span className="text-white font-bold text-md">{selectedPrescription.patient?.name}</span>
                </div>

                <div>
                  <span className="text-gray-500 block">Attending Clinician</span>
                  <span className="text-white font-semibold">{selectedPrescription.doctor?.name || "Dr. MedixPro Staff"}</span>
                </div>

                <div>
                  <span className="text-gray-500 block">Clinical Diagnosis</span>
                  <span className="text-white italic">"{selectedPrescription.diagnosis || "General Symptoms"}"</span>
                </div>

                {selectedPrescription.notesForPharmacist && (
                  <div className="bg-amber-500/5 p-3 rounded border border-amber-500/10">
                    <span className="text-amber-500 font-semibold block text-xs">Pharmacist Notes</span>
                    <p className="text-gray-300 text-xs mt-1">"{selectedPrescription.notesForPharmacist}"</p>
                  </div>
                )}

                <div className="pt-4 border-t border-white/5">
                  <h4 className="font-semibold text-white mb-2">Medications Checklist</h4>
                  <div className="space-y-3">
                    {parseMedications(selectedPrescription.medications).map((med: any, idx: number) => (
                      <div key={idx} className="p-3 bg-white/5 rounded border border-white/5">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white text-sm">{med.name}</span>
                          <span className="text-[#1abc9c] font-semibold text-xs">{med.qty || med.dosage || "1 unit"}</span>
                        </div>
                        {med.instructions && (
                          <p className="text-xs text-gray-400 mt-1 italic">Instructions: {med.instructions}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex gap-2">
                <button
                  onClick={() => setSelectedPrescription(null)}
                  className="btn-secondary flex-1 py-2.5"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDispense(selectedPrescription)}
                  disabled={dispenseLoading}
                  className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-1.5"
                >
                  {dispenseLoading ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Dispensing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      Dispense & Bill
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="card text-center py-16 text-gray-500 border border-dashed border-white/5">
              <Eye className="mx-auto mb-2 opacity-50" size={32} />
              <p className="text-sm">Select a prescription from the queue to view full clinical formulas and dispensing controls</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
