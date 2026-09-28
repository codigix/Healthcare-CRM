"use client";

import { useState, useEffect } from "react";
import { patientAPI, patientDocumentAPI } from "@/lib/api";
import { useSearchParams, useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import PatientTabs from "@/components/Patients/PatientTabs";
import {
    Download, ChevronDown, MoreHorizontal, User, FileText, Settings, AlertCircle, X, Plus,
    Image as ImageIcon, Search, Filter, Calendar, Folder, Trash2, Printer, Upload, Scan, Check
} from "lucide-react";

export default function PatientDocuments() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const patientId = searchParams.get('patientId');
    const [patientData, setPatientData] = useState<any>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All Documents');
    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [previewTab, setPreviewTab] = useState('Preview');
    const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

    useEffect(() => {
        fetchData();
    }, [patientId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [patientRes, docsRes] = await Promise.all([
                patientAPI.dashboard(patientId || undefined),
                patientDocumentAPI.list(1, 50, '', '', '', patientId || undefined)
            ]);

            if (patientRes.data.success && patientRes.data.data) {
                setPatientData(patientRes.data.data);
            }
            if (docsRes.data.success) {
                setDocuments(docsRes.data.documents);
                if (docsRes.data.documents.length > 0) {
                    setSelectedDoc(docsRes.data.documents[0]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
            showToast("Failed to load data.", "error");
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading documents...</div>;
    if (!patientData) return <div className="p-8 text-center text-red-500">No patient data found.</div>;

    const p = patientData.personal || {};
    const ins = patientData.insurance || {};
    const mp = patientData.medicalProfile || {};
    const age = p.dob ? Math.floor((new Date().getTime() - new Date(p.dob).getTime()) / 31557600000) : '-';

    const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
    const formatTime = (d: string) => d ? new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';

    const tabs = ['All Documents', 'Medical Documents', 'Administrative', 'Reports', 'Images', 'Prescriptions', 'Others'];

    const getIconForType = (type: string) => {
        switch (type) {
            case 'Image': return <ImageIcon size={14} className="text-green-500" />;
            case 'PDF': return <FileText size={14} className="text-red-500" />;
            default: return <FileText size={14} className="text-gray-400" />;
        }
    };

    const getCategoryColor = (cat: string) => {
        if (!cat) return 'text-gray-600 bg-gray-50 border-gray-200';
        const c = cat.toLowerCase();
        if (c.includes('identity') || c.includes('kyc')) return 'text-blue-600 bg-blue-50 border-blue-200';
        if (c.includes('photo')) return 'text-green-600 bg-green-50 border-green-200';
        if (c.includes('insurance')) return 'text-purple-600 bg-purple-50 border-purple-200';
        if (c.includes('prescription')) return 'text-orange-600 bg-orange-50 border-orange-200';
        if (c.includes('lab') || c.includes('blood')) return 'text-red-600 bg-red-50 border-red-200';
        if (c.includes('radiology') || c.includes('x-ray')) return 'text-indigo-600 bg-indigo-50 border-indigo-200';
        if (c.includes('discharge') || c.includes('summary')) return 'text-teal-600 bg-teal-50 border-teal-200';
        if (c.includes('consent')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-blue-600 bg-blue-50 border-blue-200'; // Default
    };

    const columns = [
        {
            name: 'Document Name',
            selector: (row: any) => row.fileName,
            sortable: true,
            cell: (row: any) => (
                <div className="flex items-center gap-2 py-2">
                    <div className="w-6 h-6 rounded bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                        {getIconForType(row.documentType)}
                    </div>
                    <span className="font-medium text-gray-900 text-xs">{row.fileName}</span>
                </div>
            )
        },
        {
            name: 'Category',
            selector: (row: any) => row.category,
            sortable: true,
            cell: (row: any) => <span className={`px-2 py-0.5 rounded font-bold text-[9px] border ${getCategoryColor(row.category)}`}>{row.category || '-'}</span>
        },
        { name: 'Type', selector: (row: any) => row.documentType, sortable: true, cell: (row: any) => <span className="text-gray-600 text-[11px] font-semibold">{row.documentType || 'PDF'}</span> },
        {
            name: 'Upload Date',
            selector: (row: any) => row.dateOfService,
            sortable: true,
            cell: (row: any) => (
                <div className="flex flex-col">
                    <span className="text-gray-900 font-medium text-[11px]">{formatDate(row.dateOfService)}</span>
                    <span className="text-gray-500 text-[10px]">{formatTime(row.dateOfService)}</span>
                </div>
            )
        },
        { name: 'Uploaded By', selector: (row: any) => row.uploadedBy, sortable: true, cell: (row: any) => <span className="text-gray-800 text-[11px] font-medium">{row.uploadedBy || '-'}</span> },
        { name: 'File Size', selector: (row: any) => row.fileSize, sortable: true, cell: (row: any) => <span className="text-gray-600 text-[11px]">{row.fileSize || '-'}</span> },
        {
            name: 'Tags',
            selector: (row: any) => row.tags,
            cell: (row: any) => {
                if (!row.tags) return '-';
                const tagsList = row.tags.split(',').map((t: string) => t.trim());
                return (
                    <div className="flex gap-1 flex-wrap">
                        {tagsList.map((t: string, i: number) => (
                            <span key={i} className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">{t}</span>
                        ))}
                    </div>
                );
            }
        },
        {
            name: 'Actions',
            center: true,
            cell: (row: any) => (
                <div className="flex items-center justify-center gap-1.5">
                    <button onClick={() => { setSelectedDoc(row); showToast("Loaded in preview", "success"); }} className="text-blue-500 bg-blue-50 w-6 h-6 rounded flex items-center justify-center border border-blue-100 hover:bg-blue-100"><FileText size={12} /></button>
                    <button onClick={() => showToast("Downloading document...", "success")} className="text-blue-500 bg-blue-50 w-6 h-6 rounded flex items-center justify-center border border-blue-100 hover:bg-blue-100"><Download size={12} /></button>
                    <button onClick={() => showToast("More options", "success")} className="text-gray-400 bg-gray-50 w-6 h-6 rounded flex items-center justify-center border border-gray-200 hover:bg-gray-100"><MoreHorizontal size={12} /></button>
                </div>
            )
        }
    ];

    const customStyles = {
        headRow: { style: { backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', minHeight: '44px' } },
        headCells: { style: { fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' } },
        cells: { style: { borderBottom: '1px solid #f3f4f6', paddingTop: '4px', paddingBottom: '4px' } }
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen p-4 -m-6 pb-24 relative overflow-y-auto">
            <PatientTabs patientId={patientId} />
            {toast.show && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border transition-opacity duration-300 ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    {toast.type === 'success' ? <Check size={15} className="text-green-600" /> : <AlertCircle size={15} className="text-red-600" />}
                    <span className="text-sm font-medium">{toast.message}</span>
                </div>
            )}

            {/* Header Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex justify-between items-start mb-4">
                <div className="flex gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-24 h-24 bg-blue-100 rounded-lg overflow-hidden flex items-center justify-center border-2 border-blue-50">
                            <User className="text-blue-500 w-12 h-12" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <h1 className="text-xl font-bold text-gray-900">{p.firstName} {p.lastName}</h1>
                            <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">Active</span>
                        </div>

                        <div className="grid grid-cols-4 gap-x-8 gap-y-2 text-xs">
                            <div className="flex flex-col"><span className="text-gray-400">UHID</span><span className="font-medium text-gray-800">UH000{p.id?.substring(0, 4).toUpperCase()}</span></div>
                            <div className="flex flex-col"><span className="text-gray-400">Age / Gender</span><span className="font-medium text-gray-800">{age} Y / {p.gender}</span></div>
                            <div className="flex flex-col"><span className="text-gray-400">Mobile</span><span className="font-medium text-gray-800">{p.phone}</span></div>
                            <div className="flex flex-col"><span className="text-gray-400">Email</span><span className="font-medium text-gray-800">{p.email || '-'}</span></div>

                            <div className="flex flex-col"><span className="text-gray-400">MRN</span><span className="font-medium text-gray-800">{p.mrn || '-'}</span></div>
                            <div className="flex flex-col"><span className="text-gray-400">DOB</span><span className="font-medium text-gray-800">{formatDate(p.dob)}</span></div>
                            <div className="flex flex-col"><span className="text-gray-400">Blood Group</span><span className="font-medium text-gray-800">{mp.bloodGroup || '-'}</span></div>
                            <div className="flex flex-col"><span className="text-gray-400">ABHA ID</span><span className="font-medium text-gray-800">{p.abhaId || '-'}</span></div>

                            <div className="flex flex-col"><span className="text-gray-400">Registration No.</span><span className="font-medium text-gray-800">REG-{p.id?.substring(0, 8).toUpperCase()}</span></div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 border border-gray-200 p-1 flex justify-center items-center">
                            <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-cover opacity-80"></div>
                        </div>
                        <span className="text-[9px] text-gray-500 mt-1">Scan for Patient Card</span>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[160px]">
                        <button onClick={() => showToast("File picker opened", "success")} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-2 transition-colors">
                            <Upload size={12} /> Upload Document
                        </button>
                        <button onClick={() => showToast("Scanning initialized", "success")} className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-2 transition-colors">
                            <Scan size={12} /> Scan Document
                        </button>
                        <button onClick={() => showToast("More actions opened", "success")} className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-2 transition-colors">
                            <Settings size={12} /> More Actions <ChevronDown size={12} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Toolbar Area */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
                <div className="flex gap-8 border-b border-gray-200 mb-4 text-xs font-bold text-gray-600">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={`pb-2 relative ${activeTab === tab ? 'text-blue-600' : 'hover:text-gray-800'}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
                        </button>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4">
                    <div className="flex-1 flex flex-col gap-1.5">
                        <label className="text-[10px] font-semibold text-gray-500">Document Type</label>
                        <div className="relative">
                            <select className="w-full border border-gray-300 rounded text-xs py-1.5 px-2 text-gray-700 appearance-none bg-white">
                                <option>All Types</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5">
                        <label className="text-[10px] font-semibold text-gray-500">Category</label>
                        <div className="relative">
                            <select className="w-full border border-gray-300 rounded text-xs py-1.5 px-2 text-gray-700 appearance-none bg-white">
                                <option>All Categories</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5">
                        <label className="text-[10px] font-semibold text-gray-500">Upload Date</label>
                        <div className="relative">
                            <div className="w-full border border-gray-300 rounded text-xs py-1.5 px-2 text-gray-500 bg-white flex justify-between items-center cursor-pointer">
                                <span>Select Date Range</span>
                                <Calendar size={12} className="text-gray-400" />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5">
                        <label className="text-[10px] font-semibold text-gray-500">Uploaded By</label>
                        <div className="relative">
                            <select className="w-full border border-gray-300 rounded text-xs py-1.5 px-2 text-gray-700 appearance-none bg-white">
                                <option>All Users</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="flex-[1.5] flex flex-col gap-1.5">
                        <label className="text-[10px] font-semibold text-gray-500">Search Document</label>
                        <div className="relative">
                            <input type="text" placeholder="Search by document name or tag" className="w-full border border-gray-300 rounded text-xs py-1.5 pl-8 pr-2 text-gray-700 focus:outline-none focus:border-blue-500" />
                            <Search size={12} className="absolute left-2.5 top-2 text-gray-400" />
                        </div>
                    </div>
                    <div className="flex items-end mb-0.5">
                        <button className="flex items-center gap-1 text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded text-xs font-semibold px-3 py-1.5 transition-colors">
                            <Filter size={12} /> Reset
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mb-[60px]">
                {/* Left Pane: Table */}
                <div className="flex-[2.5] bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <DataTable
                        columns={columns}
                        data={documents}
                        customStyles={customStyles}
                        pagination
                        paginationPerPage={10}
                        paginationRowsPerPageOptions={[10, 20, 50]}
                        highlightOnHover
                        pointerOnHover
                        selectableRows
                        onRowClicked={(row) => setSelectedDoc(row)}
                    />
                </div>

                {/* Right Pane: Document Preview */}
                <div className="flex-[1.2] bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-[calc(100vh-300px)] sticky top-4 overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                        <h2 className="text-sm font-bold text-gray-900">Document Details</h2>
                        <button onClick={() => setSelectedDoc(null)}><X size={16} className="text-gray-400 hover:text-gray-600" /></button>
                    </div>

                    {selectedDoc ? (
                        <>
                            <div className="flex items-start justify-between gap-3 mb-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-red-50 border border-red-100 rounded flex items-center justify-center flex-shrink-0">
                                        <FileText className="text-red-500" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm leading-tight">{selectedDoc.fileName}</h3>
                                        <p className="text-[11px] text-gray-500 mt-0.5">{selectedDoc.documentType} Document • {selectedDoc.fileSize || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-1 text-gray-400 hover:text-blue-600"><Download size={14} /></button>
                                    <button className="p-1 text-gray-400 hover:text-blue-600"><Printer size={14} /></button>
                                    <button className="p-1 text-gray-400 hover:text-blue-600"><MoreHorizontal size={14} /></button>
                                </div>
                            </div>

                            <div className="flex gap-6 border-b border-gray-200 mb-5 text-[11px] font-bold text-gray-500">
                                {['Preview', 'Details', 'History', 'Access'].map(tab => (
                                    <button
                                        key={tab}
                                        className={`pb-2 relative ${previewTab === tab ? 'text-blue-600' : 'hover:text-gray-800'}`}
                                        onClick={() => setPreviewTab(tab)}
                                    >
                                        {tab}
                                        {previewTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
                                    </button>
                                ))}
                            </div>

                            {previewTab === 'Preview' && (
                                <div>
                                    <div className="w-full h-48 bg-gray-100 border border-gray-200 rounded-lg mb-6 overflow-hidden relative">
                                        {/* Mock Aadhaar Card / ID placeholder */}
                                        <div className="absolute inset-0 flex flex-col">
                                            <div className="h-6 bg-red-100 w-full flex items-center justify-center border-b border-red-200">
                                                <span className="text-[8px] font-bold text-red-800 uppercase tracking-widest">Government of India</span>
                                            </div>
                                            <div className="flex-1 p-3 flex gap-3 items-center bg-white">
                                                <div className="w-16 h-20 bg-gray-200 overflow-hidden border border-gray-300">
                                                    <div className="w-full h-full bg-[url('https://ui-avatars.com/api/?name=RS&background=random')] bg-cover"></div>
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <div className="text-[10px] font-bold mb-0.5">{p.firstName} {p.lastName}</div>
                                                    <div className="text-[8px] text-gray-600 mb-0.5">DOB: {formatDate(p.dob)}</div>
                                                    <div className="text-[8px] text-gray-600 mb-2">Gender: {p.gender}</div>
                                                    <div className="text-sm font-bold tracking-widest">1234 5678 9012</div>
                                                </div>
                                                <div className="w-12 h-12 bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-cover opacity-80"></div>
                                            </div>
                                            <div className="h-4 bg-red-500 w-full"></div>
                                        </div>
                                    </div>

                                    <h4 className="text-[10px] font-bold text-gray-900 mb-3 uppercase border-b border-gray-100 pb-1">Document Information</h4>
                                    <div className="grid grid-cols-3 gap-y-2 text-[10px] mb-6">
                                        <div className="text-gray-500">Document Name</div>
                                        <div className="col-span-2 font-medium text-gray-900 truncate">{selectedDoc.fileName}</div>

                                        <div className="text-gray-500">Category</div>
                                        <div className="col-span-2 font-medium text-gray-900">{selectedDoc.category || '-'}</div>

                                        <div className="text-gray-500">Document Type</div>
                                        <div className="col-span-2 font-medium text-gray-900">{selectedDoc.documentType || 'PDF'}</div>

                                        <div className="text-gray-500">File Size</div>
                                        <div className="col-span-2 font-medium text-gray-900">{selectedDoc.fileSize || '-'}</div>

                                        <div className="text-gray-500">Upload Date</div>
                                        <div className="col-span-2 font-medium text-gray-900">{formatDate(selectedDoc.dateOfService)} {formatTime(selectedDoc.dateOfService)}</div>

                                        <div className="text-gray-500">Uploaded By</div>
                                        <div className="col-span-2 font-medium text-gray-900">{selectedDoc.uploadedBy || '-'}</div>

                                        <div className="text-gray-500">Tags</div>
                                        <div className="col-span-2 font-medium text-gray-900">{selectedDoc.tags || '-'}</div>

                                        <div className="text-gray-500">Description</div>
                                        <div className="col-span-2 font-medium text-gray-900">{selectedDoc.description || '-'}</div>

                                        <div className="text-gray-500">Folder Path</div>
                                        <div className="col-span-2 font-medium text-gray-900">/Identity Proof/{selectedDoc.fileName}</div>
                                    </div>

                                    <h4 className="text-[10px] font-bold text-gray-900 mb-3 uppercase border-b border-gray-100 pb-1">Document Tags</h4>
                                    <div className="flex gap-2 flex-wrap mb-6">
                                        {selectedDoc.tags ? selectedDoc.tags.split(',').map((t: string, i: number) => (
                                            <span key={i} className="text-[9px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">{t.trim()}</span>
                                        )) : null}
                                        <button className="text-[9px] font-semibold text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-gray-100">
                                            <Plus size={10} /> Add Tag
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-[10px] font-bold text-gray-900 uppercase">Access Control</h4>
                                        <button className="text-[9px] font-bold text-gray-600 border border-gray-300 rounded px-2 py-0.5 hover:bg-gray-50">Edit</button>
                                    </div>
                                    <div className="text-[10px] text-gray-500 mb-1">Who can access this document</div>
                                    <div className="text-[11px] font-medium text-gray-900">Reception, Doctor, Admin, Finance</div>
                                </div>
                            )}

                            {previewTab !== 'Preview' && (
                                <div className="text-center py-10 text-gray-400 text-sm">
                                    {previewTab} details will appear here.
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Select a document to preview</div>
                    )}
                </div>
            </div>

            {/* Bottom Actions Bar (Sticky Footer) */}
            <div className="fixed bottom-0 left-[260px] right-0 bg-white border-t border-gray-200 p-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40 flex items-center justify-between">
                <div className="flex gap-2 text-gray-700">
                    <button onClick={() => showToast("Upload picker opened", "success")} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-4 rounded shadow-sm flex items-center gap-1.5 transition-colors">
                        <Upload size={14} /> Upload Document
                    </button>
                    <button onClick={() => showToast("Scanner activated", "success")} className="bg-white border border-gray-300 hover:bg-gray-50 text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors">
                        <Scan size={14} /> Scan Document
                    </button>
                    <button onClick={() => showToast("Create folder modal", "success")} className="bg-white border border-gray-300 hover:bg-gray-50 text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors">
                        <Folder size={14} /> Create Folder
                    </button>
                    <button onClick={() => showToast("Downloading selected", "success")} className="bg-white border border-gray-300 hover:bg-gray-50 text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors">
                        <Download size={14} /> Download Selected
                    </button>
                    <button onClick={() => showToast("Items deleted", "success")} className="bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors">
                        <Trash2 size={14} /> Delete Selected
                    </button>
                    <button onClick={() => window.print()} className="bg-white border border-gray-300 hover:bg-gray-50 text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors">
                        <Printer size={14} /> Print Selected
                    </button>
                </div>
            </div>

        </div>
    );
}