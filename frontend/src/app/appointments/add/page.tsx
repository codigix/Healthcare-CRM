"use client";

import { useState, useEffect, useRef } from "react";
import { appointmentAPI, departmentAPI, patientAPI } from "@/lib/api";
import {
 ArrowLeft,
 Calendar,
 Clock,
 User,
 UserCheck,
 FileText,
 CheckCircle,
 Search,
 Building2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Doctor {
 id: string;
 name: string;
 specialization?: string;
}

interface Patient {
 id: string;
 name: string;
 email?: string;
 phone?: string;
}

interface Department {
 id: string;
 name: string;
 status: string;
}

export default function AddAppointmentPage() {
 const router = useRouter();
 const { user } = useAuthStore();

 useEffect(() => {
 if (
 user &&
 (user.role === "doctor" || user.department?.toLowerCase() === "doctor")
 ) {
 router.push("/appointments/all");
 }
 }, [user, router]);

 const [doctors, setDoctors] = useState<Doctor[]>([]);
 const [patients, setPatients] = useState<Patient[]>([]);
 const [departments, setDepartments] = useState<Department[]>([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");

 const [searchPatient, setSearchPatient] = useState("");
 const [searchDept, setSearchDept] = useState("");
 const [searchDoctor, setSearchDoctor] = useState("");
 const [selectedDeptId, setSelectedDeptId] = useState("");

 const [showPatientDropdown, setShowPatientDropdown] = useState(false);
 const [showDeptDropdown, setShowDeptDropdown] = useState(false);
 const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);

 const patientDropdownRef = useRef<HTMLDivElement>(null);
 const deptDropdownRef = useRef<HTMLDivElement>(null);
 const doctorDropdownRef = useRef<HTMLDivElement>(null);

 const [formData, setFormData] = useState({
 patientId: "",
 doctorId: "",
 appointmentType: "",
 date: "",
 time: "",
 duration: "30",
 reason: "",
 notes: "",
 });

 useEffect(() => {
 const handleClickOutside = (event: MouseEvent) => {
 if (
 patientDropdownRef.current &&
 !patientDropdownRef.current.contains(event.target as Node)
 ) {
 setShowPatientDropdown(false);
 }
 if (
 deptDropdownRef.current &&
 !deptDropdownRef.current.contains(event.target as Node)
 ) {
 setShowDeptDropdown(false);
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
 fetchData();
 }, []);

 const fetchData = async () => {
 try {
 const [patientsRes, deptsRes] = await Promise.all([
 patientAPI.list(1, 100),
 departmentAPI.list(1, 100),
 ]);
 setPatients(patientsRes.data.patients || []);
 
 // Filter only Active departments
 const activeDepts = (deptsRes.data.departments || []).filter(
 (d: any) => d.status === "Active"
 );
 setDepartments(activeDepts);
 } catch (err) {
 console.error("Failed to fetch initial data", err);
 }
 };

 const handleSelectDepartment = async (dept: Department) => {
 setSelectedDeptId(dept.id);
 setSearchDept(dept.name);
 setShowDeptDropdown(false);

 // Reset Doctor values
 setFormData((prev) => ({
 ...prev,
 doctorId: "",
 }));
 setSearchDoctor("");
 setDoctors([]);

 // Dynamically load doctors assigned to this clinical department
 try {
 const token = localStorage.getItem("token");
 const res = await fetch(`${API_URL}/departments/doctors/list?departmentId=${dept.id}`, {
 headers: {
 Authorization: `Bearer ${token}`,
 },
 });
 if (res.ok) {
 const data = await res.json();
 setDoctors(data);
 }
 } catch (err) {
 console.error("Failed to fetch assigned doctors:", err);
 }
 };

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

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);
 setError("");

 try {
 const response = await appointmentAPI.create({
 doctorId: formData.doctorId,
 patientId: formData.patientId,
 date: formData.date,
 time: formData.time,
 status: "Scheduled", // Automatically Scheduled
 department: searchDept, // Selected clinical department name
 visitType: formData.appointmentType,
 notes:
 formData.notes +
 (formData.reason ? `\nReason: ${formData.reason}` : ""),
 });
 const appointmentId = response.data.appointment?.id || response.data.id;
 router.push(`/appointments/success?id=${appointmentId}`);
 } catch (err: any) {
 setError(err.response?.data?.error || "Failed to create appointment");
 } finally {
 setLoading(false);
 }
 };

 const filteredPatients = patients.filter((p) =>
 p.name.toLowerCase().includes(searchPatient.toLowerCase())
 );

 const filteredDepartments = departments.filter((d) =>
 d.name.toLowerCase().includes(searchDept.toLowerCase())
 );

 const filteredDoctors = doctors.filter((d) =>
 d.name.toLowerCase().includes(searchDoctor.toLowerCase())
 );

 return (
 <>
 <div className="space-y-6">
 <div className="flex items-center gap-4">
 <Link href="/appointments/all">
 <button className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors">
 <ArrowLeft size={24} />
 </button>
 </Link>
 <div>
 <h1 className="text-3xl font-bold mb-2 text-white">Add Appointment</h1>
 <p className="text-gray-400">
 Schedule a new appointment using clinical hospital routing
 </p>
 </div>
 </div>

 <form onSubmit={handleSubmit} className="w-full">
 <div className="card bg-dark-secondary border border-dark-tertiary p-6 md:p-8 space-y-8 rounded-lg">
 
 {/* Step 1: Routing Cascade (Patient -> Department -> Doctor) */}
 <div className="space-y-6">
 <h3 className="text-lg font-semibold flex items-center gap-2 text-emerald-400">
 <User size={20} />
 Medical Routing Selection
 </h3>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 
 {/* 1. Select Patient */}
 <div className="relative" ref={patientDropdownRef}>
 <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
 <User size={18} className="text-emerald-500" />
 Select Patient <span className="text-red-500">*</span>
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
 setFormData((prev) => ({ ...prev, patientId: "" }));
 }
 }}
 onFocus={() => setShowPatientDropdown(true)}
 className="input-field w-full"
 style={{ paddingLeft: "2.75rem" }}
 required
 />
 </div>

 {showPatientDropdown && (
 <div className="absolute z-20 w-full left-0 mt-1 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-2xl max-h-60 overflow-y-auto">
 {filteredPatients.length > 0 ? (
 filteredPatients.map((patient) => (
 <div
 key={patient.id}
 onClick={() => {
 setFormData((prev) => ({
 ...prev,
 patientId: patient.id,
 }));
 setSearchPatient(patient.name);
 setShowPatientDropdown(false);
 }}
 className={`px-4 py-3 hover:bg-dark-tertiary cursor-pointer border-b border-dark-tertiary/20 last:border-0 transition-colors flex items-center justify-between text-sm ${
 formData.patientId === patient.id ? "bg-emerald-500/10 text-emerald-400" : "text-gray-300"
 }`}
 >
 <div>
 <div className="font-semibold">{patient.name}</div>
 {patient.phone && (
 <div className="text-xs text-gray-400 mt-0.5">{patient.phone}</div>
 )}
 </div>
 {formData.patientId === patient.id && (
 <div className="text-emerald-500 font-bold text-xs">Selected</div>
 )}
 </div>
 ))
 ) : (
 <div className="p-3 text-sm text-gray-500 text-center">
 No patients registered
 </div>
 )}
 </div>
 )}
 </div>

 {/* 2. Select Department */}
 <div className="relative" ref={deptDropdownRef}>
 <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
 <Building2 size={18} className="text-emerald-500" />
 Select Department <span className="text-red-500">*</span>
 </label>
 <div className="relative">
 <Search
 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
 size={18}
 />
 <input
 type="text"
 placeholder="Search clinical specialty..."
 value={searchDept}
 onChange={(e) => {
 setSearchDept(e.target.value);
 setShowDeptDropdown(true);
 if (selectedDeptId) {
 setSelectedDeptId("");
 setFormData((prev) => ({ ...prev, doctorId: "" }));
 setSearchDoctor("");
 }
 }}
 onFocus={() => setShowDeptDropdown(true)}
 className="input-field w-full"
 style={{ paddingLeft: "2.75rem" }}
 required
 />
 </div>

 {showDeptDropdown && (
 <div className="absolute z-20 w-full left-0 mt-1 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-2xl max-h-60 overflow-y-auto">
 {filteredDepartments.length > 0 ? (
 filteredDepartments.map((dept) => (
 <div
 key={dept.id}
 onClick={() => handleSelectDepartment(dept)}
 className={`px-4 py-3 hover:bg-dark-tertiary cursor-pointer border-b border-dark-tertiary/20 last:border-0 transition-colors flex items-center justify-between text-sm ${
 selectedDeptId === dept.id ? "bg-emerald-500/10 text-emerald-400" : "text-gray-300"
 }`}
 >
 <div className="font-semibold">{dept.name}</div>
 {selectedDeptId === dept.id && (
 <div className="text-emerald-500 font-bold text-xs">Selected</div>
 )}
 </div>
 ))
 ) : (
 <div className="p-3 text-sm text-gray-500 text-center">
 No active specialties found
 </div>
 )}
 </div>
 )}
 </div>

 {/* 3. Select Doctor */}
 <div className="relative" ref={doctorDropdownRef}>
 <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
 <UserCheck size={18} className="text-emerald-500" />
 Select Doctor <span className="text-red-500">*</span>
 </label>
 <div className="relative">
 <Search
 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
 size={18}
 />
 <input
 type="text"
 placeholder={selectedDeptId ? "Search doctor..." : "Select department first..."}
 value={searchDoctor}
 onChange={(e) => {
 setSearchDoctor(e.target.value);
 setShowDoctorDropdown(true);
 if (formData.doctorId) {
 setFormData((prev) => ({ ...prev, doctorId: "" }));
 }
 }}
 onFocus={() => {
 if (selectedDeptId) setShowDoctorDropdown(true);
 }}
 className="input-field w-full disabled:opacity-50 disabled:cursor-not-allowed"
 style={{ paddingLeft: "2.75rem" }}
 disabled={!selectedDeptId}
 required
 />
 </div>

 {showDoctorDropdown && selectedDeptId && (
 <div className="absolute z-20 w-full left-0 mt-1 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-2xl max-h-60 overflow-y-auto">
 {filteredDoctors.length > 0 ? (
 filteredDoctors.map((doctor) => (
 <div
 key={doctor.id}
 onClick={() => {
 setFormData((prev) => ({
 ...prev,
 doctorId: doctor.id,
 }));
 setSearchDoctor(doctor.name);
 setShowDoctorDropdown(false);
 }}
 className={`px-4 py-3 hover:bg-dark-tertiary cursor-pointer border-b border-dark-tertiary/20 last:border-0 transition-colors flex items-center justify-between text-sm ${
 formData.doctorId === doctor.id ? "bg-emerald-500/10 text-emerald-400" : "text-gray-300"
 }`}
 >
 <div>
 <div className="font-semibold">Dr. {doctor.name}</div>
 {doctor.specialization && (
 <div className="text-xs text-gray-400 mt-0.5">{doctor.specialization}</div>
 )}
 </div>
 {formData.doctorId === doctor.id && (
 <div className="text-emerald-500 font-bold text-xs">Selected</div>
 )}
 </div>
 ))
 ) : (
 <div className="p-3 text-sm text-gray-500 text-center">
 No assigned doctors in this department
 </div>
 )}
 </div>
 )}
 </div>

 </div>
 </div>

 <hr className="border-dark-tertiary/60" />

 {/* Step 2: Scheduling & Diagnostic Slots */}
 <div className="space-y-6">
 <h3 className="text-lg font-semibold flex items-center gap-2 text-emerald-400">
 <FileText size={20} />
 Appointment Information
 </h3>

 {/* Row 1: Visit Type & Duration */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">
 Visit Type <span className="text-red-500">*</span>
 </label>
 <select
 name="appointmentType"
 value={formData.appointmentType}
 onChange={handleChange}
 className="input-field w-full"
 required
 >
 <option value="">Select visit type</option>
 <option value="Check-up">Check-up</option>
 <option value="Consultation">Consultation</option>
 <option value="Follow-up">Follow-up</option>
 <option value="Emergency Visit">Emergency Visit</option>
 <option value="Diagnostics/Scan">Diagnostics/Scan</option>
 <option value="Treatment Session">Treatment Session</option>
 </select>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">
 Duration
 </label>
 <select
 name="duration"
 value={formData.duration}
 onChange={handleChange}
 className="input-field w-full"
 >
 <option value="15">15 minutes</option>
 <option value="30">30 minutes</option>
 <option value="45">45 minutes</option>
 <option value="60">60 minutes</option>
 </select>
 </div>
 </div>

 {/* Row 2: Date & Time Slot */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">
 Appointment Date <span className="text-red-500">*</span>
 </label>
 <div className="relative">
 <Calendar
 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
 size={20}
 />
 <input
 type="date"
 name="date"
 value={formData.date}
 onChange={handleChange}
 className="input-field w-full"
 style={{ paddingLeft: "2.75rem" }}
 required
 />
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">
 Time Slot <span className="text-red-500">*</span>
 </label>
 <div className="relative">
 <Clock
 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
 size={20}
 />
 <select
 name="time"
 value={formData.time}
 onChange={handleChange}
 className="input-field w-full"
 style={{ paddingLeft: "2.75rem" }}
 required
 >
 <option value="">Select time slot</option>
 <option value="08:00">08:00 AM</option>
 <option value="08:30">08:30 AM</option>
 <option value="09:00">09:00 AM</option>
 <option value="09:30">09:30 AM</option>
 <option value="10:00">10:00 AM</option>
 <option value="10:30">10:30 AM</option>
 <option value="11:00">11:00 AM</option>
 <option value="11:30">11:30 AM</option>
 <option value="12:00">12:00 PM</option>
 <option value="13:00">01:00 PM</option>
 <option value="13:30">01:30 PM</option>
 <option value="14:00">02:00 PM</option>
 <option value="14:30">02:30 PM</option>
 <option value="15:00">03:00 PM</option>
 <option value="15:30">03:30 PM</option>
 <option value="16:00">04:00 PM</option>
 <option value="16:30">04:30 PM</option>
 <option value="17:00">05:00 PM</option>
 </select>
 </div>
 </div>
 </div>

 {/* Row 3: Reason & Staff Notes */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">
 Reason for Visit
 </label>
 <textarea
 name="reason"
 value={formData.reason}
 onChange={handleChange}
 className="input-field w-full min-h-[90px]"
 placeholder="Enter the primary clinical complaint or reason..."
 rows={3}
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">
 Notes for Staff
 </label>
 <textarea
 name="notes"
 value={formData.notes}
 onChange={handleChange}
 className="input-field w-full min-h-[90px]"
 placeholder="Enter diagnostic prep instructions or notes for clinical staff..."
 rows={3}
 />
 </div>
 </div>
 </div>

 <hr className="border-dark-tertiary/60" />

 {error && (
 <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium">
 {error}
 </div>
 )}

 {/* Footer Actions */}
 <div className="flex justify-end gap-4 pt-2">
 <Link href="/appointments/all" className="btn-secondary px-6 py-2.5 rounded-lg transition-all font-medium">
 Cancel
 </Link>
 <button
 type="submit"
 disabled={loading || !formData.patientId || !formData.doctorId}
 className="btn-primary px-6 py-2.5 rounded-lg transition-all font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/15"
 >
 <CheckCircle size={20} />
 {loading ? "Scheduling..." : "Create Appointment"}
 </button>
 </div>

 </div>
 </form>
 </div>
 </>
 );
}
