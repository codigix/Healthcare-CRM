"use client";

import { useState, useEffect } from "react";
import { patientAPI } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import PatientTabs from "@/components/Patients/PatientTabs";
import { 
    Edit, Printer, Download, ChevronDown, 
    MoreVertical, MapPin, User, Phone, Mail, FileText, CheckSquare, Settings, Activity, Calendar
} from "lucide-react";

export default function DemographicsDashboard() {
    const searchParams = useSearchParams();
    const patientId = searchParams.get('patientId');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, [patientId]);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const res = await patientAPI.dashboard(patientId || undefined);
            if (res.data.success && res.data.data) {
                setData(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading patient demographics...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">No patient data found.</div>;

    const p = data.personal || {};
    const c = data.contact || {};
    const a = data.address || {};
    const ins = data.insurance || {};
    const mp = data.medicalProfile || {};
    const stats = data.summaryStats || {};

    const age = p.dob ? Math.floor((new Date().getTime() - new Date(p.dob).getTime()) / 31557600000) : '-';

    const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
    const formatTime = (d: string) => d ? new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';

    return (
        <div className="bg-[#f8fafc] min-h-screen p-4 -m-6 pb-24 relative overflow-y-auto">
            <PatientTabs patientId={patientId} />
            <div className="flex gap-4">
                
                {/* Main Content Area */}
                <div className="flex-[4] flex flex-col gap-4">
                    
                    {/* Header Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex justify-between items-start">
                        <div className="flex gap-6">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-24 h-24 bg-blue-100 rounded-lg overflow-hidden flex items-center justify-center border-2 border-blue-50">
                                    <User className="text-blue-500 w-12 h-12" />
                                </div>
                                <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">Active</span>
                            </div>
                            
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <h1 className="text-xl font-bold text-gray-900">{p.firstName} {p.lastName}</h1>
                                    <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded border border-blue-200">
                                        UHID : {p.id?.substring(0,8).toUpperCase()}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-4 gap-x-8 gap-y-2 text-xs">
                                    <div className="flex flex-col"><span className="text-gray-400">MRN</span><span className="font-medium text-gray-800">{p.mrn || '-'}</span></div>
                                    <div className="flex flex-col"><span className="text-gray-400">Gender / Age</span><span className="font-medium text-gray-800">{p.gender} / {age} Y</span></div>
                                    <div className="flex flex-col"><span className="text-gray-400">Date of Birth</span><span className="font-medium text-gray-800">{formatDate(p.dob)}</span></div>
                                    <div className="flex flex-col"><span className="text-gray-400">Blood Group</span><span className="font-medium text-gray-800">{mp.bloodGroup || '-'}</span></div>
                                    
                                    <div className="flex flex-col"><span className="text-gray-400">Registration No.</span><span className="font-medium text-gray-800">REG-{p.id?.substring(0,6).toUpperCase()}</span></div>
                                    <div className="flex flex-col"><span className="text-gray-400">Mobile No.</span><span className="font-medium text-gray-800">{p.phone}</span></div>
                                    <div className="flex flex-col"><span className="text-gray-400">Date of Reg</span><span className="font-medium text-gray-800">{formatDate(p.createdAt)}</span></div>
                                    <div className="flex flex-col"><span className="text-gray-400">Patient Category</span>
                                        <span className={`font-medium ${ins.hasInsurance ? 'text-blue-600 bg-blue-50 px-1 py-0.5 rounded w-fit' : 'text-gray-800'}`}>
                                            {ins.hasInsurance ? 'Insured' : 'General'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col mt-2 col-span-2"><span className="text-gray-400">ABHA ID</span><span className="font-medium text-gray-800">{p.abhaId || '-'}</span></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-gray-100 border border-gray-200 p-1 flex justify-center items-center">
                                    {/* Mock QR Code */}
                                    <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-cover opacity-80"></div>
                                </div>
                                <span className="text-[9px] text-gray-500 mt-1">Scan for Patient Card</span>
                            </div>
                            
                            <div className="flex flex-col gap-2 min-w-[160px]">
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-2 transition-colors">
                                    <Edit size={12} /> Edit Demographics
                                </button>
                                <button className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-2 transition-colors">
                                    <Printer size={12} /> Print Patient Card
                                </button>
                                <button className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-2 transition-colors">
                                    <Download size={12} /> Download QR
                                </button>
                                <button className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-2 transition-colors">
                                    <Settings size={12} /> More Actions <ChevronDown size={12} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Complex Grid */}
                    <div className="flex gap-4">
                        
                        {/* Col 1 */}
                        <div className="flex-1 flex flex-col gap-4">
                            
                            {/* Personal Info */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-blue-600 font-semibold text-sm flex items-center gap-2"><User size={14} /> Personal Information</h3>
                                    <MoreVertical size={14} className="text-gray-400 cursor-pointer" />
                                </div>
                                <div className="space-y-2 text-[11px]">
                                    <div className="flex justify-between"><span className="text-gray-500">First Name</span><span className="font-medium text-gray-900">{p.firstName}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Middle Name</span><span className="font-medium text-gray-900">{p.middleName || '-'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Last Name</span><span className="font-medium text-gray-900">{p.lastName}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Preferred Name</span><span className="font-medium text-gray-900">{p.firstName}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Gender</span><span className="font-medium text-gray-900">{p.gender}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Date of Birth</span><span className="font-medium text-gray-900">{formatDate(p.dob)}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Age</span><span className="font-medium text-gray-900">{age} Years</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Birth Place</span><span className="font-medium text-gray-900">{p.birthPlace || '-'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Nationality</span><span className="font-medium text-gray-900">{p.nationality || 'Indian'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Religion</span><span className="font-medium text-gray-900">{p.religion || '-'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Marital Status</span><span className="font-medium text-gray-900">{p.maritalStatus || '-'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Occupation</span><span className="font-medium text-gray-900">{p.occupation || '-'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Education</span><span className="font-medium text-gray-900">{p.education || '-'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Primary Language</span><span className="font-medium text-gray-900">{p.primaryLanguage || 'Hindi'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Secondary Language</span><span className="font-medium text-gray-900">{p.secondaryLanguage || 'English'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Mother Tongue</span><span className="font-medium text-gray-900">{p.motherTongue || 'Hindi'}</span></div>
                                </div>
                            </div>

                            {/* Identification Details */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-blue-600 font-semibold text-sm flex items-center gap-2"><FileText size={14} /> Identification Details</h3>
                                    <MoreVertical size={14} className="text-gray-400 cursor-pointer" />
                                </div>
                                <div className="space-y-2 text-[11px]">
                                    <div className="flex justify-between"><span className="text-gray-500">Aadhaar Number</span><span className="font-medium text-gray-900">XXXX XXXX {p.idProofNumber?.slice(-4) || '1234'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">PAN Number</span><span className="font-medium text-gray-900">ABCDE1234F</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Passport Number</span><span className="font-medium text-gray-900">P1234567</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Driving License</span><span className="font-medium text-gray-900">DL-0123456789</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Voter ID</span><span className="font-medium text-gray-900">XXXX XXXX 5678</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">ABHA Number</span><span className="font-medium text-gray-900">{p.abhaId || '-'}</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Col 2 */}
                        <div className="flex-1 flex flex-col gap-4">
                            
                            {/* Contact Info */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-blue-600 font-semibold text-sm flex items-center gap-2"><Phone size={14} /> Contact Information</h3>
                                    <MoreVertical size={14} className="text-gray-400 cursor-pointer" />
                                </div>
                                <div className="space-y-2 text-[11px] mb-4">
                                    <div className="flex justify-between"><span className="text-gray-500">Primary Mobile</span><span className="font-medium text-gray-900">{c.phone}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Secondary Mobile</span><span className="font-medium text-gray-900">{c.alternateMobile || '-'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium text-gray-900 truncate max-w-[120px]">{c.email}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Landline</span><span className="font-medium text-gray-900">{c.landline || '-'}</span></div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-gray-500">Preferred Contact</span>
                                        <div className="flex gap-2 text-green-500">
                                            <div className="w-5 h-5 rounded bg-green-50 flex items-center justify-center border border-green-200"><Phone size={10} /></div>
                                            <div className="w-5 h-5 rounded bg-green-50 flex items-center justify-center border border-green-200"><Mail size={10} /></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Emergency Contact (Nested) */}
                                <div className="bg-[#f8fafc] p-3 rounded border border-gray-100 mt-2">
                                    <h4 className="text-blue-600 font-semibold text-xs mb-2">Emergency Contact</h4>
                                    <div className="space-y-2 text-[11px]">
                                        <div className="flex justify-between"><span className="text-gray-500">Contact Name</span><span className="font-medium text-gray-900">{c.emergencyContactName || '-'}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Relationship</span><span className="font-medium text-gray-900">{c.emergencyContactRel || '-'}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Mobile Number</span><span className="font-medium text-gray-900">{c.emergencyContactMobile || '-'}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Alternative Mobile</span><span className="font-medium text-gray-900">{c.emergencyContactAltMobile || '-'}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Address</span><span className="font-medium text-gray-900 text-right w-24 leading-tight">{c.emergencyContactAddress || '-'}</span></div>
                                    </div>
                                </div>
                            </div>

                            {/* Insurance Details */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-blue-600 font-semibold text-sm flex items-center gap-2"><CheckSquare size={14} /> Insurance Details</h3>
                                    <MoreVertical size={14} className="text-gray-400 cursor-pointer" />
                                </div>
                                <div className="space-y-2 text-[11px]">
                                    <div className="flex justify-between"><span className="text-gray-500">Payment Category</span><span className="font-medium text-gray-900">{ins.hasInsurance ? 'Insurance' : 'Out of Pocket'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Insurance Company</span><span className="font-medium text-gray-900 truncate max-w-[120px]">{ins.insuranceProvider || '-'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Policy Number</span><span className="font-medium text-gray-900">{ins.policyNumber || '-'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">TPA</span><span className="font-medium text-gray-900 truncate max-w-[120px]">{ins.tpaName || '-'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Policy Validity</span><span className="font-medium text-gray-900">{formatDate(ins.policyValidTill)}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Coverage Amount</span><span className="font-medium text-gray-900">₹ 5,00,000</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Remaining Coverage</span><span className="font-medium text-gray-900">₹ 3,25,000</span></div>
                                </div>
                            </div>

                        </div>

                        {/* Cols 3 & 4 */}
                        <div className="flex-[2] flex flex-col gap-4">
                            
                            <div className="flex gap-4">
                                {/* Col 3: Address */}
                                <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-blue-600 font-semibold text-sm flex items-center gap-2"><MapPin size={14} /> Address Information</h3>
                                        <MoreVertical size={14} className="text-gray-400 cursor-pointer" />
                                    </div>
                                    
                                    <div className="mb-4">
                                        <h4 className="text-blue-600 font-semibold text-xs mb-2">Current Address</h4>
                                        <p className="text-[11px] text-gray-800 leading-tight mb-2">{a.address}</p>
                                        <div className="space-y-1.5 text-[11px]">
                                            <div className="flex justify-between"><span className="text-gray-500">City</span><span className="font-medium text-gray-900">{a.city}</span></div>
                                            <div className="flex justify-between"><span className="text-gray-500">District</span><span className="font-medium text-gray-900">{a.district}</span></div>
                                            <div className="flex justify-between"><span className="text-gray-500">State</span><span className="font-medium text-gray-900">{a.state}</span></div>
                                            <div className="flex justify-between"><span className="text-gray-500">Country</span><span className="font-medium text-gray-900">{a.country}</span></div>
                                            <div className="flex justify-between"><span className="text-gray-500">PIN Code</span><span className="font-medium text-gray-900">{a.pincode}</span></div>
                                        </div>
                                        <button className="text-blue-600 text-[10px] font-semibold flex items-center gap-1 mt-2 mx-auto"><MapPin size={10}/> View on Map</button>
                                    </div>

                                    <div className="border-t border-gray-100 pt-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="text-blue-600 font-semibold text-xs">Permanent Address</h4>
                                            <label className="text-[9px] text-gray-600 flex items-center gap-1">
                                                <input type="checkbox" checked={a.sameAsCurrentAddress} readOnly className="w-2.5 h-2.5 text-blue-600 rounded-sm" />
                                                Same as Current Address
                                            </label>
                                        </div>
                                        <p className="text-[11px] text-gray-800 leading-tight mb-2">{a.sameAsCurrentAddress ? a.address : a.permanentAddress || '-'}</p>
                                        <div className="space-y-1.5 text-[11px]">
                                            <div className="flex justify-between"><span className="text-gray-500">City</span><span className="font-medium text-gray-900">{a.sameAsCurrentAddress ? a.city : a.permanentCity || '-'}</span></div>
                                            <div className="flex justify-between"><span className="text-gray-500">District</span><span className="font-medium text-gray-900">{a.sameAsCurrentAddress ? a.district : a.permanentDistrict || '-'}</span></div>
                                            <div className="flex justify-between"><span className="text-gray-500">State</span><span className="font-medium text-gray-900">{a.sameAsCurrentAddress ? a.state : a.permanentState || '-'}</span></div>
                                            <div className="flex justify-between"><span className="text-gray-500">Country</span><span className="font-medium text-gray-900">{a.sameAsCurrentAddress ? a.country : a.permanentCountry || '-'}</span></div>
                                            <div className="flex justify-between"><span className="text-gray-500">PIN Code</span><span className="font-medium text-gray-900">{a.sameAsCurrentAddress ? a.pincode : a.permanentPincode || '-'}</span></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Col 4: Medical Alerts */}
                                <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-red-500 font-semibold text-sm flex items-center gap-2"><Activity size={14} /> Medical Alerts</h3>
                                        <MoreVertical size={14} className="text-gray-400 cursor-pointer" />
                                    </div>
                                    <div className="space-y-2 text-[11px] mb-4">
                                        <div className="flex justify-between"><span className="text-gray-500">Blood Group</span><span className="font-medium text-gray-900">{mp.bloodGroup || '-'}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Drug Allergies</span><span className="font-medium text-gray-900">{mp.drugAllergies || '-'}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Food Allergies</span><span className="font-medium text-gray-900">{mp.foodAllergies || '-'}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Chronic Diseases</span><span className="font-medium text-gray-900">{mp.chronicDiseases || '-'}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Current Medications</span><span className="font-medium text-gray-900 text-right w-24 truncate">{mp.currentMedications || '-'}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Smoking Status</span><span className="font-medium text-gray-900">{mp.smokingStatus || '-'}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Alcohol Consumption</span><span className="font-medium text-gray-900">{mp.alcoholConsumption || '-'}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Tobacco Usage</span><span className="font-medium text-gray-900">{mp.tobaccoUsage || '-'}</span></div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500">Organ Donor</span>
                                            {mp.organDonor ? <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold text-[9px]">Yes</span> : <span className="font-medium text-gray-900">No</span>}
                                        </div>
                                        <div className="flex justify-between"><span className="text-gray-500">Pregnancy Status</span><span className="font-medium text-gray-900">{mp.pregnancyStatus || 'N/A'}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Special Needs</span><span className="font-medium text-gray-900">{mp.specialNeeds || 'No'}</span></div>
                                    </div>
                                    
                                    {mp.medicalAlertText && (
                                        <div className="bg-red-50 border border-red-100 rounded p-3 mt-4">
                                            <h4 className="text-red-600 font-bold text-xs mb-1">Medical Alert</h4>
                                            <p className="text-red-500 text-[11px] leading-tight">{mp.medicalAlertText}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Patient Summary (Spans Col 3 & 4) */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                                <h3 className="text-blue-600 font-semibold text-sm flex items-center gap-2 mb-4"><Activity size={14} /> Patient Summary</h3>
                                <div className="grid grid-cols-4 gap-3">
                                    <div className="bg-gray-50 p-2 rounded border border-gray-100">
                                        <div className="text-[10px] text-gray-500">Total Visits</div>
                                        <div className="text-lg font-bold text-gray-900">{stats.totalVisits}</div>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded border border-gray-100">
                                        <div className="text-[10px] text-gray-500">OPD Visits</div>
                                        <div className="text-lg font-bold text-gray-900">{stats.opdVisits}</div>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded border border-gray-100">
                                        <div className="text-[10px] text-gray-500">IPD Admissions</div>
                                        <div className="text-lg font-bold text-gray-900">{stats.ipdAdmissions}</div>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded border border-gray-100">
                                        <div className="text-[10px] text-gray-500">Emergency Visits</div>
                                        <div className="text-lg font-bold text-gray-900">{stats.emergencyVisits}</div>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded border border-gray-100">
                                        <div className="text-[10px] text-gray-500">Last Visit</div>
                                        <div className="text-sm font-bold text-gray-900">{formatDate(stats.lastVisit)}</div>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded border border-gray-100">
                                        <div className="text-[10px] text-gray-500">Next Appointment</div>
                                        <div className="text-sm font-bold text-gray-900">{formatDate(stats.nextAppointment)}</div>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded border border-gray-100">
                                        <div className="text-[10px] text-red-500">Outstanding Amount</div>
                                        <div className="text-sm font-bold text-red-600">₹ {stats.outstandingAmount?.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded border border-gray-100">
                                        <div className="text-[10px] text-green-500">Last Payment</div>
                                        <div className="text-sm font-bold text-green-600">₹ {stats.lastPayment?.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Recent Visit History Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-gray-900 font-bold text-sm">Recent Visit History</h3>
                            <button className="text-blue-600 text-xs font-semibold hover:underline">View All Visits</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 text-[11px] text-gray-500">
                                        <th className="font-semibold py-2">Visit ID</th>
                                        <th className="font-semibold py-2">Visit Date</th>
                                        <th className="font-semibold py-2">Department</th>
                                        <th className="font-semibold py-2">Doctor</th>
                                        <th className="font-semibold py-2">Visit Type</th>
                                        <th className="font-semibold py-2">Diagnosis</th>
                                        <th className="font-semibold py-2">Billing Status</th>
                                        <th className="font-semibold py-2">Visit Status</th>
                                        <th className="font-semibold py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.visitHistory?.map((visit: any, i: number) => (
                                        <tr key={i} className="border-b border-gray-100 text-xs hover:bg-gray-50">
                                            <td className="py-2 text-gray-900">VISIT{visit.id.substring(0,8).toUpperCase()}</td>
                                            <td className="py-2 text-gray-600">{formatDate(visit.visitDate)}</td>
                                            <td className="py-2 text-gray-600">{visit.department || 'General Medicine'}</td>
                                            <td className="py-2 text-gray-600">{visit.doctor}</td>
                                            <td className="py-2 text-gray-600">{visit.visitType}</td>
                                            <td className="py-2 text-gray-600">{visit.diagnosis || 'Fever and Headache'}</td>
                                            <td className="py-2">
                                                <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 border border-green-200 rounded">Paid</span>
                                            </td>
                                            <td className="py-2">
                                                <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 border border-green-200 rounded">{visit.visitStatus}</span>
                                            </td>
                                            <td className="py-2 flex items-center gap-2">
                                                <div className="w-5 h-5 rounded border border-blue-200 text-blue-500 flex items-center justify-center bg-blue-50 cursor-pointer"><Settings size={10} /></div>
                                                <div className="w-5 h-5 rounded border border-blue-200 text-blue-500 flex items-center justify-center bg-blue-50 cursor-pointer"><FileText size={10} /></div>
                                                <div className="w-5 h-5 rounded border border-blue-200 text-blue-500 flex items-center justify-center bg-blue-50 cursor-pointer"><Activity size={10} /></div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Patient Timeline */}
                <div className="w-[300px] bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#f8fafc]">
                        <h3 className="font-bold text-sm text-gray-900">Patient Timeline</h3>
                        <Activity size={14} className="text-gray-400" />
                    </div>
                    <div className="p-4 flex-1 overflow-y-auto">
                        <div className="relative border-l border-gray-200 ml-3 space-y-6">
                            
                            {data.timeline?.map((item: any, i: number) => {
                                const isRegistration = item.type === 'Registration';
                                const isOPD = item.type === 'OPD Visit';
                                const Icon = isRegistration ? User : (isOPD ? Activity : Calendar);
                                const color = isRegistration ? 'bg-blue-500' : 'bg-purple-500';
                                const bg = isRegistration ? 'bg-blue-50' : 'bg-purple-50';

                                return (
                                    <div key={i} className="pl-6 relative">
                                        <div className={`absolute w-6 h-6 rounded-full flex items-center justify-center -left-3 top-0 ${bg} border border-white shadow-sm`}>
                                            <Icon size={12} className={isRegistration ? 'text-blue-500' : 'text-purple-500'} />
                                        </div>
                                        <div className="text-xs font-bold text-gray-900">{item.type}</div>
                                        <div className="text-[10px] text-gray-500">{formatDate(item.date)} {formatTime(item.date)}</div>
                                        <div className="text-[10px] text-gray-500">{item.details}</div>
                                    </div>
                                );
                            })}

                            <div className="pl-6 relative">
                                <div className="absolute w-6 h-6 rounded-full flex items-center justify-center -left-3 top-0 bg-orange-50 border border-white shadow-sm">
                                    <FileText size={12} className="text-orange-500" />
                                </div>
                                <div className="text-xs font-bold text-gray-900">Lab Test</div>
                                <div className="text-[10px] text-gray-500">{formatDate(new Date().toISOString())} 11:30 AM</div>
                                <div className="text-[10px] text-gray-500">Complete Blood Count</div>
                            </div>
                            
                            <div className="pl-6 relative">
                                <div className="absolute w-6 h-6 rounded-full flex items-center justify-center -left-3 top-0 bg-green-50 border border-white shadow-sm">
                                    <CheckSquare size={12} className="text-green-500" />
                                </div>
                                <div className="text-xs font-bold text-gray-900">Insurance Verified</div>
                                <div className="text-[10px] text-gray-500">{formatDate(new Date().toISOString())} 10:35 AM</div>
                                <div className="text-[10px] font-bold text-green-500 bg-green-50 px-1 py-0.5 rounded mt-1 w-fit border border-green-200">Approved</div>
                            </div>
                            
                            <div className="pl-6 relative">
                                <div className="absolute w-6 h-6 rounded-full flex items-center justify-center -left-3 top-0 bg-yellow-50 border border-white shadow-sm">
                                    <FileText size={12} className="text-yellow-600" />
                                </div>
                                <div className="text-xs font-bold text-gray-900">Payment</div>
                                <div className="text-[10px] text-gray-500">{formatDate(new Date().toISOString())} 12:45 PM</div>
                                <div className="text-[10px] text-gray-800 font-medium">₹ 5,000.00</div>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-2 border border-blue-200 text-blue-600 text-xs font-semibold rounded hover:bg-blue-50 transition-colors">
                            View Full Timeline
                        </button>
                    </div>
                </div>

            </div>

            {/* Bottom Actions Bar (Sticky Footer) */}
            <div className="fixed bottom-0 left-[260px] right-0 bg-white border-t border-gray-200 p-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50 flex items-center justify-between">
                <div className="flex gap-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 px-6 rounded transition-colors shadow-sm">
                        Save Changes
                    </button>
                    <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium py-1.5 px-6 rounded transition-colors">
                        Reset
                    </button>
                </div>
                <div className="flex gap-2 text-gray-700">
                    <button className="bg-white border border-gray-300 hover:bg-gray-50 text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors">
                        <Printer size={12} /> Print
                    </button>
                    <button className="bg-white border border-gray-300 hover:bg-gray-50 text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors">
                        <FileText size={12} /> Generate Patient Card
                    </button>
                    <button className="bg-white border border-gray-300 hover:bg-gray-50 text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors">
                        <Calendar size={12} /> Book Appointment
                    </button>
                    <button className="bg-white border border-gray-300 hover:bg-gray-50 text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors">
                        <Activity size={12} /> Create OPD Visit
                    </button>
                    <button className="bg-white border border-gray-300 hover:bg-gray-50 text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors">
                        <User size={12} /> IPD Admission
                    </button>
                    <button className="bg-white border border-gray-300 hover:bg-gray-50 text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors">
                        <Activity size={12} /> View Medical History
                    </button>
                    <button className="bg-white border border-gray-300 hover:bg-gray-50 text-xs font-medium py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors">
                        <Download size={12} /> Upload Documents
                    </button>
                    <button className="bg-white border border-gray-300 hover:bg-gray-50 text-xs font-medium py-1.5 px-6 ml-4 rounded transition-colors">
                        Back
                    </button>
                </div>
            </div>

        </div>
    );
}