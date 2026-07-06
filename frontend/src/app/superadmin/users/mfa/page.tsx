"use client";

import { useState } from "react";
import { SmartphoneNfc, Save, ShieldCheck } from "lucide-react";

export default function MFAPage() {
  const [mfaStatus, setMfaStatus] = useState(true);

  return (
    <div className=" space-y-2 mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <SmartphoneNfc className="text-blue-500" />
            Multi-Factor Authentication (MFA)
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Configure global 2FA requirements and authentication methods</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Save size={20} />
          <span>Save Settings</span>
        </button>
      </div>

      <div className=" p-6 space-y-8">

        {/* Master Toggle */}
        <div className="flex items-center justify-between p-6 bg-dark-tertiary/50 border border-blue-500/20 rounded-xl">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${mfaStatus ? 'bg-blue-500/20 text-blue-500' : 'bg-gray-800 text-gray-500'}`}>
              <ShieldCheck size={32} />
            </div>
            <div>
              <h2 className="text-xl  text-white">Global MFA Requirement</h2>
              <p className="text-sm text-gray-400">Enforce Multi-Factor Authentication for all administrative and clinical staff.</p>
            </div>
          </div>
          <button
            onClick={() => setMfaStatus(!mfaStatus)}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${mfaStatus ? 'bg-blue-600' : 'bg-gray-600'}`}
          >
            <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${mfaStatus ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Allowed Methods */}
        <div className={`space-y-4 ${!mfaStatus ? 'opacity-50 pointer-events-none' : ''}`}>
          <h3 className="text-lg  text-white border-b border-gray-800 pb-2">Allowed Authentication Methods</h3>

          <div className="grid grid-cols-1 gap-4">
            <label className="flex items-start gap-4 p-4 rounded border border-gray-700 bg-dark-tertiary/30 cursor-pointer hover:border-blue-500 transition-colors">
              <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <div>
                <h4 className="text-white font-medium">Authenticator App (TOTP) <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded ml-2">Recommended</span></h4>
                <p className="text-sm text-gray-400 mt-1">Google Authenticator, Authy, or Microsoft Authenticator.</p>
              </div>
            </label>

            <label className="flex items-start gap-4 p-4 rounded border border-gray-700 bg-dark-tertiary/30 cursor-pointer hover:border-blue-500 transition-colors">
              <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <div>
                <h4 className="text-white font-medium">SMS Text Message</h4>
                <p className="text-sm text-gray-400 mt-1">Send a 6-digit code to the user's registered mobile number.</p>
              </div>
            </label>

            <label className="flex items-start gap-4 p-4 rounded border border-gray-700 bg-dark-tertiary/30 cursor-pointer hover:border-blue-500 transition-colors">
              <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary" />
              <div>
                <h4 className="text-white font-medium">Email OTP</h4>
                <p className="text-sm text-gray-400 mt-1">Send a one-time passcode to the user's corporate email address.</p>
              </div>
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}
