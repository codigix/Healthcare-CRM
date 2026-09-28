"use client";

import { useState, useEffect, useRef } from "react";
import { appointmentAPI, departmentAPI, patientAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import {
    Calendar, Clock, User, QrCode, Search,
    Plus, ChevronLeft, ChevronRight, Info, AlertCircle, FileText
} from "lucide-react";
import dayjs from "dayjs";
import Link from "next/link";

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
    uhid?: string;
    mrn?: string;
    age?: string;
    gender?: string;
    bloodGroup?: string;
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
        if (user && (user.role === "doctor" || user.department?.toLowerCase() === "doctor")) {
            router.push("/appointments/all");
        }
    }, [user, router]);

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [selectedDeptId, setSelectedDeptId] = useState("");
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [formData, setFormData] = useState({
        visitType: "OPD - Out Patient",
        departmentName: "",
        doctorId: "",
        doctorName: "",
        purpose: "",
        date: dayjs().format("YYYY-MM-DD"),
        time: "",
        duration: "30 Minutes",
        consultationType: "In Person",

        patientId: "",
        referringDoctor: "",
        priority: "Normal",
        symptoms: "",
        notes: "",

        paymentType: "Cash",
        visitFee: "800.00",
        gst: "144.00",
        totalAmount: "944.00",
        paymentStatus: "Pending",
        paymentMode: "To be paid at hospital"
    });

    const [searchPatient, setSearchPatient] = useState("");
    const [showPatientDropdown, setShowPatientDropdown] = useState(false);
    const patientDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (patientDropdownRef.current && !patientDropdownRef.current.contains(event.target as Node)) {
                setShowPatientDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [patientsRes, deptsRes] = await Promise.all([
                    patientAPI.list(1, 100),
                    departmentAPI.list(1, 100),
                ]);

                setPatients(patientsRes.data.patients || []);

                let activeDepts = (deptsRes.data.departments || []).filter((d: any) => d.status === "Active");
                setDepartments(activeDepts);
            } catch (err) {
                console.error("Failed to fetch initial data", err);
            }
        };
        fetchInitialData();
    }, []);

    const handleDepartmentChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const deptId = e.target.value;
        const deptName = e.target.options[e.target.selectedIndex].text;
        setSelectedDeptId(deptId);
        setFormData(prev => ({ ...prev, departmentName: deptName, doctorId: "", doctorName: "" }));
        setDoctors([]);

        if (!deptId) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/departments/doctors/list?departmentId=${deptId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setDoctors(data);
            } else {
                setDoctors([]);
            }
        } catch (err) {
            setDoctors([]);
        }
    };

    const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const docId = e.target.value;
        const docName = e.target.options[e.target.selectedIndex].text;
        setFormData(prev => ({ ...prev, doctorId: docId, doctorName: docName }));
    };

    const selectPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        setSearchPatient(`${patient.name} (${patient.uhid || patient.id})`);
        setFormData(prev => ({ ...prev, patientId: patient.id }));
        setShowPatientDropdown(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await appointmentAPI.create({
                doctorId: formData.doctorId,
                patientId: formData.patientId,
                date: formData.date,
                time: formData.time,
                status: "Scheduled",
                department: formData.departmentName,
                visitType: formData.visitType,
                notes: formData.notes + (formData.purpose ? `\nReason: ${formData.purpose}` : ""),
            });
            const appointmentId = response.data.appointment?.id || response.data.id;
            router.push(`/appointments/success?id=${appointmentId}`);
        } catch (err: any) {
            console.error("Failed to create appointment", err);
            alert("Failed to create appointment: " + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchPatient.toLowerCase()) ||
        p.uhid?.toLowerCase().includes(searchPatient.toLowerCase())
    );


    // Calendar grid generator for right sidebar
    const generateWeekDays = () => {
        const start = dayjs().startOf('week').add(1, 'day'); // Monday
        return Array.from({ length: 7 }).map((_, i) => ({
            date: start.add(i, 'day'),
            isCurrent: start.add(i, 'day').format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
        }));
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen p-4 -m-6 h-[calc(100vh-64px)] overflow-hidden flex flex-col gap-4">


            {/* Main Form Area */}
            <div className="flex gap-4 flex-1 overflow-hidden">
                <div className="flex-[3] bg-white rounded shadow-sm border border-gray-100 flex flex-col overflow-hidden">

                    <div className="p-6 border-b border-gray-100 shrink-0">
                        <h1 className="text-lg font-bold text-gray-800">Book New Appointment</h1>
                        <p className="text-xs text-gray-500">Fill in the details below to book a new appointment</p>

                        {/* Stepper */}
                        <div className="flex items-center justify-between max-w-2xl mx-auto mt-6">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</div>
                                <span className="text-xs font-bold text-blue-600">Appointment Details</span>
                            </div>
                            <div className="h-px bg-gray-200 flex-1 mx-4 -mt-5"></div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-6 h-6 rounded-full border border-gray-300 text-gray-400 text-xs flex items-center justify-center font-bold">2</div>
                                <span className="text-xs font-bold text-gray-500">Patient Details</span>
                            </div>
                            <div className="h-px bg-gray-200 flex-1 mx-4 -mt-5"></div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-6 h-6 rounded-full border border-gray-300 text-gray-400 text-xs flex items-center justify-center font-bold">3</div>
                                <span className="text-xs font-bold text-gray-500">Confirm & Book</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                        {/* Appointment Details Grid */}
                        <div className="grid grid-cols-4 gap-6">
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-bold text-gray-700">Visit Type <span className="text-red-500">*</span></label>
                                <select name="visitType" value={formData.visitType} onChange={handleChange} className="text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500">
                                    <option>OPD - Out Patient</option>
                                    <option>Teleconsultation</option>
                                    <option>Follow Up</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-bold text-gray-700">Department <span className="text-red-500">*</span></label>
                                <select value={selectedDeptId} onChange={handleDepartmentChange} className="text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500">
                                    <option value="">Select Department</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">Doctor <span className="text-red-500">*</span> <Info size={10} className="text-gray-400" /></label>
                                <select value={formData.doctorId} onChange={handleDoctorChange} className="text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500">
                                    <option value="">Select Doctor</option>
                                    {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-bold text-gray-700">Purpose of Visit <span className="text-red-500">*</span></label>
                                <select name="purpose" value={formData.purpose} onChange={handleChange} className="text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500">
                                    <option value="">Select Purpose</option>
                                    <option>Chest Pain</option>
                                    <option>Routine Checkup</option>
                                    <option>Follow up</option>
                                </select>
                            </div>
                        </div>

                        {/* Date & Time Grid */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-800 mb-3">Appointment Date & Time</h3>
                            <div className="grid grid-cols-4 gap-6">
                                <div className="flex flex-col gap-1 relative">
                                    <label className="text-[11px] font-bold text-gray-700">Appointment Date <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full text-xs pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-gray-700">Time Slot <span className="text-red-500">*</span></label>
                                    <select name="time" value={formData.time} onChange={handleChange} className="text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500">
                                        <option value="">Select Time</option>
                                        <option>09:30 AM - 10:00 AM</option>
                                        <option>10:00 AM - 10:30 AM</option>
                                        <option>10:30 AM - 11:00 AM</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-gray-700">Duration</label>
                                    <select name="duration" value={formData.duration} onChange={handleChange} className="text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500">
                                        <option>30 Minutes</option>
                                        <option>15 Minutes</option>
                                        <option>45 Minutes</option>
                                        <option>1 Hour</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-gray-700">Consultation Type <span className="text-red-500">*</span></label>
                                    <select name="consultationType" value={formData.consultationType} onChange={handleChange} className="text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500">
                                        <option>In Person</option>
                                        <option>Video Call</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Patient Details */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-800 mb-3">Patient Details</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-1 relative" ref={patientDropdownRef}>
                                    <label className="text-[11px] font-bold text-gray-700">Patient <span className="text-red-500">*</span></label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                value={searchPatient}
                                                onFocus={() => setShowPatientDropdown(true)}
                                                onChange={(e) => { setSearchPatient(e.target.value); setShowPatientDropdown(true); }}
                                                placeholder="Search patient..."
                                                className="w-full text-xs pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                            {showPatientDropdown && (
                                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto z-50">
                                                    {filteredPatients.length > 0 ? (
                                                        filteredPatients.map(p => (
                                                            <div key={p.id} onClick={() => selectPatient(p)} className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-xs border-b border-gray-50">
                                                                <div className="font-semibold text-gray-800">{p.name}</div>
                                                                <div className="text-[10px] text-gray-500">UHID: {p.uhid || p.id} | Ph: {p.phone}</div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="p-3 text-xs text-gray-500 text-center">No patients found.</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <button type="button" className="shrink-0 flex items-center gap-1 px-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-100">
                                            <Plus size={14} /> New Patient
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-gray-700">Age / Gender</label>
                                    <input type="text" value={selectedPatient ? `${selectedPatient.age} Y / ${selectedPatient.gender}` : ''} readOnly className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
                                    <input type="text" value={selectedPatient ? selectedPatient.phone : ''} readOnly className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-gray-700">Email</label>
                                    <input type="email" value={selectedPatient ? selectedPatient.email : ''} readOnly className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" />
                                </div>
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-800 mb-3">Additional Details</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[11px] font-bold text-gray-700">Referring Doctor</label>
                                        <select name="referringDoctor" value={formData.referringDoctor} onChange={handleChange} className="text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500">
                                            <option value="">Select Doctor</option>
                                            <option>Dr. Amit Verma</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[11px] font-bold text-gray-700">Priority</label>
                                        <select name="priority" value={formData.priority} onChange={handleChange} className="text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500">
                                            <option>Normal</option>
                                            <option>Urgent</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[11px] font-bold text-gray-700">Symptoms (Optional)</label>
                                        <textarea name="symptoms" value={formData.symptoms} onChange={handleChange} rows={2} className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="e.g. Patient is experiencing..."></textarea>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[11px] font-bold text-gray-700">Notes (Optional)</label>
                                        <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Any additional notes..."></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visit & Payment Details */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-800 mb-3">Visit & Payment Details</h3>
                            <div className="grid grid-cols-4 gap-6">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-gray-700">Payment Type <span className="text-red-500">*</span></label>
                                    <select name="paymentType" value={formData.paymentType} onChange={handleChange} className="text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500">
                                        <option>Cash</option>
                                        <option>Insurance</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-gray-700">Visit Fee (₹)</label>
                                    <input type="text" name="visitFee" value={formData.visitFee} onChange={handleChange} className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-gray-700">GST (₹)</label>
                                    <input type="text" name="gst" value={formData.gst} onChange={handleChange} className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-gray-700">Total Amount (₹)</label>
                                    <input type="text" name="totalAmount" value={formData.totalAmount} onChange={handleChange} className="w-full text-xs px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-lg font-bold text-blue-700 focus:outline-none" readOnly />
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-6 mt-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-gray-700">Payment Status</label>
                                    <input type="text" value={formData.paymentStatus} readOnly className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-gray-700">Payment Mode</label>
                                    <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} className="text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500">
                                        <option>To be paid at hospital</option>
                                        <option>Online</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                    </form>

                    {/* Bottom Action Footer */}
                    <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                        <span className="text-[10px] text-gray-400">* Required Fields</span>
                        <div className="flex items-center gap-3">
                            <button className="px-4 py-2 border border-gray-300 bg-white rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button className="px-4 py-2 border border-blue-600 text-blue-600 bg-white rounded-lg text-xs font-bold hover:bg-blue-50">Save & Continue</button>
                            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 shadow-sm flex items-center gap-2">
                                {loading && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                Confirm & Book Appointment
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="flex-[1] min-w-[320px] flex flex-col gap-4 overflow-y-auto custom-scrollbar">

                    {/* Summary Card */}
                    <div className="bg-white rounded shadow-sm border border-gray-100 p-5">
                        <h3 className="text-xs font-bold text-gray-800 flex items-center gap-2 mb-4">
                            <User size={14} className="text-gray-500" /> Appointment Summary
                        </h3>
                        <div className="space-y-3 text-[11px]">
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500">Patient Name</span>
                                <span className="font-semibold text-gray-800">{selectedPatient ? selectedPatient.name : '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500">UHID</span>
                                <span className="font-semibold text-gray-800">{selectedPatient ? selectedPatient.uhid || selectedPatient.id : '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500">Mobile</span>
                                <span className="font-semibold text-gray-800">{selectedPatient ? selectedPatient.phone : '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500">Visit Type</span>
                                <span className="font-semibold text-gray-800">{formData.visitType || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500">Department</span>
                                <span className="font-semibold text-gray-800">{formData.departmentName || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500">Doctor</span>
                                <span className="font-semibold text-gray-800">{formData.doctorName || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500">Date</span>
                                <span className="font-semibold text-gray-800">{formData.date ? dayjs(formData.date).format('DD MMM YYYY (ddd)') : '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500">Time</span>
                                <span className="font-semibold text-gray-800">{formData.time.split(' - ')[0] || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500">Duration</span>
                                <span className="font-semibold text-gray-800">{formData.duration || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500">Consultation Type</span>
                                <span className="font-semibold text-gray-800">{formData.consultationType || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500">Purpose</span>
                                <span className="font-semibold text-gray-800">{formData.purpose || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500">Visit Fee</span>
                                <span className="font-semibold text-gray-800">₹ {formData.visitFee}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500">GST (18%)</span>
                                <span className="font-semibold text-gray-800">₹ {formData.gst}</span>
                            </div>
                            <div className="flex justify-between pt-1">
                                <span className="font-bold text-gray-800 text-xs">Total Amount</span>
                                <span className="font-bold text-blue-700 text-xs">₹ {formData.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Doctor Availability */}
                    <div className="bg-white rounded shadow-sm border border-gray-100 p-5">
                        <h3 className="text-xs font-bold text-gray-800 mb-1">Doctor Availability</h3>
                        {formData.doctorName ? (
                            <>
                                <p className="text-[10px] text-gray-500 mb-4">{formData.doctorName} - {formData.departmentName}</p>

                                <div className="flex justify-between items-center mb-4">
                                    <button className="p-1 hover:bg-gray-50 rounded"><ChevronLeft size={14} className="text-gray-400" /></button>
                                    <div className="flex gap-2">
                                        {generateWeekDays().map((day, i) => (
                                            <div key={i} className={`flex flex-col items-center justify-center p-1.5 rounded w-8 ${day.isCurrent ? 'bg-blue-50 border border-blue-200' : ''}`}>
                                                <span className={`text-[9px] ${day.isCurrent ? 'text-blue-600 font-bold' : 'text-gray-400 font-medium'}`}>{day.date.format('ddd')}</span>
                                                <span className={`text-xs font-bold ${day.isCurrent ? 'text-blue-700' : 'text-gray-800'}`}>{day.date.format('DD')}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="p-1 hover:bg-gray-50 rounded"><ChevronRight size={14} className="text-gray-400" /></button>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    {['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'].map((slot, i) => (
                                        <button
                                            key={i}
                                            className={`py-1.5 text-[10px] font-semibold border rounded ${slot === formData.time.split(' - ')[0] ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setFormData(prev => ({ ...prev, time: `${slot} - ` }));
                                            }}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                                <div className="text-right mt-3">
                                    <button className="text-[10px] font-bold text-blue-600 hover:underline">View Full Availability</button>
                                </div>
                            </>
                        ) : (
                            <div className="py-8 text-center flex flex-col items-center gap-2 text-gray-400">
                                <Calendar size={24} className="opacity-50" />
                                <span className="text-[11px]">Select a doctor to view availability</span>
                            </div>
                        )}
                    </div>

                    {/* Patient Notes */}
                    <div className="bg-white rounded shadow-sm border border-gray-100 p-5">
                        <h3 className="text-xs font-bold text-gray-800 flex items-center gap-2 mb-4">
                            <FileText size={14} className="text-gray-500" /> Patient Notes
                        </h3>
                        <div className="flex flex-col items-center justify-center py-6 text-gray-400 gap-2 border border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                            <AlertCircle size={16} className="opacity-50" />
                            <span className="text-[10px]">No previous appointments found.</span>
                        </div>
                    </div>
                </div>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
            `}} />
        </div>
    );
}
