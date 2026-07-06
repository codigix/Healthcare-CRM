"use client";

import { useState, useEffect } from "react";
import { patientAPI } from "@/lib/api";
import {
    Save,
    Printer,
    FileText,
    UploadCloud,
    UserCircle,
    ChevronDown,
    Search,
    UserPlus,
    Activity,
    AlertCircle,
    Phone,
    Bed
} from "lucide-react";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PatientRegistration() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [metaData, setMetaData] = useState<any>(null);

    const [formData, setFormData] = useState({
        // Personal
        title: "Mr.", firstName: "", middleName: "", lastName: "", gender: "Male",
        dob: "", age: "", bloodGroup: "B+", maritalStatus: "Married", nationality: "Indian", religion: "Hindu", language: "Hindi",
        isVip: false, patientType: "OPD",
        // Contact
        mobile: "", alternateMobile: "", email: "", landline: "", address: "", city: "New Delhi", state: "Delhi", pincode: "", country: "India",
        // ID Proof
        idProofType: "Aadhaar Card", idProofNumber: "",
        // Emergency
        emergencyContactName: "", emergencyContactRel: "Father", emergencyContactMobile: "",
        // Additional
        occupation: "", employerName: "", annualIncome: "10 - 15 Lakh", registrationType: "Self", referredBy: "Google Search", referralDoctor: "", notes: "",
        // Insurance
        hasInsurance: false, insuranceProvider: "Star Health", policyNumber: "", tpaName: "", policyRelation: "Self", policyValidTill: ""
    });

    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const res = await patientAPI.registrationMeta();
                setMetaData(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchMeta();
    }, []);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async (print: boolean = false) => {
        try {
            setLoading(true);
            const res = await patientAPI.create({
                ...formData,
                phone: formData.mobile, // mapping UI to DB
                address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
            });
            alert("Patient registered successfully!");
            if (print) {
                window.print();
            }
            router.push('/patients');
        } catch (error) {
            console.error(error);
            alert("Failed to save patient.");
        } finally {
            setLoading(false);
        }
    };

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const isMale = formData.gender === 'Male';
    const ageGenderStr = `${formData.age ? formData.age + ' Y | ' : ''}${formData.gender}`;

    return (
        <div className="bg-[#f8fafc] -m-6 p-6 min-h-screen font-sans">

            {/* Top Bar */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Patient Registration</h1>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Link href="/" className="hover:text-blue-500">Home</Link> &gt;
                        <Link href="/dashboard" className="hover:text-blue-500">Reception</Link> &gt;
                        <span className="text-gray-500">Patient Registration</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input type="text" placeholder="Search by Name / UHID / Mobile (Ctrl + K)" className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-80 outline-none focus:border-blue-500" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                {/* Main Form Area */}
                <div className="xl:col-span-9 space-y-6">

                    {/* Sticky Top Alert & Buttons */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center sticky top-0 z-10">
                        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded text-sm font-medium border border-green-100">
                            <Activity size={16} /> UHID will be generated automatically after saving the patient details.
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Clear Form</button>
                            <button className="px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50">Save as Draft</button>
                            <button onClick={() => handleSave(true)} disabled={loading} className="px-4 py-2 bg-blue-600 text-white flex items-center gap-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                                <Printer size={16} /> Save & Print <ChevronDown size={14} />
                            </button>
                        </div>
                    </div>

                    {/* 1. Personal Information */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-base font-bold text-gray-800 border-l-4 border-blue-500 pl-3 -ml-6">1. Personal Information</h2>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 text-sm font-medium text-amber-600 cursor-pointer">
                                    <input type="checkbox" name="isVip" checked={formData.isVip} onChange={handleChange} className="w-4 h-4 accent-amber-500" /> Mark as VIP ⭐
                                </label>
                                <div className="flex items-center gap-4 text-sm font-medium">
                                    <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="patientType" value="OPD" checked={formData.patientType === 'OPD'} onChange={handleChange} className="accent-blue-600" /> OPD</label>
                                    <label className="flex items-center gap-1.5 cursor-pointer text-red-600"><input type="radio" name="patientType" value="Emergency" checked={formData.patientType === 'Emergency'} onChange={handleChange} className="accent-red-600" /> Emergency</label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="flex-1 grid grid-cols-12 gap-x-4 gap-y-5">
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title <span className="text-red-500">*</span></label>
                                    <select name="title" value={formData.title} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500"><option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Dr.</option></select>
                                </div>
                                <div className="col-span-4">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">First Name <span className="text-red-500">*</span></label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Rahul" className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500" />
                                </div>
                                <div className="col-span-3">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Middle Name</label>
                                    <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} placeholder="Kumar" className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500" />
                                </div>
                                <div className="col-span-3">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Last Name <span className="text-red-500">*</span></label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Sharma" className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500" />
                                </div>

                                <div className="col-span-3">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Gender <span className="text-red-500">*</span></label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500"><option>Male</option><option>Female</option><option>Other</option></select>
                                </div>
                                <div className="col-span-4">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date of Birth <span className="text-red-500">*</span></label>
                                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Age</label>
                                    <div className="relative">
                                        <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="34" className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">Yrs</span>
                                    </div>
                                </div>
                                <div className="col-span-3">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Blood Group</label>
                                    <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500"><option>B+</option><option>O+</option><option>A+</option><option>AB+</option></select>
                                </div>

                                <div className="col-span-3">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Marital Status</label>
                                    <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500"><option>Married</option><option>Single</option></select>
                                </div>
                                <div className="col-span-3">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nationality <span className="text-red-500">*</span></label>
                                    <select name="nationality" value={formData.nationality} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500"><option>Indian</option><option>Other</option></select>
                                </div>
                                <div className="col-span-3">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Religion</label>
                                    <select name="religion" value={formData.religion} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500"><option>Hindu</option><option>Muslim</option><option>Christian</option></select>
                                </div>
                                <div className="col-span-3">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Language</label>
                                    <select name="language" value={formData.language} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500"><option>Hindi</option><option>English</option></select>
                                </div>
                            </div>

                            <div className="w-40 shrink-0">
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Photo</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl h-36 flex flex-col items-center justify-center bg-gray-50 text-gray-400 hover:bg-gray-100 cursor-pointer">
                                    <UserCircle size={40} className="mb-2 text-blue-200" />
                                    <span className="text-xs text-blue-600 font-medium">Upload Photo</span>
                                    <span className="text-[10px] mt-1">JPG, PNG (Max 2MB)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 2. Contact Information */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-base font-bold text-gray-800 border-l-4 border-blue-500 pl-3 -ml-6 mb-5">2. Contact Information</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Mobile Number <span className="text-red-500">*</span></label>
                                    <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="9876543210" className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Alternate Mobile</label>
                                    <input type="text" name="alternateMobile" value={formData.alternateMobile} onChange={handleChange} placeholder="9123456780" className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email ID</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="rahul.sharma@email.com" className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Landline</label>
                                    <input type="text" name="landline" value={formData.landline} onChange={handleChange} placeholder="011-12345678" className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Address Line 1 <span className="text-red-500">*</span></label>
                                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123, Green Park Avenue" className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">City <span className="text-red-500">*</span></label>
                                    <select name="city" value={formData.city} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500"><option>New Delhi</option></select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">State <span className="text-red-500">*</span></label>
                                    <select name="state" value={formData.state} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500"><option>Delhi</option></select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Pincode <span className="text-red-500">*</span></label>
                                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="110016" className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Country <span className="text-red-500">*</span></label>
                                    <select name="country" value={formData.country} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500"><option>India</option></select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* 3. Identification Details */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-base font-bold text-gray-800 border-l-4 border-blue-500 pl-3 -ml-6 mb-5">3. Identification Details</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">ID Proof Type <span className="text-red-500">*</span></label>
                                        <select name="idProofType" value={formData.idProofType} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500"><option>Aadhaar Card</option></select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">ID Proof Number <span className="text-red-500">*</span></label>
                                        <input type="text" name="idProofNumber" value={formData.idProofNumber} onChange={handleChange} placeholder="1234 5678 9012" className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Upload ID Proof <span className="text-red-500">*</span></label>
                                        <div className="border border-dashed border-gray-300 rounded bg-gray-50 p-4 text-center cursor-pointer hover:bg-gray-100">
                                            <UploadCloud size={20} className="mx-auto mb-1 text-blue-500" />
                                            <div className="text-xs text-blue-600 font-medium">Click to upload</div>
                                            <div className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, PDF (Max 2MB)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 4. Emergency Contact */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-base font-bold text-gray-800 border-l-4 border-blue-500 pl-3 -ml-6 mb-5">4. Emergency Contact</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Contact Name <span className="text-red-500">*</span></label>
                                        <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} placeholder="Suresh Sharma" className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500" />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Relationship <span className="text-red-500">*</span></label>
                                        <select name="emergencyContactRel" value={formData.emergencyContactRel} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500"><option>Father</option><option>Mother</option><option>Spouse</option></select>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Mobile Number <span className="text-red-500">*</span></label>
                                        <input type="text" name="emergencyContactMobile" value={formData.emergencyContactMobile} onChange={handleChange} placeholder="9876501234" className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 5. Additional Information */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                            <h2 className="text-base font-bold text-gray-800 border-l-4 border-blue-500 pl-3 -ml-6 mb-5">5. Additional Information</h2>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Occupation</label>
                                    <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} placeholder="Software Engineer" className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Employer Name</label>
                                    <input type="text" name="employerName" value={formData.employerName} onChange={handleChange} placeholder="TCS Pvt. Ltd." className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Annual Income</label>
                                    <select name="annualIncome" value={formData.annualIncome} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500"><option>10 - 15 Lakh</option></select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Registration Type</label>
                                    <select name="registrationType" value={formData.registrationType} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500"><option>Self</option></select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Referred By</label>
                                    <select name="referredBy" value={formData.referredBy} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500"><option>Google Search</option></select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Referral Doctor</label>
                                    <input type="text" name="referralDoctor" value={formData.referralDoctor} onChange={handleChange} placeholder="Select Doctor (Optional)" className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500" />
                                </div>
                                <div className="col-span-3">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Notes</label>
                                    <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Patient came for regular health check-up." className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500 h-24 resize-none"></textarea>
                                </div>
                            </div>
                        </div>

                        {/* 6. Insurance Information */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-base font-bold text-gray-800 border-l-4 border-blue-500 pl-3 -ml-6">6. Insurance Information <span className="text-gray-400 font-normal text-sm">(Optional)</span></h2>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                                    I have Insurance
                                    <div className={`w-10 h-5 rounded-full relative transition-colors ${formData.hasInsurance ? 'bg-green-500' : 'bg-gray-200'}`}>
                                        <input type="checkbox" name="hasInsurance" checked={formData.hasInsurance} onChange={handleChange} className="sr-only" />
                                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${formData.hasInsurance ? 'left-[22px]' : 'left-0.5'}`}></div>
                                    </div>
                                </label>
                            </div>

                            {formData.hasInsurance ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Insurance Provider</label>
                                        <select name="insuranceProvider" value={formData.insuranceProvider} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500"><option>Star Health</option></select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Policy Number</label>
                                        <input type="text" name="policyNumber" value={formData.policyNumber} onChange={handleChange} placeholder="123456789012" className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">TPA Name</label>
                                        <select name="tpaName" value={formData.tpaName} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500"><option>Rahul Kumar Sharma</option></select>
                                    </div>
                                    <div className="col-span-2 grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Relationship with Policy Holder</label>
                                            <select name="policyRelation" value={formData.policyRelation} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500"><option>Self</option></select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Policy Valid Till</label>
                                            <input type="date" name="policyValidTill" value={formData.policyValidTill} onChange={handleChange} className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500" />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Upload Policy Document</label>
                                        <div className="border border-dashed border-gray-300 rounded bg-gray-50 p-4 text-center cursor-pointer hover:bg-gray-100">
                                            <UploadCloud size={20} className="mx-auto mb-1 text-blue-500" />
                                            <div className="text-xs text-blue-600 font-medium">Click to upload policy document</div>
                                            <div className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, PDF (Max 2MB)</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-48 text-gray-400 border-2 border-dashed border-gray-100 rounded-lg bg-gray-50">
                                    <Activity size={32} className="mb-2 text-gray-300" />
                                    <p className="text-sm font-medium">Insurance Details Not Applicable</p>
                                    <p className="text-xs mt-1">Toggle "I have Insurance" to add details.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="xl:col-span-3 space-y-6">
                    {/* Patient Summary */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-sm font-bold text-gray-800 mb-4">Patient Summary</h2>
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-blue-50 border-4 border-white shadow-md flex items-center justify-center mb-3 text-blue-300">
                                <UserCircle size={48} />
                            </div>
                            <h3 className="font-bold text-gray-800 text-center">{fullName || 'New Patient'}</h3>
                            <p className="text-xs text-gray-500 text-center mt-1">{formData.age || formData.gender ? ageGenderStr : 'Enter details'}</p>
                            <span className="mt-2 px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-semibold">New Registration</span>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-400">UHID</span><span className="font-semibold text-gray-800">Will be generated</span></div>
                            <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-400">Mobile</span><span className="font-semibold text-gray-800">{formData.mobile || '-'}</span></div>
                            <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-400">Email</span><span className="font-semibold text-gray-800 truncate max-w-[120px]">{formData.email || '-'}</span></div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-400">Address</span>
                                <span className="font-semibold text-gray-800 text-right w-32 line-clamp-3">{formData.address ? `${formData.address},\n${formData.city}, ${formData.state} - ${formData.pincode}` : '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-400">Blood Group</span><span className="font-semibold text-gray-800">{formData.bloodGroup || '-'}</span></div>
                            <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-400">Registration Type</span><span className="font-semibold text-gray-800">{formData.patientType}</span></div>
                            <div className="flex justify-between pb-2"><span className="text-gray-400">Registration Date</span><span className="font-semibold text-gray-800">{dayjs().format('DD MMM YYYY hh:mm A')}</span></div>
                        </div>
                    </div>

                    {/* Important Notes */}
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                        <h3 className="text-amber-800 font-bold text-sm mb-2">Important Notes</h3>
                        <ul className="list-disc list-outside ml-4 text-xs text-amber-700 space-y-1.5">
                            <li>All fields marked with * are mandatory.</li>
                            <li>Please verify mobile number before saving.</li>
                            <li>UHID will be generated after saving.</li>
                        </ul>
                    </div>

                    {/* Recent Registrations */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-bold text-gray-800">Recent Registrations</h2>
                            <Link href="/patients" className="text-blue-500 text-xs font-semibold hover:underline">View all</Link>
                        </div>
                        <div className="space-y-3 text-xs">
                            {metaData?.recentRegistrations?.map((r: any, i: number) => (
                                <div key={i} className="flex justify-between items-center pb-2 border-b border-gray-50 last:border-0">
                                    <span className="text-gray-700 font-medium">{i + 1}. {r.name}</span>
                                    <span className="text-gray-400">{r.patientType} - {dayjs(r.createdAt).format('hh:mm A')}</span>
                                </div>
                            ))}
                            {!metaData && <div className="text-gray-400 py-2">Loading...</div>}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-sm font-bold text-gray-800 mb-4">Quick Actions</h2>
                        <div className="space-y-2">
                            <button className="w-full flex items-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100 p-2.5 rounded text-xs font-semibold transition-colors">
                                <Search size={14} /> Search Existing Patient
                            </button>
                            <button className="w-full flex items-center gap-2 text-gray-600 bg-gray-50 hover:bg-gray-100 p-2.5 rounded text-xs font-semibold transition-colors">
                                <Printer size={14} /> Print Blank Form
                            </button>
                            <button className="w-full flex items-center gap-2 text-gray-600 bg-gray-50 hover:bg-gray-100 p-2.5 rounded text-xs font-semibold transition-colors">
                                <FileText size={14} /> Daily Registration Report
                            </button>
                        </div>
                    </div>

                    {/* Left Navbar mock section (Help) - Recreating from screenshot edge */}
                    <div className="bg-[#0f172a] text-white p-4 rounded-xl mt-8">
                        <div className="flex items-center gap-2 font-bold mb-2"><AlertCircle size={16} /> Need Help?</div>
                        <p className="text-xs text-gray-400 mb-4">Check our user guide or contact support</p>
                        <button className="bg-blue-600 text-white text-xs px-4 py-2 rounded font-medium hover:bg-blue-700 w-full mb-4">View Guide</button>
                        <div className="pt-4 border-t border-gray-800">
                            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1"><Phone size={14} /> Support Hotline</div>
                            <div className="font-bold">1800-123-4567</div>
                            <div className="text-[10px] text-gray-500 mt-1">Mon - Sat | 9:00 AM - 6:00 PM</div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Sticky Footer Stats */}
            {metaData?.footerStats && (
                <div className="bg-white p-4 rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] border border-gray-100 mt-10 flex flex-wrap lg:flex-nowrap justify-between gap-4 sticky bottom-0 z-20 mx-[-24px] px-8">
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="p-2 bg-blue-50 text-blue-500 rounded"><UserPlus size={18} /></div>
                        <div>
                            <div className="text-[10px] font-semibold text-gray-400 uppercase">Today's Registrations</div>
                            <div className="text-lg font-bold text-gray-800">{metaData.footerStats.today}</div>
                        </div>
                    </div>
                    <div className="w-px h-10 bg-gray-200 hidden lg:block"></div>
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="p-2 bg-green-50 text-green-500 rounded"><Activity size={18} /></div>
                        <div>
                            <div className="text-[10px] font-semibold text-gray-400 uppercase">OPD Registrations</div>
                            <div className="text-lg font-bold text-gray-800">{metaData.footerStats.opd}</div>
                        </div>
                    </div>
                    <div className="w-px h-10 bg-gray-200 hidden lg:block"></div>
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="p-2 bg-blue-50 text-blue-500 rounded"><Bed size={18} /></div>
                        <div>
                            <div className="text-[10px] font-semibold text-gray-400 uppercase">IPD Admissions</div>
                            <div className="text-lg font-bold text-gray-800">{metaData.footerStats.ipd}</div>
                        </div>
                    </div>
                    <div className="w-px h-10 bg-gray-200 hidden lg:block"></div>
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="p-2 bg-red-50 text-red-500 rounded"><AlertCircle size={18} /></div>
                        <div>
                            <div className="text-[10px] font-semibold text-gray-400 uppercase">Emergency</div>
                            <div className="text-lg font-bold text-gray-800">{metaData.footerStats.emergency}</div>
                        </div>
                    </div>
                    <div className="w-px h-10 bg-gray-200 hidden lg:block"></div>
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="p-2 bg-orange-50 text-orange-500 rounded"><UserCircle size={18} /></div>
                        <div>
                            <div className="text-[10px] font-semibold text-gray-400 uppercase">Returning Patients</div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-lg font-bold text-gray-800">{metaData.footerStats.returning.count}</span>
                                <span className="text-xs font-semibold text-gray-400">({metaData.footerStats.returning.percent}%)</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-px h-10 bg-gray-200 hidden lg:block"></div>
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="p-2 bg-emerald-50 text-emerald-500 rounded"><UserPlus size={18} /></div>
                        <div>
                            <div className="text-[10px] font-semibold text-gray-400 uppercase">New Patients</div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-lg font-bold text-gray-800">{metaData.footerStats.new.count}</span>
                                <span className="text-xs font-semibold text-gray-400">({metaData.footerStats.new.percent}%)</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
