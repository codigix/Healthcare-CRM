"use client";

import { useState } from "react";
import { Microscope, Save, Activity } from "lucide-react";

export default function LISIntegrationsPage() {
  return (
    <div className=" space-y-2 mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <Microscope className="text-blue-500" />
            LIS Integration (Lab Info System)
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Configure uni/bi-directional linking with external pathology analyzers</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Save size={20} />
          <span>Save Configuration</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className=" p-2 space-y-2">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
            <Activity className="text-emerald-500" size={24} />
            <h2 className="text-xl  text-white">Analyzer Machine Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Default Analyzer Driver</label>
              <select className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none">
                <option>Sysmex XT Series (Bi-Directional)</option>
                <option>Beckman Coulter (Bi-Directional)</option>
                <option>Siemens ADVIA (Uni-Directional)</option>
                <option>Generic ASTM Protocol</option>
              </select>
            </div>

            <label className="flex items-start gap-4 p-4 rounded border border-gray-700 bg-dark-tertiary/30 cursor-pointer hover:border-blue-500 transition-colors mt-4">
              <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <div>
                <h4 className="text-white font-medium">Auto-Authorize Normal Results</h4>
                <p className="text-sm text-gray-400 mt-1">Automatically push results to the EMR if values fall within normal biological reference ranges.</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
