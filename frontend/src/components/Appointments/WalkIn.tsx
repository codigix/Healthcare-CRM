"use client";

import { useState } from "react";
import DataTable from "react-data-table-component";
import {
    Users, ChevronLeft, ChevronRight, Search, Plus,
    CheckCircle2, Clock, CalendarCheck, Activity
} from "lucide-react";

export default function WalkIn() {
    const [walkIns] = useState([
        { id: 1, name: 'Rohit Verma', ageGender: '35 / Male', mobile: '+91 98765 43211', dept: 'General Medicine', doctor: 'Dr. Amit Verma', time: '08:20 AM', status: 'In Consultation' },
        { id: 2, name: 'Kavita Rani', ageGender: '28 / Female', mobile: '+91 98765 43212', dept: 'Gynecology', doctor: 'Dr. Pooja Sharma', time: '09:45 AM', status: 'Checked-in' },
        { id: 3, name: 'Manoj Singh', ageGender: '45 / Male', mobile: '+91 98765 43213', dept: 'Orthopedics', doctor: 'Dr. Rajat Mehta', time: '10:10 AM', status: 'Waiting' },
        { id: 4, name: 'Neelam Joshi', ageGender: '31 / Female', mobile: '+91 98765 43214', dept: 'Dermatology', doctor: 'Dr. Anjali Gupta', time: '10:30 AM', status: 'Pending' },
        { id: 5, name: 'Suresh Yadav', ageGender: '52 / Male', mobile: '+91 98765 43215', dept: 'Cardiology', doctor: 'Dr. Neha Singh', time: '11:00 AM', status: 'Completed' },
    ]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Completed': return 'text-green-600 bg-green-50 border-green-200';
            case 'In Consultation': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'Checked-in': return 'text-sky-600 bg-sky-50 border-sky-200';
            case 'Waiting':
            case 'Pending': return 'text-amber-600 bg-amber-50 border-amber-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const columns = [
        { name: 'Patient Name', selector: (row: any) => row.name, width: '200px', cell: (row: any) => <span className="font-bold text-blue-600">{row.name}</span> },
        { name: 'Age / Gender', selector: (row: any) => row.ageGender, width: '150px' },
        { name: 'Mobile Number', selector: (row: any) => row.mobile, width: '160px' },
        { name: 'Department', selector: (row: any) => row.dept, width: '160px' },
        { name: 'Doctor', selector: (row: any) => row.doctor, width: '180px', cell: (row: any) => <span className="font-semibold text-blue-600">{row.doctor}</span> },
        { name: 'Check-In Time', selector: (row: any) => row.time, width: '160px', cell: (row: any) => <span className="font-medium text-gray-800">{row.time}</span> },
        {
            name: 'Status',
            width: '150px',
            cell: (row: any) => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusStyle(row.status)}`}>
                    {row.status}
                </span>
            )
        },
        {
            name: 'Action',
            center: true,
            width: '100px',
            cell: () => (
                <div className="flex gap-2">
                    <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <Plus size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col gap-4 overflow-hidden h-full">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded shadow-sm border border-gray-100">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-gray-900">Walk-In Patients</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <button className="text-gray-400 hover:text-blue-600"><ChevronLeft size={14} /></button>
                        <span className="text-xs text-gray-600 font-medium">21 May 2024, Tuesday</span>
                        <button className="text-gray-400 hover:text-blue-600"><ChevronRight size={14} /></button>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={14} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 sm:text-sm shadow-sm"
                            placeholder="Search patient by name, mobile..."
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm text-sm font-medium hover:bg-blue-700">
                        <Plus size={16} /> Add Walk-In Patient
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
                <div className="grid grid-cols-5 divide-x divide-gray-100">
                    <div className="flex flex-col px-4 first:pl-0">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <Users size={16} className="text-blue-500" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Total Walk-ins</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">24</span>
                    </div>
                    <div className="flex flex-col px-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <CalendarCheck size={16} className="text-sky-500" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Checked-in</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">10</span>
                    </div>
                    <div className="flex flex-col px-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <Activity size={16} className="text-blue-500" />
                            <span className="text-xs font-semibold uppercase tracking-wider">In Consultation</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">6</span>
                    </div>
                    <div className="flex flex-col px-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <CheckCircle2 size={16} className="text-green-500" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">5</span>
                    </div>
                    <div className="flex flex-col px-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <Clock size={16} className="text-amber-500" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Pending</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">3</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
                <DataTable
                    columns={columns}
                    data={walkIns}
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