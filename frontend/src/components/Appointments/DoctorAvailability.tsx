"use client";

import { useState } from "react";
import DataTable from "react-data-table-component";
import {
    Calendar, ChevronLeft, ChevronRight, Filter, Search, Plus,
    User, ArrowRight, Activity, Clock, Users, CheckCircle2, XCircle
} from "lucide-react";

export default function DoctorAvailability() {
    const [doctors] = useState([
        { id: 1, name: 'Dr. Neha Singh', dept: 'Cardiology', avail: '09:00 AM - 01:00 PM', break: '01:00 PM - 02:00 PM', status: 'Available' },
        { id: 2, name: 'Dr. Amit Verma', dept: 'General Medicine', avail: '09:00 AM - 05:00 PM', break: '01:00 PM - 02:00 PM', status: 'Available' },
        { id: 3, name: 'Dr. Pooja Sharma', dept: 'Gynecology', avail: '10:00 AM - 04:00 PM', break: '01:30 PM - 02:30 PM', status: 'Available' },
        { id: 4, name: 'Dr. Rajat Mehta', dept: 'Orthopedics', avail: '09:00 AM - 05:00 PM', break: '01:00 PM - 02:00 PM', status: 'Busy' },
        { id: 5, name: 'Dr. Sandeep Rao', dept: 'Neurology', avail: '11:00 AM - 07:00 PM', break: '02:00 PM - 03:00 PM', status: 'On Leave' },
        { id: 6, name: 'Dr. Anjali Gupta', dept: 'Dermatology', avail: '09:00 AM - 02:00 PM', break: '01:00 PM - 02:00 PM', status: 'Busy' },
        { id: 7, name: 'Dr. Karan Malhotra', dept: 'ENT', avail: '10:00 AM - 05:00 PM', break: '01:00 PM - 02:00 PM', status: 'Busy' },
        { id: 8, name: 'Dr. Meera Joshi', dept: 'Pediatrics', avail: '09:00 AM - 01:00 PM', break: '01:00 PM - 02:00 PM', status: 'Available' },
    ]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Available': return 'text-green-600 bg-green-50 border-green-200';
            case 'Busy': return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'On Leave': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const columns = [
        {
            name: 'Doctor',
            width: '250px',
            cell: (row: any) => (
                <div className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User size={16} />
                    </div>
                    <span className="font-semibold text-gray-900">{row.name}</span>
                </div>
            )
        },
        { name: 'Department', selector: (row: any) => row.dept, width: '200px', cell: (row: any) => <span className="text-gray-600 font-medium">{row.dept}</span> },
        { name: 'Available Time', selector: (row: any) => row.avail, width: '200px', cell: (row: any) => <span className="text-gray-700 font-medium">{row.avail}</span> },
        { name: 'Break Time', selector: (row: any) => row.break, width: '200px', cell: (row: any) => <span className="text-gray-500 font-medium">{row.break}</span> },
        {
            name: 'Status',
            width: '150px',
            cell: (row: any) => (
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(row.status)}`}>
                    {row.status}
                </span>
            )
        },
        {
            name: 'Action',
            center: true,
            width: '100px',
            cell: () => (
                <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
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
                    <h1 className="text-xl font-bold text-gray-900">Doctor Availability</h1>
                    <span className="text-xs text-gray-500 font-medium mt-1">21 May 2024, Tuesday</span>
                </div>
                <div className="flex items-center gap-3">
                    <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option>All Departments</option>
                        <option>Cardiology</option>
                        <option>Neurology</option>
                    </select>
                    <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option>All Status</option>
                        <option>Available</option>
                        <option>Busy</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg shadow-sm text-gray-700 text-sm font-medium hover:bg-gray-50 bg-white">
                        List View
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-blue-200 rounded-lg shadow-sm text-blue-600 text-sm font-medium hover:bg-blue-50 bg-white">
                        <Filter size={16} /> Filters
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Availability Overview</h3>
                <div className="grid grid-cols-5 divide-x divide-gray-100">
                    <div className="flex flex-col px-4 first:pl-0">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <Users size={16} className="text-blue-500" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Total Doctors</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">48</span>
                    </div>
                    <div className="flex flex-col px-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <CheckCircle2 size={16} className="text-green-500" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Available</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">32</span>
                    </div>
                    <div className="flex flex-col px-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <Clock size={16} className="text-amber-500" />
                            <span className="text-xs font-semibold uppercase tracking-wider">On Leave</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">5</span>
                    </div>
                    <div className="flex flex-col px-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <Activity size={16} className="text-orange-500" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Busy</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">9</span>
                    </div>
                    <div className="flex flex-col px-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <XCircle size={16} className="text-red-500" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Not Available</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">2</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
                <DataTable
                    columns={columns}
                    data={doctors}
                    customStyles={{
                        headRow: { style: { backgroundColor: '#f8fafc', borderBottomWidth: '1px', borderBottomColor: '#f1f5f9', minHeight: '48px' } },
                        headCells: { style: { fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' } },
                        rows: { style: { minHeight: '60px', '&:hover': { backgroundColor: '#f8fafc' } } },
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
