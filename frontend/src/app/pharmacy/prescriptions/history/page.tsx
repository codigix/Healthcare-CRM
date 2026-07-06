"use client";

import { useState, useEffect } from "react";
import { prescriptionAPI } from "@/lib/api";
import { Clipboard, ArrowLeft, RefreshCw, Loader, Search, Eye, Pill, Calendar } from "lucide-react";
import Link from "next/link";
import DataTable, { Column } from "@/components/ui/DataTable";

interface Prescription {
   id: string;
   patientId: string;
   doctorId: string;
   prescriptionDate: string;
   prescriptionType: string;
   diagnosis: string;
   status: string;
   medications: string; // JSON string
   patient?: { name: string; uhid?: string };
   doctor?: { name: string };
}

export default function PrescriptionHistoryPage() {
   const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [searchQuery, setSearchQuery] = useState("");
   const [viewDetails, setViewDetails] = useState<Prescription | null>(null);

   useEffect(() => {
      fetchPrescriptionHistory();
   }, []);

   const fetchPrescriptionHistory = async () => {
      try {
         setLoading(true);
         setError("");
         const response = await prescriptionAPI.list(1, 100);
         setPrescriptions(response.data.prescriptions || []);
      } catch (err) {
         console.error("Failed to load history:", err);
         setError("Failed to fetch prescription history");
      } finally {
         setLoading(false);
      }
   };

   // Filter history based on patient name search
   const filteredHistory = prescriptions.filter((p) => {
      const patientName = p.patient?.name?.toLowerCase() || "";
      return patientName.includes(searchQuery.toLowerCase());
   });

   const parseMedications = (medStr: string) => {
      try {
         return JSON.parse(medStr) || [];
      } catch (e) {
         return [];
      }
   };

   const columns_0: Column<any>[] = [
      { header: "Patient", accessor: (item) => (<>\n{item.patient?.name || "Unregistered Patient"}\n</>) },
      { header: "Attending Doctor", accessor: (item) => (<>\n{item.doctor?.name || "Dr. MedixPro Staff"}\n</>) },
      { header: "Date", accessor: (item) => (<>\n{new Date(item.prescriptionDate).toLocaleDateString()}\n</>) },
      { header: "Type", accessor: (item) => (<>\n{item.prescriptionType}\n</>) },
      {
         header: "Status", accessor: (item) => (<>\n<span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === "Dispensed"
               ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
               : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
               }`}
         >
            {item.status}
         </span>\n</>)
      },
      {
         header: "Action", accessor: (item) => (<>\n<button
            onClick={() => setViewDetails(item)}
            className="p-2 bg-card/5 border border-white/5 rounded hover:bg-[#1abc9c]/20 hover:text-[#1abc9c] transition-colors"
         >
            <Eye size={16} />
         </button>\n</>)
      },
   ];


   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center my-3 my-3">
            <div className="flex items-center gap-4">
               <Link
                  href="/dashboard/pharmacy"
                  className="p-2 hover:bg-dark-tertiary rounded transition-colors"
               >
                  <ArrowLeft size={24} />
               </Link>
               <div>
                  <h1 className="text-3xl ">Prescription History</h1>
                  <p className="text-gray-400">Search and audit completed clinical prescriptions, patient medications, and history logs</p>
               </div>
            </div>
            <button
               onClick={fetchPrescriptionHistory}
               className="btn-secondary flex items-center gap-2"
            >
               <RefreshCw size={15} /> Refresh Logs
            </button>
         </div>

         <div className="card">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
               <Search size={20} className="text-gray-400" />
               <input
                  type="text"
                  placeholder="Search by Patient Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent flex-1 outline-none text-white text-md"
               />
            </div>

            {loading ? (
               <div className="flex justify-center items-center h-64">
                  <Loader className="animate-spin text-emerald-500" size={32} />
               </div>
            ) : error ? (
               <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-2 rounded">
                  {error}
               </div>
            ) : filteredHistory.length === 0 ? (
               <div className="text-center py-12 text-gray-500">No prescription records found matching search query.</div>
            ) : (
               <div className="overflow-x-auto">
                  <DataTable columns={columns_0} data={filteredHistory} enableLocalSearch enableLocalPagination />
               </div>
            )}
         </div>

         {/* Details View Modal */}
         {viewDetails && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
               <div className="bg-[#1e1f27] border border-white/10 rounded-2xl p-6 w-full max-w-xl relative animate-scaleUp">
                  <h3 className="text-xl  text-white mb-4 pb-3 border-b border-white/5 flex items-center gap-2">
                     <Clipboard className="text-[#1abc9c]" size={20} />
                     Prescription Audit Details
                  </h3>

                  <div className="space-y-4 text-sm max-h-[400px] overflow-y-auto">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <span className="text-gray-500 block text-xs">Patient</span>
                           <span className="text-white ">{viewDetails.patient?.name}</span>
                        </div>
                        <div>
                           <span className="text-gray-500 block text-xs">Attending Doctor</span>
                           <span className="text-white font-semibold">{viewDetails.doctor?.name || "Dr. MedixPro Staff"}</span>
                        </div>
                        <div>
                           <span className="text-gray-500 block text-xs">Date Prescribed</span>
                           <span className="text-white">{new Date(viewDetails.prescriptionDate).toLocaleDateString()}</span>
                        </div>
                        <div>
                           <span className="text-gray-500 block text-xs">Prescription Type</span>
                           <span className="text-white font-medium">{viewDetails.prescriptionType}</span>
                        </div>
                     </div>

                     <div>
                        <span className="text-gray-500 block text-xs">Diagnosis</span>
                        <p className="text-white italic bg-card/5 p-2.5 rounded mt-1">"{viewDetails.diagnosis || "No specific diagnosis provided"}"</p>
                     </div>

                     <div>
                        <span className="text-gray-500 block text-xs mb-1">Medications Dispensed</span>
                        <div className="space-y-2">
                           {parseMedications(viewDetails.medications).map((med: any, idx: number) => (
                              <div key={idx} className="p-3 bg-card/5 rounded border border-white/5 flex justify-between items-center my-3 my-3">
                                 <div>
                                    <span className=" text-white block">{med.name}</span>
                                    {med.instructions && (
                                       <span className="text-xs text-gray-400 italic">Instructions: {med.instructions}</span>
                                    )}
                                 </div>
                                 <span className="text-[#1abc9c]  text-xs">{med.qty || med.dosage || "1 Unit"}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-end pt-4 mt-6 border-t border-white/5">
                     <button
                        onClick={() => setViewDetails(null)}
                        className="btn-primary px-6"
                     >
                        Done
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
