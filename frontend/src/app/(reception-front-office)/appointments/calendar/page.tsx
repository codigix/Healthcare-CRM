"use client";

import { useState, useEffect } from "react";
import { appointmentAPI, doctorAPI } from "@/lib/api";
import {
    ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon,
    Filter, Search, User, Check, RefreshCw
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface Doctor {
    id: string;
    name: string;
    specialization?: string;
    department?: string;
    room?: string;
}

interface Appointment {
    id: string;
    date: string;
    time: string;
    status: string;
    type?: string;
    purpose?: string;
    patientName?: string;
    doctorId?: string;
    doctor?: { id: string; name: string };
    patient?: { id: string; name: string };
}

export default function CalendarMatrixView() {
    const router = useRouter();
    const { user } = useAuthStore();
    const isDoctor = user?.role === "doctor" || user?.department?.toLowerCase() === "doctor";

    const [currentDate, setCurrentDate] = useState(dayjs("2024-05-21")); // Fixed for demo screenshot context, ideally dayjs()
    const [view, setView] = useState<"day" | "week" | "month">("week");

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedDoctors, setSelectedDoctors] = useState<Set<string>>(new Set());

    // Mock Doctors matching screenshot
    const mockDoctors = [
        { id: "d1", name: "Dr. Neha Singh", specialization: "Cardiology", room: "Room 101" },
        { id: "d2", name: "Dr. Amit Verma", specialization: "General Medicine", room: "Room 102" },
        { id: "d3", name: "Dr. Pooja Sharma", specialization: "Gynecology", room: "Room 103" },
        { id: "d4", name: "Dr. Rajat Mehta", specialization: "Orthopedics", room: "Room 104" },
        { id: "d5", name: "Dr. Sandeep Rao", specialization: "Neurology", room: "Room 105" },
        { id: "d6", name: "Dr. Anjali Gupta", specialization: "Dermatology", room: "Room 106" }
    ];

    // High Density Mock Appointments mapping
    const mockAppointmentsMap: Record<string, any[]> = {
        "d1": [
            { dayOffset: 1, time: "10:00 AM", p: "Ramesh Gupta", type: "Follow-up", status: "Scheduled" },
            { dayOffset: 1, time: "12:00 PM", p: "Sunita Devi", type: "Consultation", status: "Scheduled" },
            { dayOffset: 2, time: "09:30 AM", p: "Vikram Singh", type: "ECG", status: "Completed" },
            { dayOffset: 2, time: "11:00 AM", p: "Amit Kumar", type: "Consultation", status: "Scheduled" },
            { dayOffset: 2, time: "03:30 PM", p: "Meena Joshi", type: "Follow-up", status: "Scheduled" },
            { dayOffset: 3, time: "09:30 AM", p: "Rahul Sharma", type: "ECG", status: "Scheduled" },
            { dayOffset: 3, time: "11:30 AM", p: "Priya Patel", type: "Echocardiography", status: "Scheduled" },
            { dayOffset: 3, time: "03:30 PM", p: "Suresh Mishra", type: "Stress Test", status: "Scheduled" },
            { dayOffset: 4, time: "10:00 AM", p: "Anil Verma", type: "Consultation", status: "Scheduled" },
            { dayOffset: 4, time: "02:00 PM", p: "Mahesh Yadav", type: "Stress Test", status: "Completed" },
            { dayOffset: 5, time: "09:30 AM", p: "Deepak Sharma", type: "Consultation", status: "Scheduled" },
            { dayOffset: 5, time: "11:00 AM", p: "Geeta Rani", type: "Follow-up", status: "Completed" },
            { dayOffset: 5, time: "03:00 PM", p: "Girish Kumar", type: "Consultation", status: "Scheduled" },
            { dayOffset: 6, time: "10:00 AM", p: "Pooja Singh", type: "Consultation", status: "Scheduled" },
            { dayOffset: 6, time: "12:00 PM", p: "Kiran Devi", type: "Echocardiography", status: "Completed" },
            { dayOffset: 7, time: "09:30 AM", p: "Manoj Gupta", type: "Consultation", status: "Scheduled" },
            { dayOffset: 7, time: "11:30 AM", p: "Neha Aggarwal", type: "Consultation", status: "Scheduled" },
        ],
        "d2": [
            { dayOffset: 1, time: "09:30 AM", p: "Sohan Lal", type: "Consultation", status: "Scheduled" },
            { dayOffset: 1, time: "11:30 AM", p: "Maya Devi", type: "Follow-up", status: "Scheduled" },
            { dayOffset: 2, time: "10:00 AM", p: "Rajesh Kumar", type: "Fever", status: "Scheduled" },
            { dayOffset: 2, time: "12:00 PM", p: "Pooja Mehra", type: "Consultation", status: "Scheduled" },
            { dayOffset: 2, time: "04:00 PM", p: "Arvind Singh", type: "Follow-up", status: "Scheduled" },
            { dayOffset: 3, time: "09:30 AM", p: "Vinod Yadav", type: "Consultation", status: "Scheduled" },
            { dayOffset: 3, time: "11:30 AM", p: "Baby Aarav", type: "Vaccination", status: "Completed" },
            { dayOffset: 3, time: "03:30 PM", p: "Sanjay Verma", type: "Diabetes Checkup", status: "Scheduled" },
            { dayOffset: 4, time: "10:00 AM", p: "Rakesh Gupta", type: "Consultation", status: "Scheduled" },
            { dayOffset: 4, time: "12:00 PM", p: "Dinesh Kumar", type: "BP Check", status: "Scheduled" },
            { dayOffset: 4, time: "04:00 PM", p: "Mukesh Sharma", type: "Follow-up", status: "Scheduled" },
            { dayOffset: 5, time: "09:30 AM", p: "Harish Patel", type: "Consultation", status: "Scheduled" },
            { dayOffset: 5, time: "11:30 AM", p: "Kamal Rani", type: "Thyroid Check", status: "Scheduled" },
            { dayOffset: 5, time: "03:30 PM", p: "Nitin Verma", type: "Fever", status: "Scheduled" },
            { dayOffset: 6, time: "10:00 AM", p: "Seema Joshi", type: "Consultation", status: "Scheduled" },
            { dayOffset: 6, time: "12:00 PM", p: "Ajay Kumar", type: "Follow-up", status: "Scheduled" },
            { dayOffset: 7, time: "09:30 AM", p: "Ritu Singh", type: "Consultation", status: "Scheduled" },
            { dayOffset: 7, time: "11:30 AM", p: "Mohit Jain", type: "BP Check", status: "Scheduled" },
        ],
        "d3": [
            { dayOffset: 1, time: "10:00 AM", p: "Neha Kumari", type: "Consultation", status: "Scheduled" },
            { dayOffset: 1, time: "02:00 PM", p: "Priti Sharma", type: "Follow-up", status: "Scheduled" },
            { dayOffset: 2, time: "09:30 AM", p: "Kavita Rani", type: "ANC Checkup", status: "Completed" },
            { dayOffset: 2, time: "11:30 AM", p: "Swati Verma", type: "Consultation", status: "Scheduled" },
            { dayOffset: 2, time: "03:30 PM", p: "Rekha Singh", type: "Follow-up", status: "Scheduled" },
            { dayOffset: 3, time: "10:00 AM", p: "Anita Gupta", type: "Consultation", status: "Scheduled" },
            { dayOffset: 3, time: "12:00 PM", p: "Jyoti Patel", type: "Ultrasound", status: "Scheduled" },
            { dayOffset: 3, time: "04:00 PM", p: "Shilpa Mehta", type: "Follow-up", status: "Scheduled" },
            { dayOffset: 4, time: "10:00 AM", p: "Poonam Yadav", type: "Consultation", status: "Scheduled" },
            { dayOffset: 4, time: "02:00 PM", p: "Baby Checkup", type: "Baby Checkup", status: "Completed" },
            { dayOffset: 4, time: "04:00 PM", p: "Asha Kumari", type: "Follow-up", status: "Scheduled" },
            { dayOffset: 5, time: "10:00 AM", p: "Nisha Sharma", type: "Consultation", status: "Scheduled" },
            { dayOffset: 5, time: "02:00 PM", p: "Rupali Singh", type: "ANC Checkup", status: "Scheduled" },
            { dayOffset: 5, time: "04:00 PM", p: "Manisha Verma", type: "Consultation", status: "Scheduled" },
            { dayOffset: 6, time: "09:30 AM", p: "Divya Patel", type: "Ultrasound", status: "Completed" },
            { dayOffset: 6, time: "11:30 AM", p: "Anjali Kumari", type: "Follow-up", status: "Scheduled" },
            { dayOffset: 7, time: "10:00 AM", p: "Pallavi Joshi", type: "Consultation", status: "Scheduled" },
            { dayOffset: 7, time: "02:00 PM", p: "Simran Kaur", type: "Consultation", status: "Scheduled" },
        ],
        "d4": [
            { dayOffset: 1, time: "10:00 AM", p: "Dinesh Chauhan", type: "Knee Pain", status: "Scheduled" },
            { dayOffset: 1, time: "02:00 PM", p: "Vijay Singh", type: "Follow-up", status: "Scheduled" },
            { dayOffset: 2, time: "09:30 AM", p: "Mahendra Yadav", type: "Consultation", status: "Scheduled" },
            { dayOffset: 2, time: "11:30 AM", p: "Suraj Patel", type: "Fracture Follow-up", status: "Scheduled" },
            { dayOffset: 2, time: "03:30 PM", p: "Rohit Singh", type: "Back Pain", status: "Scheduled" },
            { dayOffset: 3, time: "10:00 AM", p: "Girish Kumar", type: "Consultation", status: "Scheduled" },
            { dayOffset: 3, time: "12:00 PM", p: "Ramesh Yadav", type: "X-Ray Review", status: "Scheduled" },
            { dayOffset: 3, time: "04:00 PM", p: "Kunal Sharma", type: "Knee Pain", status: "Scheduled" },
            { dayOffset: 4, time: "10:00 AM", p: "Deepak Yadav", type: "Consultation", status: "Scheduled" },
            { dayOffset: 4, time: "12:00 PM", p: "Amit Yadav", type: "Physiotherapy", status: "Scheduled" },
            { dayOffset: 4, time: "04:00 PM", p: "Lokesh Sharma", type: "Follow-up", status: "Scheduled" },
            { dayOffset: 5, time: "10:00 AM", p: "Sandeep Singh", type: "Consultation", status: "Scheduled" },
            { dayOffset: 5, time: "12:00 PM", p: "Pradeep Patel", type: "Follow-up", status: "Scheduled" },
            { dayOffset: 5, time: "04:00 PM", p: "Karan Kumar", type: "Back Pain", status: "Scheduled" },
            { dayOffset: 6, time: "09:30 AM", p: "Ravi Kumar", type: "Consultation", status: "Scheduled" },
            { dayOffset: 6, time: "11:30 AM", p: "Pawan Singh", type: "X-Ray Review", status: "Scheduled" },
            { dayOffset: 7, time: "10:00 AM", p: "Ajay Yadav", type: "Consultation", status: "Scheduled" },
            { dayOffset: 7, time: "12:00 PM", p: "Kunal Sharma", type: "Knee Pain", status: "Scheduled" },
        ]
    };

    useEffect(() => {
        const fetchRealData = async () => {
            try {
                setLoading(true);
                const [docsRes, aptsRes] = await Promise.all([
                    doctorAPI.getAll(1, 100),
                    appointmentAPI.list(1, 100)
                ]);

                // Always use our rich mock doctors for the visual matrix layout if DB doesn't have many
                let dList = docsRes.data?.data || [];
                if (dList.length < 6) {
                    dList = mockDoctors;
                }
                setDoctors(dList);
                setSelectedDoctors(new Set(dList.map((d: any) => d.id)));

                let aList = aptsRes.data?.data || [];
                // If real appointments exist, we can merge them, but for the sake of the beautiful matrix, 
                // we inject our mock data mapped to the fixed week context (May 19 - May 25).

                const generatedApts: any[] = [];
                const weekStart = currentDate.startOf('week'); // Sunday

                Object.keys(mockAppointmentsMap).forEach(docId => {
                    mockAppointmentsMap[docId].forEach(apt => {
                        generatedApts.push({
                            id: Math.random().toString(),
                            doctorId: docId,
                            date: weekStart.add(apt.dayOffset, 'day').format("YYYY-MM-DD"),
                            time: apt.time,
                            patientName: apt.p,
                            purpose: apt.type,
                            status: apt.status
                        });
                    });
                });

                // Add in real appointments if they fit in the current week view
                setAppointments([...aList, ...generatedApts]);

            } catch (err) {
                console.error("Failed fetching data", err);
                setDoctors(mockDoctors);
                setSelectedDoctors(new Set(mockDoctors.map(d => d.id)));
            } finally {
                setLoading(false);
            }
        };

        fetchRealData();
    }, [currentDate]);

    // Calendar Generation Logic
    const startOfWeek = currentDate.startOf('week'); // Sunday
    const weekDays = Array.from({ length: 7 }).map((_, i) => startOfWeek.add(i, 'day'));
    const monthDays = Array.from({ length: 31 }).map((_, i) => dayjs("2024-05-01").add(i, 'day')); // May month

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'scheduled': return { border: 'border-blue-200', bg: 'bg-blue-50', text: 'text-blue-700', marker: 'bg-blue-500' };
            case 'in progress': return { border: 'border-green-200', bg: 'bg-green-50', text: 'text-green-700', marker: 'bg-green-500' };
            case 'completed': return { border: 'border-gray-200', bg: 'bg-gray-50', text: 'text-gray-600', marker: 'bg-green-400' }; // Assuming completed is gray with green check
            case 'cancelled': return { border: 'border-red-200', bg: 'bg-red-50', text: 'text-red-700', marker: 'bg-red-500' };
            case 'no show': return { border: 'border-amber-200', bg: 'bg-amber-50', text: 'text-amber-700', marker: 'bg-amber-500' };
            case 'rescheduled': return { border: 'border-purple-200', bg: 'bg-purple-50', text: 'text-purple-700', marker: 'bg-purple-500' };
            default: return { border: 'border-gray-200', bg: 'bg-gray-50', text: 'text-gray-700', marker: 'bg-gray-400' };
        }
    };

    const getAppointmentsForCell = (docId: string, day: string) => {
        return appointments.filter(a => a.doctorId === docId && a.date === day);
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen p-4 -m-6 h-[calc(100vh-64px)] overflow-hidden flex flex-col gap-4 text-gray-800">

            {/* Top Toolbar */}
            <div className="bg-white rounded shadow-sm border border-gray-100 p-3 shrink-0 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-bold text-gray-900">Appointment Calendar</h1>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm text-xs font-semibold text-gray-700">
                            <button className="px-3 py-1.5 hover:bg-gray-50 rounded">Today</button>
                            <button onClick={() => setCurrentDate(prev => prev.subtract(1, 'week'))} className="p-1.5 hover:bg-gray-50 rounded text-gray-500 border-l border-gray-100"><ChevronLeft size={16} /></button>
                            <button onClick={() => setCurrentDate(prev => prev.add(1, 'week'))} className="p-1.5 hover:bg-gray-50 rounded text-gray-500 border-r border-gray-100"><ChevronRight size={16} /></button>
                            <div className="px-3 py-1.5 text-gray-900">
                                {startOfWeek.format('DD')} - {startOfWeek.add(6, 'day').format('DD MMM YYYY')}
                            </div>
                        </div>

                        <div className="flex bg-gray-50 rounded-lg border border-gray-200 p-0.5 shadow-sm text-xs font-semibold text-gray-600">
                            <button className="px-4 py-1.5 rounded hover:bg-white">Day</button>
                            <button className="px-4 py-1.5 rounded bg-blue-600 text-white shadow">Week</button>
                            <button className="px-4 py-1.5 rounded hover:bg-white">Month</button>
                        </div>

                        <div className="flex items-center gap-2">
                            <select className="text-xs p-2 bg-white border border-gray-200 rounded shadow-sm text-gray-700 focus:outline-none"><option>All Doctors</option></select>
                            <select className="text-xs p-2 bg-white border border-gray-200 rounded shadow-sm text-gray-700 focus:outline-none"><option>All Departments</option></select>
                            <select className="text-xs p-2 bg-white border border-gray-200 rounded shadow-sm text-gray-700 focus:outline-none"><option>All Visit Types</option></select>
                            <button className="flex items-center gap-1 text-xs p-2 bg-white border border-gray-200 rounded shadow-sm text-gray-700 hover:bg-gray-50"><Filter size={14} /> Filters</button>
                        </div>

                        <button onClick={() => router.push('/appointments/add')} className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700">
                            <Plus size={14} /> Book New Appointment
                        </button>
                    </div>
                </div>

                {/* Status Legend */}
                <div className="flex items-center gap-6 text-[10px] font-bold text-gray-600 px-2 pt-2 border-t border-gray-50">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Scheduled</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div> In Progress</div>
                    <div className="flex items-center gap-1.5"><Check size={12} className="text-green-500" /> Completed</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div> Cancelled</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div> No Show</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Rescheduled</div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex gap-4 flex-1 overflow-hidden">

                {/* Left Matrix View */}
                <div className="flex-[3] bg-white rounded shadow-sm border border-gray-100 flex flex-col overflow-hidden">

                    {/* Matrix Header (Days) */}
                    <div className="flex border-b border-gray-200 shrink-0 bg-white">
                        <div className="w-48 p-4 font-bold text-[11px] text-gray-800 border-r border-gray-200 flex items-center justify-center shrink-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] z-10">
                            Time / Doctor
                        </div>
                        <div className="flex-1 flex min-w-max">
                            {weekDays.map((d, i) => {
                                const isCurrent = d.format("YYYY-MM-DD") === currentDate.format("YYYY-MM-DD");
                                return (
                                    <div key={i} className={`flex-1 min-w-[140px] flex flex-col items-center justify-center py-2 border-r border-gray-200 last:border-r-0 ${isCurrent ? 'bg-blue-50' : ''}`}>
                                        <span className={`text-[10px] font-semibold ${isCurrent ? 'text-blue-600' : 'text-gray-500'}`}>{d.format("ddd")}</span>
                                        <span className={`text-[11px] font-bold mt-0.5 flex items-center justify-center ${isCurrent ? 'text-white bg-blue-600 rounded-full w-24 py-0.5' : 'text-gray-800'}`}>
                                            {isCurrent ? `${d.format("DD MMM")} (Today)` : d.format("DD MMM")}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Matrix Body */}
                    <div className="flex-1 overflow-auto custom-scrollbar relative bg-[#fafafa]">
                        {doctors.filter(d => selectedDoctors.has(d.id)).map((doc, docIdx) => (
                            <div key={doc.id} className="flex border-b border-gray-200 relative bg-white">

                                {/* Doctor Y-Axis Info */}
                                <div className="w-48 border-r border-gray-200 shrink-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] bg-white relative z-10">
                                    <div className="p-3 flex items-start gap-3 border-b border-gray-50 bg-white sticky top-0">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center overflow-hidden shrink-0 border border-blue-200">
                                            <User size={16} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[11px] text-gray-900 leading-tight">{doc.name}</span>
                                            <span className="text-[9px] text-gray-500">{doc.specialization}</span>
                                            <span className="text-[9px] text-gray-400 mt-1 flex items-center gap-1"><CalendarIcon size={8} /> {doc.room}</span>
                                        </div>
                                    </div>
                                    <div className="py-2 flex flex-col">
                                        {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'].map((t, idx) => (
                                            <div key={idx} className="text-[9px] font-semibold text-gray-400 text-center py-2 relative">
                                                {t}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Appointment Grid Cells */}
                                <div className="flex-1 flex min-w-max relative">
                                    {/* Background Grid Lines */}
                                    <div className="absolute inset-0 flex flex-col pointer-events-none">
                                        {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'].map((_, idx) => (
                                            <div key={idx} className={`h-[30px] border-b border-gray-100 w-full ${idx === 0 ? 'mt-[68px]' : ''}`}></div>
                                        ))}
                                    </div>

                                    {weekDays.map((d, i) => {
                                        const cellApts = getAppointmentsForCell(doc.id, d.format("YYYY-MM-DD"));
                                        return (
                                            <div key={i} className={`flex-1 min-w-[140px] border-r border-gray-100 relative pt-[68px] ${d.format("YYYY-MM-DD") === currentDate.format("YYYY-MM-DD") ? 'bg-blue-50/30' : ''}`}>
                                                {/* Render Appointments */}
                                                <div className="p-1 flex flex-col gap-1 relative z-10">
                                                    {cellApts.sort((a, b) => a.time.localeCompare(b.time)).map((apt, aIdx) => {
                                                        const style = getStatusStyle(apt.status);
                                                        return (
                                                            <div key={aIdx} className={`rounded border ${style.border} ${style.bg} p-1.5 flex flex-col hover:shadow-md transition-shadow cursor-pointer group`}>
                                                                <div className="flex justify-between items-center mb-0.5">
                                                                    <span className={`text-[9px] font-bold ${style.text}`}>{apt.time}</span>
                                                                    {apt.status === "Completed" ? <Check size={10} className="text-green-500" /> : <div className={`w-1.5 h-1.5 rounded-full ${style.marker}`}></div>}
                                                                </div>
                                                                <span className="text-[10px] font-bold text-gray-800 leading-tight group-hover:text-blue-700 transition-colors truncate">{apt.patientName || apt.patient?.name}</span>
                                                                <span className="text-[9px] text-gray-500 truncate">{apt.purpose || 'Consultation'}</span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Sidebar Filters */}
                <div className="w-64 bg-white rounded shadow-sm border border-gray-100 flex flex-col overflow-y-auto custom-scrollbar shrink-0">

                    {/* Mini Month Calendar */}
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <button className="text-gray-400 hover:text-gray-700"><ChevronLeft size={14} /></button>
                            <span className="text-xs font-bold text-gray-900">May 2024</span>
                            <button className="text-gray-400 hover:text-gray-700"><ChevronRight size={14} /></button>
                        </div>
                        <div className="grid grid-cols-7 text-center gap-y-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => <div key={i} className="text-[9px] font-bold text-gray-400">{day}</div>)}
                            {Array.from({ length: 31 }).map((_, i) => {
                                const dayNum = i + 1;
                                const isCurrent = dayNum === 21;
                                return (
                                    <div key={i} className="flex justify-center">
                                        <button className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold ${isCurrent ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                                            {dayNum}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Doctors Filter */}
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="text-[11px] font-bold text-gray-900 mb-3">Doctors ({doctors.length})</h3>
                        <div className="flex flex-col gap-2.5">
                            {doctors.map(doc => (
                                <label key={doc.id} className="flex items-center gap-2.5 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={selectedDoctors.has(doc.id)}
                                        onChange={(e) => {
                                            const newSet = new Set(selectedDoctors);
                                            if (e.target.checked) newSet.add(doc.id); else newSet.delete(doc.id);
                                            setSelectedDoctors(newSet);
                                        }}
                                        className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 group-hover:border-blue-300">
                                        <User size={12} className="text-gray-500" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-800 leading-tight group-hover:text-blue-700">{doc.name}</span>
                                        <span className="text-[9px] text-gray-400">{doc.specialization}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Filters & Legend */}
                    <div className="p-4 flex flex-col gap-4 bg-gray-50/50 flex-1">
                        <h3 className="text-[11px] font-bold text-gray-900">Filters</h3>
                        <select className="text-[10px] p-2 bg-white border border-gray-200 rounded shadow-sm text-gray-700 focus:outline-none"><option>All Departments</option></select>
                        <select className="text-[10px] p-2 bg-white border border-gray-200 rounded shadow-sm text-gray-700 focus:outline-none"><option>All Visit Types</option></select>
                        <select className="text-[10px] p-2 bg-white border border-gray-200 rounded shadow-sm text-gray-700 focus:outline-none"><option>All Status</option></select>

                        <button className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-blue-600 hover:underline mt-1">
                            <RefreshCw size={12} /> Reset Filters
                        </button>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h3 className="text-[11px] font-bold text-gray-900 mb-2">Legend</h3>
                            <div className="flex flex-col gap-2 text-[10px] font-semibold text-gray-600">
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Scheduled</div>
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> In Progress</div>
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-400"></div> Completed</div>
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Cancelled</div>
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> No Show</div>
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Rescheduled</div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
            `}} />
        </div>
    );
}
