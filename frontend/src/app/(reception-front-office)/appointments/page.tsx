"use client";

import { useState, useEffect } from "react";
import { appointmentAPI, doctorAPI, patientAPI, recordsAPI, roomAllotmentAPI } from "@/lib/api";
import { Plus, Edit2, Trash2, Search, Filter, Calendar, Loader2, Check, Activity, Send, Eye, Download, ExternalLink, FileText, ClipboardList } from "lucide-react";
import Modal from "@/components/UI/Modal";
import AppointmentForm from "@/components/Forms/AppointmentForm";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import DataTable, { Column } from "@/components/UI/DataTable";
import { useRouter, useSearchParams } from "next/navigation";
import { appointmentAPI, patientAPI, doctorAPI } from "@/lib/api";
import DataTable, { TableColumn } from "react-data-table-component";
import dayjs from "dayjs";
import {
    Calendar, ChevronLeft, ChevronRight, Filter, Search, Plus,
    MoreHorizontal, Eye, Edit, FileText, CheckCircle2, XCircle,
    Clock, CalendarCheck, CalendarClock, CalendarX, User, Printer,
    MessageCircle, Users, Activity, Check, AlertCircle, Phone, Mail, QrCode,
    X, CheckSquare
} from "lucide-react";

import Modal from "@/components/UI/Modal";
import AppointmentForm from "@/components/Forms/AppointmentForm";

// Import Tab Components
import DoctorAvailability from "@/components/Appointments/DoctorAvailability";
import Queue from "@/components/Appointments/Queue";
import CheckIn from "@/components/Appointments/CheckIn";
import WalkIn from "@/components/Appointments/WalkIn";
import FollowUp from "@/components/Appointments/FollowUp";
import Telemedicine from "@/components/Appointments/Telemedicine";

