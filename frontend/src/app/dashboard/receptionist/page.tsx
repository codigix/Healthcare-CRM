"use client";

import { useState, useEffect } from "react";
import {
    Calendar,
    Users,
    Hotel,
    FileText,
    Plus,
    PhoneCall,
    CheckSquare,
    Clock,
    Briefcase
} from "lucide-react";
import Link from "next/link";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from "recharts";

const bookingsData = [
    { day: "Mon", bookings: 12 },
    { day: "Tue", bookings: 19 },
    { day: "Wed", bookings: 25 },
    { day: "Thu", bookings: 22 },
    { day: "Fri", bookings: 30 },
    { day: "Sat", bookings: 15 },
    { day: "Sun", bookings: 8 }
];

export default function ReceptionistDashboard() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center my-3 my-3">
                <div>
                    <h1 className="text-3xl  mb-2">Receptionist Dashboard</h1>
                    <p className="text-gray-400">Manage patient arrivals, appointments, room allotments, and invoices.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/appointments/add" className="btn-primary flex items-center gap-1.5 text-sm">
                        <Plus size={16} /> Book Appointment
                    </Link>
                    <Link href="/room-allotment/new" className="btn-secondary flex items-center gap-1.5 text-sm">
                        <Plus size={16} /> New Allotment
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-400">Loading Reception Systems...</p>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="card card-hover">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-400 text-sm mb-2">Today's Bookings</p>
                                    <p className="text-2xl ">28 Bookings</p>
                                    <p className="text-emerald-500 text-xs mt-2">12 completed checks</p>
                                </div>
                                <Calendar className="text-blue-500" size={24} />
                            </div>
                        </div>

                        <div className="card card-hover">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-400 text-sm mb-2">Total Patients</p>
                                    <p className="text-2xl ">19 Patients</p>
                                    <p className="text-emerald-500 text-xs mt-2">4 walk-in registrations</p>
                                </div>
                                <Users className="text-yellow-500" size={24} />
                            </div>
                        </div>

                        <div className="card card-hover border-emerald-500/20">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-400 text-sm mb-2">Available Rooms</p>
                                    <p className="text-2xl  text-emerald-500">18 Beds</p>
                                    <p className="text-emerald-400 text-xs mt-2">Ready for allotment</p>
                                </div>
                                <Hotel className="text-emerald-500" size={24} />
                            </div>
                        </div>

                        <div className="card card-hover border-red-500/20">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-400 text-sm mb-2">Pending Invoices</p>
                                    <p className="text-2xl  text-red-500">₹8,450.00</p>
                                    <p className="text-red-400 text-xs mt-2">6 invoices outstanding</p>
                                </div>
                                <FileText className="text-red-500" size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="card lg:col-span-2">
                            <h2 className="text-lg font-semibold mb-4">Weekly Appointment Bookings Analysis</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={bookingsData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
                                    <YAxis stroke="rgba(255,255,255,0.5)" />
                                    <Tooltip contentStyle={{ backgroundColor: "#1e1f27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                                    <Bar dataKey="bookings" fill="#3b82f6" name="Appointments Booked" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="card">
                            <h2 className="text-lg font-semibold mb-4">Quick Front Desk Helper</h2>
                            <p className="text-gray-400 text-sm mb-4">Frequently used desk utilities for hospital receptionist staff.</p>
                            <div className="space-y-3">
                                <Link href="/patients/add" className="flex items-center gap-2 p-3 rounded border border-dark-tertiary hover:border-gray-500 transition-colors w-full text-left">
                                    <div className="p-2 rounded bg-yellow-500/10 text-yellow-500"><Users size={15} /></div>
                                    <div>
                                        <div className="font-semibold text-white text-sm">Register Walk-in Patient</div>
                                        <div className="text-xs text-gray-400">Quick demographic capture</div>
                                    </div>
                                </Link>
                                <Link href="/ambulance/calls" className="flex items-center gap-2 p-3 rounded border border-dark-tertiary hover:border-gray-500 transition-colors w-full text-left">
                                    <div className="p-2 rounded bg-red-500/10 text-red-500"><PhoneCall size={15} /></div>
                                    <div>
                                        <div className="font-semibold text-white text-sm">Log Emergency Call</div>
                                        <div className="text-xs text-gray-400">Dispatch dispatch fleet immediately</div>
                                    </div>
                                </Link>
                                <Link href="/billing/create-invoice" className="flex items-center gap-2 p-3 rounded border border-dark-tertiary hover:border-gray-500 transition-colors w-full text-left">
                                    <div className="p-2 rounded bg-emerald-500/10 text-emerald-500"><FileText size={15} /></div>
                                    <div>
                                        <div className="font-semibold text-white text-sm">Create New Invoice</div>
                                        <div className="text-xs text-gray-400">Outpatient checkout billing</div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Incoming Reception Appointment Check-ins */}
                    <div className="card">
                        <div className="flex justify-between items-center my-3 my-3 mb-4">
                            <h2 className="text-lg font-semibold">Incoming Patient Check-ins Today</h2>
                            <Link href="/appointments/all" className="text-[#1abc9c] hover:underline text-sm">
                                Manage Appointment Timeline
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-dark-tertiary">
                                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Time Slot</th>
                                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Patient Name</th>
                                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Consulting Doctor</th>
                                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Consultation Fee</th>
                                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                                        <td className="py-3 px-4 text-[#1abc9c] font-semibold"><Clock size={14} className="inline mr-1" /> 10:30 AM</td>
                                        <td className="py-3 px-4 font-semibold text-white">Harry Potter</td>
                                        <td className="py-3 px-4 text-gray-400">Dr. Sarah Jenkins</td>
                                        <td className="py-3 px-4">₹500.00</td>
                                        <td className="py-3 px-4"><span className="status-badge status-confirmed">Confirmed</span></td>
                                    </tr>
                                    <tr className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                                        <td className="py-3 px-4 text-[#1abc9c] font-semibold"><Clock size={14} className="inline mr-1" /> 11:15 AM</td>
                                        <td className="py-3 px-4 font-semibold text-white">Hermione Granger</td>
                                        <td className="py-3 px-4 text-gray-400">Dr. Sarah Jenkins</td>
                                        <td className="py-3 px-4">₹500.00</td>
                                        <td className="py-3 px-4"><span className="status-badge status-pending">Awaiting Doctor</span></td>
                                    </tr>
                                    <tr className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                                        <td className="py-3 px-4 text-[#1abc9c] font-semibold"><Clock size={14} className="inline mr-1" /> 12:00 PM</td>
                                        <td className="py-3 px-4 font-semibold text-white">Ron Weasley</td>
                                        <td className="py-3 px-4 text-gray-400">Dr. Arthur Conan</td>
                                        <td className="py-3 px-4">₹600.00</td>
                                        <td className="py-3 px-4"><span className="status-badge status-completed">Checked Out</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
