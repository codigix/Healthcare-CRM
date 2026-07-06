"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { appointmentAPI, patientAPI } from "@/lib/api";
import { CheckCircle, ArrowLeft, Plus, Calendar, Clock, Users, FileText, Phone, Heart } from "lucide-react";
import Link from "next/link";

interface Patient {
 id: string;
 name: string;
 age?: number;
 gender?: string;
 phone?: string;
 lastVisit?: string;
 dob?: string;
}

interface Appointment {
 id: string;
 date: string;
 time: string;
 status: string;
 roomId?: string;
 tokenNumber?: string;
 notes?: string;
 doctor?: { id: string; name: string };
 patient?: { id: string; name: string; email?: string; phone?: string };
}

export default function AppointmentSuccessPage() {
 const searchParams = useSearchParams();
 const router = useRouter();
 const appointmentId = searchParams.get("id");

 const [appointment, setAppointment] = useState<Appointment | null>(null);
 const [patient, setPatient] = useState<Patient | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");

 useEffect(() => {
 if (!appointmentId) {
 setError("No appointment ID provided");
 setLoading(false);
 return;
 }
 fetchAppointmentDetails();
 }, [appointmentId]);

 const fetchAppointmentDetails = async () => {
 try {
 setLoading(true);
 const response = await appointmentAPI.get(appointmentId!);
 const apt = response.data;
 
 setAppointment({
 id: apt.id,
 date: apt.date,
 time: apt.time,
 status: apt.status,
 roomId: apt.roomId,
 tokenNumber: apt.tokenNumber,
 notes: apt.notes,
 doctor: apt.doctor || { id: apt.doctorId, name: apt.doctorName || "Unassigned" },
 patient: apt.patient || { id: apt.patientId, name: apt.patientName || "Unknown" },
 });

 if (apt.patientId) {
 const patientRes = await patientAPI.get(apt.patientId);
 const p = patientRes.data;
 const today = new Date();
 const birthDate = new Date(p.dob);
 let age = today.getFullYear() - birthDate.getFullYear();
 const monthDiff = today.getMonth() - birthDate.getMonth();
 if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
 age--;
 }
 setPatient({
 id: p.id,
 name: p.name,
 age: age > 0 ? age : undefined,
 gender: p.gender,
 phone: p.phone,
 lastVisit: p.lastVisit,
 dob: p.dob,
 });
 }
 } catch (err: any) {
 console.error("Failed to fetch appointment details", err);
 setError(err.response?.data?.error || "Failed to load appointment details");
 } finally {
 setLoading(false);
 }
 };

 if (loading) {
 return (
 <>
 <div className="flex items-center justify-center py-20">
 <div className="text-gray-400">Loading appointment details...</div>
 </div>
 </>
 );
 }

 if (error || !appointment) {
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
 <h1 className="text-3xl font-bold mb-2">Error</h1>
 <p className="text-gray-400">{error || "Appointment not found"}</p>
 </div>
 </div>
 </div>
 </>
 );
 }

 const formattedDate = new Date(appointment.date).toLocaleDateString("en-US", {
 year: "numeric",
 month: "long",
 day: "numeric",
 });

 return (
 <>
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <Link href="/appointments/all">
 <button className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors">
 <ArrowLeft size={24} />
 </button>
 </Link>
 <h1 className="text-3xl font-bold">Appointment Confirmation</h1>
 <div className="w-10" />
 </div>

 <div className="card border-2 border-emerald-500/30 bg-emerald-500/5">
 <div className="flex items-center justify-center gap-3 mb-6">
 <CheckCircle size={32} className="text-emerald-500" />
 <div>
 <h2 className="text-2xl font-bold text-emerald-500">Appointment Successfully Booked!</h2>
 <p className="text-gray-400 text-sm">Your appointment has been confirmed and scheduled.</p>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 <div className="card">
 <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
 <Users size={20} className="text-emerald-500" />
 Patient Details
 </h3>

 <div className="space-y-4">
 <div className="flex justify-between items-start">
 <span className="text-gray-400">Name</span>
 <span className="font-medium text-right">{patient?.name || appointment.patient?.name}</span>
 </div>

 {patient?.age && (
 <div className="flex justify-between items-start">
 <span className="text-gray-400">Age</span>
 <span className="font-medium">{patient.age}</span>
 </div>
 )}

 {patient?.gender && (
 <div className="flex justify-between items-start">
 <span className="text-gray-400">Gender</span>
 <span className="font-medium">{patient.gender}</span>
 </div>
 )}

 {patient?.phone && (
 <div className="flex justify-between items-start">
 <span className="text-gray-400">Phone</span>
 <span className="font-medium flex items-center gap-2">
 <Phone size={16} />
 {patient.phone}
 </span>
 </div>
 )}

 {patient?.lastVisit && (
 <div className="flex justify-between items-start">
 <span className="text-gray-400">Last Visit</span>
 <span className="font-medium">{patient.lastVisit}</span>
 </div>
 )}
 </div>
 </div>

 <div className="card">
 <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
 <Calendar size={20} className="text-blue-500" />
 Appointment Details
 </h3>

 <div className="space-y-4">
 <div className="flex justify-between items-start">
 <span className="text-gray-400">Date</span>
 <span className="font-medium">{formattedDate}</span>
 </div>

 <div className="flex justify-between items-start">
 <span className="text-gray-400">Time</span>
 <span className="font-medium flex items-center gap-2">
 <Clock size={16} />
 {appointment.time}
 </span>
 </div>

 <div className="flex justify-between items-start">
 <span className="text-gray-400">Status</span>
 <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-500">
 {appointment.status}
 </span>
 </div>

 {appointment.tokenNumber && (
 <div className="flex justify-between items-start">
 <span className="text-gray-400">Token Number</span>
 <span className="text-2xl font-bold text-emerald-500">{appointment.tokenNumber}</span>
 </div>
 )}

 {appointment.roomId && (
 <div className="flex justify-between items-start">
 <span className="text-gray-400">Room</span>
 <span className="font-medium">{appointment.roomId}</span>
 </div>
 )}
 </div>
 </div>

 <div className="card lg:col-span-2">
 <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
 <Heart size={20} className="text-red-500" />
 Doctor Assigned
 </h3>

 <div className="flex items-center gap-4">
 <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-semibold text-xl">
 {appointment.doctor?.name?.charAt(0) || "?"}
 </div>
 <div>
 <h4 className="text-lg font-semibold">Dr. {appointment.doctor?.name || "Unassigned"}</h4>
 {appointment.notes && (
 <p className="text-gray-400 text-sm mt-1 flex items-start gap-2">
 <FileText size={14} className="mt-0.5 flex-shrink-0" />
 {appointment.notes}
 </p>
 )}
 </div>
 </div>
 </div>
 </div>

 <div className="flex gap-4 justify-center">
 <Link href="/appointments/all">
 <button className="btn-secondary flex items-center gap-2">
 <Calendar size={20} />
 View All Appointments
 </button>
 </Link>
 <Link href="/appointments/add">
 <button className="btn-primary flex items-center gap-2">
 <Plus size={20} />
 Book Another Appointment
 </button>
 </Link>
 </div>
 </div>
 </>
 );
}
