"use client";

import { useState } from "react";
import DataTable from "react-data-table-component";
import {
    CalendarCheck, ChevronLeft, ChevronRight, Filter, Search, ArrowRight,
    Calendar, CheckCircle2, AlertCircle, Clock
} from "lucide-react";

export default function FollowUp() {
    const [followUps] = useState([
        { id: 1, name: 'Rahul Sharma', ageGender: '35 / Male', dept: 'Cardiology', doctor: 'Dr. Neha Singh', lastVisit: '10 May 2024', followUp: '21 May 2024', reason: 'ECG Review', status: 'Today' },
        { id: 2, name: 'Priya Patel', ageGender: '28 / Female', dept: 'Cardiology', doctor: 'Dr. Neha Singh', lastVisit: '12 May 2024', followUp: '23 May 2024', reason: 'Medication Review', status: 'This Week' },
        { id: 3, name: 'Amit Kumar', ageGender: '42 / Male', dept: 'Orthopedics', doctor: 'Dr. Rajat Mehta', lastVisit: '05 May 2024', followUp: '21 May 2024', reason: 'X-Ray Review', status: 'Today' },
        { id: 4, name: 'Sunita Devi', ageGender: '30 / Female', dept: 'Gynecology', doctor: 'Dr. Pooja Sharma', lastVisit: '08 May 2024', followUp: '22 May 2024', reason: 'Ultrasound Review', status: 'This Week' },
        { id: 5, name: 'Vikram Singh', ageGender: '50 / Male', dept: 'Neurology', doctor: 'Dr. Sandeep Rao', lastVisit: '01 May 2024', followUp: '20 May 2024', reason: 'MRI Review', status: 'Overdue' },
    ]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Today': return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'This Week': return 'text-sky-600 bg-sky-50 border-sky-200';
            case 'Overdue': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const columns = [
        { name: 'Patient Name', selector: (row: any) => row.name, width: '180px', cell: (row: any) => <span className="font-bold text-blue-600">{row.name}</span> },
        { name: 'Age / Gender', selector: (row: any) => row.ageGender, width: '130px' },
        { name: 'Department', selector: (row: any) => row.dept, width: '150px' },
        { name: 'Doctor', selector: (row: any) => row.doctor, width: '170px', cell: (row: any) => <span className="font-semibold text-blue-600">{row.doctor}</span> },
        { name: 'Last Visit', selector: (row: any) => row.lastVisit, width: '130px', cell: (row: any) => <span className="font-medium text-gray-800">{row.lastVisit}</span> },
        { name: 'Follow-up Date', selector: (row: any) => row.followUp, width: '140px', cell: (row: any) => <span className="font-medium text-gray-800">{row.followUp}</span> },
        { name: 'Reason', selector: (row: any) => row.reason, width: '180px' },
        {
            name: 'Status',
            width: '120px',
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
                    <ArrowRight size={16} />
                </button>
            )
        }
    ];

    return (
        <div className="flex flex-col gap-4 overflow-hidden h-full">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded shadow-sm border border-gray-100">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-gray-900">Follow-up Appointments</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <button className="text-gray-400 hover:text-blue-600"><ChevronLeft size={14} /></button>
                        <span className="text-xs text-gray-600 font-medium">21 May 2024, Tuesday</span>
                        <button className="text-gray-400 hover:text-blue-600"><ChevronRight size={14} /></button>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option>All Departments</option>
                        <option>Cardiology</option>
                        <option>Neurology</option>
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
                <div className="grid grid-cols-4 divide-x divide-gray-100">
                    <div className="flex flex-col px-4 first:pl-0">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <Calendar size={16} className="text-blue-500" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Total Follow-ups</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">32</span>
                    </div>
                    <div className="flex flex-col px-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <Clock size={16} className="text-green-500" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Today</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">8</span>
                    </div>
                    <div className="flex flex-col px-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <CalendarCheck size={16} className="text-sky-500" />
                            <span className="text-xs font-semibold uppercase tracking-wider">This Week</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">20</span>
                    </div>
                    <div className="flex flex-col px-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <AlertCircle size={16} className="text-red-500" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Overdue</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">4</span>
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
                    data={followUps}
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