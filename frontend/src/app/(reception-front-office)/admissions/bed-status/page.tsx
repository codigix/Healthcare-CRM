"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Bed, Search, RefreshCw, Download, ChevronDown, ChevronRight,
    Eye, UserPlus, AlertCircle, CheckCircle, Clock, XCircle,
    Activity, TrendingUp, Filter
} from 'lucide-react';
import { bedStatusAPI, roomAllotmentAPI } from '@/lib/api';
import dayjs from 'dayjs';

// ─── Types ──────────────────────────────────────────────────────────────────
interface Room {
    id: number;
    roomNumber: string;
    roomType: string;
    department: string;
    floor: string;
    status: 'Available' | 'Occupied' | 'Reserved' | 'Out of Service' | 'Maintenance';
    capacity?: number;
    allotmentId?: string;
    patientId?: string;
    patientName?: string;
    patientPhone?: string;
    attendingDoctor?: string;
    allotmentDate?: string;
    expectedDischargeDate?: string;
    bed?: string;
    paymentMethod?: string;
}
interface Department { department: string; rooms: Room[]; totalBeds: number; occupied: number; available: number; reserved: number; outOfService: number; occupancyRate: number; }
interface Summary { totalBeds: number; occupied: number; available: number; reserved: number; outOfService: number; occupancyRate: number; }

