"use client";

import { useState, useEffect } from "react";
import { 
  Pill, 
  AlertTriangle, 
  ClipboardList, 
  TrendingUp, 
  Plus, 
  Activity,
  CheckCircle2
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

const dispenseData = [
  { day: "Mon", prescriptions: 42, volume: 150 },
  { day: "Tue", prescriptions: 58, volume: 210 },
  { day: "Wed", prescriptions: 65, volume: 240 },
  { day: "Thu", prescriptions: 48, volume: 180 },
  { day: "Fri", prescriptions: 72, volume: 290 },
  { day: "Sat", prescriptions: 30, volume: 110 }
];

const categoryData = [
  { name: "Antibiotics", stock: 120, limit: 30 },
  { name: "Analgesics", stock: 240, limit: 50 },
  { name: "Vaccines", stock: 15, limit: 40 },
  { name: "Cardiology", stock: 85, limit: 20 },
  { name: "Pediatric", stock: 45, limit: 25 }
];

export default function PharmacyDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Pharmacy Dashboard</h1>
          <p className="text-gray-400">Prescription processing, pharmacy inventory, and medicine stock logs.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/pharmacy/add-medicine" className="btn-primary flex items-center gap-1.5 text-sm">
            <Plus size={16} /> Add Medicine
          </Link>
          <Link href="/prescriptions/all" className="btn-secondary flex items-center gap-1.5 text-sm">
            <ClipboardList size={16} /> Process Prescriptions
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Loading Pharmacy Systems...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card card-hover border-teal-500/20">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Total Medications</p>
                  <p className="text-2xl font-bold text-teal-400">148 Types</p>
                  <p className="text-emerald-500 text-xs mt-2">+12 added this week</p>
                </div>
                <Pill className="text-teal-400" size={24} />
              </div>
            </div>

            <div className="card card-hover border-amber-500/20">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Stock Alerts</p>
                  <p className="text-2xl font-bold text-amber-500">14 Drugs</p>
                  <p className="text-amber-500 text-xs mt-2">Requires urgent restock</p>
                </div>
                <AlertTriangle className="text-amber-500" size={24} />
              </div>
            </div>

            <div className="card card-hover border-purple-500/20">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Active Prescriptions</p>
                  <p className="text-2xl font-bold text-purple-400">18 Pending</p>
                  <p className="text-purple-400 text-xs mt-2">Awaiting dispensing</p>
                </div>
                <ClipboardList className="text-purple-400" size={24} />
              </div>
            </div>

            <div className="card card-hover border-emerald-500/20">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Dispensed Today</p>
                  <p className="text-2xl font-bold text-emerald-400">42 Orders</p>
                  <p className="text-emerald-500 text-xs mt-2">100% precision rating</p>
                </div>
                <CheckCircle2 className="text-emerald-400" size={24} />
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 text-white font-semibold">Medicine Categories Stock Limits</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
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
              <h2 className="text-lg font-semibold mb-4 text-white font-semibold">Daily Prescription Dispense Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dispenseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: "#1e1f27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="prescriptions" stroke="#3b82f6" fill="rgba(59, 130, 246, 0.1)" strokeWidth={2} name="Prescriptions Dispensed" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Prescriptions Table */}
          <div className="card bg-dark-secondary border border-dark-tertiary p-6 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Pending Prescription Dispense Queue</h2>
              <Link href="/prescriptions/all" className="text-teal-400 hover:underline text-sm font-semibold">
                View All Prescriptions
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-tertiary">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Patient Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Attending Doctor</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Medication Details</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Order Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">Henry Cavill</td>
                    <td className="py-3 px-4 text-gray-400">Dr. Arthur Conan</td>
                    <td className="py-3 px-4 text-teal-400">Amoxicillin 500mg, Paracetamol 650mg</td>
                    <td className="py-3 px-4"><span className="status-badge status-pending">Pending Dispense</span></td>
                  </tr>
                  <tr className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">Diana Prince</td>
                    <td className="py-3 px-4 text-gray-400">Dr. Arthur Conan</td>
                    <td className="py-3 px-4 text-teal-400">Atorvastatin 20mg, Metformin 500mg</td>
                    <td className="py-3 px-4"><span className="status-badge status-pending">Pending Dispense</span></td>
                  </tr>
                  <tr className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">Bruce Wayne</td>
                    <td className="py-3 px-4 text-gray-400">Dr. Arthur Conan</td>
                    <td className="py-3 px-4 text-teal-400">Ibuprofen 400mg, Multivitamins</td>
                    <td className="py-3 px-4"><span className="status-badge status-confirmed">Completed</span></td>
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
