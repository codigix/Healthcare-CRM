"use client";

import { useState, useEffect } from "react";
import { patientAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
    Search,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Users,
    UserCheck,
    RefreshCw,
    Award,
    Shield,
    Briefcase,
    FileSpreadsheet,
    FileText,
    RefreshCcw,
    X,
    Phone,
    AlertCircle,
    Mail,
    MapPin,
    User,
    Calendar,
    Activity,
    FileSignature,
    FolderOpen,
    Camera,
    BadgeCheck
} from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import DataTable, { TableColumn, TableStyles } from 'react-data-table-component';

// Simple Sparkline SVG component
const Sparkline = ({ data, color }: { data: number[], color: string }) => {
    if (!data || data.length === 0) return null;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((val - min) / range) * 100;
        return `${x},${y}`;
    }).join(" ");

    const colorMap: any = {
        blue: "#3b82f6",
        emerald: "#10b981",
        amber: "#f59e0b",
        rose: "#f43f5e",
        purple: "#8b5cf6",
        slate: "#64748b"
    };

    return (
        <svg viewBox="0 0 100 100" className="w-16 h-8 preserve-aspect-ratio-none" preserveAspectRatio="none">
            <polyline fill="none" stroke={colorMap[color] || "#3b82f6"} strokeWidth="4" points={points} vectorEffect="non-scaling-stroke" />
        </svg>
    );
};

// DataTable Custom Styles to match the previous elegant design
const customStyles: TableStyles = {
    headRow: {
        style: {
            backgroundColor: '#f9fafb',
            borderBottomWidth: '1px',
            borderBottomColor: '#f3f4f6',
            minHeight: '48px',
        },
    },
    headCells: {
        style: {
            color: '#6b7280',
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase' as any,
            paddingLeft: '16px',
            paddingRight: '16px',
        },
    },
    cells: {
        style: {
            fontSize: '0.75rem',
            paddingLeft: '16px',
            paddingRight: '16px',
            color: '#4b5563',
        },
    },
    rows: {
        style: {
            minHeight: '60px',
        },
        highlightOnHoverStyle: {
            backgroundColor: 'rgba(239, 246, 255, 0.5)',
            cursor: 'pointer',
        },
    },
    pagination: {
        style: {
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            borderTopColor: '#f3f4f6',
            color: '#6b7280',
            fontSize: '0.75rem',
        },
    },
};

