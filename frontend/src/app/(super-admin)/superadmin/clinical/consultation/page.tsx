"use client";

import { useState } from "react";
import { Stethoscope, Save, Settings2, Clock } from "lucide-react";

export default function ConsultationSettingsPage() {
  return (
    <div className=" space-y-2 mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <Stethoscope className="text-blue-500" />
            Clinical Consultation Settings
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Configure global parameters for OP/IP doctor consultations</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Save size={20} />
          <span>Save Parameters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className=" p-2 space-y-2">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
            <Clock className="text-amber-500" size={24} />
            <h2 className="text-xl  text-white">Time & Duration Rules</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Default Slot Duration (Minutes)</label>
              <select className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none">
                <option>10 Minutes</option>
                <option selected>15 Minutes</option>
                <option>20 Minutes</option>
                <option>30 Minutes</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Consultation Validity (Days)</label>
              <p className="text-xs text-gray-500 mb-2">Number of days a follow-up is considered free/part of the initial visit.</p>
              <input type="number" defaultValue={7} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
        </div>

        <div className=" p-2 space-y-2">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
            <Settings2 className="text-emerald-500" size={24} />
            <h2 className="text-xl  text-white">EMR Mandates</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-4 p-4 rounded border border-gray-700 bg-dark-tertiary/30 cursor-pointer hover:border-blue-500 transition-colors">
              <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <div>
                <h4 className="text-white font-medium">Mandatory Chief Complaints</h4>
                <p className="text-sm text-gray-400 mt-1">Doctor cannot save consultation without entering chief complaints.</p>
              </div>
            </label>
            <label className="flex items-start gap-4 p-4 rounded border border-gray-700 bg-dark-tertiary/30 cursor-pointer hover:border-blue-500 transition-colors">
              <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <div>
                <h4 className="text-white font-medium">Mandatory Vitals Capture</h4>
                <p className="text-sm text-gray-400 mt-1">Requires nurse to enter BP, Temp, HR before doctor consultation.</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
