"use client";

import { useState } from "react";
import DataTable from "react-data-table-component";
import {
    Users, ChevronLeft, ChevronRight, Filter, Plus,
    CheckCircle2, Clock, CalendarCheck, RefreshCw, Activity, Search
} from "lucide-react";

export default function Queue() {
    const [queue] = useState([
        { id: 1, token: 'T001', name: 'Rahul Sharma', ageGender: '35 / Male', dept: 'Cardiology', doctor: 'Dr. Neha Singh', time: '09:30 AM', status: 'In Consultation', wait: '20 Mins' },
        { id: 2, token: 'T002', name: 'Priya Patel', ageGender: '28 / Female', dept: 'Cardiology', doctor: 'Dr. Neha Singh', time: '09:45 AM', status: 'Checked-in', wait: '10 Mins' },
        { id: 3, token: 'T003', name: 'Amit Kumar', ageGender: '42 / Male', dept: 'Orthopedics', doctor: 'Dr. Rajat Mehta', time: '10:00 AM', status: 'Pending', wait: '25 Mins' },
        { id: 4, token: 'T004', name: 'Sunita Devi', ageGender: '30 / Female', dept: 'Gynecology', doctor: 'Dr. Pooja Sharma', time: '10:15 AM', status: 'Checked-in', wait: '5 Mins' },
        { id: 5, token: 'T005', name: 'Vikram Singh', ageGender: '50 / Male', dept: 'Neurology', doctor: 'Dr. Sandeep Rao', time: '10:30 AM', status: 'Pending', wait: '15 Mins' },
        { id: 6, token: 'T006', name: 'Meera Joshi', ageGender: '12 / Female', dept: 'Pediatrics', doctor: 'Dr. Meera Joshi', time: '10:45 AM', status: 'In Consultation', wait: '30 Mins' },
        { id: 7, token: 'T007', name: 'Ramesh Gupta', ageGender: '60 / Male', dept: 'General Medicine', doctor: 'Dr. Amit Verma', time: '11:00 AM', status: 'Pending', wait: '-' },
        { id: 8, token: 'T008', name: 'Neha Agarwal', ageGender: '27 / Female', dept: 'Dermatology', doctor: 'Dr. Anjali Gupta', time: '11:15 AM', status: 'Pending', wait: '12 Mins' },
    ]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Completed': return 'text-green-600 bg-green-50 border-green-200';
            case 'In Consultation': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'Checked-in': return 'text-sky-600 bg-sky-50 border-sky-200';
            case 'Pending': return 'text-amber-600 bg-amber-50 border-amber-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const columns = [
        { name: 'Token No.', selector: (row: any) => row.token, width: '120px', cell: (row: any) => <span className="font-semibold text-gray-700">{row.token}</span> },
        { name: 'Patient Name', selector: (row: any) => row.name, width: '180px', cell: (row: any) => <span className="font-bold text-blue-600">{row.name}</span> },
        { name: 'Age / Gender', selector: (row: any) => row.ageGender, width: '150px' },
        { name: 'Department', selector: (row: any) => row.dept, width: '150px' },
        { name: 'Doctor', selector: (row: any) => row.doctor, width: '180px', cell: (row: any) => <span className="font-semibold text-blue-600">{row.doctor}</span> },
        { name: 'Appointment Time', selector: (row: any) => row.time, width: '180px', cell: (row: any) => <span className="font-medium text-gray-800">{row.time}</span> },
        {
            name: 'Status',
            width: '150px',
            cell: (row: any) => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusStyle(row.status)}`}>
                    {row.status}
                </span>
            )
        },
        { name: 'Waiting Time', selector: (row: any) => row.wait, width: '130px', cell: (row: any) => <span className="font-medium text-gray-600">{row.wait}</span> },
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
                    <h1 className="text-xl font-bold text-gray-900">Today's Queue</h1>
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
                        <option>All Status</option>
                        <option>Pending</option>
                        <option>In Consultation</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm text-sm font-medium hover:bg-blue-700">
                        <RefreshCw size={16} /> Refresh
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
                <div className="grid grid-cols-5 divide-x divide-gray-100">
                    <div className="flex flex-col px-4 first:pl-0">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <Users size={16} className="text-blue-500" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Total Queue</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">56</span>
                    </div>
                    <div className="flex flex-col px-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <CalendarCheck size={16} className="text-sky-500" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Checked-in</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">18</span>
                    </div>
                    <div className="flex flex-col px-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <Activity size={16} className="text-blue-500" />
                            <span className="text-xs font-semibold uppercase tracking-wider">In Consultation</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">12</span>
                    </div>
                    <div className="flex flex-col px-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <CheckCircle2 size={16} className="text-green-500" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">20</span>
                    </div>
                    <div className="flex flex-col px-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <Clock size={16} className="text-amber-500" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Pending</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">6</span>
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
                    data={queue}
                    customStyles={{
                        headRow: { style: { backgroundColor: '#f8fafc', borderBottomWidth: '1px', borderBottomColor: '#f1f5f9', minHeight: '48px' } },
                        headCells: { style: { fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' } },
                        rows: { style: { minHeight: '56px', '&:hover': { backgroundColor: '#f8fafc' } } },
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