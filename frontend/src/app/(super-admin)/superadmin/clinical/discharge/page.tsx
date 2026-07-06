"use client";

import { useState } from "react";
import { LogOut, Save, FileText } from "lucide-react";

export default function DischargeSettingsPage() {
  return (
    <div className=" space-y-2 mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <LogOut className="text-blue-500" />
            Discharge Workflow Settings
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Manage global rules for patient discharge and summaries</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Save size={20} />
          <span>Save Workflows</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className=" p-2 space-y-2 md:col-span-2">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
            <FileText className="text-emerald-500" size={24} />
            <h2 className="text-xl  text-white">Discharge Summary Requirements</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex items-start gap-4 p-4 rounded border border-gray-700 bg-dark-tertiary/30 cursor-pointer hover:border-blue-500 transition-colors">
              <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <div>
                <h4 className="text-white font-medium">Require Final Bill Clearance</h4>
                <p className="text-sm text-gray-400 mt-1">Do not allow physical discharge without billing department sign-off.</p>
              </div>
            </label>
            <label className="flex items-start gap-4 p-4 rounded border border-gray-700 bg-dark-tertiary/30 cursor-pointer hover:border-blue-500 transition-colors">
              <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <div>
                <h4 className="text-white font-medium">Require Pharmacy Clearance</h4>
                <p className="text-sm text-gray-400 mt-1">Ensure all IP medication returns are processed before discharge.</p>
              </div>
            </label>
            <label className="flex items-start gap-4 p-4 rounded border border-gray-700 bg-dark-tertiary/30 cursor-pointer hover:border-blue-500 transition-colors">
              <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <div>
                <h4 className="text-white font-medium">Auto-Generate Follow-up Appointment</h4>
                <p className="text-sm text-gray-400 mt-1">Prompt desk to book a follow-up visit based on doctor's recommendation.</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