export default function SearchPatientPage() {
    const router = useRouter();
    const [patients, setPatients] = useState<any[]>([]);
    const [metaData, setMetaData] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(15);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    // Right panel state
    const [selectedPatient, setSelectedPatient] = useState<any>(null);

    // Filter state
    const [filters, setFilters] = useState({
        name: "", uhid: "", regNumber: "", mobile: "", abhaId: "", aadhaar: "", passport: "",
        gender: "", age: "", dob: "", bloodGroup: "", department: "", doctor: "", visitType: "",
        patientCategory: "", paymentCategory: "", regDate: "", status: ""
    });

    useEffect(() => {
        fetchMeta();
        fetchPatients();
    }, [page, limit]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClick = () => setOpenMenuId(null);
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    const fetchMeta = async () => {
        try {
            const res = await patientAPI.searchMeta();
            setMetaData(res.data);
        } catch (e) { console.error(e); }
    };

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const response = await patientAPI.getAll(page, limit);
            let fetchedPatients = response.data.patients || [];

            if (filters.name) {
                fetchedPatients = fetchedPatients.filter((p: any) => p.name.toLowerCase().includes(filters.name.toLowerCase()));
            }

            // Assign mock data to simulate real rows matching the screenshot
            fetchedPatients = fetchedPatients.map((p: any, i: number) => ({
                ...p,
                regNum: `00${Math.floor(Math.random() * 10000000)}`,
                department: "Department",
                doctor: "Doctor",
                visitType: "Visit Type",
                simulatedLastVisit: dayjs().subtract(i, 'day').format('MMM DD, YYYY')
            }));

            setPatients(fetchedPatients);
            setTotal(response.data.total || fetchedPatients.length);
        } catch (error) {
            console.error("Failed to fetch patients", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(1);
        fetchPatients();
    };

    const handleReset = () => {
        setFilters({
            name: "", uhid: "", regNumber: "", mobile: "", abhaId: "", aadhaar: "", passport: "",
            gender: "", age: "", dob: "", bloodGroup: "", department: "", doctor: "", visitType: "",
            patientCategory: "", paymentCategory: "", regDate: "", status: ""
        });
        setPage(1);
        fetchPatients();
    };

    const getStatusBadge = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'active': return 'bg-emerald-100 text-emerald-700';
            case 'admitted': return 'bg-blue-100 text-blue-700';
            case 'emergency': return 'bg-red-100 text-red-700';
            case 'discharged': return 'bg-gray-100 text-gray-700';
            case 'insurance': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getVisitBadge = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'active': return 'bg-emerald-100 text-emerald-700';
            case 'admitted': return 'bg-blue-100 text-blue-700';
            case 'emergency': return 'bg-red-100 text-red-700';
            case 'discharged': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const columns: TableColumn<any>[] = [
        {
            name: 'Patient Photo',
            width: '120px',
            cell: row => (
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                    {row.name?.charAt(0) || '?'}
                </div>
            )
        },
        {
            name: 'UHID',
            selector: row => row.id,
            sortable: true,
            format: row => <span className="font-medium text-gray-700">{row.id.substring(0, 8).toUpperCase()}</span>,
            width: '120px'
        },
        {
            name: 'Registration Number',
            selector: row => row.regNum,
            sortable: true,
            width: '160px'
        },
        {
            name: 'Patient Name',
            selector: row => row.name,
            sortable: true,
            format: row => <span className="font-medium text-gray-800">{row.name}</span>,
            width: '160px'
        },
        {
            name: 'Gender',
            selector: row => row.gender,
            sortable: true,
            format: row => row.gender?.charAt(0) || '-',
            width: '100px'
        },
        {
            name: 'Age',
            selector: row => row.age,
            sortable: true,
            format: row => row.age || 30,
            width: '80px'
        },
        {
            name: 'Mobile',
            selector: row => row.phone,
            sortable: true,
            format: row => row.phone || '-',
            width: '130px'
        },
        {
            name: 'Department',
            selector: row => row.department,
            sortable: true,
            width: '120px'
        },
        {
            name: 'Doctor',
            selector: row => row.doctor,
            sortable: true,
            width: '100px'
        },
        {
            name: 'Visit Type',
            selector: row => row.visitType,
            sortable: true,
            width: '120px'
        },
        {
            name: 'Last Visit',
            selector: row => row.simulatedLastVisit,
            sortable: true,
            width: '120px'
        },
        {
            name: 'Payment Type',
            selector: row => row.patientType,
            sortable: true,
            center: true,
            cell: row => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getVisitBadge(row.patientType === 'Emergency' ? 'Emergency' : 'Admitted')}`}>
                    {row.patientType === 'Emergency' ? 'Emergency' : 'Admitted'}
                </span>
            ),
            width: '130px'
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            center: true,
            cell: row => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadge(row.status || 'Active')}`}>
                    {row.status || 'Active'}
                </span>
            ),
            width: '100px'
        },
        {
            name: 'Actions',
            center: true,
            width: '200px',
            cell: row => (
                <div className="flex items-center justify-center gap-2">
                    <button
                        title="Demographics"
                        onClick={(e) => { e.stopPropagation(); router.push(`/patients/demographics?patientId=${row.id}`); }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors border border-transparent hover:border-blue-200"
                    >
                        <User size={15} />
                    </button>
                    <button
                        title="Consents & Forms"
                        onClick={(e) => { e.stopPropagation(); router.push(`/patients/consents?patientId=${row.id}`); }}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors border border-transparent hover:border-indigo-200"
                    >
                        <FileSignature size={15} />
                    </button>
                    <button
                        title="Patient Documents"
                        onClick={(e) => { e.stopPropagation(); router.push(`/patients/documents?patientId=${row.id}`); }}
                        className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md transition-colors border border-transparent hover:border-amber-200"
                    >
                        <FolderOpen size={15} />
                    </button>
                    <button
                        title="Photo Capture"
                        onClick={(e) => { e.stopPropagation(); router.push(`/patients/photo?patientId=${row.id}`); }}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors border border-transparent hover:border-emerald-200"
                    >
                        <Camera size={15} />
                    </button>
                    <button
                        title="Patient ID Card"
                        onClick={(e) => { e.stopPropagation(); router.push(`/patients/id-card?patientId=${row.id}`); }}
                        className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-md transition-colors border border-transparent hover:border-purple-200"
                    >
                        <BadgeCheck size={15} />
                    </button>
                </div>
            )
        },
    ];



    return (
        <div className="bg-[#f8fafc] -m-6 p-6 min-h-screen font-sans text-sm flex relative">

            <div className={`flex-1 min-w-0 transition-all duration-300 pr-4 ${selectedPatient ? 'pr-[360px]' : ''}`}>
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Hospital Name</h1>
                        <div className="text-xs text-gray-400 mt-1">Enterprise Multi-Speciality &gt; Patient Search</div>
                        <div className="text-sm font-semibold text-blue-600 mt-2">Reception / <span className="text-gray-800">Patient Search</span></div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input type="text" placeholder="Global Search" className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm w-64 outline-none focus:border-blue-500" />
                        </div>
                    </div>
                </div>

                {/* Top KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
                    {metaData?.cards?.map((card: any, i: number) => {
                        const icons = [Users, UserCheck, RefreshCw, Award, Shield, Briefcase];
                        const Icon = icons[i] || Users;
                        const colorMap: any = {
                            blue: 'text-blue-500 bg-blue-50', emerald: 'text-emerald-500 bg-emerald-50',
                            amber: 'text-amber-500 bg-amber-50', rose: 'text-rose-500 bg-rose-50',
                            purple: 'text-purple-500 bg-purple-50', slate: 'text-slate-500 bg-slate-50'
                        };
                        return (
                            <div key={i} className="bg-white p-4 rounded shadow-sm border border-gray-100 flex flex-col justify-between h-24">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded ${colorMap[card.color]}`}><Icon size={16} /></div>
                                        <div className="text-xs font-semibold text-gray-500">{card.title}</div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end mt-2">
                                    <div className="text-2xl font-bold text-gray-800">{card.value}</div>
                                    <Sparkline data={card.data} color={card.color} />
                                </div>
                            </div>
                        )
                    })}
                </div>



                {/* Enterprise DataTable powered by react-data-table-component */}
                <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="text-sm font-bold text-gray-800">Enterprise DataTable</h3>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input type="text" placeholder="Search..." className="pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded text-xs outline-none focus:border-blue-500 w-48 transition-all" />
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={patients}
                        customStyles={customStyles}
                        selectableRows
                        pagination
                        paginationServer
                        paginationTotalRows={total}
                        onChangePage={page => setPage(page)}
                        onChangeRowsPerPage={(newPerPage, page) => { setLimit(newPerPage); setPage(page); }}
                        progressPending={loading}
                        pointerOnHover
                        highlightOnHover
                        onRowClicked={(row) => setSelectedPatient(row)}
                        noDataComponent={<div className="p-8 text-gray-400 text-sm">No patients found.</div>}
                    />
                </div>
            </div>

            {/* Right Patient Summary Slide-out */}
            {selectedPatient && (
                <div className="fixed right-0 top-0 bottom-0 w-[350px] bg-white shadow-2xl border-l border-gray-100 z-50 transform transition-transform overflow-y-auto">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur z-10">
                        <h2 className="font-bold text-gray-800">Patient Summary</h2>
                        <button onClick={() => setSelectedPatient(null)} className="text-gray-400 hover:text-gray-800 p-1 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl shadow-sm mb-3">
                                {selectedPatient.name?.charAt(0) || '?'}
                            </div>
                            <h3 className="font-bold text-gray-800 text-base">{selectedPatient.name}</h3>
                            <div className="text-xs text-gray-500 mt-0.5">Patient Photo</div>
                        </div>

                        <div className="space-y-4 text-xs mb-8">
                            <div className="grid grid-cols-3 gap-2 border-b border-gray-50 pb-2">
                                <span className="text-gray-500 col-span-1">Patient Name</span>
                                <span className="font-semibold text-gray-800 col-span-2 text-right">{selectedPatient.name}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b border-gray-50 pb-2">
                                <span className="text-gray-500 col-span-1">UHID</span>
                                <span className="font-semibold text-gray-800 col-span-2 text-right">{selectedPatient.id.substring(0, 8).toUpperCase()}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b border-gray-50 pb-2">
                                <span className="text-gray-500 col-span-1">Age</span>
                                <span className="font-semibold text-gray-800 col-span-2 text-right">{selectedPatient.age || 30}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b border-gray-50 pb-2">
                                <span className="text-gray-500 col-span-1">Gender</span>
                                <span className="font-semibold text-gray-800 col-span-2 text-right">{selectedPatient.gender || 'Unknown'}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b border-gray-50 pb-2">
                                <span className="text-gray-500 col-span-1">Blood Group</span>
                                <span className="font-semibold text-gray-800 col-span-2 text-right">{selectedPatient.bloodGroup || 'B+'}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b border-gray-50 pb-2">
                                <span className="text-gray-500 col-span-1">Address</span>
                                <span className="font-semibold text-gray-800 col-span-2 text-right line-clamp-2">{selectedPatient.address || '123 Green Park, New Delhi'}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b border-gray-50 pb-2">
                                <span className="text-gray-500 col-span-1">Mobile</span>
                                <span className="font-semibold text-gray-800 col-span-2 text-right flex items-center justify-end gap-1"><Phone size={10} className="text-blue-500" /> {selectedPatient.phone || '-'}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b border-gray-50 pb-2">
                                <span className="text-gray-500 col-span-1">Emergency Contact</span>
                                <span className="font-semibold text-gray-800 col-span-2 text-right">Ravi - 9876543210</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b border-gray-50 pb-2">
                                <span className="text-gray-500 col-span-1">Insurance</span>
                                <span className="font-semibold text-emerald-600 col-span-2 text-right">{selectedPatient.hasInsurance ? 'Star Health' : 'None'}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b border-gray-50 pb-2">
                                <span className="text-gray-500 col-span-1">Last Visit</span>
                                <span className="font-semibold text-gray-800 col-span-2 text-right">{dayjs().subtract(2, 'day').format('DD MMM YYYY')}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b border-gray-50 pb-2">
                                <span className="text-gray-500 col-span-1">Total Visits</span>
                                <span className="font-semibold text-gray-800 col-span-2 text-right">4</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b border-gray-50 pb-2">
                                <span className="text-gray-500 col-span-1">Outstanding Balance</span>
                                <span className="font-bold text-red-500 col-span-2 text-right">₹0.00</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b border-gray-50 pb-2">
                                <span className="text-gray-500 col-span-1">Medical Alerts</span>
                                <span className="font-semibold text-gray-800 col-span-2 text-right flex items-center justify-end gap-1"><AlertCircle size={10} className="text-red-500" /> Yes</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b border-gray-50 pb-2">
                                <span className="text-gray-500 col-span-1">Allergies</span>
                                <span className="font-semibold text-gray-800 col-span-2 text-right">Penicillin</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-gray-500 col-span-1">Current Medications</span>
                                <span className="font-semibold text-gray-800 col-span-2 text-right">Aspirin 75mg</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                            <button className="py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm transition-colors">Book Appointment</button>
                            <button className="py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm transition-colors">Create Visit</button>
                            <button className="py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm transition-colors">Billing</button>
                            <button className="py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm transition-colors">Medical History</button>
                            <button className="py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm col-span-2 transition-colors">Print Card</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
