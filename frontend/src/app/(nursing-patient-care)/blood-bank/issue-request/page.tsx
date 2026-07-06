"use client";

import { useState, useEffect } from "react";
import { Droplet, ClipboardList, CheckCircle, Clock, AlertTriangle, Plus } from "lucide-react";
import { bloodBankAPI, patientAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import ActionModal from "@/components/ui/ActionModal";
import DataTable, { Column } from "@/components/ui/DataTable";

interface IssuedBlood {
   id: string;
   issueId: string;
   recipient: string;
   bloodType: string;
   units: number;
   issueDate: string;
   requestingDoctor: string;
   purpose: string;
   department: string;
   status: string;
}

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const DEPARTMENTS = ["Surgery", "Emergency", "Cardiology", "Internal Medicine", "Obstetrics", "Oncology", "Nephrology", "General"];
const PURPOSES = ["Surgery", "Trauma", "Anaemia treatment", "Childbirth", "Cancer treatment", "Dialysis", "Other"];

export default function IssueRequestPage() {
   const { user } = useAuthStore();
   const [myRequests, setMyRequests] = useState<IssuedBlood[]>([]);
   const [patientsList, setPatientsList] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [submitting, setSubmitting] = useState(false);
   const [submitted, setSubmitted] = useState(false);
   const [isModalOpen, setIsModalOpen] = useState(false);

   const [formData, setFormData] = useState({
      patient: "",
      bloodType: "",
      numberOfUnits: "1",
      department: "Surgery",
      purpose: "Surgery",
      emergencyRequest: false,
      additionalNotes: "",
   });

   useEffect(() => {
      fetchMyRequests();
      fetchPatients();
   }, [user?.name]);

   const fetchMyRequests = async () => {
      try {
         setLoading(true);
         const response = await bloodBankAPI.getIssues();
         const data = response.data;
         if (data.success) {
            const doctorName = user?.name ? user.name.toLowerCase() : "";
            const filtered = doctorName
               ? data.data.filter((r: IssuedBlood) => {
                  const reqDoc = r.requestingDoctor.toLowerCase();
                  return reqDoc.includes(doctorName);
               })
               : [];
            setMyRequests(filtered);
         }
      } catch (error) {
         console.error("Error fetching blood requests:", error);
      } finally {
         setLoading(false);
      }
   };

   const fetchPatients = async () => {
      try {
         const res = await patientAPI.list(1, 200);
         setPatientsList(res.data.patients || []);
      } catch (error) {
         console.error("Error fetching patients:", error);
      }
   };

   const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
   ) => {
      const { name, value, type } = e.target;
      if (type === "checkbox") {
         const checked = (e.target as HTMLInputElement).checked;
         setFormData((prev) => ({ ...prev, [name]: checked }));
      } else {
         setFormData((prev) => ({ ...prev, [name]: value }));
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.bloodType) { alert("Please select a blood type."); return; }
      if (!formData.patient) { alert("Please select a patient."); return; }

      try {
         setSubmitting(true);
         const selectedPatient = patientsList.find((p) => p.id === formData.patient);
         const submitData = {
            bloodType: formData.bloodType,
            units: parseInt(formData.numberOfUnits),
            recipient: selectedPatient ? selectedPatient.name : "Unknown",
            recipientId: formData.patient || null,
            requestingDoctor: user?.name ? `Dr. ${user.name}` : "Unknown Doctor",
            purpose: formData.purpose,
            department: formData.department,
         };

         const response = await bloodBankAPI.createIssue(submitData);
         if (response.data.success) {
            setSubmitted(true);
            setFormData({
               patient: "",
               bloodType: "",
               numberOfUnits: "1",
               department: "Surgery",
               purpose: "Surgery",
               emergencyRequest: false,
               additionalNotes: "",
            });
            setIsModalOpen(false);
            fetchMyRequests();
            setTimeout(() => setSubmitted(false), 4000);
         } else {
            alert("Error: " + (response.data.error || "Failed to submit request"));
         }
      } catch (error) {
         console.error("Error submitting blood request:", error);
         alert("Failed to submit blood request.");
      } finally {
         setSubmitting(false);
      }
   };

   const getStatusIcon = (status: string) => {
      switch (status) {
         case "Fulfilled": return <CheckCircle size={14} className="text-emerald-400" />;
         case "Pending": return <Clock size={14} className="text-orange-400" />;
         default: return <AlertTriangle size={14} className="text-gray-400" />;
      }
   };

   const getStatusClass = (status: string) => {
      switch (status) {
         case "Fulfilled": return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
         case "Pending": return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
         case "Approved": return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
         default: return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
      }
   };

   const columns_0: Column<any>[] = [
      { header: "Request ID", accessor: (req) => (<>\n{req.issueId}\n</>) },
      { header: "Patient", accessor: (req) => (<>\n<div>{req.recipient}</div>\n\n<div className="text-xs text-gray-500">{req.purpose}</div>\n</>) },
      {
         header: "Blood", accessor: (req) => (<>\n<span className={`px-2 py-0.5 rounded-full text-xs  border ${req.bloodType.includes("+")
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}>
            {req.bloodType}
         </span>\n\n<span className="text-xs text-gray-400 ml-1">{req.units}u</span>\n</>)
      },
      { header: "Date", accessor: (req) => (<>\n{new Date(req.issueDate).toLocaleDateString("en-GB")}\n</>) },
      {
         header: "Status", accessor: (req) => (<>\n<span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit ${getStatusClass(req.status)}`}>
            {getStatusIcon(req.status)}
            {req.status}
         </span>\n</>)
      },
   ];


   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
               <h1 className="text-3xl  mb-1 flex items-center gap-2">
                  <Droplet className="text-red-500" size={28} />
                  Blood Transfusion Requests
               </h1>
               <p className="text-gray-400">
                  View status of your submitted blood transfusion requests or request new units.
               </p>
            </div>
            <button
               onClick={() => setIsModalOpen(true)}
               className="btn-primary py-2.5 px-5 font-semibold flex items-center justify-center gap-2 roundedansition-all self-start sm:self-auto"
            >
               <Plus size={15} />
               Request Blood
            </button>
         </div>

         {/* Success Banner */}
         {submitted && (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-5 py-4 animate-fade-in">
               <CheckCircle size={20} />
               <span className="font-medium">Blood request submitted successfully! Inventory has been notified.</span>
            </div>
         )}

         {/* My Requests Table */}
         <div className="card w-full">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
               <ClipboardList size={15} className="text-blue-400" />
               My Blood Requests
            </h2>

            {loading ? (
               <div className="flex items-center justify-center py-16 text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mr-3" />
                  Loading requests...
               </div>
            ) : myRequests.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <Droplet size={40} className="mb-3 opacity-20" />
                  <p className="text-sm">No blood requests submitted yet.</p>
                  <p className="text-xs mt-1 opacity-60">Click "Request Blood" to submit your first request.</p>
               </div>
            ) : (
               <div className="overflow-x-auto">
                  <DataTable columns={columns_0} data={myRequests} enableLocalSearch enableLocalPagination />
               </div>
            )}
         </div>

         {/* Request Modal Form */}
         <ActionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="New Blood Request"
         >
            <form onSubmit={handleSubmit} className="space-y-4">
               {/* Patient */}
               <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                     Patient <span className="text-red-500">*</span>
                  </label>
                  <select
                     name="patient"
                     value={formData.patient}
                     onChange={handleInputChange}
                     className="input-field w-full bg-dark-secondary"
                     required
                  >
                     <option value="">Select patient</option>
                     {patientsList.map((p) => (
                        <option key={p.id} value={p.id}>
                           {p.name} {p.patientId ? `(${p.patientId})` : ""}
                        </option>
                     ))}
                  </select>
               </div>

               {/* Blood Type */}
               <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                     Blood Group Required <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                     {BLOOD_TYPES.map((bt) => (
                        <button
                           key={bt}
                           type="button"
                           onClick={() => setFormData((prev) => ({ ...prev, bloodType: bt }))}
                           className={`py-2 rounded text-sm  border transition-all ${formData.bloodType === bt
                              ? "bg-red-500 border-red-500 text-white"
                              : "bg-dark-tertiary/30 border-dark-tertiary text-gray-400 hover:border-red-500/50"
                              }`}
                        >
                           {bt}
                        </button>
                     ))}
                  </div>
               </div>

               {/* Units & Department */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-medium text-gray-300 mb-1.5">
                        Number of Units <span className="text-red-500">*</span>
                     </label>
                     <input
                        type="number"
                        name="numberOfUnits"
                        value={formData.numberOfUnits}
                        onChange={handleInputChange}
                        min="1"
                        max="20"
                        className="input-field w-full"
                        required
                     />
                     <p className="text-xs text-gray-500 mt-1">1 unit ≈ 450ml whole blood</p>
                  </div>

                  <div>
                     <label className="block text-xs font-medium text-gray-300 mb-1.5">
                        Department <span className="text-red-500">*</span>
                     </label>
                     <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="input-field w-full bg-dark-secondary"
                        required
                     >
                        {DEPARTMENTS.map((d) => (
                           <option key={d} value={d}>{d}</option>
                        ))}
                     </select>
                  </div>
               </div>

               {/* Purpose */}
               <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                     Purpose <span className="text-red-500">*</span>
                  </label>
                  <select
                     name="purpose"
                     value={formData.purpose}
                     onChange={handleInputChange}
                     className="input-field w-full bg-dark-secondary"
                     required
                  >
                     {PURPOSES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                     ))}
                  </select>
               </div>

               {/* Emergency */}
               <div className="flex items-center gap-2 bg-red-500/5 border border-red-500/20 rounded p-2">
                  <input
                     type="checkbox"
                     id="emergencyRequest"
                     name="emergencyRequest"
                     checked={formData.emergencyRequest}
                     onChange={handleInputChange}
                     className="w-4 h-4 text-red-500 bg-dark-tertiary border-gray-600 rounded focus:ring-red-500"
                  />
                  <label htmlFor="emergencyRequest" className="text-sm font-medium text-red-400 cursor-pointer">
                     ⚡ Mark as Emergency Request
                  </label>
               </div>

               {/* Notes */}
               <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                     Additional Notes
                  </label>
                  <textarea
                     name="additionalNotes"
                     value={formData.additionalNotes}
                     onChange={handleInputChange}
                     rows={3}
                     placeholder="Any specific notes for the inventory team..."
                     className="input-field w-full resize-none"
                  />
               </div>

               {/* Buttons */}
               <div className="flex justify-end gap-3 pt-4 border-t border-dark-tertiary">
                  <button
                     type="button"
                     onClick={() => setIsModalOpen(false)}
                     className="p-2 bg-dark-tertiary/50 hover:bg-dark-tertiary text-gray-300 font-semibold rounded transition-all"
                  >
                     Cancel
                  </button>
                  <button
                     type="submit"
                     disabled={submitting}
                     className="btn-primary px-5 py-2 font-semibold flex items-center justify-center gap-2 disabled:opacity-60 rounded"
                  >
                     <Droplet size={15} />
                     {submitting ? "Submitting Request..." : "Submit Blood Request"}
                  </button>
               </div>
            </form>
         </ActionModal>
      </div>
   );
}
