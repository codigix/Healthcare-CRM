"use client";

import { useState } from "react";
import { KeyRound, ShieldAlert, Check, X } from "lucide-react";

export default function PermissionsPage() {
  const [selectedRole, setSelectedRole] = useState("Hospital Admin");

  const permissionsMatrix = [
    { module: "Dashboard", read: true, write: false, delete: false, export: true },
    { module: "Patient Records", read: true, write: true, delete: false, export: true },
    { module: "Billing & Finance", read: true, write: true, delete: false, export: true },
    { module: "System Settings", read: false, write: false, delete: false, export: false },
    { module: "User Management", read: true, write: true, delete: true, export: true },
  ];

  return (
    <div className="p-2 space-y-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <KeyRound className="text-blue-500" />
            Permissions Matrix
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Granular access control policies and CRUD permission assignments</p>
        </div>
      </div>

      <div className=" p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-800">
          <label className="text-gray-300 font-medium whitespace-nowrap">Select Role to Configure:</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-80 bg-dark-tertiary border border-gray-700 text-white rounded p-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="Super Admin">Super Admin</option>
            <option value="Hospital Admin">Hospital Admin</option>
            <option value="Senior Doctor">Senior Doctor</option>
            <option value="Front Desk Staff">Front Desk Staff</option>
          </select>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-dark-tertiary/50 border-b border-gray-800 text-gray-400 text-sm">
              <th className="p-4">Module / Entity</th>
              <th className="p-4 text-center">Read / View</th>
              <th className="p-4 text-center">Create / Write</th>
              <th className="p-4 text-center">Delete</th>
              <th className="p-4 text-center">Export</th>
            </tr>
          </thead>
          <tbody>
            {permissionsMatrix.map((p, idx) => (
              <tr key={idx} className="border-b border-gray-800 hover:bg-dark-tertiary/30">
                <td className="p-4  text-white">{p.module}</td>
                <td className="p-4 text-center">
                  <button className={`p-1 rounded ${p.read ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-500 bg-gray-800'}`}>
                    {p.read ? <Check size={15} /> : <X size={15} />}
                  </button>
                </td>
                <td className="p-4 text-center">
                  <button className={`p-1 rounded ${p.write ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-500 bg-gray-800'}`}>
                    {p.write ? <Check size={15} /> : <X size={15} />}
                  </button>
                </td>
                <td className="p-4 text-center">
                  <button className={`p-1 rounded ${p.delete ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-500 bg-gray-800'}`}>
                    {p.delete ? <Check size={15} /> : <X size={15} />}
                  </button>
                </td>
                <td className="p-4 text-center">
                  <button className={`p-1 rounded ${p.export ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-500 bg-gray-800'}`}>
                    {p.export ? <Check size={15} /> : <X size={15} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
