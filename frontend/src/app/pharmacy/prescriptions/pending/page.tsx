"use client";

import { useState, useEffect } from "react";
import { prescriptionAPI, patientAPI, medicineAPI, invoiceAPI } from "@/lib/api";
import {
  Clipboard,
  ArrowLeft,
  RefreshCw,
  Loader,
  Eye,
  CheckCircle2,
  User,
  FileText,
  Pill,
  Search,
  AlertTriangle,
  Receipt,
  Check,
  Activity,
  Layers,
  ShoppingBag,
  TrendingUp,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
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
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [dispenseLoading, setDispenseLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"All" | "OPD" | "IPD">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchPendingPrescriptions();
    fetchMedicines();
  }, []);

  // Reset page when searching or filtering to avoid empty page issues
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType]);

  const fetchMedicines = async () => {
    try {
      const res = await medicineAPI.list(1, 100);
      setMedicines(res.data.medicines || []);
    } catch (err) {
      console.error("Failed to fetch medicines stock list:", err);
    }
  };

  const fetchPendingPrescriptions = async () => {
    try {
      setLoading(true);
      setError("");
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

  const parseMedications = (medStr: string) => {
    try {
      return JSON.parse(medStr) || [];
    } catch (e) {
      return [];
    }
  };

  // Safe helper to calculate dynamic prescription billing and validate stocks
  const getDispenseDetails = (prescription: Prescription | null) => {
    if (!prescription) return null;

    const rxMedications = parseMedications(prescription.medications);
    let totalSubtotal = 0;
    let totalTax = 0;
    let totalBillAmount = 0;
    const items = [];
    let hasStockError = false;
    let missingMedicine = false;

    for (const rxMed of rxMedications) {
      // Find matching medicine in stock (case-insensitive name match)
      const matchedStock = medicines.find(
        (m) => m.name.toLowerCase().trim() === rxMed.name.toLowerCase().trim()
      );

      // Resolve dispensing quantity
      let qty = 1;
      if (rxMed.qty) {
        const parsedQty = parseInt(String(rxMed.qty).replace(/[^0-9]/g, ""));
        if (!isNaN(parsedQty) && parsedQty > 0) qty = parsedQty;
      } else if (rxMed.dosage) {
        // If dosage is like "1-0-1", sum up the doses: 1 + 0 + 1 = 2 per day.
        const parts = String(rxMed.dosage).split("-").map(p => parseInt(p));
        const dailyTotal = parts.reduce((sum, val) => sum + (isNaN(val) ? 0 : val), 0);
        if (dailyTotal > 0) {
          qty = dailyTotal * 5; // assume standard 5 day course
        } else {
          const parsedDosage = parseInt(String(rxMed.dosage).replace(/[^0-9]/g, ""));
          if (!isNaN(parsedDosage) && parsedDosage > 0) qty = parsedDosage;
        }
      }

      const availableStock = matchedStock ? matchedStock.initialQuantity : 0;
      const price = matchedStock ? (parseFloat(matchedStock.sellingPrice) || 0) : 0;
      const taxRate = matchedStock ? (parseFloat(matchedStock.taxRate) || 0) : 0;
      const subtotal = price * qty;
      const tax = subtotal * (taxRate / 100);
      const lineTotal = subtotal + tax;

      const isOutOfStock = availableStock < qty;
      const isUnregistered = !matchedStock;

      if (isOutOfStock) hasStockError = true;
      if (isUnregistered) missingMedicine = true;

      items.push({
        name: rxMed.name,
        qty,
        instructions: rxMed.instructions || rxMed.dosage || "No instructions provided",
        price,
        taxRate,
        subtotal,
        tax,
        lineTotal,
        availableStock,
        isOutOfStock,
        isUnregistered,
      });

      totalSubtotal += subtotal;
      totalTax += tax;
      totalBillAmount += lineTotal;
    }

    return {
      items,
      totalSubtotal,
      totalTax,
      totalBillAmount,
      hasStockError,
      missingMedicine,
    };
  };

  const handleDispense = async (prescription: Prescription) => {
    try {
      setDispenseLoading(true);
      setError("");
      setSuccessMsg("");

      const details = getDispenseDetails(prescription);
      if (!details || details.items.length === 0) {
        setError("No medications listed in this prescription.");
        return;
      }

      if (details.missingMedicine) {
        setError("One or more prescribed medicines are not registered in the pharmacy inventory.");
        return;
      }

      if (details.hasStockError) {
        setError("One or more prescribed medicines have insufficient stock.");
        return;
      }

      // 1. Perform stock updates
      for (const item of details.items) {
        const matchedStock = medicines.find(
          (m) => m.name.toLowerCase().trim() === item.name.toLowerCase().trim()
        );
        if (matchedStock) {
          await medicineAPI.update(matchedStock.id, {
            initialQuantity: matchedStock.initialQuantity - item.qty
          });
        }
      }

      // 2. Create the paid invoice record in database
      await invoiceAPI.create({
        patientId: prescription.patientId,
        amount: parseFloat(details.totalBillAmount.toFixed(2)),
        status: "Paid",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: `OPD Pharmacy Bill for Prescription Ref: RX-${prescription.id.substring(0, 5).toUpperCase()} (${prescription.diagnosis || "General Details"}).`
      });

      // 3. Update prescription status to Completed
      await prescriptionAPI.update(prescription.id, {
        status: "Completed",
      });

      setSuccessMsg(`✓ Prescription for ${prescription.patient?.name || "Patient"} successfully dispensed and billed! Total Net Charges: ₹${details.totalBillAmount.toFixed(2)}`);
      setSelectedPrescription(null);
      fetchPendingPrescriptions();
      fetchMedicines();
      
      setTimeout(() => setSuccessMsg(""), 6000);
    } catch (err: any) {
      console.error("Failed to dispense prescription:", err);
      const errMsg = err.response?.data?.error || "Dispensation failed. Please check stock level and connection.";
      setError(errMsg);
    } finally {
      setDispenseLoading(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter((p) => {
    const patientName = p.patient?.name?.toLowerCase() || "";
    const doctorName = p.doctor?.name?.toLowerCase() || "";
    const diagnosis = p.diagnosis?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = patientName.includes(query) || doctorName.includes(query) || diagnosis.includes(query);
    const matchesType = filterType === "All" || p.prescriptionType === filterType;
    
    return matchesSearch && matchesType;
  });

  const modalDetails = getDispenseDetails(selectedPrescription);

  const totalItems = filteredPrescriptions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedPrescriptions = filteredPrescriptions.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-dark-secondary p-6 rounded-2xl border border-white/5 shadow-2xl">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/pharmacy"
            className="p-3 bg-white/5 hover:bg-[#1abc9c]/20 hover:text-[#1abc9c] rounded-xl transition-all duration-300"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Pending Prescriptions <span className="text-sm bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">{prescriptions.length} Active</span>
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">Dispense medications, verify inventory stocks, and dispatch billing instantly</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative bg-white/5 border border-white/5 focus-within:border-[#1abc9c]/50 rounded-xl px-3.5 py-2 flex items-center gap-2 w-64 transition-all">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search patient, doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-white text-sm w-full placeholder-gray-500"
            />
          </div>

          {/* Type filter */}
          <select
            value={filterType}
            onChange={(e: any) => setFilterType(e.target.value)}
            className="bg-[#181920] border border-white/5 hover:border-white/10 text-gray-300 text-sm rounded-xl px-4 py-2 outline-none cursor-pointer transition-all"
          >
            <option value="All">All Flows</option>
            <option value="OPD">OPD Consultation</option>
            <option value="IPD">IPD Ward Supply</option>
          </select>

          {/* Refresh button */}
          <button
            onClick={fetchPendingPrescriptions}
            className="p-2.5 bg-white/5 border border-white/5 hover:border-[#1abc9c]/30 hover:bg-[#1abc9c]/10 text-gray-300 hover:text-[#1abc9c] rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm"
            title="Refresh Queue"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Success/Error Alerts */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-4 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 size={22} className="flex-shrink-0 text-emerald-400" />
          <p className="font-semibold text-sm">{successMsg}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 animate-fadeIn">
          <AlertTriangle size={22} className="flex-shrink-0 text-red-400" />
          <p className="font-semibold text-sm">{error}</p>
        </div>
      )}

      {/* Main Table Queue Card */}
      <div className="card overflow-hidden border border-white/5 shadow-2xl p-0">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-80 gap-3">
            <Loader className="animate-spin text-[#1abc9c]" size={36} />
            <span className="text-gray-400 text-sm">Syncing prescription queues...</span>
          </div>
        ) : filteredPrescriptions.length === 0 ? (
          <div className="text-center py-20">
            <Clipboard className="mx-auto text-gray-600 mb-4" size={56} />
            <h3 className="text-xl font-bold text-white mb-2">Prescription Queue Clean</h3>
            <p className="text-gray-400 max-w-sm mx-auto text-sm">
              No matching active or pending patient prescriptions are found in the pharmacy dispensing registers.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="py-4 px-6 text-gray-400 font-bold text-xs uppercase tracking-wider">Patient Name</th>
                    <th className="py-4 px-6 text-gray-400 font-bold text-xs uppercase tracking-wider">Doctor Name</th>
                    <th className="py-4 px-6 text-gray-400 font-bold text-xs uppercase tracking-wider">Date</th>
                    <th className="py-4 px-6 text-gray-400 font-bold text-xs uppercase tracking-wider text-center">Status</th>
                    <th className="py-4 px-6 text-gray-400 font-bold text-xs uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedPrescriptions.map((pres) => (
                    <tr
                      key={pres.id}
                      className="hover:bg-white/[0.02] transition-all duration-150"
                    >
                      {/* Patient Name */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-[#1abc9c]/20 to-[#1abc9c]/5 text-[#1abc9c] rounded-xl flex items-center justify-center font-bold border border-[#1abc9c]/20">
                            <User size={16} />
                          </div>
                          <div>
                            <span className="font-semibold text-white block text-sm">{pres.patient?.name || "Unregistered"}</span>
                            {pres.patient?.uhid && (
                              <span className="text-xs text-gray-500 font-mono block">{pres.patient.uhid}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Doctor Name */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="text-sm">
                          <span className="text-gray-300 font-semibold">{pres.doctor?.name || "Clinic Staff"}</span>
                          <span className="text-gray-500 text-xs block">Attending Physician</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="text-white font-medium text-sm block">
                          {new Date(pres.prescriptionDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </span>
                        <span className="text-xs text-[#1abc9c] bg-[#1abc9c]/5 px-2 py-0.5 rounded border border-[#1abc9c]/10 font-mono mt-1 inline-block">
                          RX-{pres.id.substring(0, 5).toUpperCase()}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[11px] font-bold uppercase tracking-wider">
                          Awaiting Dispense
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedPrescription(pres)}
                          className="btn-primary py-1.5 px-4 font-bold text-xs flex items-center gap-2 inline-flex justify-center shadow-lg shadow-emerald-950/20 hover:shadow-emerald-500/10 transition-all rounded-lg"
                        >
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white/[0.01] border-t border-white/5">
                <span className="text-xs text-gray-400">
                  Showing <strong className="text-gray-300 font-semibold">{totalItems === 0 ? 0 : startIndex + 1}</strong> to{" "}
                  <strong className="text-gray-300 font-semibold">{endIndex}</strong> of{" "}
                  <strong className="text-gray-300 font-semibold">{totalItems}</strong> prescriptions
                </span>

                <div className="flex items-center gap-1.5">
                  {/* Previous Page Button */}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 bg-white/5 hover:bg-white/10 disabled:hover:bg-white/5 text-gray-300 disabled:text-gray-600 disabled:opacity-50 rounded-lg border border-white/5 disabled:border-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
                    title="Previous Page"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {/* Page Number Buttons */}
                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNum = index + 1;
                    const isCurrent = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          isCurrent
                            ? "bg-[#1abc9c]/10 text-[#1abc9c] border border-[#1abc9c]/30 shadow-md shadow-[#1abc9c]/5"
                            : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Next Page Button */}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 bg-white/5 hover:bg-white/10 disabled:hover:bg-white/5 text-gray-300 disabled:text-gray-600 disabled:opacity-50 rounded-lg border border-white/5 disabled:border-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
                    title="Next Page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Dispense & Billing Confirmation Modal */}
      {selectedPrescription && modalDetails && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#13141b] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative shadow-emerald-500/5 transition-all">
            
            {/* Header banner */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-emerald-950/20 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-emerald-500/10 border border-emerald-500/20 text-[#1abc9c] rounded-xl flex items-center justify-center">
                  <Receipt size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">Dispensing Verification</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Validate inventory allocations, calculate clinical charges and billing invoice</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPrescription(null)}
                className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Info Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                <div>
                  <span className="text-gray-500 text-xs uppercase font-bold tracking-wider block">Patient</span>
                  <span className="text-white font-bold text-sm block mt-1">{selectedPrescription.patient?.name}</span>
                  {selectedPrescription.patient?.uhid && (
                    <span className="text-gray-400 text-xs font-mono">{selectedPrescription.patient.uhid}</span>
                  )}
                </div>
                <div>
                  <span className="text-gray-500 text-xs uppercase font-bold tracking-wider block">Attending Doctor</span>
                  <span className="text-white font-semibold text-sm block mt-1">{selectedPrescription.doctor?.name || "Dr. MedixPro Staff"}</span>
                  <span className="text-gray-500 text-xs block">Consultation Lead</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs uppercase font-bold tracking-wider block">Flow & Date</span>
                  <span className="text-white font-semibold text-sm block mt-1">
                    {selectedPrescription.prescriptionType === "IPD" ? "IPD Ward Supply" : "OPD Dispensation"}
                  </span>
                  <span className="text-gray-400 text-xs block mt-0.5">
                    {new Date(selectedPrescription.prescriptionDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Diagnosis and Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#181920]/50 p-4 rounded-xl border border-white/5">
                  <span className="text-[#1abc9c] font-bold text-xs uppercase tracking-wider block">Clinical Diagnosis</span>
                  <p className="text-gray-300 text-sm mt-1.5 italic">"{selectedPrescription.diagnosis || "General Consult Details"}"</p>
                </div>
                <div className="bg-[#181920]/50 p-4 rounded-xl border border-white/5">
                  <span className="text-amber-400 font-bold text-xs uppercase tracking-wider block">Pharmacist Notes / Directives</span>
                  <p className="text-gray-300 text-sm mt-1.5">
                    {selectedPrescription.notesForPharmacist ? `"${selectedPrescription.notesForPharmacist}"` : "No special notes recorded."}
                  </p>
                </div>
              </div>

              {/* Pharmacy Calculations Table */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <Pill size={16} className="text-[#1abc9c]" /> Medications Verification Checklist
                </h4>
                <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.01]">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/5 text-gray-400 font-bold">
                        <th className="py-3 px-4">Medication Name</th>
                        <th className="py-3 px-4 text-center">Required Qty</th>
                        <th className="py-3 px-4 text-center">Stock Available</th>
                        <th className="py-3 px-4 text-right">Unit Price</th>
                        <th className="py-3 px-4 text-right">Tax Rate</th>
                        <th className="py-3 px-4 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {modalDetails.items.map((item, idx) => (
                        <tr key={idx} className={item.isOutOfStock || item.isUnregistered ? "bg-red-500/5" : ""}>
                          <td className="py-3.5 px-4 font-semibold text-white">
                            {item.name}
                            <span className="text-[10px] text-gray-400 block italic font-normal mt-0.5">{item.instructions}</span>
                          </td>
                          <td className="py-3.5 px-4 text-center text-white font-bold">{item.qty}</td>
                          <td className="py-3.5 px-4 text-center">
                            {item.isUnregistered ? (
                              <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded font-semibold text-[10px]">
                                Unregistered
                              </span>
                            ) : item.isOutOfStock ? (
                              <span className="px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded font-semibold text-[10px]" title={`Shortfall: ${item.qty - item.availableStock}`}>
                                Insufficient ({item.availableStock})
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-semibold text-[10px]">
                                Safe ({item.availableStock})
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right text-gray-300">₹{item.price.toFixed(2)}</td>
                          <td className="py-3.5 px-4 text-right text-gray-400">{item.taxRate}%</td>
                          <td className="py-3.5 px-4 text-right text-[#1abc9c] font-bold">₹{item.lineTotal.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Warning Alert if stock error */}
              {(modalDetails.hasStockError || modalDetails.missingMedicine) && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
                  <AlertTriangle className="flex-shrink-0 text-red-500" size={24} />
                  <div>
                    <span className="font-bold text-sm block">Dispensing Lockout Activated</span>
                    <span className="text-xs text-gray-300 mt-0.5 block">
                      Cannot complete checkout because one or more medications are unregistered in inventory or currently out of stock. Please approve a supplier refill request or adjust inventory counts first.
                    </span>
                  </div>
                </div>
              )}

              {/* Pricing Summary */}
              <div className="flex flex-col md:flex-row items-start justify-between gap-6 pt-4 border-t border-white/5">
                <div className="text-xs text-gray-400 space-y-1 w-full md:max-w-md">
                  <p className="font-bold text-gray-300">Dispensation & Billing Note:</p>
                  <p>Proceeding auto-deducts exact stock counts from active registers and logs a <span className="text-emerald-400">Paid Pharmacy Invoice</span> linked to the patient's ID. All operations are audited dynamically in standard queue history.</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/5 w-full md:w-64 space-y-2.5">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Taxable Subtotal:</span>
                    <span>₹{modalDetails.totalSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 pb-2 border-b border-white/5">
                    <span>Estimated Tax Amount:</span>
                    <span>₹{modalDetails.totalTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold pt-1">
                    <span className="text-white">Net Bill Payable:</span>
                    <span className="text-[#1abc9c] text-lg font-mono font-extrabold">₹{modalDetails.totalBillAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setSelectedPrescription(null)}
                className="btn-secondary py-2.5 px-6 rounded-xl font-bold text-sm"
              >
                Close
              </button>
              <button
                onClick={() => handleDispense(selectedPrescription)}
                disabled={dispenseLoading || modalDetails.hasStockError || modalDetails.missingMedicine}
                className="btn-primary py-2.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {dispenseLoading ? (
                  <>
                    <Loader size={16} className="animate-spin text-white" />
                    Dispensing Order...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    Dispense & Complete Bill
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

