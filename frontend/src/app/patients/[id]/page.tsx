"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import apiClient, { patientAPI, appointmentAPI, invoiceAPI, recordsAPI } from "@/lib/api";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Activity,
  FileText,
  DollarSign,
  Bed,
  Droplet,
  AlertCircle,
  Plus,
  Edit,
  ClipboardList,
  ExternalLink,
  Download,
  Eye,
} from "lucide-react";

type TabType = "details" | "appointments" | "prescriptions" | "labs" | "billing" | "admissions";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address?: string;
  history?: string;
  bloodGroup?: string;
  status?: string;
  createdAt: string;
}

const calculateAge = (dobString: string): number => {
  if (!dobString) return 0;
  const today = new Date();
  const birthDate = new Date(dobString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age < 0 ? 0 : age;
};

const formatDate = (dateString: string | Date | null): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function PatientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [labs, setLabs] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Fetch Patient details
      const patientResponse = await patientAPI.get(patientId);
      const patientData = patientResponse.data;
      setPatient(patientData);

      // 2. Fetch Appointments
      const appointmentsResponse = await appointmentAPI.list(1, 100, { patientId: patientId });
      setAppointments(appointmentsResponse.data.appointments || []);

      // 3. Fetch Prescriptions
      const prescriptionsResponse = await apiClient.get("/prescriptions", {
        params: { limit: 100, patientId: patientId },
      });
      setPrescriptions(prescriptionsResponse.data.prescriptions || []);

      // 4. Fetch Invoices (Billing)
      const invoicesResponse = await invoiceAPI.list(1, 100, { patientId: patientId });
      setInvoices(invoicesResponse.data.invoices || []);

      // 5. Fetch Admissions
      const admissionsResponse = await apiClient.get("/room-allotment/allotments", {
        params: { patientId: patientId },
      });
      setAdmissions(admissionsResponse.data.allotments || []);

      // 6. Fetch Labs (from records filtered by Lab Test and patient name)
      if (patientData.name) {
        const labsResponse = await recordsAPI.list(1, 100, "Lab Test", patientData.name);
        setLabs(labsResponse.data.records || []);
      }

    } catch (err: any) {
      console.error("Error fetching patient profile data:", err);
      setError("Failed to load patient clinical history. Please try again.");
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400">Loading patient central registry file...</p>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="card max-w-lg mx-auto mt-12 p-8 text-center space-y-6">
        <AlertCircle size={48} className="text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Error Loading Profile</h2>
        <p className="text-gray-400">{error || "Patient not found in central registry."}</p>
        <button onClick={() => router.push("/patients")} className="btn-primary w-full flex items-center justify-center gap-2">
          <ArrowLeft size={18} /> Back to Patients Registry
        </button>
      </div>
    );
  }

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: "details", label: "Patient Details", icon: User },
    { id: "appointments", label: "Visits / Appointments", icon: Calendar },
    { id: "prescriptions", label: "Prescriptions", icon: FileText },
    { id: "labs", label: "Lab Reports", icon: ClipboardList },
    { id: "billing", label: "Billing History", icon: DollarSign },
    { id: "admissions", label: "Admissions (Rooms)", icon: Bed },
  ];

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/patients" className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors border border-dark-tertiary">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{patient.name}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                patient.status === "Inactive" ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
              }`}>
                {patient.status || "Active"}
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-1">UHID / Patient Registry File: <span className="font-mono text-gray-300">{patient.id}</span></p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link href={`/patients/edit/${patient.id}`} className="btn-secondary flex items-center gap-2 text-sm !py-2.5">
            <Edit size={16} /> Edit Profile
          </Link>
          <Link href="/appointments/add" className="btn-primary flex items-center gap-2 text-sm !py-2.5">
            <Plus size={16} /> New Appointment
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Side: Dynamic Patient Details Summary Card */}
        <div className="card col-span-1 space-y-6 border-emerald-500/20 shadow-md">
          <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-dark-tertiary">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-500 text-3xl font-bold">
              {patient.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">{patient.name}</h3>
              <p className="text-sm text-gray-400">{calculateAge(patient.dob)} yrs old • {patient.gender}</p>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center bg-dark-tertiary/30 p-2.5 rounded-lg border border-dark-tertiary/20">
              <span className="text-gray-400 flex items-center gap-2"><Droplet size={16} className="text-red-500" /> Blood Group</span>
              <span className="font-bold text-white bg-red-500/10 px-2 py-0.5 rounded text-xs">{patient.bloodGroup || "Not Specified"}</span>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 flex items-center gap-2"><Phone size={16} className="text-emerald-500" /> Phone</span>
              <p className="text-white pl-6 font-medium">{patient.phone || "N/A"}</p>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 flex items-center gap-2"><Mail size={16} className="text-emerald-500" /> Email</span>
              <p className="text-white pl-6 font-medium break-all">{patient.email || "N/A"}</p>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 flex items-center gap-2"><Calendar size={16} className="text-emerald-500" /> Date of Birth</span>
              <p className="text-white pl-6 font-medium">{formatDate(patient.dob)}</p>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 flex items-center gap-2"><MapPin size={16} className="text-emerald-500" /> Address</span>
              <p className="text-white pl-6 leading-relaxed">{patient.address || "No address provided."}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Central Clinical History Panel */}
        <div className="lg:col-span-3 card p-0 overflow-hidden flex flex-col">
          {/* Custom Sleek Tabs Headers */}
          <div className="flex overflow-x-auto border-b border-dark-tertiary bg-dark-secondary/50 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-4 font-medium text-sm transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-emerald-500 text-white bg-dark-tertiary/40"
                      : "border-transparent text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <Icon size={16} className={activeTab === tab.id ? "text-emerald-500" : "text-gray-400"} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Dynamic Tab Body Content */}
          <div className="p-6 md:p-8 flex-1 min-h-[400px]">
            {/* TAB 1: DETAILS & CLINICAL BACKGROUND */}
            {activeTab === "details" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-emerald-400 flex items-center gap-2">
                    <Activity size={18} /> Clinical Background & Metadata
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-dark-secondary/40 p-5 rounded-xl border border-dark-tertiary/50">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Registration Date</h4>
                      <p className="text-white font-medium">{formatDate(patient.createdAt)}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Last Update Date</h4>
                      <p className="text-white font-medium">Auto-synced with appointments</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-300">Recorded Medical History</h4>
                  <div className="bg-dark-tertiary/30 border border-dark-tertiary p-5 rounded-xl text-gray-300 leading-relaxed min-h-[120px]">
                    {patient.history ? (
                      <p className="whitespace-pre-line">{patient.history}</p>
                    ) : (
                      <p className="text-gray-500 italic">No historical conditions, surgeries, or drug allergies are logged in this registry file.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: APPOINTMENT VISITS */}
            {activeTab === "appointments" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-emerald-400">All Scheduled & Past Visits</h3>
                  <span className="text-xs text-gray-400">{appointments.length} recorded visits</span>
                </div>

                {appointments.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 card bg-transparent border-dashed">
                    <Calendar size={40} className="mx-auto text-gray-600 mb-3" />
                    <p className="font-medium text-gray-400">No appointments found</p>
                    <p className="text-xs text-gray-500 mt-1">This registry patient has not been assigned to a doctor for any visit yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((apt) => (
                      <div key={apt.id} className="p-5 bg-dark-secondary/50 border border-dark-tertiary/50 rounded-xl hover:border-emerald-500/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-white">Dr. {apt.doctor?.name || "Unassigned"}</span>
                            <span className="text-xs bg-dark-tertiary text-gray-300 px-2 py-0.5 rounded border border-dark-tertiary/50">
                              {apt.department || apt.doctorSpecialty || "General Medicine"}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(apt.date)}</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> {apt.time}</span>
                            {apt.tokenNumber && <span>Token: <strong className="text-emerald-500">{apt.tokenNumber}</strong></span>}
                            {apt.visitType && <span>Type: <strong className="text-gray-300">{apt.visitType}</strong></span>}
                          </div>
                          {apt.notes && <p className="text-xs text-gray-500 italic mt-1">Notes: {apt.notes}</p>}
                        </div>
                        <div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider ${
                            apt.status === "completed" 
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : apt.status === "cancelled"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}>
                            {apt.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: PRESCRIPTION HISTORY */}
            {activeTab === "prescriptions" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-emerald-400">E-Prescription Records</h3>

                {prescriptions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 card bg-transparent border-dashed">
                    <FileText size={40} className="mx-auto text-gray-600 mb-3" />
                    <p className="font-medium text-gray-400">No prescriptions issued</p>
                    <p className="text-xs text-gray-500 mt-1">No medication sheets are registered to this patient ID.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {prescriptions.map((pr) => {
                      let medicationsList = [];
                      try {
                        medicationsList = JSON.parse(pr.medications);
                      } catch (e) {
                        medicationsList = pr.medications ? pr.medications.split(",").map((m: string) => ({ name: m.trim() })) : [];
                      }

                      return (
                        <div key={pr.id} className="p-6 bg-dark-secondary/50 border border-dark-tertiary rounded-xl space-y-4">
                          <div className="flex flex-wrap justify-between items-center border-b border-dark-tertiary/50 pb-3 gap-2">
                            <div>
                              <p className="font-semibold text-white">Dr. {pr.doctor?.name || "Physician"}</p>
                              <p className="text-xs text-gray-400">{formatDate(pr.prescriptionDate)}</p>
                            </div>
                            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-semibold">
                              {pr.prescriptionType}
                            </span>
                          </div>

                          {pr.diagnosis && (
                            <div>
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Diagnosis</span>
                              <p className="text-white text-sm font-medium">{pr.diagnosis}</p>
                            </div>
                          )}

                          <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Medications</span>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs bg-dark-tertiary/20 rounded-lg">
                                <thead>
                                  <tr className="border-b border-dark-tertiary text-gray-400 font-medium">
                                    <th className="p-3">Medicine Name</th>
                                    <th className="p-3">Dosage</th>
                                    <th className="p-3">Frequency</th>
                                    <th className="p-3">Duration</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Array.isArray(medicationsList) ? (
                                    medicationsList.map((med: any, i: number) => (
                                      <tr key={i} className="border-b border-dark-tertiary/40 last:border-0 hover:bg-dark-tertiary/20">
                                        <td className="p-3 text-white font-semibold">{med.name}</td>
                                        <td className="p-3 text-gray-300">{med.dosage || "N/A"}</td>
                                        <td className="p-3 text-gray-300">{med.frequency || "N/A"}</td>
                                        <td className="p-3 text-gray-300">{med.duration || "N/A"}</td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan={4} className="p-3 text-white">{String(pr.medications)}</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {pr.notesForPharmacist && (
                            <div className="bg-dark-tertiary/30 p-3 rounded-lg border border-dark-tertiary/50">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Instruction for Pharmacist</span>
                              <p className="text-xs text-gray-300 italic mt-0.5">{pr.notesForPharmacist}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: LAB REPORTS */}
            {activeTab === "labs" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-emerald-400">Diagnostic & Lab Reports</h3>
                  <span className="text-xs text-gray-400">{labs.length} diagnostic records</span>
                </div>

                {labs.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 card bg-transparent border-dashed">
                    <ClipboardList size={40} className="mx-auto text-gray-600 mb-3" />
                    <p className="font-medium text-gray-400">No laboratory files found</p>
                    <p className="text-xs text-gray-500 mt-1">No diagnostic lab sheets have been registered under this patient's exact name.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {labs.map((lab) => {
                      const parsed = parseLabDetails(lab.details);
                      const isCompleted = lab.status?.toLowerCase() === "completed";
                      
                      return (
                        <div key={lab.id} className="p-6 bg-dark-secondary/50 border border-dark-tertiary rounded-xl space-y-4">
                          <div className="flex justify-between items-start gap-4 border-b border-dark-tertiary/40 pb-3">
                            <div>
                              <p className="font-bold text-white text-sm">
                                {parsed.request.replace("Recommended Laboratory Tests: ", "")}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                Ordered: {formatDate(lab.date)}
                                {parsed.reportedAt && ` • Reported: ${new Date(parsed.reportedAt).toLocaleDateString()}`}
                              </p>
                            </div>
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                              isCompleted 
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}>
                              {lab.status}
                            </span>
                          </div>

                          {isCompleted && (
                            <div className="space-y-3">
                              <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Clinical Observations & Findings</span>
                                <p className="text-xs text-gray-300 bg-dark-tertiary/20 p-3 rounded-lg border border-dark-tertiary/20 mt-1 leading-relaxed whitespace-pre-line">
                                  {parsed.observations || "No clinical observations entered."}
                                </p>
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
                                          newTab.document.write(`
                                            <!DOCTYPE html>
                                            <html>
                                            <head>
                                              <title>Laboratory Report - ${patient?.name || 'Attachment'}</title>
                                              <style>
                                                body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background-color: #121214; }
                                                iframe { border: none; width: 100%; height: 100%; }
                                              </style>
                                            </head>
                                            <body>
                                              <iframe src="${parsed.fileData}" allowfullscreen></iframe>
                                            </body>
                                            </html>
                                          `);
                                          newTab.document.close();
                                        }
                                      }}
                                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow shadow-emerald-500/10"
                                    >
                                      <ExternalLink size={13} />
                                      View Report File
                                    </button>
                                    <a
                                      href={parsed.fileData}
                                      download={parsed.fileName || "lab-report"}
                                      className="px-4 py-2 bg-dark-tertiary hover:bg-dark-tertiary/70 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-dark-tertiary/50"
                                    >
                                      <Download size={13} />
                                      Download
                                    </a>
                                  </div>
                                </div>
                              )}

                              {parsed.fileData && parsed.fileType?.startsWith("image/") && (
                                <div className="border border-dark-tertiary rounded-lg p-2 bg-dark-secondary/30 flex items-center justify-center max-h-[220px] overflow-hidden w-full sm:w-60">
                                  <img
                                    src={parsed.fileData}
                                    alt={parsed.fileName || "attachment"}
                                    className="max-h-[200px] object-contain rounded"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: BILLING HISTORY */}
            {activeTab === "billing" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-emerald-400">Billing History & Invoices</h3>

                {invoices.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 card bg-transparent border-dashed">
                    <DollarSign size={40} className="mx-auto text-gray-600 mb-3" />
                    <p className="font-medium text-gray-400">No billing invoices found</p>
                    <p className="text-xs text-gray-500 mt-1">No invoices or payments are logged for this patient ID.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-dark-tertiary text-gray-400 text-sm font-medium">
                          <th className="py-3 px-2">Invoice ID</th>
                          <th className="py-3 px-2">Created Date</th>
                          <th className="py-3 px-2">Due Date</th>
                          <th className="py-3 px-2 text-right">Amount</th>
                          <th className="py-3 px-2 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {invoices.map((inv) => (
                          <tr key={inv.id} className="border-b border-dark-tertiary/50 hover:bg-dark-tertiary/20">
                            <td className="py-4 px-2 font-mono text-xs text-white">{inv.id.substring(0, 8)}...</td>
                            <td className="py-4 px-2 text-gray-300">{formatDate(inv.date)}</td>
                            <td className="py-4 px-2 text-gray-300">{formatDate(inv.dueDate)}</td>
                            <td className="py-4 px-2 text-right font-bold text-white">${parseFloat(inv.amount).toFixed(2)}</td>
                            <td className="py-4 px-2 text-center">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                inv.status === "paid" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                              }`}>
                                {inv.status.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: ROOM ADMISSIONS */}
            {activeTab === "admissions" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-emerald-400">In-Patient Room Admissions</h3>

                {admissions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 card bg-transparent border-dashed">
                    <Bed size={40} className="mx-auto text-gray-600 mb-3" />
                    <p className="font-medium text-gray-400">No admission records</p>
                    <p className="text-xs text-gray-500 mt-1">This registry patient has not been admitted to any room allotment.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {admissions.map((adm) => (
                      <div key={adm.id} className="p-5 bg-dark-secondary/50 border border-dark-tertiary/50 rounded-xl space-y-3">
                        <div className="flex flex-wrap justify-between items-center border-b border-dark-tertiary/50 pb-3 gap-2">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-white">Room {adm.roomNumber || "N/A"}</span>
                            <span className="text-xs text-gray-400">{adm.roomType || "Standard"} • {adm.department || "General"}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            adm.status === "Occupied" ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"
                          }`}>
                            {adm.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-gray-400 block uppercase font-bold tracking-wider">Attending Doctor</span>
                            <span className="text-white font-medium mt-0.5 block">{adm.attendingDoctor || "Physician"}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block uppercase font-bold tracking-wider">Allotment Date</span>
                            <span className="text-white font-medium mt-0.5 block">{formatDate(adm.allotmentDate)}</span>
                          </div>
                          {adm.expectedDischargeDate && (
                            <div>
                              <span className="text-gray-400 block uppercase font-bold tracking-wider">Discharge Date</span>
                              <span className="text-white font-medium mt-0.5 block">{formatDate(adm.expectedDischargeDate)}</span>
                            </div>
                          )}
                          {adm.insuranceDetails && (
                            <div>
                              <span className="text-gray-400 block uppercase font-bold tracking-wider">Insurance Cover</span>
                              <span className="text-white font-medium mt-0.5 block">{adm.insuranceDetails}</span>
                            </div>
                          )}
                        </div>

                        {adm.additionalNotes && (
                          <div className="bg-dark-tertiary/30 p-2.5 rounded border border-dark-tertiary/20 text-xs">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Clinical Notes</span>
                            <p className="text-gray-300 italic mt-0.5">{adm.additionalNotes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
