"use client";

import { useState } from "react";
import { Mail, Save } from "lucide-react";

export default function EmailServerPage() {
  return (
    <div className=" space-y-2 mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <Mail className="text-blue-500" />
            Email SMTP Server Config
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Configure global SMTP gateway for outbound patient and staff emails</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Save size={20} />
          <span>Save Settings</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className=" p-2 space-y-2">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
            <Server className="text-emerald-500" size={24} />
            <h2 className="text-xl  text-white">SMTP Credentials</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">SMTP Host / Server</label>
              <input type="text" defaultValue="smtp.sendgrid.net" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-300">Port</label>
                <input type="number" defaultValue={587} className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-300">Encryption</label>
                <select className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none">
                  <option>TLS</option>
                  <option>SSL</option>
                  <option>None</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Username</label>
              <input type="text" defaultValue="apikey" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Password</label>
              <input type="password" defaultValue="SG.xxxxxxxxxxxxx" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
        </div>

        <div className=" p-2 space-y-2">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
            <Mail className="text-blue-500" size={24} />
            <h2 className="text-xl  text-white">Sender Identity</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">From Name</label>
              <input type="text" defaultValue="MedixPro Healthcare" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">From Email Address</label>
              <input type="email" defaultValue="noreply@medixpro.com" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
            </div>

            <hr className="border-gray-800 my-4" />

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Send Test Email</label>
              <div className="flex gap-2">
                <input type="email" placeholder="test@example.com" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
                <button className="p-2 bg-dark-tertiary border border-gray-600 hover:border-blue-500 hover:text-white text-gray-300 rounded transition-colors whitespace-nowrap">
                  Send Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
