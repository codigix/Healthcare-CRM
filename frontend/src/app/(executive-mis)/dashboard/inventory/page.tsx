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
   Search,
   Droplet,
   Users
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
   Area,
   PieChart,
   Pie,
   Cell,
   Legend
} from "recharts";
import { bloodBankAPI } from "@/lib/api";
import DataTable, { Column } from "@/components/ui/DataTable";

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

const bloodStockData = [
   { name: "A+", value: 24, fill: "#ef4444" },
   { name: "B+", value: 18, fill: "#f87171" },
   { name: "O+", value: 35, fill: "#b91c1c" },
   { name: "AB+", value: 8, fill: "#fca5a5" },
   { name: "A-", value: 6, fill: "#ea580c" },
   { name: "O-", value: 12, fill: "#dc2626" }
];

export default function InventoryDashboard() {
   const [loading, setLoading] = useState(true);
   const [loadingIssues, setLoadingIssues] = useState(true);
   const [bloodIssues, setBloodIssues] = useState<any[]>([]);

   useEffect(() => {
      const fetchIssues = async () => {
         try {
            setLoadingIssues(true);
            const res = await bloodBankAPI.getIssues();
            if (res.data && res.data.success) {
               setBloodIssues(res.data.data || []);
            }
         } catch (e) {
            console.error("Failed to fetch blood issues for inventory dashboard", e);
         } finally {
            setLoadingIssues(false);
         }
      };
      fetchIssues();
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
   }, []);

   const columns_1: Column<any>[] = [
      { header: "Issue ID", accessor: "issueId" },
      { header: "Recipient", accessor: "recipient" },
      {
         header: "Blood Type", accessor: (issue) => (<>\n<span className={`px-2 py-0.5 rounded text-xs font-semibold ${issue.bloodType.includes("+") ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}>
            {issue.bloodType} ({issue.units} Unit{issue.units > 1 ? "s" : ""})
         </span>\n</>)
      },
      { header: "Doctor", accessor: "requestingDoctor" },
      { header: "Dept", accessor: "department" },
      {
         header: "Status", accessor: (issue) => (<>\n<span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${issue.status === "Approved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
            issue.status === "Pending" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
               "bg-blue-500/10 text-blue-400 border border-blue-500/20"
            }`}>
            {issue.status}
         </span>\n</>)
      },
      {
         header: "Actions", accessor: (issue) => (<>\n{issue.status === "Pending" ? (
            <button
               onClick={async () => {
                  if (confirm(`Fulfill blood request ${issue.issueId}?`)) {
                     try {
                        const res = await bloodBankAPI.updateIssue(issue.id, { status: "Completed" });
                        if (res.data && res.data.success) {
                           alert("Request fulfilled successfully!");
                           const updated = await bloodBankAPI.getIssues();
                           if (updated.data && updated.data.success) {
                              setBloodIssues(updated.data.data || []);
                           }
                        } else {
                           alert("Error: " + (res.data.error || "Failed to fulfill"));
                        }
                     } catch (e) {
                        console.error(e);
                        alert("Error fulfilling request");
                     }
                  }
               }}
               className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs font-semibold transition-colors"
            >
               Fulfill
            </button>
         ) : (
            <span className="text-gray-500 text-xs italic">Fulfilled</span>
         )}\n</>)
      },
   ];


   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center my-3 my-3">
            <div>
               <h1 className="text-3xl  mb-2">Inventory Dashboard</h1>
               <p className="text-gray-400">Manage hospital equipment, consumables, blood bank inventory, and supplier logs.</p>
            </div>
            <div className="flex gap-2">
               <Link href="/blood-bank/add-unit" className="btn-secondary flex items-center gap-1.5 text-sm border-red-500/20 text-red-400 hover:bg-red-500/10">
                  <Droplet size={16} /> Add Blood Unit
               </Link>
               <Link href="/blood-bank/issue" className="btn-secondary flex items-center gap-1.5 text-sm border-red-500/20 text-red-400 hover:bg-red-500/10">
                  <Droplet size={16} /> Issue Blood
               </Link>
               <Link href="/inventory/add" className="btn-primary flex items-center gap-1.5 text-sm">
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
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  <div className="card card-hover">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-gray-400 text-sm mb-2">Total Supplies & Assets</p>
                           <p className="text-2xl ">148 Types</p>
                           <p className="text-emerald-500 text-xs mt-2">+12 supplies registered this week</p>
                        </div>
                        <Package className="text-[#1abc9c]" size={24} />
                     </div>
                  </div>

                  <div className="card card-hover border-amber-500/20">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-gray-400 text-sm mb-2">Stock Alerts</p>
                           <p className="text-2xl  text-amber-500">14 Items</p>
                           <p className="text-amber-500 text-xs mt-2">Requires urgent reorder</p>
                        </div>
                        <AlertTriangle className="text-amber-500" size={24} />
                     </div>
                  </div>

                  <div className="card card-hover">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-gray-400 text-sm mb-2">Active Suppliers</p>
                           <p className="text-2xl ">24 Vendors</p>
                           <p className="text-gray-400 text-xs mt-2">3 pending deliveries</p>
                        </div>
                        <Truck className="text-blue-500" size={24} />
                     </div>
                  </div>

                  <div className="card card-hover border-red-500/20">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-gray-400 text-sm mb-2">Expiring Soon</p>
                           <p className="text-2xl  text-red-500">6 Batches</p>
                           <p className="text-red-400 text-xs mt-2">Expiry within 30 days</p>
                        </div>
                        <CalendarRange className="text-red-500" size={24} />
                     </div>
                  </div>

                  <div className="card card-hover border-red-500/20">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-gray-400 text-sm mb-2">Blood Inventory</p>
                           <p className="text-2xl  text-red-500">103 Units</p>
                           <p className="text-red-400 text-xs mt-2">All groups screened</p>
                        </div>
                        <Droplet className="text-red-500" size={24} />
                     </div>
                  </div>

                  <div className="card card-hover">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-gray-400 text-sm mb-2">Blood Donors</p>
                           <p className="text-2xl ">42 Donors</p>
                           <p className="text-emerald-500 text-xs mt-2">5 new donors today</p>
                        </div>
                        <Users className="text-[#1abc9c]" size={24} />
                     </div>
                  </div>
               </div>

               {/* Charts Grid */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
               </div>

               {/* Low Stock Alerts & Deliveries Table */}
               <div className="card">
                  <div className="flex justify-between items-center my-3 my-3 mb-4">
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
                              <td className="py-3 px-4 font-semibold text-white">Surgical Masks (Box)</td>
                              <td className="py-3 px-4">Consumables</td>
                              <td className="py-3 px-4 text-red-500 ">12 boxes</td>
                              <td className="py-3 px-4 text-gray-400">40 boxes</td>
                              <td className="py-3 px-4"><span className="status-badge status-pending">Low Stock</span></td>
                           </tr>
                           <tr className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                              <td className="py-3 px-4 font-semibold text-white">Sterile Gloves (Medium)</td>
                              <td className="py-3 px-4">Medical Supplies</td>
                              <td className="py-3 px-4 text-red-500 ">8 boxes</td>
                              <td className="py-3 px-4 text-gray-400">50 boxes</td>
                              <td className="py-3 px-4"><span className="status-badge status-pending">Critically Low</span></td>
                           </tr>
                           <tr className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                              <td className="py-3 px-4 font-semibold text-white">Oxygen Cylinders (10L)</td>
                              <td className="py-3 px-4">Equipment</td>
                              <td className="py-3 px-4 text-amber-500 ">15 units</td>
                              <td className="py-3 px-4 text-gray-400">30 units</td>
                              <td className="py-3 px-4"><span className="status-badge status-pending">Reorder Triggered</span></td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>

               {/* Blood Issue Requests Table */}
               <div className="card">
                  <div className="flex justify-between items-center my-3 my-3 mb-4">
                     <h2 className="text-lg font-semibold">Blood Bank Issue & Transfusion Requests</h2>
                     <Link href="/blood-bank/issued" className="text-red-400 hover:underline text-sm flex items-center gap-1">
                        <Droplet size={14} className="text-red-500" /> View Blood Issuances
                     </Link>
                  </div>
                  <div className="overflow-x-auto">
                     <DataTable columns={columns_1} data={bloodIssues.slice(0, 5)} enableLocalSearch enableLocalPagination />
                  </div>
               </div>
            </>
         )}
      </div>
   );
}
