"use client";

import { useState, useEffect } from "react";
import { 
  Package, 
  AlertTriangle, 
  Truck, 
  CalendarRange, 
  TrendingUp, 
  Plus, 
  RefreshCw,
  Search
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

const stockData = [
  { name: "Antibiotics", stock: 120, limit: 30 },
  { name: "Painkillers", stock: 240, limit: 50 },
  { name: "Vaccines", stock: 15, limit: 40 },
  { name: "Cardiology", stock: 85, limit: 20 },
  { name: "Pediatric", stock: 45, limit: 25 },
  { name: "Anesthetics", stock: 8, limit: 10 }
];

const activityData = [
  { month: "Jan", orders: 24 },
  { month: "Feb", orders: 35 },
  { month: "Mar", orders: 48 },
  { month: "Apr", orders: 39 },
  { month: "May", orders: 55 }
];

export default function InventoryDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Inventory Dashboard</h1>
          <p className="text-gray-400">Manage pharmacy stock, supplies, and supplier logs.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/pharmacy/add-medicine" className="btn-primary flex items-center gap-1.5 text-sm">
            <Plus size={16} /> Add Medicine
          </Link>
          <Link href="/inventory/add" className="btn-secondary flex items-center gap-1.5 text-sm">
            <Plus size={16} /> Add Item
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Loading Inventory Systems...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card card-hover">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Total Medicines</p>
                  <p className="text-2xl font-bold">148 Types</p>
                  <p className="text-emerald-500 text-xs mt-2">+12 added this week</p>
                </div>
                <Package className="text-[#1abc9c]" size={24} />
              </div>
            </div>

            <div className="card card-hover border-amber-500/20">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Stock Alerts</p>
                  <p className="text-2xl font-bold text-amber-500">14 Items</p>
                  <p className="text-amber-500 text-xs mt-2">Requires urgent reorder</p>
                </div>
                <AlertTriangle className="text-amber-500" size={24} />
              </div>
            </div>

            <div className="card card-hover">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Active Suppliers</p>
                  <p className="text-2xl font-bold">24 Vendors</p>
                  <p className="text-gray-400 text-xs mt-2">3 pending deliveries</p>
                </div>
                <Truck className="text-blue-500" size={24} />
              </div>
            </div>

            <div className="card card-hover border-red-500/20">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Expiring Soon</p>
                  <p className="text-2xl font-bold text-red-500">6 Batches</p>
                  <p className="text-red-400 text-xs mt-2">Expiry within 30 days</p>
                </div>
                <CalendarRange className="text-red-500" size={24} />
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Stock Levels vs Reorder Limits</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stockData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: "#1e1f27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                  <Bar dataKey="stock" fill="#1abc9c" name="In Stock" />
                  <Bar dataKey="limit" fill="#f15c6c" name="Min Limit" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Supplier Orders Dispatch Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: "#1e1f27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="orders" stroke="#3b82f6" fill="rgba(59, 130, 246, 0.1)" strokeWidth={2} name="Orders Procured" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Low Stock Alerts & Deliveries Table */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Urgent Low Stock Restock Alerts</h2>
              <Link href="/inventory/alerts" className="text-[#1abc9c] hover:underline text-sm">
                View All Alerts
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-tertiary">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Item Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Category</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Current Stock</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Safety Level</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">Paracetamol Syrup</td>
                    <td className="py-3 px-4">Pediatric Care</td>
                    <td className="py-3 px-4 text-red-500 font-bold">12 bottles</td>
                    <td className="py-3 px-4 text-gray-400">40 bottles</td>
                    <td className="py-3 px-4"><span className="status-badge status-pending">Low Stock</span></td>
                  </tr>
                  <tr className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">Amoxicillin Capsule</td>
                    <td className="py-3 px-4">Antibiotics</td>
                    <td className="py-3 px-4 text-red-500 font-bold">8 strips</td>
                    <td className="py-3 px-4 text-gray-400">50 strips</td>
                    <td className="py-3 px-4"><span className="status-badge status-pending">Critically Low</span></td>
                  </tr>
                  <tr className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">Hepatitis B Vaccine</td>
                    <td className="py-3 px-4">Immunization</td>
                    <td className="py-3 px-4 text-amber-500 font-bold">15 vials</td>
                    <td className="py-3 px-4 text-gray-400">30 vials</td>
                    <td className="py-3 px-4"><span className="status-badge status-pending">Reorder Triggered</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
