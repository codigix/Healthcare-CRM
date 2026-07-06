"use client";

import { useState, useEffect } from "react";

import {
   Search,
   Users,
   UserCheck,
   UserX,
   Clock,
   Mail,
   Phone,
   MoreVertical,
   Eye,
   Edit2,
   Trash2,
   X,
} from "lucide-react";
import Link from "next/link";
import DataTable, { Column } from "@/components/ui/DataTable";

interface StaffMember {
   id: string;
   firstName: string;
   lastName: string;
   role: string;
   department: string;
   email: string;
   phone: string;
   joinedDate: string;
   status: "Active" | "On Leave" | "Inactive";
}

export default function StaffPage() {
   const [searchQuery, setSearchQuery] = useState("");
   const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
   const [loading, setLoading] = useState(true);
   const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
   const [viewModal, setViewModal] = useState(false);
   const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
   const [error, setError] = useState("");

   useEffect(() => {
      fetchStaff();
   }, []);

   const fetchStaff = async () => {
      try {
         setLoading(true);
         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
         });
         if (response.ok) {
            const data = await response.json();
            setStaffMembers(data.staff);
         }
      } catch (err) {
         setError("Failed to fetch staff");
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async (id: string) => {
      try {
         const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/staff/${id}`,
            {
               method: "DELETE",
               headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
               },
            }
         );
         if (response.ok) {
            setStaffMembers(staffMembers.filter((s) => s.id !== id));
            setDeleteConfirm(null);
         }
      } catch (err) {
         console.error(err);
      }
   };

   const getStatusColor = (status: string) => {
      switch (status) {
         case "Active":
            return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
         case "On Leave":
            return "bg-orange-500/10 text-orange-500 border border-orange-500/20";
         case "Inactive":
            return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
         default:
            return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
      }
   };

   const filteredStaff = staffMembers.filter(
      (staff) =>
         `${staff.firstName} ${staff.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
         staff.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
         staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
         staff.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
         staff.email.toLowerCase().includes(searchQuery.toLowerCase())
   );

   const totalStaff = staffMembers.length;
   const activeStaff = staffMembers.filter((s) => s.status === "Active").length;
   const onLeave = staffMembers.filter((s) => s.status === "On Leave").length;
   const inactive = staffMembers.filter((s) => s.status === "Inactive").length;

   const columns_0: Column<any>[] = [
      {
         header: "Name", accessor: (staff) => (<>\n<div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center font-semibold text-emerald-500 text-sm">
               {`${staff.firstName[0]}${staff.lastName[0]}`}
            </div>
            <div>
               <div className="text-white font-medium">
                  {staff.firstName} {staff.lastName}
               </div>
               <div className="text-xs text-gray-400">
                  {staff.id}
               </div>
            </div>
         </div>\n</>)
      },
      { header: "Role", accessor: "role" },
      { header: "Department", accessor: (staff) => (<>\n{staff.department}\n</>) },
      {
         header: "Contact", accessor: (staff) => (<>\n<div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-mdtext-gray-400">
               <Mail size={14} />
               <span>{staff.email}</span>
            </div>
            <div className="flex items-center gap-2 text-mdtext-gray-400">
               <Phone size={14} />
               <span>{staff.phone}</span>
            </div>
         </div>\n</>)
      },
      { header: "Joined", accessor: (staff) => (<>\n{new Date(staff.joinedDate).toLocaleDateString()}\n</>) },
      {
         header: "Status", accessor: (staff) => (<>\n<span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
               staff.status
            )}`}
         >
            {staff.status}
         </span>\n</>)
      },
      {
         header: "Actions", accessor: (staff) => (<>\n<div className="flex items-center gap-2">
            <button
               onClick={() => {
                  setSelectedStaff(staff);
                  setViewModal(true);
               }}
               suppressHydrationWarning
               className="p-2 hover:bg-gray-500/20 rounded transition-colors"
               title="View"
            >
               <Eye size={15} className="text-blue-400" />
            </button>
            <Link
               href={`/staff/edit/${staff.id}`}
               className="p-2 hover:bg-gray-500/20 rounded transition-colors"
               title="Edit"
            >
               <Edit2 size={15} className="text-emerald-400" />
            </Link>
            <button
               onClick={() => setDeleteConfirm(staff.id)}
               suppressHydrationWarning
               className="p-2 hover:bg-gray-500/20 rounded transition-colors"
               title="Delete"
            >
               <Trash2 size={15} className="text-red-400" />
            </button>
         </div>\n</>)
      },
   ];


   return (
      <>
         <div className="space-y-6">
            <div className="flex justify-between items-center my-3 my-3">
               <div>
                  <h1 className="text-3xl  mb-2">Staff Management</h1>
                  <p className="text-gray-400">
                     Manage clinic staff, roles, and permissions
                  </p>
               </div>
               <div className="flex gap-3">
                  <Link href="/staff/add" className="btn-primary">
                     + Add New Staff
                  </Link>
                  <button className="btn-secondary" suppressHydrationWarning>More Options</button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="card">
                  <div className="flex items-center gap-2">
                     <div className="w-12 h-12 bg-blue-500/10 rounded flex items-center justify-center">
                        <Users className="text-blue-500" size={24} />
                     </div>
                     <div>
                        <div className="text-2xl ">{totalStaff}</div>
                        <div className="text-mdtext-gray-400">Total Staff</div>
                     </div>
                  </div>
               </div>

               <div className="card">
                  <div className="flex items-center gap-2">
                     <div className="w-12 h-12 bg-emerald-500/10 rounded flex items-center justify-center">
                        <UserCheck className="text-emerald-500" size={24} />
                     </div>
                     <div>
                        <div className="text-2xl ">{activeStaff}</div>
                        <div className="text-mdtext-gray-400">Active</div>
                        <div className="text-xs text-emerald-500">
                           {((activeStaff / totalStaff) * 100).toFixed(0)}%
                        </div>
                     </div>
                  </div>
               </div>

               <div className="card">
                  <div className="flex items-center gap-2">
                     <div className="w-12 h-12 bg-orange-500/10 rounded flex items-center justify-center">
                        <Clock className="text-orange-500" size={24} />
                     </div>
                     <div>
                        <div className="text-2xl ">{onLeave}</div>
                        <div className="text-mdtext-gray-400">On Leave</div>
                        <div className="text-xs text-orange-500">
                           {((onLeave / totalStaff) * 100).toFixed(0)}%
                        </div>
                     </div>
                  </div>
               </div>

               <div className="card">
                  <div className="flex items-center gap-2">
                     <div className="w-12 h-12 bg-gray-500/10 rounded flex items-center justify-center">
                        <UserX className="text-gray-400" size={24} />
                     </div>
                     <div>
                        <div className="text-2xl ">{inactive}</div>
                        <div className="text-mdtext-gray-400">Inactive</div>
                        <div className="text-xs text-gray-400">
                           {((inactive / totalStaff) * 100).toFixed(0)}%
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="card">
               <div className="flex items-center gap-2 mb-6 pb-4 border-b border-dark-tertiary">
                  <Search size={20} className="text-gray-400" />
                  <input
                     type="text"
                     placeholder="Search staff..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="bg-transparent flex-1 outline-none"
                  />
               </div>

               <h2 className="text-xl font-semibold mb-4">Staff Directory</h2>
               <p className="text-gray-400 text-mdmb-6">
                  Showing {filteredStaff.length} of {staffMembers.length} staff
                  members
               </p>

               {loading ? (
                  <div className="text-center py-8 text-gray-400">
                     Loading staff data...
                  </div>
               ) : error ? (
                  <div className="text-center py-8 text-red-500">{error}</div>
               ) : (
                  <div className="overflow-x-auto">
                     <DataTable columns={columns_0} data={filteredStaff} enableLocalSearch enableLocalPagination />
                  </div>
               )}
            </div>

            {viewModal && selectedStaff && (
               <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-dark-secondary rounded p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                     <div className="flex justify-between items-center my-3 my-3 mb-4">
                        <h2 className="text-2xl ">
                           {selectedStaff.firstName} {selectedStaff.lastName}
                        </h2>
                        <button
                           onClick={() => setViewModal(false)}
                           suppressHydrationWarning
                           className="p-1 hover:bg-dark-tertiary rounded"
                        >
                           <X size={24} />
                        </button>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <p className="text-gray-400 text-sm">Email</p>
                           <p className="text-white font-medium">
                              {selectedStaff.email}
                           </p>
                        </div>
                        <div>
                           <p className="text-gray-400 text-sm">Phone</p>
                           <p className="text-white font-medium">
                              {selectedStaff.phone}
                           </p>
                        </div>
                        <div>
                           <p className="text-gray-400 text-sm">Role</p>
                           <p className="text-white font-medium">{selectedStaff.role}</p>
                        </div>
                        <div>
                           <p className="text-gray-400 text-sm">Department</p>
                           <p className="text-white font-medium">
                              {selectedStaff.department}
                           </p>
                        </div>
                        <div>
                           <p className="text-gray-400 text-sm">Status</p>
                           <p className="text-white font-medium">
                              {selectedStaff.status}
                           </p>
                        </div>
                        <div>
                           <p className="text-gray-400 text-sm">Joined Date</p>
                           <p className="text-white font-medium">
                              {new Date(selectedStaff.joinedDate).toLocaleDateString()}
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {deleteConfirm && (
               <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-dark-secondary rounded p-6 max-w-sm w-full mx-4">
                     <h2 className="text-xl  mb-4">Confirm Delete</h2>
                     <p className="text-gray-400 mb-6">
                        Are you sure you want to delete this staff member? This action
                        cannot be undone.
                     </p>
                     <div className="flex gap-3">
                        <button
                           onClick={() => setDeleteConfirm(null)}
                           suppressHydrationWarning
                           className="flex-1 btn-secondary"
                        >
                           Cancel
                        </button>
                        <button
                           onClick={() => handleDelete(deleteConfirm)}
                           suppressHydrationWarning
                           className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors"
                        >
                           Delete
                        </button>
                     </div>
                  </div>
               </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="card">
                  <h2 className="text-xl font-semibold mb-4">Staff Overview</h2>
                  <div className="flex items-center justify-center gap-3 mb-4">
                     <Users className="text-purple-500" size={48} />
                     <div>
                        <div className="text-4xl ">{totalStaff}</div>
                        <div className="text-mdtext-gray-400">Total Staff</div>
                     </div>
                  </div>
                  <p className="text-gray-400 text-mdtext-center">
                     View all suppliers
                  </p>
               </div>

               <div className="card">
                  <h2 className="text-xl font-semibold mb-4">Departments</h2>
                  <div className="space-y-3">
                     <div className="flex items-center justify-between p-3 bg-dark-tertiary/30 rounded">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                           <span className="text-sm">Medical</span>
                        </div>
                        <span className="text-mdfont-semibold">12</span>
                     </div>
                     <div className="flex items-center justify-between p-3 bg-dark-tertiary/30 rounded">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                           <span className="text-sm">Nursing</span>
                        </div>
                        <span className="text-mdfont-semibold">18</span>
                     </div>
                     <div className="flex items-center justify-between p-3 bg-dark-tertiary/30 rounded">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                           <span className="text-sm">Administration</span>
                        </div>
                        <span className="text-mdfont-semibold">8</span>
                     </div>
                     <div className="flex items-center justify-between p-3 bg-dark-tertiary/30 rounded">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                           <span className="text-sm">Laboratory</span>
                        </div>
                        <span className="text-mdfont-semibold">5</span>
                     </div>
                     <div className="flex items-center justify-between p-3 bg-dark-tertiary/30 rounded">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                           <span className="text-sm">Pharmacy</span>
                        </div>
                        <span className="text-mdfont-semibold">4</span>
                     </div>
                     <div className="flex items-center justify-between p-3 bg-dark-tertiary/30 rounded">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                           <span className="text-sm">Radiology</span>
                        </div>
                        <span className="text-mdfont-semibold">3</span>
                     </div>
                     <div className="flex items-center justify-between p-3 bg-dark-tertiary/30 rounded">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                           <span className="text-sm">Therapy</span>
                        </div>
                        <span className="text-mdfont-semibold">4</span>
                     </div>
                     <div className="flex items-center justify-between p-3 bg-dark-tertiary/30 rounded">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                           <span className="text-sm">Support</span>
                        </div>
                        <span className="text-mdfont-semibold">9</span>
                     </div>
                  </div>
                  <button className="mt-4 w-full btn-secondary text-sm" suppressHydrationWarning>
                     Manage Departments
                  </button>
               </div>
            </div>

            <div className="card">
               <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link
                     href="/staff/add"
                     className="p-4 bg-dark-tertiary/30 rounded hover:bg-dark-tertiary/50 transition-colors flex items-center gap-2"
                  >
                     <Users className="text-emerald-500" size={24} />
                     <div>
                        <div className="font-semibold">Add New Staff</div>
                        <div className="text-mdtext-gray-400">
                           Create a new staff member profile
                        </div>
                     </div>
                  </Link>
                  <Link
                     href="/staff/roles"
                     className="p-4 bg-dark-tertiary/30 rounded hover:bg-dark-tertiary/50 transition-colors flex items-center gap-2"
                  >
                     <UserCheck className="text-blue-500" size={24} />
                     <div>
                        <div className="font-semibold">Manage Roles</div>
                        <div className="text-mdtext-gray-400">
                           Configure staff roles and permissions
                        </div>
                     </div>
                  </Link>
                  <Link
                     href="/staff/attendance"
                     className="p-4 bg-dark-tertiary/30 rounded hover:bg-dark-tertiary/50 transition-colors flex items-center gap-2"
                  >
                     <Clock className="text-orange-500" size={24} />
                     <div>
                        <div className="font-semibold">View Attendance</div>
                        <div className="text-mdtext-gray-400">
                           Track staff attendance records
                        </div>
                     </div>
                  </Link>
               </div>
            </div>
         </div>
      </>
   );
}
