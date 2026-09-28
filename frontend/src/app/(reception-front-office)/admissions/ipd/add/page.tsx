"use client";

import React, { useState, useEffect } from 'react';
import {
    Bed, Home, ChevronRight, User, AlertCircle, FileText, UploadCloud,
    X, Check, Activity, Info, CreditCard, Stethoscope, Search, Plus, Calendar, Save, Edit
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { patientAPI, doctorAPI, departmentAPI, roomAllotmentAPI } from '@/lib/api';
import dayjs from 'dayjs';

export default function NewIPDAdmissionPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryPatientId = searchParams.get('patientId');
    const queryRoomId = searchParams.get('roomId');
    const mode = searchParams.get('mode') || 'add';
    const allotmentId = searchParams.get('id');

    // Data states
    const [doctors, setDoctors] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [availableRooms, setAvailableRooms] = useState<any[]>([]);

    // Patient Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);

    // Form states
    const [formData, setFormData] = useState({
        allotmentDate: dayjs().format('YYYY-MM-DDTHH:mm'),
        admissionType: '',
        admissionThrough: '',
        referredBy: '',
        department: '',
        attendingDoctor: '',
        consultantNotes: '',
        priority: '',
        payerType: '',
        paymentMethod: '',
        insuranceDetails: '',
        expectedAmount: '',
        estimateNotRequired: false,
        chiefComplaints: '',
        historyOfPresentIllness: '',
        provisionalDiagnosis: '',
        vitals: { mode: '', bp: '', pulse: '', temp: '', spo2: '' },
        covidSymptoms: '',
        isolationRequired: '',
        roomId: '',
        bed: '',
        additionalNotes: '',
        specialRequirements: '',
        expectedDischargeDate: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchInitialData();
        if (queryPatientId) fetchPatientDetails(queryPatientId);
        if (allotmentId && (mode === 'edit' || mode === 'view')) fetchAllotmentData(allotmentId);
        if (queryRoomId) setFormData(prev => ({ ...prev, roomId: queryRoomId }));
    }, [queryPatientId, allotmentId, mode, queryRoomId]);

    const fetchAllotmentData = async (id: string) => {
        try {
            const res = await roomAllotmentAPI.getById(id);
            const allotment = res.data;
            if (allotment) {
                setFormData(prev => ({
                    ...prev,
                    allotmentDate: allotment.allotmentDate ? dayjs(allotment.allotmentDate).format('YYYY-MM-DDTHH:mm') : prev.allotmentDate,
                    roomId: allotment.roomId?.toString() || '',
                    attendingDoctor: allotment.attendingDoctor || '',
                    expectedDischargeDate: allotment.expectedDischargeDate ? dayjs(allotment.expectedDischargeDate).format('YYYY-MM-DD') : '',
                    additionalNotes: allotment.additionalNotes || '',
                    paymentMethod: allotment.paymentMethod || '',
                    insuranceDetails: allotment.insuranceDetails || '',
                    bed: allotment.bed || '',
                }));
                if (allotment.patientId) {
                    fetchPatientDetails(allotment.patientId.toString());
                }
            }
        } catch (err) {
            console.error("Error fetching allotment data", err);
            setError("Failed to fetch admission details.");
        }
    };

    const fetchInitialData = async () => {
        try {
            const [docsRes, deptsRes, roomsRes] = await Promise.all([
                doctorAPI.list(1, 100),
                departmentAPI.list(1, 100),
                roomAllotmentAPI.available().catch(() => ({ data: { rooms: [] } }))
            ]);

            setDoctors(docsRes?.data?.data || docsRes?.data?.doctors || []);
            setDepartments(deptsRes?.data?.data || deptsRes?.data?.departments || []);

            if (roomsRes?.data?.rooms) {
                setAvailableRooms(roomsRes.data.rooms);
            }
        } catch (err) {
            console.error("Error fetching initial data", err);
        }
    };

    const fetchPatientDetails = async (id: string) => {
        try {
            const res = await patientAPI.getById(id);
            if (res?.data?.patient) {
                setSelectedPatient(res.data.patient);
            }
        } catch (err) {
            console.error("Error fetching patient", err);
        }
    };

    const handlePatientSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 2) {
            setIsSearching(true);
            try {
                const res = await patientAPI.search(query);
                setSearchResults(res?.data?.patients || []);
            } catch (err) {
                console.error(err);
            } finally {
                setIsSearching(false);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleSelectPatient = (patient: any) => {
        setSelectedPatient(patient);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleVitalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            vitals: { ...prev.vitals, [name]: value }
        }));
    };

    const handleSubmit = async () => {
        if (!selectedPatient) {
            setError('Please select a patient first.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        if (!formData.roomId) {
            setError('Please assign a room/bed.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setError('');
        setIsSubmitting(true);
        try {
            const payload = {
                roomId: parseInt(formData.roomId),
                patientId: selectedPatient.id,
                patientName: selectedPatient.name || `${selectedPatient.firstName} ${selectedPatient.lastName}`,
                allotmentDate: new Date(formData.allotmentDate).toISOString(),
                expectedDischargeDate: formData.expectedDischargeDate ? new Date(formData.expectedDischargeDate).toISOString() : null,
                additionalNotes: formData.additionalNotes,
                // Passing extra data to backend just in case
                ...formData
            };
            
            if (mode === 'edit' && allotmentId) {
                await roomAllotmentAPI.update(allotmentId, payload);
            } else {
                await roomAllotmentAPI.create(payload);
            }
            
            router.push('/admissions/ipd');
        } catch (err: any) {
            console.error('Admission error:', err);
            setError(err?.response?.data?.error || 'Failed to create admission. Please check database connection.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate selected room details
    const selectedRoom = availableRooms.find(r => r.id === formData.roomId);

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 -m-6 pb-24 font-sans">

            {/* Page Header */}
            <div className='flex justify-between'>
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-600 rounded-lg p-2 text-white shadow-sm">
                        <Bed size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            {mode === 'view' ? 'View Admission' : mode === 'edit' ? 'Edit Admission' : 'IPD Admission'}
                        </h1>
                        <div className="flex items-center text-xs text-gray-500 gap-1.5 mt-1">
                            <Home size={12} className="text-gray-400" />
                            <span>Home</span>
                            <ChevronRight size={12} className="text-gray-400" />
                            <span>Admissions</span>
                            <ChevronRight size={12} className="text-gray-400" />
                            <span className="text-gray-800 font-medium">IPD Admission</span>
                        </div>
                    </div>
                </div>
                <div className="">
                    {!selectedPatient ? (
                        <div className="max-w-2xl mx-auto py-8">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search size={15} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by name, UHID, or mobile..."
                                    value={searchQuery}
                                    onChange={handlePatientSearch}
                                    className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                />
                                {isSearching && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">Searching...</div>}

                                {searchResults.length > 0 && (
                                    <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-gray-200 rounded shadow-xl max-h-64 overflow-y-auto">
                                        {searchResults.map(p => (
                                            <div key={p.id} onClick={() => handleSelectPatient(p)} className="p-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer flex justify-between items-center transition-colors">
                                                <div>
                                                    <p className="font-bold text-gray-900">{p.name || `${p.firstName} ${p.lastName}`}</p>
                                                    <p className="text-xs text-gray-500">UHID: {p.uhid} | {p.mobile || p.phone}</p>
                                                </div>
                                                <button className="text-blue-600 bg-white border border-blue-200 px-3 py-1 rounded text-xs font-semibold hover:bg-blue-600 hover:text-white transition-colors">Select</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-8 relative">
                            {mode === 'add' && (
                                <button onClick={() => setSelectedPatient(null)} className="absolute top-0 right-0 text-gray-400 hover:text-gray-700 bg-gray-50 p-1.5 rounded-md text-xs font-medium border border-gray-200">Change Patient</button>
                            )}
                            {/* Basic Info */}
                            <div className="flex gap-4 w-[280px] shrink-0 border-r border-gray-100 pr-4">
                                <div className="w-14 h-14 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0 overflow-hidden">
                                    <User size={28} className="text-blue-500" />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-[15px] font-bold text-gray-900 leading-none truncate max-w-[150px]">{selectedPatient.name || `${selectedPatient.firstName} ${selectedPatient.lastName}`}</h2>
                                        <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">{selectedPatient.gender || 'Unknown'}</span>
                                    </div>
                                    <div className="grid grid-cols-[60px_1fr] gap-y-1 gap-x-2 text-[11px] mt-1.5">
                                        <span className="text-gray-500 font-medium">UHID</span>
                                        <span className="font-semibold text-gray-900">{selectedPatient.uhid || '-'}</span>
                                        <span className="text-gray-500 font-medium">DOB</span>
                                        <span className="font-semibold text-gray-900">{selectedPatient.dob ? dayjs(selectedPatient.dob).format('DD MMM YYYY') : '-'}</span>
                                        <span className="text-gray-500 font-medium">Mobile</span>
                                        <span className="font-semibold text-gray-900">{selectedPatient.mobile || selectedPatient.phone || '-'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="w-[280px] shrink-0 border-r border-gray-100 pr-4 flex flex-col justify-center">
                                <div className="grid grid-cols-[70px_1fr] gap-y-2 gap-x-2 text-[11px]">
                                    <span className="text-gray-500 font-medium">Address</span>
                                    <span className="font-semibold text-gray-900 leading-tight">{selectedPatient.address || '-'}</span>
                                    <span className="text-gray-500 font-medium">Email</span>
                                    <span className="font-semibold text-gray-900">{selectedPatient.email || '-'}</span>
                                    <span className="text-gray-500 font-medium">Blood Group</span>
                                    <span className="font-bold text-red-600">{selectedPatient.bloodGroup || '-'}</span>
                                </div>
                            </div>

                            {/* Medical History Info */}
                            <div className="w-[200px] shrink-0 border-r border-gray-100 pr-4 flex flex-col justify-center">
                                <div className="flex flex-col gap-3 text-[11px]">
                                    <div>
                                        <span className="text-gray-500 font-medium block mb-0.5">Allergies</span>
                                        <span className="font-semibold text-gray-900">{selectedPatient.allergies || 'No Known Allergies'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 font-medium block mb-0.5">Chronic Diseases</span>
                                        <span className="font-semibold text-gray-900">{selectedPatient.chronicConditions || 'None'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Previous Admissions */}
                            <div className="flex-1 flex flex-col justify-center">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[11px] font-bold text-gray-700">Previous IPD Admissions</span>
                                    <button className="text-[10px] font-bold text-blue-600 hover:underline">View History</button>
                                </div>
                                <div className="grid grid-cols-[80px_1fr] gap-y-1 gap-x-2 text-[11px]">
                                    <span className="text-gray-500 font-medium">Last Admission</span>
                                    <span className="font-semibold text-gray-900">N/A</span>
                                    <span className="text-gray-500 font-medium">Last Discharge</span>
                                    <span className="font-semibold text-gray-900">N/A</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm font-medium flex items-center gap-2">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            {/* Stepper */}
            <div className={`mb-6 relative flex justify-between items-center px-4`}>
                <div className="absolute left-8 right-8 top-1/2 h-0.5 bg-gray-200 -z-10 -translate-y-1/2"></div>

                {[
                    { num: 1, label: 'Admission Details', active: true },
                    { num: 2, label: 'Clinical Details', active: false },
                    { num: 3, label: 'Bed Assignment', active: false },
                    { num: 4, label: 'Payer Details', active: false },
                    { num: 5, label: 'Documents', active: false },
                    { num: 6, label: 'Review & Confirm', active: false }
                ].map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-[#f8fafc] px-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shadow-sm ${step.active ? 'bg-blue-600 text-white border-2 border-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
                            {step.num}
                        </div>
                        <span className={`text-[11px] font-semibold ${step.active ? 'text-blue-600' : 'text-gray-500'}`}>{step.label}</span>
                    </div>
                ))}
            </div>

            {/* Main Form Grid */}
            <fieldset disabled={mode === 'view'} className={`grid grid-cols-1 md:grid-cols-3 gap-6`}>

                {/* Column 1 */}
                <div className="flex flex-col gap-6">
                    {/* Admission Details */}
                    <div className="bg-white rounded shadow-sm border border-gray-100 p-5">
                        <h3 className="text-[13px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText size={16} className="text-blue-600" /> Admission Details
                        </h3>

                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="flex-1 space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-600">Admission Date & Time <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <input type="datetime-local" name="allotmentDate" value={formData.allotmentDate} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] text-gray-900 focus:outline-none focus:border-blue-500 bg-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="flex-1 space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-600">Admission Type <span className="text-red-500">*</span></label>
                                    <select name="admissionType" value={formData.admissionType} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] text-gray-900 focus:outline-none focus:border-blue-500 bg-white">
                                        <option value="">Select Type</option>
                                        <option value="Emergency">Emergency</option>
                                        <option value="OPD">OPD</option>
                                        <option value="Elective">Elective</option>
                                        <option value="Referral">Referral</option>
                                    </select>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-600">Admission Through <span className="text-red-500">*</span></label>
                                    <select name="admissionThrough" value={formData.admissionThrough} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] text-gray-900 focus:outline-none focus:border-blue-500 bg-white">
                                        <option value="">Select Source</option>
                                        <option value="OPD">OPD</option>
                                        <option value="Casualty">Casualty</option>
                                        <option value="Direct">Direct</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="flex-[1.5] space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-600">Referred By</label>
                                    <select name="referredBy" value={formData.referredBy} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] text-gray-900 focus:outline-none focus:border-blue-500 bg-white">
                                        <option value="">Select Doctor</option>
                                        {doctors.map(d => (
                                            <option key={d.id} value={d.name}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-600">Department <span className="text-red-500">*</span></label>
                                    <select name="department" value={formData.department} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] text-gray-900 focus:outline-none focus:border-blue-500 bg-white">
                                        <option value="">Select Dept</option>
                                        {departments.map(d => (
                                            <option key={d.id} value={d.name}>{d.name}</option>
                                        ))}
                                        <option value="Cardiology">Cardiology</option>
                                        <option value="Neurology">Neurology</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-gray-600">Consultant Doctor <span className="text-red-500">*</span></label>
                                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                                    <select name="attendingDoctor" value={formData.attendingDoctor} onChange={handleInputChange} className="w-full px-3 py-2 border-b border-gray-100 text-[12px] font-semibold text-gray-900 focus:outline-none bg-white">
                                        <option value="">Select Consultant</option>
                                        {doctors.map(d => (
                                            <option key={d.id} value={d.name}>{d.name}</option>
                                        ))}
                                    </select>
                                    <textarea name="consultantNotes" value={formData.consultantNotes} onChange={handleInputChange} rows={2} placeholder="Add consultant remarks..." className="w-full px-3 py-2 text-[11px] text-gray-600 focus:outline-none bg-gray-50 resize-none"></textarea>
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <label className="text-[11px] font-semibold text-gray-600">Priority</label>
                                <div className="flex gap-6">
                                    {['Normal', 'Urgent', 'Emergency'].map(p => (
                                        <label key={p} className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="priority" value={p} checked={formData.priority === p} onChange={handleInputChange} className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" />
                                            <span className="text-[12px] text-gray-800 font-medium">{p}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payer Details */}
                    <div className="bg-white rounded shadow-sm border border-gray-100 p-5">
                        <h3 className="text-[13px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CreditCard size={16} className="text-blue-600" /> Payer Details
                        </h3>

                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="flex-1 space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-600">Payer Type <span className="text-red-500">*</span></label>
                                    <select name="payerType" value={formData.payerType} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] text-gray-900 focus:outline-none focus:border-blue-500 bg-white">
                                        <option value="">Select Payer</option>
                                        <option value="Self">Self</option>
                                        <option value="Insurance">Insurance</option>
                                        <option value="Corporate">Corporate</option>
                                    </select>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-600">Payment Mode <span className="text-red-500">*</span></label>
                                    <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] text-gray-900 focus:outline-none focus:border-blue-500 bg-white">
                                        <option value="">Select Mode</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Card">Card</option>
                                        <option value="UPI">UPI</option>
                                        <option value="Insurance">Insurance</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="flex-1 space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-600">Corporate/TPA (If any)</label>
                                    <input type="text" name="insuranceDetails" value={formData.insuranceDetails} onChange={handleInputChange} placeholder="Select or type" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] text-gray-900 focus:outline-none focus:border-blue-500 bg-white" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-600">Expected Amount (₹)</label>
                                    <input type="number" name="expectedAmount" value={formData.expectedAmount} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] text-gray-900 focus:outline-none focus:border-blue-500 bg-white font-medium" />
                                </div>
                            </div>

                            <div className="pt-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" name="estimateNotRequired" checked={formData.estimateNotRequired} onChange={handleInputChange} className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-[11px] text-gray-600 font-medium">Estimate not required</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2 */}
                <div className="flex flex-col gap-6">
                    {/* Clinical Details */}
                    <div className="bg-white rounded shadow-sm border border-gray-100 p-5">
                        <h3 className="text-[13px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Activity size={16} className="text-blue-600" /> Clinical Details
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-gray-600">Chief Complaints <span className="text-red-500">*</span></label>
                                <textarea name="chiefComplaints" value={formData.chiefComplaints} onChange={handleInputChange} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 resize-none"></textarea>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-gray-600">History of Present Illness</label>
                                <textarea name="historyOfPresentIllness" value={formData.historyOfPresentIllness} onChange={handleInputChange} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] text-gray-700 focus:outline-none focus:border-blue-500 resize-none"></textarea>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-gray-600">Provisional Diagnosis <span className="text-red-500">*</span></label>
                                <input type="text" name="provisionalDiagnosis" value={formData.provisionalDiagnosis} onChange={handleInputChange} placeholder="Type diagnosis..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 bg-white" />
                            </div>

                            <div className="grid grid-cols-5 gap-2 pt-2">
                                <div className="space-y-1 col-span-1">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider text-center block">Mode</label>
                                    <select name="mode" value={formData.vitals.mode} onChange={handleVitalChange} className="w-full px-1 py-1.5 border border-gray-200 rounded text-[10px] text-gray-800 text-center font-medium bg-white">
                                        <option value="">Select</option>
                                        <option value="Walk-In">Walk-In</option>
                                        <option value="Wheelchair">Wheelchair</option>
                                        <option value="Stretcher">Stretcher</option>
                                    </select>
                                </div>
                                <div className="space-y-1 col-span-1">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider text-center block">BP (mmHg)</label>
                                    <input type="text" name="bp" value={formData.vitals.bp} onChange={handleVitalChange} placeholder="120/80" className="w-full px-1 py-1.5 border border-gray-200 rounded text-[11px] text-center font-bold text-gray-900" />
                                </div>
                                <div className="space-y-1 col-span-1">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider text-center block">Pulse (bpm)</label>
                                    <input type="text" name="pulse" value={formData.vitals.pulse} onChange={handleVitalChange} placeholder="72" className="w-full px-1 py-1.5 border border-gray-200 rounded text-[11px] text-center font-bold text-gray-900" />
                                </div>
                                <div className="space-y-1 col-span-1">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider text-center block">Temp (°F)</label>
                                    <input type="text" name="temp" value={formData.vitals.temp} onChange={handleVitalChange} placeholder="98.6" className="w-full px-1 py-1.5 border border-gray-200 rounded text-[11px] text-center font-bold text-gray-900" />
                                </div>
                                <div className="space-y-1 col-span-1">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider text-center block">SpO2 (%)</label>
                                    <input type="text" name="spo2" value={formData.vitals.spo2} onChange={handleVitalChange} placeholder="99" className="w-full px-1 py-1.5 border border-gray-200 rounded text-[11px] text-center font-bold text-gray-900" />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <div className="flex-1 space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-600">COVID-19 Symptoms</label>
                                    <select name="covidSymptoms" value={formData.covidSymptoms} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] text-gray-900 focus:outline-none bg-white">
                                        <option value="">Select</option>
                                        <option value="No">No</option>
                                        <option value="Yes">Yes</option>
                                    </select>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-600">Isolation Required</label>
                                    <select name="isolationRequired" value={formData.isolationRequired} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] text-gray-900 focus:outline-none bg-white">
                                        <option value="">Select</option>
                                        <option value="No">No</option>
                                        <option value="Yes">Yes</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="bg-white rounded shadow-sm border border-gray-100 p-5">
                        <h3 className="text-[13px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <UploadCloud size={16} className="text-blue-600" /> Documents
                        </h3>

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-gray-600">Upload Documents</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50/50 cursor-pointer hover:bg-gray-50 transition-colors">
                                    <UploadCloud size={20} className="text-gray-400 mb-2" />
                                    <p className="text-[11px] font-semibold text-gray-600">Click to upload or drag and drop</p>
                                    <p className="text-[9px] text-gray-400 mt-0.5">PDF, JPG, PNG (Max. 5MB)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 3 */}
                <div className="flex flex-col gap-6">
                    {/* Bed Assignment */}
                    <div className="bg-white rounded shadow-sm border border-gray-100 p-5">
                        <h3 className="text-[13px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Bed size={16} className="text-blue-600" /> Bed Assignment
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-gray-600">Select Room / Bed <span className="text-red-500">*</span></label>
                                <select name="roomId" value={formData.roomId} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] text-gray-900 focus:outline-none focus:border-blue-500 bg-white">
                                    <option value="">Select Available Room</option>
                                    {availableRooms.map(r => (
                                        <option key={r.id} value={r.id}>Room {r.roomNumber} - {r.roomType} ({r.department})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1 w-1/2 pr-1.5">
                                <label className="text-[11px] font-semibold text-gray-600">Expected Discharge Date</label>
                                <input type="date" name="expectedDischargeDate" value={formData.expectedDischargeDate} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] text-gray-900 focus:outline-none bg-white font-medium" />
                            </div>

                            {/* Bed Details Box */}
                            {selectedRoom && (
                                <div className="mt-4 bg-emerald-50/50 border border-emerald-100 rounded-lg p-3">
                                    <h4 className="text-[11px] font-bold text-gray-800 mb-3 border-b border-emerald-100 pb-1">Bed Details</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="text-gray-600 font-medium">Bed Status</span>
                                            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide">Available</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="text-gray-600 font-medium">Bed Type</span>
                                            <span className="font-bold text-gray-900">{selectedRoom.roomType}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="text-gray-600 font-medium">Department</span>
                                            <span className="font-bold text-gray-900">{selectedRoom.department}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="bg-white rounded shadow-sm border border-gray-100 p-5">
                        <h3 className="text-[13px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText size={16} className="text-blue-600" /> Additional Notes
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-gray-600">Notes</label>
                                <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleInputChange} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] text-gray-700 focus:outline-none focus:border-blue-500 resize-none"></textarea>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-gray-600">Special Instructions</label>
                                <textarea name="specialRequirements" value={formData.specialRequirements} onChange={handleInputChange} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] text-gray-700 focus:outline-none focus:border-blue-500 resize-none"></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Admission Summary */}
                    <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5">
                            <h3 className="text-[13px] font-bold text-gray-900 mb-4">Admission Summary</h3>

                            <div className="grid grid-cols-[120px_1fr] gap-y-2 text-[11px]">
                                <span className="text-gray-500 font-medium">Patient Name</span>
                                <span className="font-bold text-gray-900">{selectedPatient ? (selectedPatient.name || `${selectedPatient.firstName} ${selectedPatient.lastName}`) : '-'}</span>

                                <span className="text-gray-500 font-medium">UHID</span>
                                <span className="font-semibold text-gray-900">{selectedPatient ? selectedPatient.uhid : '-'}</span>

                                <span className="text-gray-500 font-medium">Consultant</span>
                                <span className="font-semibold text-gray-900">{formData.attendingDoctor || '-'}</span>

                                <span className="text-gray-500 font-medium">Admission Type</span>
                                <span className="font-semibold text-gray-900">{formData.admissionType || '-'}</span>

                                <span className="text-gray-500 font-medium">Room Assigned</span>
                                <span className="font-semibold text-gray-900">{selectedRoom ? `Room ${selectedRoom.roomNumber} - ${selectedRoom.roomType}` : '-'}</span>

                                <span className="text-gray-500 font-medium">Payer Type</span>
                                <span className="font-semibold text-gray-900">{formData.payerType || '-'}</span>
                            </div>
                        </div>
                        <div className="bg-blue-50/80 p-4 border-t border-blue-100 flex justify-between items-center">
                            <span className="text-[12px] font-bold text-blue-900">Estimated Total (₹)</span>
                            <span className="text-[16px] font-bold text-blue-700">{formData.expectedAmount ? Number(formData.expectedAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}</span>
                        </div>
                    </div>
                </div>
            </fieldset>

            {/* Bottom Fixed Action Bar */}
            <div className="fixed bottom-0 left-[260px] right-0 bg-white border-t border-gray-200 p-3 px-6 flex justify-between items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <button onClick={() => router.push('/admissions/ipd')} className="px-5 py-2 border border-gray-200 text-gray-700 rounded-lg text-[13px] font-semibold hover:bg-gray-50 transition-colors">
                    {mode === 'view' ? 'Back' : 'Cancel'}
                </button>
                <div className="flex gap-3">
                    {mode === 'view' ? (
                        <button 
                            onClick={() => router.push(`/admissions/ipd/add?mode=edit&id=${allotmentId}`)} 
                            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-[13px] font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                        >
                            <Edit size={16} /> Edit Admission
                        </button>
                    ) : (
                        <>
                            <button className="px-5 py-2 border border-blue-200 bg-blue-50 text-blue-600 rounded-lg text-[13px] font-semibold hover:bg-blue-100 transition-colors">
                                Save as Draft
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg text-[13px] font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                            >
                                <Check size={16} /> {isSubmitting ? 'Processing...' : (mode === 'edit' ? 'Update & Confirm' : 'Review & Confirm')}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
