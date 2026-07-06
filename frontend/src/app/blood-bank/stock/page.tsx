"use client";

import { useState, useEffect } from "react";

import ActionModal from "@/components/ui/ActionModal";
import {
   Search,
   Plus,
   Droplet,
   Eye,
   Edit,
   Trash2,
} from "lucide-react";
import Link from "next/link";
import { bloodBankAPI } from "@/lib/api";
import DataTable, { Column } from "@/components/ui/DataTable";

interface BloodUnit {
   id: string;
   unitId: string;
   bloodType: string;
   quantity: number;
   collectionDate: string;
   expiryDate: string;
   status: string;
   donor?: { name: string };
   notes?: string;
}

interface ApiResponse {
   success: boolean;
   data: BloodUnit[];
   stats: Record<string, { units: number; count: number }>;
   total: number;
}

export default function BloodStockPage() {
   const [searchQuery, setSearchQuery] = useState("");
   const [typeFilter, setTypeFilter] = useState("all");
   const [statusFilter, setStatusFilter] = useState("all");
   const [activeTab, setActiveTab] = useState("all");
   const [bloodStock, setBloodStock] = useState<BloodUnit[]>([]);
   const [loading, setLoading] = useState(true);
   const [stats, setStats] = useState<
      Record<string, { units: number; count: number }>
   >({});

   // Modal states
   const [selectedUnit, setSelectedUnit] = useState<BloodUnit | null>(null);
   const [viewModalOpen, setViewModalOpen] = useState(false);
   const [editModalOpen, setEditModalOpen] = useState(false);
   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
   const [editFormData, setEditFormData] = useState({
      status: "",
      quantity: 1,
      expiryDate: "",
      notes: "",
   });

   useEffect(() => {
      fetchBloodStock();
   }, []);

   const fetchBloodStock = async () => {
      try {
         setLoading(true);
         const response = await bloodBankAPI.getStock();
         const data = response.data as ApiResponse;
         if (data.success) {
            setBloodStock(data.data);
            setStats(data.stats);
         }
      } catch (error) {
         console.error("Error fetching blood stock:", error);
         alert("Failed to fetch blood stock. Please ensure you are logged in.");
      } finally {
         setLoading(false);
      }
   };

   const handleViewDetails = (unit: BloodUnit) => {
      setSelectedUnit(unit);
      setViewModalOpen(true);
   };

   const handleEditUnit = (unit: BloodUnit) => {
      setSelectedUnit(unit);
      setEditFormData({
         status: unit.status,
         quantity: unit.quantity,
         expiryDate: unit.expiryDate.split("T")[0],
         notes: unit.notes || "",
      });
      setEditModalOpen(true);
   };

   const handleDeleteUnit = (unit: BloodUnit) => {
      setSelectedUnit(unit);
      setDeleteModalOpen(true);
   };

   const handleUpdateUnit = async () => {
      if (!selectedUnit) return;

      try {
         const response = await bloodBankAPI.updateStock(
            selectedUnit.id,
            editFormData
         );
         if (response.data.success) {
            alert("Blood unit updated successfully!");
            setEditModalOpen(false);
            fetchBloodStock();
         } else {
            alert("Error: " + (response.data.error || "Failed to update"));
         }
      } catch (error) {
         console.error("Error updating blood unit:", error);
         alert("Error updating blood unit");
      }
   };

   const handleDeleteConfirm = async () => {
      if (!selectedUnit) return;

      try {
         const response = await bloodBankAPI.deleteStock(selectedUnit.id);
         if (response.data.success) {
            alert("Blood unit deleted successfully!");
            setDeleteModalOpen(false);
            fetchBloodStock();
         } else {
            alert("Error: " + (response.data.error || "Failed to delete"));
         }
      } catch (error) {
         console.error("Error deleting blood unit:", error);
         alert("Error deleting blood unit");
      }
   };

   const columns_0: Column<any>[] = [
      { header: "Unit ID", accessor: (unit) => (<>\n{unit.unitId}\n</>) },
      {
         header: "Blood Type", accessor: (unit) => (<>\n<span
            className={`px-3 py-1 rounded-full text-xs font-medium ${unit.bloodType.includes("+")
               ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
               : "bg-red-500/10 text-red-500 border border-red-500/20"
               }`}
         >
            {unit.bloodType}
         </span>\n</>)
      },
      { header: "Quantity", accessor: (unit) => (<>\n{unit.quantity}\nunit\n{unit.quantity > 1 ? "s" : ""}\n</>) },
      { header: "Collection Date", accessor: (unit) => (<>\n{new Date(unit.collectionDate).toLocaleDateString("en-GB")}\n</>) },
      { header: "Expiry Date", accessor: (unit) => (<>\n{new Date(unit.expiryDate).toLocaleDateString("en-GB")}\n</>) },
      {
         header: "Status", accessor: (unit) => (<>\n<span
            className={`px-3 py-1 rounded-full text-xs font-medium ${unit.status === "Available"
               ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
               : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
               }`}
         >
            {unit.status}
         </span>\n</>)
      },
      {
         header: "Actions", accessor: (unit) => (<>\n<div className="flex items-center gap-2">
            <button
               onClick={() => handleViewDetails(unit)}
               className="p-2 hover:bg-blue-500/20 rounded transition-colors"
               title="View Details"
            >
               <Eye size={16} className="text-blue-500" />
            </button>
            <button
               onClick={() => handleEditUnit(unit)}
               className="p-2 hover:bg-yellow-500/20 rounded transition-colors"
               title="Edit Unit"
            >
               <Edit size={16} className="text-yellow-500" />
            </button>
            <button
               onClick={() => handleDeleteUnit(unit)}
               className="p-2 hover:bg-red-500/20 rounded transition-colors"
               title="Delete Unit"
            >
               <Trash2 size={16} className="text-red-500" />
            </button>
         </div>\n</>)
      },
   ];



   return (
      <>
         <div className="space-y-6">
            <div className="flex justify-between items-center my-3 my-3">
               <div>
                  <h1 className="text-3xl  mb-2">Blood Stock</h1>
                  <p className="text-gray-400">
                     Manage and monitor blood inventory in the blood bank
                  </p>
               </div>
            </div>



            {/* Blood Group Stock Summary */}
            <div className="card">
               <h2 className="text-base font-semibold mb-4 text-gray-200">Stock by Blood Group</h2>
               <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => {
                     const units = stats[type]?.units ?? 0;
                     const colorClass =
                        units >= 5
                           ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                           : units >= 1
                              ? "text-orange-400 border-orange-500/30 bg-orange-500/10"
                              : "text-red-400 border-red-500/30 bg-red-500/10";
                     return (
                        <div
                           key={type}
                           className={`flex flex-col items-center justify-center rounded-xl border py-3 px-2 gap-1 ${colorClass}`}
                        >
                           <span className="text-lg ">{type}</span>
                           <span className="text-2xl font-extrabold">{units}</span>
                           <span className="text-xs opacity-70">units</span>
                        </div>
                     );
                  })}
               </div>
            </div>

            <div className="card">

               <div className="flex items-center gap-2 mb-6">
                  <Search size={20} className="text-gray-400" />
                  <input
                     type="text"
                     placeholder="Search blood units..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="bg-transparent flex-1 outline-none"
                  />
               </div>

               <div className="flex gap-4 mb-6 border-b border-dark-tertiary">
                  <button
                     onClick={() => setActiveTab("all")}
                     className={`pb-3 px-1 font-medium transition-colors ${activeTab === "all"
                        ? "text-emerald-500 border-b-2 border-emerald-500"
                        : "text-gray-400 hover:text-gray-300"
                        }`}
                  >
                     All Units
                  </button>
                  <button
                     onClick={() => setActiveTab("available")}
                     className={`pb-3 px-1 font-medium transition-colors ${activeTab === "available"
                        ? "text-emerald-500 border-b-2 border-emerald-500"
                        : "text-gray-400 hover:text-gray-300"
                        }`}
                  >
                     Available
                  </button>
                  <button
                     onClick={() => setActiveTab("reserved")}
                     className={`pb-3 px-1 font-medium transition-colors ${activeTab === "reserved"
                        ? "text-emerald-500 border-b-2 border-emerald-500"
                        : "text-gray-400 hover:text-gray-300"
                        }`}
                  >
                     Reserved
                  </button>
                  <button
                     onClick={() => setActiveTab("expiring")}
                     className={`pb-3 px-1 font-medium transition-colors ${activeTab === "expiring"
                        ? "text-emerald-500 border-b-2 border-emerald-500"
                        : "text-gray-400 hover:text-gray-300"
                        }`}
                  >
                     Expiring Soon
                  </button>
               </div>

               <div className="flex gap-3 mb-6">
                  <select
                     value={typeFilter}
                     onChange={(e) => setTypeFilter(e.target.value)}
                     className="input-field"
                  >
                     <option value="all">All Types</option>
                     {Object.keys(stats).map((bloodType) => (
                        <option key={bloodType} value={bloodType}>
                           {bloodType}
                        </option>
                     ))}
                  </select>
                  <select
                     value={statusFilter}
                     onChange={(e) => setStatusFilter(e.target.value)}
                     className="input-field"
                  >
                     <option value="all">All Status</option>
                     <option value="available">Available</option>
                     <option value="reserved">Reserved</option>
                     <option value="expiring">Expiring Soon</option>
                  </select>
                  <div className="flex gap-2 ml-auto">
                     <button className="btn-secondary flex items-center gap-2">
                        <svg
                           className="w-4 h-4"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                           />
                        </svg>
                        Export
                     </button>
                     <Link href="/blood-bank/add-unit">
                        <button className="btn-primary flex items-center gap-2">
                           <Plus size={20} />
                           Add Blood Units
                        </button>
                     </Link>
                  </div>
               </div>

               {loading ? (
                  <div className="text-center py-8 text-gray-400">
                     Loading blood units...
                  </div>
               ) : (
                  <div className="overflow-x-auto">
                     <DataTable columns={columns_0} data={bloodStock} enableLocalSearch enableLocalPagination />
                  </div>
               )}
            </div>
         </div>

         {/* View Details Modal */}
         <ActionModal
            isOpen={viewModalOpen}
            onClose={() => setViewModalOpen(false)}
            title="Blood Unit Details"
         >
            {selectedUnit && (
               <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-mdfont-medium text-gray-400">
                           Unit ID
                        </label>
                        <p className="text-white">{selectedUnit.unitId}</p>
                     </div>
                     <div>
                        <label className="block text-mdfont-medium text-gray-400">
                           Blood Type
                        </label>
                        <p className="text-white">{selectedUnit.bloodType}</p>
                     </div>
                     <div>
                        <label className="block text-mdfont-medium text-gray-400">
                           Quantity
                        </label>
                        <p className="text-white">
                           {selectedUnit.quantity} unit
                           {selectedUnit.quantity > 1 ? "s" : ""}
                        </p>
                     </div>
                     <div>
                        <label className="block text-mdfont-medium text-gray-400">
                           Status
                        </label>
                        <p className="text-white">{selectedUnit.status}</p>
                     </div>
                     <div>
                        <label className="block text-mdfont-medium text-gray-400">
                           Collection Date
                        </label>
                        <p className="text-white">
                           {new Date(selectedUnit.collectionDate).toLocaleDateString("en-GB")}
                        </p>
                     </div>
                     <div>
                        <label className="block text-mdfont-medium text-gray-400">
                           Expiry Date
                        </label>
                        <p className="text-white">
                           {new Date(selectedUnit.expiryDate).toLocaleDateString("en-GB")}
                        </p>
                     </div>
                  </div>
                  {selectedUnit.donor && (
                     <div>
                        <label className="block text-mdfont-medium text-gray-400">
                           Donor
                        </label>
                        <p className="text-white">{selectedUnit.donor.name}</p>
                     </div>
                  )}
                  {selectedUnit.notes && (
                     <div>
                        <label className="block text-mdfont-medium text-gray-400">
                           Notes
                        </label>
                        <p className="text-white">{selectedUnit.notes}</p>
                     </div>
                  )}
               </div>
            )}
         </ActionModal>

         {/* Edit Unit Modal */}
         <ActionModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            title="Edit Blood Unit"
            actions={
               <>
                  <button
                     onClick={() => setEditModalOpen(false)}
                     className="btn-secondary"
                  >
                     Cancel
                  </button>
                  <button onClick={handleUpdateUnit} className="btn-primary">
                     Update Unit
                  </button>
               </>
            }
         >
            {selectedUnit && (
               <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-mdfont-medium mb-2">Status</label>
                        <select
                           value={editFormData.status}
                           onChange={(e) =>
                              setEditFormData((prev) => ({
                                 ...prev,
                                 status: e.target.value,
                              }))
                           }
                           className="input-field w-full"
                        >
                           <option value="Available">Available</option>
                           <option value="Reserved">Reserved</option>
                           <option value="Expired">Expired</option>
                           <option value="Discarded">Discarded</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-mdfont-medium mb-2">
                           Quantity
                        </label>
                        <input
                           type="number"
                           value={editFormData.quantity}
                           onChange={(e) =>
                              setEditFormData((prev) => ({
                                 ...prev,
                                 quantity: parseInt(e.target.value),
                              }))
                           }
                           className="input-field w-full"
                           min="1"
                        />
                     </div>
                     <div className="col-span-2">
                        <label className="block text-mdfont-medium mb-2">
                           Expiry Date
                        </label>
                        <input
                           type="date"
                           value={editFormData.expiryDate}
                           onChange={(e) =>
                              setEditFormData((prev) => ({
                                 ...prev,
                                 expiryDate: e.target.value,
                              }))
                           }
                           className="input-field w-full"
                        />
                     </div>
                     <div className="col-span-2">
                        <label className="block text-mdfont-medium mb-2">Notes</label>
                        <textarea
                           value={editFormData.notes}
                           onChange={(e) =>
                              setEditFormData((prev) => ({
                                 ...prev,
                                 notes: e.target.value,
                              }))
                           }
                           className="input-field w-full resize-none"
                           rows={3}
                           placeholder="Additional notes..."
                        />
                     </div>
                  </div>
               </div>
            )}
         </ActionModal>

         {/* Delete Confirmation Modal */}
         <ActionModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            title="Delete Blood Unit"
            actions={
               <>
                  <button
                     onClick={() => setDeleteModalOpen(false)}
                     className="btn-secondary"
                  >
                     Cancel
                  </button>
                  <button
                     onClick={handleDeleteConfirm}
                     className="btn-primary bg-red-500 hover:bg-red-600"
                  >
                     Delete Unit
                  </button>
               </>
            }
         >
            {selectedUnit && (
               <div className="text-center">
                  <div className="mb-4">
                     <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 size={32} className="text-red-500" />
                     </div>
                     <h3 className="text-lg font-semibold mb-2">Delete Blood Unit</h3>
                     <p className="text-gray-400 mb-4">
                        Are you sure you want to delete blood unit{" "}
                        <strong>{selectedUnit.unitId}</strong>? This action cannot be
                        undone.
                     </p>
                     <div className="bg-dark-tertiary p-3 rounded">
                        <p className="text-mdtext-gray-300">
                           <strong>Blood Type:</strong> {selectedUnit.bloodType}
                           <br />
                           <strong>Quantity:</strong> {selectedUnit.quantity} unit
                           {selectedUnit.quantity > 1 ? "s" : ""}
                           <br />
                           <strong>Status:</strong> {selectedUnit.status}
                        </p>
                     </div>
                  </div>
               </div>
            )}
         </ActionModal>
      </>
   );
}
