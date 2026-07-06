"use client";

import { useState, useEffect, useRef } from "react";

import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { recordsAPI, doctorAPI } from "@/lib/api";

export default function AddDeathRecordPage() {
 const router = useRouter();
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");

 // Doctor Search State
 const [doctorSearchTerm, setDoctorSearchTerm] = useState("");
 const [doctorsList, setDoctorsList] = useState<any[]>([]);
 const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
 const [searchingDoctors, setSearchingDoctors] = useState(false);
 const doctorDropdownRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 const handleClickOutside = (event: MouseEvent) => {
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

 const selectDoctor = (doctor: any) => {
 setFormData((prev) => ({
 ...prev,
 attendingDoctor: doctor.name,
 }));
 setDoctorSearchTerm(doctor.name);
 setShowDoctorDropdown(false);
 };

 const [formData, setFormData] = useState({
 name: "",
 age: "",
 dateOfDeath: "",
 causeOfDeath: "",
 status: "Pending",
 department: "",
 attendingDoctor: "",
 });

 const handleChange = (
 e: React.ChangeEvent<
 HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
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
 const recordData = {
 type: "death",
 patientName: formData.name,
 date: formData.dateOfDeath,
 details: JSON.stringify({
 name: formData.name,
 age: parseInt(formData.age),
 dateOfDeath: formData.dateOfDeath,
 causeOfDeath: formData.causeOfDeath,
 department: formData.department,
 attendingDoctor: formData.attendingDoctor || doctorSearchTerm,
 }),
 status: formData.status,
 };

 await recordsAPI.create(recordData);
 router.push("/records/death");
 } catch (err: any) {
 setError(err.response?.data?.error || "Failed to add death record");
 } finally {
 setLoading(false);
 }
 };

 return (
 <>
 <div className="space-y-6">
 <div className="flex items-center gap-4">
 <Link
 href="/records/death"
 className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors"
 >
 <ArrowLeft size={20} />
 </Link>
 <div>
 <h1 className="text-3xl font-bold mb-2">Add Death Record</h1>
 <p className="text-gray-400">
 Register a new death record in the system.
 </p>
 </div>
 </div>

 <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
 <form onSubmit={handleSubmit} className="space-y-6">
 {error && (
 <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
 {error}
 </div>
 )}

 <div>
 <h3 className="text-lg font-semibold mb-4">
 Deceased Information
 </h3>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <label className="block text-mdfont-medium text-gray-300 mb-2">
 Name *
 </label>
 <input
 type="text"
 name="name"
 value={formData.name}
 onChange={handleChange}
 className="input-field w-full"
 placeholder="Enter name"
 required
 />
 </div>

 <div>
 <label className="block text-mdfont-medium text-gray-300 mb-2">
 Age *
 </label>
 <input
 type="number"
 name="age"
 value={formData.age}
 onChange={handleChange}
 className="input-field w-full"
 placeholder="Enter age"
 required
 />
 </div>

 <div>
 <label className="block text-mdfont-medium text-gray-300 mb-2">
 Date of Death *
 </label>
 <input
 type="date"
 name="dateOfDeath"
 value={formData.dateOfDeath}
 onChange={handleChange}
 className="input-field w-full"
 required
 />
 </div>

 <div>
 <label className="block text-mdfont-medium text-gray-300 mb-2">
 Department *
 </label>
 <input
 type="text"
 name="department"
 value={formData.department}
 onChange={handleChange}
 className="input-field w-full"
 placeholder="Enter department"
 required
 />
 </div>
 </div>
 </div>

 <div>
 <h3 className="text-lg font-semibold mb-4">
 Medical Information
 </h3>
 <div className="space-y-6">
 <div>
 <label className="block text-mdfont-medium text-gray-300 mb-2">
 Cause of Death *
 </label>
 <textarea
 name="causeOfDeath"
 value={formData.causeOfDeath}
 onChange={handleChange}
 className="input-field w-full"
 placeholder="Enter cause of death"
 rows={4}
 required
 />
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="relative" ref={doctorDropdownRef}>
 <label className="block text-mdfont-medium text-gray-300 mb-2">
 Attending Doctor *
 </label>
 <div className="relative">
 <Search
 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
 size={18}
 />
 <input
 type="text"
 value={doctorSearchTerm}
 onChange={(e) => {
 setDoctorSearchTerm(e.target.value);
 setShowDoctorDropdown(true);
 if (formData.attendingDoctor) {
 setFormData((prev) => ({
 ...prev,
 attendingDoctor: "",
 }));
 }
 }}
 onFocus={() => setShowDoctorDropdown(true)}
 placeholder="Search doctor by name..."
 className="w-full pl-10 pr-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
 required
 />
 </div>
 {showDoctorDropdown && (
 <div className="absolute z-10 w-full mt-1 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-lg max-h-60 overflow-y-auto">
 {searchingDoctors ? (
 <div className="p-3 text-sm text-gray-400 text-center">
 Searching...
 </div>
 ) : doctorsList.length > 0 ? (
 doctorsList.map((doctor: any) => (
 <div
 key={doctor.id}
 onClick={() => selectDoctor(doctor)}
 className="px-4 py-3 hover:bg-dark-tertiary cursor-pointer border-b border-dark-tertiary last:border-0"
 >
 <div className="font-medium text-white">
 {doctor.name}
 </div>
 {doctor.specialization && (
 <div className="text-xs text-gray-400 mt-1">
 {doctor.specialization}
 </div>
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

 <div>
 <label className="block text-mdfont-medium text-gray-300 mb-2">
 Status *
 </label>
 <select
 name="status"
 value={formData.status}
 onChange={handleChange}
 className="input-field w-full"
 required
 >
 <option value="Pending">Pending</option>
 <option value="Verified">Verified</option>
 <option value="Under Review">Under Review</option>
 </select>
 </div>
 </div>
 </div>
 </div>

 <div className="flex justify-end gap-3 pt-6 border-t border-dark-tertiary">
 <Link href="/records/death">
 <button
 type="button"
 className="px-6 py-2 bg-dark-tertiary hover:bg-dark-tertiary/80 text-white rounded-lg transition-colors"
 >
 Cancel
 </button>
 </Link>
 <button
 type="submit"
 disabled={loading}
 className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white rounded-lg transition-colors font-medium"
 >
 {loading ? "Adding..." : "Add Record"}
 </button>
 </div>
 </form>
 </div>
 </div>
 </>
 );
}
