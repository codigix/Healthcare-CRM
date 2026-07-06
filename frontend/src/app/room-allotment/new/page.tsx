"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { patientAPI, doctorAPI, departmentAPI } from "@/lib/api";
import { ChevronLeft, Check, Search, Calendar, Bed, User, FileText, Printer, Building2, AlertTriangle, ShieldAlert } from "lucide-react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function NewAllotmentPageContent() {
 const router = useRouter();
 const searchParams = useSearchParams();
 
 // Prefill metadata states
 const [prefillRecordId, setPrefillRecordId] = useState<string | null>(null);
 const [priority, setPriority] = useState("Routine");
 const [admissionReason, setAdmissionReason] = useState("");
 const [clinicalNotes, setClinicalNotes] = useState("");

 const [formData, setFormData] = useState({
 patientId: "",
 patientName: "",
 patientPhone: "",
 attendingDoctor: "",
 emergencyContact: "",
 roomId: "",
 specialRequirements: "",
 allotmentDate: "",
 expectedDischargeDate: "",
 paymentMethod: "Cash",
 insuranceDetails: "",
 additionalNotes: "",
 bed: "",
 });

 const [rooms, setRooms] = useState<any[]>([]);
 const [allotments, setAllotments] = useState<any[]>([]);
 const [selectedRoom, setSelectedRoom] = useState<any>(null);
 const [loading, setLoading] = useState(false);
 const [submitting, setSubmitting] = useState(false);

 // Dynamic Bed state
 const [selectedBed, setSelectedBed] = useState<string>("");
 const [roomBeds, setRoomBeds] = useState<any[]>([]);

 // Autocomplete state for manual entry fallback
 const [patientSearchTerm, setPatientSearchTerm] = useState("");
 const [patientsList, setPatientsList] = useState<any[]>([]);
 const [showPatientDropdown, setShowPatientDropdown] = useState(false);
 const [searchingPatients, setSearchingPatients] = useState(false);
 const dropdownRef = useRef<HTMLDivElement>(null);

 const [doctorSearchTerm, setDoctorSearchTerm] = useState("");
 const [doctorsList, setDoctorsList] = useState<any[]>([]);
 const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
 const [searchingDoctors, setSearchingDoctors] = useState(false);
 const doctorDropdownRef = useRef<HTMLDivElement>(null);

 // Admission Summary Modal
 const [showSummaryModal, setShowSummaryModal] = useState(false);
 const [summaryData, setSummaryData] = useState<any>(null);

 const [selectedRoomType, setSelectedRoomType] = useState("General Ward");
 const [selectedDepartment, setSelectedDepartment] = useState("Cardiology");
 const [activeDepartments, setActiveDepartments] = useState<string[]>([]);

 const fallbackDepartments = [
 "Cardiology",
 "Neurology",
 "Orthopedics",
 "Pediatrics",
 "ICU",
 "Emergency",
 "General Medicine",
 ];

 // Merge case-insensitively: prioritize API active departments, but include fallbacks if missing
 const mergedDepartmentsList = [...activeDepartments];
 fallbackDepartments.forEach(fallback => {
 const exists = activeDepartments.some(d => d.toLowerCase() === fallback.toLowerCase());
 if (!exists) {
 mergedDepartmentsList.push(fallback);
 }
 });

 const departmentsList = mergedDepartmentsList;

 const formatDeptName = (name: string) => {
 return name || "";
 };

 // Searchable Department selector states
 const [searchDept, setSearchDept] = useState("");
 const [showDeptDropdown, setShowDeptDropdown] = useState(false);
 const deptDropdownRef = useRef<HTMLDivElement>(null);

 // Keep searchable select input in sync with selectedDepartment changes
 useEffect(() => {
 if (selectedDepartment) {
 setSearchDept(formatDeptName(selectedDepartment));
 } else {
 setSearchDept("");
 }
 }, [selectedDepartment]);

 useEffect(() => {
 fetchAvailableRoomsAndAllotments();
 
 // Fetch active departments from Admin database
 departmentAPI.list(1, 100)
 .then(res => {
 const activeDepts = (res.data.departments || [])
 .filter((d: any) => d.status === "Active")
 .map((d: any) => d.name);
 if (activeDepts.length > 0) {
 setActiveDepartments(activeDepts);
 // Set selected department to first active if not already pre-filled via searchParams
 const hasPrefill = searchParams.get("department");
 if (!hasPrefill) {
 setSelectedDepartment(activeDepts[0]);
 }
 }
 })
 .catch(err => console.error("Failed to load clinical departments in allotment wizard:", err));
 
 const handleClickOutside = (event: MouseEvent) => {
 if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
 setShowPatientDropdown(false);
 }
 if (doctorDropdownRef.current && !doctorDropdownRef.current.contains(event.target as Node)) {
 setShowDoctorDropdown(false);
 }
 if (deptDropdownRef.current && !deptDropdownRef.current.contains(event.target as Node)) {
 setShowDeptDropdown(false);
 }
 };
 document.addEventListener("mousedown", handleClickOutside);
 return () => document.removeEventListener("mousedown", handleClickOutside);
 }, [searchParams]);

 // Parse URL pre-fill parameters
 useEffect(() => {
 const prefillPatientId = searchParams.get("patientId");
 const prefillPatientName = searchParams.get("patientName");
 const prefillNotes = searchParams.get("notes");
 const recordIdParam = searchParams.get("recordId");
 const doctorParam = searchParams.get("doctor");
 const departmentParam = searchParams.get("department");
 const roomTypeParam = searchParams.get("roomType");
 const reasonParam = searchParams.get("reason");
 const priorityParam = searchParams.get("priority");

 if (prefillPatientName) {
 setFormData(prev => ({
 ...prev,
 patientId: prefillPatientId || "",
 patientName: prefillPatientName,
 attendingDoctor: doctorParam && doctorParam !== "Attending Doctor" ? doctorParam : "",
 allotmentDate: new Date().toISOString().split('T')[0],
 }));
 setPatientSearchTerm(prefillPatientName);
 if (doctorParam && doctorParam !== "Attending Doctor") setDoctorSearchTerm(doctorParam);
 if (priorityParam) setPriority(priorityParam);
 if (reasonParam) setAdmissionReason(reasonParam);
 if (prefillNotes) setClinicalNotes(prefillNotes);
 if (roomTypeParam) {
 let normalizedRoomType = roomTypeParam;
 if (roomTypeParam === "General") normalizedRoomType = "General Ward";
 else if (roomTypeParam === "Semi-Private" || roomTypeParam === "Semi-private") normalizedRoomType = "Semi Private";
 else if (roomTypeParam === "Private") normalizedRoomType = "Private Room";
 setSelectedRoomType(normalizedRoomType);
 }
 if (departmentParam) setSelectedDepartment(departmentParam);

 // Auto-fetch patient details (like phone number) from the database
 if (prefillPatientId) {
 patientAPI.get(prefillPatientId)
 .then(res => {
 const p = res.data;
 if (p && p.phone) {
 setFormData(prev => ({
 ...prev,
 patientPhone: p.phone,
 }));
 }
 })
 .catch(err => console.error("Failed to automatically fetch patient phone:", err));
 }
 }
 if (recordIdParam) {
 setPrefillRecordId(recordIdParam);

 // Auto-fetch the actual doctor who did the consultation from the database
 fetch(`${API_URL}/records/${recordIdParam}`, {
 headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
 })
 .then(res => res.json())
 .then(record => {
 const docId = record?.doctorId;
 const aptId = record?.appointmentId;

 if (aptId) {
 // If there is an appointment ID, fetch it directly as it contains the joined doctor's name
 fetch(`${API_URL}/appointments/${aptId}`, {
 headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
 })
 .then(aptRes => aptRes.json())
 .then(apt => {
 if (apt && apt.doctorName) {
 setFormData(prev => ({
 ...prev,
 attendingDoctor: apt.doctorName,
 }));
 setDoctorSearchTerm(apt.doctorName);
 }
 })
 .catch(err => console.error("Failed to fetch appointment doctor details:", err));
 } else if (docId) {
 // Fallback to fetching doctor directly by doctorId
 doctorAPI.get(docId)
 .then(docRes => {
 const doc = docRes.data.doctor || docRes.data;
 if (doc && doc.name) {
 setFormData(prev => ({
 ...prev,
 attendingDoctor: doc.name,
 }));
 setDoctorSearchTerm(doc.name);
 }
 })
 .catch(err => console.error("Failed to fetch doctor details:", err));
 }
 })
 .catch(err => console.error("Failed to fetch record details for doctor name auto-resolve:", err));
 }
 }, [searchParams]);

 // Auto-allotment proposal effect
 useEffect(() => {
 if (rooms.length === 0 || loading) return;

 // Check if we already have a selectedRoom. If we do, don't override it unless it's the initial load.
 if (formData.roomId) return;

 // Get incoming prefill params
 const departmentParam = searchParams.get("department");
 const roomTypeParam = searchParams.get("roomType");

 let targetDept = departmentParam || selectedDepartment;
 let targetRoomType = roomTypeParam || selectedRoomType;

 // Handle standard prefill mappings
 if (roomTypeParam === "General") targetRoomType = "General Ward";
 else if (roomTypeParam === "Semi-Private" || roomTypeParam === "Semi-private") targetRoomType = "Semi Private";
 else if (roomTypeParam === "Private") targetRoomType = "Private Room";

 // 1. Try to find an available room matching both targetDept and targetRoomType
 let matchingRoom = rooms.find(
 (r) =>
 r.status === "Available" &&
 r.department?.toLowerCase() === targetDept?.toLowerCase() &&
 r.roomType?.toLowerCase() === targetRoomType?.toLowerCase()
 );

 // 2. If no exact match, try to find a room matching just the department
 if (!matchingRoom) {
 matchingRoom = rooms.find(
 (r) => r.status === "Available" && r.department?.toLowerCase() === targetDept?.toLowerCase()
 );
 }

 // 3. If still no match, try to find a room matching just the room type
 if (!matchingRoom) {
 matchingRoom = rooms.find(
 (r) => r.status === "Available" && r.roomType?.toLowerCase() === targetRoomType?.toLowerCase()
 );
 }

 // 4. If still no match, grab the first available room in general
 if (!matchingRoom) {
 matchingRoom = rooms.find((r) => r.status === "Available");
 }

 if (matchingRoom) {
 // Auto-select this room!
 setSelectedRoom(matchingRoom);
 setFormData((prev) => ({
 ...prev,
 roomId: matchingRoom.id,
 }));

 // Set selectors to match
 setSelectedDepartment(matchingRoom.department);
 setSelectedRoomType(matchingRoom.roomType);

 // Now, auto-select the first available bed in this room!
 const capacity = matchingRoom.capacity || 1;
 const roomAllotments = allotments.filter(
 (a) => a.roomId === matchingRoom.id && a.status === "Occupied"
 );
 const alphabeticalBeds = ["A", "B", "C", "D", "E", "F", "G", "H"];

 for (let i = 0; i < capacity; i++) {
 const bedName =
 capacity === 1
 ? `${matchingRoom.roomNumber}-Single Bed`
 : `${matchingRoom.roomNumber}-${alphabeticalBeds[i] || i + 1}`;

 // Check if occupied
 const isOccupied = roomAllotments.some(
 (a) =>
 a.bed === bedName ||
 a.bed === (capacity === 1 ? "Single Bed" : `Bed ${alphabeticalBeds[i]}`) ||
 (capacity === 1 && !a.bed)
 );

 if (!isOccupied) {
 // Found first available bed!
 setSelectedBed(bedName);
 setFormData((prev) => ({
 ...prev,
 bed: bedName,
 }));
 break;
 }
 }
 }
 }, [rooms, allotments, searchParams]);

 // Autocomplete queries for fallback manual entry
 useEffect(() => {
 if (!patientSearchTerm.trim()) return;
 const searchPatients = async () => {
 try {
 setSearchingPatients(true);
 const response = await patientAPI.list(1, 10, patientSearchTerm);
 setPatientsList(response.data.patients || []);
 } catch (err) {
 console.error("Failed to search patients:", err);
 } finally {
 setSearchingPatients(false);
 }
 };
 const timeoutId = setTimeout(searchPatients, 300);
 return () => clearTimeout(timeoutId);
 }, [patientSearchTerm]);

 useEffect(() => {
 if (!doctorSearchTerm.trim()) return;
 const searchDoctors = async () => {
 try {
 setSearchingDoctors(true);
 const response = await doctorAPI.list(1, 10, doctorSearchTerm);
 setDoctorsList(response.data.doctors || []);
 } catch (err) {
 console.error("Failed to search doctors:", err);
 } finally {
 setSearchingDoctors(false);
 }
 };
 const timeoutId = setTimeout(searchDoctors, 300);
 return () => clearTimeout(timeoutId);
 }, [doctorSearchTerm]);

 const selectPatient = (patient: any) => {
 setFormData(prev => ({
 ...prev,
 patientId: patient.id,
 patientName: patient.name,
 patientPhone: patient.phone || prev.patientPhone
 }));
 setPatientSearchTerm(patient.name);
 setShowPatientDropdown(false);
 };

 const selectDoctor = (doctor: any) => {
 setFormData(prev => ({
 ...prev,
 attendingDoctor: doctor.name
 }));
 setDoctorSearchTerm(doctor.name);
 setShowDoctorDropdown(false);
 };

 const fetchAvailableRoomsAndAllotments = async () => {
 try {
 setLoading(true);
 const [roomsRes, allotmentsRes] = await Promise.all([
 fetch(`${API_URL}/room-allotment/rooms`, {
 headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
 }),
 fetch(`${API_URL}/room-allotment/allotments`, {
 headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
 })
 ]);

 if (!roomsRes.ok || !allotmentsRes.ok) throw new Error("Failed to load room details");

 const roomsData = await roomsRes.json();
 const allotmentsData = await allotmentsRes.json();

 setRooms(roomsData.rooms || []);
 setAllotments(allotmentsData.allotments || []);
 } catch (err) {
 alert(err instanceof Error ? err.message : "Failed to load data");
 } finally {
 setLoading(false);
 }
 };

 // Re-calculate available beds whenever a room is selected
 useEffect(() => {
 if (!selectedRoom) {
 setRoomBeds([]);
 return;
 }

 const capacity = selectedRoom.capacity || 1;
 const roomType = selectedRoom.roomType;
 const roomStatus = selectedRoom.status || "Available";

 // If the room status itself is Maintenance, Cleaning, or Isolation, mark all beds as such!
 const beds = [];
 const alphabeticalBeds = ["A", "B", "C", "D", "E", "F", "G", "H"];

 // Find all active allotments for this room in allotments
 const roomAllotments = allotments.filter(
 (a) => a.roomId === selectedRoom.id && a.status === "Occupied"
 );

 for (let i = 0; i < capacity; i++) {
 const bedName = capacity === 1 ? `${selectedRoom.roomNumber}-Single Bed` : `${selectedRoom.roomNumber}-${alphabeticalBeds[i] || i + 1}`;
 
 let bedStatus = "Available";
 let occupantName = "";

 // Check if this specific bed is occupied in allotments
 const activeAllotment = roomAllotments.find(
 (a) => a.bed === bedName || 
 a.bed === (capacity === 1 ? "Single Bed" : `Bed ${alphabeticalBeds[i]}`) || 
 (capacity === 1 && !a.bed)
 );
 if (activeAllotment) {
 bedStatus = "Occupied";
 occupantName = activeAllotment.patientName;
 }

 // Overriding if room status is critical
 if (roomStatus === "Maintenance") {
 bedStatus = "Maintenance";
 } else if (roomStatus === "Cleaning") {
 bedStatus = "Cleaning";
 } else if (roomStatus === "Isolation Active" || roomStatus === "Isolation") {
 bedStatus = "Isolation";
 }

 beds.push({
 name: bedName,
 status: bedStatus,
 occupant: occupantName,
 });
 }

 setRoomBeds(beds);
 setSelectedBed(""); // Reset bed selection
 }, [selectedRoom, allotments]);

 const handleChange = (
 e: React.ChangeEvent<
 HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
 >
 ) => {
 const { name, value } = e.target;
 setFormData((prev) => ({
 ...prev,
 [name]: value,
 }));

 if (name === "roomId") {
 const room = rooms.find((r) => r.id === value);
 setSelectedRoom(room);
 if (room) {
 setSelectedDepartment(room.department);
 setSelectedRoomType(room.roomType);
 }
 }
 };

 const handleBedSelect = (bedName: string, bedStatus: string) => {
 if (bedStatus !== "Available") return; // Disabled
 setSelectedBed(bedName);
 setFormData(prev => ({ ...prev, bed: bedName }));
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();

 if (
 !formData.patientId ||
 !formData.patientName ||
 !formData.roomId ||
 !formData.attendingDoctor ||
 !formData.allotmentDate ||
 !formData.bed
 ) {
 alert("Please fill in all required fields, including selecting an available bed.");
 return;
 }

 try {
 setSubmitting(true);
 
 const payload = {
 ...formData,
 status: "Occupied",
 recordId: prefillRecordId,
 };

 const response = await fetch(`${API_URL}/room-allotment/allotments`, {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 Authorization: `Bearer ${localStorage.getItem("token")}`,
 },
 body: JSON.stringify(payload),
 });

 if (!response.ok) {
 const error = await response.json();
 throw new Error(error.error || "Failed to create allotment");
 }

 const allotmentObj = await response.json();
 
 // Calculate charges
 const pricePerDay = selectedRoom ? parseFloat(selectedRoom.pricePerDay) : 0;
 
 // Prepare Admission Summary data
 setSummaryData({
 patientName: formData.patientName,
 patientId: formData.patientId,
 roomNumber: selectedRoom?.roomNumber,
 roomType: selectedRoom?.roomType,
 bed: formData.bed,
 department: selectedRoom?.department || selectedDepartment,
 doctor: formData.attendingDoctor,
 allotmentDate: formData.allotmentDate,
 expectedDischargeDate: formData.expectedDischargeDate,
 pricePerDay: pricePerDay,
 insuranceDetails: formData.insuranceDetails,
 paymentMethod: formData.paymentMethod,
 });

 // Show summary popup
 setShowSummaryModal(true);
 } catch (err) {
 alert(err instanceof Error ? err.message : "Failed to create allotment");
 } finally {
 setSubmitting(false);
 }
 };

 const getBedStatusStyle = (status: string, isSelected: boolean) => {
 if (isSelected) {
 return "border-emerald-500 bg-emerald-500/10 text-white shadow-md shadow-emerald-500/5 cursor-pointer scale-95 border-2";
 }

 switch (status?.toLowerCase()) {
 case "available":
 return "border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] text-emerald-400 cursor-pointer border";
 case "occupied":
 return "border-rose-500/20 bg-rose-500/[0.04] text-rose-500 cursor-not-allowed border opacity-80";
 case "reserved":
 return "border-amber-500/20 bg-amber-500/[0.04] text-amber-500 cursor-not-allowed border opacity-80";
 case "cleaning":
 return "border-gray-500/20 bg-gray-500/[0.04] text-gray-400 cursor-not-allowed border opacity-80";
 case "maintenance":
 return "border-rose-500/15 bg-rose-950/20 text-rose-300 cursor-not-allowed border opacity-80";
 case "isolation":
 return "border-purple-500/20 bg-purple-500/[0.04] text-purple-400 cursor-not-allowed border opacity-80";
 default:
 return "border-dark-tertiary text-gray-500 cursor-not-allowed border";
 }
 };

 return (
 <>
 <div className="space-y-6 pb-20">
 <div className="flex items-center gap-4">
 <Link href="/room-allotment/requests">
 <button className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors border border-dark-tertiary bg-dark-tertiary/20">
 <ChevronLeft size={20} className="text-gray-400" />
 </button>
 </Link>
 <div>
 <h1 className="text-3xl font-bold text-white font-outfit">Inpatient Room & Bed Allocation</h1>
 <p className="text-gray-400 mt-1">Review clinical request details and allocate available room beds</p>
 </div>
 </div>

 {prefillRecordId && (
 <div className="bg-dark-secondary border border-dark-tertiary rounded-xl px-5 py-3 flex items-center justify-between gap-3 text-xs text-gray-400 animate-fadeIn">
 <div className="flex items-center gap-2">
 <ShieldAlert className="text-emerald-400 animate-pulse" size={16} />
 <span>Linked to Inpatient Admission Request. All fields can be manually changed or overridden.</span>
 </div>
 {priority && (
 <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
 priority.toLowerCase() === "emergency" ? "bg-rose-500/20 text-rose-400 border-rose-500/30" : 
 priority.toLowerCase() === "urgent" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : 
 "bg-blue-500/20 text-blue-400 border-blue-500/30"
 }`}>
 {priority} Priority
 </span>
 )}
 </div>
 )}

 <form onSubmit={handleSubmit} className="space-y-6">
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 
 {/* Column 1: Patient Information */}
 <div className="lg:col-span-1 bg-dark-secondary border border-dark-tertiary rounded-xl p-6 space-y-6 shadow-md">
 <div className="flex items-center gap-2 border-b border-dark-tertiary pb-3 mb-2">
 <User className="text-emerald-400" size={18} />
 <h2 className="text-base font-bold text-white font-outfit">Patient Information</h2>
 </div>

 <div className="space-y-4">
 {/* Search Patient (always available for overrides/manual) */}
 <div className="relative" ref={dropdownRef}>
 <label className="block text-xs font-bold text-gray-400 mb-2">
 Search Patient
 </label>
 <div className="relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
 <input
 type="text"
 value={patientSearchTerm}
 onChange={(e) => {
 setPatientSearchTerm(e.target.value);
 setShowPatientDropdown(true);
 if (formData.patientId) {
 setFormData(prev => ({ ...prev, patientId: "", patientName: "" }));
 }
 }}
 onFocus={() => setShowPatientDropdown(true)}
 placeholder="Search patient by name..."
 className="w-full pl-9 pr-4 py-2 bg-dark-tertiary border border-dark-tertiary/70 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
 />
 </div>
 {showPatientDropdown && (
 <div className="absolute z-10 w-full mt-1 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-lg max-h-60 overflow-y-auto">
 {searchingPatients ? (
 <div className="p-3 text-xs text-gray-400 text-center">Searching...</div>
 ) : patientsList.length > 0 ? (
 patientsList.map((patient: any) => (
 <div
 key={patient.id}
 onClick={() => selectPatient(patient)}
 className="px-4 py-3 hover:bg-dark-tertiary cursor-pointer border-b border-dark-tertiary/40 last:border-0"
 >
 <div className="font-semibold text-white text-xs">{patient.name}</div>
 <div className="text-[10px] text-gray-400 mt-0.5">
 ID: {patient.id} {patient.phone ? `• Phone: ${patient.phone}` : ""}
 </div>
 </div>
 ))
 ) : (
 <div className="p-3 text-xs text-gray-400 text-center">No patients found</div>
 )}
 </div>
 )}
 </div>

 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1.5">
 Patient Name
 </label>
 <input
 type="text"
 name="patientName"
 value={formData.patientName}
 onChange={handleChange}
 className="w-full px-3 py-2 bg-dark-tertiary border border-dark-tertiary/75 rounded-lg text-xs text-white outline-none font-semibold focus:border-emerald-500"
 placeholder="Enter patient name"
 />
 </div>
 <div>
 <label className="block text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1.5">
 Patient ID (UHID)
 </label>
 <input
 type="text"
 name="patientId"
 value={formData.patientId}
 onChange={handleChange}
 className="w-full px-3 py-2 bg-dark-tertiary border border-dark-tertiary/75 rounded-lg text-xs text-white outline-none font-mono focus:border-emerald-500"
 placeholder="Enter UHID"
 />
 </div>
 </div>

 {/* Search Doctor (always available for overrides/manual) */}
 <div className="relative" ref={doctorDropdownRef}>
 <label className="block text-xs font-bold text-gray-400 mb-2">
 Search Doctor
 </label>
 <div className="relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
 <input
 type="text"
 value={doctorSearchTerm}
 onChange={(e) => {
 setDoctorSearchTerm(e.target.value);
 setShowDoctorDropdown(true);
 if (formData.attendingDoctor) {
 setFormData(prev => ({ ...prev, attendingDoctor: "" }));
 }
 }}
 onFocus={() => setShowDoctorDropdown(true)}
 placeholder="Search doctor by name..."
 className="w-full pl-9 pr-4 py-2 bg-dark-tertiary border border-dark-tertiary/70 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
 />
 </div>
 {showDoctorDropdown && (
 <div className="absolute z-10 w-full mt-1 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-lg max-h-60 overflow-y-auto">
 {searchingDoctors ? (
 <div className="p-3 text-xs text-gray-400 text-center">Searching...</div>
 ) : doctorsList.length > 0 ? (
 doctorsList.map((doctor: any) => (
 <div
 key={doctor.id}
 onClick={() => selectDoctor(doctor)}
 className="px-4 py-3 hover:bg-dark-tertiary cursor-pointer border-b border-dark-tertiary/45 last:border-0"
 >
 <div className="font-semibold text-white text-xs">{doctor.name}</div>
 {doctor.specialization && (
 <div className="text-[10px] text-purple-400 mt-0.5">
 {doctor.specialization}
 </div>
 )}
 </div>
 ))
 ) : (
 <div className="p-3 text-xs text-gray-400 text-center">No doctors found</div>
 )}
 </div>
 )}
 </div>

 <div>
 <label className="block text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1.5">
 Attending Doctor
 </label>
 <input
 type="text"
 name="attendingDoctor"
 value={formData.attendingDoctor}
 onChange={handleChange}
 className="w-full px-3 py-2 bg-dark-tertiary border border-dark-tertiary/75 rounded-lg text-xs text-white outline-none font-semibold focus:border-emerald-500"
 placeholder="Doctor Name"
 />
 </div>

 <div>
 <label className="block text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1.5">
 Patient Phone
 </label>
 <input
 type="text"
 name="patientPhone"
 value={formData.patientPhone}
 onChange={handleChange}
 placeholder="Enter phone number"
 className="w-full px-3 py-2 bg-dark-tertiary border border-dark-tertiary/70 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
 />
 </div>

 <div>
 <label className="block text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1.5">
 Emergency Contact
 </label>
 <input
 type="text"
 name="emergencyContact"
 value={formData.emergencyContact}
 onChange={handleChange}
 placeholder="Enter emergency relative phone"
 className="w-full px-3 py-2 bg-dark-tertiary border border-dark-tertiary/70 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
 />
 </div>
 </div>
 </div>

 {/* Column 2 & 3: Bed & Room Allocation */}
 <div className="lg:col-span-2 space-y-6">
 
 <div className="bg-dark-secondary border border-dark-tertiary rounded-xl p-6 space-y-6 shadow-md">
 <div className="flex items-center gap-2 border-b border-dark-tertiary pb-3 mb-2">
 <Building2 className="text-emerald-400" size={18} />
 <h2 className="text-base font-bold text-white font-outfit">Select Room & Bed</h2>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div>
 <label className="block text-xs font-bold text-gray-400 mb-2">
 Department
 </label>
 <div className="relative" ref={deptDropdownRef}>
 <div className="relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
 <input
 type="text"
 placeholder="Search department..."
 value={searchDept}
 onChange={(e) => {
 setSearchDept(e.target.value);
 setShowDeptDropdown(true);
 setSelectedDepartment("");
 setFormData(prev => ({ ...prev, roomId: "", bed: "" }));
 setSelectedRoom(null);
 }}
 onFocus={() => setShowDeptDropdown(true)}
 className="w-full pl-9 pr-4 py-2 bg-dark-tertiary border border-dark-tertiary/70 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 h-[38px] font-semibold"
 />
 </div>
 {showDeptDropdown && (
 <div className="absolute z-50 w-full mt-1 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-xl max-h-60 overflow-y-auto">
 {departmentsList
 .filter((d) => formatDeptName(d).toLowerCase().includes(searchDept.toLowerCase()))
 .map((dept) => (
 <div
 key={dept}
 onClick={() => {
 setSelectedDepartment(dept);
 setSearchDept(formatDeptName(dept));
 setFormData(prev => ({ ...prev, roomId: "", bed: "" }));
 setSelectedRoom(null);
 setShowDeptDropdown(false);
 }}
 className="px-4 py-2.5 hover:bg-dark-tertiary cursor-pointer border-b border-dark-tertiary/40 last:border-0 text-xs text-white font-semibold flex items-center justify-between"
 >
 <span>{formatDeptName(dept)}</span>
 </div>
 ))}
 {departmentsList.filter((d) => formatDeptName(d).toLowerCase().includes(searchDept.toLowerCase())).length === 0 && (
 <div className="p-3 text-xs text-gray-400 text-center">No matching departments</div>
 )}
 </div>
 )}
 </div>
 </div>

 <div>
 <label className="block text-xs font-bold text-gray-400 mb-2">
 Room Type
 </label>
 <select
 value={selectedRoomType}
 onChange={(e) => {
 setSelectedRoomType(e.target.value);
 setFormData(prev => ({ ...prev, roomId: "", bed: "" }));
 setSelectedRoom(null);
 }}
 className="w-full px-3 py-2 bg-dark-tertiary border border-dark-tertiary/70 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 h-[38px]"
 >
 <option value="General Ward">General Ward</option>
 <option value="Semi Private">Semi Private</option>
 <option value="Private Room">Private Room</option>
 <option value="Deluxe Room">Deluxe Room</option>
 <option value="ICU">ICU</option>
 <option value="Isolation Room">Isolation Room</option>
 <option value="Emergency Observation">Emergency Observation</option>
 </select>
 </div>

 <div>
 <label className="block text-xs font-bold text-gray-400 mb-2">
 Select Room (Grouped by recommendations)
 </label>
 {(() => {
 const matching: any[] = [];
 const others: any[] = [];

 rooms.forEach((r) => {
 if (r.status !== "Available") return;
 const isMatch =
 r.department?.toLowerCase() === selectedDepartment?.toLowerCase() &&
 r.roomType?.toLowerCase() === selectedRoomType?.toLowerCase();
 if (isMatch) {
 matching.push(r);
 } else {
 others.push(r);
 }
 });

 return (
 <select
 name="roomId"
 value={formData.roomId}
 onChange={handleChange}
 disabled={loading}
 className="w-full px-3 py-2 bg-dark-tertiary border border-dark-tertiary/70 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 h-[38px] font-semibold"
 >
 <option value="">Select Room</option>
 
 {matching.length > 0 && (
 <optgroup label="★ RECOMMENDED MATCHING ROOMS">
 {matching.map((room) => (
 <option key={room.id} value={room.id}>
 Room {room.roomNumber} (Floor {room.floor}) - {room.roomType} (${parseFloat(room.pricePerDay)}/day)
 </option>
 ))}
 </optgroup>
 )}

 <optgroup label="ALL OTHER AVAILABLE ROOMS">
 {others.map((room) => (
 <option key={room.id} value={room.id}>
 Room {room.roomNumber} ({room.department} • {room.roomType}) - Floor {room.floor} (${parseFloat(room.pricePerDay)}/day)
 </option>
 ))}
 </optgroup>
 </select>
 );
 })()}
 </div>
 </div>

 {/* DYNAMIC BED SELECTOR GRID */}
 {selectedRoom && (
 <div className="space-y-4 animate-fadeIn pt-2 border-t border-dark-tertiary/40">
 <div>
 <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
 Select Bed inside Room {selectedRoom.roomNumber}
 </h3>
 <p className="text-[10px] text-gray-500">
 Room Capacity: {selectedRoom.capacity} Beds • Type: {selectedRoom.roomType}
 </p>
 </div>

 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
 {roomBeds.map((bedItem) => {
 const isSelected = selectedBed === bedItem.name;
 const isAvailable = bedItem.status === "Available";
 
 return (
 <div
 key={bedItem.name}
 onClick={() => handleBedSelect(bedItem.name, bedItem.status)}
 className={`p-3 rounded-lg flex flex-col items-center justify-center text-center transition-all ${getBedStatusStyle(
 bedItem.status,
 isSelected
 )}`}
 >
 <Bed size={18} className="mb-2 shrink-0" />
 <span className="text-xs font-bold font-sans block">{bedItem.name}</span>
 
 <span className="text-[9px] font-bold block mt-1 uppercase tracking-wide">
 {bedItem.status}
 </span>
 
 {bedItem.status === "Occupied" && (
 <span className="text-[8px] text-gray-500 font-semibold block truncate mt-1 w-full" title={bedItem.occupant}>
 {bedItem.occupant}
 </span>
 )}
 </div>
 );
 })}
 </div>
 </div>
 )}
 </div>

 {/* Allotment Schedule */}
 <div className="bg-dark-secondary border border-dark-tertiary rounded-xl p-6 space-y-4 shadow-md">
 <div className="flex items-center gap-2 border-b border-dark-tertiary pb-3 mb-1">
 <Calendar className="text-emerald-400" size={16} />
 <h3 className="font-bold text-white text-xs">Allotment Schedule</h3>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <label className="block text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1.5">
 Admission Date
 </label>
 <input
 type="date"
 name="allotmentDate"
 value={formData.allotmentDate}
 onChange={handleChange}
 className="w-full px-3 py-2 bg-dark-tertiary border border-dark-tertiary/70 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
 />
 </div>

 <div>
 <label className="block text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1.5">
 Estimated Discharge Date
 </label>
 <input
 type="date"
 name="expectedDischargeDate"
 value={formData.expectedDischargeDate}
 onChange={handleChange}
 className="w-full px-3 py-2 bg-dark-tertiary border border-dark-tertiary/70 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
 />
 </div>
 </div>
 </div>

 {/* Special Requirements */}
 <div className="bg-dark-secondary border border-dark-tertiary rounded-xl p-6 shadow-md">
 <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider border-b border-dark-tertiary pb-3 mb-4">
 Clinical Special Requirements & Instructions
 </h3>
 <textarea
 name="specialRequirements"
 value={formData.specialRequirements}
 onChange={handleChange}
 placeholder="Record dietary restrictions, oxygen setups, wheelchair, isolation requests, etc."
 rows={3}
 className="w-full px-3 py-2 bg-dark-tertiary border border-dark-tertiary/70 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none font-sans"
 />
 </div>

 {/* Form Action Controls */}
 <div className="flex gap-3 justify-end pt-4">
 <Link href="/room-allotment/requests">
 <button
 type="button"
 className="px-5 py-2.5 bg-dark-tertiary hover:bg-dark-tertiary/70 text-gray-300 rounded-lg transition-colors text-xs font-bold"
 >
 Cancel
 </button>
 </Link>
 <button
 type="submit"
 disabled={submitting || loading}
 className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 text-white rounded-lg transition-all text-xs font-bold flex items-center gap-1.5 shadow shadow-emerald-500/10 active:scale-95"
 >
 <Check size={14} />
 {submitting ? "Allotting..." : "Allot Room Bed"}
 </button>
 </div>

 </div>

 </div>
 </form>
 </div>

 {/* ADMISSION SUMMARY POST-ALLOCATION POPUP MODAL */}
 <Modal
 isOpen={showSummaryModal}
 onClose={() => {
 setShowSummaryModal(false);
 router.push("/room-allotment/alloted");
 }}
 title="Admission Allotment Summary"
 >
 {summaryData && (
 <div className="space-y-6 text-gray-300 font-sans text-xs leading-relaxed" id="admission-summary-panel">
 <div className="flex flex-col items-center text-center pb-4 border-b border-dark-tertiary/60">
 <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 mb-2">
 <Check size={24} className="stroke-2" />
 </div>
 <h3 className="text-sm font-bold text-white uppercase tracking-wider">Inpatient Admitted Successfully</h3>
 <p className="text-[10px] text-emerald-400 font-semibold mt-1">Bed Allotted & Patient Status Set to Admitted</p>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Patient Name</p>
 <p className="font-semibold text-white mt-0.5 text-xs">{summaryData.patientName}</p>
 <p className="text-[10px] text-gray-400 mt-0.5">UHID: {summaryData.patientId?.slice(0, 8).toUpperCase()}</p>
 </div>
 <div>
 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Attending Clinician</p>
 <p className="font-semibold text-white mt-0.5 text-xs">Dr. {summaryData.doctor}</p>
 <p className="text-[10px] text-purple-400 mt-0.5">{summaryData.department}</p>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4 bg-dark-tertiary/30 p-4 rounded-lg border border-dark-tertiary/50">
 <div>
 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Assigned Room</p>
 <p className="font-bold text-white mt-0.5 text-xs">Room {summaryData.roomNumber}</p>
 <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">{summaryData.roomType} Type</p>
 </div>
 <div>
 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Assigned Bed Slot</p>
 <p className="font-bold text-emerald-400 mt-0.5 text-xs flex items-center gap-1">
 <Bed size={13} />
 {summaryData.bed}
 </p>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Admission Date</p>
 <p className="font-semibold text-white mt-0.5 text-xs">
 {new Date(summaryData.allotmentDate).toLocaleDateString("en-US", {
 month: "long",
 day: "numeric",
 year: "numeric"
 })}
 </p>
 </div>
 <div>
 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Estimated Discharge</p>
 <p className="font-semibold text-white mt-0.5 text-xs">
 {summaryData.expectedDischargeDate 
 ? new Date(summaryData.expectedDischargeDate).toLocaleDateString("en-US", {
 month: "long",
 day: "numeric",
 year: "numeric"
 })
 : "Not Determined"
 }
 </p>
 </div>
 </div>

 <div className="border-t border-dark-tertiary/60 pt-4 flex flex-col gap-1.5">
 <div className="flex justify-between text-xs">
 <span className="text-gray-400 font-semibold">Room Price Per Day</span>
 <span className="text-white font-bold font-mono">${summaryData.pricePerDay.toFixed(2)}</span>
 </div>
 <div className="flex justify-between text-xs">
 <span className="text-gray-400 font-semibold">Estimated Daily Charges</span>
 <span className="text-emerald-400 font-bold font-mono">${summaryData.pricePerDay.toFixed(2)}</span>
 </div>
 </div>

 <div className="flex gap-2 justify-end pt-4 border-t border-dark-tertiary/40">
 <button
 onClick={() => {
 window.print();
 }}
 className="px-4 py-2 bg-dark-tertiary hover:bg-dark-tertiary/70 text-white rounded-lg flex items-center gap-1.5 text-xs font-semibold border border-dark-tertiary/50"
 >
 <Printer size={13} />
 Print Summary
 </button>
 <button
 onClick={() => {
 setShowSummaryModal(false);
 router.push("/room-allotment/alloted");
 }}
 className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold"
 >
 Complete Admission
 </button>
 </div>
 </div>
 )}
 </Modal>
 </>
 );
}

export default function NewAllotmentPage() {
 return (
 <Suspense fallback={<div className="text-center py-12 text-gray-400">Loading Allotment Panel...</div>}>
 <NewAllotmentPageContent />
 </Suspense>
 );
}
