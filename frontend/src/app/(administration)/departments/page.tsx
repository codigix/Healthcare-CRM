"use client";

import { useState, useEffect, useRef } from "react";
import {
   Search,
   Building2,
   Users,
   Stethoscope,
   Edit,
   Trash2,
   Plus,
   Eye,
   User,
   FileText,
   X,
} from "lucide-react";
import Link from "next/link";
import { departmentAPI } from "@/lib/api";
import DataTable, { Column } from "@/components/ui/DataTable";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Department {
   id: string;
   name: string;
   head: string;
   staffCount: number;
   services: number;
   status: "Active" | "Inactive";
   location: string;
   doctorsCount?: number;
   appointmentsToday?: number;
   description?: string;
}

interface Doctor {
   id: string;
   name: string;
   specialization: string;
   email: string;
}

interface Statistics {
   totalDepartments: number;
   activeDepartments: number;
   totalStaff: number;
   totalServices: number;
}

export default function DepartmentsPage() {
   const [searchQuery, setSearchQuery] = useState("");
   const [statusFilter, setStatusFilter] = useState("all");
   const [activeTab, setActiveTab] = useState("all");
   const [viewingId, setViewingId] = useState<string | null>(null);
   const [viewingDept, setViewingDept] = useState<any | null>(null);
   const [editingId, setEditingId] = useState<string | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [doctors, setDoctors] = useState<Doctor[]>([]);
   const [departments, setDepartments] = useState<Department[]>([]);

   const [statistics, setStatistics] = useState<Statistics>({
      totalDepartments: 0,
      activeDepartments: 0,
      totalStaff: 0,
      totalServices: 0,
   });

   const [editForm, setEditForm] = useState({
      name: "",
      head: "",
      status: "Active" as "Active" | "Inactive",
      description: "",
      assignedDoctors: [] as string[],
   });

   // Search selector state inside Edit Modal
   const [doctorSearch, setDoctorSearch] = useState("");
   const [showDropdown, setShowDropdown] = useState(false);
   const containerRef = useRef<HTMLDivElement>(null);

   const fetchData = async () => {
      try {
         setLoading(true);
         const [deptRes, statsRes] = await Promise.all([
            departmentAPI.list(1, 100),
            departmentAPI.getStatistics(),
         ]);

         setDepartments(deptRes.data.departments || []);
         setStatistics(statsRes.data);
         setError(null);
      } catch (err) {
         setError("Failed to fetch clinical departments");
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchData();

      // Fetch doctors for edit selection
      const fetchDoctors = async () => {
         try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/departments/doctors/list`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });
            if (response.ok) {
               const data = await response.json();
               setDoctors(data);
            }
         } catch (err) {
            console.error("Error loading doctors:", err);
         }
      };
      fetchDoctors();
   }, []);

   // Close search dropdown on outside clicks
   useEffect(() => {
      const handleOutsideClick = (e: MouseEvent) => {
         if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            setShowDropdown(false);
         }
      };
      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
   }, []);

   const getStatusColor = (status: string) => {
      switch (status) {
         case "Active":
            return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
         case "Inactive":
            return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
         default:
            return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
      }
   };

   const handleView = async (dept: Department) => {
      setViewingId(dept.id);
      try {
         const token = localStorage.getItem("token");
         const res = await fetch(`${API_URL}/departments/${dept.id}`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
         if (res.ok) {
            const data = await res.json();
            setViewingDept(data);
         } else {
            setViewingDept(dept);
         }
      } catch (err) {
         console.error("Failed to load department details for view:", err);
         setViewingDept(dept);
      }
   };

   const handleEdit = async (dept: Department) => {
      setEditingId(dept.id);
      setDoctorSearch("");
      setShowDropdown(false);
      try {
         const token = localStorage.getItem("token");
         const res = await fetch(`${API_URL}/departments/${dept.id}`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
         if (res.ok) {
            const data = await res.json();
            setEditForm({
               name: data.name,
               head: data.head || "",
               status: data.status as "Active" | "Inactive",
               description: data.description || "",
               assignedDoctors: data.assignedDoctors || [],
            });
         } else {
            setEditForm({
               name: dept.name,
               head: dept.head || "",
               status: dept.status,
               description: dept.description || "",
               assignedDoctors: [],
            });
         }
      } catch (err) {
         console.error("Failed to fetch department details for edit:", err);
         setEditForm({
            name: dept.name,
            head: dept.head || "",
            status: dept.status,
            description: dept.description || "",
            assignedDoctors: [],
         });
      }
   };

   const selectDoctorInEdit = (docId: string) => {
      setEditForm((prev) => ({
         ...prev,
         assignedDoctors: prev.assignedDoctors.includes(docId)
            ? prev.assignedDoctors
            : [...prev.assignedDoctors, docId],
      }));
      setDoctorSearch("");
      setShowDropdown(false);
   };

   const removeDoctorInEdit = (docId: string) => {
      setEditForm((prev) => ({
         ...prev,
         assignedDoctors: prev.assignedDoctors.filter((id) => id !== docId),
      }));
   };

   const handleSaveEdit = async () => {
      if (editingId && editForm.name) {
         try {
            const payload = {
               name: editForm.name,
               head: editForm.head,
               location: "Main Block",
               status: editForm.status,
               description: editForm.description,
               assignedDoctors: editForm.assignedDoctors,
            };

            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/departments/${editingId}`, {
               method: "PUT",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to save changes");

            setEditingId(null);
            fetchData();
         } catch (err) {
            console.error("Failed to update department", err);
         }
      }
   };

   const handleDelete = async (id: string) => {
      if (confirm("Are you sure you want to delete this clinical department? Any assigned doctors will be unassigned.")) {
         try {
            await departmentAPI.delete(id);
            setDepartments((prev) => prev.filter((dept) => dept.id !== id));
            fetchData();
         } catch (err) {
            console.error("Failed to delete department", err);
         }
      }
   };

   const filteredDepartments = departments.filter((dept) => {
      const matchesSearch =
         dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         (dept.head && dept.head.toLowerCase().includes(searchQuery.toLowerCase())) ||
         (dept.description && dept.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
         statusFilter === "all" || dept.status === statusFilter;

      const matchesTab =
         activeTab === "all" ||
         (activeTab === "active" && dept.status === "Active") ||
         (activeTab === "inactive" && dept.status === "Inactive");

      return matchesSearch && matchesStatus && matchesTab;
   });

   // Filter dropdown doctors for the Edit modal based on search & exclude assigned
   const availableDropdownDoctorsInEdit = doctors.filter((doc) => {
      const matchesSearch =
         doc.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
         doc.specialization.toLowerCase().includes(doctorSearch.toLowerCase());
      const isAlreadyAssigned = editForm.assignedDoctors.includes(doc.id);
      return matchesSearch && !isAlreadyAssigned;
   });

   const columns_0: Column<any>[] = [
      {
         header: "Department Name", accessor: (dept) => (<>\n<div className="font-semibold text-white">{dept.name}</div>\n\n<div className="text-xs text-gray-500 mt-1 max-w-[280px] truncate">
            {dept.description || "No description provided"}
         </div>\n</>)
      },
      {
         header: "Department Head", accessor: (dept) => (<>\n{dept.head ? (
            <div className="text-white text-sm flex items-center gap-1.5">
               <User size={14} className="text-emerald-400" />
               {dept.head}
            </div>
         ) : (
            <span className="text-gray-500 text-xs italic">Not Assigned</span>
         )}\n</>)
      },
      { header: "Doctors Count", accessor: (dept) => (<>\n{dept.doctorsCount !== undefined ? dept.doctorsCount : dept.staffCount}\n</>) },
      {
         header: "Appointments Today", accessor: (dept) => (<>\n{dept.appointmentsToday && dept.appointmentsToday > 0 ? (
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full text-xs  shadow-sm">
               {dept.appointmentsToday} Today
            </span>
         ) : (
            <span className="text-gray-600 text-xs">0 Today</span>
         )}\n</>)
      },
      {
         header: "Status", accessor: (dept) => (<>\n<span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
               dept.status
            )}`}
         >
            {dept.status}
         </span>\n</>)
      },
      {
         header: "Actions", accessor: (dept) => (<>\n<div className="flex items-center justify-end gap-2">
            <button
               onClick={() => handleView(dept)}
               className="p-1.5 bg-dark-tertiary/30 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 rounded transition-all"
               title="View Department details"
            >
               <Eye size={15} />
            </button>
            <button
               onClick={() => handleEdit(dept)}
               className="p-1.5 bg-dark-tertiary/30 hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-400 rounded transition-all"
               title="Edit Department"
            >
               <Edit size={15} />
            </button>
            <button
               onClick={() => handleDelete(dept.id)}
               className="p-1.5 bg-dark-tertiary/30 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded transition-all"
               title="Delete Department"
            >
               <Trash2 size={15} />
            </button>
         </div>\n</>)
      },
   ];


   return (
      <>
         <div className="space-y-6">
            <div className="flex justify-between items-center my-3 my-3">
               <div>
                  <h1 className="text-3xl  mb-2 text-white">Department Management</h1>
                  <p className="text-gray-400">
                     Manage clinical specialty departments and medical doctor assignments
                  </p>
               </div>
               <div>
                  <Link href="/departments/add" className="btn-primary flex items-center gap-2 p-2.5 rounded shadow-lg hover:shadow-emerald-500/10">
                     <Plus size={20} />
                     Add Department
                  </Link>
               </div>
            </div>

            {loading && departments.length === 0 ? (
               <div className="text-center py-8">
                  <p className="text-gray-400">Loading departments...</p>
               </div>
            ) : error ? (
               <div className="bg-red-500/10 border border-red-500/20 rounded p-4 text-red-400">
                  {error}
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="card bg-dark-secondary border border-dark-tertiary p-6 rounded">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded flex items-center justify-center">
                           <Building2 className="text-blue-500" size={24} />
                        </div>
                        <div>
                           <div className="text-2xl  text-white">
                              {statistics.totalDepartments}
                           </div>
                           <div className="text-sm text-gray-400">Total Departments</div>
                           <div className="text-xs text-blue-400 mt-1">
                              {statistics.activeDepartments} Active specialties
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="card bg-dark-secondary border border-dark-tertiary p-6 rounded">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded flex items-center justify-center">
                           <Users className="text-emerald-500" size={24} />
                        </div>
                        <div>
                           <div className="text-2xl  text-white">
                              {statistics.totalStaff}
                           </div>
                           <div className="text-sm text-gray-400">Assigned Doctors</div>
                           <div className="text-xs text-emerald-400 mt-1">
                              Across clinical departments
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="card bg-dark-secondary border border-dark-tertiary p-6 rounded">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-500/10 rounded flex items-center justify-center">
                           <Stethoscope className="text-purple-500" size={24} />
                        </div>
                        <div>
                           <div className="text-2xl  text-white">
                              {statistics.totalServices}
                           </div>
                           <div className="text-sm text-gray-400">Active Services</div>
                           <div className="text-xs text-purple-400 mt-1">
                              Department-specific treatments
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            <div className="card bg-dark-secondary border border-dark-tertiary p-6 rounded">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                     <h2 className="text-xl font-semibold text-white">Hospital Department Registry</h2>
                     <p className="text-gray-400 text-sm mt-1">
                        View hospital clinical departments, active staff, and today's appointments
                     </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                     <div className="flex items-center gap-2 p-2 bg-dark-tertiary/30 border border-dark-tertiary rounded w-full md:w-64">
                        <Search size={15} className="text-gray-400" />
                        <input
                           type="text"
                           placeholder="Search departments..."
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="bg-transparent flex-1 outline-none text-white text-sm"
                        />
                     </div>
                     <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input-field py-2 bg-dark-tertiary/30"
                     >
                        <option value="all">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                     </select>
                  </div>
               </div>

               <div className="flex gap-4 mb-6 border-b border-dark-tertiary">
                  <button
                     onClick={() => setActiveTab("all")}
                     className={`pb-3 px-1 font-medium text-sm transition-colors ${activeTab === "all"
                        ? "text-emerald-500 border-b-2 border-emerald-500"
                        : "text-gray-400 hover:text-gray-300"
                        }`}
                  >
                     All Specialties
                  </button>
                  <button
                     onClick={() => setActiveTab("active")}
                     className={`pb-3 px-1 font-medium text-sm transition-colors ${activeTab === "active"
                        ? "text-emerald-500 border-b-2 border-emerald-500"
                        : "text-gray-400 hover:text-gray-300"
                        }`}
                  >
                     Active
                  </button>
                  <button
                     onClick={() => setActiveTab("inactive")}
                     className={`pb-3 px-1 font-medium text-sm transition-colors ${activeTab === "inactive"
                        ? "text-emerald-500 border-b-2 border-emerald-500"
                        : "text-gray-400 hover:text-gray-300"
                        }`}
                  >
                     Inactive
                  </button>
               </div>

               <div className="overflow-x-auto">
                  <DataTable columns={columns_0} data={filteredDepartments} enableLocalSearch enableLocalPagination />
               </div>
            </div>

            {/* VIEW MODAL */}
            {viewingId && viewingDept && (
               <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
                  <div className="bg-dark-secondary border border-dark-tertiary rounded p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                           <h3 className="text-2xl  text-white mb-1">
                              {viewingDept.name}
                           </h3>
                           <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                                 viewingDept.status
                              )}`}
                           >
                              {viewingDept.status}
                           </span>
                        </div>
                        <button
                           onClick={() => { setViewingId(null); setViewingDept(null); }}
                           className="text-gray-400 hover:text-white font-semibold text-lg"
                        >
                           &times;
                        </button>
                     </div>

                     <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-dark-tertiary/20 p-3 rounded border border-dark-tertiary/30">
                              <span className="block text-xs font-medium text-gray-400 mb-1">Department Head</span>
                              <span className="text-white text-sm font-semibold flex items-center gap-1.5">
                                 <User size={14} className="text-emerald-400" />
                                 {viewingDept.head || "Not Assigned"}
                              </span>
                           </div>

                           <div className="bg-dark-tertiary/20 p-3 rounded border border-dark-tertiary/30">
                              <span className="block text-xs font-medium text-gray-400 mb-1">Total Assigned Doctors</span>
                              <span className="text-white text-sm  flex items-center gap-1.5">
                                 <Users size={14} className="text-blue-400" />
                                 {viewingDept.assignedDoctors ? viewingDept.assignedDoctors.length : (viewingDept.doctorsCount || viewingDept.staffCount || 0)}
                              </span>
                           </div>
                        </div>

                        <div>
                           <label className="block text-xs font-medium text-gray-400 mb-2">Description</label>
                           <p className="text-gray-300 text-sm bg-dark-tertiary/10 p-3 rounded border border-dark-tertiary/20 leading-relaxed">
                              {viewingDept.description || "No description provided for this clinical department."}
                           </p>
                        </div>

                        {viewingDept.assignedDoctors && viewingDept.assignedDoctors.length > 0 && (
                           <div>
                              <label className="block text-xs font-medium text-gray-400 mb-2">
                                 Assigned Medical Specialists ({viewingDept.assignedDoctors.length})
                              </label>
                              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                                 {doctors
                                    .filter((doc) => viewingDept.assignedDoctors.includes(doc.id))
                                    .map((doc) => (
                                       <div
                                          key={doc.id}
                                          className="flex justify-between items-center my-3 my-3 p-2.5 bg-dark-tertiary/30 border border-dark-tertiary/30 rounded text-sm"
                                       >
                                          <span className="text-white font-medium">{doc.name}</span>
                                          <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">
                                             {doc.specialization}
                                          </span>
                                       </div>
                                    ))}
                              </div>
                           </div>
                        )}
                     </div>

                     <div className="flex gap-3 mt-6 pt-4 border-t border-dark-tertiary">
                        <button
                           onClick={() => { setViewingId(null); setViewingDept(null); }}
                           className="flex-1 btn-secondary py-2 rounded text-sm"
                        >
                           Close
                        </button>
                     </div>
                  </div>
               </div>
            )}

            {/* EDIT MODAL */}
            {editingId && (
               <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
                  <div className="bg-dark-secondary border border-dark-tertiary rounded p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                           <h3 className="text-xl  text-white">Edit Clinical Department</h3>
                           <p className="text-gray-400 text-xs mt-0.5">Update specialty details and staff assignments</p>
                        </div>
                        <button
                           onClick={() => setEditingId(null)}
                           className="text-gray-400 hover:text-white font-semibold text-lg"
                        >
                           &times;
                        </button>
                     </div>

                     <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                              <label className="block text-xs font-medium text-gray-300 mb-2">
                                 Department Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                 type="text"
                                 value={editForm.name}
                                 onChange={(e) =>
                                    setEditForm((prev) => ({ ...prev, name: e.target.value }))
                                 }
                                 className="input-field w-full"
                                 placeholder="e.g. Cardiology"
                              />
                           </div>

                           <div>
                              <label className="block text-xs font-medium text-gray-300 mb-2">
                                 Department Head <span className="text-gray-500">(Optional)</span>
                              </label>
                              <select
                                 value={editForm.head}
                                 onChange={(e) =>
                                    setEditForm((prev) => ({ ...prev, head: e.target.value }))
                                 }
                                 className="input-field w-full"
                              >
                                 <option value="">Select Department Head (Optional)</option>
                                 {doctors.map((doctor) => (
                                    <option key={doctor.id} value={doctor.name}>
                                       {doctor.name} - {doctor.specialization}
                                    </option>
                                 ))}
                              </select>
                           </div>

                           <div>
                              <label className="block text-xs font-medium text-gray-300 mb-2">
                                 Status
                              </label>
                              <select
                                 value={editForm.status}
                                 onChange={(e) =>
                                    setEditForm((prev) => ({
                                       ...prev,
                                       status: e.target.value as "Active" | "Inactive",
                                    }))
                                 }
                                 className="input-field w-full"
                              >
                                 <option value="Active">Active</option>
                                 <option value="Inactive">Inactive</option>
                              </select>
                           </div>
                        </div>

                        <div>
                           <label className="block text-xs font-medium text-gray-300 mb-2">
                              Description
                           </label>
                           <textarea
                              value={editForm.description}
                              onChange={(e) =>
                                 setEditForm((prev) => ({ ...prev, description: e.target.value }))
                              }
                              className="input-field w-full min-h-[80px]"
                              placeholder="Provide department description..."
                              rows={3}
                           />
                        </div>

                        {/* Searchable Assign Doctors section inside Edit Modal */}
                        <div className="border-t border-dark-tertiary/40 pt-4">
                           <div className="flex justify-between items-center my-3 my-3 mb-3">
                              <label className="block text-xs font-medium text-gray-300">
                                 Assign Specialists
                              </label>
                              <span className="text-xs text-emerald-400 font-semibold">
                                 Total Assigned: {editForm.assignedDoctors.length}
                              </span>
                           </div>

                           <div className="space-y-4">
                              {/* Search container inside modal */}
                              <div ref={containerRef} className="relative max-w-md">
                                 <div className="relative">
                                    <Search
                                       className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                       size={16}
                                    />
                                    <input
                                       type="text"
                                       placeholder="Search doctor to assign..."
                                       value={doctorSearch}
                                       onChange={(e) => {
                                          setDoctorSearch(e.target.value);
                                          setShowDropdown(true);
                                       }}
                                       onFocus={() => setShowDropdown(true)}
                                       className="input-field w-full text-sm py-1.5"
                                       style={{ paddingLeft: "2.5rem" }}
                                    />
                                 </div>

                                 {/* Dropdown Options inside modal */}
                                 {showDropdown && (
                                    <div className="absolute left-0 right-0 mt-1 max-h-[160px] overflow-y-auto bg-dark-secondary border border-dark-tertiary rounded shadow-2xl z-30">
                                       {availableDropdownDoctorsInEdit.length === 0 ? (
                                          <div className="p-2.5 text-center text-xs text-gray-500">
                                             {doctorSearch ? "No matching available doctors" : "All registered doctors already assigned"}
                                          </div>
                                       ) : (
                                          availableDropdownDoctorsInEdit.map((doctor) => (
                                             <div
                                                key={doctor.id}
                                                onClick={() => selectDoctorInEdit(doctor.id)}
                                                className="p-2.5 hover:bg-emerald-500/10 cursor-pointer transition-colors border-b border-dark-tertiary/20 last:border-0 text-gray-300 flex justify-between items-center my-3 my-3 text-xs"
                                             >
                                                <div>
                                                   <span className="font-semibold text-white">{doctor.name}</span>
                                                   <span className="text-gray-400 text-[10px] ml-1.5">({doctor.specialization})</span>
                                                </div>
                                                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                                                   + Assign
                                                </span>
                                             </div>
                                          ))
                                       )}
                                    </div>
                                 )}
                              </div>

                              {/* Removable Specialists Cards underneath */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[160px] overflow-y-auto p-2 bg-dark-tertiary/10 border border-dark-tertiary/30 rounded">
                                 {editForm.assignedDoctors.length === 0 ? (
                                    <div className="col-span-full text-center text-gray-500 text-xs py-6">
                                       No doctors assigned to this department. Search above to add specialists.
                                    </div>
                                 ) : (
                                    doctors
                                       .filter((doc) => editForm.assignedDoctors.includes(doc.id))
                                       .map((doc) => (
                                          <div
                                             key={doc.id}
                                             className="flex items-center justify-between p-2.5 bg-dark-tertiary/30 border border-emerald-500/20 hover:border-emerald-500/40 rounded transition-all"
                                          >
                                             <div className="min-w-0">
                                                <div className="font-semibold text-white text-xs truncate">{doc.name}</div>
                                                <div className="text-[10px] text-gray-400 truncate">{doc.specialization}</div>
                                             </div>
                                             <button
                                                type="button"
                                                onClick={() => removeDoctorInEdit(doc.id)}
                                                className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all flex items-center justify-center"
                                                title="Remove assignment"
                                             >
                                                <X size={14} />
                                             </button>
                                          </div>
                                       ))
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="flex gap-3 mt-6 pt-4 border-t border-dark-tertiary">
                        <button
                           onClick={() => setEditingId(null)}
                           className="flex-1 btn-secondary py-2.5 rounded text-sm"
                        >
                           Cancel
                        </button>
                        <button
                           onClick={handleSaveEdit}
                           className="flex-1 btn-primary py-2.5 rounded text-sm shadow-md hover:shadow-emerald-500/10"
                        >
                           Save Changes
                        </button>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </>
   );
}
