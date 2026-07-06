"use client";

import { useState } from "react";
import { HeartPulse, Save, ShieldCheck } from "lucide-react";

export default function AyushmanIntegrationsPage() {
  return (
    <div className=" space-y-2 mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <HeartPulse className="text-blue-500" />
            Ayushman Bharat (PM-JAY)
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Configure scheme codes and TMS (Transaction Management System) linking</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Save size={20} />
          <span>Save Integration</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className=" p-2 space-y-2">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
            <ShieldCheck className="text-emerald-500" size={24} />
            <h2 className="text-xl  text-white">TMS Connectivity</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Hospital Empanelment Code (HEC)</label>
              <input type="text" defaultValue="HEC-998877" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
            </div>

            <label className="flex items-start gap-4 p-4 rounded border border-gray-700 bg-dark-tertiary/30 cursor-pointer hover:border-blue-500 transition-colors mt-4">
              <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <div>
                <h4 className="text-white font-medium">Enable PM-JAY Eligibility Check</h4>
                <p className="text-sm text-gray-400 mt-1">Allow front-desk to verify patient PMJAY cards using Aadhaar biometric authentication.</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
