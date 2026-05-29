"use client";

import { useState, useEffect } from "react";
import { medicineAPI } from "@/lib/api";
import { Pill, ArrowLeft, RefreshCw, Loader, AlertTriangle, PackageOpen, ArrowUpRight } from "lucide-react";
import Link from "next/link";

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
            <p className="text-gray-400">Restock clinical drugs, trigger vendor procurement, and verify reorder levels</p>
          </div>
        </div>
        <button
          onClick={fetchLowStock}
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
                  <th className="text-center py-4 px-4 text-gray-400 font-medium text-sm">Restock</th>
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
                        onClick={() => window.alert(`Triggered restock query for ${item.name} to ${item.supplier || 'supplier'}`)}
                        className="btn-secondary py-1 px-3 text-xs flex items-center gap-1 mx-auto hover:text-[#1abc9c] hover:border-[#1abc9c]/30"
                      >
                        Order <ArrowUpRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
