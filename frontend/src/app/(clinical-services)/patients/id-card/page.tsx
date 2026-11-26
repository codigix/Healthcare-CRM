"use client";

import { useState, useEffect } from "react";
import { patientAPI } from "@/lib/api";
import { useSearchParams, useRouter } from "next/navigation";
import PatientTabs from "@/components/Patients/PatientTabs";
import {
    Download, ChevronDown, User, Printer, Mail, Check, AlertCircle, X,
    Eye, RefreshCw, Send, PhoneCall, Smartphone, FileText
} from "lucide-react";

export default function PatientIdCard() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const patientId = searchParams.get('patientId');
    const [patientData, setPatientData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
    const [activeSide, setActiveSide] = useState('Front');

    // Settings State
    const [showQR, setShowQR] = useState(true);
    const [showEmergency, setShowEmergency] = useState(true);
    const [showLogo, setShowLogo] = useState(true);
    const [showSignatory, setShowSignatory] = useState(true);
    const [primaryColor, setPrimaryColor] = useState('#2563EB');
    const [secondaryColor, setSecondaryColor] = useState('#06B6D4');

    useEffect(() => {
        fetchData();
    }, [patientId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await patientAPI.dashboard(patientId || undefined);
            if (res.data.success && res.data.data) {
                setPatientData(res.data.data);
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

    if (loading) return <div className="p-8 text-center text-gray-500">Loading ID Card data...</div>;
    if (!patientData) return <div className="p-8 text-center text-red-500">No patient data found.</div>;

    const p = patientData.personal || {};
    const mp = patientData.medicalProfile || {};
    const age = p.dob ? Math.floor((new Date().getTime() - new Date(p.dob).getTime()) / 31557600000) : '-';

    const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

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

            {/* Main Content (2 columns) */}
            <div className="flex gap-4 mb-[60px]">

                {/* Left Pane: Preview & Info */}
                <div className="flex-[2.5] flex flex-col gap-4">
                    {/* Preview Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col items-center flex-1">
                        <div className="w-full text-left mb-6">
                            <h2 className="text-sm font-bold text-gray-900">Patient ID Card Preview</h2>
                        </div>

                        {/* THE ID CARD */}
                        <div className="w-[500px] h-[320px] bg-white rounded shadow-lg border border-gray-200 overflow-hidden relative flex flex-col">
                            {/* Card Header */}
                            <div className="p-5 flex justify-between items-start z-10 relative bg-white">
                                <div className="flex items-center gap-2 transition-opacity duration-300" style={{ opacity: showLogo ? 1 : 0 }}>
                                    <div className="text-blue-600 font-black text-3xl leading-none">+</div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm leading-none">CityCare</h3>
                                        <p className="text-[10px] text-gray-600">Multi Speciality Hospital</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <h4 className="font-bold text-blue-700 text-[11px] tracking-widest uppercase mb-0.5">Patient ID Card</h4>
                                    <p className="text-[9px] text-gray-500">www.citycarehospital.com</p>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="px-6 flex gap-6 z-10 relative bg-white flex-1 pt-1">
                                <div className="w-28 h-32 rounded-lg border-2 border-gray-100 overflow-hidden shadow-sm flex-shrink-0 bg-gray-50">
                                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" alt="Patient" className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <h2 className="text-lg font-bold text-blue-700 mb-2">{p.firstName} {p.lastName}</h2>
                                    <table className="text-[10px] font-semibold text-gray-700 w-full">
                                        <tbody>
                                            <tr><td className="py-0.5 w-16">UHID</td><td className="py-0.5">: UH000{p.id?.substring(0, 4).toUpperCase()}</td></tr>
                                            <tr><td className="py-0.5 w-16">MRN</td><td className="py-0.5">: {p.mrn || '-'}</td></tr>
                                            <tr><td className="py-0.5 w-16">Reg. No.</td><td className="py-0.5">: REG-{p.id?.substring(0, 8).toUpperCase()}</td></tr>
                                            <tr><td className="py-0.5 w-16">DOB</td><td className="py-0.5">: {formatDate(p.dob)}</td></tr>
                                            <tr><td className="py-0.5 w-16">Gender</td><td className="py-0.5">: {p.gender}</td></tr>
                                            <tr><td className="py-0.5 w-16 mt-1 block">Blood Group</td><td className="py-0.5 font-bold text-red-600 mt-1 block">: {mp.bloodGroup || '-'}</td></tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className={`w-20 transition-opacity duration-300 ${showQR ? 'opacity-100' : 'opacity-0'}`}>
                                    <div className="w-20 h-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-cover"></div>
                                </div>
                            </div>

                            {/* Complex SVG Wave Footer */}
                            <div className="absolute bottom-0 left-0 right-0 h-24 z-0 overflow-hidden">
                                <svg viewBox="0 0 500 100" preserveAspectRatio="none" className="w-full h-full">
                                    <path d="M0,40 C150,100 350,0 500,40 L500,100 L0,100 Z" fill={secondaryColor}></path>
                                    <path d="M0,60 C200,120 400,-20 500,40 L500,100 L0,100 Z" fill={primaryColor}></path>
                                </svg>

                                <div className="absolute inset-0 z-20 flex justify-between items-end px-6 pb-3 text-white">
                                    <div className={`transition-opacity duration-300 ${showSignatory ? 'opacity-100' : 'opacity-0'}`}>
                                        <div className="font-[Cedarville_Cursive] text-xl opacity-90 -rotate-2 -mb-1">Authorised</div>
                                        <div className="text-[8px] font-medium tracking-wide">Authorised Signatory</div>
                                    </div>

                                    <div className={`flex items-center gap-2 transition-opacity duration-300 ${showEmergency ? 'opacity-100' : 'opacity-0'}`}>
                                        <div className="w-7 h-7 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                                            <PhoneCall size={14} className="text-white" fill="white" />
                                        </div>
                                        <div>
                                            <div className="text-[8px] opacity-90">Emergency Contact</div>
                                            <div className="text-sm font-bold leading-tight">+91 98765 43210</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Toggle */}
                        <div className="mt-8 flex rounded-md overflow-hidden border border-gray-200">
                            <button onClick={() => setActiveSide('Front')} className={`px-8 py-2 text-sm font-semibold transition-colors ${activeSide === 'Front' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Front Side</button>
                            <button onClick={() => setActiveSide('Back')} className={`px-8 py-2 text-sm font-semibold transition-colors border-l border-gray-200 ${activeSide === 'Back' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Back Side</button>
                        </div>
                    </div>

                    {/* Card Information Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
                        <h2 className="text-sm font-bold text-gray-900 mb-5">Card Information</h2>

                        <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 text-xs"><span className="text-gray-500 font-medium">Patient Name</span><span className="font-bold text-gray-900 truncate">{p.firstName} {p.lastName}</span></div>
                                <div className="grid grid-cols-2 text-xs"><span className="text-gray-500 font-medium">UHID</span><span className="font-bold text-gray-900">UH000{p.id?.substring(0, 4).toUpperCase()}</span></div>
                                <div className="grid grid-cols-2 text-xs"><span className="text-gray-500 font-medium">MRN</span><span className="font-bold text-gray-900">{p.mrn || '-'}</span></div>
                                <div className="grid grid-cols-2 text-xs"><span className="text-gray-500 font-medium">Registration No.</span><span className="font-bold text-gray-900">REG-{p.id?.substring(0, 8).toUpperCase()}</span></div>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 text-xs"><span className="text-gray-500 font-medium">Date of Birth</span><span className="font-bold text-gray-900">{formatDate(p.dob)}</span></div>
                                <div className="grid grid-cols-2 text-xs"><span className="text-gray-500 font-medium">Gender</span><span className="font-bold text-gray-900">{p.gender}</span></div>
                                <div className="grid grid-cols-2 text-xs"><span className="text-gray-500 font-medium">Blood Group</span><span className="font-bold text-gray-900">{mp.bloodGroup || '-'}</span></div>
                                <div className="grid grid-cols-2 text-xs"><span className="text-gray-500 font-medium">Mobile</span><span className="font-bold text-gray-900">{p.phone}</span></div>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 text-xs"><span className="text-gray-500 font-medium">Issue Date</span><span className="font-bold text-gray-900">15 May 2024</span></div>
                                <div className="grid grid-cols-2 text-xs"><span className="text-gray-500 font-medium">Valid Till</span><span className="font-bold text-gray-900">15 May 2026</span></div>
                                <div className="grid grid-cols-2 text-xs items-center"><span className="text-gray-500 font-medium">Card Status</span><span><span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded text-[9px] font-bold">Active</span></span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Pane: Settings & Controls */}
                <div className="w-[320px] flex flex-col gap-4">
                    {/* Templates */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-bold text-gray-900">Card Templates</h2>
                            <button className="text-xs font-bold text-blue-600 hover:text-blue-800">View All</button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {/* Template 1 (Selected) */}
                            <div className="relative border-2 border-blue-500 rounded-lg p-1 cursor-pointer overflow-hidden group">
                                <div className="w-full h-16 bg-gray-50 rounded border border-gray-200 flex flex-col relative overflow-hidden">
                                    <div className="h-4 bg-white border-b border-gray-100"></div>
                                    <div className="absolute bottom-0 left-0 right-0 h-6">
                                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full"><path d="M0,40 C50,100 100,0 100,40 L100,100 L0,100 Z" fill="#2563EB"></path></svg>
                                    </div>
                                </div>
                                <div className="absolute bottom-1 right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white"><Check size={10} /></div>
                            </div>
                            {/* Template 2 */}
                            <div className="relative border border-gray-200 hover:border-blue-300 rounded-lg p-1 cursor-pointer overflow-hidden group">
                                <div className="w-full h-16 bg-gray-50 rounded border border-gray-200 flex flex-col relative overflow-hidden">
                                    <div className="absolute top-0 left-0 right-0 h-4 bg-emerald-500"></div>
                                    <div className="absolute bottom-0 left-0 right-0 h-4 bg-emerald-500"></div>
                                </div>
                            </div>
                            {/* Template 3 */}
                            <div className="relative border border-gray-200 hover:border-blue-300 rounded-lg p-1 cursor-pointer overflow-hidden group">
                                <div className="w-full h-16 bg-gray-50 rounded border border-gray-200 flex flex-col relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bottom-0 w-8 bg-indigo-500"></div>
                                </div>
                            </div>
                            {/* Template 4 */}
                            <div className="relative border border-gray-200 hover:border-blue-300 rounded-lg p-1 cursor-pointer overflow-hidden group">
                                <div className="w-full h-16 bg-gray-50 rounded border border-gray-200 flex flex-col relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-12 h-12 bg-amber-500 rounded-br-full"></div>
                                </div>
                            </div>
                            {/* Template 5 */}
                            <div className="relative border border-gray-200 hover:border-blue-300 rounded-lg p-1 cursor-pointer overflow-hidden group">
                                <div className="w-full h-16 bg-gray-50 rounded border border-gray-200 flex flex-col relative overflow-hidden">
                                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-blue-600"></div>
                                </div>
                            </div>
                            {/* Template 6 */}
                            <div className="relative border border-gray-200 hover:border-blue-300 rounded-lg p-1 cursor-pointer overflow-hidden group">
                                <div className="w-full h-16 bg-gray-50 rounded border border-gray-200 flex flex-col relative overflow-hidden p-1 bg-[linear-gradient(45deg,#f3f4f6_25%,transparent_25%,transparent_75%,#f3f4f6_75%,#f3f4f6),linear-gradient(45deg,#f3f4f6_25%,transparent_25%,transparent_75%,#f3f4f6_75%,#f3f4f6)]" style={{ backgroundSize: '10px 10px', backgroundPosition: '0 0, 5px 5px' }}>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
                        <h2 className="text-sm font-bold text-gray-900 mb-4">Card Settings</h2>

                        <div className="flex gap-3 mb-4">
                            <div className="flex-1">
                                <label className="text-[10px] font-semibold text-gray-500 mb-1.5 block">Select Template</label>
                                <div className="relative">
                                    <select className="w-full border border-gray-300 rounded text-xs py-1.5 px-2 text-gray-700 appearance-none bg-white font-medium">
                                        <option>Blue Modern</option>
                                    </select>
                                    <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="text-[10px] font-semibold text-gray-500 mb-1.5 block">Card Size</label>
                                <div className="relative">
                                    <select className="w-full border border-gray-300 rounded text-xs py-1.5 px-2 text-gray-700 appearance-none bg-white font-medium">
                                        <option>CR80 (85.60 x 54 mm)</option>
                                    </select>
                                    <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mb-6">
                            <div className="flex-1">
                                <label className="text-[10px] font-semibold text-gray-500 mb-1.5 block">Primary Color</label>
                                <div className="flex items-center gap-2 border border-gray-300 rounded p-1 pl-2">
                                    <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-4 h-4 rounded cursor-pointer border-0 p-0" />
                                    <input type="text" value={primaryColor.toUpperCase()} onChange={e => setPrimaryColor(e.target.value)} className="w-full text-[10px] font-mono text-gray-700 focus:outline-none" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="text-[10px] font-semibold text-gray-500 mb-1.5 block">Secondary Color</label>
                                <div className="flex items-center gap-2 border border-gray-300 rounded p-1 pl-2">
                                    <input type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="w-4 h-4 rounded cursor-pointer border-0 p-0" />
                                    <input type="text" value={secondaryColor.toUpperCase()} onChange={e => setSecondaryColor(e.target.value)} className="w-full text-[10px] font-mono text-gray-700 focus:outline-none" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-700">Show QR Code</span>
                                <button onClick={() => setShowQR(!showQR)} className={`w-8 h-4 rounded-full relative transition-colors ${showQR ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${showQR ? 'right-0.5 translate-x-0' : 'left-0.5 translate-x-0'}`}></div>
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-700">Show Emergency Contact</span>
                                <button onClick={() => setShowEmergency(!showEmergency)} className={`w-8 h-4 rounded-full relative transition-colors ${showEmergency ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${showEmergency ? 'right-0.5 translate-x-0' : 'left-0.5 translate-x-0'}`}></div>
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-700">Show Hospital Logo</span>
                                <button onClick={() => setShowLogo(!showLogo)} className={`w-8 h-4 rounded-full relative transition-colors ${showLogo ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${showLogo ? 'right-0.5 translate-x-0' : 'left-0.5 translate-x-0'}`}></div>
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-700">Show Authorised Signatory</span>
                                <button onClick={() => setShowSignatory(!showSignatory)} className={`w-8 h-4 rounded-full relative transition-colors ${showSignatory ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${showSignatory ? 'right-0.5 translate-x-0' : 'left-0.5 translate-x-0'}`}></div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Preview Options & Rules */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
                        <h2 className="text-sm font-bold text-gray-900 mb-4">Preview Options</h2>
                        <div className="flex gap-2 mb-5">
                            <button className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs py-2 rounded flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                                <Eye size={14} /> Preview
                            </button>
                            <button onClick={() => { setPrimaryColor('#2563EB'); setSecondaryColor('#06B6D4'); setShowQR(true); setShowEmergency(true); setShowLogo(true); setShowSignatory(true); showToast("Settings reset", "success"); }} className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs py-2 rounded flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                                <RefreshCw size={14} /> Reset
                            </button>
                        </div>
                        <ul className="space-y-1.5 text-[9px] text-gray-600 list-disc pl-4">
                            <li>This card is non-transferable.</li>
                            <li>Please carry this card during every visit.</li>
                            <li>Show this card at the reception for Identification.</li>
                            <li>In case of loss, contact the hospital immediately.</li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-[260px] right-0 bg-white border-t border-gray-200 p-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40 flex items-center justify-between">
                <div className="flex gap-2">
                    <button onClick={() => { showToast("Sending to printer...", "success"); window.print(); }} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-6 rounded shadow-sm flex items-center gap-1.5 transition-colors">
                        <Printer size={14} /> Print ID Card
                    </button>
                    <button onClick={() => showToast("Downloading ID Card image...", "success")} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium py-1.5 px-4 rounded flex items-center gap-1.5 transition-colors">
                        <Download size={14} /> Download
                    </button>
                    <button onClick={() => showToast("ID Card sent to Email successfully.", "success")} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium py-1.5 px-4 rounded flex items-center gap-1.5 transition-colors">
                        <Mail size={14} /> Send to Email
                    </button>
                    <button onClick={() => showToast("ID Card sent via WhatsApp.", "success")} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium py-1.5 px-4 rounded flex items-center gap-1.5 transition-colors">
                        <Send size={14} /> Send to WhatsApp
                    </button>
                    <button onClick={() => showToast("Saving as PDF...", "success")} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium py-1.5 px-4 rounded flex items-center gap-1.5 transition-colors">
                        <FileText size={14} /> Save as PDF
                    </button>
                    <button onClick={() => showToast("Generating a new ID Card...", "success")} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium py-1.5 px-4 rounded flex items-center gap-1.5 transition-colors">
                        <RefreshCw size={14} /> Generate New
                    </button>
                </div>
                <div>
                    <button onClick={() => router.back()} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium py-1.5 px-6 rounded flex items-center gap-1.5 transition-colors">
                        Back
                    </button>
                </div>
            </div>

        </div>
    );
}