"use client";

import { useState, useEffect } from "react";
import { inventoryAPI } from "@/lib/api";
import { ArrowLeft, RefreshCw, Loader, Hotel, Settings, UserCheck, AlertTriangle, ShieldCheck, HeartPulse } from "lucide-react";
import Link from "next/link";

interface Asset {
    id: string;
    name: string;
    category: string;
    quantity: number;
    status: string;
    purchasePrice: number;
    notes?: string;
    // Custom mock values for high-fidelity clinical asset desk
    serialNumber: string;
    location: string;
    lastMaintained: string;
    condition: "Excellent" | "Good" | "Requires Service" | "Critical";
    batteryHealth?: string;
}

export default function AssetsTypePage({ params }: { params: { type: string } }) {
    const type = params.type;

    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const assetTitle = type.charAt(0).toUpperCase() + type.slice(1);

    useEffect(() => {
        fetchAssets();
    }, [type]);

    const fetchAssets = async () => {
        try {
            setLoading(true);
            setError("");

            // Query database inventory items
            const response = await inventoryAPI.list(1, 100);
            const medicines = response.data.items || [];

            // Filter local items matching the asset type
            const filtered = medicines
                .filter((m: any) => {
                    const nameLower = m.name.toLowerCase();
                    const categoryLower = m.category.toLowerCase();

                    if (type === "beds") return nameLower.includes("bed") || categoryLower.includes("bed") || categoryLower.includes("furniture");
                    if (type === "wheelchairs") return nameLower.includes("wheelchair") || nameLower.includes("chair");
                    if (type === "stretchers") return nameLower.includes("stretcher") || nameLower.includes("trolley");
                    if (type === "equipment") return nameLower.includes("machine") || nameLower.includes("ventilator") || nameLower.includes("monitor") || categoryLower.includes("equipment");
                    return false;
                })
                .map((m: any, index: number) => {
                    // Generate realistic asset-specific tags
                    const conditions: Array<"Excellent" | "Good" | "Requires Service" | "Critical"> = ["Excellent", "Good", "Excellent", "Requires Service"];
                    const selectedCondition = conditions[index % conditions.length];

                    const locations = ["Ward A - 302", "Emergency Room - Slot 3", "ICU - Bed 2", "Outpatient Ward - Hall B", "Radiology Desk"];
                    const selectedLocation = locations[index % locations.length];

                    return {
                        id: m.id,
                        name: m.name,
                        category: m.category,
                        quantity: m.initialQuantity,
                        status: m.status,
                        purchasePrice: parseFloat(m.purchasePrice) || 0,
                        notes: m.description,
                        serialNumber: `SN-${100000 + index * 423}`,
                        location: selectedLocation,
                        lastMaintained: new Date(Date.now() - (index * 15 + 5) * 24 * 60 * 60 * 1000).toLocaleDateString(),
                        condition: selectedCondition,
                        batteryHealth: type === "equipment" ? `${98 - index * 4}%` : undefined
                    };
                });

            setAssets(filtered);
        } catch (err) {
            console.error("Failed to load assets:", err);
            setError("Failed to fetch assets registry");
        } finally {
            setLoading(false);
        }
    };

    const getConditionStyle = (cond: string) => {
        switch (cond) {
            case "Excellent":
                return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
            case "Good":
                return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
            case "Requires Service":
                return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
            default:
                return "bg-red-500/10 text-red-500 border border-red-500/20";
        }
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
                        <h1 className="text-3xl ">{assetTitle} Assets Hub</h1>
                        <p className="text-gray-400">Durable inventory assets, maintenance check-ups, and operational slot tracking</p>
                    </div>
                </div>
                <button
                    onClick={fetchAssets}
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
            ) : assets.length === 0 ? (
                <div className="card text-center py-16">
                    <Hotel className="mx-auto text-gray-500 mb-4" size={48} />
                    <h3 className="text-xl  text-white mb-2">No Registered {assetTitle}</h3>
                    <p className="text-gray-400 max-w-md mx-auto mb-6">
                        There are currently no items under the "{assetTitle}" category. Click below to register one dynamically.
                    </p>
                    <Link href="/inventory/add" className="btn-primary">
                        + Register {assetTitle.slice(0, -1)}
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {assets.map((asset) => (
                        <div key={asset.id} className="card relative overflow-hidden flex flex-col justify-between">
                            {/* Top border colored by condition */}
                            <div
                                className={`absolute top-0 left-0 right-0 h-[3px] ${asset.condition === "Excellent" || asset.condition === "Good"
                                    ? "bg-emerald-500"
                                    : asset.condition === "Requires Service"
                                        ? "bg-amber-500"
                                        : "bg-red-500"
                                    }`}
                            ></div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl  text-white">{asset.name}</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">{asset.serialNumber}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getConditionStyle(asset.condition)}`}>
                                        {asset.condition}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-2 border-y border-white/5 text-sm">
                                    <div>
                                        <span className="text-gray-500 block">Location Assigned</span>
                                        <span className="text-white font-medium">{asset.location}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Last Maintenance Check</span>
                                        <span className="text-white font-medium">{asset.lastMaintained}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Total Quantity</span>
                                        <span className="text-white font-medium">{asset.quantity} Units</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Purchase Value</span>
                                        <span className="text-white font-medium">₹{asset.purchasePrice.toLocaleString()}</span>
                                    </div>
                                </div>

                                {asset.batteryHealth && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <HeartPulse size={16} className="text-emerald-500 animate-pulse" />
                                        <span className="text-gray-400">Diagnostic Battery Capacity:</span>
                                        <span className="text-emerald-400 font-semibold">{asset.batteryHealth}</span>
                                    </div>
                                )}

                                {asset.notes && (
                                    <p className="text-xs text-gray-400 italic bg-card/5 p-2 rounded">
                                        "{asset.notes}"
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2 mt-6 pt-4 border-t border-white/5">
                                <button className="btn-secondary text-xs py-2 flex-1 flex items-center justify-center gap-1">
                                    <Settings size={14} /> Schedule Service
                                </button>
                                <button className="btn-primary text-xs py-2 flex-1 flex items-center justify-center gap-1">
                                    <UserCheck size={14} /> Reallocate Room
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