// ─── Helpers ─────────────────────────────────────────────────────────────────
const statusColor: Record<string, string> = {
    'Available':       'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Occupied':        'bg-blue-50 text-blue-700 border-blue-200',
    'Reserved':        'bg-amber-50 text-amber-700 border-amber-200',
    'Out of Service':  'bg-red-50 text-red-700 border-red-200',
    'Maintenance':     'bg-red-50 text-red-700 border-red-200',
};
const statusDot: Record<string, string> = {
    'Available':      'bg-emerald-500',
    'Occupied':       'bg-blue-500',
    'Reserved':       'bg-amber-500',
    'Out of Service': 'bg-red-500',
    'Maintenance':    'bg-red-500',
};
function OccupancyBar({ pct }: { pct: number }) {
    const col = pct >= 85 ? '#ef4444' : pct >= 65 ? '#f59e0b' : '#10b981';
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div style={{ width: `${pct}%`, background: col }} className="h-full rounded-full transition-all duration-500" />
            </div>
            <span className="text-[11px] font-semibold" style={{ color: col }}>{pct}%</span>
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function BedStatusPage() {
    const router = useRouter();

    const [summary, setSummary] = useState<Summary>({ totalBeds: 0, occupied: 0, available: 0, reserved: 0, outOfService: 0, occupancyRate: 0 });
    const [departments, setDepartments] = useState<Department[]>([]);
    const [allRooms, setAllRooms] = useState<Room[]>([]);
    const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All Status');
    const [filterDept, setFilterDept] = useState('All Departments');
    const [filterType, setFilterType] = useState('All Types');
    const [releasingId, setReleasingId] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await bedStatusAPI.overview();
            const data = res.data;
            setSummary(data.summary || { totalBeds: 0, occupied: 0, available: 0, reserved: 0, outOfService: 0, occupancyRate: 0 });
            setDepartments(data.departments || []);
            setAllRooms(data.rooms || []);
            // Auto-expand first department
            if (data.departments?.length) setExpandedDepts(new Set([data.departments[0].department]));
        } catch (e) {
            console.error('Error fetching bed status', e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const toggleDept = (dept: string) =>
        setExpandedDepts(prev => { const s = new Set(prev); s.has(dept) ? s.delete(dept) : s.add(dept); return s; });

    const handleRelease = async (room: Room) => {
        if (!room.allotmentId) return;
        setReleasingId(room.allotmentId);
        try {
            await roomAllotmentAPI.update(room.allotmentId, { status: 'Discharged' });
            await fetchData();
        } catch (e) { console.error(e); }
        finally { setReleasingId(null); }
    };

    // Filtered rooms for the search pane
    const filteredRooms = allRooms.filter(r => {
        if (filterStatus !== 'All Status' && r.status !== filterStatus) return false;
        if (filterDept !== 'All Departments' && r.department !== filterDept) return false;
        if (filterType !== 'All Types' && r.roomType !== filterType) return false;
        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            return r.roomNumber?.toLowerCase().includes(q) ||
                   r.patientName?.toLowerCase().includes(q) ||
                   r.department?.toLowerCase().includes(q);
        }
        return true;
    });

    const deptNames  = [...new Set(allRooms.map(r => r.department))].filter(Boolean);
    const roomTypes  = [...new Set(allRooms.map(r => r.roomType))].filter(Boolean);

    // Floor-wise overview
    const floorMap: Record<string, { total: number; occ: number }> = {};
    allRooms.forEach(r => {
        const fl = r.floor || 'Ground Floor';
        if (!floorMap[fl]) floorMap[fl] = { total: 0, occ: 0 };
        floorMap[fl].total++;
        if (r.status === 'Occupied') floorMap[fl].occ++;
    });
    const floors = Object.entries(floorMap)
        .map(([name, d]) => ({ name, pct: d.total > 0 ? Math.round((d.occ / d.total) * 100) : 0 }))
        .sort((a, b) => b.pct - a.pct);

    return (
        <div className="min-h-screen bg-[#f8fafc] p-5 -m-6 font-sans">

            {/* ─── Header ─────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Bed Status Overview</h1>
                    <p className="text-[12px] text-gray-500 mt-0.5">Real-time overview of bed occupancy across all departments</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-lg text-[13px] font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                        <Download size={15} /> Export
                    </button>
                    <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-[13px] font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                        <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} /> Refresh
                    </button>
                </div>
            </div>

            {/* ─── Summary Cards ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
                {[
                    { label: 'Total Beds', value: summary.totalBeds, icon: <Bed size={18} />, sub: 'All Departments', color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
                    { label: 'Occupied Beds', value: summary.occupied, icon: <CheckCircle size={18} />, sub: `${summary.occupancyRate}% Occupied`, color: 'bg-green-50 text-green-600', border: 'border-green-100' },
                    { label: 'Available Beds', value: summary.available, icon: <Activity size={18} />, sub: `${summary.totalBeds > 0 ? Math.round((summary.available / summary.totalBeds) * 100) : 0}% Available`, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
                    { label: 'Reserved Beds', value: summary.reserved, icon: <Clock size={18} />, sub: `${summary.totalBeds > 0 ? Math.round((summary.reserved / summary.totalBeds) * 100) : 0}% Reserved`, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
                    { label: 'Out of Service', value: summary.outOfService, icon: <XCircle size={18} />, sub: 'Maintenance / OOS', color: 'bg-red-50 text-red-500', border: 'border-red-100' },
                    { label: 'Occupancy Rate', value: `${summary.occupancyRate}%`, icon: <TrendingUp size={18} />, sub: 'All Departments', color: 'bg-purple-50 text-purple-600', border: 'border-purple-100', isRate: true },
                ].map((card, i) => (
                    <div key={i} className={`bg-white border ${card.border} rounded-lg p-3.5 shadow-sm flex items-center gap-3`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${card.color}`}>
                            {card.icon}
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-semibold text-gray-500 truncate">{card.label}</p>
                            <h3 className="text-xl font-bold text-gray-900 leading-tight">{isLoading ? '...' : card.value}</h3>
                            <p className="text-[10px] text-gray-400 truncate">{card.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ─── Filters Row ────────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-100 rounded-lg px-4 py-3 mb-4 shadow-sm flex flex-wrap gap-3 items-center">
                {/* Department */}
                <div className="relative">
                    <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="appearance-none pl-3 pr-8 py-1.5 border border-gray-200 rounded-md text-[12px] bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-100">
                        <option>All Departments</option>
                        {deptNames.map(d => <option key={d}>{d}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {/* Ward Type */}
                <div className="relative">
                    <select value={filterType} onChange={e => setFilterType(e.target.value)} className="appearance-none pl-3 pr-8 py-1.5 border border-gray-200 rounded-md text-[12px] bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-100">
                        <option>All Types</option>
                        {roomTypes.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {/* Status */}
                <div className="relative">
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="appearance-none pl-3 pr-8 py-1.5 border border-gray-200 rounded-md text-[12px] bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-100">
                        <option>All Status</option>
                        <option>Available</option>
                        <option>Occupied</option>
                        <option>Reserved</option>
                        <option>Out of Service</option>
                    </select>
                    <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {/* Search */}
                <div className="relative flex-1 min-w-[220px]">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search by ward, room, bed no. or patient"
                        className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            </div>

            <div className="flex gap-4">
                {/* ─── Main Table ─────────────────────────────────────────── */}
                <div className="flex-1 min-w-0">
                    <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <h2 className="text-[13px] font-bold text-gray-800">Bed Status by Department</h2>
                        </div>

                        {/* Table Header */}
                        <div className="grid gap-1 px-4 py-2 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wide"
                             style={{ gridTemplateColumns: '2fr 80px 80px 80px 80px 80px 120px 100px' }}>
                            <span>Department / Ward</span>
                            <span>Total Beds</span>
                            <span>Occupied</span>
                            <span>Available</span>
                            <span>Reserved</span>
                            <span>Out of Service</span>
                            <span>Occupancy %</span>
                            <span>Bed Details</span>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-16 text-gray-400 text-sm gap-2">
                                <RefreshCw size={16} className="animate-spin" /> Loading bed status...
                            </div>
                        ) : (searchTerm || filterStatus !== 'All Status' || filterDept !== 'All Departments' || filterType !== 'All Types') ? (
                            // ── Flat filtered view ──────────────────────────────────────
                            filteredRooms.length === 0 ? (
                                <div className="text-center py-12 text-gray-400 text-sm">No rooms match your search criteria</div>
                            ) : filteredRooms.map(room => (
                                <RoomRow key={room.id} room={room} onView={() => room.allotmentId && router.push(`/admissions/ipd/add?mode=view&id=${room.allotmentId}`)}
                                    onAssign={() => router.push(`/admissions/ipd/add?mode=add&roomId=${room.id}`)}
                                    onRelease={() => handleRelease(room)} releasing={releasingId === room.allotmentId} />
                            ))
                        ) : (
                            // ── Department accordion view ───────────────────────────────
                            departments.map(dept => (
                                <div key={dept.department}>
                                    {/* Dept summary row */}
                                    <div
                                        className="grid gap-1 px-4 py-3 cursor-pointer hover:bg-blue-50/50 transition-colors border-b border-gray-100 items-center"
                                        style={{ gridTemplateColumns: '2fr 80px 80px 80px 80px 80px 120px 100px' }}
                                        onClick={() => toggleDept(dept.department)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {expandedDepts.has(dept.department) ? <ChevronDown size={14} className="text-blue-600" /> : <ChevronRight size={14} className="text-gray-400" />}
                                            <span className="font-semibold text-gray-800 text-[13px]">{dept.department}</span>
                                        </div>
                                        <span className="text-[13px] font-semibold text-gray-700">{dept.totalBeds}</span>
                                        <span className="text-[13px] font-semibold text-blue-600">{dept.occupied}</span>
                                        <span className="text-[13px] font-semibold text-emerald-600">{dept.available}</span>
                                        <span className="text-[13px] font-semibold text-amber-600">{dept.reserved}</span>
                                        <span className="text-[13px] font-semibold text-red-500">{dept.outOfService}</span>
                                        <OccupancyBar pct={dept.occupancyRate} />
                                        <button
                                            onClick={e => { e.stopPropagation(); router.push(`/admissions/bed-status?dept=${encodeURIComponent(dept.department)}`); }}
                                            className="px-3 py-1 border border-blue-200 text-blue-600 rounded-md text-[11px] font-semibold hover:bg-blue-50 transition-colors"
                                        >View Details</button>
                                    </div>

                                    {/* Expanded rooms */}
                                    {expandedDepts.has(dept.department) && (
                                        <div className="bg-gray-50/50">
                                            {/* Sub-header */}
                                            <div className="grid gap-1 px-10 py-2 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wide"
                                                 style={{ gridTemplateColumns: '2fr 80px 80px 80px 80px 130px 100px' }}>
                                                <span>Room / Ward</span>
                                                <span>Total Beds</span>
                                                <span>Occupied</span>
                                                <span>Available</span>
                                                <span>Reserved</span>
                                                <span>Bed Numbers</span>
                                                <span>Status</span>
                                            </div>
                                            {dept.rooms.map(room => (
                                                <RoomRow key={room.id} room={room}
                                                    onView={() => room.allotmentId && router.push(`/admissions/ipd/add?mode=view&id=${room.allotmentId}`)}
                                                    onAssign={() => router.push(`/admissions/ipd/add?mode=add&roomId=${room.id}`)}
                                                    onRelease={() => handleRelease(room)}
                                                    releasing={releasingId === room.allotmentId}
                                                    nested
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* ─── Right Sidebar ──────────────────────────────────────────── */}
                <div className="w-[220px] shrink-0 flex flex-col gap-4">

                    {/* Floor Wise Overview */}
                    <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <h3 className="text-[12px] font-bold text-gray-800">Floor Wise Overview</h3>
                        </div>
                        <div className="px-3 py-1">
                            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase pb-2 border-b border-gray-50">
                                <span>Floor</span><span>Occupancy</span>
                            </div>
                            {floors.length === 0 ? (
                                <p className="text-[11px] text-gray-400 py-3 text-center">No floor data</p>
                            ) : floors.map(fl => (
                                <div key={fl.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                    <span className="text-[11px] text-gray-600 font-medium">{fl.name}</span>
                                    <div className="flex items-center gap-2 w-[90px]">
                                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: `${fl.pct}%`, background: fl.pct >= 85 ? '#ef4444' : fl.pct >= 65 ? '#f59e0b' : '#10b981' }} />
                                        </div>
                                        <span className="text-[10px] font-semibold text-gray-500 w-7 text-right">{fl.pct}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <h3 className="text-[12px] font-bold text-gray-800">Bed Status Legend</h3>
                        </div>
                        <div className="px-4 py-3 flex flex-col gap-2.5">
                            {[
                                { label: 'Occupied', count: summary.occupied, pct: summary.occupancyRate, dot: 'bg-blue-500' },
                                { label: 'Available', count: summary.available, pct: summary.totalBeds > 0 ? Math.round(summary.available / summary.totalBeds * 100) : 0, dot: 'bg-emerald-500' },
                                { label: 'Reserved', count: summary.reserved, pct: summary.totalBeds > 0 ? Math.round(summary.reserved / summary.totalBeds * 100) : 0, dot: 'bg-amber-500' },
                                { label: 'Out of Service', count: summary.outOfService, pct: summary.totalBeds > 0 ? Math.round(summary.outOfService / summary.totalBeds * 100) : 0, dot: 'bg-red-500' },
                            ].map(item => (
                                <div key={item.label} className="flex items-center gap-2">
                                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.dot}`} />
                                    <span className="text-[11px] text-gray-600 flex-1">{item.label}</span>
                                    <span className="text-[11px] font-semibold text-gray-700">{item.count} <span className="text-gray-400 font-normal">({item.pct}%)</span></span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Need Help */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 items-start">
                        <AlertCircle size={18} className="text-blue-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[12px] font-bold text-blue-800">Need Help?</p>
                            <p className="text-[11px] text-blue-600">Contact IT Support</p>
                            <p className="text-[11px] font-semibold text-blue-700 mt-0.5">+91 98765 43210</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Room Row ──────────────────────────────────────────────────────────────────
function RoomRow({ room, onView, onAssign, onRelease, releasing, nested = false }: {
    room: Room;
    onView: () => void;
    onAssign: () => void;
    onRelease: () => void;
    releasing: boolean;
    nested?: boolean;
}) {
    const sc = statusColor[room.status] || 'bg-gray-50 text-gray-600 border-gray-200';
    const dot = statusDot[room.status] || 'bg-gray-400';
    const isOccupied = room.status === 'Occupied';
    const isAvailable = room.status === 'Available';

    return (
        <div className={`flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-blue-50/40 transition-colors ${nested ? 'pl-10' : ''}`}>
            {/* Room Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                    <span className="font-semibold text-gray-800 text-[12px]">Room {room.roomNumber}</span>
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${sc}`}>{room.status}</span>
                </div>
                <div className="flex gap-3 mt-0.5 ml-4">
                    <span className="text-[11px] text-gray-400">{room.roomType}</span>
                    {room.floor && <span className="text-[11px] text-gray-400">{room.floor}</span>}
                </div>
            </div>

            {/* Patient info (when occupied) */}
            <div className="w-[160px] shrink-0">
                {isOccupied && room.patientName ? (
                    <div>
                        <p className="text-[12px] font-semibold text-gray-700 truncate">{room.patientName}</p>
                        <p className="text-[11px] text-gray-400">Dr. {room.attendingDoctor || 'N/A'}</p>
                        {room.allotmentDate && (
                            <p className="text-[10px] text-gray-400">Admitted: {dayjs(room.allotmentDate).format('DD MMM')}</p>
                        )}
                    </div>
                ) : (
                    <span className="text-[11px] text-gray-300 italic">{isAvailable ? 'Ready for admission' : '—'}</span>
                )}
            </div>

            {/* Expected Discharge */}
            <div className="w-[90px] shrink-0 text-center">
                {room.expectedDischargeDate ? (
                    <span className="text-[11px] text-gray-600">{dayjs(room.expectedDischargeDate).format('DD MMM YYYY')}</span>
                ) : <span className="text-[11px] text-gray-300">—</span>}
            </div>

            {/* Actions */}
            <div className="flex gap-1.5 shrink-0">
                {isOccupied && room.allotmentId && (
                    <button onClick={onView} title="View Admission" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors border border-transparent hover:border-blue-100">
                        <Eye size={14} />
                    </button>
                )}
                {isAvailable && (
                    <button onClick={onAssign} title="Assign Patient" className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500 text-white rounded-md text-[11px] font-semibold hover:bg-emerald-600 transition-colors">
                        <UserPlus size={12} /> Assign
                    </button>
                )}
                {isOccupied && room.allotmentId && (
                    <button onClick={onRelease} disabled={releasing} title="Release / Discharge" className="flex items-center gap-1 px-2.5 py-1 bg-red-50 border border-red-200 text-red-600 rounded-md text-[11px] font-semibold hover:bg-red-100 transition-colors disabled:opacity-50">
                        {releasing ? '...' : 'Release'}
                    </button>
                )}
            </div>
        </div>
    );
}