"use client";

import { useState, useEffect } from "react";
import { dashboardAPI } from "@/lib/api";
import {
    Plus,
    Users,
    Bed,
    Calendar,
    UserCircle,
    LogOut,
    IndianRupee,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Activity,
    ClipboardList,
    Printer,
    Search,
    Stethoscope,
    PhoneCall
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import dayjs from "dayjs";
import Link from "next/link";

const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ec4899', '#a855f7', '#64748b'];

export default function ReceptionistDashboard() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [queueTab, setQueueTab] = useState<'opd' | 'billing'>('opd');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await dashboardAPI.reception();
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-[80vh]">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
    );

    if (!data) return <div className="text-white">Failed to load dashboard</div>;

    const { stats, queue, appointmentsList, bedAvailability, walkInVsAppointments, opdByDepartment, recentRegistrations, paymentCollection, footerStats } = data;

    const topCards = [
        { title: "OPD Registrations", value: stats.opd.count, suffix: "Today", trend: stats.opd.percent, icon: ClipboardList, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        { title: "IPD Admissions", value: stats.ipd.count, suffix: "Today", trend: stats.ipd.percent, icon: UserCircle, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
        { title: "Appointments", value: stats.appointments.count, suffix: "Today", trend: stats.appointments.percent, icon: Calendar, color: "text-sky-500", bg: "bg-sky-500/10", border: "border-sky-500/20" },
        { title: "Walk-in Patients", value: stats.walkins.count, suffix: "Today", trend: stats.walkins.percent, icon: UserCircle, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
        { title: "Discharges", value: stats.discharges.count, suffix: "Today", trend: stats.discharges.percent, icon: Bed, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
        { title: "Total Revenue", value: formatCurrency(stats.revenue.amount), suffix: "", trend: stats.revenue.percent, icon: IndianRupee, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", isCurrency: true },
    ];

    const totalOpd = opdByDepartment.reduce((acc: number, val: any) => acc + val.value, 0);

    return (
        <div className="space-y-6 text-gray-800 bg-[#f8fafc] -m-6 p-6 min-h-screen font-sans">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Reception Dashboard</h1>
                    <p className="text-sm text-gray-500">Manage patient flow, appointments, registrations & front office operations</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" placeholder="Search (Ctrl + K)" className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-64 outline-none focus:border-blue-500" />
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                        {dayjs().format('dddd, DD MMM YYYY | hh:mm A')}
                    </div>
                </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {topCards.map((c, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{c.title}</h3>
                            <div className={`p-2 rounded-lg ${c.bg} ${c.color}`}>
                                <c.icon size={18} />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-800">{c.value}</span>
                            {c.suffix && <span className="text-xs text-gray-400">{c.suffix}</span>}
                        </div>
                        <div className="mt-2 flex items-center text-xs">
                            {c.trend >= 0 ? (
                                <span className="text-green-500 flex items-center font-medium"><ArrowUpRight size={14} className="mr-0.5" /> {c.trend}% vs yesterday</span>
                            ) : (
                                <span className="text-red-500 flex items-center font-medium"><ArrowDownRight size={14} className="mr-0.5" /> {Math.abs(c.trend)}% vs yesterday</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column */}
                <div className="lg:col-span-6 space-y-6">
                    {/* Today's Queue */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Today's Queue</h2>
                            <div className="flex gap-4 border-b border-gray-200 w-full ml-4">
                                <button 
                                    className={`pb-2 text-sm font-semibold transition-colors relative ${queueTab === 'opd' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                                    onClick={() => setQueueTab('opd')}
                                >
                                    OPD Queue
                                    {queueTab === 'opd' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-md"></div>}
                                </button>
                                <button 
                                    className={`pb-2 text-sm font-semibold transition-colors relative ${queueTab === 'billing' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                                    onClick={() => setQueueTab('billing')}
                                >
                                    Billing Queue ({queue.billing.length})
                                    {queueTab === 'billing' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-md"></div>}
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="text-xs text-gray-400 uppercase border-b border-gray-100">
                                    <tr>
                                        <th className="pb-3 font-semibold">Token No.</th>
                                        <th className="pb-3 font-semibold">Patient Name</th>
                                        <th className="pb-3 font-semibold">Department</th>
                                        <th className="pb-3 font-semibold">Doctor</th>
                                        <th className="pb-3 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {queueTab === 'opd' && queue.opd.map((q: any, i: number) => (
                                        <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                            <td className="py-3 font-medium text-gray-800">{q.tokenNumber || `OPD-${150+i}`}</td>
                                            <td className="py-3">{q.patient?.name}</td>
                                            <td className="py-3">{q.department || q.doctor?.specialization}</td>
                                            <td className="py-3">{q.doctor?.name}</td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${q.status.toLowerCase().includes('consultation') ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {q.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {queueTab === 'opd' && queue.opd.length === 0 && <tr><td colSpan={5} className="py-4 text-center">No queue data</td></tr>}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 text-right">
                            <Link href="/appointments" className="text-blue-600 text-sm font-semibold hover:underline">View full queue →</Link>
                        </div>
                    </div>

                    {/* Bed Availability */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Bed Availability</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: 'General Beds', key: 'general', icon: Bed },
                                { name: 'Private Rooms', key: 'private', icon: LogOut },
                                { name: 'Deluxe Rooms', key: 'deluxe', icon: Activity },
                                { name: 'ICU Beds', key: 'icu', icon: Activity },
                                { name: 'NICU Beds', key: 'nicu', icon: Activity },
                            ].map((bed, i) => {
                                const stat = bedAvailability[bed.key] || { total: 0, available: 0 };
                                const pct = stat.total > 0 ? (stat.available / stat.total) * 100 : 0;
                                return (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 w-1/3">
                                            <bed.icon size={16} className="text-gray-400" />
                                            <span className="text-sm text-gray-600 font-medium">{bed.name}</span>
                                        </div>
                                        <div className="w-1/3 flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-800">{stat.available}</span>
                                            <span className="text-xs text-gray-400">/ {stat.total}</span>
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden ml-2">
                                                <div className="h-full bg-green-500 rounded-full" style={{ width: `${pct}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="w-1/4 text-right text-sm font-semibold text-green-600">Available</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 text-left">
                            <Link href="/room-allotment" className="text-blue-600 text-sm font-semibold hover:underline">View all beds →</Link>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-6 space-y-6">
                    {/* Today's Appointments */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Today's Appointments</h2>
                            <Link href="/appointments" className="text-blue-600 text-sm font-semibold hover:underline">View all</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="text-xs text-gray-400 uppercase border-b border-gray-100">
                                    <tr>
                                        <th className="pb-3 font-semibold">Time</th>
                                        <th className="pb-3 font-semibold">Patient Name</th>
                                        <th className="pb-3 font-semibold">Department</th>
                                        <th className="pb-3 font-semibold">Doctor</th>
                                        <th className="pb-3 font-semibold">Type</th>
                                        <th className="pb-3 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointmentsList.map((a: any, i: number) => (
                                        <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                            <td className="py-3">{a.time}</td>
                                            <td className="py-3 font-medium text-gray-800">{a.patient?.name}</td>
                                            <td className="py-3">{a.department || a.doctor?.specialization}</td>
                                            <td className="py-3">{a.doctor?.name}</td>
                                            <td className="py-3 capitalize">{a.visitType}</td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${a.status === 'Completed' ? 'bg-green-100 text-green-700' : a.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {a.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {appointmentsList.length === 0 && <tr><td colSpan={6} className="py-4 text-center">No appointments today</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Chart: Walk-in vs Appt */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-base font-bold text-gray-800">Patient Walk-in vs Appointments</h2>
                                <select className="text-xs border border-gray-200 rounded p-1 text-gray-500 outline-none"><option>This Week</option></select>
                            </div>
                            <div className="flex gap-4 mb-2 justify-center text-xs font-semibold">
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Walk-in Patients</div>
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div> Appointments</div>
                            </div>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={walkInVsAppointments} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Line type="monotone" dataKey="walkIn" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                        <Line type="monotone" dataKey="appointments" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#fff' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Chart: OPD by Dept */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-base font-bold text-gray-800">OPD by Department</h2>
                            </div>
                            <div className="flex items-center h-48 relative">
                                <div className="w-1/2 h-full relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={opdByDepartment} innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                                                {opdByDepartment.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-xl font-bold text-gray-800 leading-none">{totalOpd}</span>
                                        <span className="text-[10px] text-gray-500">Total</span>
                                    </div>
                                </div>
                                <div className="w-1/2 pl-4 flex flex-col justify-center gap-2">
                                    {opdByDepartment.slice(0,5).map((d: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-1.5 truncate">
                                                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                                <span className="text-gray-600 truncate">{d.name}</span>
                                            </div>
                                            <div className="flex gap-1.5 shrink-0 ml-2">
                                                <span className="font-semibold text-gray-800">{d.value}</span>
                                                <span className="text-gray-400">({totalOpd ? ((d.value/totalOpd)*100).toFixed(1) : 0}%)</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-2 text-left">
                                <Link href="/reports" className="text-blue-600 text-xs font-semibold hover:underline">View department report →</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Recent Registrations */}
                    <div className="lg:col-span-5 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Recent Registrations</h2>
                            <Link href="/patients" className="text-blue-600 text-sm font-semibold hover:underline">View all</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="text-[11px] text-gray-400 uppercase border-b border-gray-100">
                                    <tr>
                                        <th className="pb-3 font-semibold">Reg. No.</th>
                                        <th className="pb-3 font-semibold">Patient Name</th>
                                        <th className="pb-3 font-semibold">Mobile</th>
                                        <th className="pb-3 font-semibold">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentRegistrations.map((p: any, i: number) => (
                                        <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                            <td className="py-2.5 font-medium text-gray-800 text-xs">REG-{dayjs(p.createdAt).format('YYYY')}-{p.id.substring(0,4).toUpperCase()}</td>
                                            <td className="py-2.5 font-medium text-gray-800">{p.name}</td>
                                            <td className="py-2.5">{p.phone}</td>
                                            <td className="py-2.5">{dayjs(p.createdAt).format('hh:mm A')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payment Collection */}
                    <div className="lg:col-span-3 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-base font-bold text-gray-800">Payment Collection <span className="text-gray-400 font-normal">(Today)</span></h2>
                            </div>
                            <Link href="/finance" className="text-blue-600 text-xs font-semibold hover:underline">View details</Link>
                        </div>
                        <div className="mb-6">
                            <div className="text-3xl font-bold text-gray-800">{formatCurrency(paymentCollection.total)}</div>
                            <div className="text-xs text-gray-400 mt-1">Total Collection</div>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'OPD Collection', val: paymentCollection.opd, color: 'text-blue-500', bg: 'bg-blue-50', icon: ClipboardList },
                                { label: 'IPD Collection', val: paymentCollection.ipd, color: 'text-green-500', bg: 'bg-green-50', icon: Bed },
                                { label: 'Pharmacy Collection', val: paymentCollection.pharmacy, color: 'text-orange-500', bg: 'bg-orange-50', icon: Activity },
                                { label: 'Other Collection', val: paymentCollection.other, color: 'text-purple-500', bg: 'bg-purple-50', icon: Plus },
                            ].map((p, i) => (
                                <div key={i} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded ${p.bg} ${p.color}`}><p.icon size={14} /></div>
                                        <span className="text-gray-600">{p.label}</span>
                                    </div>
                                    <span className="font-semibold text-gray-800">{formatCurrency(p.val)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="lg:col-span-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-base font-bold text-gray-800 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'New Registration', icon: UserCircle, color: 'text-blue-500', border: 'border-blue-100', href: '/patients/add' },
                                { label: 'Book Appointment', icon: Calendar, color: 'text-green-500', border: 'border-green-100', href: '/appointments/add' },
                                { label: 'IPD Admission', icon: Bed, color: 'text-rose-500', border: 'border-rose-100', href: '/room-allotment/new' },
                                { label: 'Bed Availability', icon: Activity, color: 'text-blue-500', border: 'border-blue-100', href: '/room-allotment' },
                                { label: 'Patient Search', icon: Search, color: 'text-purple-500', border: 'border-purple-100', href: '/patients' },
                                { label: 'Today\'s Schedule', icon: Clock, color: 'text-sky-500', border: 'border-sky-100', href: '/appointments' },
                                { label: 'Collect Payment', icon: IndianRupee, color: 'text-emerald-500', border: 'border-emerald-100', href: '/finance' },
                                { label: 'Print Token', icon: Printer, color: 'text-gray-600', border: 'border-gray-200', href: '/dashboard' },
                            ].map((a, i) => (
                                <Link key={i} href={a.href} className={`flex items-center gap-2 p-2.5 rounded-lg border ${a.border} hover:bg-gray-50 transition-colors`}>
                                    <a.icon size={16} className={a.color} />
                                    <span className="text-xs font-medium text-gray-700">{a.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Stats Grid */}
                <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-500 rounded-full"><Users size={20} /></div>
                        <div>
                            <div className="text-xs text-gray-400 font-semibold uppercase">Total Patients (Today)</div>
                            <div className="text-xl font-bold text-gray-800">{footerStats.totalPatients}</div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-500 rounded-full"><UserCircle size={20} /></div>
                        <div>
                            <div className="text-xs text-gray-400 font-semibold uppercase">Male</div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-gray-800">{footerStats.male.count}</span>
                                <span className="text-xs text-gray-500">({footerStats.male.percent}%)</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-pink-50 text-pink-500 rounded-full"><UserCircle size={20} /></div>
                        <div>
                            <div className="text-xs text-gray-400 font-semibold uppercase">Female</div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-gray-800">{footerStats.female.count}</span>
                                <span className="text-xs text-gray-500">({footerStats.female.percent}%)</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-orange-50 text-orange-500 rounded-full"><Clock size={20} /></div>
                        <div>
                            <div className="text-xs text-gray-400 font-semibold uppercase">Average Wait Time</div>
                            <div className="text-xl font-bold text-gray-800">{footerStats.avgWaitTime} <span className="text-xs text-gray-500 font-normal">mins</span></div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-green-50 text-green-500 rounded-full"><Users size={20} /></div>
                        <div>
                            <div className="text-xs text-gray-400 font-semibold uppercase">Active Staff</div>
                            <div className="text-xl font-bold text-gray-800">{footerStats.activeStaff}</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
