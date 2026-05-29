"use client";

import { useState, useEffect } from "react";
import { medicineAPI, prescriptionAPI } from "@/lib/api";
import { Pill, ArrowLeft, RefreshCw, Loader, TrendingUp, Heart, FileSpreadsheet, ClipboardCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from "recharts";

export default function PharmacyReportsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalDrugsCount, setTotalDrugsCount] = useState(0);
  const [totalPrescriptionsCount, setTotalPrescriptionsCount] = useState(0);
  const [dispensationVolume, setDispensationVolume] = useState(0);

  useEffect(() => {
    fetchPharmacyStats();
  }, []);

  const fetchPharmacyStats = async () => {
    try {
      setLoading(true);
      setError("");

      const [medsRes, presRes] = await Promise.all([
        medicineAPI.list(1, 100),
        prescriptionAPI.list(1, 100)
      ]);

      const meds = medsRes.data.medicines || [];
      const prescriptions = presRes.data.prescriptions || [];

      // Calculate aggregates
      let totalQty = meds.reduce((sum: number, m: any) => sum + (m.initialQuantity || 0), 0);

      setTotalDrugsCount(meds.length);
      setTotalPrescriptionsCount(prescriptions.length);
      setDispensationVolume(totalQty);
    } catch (err) {
      console.error("Failed to load reports stats:", err);
      setError("Failed to fetch reports statistics");
    } finally {
      setLoading(false);
    }
  };

  const volumeTrends = [
    { name: "Mon", Dispensed: 42, Invoices: 3000 },
    { name: "Tue", Dispensed: 58, Invoices: 4500 },
    { name: "Wed", Dispensed: 69, Invoices: 5200 },
    { name: "Thu", Dispensed: 48, Invoices: 3800 },
    { name: "Fri", Dispensed: 82, Invoices: 6800 },
    { name: "Sat", Dispensed: 55, Invoices: 4800 },
    { name: "Sun", Dispensed: 30, Invoices: 2500 }
  ];

  const topDispensedMedicines = [
    { name: "Paracetamol", count: 240 },
    { name: "Amoxicillin", count: 180 },
    { name: "Metformin", count: 120 },
    { name: "Lisinopril", count: 95 },
    { name: "Cetirizine", count: 85 }
  ];

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
            <h1 className="text-3xl font-bold">Pharmacy Reports</h1>
            <p className="text-gray-400">Audits, drug dispensation metrics, and pharmacy revenue trends</p>
          </div>
        </div>
        <button
          onClick={fetchPharmacyStats}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw size={18} /> Refresh Analytics
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
      ) : (
        <>
          {/* Key Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card border-l-4 border-teal-500 hover:translate-y-[-2px] transition-transform">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-gray-500 block text-sm">Active Medications Catalog</span>
                  <h3 className="text-3xl font-bold text-white mt-1">{totalDrugsCount} Formulations</h3>
                  <span className="text-teal-500 text-xs mt-1 block">Registered in Pharmacy</span>
                </div>
                <Pill className="text-teal-500" size={28} />
              </div>
            </div>

            <div className="card border-l-4 border-blue-500 hover:translate-y-[-2px] transition-transform">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-gray-500 block text-sm">Prescriptions Dispatched</span>
                  <h3 className="text-3xl font-bold text-white mt-1">{totalPrescriptionsCount} Prescriptions</h3>
                  <span className="text-blue-500 text-xs mt-1 block">Completed clinical orders</span>
                </div>
                <ClipboardCheck className="text-blue-500" size={28} />
              </div>
            </div>

            <div className="card border-l-4 border-purple-500 hover:translate-y-[-2px] transition-transform">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-gray-500 block text-sm">In Stock Shelf Inventory</span>
                  <h3 className="text-3xl font-bold text-white mt-1">{dispensationVolume.toLocaleString()} Units</h3>
                  <span className="text-purple-500 text-xs mt-1 block">Active medicine shelf holdings</span>
                </div>
                <Sparkles className="text-purple-500" size={28} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dispensing timelines area chart */}
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4">Invoiced Drug Revenue Trends (₹)</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={volumeTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip contentStyle={{ backgroundColor: "#1e1f27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                    <Area type="monotone" dataKey="Invoices" stroke="#1abc9c" fill="rgba(26, 188, 156, 0.1)" strokeWidth={2} name="Sales Invoiced" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Dispensed medications bar chart */}
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4">Top 5 Clinically Dispensed Medications (qty)</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topDispensedMedicines} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                    <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" />
                    <Tooltip contentStyle={{ backgroundColor: "#1e1f27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                    <Bar dataKey="count" fill="#3b82f6" name="Units Dispensed" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
