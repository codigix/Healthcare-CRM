"use client";

import { useState } from "react";
import {
  Building2,
  Save,
  X,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  FileText,
  Activity,
  Bed,
  CreditCard,
} from "lucide-react";
import Link from "next/link";

export default function HospitalRegistrationPage() {
  const [activeSection, setActiveSection] = useState("basic");

  return (
    <div className="space-y-2 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-xl  text-white flex items-center gap-2">
            <Building2 className="text-blue-500" />
            Hospital Registration
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Register a new facility, branch, or clinic to the central network</p>
        </div>
        <div className="flex gap-3">
          <Link href="/superadmin/hospital/master" className="p-2 bg-dark-tertiary hover:bg-gray-700 text-gray-300 rounded transition-colors flex items-center gap-2 border border-gray-700">
            <X size={20} />
            <span>Cancel</span>
          </Link>
          <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20">
            <Save size={20} />
            <span>Save Registration</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <button
            onClick={() => setActiveSection("basic")}
            className={`w-full flex items-center gap-2 p-2 rounded  text-xs  text-left transition-colors ${activeSection === 'basic' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:bg-dark-tertiary hover:text-gray-200'}`}
          >
            <Building2 size={15} />
            <span className="font-medium">Basic Information</span>
          </button>
          <button
            onClick={() => setActiveSection("contact")}
            className={`w-full flex items-center gap-2 p-2 rounded  text-xs  text-left transition-colors ${activeSection === 'contact' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:bg-dark-tertiary hover:text-gray-200'}`}
          >
            <MapPin size={15} />
            <span className="font-medium">Contact & Location</span>
          </button>
          <button
            onClick={() => setActiveSection("compliance")}
            className={`w-full flex items-center gap-2 p-2 rounded  text-xs  text-left transition-colors ${activeSection === 'compliance' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:bg-dark-tertiary hover:text-gray-200'}`}
          >
            <ShieldCheck size={15} />
            <span className="font-medium">Legal & Compliance</span>
          </button>
          <button
            onClick={() => setActiveSection("infrastructure")}
            className={`w-full flex items-center gap-2 p-2 rounded  text-xs  text-left transition-colors ${activeSection === 'infrastructure' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:bg-dark-tertiary hover:text-gray-200'}`}
          >
            <Bed size={15} />
            <span className="font-medium">Infrastructure & Capacity</span>
          </button>
          <button
            onClick={() => setActiveSection("billing")}
            className={`w-full flex items-center gap-2 p-2 rounded  text-xs  text-left transition-colors ${activeSection === 'billing' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:bg-dark-tertiary hover:text-gray-200'}`}
          >
            <CreditCard size={15} />
            <span className="font-medium">Billing & Taxes</span>
          </button>
        </div>

        {/* Form Area */}
        <div className="lg:col-span-3  p-6">

          {/* Basic Information */}
          {activeSection === "basic" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="border-b border-gray-800 pb-4 mb-6">
                <h2 className="text-xl  text-white">Basic Information</h2>
                <p className="text-sm text-gray-400">Core details identifying the facility within the network.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Hospital/Facility Name <span className="text-red-400">*</span></label>
                  <input type="text" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs" placeholder="e.g. MedixPro Central Hospital" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Short Code / ID <span className="text-red-400">*</span></label>
                  <input type="text" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs" placeholder="e.g. MXP-CEN" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Facility Type <span className="text-red-400">*</span></label>
                  <select className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs">
                    <option value="">Select Type</option>
                    <option value="main">Main Hospital</option>
                    <option value="branch">Branch Hospital</option>
                    <option value="clinic">Outpatient Clinic</option>
                    <option value="lab">Diagnostic Center / Lab</option>
                    <option value="pharmacy">Standalone Pharmacy</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Parent Group (If applicable)</label>
                  <select className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs">
                    <option value="">None (Standalone)</option>
                    <option value="medixpro">MedixPro Healthcare Group</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-medium text-gray-300">About / Description</label>
                  <textarea rows={4} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs" placeholder="Brief description of the facility..."></textarea>
                </div>
              </div>
            </div>
          )}

          {/* Contact & Location */}
          {activeSection === "contact" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="border-b border-gray-800 pb-4 mb-6">
                <h2 className="text-xl  text-white">Contact & Location</h2>
                <p className="text-sm text-gray-400">Physical address and primary communication channels.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-medium text-gray-300">Street Address <span className="text-red-400">*</span></label>
                  <input type="text" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs" placeholder="123 Medical Boulevard" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">City <span className="text-red-400">*</span></label>
                  <input type="text" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs" placeholder="New York" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">State / Province <span className="text-red-400">*</span></label>
                  <input type="text" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs" placeholder="NY" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Postal / Zip Code <span className="text-red-400">*</span></label>
                  <input type="text" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs" placeholder="10001" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Country <span className="text-red-400">*</span></label>
                  <select className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs">
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="IN">India</option>
                    <option value="CA">Canada</option>
                  </select>
                </div>

                <div className="col-span-2 border-t border-gray-800 pt-6 mt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-300">Primary Phone <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="tel" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors text-xs" placeholder="+1 (555) 123-4567" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-300">Emergency / Ambulance Phone <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" size={16} />
                      <input type="tel" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors text-xs" placeholder="911 / 108 / Local ER Number" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-300">Official Email <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="email" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors text-xs" placeholder="contact@hospital.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-300">Website</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="url" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors text-xs" placeholder="https://www.hospital.com" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Legal & Compliance */}
          {activeSection === "compliance" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="border-b border-gray-800 pb-4 mb-6">
                <h2 className="text-xl  text-white">Legal & Compliance</h2>
                <p className="text-sm text-gray-400">Government registrations, licenses, and accreditations.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-medium text-gray-300">Primary Health License Number <span className="text-red-400">*</span></label>
                  <input type="text" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs" placeholder="e.g. HL-2023-XYZ890" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">License Issue Date</label>
                  <input type="date" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs [color-scheme:dark]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">License Expiry Date</label>
                  <input type="date" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs [color-scheme:dark]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Accreditation (NABH/JCI/etc)</label>
                  <input type="text" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs" placeholder="e.g. NABH Certified" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Biomedical Waste Registration No.</label>
                  <input type="text" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs" placeholder="BMW Reg. No" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-medium text-gray-300">Upload Documents (PDF/Images)</label>
                  <div className="w-full border-2 border-dashed border-gray-700 rounded p-8 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors cursor-pointer bg-dark-tertiary/50">
                    <FileText size={32} className="mb-2" />
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs mt-1">SVG, PNG, JPG or PDF (max. 10MB)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Infrastructure & Capacity */}
          {activeSection === "infrastructure" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="border-b border-gray-800 pb-4 mb-6">
                <h2 className="text-xl  text-white">Infrastructure & Capacity</h2>
                <p className="text-sm text-gray-400">Total beds, wards, operational theaters, and core facilities.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Total Bed Capacity</label>
                  <input type="number" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Total ICU Beds</label>
                  <input type="number" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Operation Theaters (OT)</label>
                  <input type="number" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Number of Wards</label>
                  <input type="number" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Ambulance Count</label>
                  <input type="number" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">24/7 Emergency Service?</label>
                  <select className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs">
                    <option value="yes">Yes, Available</option>
                    <option value="no">No, Specific Hours</option>
                  </select>
                </div>

                <div className="col-span-3 mt-4 space-y-4">
                  <h3 className="text-sm  text-gray-300">Available Core Services</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["Pathology Lab", "Radiology / X-Ray", "MRI / CT Scan", "Blood Bank", "Dialysis Unit", "In-house Pharmacy", "Cafeteria", "Morgue"].map((service, i) => (
                      <label key={i} className="flex items-center gap-2 p-3 border border-gray-700 rounded hover:border-gray-500 cursor-pointer bg-dark-tertiary/30">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900 bg-dark-tertiary" />
                        <span className="text-sm text-gray-300">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing & Taxes */}
          {activeSection === "billing" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="border-b border-gray-800 pb-4 mb-6">
                <h2 className="text-xl  text-white">Billing & Taxes</h2>
                <p className="text-sm text-gray-400">Tax registration and central billing configurations.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Tax Registration Number (GST/VAT) <span className="text-red-400">*</span></label>
                  <input type="text" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs" placeholder="e.g. 22AAAAA0000A1Z5" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Company Registration No. (CIN)</label>
                  <input type="text" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs" placeholder="e.g. U74999DL2023PTC000000" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-medium text-gray-300">Registered Billing Address</label>
                  <label className="flex items-center gap-2 mb-2 text-sm text-gray-400 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-600 text-blue-600 bg-dark-tertiary" defaultChecked />
                    Same as Physical Address
                  </label>
                  <textarea rows={3} className="w-full bg-dark-tertiary border border-gray-700 text-gray-500 rounded p-2 focus:outline-none transition-colors opacity-50 cursor-not-allowed" disabled value="123 Medical Boulevard, New York, NY 10001, United States"></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Default Currency</label>
                  <select className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
