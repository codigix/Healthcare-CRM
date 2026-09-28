"use client";

import { useState } from "react";
import { Search, ClipboardCheck, AlertCircle, CheckCircle2 } from "lucide-react";

export default function CheckIn() {
    const [isVerified, setIsVerified] = useState(false);
    const [isCheckedIn, setIsCheckedIn] = useState(false);

    return (
        <div className="flex flex-col gap-4 overflow-hidden h-full">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded shadow-sm border border-gray-100">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-gray-900">Check-In</h1>
                    <span className="text-xs text-gray-500 font-medium mt-1">21 May 2024, Tuesday</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={14} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
                            placeholder="Search patient by name, UHID or mobile..."
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm text-sm font-medium hover:bg-blue-700">
                        <ClipboardCheck size={16} /> Check-in New Patient
                    </button>
                </div>
            </div>

            {/* Main Content: 3 Columns */}
            <div className="bg-white rounded shadow-sm border border-gray-100 flex-1 grid grid-cols-3 divide-x divide-gray-100">

                {/* Column 1: Appointment Details */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <h2 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
                        Appointment Details
                    </h2>

                    <div className="space-y-5">
                        <div className="flex flex-col">
                            <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Token No.</span>
                            <span className="text-sm font-bold text-gray-900">T003</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Patient Name</span>
                            <span className="text-sm font-bold text-gray-900">Amit Kumar</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-1">UHID</span>
                            <span className="text-sm font-bold text-gray-900">UH100012345</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Appointment Time</span>
                            <span className="text-sm font-bold text-gray-900">10:00 AM</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Department</span>
                            <span className="text-sm font-bold text-gray-900">Orthopedics</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Doctor</span>
                            <span className="text-sm font-bold text-gray-900">Dr. Rajat Mehta</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Purpose of Visit</span>
                            <span className="text-sm font-bold text-gray-900">Knee Pain</span>
                        </div>
                    </div>
                </div>

                {/* Column 2: Patient Verification */}
                <div className="p-6 flex flex-col overflow-y-auto custom-scrollbar">
                    <h2 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-amber-500 rounded-full"></span>
                        Patient Verification
                    </h2>

                    <div className="space-y-6 flex-1">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    defaultValue="+91 98765 43210"
                                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <button
                                    onClick={() => setIsVerified(true)}
                                    className="px-4 py-2 bg-white border border-blue-200 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
                                >
                                    Verify
                                </button>
                            </div>
                            {isVerified && <p className="text-[10px] text-green-600 font-medium flex items-center gap-1 mt-1"><CheckCircle2 size={12} /> Verified successfully</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Aadhaar Number (Optional)</label>
                            <input
                                type="text"
                                placeholder="1234 5678 9012"
                                className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Check-In Notes (Optional)</label>
                            <textarea
                                rows={4}
                                placeholder="Enter any additional notes..."
                                className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 mt-auto border-t border-gray-100">
                        <button className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={() => setIsCheckedIn(true)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Confirm Check-In
                        </button>
                    </div>
                </div>

                {/* Column 3: Check-In Summary */}
                <div className="p-6 bg-gray-50/50 flex flex-col items-center">
                    <div className="w-full">
                        <h2 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-green-500 rounded-full"></span>
                            Check-In Summary
                        </h2>
                    </div>

                    {isCheckedIn ? (
                        <div className="w-full flex-1 flex flex-col items-center justify-center -mt-10">
                            <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                                <ClipboardCheck size={48} />
                                <div className="absolute w-8 h-8 bg-white rounded-full flex items-center justify-center ml-16 mt-16 shadow-sm border border-green-100">
                                    <CheckCircle2 size={24} className="text-green-500" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-8">Patient checked-in successfully</h3>

                            <div className="w-full max-w-xs space-y-4 bg-white p-5 rounded border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                    <span className="text-xs text-gray-500 font-medium">Check-In Time</span>
                                    <span className="text-xs font-bold text-gray-900">09:50 AM</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                    <span className="text-xs text-gray-500 font-medium">Checked-in by</span>
                                    <span className="text-xs font-bold text-gray-900">Receptionist</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 font-medium">Status</span>
                                    <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded border border-green-200">Checked-In</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center -mt-10">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-700 mb-1">Awaiting Check-In</h3>
                            <p className="text-xs text-gray-500 max-w-[200px]">Verify patient details and confirm to complete the check-in process.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}