"use client";

import { useState, useEffect } from "react";
import { medicineAPI, refillAPI } from "@/lib/api";
import { Pill, ArrowLeft, RefreshCw, Loader, AlertTriangle, PackageOpen, ArrowUpRight, CheckCircle, FileText } from "lucide-react";
import Link from "next/link";
import Modal from "@/components/UI/Modal";

interface MedicineItem {
  id: string;
  name: string;
  genericName: string;
  category: string;
  initialQuantity: number;
  reorderLevel: number;
  supplier: string;
  status: string;
}

export default function LowStockMedicinesPage() {
  const [items, setItems] = useState<MedicineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Refill Modal state variables
  const [selectedItemForRefill, setSelectedItemForRefill] = useState<MedicineItem | null>(null);
  const [refillQty, setRefillQty] = useState("100");
  const [refillNotes, setRefillNotes] = useState("");
  const [submittingRefill, setSubmittingRefill] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchLowStock();
  }, []);

  const fetchLowStock = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await medicineAPI.list(1, 100);
      const medicines = response.data.medicines || [];

      // Filter for items at or below reorder levels
      const lowStockList = medicines.filter(
        (m: any) => (m.initialQuantity || 0) <= (m.reorderLevel || 10)
      );

      setItems(lowStockList);
    } catch (err) {
      console.error("Failed to load low stock:", err);
      setError("Failed to fetch low stock alert listings");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRefill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForRefill) return;

    const qty = parseInt(refillQty);
    if (isNaN(qty) || qty <= 0) {
      alert("Please specify a valid quantity.");
      return;
    }

    try {
      setSubmittingRefill(true);
      setError("");
      setSuccessMsg("");

      await refillAPI.create({
        medicineName: selectedItemForRefill.name,
        quantityRequested: qty,
        notes: refillNotes.trim() || `Automated low stock refill request for ${selectedItemForRefill.name}`
      });

      setSuccessMsg(`✓ Stock refill request submitted successfully for ${selectedItemForRefill.name}!`);
      setSelectedItemForRefill(null);
      setRefillQty("100");
      setRefillNotes("");
      fetchLowStock();
      
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err: any) {
      console.error("Failed to request stock refill:", err);
      setError("Failed to dispatch stock refill request. Please check backend connection.");
    } finally {
      setSubmittingRefill(false);
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
            <h1 className="text-3xl font-bold">Low Stock Medicines</h1>
            <p className="text-gray-400">Restock clinical drugs, trigger central inventory refills, and verify reorder levels</p>
          </div>
        </div>
        <button
          onClick={fetchLowStock}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw size={18} /> Refresh
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle size={20} className="flex-shrink-0 text-emerald-500" />
          <p className="font-semibold">{successMsg}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin text-emerald-500" size={32} />
        </div>
      ) : items.length === 0 ? (
        <div className="card text-center py-16">
          <PackageOpen className="mx-auto text-gray-500 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">Medication Stock is Safe</h3>
          <p className="text-gray-400 max-w-sm mx-auto">
            All clinical pharmacy drugs are well above safety reorder stock levels.
          </p>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-tertiary">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Medication Name</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Generic Name</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Category</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium text-sm">Current Stock</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium text-sm">Safety Level</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Supplier</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium text-sm">Restock Request</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors"
                  >
                    <td className="py-4 px-4 text-white font-semibold flex items-center gap-2">
                      <AlertTriangle className="text-red-500" size={16} />
                      {item.name}
                    </td>
                    <td className="py-4 px-4 text-gray-300 italic">{item.genericName}</td>
                    <td className="py-4 px-4 text-gray-300">{item.category}</td>
                    <td className="py-4 px-4 text-center text-red-500 font-bold">{item.initialQuantity} Units</td>
                    <td className="py-4 px-4 text-center text-gray-400">{item.reorderLevel} Units</td>
                    <td className="py-4 px-4 text-gray-300">{item.supplier || "Direct Procurement"}</td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedItemForRefill(item);
                          setRefillQty(String(item.reorderLevel * 2 || 100));
                        }}
                        className="btn-primary py-1 px-3.5 text-xs flex items-center gap-1.5 mx-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow shadow-emerald-500/10"
                      >
                        Request Central Stock <ArrowUpRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Refill Request Modal */}
      <Modal
        isOpen={!!selectedItemForRefill}
        onClose={() => setSelectedItemForRefill(null)}
        title="Inventory Stock Refill Request"
      >
        {selectedItemForRefill && (
          <form onSubmit={handleRequestRefill} className="space-y-4">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold">Medication Name</p>
              <p className="text-sm text-white font-bold mt-0.5">{selectedItemForRefill.name}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Current Pharmacy Stock</p>
                <p className="text-xs text-red-400 font-bold mt-0.5">{selectedItemForRefill.initialQuantity} Units</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Min Reorder Level</p>
                <p className="text-xs text-amber-500 font-bold mt-0.5">{selectedItemForRefill.reorderLevel} Units</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                Refill Quantity Requested <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={refillQty}
                onChange={(e) => setRefillQty(e.target.value)}
                className="input-field w-full text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                Notes for Inventory Department
              </label>
              <textarea
                value={refillNotes}
                onChange={(e) => setRefillNotes(e.target.value)}
                placeholder="Specify urgency details or reasons for the request..."
                rows={4}
                className="w-full text-xs bg-dark-tertiary border border-dark-tertiary rounded-lg p-3 outline-none text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex gap-3 justify-end pt-3 border-t border-dark-tertiary/20">
              <button
                type="button"
                onClick={() => setSelectedItemForRefill(null)}
                className="px-5 py-2 bg-dark-tertiary hover:bg-dark-tertiary/70 text-white rounded-lg transition-colors font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingRefill}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 text-white rounded-lg transition-colors font-bold text-xs flex items-center gap-1.5 shadow shadow-emerald-600/25"
              >
                {submittingRefill ? "Submitting..." : "Send Request"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
