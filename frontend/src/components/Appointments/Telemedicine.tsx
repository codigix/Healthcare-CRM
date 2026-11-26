"use client";

import { useState } from "react";
import DataTable from "react-data-table-component";
import {
    Video, ChevronLeft, ChevronRight, Filter, Search, Plus,
    Calendar, CheckCircle2, XCircle, CalendarCheck
} from "lucide-react";

export default function Telemedicine() {
    const [telemedicine] = useState([
        { id: 1, name: 'Rahul Sharma', ageGender: '35 / Male', doctor: 'Dr. Neha Singh', time: '09:30 AM', mode: 'Video Call', reason: 'Follow-up Consultation', status: 'Completed' },
        { id: 2, name: 'Priya Patel', ageGender: '28 / Female', doctor: 'Dr. Neha Singh', time: '10:00 AM', mode: 'Video Call', reason: 'Test Report Discussion', status: 'Completed' },
        { id: 3, name: 'Amit Kumar', ageGender: '42 / Male', doctor: 'Dr. Rajat Mehta', time: '11:00 AM', mode: 'Video Call', reason: 'Knee Pain Follow-up', status: 'Scheduled' },
        { id: 4, name: 'Sunita Devi', ageGender: '30 / Female', doctor: 'Dr. Pooja Sharma', time: '11:30 AM', mode: 'Video Call', reason: 'Pregnancy Consultation', status: 'Scheduled' },
        { id: 5, name: 'Vikram Singh', ageGender: '50 / Male', doctor: 'Dr. Sandeep Rao', time: '02:00 PM', mode: 'Video Call', reason: 'Neurology Follow-up', status: 'Cancelled' },
    ]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Completed': return 'text-green-600 bg-green-50 border-green-200';
            case 'Scheduled': return 'text-sky-600 bg-sky-50 border-sky-200';
            case 'Cancelled': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const columns = [
        { name: 'Patient Name', selector: (row: any) => row.name, width: '180px', cell: (row: any) => <span className="font-bold text-blue-600">{row.name}</span> },
        { name: 'Age / Gender', selector: (row: any) => row.ageGender, width: '140px' },
        { name: 'Doctor', selector: (row: any) => row.doctor, width: '180px', cell: (row: any) => <span className="font-semibold text-blue-600">{row.doctor}</span> },
        { name: 'Time', selector: (row: any) => row.time, width: '120px', cell: (row: any) => <span className="font-medium text-gray-800">{row.time}</span> },
        { name: 'Mode', selector: (row: any) => row.mode, width: '130px', cell: (row: any) => <span className="font-medium text-blue-600 flex items-center gap-1.5"><Video size={14} /> {row.mode}</span> },
        { name: 'Reason', selector: (row: any) => row.reason, width: '220px' },
        {
            name: 'Status',
            width: '130px',
            cell: (row: any) => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusStyle(row.status)}`}>
                    {row.status}
                </span>
            )
        },
        {
            name: 'Action',
            center: true,
            width: '80px',
            cell: () => (
                <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                    <Plus size={16} />
                </button>
            )
        }
    ];

    return (
        <div className="flex flex-col gap-4 overflow-hidden h-full">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded shadow-sm border border-gray-100">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-gray-900">Telemedicine Appointments</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <button className="text-gray-400 hover:text-blue-600"><ChevronLeft size={14} /></button>
                        <span className="text-xs text-gray-600 font-medium">21 May 2024, Tuesday</span>
                        <button className="text-gray-400 hover:text-blue-600"><ChevronRight size={14} /></button>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option>All Status</option>
                        <option>Completed</option>
                        <option>Scheduled</option>
                    </select>
                    <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option>All Doctors</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2 border border-blue-200 rounded-lg shadow-sm text-blue-600 text-sm font-medium hover:bg-blue-50 bg-white">
                        <Filter size={16} /> Filters
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
                <div className="grid grid-cols-5 divide-x divide-gray-100">
                    <div className="flex flex-col px-4 first:pl-0">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <Video size={16} className="text-blue-500" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Total Telemedicine</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">18</span>
                    </div>
                    <div className="flex flex-col px-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <Calendar size={16} className="text-sky-500" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Today</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">7</span>
                    </div>
                    <div className="flex flex-col px-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <CheckCircle2 size={16} className="text-green-500" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">6</span>
                    </div>
                    <div className="flex flex-col px-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <CalendarCheck size={16} className="text-amber-500" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Scheduled</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">4</span>
                    </div>
                    <div className="flex flex-col px-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <XCircle size={16} className="text-red-500" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Cancelled</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">1</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <div className="relative w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={14} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
                            placeholder="Search patient by name, UHID..."
                        />
                    </div>
                </div>
                <DataTable
                    columns={columns}
                    data={telemedicine}
                    customStyles={{
                        headRow: { style: { backgroundColor: '#f8fafc', borderBottomWidth: '1px', borderBottomColor: '#f1f5f9', minHeight: '48px' } },
                        headCells: { style: { fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' } },
                        rows: { style: { minHeight: '56px' }, highlightOnHoverStyle: { backgroundColor: '#f8fafc' } },
                        cells: { style: { fontSize: '13px' } }
                    }}
                    highlightOnHover
                    pointerOnHover
                    pagination
                    paginationPerPage={10}
                />
            </div>
        </div>
    );
}