"use client";

import { useState, useEffect } from "react";
import { medicineAPI } from "@/lib/api";
import { ArrowLeft, RefreshCw, Loader, AlertTriangle, PackageOpen, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DataTable, { Column } from "@/components/ui/DataTable";

interface MedicineItem {
 id: string;
 name: string;
 genericName: string;
 category: string;
 initialQuantity: number;
 reorderLevel: number;
 supplier: string;
 status: string;
}

export default function LowStockMedicinesPage() {
 const router = useRouter();
 const [items, setItems] = useState<MedicineItem[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");

 useEffect(() => {
 fetchLowStock();
 }, []);

 const fetchLowStock = async () => {
 try {
 setLoading(true);
 setError("");
 
 const response = await medicineAPI.list(1, 100);
 const medicines = response.data.medicines || [];

 // Filter for items at or below reorder levels
 const lowStockList = medicines.filter(
 (m: any) => (m.initialQuantity || 0) <= (m.reorderLevel || 10)
 );

 setItems(lowStockList);
 } catch (err) {
 console.error("Failed to load low stock:", err);
 setError("Failed to fetch low stock alert listings");
 } finally {
 setLoading(false);
 }
 };
 // Refill request handling moved to medicines page routing

    const columns_0: Column<any>[] = [
      { header: "Medication Name", accessor: (item) => (<>\n<AlertTriangle className="text-red-500" size={16} />\n\n{item.name}\n</>) },
      { header: "Generic Name", accessor: "genericName" },
      { header: "Category", accessor: "category" },
      { header: "Current Stock", accessor: (item) => (<>{item.initialQuantity}\nUnits</>) },
      { header: "Safety Level", accessor: (item) => (<>{item.reorderLevel}\nUnits</>) },
      { header: "Supplier", accessor: (item) => (<>{item.supplier || "Direct Procurement"}</>) },
      { header: "Restock Request", accessor: (item) => (<>\n<button
     onClick={() => {
     router.push(`/pharmacy/medicines?restockId=${item.id}`);
     }}
     className="btn-primary py-1 px-3.5 text-xs flex items-center gap-1.5 mx-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow shadow-emerald-500/10"
     >
     Restock Medicine <ArrowUpRight size={13} />
     </button>\n</>) },
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
 <h1 className="text-3xl font-bold">Low Stock Medicines</h1>
 <p className="text-gray-400">Restock clinical drugs, trigger central inventory refills, and verify reorder levels</p>
 </div>
 </div>
 <button
 onClick={fetchLowStock}
 className="btn-secondary flex items-center gap-2"
 >
 <RefreshCw size={18} /> Refresh
 </button>
 </div>



 {error && (
 <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg">
 {error}
 </div>
 )}

 {loading ? (
 <div className="flex justify-center items-center h-64">
 <Loader className="animate-spin text-emerald-500" size={32} />
 </div>
 ) : items.length === 0 ? (
 <div className="card text-center py-16">
 <PackageOpen className="mx-auto text-gray-500 mb-4" size={48} />
 <h3 className="text-xl font-bold text-white mb-2">Medication Stock is Safe</h3>
 <p className="text-gray-400 max-w-sm mx-auto">
 All clinical pharmacy drugs are well above safety reorder stock levels.
 </p>
 </div>
 ) : (
 <div className="card">
 <div className="overflow-x-auto">
 <DataTable columns={columns_0} data={items} enableLocalSearch enableLocalPagination />
 </div>
 </div>
 )}


 </div>
 );
}
