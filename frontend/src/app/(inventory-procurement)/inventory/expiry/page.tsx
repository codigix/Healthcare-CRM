"use client";

import { useState, useEffect } from "react";
import { inventoryAPI } from "@/lib/api";
import { CalendarRange, ArrowLeft, RefreshCw, AlertTriangle, AlertCircle, CheckCircle, ShieldAlert, Loader } from "lucide-react";
import Link from "next/link";

interface ExpiryItem {
  id: string;
  name: string;
  category: string;
  initialQuantity: number;
  expiryDate: string | null;
  supplier: string;
  status: string;
}

export default function InventoryExpiryAlertsPage() {
  const [items, setItems] = useState<ExpiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchExpiringItems();
  }, []);

  const fetchExpiringItems = async () => {
    try {
      setLoading(true);
      setError("");
      // List items under the Inventory department
      const response = await inventoryAPI.list(1, 100);

      // Filter for items that have an expiryDate
      const itemsData = response.data.items || [];
      const expiringList = itemsData
        .filter((m: any) => m.expiryDate !== null)
        .map((m: any) => ({
          id: m.id,
          name: m.name,
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
      console.error("Failed to load expiring items:", err);
      setError("Failed to fetch expiring inventory items");
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
      <div className="flex justify-between items-center my-3 my-3">
        <div className="flex items-center gap-4">
          <Link
            href="/inventory"
            className="p-2 hover:bg-dark-tertiary rounded transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl ">Expiry Alerts</h1>
            <p className="text-gray-400">Monitor expiration schedules for consumables, test kits, and sterile supplies</p>
          </div>
        </div>
        <button
          onClick={fetchExpiringItems}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin text-emerald-500" size={32} />
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-2 rounded">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="card text-center py-16">
          <CalendarRange className="mx-auto text-gray-500 mb-4" size={48} />
          <h3 className="text-xl  text-white mb-2">No Expiry Schedules Found</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Great news! No inventory items currently have registered expiration dates or alerts triggered.
          </p>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-tertiary">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Item Name</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Category</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Remaining Stock</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Expiry Date</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Days Left</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Expiry Status</th>
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
                      <td className="py-4 px-4 text-white font-semibold">
                        {item.name}
                      </td>
                      <td className="py-4 px-4 text-gray-300">
                        {item.category}
                      </td>
                      <td className="py-4 px-4 text-gray-300 font-semibold">
                        {item.initialQuantity} Units
                      </td>
                      <td className="py-4 px-4 text-gray-300">
                        {new Date(item.expiryDate!).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4  text-white">
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
