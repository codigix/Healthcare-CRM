"use client";

import { useState, useEffect } from "react";
import { patientAPI, patientDocumentAPI } from "@/lib/api";
import { useSearchParams, useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import PatientTabs from "@/components/Patients/PatientTabs";
import {
    Download, ChevronDown, MoreHorizontal, User, FileText, Settings, AlertCircle, X, Plus,
    Image as ImageIcon, Search, Filter, Calendar, Folder, Trash2, Printer, Upload, Scan, Check, Crop, Camera
} from "lucide-react";

export default function PatientPhotoCapture() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const patientId = searchParams.get('patientId');
    const [patientData, setPatientData] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

    useEffect(() => {
        fetchData();
    }, [patientId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [patientRes, docsRes] = await Promise.all([
                patientAPI.dashboard(patientId || undefined),
                // Using type=Image to get photos, will filter by category on frontend
                patientDocumentAPI.list(1, 50, '', 'Image', '', patientId || undefined)
            ]);

            if (patientRes.data.success && patientRes.data.data) {
                setPatientData(patientRes.data.data);
            }
            if (docsRes.data.success) {
                const photos = docsRes.data.documents.filter((d: any) => d.category === 'Profile Photo');
                setHistory(photos);
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

    if (loading) return <div className="p-8 text-center text-gray-500">Loading photo interface...</div>;
    if (!patientData) return <div className="p-8 text-center text-red-500">No patient data found.</div>;

    const p = patientData.personal || {};
    const mp = patientData.medicalProfile || {};
    const age = p.dob ? Math.floor((new Date().getTime() - new Date(p.dob).getTime()) / 31557600000) : '-';

    const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
    const formatTime = (d: string) => d ? new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';

    const getStatusBadge = (status: string) => {
        if (status === 'Current') return <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded text-[9px] font-bold">Current</span>;
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 rounded text-[9px] font-bold">Previous</span>;
    };

    const columns = [
        { name: '#', selector: (row: any, i: number) => i + 1, width: '50px', cell: (row: any, i: number) => <span className="text-gray-500 text-xs">{i + 1}</span> },
        {
            name: 'Photo',
            cell: (row: any) => (
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 border border-gray-200 my-1">
                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="Patient" className="w-full h-full object-cover" />
                </div>
            )
        },
        {
            name: 'Captured On',
            selector: (row: any) => row.dateOfService,
            sortable: true,
            cell: (row: any) => <span className="text-gray-600 text-[11px]">{formatDate(row.dateOfService)} {formatTime(row.dateOfService)}</span>
        },
        { name: 'Captured By', selector: (row: any) => row.uploadedBy, sortable: true, cell: (row: any) => <span className="text-gray-800 font-medium text-[11px]">{row.uploadedBy || '-'}</span> },
        { name: 'File Name', selector: (row: any) => row.fileName, sortable: true, cell: (row: any) => <span className="text-gray-600 text-[11px]">{row.fileName}</span> },
        { name: 'File Size', selector: (row: any) => row.fileSize, sortable: true, cell: (row: any) => <span className="text-gray-600 text-[11px]">{row.fileSize}</span> },
        { name: 'Status', selector: (row: any) => row.status, sortable: true, cell: (row: any) => getStatusBadge(row.status) },
        {
            name: 'Actions',
            center: true,
            cell: (row: any) => (
                <div className="flex items-center justify-center gap-1.5">
                    <button onClick={() => showToast("Viewing full photo", "success")} className="text-blue-500 bg-blue-50 w-6 h-6 rounded flex items-center justify-center border border-blue-100 hover:bg-blue-100"><FileText size={12} /></button>
                    <button onClick={() => showToast("Downloading photo...", "success")} className="text-blue-500 bg-blue-50 w-6 h-6 rounded flex items-center justify-center border border-blue-100 hover:bg-blue-100"><Download size={12} /></button>
                    <button onClick={() => showToast("More options", "success")} className="text-gray-400 bg-gray-50 w-6 h-6 rounded flex items-center justify-center border border-gray-200 hover:bg-gray-100"><MoreHorizontal size={12} /></button>
                </div>
            )
        }
    ];

    const customStyles = {
        headRow: { style: { backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', minHeight: '40px' } },
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
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 bg-gray-50">
                            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" alt="Patient" className="w-full h-full object-cover" />
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

                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 border border-gray-200 p-1 flex justify-center items-center">
                        <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-cover opacity-80"></div>
                    </div>
                    <span className="text-[9px] text-gray-500 mt-1">Scan for Patient Card</span>
                </div>
            </div>

            {/* Photo Capture Section (3 columns) */}
            <div className="flex gap-4 mb-4">

                {/* Left Pane: Controls & Guidelines */}
                <div className="w-[280px] bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col justify-between">
                    <div>
                        <h2 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Photo Capture</h2>

                        <div className="mb-5">
                            <label className="text-[10px] font-semibold text-gray-500 mb-1.5 block">Camera Source</label>
                            <div className="relative">
                                <select className="w-full border border-gray-300 rounded text-xs py-1.5 px-2 text-gray-700 appearance-none bg-white font-medium">
                                    <option>Integrated Webcam</option>
                                    <option>External Camera</option>
                                </select>
                                <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="text-[10px] font-semibold text-gray-500 mb-2 block">Capture Mode</label>
                            <div className="flex gap-4 text-xs font-medium text-gray-700">
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                    <div className="w-3.5 h-3.5 rounded-full border border-blue-600 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                    </div>
                                    Single Photo
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                    <div className="w-3.5 h-3.5 rounded-full border border-gray-300"></div>
                                    Multiple Photos
                                </label>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-[10px] font-semibold text-gray-500 mb-3">Photo Guidelines</h3>
                            <ul className="space-y-2.5 text-[11px] text-gray-700">
                                <li className="flex items-center gap-2"><Check size={12} className="text-green-500 flex-shrink-0" /> Face the camera directly</li>
                                <li className="flex items-center gap-2"><Check size={12} className="text-green-500 flex-shrink-0" /> Keep a neutral expression</li>
                                <li className="flex items-center gap-2"><Check size={12} className="text-green-500 flex-shrink-0" /> Remove sunglasses / mask</li>
                                <li className="flex items-center gap-2"><Check size={12} className="text-green-500 flex-shrink-0" /> Ensure good lighting</li>
                                <li className="flex items-center gap-2"><Check size={12} className="text-green-500 flex-shrink-0" /> Photo will be used for ID card</li>
                                <li className="flex items-center gap-2"><Check size={12} className="text-green-500 flex-shrink-0" /> Recommended size 400x500 px</li>
                            </ul>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded p-3">
                            <div className="flex items-center gap-1 text-blue-700 font-semibold text-[10px] mb-1">
                                <AlertCircle size={12} /> Tips
                            </div>
                            <p className="text-[10px] text-gray-600 leading-relaxed">
                                Position your face in the center and ensure it is clearly visible.
                            </p>
                        </div>
                    </div>

                    <button onClick={() => showToast("Opening settings modal", "success")} className="w-full mt-4 bg-white border border-gray-300 hover:bg-gray-50 text-blue-600 font-semibold text-xs py-2 rounded flex items-center justify-center gap-1.5 transition-colors">
                        <Settings size={14} /> Camera Settings
                    </button>
                </div>

                {/* Center Pane: Viewfinder */}
                <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col justify-between">
                    <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200">
                        {/* Fake Webcam View */}
                        <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80" alt="Webcam Feed" className="w-full h-full object-cover" />

                        {/* Crop Guide Overlays */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-[300px] h-[380px] border-2 border-blue-500/30 relative">
                                {/* Corners */}
                                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-600 -mt-1 -ml-1"></div>
                                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-600 -mt-1 -mr-1"></div>
                                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-600 -mb-1 -ml-1"></div>
                                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-600 -mb-1 -mr-1"></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex gap-4">
                        <button onClick={() => showToast("Retaking photo", "success")} className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs py-2.5 rounded flex items-center justify-center gap-2 transition-colors shadow-sm">
                            <Camera size={14} /> Retake
                        </button>
                        <button onClick={() => showToast("Photo captured!", "success")} className="flex-[1.5] bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded flex items-center justify-center gap-2 transition-colors shadow-sm">
                            <Camera size={14} /> Capture Photo
                        </button>
                        <button onClick={() => showToast("File picker opened", "success")} className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs py-2.5 rounded flex items-center justify-center gap-2 transition-colors shadow-sm">
                            <Upload size={14} /> Upload Photo
                        </button>
                    </div>
                </div>

                {/* Right Pane: Preview & Info */}
                <div className="w-[300px] bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <h2 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Captured Photo Preview</h2>

                    <div className="flex flex-col items-center mb-6">
                        <div className="w-[120px] h-[150px] bg-gray-100 rounded border border-gray-200 overflow-hidden mb-3">
                            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" alt="Captured Thumbnail" className="w-full h-full object-cover" />
                        </div>
                        <button onClick={() => showToast("Crop tool opened", "success")} className="text-blue-600 text-[10px] font-bold border border-blue-200 bg-blue-50 hover:bg-blue-100 px-4 py-1.5 rounded-full flex items-center gap-1.5 transition-colors">
                            <Crop size={12} /> Crop & Adjust
                        </button>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-[10px] font-bold text-gray-900 mb-2 uppercase">Photo Information</h3>
                        <div className="space-y-1.5 text-[10px]">
                            <div className="flex justify-between"><span className="text-gray-500">File Name</span><span className="font-medium text-gray-900 truncate max-w-[120px]">rahul_sharma_20240515.jpg</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">File Size</span><span className="font-medium text-gray-900">145 KB</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Image Size</span><span className="font-medium text-gray-900">400 x 500 px</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Format</span><span className="font-medium text-gray-900">JPG</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Captured On</span><span className="font-medium text-gray-900">{formatDate(new Date().toISOString())} 11:30 AM</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Captured By</span><span className="font-medium text-gray-900">Receptionist</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Camera Source</span><span className="font-medium text-gray-900">Integrated Webcam</span></div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[10px] font-bold text-gray-900 mb-2 uppercase">Photo Quality Check</h3>
                        <ul className="space-y-2 text-[10px] text-gray-700">
                            <li className="flex items-center gap-2"><div className="w-3 h-3 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Check size={8} /></div> Image is clear</li>
                            <li className="flex items-center gap-2"><div className="w-3 h-3 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Check size={8} /></div> Proper lighting</li>
                            <li className="flex items-center gap-2"><div className="w-3 h-3 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Check size={8} /></div> Good resolution</li>
                            <li className="flex items-center gap-2"><div className="w-3 h-3 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Check size={8} /></div> Face is clearly visible</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Table: Photo History */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-[60px]">
                <h2 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Photo History</h2>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <DataTable
                        columns={columns}
                        data={history}
                        customStyles={customStyles}
                        noDataComponent={<div className="p-4 text-xs text-gray-500">No photo history found</div>}
                    />
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-[260px] right-0 bg-white border-t border-gray-200 p-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40 flex items-center justify-between">
                <div className="flex gap-2">
                    <button onClick={() => showToast("Photo saved securely", "success")} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-6 rounded shadow-sm flex items-center gap-1.5 transition-colors">
                        <Upload size={14} /> Save Photo
                    </button>
                    <button onClick={() => window.print()} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium py-1.5 px-4 rounded flex items-center gap-1.5 transition-colors">
                        <Printer size={14} /> Print ID Card
                    </button>
                    <button onClick={() => showToast("Downloading...", "success")} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium py-1.5 px-4 rounded flex items-center gap-1.5 transition-colors">
                        <Download size={14} /> Download
                    </button>
                    <button onClick={() => showToast("Set as primary profile photo", "success")} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium py-1.5 px-4 rounded flex items-center gap-1.5 transition-colors">
                        <Check size={14} /> Set as Primary
                    </button>
                </div>
                <div>
                    <button onClick={() => router.back()} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium py-1.5 px-6 rounded flex items-center gap-1.5 transition-colors">
                        <X size={14} /> Cancel
                    </button>
                </div>
            </div>

        </div>
    );
}