"use client";

import { useState, useEffect } from "react";
import { roomAllotmentAPI, medicineAPI, invoiceAPI } from "@/lib/api";
import { Pill, ArrowLeft, RefreshCw, Loader, Hotel, CheckCircle, Search, Activity, User, FileText } from "lucide-react";
import Link from "next/link";

interface RoomAllotment {
  id: string;
  patientId: string;
  patientName: string;
  bed: string;
  roomId: string;
  status: string;
  attendingDoctor: string;
  room?: { roomNumber: string; roomType: string; floor: string; department?: string };
}

interface Medicine {
  id: string;
  name: string;
  initialQuantity: number;
  sellingPrice?: number;
  taxRate?: number;
}

export default function IPDMedicineSupplyPage() {
  const [admissions, setAdmissions] = useState<RoomAllotment[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAdmission, setSelectedAdmission] = useState<RoomAllotment | null>(null);
  const [selectedMedId, setSelectedMedId] = useState("");
  const [supplyQty, setSupplyQty] = useState("1");
  const [supplyLoading, setSupplyLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchInpatientAdmissions();
    fetchMedicines();
  }, []);

  const fetchInpatientAdmissions = async () => {
    try {
      setLoading(true);
      setError("");
      // Fetch active room allotments (status: Occupied)
      const response = await roomAllotmentAPI.list(1, 100);
      const list = response.data.allotments || [];
      const activeAllotments = list.filter((a: any) => a.status === "Occupied");
      setAdmissions(activeAllotments);
    } catch (err) {
      console.error("Failed to load admissions:", err);
      setError("Failed to fetch active inpatient admissions queue");
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicines = async () => {
    try {
      const response = await medicineAPI.list(1, 100);
      setMedicines(response.data.medicines || []);
    } catch (err) {
      console.error("Failed to load medicines:", err);
    }
  };

  const handleSupplyDispensation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedAdmission) return;
    if (!selectedMedId) {
      setError("Please select a medication to supply");
      return;
    }

    const qty = parseInt(supplyQty);
    if (isNaN(qty) || qty <= 0) {
      setError("Please specify a valid quantity");
      return;
    }

    const selectedMed = medicines.find((m) => m.id === selectedMedId);
    if (!selectedMed) return;

    if (selectedMed.initialQuantity < qty) {
      setError(`Insufficient stock. Only ${selectedMed.initialQuantity} units available.`);
      return;
    }

    try {
      setSupplyLoading(true);

      // Reduce stock
      const remainingStock = Math.max(0, selectedMed.initialQuantity - qty);
      await medicineAPI.update(selectedMedId, {
        initialQuantity: remainingStock
      });

      // Calculate IPD medication billing charges
      const price = parseFloat(selectedMed.sellingPrice as any) || 0;
      const taxRate = parseFloat(selectedMed.taxRate as any) || 0;
      const totalAmount = price * qty * (1 + taxRate / 100);

      // Create a pending invoice entry representing accumulated IPD charges
      await invoiceAPI.create({
        patientId: selectedAdmission.patientId,
        amount: parseFloat(totalAmount.toFixed(2)),
        status: "Pending", // IPD billing stays pending until final check-out/discharge
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        notes: `IPD Pharmacy Supply: ${qty}x ${selectedMed.name} (Ref: ${selectedMed.id.substring(0, 5).toUpperCase()}) supplied to Bed ${selectedAdmission.bed || "A1"}, Room ${selectedAdmission.room?.roomNumber || "302"} (${selectedAdmission.room?.department || "Inpatient Ward"}).`
      });

      setSuccess(`✓ Successfully supplied ${qty} unit(s) of "${selectedMed.name}" to Patient ${selectedAdmission.patientName} at Bed ${selectedAdmission.bed || "A1"}. Charges (₹${totalAmount.toFixed(2)}) appended to inpatient billing queue!`);
      setSelectedAdmission(null);
      setSelectedMedId("");
      setSupplyQty("1");
      fetchInpatientAdmissions();
      fetchMedicines();
    } catch (err: any) {
      console.error("Failed to supply drug:", err);
      const errMsg = err.response?.data?.error || "Failed to process inpatient supply order. Please check connection.";
      setError(errMsg);
    } finally {
      setSupplyLoading(false);
    }
  };

  const filteredAdmissions = admissions.filter((a) =>
    a.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <p className="text-gray-400">Issue drugs and inpatient medications to ward bed slots dynamically</p>
          </div>
        </div>
        <button
          onClick={fetchInpatientAdmissions}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw size={18} /> Refresh Admitted Queue
        </button>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle size={20} className="flex-shrink-0 text-emerald-500" />
          <p className="font-semibold">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Admitted inpatient ward queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card flex items-center gap-2 mb-2 pb-3 border-b border-white/5">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search Admitted Patient Wards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent flex-1 outline-none text-white text-md"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64 card">
              <Loader className="animate-spin text-emerald-500" size={32} />
            </div>
          ) : filteredAdmissions.length === 0 ? (
            <div className="card text-center py-16">
              <Hotel className="mx-auto text-gray-500 mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">No Admitted Inpatients Found</h3>
              <p className="text-gray-400 max-w-sm mx-auto">
                No active patients are currently allotted beds in the clinical wards.
              </p>
            </div>
          ) : (
            filteredAdmissions.map((adm) => (
              <div
                key={adm.id}
                onClick={() => setSelectedAdmission(adm)}
                className={`card cursor-pointer hover:border-[#1abc9c]/50 transition-all border ${
                  selectedAdmission?.id === adm.id ? "border-[#1abc9c]" : "border-white/5"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{adm.patientName}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">Attending: {adm.attendingDoctor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full text-xs font-semibold">
                      Bed slot: {adm.bed || "A1"}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">Room {adm.room?.roomNumber || "302"}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* IPD Supply Log form */}
        <div className="lg:col-span-1">
          {selectedAdmission ? (
            <form onSubmit={handleSupplyDispensation} className="card space-y-6 sticky top-6 border border-[#1abc9c]/20">
              <div className="flex items-center gap-2 pb-4 border-b border-white/5">
                <Activity className="text-[#1abc9c]" size={22} />
                <h3 className="text-xl font-bold text-white">Ward Supply Log</h3>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-gray-500 block">Patient Name</span>
                  <span className="text-white font-bold text-md">{selectedAdmission.patientName}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500 block">Bed Slot</span>
                    <span className="text-white font-semibold">{selectedAdmission.bed || "A1"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Room Number</span>
                    <span className="text-white font-semibold">{selectedAdmission.room?.roomNumber || "302"}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Select Drug to Supply</label>
                  <select
                    value={selectedMedId}
                    onChange={(e) => setSelectedMedId(e.target.value)}
                    className="input-field w-full text-sm mb-4"
                    required
                  >
                    <option value="">Select Medication from stock</option>
                    {medicines.map((m) => (
                      <option key={m.id} value={m.id} disabled={m.initialQuantity <= 0}>
                        {m.name} ({m.initialQuantity} available)
                      </option>
                    ))}
                  </select>

                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Supply Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={supplyQty}
                    onChange={(e) => setSupplyQty(e.target.value)}
                    className="input-field w-full text-sm"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAdmission(null)}
                  className="btn-secondary flex-1 py-2.5"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={supplyLoading}
                  className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-1.5"
                >
                  {supplyLoading ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Supplying...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Log Supply
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="card text-center py-16 text-gray-500 border border-dashed border-white/5">
              <Hotel className="mx-auto mb-2 opacity-50" size={32} />
              <p className="text-sm">Select an active ward admission from the list to view bed slot data and dispatch supply logs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
