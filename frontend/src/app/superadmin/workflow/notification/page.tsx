"use client";

import { useState } from "react";
import { BellRing, Save, Mail, Smartphone, Bell } from "lucide-react";

export default function NotificationRulesPage() {
  return (
    <div className=" space-y-2 mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <BellRing className="text-blue-500" />
            Notification Rules Engine
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Configure automated alerts via Email, SMS, and In-App Push</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Save size={20} />
          <span>Save Preferences</span>
        </button>
      </div>

      <div className="">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-dark-tertiary/50 border-b border-gray-800 text-gray-400 text-sm">
              <th className="p-4">System Event</th>
              <th className="p-4 text-center">In-App <Bell size={14} className="inline ml-1" /></th>
              <th className="p-4 text-center">Email <Mail size={14} className="inline ml-1" /></th>
              <th className="p-4 text-center">SMS <Smartphone size={14} className="inline ml-1" /></th>
            </tr>
          </thead>
          <tbody>
            {[
              { event: "New Patient Registration", inApp: true, email: false, sms: false },
              { event: "Appointment Booking Confirmed (To Patient)", inApp: false, email: true, sms: true },
              { event: "Critical Lab Result Posted", inApp: true, email: true, sms: true },
              { event: "Approval Workflow Required", inApp: true, email: true, sms: false },
              { event: "SLA Breach / Escalation", inApp: true, email: true, sms: true },
            ].map((rule, idx) => (
              <tr key={idx} className="border-b border-gray-800 hover:bg-dark-tertiary/30">
                <td className="p-4 font-medium text-white">{rule.event}</td>
                <td className="p-4 text-center">
                  <input type="checkbox" defaultChecked={rule.inApp} className="w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary cursor-pointer" />
                </td>
                <td className="p-4 text-center">
                  <input type="checkbox" defaultChecked={rule.email} className="w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary cursor-pointer" />
                </td>
                <td className="p-4 text-center">
                  <input type="checkbox" defaultChecked={rule.sms} className="w-5 h-5 rounded border-gray-600 text-blue-600 bg-dark-tertiary cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
