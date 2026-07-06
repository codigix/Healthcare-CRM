"use client";

import { useState, useEffect } from "react";

import { ArrowLeft, Loader, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { medicineAPI } from "@/lib/api";
import AddStockModal from "@/components/Pharmacy/AddStockModal";
import DataTable, { Column } from "@/components/ui/DataTable";

interface Medicine {
 id: string;
 name: string;
 genericName: string;
 category: string;
 medicineType: string;
 description: string;
 medicineForm: string;
 manufacturer: string;
 supplier: string;
 manufacturingDate: string | null;
 expiryDate: string | null;
 batchNumber: string;
 dosage: string;
 sideEffects: string;
 precautions: string;
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
 createdAt: string;
 updatedAt: string;
}

export default function MedicineViewPage({
 params,
}: {
 params: { id: string };
}) {
 const router = useRouter();
 const [medicine, setMedicine] = useState<Medicine | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 const [transactions, setTransactions] = useState<any[]>([]);
 const [batches, setBatches] = useState<any[]>([]);
 const [stockModalOpen, setStockModalOpen] = useState(false);

 useEffect(() => {
 fetchMedicine();
 fetchTransactions();
 fetchBatches();
 }, [params.id]);

 const fetchTransactions = async () => {
 try {
 const response = await medicineAPI.getTransactions(params.id);
 setTransactions(response.data || []);
 } catch (err) {
 console.error("Failed to fetch stock transactions history:", err);
 }
 };

 const fetchBatches = async () => {
 try {
 const response = await medicineAPI.getBatches(params.id);
 setBatches(response.data || []);
 } catch (err) {
 console.error("Failed to fetch medicine batches:", err);
 }
 };

 const fetchMedicine = async () => {
 try {
 setLoading(true);
 setError("");
 const response = await medicineAPI.get(params.id);
 setMedicine(response.data);
 } catch (err: any) {
 setError("Failed to fetch medicine details");
 console.error(err);
 } finally {
 setLoading(false);
 }
 };

 const getStatusColor = (status: string) => {
 switch (status) {
 case "In Stock":
 return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
 case "Low Stock":
 return "bg-orange-500/10 text-orange-500 border border-orange-500/20";
 case "Out of Stock":
 return "bg-red-500/10 text-red-500 border border-red-500/20";
 case "Active":
 return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
 case "Inactive":
 return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
 default:
 return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
 }
 };

 const getCategoryColor = (category: string) => {
 const colors: { [key: string]: string } = {
 Antibiotics: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
 Analgesics:
 "bg-purple-500/10 text-purple-500 border border-purple-500/20",
 Antidiabetics: "bg-pink-500/10 text-pink-500 border border-pink-500/20",
 Antihypertensives:
 "bg-cyan-500/10 text-cyan-500 border border-cyan-500/20",
 Antihistamines:
 "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
 Statins: "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20",
 Anxiolytics:
 "bg-orange-500/10 text-orange-500 border border-orange-500/20",
 NSAIDs: "bg-green-500/10 text-green-500 border border-green-500/20",
 };
 return (
 colors[category] ||
 "bg-gray-500/10 text-gray-400 border border-gray-500/20"
 );
 };

 const getStockStatus = (quantity: number, reorderLevel: number) => {
 if (quantity === 0) return "Out of Stock";
 if (quantity <= reorderLevel) return "Low Stock";
 return "In Stock";
 };

 const formatPrice = (price: any): string => {
 const numPrice = typeof price === "number" ? price : parseFloat(price) || 0;
 return numPrice.toFixed(2);
 };

 if (loading) {
 return (
 <>
 <div className="flex items-center justify-center py-12">
 <Loader className="animate-spin text-emerald-500" size={32} />
 </div>
 </>
 );
 }

 if (error || !medicine) {
 return (
 <>
 <div className="space-y-6">
 <Link href="/pharmacy/medicines">
 <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
 <ArrowLeft size={20} />
 Back to Medicines
 </button>
 </Link>
 <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg flex items-center gap-2">
 <AlertCircle size={20} />
 {error || "Medicine not found"}
 </div>
 </div>
 </>
 );
 }

    const columns_1: Column<any>[] = [
      { header: "Date & Time", accessor: (tx) => (<>\n{new Date(tx.createdAt).toLocaleString()}\n</>) },
      { header: "Type", accessor: (tx) => (<>\n<span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
     tx.type === 'RESTOCK' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
     tx.type === 'DISPENSE' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
     'bg-amber-500/10 text-amber-400 border border-amber-500/20'
     }`}>
     {tx.type}
     </span>\n</>) },
      { header: "Quantity Change", accessor: (tx) => (<>\n{tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}\n</>) },
      { header: "Previous Stock", accessor: (tx) => (<>\n{tx.previousStock}\nunits
     </>) },
      { header: "New Stock Level", accessor: (tx) => (<>\n{tx.newStock}\nunits
     </>) },
      { header: "Notes", accessor: (tx) => (<>\n{tx.notes || 'N/A'}\n</>) },
    ];

    const columns_0: Column<any>[] = [
      { header: "Batch Number", accessor: (batch) => (<>\n{batch.batchNumber}\n</>) },
      { header: "Remaining Quantity", accessor: (batch) => (<>\n{batch.quantity}\nunits
     </>) },
      { header: "Expiry Date", accessor: (batch) => (<>\n{new Date(batch.expiryDate).toLocaleDateString()}\n</>) },
      { header: "Purchase Price", accessor: (batch) => (<>₹\n{formatPrice(batch.purchasePrice)}\n</>) },
      { header: "Selling Price", accessor: (batch) => (<>₹\n{formatPrice(batch.sellingPrice)}\n</>) },
    ];



 return (
 <>
 <div className="space-y-6">
 <div className="flex justify-between items-center">
 <Link href="/pharmacy/medicines">
 <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
 <ArrowLeft size={20} />
 Back to Medicines
 </button>
 </Link>
 <div className="flex gap-3">
 <button
 onClick={() => setStockModalOpen(true)}
 className="btn-secondary bg-emerald-600 hover:bg-emerald-500 text-white font-bold border-none"
 >
 Add Stock
 </button>
 <Link href={`/pharmacy/edit-medicine/${medicine.id}`}>
 <button className="btn-primary">Edit Medicine</button>
 </Link>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
 <div className="card">
 <div className="text-mdtext-gray-400 mb-1">Stock Level</div>
 <div className="text-2xl font-bold text-white mb-2">
 {medicine.initialQuantity}
 </div>
 <span
 className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
 getStockStatus(medicine.initialQuantity, medicine.reorderLevel)
 )}`}
 >
 {getStockStatus(medicine.initialQuantity, medicine.reorderLevel)}
 </span>
 </div>

 <div className="card">
 <div className="text-mdtext-gray-400 mb-1">Purchase Price</div>
 <div className="text-2xl font-bold text-white">
 ₹{formatPrice(medicine.purchasePrice)}
 </div>
 <div className="text-xs text-gray-500 mt-1">per unit</div>
 </div>

 <div className="card">
 <div className="text-mdtext-gray-400 mb-1">Selling Price</div>
 <div className="text-2xl font-bold text-emerald-500">
 ₹{formatPrice(medicine.sellingPrice)}
 </div>
 <div className="text-xs text-gray-500 mt-1">per unit</div>
 </div>
 </div>

 <div className="card">
 <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-dark-tertiary">
 {medicine.name}
 </h2>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
 <div className="space-y-6">
 <div>
 <label className="text-mdtext-gray-400">Generic Name</label>
 <p className="text-white text-lg font-medium">
 {medicine.genericName}
 </p>
 </div>

 <div>
 <label className="text-mdtext-gray-400">Category</label>
 <span
 className={`px-3 py-1 rounded-full text-mdfont-medium inline-block ${getCategoryColor(
 medicine.category
 )}`}
 >
 {medicine.category}
 </span>
 </div>

 <div>
 <label className="text-mdtext-gray-400">Medicine Type</label>
 <p className="text-white">{medicine.medicineType}</p>
 </div>

 <div>
 <label className="text-mdtext-gray-400">Medicine Form</label>
 <p className="text-white capitalize">{medicine.medicineForm}</p>
 </div>

 <div>
 <label className="text-mdtext-gray-400">Status</label>
 <span
 className={`px-3 py-1 rounded-full text-mdfont-medium inline-block ${getStatusColor(
 medicine.status
 )}`}
 >
 {medicine.status}
 </span>
 </div>
 </div>

 <div className="space-y-6">
 <div>
 <label className="text-mdtext-gray-400">Manufacturer</label>
 <p className="text-white">{medicine.manufacturer || "N/A"}</p>
 </div>

 <div>
 <label className="text-mdtext-gray-400">Supplier</label>
 <p className="text-white">{medicine.supplier || "N/A"}</p>
 </div>

 <div>
 <label className="text-mdtext-gray-400">Batch Number</label>
 <p className="text-white">{medicine.batchNumber || "N/A"}</p>
 </div>

 <div>
 <label className="text-mdtext-gray-400">
 Manufacturing Date
 </label>
 <p className="text-white">
 {medicine.manufacturingDate
 ? new Date(medicine.manufacturingDate).toLocaleDateString()
 : "N/A"}
 </p>
 </div>

 <div>
 <label className="text-mdtext-gray-400">Expiry Date</label>
 <p className="text-white">
 {medicine.expiryDate
 ? new Date(medicine.expiryDate).toLocaleDateString()
 : "N/A"}
 </p>
 </div>
 </div>
 </div>

 {medicine.description && (
 <div className="mb-8 pb-8 border-b border-dark-tertiary">
 <label className="text-mdtext-gray-400">Description</label>
 <p className="text-white mt-2">{medicine.description}</p>
 </div>
 )}

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
 <div>
 <h3 className="font-semibold text-white mb-3">Side Effects</h3>
 <p className="text-gray-300 whitespace-pre-wrap">
 {medicine.sideEffects || "N/A"}
 </p>
 </div>

 <div>
 <h3 className="font-semibold text-white mb-3">
 Precautions & Warnings
 </h3>
 <p className="text-gray-300 whitespace-pre-wrap">
 {medicine.precautions || "N/A"}
 </p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-dark-tertiary">
 <div className="space-y-4">
 <h3 className="font-semibold text-white">Inventory Details</h3>

 <div className="flex justify-between items-center text-sm">
 <span className="text-gray-400">Current Quantity</span>
 <span className="text-white font-medium">
 {medicine.initialQuantity} units
 </span>
 </div>

 <div className="flex justify-between items-center text-sm">
 <span className="text-gray-400">Reorder Level</span>
 <span className="text-white font-medium">
 {medicine.reorderLevel} units
 </span>
 </div>

 <div className="flex justify-between items-center text-sm">
 <span className="text-gray-400">Maximum Level</span>
 <span className="text-white font-medium">
 {medicine.maximumLevel} units
 </span>
 </div>

 <div className="flex justify-between items-center text-sm">
 <span className="text-gray-400">Dosage</span>
 <span className="text-white font-medium">
 {medicine.dosage || "N/A"}
 </span>
 </div>
 </div>

 <div className="space-y-4">
 <h3 className="font-semibold text-white">Storage Conditions</h3>

 <div className="flex items-center gap-3">
 <div
 className={`w-4 h-4 rounded ${
 medicine.roomTemperature
 ? "bg-emerald-500"
 : "bg-dark-tertiary"
 }`}
 ></div>
 <span className="text-gray-300">Room Temperature (25°C)</span>
 </div>

 <div className="flex items-center gap-3">
 <div
 className={`w-4 h-4 rounded ${
 medicine.refrigerated
 ? "bg-emerald-500"
 : "bg-dark-tertiary"
 }`}
 ></div>
 <span className="text-gray-300">Refrigerated (2-8°C)</span>
 </div>

 <div className="flex items-center gap-3">
 <div
 className={`w-4 h-4 rounded ${
 medicine.frozen ? "bg-emerald-500" : "bg-dark-tertiary"
 }`}
 ></div>
 <span className="text-gray-300">Frozen (-20°C)</span>
 </div>

 <div className="flex items-center gap-3">
 <div
 className={`w-4 h-4 rounded ${
 medicine.protectFromLight
 ? "bg-emerald-500"
 : "bg-dark-tertiary"
 }`}
 ></div>
 <span className="text-gray-300">Protect from Light</span>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div>
 <h3 className="font-semibold text-white mb-3">Pricing</h3>

 <div className="flex justify-between items-center text-mdmb-2">
 <span className="text-gray-400">Purchase Price</span>
 <span className="text-white font-medium">
 ₹{formatPrice(medicine.purchasePrice)}
 </span>
 </div>

 <div className="flex justify-between items-center text-mdmb-2">
 <span className="text-gray-400">Selling Price</span>
 <span className="text-white font-medium">
 ₹{formatPrice(medicine.sellingPrice)}
 </span>
 </div>

 <div className="flex justify-between items-center text-mdmb-2">
 <span className="text-gray-400">Tax Rate</span>
 <span className="text-white font-medium">
 {parseFloat(String(medicine.taxRate))}%
 </span>
 </div>

 <div className="flex justify-between items-center text-mdpt-2 border-t border-dark-tertiary">
 <span className="text-gray-400">Profit Margin</span>
 <span className="text-emerald-500 font-medium">
 ₹
 {formatPrice(
 (typeof medicine.sellingPrice === "number"
 ? medicine.sellingPrice
 : parseFloat(medicine.sellingPrice) || 0) -
 (typeof medicine.purchasePrice === "number"
 ? medicine.purchasePrice
 : parseFloat(medicine.purchasePrice) || 0)
 )}
 </span>
 </div>
 </div>

 <div>
 <h3 className="font-semibold text-white mb-3">Metadata</h3>

 <div className="text-mdspace-y-2">
 <div className="flex justify-between">
 <span className="text-gray-400">ID</span>
 <span className="text-white font-mono text-xs">
 {medicine.id.slice(0, 12)}...
 </span>
 </div>

 <div className="flex justify-between">
 <span className="text-gray-400">Created</span>
 <span className="text-white">
 {new Date(medicine.createdAt).toLocaleDateString()}
 </span>
 </div>

 <div className="flex justify-between">
 <span className="text-gray-400">Last Updated</span>
 <span className="text-white">
 {new Date(medicine.updatedAt).toLocaleDateString()}
 </span>
 </div>
 </div>
 </div>
 </div>
 </div>

 <div className="card font-sans">
 <h3 className="text-xl font-bold text-white mb-4">Active Batches</h3>
 {batches.length === 0 ? (
 <p className="text-gray-400 text-sm italic font-sans">No active batches available. Need to restock.</p>
 ) : (
 <div className="overflow-x-auto font-sans">
 <DataTable columns={columns_0} data={batches} enableLocalSearch enableLocalPagination />
 </div>
 )}
 </div>

 <div className="card">
 <h3 className="text-xl font-bold text-white mb-4">Stock History Logs</h3>
 {transactions.length === 0 ? (
 <p className="text-gray-400 text-sm italic">No stock transactions logged yet.</p>
 ) : (
 <div className="overflow-x-auto">
 <DataTable columns={columns_1} data={transactions} enableLocalSearch enableLocalPagination />
 </div>
 )}
 </div>
 </div>

 <AddStockModal
 isOpen={stockModalOpen}
 onClose={() => setStockModalOpen(false)}
 medicine={medicine}
 onSuccess={() => {
 fetchMedicine();
 fetchTransactions();
 fetchBatches();
 }}
 />
 </>
 );
}
