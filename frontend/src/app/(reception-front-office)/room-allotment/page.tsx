"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Bed, Search, RefreshCw, ChevronDown, Filter,
    UserPlus, MoreVertical, CheckCircle, Activity,
    ArrowRightLeft, Bell, Clock, X, Calendar, Download
} from 'lucide-react';
import { roomAllotmentAPI, patientAPI, departmentAPI } from '@/lib/api';
import dayjs from 'dayjs';

// ─── Priority badge ──────────────────────────────────────────────────────────
function PriorityBadge({ priority }: { priority?: string }) {
    const map: Record<string, string> = {
        High:   'bg-red-50 text-red-600 border-red-200',
        Medium: 'bg-amber-50 text-amber-600 border-amber-200',
        Low:    'bg-green-50 text-green-600 border-green-200',
    };
    const p = priority || 'Medium';
    return <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${map[p] || map.Medium}`}>{p}</span>;
}

// ─── Stat card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, border, iconBg }: { label: string; value: any; sub: string; icon: React.ReactNode; border: string; iconBg: string }) {
    return (
        <div className={`bg-white border ${border} rounded-lg p-4 flex items-center gap-3 shadow-sm`}>
            <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>{icon}</div>
            <div>
                <p className="text-[10px] font-semibold text-gray-500">{label}</p>
                <h3 className="text-2xl font-bold text-gray-900 leading-tight">{value}</h3>
                <p className="text-[10px] text-gray-400">{sub}</p>
            </div>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function RoomAllotmentPage() {
    const router = useRouter();

    // Data
    const [currentAllotments, setCurrentAllotments] = useState<any[]>([]);
    const [pendingAllotments, setPendingAllotments] = useState<any[]>([]);
    const [availableRooms, setAvailableRooms] = useState<any[]>([]);
    const [allRooms, setAllRooms] = useState<any[]>([]);
    const [departments, setDepartments] = useState<string[]>([]);
    const [roomTypes, setRoomTypes] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [filterDept, setFilterDept] = useState('All Departments');
    const [filterWard, setFilterWard] = useState('All Wards');
    const [filterFloor, setFilterFloor] = useState('All Floors');
    const [filterType, setFilterType] = useState('All Types');
    const [filterStatus, setFilterStatus] = useState('All Status');
    const [searchTerm, setSearchTerm] = useState('');

    // Allocate form
    const [allocForm, setAllocForm] = useState({
        patientSearch: '',
        patientId: '',
        patientName: '',
        patientAge: '',
        patientGender: '',
        patientDept: '',
        patientAdmitDate: '',
        department: '',
        ward: '',
        bedType: '',
        bedRoom: '',
        allotmentDate: dayjs().format('YYYY-MM-DD'),
        allotmentTime: dayjs().format('HH:mm'),
        remarks: '',
    });
    const [patientResults, setPatientResults] = useState<any[]>([]);
    const [isSearchingPatient, setIsSearchingPatient] = useState(false);
    const [selectedBedInfo, setSelectedBedInfo] = useState<any>(null);
    const [isAllocating, setIsAllocating] = useState(false);
    const [allocError, setAllocError] = useState('');
    const [allocSuccess, setAllocSuccess] = useState('');
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [allotRes, roomsRes] = await Promise.all([
                roomAllotmentAPI.list(1, 200),
                roomAllotmentAPI.available().catch(() => ({ data: { rooms: [] } })),
            ]);

            const allotments: any[] = allotRes.data?.allotments || [];
            const currentOccupied = allotments.filter((a: any) => a.status === 'Occupied' || a.status === 'Admitted');
            const pending = allotments.filter((a: any) => a.status === 'Pending' || a.status === 'Pending Review');
            setCurrentAllotments(currentOccupied);
            setPendingAllotments(pending);

            const rooms: any[] = roomsRes.data?.rooms || [];
            setAvailableRooms(rooms);

            // Fetch all rooms for department/type lists
            const allRoomsRes = await roomAllotmentAPI.getAllRooms().catch(() => ({ data: { rooms: [] } }));
            const ar: any[] = allRoomsRes.data?.rooms || [];
            setAllRooms(ar);
            setDepartments([...new Set(ar.map((r: any) => r.department).filter(Boolean))] as string[]);
            setRoomTypes([...new Set(ar.map((r: any) => r.roomType).filter(Boolean))] as string[]);

        } catch (e) {
            console.error('Error loading room allotment data', e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Patient search
    useEffect(() => {
        if (allocForm.patientSearch.length < 2) { setPatientResults([]); return; }
        const timer = setTimeout(async () => {
            setIsSearchingPatient(true);
            try {
                const res = await patientAPI.search(allocForm.patientSearch);
                setPatientResults(res.data?.patients || []);
            } catch { setPatientResults([]); }
            finally { setIsSearchingPatient(false); }
        }, 300);
        return () => clearTimeout(timer);
    }, [allocForm.patientSearch]);

    // Update bed info when bed is selected
    useEffect(() => {
        if (allocForm.bedRoom) {
            const room = availableRooms.find(r => r.id?.toString() === allocForm.bedRoom || r.roomNumber === allocForm.bedRoom);
            if (room) setSelectedBedInfo(room);
            else setSelectedBedInfo(null);
        } else {
            setSelectedBedInfo(null);
        }
    }, [allocForm.bedRoom, availableRooms]);

    const selectPatient = (patient: any) => {
        setAllocForm(prev => ({
            ...prev,
            patientSearch: patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`.trim(),
            patientId: patient.id,
            patientName: patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`.trim(),
            patientAge: patient.age || patient.dob || '',
            patientGender: patient.gender || '',
            patientDept: patient.department || '',
            patientAdmitDate: patient.admitDate || dayjs().format('DD MMM YYYY, hh:mm A'),
        }));
        setPatientResults([]);
    };

    const filteredRooms = availableRooms.filter(r => {
        if (allocForm.department && r.department !== allocForm.department) return false;
        if (allocForm.bedType && r.roomType !== allocForm.bedType) return false;
        return true;
    });

    const handleAllocate = async () => {
        if (!allocForm.patientId) { setAllocError('Please select a patient.'); return; }
        if (!allocForm.bedRoom) { setAllocError('Please select a bed/room.'); return; }
        setAllocError('');
        setIsAllocating(true);
        try {
            const room = availableRooms.find(r => r.id?.toString() === allocForm.bedRoom);
            if (!room) throw new Error('Room not found');
            await roomAllotmentAPI.create({
                patientId: allocForm.patientId,
                patientName: allocForm.patientName,
                roomId: room.id,
                attendingDoctor: 'Duty Doctor',
                allotmentDate: `${allocForm.allotmentDate}T${allocForm.allotmentTime}:00`,
                additionalNotes: allocForm.remarks,
                status: 'Occupied',
                bed: room.roomNumber,
            });
            setAllocSuccess(`Room ${room.roomNumber} successfully allocated to ${allocForm.patientName}`);
            // Reset form
            setAllocForm({ patientSearch: '', patientId: '', patientName: '', patientAge: '', patientGender: '', patientDept: '', patientAdmitDate: '', department: '', ward: '', bedType: '', bedRoom: '', allotmentDate: dayjs().format('YYYY-MM-DD'), allotmentTime: dayjs().format('HH:mm'), remarks: '' });
            setSelectedBedInfo(null);
            fetchData();
            setTimeout(() => setAllocSuccess(''), 5000);
        } catch (e: any) {
            setAllocError(e.response?.data?.error || 'Failed to allocate bed. Please try again.');
        } finally {
            setIsAllocating(false);
        }
    };

    const handleDischarge = async (allotmentId: string) => {
        try {
            await roomAllotmentAPI.update(allotmentId, { status: 'Discharged' });
            setMenuOpenId(null);
            fetchData();
        } catch (e) { console.error(e); }
    };

    // Filtered current allotments
    const filteredCurrent = currentAllotments.filter(a => {
        if (filterDept !== 'All Departments' && a.department !== filterDept) return false;
        if (filterType !== 'All Types' && a.roomType !== filterType) return false;
        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            return a.patientName?.toLowerCase().includes(q) || a.id?.toLowerCase().includes(q);
        }
        return true;
    });

    const totalBeds = allRooms.length;
    const occupiedCount = currentAllotments.length;
    const availableCount = availableRooms.length;
    const pendingCount = pendingAllotments.length;

    return (
        <div className="min-h-screen bg-[#f8fafc] p-5 -m-6 font-sans">

            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className="mb-4">
                <div className="flex items-center text-[11px] text-gray-400 gap-1 mb-1">
                    <span>Home</span><span>›</span><span>IPD Management</span><span>›</span>
                    <span className="text-gray-600 font-medium">Room Allotment</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">Room Allotment</h1>
            </div>

            {/* ── Stat Cards ──────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
                <StatCard label="Total Beds" value={isLoading ? '...' : totalBeds} sub="All Departments" icon={<Bed size={18} className="text-blue-600" />} border="border-blue-100" iconBg="bg-blue-50" />
                <StatCard label="Occupied Beds" value={isLoading ? '...' : occupiedCount} sub={`${totalBeds > 0 ? Math.round(occupiedCount / totalBeds * 100) : 0}% Occupied`} icon={<CheckCircle size={18} className="text-green-600" />} border="border-green-100" iconBg="bg-green-50" />
                <StatCard label="Available Beds" value={isLoading ? '...' : availableCount} sub={`${totalBeds > 0 ? Math.round(availableCount / totalBeds * 100) : 0}% Available`} icon={<Activity size={18} className="text-cyan-600" />} border="border-cyan-100" iconBg="bg-cyan-50" />
                <StatCard label="Pending Allotments" value={isLoading ? '...' : pendingCount} sub="Requires Allotment" icon={<Bell size={18} className="text-amber-600" />} border="border-amber-100" iconBg="bg-amber-50" />
                <StatCard label="Transfers Today" value="0" sub="Room Transfers" icon={<ArrowRightLeft size={18} className="text-purple-600" />} border="border-purple-100" iconBg="bg-purple-50" />
            </div>

            {/* ── Filter Bar ──────────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-100 rounded-lg px-4 py-3 mb-5 shadow-sm flex flex-wrap gap-3 items-center">
                {[
                    { label: 'All Departments', val: filterDept, set: setFilterDept, opts: departments },
                    { label: 'All Wards', val: filterWard, set: setFilterWard, opts: [] },
                    { label: 'All Floors', val: filterFloor, set: setFilterFloor, opts: [] },
                    { label: 'All Types', val: filterType, set: setFilterType, opts: roomTypes },
                    { label: 'All Status', val: filterStatus, set: setFilterStatus, opts: ['Available', 'Occupied', 'Reserved'] },
                ].map(({ label, val, set, opts }) => (
                    <div key={label} className="relative">
                        <select value={val} onChange={e => set(e.target.value)}
                            className="appearance-none pl-3 pr-7 py-1.5 border border-gray-200 rounded-md text-[12px] bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-100">
                            <option>{label}</option>
                            {opts.map(o => <option key={o}>{o}</option>)}
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                ))}
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search by patient name, UHID, IPD No."
                        className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-100" />
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-blue-200 bg-blue-50 text-blue-600 rounded-md text-[12px] font-semibold hover:bg-blue-100 transition-colors">
                    <Filter size={13} /> Filters
                </button>
            </div>

            {/* ── Two-column split: Pending + Current ─────────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">

                {/* Pending Allotments */}
                <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-[13px] font-bold text-gray-800 flex items-center gap-2">
                                Pending Allotments
                                <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{pendingCount}</span>
                            </h2>
                            <p className="text-[11px] text-gray-400">Patients waiting for bed/room allotment</p>
                        </div>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                {['#', 'IPD No.', 'Patient Name', 'Department', 'Admission Date & Time', 'Priority', 'Action'].map(h => (
                                    <th key={h} className="px-3 py-2.5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={7} className="text-center py-8 text-gray-400 text-sm"><RefreshCw size={16} className="animate-spin inline mr-2" />Loading...</td></tr>
                            ) : pendingAllotments.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-10 text-gray-400 text-sm">No pending allotments</td></tr>
                            ) : pendingAllotments.map((p, i) => (
                                <tr key={p.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                                    <td className="px-3 py-3 text-[12px] text-gray-500">{i + 1}</td>
                                    <td className="px-3 py-3 text-[12px] text-gray-700 font-medium">IPD-{p.id?.substring(0, 6).toUpperCase()}</td>
                                    <td className="px-3 py-3">
                                        <span className="text-[12px] text-blue-600 font-semibold cursor-pointer hover:underline">{p.patientName}</span>
                                    </td>
                                    <td className="px-3 py-3 text-[12px] text-gray-600">{p.department || 'N/A'}</td>
                                    <td className="px-3 py-3 text-[11px] text-gray-500 whitespace-nowrap">
                                        {p.allotmentDate ? dayjs(p.allotmentDate).format('DD MMM YYYY, hh:mm A') : '—'}
                                    </td>
                                    <td className="px-3 py-3"><PriorityBadge priority="Medium" /></td>
                                    <td className="px-3 py-3">
                                        <button onClick={() => { setAllocForm(prev => ({ ...prev, patientId: p.patientId, patientName: p.patientName, patientSearch: p.patientName })); window.scrollTo({ top: 9999, behavior: 'smooth' }); }}
                                            className="px-3 py-1 bg-blue-600 text-white rounded-md text-[11px] font-bold hover:bg-blue-700 transition-colors">
                                            Allocate
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {pendingAllotments.length > 0 && (
                        <div className="px-4 py-2 border-t border-gray-100">
                            <button className="text-[12px] text-blue-600 font-semibold flex items-center gap-1 hover:underline">
                                View all pending allotments →
                            </button>
                        </div>
                    )}
                </div>

                {/* Current Allotments */}
                <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-[13px] font-bold text-gray-800 flex items-center gap-2">
                                Current Allotments
                                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{filteredCurrent.length}</span>
                            </h2>
                            <p className="text-[11px] text-gray-400">Currently allotted beds/rooms</p>
                        </div>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-md text-[11px] font-semibold hover:bg-gray-50 transition-colors">
                            <Download size={13} /> Export
                        </button>
                    </div>
                    <div className="overflow-auto max-h-[380px]">
                        <table className="w-full">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    {['#', 'IPD No.', 'Patient Name', 'Department', 'Ward / Room / Bed', 'Bed Type', 'Allotted On', 'Action'].map(h => (
                                        <th key={h} className="px-3 py-2.5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan={8} className="text-center py-8 text-gray-400 text-sm"><RefreshCw size={16} className="animate-spin inline mr-2" />Loading...</td></tr>
                                ) : filteredCurrent.length === 0 ? (
                                    <tr><td colSpan={8} className="text-center py-10 text-gray-400 text-sm">No current allotments</td></tr>
                                ) : filteredCurrent.map((a, i) => (
                                    <tr key={a.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                                        <td className="px-3 py-3 text-[12px] text-gray-500">{i + 1}</td>
                                        <td className="px-3 py-3 text-[12px] text-gray-700 font-medium">IPD-{a.id?.substring(0, 6).toUpperCase()}</td>
                                        <td className="px-3 py-3">
                                            <button onClick={() => router.push(`/admissions/ipd/add?mode=view&id=${a.id}`)}
                                                className="text-[12px] text-blue-600 font-semibold hover:underline text-left">
                                                {a.patientName}
                                            </button>
                                        </td>
                                        <td className="px-3 py-3 text-[12px] text-gray-600">{a.department || a.room?.department || 'N/A'}</td>
                                        <td className="px-3 py-3 text-[12px] text-gray-700">{a.roomNumber || a.room?.roomNumber || '—'} / {a.bed || 'A'}</td>
                                        <td className="px-3 py-3 text-[12px] text-gray-600">{a.roomType || a.room?.roomType || 'General'}</td>
                                        <td className="px-3 py-3 text-[11px] text-gray-500 whitespace-nowrap">
                                            {a.allotmentDate ? dayjs(a.allotmentDate).format('DD MMM YYYY, hh:mm A') : '—'}
                                        </td>
                                        <td className="px-3 py-3 relative">
                                            <button onClick={() => setMenuOpenId(menuOpenId === a.id ? null : a.id)}
                                                className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400">
                                                <MoreVertical size={15} />
                                            </button>
                                            {menuOpenId === a.id && (
                                                <div className="absolute right-4 top-8 z-50 bg-white border border-gray-200 rounded-lg shadow-xl py-1 min-w-[160px]">
                                                    <button onClick={() => { router.push(`/admissions/ipd/add?mode=view&id=${a.id}`); setMenuOpenId(null); }}
                                                        className="w-full text-left px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-50">View Details</button>
                                                    <button onClick={() => { router.push(`/admissions/ipd/add?mode=edit&id=${a.id}`); setMenuOpenId(null); }}
                                                        className="w-full text-left px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-50">Edit Allotment</button>
                                                    <div className="border-t border-gray-100 my-1" />
                                                    <button onClick={() => handleDischarge(a.id)}
                                                        className="w-full text-left px-4 py-2 text-[12px] text-red-600 hover:bg-red-50">Discharge Patient</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination stub */}
                    {filteredCurrent.length > 0 && (
                        <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                            <span>Showing 1 to {Math.min(filteredCurrent.length, 10)} of {filteredCurrent.length} entries</span>
                            <div className="flex gap-1">
                                {[1, 2, 3].map(n => (
                                    <button key={n} className={`w-6 h-6 rounded text-[11px] font-semibold ${n === 1 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>{n}</button>
                                ))}
                                <span className="px-1">...</span>
                                <button className="w-6 h-6 rounded text-[11px] text-gray-500 hover:bg-gray-100">›</button>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>Rows per page</span>
                                <select className="border border-gray-200 rounded text-[11px] px-1 py-0.5"><option>10</option><option>20</option></select>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Allocate Room/Bed Form ──────────────────────────────────────── */}
            <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="text-[13px] font-bold text-gray-800">Allocate Room / Bed</h2>
                    <p className="text-[11px] text-gray-400 mt-0.5">Select patient and available bed to allocate</p>
                </div>

                {allocSuccess && (
                    <div className="mx-5 mt-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-[12px] text-green-700 flex items-center gap-2">
                        <CheckCircle size={15} /> {allocSuccess}
                    </div>
                )}
                {allocError && (
                    <div className="mx-5 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-700 flex items-center gap-2">
                        <X size={15} className="shrink-0" /> {allocError}
                    </div>
                )}

                <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">

                        {/* Select Patient */}
                        <div className="lg:col-span-1 relative">
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Select Patient <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    value={allocForm.patientSearch}
                                    onChange={e => setAllocForm(prev => ({ ...prev, patientSearch: e.target.value, patientId: '', patientName: '' }))}
                                    placeholder="Search by patient name, UHID, IPD No. or Mobile"
                                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                                {isSearchingPatient && <RefreshCw size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />}
                            </div>
                            {/* Patient dropdown results */}
                            {patientResults.length > 0 && (
                                <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-auto">
                                    {patientResults.map(p => (
                                        <button key={p.id} onClick={() => selectPatient(p)}
                                            className="w-full text-left px-3 py-2 hover:bg-blue-50 text-[12px] border-b border-gray-50 last:border-0">
                                            <div className="font-semibold text-gray-800">{p.name || `${p.firstName} ${p.lastName}`}</div>
                                            <div className="text-gray-400 text-[10px]">{p.uhid || p.id} · {p.mobile}</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Department */}
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Department <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select value={allocForm.department} onChange={e => setAllocForm(prev => ({ ...prev, department: e.target.value, bedRoom: '' }))}
                                    className="appearance-none w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-100">
                                    <option value="">Select Department</option>
                                    {departments.map(d => <option key={d}>{d}</option>)}
                                </select>
                                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Ward / Room */}
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Ward / Room <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select value={allocForm.ward} onChange={e => setAllocForm(prev => ({ ...prev, ward: e.target.value }))}
                                    className="appearance-none w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-100">
                                    <option value="">Select Ward / Room</option>
                                    {filteredRooms.map(r => <option key={r.id} value={r.id}>{r.roomNumber} – {r.department}</option>)}
                                </select>
                                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Bed Type */}
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Bed Type <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select value={allocForm.bedType} onChange={e => setAllocForm(prev => ({ ...prev, bedType: e.target.value, bedRoom: '' }))}
                                    className="appearance-none w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-100">
                                    <option value="">Select Type</option>
                                    {roomTypes.map(t => <option key={t}>{t}</option>)}
                                </select>
                                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Bed / Room */}
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Bed / Room <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select value={allocForm.bedRoom} onChange={e => setAllocForm(prev => ({ ...prev, bedRoom: e.target.value }))}
                                    className="appearance-none w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-100">
                                    <option value="">Select Bed / Room</option>
                                    {filteredRooms.map(r => <option key={r.id} value={r.id?.toString()}>{r.roomNumber}</option>)}
                                </select>
                                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Allotment Date & Time */}
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Allotment Date & Time</label>
                            <div className="flex gap-1">
                                <div className="relative flex-1">
                                    <input type="date" value={allocForm.allotmentDate} onChange={e => setAllocForm(prev => ({ ...prev, allotmentDate: e.target.value }))}
                                        className="w-full px-2 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-100" />
                                </div>
                                <input type="time" value={allocForm.allotmentTime} onChange={e => setAllocForm(prev => ({ ...prev, allotmentTime: e.target.value }))}
                                    className="w-24 px-2 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-100" />
                            </div>
                        </div>
                    </div>

                    {/* Patient Card + Bed Info + Remarks ── second row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

                        {/* Patient info card */}
                        {allocForm.patientId ? (
                            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                                    {(allocForm.patientName || 'P').charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[12px] font-semibold text-gray-800 truncate">{allocForm.patientName}</span>
                                        <button onClick={() => setAllocForm(prev => ({ ...prev, patientId: '', patientName: '', patientSearch: '' }))} className="text-gray-400 hover:text-red-500">
                                            <X size={12} />
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-gray-500">{allocForm.patientDept || 'Department N/A'}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Admission: {allocForm.patientAdmitDate || '—'}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="border border-dashed border-gray-200 rounded-lg p-3 flex items-center justify-center text-[11px] text-gray-400">
                                No patient selected
                            </div>
                        )}

                        {/* Selected Bed Info */}
                        {selectedBedInfo ? (
                            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                <p className="text-[10px] font-semibold text-gray-500 mb-1">Selected Bed Information</p>
                                <div className="flex flex-wrap gap-4 text-[11px] text-gray-600">
                                    <span><span className="text-gray-400">Bed No. </span><span className="font-semibold">{selectedBedInfo.roomNumber}</span></span>
                                    <span><span className="text-gray-400">Ward: </span><span className="font-semibold">{selectedBedInfo.department}</span></span>
                                    <span><span className="text-gray-400">Bed Type: </span><span className="font-semibold">{selectedBedInfo.roomType}</span></span>
                                    <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded border border-green-200 font-semibold text-[10px]">Available</span>
                                </div>
                            </div>
                        ) : (
                            <div className="border border-dashed border-gray-200 rounded-lg p-3 flex items-center justify-center text-[11px] text-gray-400">
                                No bed selected
                            </div>
                        )}

                        {/* Remarks */}
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Remarks (Optional)</label>
                            <textarea value={allocForm.remarks} onChange={e => setAllocForm(prev => ({ ...prev, remarks: e.target.value }))}
                                placeholder="Enter remarks..."
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none" />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                        <button onClick={() => {
                            setAllocForm({ patientSearch: '', patientId: '', patientName: '', patientAge: '', patientGender: '', patientDept: '', patientAdmitDate: '', department: '', ward: '', bedType: '', bedRoom: '', allotmentDate: dayjs().format('YYYY-MM-DD'), allotmentTime: dayjs().format('HH:mm'), remarks: '' });
                            setSelectedBedInfo(null); setAllocError('');
                        }} className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-[13px] font-semibold hover:bg-gray-50 transition-colors">
                            Reset
                        </button>
                        <button onClick={handleAllocate} disabled={isAllocating}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-[13px] font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
                            {isAllocating ? <RefreshCw size={15} className="animate-spin" /> : <Bed size={15} />}
                            {isAllocating ? 'Allocating...' : 'Allocate Bed'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Click-outside to close dropdown menus */}
            {menuOpenId && <div className="fixed inset-0 z-40" onClick={() => setMenuOpenId(null)} />}
        </div>
    );
}