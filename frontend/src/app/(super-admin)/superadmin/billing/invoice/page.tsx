"use client";

import { useState } from "react";
import { FileText, Save, LayoutTemplate } from "lucide-react";

export default function InvoiceSettingsPage() {
  return (
    <div className=" space-y-2 mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <FileText className="text-blue-500" />
            Invoice Settings
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Configure global invoice numbering formats and templates</p>
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
            <h2 className="text-xl  text-white">Numbering Sequence</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Invoice Prefix</label>
              <input type="text" defaultValue="INV-2026-" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Next Sequence Number</label>
              <input type="number" defaultValue={10500} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Preview</label>
              <div className="w-full bg-dark-tertiary border border-gray-700 text-emerald-400 font-mono rounded p-2">
                INV-2026-10500
              </div>
            </div>
          </div>
        </div>

        <div className=" p-2 space-y-2">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
            <FileText className="text-blue-500" size={24} />
            <h2 className="text-xl  text-white">Print Template Settings</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-4 p-4 rounded border border-gray-700 bg-dark-tertiary/30 cursor-pointer hover:border-blue-500 transition-colors">
              <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <div>
                <h4 className="text-white font-medium">Print Hospital Header / Logo</h4>
                <p className="text-sm text-gray-400 mt-1">Include global logo and address on invoice prints.</p>
              </div>
            </label>
            <label className="flex items-start gap-4 p-4 rounded border border-gray-700 bg-dark-tertiary/30 cursor-pointer hover:border-blue-500 transition-colors">
              <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <div>
                <h4 className="text-white font-medium">Print Tax Breakup</h4>
                <p className="text-sm text-gray-400 mt-1">Show granular GST/VAT lines at the bottom of the invoice.</p>
              </div>
            </label>
            <div className="space-y-2 pt-2">
              <label className="text-xs font-medium text-gray-300">Footer Note / T&C</label>
              <textarea
                rows={3}
                defaultValue="Thank you for trusting MedixPro. All payments are non-refundable. Please keep this invoice for your records."
                className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
