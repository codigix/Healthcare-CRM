"use client";

import { useState } from "react";
import { Monitor, Save, Activity } from "lucide-react";

export default function RISIntegrationsPage() {
  return (
    <div className=" space-y-2 mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <Monitor className="text-blue-500" />
            RIS Integration (Radiology Info System)
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Configure linking with radiology machines (X-Ray, CT, MRI, Ultrasound)</p>
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
            <h2 className="text-xl  text-white">Modality Worklist (MWL)</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-4 p-4 rounded border border-gray-700 bg-dark-tertiary/30 cursor-pointer hover:border-blue-500 transition-colors">
              <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <div>
                <h4 className="text-white font-medium">Enable DICOM Modality Worklist</h4>
                <p className="text-sm text-gray-400 mt-1">Automatically send patient demographic and procedure info directly to the scanning machines to prevent manual typing errors.</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
