"use client";

import { useState, useEffect } from "react";
import { recordsAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { ClipboardList, Search, FileText, CheckCircle2, AlertCircle, Clock, Check, Plus, Clipboard, ExternalLink, Eye, Upload, Download } from "lucide-react";
import Modal from "@/components/UI/Modal";

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
    } catch (e) {}

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Laboratory Test Requests</h1>
          <p className="text-gray-400">Process doctor clinical diagnostic test recommendations</p>
        </div>
      </div>

      <div className="card bg-dark-secondary border border-dark-tertiary p-6 rounded-xl">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 flex items-center gap-2 bg-dark-tertiary/45 border border-dark-tertiary/20 rounded-lg px-4">
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
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-tertiary text-left">
                  <th className="py-4 px-4 text-gray-400 font-medium text-sm">Date</th>
                  <th className="py-4 px-4 text-gray-400 font-medium text-sm">Patient Name</th>
                  <th className="py-4 px-4 text-gray-400 font-medium text-sm">Requested Tests</th>
                  <th className="py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="py-4 px-4 text-gray-400 font-medium text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-500 text-sm">
                      No lab test requests found.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-dark-tertiary hover:bg-dark-tertiary/20 transition-colors"
                    >
                      <td className="py-4 px-4 text-gray-300 text-sm">
                        {new Date(record.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-semibold text-sm">{record.patientName}</span>
                      </td>
                      <td className="py-4 px-4 text-gray-300 text-sm font-medium">
                        {parseLabDetails(record.details).request.replace("Recommended Laboratory Tests: ", "")}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {record.status?.toLowerCase() === "pending" ? (
                          <button
                            onClick={() => handleOpenReportModal(record)}
                            className="px-3.5 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all shadow shadow-emerald-500/10 flex items-center gap-1.5 ml-auto active:scale-95"
                          >
                            <FileText size={13} />
                            Upload Report
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenPreviewModal(record)}
                            className="px-3 py-1.5 text-xs font-bold bg-dark-tertiary hover:bg-dark-tertiary/70 text-gray-300 rounded-lg transition-all flex items-center gap-1.5 ml-auto border border-dark-tertiary/50"
                          >
                            <Eye size={13} />
                            View Findings
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-dark-tertiary">
          <p className="text-gray-400 text-sm">
            Showing {filteredRecords.length > 0 ? (page - 1) * 10 + 1 : 0} to{" "}
            {Math.min(page * 10, total)} of {total} requests
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-dark-tertiary rounded-lg hover:bg-dark-tertiary/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              Previous
            </button>
            <button
              disabled={page * 10 >= total}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-dark-tertiary rounded-lg hover:bg-dark-tertiary/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
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
              <p className="text-xs text-gray-500 uppercase font-bold">Patient Name</p>
              <p className="text-sm text-white font-bold mt-0.5">{selectedRecord.patientName}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Doctor's Requested Tests</p>
              <p className="text-xs text-emerald-400 font-semibold mt-0.5 bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-lg">
                {selectedRecord.details ? parseLabDetails(selectedRecord.details).request.replace("Recommended Laboratory Tests: ", "") : "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                Upload Diagnostic Report Attachment (PDF, Image)
              </label>
              <div className="relative border-2 border-dashed border-dark-tertiary/80 hover:border-emerald-500/40 rounded-lg p-4 transition-colors bg-dark-secondary/30 flex flex-col items-center justify-center text-center cursor-pointer">
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
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                Clinical Observations / Findings <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Enter clinical report readings (e.g. Platelets: 250,000 /uL (Normal), Chest X-Ray: Clear lungs, no cardiomegaly.)"
                rows={6}
                required
                className="w-full text-xs bg-dark-tertiary border border-dark-tertiary rounded-lg p-3 outline-none text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex gap-3 justify-end pt-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-dark-tertiary hover:bg-dark-tertiary/70 text-white rounded-lg transition-colors font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 text-white rounded-lg transition-colors font-semibold text-xs flex items-center gap-1.5"
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
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Patient Name</p>
                  <p className="text-sm text-white font-bold mt-0.5">{previewRecord.patientName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Reported Date</p>
                  <p className="text-xs text-white font-semibold mt-0.5">
                    {parsed.reportedAt ? new Date(parsed.reportedAt).toLocaleString() : new Date(previewRecord.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Doctor's Requested Tests</p>
                <p className="text-xs text-white font-semibold mt-0.5 bg-dark-tertiary/40 p-2.5 rounded-lg border border-dark-tertiary/20">
                  {parsed.request.replace("Recommended Laboratory Tests: ", "")}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Clinical Observations / Readings</p>
                <div className="text-xs text-gray-300 leading-relaxed bg-dark-tertiary/20 p-4 rounded-lg border border-dark-tertiary/20 min-h-[100px] whitespace-pre-line">
                  {parsed.observations || "No clinical observations entered."}
                </div>
              </div>

              {parsed.fileData && (
                <div className="bg-emerald-500/[0.02] border border-emerald-500/20 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FileText size={20} className="text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-white max-w-[200px] truncate" title={parsed.fileName}>{parsed.fileName || "report-attachment"}</p>
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
                      className="flex-1 sm:flex-none px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow shadow-emerald-500/10"
                    >
                      <ExternalLink size={13} />
                      View Attachment
                    </button>
                    <a
                      href={parsed.fileData}
                      download={parsed.fileName || "lab-report"}
                      className="flex-1 sm:flex-none px-4 py-2 bg-dark-tertiary hover:bg-dark-tertiary/70 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-dark-tertiary/50"
                    >
                      <Download size={13} />
                      Download
                    </a>
                  </div>
                </div>
              )}

              {parsed.fileData && parsed.fileType?.startsWith("image/") && (
                <div className="border border-dark-tertiary rounded-lg p-2 bg-dark-secondary/30 flex items-center justify-center max-h-[220px] overflow-hidden">
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
                  className="px-5 py-2 bg-dark-tertiary hover:bg-dark-tertiary/70 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Close Findings
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
