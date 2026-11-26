"use client";

import React, { useState, useEffect } from 'react';
import {
    Download, Printer, RefreshCw, Plus, Calendar as CalendarIcon,
    ChevronDown, Search, Filter, Users, UserPlus, Bed, FileOutput,
    ClipboardList, Eye, Edit, MoreVertical
} from 'lucide-react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { roomAllotmentAPI } from '@/lib/api';
import dayjs from 'dayjs';

export default function IPDAdmissionsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [allotments, setAllotments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await roomAllotmentAPI.list(1, 100);
            setAllotments(res.data?.allotments || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const columns: TableColumn<any>[] = [
        {
            name: 'IPD No.',
            selector: (row: any) => row.id,
            sortable: true,
            width: '130px',
            cell: (row: any) => <span className="font-semibold text-gray-700">IPD-{row.id.substring(0,6).toUpperCase()}</span>
        },
        {
            name: 'Patient Name',
            width: '180px',
            cell: (row: any) => (
                <div className="flex flex-col py-2">
                    <span className="font-semibold text-blue-600 cursor-pointer hover:underline">{row.patientName}</span>
                    <span className="text-[11px] text-gray-500">{row.patientPhone || '-'}</span>
                </div>
            )
        },
        {
            name: 'Age / Gender',
            width: '150px',
            cell: (row: any) => (
                <div className="flex flex-col py-2">
                    <span className="text-gray-800 text-sm">N/A</span>
                    <span className="text-[11px] text-gray-500">-</span>
                </div>
            )
        },
        {
            name: 'Department',
            width: '180px',
            cell: (row: any) => (
                <div className="flex flex-col py-2">
                    <span className="text-gray-800 text-sm font-medium">{row.department || 'N/A'}</span>
                    <span className="text-[11px] text-gray-500">{row.attendingDoctor || 'N/A'}</span>
                </div>
            )
        },
        {
            name: 'Admission Type',
            width: '180px',
            cell: (row: any) => (
                <div className="flex flex-col py-2">
                    <span className="text-gray-800 text-sm font-medium">Admission</span>
                    <span className="text-[11px] text-gray-500">{dayjs(row.allotmentDate).format('DD MMM, hh:mm A')}</span>
                </div>
            )
        },
        {
            name: 'Room / Bed',
            width: '120px',
            cell: (row: any) => (
                <div className="flex flex-col py-2">
                    <span className="text-gray-800 text-sm font-semibold">{row.roomNumber}</span>
                    <span className="text-[11px] text-gray-500">{row.roomType}</span>
                </div>
            )
        },
        {
            name: 'Status',
            width: '110px',
            cell: (row: any) => {
                let colorClass = '';
                if (row.status === 'Admitted') colorClass = 'bg-green-100 text-green-700 border-green-200';
                else if (row.status === 'Discharged') colorClass = 'bg-blue-100 text-blue-700 border-blue-200';
                else if (row.status === 'Pending') colorClass = 'bg-orange-100 text-orange-700 border-orange-200';

                return (
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${colorClass}`}>
                        {row.status}
                    </span>
                );
            }
        },
        {
            name: 'Expected Discharge',
            width: '150px',
            cell: (row: any) => (
                <div className="flex flex-col py-2">
                    <span className="text-gray-800 text-sm font-medium">{row.expectedDischargeDate ? dayjs(row.expectedDischargeDate).format('DD MMM YYYY') : '-'}</span>
                    <span className="text-[11px] text-gray-500">{row.expectedDischargeDate ? dayjs(row.expectedDischargeDate).format('hh:mm A') : ''}</span>
                </div>
            )
        },
        {
            name: 'Action',
            width: '120px',
            cell: (row: any) => (
                <div className="flex items-center gap-1">
                    <button onClick={() => window.location.href = `/admissions/ipd/add?mode=view&id=${row.id}`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors border border-transparent hover:border-blue-100" title="View">
                        <Eye size={15} />
                    </button>
                    <button onClick={() => window.location.href = `/admissions/ipd/add?mode=edit&id=${row.id}`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors border border-transparent hover:border-blue-100" title="Edit">
                        <Edit size={15} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded transition-colors" title="More">
                        <MoreVertical size={15} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 -m-6 font-sans">
            <div className="bg-white rounded shadow-sm border border-gray-100 p-5">

                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Admission List</h1>
                        <p className="text-xs text-gray-500 mt-1">Manage and view all IPD admissions</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                            <Download size={16} /> Export
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                            <Printer size={16} /> Print
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                            <RefreshCw size={16} /> Refresh
                        </button>
                        <a href="/admissions/ipd/add" className="flex items-center gap-2 px-4 py-2 bg-blue-600 border border-blue-600 rounded-lg text-[13px] font-medium text-white hover:bg-blue-700 transition-colors shadow-sm ml-2">
                            <Plus size={16} /> New Admission
                        </a>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex items-end gap-4 mb-6">
                    <div className="flex flex-col gap-1.5 flex-1 max-w-[240px]">
                        <label className="text-[11px] font-semibold text-gray-600">Date Range</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CalendarIcon size={14} className="text-gray-400" />
                            </div>
                            <input type="text" value="21 May 2024 - 21 May 2024" readOnly className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-white focus:outline-none shadow-sm cursor-pointer" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1 max-w-[200px]">
                        <label className="text-[11px] font-semibold text-gray-600">Department</label>
                        <div className="relative">
                            <select className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-white focus:outline-none shadow-sm appearance-none cursor-pointer">
                                <option>All Departments</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDown size={14} className="text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1 max-w-[200px]">
                        <label className="text-[11px] font-semibold text-gray-600">Admission Type</label>
                        <div className="relative">
                            <select className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-white focus:outline-none shadow-sm appearance-none cursor-pointer">
                                <option>All Types</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDown size={14} className="text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1 max-w-[200px]">
                        <label className="text-[11px] font-semibold text-gray-600">Status</label>
                        <div className="relative">
                            <select className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-white focus:outline-none shadow-sm appearance-none cursor-pointer">
                                <option>All Status</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDown size={14} className="text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5 flex-[1.5]">
                        <label className="text-[11px] font-semibold text-gray-600">Search</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by name, UHID, IPD No."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-3 pr-9 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <Search size={14} className="text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm h-[38px]">
                        <Filter size={14} className="text-blue-500" /> Filters
                    </button>
                </div>

                {/* Metric Cards Row */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 bg-white border border-gray-100 rounded p-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                            <Users size={20} />
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold text-gray-500">Total Admissions</p>
                            <h3 className="text-2xl font-bold text-gray-900 leading-tight">56</h3>
                            <p className="text-[10px] text-gray-400">All Time</p>
                        </div>
                    </div>

                    <div className="flex-1 bg-white border border-gray-100 rounded p-4 shadow-[0_2px_10px_-3px_rgba(16,185,129,0.1)] flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                            <UserPlus size={20} />
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold text-gray-500">Today Admissions</p>
                            <h3 className="text-2xl font-bold text-gray-900 leading-tight">18</h3>
                            <p className="text-[10px] text-green-600 font-medium">↑ 12% from yesterday</p>
                        </div>
                    </div>

                    <div className="flex-1 bg-white border border-gray-100 rounded p-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                            <Bed size={20} />
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold text-gray-500">Currently Admitted</p>
                            <h3 className="text-2xl font-bold text-gray-900 leading-tight">86</h3>
                            <p className="text-[10px] text-gray-400">Active Patients</p>
                        </div>
                    </div>

                    <div className="flex-1 bg-white border border-gray-100 rounded p-4 shadow-[0_2px_10px_-3px_rgba(139,92,246,0.1)] flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                            <FileOutput size={20} />
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold text-gray-500">Discharged (Today)</p>
                            <h3 className="text-2xl font-bold text-gray-900 leading-tight">12</h3>
                            <p className="text-[10px] text-green-600 font-medium">↑ 8% from yesterday</p>
                        </div>
                    </div>

                    <div className="flex-1 bg-orange-50/50 border border-orange-100 rounded p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 shrink-0">
                            <ClipboardList size={20} />
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold text-gray-600">Pending Admissions</p>
                            <h3 className="text-2xl font-bold text-gray-900 leading-tight">6</h3>
                            <p className="text-[10px] text-gray-500">Requires Confirmation</p>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="border border-gray-100 rounded-lg overflow-hidden">
                    <DataTable
                        columns={columns}
                        data={allotments.filter(item =>
                            item.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.id?.toLowerCase().includes(searchTerm.toLowerCase())
                        )}
                        progressPending={isLoading}
                        selectableRows
                        pagination
                        customStyles={{
                            headRow: { style: { backgroundColor: '#fcfcfc', borderBottomWidth: '1px', borderBottomColor: '#f1f5f9', minHeight: '46px' } },
                            headCells: { style: { fontSize: '11px', fontWeight: 700, color: '#334155' } },
                            rows: { style: { minHeight: '60px' }, highlightOnHoverStyle: { backgroundColor: '#f8fafc', cursor: 'pointer' } },
                            cells: { style: { fontSize: '12px' } }
                        }}
                    highlightOnHover
/>
                </div>

            </div>
        </div>
    );
}