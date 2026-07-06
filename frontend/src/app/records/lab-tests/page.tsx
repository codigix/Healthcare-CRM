"use client";

import { useState, useEffect } from "react";
import { recordsAPI, patientAPI, whatsappAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { ClipboardList, Search, FileText, CheckCircle2, AlertCircle, Clock, Check, Plus, Clipboard, ExternalLink, Eye, Upload, Download } from "lucide-react";
import Modal from "@/components/ui/Modal";
import DataTable, { Column } from "@/components/ui/DataTable";

interface LabRecord {
   id: string;
   type: string;
   patientName: string;
   date: string;
   details: string;
   status: string;
   createdAt: string;
}

export default function LabTestsPage() {
   const { user } = useAuthStore();
   const [records, setRecords] = useState<LabRecord[]>([]);
   const [loading, setLoading] = useState(true);
   const [statusFilter, setStatusFilter] = useState("all");
   const [searchQuery, setSearchQuery] = useState("");
   const [page, setPage] = useState(1);
   const [total, setTotal] = useState(0);

   // Modal State
   const [showModal, setShowModal] = useState(false);
   const [selectedRecord, setSelectedRecord] = useState<LabRecord | null>(null);
   const [reportText, setReportText] = useState("");
   const [submitting, setSubmitting] = useState(false);

   // Upload report file state variables
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [fileBase64, setFileBase64] = useState<string>("");
   const [fileName, setFileName] = useState<string>("");
   const [fileType, setFileType] = useState<string>("");

   // Preview Modal State
   const [showPreviewModal, setShowPreviewModal] = useState(false);
   const [previewRecord, setPreviewRecord] = useState<LabRecord | null>(null);

   // WhatsApp sharing states
   const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
   const [whatsappRecord, setWhatsappRecord] = useState<LabRecord | null>(null);
   const [whatsappNumber, setWhatsappNumber] = useState("");
   const [searchingPhone, setSearchingPhone] = useState(false);
   const [attachFile, setAttachFile] = useState(true);

   // WhatsApp Scanner states
   const [whatsappStatus, setWhatsappStatus] = useState("loading"); // 'loading', 'qr_required', 'ready', 'disconnected'
   const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
   const [sendingMessage, setSendingMessage] = useState(false);

   const checkWhatsAppStatus = async () => {
      try {
         const res = await whatsappAPI.getStatus();
         setWhatsappStatus(res.data.status);
         setQrCodeUrl(res.data.qrCodeUrl);
      } catch (err) {
         console.error("Failed to check WhatsApp status:", err);
      }
   };

   // Poll WhatsApp scanner status when the modal is open
   useEffect(() => {
      let interval: NodeJS.Timeout;
      if (showWhatsAppModal) {
         checkWhatsAppStatus();
         interval = setInterval(checkWhatsAppStatus, 5000);
      }
      return () => {
         if (interval) clearInterval(interval);
      };
   }, [showWhatsAppModal]);

   const cleanAndFormatPhone = (phoneStr: string) => {
      let cleaned = phoneStr.replace(/[^0-9]/g, "");
      // Trim leading zeros
      while (cleaned.startsWith("0")) {
         cleaned = cleaned.substring(1);
      }
      // Prepend '91' for India by default if it's 10 digits
      if (cleaned.length === 10) {
         return "91" + cleaned;
      }
      return cleaned;
   };

   const lookupPatientPhone = async (patientName: string) => {
      try {
         setSearchingPhone(true);
         const res = await patientAPI.search(patientName);
         if (res.data.success && res.data.patients && res.data.patients.length > 0) {
            // Find the patient matching name or select first
            const patient = res.data.patients[0];
            if (patient.phone) {
               setWhatsappNumber(cleanAndFormatPhone(patient.phone));
            } else {
               setWhatsappNumber("");
            }
         } else {
            setWhatsappNumber("");
         }
      } catch (err) {
         console.error("Failed to search patient phone:", err);
         setWhatsappNumber("");
      } finally {
         setSearchingPhone(false);
      }
   };

   const generateWhatsAppMessage = (record: LabRecord | null) => {
      if (!record) return "";
      const parsed = parseLabDetails(record.details);
      const dateStr = new Date(record.date).toLocaleDateString("en-US", {
         month: "short",
         day: "numeric",
         year: "numeric"
      });

      const obs = parsed.observations ? parsed.observations.trim() : "No clinical observations entered.";
      const testType = parsed.request ? parsed.request.replace("Recommended Laboratory Tests: ", "") : record.type;

      return `*🔬 LABORATORY DIAGNOSTIC REPORT*

*Patient Name:* ${record.patientName}
*Test Type:* ${testType}
*Report Date:* ${dateStr}

*📋 Clinical Observations & Findings:*
${obs}

---
*📄 Note:* You can log in to your patient portal at http://localhost:3000 to download the official signed PDF/Image report.

Thank you,
*MedixPro Health CRM System*`;
   };

   const handleSendWhatsApp = async () => {
      if (!whatsappRecord) return;
      const cleanPhone = whatsappNumber.replace(/[^0-9]/g, "");

      if (!cleanPhone) {
         alert("Please enter a valid phone number with country code.");
         return;
      }

      const msg = generateWhatsAppMessage(whatsappRecord);
      const parsed = parseLabDetails(whatsappRecord.details);

      try {
         setSendingMessage(true);
         if (attachFile && parsed.fileData) {
            await whatsappAPI.sendMessage(
               cleanPhone,
               msg,
               parsed.fileData,
               parsed.fileName || "lab-report",
               parsed.fileType || "application/pdf"
            );
         } else {
            await whatsappAPI.sendMessage(cleanPhone, msg);
         }
         alert("✓ Report sent successfully in the background on WhatsApp!");
         setShowWhatsAppModal(false);
      } catch (err: any) {
         console.error("Failed to send background WhatsApp message:", err);
         const errMsg = err.response?.data?.error || "Make sure your WhatsApp QR scanner is linked.";
         alert(`Failed to send message: ${errMsg}`);
      } finally {
         setSendingMessage(false);
      }
   };

   const handleOpenWhatsAppModal = (record: LabRecord) => {
      setWhatsappRecord(record);
      setWhatsappNumber("");
      setAttachFile(true);
      setShowWhatsAppModal(true);
      if (record.patientName) {
         lookupPatientPhone(record.patientName);
      }
   };

   const fetchLabRecords = async () => {
      try {
         setLoading(true);
         // Query records of type 'Lab Test'
         const res = await recordsAPI.list(page, 10, "Lab Test", searchQuery);
         setRecords(res.data.records || []);
         setTotal(res.data.total || 0);
      } catch (err) {
         console.error("Failed to fetch lab test requests:", err);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchLabRecords();
   }, [page, statusFilter, searchQuery]);

   const handleOpenReportModal = (record: LabRecord) => {
      setSelectedRecord(record);
      setReportText("");
      setSelectedFile(null);
      setFileBase64("");
      setFileName("");
      setFileType("");
      setShowModal(true);
   };

   const handleOpenPreviewModal = (record: LabRecord) => {
      setPreviewRecord(record);
      setShowPreviewModal(true);
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
         alert("File is too large. Please select a file under 5MB.");
         return;
      }

      setSelectedFile(file);
      setFileName(file.name);
      setFileType(file.type);

      const reader = new FileReader();
      reader.onloadend = () => {
         setFileBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
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

   const handleSubmitReport = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedRecord || !reportText.trim()) return;

      try {
         setSubmitting(true);

         const originalDetails = selectedRecord.details || "";
         const reportPayload = {
            request: originalDetails,
            observations: reportText.trim(),
            fileName: fileName || null,
            fileType: fileType || null,
            fileData: fileBase64 || null,
            reportedAt: new Date().toISOString()
         };

         await recordsAPI.update(selectedRecord.id, {
            status: "Completed",
            details: JSON.stringify(reportPayload)
         });

         setShowModal(false);
         setSelectedFile(null);
         setFileBase64("");
         setFileName("");
         setFileType("");
         fetchLabRecords();
      } catch (err) {
         console.error("Failed to submit laboratory report:", err);
         alert("Failed to submit report. Please try again.");
      } finally {
         setSubmitting(false);
      }
   };

   const getStatusStyle = (status: string) => {
      if (status?.toLowerCase() === "completed") {
         return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      }
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
   };

   const filteredRecords = records.filter(r => {
      if (statusFilter === "all") return true;
      return r.status.toLowerCase() === statusFilter.toLowerCase();
   });

   const columns_0: Column<any>[] = [
      {
         header: "Date", accessor: (record) => (<>\n{new Date(record.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
         })}\n</>)
      },
      { header: "Patient Name", accessor: (record) => (<>\n<span className="text-white font-semibold text-sm">{record.patientName}</span>\n</>) },
      { header: "Requested Tests", accessor: (record) => (<>\n{parseLabDetails(record.details).request.replace("Recommended Laboratory Tests: ", "")}\n</>) },
      {
         header: "Status", accessor: (record) => (<>\n<span className={`px-2.5 py-1 rounded-full text-xs  border ${getStatusStyle(record.status)}`}>
            {record.status}
         </span>\n</>)
      },
      {
         header: "Actions", accessor: (record) => (<>\n{record.status?.toLowerCase() === "pending" ? (
            <button
               onClick={() => handleOpenReportModal(record)}
               className="px-3.5 py-1.5 text-xs  bg-emerald-500 hover:bg-emerald-600 text-white rounded transition-all shadow shadow-emerald-500/10 flex items-center gap-1.5 ml-auto active:scale-95"
            >
               <FileText size={13} />
               Upload Report
            </button>
         ) : (
            <div className="flex gap-2 justify-end items-center">
               <button
                  onClick={() => handleOpenPreviewModal(record)}
                  className="px-3 py-1.5 text-xs  bg-dark-tertiary hover:bg-dark-tertiary/70 text-gray-300 rounded transition-all flex items-center gap-1.5 border border-dark-tertiary/50"
               >
                  <Eye size={13} />
                  View Findings
               </button>
               <button
                  onClick={() => handleOpenWhatsAppModal(record)}
                  className="px-3 py-1.5 text-xs  bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-all flex items-center gap-1.5 shadow shadow-emerald-600/10 active:scale-95 hover:shadow-emerald-500/20"
               >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                     <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.63-1.023-5.102-2.884-6.964C16.588 1.916 14.11 .89 11.5 1.89c-5.442 0-9.863 4.42-9.866 9.863 0 1.942.5 3.829 1.458 5.484L2.081 21.6l4.566-1.446zm11.502-5.32c-.29-.146-1.727-.852-1.993-.95-.267-.099-.463-.146-.659.147-.196.294-.761.95-.933 1.147-.171.195-.343.22-.633.073-.29-.147-1.228-.452-2.337-1.443-.862-.77-1.444-1.72-1.613-2.014-.17-.294-.018-.452.128-.597.133-.13.295-.343.442-.515.147-.172.196-.294.294-.49.098-.196.05-.367-.025-.514-.074-.147-.659-1.592-.903-2.179-.237-.573-.478-.496-.659-.505-.171-.007-.368-.008-.564-.008-.196 0-.514.073-.784.367-.27.294-1.028 1.004-1.028 2.449 0 1.445 1.05 2.84 1.196 3.037.147.196 2.067 3.156 5.007 4.428.699.302 1.246.484 1.671.62.704.223 1.346.191 1.853.115.564-.084 1.727-.706 1.972-1.39.245-.685.245-1.272.171-1.39-.073-.118-.27-.196-.56-.343z" />
                  </svg>
                  WhatsApp
               </button>
            </div>
         )}\n</>)
      },
   ];


   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center my-3 my-3">
            <div>
               <h1 className="text-3xl  text-white mb-2">Laboratory Test Requests</h1>
               <p className="text-gray-400">Process doctor clinical diagnostic test recommendations</p>
            </div>
         </div>

         <div className="card bg-dark-secondary border border-dark-tertiary p-6 rounded-xl">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
               <div className="flex-1 flex items-center gap-2 bg-dark-tertiary/45 border border-dark-tertiary/20 rounded px-4">
                  <Search size={20} className="text-gray-400" />
                  <input
                     type="text"
                     placeholder="Search by patient name or test..."
                     value={searchQuery}
                     onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setPage(1);
                     }}
                     className="bg-transparent py-3 flex-1 outline-none text-white text-sm"
                  />
               </div>

               <select
                  value={statusFilter}
                  onChange={(e) => {
                     setStatusFilter(e.target.value);
                     setPage(1);
                  }}
                  className="input-field py-2 bg-dark-tertiary/30 w-full md:w-48 text-xs h-[46px]"
               >
                  <option value="all">All Requests</option>
                  <option value="pending">Pending Tests</option>
                  <option value="completed">Completed Tests</option>
               </select>
            </div>

            {loading && records.length === 0 ? (
               <div className="text-center py-12 text-gray-400">Loading lab test requests...</div>
            ) : (
               <div className="overflow-x-auto">
                  <DataTable columns={columns_0} data={filteredRecords} enableLocalSearch enableLocalPagination />
               </div>
            )}

            <div className="flex justify-between items-center my-3 my-3 mt-6 pt-4 border-t border-dark-tertiary">
               <p className="text-gray-400 text-sm">
                  Showing {filteredRecords.length > 0 ? (page - 1) * 10 + 1 : 0} to{" "}
                  {Math.min(page * 10, total)} of {total} requests
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

         {/* Modal for drafting clinical findings */}
         <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="Draft Diagnostic Report"
         >
            {selectedRecord && (
               <form onSubmit={handleSubmitReport} className="space-y-4">
                  <div>
                     <p className="text-xs text-gray-500 uppercase ">Patient Name</p>
                     <p className="text-sm text-white  mt-0.5">{selectedRecord.patientName}</p>
                  </div>

                  <div>
                     <p className="text-xs text-gray-500 uppercase ">Doctor's Requested Tests</p>
                     <p className="text-xs text-emerald-400 font-semibold mt-0.5 bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded">
                        {selectedRecord.details ? parseLabDetails(selectedRecord.details).request.replace("Recommended Laboratory Tests: ", "") : "N/A"}
                     </p>
                  </div>

                  <div>
                     <label className="block text-xs  text-gray-300 mb-1.5">
                        Upload Diagnostic Report Attachment (PDF, Image)
                     </label>
                     <div className="relative border-2 border-dashed border-dark-tertiary/80 hover:border-emerald-500/40 rounded p-4 transition-colors bg-dark-secondary/30 flex flex-col items-center justify-center text-center cursor-pointer">
                        <input
                           type="file"
                           accept="image/*,application/pdf"
                           onChange={handleFileChange}
                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload className="text-emerald-400 mb-2" size={24} />
                        <span className="text-xs font-semibold text-white">
                           {selectedFile ? selectedFile.name : "Choose PDF or Image file..."}
                        </span>
                        <span className="text-[10px] text-gray-500 mt-1">
                           {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : "Max file size: 5MB"}
                        </span>
                     </div>
                  </div>

                  <div>
                     <label className="block text-xs  text-gray-300 mb-1.5">
                        Clinical Observations / Findings <span className="text-red-500">*</span>
                     </label>
                     <textarea
                        value={reportText}
                        onChange={(e) => setReportText(e.target.value)}
                        placeholder="Enter clinical report readings (e.g. Platelets: 250,000 /uL (Normal), Chest X-Ray: Clear lungs, no cardiomegaly.)"
                        rows={6}
                        required
                        className="w-full text-xs bg-dark-tertiary border border-dark-tertiary rounded p-3 outline-none text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                     />
                  </div>

                  <div className="flex gap-3 justify-end pt-3">
                     <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-5 py-2 bg-dark-tertiary hover:bg-dark-tertiary/70 text-white rounded transition-colors font-semibold text-xs"
                     >
                        Cancel
                     </button>
                     <button
                        type="submit"
                        disabled={submitting}
                        className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 text-white rounded transition-colors font-semibold text-xs flex items-center gap-1.5"
                     >
                        {submitting ? "Submitting..." : "Submit Report"}
                     </button>
                  </div>
               </form>
            )}
         </Modal>

         {/* Modal for viewing clinical diagnostic report findings */}
         <Modal
            isOpen={showPreviewModal}
            onClose={() => setShowPreviewModal(false)}
            title="Laboratory Test Findings"
         >
            {previewRecord && (() => {
               const parsed = parseLabDetails(previewRecord.details);
               return (
                  <div className="space-y-4 text-gray-300">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <p className="text-[10px] text-gray-500 uppercase ">Patient Name</p>
                           <p className="text-sm text-white  mt-0.5">{previewRecord.patientName}</p>
                        </div>
                        <div>
                           <p className="text-[10px] text-gray-500 uppercase ">Reported Date</p>
                           <p className="text-xs text-white font-semibold mt-0.5">
                              {parsed.reportedAt ? new Date(parsed.reportedAt).toLocaleString() : new Date(previewRecord.date).toLocaleDateString()}
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
 <title>Laboratory Report - ${previewRecord?.patientName || 'Attachment'}</title>
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
                           onClick={() => setShowPreviewModal(false)}
                           className="px-5 py-2 bg-dark-tertiary hover:bg-dark-tertiary/70 text-white rounded text-xs  transition-colors"
                        >
                           Close Findings
                        </button>
                     </div>
                  </div>
               );
            })()}
         </Modal>

         {/* Modal for sending report via WhatsApp */}
         <Modal
            isOpen={showWhatsAppModal}
            onClose={() => setShowWhatsAppModal(false)}
            title="Automated WhatsApp Report Sharing"
         >
            {whatsappRecord && (() => {
               const parsed = parseLabDetails(whatsappRecord.details);
               const hasAttachment = !!parsed.fileData;

               // Render Setup Panel (QR Scanner) if WhatsApp is not ready
               if (whatsappStatus !== "ready" && whatsappStatus !== "loading") {
                  return (
                     <div className="space-y-6 text-gray-300 py-2">
                        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
                           <div className="bg-amber-500/20 p-2 rounded text-amber-400 shrink-0">
                              <AlertCircle size={24} />
                           </div>
                           <div>
                              <h4 className="text-sm  text-white">Scanner Linkage Required</h4>
                              <p className="text-xs text-gray-400 mt-1">
                                 To send WhatsApp messages automatically in the background for free, you must link your hospital's WhatsApp number to this server.
                              </p>
                           </div>
                        </div>

                        <div className="flex flex-col items-center justify-center p-6 bg-dark-secondary/50 rounded-2xl border border-dark-tertiary/20 shadow-2xl relative overflow-hidden">
                           <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full -top-10 -right-10 pointer-events-none"></div>

                           <p className="text-xs text-gray-400 font-semibold mb-4 text-center max-w-[320px]">
                              Open <span className="text-white ">WhatsApp</span> on your phone → tap <span className="text-white ">Settings / Menu</span> → select <span className="text-white ">Linked Devices</span> → scan this code:
                           </p>

                           {qrCodeUrl ? (
                              <div className="relative p-3 bg-card rounded-xl shadow-lg border-2 border-emerald-500/30">
                                 <img
                                    src={qrCodeUrl}
                                    alt="WhatsApp Linking QR Code"
                                    className="w-[200px] h-[200px]"
                                 />
                              </div>
                           ) : (
                              <div className="w-[200px] h-[200px] bg-dark-tertiary/20 rounded-xl flex items-center justify-center border border-dark-tertiary/40">
                                 <p className="text-xs text-gray-500 animate-pulse">Generating QR Code...</p>
                              </div>
                           )}

                           <div className="mt-5 flex items-center gap-2 text-xs text-emerald-400  bg-emerald-500/10 py-1.5 px-4 rounded-full border border-emerald-500/20">
                              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                              Waiting for scanner... (Auto-linking)
                           </div>
                        </div>

                        <div className="flex justify-end pt-3 border-t border-dark-tertiary">
                           <button
                              type="button"
                              onClick={() => setShowWhatsAppModal(false)}
                              className="px-5 py-2 bg-dark-tertiary hover:bg-dark-tertiary/70 text-white rounded transition-colors font-semibold text-xs"
                           >
                              Cancel Setup
                           </button>
                        </div>
                     </div>
                  );
               }

               // Render Loading State
               if (whatsappStatus === "loading") {
                  return (
                     <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                        <p className="text-xs text-gray-400">Verifying background WhatsApp gateway status...</p>
                     </div>
                  );
               }

               // Render Normal Background Sender Panel when Linked/Ready
               return (
                  <div className="space-y-5 text-gray-300">
                     <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-start gap-3">
                        <div className="bg-emerald-500/20 p-2 rounded text-emerald-400 shrink-0">
                           <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.63-1.023-5.102-2.884-6.964C16.588 1.916 14.11 .89 11.5 1.89c-5.442 0-9.863 4.42-9.866 9.863 0 1.942.5 3.829 1.458 5.484L2.081 21.6l4.566-1.446zm11.502-5.32c-.29-.146-1.727-.852-1.993-.95-.267-.099-.463-.146-.659.147-.196.294-.761.95-.933 1.147-.171.195-.343.22-.633.073-.29-.147-1.228-.452-2.337-1.443-.862-.77-1.444-1.72-1.613-2.014-.17-.294-.018-.452.128-.597.133-.13.295-.343.442-.515.147-.172.196-.294.294-.49.098-.196.05-.367-.025-.514-.074-.147-.659-1.592-.903-2.179-.237-.573-.478-.496-.659-.505-.171-.007-.368-.008-.564-.008-.196 0-.514.073-.784.367-.27.294-1.028 1.004-1.028 2.449 0 1.445 1.05 2.84 1.196 3.037.147.196 2.067 3.156 5.007 4.428.699.302 1.246.484 1.671.62.704.223 1.346.191 1.853.115.564-.084 1.727-.706 1.972-1.39.245-.685.245-1.272.171-1.39-.073-.118-.27-.196-.56-.343z" />
                           </svg>
                        </div>
                        <div>
                           <h4 className="text-sm  text-white">Linked & Ready (Background Sending)</h4>
                           <p className="text-xs text-gray-400 mt-0.5">
                              Your number is linked successfully. Reports will be sent completely silently in the background with no redirects!
                           </p>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4 bg-dark-secondary/20 p-3 rounded border border-dark-tertiary/10">
                        <div>
                           <p className="text-[10px] text-gray-500 uppercase ">Patient Name</p>
                           <p className="text-sm text-white  mt-0.5">{whatsappRecord.patientName}</p>
                        </div>
                        <div>
                           <p className="text-[10px] text-gray-500 uppercase ">Requested Test</p>
                           <p className="text-sm text-white font-semibold mt-0.5 max-w-[200px] truncate" title={parsed.request}>
                              {parsed.request ? parsed.request.replace("Recommended Laboratory Tests: ", "") : whatsappRecord.type}
                           </p>
                        </div>
                     </div>

                     <div>
                        <label className="block text-[10px] uppercase  text-gray-500 mb-1.5">
                           Patient's WhatsApp Mobile Number (with Country Code)
                        </label>
                        <div className="flex gap-2">
                           <input
                              type="text"
                              placeholder="e.g. 919876543210"
                              value={whatsappNumber}
                              onChange={(e) => setWhatsappNumber(e.target.value.replace(/[^0-9]/g, ''))}
                              className="w-full text-xs bg-dark-tertiary border border-dark-tertiary rounded p-3 outline-none text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                           />
                           <button
                              type="button"
                              onClick={() => lookupPatientPhone(whatsappRecord.patientName)}
                              disabled={searchingPhone}
                              className="px-4 bg-dark-tertiary hover:bg-dark-tertiary/70 disabled:opacity-50 text-gray-300 rounded text-xs font-semibold whitespace-nowrap border border-dark-tertiary/50"
                           >
                              {searchingPhone ? "Searching..." : "Auto-fill"}
                           </button>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">
                           Ensure to include country code (e.g. <span className="text-emerald-400">91</span> for India) without '+' or spaces.
                        </p>
                     </div>

                     {hasAttachment && (
                        <div className="bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/20 p-3.5 rounded flex items-center justify-between transition-colors">
                           <div className="flex items-center gap-2.5">
                              <div className="bg-emerald-500/10 p-2 rounded text-emerald-400">
                                 <FileText size={16} />
                              </div>
                              <div>
                                 <p className="text-xs  text-white max-w-[200px] truncate" title={parsed.fileName}>{parsed.fileName || "report-attachment"}</p>
                                 <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mt-0.5">{parsed.fileType?.split("/")[1] || "File"}</p>
                              </div>
                           </div>
                           <label className="relative flex items-center gap-2 cursor-pointer select-none">
                              <input
                                 type="checkbox"
                                 checked={attachFile}
                                 onChange={(e) => setAttachFile(e.target.checked)}
                                 className="rounded border-dark-tertiary bg-dark-secondary text-emerald-500 focus:ring-emerald-500 focus:ring-offset-dark-secondary w-4.5 h-4.5 transition-all cursor-pointer"
                              />
                              <span className="text-xs  text-gray-200">Send Attachment</span>
                           </label>
                        </div>
                     )}

                     <div>
                        <label className="block text-[10px] uppercase  text-gray-500 mb-1.5">
                           Message Preview
                        </label>
                        <div className="text-xs bg-dark-tertiary/30 p-3 rounded border border-dark-tertiary/30 whitespace-pre-line text-gray-300 max-h-[140px] overflow-y-auto font-mono leading-relaxed select-all">
                           {generateWhatsAppMessage(whatsappRecord)}
                        </div>
                     </div>

                     <div className="flex gap-3 justify-end pt-3 border-t border-dark-tertiary">
                        <button
                           type="button"
                           onClick={() => setShowWhatsAppModal(false)}
                           className="px-5 py-2.5 bg-dark-tertiary hover:bg-dark-tertiary/70 text-white rounded transition-colors font-semibold text-xs"
                        >
                           Cancel
                        </button>
                        <button
                           type="button"
                           onClick={handleSendWhatsApp}
                           disabled={!whatsappNumber || sendingMessage}
                           className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 text-white rounded transition-all font-semibold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/15"
                        >
                           {sendingMessage ? (
                              <>
                                 <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                 Sending Message...
                              </>
                           ) : (
                              <>
                                 <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.63-1.023-5.102-2.884-6.964C16.588 1.916 14.11 .89 11.5 1.89c-5.442 0-9.863 4.42-9.866 9.863 0 1.942.5 3.829 1.458 5.484L2.081 21.6l4.566-1.446zm11.502-5.32c-.29-.146-1.727-.852-1.993-.95-.267-.099-.463-.146-.659.147-.196.294-.761.95-.933 1.147-.171.195-.343.22-.633.073-.29-.147-1.228-.452-2.337-1.443-.862-.77-1.444-1.72-1.613-2.014-.17-.294-.018-.452.128-.597.133-.13.295-.343.442-.515.147-.172.196-.294.294-.49.098-.196.05-.367-.025-.514-.074-.147-.659-1.592-.903-2.179-.237-.573-.478-.496-.659-.505-.171-.007-.368-.008-.564-.008-.196 0-.514.073-.784.367-.27.294-1.028 1.004-1.028 2.449 0 1.445 1.05 2.84 1.196 3.037.147.196 2.067 3.156 5.007 4.428.699.302 1.246.484 1.671.62.704.223 1.346.191 1.853.115.564-.084 1.727-.706 1.972-1.39.245-.685.245-1.272.171-1.39-.073-.118-.27-.196-.56-.343z" />
                                 </svg>
                                 Send Message Instantly
                              </>
                           )}
                        </button>
                     </div>
                  </div>
               );
            })()}
         </Modal>
      </div>
   );
}

