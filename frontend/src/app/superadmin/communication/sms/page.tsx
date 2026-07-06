"use client";

import { useState } from "react";
import { MessageSquare, Save, Webhook } from "lucide-react";

export default function SMSGatewayPage() {
  return (
    <div className=" space-y-2 mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <MessageSquare className="text-blue-500" />
            SMS Gateway Configuration
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Configure third-party SMS API providers (Twilio, Gupshup, Textlocal, etc.)</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Save size={20} />
          <span>Save API Settings</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className=" p-2 space-y-2 md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
            <Webhook className="text-emerald-500" size={24} />
            <h2 className="text-xl  text-white">API Credentials</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Active Provider</label>
              <select className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none">
                <option>Twilio</option>
                <option>Amazon SNS</option>
                <option>Gupshup</option>
                <option>Custom HTTP API</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Account SID / API Key</label>
              <input type="password" defaultValue="AC1234567890abcdef1234567890abcdef" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Auth Token / Secret</label>
              <input type="password" defaultValue="xxxxxxxxxxxxxxxxxxxxxxx" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Sender ID (From Number/Name)</label>
              <input type="text" defaultValue="MEDIXPRO" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
        </div>

        <div className=" p-2 space-y-2 md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
            <MessageSquare className="text-blue-500" size={24} />
            <h2 className="text-xl  text-white">Test Configuration</h2>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-400">Send a test SMS to verify your gateway credentials are working properly.</p>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Test Mobile Number (with Country Code)</label>
              <input type="text" placeholder="+1234567890" className="w-full bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none" />
            </div>
            <button className="w-full py-2 bg-dark-tertiary border border-gray-600 hover:border-blue-500 hover:text-white text-gray-300 rounded transition-colors">
              Send Test SMS
            </button>

            <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded">
              <h4 className="text-emerald-400  mb-1">Status: Connected</h4>
              <p className="text-sm text-gray-400">Last successful ping: 2 mins ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
