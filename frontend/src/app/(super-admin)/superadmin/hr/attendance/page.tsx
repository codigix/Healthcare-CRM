"use client";

import { useState } from "react";
import { UserCheck, Save, Settings2 } from "lucide-react";

export default function AttendanceRulesPage() {
  return (
    <div className=" space-y-2 mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <UserCheck className="text-blue-500" />
            Attendance & Tracking Rules
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Configure biometric tracking, half-day calculations, and grace periods</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Save size={20} />
          <span>Save Rules</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className=" p-2 space-y-2">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
            <Settings2 className="text-emerald-500" size={24} />
            <h2 className="text-xl  text-white">Time Tracking Parameters</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Late Arrival Grace Period (Minutes)</label>
              <input type="number" defaultValue={15} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Minimum Hours for Half Day</label>
              <input type="number" defaultValue={4} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Minimum Hours for Full Day</label>
              <input type="number" defaultValue={8} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
        </div>

        <div className=" p-2 space-y-2">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
            <UserCheck className="text-amber-500" size={24} />
            <h2 className="text-xl  text-white">Deduction Rules</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-4 p-4 rounded border border-gray-700 bg-dark-tertiary/30 cursor-pointer hover:border-blue-500 transition-colors">
              <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <div>
                <h4 className="text-white font-medium">3 Late Marks = 1 Half Day Leave</h4>
                <p className="text-sm text-gray-400 mt-1">Automatically deduct half a day from leave balance after 3 late punches in a month.</p>
              </div>
            </label>
            <label className="flex items-start gap-4 p-4 rounded border border-gray-700 bg-dark-tertiary/30 cursor-pointer hover:border-blue-500 transition-colors">
              <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <div>
                <h4 className="text-white font-medium">Absent if No Out-Punch</h4>
                <p className="text-sm text-gray-400 mt-1">Mark employee absent if they scan in but fail to scan out by midnight.</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
