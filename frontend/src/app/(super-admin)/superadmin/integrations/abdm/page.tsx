"use client";

import { useState } from "react";
import { Network, Save, Fingerprint } from "lucide-react";

export default function ABDMIntegrationsPage() {
  return (
    <div className=" space-y-2 mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <Network className="text-blue-500" />
            ABDM / ABHA Integration
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Ayushman Bharat Digital Mission API linking for Indian Hospitals</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Save size={20} />
          <span>Save Credentials</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className=" p-2 space-y-2 md:col-span-2">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
            <Fingerprint className="text-emerald-500" size={24} />
            <h2 className="text-xl  text-white">HFR / HIP Registry</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Hospital Facility Registry (HFR) ID</label>
              <input type="text" defaultValue="IN-UP-123456789" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Client ID (API Key)</label>
              <input type="password" defaultValue="client_abcd1234" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
            </div>

            <label className="flex items-start gap-4 p-4 rounded border border-gray-700 bg-dark-tertiary/30 cursor-pointer hover:border-blue-500 transition-colors md:col-span-2">
              <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <div>
                <h4 className="text-white font-medium">Auto-Sync Health Records</h4>
                <p className="text-sm text-gray-400 mt-1">Automatically push finalized discharge summaries and prescriptions to the ABHA PHR app.</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
