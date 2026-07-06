"use client";

import React from 'react';
import { FileText } from 'lucide-react';

export default function AdminReportsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center space-y-4">
      <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
        <FileText size={32} />
      </div>
      <h1 className="text-2xl  text-white">Admin Reports Dashboard</h1>
      <p className="text-gray-400 max-w-md">
        Please select a specific report type (Daily, Bed Occupancy, Department, etc.) from the sidebar to view the data.
      </p>
    </div>
  );
}
