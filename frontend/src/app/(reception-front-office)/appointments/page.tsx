"use client";

import { useState, useEffect } from "react";
import { appointmentAPI, doctorAPI, patientAPI, recordsAPI, roomAllotmentAPI } from "@/lib/api";
import { Plus, Edit2, Trash2, Search, Filter, Calendar, Loader2, Check, Activity, Send, Eye, Download, ExternalLink, FileText, ClipboardList } from "lucide-react";
import Modal from "@/components/ui/Modal";
import AppointmentForm from "@/components/Forms/AppointmentForm";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import DataTable, { Column } from "@/components/ui/DataTable";

interface Appointment {
   id: string;
   date: string;
   time: string;
   status: string;
   notes?: string;
   type?: string;
   duration?: string;
   doctorId: string;
   patientId: string;
   doctor?: { id: string; name: string };
   patient?: { id: string; name: string };
   tokenNumber?: string;
   department?: string;
   visitType?: string;
   labTestStatus?: string;
   admissionStatus?: string;
   prescriptionStatus?: string;
}

interface Doctor {
   id: string;
   name: string;
}

interface Patient {
   id: string;
   name: string;
}

export default function AppointmentsPage() {
   const { user } = useAuthStore();
   const isDoctor = user?.role === "doctor" || user?.department?.toLowerCase() === "doctor";

   const [appointments, setAppointments] = useState<Appointment[]>([]);
   const [doctors, setDoctors] = useState<Doctor[]>([]);
   const [patients, setPatients] = useState<Patient[]>([]);
   const [page, setPage] = useState(1);
   const [total, setTotal] = useState(0);
   const [loading, setLoading] = useState(true);
   const [showModal, setShowModal] = useState(false);
   const [editingId, setEditingId] = useState<string | null>(null);
   const [editingAppointment, setEditingAppointment] =
      useState<Appointment | null>(null);
   const [statusFilter, setStatusFilter] = useState("all");
   const [searchQuery, setSearchQuery] = useState("");
   const [actionLoading, setActionLoading] = useState<string | null>(null);

   // Lab report viewer states
   const [selectedLabRecord, setSelectedLabRecord] = useState<any | null>(null);
   const [showLabPreviewModal, setShowLabPreviewModal] = useState(false);
   const [loadingLabReportId, setLoadingLabReportId] = useState<string | null>(null);

   // Allotment details state
   const [selectedAllotment, setSelectedAllotment] = useState<any | null>(null);
   const [showAllotmentModal, setShowAllotmentModal] = useState(false);
   const [loadingAllotmentId, setLoadingAllotmentId] = useState<string | null>(null);

   const handleViewAllotment = async (apt: Appointment) => {
      try {
         setLoadingAllotmentId(apt.id);
         // Fetch allotments by patientId
         const res = await roomAllotmentAPI.list(1, 10, { patientId: apt.patientId });
         const allotmentsList = res.data.allotments || [];
         // Find the most recent active or occupied allotment for this patient
         const activeAllotment = allotmentsList[0]; // Ordered by createdAt DESC
         if (activeAllotment) {
            setSelectedAllotment(activeAllotment);
            setShowAllotmentModal(true);
         } else {
            alert("No active room allotment found for this patient.");
         }
      } catch (error) {
         console.error("Failed to fetch allotment details:", error);
         alert("Failed to load allotment details. Please try again.");
      } finally {
         setLoadingAllotmentId(null);
      }
   };

   const parseLabDetails = (detailsStr: string) => {
      try {
         if (detailsStr && detailsStr.startsWith("{")) {
            const parsed = JSON.parse(detailsStr);
            return {
               request: parsed.request || "N/A",
               observations: parsed.observations || "",
               fileName: parsed.fileName || null,
               fileType: parsed.fileType || null,
               fileData: parsed.fileData || null,
               reportedAt: parsed.reportedAt || null
            };
         }
      } catch (e) { }

      // Fallback for legacy format
      const parts = detailsStr ? detailsStr.split("\n\n") : [];
      const request = parts[0] || "N/A";
      const observations = parts[1] ? parts[1].replace(/\[LABORATORY REPORT - .*\]:\n/, "") : "";
      return {
         request,
         observations,
         fileName: null,
         fileType: null,
         fileData: null,
         reportedAt: null
      };
   };

   const handleViewLabReport = async (apt: Appointment) => {
      try {
         setLoadingLabReportId(apt.id);
         // Fetch laboratory record matching the appointmentId
         const res = await recordsAPI.list(1, 1, "Lab Test", "", { appointmentId: apt.id });
         const record = res.data.records?.[0];
         if (record) {
            setSelectedLabRecord(record);
            setShowLabPreviewModal(true);
         } else {
            // Fallback: search by patient name if legacy record or appointmentId search fails
            const fallbackRes = await recordsAPI.list(1, 10, "Lab Test", apt.patient?.name || "");
            const fallbackRecord = fallbackRes.data.records?.find((r: any) => r.patientName === apt.patient?.name);
            if (fallbackRecord) {
               setSelectedLabRecord(fallbackRecord);
               setShowLabPreviewModal(true);
            } else {
               alert("No laboratory report found for this appointment.");
            }
         }
      } catch (error) {
         console.error("Failed to fetch lab report:", error);
         alert("Failed to load laboratory report. Please try again.");
      } finally {
         setLoadingLabReportId(null);
      }
   };

   const handleSendLabRequest = async (id: string) => {
      try {
         setActionLoading(`${id}-lab`);
         await appointmentAPI.sendLabRequest(id);
         await fetchData();
      } catch (error: any) {
         console.error("Failed to send lab request:", error);
         alert(error.response?.data?.error || "Failed to send laboratory request.");
      } finally {
         setActionLoading(null);
      }
   };

   const handleSendAdmissionRequest = async (id: string) => {
      try {
         setActionLoading(`${id}-admission`);
         await appointmentAPI.sendAdmissionRequest(id);
         await fetchData();
      } catch (error: any) {
         console.error("Failed to send admission request:", error);
         alert(error.response?.data?.error || "Failed to send admission request.");
      } finally {
         setActionLoading(null);
      }
   };

   const fetchData = async () => {
      try {
         setLoading(true);
         const filters: any = { page, limit: 10 };
         if (statusFilter && statusFilter !== "all") filters.status = statusFilter;

         const [appointmentsRes, doctorsRes, patientsRes] = await Promise.all([
            appointmentAPI.list(page, 10, filters),
            doctorAPI.list(1, 100),
            patientAPI.list(1, 100),
         ]);

         setAppointments(appointmentsRes.data.appointments || []);
         setTotal(appointmentsRes.data.total || 0);
         setDoctors(doctorsRes.data.doctors || []);
         setPatients(patientsRes.data.patients || []);
      } catch (error) {
         console.error("Failed to fetch data", error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchData();
   }, [page, statusFilter, user, isDoctor]);

   const handleDelete = async (id: string) => {
      if (confirm("Are you sure you want to delete this appointment?")) {
         try {
            await appointmentAPI.delete(id);
            fetchData();
         } catch (error) {
            console.error("Failed to delete appointment", error);
         }
      }
   };

   const handleEdit = (appointment: Appointment) => {
      setEditingAppointment(appointment);
      setEditingId(appointment.id);
      setShowModal(true);
   };

   const handleAdd = () => {
      setEditingAppointment(null);
      setEditingId(null);
      setShowModal(true);
   };

   const getStatusColor = (status: string) => {
      switch (status?.toLowerCase()) {
         case "scheduled":
            return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
         case "in progress":
            return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
         case "completed":
            return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
         case "cancelled":
            return "bg-red-500/10 text-red-400 border border-red-500/20";
         default:
            return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
      }
   };

   const filteredAppointments = appointments.filter((apt) => {
      if (isDoctor && user) {
         const aptDocId = apt.doctorId || apt.doctor?.id;
         const matchesDoctor =
            (user.doctorId && aptDocId === user.doctorId) ||
            (apt.doctor?.name && user.name && (
               apt.doctor.name.toLowerCase().includes(user.name.toLowerCase()) ||
               user.name.toLowerCase().includes(apt.doctor.name.toLowerCase())
            ));
         if (!matchesDoctor) return false;
      }

      const matchesSearch =
         (apt.patient?.name && apt.patient.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
         (apt.doctor?.name && apt.doctor.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
         (apt.tokenNumber && apt.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
         (apt.department && apt.department.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
         statusFilter === "all" || apt.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
   });

   const columns_0: Column<any>[] = [
      {
         header: "Token Number", accessor: (apt) => (<>\n<span className="bg-dark-tertiary text-gray-300 border border-dark-tertiary/80 px-2.5 py-1 rounded font-mono text-xs  uppercase shadow-sm">
            {apt.tokenNumber || "GEN-000"}
         </span>\n</>)
      },
      {
         header: "Patient Name", accessor: (apt) => (<>\n<div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-semibold text-sm">
               {apt.patient?.name?.charAt(0) || "?"}
            </div>
            <Link
               href={`/patients/${apt.patientId}`}
               className="font-semibold hover:text-emerald-400 transition-colors text-white text-sm"
            >
               {apt.patient?.name || "Unknown"}
            </Link>
         </div>\n</>)
      },
      {
         header: "Department", accessor: (apt) => (<>\n<span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded text-xs font-semibold">
            {apt.department || "General"}
         </span>\n</>)
      },
      { header: "Doctor", accessor: (apt) => (<>Dr. \n{apt.doctor?.name || "Unassigned"}\n</>) },
      {
         header: "Date & Time", accessor: (apt) => (<>\n<div className="flex flex-col text-sm">
            <span className="text-white font-semibold">
               {new Date(apt.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
               })}
            </span>
            <span className="text-xs text-gray-500 mt-0.5">
               {apt.time}
            </span>
         </div>\n</>)
      },
      {
         header: "Visit Type", accessor: (apt) => (<>\n<span className="text-gray-300 text-xs font-medium bg-dark-tertiary/45 border border-dark-tertiary/60 px-2 py-0.5 rounded">
            {apt.visitType || apt.type || "Check-up"}
         </span>\n</>)
      },
      {
         header: "Appointment Status", accessor: (apt) => (<>\n<span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
               apt.status
            )}`}
         >
            {apt.status}
         </span>\n</>)
      },
      {
         header: "Actions", accessor: (apt) => (<>\n<div className="flex items-center justify-end gap-2.5">
            {isDoctor && apt.status?.toLowerCase() !== "completed" ? (
               <Link href={`/appointments/consultation/${apt.id}`}>
                  <button
                     className="px-3.5 py-1.5 text-xs  bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded transition-all shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 flex items-center gap-2 border border-emerald-500/20 active:scale-95"
                     title="Start Consultation"
                  >
                     <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-card opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-card"></span>
                     </span>
                     Start Consultation
                  </button>
               </Link>
            ) : apt.status?.toLowerCase() === "completed" ? (
               (() => {
                  let parsedNotes: any = null;
                  if (apt.notes) {
                     try {
                        parsedNotes = JSON.parse(apt.notes);
                     } catch (e) { }
                  }

                  const hasLabAction = parsedNotes?.labTestsActive === true;
                  const hasAdmissionAction = parsedNotes?.admissionRecommended === true;
                  const hasPrescription = apt.prescriptionStatus !== null && apt.prescriptionStatus !== undefined;

                  return (
                     <div className="flex flex-wrap items-center justify-end gap-2">
                        <span className="text-xs  text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded flex items-center gap-1.5">
                           ✓ Completed
                        </span>

                        {hasPrescription && (
                           apt.prescriptionStatus === "Completed" ? (
                              <span className="text-xs  text-[#1abc9c] bg-[#1abc9c]/10 border border-[#1abc9c]/20 px-2.5 py-1 rounded flex items-center gap-1.5" title="Pharmacy has dispensed all medications and cleared bills.">
                                 <Check size={13} className="text-[#1abc9c]" />
                                 Rx: Dispensed
                              </span>
                           ) : (
                              <span className="text-xs  text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded flex items-center gap-1.5 animate-pulse" title="Awaiting medication dispense and stock allocation at pharmacy.">
                                 <Loader2 size={13} className="animate-spin text-amber-500" />
                                 Rx: Dispense Pending
                              </span>
                           )
                        )}

                        {hasLabAction && (
                           parsedNotes.labRequestSent ? (
                              apt.labTestStatus?.toLowerCase() === 'completed' ? (
                                 <button
                                    onClick={() => handleViewLabReport(apt)}
                                    disabled={loadingLabReportId === apt.id}
                                    className="px-3.5 py-1.5 text-xs  bg-gradient-to-r from-emerald-500 to-teal-650 hover:from-emerald-605 hover:to-teal-750 text-white rounded transition-all shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 flex items-center gap-1.5 border border-emerald-500/20 active:scale-95 disabled:opacity-50"
                                 >
                                    {loadingLabReportId === apt.id ? (
                                       <Loader2 size={13} className="animate-spin" />
                                    ) : (
                                       <Eye size={13} />
                                    )}
                                    View Report
                                 </button>
                              ) : (
                                 <span className="text-xs  text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded flex items-center gap-1.5">
                                    <Check size={13} className="text-emerald-400" />
                                    Test Request Sent
                                 </span>
                              )
                           ) : isDoctor ? (
                              <button
                                 onClick={() => handleSendLabRequest(apt.id)}
                                 disabled={actionLoading === `${apt.id}-lab`}
                                 className="px-3 py-1.5 text-xs  bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/25 flex items-center gap-1.5 border border-blue-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                 {actionLoading === `${apt.id}-lab` ? (
                                    <Loader2 size={13} className="animate-spin" />
                                 ) : (
                                    <Activity size={13} />
                                 )}
                                 Send Test Request
                              </button>
                           ) : (
                              <span className="text-xs  text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded flex items-center gap-1.5">
                                 <Loader2 size={13} className="animate-pulse" />
                                 Lab Request Pending
                              </span>
                           )
                        )}

                        {hasAdmissionAction && (
                           hasLabAction && (!parsedNotes.labRequestSent || apt.labTestStatus?.toLowerCase() !== 'completed') ? (
                              <span className="text-xs  text-gray-400 bg-dark-tertiary/40 border border-dark-tertiary/65 px-2.5 py-1.5 rounded flex items-center gap-1.5">
                                 <Loader2 size={13} className="animate-pulse" />
                                 Waiting for Lab Report
                              </span>
                           ) : parsedNotes.admissionRequestSent ? (
                              apt.admissionStatus?.toLowerCase() === 'admitted' ? (
                                 <button
                                    onClick={() => handleViewAllotment(apt)}
                                    disabled={loadingAllotmentId === apt.id}
                                    className="px-3.5 py-1.5 text-xs  bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded transition-all shadow-md shadow-purple-500/10 hover:shadow-purple-500/25 flex items-center gap-1.5 border border-purple-500/20 active:scale-95 disabled:opacity-50"
                                 >
                                    {loadingAllotmentId === apt.id ? (
                                       <Loader2 size={13} className="animate-spin" />
                                    ) : (
                                       <ClipboardList size={13} />
                                    )}
                                    View Allotment
                                 </button>
                              ) : (
                                 <span className="text-xs  text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded flex items-center gap-1.5">
                                    <Check size={13} className="text-emerald-400" />
                                    Admission Request Sent
                                 </span>
                              )
                           ) : isDoctor ? (
                              <button
                                 onClick={() => handleSendAdmissionRequest(apt.id)}
                                 disabled={actionLoading === `${apt.id}-admission`}
                                 className="px-3 py-1.5 text-xs  bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded transition-all shadow-md shadow-purple-500/10 hover:shadow-purple-500/25 flex items-center gap-1.5 border border-purple-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                 {actionLoading === `${apt.id}-admission` ? (
                                    <Loader2 size={13} className="animate-spin" />
                                 ) : (
                                    <Send size={13} />
                                 )}
                                 Send Admission Request
                              </button>
                           ) : (
                              <span className="text-xs  text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded flex items-center gap-1.5">
                                 <Loader2 size={13} className="animate-pulse" />
                                 Admission Pending
                              </span>
                           )
                        )}
                     </div>
                  );
               })()
            ) : null}
            {!isDoctor && (
               <>
                  <button
                     onClick={() => handleEdit(apt)}
                     className="p-1.5 bg-dark-tertiary/30 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 rounded transition-all"
                     title="Edit"
                  >
                     <Edit2 size={15} />
                  </button>
                  <button
                     onClick={() => handleDelete(apt.id)}
                     className="p-1.5 bg-dark-tertiary/30 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded transition-all"
                     title="Delete"
                  >
                     <Trash2 size={15} />
                  </button>
               </>
            )}
         </div>\n</>)
      },
   ];


   return (
      <>
         <div className="space-y-6">
            <div className="flex justify-between items-center my-3 my-3">
               <div>
                  <h1 className="text-3xl  mb-2 text-white">Appointments</h1>
                  <p className="text-gray-400">Schedule and manage hospital appointments</p>
               </div>
               <div className="flex gap-3">
                  <Link href="/appointments/calendar">
                     <button className="btn-secondary flex items-center gap-2">
                        <Calendar size={20} />
                        Calendar View
                     </button>
                  </Link>
                  {!isDoctor && (
                     <button onClick={handleAdd} className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-emerald-500/10">
                        <Plus size={20} />
                        New Appointment
                     </button>
                  )}
               </div>
            </div>

            <div className="card bg-dark-secondary border border-dark-tertiary p-6 rounded">
               <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 flex items-center gap-2 bg-dark-tertiary/45 border border-dark-tertiary/20 rounded px-4">
                     <Search size={20} className="text-gray-400" />
                     <input
                        type="text"
                        placeholder="Search appointments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent py-3 flex-1 outline-none text-white text-sm"
                     />
                  </div>
                  <select
                     value={statusFilter}
                     onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                     }}
                     className="input-field py-2 bg-dark-tertiary/30"
                  >
                     <option value="all">All Status</option>
                     <option value="scheduled">Scheduled</option>
                     <option value="in progress">In Progress</option>
                     <option value="completed">Completed</option>
                     <option value="cancelled">Cancelled</option>
                  </select>
               </div>

               {loading && appointments.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">Loading appointments...</div>
               ) : (
                  <div className="overflow-x-auto">
                     <DataTable columns={columns_0} data={filteredAppointments} enableLocalSearch enableLocalPagination />
                  </div>
               )}

               <div className="flex justify-between items-center my-3 my-3 mt-6 pt-4 border-t border-dark-tertiary">
                  <p className="text-gray-400 text-sm">
                     Showing {filteredAppointments.length > 0 ? (page - 1) * 10 + 1 : 0} to{" "}
                     {Math.min(page * 10, isDoctor ? filteredAppointments.length : total)} of {isDoctor ? filteredAppointments.length : total} appointments
                  </p>
                  <div className="flex gap-2">
                     <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="p-2 bg-dark-tertiary rounded hover:bg-dark-tertiary/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                     >
                        Previous
                     </button>
                     <button
                        disabled={page * 10 >= total}
                        onClick={() => setPage(page + 1)}
                        className="p-2 bg-dark-tertiary rounded hover:bg-dark-tertiary/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                     >
                        Next
                     </button>
                  </div>
               </div>
            </div>
         </div>

         <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={editingId ? "Edit Appointment" : "New Appointment"}
         >
            <AppointmentForm
               appointment={editingAppointment}
               doctors={doctors}
               patients={patients}
               onSuccess={() => {
                  setShowModal(false);
                  fetchData();
               }}
            />
         </Modal>

         {/* Modal for viewing clinical diagnostic report findings */}
         <Modal
            isOpen={showLabPreviewModal}
            onClose={() => setShowLabPreviewModal(false)}
            title="Laboratory Test Findings"
         >
            {selectedLabRecord && (() => {
               const parsed = parseLabDetails(selectedLabRecord.details);
               return (
                  <div className="space-y-4 text-gray-300">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <p className="text-[10px] text-gray-500 uppercase ">Patient Name</p>
                           <p className="text-sm text-white  mt-0.5">{selectedLabRecord.patientName}</p>
                        </div>
                        <div>
                           <p className="text-[10px] text-gray-500 uppercase ">Reported Date</p>
                           <p className="text-xs text-white font-semibold mt-0.5">
                              {parsed.reportedAt ? new Date(parsed.reportedAt).toLocaleString() : new Date(selectedLabRecord.date).toLocaleDateString()}
                           </p>
                        </div>
                     </div>

                     <div>
                        <p className="text-[10px] text-gray-500 uppercase ">Doctor's Requested Tests</p>
                        <p className="text-xs text-white font-semibold mt-0.5 bg-dark-tertiary/40 p-2.5 rounded border border-dark-tertiary/20">
                           {parsed.request.replace("Recommended Laboratory Tests: ", "")}
                        </p>
                     </div>

                     <div>
                        <p className="text-[10px] text-gray-500 uppercase ">Clinical Observations / Readings</p>
                        <div className="text-xs text-gray-300 leading-relaxed bg-dark-tertiary/20 p-4 rounded border border-dark-tertiary/20 min-h-[100px] whitespace-pre-line">
                           {parsed.observations || "No clinical observations entered."}
                        </div>
                     </div>

                     {parsed.fileData && (
                        <div className="bg-emerald-500/[0.02] border border-emerald-500/20 p-4 rounded flex flex-col sm:flex-row items-center justify-between gap-3">
                           <div className="flex items-center gap-2">
                              <FileText size={20} className="text-emerald-400" />
                              <div>
                                 <p className="text-xs  text-white max-w-[200px] truncate" title={parsed.fileName}>{parsed.fileName || "report-attachment"}</p>
                                 <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mt-0.5">{parsed.fileType?.split("/")[1] || "File"}</p>
                              </div>
                           </div>
                           <div className="flex gap-2 w-full sm:w-auto">
                              <button
                                 type="button"
                                 onClick={() => {
                                    const newTab = window.open();
                                    if (newTab) {
                                       try {
                                          const rawBase64 = parsed.fileData.split(',')[1] || parsed.fileData;
                                          const contentType = parsed.fileType || 'application/pdf';
                                          const byteCharacters = atob(rawBase64);
                                          const byteNumbers = new Array(byteCharacters.length);
                                          for (let i = 0; i < byteCharacters.length; i++) {
                                             byteNumbers[i] = byteCharacters.charCodeAt(i);
                                          }
                                          const byteArray = new Uint8Array(byteNumbers);
                                          const blob = new Blob([byteArray], { type: contentType });
                                          const blobUrl = URL.createObjectURL(blob);

                                          newTab.document.write(`
 <!DOCTYPE html>
 <html>
 <head>
 <title>Laboratory Report - ${selectedLabRecord?.patientName || 'Attachment'}</title>
 <style>
 body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background-color: #121214; }
 iframe { border: none; width: 100%; height: 100%; }
 </style>
 </head>
 <body>
 <iframe src="${blobUrl}" allowfullscreen></iframe>
 </body>
 </html>
 `);
                                          newTab.document.close();
                                       } catch (err) {
                                          console.error("Failed to parse base64 to blob:", err);
                                          newTab.close();
                                          alert("Failed to render PDF report.");
                                       }
                                    }
                                 }}
                                 className="flex-1 sm:flex-none p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs  flex items-center justify-center gap-1.5 transition-colors shadow shadow-emerald-500/10"
                              >
                                 <ExternalLink size={13} />
                                 View Attachment
                              </button>
                              <a
                                 href={parsed.fileData}
                                 download={parsed.fileName || "lab-report"}
                                 className="flex-1 sm:flex-none p-2 bg-dark-tertiary hover:bg-dark-tertiary/70 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-dark-tertiary/50"
                              >
                                 <Download size={13} />
                                 Download
                              </a>
                           </div>
                        </div>
                     )}

                     {parsed.fileData && parsed.fileType?.startsWith("image/") && (
                        <div className="border border-dark-tertiary rounded p-2 bg-dark-secondary/30 flex items-center justify-center max-h-[220px] overflow-hidden">
                           <img
                              src={parsed.fileData}
                              alt={parsed.fileName || "attachment"}
                              className="max-h-[200px] object-contain rounded"
                           />
                        </div>
                     )}

                     <div className="flex justify-end pt-2">
                        <button
                           type="button"
                           onClick={() => setShowLabPreviewModal(false)}
                           className="px-5 py-2 bg-dark-tertiary hover:bg-dark-tertiary/70 text-white rounded text-xs  transition-colors"
                        >
                           Close Findings
                        </button>
                     </div>
                  </div>
               );
            })()}
         </Modal>

         {/* Modal for viewing room allotment bed details */}
         <Modal
            isOpen={showAllotmentModal}
            onClose={() => setShowAllotmentModal(false)}
            title="Patient Room & Bed Allotment Details"
         >
            {selectedAllotment && (
               <div className="space-y-4 text-gray-300">
                  {/* Header Allotment Status Banner */}
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-4 roundedex items-center justify-between">
                     <div>
                        <p className="text-[10px] text-gray-500 uppercase  tracking-wider">Allotment ID</p>
                        <p className="text-sm text-white font-mono  mt-0.5">
                           #{selectedAllotment.id ? selectedAllotment.id.slice(0, 8).toUpperCase() : 'N/A'}
                        </p>
                     </div>
                     <div>
                        <span className="px-3 py-1 bg-purple-500/15 text-purple-400 border border-purple-500/20 rounded-full text-xs  uppercase tracking-wide">
                           {selectedAllotment.status || 'Active'}
                        </span>
                     </div>
                  </div>

                  {/* Room & Bed Details Row */}
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-dark-secondary/35 border border-dark-tertiary/20 p-3.5 rounded">
                        <p className="text-[10px] text-gray-500 uppercase ">Room Assigned</p>
                        <p className="text-base text-white  mt-1">
                           Room {selectedAllotment.room?.roomNumber || selectedAllotment.roomNumber || 'N/A'}
                        </p>
                        <p className="text-xs text-purple-400 font-semibold mt-0.5">
                           {selectedAllotment.room?.roomType || selectedAllotment.roomType || 'General Ward'}
                        </p>
                     </div>
                     <div className="bg-dark-secondary/35 border border-dark-tertiary/20 p-3.5 rounded">
                        <p className="text-[10px] text-gray-500 uppercase ">Bed Slot Assigned</p>
                        <p className="text-base text-emerald-400  mt-1">
                           Slot {selectedAllotment.bed || 'A'}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                           {selectedAllotment.room?.department || selectedAllotment.department || 'General Medicine'}
                        </p>
                     </div>
                  </div>

                  {/* Allotment Dates */}
                  <div className="grid grid-cols-2 gap-4 border-t border-dark-tertiary/50 pt-3">
                     <div>
                        <p className="text-[10px] text-gray-500 uppercase ">Admission Date</p>
                        <p className="text-xs text-white font-semibold mt-1">
                           {selectedAllotment.allotmentDate ? new Date(selectedAllotment.allotmentDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                           }) : 'N/A'}
                        </p>
                     </div>
                     <div>
                        <p className="text-[10px] text-gray-500 uppercase ">Expected Discharge</p>
                        <p className="text-xs text-white font-semibold mt-1">
                           {selectedAllotment.expectedDischargeDate ? new Date(selectedAllotment.expectedDischargeDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                           }) : 'Routine Care'}
                        </p>
                     </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="grid grid-cols-2 gap-4 border-t border-dark-tertiary/50 pt-3">
                     <div>
                        <p className="text-[10px] text-gray-500 uppercase ">Attending Doctor</p>
                        <p className="text-xs text-white font-semibold mt-1">
                           {selectedAllotment.attendingDoctor || 'Dr. Attending'}
                        </p>
                     </div>
                  </div>

                  {/* Additional Clinical/Receptionist Notes */}
                  {(selectedAllotment.specialRequirements || selectedAllotment.additionalNotes) && (
                     <div className="border-t border-dark-tertiary/50 pt-3 space-y-2">
                        {selectedAllotment.specialRequirements && (
                           <div>
                              <p className="text-[10px] text-gray-500 uppercase ">Special Requirements</p>
                              <p className="text-xs text-gray-300 bg-dark-tertiary/20 p-2.5 rounded border border-dark-tertiary/20 mt-1 whitespace-pre-line leading-relaxed">
                                 {selectedAllotment.specialRequirements}
                              </p>
                           </div>
                        )}
                        {selectedAllotment.additionalNotes && (
                           <div>
                              <p className="text-[10px] text-gray-500 uppercase ">Receptionist Allotment Notes</p>
                              <p className="text-xs text-gray-300 bg-dark-tertiary/20 p-2.5 rounded border border-dark-tertiary/20 mt-1 whitespace-pre-line leading-relaxed">
                                 {selectedAllotment.additionalNotes}
                              </p>
                           </div>
                        )}
                     </div>
                  )}

                  {/* Actions Footer */}
                  <div className="flex justify-end pt-3 border-t border-dark-tertiary/50">
                     <button
                        type="button"
                        onClick={() => setShowAllotmentModal(false)}
                        className="px-5 py-2.5 bg-dark-tertiary hover:bg-dark-tertiary/70 text-white rounded text-xs  transition-all shadow active:scale-95"
                     >
                        Close Details
                     </button>
                  </div>
               </div>
            )}
         </Modal>
      </>
   );
}
