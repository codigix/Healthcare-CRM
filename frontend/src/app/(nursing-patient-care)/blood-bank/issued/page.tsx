"use client";

import { useState, useEffect } from "react";

import ActionModal from "@/components/ui/ActionModal";
import {
   Search,
   Plus,
   Droplet,
   AlertCircle,
   Eye,
   Edit,
   Trash2,
   X,
   ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { bloodBankAPI, patientAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import DataTable, { Column } from "@/components/ui/DataTable";

interface IssuedBlood {
   id: string;
   issueId: string;
   recipient: string;
   recipientId?: string;
   bloodType: string;
   units: number;
   issueDate: string;
   requestingDoctor: string;
   purpose: string;
   department: string;
   status: string;
}

export default function IssuedBloodPage() {
   const { user } = useAuthStore();
   const [searchQuery, setSearchQuery] = useState("");
   const [bloodTypeFilter, setBloodTypeFilter] = useState("all");
   const [statusFilter, setStatusFilter] = useState("all");
   const [departmentFilter, setDepartmentFilter] = useState("all");
   const [activeTab, setActiveTab] = useState("all");
   const [issuedBlood, setIssuedBlood] = useState<IssuedBlood[]>([]);
   const [loading, setLoading] = useState(true);

   // Modal / Issue Request states
   const [patientsList, setPatientsList] = useState<any[]>([]);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [submitting, setSubmitting] = useState(false);
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
      fetchIssuedBlood();
      fetchPatients();
   }, []);

   const fetchIssuedBlood = async () => {
      try {
         setLoading(true);
         const response = await bloodBankAPI.getIssues();
         const data = response.data;
         if (data.success) {
            setIssuedBlood(data.data);
         }
      } catch (error) {
         console.error("Error fetching issued blood:", error);
         alert(
            "Failed to fetch issued blood records. Please ensure you are logged in."
         );
      } finally {
         setLoading(false);
      }
   };

   const fetchPatients = async () => {
      try {
         const res = await patientAPI.list(1, 200);
         setPatientsList(res.data.patients || []);
      } catch (error) {
         console.error("Error fetching patients list:", error);
      }
   };

   const handleInputChange = (
      e: React.ChangeEvent<
         HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
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
      try {
         setSubmitting(true);
         const selectedPatient = patientsList.find(p => p.id === formData.patient);
         const submitData = {
            bloodType: formData.bloodType,
            units: parseInt(formData.numberOfUnits),
            recipient: selectedPatient ? selectedPatient.name : "Unknown Recipient",
            recipientId: formData.patient || null,
            requestingDoctor: user?.name ? `Dr. ${user.name}` : "Unknown Doctor",
            purpose: formData.purpose || "Surgery",
            department: formData.department || "Surgery",
         };

         const response = await bloodBankAPI.createIssue(submitData);

         if (response.data.success) {
            alert("Blood issue request submitted successfully!");
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
            fetchIssuedBlood(); // Refresh the list dynamically!
         } else {
            alert("Error: " + (response.data.error || "Failed to submit request"));
         }
      } catch (error) {
         console.error("Error submitting form:", error);
         alert("Error issuing blood");
      } finally {
         setSubmitting(false);
      }
   };

   const getStatusColor = (status: string) => {
      switch (status) {
         case "Approved":
            return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
         case "Fulfilled":
            return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
         case "Pending":
            return "bg-orange-500/10 text-orange-500 border border-orange-500/20";
         case "Completed":
            return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
         default:
            return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
      }
   };

   const getBloodTypeColor = (bloodType: string) => {
      return bloodType.includes("+")
         ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
         : "bg-red-500/10 text-red-500 border border-red-500/20";
   };

   const getDepartmentColor = (department: string) => {
      const colors: { [key: string]: string } = {
         Surgery: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
         Emergency: "bg-red-500/10 text-red-500 border border-red-500/20",
         Cardiology: "bg-pink-500/10 text-pink-500 border border-pink-500/20",
         "Internal Medicine":
            "bg-purple-500/10 text-purple-500 border border-purple-500/20",
         Obstetrics: "bg-cyan-500/10 text-cyan-500 border border-cyan-500/20",
         Oncology: "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20",
         Nephrology: "bg-teal-500/10 text-teal-500 border border-teal-500/20",
      };
      return (
         colors[department] ||
         "bg-gray-500/10 text-gray-400 border border-gray-500/20"
      );
   };

   const filteredIssues = issuedBlood.filter((issue) => {
      const matchesSearch =
         issue.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
         issue.issueId.toLowerCase().includes(searchQuery.toLowerCase()) ||
         issue.requestingDoctor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBloodType =
         bloodTypeFilter === "all" || issue.bloodType === bloodTypeFilter;
      const matchesStatus =
         statusFilter === "all" || issue.status === statusFilter;
      const matchesDepartment =
         departmentFilter === "all" || issue.department === departmentFilter;
      const matchesTab =
         activeTab === "all" ||
         (activeTab === "patient" && true) ||
         (activeTab === "external" && false) ||
         (activeTab === "emergency" && issue.department === "Emergency");
      return (
         matchesSearch &&
         matchesBloodType &&
         matchesStatus &&
         matchesDepartment &&
         matchesTab
      );
   });

   const totalUnitsIssued = issuedBlood.reduce(
      (sum, issue) => sum + issue.units,
      0
   );
   const issuedThisMonth = issuedBlood.length;
   const emergencyIssues = issuedBlood.filter(
      (i) => i.department === "Emergency"
   ).length;
   const crossMatchedUnits = issuedBlood
      .filter((i) => i.status === "Completed")
      .reduce((sum, i) => sum + i.units, 0);

   const issuesByBloodType = [
      { type: "A+", units: 2 },
      { type: "A-", units: 1 },
      { type: "AB+", units: 2 },
      { type: "AB-", units: 1 },
      { type: "B+", units: 3 },
      { type: "B-", units: 1 },
      { type: "O+", units: 8 },
      { type: "O-", units: 1 },
   ];

   const issuesByDepartment = [
      { department: "External", units: 6, color: "bg-blue-500" },
      { department: "Emergency", units: 5, color: "bg-emerald-500" },
      { department: "Surgery", units: 2, color: "bg-yellow-500" },
      { department: "Cardiology", units: 2, color: "bg-red-500" },
      { department: "Internal Medicine", units: 1, color: "bg-purple-500" },
      { department: "Obstetrics", units: 1, color: "bg-pink-500" },
      { department: "Oncology", units: 1, color: "bg-indigo-500" },
      { department: "Nephrology", units: 1, color: "bg-cyan-500" },
   ];

   const columns_0: Column<any>[] = [
      { header: "Issue ID", accessor: (issue) => (<>\n{issue.issueId}\n</>) },
      {
         header: "Patient", accessor: (issue) => (<>\n<div className="font-medium text-white">
            {issue.recipient}
         </div>\n</>)
      },
      {
         header: "Blood Type", accessor: (issue) => (<>\n<span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getBloodTypeColor(
               issue.bloodType
            )}`}
         >
            {issue.bloodType} {issue.units} unit
            {issue.units > 1 ? "s" : ""}
         </span>\n</>)
      },
      { header: "Issue Date", accessor: (issue) => (<>\n{new Date(issue.issueDate).toLocaleDateString("en-GB")}\n</>) },
      { header: "Requesting Doctor", accessor: (issue) => (<>\n{issue.requestingDoctor}\n</>) },
      { header: "Purpose", accessor: (issue) => (<>\n{issue.purpose}\n</>) },
      { header: "Department", accessor: (issue) => (<>\n{issue.department}\n</>) },
      {
         header: "Status", accessor: (issue) => (<>\n<span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
               issue.status
            )}`}
         >
            {issue.status}
         </span>\n</>)
      },
      {
         header: "Actions", accessor: (issue) => (<>\n{(issue.status === "Pending" || issue.status === "Approved") &&
            (user?.role?.toLowerCase() === "inventory" || user?.role === "INVENTORY") ? (
            <button
               onClick={async () => {
                  if (
                     confirm(
                        `Fulfill blood request ${issue.issueId}?\n\nThis will deduct ${issue.units} unit(s) of ${issue.bloodType} from stock.`
                     )
                  ) {
                     try {
                        const res = await bloodBankAPI.fulfillIssue(issue.id);
                        if (res.data && res.data.success) {
                           alert(res.data.message || "Request fulfilled and stock updated!");
                           fetchIssuedBlood();
                        } else {
                           alert("Error: " + (res.data?.error || "Failed to fulfill"));
                        }
                     } catch (e: any) {
                        console.error(e);
                        const errMsg = e?.response?.data?.error || "Error fulfilling request";
                        alert(errMsg);
                     }
                  }
               }}
               className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1"
            >
               ✓ Fulfill & Deduct Stock
            </button>
         ) : issue.status === "Fulfilled" ? (
            <span className="text-emerald-400 text-xs font-medium">✓ Fulfilled</span>
         ) : (
            <span className="text-gray-500 text-xs italic">{issue.status}</span>
         )}\n</>)
      },
   ];


   return (
      <>
         <div className="space-y-6">
            <div className="flex justify-between items-center my-3 my-3">
               <div>
                  <h1 className="text-3xl  mb-2">Issued Blood</h1>
                  <p className="text-gray-400">
                     Manage issued blood units and track transfusions
                  </p>
               </div>
               <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-primary flex items-center gap-2"
               >
                  <Plus size={20} />
                  Issue Blood
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="card">
                  <div className="flex items-center gap-2">
                     <div className="w-12 h-12 bg-blue-500/10 rounded flex items-center justify-center">
                        <Droplet className="text-blue-500" size={24} />
                     </div>
                     <div>
                        <div className="text-2xl ">{totalUnitsIssued}</div>
                        <div className="text-mdtext-gray-400">Total Units Issued</div>
                        <div className="text-xs text-red-500">+14 from last month</div>
                     </div>
                  </div>
               </div>

               <div className="card">
                  <div className="flex items-center gap-2">
                     <div className="w-12 h-12 bg-blue-500/10 rounded flex items-center justify-center">
                        <Droplet className="text-blue-500" size={24} />
                     </div>
                     <div>
                        <div className="text-2xl ">{issuedThisMonth}</div>
                        <div className="text-mdtext-gray-400">Issued This Month</div>
                        <div className="text-xs text-blue-500">
                           +3 compared to last month
                        </div>
                     </div>
                  </div>
               </div>

               <div className="card">
                  <div className="flex items-center gap-2">
                     <div className="w-12 h-12 bg-red-500/10 rounded flex items-center justify-center">
                        <AlertCircle className="text-red-500" size={24} />
                     </div>
                     <div>
                        <div className="text-2xl ">{emergencyIssues}</div>
                        <div className="text-mdtext-gray-400">Emergency Issues</div>
                        <div className="text-xs text-red-500">
                           Critical situations handled
                        </div>
                     </div>
                  </div>
               </div>

               <div className="card">
                  <div className="flex items-center gap-2">
                     <div className="w-12 h-12 bg-emerald-500/10 rounded flex items-center justify-center">
                        <Droplet className="text-emerald-500" size={24} />
                     </div>
                     <div>
                        <div className="text-2xl ">{crossMatchedUnits}</div>
                        <div className="text-mdtext-gray-400">Cross-Matched Units</div>
                        <div className="text-xs text-emerald-500">
                           Compatibility verified
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
                     placeholder="Search issuances..."
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
                     All Issues
                  </button>
                  <button
                     onClick={() => setActiveTab("patient")}
                     className={`pb-3 px-1 font-medium transition-colors ${activeTab === "patient"
                        ? "text-emerald-500 border-b-2 border-emerald-500"
                        : "text-gray-400 hover:text-gray-300"
                        }`}
                  >
                     Patient
                  </button>
                  <button
                     onClick={() => setActiveTab("external")}
                     className={`pb-3 px-1 font-medium transition-colors ${activeTab === "external"
                        ? "text-emerald-500 border-b-2 border-emerald-500"
                        : "text-gray-400 hover:text-gray-300"
                        }`}
                  >
                     External
                  </button>
                  <button
                     onClick={() => setActiveTab("emergency")}
                     className={`pb-3 px-1 font-medium transition-colors ${activeTab === "emergency"
                        ? "text-emerald-500 border-b-2 border-emerald-500"
                        : "text-gray-400 hover:text-gray-300"
                        }`}
                  >
                     Emergency
                  </button>
               </div>

               <div className="flex gap-3 mb-6">
                  <select
                     value={bloodTypeFilter}
                     onChange={(e) => setBloodTypeFilter(e.target.value)}
                     className="input-field"
                  >
                     <option value="all">All Blood Types</option>
                     <option value="A+">A+</option>
                     <option value="A-">A-</option>
                     <option value="B+">B+</option>
                     <option value="B-">B-</option>
                     <option value="AB+">AB+</option>
                     <option value="AB-">AB-</option>
                     <option value="O+">O+</option>
                     <option value="O-">O-</option>
                  </select>
                  <select
                     value={statusFilter}
                     onChange={(e) => setStatusFilter(e.target.value)}
                     className="input-field"
                  >
                     <option value="all">All Statuses</option>
                     <option value="Approved">Approved</option>
                     <option value="Pending">Pending</option>
                     <option value="Completed">Completed</option>
                  </select>
                  <select
                     value={departmentFilter}
                     onChange={(e) => setDepartmentFilter(e.target.value)}
                     className="input-field"
                  >
                     <option value="all">All Departments</option>
                     <option value="Surgery">Surgery</option>
                     <option value="Emergency">Emergency</option>
                     <option value="Cardiology">Cardiology</option>
                     <option value="Internal Medicine">Internal Medicine</option>
                  </select>
                  <div className="flex gap-2 ml-auto">
                     <button className="btn-secondary">Refresh</button>
                     <button className="btn-secondary">Export</button>
                  </div>
               </div>

               {loading ? (
                  <div className="text-center py-8 text-gray-400">
                     Loading issued blood records...
                  </div>
               ) : (
                  <div className="overflow-x-auto">
                     <DataTable columns={columns_0} data={filteredIssues} enableLocalSearch enableLocalPagination />
                  </div>
               )}
            </div>
         </div>

         {/* Modal Form Dialog for Issuing/Requesting Blood */}
         {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4 overflow-y-auto">
               <div className="bg-dark-secondary border border-dark-tertiary roundedfull max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
                  <button
                     onClick={() => setIsModalOpen(false)}
                     className="absolute right-4 top-4 p-1.5 bg-dark-tertiary hover:bg-dark-tertiary/80 text-gray-400 rounded transition-colors"
                  >
                     <X size={15} />
                  </button>

                  <div className="mb-6">
                     <h2 className="text-xl  flex items-center gap-2 text-white">
                        <Droplet className="text-red-500 animate-pulse" size={20} />
                        Issue Blood & Request Transfusion
                     </h2>
                     <p className="text-gray-400 text-xs mt-1">
                        Complete this form to submit a new blood request. Once sent, it will instantly notify the Inventory Department.
                     </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">
                           Patient <span className="text-red-500">*</span>
                        </label>
                        <select
                           name="patient"
                           value={formData.patient}
                           onChange={handleInputChange}
                           className="input-field w-full text-sm"
                           required
                        >
                           <option value="">Select patient</option>
                           {patientsList.map((p) => (
                              <option key={p.id} value={p.id}>
                                 {p.name} ({p.id})
                              </option>
                           ))}
                        </select>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-medium text-gray-300 mb-1.5">
                              Blood Type <span className="text-red-500">*</span>
                           </label>
                           <select
                              name="bloodType"
                              value={formData.bloodType}
                              onChange={handleInputChange}
                              className="input-field w-full text-sm"
                              required
                           >
                              <option value="">Select blood type</option>
                              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                                 <option key={type} value={type}>{type}</option>
                              ))}
                           </select>
                        </div>

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
                              className="input-field w-full text-sm"
                              required
                           />
                        </div>

                        <div>
                           <label className="block text-xs font-medium text-gray-300 mb-1.5">
                              Department
                           </label>
                           <select
                              name="department"
                              value={formData.department}
                              onChange={handleInputChange}
                              className="input-field w-full text-sm"
                           >
                              <option value="Surgery">Surgery</option>
                              <option value="Emergency">Emergency</option>
                              <option value="Cardiology">Cardiology</option>
                              <option value="Internal Medicine">Internal Medicine</option>
                              <option value="Obstetrics">Obstetrics</option>
                              <option value="Oncology">Oncology</option>
                              <option value="Nephrology">Nephrology</option>
                           </select>
                        </div>

                        <div>
                           <label className="block text-xs font-medium text-gray-300 mb-1.5">
                              Purpose of Transfusion
                           </label>
                           <select
                              name="purpose"
                              value={formData.purpose}
                              onChange={handleInputChange}
                              className="input-field w-full text-sm"
                           >
                              <option value="Surgery">Surgery</option>
                              <option value="Trauma">Trauma</option>
                              <option value="Anemia">Anemia Treatment</option>
                              <option value="Cancer">Cancer Treatment</option>
                              <option value="Childbirth">Childbirth</option>
                              <option value="Other">Other</option>
                           </select>
                        </div>
                     </div>

                     <div className="flex items-center gap-2 py-1">
                        <input
                           type="checkbox"
                           name="emergencyRequest"
                           id="modalEmergency"
                           checked={formData.emergencyRequest}
                           onChange={handleInputChange}
                           className="w-4 h-4 text-emerald-500 bg-dark-tertiary border-gray-600 rounded focus:ring-emerald-500 cursor-pointer"
                        />
                        <label htmlFor="modalEmergency" className="text-sm font-semibold text-red-400 cursor-pointer select-none">
                           Mark as High-Priority Emergency
                        </label>
                     </div>

                     <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">
                           Clinical Notes / Special Instructions
                        </label>
                        <textarea
                           name="additionalNotes"
                           value={formData.additionalNotes}
                           onChange={handleInputChange}
                           placeholder="Enter any medical background or transfusion notes..."
                           rows={3}
                           className="input-field w-full text-sm resize-none"
                        />
                     </div>

                     <div className="flex justify-end gap-3 pt-4 border-t border-dark-tertiary">
                        <button
                           type="button"
                           onClick={() => setIsModalOpen(false)}
                           className="btn-secondary text-sm"
                        >
                           Cancel
                        </button>
                        <button
                           type="submit"
                           disabled={submitting}
                           className="btn-primary text-sm px-6"
                        >
                           {submitting ? "Submitting..." : "Issue Blood"}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </>
   );
}
