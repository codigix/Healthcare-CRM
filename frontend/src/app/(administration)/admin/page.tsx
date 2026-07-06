"use client";

import React from 'react';
import { LayoutDashboard } from 'lucide-react';

export default function AdminIndexPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center space-y-4">
      <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
        <LayoutDashboard size={32} />
      </div>
      <h1 className="text-2xl  text-white">Admin Module Overview</h1>
      <p className="text-gray-400 max-w-md">
        Please select a sub-module from the sidebar menu to view detailed metrics and manage records.
      </p>
    </div>
  );
}
