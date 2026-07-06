"use client";

import { useState } from "react";
import {
  Settings,
  Save,
  Globe,
  Bell,
  Palette,
  Database,
  Mail,
  Smartphone,
  ShieldCheck,
  Server,
} from "lucide-react";

export default function HospitalSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  return (
    <div className="p-2 space-y-2 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <Settings className="text-blue-500" />
            Global Hospital Settings
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Configure global application parameters, branding, and system preferences</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20">
          <Save size={20} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1 space-y-2">
          <button
            onClick={() => setActiveTab("general")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left transition-colors ${activeTab === 'general' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:bg-dark-tertiary hover:text-gray-200'}`}
          >
            <Globe size={15} />
            <span className="font-medium">General Localization</span>
          </button>
          <button
            onClick={() => setActiveTab("branding")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left transition-colors ${activeTab === 'branding' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:bg-dark-tertiary hover:text-gray-200'}`}
          >
            <Palette size={15} />
            <span className="font-medium">Theme & Branding</span>
          </button>
          <button
            onClick={() => setActiveTab("communications")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left transition-colors ${activeTab === 'communications' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:bg-dark-tertiary hover:text-gray-200'}`}
          >
            <Bell size={15} />
            <span className="font-medium">SMTP & Communications</span>
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left transition-colors ${activeTab === 'system' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:bg-dark-tertiary hover:text-gray-200'}`}
          >
            <Server size={15} />
            <span className="font-medium">System & Maintenance</span>
          </button>
        </div>

        {/* Form Area */}
        <div className="lg:col-span-3  p-6 min-h-[500px]">

          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="border-b border-gray-800 pb-4 mb-6">
                <h2 className="text-xl  text-white">General Localization</h2>
                <p className="text-sm text-gray-400">Set network-wide defaults for dates, times, and currency.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Default System Timezone</label>
                  <select className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs">
                    <option value="EST">Eastern Standard Time (EST)</option>
                    <option value="GMT">Greenwich Mean Time (GMT)</option>
                    <option value="IST">Indian Standard Time (IST)</option>
                    <option value="PST">Pacific Standard Time (PST)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Default Currency</label>
                  <select className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs">
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="INR">INR (₹) - Indian Rupee</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Date Format</label>
                  <select className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs">
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Time Format</label>
                  <select className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs">
                    <option value="12h">12-Hour (AM/PM)</option>
                    <option value="24h">24-Hour (Military Time)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Theme & Branding */}
          {activeTab === "branding" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="border-b border-gray-800 pb-4 mb-6">
                <h2 className="text-xl  text-white">Theme & Branding</h2>
                <p className="text-sm text-gray-400">Configure visual identity for Patient Portals and Reports.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-medium text-gray-300">Hospital Group Display Name</label>
                  <input type="text" defaultValue="MedixPro Global Network" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Primary Brand Color</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" defaultValue="#3b82f6" className="h-10 w-10 rounded border border-gray-700 cursor-pointer bg-dark-tertiary" />
                    <input type="text" defaultValue="#3b82f6" className="flex-1 bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Secondary Accent Color</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" defaultValue="#10b981" className="h-10 w-10 rounded border border-gray-700 cursor-pointer bg-dark-tertiary" />
                    <input type="text" defaultValue="#10b981" className="flex-1 bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs" />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2 mt-4">
                  <label className="text-xs font-medium text-gray-300">Global Logo Upload (Light & Dark Mode)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border-2 border-dashed border-gray-700 rounded p-6 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors cursor-pointer bg-dark-tertiary/50">
                      <p className="font-medium mb-1">Dark Mode Logo (White Text)</p>
                      <p className="text-xs">PNG, SVG (Max 2MB)</p>
                    </div>
                    <div className="border-2 border-dashed border-gray-700 bg-white rounded p-6 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 transition-colors cursor-pointer">
                      <p className="font-medium mb-1">Light Mode Logo (Dark Text)</p>
                      <p className="text-xs">PNG, SVG (Max 2MB)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Communications */}
          {activeTab === "communications" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="border-b border-gray-800 pb-4 mb-6">
                <h2 className="text-xl  text-white">SMTP & Communications</h2>
                <p className="text-sm text-gray-400">Configure outbound email servers and SMS gateways.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2 flex items-center gap-2 mb-2">
                  <Mail className="text-blue-400" size={20} />
                  <h3 className="text-lg  text-gray-200">Email Gateway (SMTP)</h3>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-medium text-gray-300">SMTP Host</label>
                  <input type="text" defaultValue="smtp.sendgrid.net" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">SMTP Port</label>
                  <input type="number" defaultValue="587" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Security / Encryption</label>
                  <select className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs">
                    <option value="tls">TLS</option>
                    <option value="ssl">SSL</option>
                    <option value="none">None</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-medium text-gray-300">SMTP Username / API Key</label>
                  <input type="password" defaultValue="apikey" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs" />
                </div>

                <div className="col-span-2 flex items-center gap-2 mb-2 mt-6 border-t border-gray-800 pt-6">
                  <Smartphone className="text-emerald-400" size={20} />
                  <h3 className="text-lg  text-gray-200">SMS Gateway (Twilio / Msg91)</h3>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-medium text-gray-300">Provider API Key</label>
                  <input type="password" placeholder="Enter API Key" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs" />
                </div>
              </div>
            </div>
          )}

          {/* System & Maintenance */}
          {activeTab === "system" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="border-b border-gray-800 pb-4 mb-6">
                <h2 className="text-xl  text-white">System & Maintenance</h2>
                <p className="text-sm text-gray-400">Control system state, data retention, and backup policies.</p>
              </div>

              <div className="bg-dark-tertiary/50 border border-gray-800 rounded6">
                <div className="flex justify-between items-center my-3 my-3">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded ${isMaintenanceMode ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                      {isMaintenanceMode ? <ShieldCheck size={24} /> : <Database size={24} />}
                    </div>
                    <div>
                      <h3 className="text-lg  text-white">Maintenance Mode</h3>
                      <p className="text-sm text-gray-400">Lock non-admin users out of the system temporarily.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMaintenanceMode(!isMaintenanceMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isMaintenanceMode ? 'bg-amber-500' : 'bg-gray-600'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isMaintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Automated Database Backup</label>
                  <select className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs">
                    <option value="daily">Daily (Midnight)</option>
                    <option value="weekly">Weekly (Sunday)</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Data Retention Policy</label>
                  <select className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-blue-500 transition-colors text-xs text-xs">
                    <option value="7">7 Years (Compliance Default)</option>
                    <option value="10">10 Years</option>
                    <option value="indefinite">Indefinite</option>
                  </select>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
