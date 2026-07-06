"use client";

import { useState } from "react";
import { Barcode, Save, LayoutTemplate } from "lucide-react";

export default function BarcodeSettingsPage() {
  return (
    <div className=" space-y-2 mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <Barcode className="text-blue-500" />
            Barcode & Tracking Settings
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Configure global barcode formats for inventory items, drugs, and assets</p>
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
            <h2 className="text-xl  text-white">Barcode Generation Rules</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Default Encoding Standard</label>
              <select className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none">
                <option>Code 128</option>
                <option>Code 39</option>
                <option>QR Code (2D)</option>
                <option>EAN-13</option>
              </select>
            </div>

            <label className="flex items-start gap-4 p-4 rounded border border-gray-700 bg-dark-tertiary/30 cursor-pointer hover:border-blue-500 transition-colors mt-4">
              <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <div>
                <h4 className="text-white font-medium">Auto-Generate Barcode on Item Creation</h4>
                <p className="text-sm text-gray-400 mt-1">System assigns a barcode automatically if none is provided.</p>
              </div>
            </label>

            <label className="flex items-start gap-4 p-4 rounded border border-gray-700 bg-dark-tertiary/30 cursor-pointer hover:border-blue-500 transition-colors mt-4">
              <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <div>
                <h4 className="text-white font-medium">Include Expiry in Barcode (QR)</h4>
                <p className="text-sm text-gray-400 mt-1">Embed batch/expiry data inside QR codes for faster scans.</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
