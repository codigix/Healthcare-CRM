"use client";

import { useState } from "react";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { patientAPI } from "@/lib/api";

import { useAuthStore } from "@/lib/store";
import { useEffect } from "react";

type TabType = "personal" | "medical";

export default function AddPatientPage() {
 const router = useRouter();
 const { user } = useAuthStore();

 useEffect(() => {
 if (user) {
 const role = user.role?.toLowerCase();
 const dept = user.department?.toLowerCase();
 if (role === "doctor" || role === "laboratory" || dept === "doctor" || dept === "laboratory") {
 router.replace("/patients");
 }
 }
 }, [user, router]);

 const [activeTab, setActiveTab] = useState<TabType>("personal");
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");

 const userRole = user?.role?.toLowerCase();
 const userDept = user?.department?.toLowerCase();
 if (userRole === "doctor" || userRole === "laboratory" || userDept === "doctor" || userDept === "laboratory") {
 return null;
 }

 const [formData, setFormData] = useState({
 firstName: "",
 lastName: "",
 dateOfBirth: "",
 gender: "",
 email: "",
 phone: "",
 address: "",
 history: "",
 bloodGroup: "",
 status: "Active",
 });

 const handleChange = (
 e: React.ChangeEvent<
 HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
 >
 ) => {
 const { name, value } = e.target;
 setFormData((prev) => ({ ...prev, [name]: value }));
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);
 setError("");

 try {
 if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.dateOfBirth || !formData.gender) {
 setError("Please fill in all required fields (marked with *)");
 setLoading(false);
 return;
 }

 const patientData = {
 name: `${formData.firstName} ${formData.lastName}`.trim(),
 email: formData.email,
 phone: formData.phone,
 dob: formData.dateOfBirth,
 gender: formData.gender,
 address: formData.address || "",
 history: formData.history || null,
 bloodGroup: formData.bloodGroup || null,
 status: formData.status || "Active",
 };

 console.log('Creating patient with data:', patientData);
 await patientAPI.create(patientData);
 router.push("/patients");
 } catch (err: any) {
 console.error('Error creating patient:', err);
 setError(err.response?.data?.error || "Failed to add patient");
 } finally {
 setLoading(false);
 }
 };

 const tabs = [
 { id: "personal" as TabType, label: "Personal Information" },
 { id: "medical" as TabType, label: "Medical History" },
 ];

 return (
 <>
 <div className="space-y-6">
 <div className="flex items-center gap-4">
 <Link
 href="/patients"
 className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors"
 >
 <ArrowLeft size={20} />
 </Link>
 <div>
 <h1 className="text-3xl font-bold mb-2">Add Patient</h1>
 <p className="text-gray-400">Register a new patient in your clinic.</p>
 </div>
 </div>

 <div className="card">
 <form onSubmit={handleSubmit} className="space-y-8">
 {/* Section 1: Personal Information */}
 <div className="space-y-6">
 <div>
 <h3 className="text-lg font-semibold text-emerald-400 mb-1">Personal Information</h3>
 <p className="text-gray-400 text-xs">Enter the patient's basic details.</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">
 First Name *
 </label>
 <input
 type="text"
 name="firstName"
 value={formData.firstName}
 onChange={handleChange}
 className="input-field w-full"
 placeholder="Enter first name"
 required
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">
 Last Name *
 </label>
 <input
 type="text"
 name="lastName"
 value={formData.lastName}
 onChange={handleChange}
 className="input-field w-full"
 placeholder="Enter last name"
 required
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">
 Date of Birth *
 </label>
 <input
 type="date"
 name="dateOfBirth"
 value={formData.dateOfBirth}
 onChange={handleChange}
 className="input-field w-full"
 required
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">
 Gender *
 </label>
 <select
 name="gender"
 value={formData.gender}
 onChange={handleChange}
 className="input-field w-full"
 required
 >
 <option value="">Select gender</option>
 <option value="Male">Male</option>
 <option value="Female">Female</option>
 <option value="Other">Other</option>
 </select>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">
 Blood Group
 </label>
 <select
 name="bloodGroup"
 value={formData.bloodGroup}
 onChange={handleChange}
 className="input-field w-full"
 >
 <option value="">Select blood group</option>
 <option value="A+">A+</option>
 <option value="A-">A-</option>
 <option value="B+">B+</option>
 <option value="B-">B-</option>
 <option value="AB+">AB+</option>
 <option value="AB-">AB-</option>
 <option value="O+">O+</option>
 <option value="O-">O-</option>
 </select>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">
 Status
 </label>
 <select
 name="status"
 value={formData.status}
 onChange={handleChange}
 className="input-field w-full"
 >
 <option value="Active">Active</option>
 <option value="Inactive">Inactive</option>
 </select>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">
 Email *
 </label>
 <input
 type="email"
 name="email"
 value={formData.email}
 onChange={handleChange}
 className="input-field w-full"
 placeholder="Enter email address"
 required
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">
 Phone Number *
 </label>
 <input
 type="tel"
 name="phone"
 value={formData.phone}
 onChange={handleChange}
 className="input-field w-full"
 placeholder="Enter phone number"
 required
 />
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">
 Address (Optional)
 </label>
 <textarea
 name="address"
 value={formData.address}
 onChange={handleChange}
 className="input-field w-full"
 placeholder="Enter address"
 rows={3}
 />
 </div>
 </div>

 <hr className="border-dark-tertiary" />

 {/* Section 2: Medical History */}
 <div className="space-y-6">
 <div>
 <h3 className="text-lg font-semibold text-emerald-400 mb-1">Medical Background</h3>
 <p className="text-gray-400 text-xs">Enter the patient's historical clinical details.</p>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">
 Medical History (Optional)
 </label>
 <textarea
 name="history"
 value={formData.history}
 onChange={handleChange}
 className="input-field w-full"
 placeholder="Enter medical history, past conditions, surgeries, allergies, etc."
 rows={5}
 />
 <p className="text-xs text-gray-400 mt-2">
 Include any relevant medical information such as past illnesses, surgeries, allergies, medications, etc.
 </p>
 </div>
 </div>

 {error && (
 <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300 text-sm mt-6">
 {error}
 </div>
 )}

 <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-dark-tertiary">
 <Link href="/patients" className="btn-secondary">
 Cancel
 </Link>
 <button type="submit" disabled={loading} className="btn-primary">
 {loading ? "Saving..." : "Save Patient"}
 </button>
 </div>
 </form>
 </div>
 </div>
 </>
 );
}
