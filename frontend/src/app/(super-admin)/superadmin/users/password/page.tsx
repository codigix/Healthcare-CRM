"use client";

import { useState } from "react";
import { KeyRound, ShieldAlert, Save } from "lucide-react";

export default function PasswordPolicyPage() {
  return (
    <div className=" space-y-2 mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <KeyRound className="text-blue-500" />
            Password & Security Policies
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Configure global password complexity and expiration rules</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Save size={20} />
          <span>Save Policy</span>
        </button>
      </div>

      <div className=" p-2 space-y-2">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
          <ShieldAlert className="text-amber-500" size={24} />
          <h2 className="text-xl  text-white">Complexity Requirements</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">Minimum Password Length</label>
            <input type="number" defaultValue={12} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">Password Expiration (Days)</label>
            <input type="number" defaultValue={90} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
          </div>

          <div className="space-y-4 md:col-span-2 bg-dark-tertiary/30 p-4 rounded border border-gray-800">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <span className="text-gray-300">Require at least one uppercase letter (A-Z)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <span className="text-gray-300">Require at least one lowercase letter (a-z)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <span className="text-gray-300">Require at least one number (0-9)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <span className="text-gray-300">Require at least one special character (!@#$%^&*)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <span className="text-gray-300">Prevent reuse of last 5 passwords</span>
            </label>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-medium text-gray-300">Account Lockout Policy</label>
            <select className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none">
              <option>Lock out after 3 failed attempts</option>
              <option>Lock out after 5 failed attempts</option>
              <option>Lock out after 10 failed attempts</option>
              <option>Do not lock accounts automatically</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
