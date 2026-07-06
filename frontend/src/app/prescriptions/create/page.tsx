"use client";

import { useState, useEffect, useRef } from "react";

import {
 ArrowLeft,
 Plus,
 Trash2,
 FileText,
 User,
 Calendar,
 Pill,
 Save,
 ToggleLeft,
 ToggleRight,
 Search,
 UserCheck,
 ShieldAlert,
 ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
 prescriptionAPI,
 patientAPI,
 doctorAPI,
} from "@/lib/api";
import DataTable, { Column } from "@/components/ui/DataTable";

interface Medication {
 id: string;
 name: string;
 dosage: string;
 route: string;
 frequency: string;
 duration: string;
 instructions: string;
 allowRefills: boolean;
 refillCount: number;
}

interface Patient {
 id: string;
 name: string;
 age?: number;
 gender?: string;
 allergies?: string[];
 conditions?: string[];
 history?: string;
}

export default function CreatePrescriptionPage() {
 const router = useRouter();
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [searchPatient, setSearchPatient] = useState("");
 const [searchDoctor, setSearchDoctor] = useState("");
 const [showPatientDropdown, setShowPatientDropdown] = useState(false);
 const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
 const patientDropdownRef = useRef<HTMLDivElement>(null);
 const doctorDropdownRef = useRef<HTMLDivElement>(null);

 const [formData, setFormData] = useState({
 patientId: "",
 prescriptionDate: new Date().toISOString().split("T")[0],
 prescriptionType: "Standard",
 diagnosis: "",
 notesForPharmacist: "",
 });

 const [medications, setMedications] = useState<Medication[]>([]);

 const [currentMed, setCurrentMed] = useState({
 name: "",
 dosage: "",
 route: "Oral",
 frequency: "",
 duration: "30",
 durationUnit: "days",
 instructions: "",
 allowRefills: false,
 refillCount: 0,
 });

 const [patients, setPatients] = useState<Patient[]>([]);
 const [doctors, setDoctors] = useState<any[]>([]);
 const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
 const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

 useEffect(() => {
 const handleClickOutside = (event: MouseEvent) => {
 if (
 patientDropdownRef.current &&
 !patientDropdownRef.current.contains(event.target as Node)
 ) {
 setShowPatientDropdown(false);
 }
 if (
 doctorDropdownRef.current &&
 !doctorDropdownRef.current.contains(event.target as Node)
 ) {
 setShowDoctorDropdown(false);
 }
 };
 document.addEventListener("mousedown", handleClickOutside);
 return () => document.removeEventListener("mousedown", handleClickOutside);
 }, []);

 useEffect(() => {
 const fetchData = async () => {
 try {
 const [patRes, docRes] = await Promise.all([
 patientAPI.list(1, 100),
 doctorAPI.list(1, 100),
 ]);
 setPatients(patRes.data.patients || []);
 setDoctors(docRes.data.doctors || []);
 } catch (err) {
 console.error("Failed to fetch data", err);
 }
 };
 fetchData();
 }, []);



 const handleChange = (
 e: React.ChangeEvent<
 HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
 >
 ) => {
 const { name, value } = e.target;
 setFormData((prev) => ({
 ...prev,
 [name]: value,
 }));
 };

 const handlePatientSelect = (patient: Patient) => {
 setFormData((prev) => ({ ...prev, patientId: patient.id }));
 
 // Dynamically parse medical history into allergies and conditions
 const parsedPatient = { ...patient };
 const historyText = patient.history || (patient as any).medicalHistory || (patient as any).condition || "";
 
 if (historyText && historyText.trim()) {
 const trimmed = historyText.trim();
 const lower = trimmed.toLowerCase();
 
 // Check if history is just a placeholder like "okk", "ok", "none", "no history", "nil", "n/a", "-"
 const placeholders = ["okk", "ok", "none", "no history", "nil", "n/a", "-"];
 if (placeholders.includes(lower)) {
 parsedPatient.allergies = [];
 parsedPatient.conditions = [];
 } else if (lower.includes("allergies:") || lower.includes("allergy:") || lower.includes("conditions:") || lower.includes("condition:")) {
 const allergies: string[] = [];
 const conditions: string[] = [];
 
 // Parse structured list
 const allergyMatch = trimmed.match(/(?:allergies|allergy):\s*([^;\n\r]+)/i);
 const conditionMatch = trimmed.match(/(?:conditions|condition):\s*([^;\n\r]+)/i);
 
 if (allergyMatch) {
 const content = allergyMatch[1].split(/conditions|condition/i)[0];
 allergies.push(
 ...content
 .split(",")
 .map((s) => s.trim())
 .filter((s) => s && s.toLowerCase() !== "none" && s.toLowerCase() !== "no known allergies" && s.toLowerCase() !== "no known")
 );
 }
 
 if (conditionMatch) {
 const content = conditionMatch[1].split(/allergies|allergy/i)[0];
 conditions.push(
 ...content
 .split(",")
 .map((s) => s.trim())
 .filter((s) => s && s.toLowerCase() !== "none" && s.toLowerCase() !== "no conditions listed" && s.toLowerCase() !== "no conditions")
 );
 }
 
 parsedPatient.allergies = allergies;
 parsedPatient.conditions = conditions;
 } else {
 // Fallback: treat the entire text as a condition, or split by commas
 parsedPatient.conditions = trimmed
 .split(",")
 .map((s) => s.trim())
 .filter(Boolean);
 parsedPatient.allergies = [];
 }
 } else {
 parsedPatient.allergies = [];
 parsedPatient.conditions = [];
 }
 
 setSelectedPatient(parsedPatient);
 setSearchPatient(patient.name);
 setShowPatientDropdown(false);
 };

 const handleDoctorSelect = (doctor: any) => {
 setSelectedDoctor(doctor);
 setSearchDoctor(doctor.name);
 setShowDoctorDropdown(false);
 };

 const handleAddMedication = () => {
 if (!currentMed.name.trim()) {
 setError("Medication Name is required");
 return;
 }
 if (!currentMed.dosage) {
 setError("Dosage is required");
 return;
 }
 if (!currentMed.frequency) {
 setError("Frequency is required");
 return;
 }

 setError("");

 const durationStr = `${currentMed.duration} ${currentMed.durationUnit}`;
 const newMed: Medication = {
 id: Date.now().toString(),
 name: currentMed.name,
 dosage: currentMed.dosage,
 route: currentMed.route,
 frequency: currentMed.frequency,
 duration: durationStr,
 instructions: currentMed.instructions,
 allowRefills: currentMed.allowRefills,
 refillCount: currentMed.allowRefills ? currentMed.refillCount : 0,
 };

 setMedications([...medications, newMed]);

 setCurrentMed({
 name: "",
 dosage: "",
 route: "Oral",
 frequency: "",
 duration: "30",
 durationUnit: "days",
 instructions: "",
 allowRefills: false,
 refillCount: 0,
 });
 };

 const handleRemoveMedication = (id: string) => {
 setMedications(medications.filter((med) => med.id !== id));
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);
 setError("");

 if (!formData.patientId || !selectedDoctor) {
 setError("Please select a patient and doctor");
 setLoading(false);
 return;
 }

 if (medications.length === 0) {
 setError("Please add at least one medication to the prescription");
 setLoading(false);
 return;
 }

 try {
 await prescriptionAPI.create({
 patientId: formData.patientId,
 doctorId: selectedDoctor.id,
 prescriptionDate: formData.prescriptionDate,
 prescriptionType: formData.prescriptionType,
 diagnosis: formData.diagnosis || null,
 notesForPharmacist: formData.notesForPharmacist || null,
 medications: medications.map(({ id, ...med }) => med),
 status: "Active",
 });



 router.push("/prescriptions/all");
 } catch (err: any) {
 setError(err.response?.data?.error || "Failed to create prescription");
 } finally {
 setLoading(false);
 }
 };

 const filteredPatients = patients.filter((p) =>
 p.name.toLowerCase().includes(searchPatient.toLowerCase())
 );

 const filteredDoctors = doctors.filter((d) =>
 d.name.toLowerCase().includes(searchDoctor.toLowerCase())
 );

    const columns_0: Column<any>[] = [
      { header: "Name & Instructions", accessor: (med) => (<>\n<div className="font-semibold text-white">{med.name}</div>\n\n{med.instructions && (
     <div className="text-xs text-gray-400 mt-1 italic">
     "{med.instructions}"
     </div>
     )}\n</>) },
      { header: "Dosage & Route", accessor: (med) => (<>\n<div>{med.dosage}</div>\n\n<div className="text-xs text-gray-400 mt-0.5">{med.route}</div>\n</>) },
      { header: "Frequency", accessor: "frequency" },
      { header: "Duration", accessor: "duration" },
      { header: "Refills", accessor: (med) => (<>\n{med.allowRefills ? (
     <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20">
     {med.refillCount} refills
     </span>
     ) : (
     <span className="text-xs text-gray-500">None</span>
     )}\n</>) },
      { header: "Actions", accessor: (med) => (<>\n<button
     type="button"
     onClick={() => handleRemoveMedication(med.id)}
     className="p-1.5 hover:bg-red-500/20 rounded text-red-500 transition-colors"
     title="Remove Medication"
     >
     <Trash2 size={16} />
     </button>\n</>) },
    ];


 return (
 <>
 <div className="space-y-6">
 <div className="flex items-center gap-4">
 <Link href="/prescriptions/all">
 <button className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors">
 <ArrowLeft size={24} />
 </button>
 </Link>
 <div>
 <h1 className="text-3xl font-bold mb-2">Create Prescription</h1>
 <p className="text-gray-400">
 Create a new prescription for a patient.
 </p>
 </div>
 </div>

 <form onSubmit={handleSubmit} className="w-full">
 <div className="card p-6 md:p-8 space-y-8">
 {/* Section 1: Patient & Doctor Selection */}
 <div className="space-y-6">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {/* Select Patient */}
 <div className="relative" ref={patientDropdownRef}>
 <label className="block text-md font-medium text-gray-300 mb-2 flex items-center gap-2">
 <User size={18} className="text-emerald-500" />
 Select Patient
 </label>
 <div className="relative">
 <Search
 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
 size={18}
 />
 <input
 type="text"
 placeholder="Search patients..."
 value={searchPatient}
 onChange={(e) => {
 setSearchPatient(e.target.value);
 setShowPatientDropdown(true);
 if (formData.patientId) {
 setFormData((prev) => ({
 ...prev,
 patientId: "",
 }));
 setSelectedPatient(null);
 }
 }}
 onFocus={() => setShowPatientDropdown(true)}
 className="input-field w-full !pl-10"
 required
 />
 </div>

 {showPatientDropdown && (
 <div className="absolute z-20 w-full left-0 mt-1 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-lg max-h-60 overflow-y-auto">
 {filteredPatients.length > 0 ? (
 filteredPatients.map((patient) => (
 <div
 key={patient.id}
 onClick={() => handlePatientSelect(patient)}
 className={`px-4 py-3 hover:bg-dark-tertiary cursor-pointer border-b border-dark-tertiary last:border-0 transition-colors flex items-center justify-between ${
 formData.patientId === patient.id ? "bg-emerald-500/10 text-emerald-400" : ""
 }`}
 >
 <div>
 <div className="font-medium text-sm">{patient.name}</div>
 {patient.age && (
 <div className="text-xs text-gray-400 mt-1">
 {patient.age}y • {patient.gender}
 </div>
 )}
 </div>
 {formData.patientId === patient.id && (
 <div className="text-emerald-500 font-bold text-sm">Selected</div>
 )}
 </div>
 ))
 ) : (
 <div className="p-3 text-sm text-gray-400 text-center">
 No patients found
 </div>
 )}
 </div>
 )}
 </div>

 {/* Select Doctor */}
 <div className="relative" ref={doctorDropdownRef}>
 <label className="block text-md font-medium text-gray-300 mb-2 flex items-center gap-2">
 <UserCheck size={18} className="text-emerald-500" />
 Select Doctor
 </label>
 <div className="relative">
 <Search
 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
 size={18}
 />
 <input
 type="text"
 placeholder="Search doctors..."
 value={searchDoctor}
 onChange={(e) => {
 setSearchDoctor(e.target.value);
 setShowDoctorDropdown(true);
 if (selectedDoctor) {
 setSelectedDoctor(null);
 }
 }}
 onFocus={() => setShowDoctorDropdown(true)}
 className="input-field w-full !pl-10"
 required
 />
 </div>

 {showDoctorDropdown && (
 <div className="absolute z-20 w-full left-0 mt-1 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-lg max-h-60 overflow-y-auto">
 {filteredDoctors.length > 0 ? (
 filteredDoctors.map((doctor) => (
 <div
 key={doctor.id}
 onClick={() => handleDoctorSelect(doctor)}
 className={`px-4 py-3 hover:bg-dark-tertiary cursor-pointer border-b border-dark-tertiary last:border-0 transition-colors flex items-center justify-between ${
 selectedDoctor?.id === doctor.id ? "bg-emerald-500/10 text-emerald-400" : ""
 }`}
 >
 <div>
 <div className="font-medium text-sm">Dr. {doctor.name}</div>
 {doctor.specialization && (
 <div className="text-xs text-gray-400 mt-1">
 {doctor.specialization}
 </div>
 )}
 </div>
 {selectedDoctor?.id === doctor.id && (
 <div className="text-emerald-500 font-bold text-sm">Selected</div>
 )}
 </div>
 ))
 ) : (
 <div className="p-3 text-sm text-gray-400 text-center">
 No doctors found
 </div>
 )}
 </div>
 )}
 </div>
 </div>

 {/* Selected Patient Health Details (Allergies & Conditions) */}
 {selectedPatient && (
 <div className="p-4 bg-dark-secondary rounded-lg border border-dark-tertiary">
 <div className="flex items-center gap-2 mb-3 pb-2 border-b border-dark-tertiary">
 {((selectedPatient.allergies && selectedPatient.allergies.length > 0) || 
 (selectedPatient.conditions && selectedPatient.conditions.length > 0)) ? (
 <>
 <ShieldAlert className="text-red-400 animate-pulse" size={18} />
 <span className="text-sm font-semibold text-gray-200">Patient Clinical Safety Alerts</span>
 </>
 ) : (
 <>
 <ShieldCheck className="text-emerald-400" size={18} />
 <span className="text-sm font-semibold text-gray-200">Patient Clinical Safety Cleared</span>
 </>
 )}
 </div>

 {((!selectedPatient.allergies || selectedPatient.allergies.length === 0) &&
 (!selectedPatient.conditions || selectedPatient.conditions.length === 0)) ? (
 <div className="text-sm text-emerald-400/90 bg-emerald-500/5 p-2.5 rounded border border-emerald-500/10 flex items-center gap-2">
 <span>✓</span> No active allergies or chronic medical conditions are currently recorded for this patient.
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
 Allergies:
 </div>
 {selectedPatient.allergies && selectedPatient.allergies.length > 0 ? (
 <div className="flex flex-wrap gap-2">
 {selectedPatient.allergies.map((allergy, idx) => (
 <span
 key={idx}
 className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20 font-semibold"
 >
 {allergy}
 </span>
 ))}
 </div>
 ) : (
 <span className="text-xs text-gray-500">No known allergies</span>
 )}
 </div>

 <div>
 <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
 Chronic Conditions:
 </div>
 {selectedPatient.conditions && selectedPatient.conditions.length > 0 ? (
 <div className="flex flex-wrap gap-2">
 {selectedPatient.conditions.map((condition, idx) => (
 <span
 key={idx}
 className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20 font-semibold"
 >
 {condition}
 </span>
 ))}
 </div>
 ) : (
 <span className="text-xs text-gray-500">No pre-existing conditions listed</span>
 )}
 </div>
 </div>
 )}
 </div>
 )}
 </div>

 <hr className="border-dark-tertiary" />

 {/* Section 2: Prescription Details */}
 <div className="space-y-6">
 <h3 className="text-lg font-semibold flex items-center gap-2 text-emerald-400">
 <FileText size={20} />
 Prescription Details
 </h3>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <label className="block text-md font-medium text-gray-300 mb-2">
 Prescription Date
 </label>
 <input
 type="date"
 name="prescriptionDate"
 value={formData.prescriptionDate}
 onChange={handleChange}
 className="input-field w-full"
 required
 />
 </div>

 <div>
 <label className="block text-md font-medium text-gray-300 mb-2">
 Prescription Type
 </label>
 <select
 name="prescriptionType"
 value={formData.prescriptionType}
 onChange={handleChange}
 className="input-field w-full"
 >
 <option value="Standard">Standard</option>
 <option value="Controlled">Controlled Substance</option>
 <option value="Compound">Compound</option>
 </select>
 </div>
 </div>

 <div>
 <label className="block text-md font-medium text-gray-300 mb-2">
 Diagnosis
 </label>
 <textarea
 name="diagnosis"
 value={formData.diagnosis}
 onChange={handleChange}
 className="input-field w-full"
 placeholder="Enter diagnosis or reason for prescription"
 rows={3}
 />
 </div>


 </div>

 <hr className="border-dark-tertiary" />

 {/* Section 3: Medications */}
 <div className="space-y-6">
 <h3 className="text-lg font-semibold flex items-center gap-2 text-emerald-400">
 <Pill size={20} />
 Medications
 </h3>

 {/* Medication Draft Form */}
 <div className="bg-dark-secondary p-5 rounded-lg border border-dark-tertiary space-y-4">
 <div className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">
 Draft Medication
 </div>
 
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 {/* Medication Name */}
 <div className="md:col-span-2">
 <label className="block text-xs font-medium text-gray-400 mb-1.5">
 Medication Name *
 </label>
 <input
 type="text"
 placeholder="Enter medication name..."
 value={currentMed.name}
 onChange={(e) => setCurrentMed({ ...currentMed, name: e.target.value })}
 className="input-field w-full"
 />
 </div>

 {/* Dosage */}
 <div>
 <label className="block text-xs font-medium text-gray-400 mb-1.5">
 Dosage *
 </label>
 <select
 value={currentMed.dosage}
 onChange={(e) => setCurrentMed({ ...currentMed, dosage: e.target.value })}
 className="input-field w-full"
 >
 <option value="">Select dosage</option>
 <option value="5mg">5mg</option>
 <option value="10mg">10mg</option>
 <option value="20mg">20mg</option>
 <option value="50mg">50mg</option>
 <option value="100mg">100mg</option>
 <option value="250mg">250mg</option>
 <option value="500mg">500mg</option>
 </select>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 {/* Route */}
 <div>
 <label className="block text-xs font-medium text-gray-400 mb-1.5">
 Route
 </label>
 <select
 value={currentMed.route}
 onChange={(e) => setCurrentMed({ ...currentMed, route: e.target.value })}
 className="input-field w-full"
 >
 <option value="Oral">Oral</option>
 <option value="Topical">Topical</option>
 <option value="Injection">Injection</option>
 <option value="Inhalation">Inhalation</option>
 </select>
 </div>

 {/* Frequency */}
 <div>
 <label className="block text-xs font-medium text-gray-400 mb-1.5">
 Frequency *
 </label>
 <select
 value={currentMed.frequency}
 onChange={(e) => setCurrentMed({ ...currentMed, frequency: e.target.value })}
 className="input-field w-full"
 >
 <option value="">Select frequency</option>
 <option value="Once daily">Once daily</option>
 <option value="Twice daily">Twice daily</option>
 <option value="Three times daily">Three times daily</option>
 <option value="Four times daily">Four times daily</option>
 <option value="As needed">As needed</option>
 </select>
 </div>

 {/* Duration */}
 <div>
 <label className="block text-xs font-medium text-gray-400 mb-1.5">
 Duration
 </label>
 <div className="flex gap-2">
 <input
 type="number"
 value={currentMed.duration}
 onChange={(e) => setCurrentMed({ ...currentMed, duration: e.target.value })}
 className="input-field flex-1"
 min="1"
 />
 <select
 value={currentMed.durationUnit}
 onChange={(e) => setCurrentMed({ ...currentMed, durationUnit: e.target.value })}
 className="input-field"
 >
 <option value="days">Days</option>
 <option value="weeks">Weeks</option>
 <option value="months">Months</option>
 </select>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 {/* Special Instructions */}
 <div className="md:col-span-2">
 <label className="block text-xs font-medium text-gray-400 mb-1.5">
 Special Instructions
 </label>
 <input
 type="text"
 placeholder="Enter any special instructions for this medication..."
 value={currentMed.instructions}
 onChange={(e) => setCurrentMed({ ...currentMed, instructions: e.target.value })}
 className="input-field w-full"
 />
 </div>

 {/* Allow Refills */}
 <div className="flex items-center gap-4 bg-dark-tertiary/20 p-3 rounded-lg border border-dark-tertiary">
 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={() => setCurrentMed({ ...currentMed, allowRefills: !currentMed.allowRefills })}
 className="text-emerald-500 animate-[pulse_2s_infinite]"
 >
 {currentMed.allowRefills ? (
 <ToggleRight size={24} />
 ) : (
 <ToggleLeft size={24} className="text-gray-500" />
 )}
 </button>
 <label className="text-xs text-gray-300 cursor-pointer">
 Allow Refills
 </label>
 </div>
 {currentMed.allowRefills && (
 <input
 type="number"
 value={currentMed.refillCount}
 onChange={(e) => setCurrentMed({ ...currentMed, refillCount: parseInt(e.target.value) || 0 })}
 className="input-field w-16 text-center text-sm"
 min="0"
 max="12"
 />
 )}
 </div>
 </div>

 <div className="flex justify-end pt-2">
 <button
 type="button"
 onClick={handleAddMedication}
 className="btn-primary flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-lg hover:shadow-emerald-500/20 transition-all hover:scale-[1.02]"
 >
 <Plus size={18} />
 Add to Prescription
 </button>
 </div>
 </div>

 {/* Added Medications Table */}
 <div className="mt-6 border border-dark-tertiary rounded-lg overflow-hidden bg-dark-secondary">
 <div className="px-4 py-3 bg-dark-tertiary/30 border-b border-dark-tertiary flex items-center justify-between">
 <div className="font-semibold text-sm text-gray-200">Added Medications</div>
 <div className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{medications.length} medication(s) added</div>
 </div>

 {medications.length > 0 ? (
 <div className="overflow-x-auto">
 <DataTable columns={columns_0} data={medications} enableLocalSearch enableLocalPagination />
 </div>
 ) : (
 <div className="p-8 text-center text-gray-400 flex flex-col items-center justify-center gap-2">
 <Pill size={32} className="text-gray-500 animate-[pulse_2s_infinite]" />
 <div className="font-medium">No medications added to this prescription yet.</div>
 <div className="text-xs text-gray-500">
 Use the form above to draft a medication and add it here.
 </div>
 </div>
 )}
 </div>
 </div>

 <hr className="border-dark-tertiary" />

 {/* Section 4: Format Options & Notes */}
 <div className="space-y-6">
 <h3 className="text-lg font-semibold flex items-center gap-2 text-emerald-400">
 <Save size={20} />
 Prescription Options & Notes
 </h3>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {/* Format Options */}
 <div className="p-4 bg-dark-secondary rounded-lg border border-dark-tertiary space-y-4">
 <h4 className="font-semibold text-sm text-gray-300 border-b border-dark-tertiary pb-2">Prescription Format</h4>
 
 <div className="space-y-3">
 <div className="flex items-center gap-3">
 <input
 type="radio"
 id="electronic"
 name="prescriptionFormat"
 defaultChecked
 className="w-4 h-4 text-emerald-500"
 />
 <label htmlFor="electronic" className="text-sm text-gray-300 cursor-pointer">
 Electronic Prescription
 </label>
 </div>
 <div className="flex items-center gap-3">
 <input
 type="radio"
 id="print"
 name="prescriptionFormat"
 className="w-4 h-4 text-emerald-500"
 />
 <label htmlFor="print" className="text-sm text-gray-300 cursor-pointer">
 Print Prescription
 </label>
 </div>
 <div className="flex items-center gap-3">
 <input
 type="radio"
 id="both"
 name="prescriptionFormat"
 className="w-4 h-4 text-emerald-500"
 />
 <label htmlFor="both" className="text-sm text-gray-300 cursor-pointer">
 Both Electronic and Print
 </label>
 </div>
 </div>

 <div className="pt-3 border-t border-dark-tertiary space-y-3">
 <div className="flex items-center gap-3">
 <input
 type="checkbox"
 id="notifyPatient"
 defaultChecked
 className="w-4 h-4 text-emerald-500"
 />
 <label htmlFor="notifyPatient" className="text-sm text-gray-300 cursor-pointer">
 Notify Patient
 </label>
 </div>

 <div className="flex items-center gap-3">
 <input
 type="checkbox"
 id="markAsUrgent"
 className="w-4 h-4 text-emerald-500"
 />
 <label htmlFor="markAsUrgent" className="text-sm text-gray-300 cursor-pointer">
 Mark as Urgent
 </label>
 </div>
 </div>
 </div>

 {/* Notes & Template Settings */}
 <div className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">
 Notes for Pharmacist
 </label>
 <textarea
 name="notesForPharmacist"
 value={formData.notesForPharmacist}
 onChange={handleChange}
 className="input-field w-full"
 placeholder="Enter any additional notes for the pharmacist"
 rows={3}
 />
 </div>


 </div>
 </div>
 </div>

 <hr className="border-dark-tertiary" />

 {error && (
 <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
 {error}
 </div>
 )}

 {/* Footer Buttons */}
 <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
 <Link href="/prescriptions/all" className="w-full sm:w-auto">
 <button type="button" className="btn-secondary w-full">
 Cancel
 </button>
 </Link>
 <button
 type="submit"
 disabled={
 loading ||
 !formData.patientId ||
 !selectedDoctor ||
 medications.length === 0 ||
 medications.some((m) => !m.name || !m.dosage || !m.frequency)
 }
 className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
 >
 <Save size={20} />
 {loading ? "Creating..." : "Create Prescription"}
 </button>
 </div>
 </div>
 </form>
 </div>
 </>
 );
}
