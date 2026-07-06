"use client";

import { useState } from "react";
import { Pill, Save, LayoutTemplate } from "lucide-react";

export default function PrescriptionSettingsPage() {
  return (
    <div className=" space-y-2 mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <Pill className="text-blue-500" />
            Prescription Configuration
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Manage global Rx templates, warnings, and e-prescription rules</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Save size={20} />
          <span>Save Configuration</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className=" p-2 space-y-2">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
            <LayoutTemplate className="text-emerald-500" size={24} />
            <h2 className="text-xl  text-white">Print Settings</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-4 p-4 rounded border border-gray-700 bg-dark-tertiary/30 cursor-pointer hover:border-blue-500 transition-colors">
              <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <div>
                <h4 className="text-white font-medium">Print Generic Names</h4>
                <p className="text-sm text-gray-400 mt-1">Automatically include generic formula alongside the brand name.</p>
              </div>
            </label>
            <label className="flex items-start gap-4 p-4 rounded border border-gray-700 bg-dark-tertiary/30 cursor-pointer hover:border-blue-500 transition-colors">
              <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <div>
                <h4 className="text-white font-medium">Include Doctor Signature</h4>
                <p className="text-sm text-gray-400 mt-1">Print digitized doctor signature at the bottom of the Rx.</p>
              </div>
            </label>
            <div className="space-y-2 pt-2">
              <label className="text-xs font-medium text-gray-300">Prescription Footer Note</label>
              <textarea
                rows={3}
                defaultValue="Not valid for Medico-Legal purposes. Please bring this prescription on your next visit."
                className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none"
              ></textarea>
            </div>
          </div>
        </div>

        <div className=" p-2 space-y-2">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
            <Pill className="text-blue-500" size={24} />
            <h2 className="text-xl  text-white">Clinical Validation</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-4 p-4 rounded border border-gray-700 bg-dark-tertiary/30 cursor-pointer hover:border-blue-500 transition-colors">
              <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <div>
                <h4 className="text-white font-medium">Drug-Drug Interaction Alert</h4>
                <p className="text-sm text-gray-400 mt-1">Warn the physician if prescribed drugs interact negatively.</p>
              </div>
            </label>
            <label className="flex items-start gap-4 p-4 rounded border border-gray-700 bg-dark-tertiary/30 cursor-pointer hover:border-blue-500 transition-colors">
              <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <div>
                <h4 className="text-white font-medium">Allergy Warnings</h4>
                <p className="text-sm text-gray-400 mt-1">Block or warn prescribing if the patient has a known allergy to the drug.</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
