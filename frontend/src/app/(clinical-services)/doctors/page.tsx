'use client';

import { useState, useEffect } from 'react';

import { doctorAPI, appointmentAPI } from '@/lib/api';
import { Plus, Search, Filter, Download, MoreVertical, Edit, Trash2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import DataTable, { Column } from "@/components/ui/DataTable";

interface Doctor {
   id: string;
   name: string;
   email: string;
   phone: string;
   specialization: string;
   experience: number;
   patients?: number;
   status?: string;
   avatar?: string;
}

export default function DoctorsPage() {
   const [doctors, setDoctors] = useState<Doctor[]>([]);
   const [search, setSearch] = useState('');
   const [page, setPage] = useState(1);
   const [total, setTotal] = useState(0);
   const [loading, setLoading] = useState(true);
   const [openMenuId, setOpenMenuId] = useState<string | null>(null);

   useEffect(() => {
      fetchDoctors();
   }, [page, search]);

   const fetchDoctors = async () => {
      try {
         setLoading(true);
         const response = await doctorAPI.list(page, 10, search);
         setDoctors(response.data.doctors);
         setTotal(response.data.total);
      } catch (error) {
         console.error('Failed to fetch doctors', error);
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async (id: string) => {
      if (confirm('Are you sure you want to delete this doctor?')) {
         try {
            await doctorAPI.delete(id);
            fetchDoctors();
         } catch (error) {
            console.error('Failed to delete doctor', error);
         }
      }
   };

   const columns_0: Column<any>[] = [
      {
         header: "Name", accessor: (doctor) => (<>\n<div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-semibold">
               {doctor.name.charAt(0)}
            </div>
            <span className="font-medium">{doctor.name}</span>
         </div>\n</>)
      },
      { header: "Specialty", accessor: "specialization" },
      {
         header: "Status", accessor: (doctor) => (<>\n<span className={`px-3 py-1 rounded-full text-xs font-medium ${doctor.status === 'On Leave'
            ? 'bg-yellow-500/20 text-yellow-500'
            : 'bg-emerald-500/20 text-emerald-500'
            }`}>
            {doctor.status || 'Active'}
         </span>\n</>)
      },
      { header: "Patients", accessor: (doctor) => (<>{doctor.patients || 0}</>) },
      { header: "Experience", accessor: (doctor) => (<>{doctor.experience}\nyears</>) },
      {
         header: "Contact", accessor: (doctor) => (<>\n<div className="text-gray-300">
            <div className="text-sm">{doctor.email}</div>
            <div className="text-xs text-gray-400">{doctor.phone}</div>
         </div>\n</>)
      },
      {
         header: "Actions", accessor: (doctor) => (<>\n<div className="flex items-center justify-center">
            <button
               onClick={() => setOpenMenuId(openMenuId === doctor.id ? null : doctor.id)}
               className="p-2 hover:bg-dark-tertiary rounded transition-colors"
            >
               <MoreVertical size={15} className="text-gray-400" />
            </button>

            {openMenuId === doctor.id && (
               <div className="absolute right-0 mt-2 w-40 bg-dark-secondary border border-dark-tertiary rounded shadow-lg z-10 top-full">
                  <Link href={`/doctors/edit/${doctor.id}`}>
                     <button className="w-full text-left p-2 hover:bg-dark-tertiary transition-colors flex items-center gap-2 text-gray-300 hover:text-white first:rounded-t-lg">
                        <Edit size={16} />
                        Edit
                     </button>
                  </Link>
                  <button
                     onClick={() => {
                        handleDelete(doctor.id);
                        setOpenMenuId(null);
                     }}
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
            <div className="flex justify-between items-center my-3 my-3">
               <div>
                  <h1 className="text-3xl  mb-2">Doctors</h1>
                  <p className="text-gray-400">Manage your medical staff and their information.</p>
               </div>
               <Link href="/doctors/add" className="btn-primary flex items-center gap-2">
                  <Plus size={20} />
                  Add Doctor
               </Link>
            </div>

            <div className="card">
               <div className="mb-6">
                  <h2 className="text-xl  mb-2">Doctors List</h2>
                  <p className="text-gray-400 text-sm">A list of all doctors in your clinic with their details.</p>
               </div>

               <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2 bg-dark-tertiary rounded px-4 flex-1 max-w-md">
                     <Search size={20} className="text-gray-400" />
                     <input
                        type="text"
                        placeholder="Search doctors..."
                        value={search}
                        onChange={(e) => {
                           setSearch(e.target.value);
                           setPage(1);
                        }}
                        className="bg-transparent py-3 flex-1 outline-none"
                     />
                  </div>
                  <div className="flex items-center gap-2">
                     <button className="p-3 bg-dark-tertiary hover:bg-dark-tertiary/80 rounded transition-colors">
                        <Filter size={20} />
                     </button>
                     <button className="p-3 bg-dark-tertiary hover:bg-dark-tertiary/80 rounded transition-colors">
                        <Download size={20} />
                     </button>
                  </div>
               </div>

               {loading ? (
                  <div className="text-center py-8 text-gray-400">Loading...</div>
               ) : (
                  <div className="overflow-x-auto">
                     <DataTable columns={columns_0} data={doctors} enableLocalSearch enableLocalPagination />
                  </div>
               )}

               {!loading && doctors.length > 0 && (
                  <div className="flex justify-between items-center my-3 my-3 mt-6 pt-4 border-t border-dark-tertiary">
                     <p className="text-gray-400 text-sm">
                        Showing {doctors.length > 0 ? (page - 1) * 10 + 1 : 0} to{" "}
                        {Math.min(page * 10, total)} of {total} doctors
                     </p>
                     <div className="flex gap-2">
                        <button
                           disabled={page === 1}
                           onClick={() => setPage(page - 1)}
                           className="p-2 bg-dark-tertiary rounded hover:bg-dark-tertiary/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                           Previous
                        </button>
                        <button
                           disabled={page * 10 >= total}
                           onClick={() => setPage(page + 1)}
                           className="p-2 bg-dark-tertiary rounded hover:bg-dark-tertiary/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                           Next
                        </button>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </>
   );
}
