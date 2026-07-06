"use client";

import { useState, useEffect, useRef } from "react";
import {
    ArrowLeft,
    Building2,
    User,
    FileText,
    Users,
    Search,
    X,
} from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Doctor {
    id: string;
    name: string;
    specialization: string;
    email: string;
}

export default function AddDepartmentPage() {
    const [formData, setFormData] = useState({
        departmentName: "",
        headOfDepartment: "",
        status: "Active",
        description: "",
        assignedDoctors: [] as string[],
    });

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Search selector state
    const [doctorSearch, setDoctorSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const response = await fetch(`${API_URL}/departments/doctors/list`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch doctors");
                const data = await response.json();
                setDoctors(data);
                setError("");
            } catch (err) {
                console.error("Error fetching doctors:", err);
                setError("Failed to load doctors");
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    // Close search dropdown on outside clicks
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const selectDoctor = (docId: string) => {
        setFormData((prev) => ({
            ...prev,
            assignedDoctors: prev.assignedDoctors.includes(docId)
                ? prev.assignedDoctors
                : [...prev.assignedDoctors, docId],
        }));
        setDoctorSearch("");
        setShowDropdown(false);
    };

    const removeDoctor = (docId: string) => {
        setFormData((prev) => ({
            ...prev,
            assignedDoctors: prev.assignedDoctors.filter((id) => id !== docId),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.departmentName,
                head: formData.headOfDepartment,
                location: "Main Block",
                status: formData.status,
                description: formData.description,
                assignedDoctors: formData.assignedDoctors,
            };

            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/departments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create department");
            }

            window.location.href = "/departments";
        } catch (err: any) {
            console.error("Failed to create department:", err);
            setError(err.message || "Failed to create department");
        }
    };

    // Filter dropdown doctors based on search & exclude already assigned
    const availableDropdownDoctors = doctors.filter((doc) => {
        const matchesSearch =
            doc.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
            doc.specialization.toLowerCase().includes(doctorSearch.toLowerCase());
        const isAlreadyAssigned = formData.assignedDoctors.includes(doc.id);
        return matchesSearch && !isAlreadyAssigned;
    });

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/departments"
                        className="p-2 hover:bg-dark-tertiary rounded transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl  mb-2 text-white">Add Department</h1>
                        <p className="text-gray-400">
                            Create a new clinical department and assign medical staff
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded p-4 text-red-400 font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="card bg-dark-secondary border border-dark-tertiary p-6 rounded">
                        <h2 className="text-xl font-semibold mb-2 text-white">
                            Clinical Department Information
                        </h2>
                        <p className="text-gray-400 text-sm mb-6">
                            Enter the central details for the hospital department
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-2">
                                    Department Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Building2
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                    <input
                                        type="text"
                                        name="departmentName"
                                        value={formData.departmentName}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Cardiology"
                                        className="input-field w-full"
                                        style={{ paddingLeft: "2.75rem" }}
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    The clinical name of the department (e.g., Pediatrics, Orthopedics)
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-2">
                                    Department Head <span className="text-gray-500">(Optional)</span>
                                </label>
                                <div className="relative">
                                    <User
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                    <select
                                        name="headOfDepartment"
                                        value={formData.headOfDepartment}
                                        onChange={handleInputChange}
                                        className="input-field w-full"
                                        style={{ paddingLeft: "2.75rem" }}
                                        disabled={loading}
                                    >
                                        <option value="">
                                            {loading ? "Loading doctors..." : "Select Department Head (Optional)"}
                                        </option>
                                        {doctors.map((doctor) => (
                                            <option key={doctor.id} value={doctor.name}>
                                                {doctor.name} - {doctor.specialization}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    The clinical head leading this department
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-2">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="input-field w-full"
                                    required
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    Current operational status of this clinic department
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-xs font-medium text-gray-300 mb-2">
                                Description
                            </label>
                            <div className="relative">
                                <FileText
                                    className="absolute left-3 top-3 text-gray-400"
                                    size={20}
                                />
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Provide a detailed description of the department's medical specialty, services, and core clinical functions..."
                                    className="input-field min-h-[120px] w-full"
                                    style={{ paddingLeft: "2.75rem", paddingTop: "0.75rem" }}
                                    rows={4}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                A brief description of this department's clinical scope
                            </p>
                        </div>
                    </div>

                    <div className="card bg-dark-secondary border border-dark-tertiary p-6 rounded">
                        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-white">
                            <Users size={24} className="text-emerald-500" />
                            Assign Doctors
                        </h2>
                        <p className="text-gray-400 text-sm mb-6">
                            Select medical doctors to assign to this clinical department.
                        </p>

                        <div className="space-y-6">
                            {/* Search input field */}
                            <div ref={containerRef} className="relative max-w-xl">
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                    Search & Assign Doctor
                                </label>
                                <div className="relative">
                                    <Search
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={15}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search doctor by name or specialty..."
                                        value={doctorSearch}
                                        onChange={(e) => {
                                            setDoctorSearch(e.target.value);
                                            setShowDropdown(true);
                                        }}
                                        onFocus={() => setShowDropdown(true)}
                                        className="input-field w-full"
                                        style={{ paddingLeft: "2.75rem" }}
                                        disabled={loading}
                                    />
                                </div>

                                {/* Dropdown Options */}
                                {showDropdown && (
                                    <div className="absolute left-0 right-0 mt-1 max-h-[240px] overflow-y-auto bg-dark-secondary border border-dark-tertiary rounded shadow-2xl z-20">
                                        {loading ? (
                                            <div className="p-3 text-center text-sm text-gray-500">
                                                Loading clinical doctors...
                                            </div>
                                        ) : availableDropdownDoctors.length === 0 ? (
                                            <div className="p-3 text-center text-sm text-gray-500">
                                                {doctorSearch ? "No matching available doctors" : "All registered doctors already assigned"}
                                            </div>
                                        ) : (
                                            availableDropdownDoctors.map((doctor) => (
                                                <div
                                                    key={doctor.id}
                                                    onClick={() => selectDoctor(doctor.id)}
                                                    className="p-3 hover:bg-emerald-500/10 cursor-pointer transition-colors border-b border-dark-tertiary/20 last:border-0 text-gray-300 flex justify-between items-center my-3 my-3 text-sm"
                                                >
                                                    <div>
                                                        <span className="font-semibold text-white">{doctor.name}</span>
                                                        <span className="text-gray-400 text-xs ml-2">({doctor.specialization})</span>
                                                    </div>
                                                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                                                        + Assign Specialist
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* List of assigned doctors */}
                            <div>
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                    Assigned Specialists ({formData.assignedDoctors.length})
                                </h3>
                                {formData.assignedDoctors.length === 0 ? (
                                    <div className="text-center py-8 border-2 border-dashed border-dark-tertiary rounded text-gray-500 text-sm">
                                        No doctors assigned to this department yet. Search and select above to assign specialists.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {doctors
                                            .filter((doc) => formData.assignedDoctors.includes(doc.id))
                                            .map((doc) => (
                                                <div
                                                    key={doc.id}
                                                    className="flex items-center justify-between p-3.5 bg-dark-tertiary/30 border border-emerald-500/20 hover:border-emerald-500/40 rounded transition-all group"
                                                >
                                                    <div className="min-w-0">
                                                        <div className="font-semibold text-white text-sm truncate">{doc.name}</div>
                                                        <div className="text-xs text-gray-400 truncate">{doc.specialization}</div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeDoctor(doc.id)}
                                                        className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all flex items-center justify-center"
                                                        title="Remove assignment"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-end">
                        <Link href="/departments" className="btn-secondary px-6 py-2.5 rounded font-medium transition-all">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="btn-primary px-6 py-2.5 rounded font-medium transition-all shadow-lg hover:shadow-emerald-500/15"
                        >
                            Create Department
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
