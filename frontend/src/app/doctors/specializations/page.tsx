"use client";

import { useState, useEffect } from "react";

import {
   ArrowLeft,
   Plus,
   Search,
   MoreVertical,
   Edit,
   Trash2,
   CheckCircle,
   Circle,
} from "lucide-react";
import Link from "next/link";
import { specializationAPI } from "@/lib/api";
import DataTable, { Column } from "@/components/ui/DataTable";

interface Specialization {
   id: string;
   name: string;
   description?: string | null;
   department: string;
   doctorCount: number;
   status: "active" | "inactive";
   createdAt?: string;
   updatedAt?: string;
}

export default function SpecializationsPage() {
   const [search, setSearch] = useState("");
   const [specializations, setSpecializations] = useState<Specialization[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   const [openMenuId, setOpenMenuId] = useState<string | null>(null);
   const [editingId, setEditingId] = useState<string | null>(null);
   const [editForm, setEditForm] = useState({
      name: "",
      description: "",
      department: "",
      doctorCount: 0,
   });
   const [isAddingNew, setIsAddingNew] = useState(false);
   const [newForm, setNewForm] = useState({
      name: "",
      description: "",
      department: "",
      doctorCount: 0,
   });

   useEffect(() => {
      fetchSpecializations();
   }, []);

   const fetchSpecializations = async () => {
      try {
         setLoading(true);
         const res = await specializationAPI.list(1, 100, search);
         setSpecializations(res.data.specializations || []);
         setError(null);
      } catch (err) {
         setError("Failed to fetch specializations");
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   const handleEdit = (spec: Specialization) => {
      setEditingId(spec.id);
      setEditForm({
         name: spec.name,
         description: spec.description || "",
         department: spec.department,
         doctorCount: spec.doctorCount,
      });
      setOpenMenuId(null);
   };

   const handleSaveEdit = async () => {
      if (editingId && editForm.name) {
         try {
            await specializationAPI.update(editingId, {
               ...editForm,
               doctorCount: Number(editForm.doctorCount),
            });
            await fetchSpecializations();
            setEditingId(null);
         } catch (err) {
            console.error("Failed to update specialization", err);
         }
      }
   };

   const handleDelete = async (id: string) => {
      if (confirm("Are you sure you want to delete this specialization?")) {
         try {
            await specializationAPI.delete(id);
            setSpecializations((prev) => prev.filter((spec) => spec.id !== id));
            setOpenMenuId(null);
         } catch (err) {
            console.error("Failed to delete specialization", err);
         }
      }
   };

   const handleToggleStatus = async (id: string) => {
      try {
         const spec = specializations.find((s) => s.id === id);
         if (spec) {
            const newStatus = spec.status === "active" ? "inactive" : "active";
            await specializationAPI.update(id, {
               name: spec.name,
               description: spec.description,
               department: spec.department,
               doctorCount: spec.doctorCount,
               status: newStatus,
            });
            await fetchSpecializations();
         }
         setOpenMenuId(null);
      } catch (err) {
         console.error("Failed to toggle specialization status", err);
      }
   };

   const handleAddNew = async () => {
      if (newForm.name && newForm.department) {
         try {
            await specializationAPI.create({
               name: newForm.name,
               description: newForm.description || null,
               department: newForm.department,
               doctorCount: Number(newForm.doctorCount),
               status: "active",
            });
            await fetchSpecializations();
            setNewForm({
               name: "",
               description: "",
               department: "",
               doctorCount: 0,
            });
            setIsAddingNew(false);
         } catch (err) {
            console.error("Failed to add specialization", err);
         }
      }
   };

   const filteredSpecializations = specializations.filter(
      (spec) =>
         spec.name.toLowerCase().includes(search.toLowerCase()) ||
         (spec.description &&
            spec.description.toLowerCase().includes(search.toLowerCase())) ||
         spec.department.toLowerCase().includes(search.toLowerCase())
   );

   const columns_0: Column<any>[] = [
      {
         header: "Name", accessor: (specialization) => (<>\n<span className="font-medium">
            {specialization.name}
         </span>\n</>)
      },
      { header: "Description", accessor: (specialization) => (<>\n{specialization.description || "N/A"}\n</>) },
      {
         header: "Department", accessor: (specialization) => (<>\n<span className="text-yellow-500">
            {specialization.department}
         </span>\n</>)
      },
      {
         header: "Doctors", accessor: (specialization) => (<>\n<span className="text-blue-500 font-medium">
            {specialization.doctorCount}
         </span>\n</>)
      },
      {
         header: "Status", accessor: (specialization) => (<>\n<span
            className={`px-3 py-1 rounded-full text-xs font-medium ${specialization.status === "active"
               ? "bg-emerald-500/20 text-emerald-500"
               : "bg-yellow-500/20 text-yellow-500"
               }`}
         >
            {specialization.status === "active"
               ? "Active"
               : "Inactive"}
         </span>\n</>)
      },
      {
         header: "Actions", accessor: (specialization) => (<>\n<div className="flex items-center justify-center">
            <button
               onClick={() =>
                  setOpenMenuId(
                     openMenuId === specialization.id
                        ? null
                        : specialization.id
                  )
               }
               className="p-2 hover:bg-dark-tertiary rounded transition-colors"
            >
               <MoreVertical size={15} className="text-gray-400" />
            </button>

            {openMenuId === specialization.id && (
               <div className="absolute right-0 mt-2 w-48 bg-dark-secondary border border-dark-tertiary rounded shadow-lg z-10 top-full">
                  <button
                     onClick={() => handleEdit(specialization)}
                     className="w-full text-left p-2 hover:bg-dark-tertiary transition-colors flex items-center gap-2 text-gray-300 hover:text-white first:rounded-t-lg"
                  >
                     <Edit size={16} />
                     Edit
                  </button>
                  <button
                     onClick={() =>
                        handleToggleStatus(specialization.id)
                     }
                     className="w-full text-left p-2 hover:bg-dark-tertiary transition-colors flex items-center gap-2 text-gray-300 hover:text-white"
                  >
                     {specialization.status === "active" ? (
                        <Circle size={16} />
                     ) : (
                        <CheckCircle size={16} />
                     )}
                     {specialization.status === "active"
                        ? "Deactivate"
                        : "Activate"}
                  </button>
                  <button
                     onClick={() => handleDelete(specialization.id)}
                     className="w-full text-left p-2 hover:bg-red-500/20 transition-colors flex items-center gap-2 text-red-400 hover:text-red-300 last:rounded-b-lg"
                  >
                     <Trash2 size={16} />
                     Delete
                  </button>
               </div>
            )}
         </div>\n</>)
      },
   ];


   return (
      <>
         <div className="space-y-6">
            <div className="flex items-center gap-4">
               <Link
                  href="/doctors"
                  className="p-2 hover:bg-dark-tertiary rounded transition-colors"
               >
                  <ArrowLeft size={20} />
               </Link>
               <div>
                  <h1 className="text-3xl  mb-2">Specializations</h1>
                  <p className="text-gray-400">
                     Manage medical specializations in your clinic.
                  </p>
               </div>
            </div>

            {loading && (
               <div className="card">
                  <div className="text-center py-8">
                     <p className="text-gray-400">Loading specializations...</p>
                  </div>
               </div>
            )}

            {error && (
               <div className="card">
                  <div className="bg-red-500/10 border border-red-500/20 rounded p-4 text-red-500">
                     {error}
                  </div>
               </div>
            )}

            {!loading && !error && (
               <div className="card">
                  <div className="mb-6">
                     <h2 className="text-xl  mb-2">Specializations List</h2>
                     <p className="text-gray-400 text-sm">
                        View and manage all medical specializations.
                     </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 mb-6">
                     <div className="flex items-center gap-2 bg-dark-tertiary rounded px-4 flex-1 max-w-md">
                        <Search size={20} className="text-gray-400" />
                        <input
                           type="text"
                           placeholder="Search specializations..."
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}
                           className="bg-transparent py-3 flex-1 outline-none"
                        />
                     </div>
                     <button
                        onClick={() => setIsAddingNew(true)}
                        className="btn-primary flex items-center gap-2"
                     >
                        <Plus size={20} />
                        Add Specialization
                     </button>
                  </div>

                  <div className="overflow-x-auto">
                     <DataTable columns={columns_0} data={filteredSpecializations} enableLocalSearch enableLocalPagination />
                  </div>

                  {filteredSpecializations.length === 0 && (
                     <div className="text-center py-8 text-gray-400">
                        No specializations found matching your search.
                     </div>
                  )}
               </div>
            )}

            {editingId && (
               <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-dark-secondary border border-dark-tertiary rounded p-6 max-w-md w-full mx-4">
                     <h3 className="text-xl font-semibold mb-4">
                        Edit Specialization
                     </h3>

                     <div className="space-y-4">
                        <div>
                           <label className="block text-mdfont-medium text-gray-300 mb-2">
                              Name
                           </label>
                           <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) =>
                                 setEditForm((prev) => ({ ...prev, name: e.target.value }))
                              }
                              className="input-field w-full"
                              placeholder="Specialization name"
                           />
                        </div>

                        <div>
                           <label className="block text-mdfont-medium text-gray-300 mb-2">
                              Description
                           </label>
                           <textarea
                              value={editForm.description}
                              onChange={(e) =>
                                 setEditForm((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                 }))
                              }
                              className="input-field w-full"
                              placeholder="Description"
                              rows={3}
                           />
                        </div>

                        <div>
                           <label className="block text-mdfont-medium text-gray-300 mb-2">
                              Department
                           </label>
                           <input
                              type="text"
                              value={editForm.department}
                              onChange={(e) =>
                                 setEditForm((prev) => ({
                                    ...prev,
                                    department: e.target.value,
                                 }))
                              }
                              className="input-field w-full"
                              placeholder="Department"
                           />
                        </div>

                        <div>
                           <label className="block text-mdfont-medium text-gray-300 mb-2">
                              Number of Doctors
                           </label>
                           <input
                              type="number"
                              value={editForm.doctorCount}
                              onChange={(e) =>
                                 setEditForm((prev) => ({
                                    ...prev,
                                    doctorCount: Number(e.target.value),
                                 }))
                              }
                              className="input-field w-full"
                              placeholder="0"
                              min="0"
                           />
                        </div>
                     </div>

                     <div className="flex gap-3 mt-6">
                        <button onClick={handleSaveEdit} className="flex-1 btn-primary">
                           Save
                        </button>
                        <button
                           onClick={() => setEditingId(null)}
                           className="flex-1 btn-secondary"
                        >
                           Cancel
                        </button>
                     </div>
                  </div>
               </div>
            )}

            {isAddingNew && (
               <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-dark-secondary border border-dark-tertiary rounded p-6 max-w-md w-full mx-4">
                     <h3 className="text-xl font-semibold mb-4">
                        Add New Specialization
                     </h3>

                     <div className="space-y-4">
                        <div>
                           <label className="block text-mdfont-medium text-gray-300 mb-2">
                              Name
                           </label>
                           <input
                              type="text"
                              value={newForm.name}
                              onChange={(e) =>
                                 setNewForm((prev) => ({ ...prev, name: e.target.value }))
                              }
                              className="input-field w-full"
                              placeholder="Specialization name"
                           />
                        </div>

                        <div>
                           <label className="block text-mdfont-medium text-gray-300 mb-2">
                              Description
                           </label>
                           <textarea
                              value={newForm.description}
                              onChange={(e) =>
                                 setNewForm((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                 }))
                              }
                              className="input-field w-full"
                              placeholder="Description"
                              rows={3}
                           />
                        </div>

                        <div>
                           <label className="block text-mdfont-medium text-gray-300 mb-2">
                              Department
                           </label>
                           <input
                              type="text"
                              value={newForm.department}
                              onChange={(e) =>
                                 setNewForm((prev) => ({
                                    ...prev,
                                    department: e.target.value,
                                 }))
                              }
                              className="input-field w-full"
                              placeholder="Department"
                           />
                        </div>

                        <div>
                           <label className="block text-mdfont-medium text-gray-300 mb-2">
                              Number of Doctors
                           </label>
                           <input
                              type="number"
                              value={newForm.doctorCount}
                              onChange={(e) =>
                                 setNewForm((prev) => ({
                                    ...prev,
                                    doctorCount: Number(e.target.value),
                                 }))
                              }
                              className="input-field w-full"
                              placeholder="0"
                              min="0"
                           />
                        </div>
                     </div>

                     <div className="flex gap-3 mt-6">
                        <button onClick={handleAddNew} className="flex-1 btn-primary">
                           Add
                        </button>
                        <button
                           onClick={() => setIsAddingNew(false)}
                           className="flex-1 btn-secondary"
                        >
                           Cancel
                        </button>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </>
   );
}
