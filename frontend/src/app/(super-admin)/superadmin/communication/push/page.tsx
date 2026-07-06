"use client";

import { useState } from "react";
import { BellRing, Save, Globe } from "lucide-react";

export default function PushNotificationsPage() {
  return (
    <div className=" space-y-2 mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <BellRing className="text-blue-500" />
            Push Notification Settings (FCM/APNS)
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Configure Firebase and Apple Push credentials for mobile apps</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Save size={20} />
          <span>Save Keys</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className=" p-2 space-y-2">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
            <Globe className="text-amber-500" size={24} />
            <h2 className="text-xl  text-white">Firebase Cloud Messaging (FCM)</h2>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-400">Required for Android Patient & Staff mobile apps.</p>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Firebase Project ID</label>
              <input type="text" defaultValue="medixpro-app-9912" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Server Key / JSON Credentials</label>
              <textarea
                rows={6}
                defaultValue='{\n  "type": "service_account",\n  "project_id": "medixpro-app-9912",\n  "private_key_id": "abcd1234..."\n}'
                className="w-full font-mono text-sm bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none"
              ></textarea>
            </div>
          </div>
        </div>

        <div className=" p-2 space-y-2">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
            <BellRing className="text-blue-500" size={24} />
            <h2 className="text-xl  text-white">Apple Push Notification (APNS)</h2>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-400">Required for iOS Patient & Staff mobile apps.</p>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Bundle ID</label>
              <input type="text" defaultValue="com.medixpro.patientapp" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Key ID</label>
              <input type="text" defaultValue="8A4B2C9D1E" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Team ID</label>
              <input type="text" defaultValue="XYZ9876543" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="pt-2">
              <button className="p-2 bg-dark-tertiary border border-gray-600 hover:border-blue-500 hover:text-white text-gray-300 rounded transition-colors w-full">
                Upload .p8 Certificate File
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
