"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Plus, Download, RefreshCw, Search, Filter, ChevronDown,
    Eye, Edit, Copy, MoreVertical, X, Check, ChevronLeft, ChevronRight, AlertCircle
} from 'lucide-react';
import { transferAPI, roomAllotmentAPI, departmentAPI } from '@/lib/api';
import dayjs from 'dayjs';

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        'Completed':   'bg-green-50 text-green-700 border-green-200',
        'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
        'Pending':     'bg-amber-50 text-amber-700 border-amber-200',
        'Cancelled':   'bg-red-50 text-red-700 border-red-200',
    };
    return (
        <span className={`px-2.5 py-1 rounded text-[11px] font-bold border whitespace-nowrap ${map[status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
            {status}
        </span>
    );
}

// ── Modal: New / Edit Transfer ────────────────────────────────────────────────
interface TransferFormData {
    patientName: string; patientUhid: string; ipdNo: string;
    fromDepartment: string; fromRoom: string; fromBed: string;
    toDepartment: string; toRoom: string; toBed: string;
    reason: string; transferBy: string; notes: string;
    transferDate: string; transferTime: string; status: string;
}
const emptyForm = (): TransferFormData => ({
    patientName: '', patientUhid: '', ipdNo: '',
    fromDepartment: '', fromRoom: '', fromBed: '',
    toDepartment: '', toRoom: '', toBed: '',
    reason: '', transferBy: '', notes: '',
    transferDate: dayjs().format('YYYY-MM-DD'),
    transferTime: dayjs().format('HH:mm'), status: 'Pending',
});

function TransferModal({
    mode, data, departments, availableRooms,
    onClose, onSave
}: {
    mode: 'add' | 'edit' | 'view';
    data: TransferFormData & { id?: string; transferId?: string };
    departments: string[];
    availableRooms: any[];
    onClose: () => void;
    onSave: (form: TransferFormData) => Promise<void>;
}) {
    const [form, setForm] = useState<TransferFormData>({ ...data });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState('');
    const readOnly = mode === 'view';

    const set = (k: keyof TransferFormData, v: string) => setForm(prev => ({ ...prev, [k]: v }));

    const handleSave = async () => {
        if (!form.patientName) { setErr('Patient name is required.'); return; }
        if (!form.fromDepartment || !form.toDepartment) { setErr('From and To department are required.'); return; }
        setSaving(true); setErr('');
        try { await onSave(form); }
        catch (e: any) { setErr(e.response?.data?.error || 'Failed to save.'); setSaving(false); }
    };

    const Field = ({ label, k, type = 'text', opts }: { label: string; k: keyof TransferFormData; type?: string; opts?: string[] }) => (
        <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">{label}</label>
            {opts ? (
                <div className="relative">
                    <select disabled={readOnly} value={form[k]} onChange={e => set(k, e.target.value)}
                        className="appearance-none w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50">
                        <option value="">Select…</option>
                        {opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            ) : (
                <input type={type} disabled={readOnly} value={form[k]} onChange={e => set(k, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50" />
            )}
        </div>
    );

    const reasons = ['Bed Upgrade', 'Critical Condition', 'Physiotherapy', 'Patient Request', 'Doctor Advice', 'Specialist Review', 'Post Surgery Care', 'Fracture Management', 'Palliative Care', 'Deteriorating Condition'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-[15px] font-bold text-gray-900">
                            {mode === 'add' ? 'New Patient Transfer' : mode === 'edit' ? `Edit Transfer – ${data.transferId}` : `View Transfer – ${data.transferId}`}
                        </h2>
                        <p className="text-[11px] text-gray-400 mt-0.5">Fill in the transfer details below</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"><X size={18} /></button>
                </div>

                <div className="px-6 py-4 space-y-4">
                    {/* Patient Section */}
                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                        <p className="text-[11px] font-bold text-blue-700 uppercase tracking-wide mb-3">Patient Information</p>
                        <div className="grid grid-cols-3 gap-3">
                            <Field label="Patient Name *" k="patientName" />
                            <Field label="UHID" k="patientUhid" />
                            <Field label="IPD No." k="ipdNo" />
                        </div>
                    </div>

                    {/* From / To */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                            <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-3">Transfer From</p>
                            <div className="space-y-3">
                                <Field label="Department *" k="fromDepartment" opts={departments} />
                                <div className="grid grid-cols-2 gap-2">
                                    <Field label="Room" k="fromRoom" />
                                    <Field label="Bed" k="fromBed" />
                                </div>
                            </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4">
                            <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-3">Transfer To</p>
                            <div className="space-y-3">
                                <Field label="Department *" k="toDepartment" opts={departments} />
                                <div className="grid grid-cols-2 gap-2">
                                    <Field label="Room" k="toRoom" />
                                    <Field label="Bed" k="toBed" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Reason" k="reason" opts={reasons} />
                        <Field label="Transfer By" k="transferBy" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Transfer Date & Time</label>
                            <div className="flex gap-2">
                                <input type="date" disabled={readOnly} value={form.transferDate} onChange={e => set('transferDate', e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50" />
                                <input type="time" disabled={readOnly} value={form.transferTime} onChange={e => set('transferTime', e.target.value)}
                                    className="w-28 px-3 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50" />
                            </div>
                        </div>
                        {mode === 'edit' && (
                            <Field label="Status" k="status" opts={['Pending', 'In Progress', 'Completed', 'Cancelled']} />
                        )}
                    </div>
                    <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Notes (Optional)</label>
                        <textarea disabled={readOnly} value={form.notes} onChange={e => set('notes', e.target.value)}
                            rows={2} placeholder="Additional transfer notes..."
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none disabled:bg-gray-50" />
                    </div>

                    {err && <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-700"><AlertCircle size={14} />{err}</div>}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
                    <button onClick={onClose} className="px-5 py-2 border border-gray-200 text-gray-700 rounded-lg text-[13px] font-semibold hover:bg-gray-50">
                        {readOnly ? 'Close' : 'Cancel'}
                    </button>
                    {!readOnly && (
                        <button onClick={handleSave} disabled={saving}
                            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-[13px] font-semibold hover:bg-blue-700 disabled:opacity-50">
                            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                            {saving ? 'Saving…' : mode === 'edit' ? 'Update Transfer' : 'Create Transfer'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PatientTransferPage() {
    const router = useRouter();

    const [transfers, setTransfers] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [departments, setDepartments] = useState<string[]>([]);
    const [availableRooms, setAvailableRooms] = useState<any[]>([]);

    // Filters
    const [fromDate, setFromDate] = useState(dayjs().subtract(20, 'day').format('YYYY-MM-DD'));
    const [toDate, setToDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [filterFromDept, setFilterFromDept] = useState('All Departments');
    const [filterToDept, setFilterToDept] = useState('All Departments');
    const [filterStatus, setFilterStatus] = useState('All Status');
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination
    const [page, setPage] = useState(1);
    const limit = 10;

    // Modal
    const [modal, setModal] = useState<null | { mode: 'add' | 'edit' | 'view'; data: any }>(null);

    // Action menu
    const [menuId, setMenuId] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const filters: any = {};
            if (filterStatus !== 'All Status') filters.status = filterStatus;
            if (filterFromDept !== 'All Departments') filters.fromDept = filterFromDept;
            if (filterToDept !== 'All Departments') filters.toDept = filterToDept;
            if (searchTerm) filters.search = searchTerm;
            if (fromDate) filters.fromDate = fromDate;
            if (toDate) filters.toDate = toDate;

            const res = await transferAPI.list(page, limit, filters);
            setTransfers(res.data?.transfers || []);
            setTotal(res.data?.total || 0);
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    }, [page, filterStatus, filterFromDept, filterToDept, searchTerm, fromDate, toDate]);

    // Fetch departments & rooms
    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const [deptRes, roomsRes] = await Promise.all([
                    departmentAPI.list(1, 100),
                    roomAllotmentAPI.getAllRooms().catch(() => ({ data: { rooms: [] } }))
                ]);
                const depts = (deptRes.data?.data || deptRes.data?.departments || []).map((d: any) => d.name || d.departmentName || d);
                setDepartments(depts.filter(Boolean));
                setAvailableRooms(roomsRes.data?.rooms || []);
            } catch { }
        };
        fetchMeta();
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSave = async (form: TransferFormData) => {
        const payload = {
            ...form,
            transferDate: `${form.transferDate}T${form.transferTime}:00`,
        };
        if (modal?.mode === 'edit' && modal.data?.id) {
            await transferAPI.update(modal.data.id, payload);
        } else {
            await transferAPI.create(payload);
        }
        setModal(null);
        fetchData();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this transfer?')) return;
        await transferAPI.delete(id);
        setMenuId(null);
        fetchData();
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        await transferAPI.update(id, { status });
        setMenuId(null);
        fetchData();
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="min-h-screen bg-[#f8fafc] p-5 -m-6 font-sans">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Patient Transfer List</h1>
                    <p className="text-[12px] text-gray-500 mt-0.5">View and manage all patient transfers</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-lg text-[13px] font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                        <Download size={14} /> Export
                    </button>
                    <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-lg text-[13px] font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                        <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh
                    </button>
                    <button onClick={() => setModal({ mode: 'add', data: emptyForm() })}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-[13px] font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                        <Plus size={14} /> New Transfer
                    </button>
                </div>
            </div>

            {/* ── Filter Bar ─────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-100 rounded-lg px-4 py-3 mb-5 shadow-sm flex flex-wrap gap-3 items-center">
                {/* From Date */}
                <div>
                    <label className="block text-[10px] font-semibold text-gray-500 mb-1">From Date</label>
                    <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                        className="px-3 py-1.5 border border-gray-200 rounded-md text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-100" />
                </div>
                {/* To Date */}
                <div>
                    <label className="block text-[10px] font-semibold text-gray-500 mb-1">To Date</label>
                    <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                        className="px-3 py-1.5 border border-gray-200 rounded-md text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-100" />
                </div>
                {/* From Dept */}
                <div>
                    <label className="block text-[10px] font-semibold text-gray-500 mb-1">From Department</label>
                    <div className="relative">
                        <select value={filterFromDept} onChange={e => setFilterFromDept(e.target.value)}
                            className="appearance-none pl-3 pr-7 py-1.5 border border-gray-200 rounded-md text-[12px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 min-w-[150px]">
                            <option>All Departments</option>
                            {departments.map(d => <option key={d}>{d}</option>)}
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>
                {/* To Dept */}
                <div>
                    <label className="block text-[10px] font-semibold text-gray-500 mb-1">To Department</label>
                    <div className="relative">
                        <select value={filterToDept} onChange={e => setFilterToDept(e.target.value)}
                            className="appearance-none pl-3 pr-7 py-1.5 border border-gray-200 rounded-md text-[12px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 min-w-[150px]">
                            <option>All Departments</option>
                            {departments.map(d => <option key={d}>{d}</option>)}
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>
                {/* Status */}
                <div>
                    <label className="block text-[10px] font-semibold text-gray-500 mb-1">Status</label>
                    <div className="relative">
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                            className="appearance-none pl-3 pr-7 py-1.5 border border-gray-200 rounded-md text-[12px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-100">
                            <option>All Status</option>
                            <option>Pending</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                            <option>Cancelled</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>
                {/* Search */}
                <div className="flex-1 min-w-[220px]">
                    <label className="block text-[10px] font-semibold text-gray-500 mb-1">&nbsp;</label>
                    <div className="relative">
                        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search by patient name, UHID, IPD No."
                            className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-100" />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-semibold text-gray-500 mb-1">&nbsp;</label>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 bg-blue-50 text-blue-600 rounded-md text-[12px] font-semibold hover:bg-blue-100 transition-colors">
                        <Filter size={13} /> Filters
                    </button>
                </div>
            </div>

            {/* ── Table ──────────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-auto">
                    <table className="w-full min-w-[1100px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="w-10 px-4 py-3">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                </th>
                                {['Transfer ID', 'Transfer Date & Time', 'Patient Details', 'From', 'To', 'Reason', 'Transfer By', 'Status', 'Action'].map(h => (
                                    <th key={h} className="px-3 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={10} className="text-center py-16 text-gray-400">
                                    <RefreshCw size={18} className="animate-spin inline mr-2" />Loading transfers...
                                </td></tr>
                            ) : transfers.length === 0 ? (
                                <tr><td colSpan={10} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                            <Search size={20} className="text-gray-300" />
                                        </div>
                                        <p className="text-[13px] font-semibold text-gray-500">No transfers found</p>
                                        <p className="text-[12px] text-gray-400">Try adjusting your filters or create a new transfer</p>
                                        <button onClick={() => setModal({ mode: 'add', data: emptyForm() })}
                                            className="mt-2 flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-[12px] font-semibold hover:bg-blue-700">
                                            <Plus size={14} /> New Transfer
                                        </button>
                                    </div>
                                </td></tr>
                            ) : transfers.map((t) => (
                                <tr key={t.id} className="border-b border-gray-50 hover:bg-blue-50/20 transition-colors">
                                    <td className="px-4 py-3">
                                        <input type="checkbox" className="rounded border-gray-300" />
                                    </td>
                                    {/* Transfer ID */}
                                    <td className="px-3 py-3 text-[12px] font-semibold text-gray-700 whitespace-nowrap">
                                        {t.transferId}
                                    </td>
                                    {/* Date & Time */}
                                    <td className="px-3 py-3 text-[12px] text-gray-600 whitespace-nowrap">
                                        <div>{t.transferDate ? dayjs(t.transferDate).format('DD MMM YYYY') : '—'}</div>
                                        <div className="text-[11px] text-gray-400">{t.transferDate ? dayjs(t.transferDate).format('hh:mm A') : ''}</div>
                                    </td>
                                    {/* Patient Details */}
                                    <td className="px-3 py-3">
                                        <div className="text-[12px] font-semibold text-blue-600 hover:underline cursor-pointer"
                                            onClick={() => setModal({ mode: 'view', data: { ...emptyForm(), ...t } })}>
                                            {t.patientName}
                                        </div>
                                        <div className="text-[10px] text-gray-400 mt-0.5">
                                            {t.patientUhid && `${t.patientUhid} / `}{t.ipdNo || ''}
                                        </div>
                                    </td>
                                    {/* From */}
                                    <td className="px-3 py-3">
                                        <div className="text-[12px] font-medium text-gray-800">{t.fromDepartment || '—'}</div>
                                        <div className="text-[11px] text-gray-400">
                                            {[t.fromRoom, t.fromBed].filter(Boolean).join(' / ')}
                                        </div>
                                    </td>
                                    {/* To */}
                                    <td className="px-3 py-3">
                                        <div className="text-[12px] font-medium text-gray-800">{t.toDepartment || '—'}</div>
                                        <div className="text-[11px] text-gray-400">
                                            {[t.toRoom, t.toBed].filter(Boolean).join(' / ')}
                                        </div>
                                    </td>
                                    {/* Reason */}
                                    <td className="px-3 py-3 text-[12px] text-gray-600">{t.reason || '—'}</td>
                                    {/* Transfer By */}
                                    <td className="px-3 py-3 text-[12px] text-gray-600">{t.transferBy || '—'}</td>
                                    {/* Status */}
                                    <td className="px-3 py-3">
                                        <StatusBadge status={t.status} />
                                    </td>
                                    {/* Actions */}
                                    <td className="px-3 py-3">
                                        <div className="flex items-center gap-0.5 relative">
                                            <button onClick={() => setModal({ mode: 'view', data: { ...emptyForm(), ...t } })}
                                                title="View" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                                <Eye size={15} />
                                            </button>
                                            <button onClick={() => setModal({ mode: 'edit', data: { ...emptyForm(), ...t, transferDate: t.transferDate ? dayjs(t.transferDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'), transferTime: t.transferDate ? dayjs(t.transferDate).format('HH:mm') : dayjs().format('HH:mm') } })}
                                                title="Edit" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                                <Edit size={15} />
                                            </button>
                                            <button onClick={() => { navigator.clipboard.writeText(t.transferId || ''); }}
                                                title="Copy ID" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                                <Copy size={15} />
                                            </button>
                                            <button onClick={() => setMenuId(menuId === t.id ? null : t.id)}
                                                className="p-1.5 text-gray-400 hover:bg-gray-100 rounded transition-colors">
                                                <MoreVertical size={15} />
                                            </button>

                                            {/* Dropdown menu */}
                                            {menuId === t.id && (
                                                <div className="absolute right-0 top-8 z-50 bg-white border border-gray-200 rounded-lg shadow-xl py-1 min-w-[170px]">
                                                    {t.status !== 'In Progress' && (
                                                        <button onClick={() => handleStatusUpdate(t.id, 'In Progress')}
                                                            className="w-full text-left px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-50">
                                                            Mark In Progress
                                                        </button>
                                                    )}
                                                    {t.status !== 'Completed' && (
                                                        <button onClick={() => handleStatusUpdate(t.id, 'Completed')}
                                                            className="w-full text-left px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-50">
                                                            Mark Completed
                                                        </button>
                                                    )}
                                                    {t.status !== 'Cancelled' && (
                                                        <button onClick={() => handleStatusUpdate(t.id, 'Cancelled')}
                                                            className="w-full text-left px-4 py-2 text-[12px] text-amber-600 hover:bg-amber-50">
                                                            Cancel Transfer
                                                        </button>
                                                    )}
                                                    <div className="border-t border-gray-100 my-1" />
                                                    <button onClick={() => handleDelete(t.id)}
                                                        className="w-full text-left px-4 py-2 text-[12px] text-red-600 hover:bg-red-50">
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── Pagination ────────────────────────────────────────── */}
                {total > 0 && (
                    <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-[12px] text-gray-500">
                        <span>Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} entries</span>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 disabled:opacity-30 transition-colors">
                                <ChevronLeft size={14} />
                            </button>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                                <button key={n} onClick={() => setPage(n)}
                                    className={`w-7 h-7 rounded text-[12px] font-semibold transition-colors ${n === page ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                                    {n}
                                </button>
                            ))}
                            {totalPages > 5 && <span className="px-1 text-gray-400">…</span>}
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 disabled:opacity-30 transition-colors">
                                <ChevronRight size={14} />
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Rows per page</span>
                            <select className="border border-gray-200 rounded text-[11px] px-1 py-0.5">
                                <option>{limit}</option><option>20</option><option>50</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Modal ──────────────────────────────────────────────────── */}
            {modal && (
                <TransferModal
                    mode={modal.mode}
                    data={modal.data}
                    departments={departments}
                    availableRooms={availableRooms}
                    onClose={() => setModal(null)}
                    onSave={handleSave}
                />
            )}

            {/* Click-outside to close dropdown */}
            {menuId && <div className="fixed inset-0 z-40" onClick={() => setMenuId(null)} />}
        </div>
    );
}