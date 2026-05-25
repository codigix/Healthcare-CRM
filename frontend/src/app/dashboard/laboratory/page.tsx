"use client";

import { useState, useEffect } from "react";
import { 
  FlaskConical, 
  Droplet, 
  Activity, 
  Users, 
  Plus, 
  CheckCircle,
  FileText,
  ClipboardList
} from "lucide-react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const bloodStockData = [
  { name: "A+", value: 24, fill: "#ef4444" },
  { name: "B+", value: 18, fill: "#f87171" },
  { name: "O+", value: 35, fill: "#b91c1c" },
  { name: "AB+", value: 8, fill: "#fca5a5" },
  { name: "A-", value: 6, fill: "#ea580c" },
  { name: "O-", value: 12, fill: "#dc2626" }
];

const testVolumeData = [
  { day: "Mon", tests: 45 },
  { day: "Tue", tests: 58 },
  { day: "Wed", tests: 64 },
  { day: "Thu", tests: 52 },
  { day: "Fri", tests: 70 },
  { day: "Sat", tests: 30 }
];

export default function LaboratoryDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Laboratory Dashboard</h1>
          <p className="text-gray-400">Diagnostic screenings, test reports, and blood bank coordination.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/blood-bank/add-unit" className="btn-primary flex items-center gap-1.5 text-sm">
            <Plus size={16} /> Add Blood Unit
          </Link>
          <Link href="/blood-bank/issue" className="btn-secondary flex items-center gap-1.5 text-sm">
            <Plus size={16} /> Issue Blood
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Booting Diagnostics Systems...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card card-hover">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Tests Handled</p>
                  <p className="text-2xl font-bold">319 Tests</p>
                  <p className="text-emerald-500 text-xs mt-2">+34% this month</p>
                </div>
                <FlaskConical className="text-purple-500" size={24} />
              </div>
            </div>

            <div className="card card-hover border-red-500/20">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Blood Inventory</p>
                  <p className="text-2xl font-bold text-red-500">103 Units</p>
                  <p className="text-red-400 text-xs mt-2">All groups screened</p>
                </div>
                <Droplet className="text-red-500" size={24} />
              </div>
            </div>

            <div className="card card-hover">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Pending Reports</p>
                  <p className="text-2xl font-bold text-amber-500">18 Samples</p>
                  <p className="text-amber-500 text-xs mt-2">Urgent diagnosis required</p>
                </div>
                <ClipboardList className="text-amber-500" size={24} />
              </div>
            </div>

            <div className="card card-hover">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Blood Donors</p>
                  <p className="text-2xl font-bold">42 Donors</p>
                  <p className="text-emerald-500 text-xs mt-2">5 new donors today</p>
                </div>
                <Users className="text-[#1abc9c]" size={24} />
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Blood Stock Availability (by Type)</h2>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bloodStockData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {bloodStockData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#1e1f27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Daily Diagnostic Test Volume</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={testVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: "#1e1f27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                  <Bar dataKey="tests" fill="#8b5cf6" name="Tests Processed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Diagnostics Lab Queue Table */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Active Lab Screening Queue</h2>
              <span className="text-xs bg-purple-500/10 text-purple-400 py-1 px-3.5 rounded-full border border-purple-500/20">
                18 Pending Tests
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-tertiary">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Sample ID</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Patient Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Test Type</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Ordering Doctor</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Priority</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-gray-400">#SMP-9901</td>
                    <td className="py-3 px-4 font-semibold text-white">Henry Cavill</td>
                    <td className="py-3 px-4 text-purple-400">Complete Blood Count (CBC)</td>
                    <td className="py-3 px-4 text-gray-400">Dr. Sarah Jenkins</td>
                    <td className="py-3 px-4"><span className="text-red-500 font-bold text-xs bg-red-500/10 py-1 px-2.5 rounded-full border border-red-500/20">HIGH</span></td>
                    <td className="py-3 px-4"><span className="status-badge status-pending">Processing</span></td>
                  </tr>
                  <tr className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-gray-400">#SMP-9902</td>
                    <td className="py-3 px-4 font-semibold text-white">Diana Prince</td>
                    <td className="py-3 px-4 text-purple-400">Lipid Profile & Glucose</td>
                    <td className="py-3 px-4 text-gray-400">Dr. Sarah Jenkins</td>
                    <td className="py-3 px-4"><span className="text-gray-400 text-xs bg-gray-500/10 py-1 px-2.5 rounded-full border border-white/5">Medium</span></td>
                    <td className="py-3 px-4"><span className="status-badge status-pending">Pending Draw</span></td>
                  </tr>
                  <tr className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-gray-400">#SMP-9903</td>
                    <td className="py-3 px-4 font-semibold text-white">Bruce Wayne</td>
                    <td className="py-3 px-4 text-purple-400">Liver Function Test (LFT)</td>
                    <td className="py-3 px-4 text-gray-400">Dr. Arthur Conan</td>
                    <td className="py-3 px-4"><span className="text-red-500 font-bold text-xs bg-red-500/10 py-1 px-2.5 rounded-full border border-red-500/20">URGENT</span></td>
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
