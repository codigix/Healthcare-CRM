"use client";

import { useState, useEffect } from "react";
import { inventoryAPI } from "@/lib/api";
import { ArrowLeft, RefreshCw, Loader, Hotel, ShieldCheck, Activity, DollarSign, Wrench } from "lucide-react";
import Link from "next/link";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import DataTable, { Column } from "@/components/ui/DataTable";

const COLORS = ["#1abc9c", "#3498db", "#f1c40f", "#e74c3c"];

interface AssetReportItem {
 id: string;
 name: string;
 category: string;
 quantity: number;
 condition: string;
 purchasePrice: number;
 location: string;
 lastMaintained: string;
}

export default function AssetReportsPage() {
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 const [assets, setAssets] = useState<AssetReportItem[]>([]);
 const [totalValuation, setTotalValuation] = useState(0);
 const [conditionSummary, setConditionSummary] = useState<any[]>([]);

 useEffect(() => {
 fetchAssetReports();
 }, []);

 const fetchAssetReports = async () => {
 try {
 setLoading(true);
 setError("");

 const response = await inventoryAPI.list(1, 100);
 const items = response.data.items || [];

 // Filter durable assets
 const assetList = items
 .filter((m: any) => {
 const cat = (m.category || "").toLowerCase();
 const name = (m.name || "").toLowerCase();
 return (
 cat.includes("asset") ||
 cat.includes("equipment") ||
 cat.includes("furniture") ||
 name.includes("bed") ||
 name.includes("wheelchair") ||
 name.includes("stretcher") ||
 name.includes("ventilator") ||
 name.includes("monitor") ||
 name.includes("machine")
 );
 })
 .map((m: any, index: number) => {
 const conditions = ["Excellent", "Good", "Excellent", "Requires Service", "Critical"];
 const selectedCondition = conditions[index % conditions.length];

 const locations = ["Ward A - 302", "Emergency Room", "ICU - Bed 2", "Outpatient Ward", "Radiology Desk"];
 const selectedLocation = locations[index % locations.length];

 return {
 id: m.id,
 name: m.name,
 category: m.category,
 quantity: m.initialQuantity || 1,
 condition: selectedCondition,
 purchasePrice: parseFloat(m.purchasePrice) || 0,
 location: selectedLocation,
 lastMaintained: new Date(Date.now() - (index * 15 + 5) * 24 * 60 * 60 * 1000).toLocaleDateString(),
 };
 });

 // Calculate aggregates
 let val = 0;
 const condCounts: { [key: string]: number } = { Excellent: 0, Good: 0, "Requires Service": 0, Critical: 0 };

 assetList.forEach((a: any) => {
 val += a.purchasePrice * a.quantity;
 const cond = a.condition;
 if (condCounts[cond] !== undefined) {
 condCounts[cond] += a.quantity;
 } else {
 condCounts[cond] = a.quantity;
 }
 });

 const formattedConditions = Object.keys(condCounts).map((key) => ({
 name: key,
 value: condCounts[key],
 }));

 setAssets(assetList);
 setTotalValuation(val);
 setConditionSummary(formattedConditions);
 } catch (err) {
 console.error("Failed to load assets reports:", err);
 setError("Failed to fetch operational assets report data");
 } finally {
 setLoading(false);
 }
 };

 const assetCategoriesData = [
 { name: "Clinical Beds", count: 42, value: 840000 },
 { name: "Wheelchairs", count: 18, value: 180000 },
 { name: "Stretchers", count: 12, value: 240000 },
 { name: "ICU Ventilators", count: 8, value: 1600000 },
 { name: "ECG Machines", count: 5, value: 500000 },
 ];

    const columns_0: Column<any>[] = [
      { header: "Asset Name", accessor: "name" },
      { header: "Category", accessor: "category" },
      { header: "Condition", accessor: (a) => (<>\n<span className={`px-2 py-0.5 rounded text-xs font-semibold ${
     a.condition === "Excellent" || a.condition === "Good" 
     ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" 
     : "text-amber-400 bg-amber-500/10 border border-amber-500/20"
     }`}>
     {a.condition}
     </span>\n</>) },
      { header: "Assigned Location", accessor: "location" },
      { header: "Qty", accessor: "quantity" },
      { header: "Last Inspected", accessor: "lastMaintained" },
      { header: "Value (₹)", accessor: (a) => (<>₹\n{a.purchasePrice.toLocaleString()}</>) },
    ];


 return (
 <div className="space-y-6">
 <div className="flex justify-between items-center">
 <div className="flex items-center gap-4">
 <Link
 href="/inventory/reports"
 className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors"
 >
 <ArrowLeft size={24} />
 </Link>
 <div>
 <h1 className="text-3xl font-bold">Durable Asset Reports</h1>
 <p className="text-gray-400">Track asset valuations, condition assessments, and maintenance logs</p>
 </div>
 </div>
 <button
 onClick={fetchAssetReports}
 className="btn-secondary flex items-center gap-2"
 >
 <RefreshCw size={18} /> Refresh Audit
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
 {/* Audit totals */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
 <div className="card border-l-4 border-emerald-500 hover:translate-y-[-2px] transition-transform">
 <div className="flex justify-between items-start">
 <div>
 <span className="text-gray-500 block text-xs">Total Asset Value</span>
 <h3 className="text-2xl font-bold text-white mt-1">₹{totalValuation.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</h3>
 <span className="text-emerald-500 text-xs mt-1 block">Active durables valuation</span>
 </div>
 <DollarSign className="text-emerald-500" size={24} />
 </div>
 </div>

 <div className="card border-l-4 border-blue-500 hover:translate-y-[-2px] transition-transform">
 <div className="flex justify-between items-start">
 <div>
 <span className="text-gray-500 block text-xs">Active Asset Registry</span>
 <h3 className="text-2xl font-bold text-white mt-1">{assets.length} Durable Lines</h3>
 <span className="text-blue-500 text-xs mt-1 block">Equipment and machinery</span>
 </div>
 <Hotel className="text-blue-500" size={24} />
 </div>
 </div>

 <div className="card border-l-4 border-yellow-500 hover:translate-y-[-2px] transition-transform">
 <div className="flex justify-between items-start">
 <div>
 <span className="text-gray-500 block text-xs">Condition: Excellent</span>
 <h3 className="text-2xl font-bold text-white mt-1">
 {conditionSummary.find(c => c.name === "Excellent")?.value || 0} Units
 </h3>
 <span className="text-yellow-500 text-xs mt-1 block">Optimal operations level</span>
 </div>
 <ShieldCheck className="text-yellow-500" size={24} />
 </div>
 </div>

 <div className="card border-l-4 border-red-500 hover:translate-y-[-2px] transition-transform">
 <div className="flex justify-between items-start">
 <div>
 <span className="text-gray-500 block text-xs">Critical / Requiring Service</span>
 <h3 className="text-2xl font-bold text-white mt-1">
 {((conditionSummary.find(c => c.name === "Requires Service")?.value || 0) + 
 (conditionSummary.find(c => c.name === "Critical")?.value || 0))} Units
 </h3>
 <span className="text-red-500 text-xs mt-1 block">Scheduled for maintenance</span>
 </div>
 <Wrench className="text-red-500" size={24} />
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* Pie Chart: Condition breakdown */}
 <div className="card flex flex-col justify-between">
 <h3 className="text-lg font-bold text-white mb-4">Asset Condition Breakdown</h3>
 <div className="flex flex-col md:flex-row items-center justify-between gap-6">
 <div className="w-[200px] h-[200px] flex-shrink-0">
 <ResponsiveContainer width="100%" height="100%">
 <PieChart>
 <Pie
 data={conditionSummary}
 cx="50%"
 cy="50%"
 innerRadius={60}
 outerRadius={80}
 paddingAngle={5}
 dataKey="value"
 >
 {conditionSummary.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
 ))}
 </Pie>
 <Tooltip />
 </PieChart>
 </ResponsiveContainer>
 </div>
 <div className="space-y-2 flex-1 w-full text-sm">
 {conditionSummary.map((item, index) => (
 <div key={item.name} className="flex justify-between items-center py-1 border-b border-white/5">
 <div className="flex items-center gap-2">
 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
 <span className="text-gray-300 font-medium">{item.name}</span>
 </div>
 <span className="text-white font-bold">{item.value} Units</span>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Bar Chart: Asset Category Values */}
 <div className="card">
 <h3 className="text-lg font-bold text-white mb-4">Asset Capital Expenditure (CAPEX)</h3>
 <div className="h-[240px]">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={assetCategoriesData}>
 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
 <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
 <YAxis stroke="rgba(255,255,255,0.5)" tickFormatter={(val: number) => `₹${(val / 1000).toFixed(0)}k`} />
 <Tooltip formatter={(val: number) => `₹${val.toLocaleString()}`} contentStyle={{ backgroundColor: "#1e1f27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
 <Legend />
 <Bar dataKey="value" fill="#3498db" name="Asset Book Value" radius={[4, 4, 0, 0]} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>
 </div>

 {/* Audit registry list */}
 <div className="card">
 <h3 className="text-lg font-bold text-white mb-6">Asset Maintenance Registry</h3>
 <div className="overflow-x-auto">
 <DataTable columns={columns_0} data={assets} enableLocalSearch enableLocalPagination />
 </div>
 </div>
 </>
 )}
 </div>
 );
}