export default function AppointmentsListDashboard() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const patientId = searchParams.get('patientId');

    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);

    // UI State
    const [selectedDate, setSelectedDate] = useState(dayjs().toDate());
    const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [isReviewDrawerOpen, setIsReviewDrawerOpen] = useState(false);

    // Main Tabs State
    const [activeMainTab, setActiveMainTab] = useState('all');

    // Mock Context Patient if a patient context exists (to match the top header in screenshot)


    useEffect(() => {
        fetchAppointments();
    }, [page, limit, selectedDate]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [docsRes, patsRes] = await Promise.all([
                    doctorAPI.getAll(1, 100),
                    patientAPI.getAll(1, 100)
                ]);
                setDoctors(docsRes.data?.data || []);
                setPatients(patsRes.data?.data || []);
            } catch (error) {
                console.error("Failed to load doctors/patients for form");
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const handleClick = () => setOpenMenuId(null);
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const dateStr = dayjs(selectedDate).format('YYYY-MM-DD');
            const res = await appointmentAPI.list(page, limit, { date: dateStr });

            let fetchedData = res?.data?.data || res?.data?.appointments || [];

            setAppointments(fetchedData);
            if (!selectedAppointment && fetchedData.length > 0) {
                setSelectedAppointment(fetchedData[0]);
            }
            setTotal(res?.data?.total || fetchedData.length);
        } catch (error) {
            console.error("Failed to fetch appointments", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuccess = () => {
        setShowModal(false);
        fetchAppointments();
    };

    const getStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'in progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'scheduled': return 'bg-sky-100 text-sky-700 border-sky-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            case 'no show': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const columns: TableColumn<any>[] = [
        { name: 'Time', selector: row => row.time, width: '90px', sortable: true, cell: row => <span className="font-semibold text-gray-800">{row.time}</span> },
        { name: 'Token No.', selector: row => row.tokenNumber || row.token, width: '100px', sortable: true, cell: row => <span className="font-medium text-gray-600">{row.tokenNumber || row.token || '-'}</span> },
        {
            name: 'Patient Details',
            width: '220px',
            cell: row => (
                <div className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                        <User size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 leading-tight">{row.patient?.name || row.patientName || row.pName || '-'}</span>
                        <span className="text-[10px] text-gray-500">{row.patientId?.substring(0, 8).toUpperCase() || row.pUhid || '-'}</span>
                    </div>
                </div>
            )
        },
        { name: 'Department', selector: row => row.department || row.dept || '-', width: '150px' },
        { name: 'Doctor', selector: row => row.doctor?.name || row.doctorName || row.doctor || '-', width: '160px', cell: row => <span className="font-medium text-gray-800">{row.doctor?.name || row.doctorName || row.doctor || '-'}</span> },
        { name: 'Purpose', selector: row => row.visitType || row.purpose || row.notes || '-', width: '140px' },
        {
            name: 'Status',
            width: '120px',
            cell: row => (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStatusBadge(row.status)}`}>
                    {row.status || 'Scheduled'}
                </span>
            )
        },
        {
            name: 'Actions',
            center: true,
            width: '120px',
            cell: row => (
                <div className="flex items-center justify-center gap-1.5">
                    <button onClick={() => { setSelectedAppointment(row); setIsReviewDrawerOpen(true); }} className="p-1 text-blue-500 hover:bg-blue-50 rounded">
                        <Eye size={14} />
                    </button>
                    <button className="p-1 text-blue-500 hover:bg-blue-50 rounded">
                        <Edit size={14} />
                    </button>
                    <div className="relative">
                        <button
                            onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === row.id ? null : row.id); }}
                            className="p-1 text-gray-400 hover:bg-gray-50 rounded"
                        >
                            <MoreHorizontal size={14} />
                        </button>
                        {openMenuId === row.id && (
                            <div className="absolute right-0 mt-1 w-36 bg-white rounded shadow-xl border border-gray-100 z-50 py-1 text-left text-[11px]" onClick={e => e.stopPropagation()}>
                                <div className="px-3 py-1.5 hover:bg-gray-50 cursor-pointer">Reschedule</div>
                                <div className="px-3 py-1.5 hover:bg-gray-50 cursor-pointer">Cancel</div>
                                <div className="px-3 py-1.5 hover:bg-gray-50 cursor-pointer text-green-600">Mark Completed</div>
                            </div>
                        )}
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="bg-[#f8fafc] min-h-screen p-4 -m-6  gap-4 relative">

            {/* Left Column (Patient Profile & Tabs) */}
            <div className="shrink-0 flex flex-col gap-4">
                <div className="flex justify-between items-end border-t border-gray-100 pt-4 mt-2">
                    <div className="flex items-center gap-2">
                        <QrCode size={32} className="text-gray-800" />
                        <span className="text-[9px] text-gray-400 leading-tight w-12">Scan for Details</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsReviewDrawerOpen(true)}
                            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg font-medium text-[11px] flex items-center gap-1.5 shadow-sm transition-all"
                        >
                            <CheckSquare size={14} />
                            Review
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium text-[11px] flex items-center gap-1.5 shadow-sm transition-all transform hover:scale-[1.02]"
                        >
                            <Plus size={14} />
                            Book New Appointment
                        </button>
                    </div>
                </div>
                {/* Context Header (Patient Profile Block) */}

                {/* Main Tabs Navigation */}
                <div className="flex items-center gap-4 mt-2 px-1 overflow-x-auto custom-scrollbar">
                    {[
                        { id: 'all', label: 'All Appointments' },
                        { id: 'doctor-availability', label: 'Doctor Availability' },
                        { id: 'queue', label: "Today's Queue" },
                        { id: 'check-in', label: 'Check-In' },
                        { id: 'walk-in', label: 'Walk-In Patients' },
                        { id: 'follow-up', label: 'Follow-up' },
                        { id: 'telemedicine', label: 'Telemedicine' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveMainTab(tab.id)}
                            className={`py-3 text-[13px] font-semibold border-b-2 transition-colors whitespace-nowrap ${activeMainTab === tab.id
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Right Column (Dynamic Content) */}
            <div className="flex-1 min-w-0 flex flex-col h-full relative overflow-hidden">
                {/* Tab Content */}
                {activeMainTab === 'all' && (
                    <div className="flex flex-col gap-4 h-full overflow-hidden">
                        {/* Dashboard Header & Summary Cards */}
                        <div className="flex flex-col gap-4 bg-white p-4 rounded shadow-sm border border-gray-100">
                            <div className="flex justify-between items-end">
                                <h1 className="text-lg font-bold text-gray-800">Appointment List</h1>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
                                        <button className="p-1.5 hover:bg-gray-50 rounded text-gray-500"><ChevronLeft size={16} /></button>
                                        <div className="px-3 flex items-center gap-2 text-sm font-medium text-gray-700 border-x border-gray-100">
                                            <Calendar size={14} className="text-blue-500" />
                                            {dayjs(selectedDate).format('DD MMM YYYY')}
                                        </div>
                                        <button className="p-1.5 hover:bg-gray-50 rounded text-gray-500"><ChevronRight size={16} /></button>
                                    </div>

                                    <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm text-xs font-medium">
                                        <button className="px-3 py-1.5 bg-blue-600 text-white rounded shadow-sm">Today</button>
                                        <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 rounded">Tomorrow</button>
                                        <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 rounded">This Week</button>
                                    </div>

                                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-600 text-xs font-medium hover:bg-gray-50">
                                        <Filter size={14} /> Filters
                                    </button>

                                    <div className="relative w-64">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search size={14} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-xs shadow-sm"
                                            placeholder="Search appointment..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Metric Cards */}
                            <div className="grid grid-cols-6 gap-3">
                                {[
                                    { label: 'Total Appointments', value: total.toString(), sub: 'All Status', icon: Calendar, color: 'blue', bg: 'bg-blue-50', text: 'text-blue-600' },
                                    { label: 'Scheduled', value: '18', sub: 'Confirmed', icon: CalendarCheck, color: 'sky', bg: 'bg-sky-50', text: 'text-sky-600' },
                                    { label: 'Completed', value: '8', sub: 'Today', icon: CheckCircle2, color: 'green', bg: 'bg-green-50', text: 'text-green-600' },
                                    { label: 'Cancelled', value: '3', sub: 'Today', icon: XCircle, color: 'red', bg: 'bg-red-50', text: 'text-red-600' },
                                    { label: 'No Show', value: '2', sub: 'Today', icon: CalendarX, color: 'amber', bg: 'bg-amber-50', text: 'text-amber-600' },
                                    { label: 'In Progress', value: '1', sub: 'Currently', icon: Clock, color: 'indigo', bg: 'bg-indigo-50', text: 'text-indigo-600' },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white p-3 rounded border border-gray-100 shadow-sm flex flex-col relative overflow-hidden group">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={`p-1.5 rounded-lg ${stat.bg} ${stat.text}`}>
                                                <stat.icon size={14} />
                                            </div>
                                            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider line-clamp-1">{stat.label}</span>
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <span className="text-2xl font-bold text-gray-900 leading-none">{stat.value}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-400 mt-1">{stat.sub}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded shadow-sm border border-gray-100 flex-1 flex flex-col mt-2 overflow-hidden">
                            <DataTable
                                columns={columns}
                                data={appointments}
                                customStyles={{
                                    headRow: { style: { backgroundColor: '#f8fafc', borderBottomWidth: '1px', borderBottomColor: '#f1f5f9', minHeight: '40px' } },
                                    headCells: { style: { fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' } },
                                    rows: { style: { minHeight: '52px', '&:hover': { backgroundColor: '#f8fafc', cursor: 'pointer' } } },
                                    cells: { style: { fontSize: '12px' } }
                                }}
                                highlightOnHover
                                pointerOnHover
                                onRowClicked={(row) => { setSelectedAppointment(row); setIsReviewDrawerOpen(true); }}
                                pagination
                                paginationServer
                                paginationTotalRows={total}
                                onChangePage={setPage}
                                onChangeRowsPerPage={(newPerPage, p) => { setLimit(newPerPage); setPage(p); }}
                                progressPending={loading}
                            />
                        </div>
                    </div>
                )}

                {/* Sliding Overlay Drawer (Right Sidebar) */}
                {/* Backdrop */}
                {activeMainTab === 'all' && isReviewDrawerOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
                        onClick={() => setIsReviewDrawerOpen(false)}
                    ></div>
                )}

                {/* Drawer */}
                {activeMainTab === 'all' && (
                    <div className={`fixed inset-y-0 right-0 z-50 w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isReviewDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                        {/* Drawer Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <h2 className="text-sm font-bold text-gray-900">Appointment Review</h2>
                            <button
                                onClick={() => setIsReviewDrawerOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={15} />
                            </button>
                        </div>

                        <div className="flex border-b border-gray-100 text-xs font-bold px-4">
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`flex-1 py-3 text-center transition-colors border-b-2 ${activeTab === 'details' ? 'border-blue-600 text-blue-700 bg-blue-50/50' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                            >
                                Appointment Details
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`flex-1 py-3 text-center transition-colors border-b-2 ${activeTab === 'history' ? 'border-blue-600 text-blue-700 bg-blue-50/50' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                            >
                                Patient History
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                            {activeTab === 'details' && selectedAppointment ? (
                                <>
                                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Appointment Information</h3>
                                    <div className="space-y-3 mb-6 text-[11px]">
                                        <div className="flex justify-between border-b border-gray-50 pb-2">
                                            <span className="text-gray-500">Appointment ID</span>
                                            <span className="font-semibold text-gray-800">APT2024052100{selectedAppointment.id}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-50 pb-2">
                                            <span className="text-gray-500">Booking Date</span>
                                            <span className="font-semibold text-gray-800">{selectedAppointment.createdAt ? dayjs(selectedAppointment.createdAt).format('DD MMM YYYY hh:mm A') : '-'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-50 pb-2">
                                            <span className="text-gray-500">Appointment Date</span>
                                            <span className="font-semibold text-gray-800">{selectedAppointment.date ? dayjs(selectedAppointment.date).format('DD MMM YYYY') : '-'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-50 pb-2">
                                            <span className="text-gray-500">Time Slot</span>
                                            <span className="font-semibold text-gray-800">{selectedAppointment.time || '-'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-50 pb-2">
                                            <span className="text-gray-500">Duration</span>
                                            <span className="font-semibold text-gray-800">30 Minutes</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-50 pb-2">
                                            <span className="text-gray-500">Visit Type</span>
                                            <span className="font-semibold text-gray-800">{selectedAppointment.visitType || selectedAppointment.purpose || 'OPD'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-50 pb-2">
                                            <span className="text-gray-500">Department</span>
                                            <span className="font-semibold text-gray-800">{selectedAppointment.department || '-'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-50 pb-2">
                                            <span className="text-gray-500">Payment Status</span>
                                            <span className="bg-green-100 text-green-700 font-bold px-2 rounded">Paid</span>
                                        </div>
                                    </div>

                                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Patient Queue Status</h3>
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 grid grid-cols-4 text-center mb-6 divide-x divide-gray-200">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-blue-600 font-bold">Your Token</span>
                                            <span className="text-sm font-bold text-gray-900 mt-1">{selectedAppointment.tokenNumber || selectedAppointment.token || '-'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-gray-500 font-bold">Queue No.</span>
                                            <span className="text-sm font-bold text-gray-900 mt-1">2</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-gray-500 font-bold">Total in Queue</span>
                                            <span className="text-sm font-bold text-gray-900 mt-1">6</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-gray-500 font-bold">Estimated Wait</span>
                                            <span className="text-sm font-bold text-gray-900 mt-1">15 mins</span>
                                        </div>
                                    </div>

                                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Quick Actions</h3>
                                    <div className="grid grid-cols-2 gap-2 mb-6">
                                        <button className="flex items-center justify-center gap-2 py-2 px-2 border border-gray-200 rounded text-[11px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                                            <Edit size={14} className="text-blue-500" /> Edit Appointment
                                        </button>
                                        <button className="flex items-center justify-center gap-2 py-2 px-2 border border-gray-200 rounded text-[11px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                                            <CalendarClock size={14} className="text-amber-500" /> Reschedule
                                        </button>
                                        <button className="flex items-center justify-center gap-2 py-2 px-2 border border-red-200 bg-red-50 text-red-700 rounded text-[11px] font-semibold hover:bg-red-100 transition-colors shadow-sm">
                                            <XCircle size={14} /> Cancel Appointment
                                        </button>
                                        <button className="flex items-center justify-center gap-2 py-2 px-2 border border-green-200 bg-green-50 text-green-700 rounded text-[11px] font-semibold hover:bg-green-100 transition-colors shadow-sm">
                                            <CheckCircle2 size={14} /> Mark as Completed
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                                    <Calendar size={48} className="opacity-20" />
                                    <p className="text-sm text-center px-4">Select an appointment from the list to view details.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Other Tab Components */}
                {activeMainTab === 'doctor-availability' && <div className="h-full overflow-hidden"><DoctorAvailability /></div>}
                {activeMainTab === 'queue' && <div className="h-full overflow-hidden"><Queue /></div>}
                {activeMainTab === 'check-in' && <div className="h-full overflow-hidden"><CheckIn /></div>}
                {activeMainTab === 'walk-in' && <div className="h-full overflow-hidden"><WalkIn /></div>}
                {activeMainTab === 'follow-up' && <div className="h-full overflow-hidden"><FollowUp /></div>}
                {activeMainTab === 'telemedicine' && <div className="h-full overflow-hidden"><Telemedicine /></div>}

            </div> {/* End of Right Column */}

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
            `}} />

            {/* Modal for Appointment Form */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Book New Appointment">
                <AppointmentForm
                    doctors={doctors}
                    patients={patients}
                    onSuccess={handleSuccess}
                />
            </Modal>
        </div>
    );
}
