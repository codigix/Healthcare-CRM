"use client";

import { useState, useEffect } from "react";
import { inventoryAPI } from "@/lib/api";
import { Package, ArrowLeft, RefreshCw, Loader, Hotel, ChevronRight, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface CategorySummary {
  name: string;
  totalItems: number;
  totalStock: number;
  lowStockCount: number;
}

export default function InventoryCategoriesPage() {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await inventoryAPI.list(1, 100);
      const items = response.data.items || [];

      // Calculate totals per category
      const map: { [key: string]: { items: number; stock: number; low: number } } = {};
      
      items.forEach((m: any) => {
        const cat = m.category || "General Supplies";
        if (!map[cat]) {
          map[cat] = { items: 0, stock: 0, low: 0 };
        }
        
        map[cat].items += 1;
        map[cat].stock += m.initialQuantity || 0;
        if ((m.initialQuantity || 0) <= (m.reorderLevel || 10)) {
          map[cat].low += 1;
        }
      });

      const formatted = Object.keys(map).map((name) => ({
        name,
        totalItems: map[name].items,
        totalStock: map[name].stock,
        lowStockCount: map[name].low,
      }));

      setCategories(formatted);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setError("Failed to fetch inventory categories");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/inventory"
            className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Inventory Categories</h1>
            <p className="text-gray-400">Classify durable clinical assets, hospital furniture, and medical consumables</p>
          </div>
        </div>
        <button
          onClick={fetchCategories}
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
      ) : categories.length === 0 ? (
        <div className="card text-center py-16">
          <Package className="mx-auto text-gray-500 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">No Active Categories</h3>
          <p className="text-gray-400 max-w-sm mx-auto">
            You currently have no operational inventory items registered. Add new items to automatically build categories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.name} className="card relative overflow-hidden flex flex-col justify-between hover:border-[#1abc9c]/30 transition-all border border-white/5">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#1abc9c]"></div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-[#1abc9c]/10 rounded-lg flex items-center justify-center text-[#1abc9c]">
                    <Package size={20} />
                  </div>
                  {cat.lowStockCount > 0 && (
                    <span className="px-2.5 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-xs font-semibold flex items-center gap-1">
                      <AlertTriangle size={12} /> {cat.lowStockCount} Low
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Hospital Inventory Segment</span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-2 border-y border-white/5 text-sm">
                  <div>
                    <span className="text-gray-500 block text-xs">Total Products</span>
                    <span className="text-white font-bold">{cat.totalItems} Items</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">Total Stock</span>
                    <span className="text-white font-bold">{cat.totalStock} Units</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <Link
                  href={`/inventory?category=${encodeURIComponent(cat.name)}`}
                  className="w-full btn-secondary text-xs py-2 flex items-center justify-center gap-1 hover:text-[#1abc9c] hover:border-[#1abc9c]/30 transition-all"
                >
                  View Items <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
