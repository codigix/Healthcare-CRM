"use client";

import { useState } from "react";
import { CircleDollarSign, Save, Calendar } from "lucide-react";

export default function PayrollSettingsPage() {
  return (
    <div className=" space-y-2 mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <CircleDollarSign className="text-blue-500" />
            Global Payroll Settings
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Configure payroll cycles, generation dates, and tax deduction rules</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Save size={20} />
          <span>Save Configuration</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className=" p-2 space-y-2">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
            <Calendar className="text-emerald-500" size={24} />
            <h2 className="text-xl  text-white">Payroll Cycle</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Payroll Processing Cycle</label>
              <select className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none">
                <option>Monthly (1st to 30th/31st)</option>
                <option>Bi-Weekly</option>
                <option>Weekly</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Auto-Generate Payslips On (Day of Month)</label>
              <input type="number" defaultValue={25} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
        </div>

        <div className=" p-2 space-y-2">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
            <CircleDollarSign className="text-amber-500" size={24} />
            <h2 className="text-xl  text-white">Tax & Deductions</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-4 p-4 rounded border border-gray-700 bg-dark-tertiary/30 cursor-pointer hover:border-blue-500 transition-colors">
              <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <div>
                <h4 className="text-white font-medium">Auto-Calculate Income Tax (TDS)</h4>
                <p className="text-sm text-gray-400 mt-1">System automatically deducts TDS based on configured salary brackets.</p>
              </div>
            </label>
            <label className="flex items-start gap-4 p-4 rounded border border-gray-700 bg-dark-tertiary/30 cursor-pointer hover:border-blue-500 transition-colors">
              <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <div>
                <h4 className="text-white font-medium">Deduct Unpaid Leave Automatically</h4>
                <p className="text-sm text-gray-400 mt-1">If an employee takes LWP, automatically reduce base pay proportionally.</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
