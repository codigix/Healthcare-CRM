"use client";

import { useState, useEffect } from "react";
import { patientAPI, consentAPI } from "@/lib/api";
import { useSearchParams, useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import PatientTabs from "@/components/Patients/PatientTabs";
import {
    Edit, Printer, Download, ChevronDown,
    MoreVertical, User, FileText, CheckSquare, Settings, AlertCircle, X, Plus, Image as ImageIcon, Send, MessageCircle, Mail, Check
} from "lucide-react";

export default function ConsentAndForms() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const patientId = searchParams.get('patientId');
    const [patientData, setPatientData] = useState<any>(null);
    const [consents, setConsents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All Forms');
    const [selectedConsent, setSelectedConsent] = useState<any>(null);

    // Toast Notification State
    const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

    useEffect(() => {
        fetchData();
    }, [patientId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [patientRes, consentsRes] = await Promise.all([
                patientAPI.dashboard(patientId || undefined),
                consentAPI.list(1, 50, '', patientId || undefined)
            ]);

            if (patientRes.data.success && patientRes.data.data) {
                setPatientData(patientRes.data.data);
            }
            if (consentsRes.data.success) {
                setConsents(consentsRes.data.forms);
                if (consentsRes.data.forms.length > 0) {
                    setSelectedConsent(consentsRes.data.forms[0]);
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

    // Action Handlers
    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPdf = () => {
        showToast("Generating PDF document...", "success");
        setTimeout(() => showToast("PDF downloaded successfully!", "success"), 1500);
    };

    const handleUpload = () => {
        document.getElementById('hidden-file-input')?.click();
    };

    const handleFileChange = (e: any) => {
        if (e.target.files?.length > 0) {
            showToast("Document uploaded and attached to patient record.", "success");
            e.target.value = ''; // reset
        }
    };

    const handleEmail = () => showToast("Consent form dispatched via Email.", "success");
    const handleWhatsapp = () => showToast("Secure WhatsApp link sent to patient.", "success");
    const handleCaptureSignature = () => showToast("Initializing Digital Signature Pad...", "success");
    const handleCreateConsent = () => showToast("Opening Consent Template library...", "success");

    if (loading) return <div className="p-8 text-center text-gray-500">Loading consents...</div>;
    if (!patientData) return <div className="p-8 text-center text-red-500">No patient data found.</div>;

    const p = patientData.personal || {};
    const ins = patientData.insurance || {};
    const mp = patientData.medicalProfile || {};
    const age = p.dob ? Math.floor((new Date().getTime() - new Date(p.dob).getTime()) / 31557600000) : '-';

    const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
    const formatTime = (d: string) => d ? new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';

    const tabs = ['All Forms', 'Pending', 'Signed', 'Expired', 'Rejected'];
    const filteredConsents = activeTab === 'All Forms'
        ? consents
        : consents.filter(c => c.status === activeTab);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Signed': return 'text-green-700 bg-green-50 border-green-200';
            case 'Pending': return 'text-red-600 bg-red-50 border-red-200';
            case 'Expired': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'Rejected': return 'text-gray-600 bg-gray-100 border-gray-300';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    // DataTable Configuration
    const columns = [
        { name: 'Form Name', selector: (row: any) => row.formName, sortable: true, cell: (row: any) => <div className="font-medium text-gray-900">{row.formName}</div> },
        { name: 'Version', selector: (row: any) => row.version, sortable: true, cell: (row: any) => <div className="text-gray-600">{row.version}</div> },
        { name: 'Signed Date', selector: (row: any) => row.signedDate, sortable: true, cell: (row: any) => <div className="text-gray-600">{row.signedDate ? `${formatDate(row.signedDate)} ${formatTime(row.signedDate)}` : '-'}</div> },
        { name: 'Expiry Date', selector: (row: any) => row.expiryDate, sortable: true, cell: (row: any) => <div className="text-gray-600">{row.expiryDate ? formatDate(row.expiryDate) : '-'}</div> },
        { name: 'Signed By', selector: (row: any) => row.signedBy, sortable: true, cell: (row: any) => <div className="text-gray-600">{row.signedBy || '-'}</div> },
        { name: 'Signed Role', cell: (row: any) => <div className="text-gray-600">{row.signedBy ? (row.signedBy.includes('Dr.') ? 'Doctor' : 'Patient') : '-'}</div> },
        {
            name: 'Status',
            selector: (row: any) => row.status,
            sortable: true,
            cell: (row: any) => (
                <span className={`px-2 py-0.5 rounded font-bold text-[10px] border ${getStatusColor(row.status)}`}>{row.status}</span>
            )
        },
        {
            name: 'Actions',
            center: true,
            cell: (row: any) => (
                <div className="flex items-center justify-center gap-2">
                    <button onClick={() => { setSelectedConsent(row); showToast("Loaded in preview pane", "success"); }} className="text-blue-500 bg-blue-50 w-6 h-6 rounded flex items-center justify-center border border-blue-100 hover:bg-blue-100" title="View"><FileText size={12} /></button>
                    <button onClick={handleDownloadPdf} className="text-blue-500 bg-blue-50 w-6 h-6 rounded flex items-center justify-center border border-blue-100 hover:bg-blue-100" title="Download"><Download size={12} /></button>
                    <button onClick={handlePrint} className="text-blue-500 bg-blue-50 w-6 h-6 rounded flex items-center justify-center border border-blue-100 hover:bg-blue-100" title="Print"><Printer size={12} /></button>
                    <button onClick={() => showToast("More options opened", "success")} className="text-gray-400 bg-gray-50 w-6 h-6 rounded flex items-center justify-center border border-gray-200 hover:bg-gray-100" title="More"><MoreVertical size={12} /></button>
                </div>
            )
        }
    ];

    const customStyles = {
        headRow: { style: { backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', minHeight: '40px' } },
        headCells: { style: { fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' } },
        cells: { style: { fontSize: '0.75rem', borderBottom: '1px solid #f3f4f6' } }
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen p-4 -m-6 pb-24 relative overflow-y-auto">
            <PatientTabs patientId={patientId || ''} />

            {/* Hidden File Input for Uploads */}
            <input type="file" id="hidden-file-input" className="hidden" onChange={handleFileChange} />

            {/* Toast Notification */}
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

                            <div className="flex flex-col"><span className="text-gray-400">MRN</span><span className="font-medium text-gray-800">{p.mrn || '-'}</span></div>
                            <div className="flex flex-col"><span className="text-gray-400">DOB</span><span className="font-medium text-gray-800">{formatDate(p.dob)}</span></div>
                            <div className="flex flex-col"><span className="text-gray-400">Insurance</span><span className="font-medium text-gray-800">{ins.insuranceProvider || '-'}</span></div>

                            <div className="flex flex-col"><span className="text-gray-400">Registration No.</span><span className="font-medium text-gray-800">REG-{p.id?.substring(0, 8).toUpperCase()}</span></div>
                            <div className="flex flex-col"><span className="text-gray-400">Blood Group</span><span className="font-medium text-gray-800">{mp.bloodGroup || '-'}</span></div>
                            <div className="flex flex-col"><span className="text-gray-400">ABHA ID</span><span className="font-medium text-gray-800">{p.abhaId || '-'}</span></div>
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
                        <button onClick={handleCreateConsent} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-2 transition-colors">
                            <Plus size={12} /> Create New Consent
                        </button>
                        <button onClick={handleUpload} className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-2 transition-colors">
                            <Download size={12} /> Upload Signed Copy
                        </button>
                        <button onClick={() => showToast("Opening more actions menu", "success")} className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-2 transition-colors">
                            <Settings size={12} /> More Actions <ChevronDown size={12} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mb-4">
                {/* Left Pane: Forms Grid */}
                <div className="flex-[3] bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <h2 className="text-base font-bold text-gray-900 mb-4">Consent Forms</h2>

                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-gray-200 mb-4 text-sm font-medium">
                        {tabs.map(tab => {
                            const count = tab === 'All Forms' ? consents.length : consents.filter(c => c.status === tab).length;
                            return (
                                <button
                                    key={tab}
                                    className={`pb-2 px-1 relative ${activeTab === tab ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab} {count > 0 && <span className="text-gray-400">({count})</span>}
                                    {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
                                </button>
                            );
                        })}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        {filteredConsents.map((consent, i) => (
                            <div
                                key={i}
                                className={`rounded-lg border p-3 flex flex-col justify-between cursor-pointer transition-all ${selectedConsent?.id === consent.id ? 'border-blue-500 shadow-sm bg-blue-50/20' : 'border-gray-200 hover:border-blue-300'}`}
                                onClick={() => setSelectedConsent(consent)}
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-start gap-2">
                                            <FileText size={16} className="text-gray-400 mt-0.5" />
                                            <div>
                                                <h3 className="text-xs font-bold text-gray-900 leading-tight">{consent.formName}</h3>
                                                <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold border ${getStatusColor(consent.status)}`}>
                                                    {consent.status}
                                                </span>
                                            </div>
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); showToast("Options menu", "success"); }} className="text-gray-400 hover:text-gray-600"><MoreVertical size={14} /></button>
                                    </div>
                                    <div className="space-y-1 mt-3">
                                        <div className="flex justify-between text-[10px]">
                                            <span className="text-gray-500">{consent.status === 'Signed' ? 'Signed On' : 'Created On'}</span>
                                            <span className="font-medium text-gray-900">
                                                {consent.status === 'Signed' ? (consent.signedDate ? formatDate(consent.signedDate) : '-') : formatDate(consent.createdAt)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-[10px]">
                                            <span className="text-gray-500">{consent.status === 'Signed' ? 'Signed By' : 'Created By'}</span>
                                            <span className="font-medium text-gray-900">{consent.signedBy || '-'}</span>
                                        </div>
                                        <div className="flex justify-between text-[10px]">
                                            <span className="text-gray-500">Valid Till</span>
                                            <span className="font-medium text-gray-900">{formatDate(consent.expiryDate)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                                    <div className="flex gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); setSelectedConsent(consent); showToast("Loaded in preview", "success"); }} className="text-gray-500 hover:text-blue-600" title="View"><FileText size={14} /></button>
                                        <button onClick={(e) => { e.stopPropagation(); showToast("Opening editor", "success"); }} className="text-gray-500 hover:text-blue-600" title="Edit"><Edit size={14} /></button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDownloadPdf(); }} className="text-gray-500 hover:text-blue-600" title="Download"><Download size={14} /></button>
                                        <button onClick={(e) => { e.stopPropagation(); handlePrint(); }} className="text-gray-500 hover:text-blue-600" title="Print"><Printer size={14} /></button>
                                    </div>
                                    {consent.status !== 'Signed' && (
                                        <button onClick={(e) => { e.stopPropagation(); handleCaptureSignature(); }} className="text-purple-600 hover:text-purple-800" title="Capture Signature"><Edit size={14} /></button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredConsents.length > 6 && (
                        <button className="w-full mt-4 text-blue-600 hover:bg-blue-50 rounded text-xs font-semibold py-2 flex items-center justify-center gap-1 transition-colors">
                            Show More Forms <ChevronDown size={14} />
                        </button>
                    )}
                </div>

                {/* Right Pane: Consent Preview */}
                <div className="w-[400px] bg-white rounded-lg shadow-sm border border-gray-100 p-5 flex flex-col relative h-[800px]">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                        <h2 className="text-sm font-bold text-gray-900">Consent Preview</h2>
                        <button onClick={() => setSelectedConsent(null)}><X size={16} className="text-gray-400 hover:text-gray-600" /></button>
                    </div>

                    {selectedConsent ? (
                        <>
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center text-blue-600 font-bold text-xl">+</div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">CityCare</h3>
                                        <p className="text-[10px] text-gray-500">Multi Speciality Hospital</p>
                                    </div>
                                    <div className="ml-auto text-right">
                                        <h3 className="font-bold text-gray-900 text-xs">CONSENT FORM</h3>
                                        <p className="text-[10px] text-gray-500">{selectedConsent.formName}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="text-[10px] font-bold text-gray-900 mb-2 uppercase border-b border-gray-100 pb-1">Patient Details</h4>
                                    <div className="grid grid-cols-3 gap-y-1 text-[10px]">
                                        <div className="text-gray-500">Name</div>
                                        <div className="col-span-2 font-medium text-gray-900">{p.firstName} {p.lastName}</div>
                                        <div className="text-gray-500">UHID</div>
                                        <div className="col-span-2 font-medium text-gray-900">UH000{p.id?.substring(0, 4).toUpperCase()}</div>
                                        <div className="text-gray-500">Age / Gender</div>
                                        <div className="col-span-2 font-medium text-gray-900">{age} Y / {p.gender}</div>
                                        <div className="text-gray-500">Registration No.</div>
                                        <div className="col-span-2 font-medium text-gray-900">REG-{p.id?.substring(0, 8).toUpperCase()}</div>
                                        <div className="text-gray-500">Address</div>
                                        <div className="col-span-2 font-medium text-gray-900 truncate">{patientData.address?.address || '-'}</div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="text-[10px] font-bold text-gray-900 mb-2 uppercase border-b border-gray-100 pb-1">Consent Details</h4>
                                    <p className="text-[9px] text-gray-700 leading-relaxed text-justify mb-2">
                                        I, {p.firstName} {p.lastName}, hereby give my full consent to CityCare Multi Speciality Hospital and its medical team to examine, diagnose and provide treatment as may be considered necessary for my medical condition. I understand the nature of the treatment and authorize the hospital to proceed.
                                    </p>
                                    <p className="text-[9px] text-gray-700 leading-relaxed text-justify">
                                        I have been explained the risks, benefits and alternatives and all my questions have been answered to my satisfaction.
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-8 mt-12">
                                    <div>
                                        <h5 className="text-[8px] text-gray-500 mb-2 border-b border-gray-200 pb-1">Patient / Guardian Signature</h5>
                                        {selectedConsent.status === 'Signed' ? (
                                            <div className="h-10 flex flex-col justify-end">
                                                <div className="font-[Cedarville_Cursive] text-lg text-gray-800 -rotate-3 mb-1">{p.firstName}</div>
                                                <div className="text-[8px] font-bold text-gray-900">{p.firstName} {p.lastName}</div>
                                                <div className="text-[7px] text-gray-500">{formatDate(selectedConsent.signedDate)} | {formatTime(selectedConsent.signedDate)}</div>
                                            </div>
                                        ) : (
                                            <div className="h-10 flex items-end"><span className="text-[9px] text-gray-300 italic">Pending Signature</span></div>
                                        )}
                                    </div>
                                    <div>
                                        <h5 className="text-[8px] text-gray-500 mb-2 border-b border-gray-200 pb-1">Doctor Signature</h5>
                                        {selectedConsent.status === 'Signed' ? (
                                            <div className="h-10 flex flex-col justify-end">
                                                <div className="font-[Cedarville_Cursive] text-lg text-blue-800 -rotate-2 mb-1">Dr. Smith</div>
                                                <div className="text-[8px] font-bold text-gray-900">Dr. A. Smith</div>
                                                <div className="text-[7px] text-gray-500">{formatDate(selectedConsent.signedDate)} | {formatTime(selectedConsent.signedDate)}</div>
                                            </div>
                                        ) : (
                                            <div className="h-10 flex items-end"><span className="text-[9px] text-gray-300 italic">Pending Signature</span></div>
                                        )}
                                    </div>
                                    <div>
                                        <h5 className="text-[8px] text-gray-500 mb-2 border-b border-gray-200 pb-1">Witness Signature</h5>
                                        <div className="h-10 flex items-end"><span className="text-[9px] text-gray-300 italic">Optional</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-100 mt-2 flex gap-2">
                                <button onClick={handleCaptureSignature} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 rounded shadow-sm transition-colors">Capture Signature</button>
                                <button onClick={handlePrint} className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-semibold py-2 rounded transition-colors">Print</button>
                                <button onClick={handleDownloadPdf} className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-semibold py-2 rounded transition-colors">Download PDF</button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Select a consent form to preview</div>
                    )}
                </div>
            </div>

            {/* Bottom Table: Consent History with react-data-table-component */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-[60px]">
                <h2 className="text-base font-bold text-gray-900 mb-4">Consent History</h2>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <DataTable
                        columns={columns}
                        data={consents}
                        customStyles={customStyles}
                        pagination
                        paginationPerPage={5}
                        paginationRowsPerPageOptions={[5, 10, 20]}
                        highlightOnHover
                        pointerOnHover
                        onRowClicked={(row) => { setSelectedConsent(row); showToast("Loaded in preview pane", "success"); }}
                    />
                </div>
            </div>

            {/* Bottom Actions Bar (Sticky Footer) */}
            <div className="fixed bottom-0 left-[260px] right-0 bg-white border-t border-gray-200 p-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40 flex items-center justify-between">
                <div className="flex gap-2 text-gray-700">
                    <button onClick={handleCreateConsent} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-4 rounded shadow-sm flex items-center gap-1.5">
                        <Plus size={14} /> Create New Consent
                    </button>
                    <button onClick={handleCaptureSignature} className="bg-white border border-gray-300 hover:bg-gray-50 text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors">
                        <Edit size={14} /> Capture Digital Signature
                    </button>
                    <button onClick={handleUpload} className="bg-white border border-gray-300 hover:bg-gray-50 text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors">
                        <Download size={14} /> Upload Signed Copy
                    </button>
                    <button onClick={handlePrint} className="bg-white border border-gray-300 hover:bg-gray-50 text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors">
                        <Printer size={14} /> Print
                    </button>
                    <button onClick={handleDownloadPdf} className="bg-white border border-gray-300 hover:bg-gray-50 text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors">
                        <FileText size={14} /> Download PDF
                    </button>
                    <button onClick={handleEmail} className="bg-white border border-gray-300 hover:bg-gray-50 text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors">
                        <Mail size={14} /> Email Patient
                    </button>
                    <button onClick={handleWhatsapp} className="bg-white border border-green-300 text-green-700 hover:bg-green-50 text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors">
                        <MessageCircle size={14} /> WhatsApp Patient
                    </button>
                </div>
                <div>
                    <button onClick={() => router.back()} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium py-1.5 px-6 rounded transition-colors">
                        Back
                    </button>
                </div>
            </div>

        </div>
    );
}