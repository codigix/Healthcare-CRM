"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { Loader, Info, ShieldAlert, Thermometer, ShieldCheck } from "lucide-react";
import { medicineAPI } from "@/lib/api";

interface Medicine {
 id: string;
 name: string;
 genericName: string;
 category: string;
 medicineType: string;
 description?: string;
 medicineForm: string;
 manufacturer?: string;
 supplier?: string;
 manufacturingDate?: string | null;
 expiryDate?: string | null;
 batchNumber?: string | null;
 dosage?: string | null;
 sideEffects?: string | null;
 precautions?: string | null;
 initialQuantity: number;
 reorderLevel: number;
 maximumLevel: number;
 purchasePrice: number;
 sellingPrice: number;
 taxRate: number;
 roomTemperature: boolean;
 frozen: boolean;
 refrigerated: boolean;
 protectFromLight: boolean;
 status: string;
}

interface Batch {
 id: string;
 batchNumber: string;
 expiryDate: string;
 quantity: number;
 purchasePrice: number;
 sellingPrice: number;
}

interface ViewMedicineModalProps {
 isOpen: boolean;
 onClose: () => void;
 medicineId: string | null;
}

export default function ViewMedicineModal({
 isOpen,
 onClose,
 medicineId,
}: ViewMedicineModalProps) {
 const [medicine, setMedicine] = useState<Medicine | null>(null);
 const [batches, setBatches] = useState<Batch[]>([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");

 useEffect(() => {
 if (isOpen && medicineId) {
 fetchDetails();
 }
 }, [isOpen, medicineId]);

 const fetchDetails = async () => {
 try {
 setLoading(true);
 setError("");
 
 const [medRes, batchRes] = await Promise.all([
 medicineAPI.get(medicineId!),
 medicineAPI.getBatches(medicineId!)
 ]);

 setMedicine(medRes.data);
 setBatches(batchRes.data || []);
 } catch (err: any) {
 console.error("Failed to load medicine view details:", err);
 setError("Failed to fetch medicine profile and batch data.");
 } finally {
 setLoading(false);
 }
 };

 const getCategoryColor = (category: string) => {
 const colors: { [key: string]: string } = {
 Antibiotics: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
 Analgesics: "bg-purple-500/10 text-purple-500 border border-purple-500/20",
 Antidiabetics: "bg-pink-500/10 text-pink-500 border border-pink-500/20",
 Antihypertensives: "bg-cyan-500/10 text-cyan-500 border border-cyan-500/20",
 Antihistamines: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
 Statins: "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20",
 Anxiolytics: "bg-orange-500/10 text-orange-500 border border-orange-500/20",
 NSAIDs: "bg-green-500/10 text-green-500 border border-green-500/20",
 };
 return colors[category] || "bg-gray-500/10 text-gray-400 border border-gray-500/20";
 };

 const getStatusColor = (status: string) => {
 switch (status) {
 case "In Stock":
 case "Active":
 return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
 case "Low Stock":
 return "bg-orange-500/10 text-orange-500 border border-orange-500/20";
 case "Out of Stock":
 case "Inactive":
 return "bg-red-500/10 text-red-500 border border-red-500/20";
 default:
 return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
 }
 };

 const formatPrice = (price: any): string => {
 const numPrice = typeof price === "number" ? price : parseFloat(price) || 0;
 return numPrice.toFixed(2);
 };

 return (
 <Modal
 isOpen={isOpen}
 onClose={onClose}
 title="Medicine Specifications & Batches"
 size="3xl"
 >
 {loading ? (
 <div className="flex justify-center items-center h-48">
 <Loader className="animate-spin text-emerald-500" size={32} />
 </div>
 ) : error ? (
 <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm font-sans">
 {error}
 </div>
 ) : medicine ? (
 <div className="space-y-6 pr-2 font-sans text-xs">
 {/* Header drug status summary */}
 <div className="border-b border-dark-tertiary pb-4">
 <h3 className="text-lg font-bold text-white leading-tight">{medicine.name}</h3>
 <p className="text-gray-400 text-xs italic mt-0.5">{medicine.genericName}</p>
 <div className="flex flex-wrap gap-2 mt-2.5">
 <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getCategoryColor(medicine.category)}`}>
 {medicine.category}
 </span>
 <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-card/5 text-gray-300 capitalize border border-white/10">
 {medicine.medicineForm}
 </span>
 <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusColor(medicine.status)}`}>
 {medicine.status}
 </span>
 <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-card/5 text-teal-400 border border-teal-500/20">
 {medicine.medicineType}
 </span>
 </div>
 </div>

 {/* 1. Basic & Description */}
 {medicine.description && (
 <div className="bg-card/[0.02] p-3 rounded-lg border border-white/5">
 <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px] block">Description</span>
 <p className="text-gray-300 text-xs mt-1 leading-relaxed">{medicine.description}</p>
 </div>
 )}

 {/* 2. Procurement & Date details */}
 <div className="grid grid-cols-2 gap-x-4 gap-y-3 bg-card/[0.01] p-3 rounded-lg border border-white/5">
 <div className="col-span-2 pb-1.5 border-b border-white/5 font-bold text-white text-xs flex items-center gap-1.5">
 <Info size={14} className="text-teal-400" />
 Procurement & Manufacturing Details
 </div>
 <div>
 <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Manufacturer</p>
 <p className="text-white mt-0.5">{medicine.manufacturer || "N/A"}</p>
 </div>
 <div>
 <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Supplier</p>
 <p className="text-white mt-0.5">{medicine.supplier || "N/A"}</p>
 </div>
 <div>
 <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Mfg Date</p>
 <p className="text-white mt-0.5">
 {medicine.manufacturingDate ? new Date(medicine.manufacturingDate).toLocaleDateString() : "N/A"}
 </p>
 </div>
 <div>
 <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Expiry Date</p>
 <p className="text-white mt-0.5">
 {medicine.expiryDate ? new Date(medicine.expiryDate).toLocaleDateString() : "N/A"}
 </p>
 </div>
 <div>
 <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Primary Batch Number</p>
 <p className="text-white font-mono mt-0.5">{medicine.batchNumber || "N/A"}</p>
 </div>
 <div>
 <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Recommended Dosage</p>
 <p className="text-white mt-0.5">{medicine.dosage || "N/A"}</p>
 </div>
 </div>

 {/* 3. Clinical info (Warnings/Effects) */}
 {(medicine.sideEffects || medicine.precautions) && (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-card/[0.01] p-3 rounded-lg border border-white/5">
 <div className="md:col-span-2 pb-1.5 border-b border-white/5 font-bold text-white text-xs flex items-center gap-1.5">
 <ShieldAlert size={14} className="text-amber-500" />
 Clinical Warnings & Safety Info
 </div>
 {medicine.sideEffects && (
 <div>
 <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Side Effects</p>
 <p className="text-gray-300 mt-1 leading-relaxed whitespace-pre-wrap">{medicine.sideEffects}</p>
 </div>
 )}
 {medicine.precautions && (
 <div>
 <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Precautions & Warnings</p>
 <p className="text-gray-300 mt-1 leading-relaxed whitespace-pre-wrap">{medicine.precautions}</p>
 </div>
 )}
 </div>
 )}

 {/* 4. Storage Conditions */}
 <div className="bg-card/[0.01] p-3 rounded-lg border border-white/5">
 <div className="pb-2 border-b border-white/5 font-bold text-white text-xs flex items-center gap-1.5">
 <Thermometer size={14} className="text-[#1abc9c]" />
 Required Storage Conditions
 </div>
 <div className="grid grid-cols-2 gap-3 mt-3">
 <div className="flex items-center gap-2">
 <span className={`w-2.5 h-2.5 rounded-full ${medicine.roomTemperature ? "bg-emerald-500" : "bg-card/10"}`}></span>
 <span className="text-gray-300">Room Temp (25°C)</span>
 </div>
 <div className="flex items-center gap-2">
 <span className={`w-2.5 h-2.5 rounded-full ${medicine.refrigerated ? "bg-emerald-500" : "bg-card/10"}`}></span>
 <span className="text-gray-300">Refrigerated (2-8°C)</span>
 </div>
 <div className="flex items-center gap-2">
 <span className={`w-2.5 h-2.5 rounded-full ${medicine.frozen ? "bg-emerald-500" : "bg-card/10"}`}></span>
 <span className="text-gray-300">Frozen (-20°C)</span>
 </div>
 <div className="flex items-center gap-2">
 <span className={`w-2.5 h-2.5 rounded-full ${medicine.protectFromLight ? "bg-emerald-500" : "bg-card/10"}`}></span>
 <span className="text-gray-300">Protect from Light</span>
 </div>
 </div>
 </div>

 {/* 5. Inventory levels & Pricing details */}
 <div className="grid grid-cols-3 gap-x-4 gap-y-3 bg-card/[0.01] p-3 rounded-lg border border-white/5">
 <div className="col-span-3 pb-1.5 border-b border-white/5 font-bold text-white text-xs flex items-center gap-1.5">
 <ShieldCheck size={14} className="text-blue-400" />
 Stock Inventory & Pricing Details
 </div>
 <div>
 <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Current Stock</p>
 <p className="text-emerald-400 font-extrabold mt-0.5 text-sm">{medicine.initialQuantity} units</p>
 </div>
 <div>
 <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Reorder Alert Level</p>
 <p className="text-white mt-0.5">{medicine.reorderLevel} units</p>
 </div>
 <div>
 <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Max Capacity Level</p>
 <p className="text-white mt-0.5">{medicine.maximumLevel} units</p>
 </div>
 <div>
 <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Purchase Cost</p>
 <p className="text-white font-semibold mt-0.5">₹{formatPrice(medicine.purchasePrice)}</p>
 </div>
 <div>
 <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Selling Price</p>
 <p className="text-white font-semibold mt-0.5">₹{formatPrice(medicine.sellingPrice)}</p>
 </div>
 <div>
 <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Tax Rate (%)</p>
 <p className="text-white mt-0.5">{parseFloat(String(medicine.taxRate))}%</p>
 </div>
 </div>

 {/* 6. Batches Table */}
 <div className="pt-4 border-t border-dark-tertiary font-sans">
 <h4 className="text-sm font-bold text-white mb-2">Available Batches</h4>
 {batches.length === 0 ? (
 <p className="text-gray-500 text-xs italic font-sans">No active batches in stock.</p>
 ) : (
 <div className="border border-dark-tertiary rounded-lg overflow-hidden bg-card/[0.01]">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-card/5 border-b border-dark-tertiary text-gray-400 font-bold">
 <th className="py-2.5 px-3">Batch Number</th>
 <th className="py-2.5 px-3 text-center">Stock</th>
 <th className="py-2.5 px-3">Expiry Date</th>
 <th className="py-2.5 px-3 text-right">Purchase Price</th>
 <th className="py-2.5 px-3 text-right">Selling Price</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-dark-tertiary text-gray-300">
 {batches.map((batch) => (
 <tr key={batch.id} className="hover:bg-card/5">
 <td className="py-2.5 px-3 font-mono font-bold text-teal-400">{batch.batchNumber}</td>
 <td className="py-2.5 px-3 text-center font-bold text-white">{batch.quantity} units</td>
 <td className="py-2.5 px-3">{new Date(batch.expiryDate).toLocaleDateString()}</td>
 <td className="py-2.5 px-3 text-right">₹{formatPrice(batch.purchasePrice)}</td>
 <td className="py-2.5 px-3 text-right font-bold text-emerald-400">₹{formatPrice(batch.sellingPrice)}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>

 <div className="flex justify-end pt-2">
 <button
 onClick={onClose}
 className="px-5 py-2 bg-dark-tertiary hover:bg-dark-tertiary/70 text-white rounded-lg transition-colors font-semibold text-xs"
 >
 Close
 </button>
 </div>
 </div>
 ) : null}
 </Modal>
 );
}
