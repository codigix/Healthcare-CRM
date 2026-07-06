"use client";

import { useState, useEffect, useRef } from "react";
import { appointmentAPI, departmentAPI } from "@/lib/api";
import { Search, Building2, User, UserCheck, Calendar, Clock, FileText } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Appointment {
    id?: string;
    doctorId: string;
    patientId: string;
    date: string;
    time: string;
    status: string;
    notes?: string;
    department?: string;
    visitType?: string;
    doctor?: { id: string; name: string };
    patient?: { id: string; name: string };
}

interface Doctor {
    id: string;
    name: string;
    specialization?: string;
    departmentId?: string;
}

interface Patient {
    id: string;
    name: string;
}

interface Department {
    id: string;
    name: string;
    status: string;
}

interface AppointmentFormProps {
    appointment?: Appointment | null;
    doctors: Doctor[]; // Fallback list
    patients: Patient[];
    onSuccess: () => void;
}

export default function AppointmentForm({
    appointment,
    doctors: initialDoctors,
    patients,
    onSuccess,
}: AppointmentFormProps) {
    const [formData, setFormData] = useState<Appointment>({
        doctorId: "",
        patientId: "",
        date: "",
        time: "",
        status: "Scheduled",
        notes: "",
        department: "",
        visitType: "",
    });

    const [departments, setDepartments] = useState<Department[]>([]);
    const [departmentDoctors, setDepartmentDoctors] = useState<Doctor[]>([]);
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

    // Close search dropdown on outside clicks
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

    // Fetch Active Departments on mount
    useEffect(() => {
        const fetchActiveDepartments = async () => {
            try {
                const deptsRes = await departmentAPI.list(1, 100);
                const activeDepts = (deptsRes.data.departments || []).filter(
                    (d: any) => d.status === "Active"
                );
                setDepartments(activeDepts);
            } catch (err) {
                console.error("Failed to load active departments:", err);
            }
        };
        fetchActiveDepartments();
    }, []);

    // Sync state when editing an appointment
    useEffect(() => {
        const initializeForm = async () => {
            if (appointment) {
                const formattedDate = appointment.date.split("T")[0];
                setFormData({
                    ...appointment,
                    doctorId: appointment.doctor?.id || "",
                    patientId: appointment.patient?.id || "",
                    date: formattedDate,
                });
                setSearchPatient(appointment.patient?.name || "");
                setSearchDoctor(appointment.doctor?.name || "");
                setSearchDept(appointment.department || "");

                // Find and load department doctors
                if (departments.length > 0 && appointment.department) {
                    const matchedDept = departments.find((d) => d.name === appointment.department);
                    if (matchedDept) {
                        setSelectedDeptId(matchedDept.id);
                        try {
                            const token = localStorage.getItem("token");
                            const res = await fetch(`${API_URL}/departments/doctors/list?departmentId=${matchedDept.id}`, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });
                            if (res.ok) {
                                const data = await res.json();
                                setDepartmentDoctors(data);
                            }
                        } catch (err) {
                            console.error("Failed to load department doctors on init:", err);
                        }
                    }
                }
            } else {
                setFormData({
                    doctorId: "",
                    patientId: "",
                    date: "",
                    time: "",
                    status: "Scheduled",
                    notes: "",
                    department: "",
                    visitType: "",
                });
                setSearchPatient("");
                setSearchDoctor("");
                setSearchDept("");
                setSelectedDeptId("");
                setDepartmentDoctors([]);
            }
        };

        initializeForm();
    }, [appointment, departments]);

    const handleSelectDepartment = async (dept: Department) => {
        setSelectedDeptId(dept.id);
        setSearchDept(dept.name);
        setShowDeptDropdown(false);

        // Reset Doctor values
        setFormData((prev) => ({
            ...prev,
            doctorId: "",
            department: dept.name,
        }));
        setSearchDoctor("");
        setDepartmentDoctors([]);

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
                setDepartmentDoctors(data);
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
            const payload = {
                doctorId: formData.doctorId,
                patientId: formData.patientId,
                date: formData.date,
                time: formData.time,
                status: appointment?.id ? formData.status : "Scheduled", // Auto-set scheduled for new bookings
                department: searchDept,
                visitType: formData.visitType,
                notes: formData.notes,
            };

            if (appointment?.id) {
                await appointmentAPI.update(appointment.id, payload);
            } else {
                await appointmentAPI.create(payload);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to save appointment");
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

    const filteredDoctors = departmentDoctors.filter((d) =>
        d.name.toLowerCase().includes(searchDoctor.toLowerCase())
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            {/* 1. Select Patient */}
            <div className="relative" ref={patientDropdownRef}>
                <label className="block text-xs font-medium text-gray-300 mb-2 flex items-center gap-1.5">
                    <User size={16} className="text-emerald-500" />
                    Patient <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={15}
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
                        style={{ paddingLeft: "2.5rem" }}
                        required
                    />
                </div>

                {showPatientDropdown && (
                    <div className="absolute z-50 w-full left-0 mt-1 bg-dark-secondary border border-dark-tertiary rounded shadow-2xl max-h-48 overflow-y-auto">
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
                                    className={`p-2.5 hover:bg-dark-tertiary cursor-pointer border-b border-dark-tertiary/20 last:border-0 transition-colors flex items-center justify-between text-sm ${formData.patientId === patient.id ? "bg-emerald-500/10 text-emerald-400" : "text-gray-300"
                                        }`}
                                >
                                    <span className="font-medium">{patient.name}</span>
                                    {formData.patientId === patient.id && (
                                        <div className="text-emerald-500  text-xs">Selected</div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="p-3 text-xs text-gray-400 text-center">
                                No patients found
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 2. Select Department */}
            <div className="relative" ref={deptDropdownRef}>
                <label className="block text-xs font-medium text-gray-300 mb-2 flex items-center gap-1.5">
                    <Building2 size={16} className="text-emerald-500" />
                    Clinical Department <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={15}
                    />
                    <input
                        type="text"
                        placeholder="Search specialties (e.g. Cardiology)..."
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
                        style={{ paddingLeft: "2.5rem" }}
                        required
                    />
                </div>

                {showDeptDropdown && (
                    <div className="absolute z-50 w-full left-0 mt-1 bg-dark-secondary border border-dark-tertiary rounded shadow-2xl max-h-48 overflow-y-auto">
                        {filteredDepartments.length > 0 ? (
                            filteredDepartments.map((dept) => (
                                <div
                                    key={dept.id}
                                    onClick={() => handleSelectDepartment(dept)}
                                    className={`p-2.5 hover:bg-dark-tertiary cursor-pointer border-b border-dark-tertiary/20 last:border-0 transition-colors flex items-center justify-between text-sm ${selectedDeptId === dept.id ? "bg-emerald-500/10 text-emerald-400" : "text-gray-300"
                                        }`}
                                >
                                    <span className="font-semibold">{dept.name}</span>
                                    {selectedDeptId === dept.id && (
                                        <div className="text-emerald-500  text-xs">Selected</div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="p-3 text-xs text-gray-400 text-center">
                                No active clinical departments
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 3. Select Doctor */}
            <div className="relative" ref={doctorDropdownRef}>
                <label className="block text-xs font-medium text-gray-300 mb-2 flex items-center gap-1.5">
                    <UserCheck size={16} className="text-emerald-500" />
                    Assigned Doctor <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={15}
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
                        style={{ paddingLeft: "2.5rem" }}
                        disabled={!selectedDeptId}
                        required
                    />
                </div>

                {showDoctorDropdown && selectedDeptId && (
                    <div className="absolute z-50 w-full left-0 mt-1 bg-dark-secondary border border-dark-tertiary rounded shadow-2xl max-h-48 overflow-y-auto">
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
                                    className={`p-2.5 hover:bg-dark-tertiary cursor-pointer border-b border-dark-tertiary/20 last:border-0 transition-colors flex items-center justify-between text-sm ${formData.doctorId === doctor.id ? "bg-emerald-500/10 text-emerald-400" : "text-gray-300"
                                        }`}
                                >
                                    <div>
                                        <span className="font-semibold">Dr. {doctor.name}</span>
                                        {doctor.specialization && (
                                            <span className="block text-[10px] text-gray-400 mt-0.5">{doctor.specialization}</span>
                                        )}
                                    </div>
                                    {formData.doctorId === doctor.id && (
                                        <div className="text-emerald-500  text-xs">Selected</div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="p-3 text-xs text-gray-400 text-center">
                                No doctors in this specialty
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2">
                        Appointment Date
                    </label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="input-field w-full"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2">
                        Time Slot
                    </label>
                    <select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="input-field w-full"
                        required
                    >
                        <option value="">Select time</option>
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

            {/* Visit Type Dropdown */}
            <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                    Visit Type <span className="text-red-500">*</span>
                </label>
                <select
                    name="visitType"
                    value={formData.visitType}
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

            {/* Status selection: ONLY show in EDITING mode! */}
            {appointment?.id && (
                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2">
                        Status
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="input-field w-full"
                        required
                    >
                        <option value="Scheduled">Scheduled</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            )}

            {/* Notes / Reason */}
            <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                    Notes
                </label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="input-field w-full min-h-[70px]"
                    placeholder="Add clinical or staff notes..."
                    rows={3}
                />
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm font-medium">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading || !formData.patientId || !formData.doctorId}
                className="btn-primary w-full py-2.5 rounded font-medium transition-all shadow-md hover:shadow-emerald-500/10 flex items-center justify-center gap-2"
            >
                {loading ? "Saving..." : appointment?.id ? "Save Changes" : "Create Appointment"}
            </button>
        </form>
    );
}
