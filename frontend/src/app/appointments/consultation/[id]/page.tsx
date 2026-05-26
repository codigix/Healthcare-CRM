"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { appointmentAPI, patientAPI, medicineAPI } from "@/lib/api";
import Link from "next/link";
import {
  ArrowLeft,
  Activity,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  Check,
  User,
  Clock,
  Heart,
  FileText,
  Search,
  CheckSquare,
  Square,
  PlusCircle
} from "lucide-react";

interface MedicineItem {
  name: string;
  dosage: string;
  duration: string;
  instructions: string;
}

interface PastAppointment {
  id: string;
  date: string;
  notes?: string;
  status: string;
  doctor?: { name: string };
  tokenNumber?: string;
}

export default function ConsultationPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const id = params.id as string;

  // Authorization check
  const isDoctor = user?.role === "doctor" || user?.department?.toLowerCase() === "doctor";

  // State management
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [appointment, setAppointment] = useState<any>(null);
  const [patient, setPatient] = useState<any>(null);
  const [pastVisits, setPastVisits] = useState<PastAppointment[]>([]);

  // Clinical inputs
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [observations, setObservations] = useState("");
  const [advice, setAdvice] = useState("");

  // Patient editable medical details
  const [allergies, setAllergies] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");

  // Prescription builder state
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [medName, setMedName] = useState("");
  const [medDosage, setMedDosage] = useState("1-0-1");
  const [medDuration, setMedDuration] = useState("5 days");
  const [medInstructions, setMedInstructions] = useState("After food");

  // Autocomplete medicines from DB
  const [dbMedicines, setDbMedicines] = useState<any[]>([]);
  const [showMedSuggestions, setShowMedSuggestions] = useState(false);

  // Recommendations state
  const [labTestsActive, setLabTestsActive] = useState(false);
  const [selectedLabTests, setSelectedLabTests] = useState<string[]>([]);
  const [otherLabTests, setOtherLabTests] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [admissionRecommended, setAdmissionRecommended] = useState(false);
  const [admissionNotes, setAdmissionNotes] = useState("");

  // Error/Success state
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Common preset options for UX speed
  const dosagePresets = ["1-0-1", "1-0-0", "0-0-1", "1-1-1", "0-1-0", "As required"];
  const durationPresets = ["3 days", "5 days", "7 days", "10 days", "2 weeks", "1 month"];
  const instructionPresets = ["After food", "Before food", "With milk", "At bedtime", "Empty stomach"];
  const labTestPresets = ["Blood Test", "X-Ray", "MRI", "CT Scan", "ECG"];

  useEffect(() => {
    if (!isDoctor && user) {
      router.push("/appointments");
    }
  }, [isDoctor, user, router]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Appointment Details
        const aptRes = await appointmentAPI.get(id);
        const aptData = aptRes.data;
        setAppointment(aptData);
        
        // Map notes if the appointment was edited previously or pre-filled
        if (aptData.notes) {
          try {
            const parsedNotes = JSON.parse(aptData.notes);
            setSymptoms(parsedNotes.symptoms || "");
            setDiagnosis(parsedNotes.diagnosis || "");
            setObservations(parsedNotes.observations || "");
            setAdvice(parsedNotes.advice || "");
            setFollowUpDate(parsedNotes.followUpDate || "");
            setLabTestsActive(!!parsedNotes.labTestsActive);
            setSelectedLabTests(parsedNotes.labTests || []);
            setOtherLabTests(parsedNotes.otherLabTests || "");
            setAdmissionRecommended(!!parsedNotes.admissionRecommended);
            setAdmissionNotes(parsedNotes.admissionNotes || "");
          } catch (e) {
            // Treat as plain text reason for visit or notes
            setSymptoms(aptData.notes);
          }
        }

        // 2. Fetch Patient Details
        if (aptData.patientId) {
          const patRes = await patientAPI.get(aptData.patientId);
          const patData = patRes.data;
          setPatient(patData);
          setMedicalHistory(patData.history || "");
          // Allergies can be custom appended or parsed, let's initialize
          setAllergies(patData.allergies || "No known drug allergies");

          // 3. Fetch Past Appointments for clinical timeline
          const pastAptsRes = await appointmentAPI.list(1, 20, { 
            patientId: aptData.patientId,
            status: "Completed"
          });
          const pastList = (pastAptsRes.data.appointments || [])
            .filter((a: any) => a.id !== id)
            .map((a: any) => ({
              id: a.id,
              date: a.date,
              notes: a.notes,
              status: a.status,
              doctor: a.doctor,
              tokenNumber: a.tokenNumber
            }));
          setPastVisits(pastList);
        }

        // 4. Pre-fetch medicine database for autocompletion
        const medRes = await medicineAPI.list(1, 100);
        setDbMedicines(medRes.data.medicines || []);

      } catch (err: any) {
        console.error("Failed to load consultation context:", err);
        setErrorMsg("Failed to retrieve patient medical records. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id && isDoctor) {
      fetchAllData();
    }
  }, [id, isDoctor]);

  // Handle adding prescription medication
  const handleAddMedicine = () => {
    if (!medName.trim()) return;
    
    const newMed: MedicineItem = {
      name: medName.trim(),
      dosage: medDosage,
      duration: medDuration,
      instructions: medInstructions
    };

    setMedicines([...medicines, newMed]);
    setMedName("");
    // Reset preset selections to defaults
    setMedDosage("1-0-1");
    setMedDuration("5 days");
    setMedInstructions("After food");
    setShowMedSuggestions(false);
  };

  // Remove medication
  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  // Toggle Laboratory tests
  const handleToggleLabTest = (test: string) => {
    if (selectedLabTests.includes(test)) {
      setSelectedLabTests(selectedLabTests.filter(t => t !== test));
    } else {
      setSelectedLabTests([...selectedLabTests, test]);
    }
  };

  // Submit consultation records
  const handleCompleteConsultation = async () => {
    if (!diagnosis.trim()) {
      setErrorMsg("Diagnosis is required to complete the consultation.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg("");

      const payload = {
        symptoms,
        diagnosis,
        observations,
        advice,
        prescriptions: medicines,
        labTestsActive,
        labTests: selectedLabTests,
        otherLabTests,
        followUpDate,
        admissionRecommended,
        admissionNotes
      };

      await appointmentAPI.complete(id, payload);
      
      // Proactively update patient medical history if history changed
      if (patient && (medicalHistory !== patient.history)) {
        await patientAPI.update(patient.id, { history: medicalHistory });
      }

      setSuccessMsg("Consultation completed successfully! Redirecting...");
      setTimeout(() => {
        router.push("/appointments");
      }, 2000);

    } catch (err: any) {
      console.error("Consultation submission failed:", err);
      setErrorMsg(err.response?.data?.error || "Failed to finalize consultation records. Please try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  // Calculated utilities
  const calculateAge = (dob: string) => {
    if (!dob) return "N/A";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Parse structured notes from previous visits
  const renderPreviousNotes = (notesJsonStr?: string) => {
    if (!notesJsonStr) return "No notes recorded.";
    try {
      const parsed = JSON.parse(notesJsonStr);
      return (
        <div className="space-y-1 text-xs text-gray-400">
          {parsed.diagnosis && <p><strong className="text-gray-300">Diagnosis:</strong> {parsed.diagnosis}</p>}
          {parsed.symptoms && <p><strong className="text-gray-300">Symptoms:</strong> {parsed.symptoms}</p>}
          {parsed.advice && <p><strong className="text-gray-300">Advice:</strong> {parsed.advice}</p>}
        </div>
      );
    } catch (e) {
      return <p className="text-xs text-gray-400 font-medium italic">{notesJsonStr}</p>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-base font-semibold animate-pulse">Retrieving Patient Clinical Records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Sticky Consultation Control Bar */}
      <div className="sticky top-0 z-30 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-dark-secondary border border-dark-tertiary/60 p-4 rounded-xl shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/appointments">
            <button className="p-2 hover:bg-dark-tertiary/40 text-gray-400 hover:text-white rounded-lg transition-colors border border-dark-tertiary/40 bg-dark-tertiary/10">
              <ArrowLeft size={18} />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white leading-none">Doctor Consultation Desk</h1>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase">
                {appointment?.tokenNumber || "GEN-000"}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Active Case: <strong className="text-gray-300 font-semibold">{patient?.name || "Unknown Patient"}</strong> | Attending Specialization: <span className="text-purple-400 font-medium">{appointment?.department || "General"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCompleteConsultation}
            disabled={submitting}
            className="px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg transition-all shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/30 flex items-center gap-2 border border-emerald-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Finalizing Records...
              </>
            ) : (
              <>
                <Check size={16} />
                Complete Consultation
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error & Success Toasts */}
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-center gap-3 text-sm animate-pulse">
          <AlertCircle size={20} className="shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
          <Check size={20} className="shrink-0" />
          <p>{successMsg}</p>
        </div>
      )}

      {/* Main Grid Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Patient Context Panel */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Section 1: Patient Information Card */}
          <div className="card bg-dark-secondary border border-dark-tertiary p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-dark-tertiary pb-3">
              <User size={18} className="text-emerald-400" />
              <h2 className="text-base font-bold text-white font-outfit">Patient Information</h2>
            </div>

            <div className="space-y-3.5">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Patient Name</p>
                <p className="text-sm text-white font-bold mt-0.5">{patient?.name || "Unknown"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">UHID / ID</p>
                  <p className="text-xs text-gray-300 font-mono mt-0.5 truncate" title={patient?.id}>
                    P-{patient?.id ? patient.id.slice(0, 8).toUpperCase() : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Blood Group</p>
                  <p className="text-xs text-emerald-400 font-bold mt-0.5">{patient?.bloodGroup || "Not Specified"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Age / Gender</p>
                  <p className="text-xs text-gray-300 font-semibold mt-0.5">
                    {calculateAge(patient?.dob)} yrs / {patient?.gender || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Phone Number</p>
                  <p className="text-xs text-gray-300 font-semibold mt-0.5">{patient?.phone || "N/A"}</p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-1">
                  Chronic History & Conditions
                </label>
                <textarea
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  placeholder="Record chronic conditions, surgical history, etc."
                  rows={3}
                  className="w-full text-xs bg-dark-tertiary/20 hover:bg-dark-tertiary/35 border border-dark-tertiary/65 focus:border-emerald-500/60 rounded px-2.5 py-1.5 outline-none text-gray-300 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-1">
                  Drug & Clinical Allergies
                </label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, Sulfa, Peanuts"
                  className="w-full text-xs bg-dark-tertiary/20 hover:bg-dark-tertiary/35 border border-dark-tertiary/65 focus:border-emerald-500/60 rounded px-2.5 py-1.5 outline-none text-gray-300 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Appointment Detail Context */}
          <div className="card bg-dark-secondary border border-dark-tertiary p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-dark-tertiary pb-3">
              <FileText size={18} className="text-emerald-400" />
              <h2 className="text-base font-bold text-white font-outfit">Encounter Information</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Encounter Date</p>
                <p className="text-gray-300 mt-1 font-semibold">
                  {appointment?.date ? new Date(appointment.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  }) : "Today"}
                </p>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Visit Type</p>
                <p className="text-gray-300 mt-1 font-semibold">{appointment?.visitType || appointment?.type || "Standard Check-up"}</p>
              </div>
            </div>

            <div className="text-xs">
              <p className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Attending Clinician</p>
              <p className="text-gray-300 mt-1 font-semibold">Dr. {appointment?.doctorName || user?.name}</p>
            </div>

            <div className="text-xs border-t border-dark-tertiary/45 pt-3">
              <p className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Reason for Visit</p>
              <p className="text-gray-300 mt-1.5 font-medium bg-dark-tertiary/20 border border-dark-tertiary/40 px-2.5 py-2 rounded leading-relaxed">
                {appointment?.visitReason || "Routine consultation requested by patient."}
              </p>
            </div>
          </div>

          {/* Section 3: Previous Visits Timeline */}
          <div className="card bg-dark-secondary border border-dark-tertiary p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-dark-tertiary pb-3">
              <Clock size={18} className="text-emerald-400" />
              <h2 className="text-base font-bold text-white font-outfit">Previous Encounters</h2>
            </div>

            {pastVisits.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">No completed encounters recorded in MEDIXPRO.</p>
            ) : (
              <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1">
                {pastVisits.map((visit) => (
                  <div key={visit.id} className="border-l-2 border-emerald-500/30 pl-3.5 relative space-y-1">
                    <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white font-bold">
                        {new Date(visit.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase bg-emerald-500/10 px-1.5 rounded">
                        {visit.tokenNumber || "GEN"}
                      </span>
                    </div>
                    {renderPreviousNotes(visit.notes)}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Clinical Notes & Prescription Wizard */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Consultation Clinical Notes */}
          <div className="card bg-dark-secondary border border-dark-tertiary p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-dark-tertiary pb-3">
              <Activity size={18} className="text-emerald-400" />
              <h2 className="text-base font-bold text-white font-outfit">Clinical Examination & Diagnosis</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Symptoms & Chief Complaints</label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Record symptoms (e.g. high fever, dry cough for 3 days)"
                  rows={4}
                  className="w-full text-xs bg-dark-tertiary/10 border border-dark-tertiary/80 focus:border-emerald-500/60 rounded-lg px-3 py-2 outline-none text-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Clinical Observations</label>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Record clinical examinations, vitals, general appearance"
                  rows={4}
                  className="w-full text-xs bg-dark-tertiary/10 border border-dark-tertiary/80 focus:border-emerald-500/60 rounded-lg px-3 py-2 outline-none text-white transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-emerald-400 mb-1.5">
                  Diagnosis / Assessment <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Enter primary and secondary diagnoses (e.g. Acute Viral Bronchitis)"
                  rows={3}
                  className="w-full text-xs bg-dark-tertiary/10 border border-emerald-500/30 focus:border-emerald-500 rounded-lg px-3 py-2 outline-none text-white transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Advice & Instructions</label>
                <textarea
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  placeholder="Clinical instructions, dietary advice, activity restrictions"
                  rows={3}
                  className="w-full text-xs bg-dark-tertiary/10 border border-dark-tertiary/80 focus:border-emerald-500/60 rounded-lg px-3 py-2 outline-none text-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Digital Prescription Desk */}
          <div className="card bg-dark-secondary border border-dark-tertiary p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-dark-tertiary pb-3">
              <Heart size={18} className="text-emerald-400" />
              <h2 className="text-base font-bold text-white font-outfit">Interactive Digital Prescription Desk</h2>
            </div>

            {/* Medicine builder inputs */}
            <div className="bg-dark-tertiary/20 p-4 rounded-xl border border-dark-tertiary/50 space-y-4">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Add Medication</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Search Medicine name */}
                <div className="md:col-span-4 relative">
                  <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Medicine Name</label>
                  <div className="flex items-center gap-2 bg-dark-secondary/60 border border-dark-tertiary rounded px-2.5 py-1">
                    <Search size={12} className="text-gray-500" />
                    <input
                      type="text"
                      placeholder="e.g. Paracetamol"
                      value={medName}
                      onChange={(e) => {
                        setMedName(e.target.value);
                        setShowMedSuggestions(true);
                      }}
                      onFocus={() => setShowMedSuggestions(true)}
                      className="bg-transparent text-xs w-full outline-none text-white py-0.5"
                    />
                  </div>

                  {/* Autocomplete dropdown suggestions */}
                  {showMedSuggestions && medName.trim().length > 0 && (
                    <div className="absolute left-0 right-0 mt-1 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-xl z-20 max-h-40 overflow-y-auto">
                      {dbMedicines
                        .filter(m => m.name.toLowerCase().includes(medName.toLowerCase()))
                        .map((med) => (
                          <button
                            key={med.id}
                            type="button"
                            onClick={() => {
                              setMedName(med.name);
                              setShowMedSuggestions(false);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-emerald-500 hover:text-white transition-colors border-b border-dark-tertiary/30 last:border-0"
                          >
                            {med.name} <span className="text-[10px] text-gray-500 hover:text-emerald-200">({med.category || "General"})</span>
                          </button>
                        ))}
                      {dbMedicines.filter(m => m.name.toLowerCase().includes(medName.toLowerCase())).length === 0 && (
                        <div className="px-3 py-2 text-xs text-gray-500 italic">No exact matches, press enter to add custom name</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Dosage Selector */}
                <div className="md:col-span-3">
                  <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Dosage Schedule</label>
                  <div className="flex gap-1.5 items-center">
                    <input
                      type="text"
                      value={medDosage}
                      onChange={(e) => setMedDosage(e.target.value)}
                      className="bg-dark-secondary/60 border border-dark-tertiary rounded px-2.5 py-1.5 text-xs w-full text-white outline-none focus:border-emerald-500/50"
                    />
                    <select
                      value={medDosage}
                      onChange={(e) => setMedDosage(e.target.value)}
                      className="bg-dark-secondary border border-dark-tertiary rounded p-1 text-[10px] text-gray-400 outline-none h-[30px]"
                    >
                      <option value="">Presets</option>
                      {dosagePresets.map(preset => (
                        <option key={preset} value={preset}>{preset}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Duration */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Duration</label>
                  <div className="flex gap-1.5 items-center">
                    <input
                      type="text"
                      value={medDuration}
                      onChange={(e) => setMedDuration(e.target.value)}
                      className="bg-dark-secondary/60 border border-dark-tertiary rounded px-2.5 py-1.5 text-xs w-full text-white outline-none focus:border-emerald-500/50"
                    />
                    <select
                      value={medDuration}
                      onChange={(e) => setMedDuration(e.target.value)}
                      className="bg-dark-secondary border border-dark-tertiary rounded p-1 text-[10px] text-gray-400 outline-none h-[30px]"
                    >
                      <option value="">Presets</option>
                      {durationPresets.map(preset => (
                        <option key={preset} value={preset}>{preset}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Instructions */}
                <div className="md:col-span-3 flex items-end gap-2">
                  <div className="w-full">
                    <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Instructions</label>
                    <div className="flex gap-1.5 items-center">
                      <input
                        type="text"
                        value={medInstructions}
                        onChange={(e) => setMedInstructions(e.target.value)}
                        className="bg-dark-secondary/60 border border-dark-tertiary rounded px-2.5 py-1.5 text-xs w-full text-white outline-none focus:border-emerald-500/50"
                      />
                      <select
                        value={medInstructions}
                        onChange={(e) => setMedInstructions(e.target.value)}
                        className="bg-dark-secondary border border-dark-tertiary rounded p-1 text-[10px] text-gray-400 outline-none h-[30px]"
                      >
                        <option value="">Presets</option>
                        {instructionPresets.map(preset => (
                          <option key={preset} value={preset}>{preset}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleAddMedicine}
                    className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center justify-center shrink-0 active:scale-95"
                    title="Add medicine"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Added Medicines Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-tertiary text-left">
                    <th className="py-2.5 px-3 text-xs text-gray-500 font-bold uppercase tracking-wider">#</th>
                    <th className="py-2.5 px-3 text-xs text-gray-500 font-bold uppercase tracking-wider">Medicine Name</th>
                    <th className="py-2.5 px-3 text-xs text-gray-500 font-bold uppercase tracking-wider">Dosage Schedule</th>
                    <th className="py-2.5 px-3 text-xs text-gray-500 font-bold uppercase tracking-wider">Duration</th>
                    <th className="py-2.5 px-3 text-xs text-gray-500 font-bold uppercase tracking-wider">Instructions</th>
                    <th className="py-2.5 px-3 text-xs text-gray-500 font-bold uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-xs text-gray-500 italic">
                        No medications prescribed yet.
                      </td>
                    </tr>
                  ) : (
                    medicines.map((med, index) => (
                      <tr
                        key={index}
                        className="border-b border-dark-tertiary/45 hover:bg-dark-tertiary/10 transition-colors"
                      >
                        <td className="py-3 px-3 text-xs text-gray-400 font-bold font-mono">{index + 1}</td>
                        <td className="py-3 px-3 text-xs text-white font-bold">{med.name}</td>
                        <td className="py-3 px-3 text-xs text-gray-300 font-mono font-semibold">
                          <span className="bg-dark-tertiary border border-dark-tertiary/80 text-gray-300 px-2 py-0.5 rounded text-[10px]">
                            {med.dosage}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-xs text-gray-300 font-semibold">{med.duration}</td>
                        <td className="py-3 px-3 text-xs text-gray-400 font-medium">
                          <span className="bg-purple-500/10 text-purple-400 border border-purple-500/15 px-2 py-0.5 rounded text-[10px]">
                            {med.instructions}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-xs text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicine(index)}
                            className="p-1 bg-dark-tertiary/30 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded transition-all active:scale-95"
                            title="Remove Medication"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 3: Diagnostic Lab & Admissions referral */}
          <div className="card bg-dark-secondary border border-dark-tertiary p-6 rounded-xl space-y-6">
            <div className="flex items-center gap-2 border-b border-dark-tertiary pb-3">
              <CheckSquare size={18} className="text-emerald-400" />
              <h2 className="text-base font-bold text-white font-outfit">Diagnostic referrals & Follow-up Plans</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Lab Recommendations Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-dark-tertiary/40 pb-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-400">Laboratory Recommendations</label>
                    <p className="text-[10px] text-gray-500 mt-0.5">Toggle if diagnostic clinical tests are required.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLabTestsActive(!labTestsActive)}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      labTestsActive ? "bg-emerald-500" : "bg-dark-tertiary"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        labTestsActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></span>
                  </button>
                </div>

                {labTestsActive && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="grid grid-cols-2 gap-3">
                      {labTestPresets.map((test) => (
                        <button
                          key={test}
                          type="button"
                          onClick={() => handleToggleLabTest(test)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs border transition-all ${
                            selectedLabTests.includes(test)
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/5 font-bold"
                              : "bg-dark-tertiary/10 text-gray-400 border-dark-tertiary hover:bg-dark-tertiary/20 hover:text-gray-300"
                          }`}
                        >
                          {selectedLabTests.includes(test) ? (
                            <CheckSquare size={14} className="text-emerald-400 shrink-0" />
                          ) : (
                            <Square size={14} className="text-gray-500 shrink-0" />
                          )}
                          {test}
                        </button>
                      ))}
                    </div>

                    <div className="pt-1">
                      <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Other / Custom Lab Tests</label>
                      <input
                        type="text"
                        value={otherLabTests}
                        onChange={(e) => setOtherLabTests(e.target.value)}
                        placeholder="e.g. Thyroid Profile, HbA1c, Urine Routine"
                        className="w-full text-xs bg-dark-tertiary/15 hover:bg-dark-tertiary/30 border border-dark-tertiary/80 focus:border-emerald-500/60 rounded px-2.5 py-1.5 outline-none text-gray-300 transition-colors"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Follow-up & Admission Column */}
              <div className="space-y-4 border-t md:border-t-0 md:border-l border-dark-tertiary/45 pt-4 md:pt-0 md:pl-6">
                
                {/* Follow-up Visit selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">
                    Follow-up Recommendation
                  </label>
                  <div className="flex items-center gap-2 bg-dark-tertiary/15 border border-dark-tertiary/80 rounded px-3 py-1.5">
                    <Calendar size={13} className="text-gray-400" />
                    <input
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="bg-transparent text-xs w-full text-white outline-none focus:outline-none"
                    />
                  </div>
                </div>

                {/* Admission Referral serious toggle */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-400">Emergency Admission Referral</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Toggle if patient condition mandates inpatient admission.</p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setAdmissionRecommended(!admissionRecommended)}
                      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        admissionRecommended ? "bg-emerald-500" : "bg-dark-tertiary"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          admissionRecommended ? "translate-x-5" : "translate-x-0"
                        }`}
                      ></span>
                    </button>
                  </div>

                  {/* Expandable Admission notes instructions */}
                  {admissionRecommended && (
                    <div className="bg-red-500/5 p-3 rounded-lg border border-red-500/15 space-y-2 animate-fadeIn">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle size={12} className="text-red-400" />
                        <span className="text-[10px] text-red-400 font-bold uppercase tracking-wide">Critical Referral Instructions</span>
                      </div>
                      <textarea
                        value={admissionNotes}
                        onChange={(e) => setAdmissionNotes(e.target.value)}
                        placeholder="State clinical reason for admission, department, ward choice, emergency level."
                        rows={2}
                        className="w-full text-xs bg-dark-secondary/80 hover:bg-dark-secondary border border-red-500/15 focus:border-red-500 rounded px-2.5 py-1.5 outline-none text-white transition-colors"
                      />
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
