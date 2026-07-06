"use client";

import { useState, useEffect } from "react";
import { inventoryAPI } from "@/lib/api";
import { ArrowLeft, RefreshCw, Loader, TrendingUp, DollarSign, PackageOpen, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const COLORS = ["#1abc9c", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function InventoryReportsPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [totalValuation, setTotalValuation] = useState(0);
    const [totalSupplies, setTotalSupplies] = useState(0);
    const [categoryData, setCategoryData] = useState<any[]>([]);

    useEffect(() => {
        fetchReportDetails();
    }, []);

    const fetchReportDetails = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await inventoryAPI.list(1, 100);
            const medicines = response.data.items || [];

            // Calculate totals
            let totalVal = 0;
            let totalQty = 0;
            const categories: { [key: string]: { qty: number; value: number } } = {};

            medicines.forEach((m: any) => {
                const qty = m.initialQuantity || 0;
                const price = parseFloat(m.purchasePrice) || 0;
                const val = qty * price;

                totalVal += val;
                totalQty += qty;

                const catName = m.category || "Consumables";
                if (!categories[catName]) {
                    categories[catName] = { qty: 0, value: 0 };
                }
                categories[catName].qty += qty;
                categories[catName].value += val;
            });

            const formattedCategories = Object.keys(categories).map((name) => ({
                name,
                value: Math.round(categories[name].value),
                quantity: categories[name].qty,
            }));

            setTotalValuation(totalVal);
            setTotalSupplies(totalQty);
            setCategoryData(formattedCategories);
        } catch (err) {
            console.error("Failed to load reports:", err);
            setError("Failed to fetch report data");
        } finally {
            setLoading(false);
        }
    };

    const burnRateData = [
        { month: "Jan", Burn: 1200, Procured: 2500 },
        { month: "Feb", Burn: 1800, Procured: 1500 },
        { month: "Mar", Burn: 2400, Procured: 3000 },
        { month: "Apr", Burn: 1900, Procured: 2200 },
        { month: "May", Burn: 2800, Procured: 3500 },
    ];

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
                        <h1 className="text-3xl ">Inventory Reports</h1>
                        <p className="text-gray-400">Financial audits, operational burn rates, and supply valuations</p>
                    </div>
                </div>
                <button
                    onClick={fetchReportDetails}
                    className="btn-secondary flex items-center gap-2"
                >
                    <RefreshCw size={15} /> Refresh Reports
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
            ) : (
                <>
                    {/* Key Summary metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card border-l-4 border-[#1abc9c] hover:translate-y-[-2px] transition-transform">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-gray-500 block text-sm">Total Asset Valuation</span>
                                    <h3 className="text-3xl  text-white mt-1">₹{totalValuation.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</h3>
                                    <span className="text-emerald-500 text-xs mt-1 block">Purchase cost valuation</span>
                                </div>
                                <DollarSign className="text-[#1abc9c]" size={28} />
                            </div>
                        </div>

                        <div className="card border-l-4 border-blue-500 hover:translate-y-[-2px] transition-transform">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-gray-500 block text-sm">Total Supply Count</span>
                                    <h3 className="text-3xl  text-white mt-1">{totalSupplies.toLocaleString()} Units</h3>
                                    <span className="text-blue-500 text-xs mt-1 block">In stock clinical supplies</span>
                                </div>
                                <PackageOpen className="text-blue-500" size={28} />
                            </div>
                        </div>

                        <div className="card border-l-4 border-amber-500 hover:translate-y-[-2px] transition-transform">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-gray-500 block text-sm">Active Procurement Suppliers</span>
                                    <h3 className="text-3xl  text-white mt-1">12 Approved</h3>
                                    <span className="text-amber-500 text-xs mt-1 block">Verified hospital vendors</span>
                                </div>
                                <TrendingUp className="text-amber-500" size={28} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Pie Chart: Valuation breakdown */}
                        <div className="card flex flex-col justify-between">
                            <h3 className="text-lg  text-white mb-4">Valuation by Category</h3>
                            {categoryData.length === 0 ? (
                                <div className="text-center py-16 text-gray-500">No category breakdown data available</div>
                            ) : (
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="w-[200px] h-[200px] flex-shrink-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={categoryData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {categoryData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(val: number) => `₹${val.toLocaleString()}`} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="space-y-2 flex-1 w-full">
                                        {categoryData.map((item, index) => (
                                            <div key={item.name} className="flex justify-between items-center my-3 my-3 text-sm py-1 border-b border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                                    <span className="text-gray-300 font-medium">{item.name}</span>
                                                </div>
                                                <span className="text-white ">₹{item.value.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bar Chart: Burn vs Procured */}
                        <div className="card">
                            <h3 className="text-lg  text-white mb-4">Supply Burn Rate vs Procurement (Units)</h3>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={burnRateData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                                        <YAxis stroke="rgba(255,255,255,0.5)" />
                                        <Tooltip contentStyle={{ backgroundColor: "#1e1f27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                                        <Legend />
                                        <Bar dataKey="Burn" fill="#ef4444" name="Consumables Burnt" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="Procured" fill="#1abc9c" name="Supplies Procured" radius={[4, 4, 0, 0]} />
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
