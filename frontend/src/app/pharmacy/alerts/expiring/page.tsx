"use client";

import { useState, useEffect } from "react";
import { medicineAPI } from "@/lib/api";
import { Pill, ArrowLeft, RefreshCw, Loader, Calendar, ShieldAlert, AlertTriangle, AlertCircle, CheckCircle, Trash2 } from "lucide-react";
import Link from "next/link";

interface ExpiringDrug {
  id: string;
  name: string;
  genericName: string;
  category: string;
  initialQuantity: number;
  expiryDate: string | null;
  supplier: string;
  status: string;
}

export default function ExpiringMedicinesPage() {
  const [items, setItems] = useState<ExpiringDrug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [disposalConfirm, setDisposalConfirm] = useState<{
    show: boolean;
    item: ExpiringDrug | null;
  }>({ show: false, item: null });
  const [disposingId, setDisposingId] = useState<string | null>(null);

  const handleDispose = async (item: ExpiringDrug) => {
    try {
      setDisposingId(item.id);
      await medicineAPI.update(item.id, {
        initialQuantity: 0,
        status: "Out of Stock",
        transactionNotes: `Disposal of expired stock for medicine ${item.name}`
      });
      await fetchExpiringDrugs();
      setDisposalConfirm({ show: false, item: null });
    } catch (err) {
      console.error("Failed to dispose stock:", err);
      alert("Failed to write off expired stock. Please check backend connection.");
    } finally {
      setDisposingId(null);
    }
  };

  useEffect(() => {
    fetchExpiringDrugs();
  }, []);

  const fetchExpiringDrugs = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await medicineAPI.list(1, 100);
      const medicines = response.data.medicines || [];

      // Filter for items that have an expiryDate
      const expiringList = medicines
        .filter((m: any) => m.expiryDate !== null)
        .map((m: any) => ({
          id: m.id,
          name: m.name,
          genericName: m.genericName,
          category: m.category,
          initialQuantity: m.initialQuantity,
          expiryDate: m.expiryDate,
          supplier: m.supplier || "Direct Procurement",
          status: m.status,
        }))
        // Sort by closest expiry date
        .sort((a: any, b: any) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

      setItems(expiringList);
    } catch (err) {
      console.error("Failed to load expiring drugs:", err);
      setError("Failed to fetch expiring medicine listings");
    } finally {
      setLoading(false);
    }
  };

  const getExpiryDays = (dateStr: string) => {
    const today = new Date();
    const expiry = new Date(dateStr);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (days: number) => {
    if (days < 0) {
      return {
        label: "Expired",
        color: "bg-red-500/10 text-red-500 border border-red-500/20",
        icon: ShieldAlert,
      };
    }
    if (days <= 30) {
      return {
        label: "Critical (Expiring Soon)",
        color: "bg-orange-500/10 text-orange-500 border border-orange-500/20",
        icon: AlertCircle,
      };
    }
    if (days <= 90) {
      return {
        label: "Warning (Within 90 Days)",
        color: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
        icon: AlertTriangle,
      };
    }
    return {
      label: "Safe (> 90 Days)",
      color: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
      icon: CheckCircle,
    };
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
            <h1 className="text-3xl font-bold">Expiring Medicines</h1>
            <p className="text-gray-400">Track medication expiry dates, quarantine expired lots, and audit shelf lives</p>
          </div>
        </div>
        <button
          onClick={fetchExpiringDrugs}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw size={18} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin text-emerald-500" size={32} />
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="card text-center py-16">
          <Calendar className="mx-auto text-gray-500 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">No Expiry Alert Schedules Found</h3>
          <p className="text-gray-400 max-w-sm mx-auto">
            All clinical medications in the pharmacy catalog have safe and valid expiration dates.
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
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Expiry Date</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium text-sm">Days Left</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Expiry Status</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const daysLeft = getExpiryDays(item.expiryDate!);
                  const status = getExpiryStatus(daysLeft);
                  const StatusIcon = status.icon;

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors"
                    >
                      <td className="py-4 px-4 text-white font-semibold flex items-center gap-2">
                        <Pill className="text-[#1abc9c]" size={16} />
                        {item.name}
                      </td>
                      <td className="py-4 px-4 text-gray-300 italic">{item.genericName}</td>
                      <td className="py-4 px-4 text-gray-300">{item.category}</td>
                      <td className="py-4 px-4 text-center text-gray-300 font-bold">{item.initialQuantity} Units</td>
                      <td className="py-4 px-4 text-gray-300">
                        {new Date(item.expiryDate!).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-white">
                        {daysLeft < 0 ? (
                          <span className="text-red-500">Expired</span>
                        ) : (
                          `${daysLeft} Days`
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 w-fit ${status.color}`}
                        >
                          <StatusIcon size={14} />
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {daysLeft < 0 && item.initialQuantity > 0 ? (
                          <button
                            onClick={() => setDisposalConfirm({ show: true, item })}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 mx-auto"
                          >
                            <Trash2 size={13} /> Dispose Stock
                          </button>
                        ) : daysLeft < 0 ? (
                          <span className="text-gray-500 text-xs font-semibold italic">Stock Cleared</span>
                        ) : (
                          <span className="text-emerald-500 text-xs font-semibold">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {disposalConfirm.show && disposalConfirm.item && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a202c] border border-dark-tertiary rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h2 className="text-lg font-bold mb-2 text-white flex items-center gap-2">
              <Trash2 className="text-red-500" size={20} />
              Dispose Expired Medicine
            </h2>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed font-sans">
              Are you sure you want to write off the entire stock (<strong>{disposalConfirm.item.initialQuantity} Units</strong>) of <strong>{disposalConfirm.item.name}</strong>? This action will set the active stock to 0 and record a disposal transaction.
            </p>
            <div className="flex gap-3 justify-end text-xs font-sans">
              <button
                onClick={() => setDisposalConfirm({ show: false, item: null })}
                disabled={disposingId !== null}
                className="px-4 py-2 bg-dark-tertiary text-white rounded-lg hover:bg-dark-tertiary/70 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => disposalConfirm.item && handleDispose(disposalConfirm.item)}
                disabled={disposingId !== null}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow shadow-red-600/25"
              >
                {disposingId !== null ? (
                  <>
                    <Loader className="animate-spin" size={13} />
                    Disposing...
                  </>
                ) : (
                  "Confirm Disposal"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
