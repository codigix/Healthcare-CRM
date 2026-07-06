"use client";

import { useState } from "react";
import {
  Building2,
  Users,
  Server,
  Link2,
  ShieldAlert,
  Activity,
  HardDrive,
  Settings,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

const sysUsageData = [
  { name: "Jan", users: 4000, queries: 2400 },
  { name: "Feb", users: 3000, queries: 1398 },
  { name: "Mar", users: 2000, queries: 9800 },
  { name: "Apr", users: 2780, queries: 3908 },
  { name: "May", users: 1890, queries: 4800 },
  { name: "Jun", users: 2390, queries: 3800 },
  { name: "Jul", users: 3490, queries: 4300 },
];

const auditLogs = [
  { id: 1, action: "System Backup Completed", user: "Auto System", time: "10 mins ago", status: "success" },
  { id: 2, action: "Failed Login Attempt (IP: 192.168.1.10)", user: "Unknown", time: "1 hour ago", status: "warning" },
  { id: 3, action: "Role Permissions Updated", user: "Admin (John)", time: "3 hours ago", status: "info" },
  { id: 4, action: "New License Provisioned", user: "Super Admin", time: "5 hours ago", status: "success" },
];

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center my-3 my-3">
        <div>
          <h1 className="text-3xl  text-white">Super Admin Console</h1>
          <p className="text-gray-400 mt-1 text-xs">Global System Oversight and Master Controls</p>
        </div>
        <div className="flex gap-3">
          <button className="p-2 bg-dark-tertiary hover:bg-dark-tertiary/80 text-white rounded transition-colors flex items-center gap-2 border border-gray-700">
            <Activity size={15} />
            <span>System Health: 99.9%</span>
          </button>
          <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20">
            <ShieldAlert size={15} />
            <span>Security Scan</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Facilities", value: "12", sub: "+2 this month", icon: Building2, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
          { label: "Total Users", value: "8,432", sub: "+124 this week", icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          { label: "System Uptime", value: "99.99%", sub: "Last 30 days", icon: Server, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
          { label: "Active Integrations", value: "24", sub: "All systems operational", icon: Link2, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
        ].map((stat, i) => (
          <div key={i} className={`bg-dark-secondary rounded2 border ${stat.border} flex items-center gap-4`}>
            <div className={`p-4 rounded ${stat.bg} ${stat.color}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl  text-white mt-1">{stat.value}</h3>
              <p className={`text-xs mt-1 ${stat.color}`}>{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <div className=" p-6 lg:col-span-2">
          <div className="flex justify-between items-center my-3 my-3 mb-6">
            <div>
              <h2 className="text-lg  text-white">System Usage Analytics</h2>
              <p className="text-sm text-gray-400">Concurrent users and API queries over time</p>
            </div>
            <button className="text-gray-400 hover:text-white transition-colors">
              <TrendingUp size={20} />
            </button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sysUsageData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{ fill: '#888' }} axisLine={false} />
                <YAxis stroke="#666" tick={{ fill: '#888' }} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={2} />
                <Area type="monotone" dataKey="queries" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorQueries)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Logs */}
        <div className="space-y-6">
          <div className=" p-6">
            <h2 className="text-lg  text-white mb-4">Quick Access</h2>
            <div className="space-y-3">
              {[
                { label: "Global Masters", icon: Settings, href: "/superadmin/masters", color: "text-gray-300" },
                { label: "Security Policies", icon: ShieldAlert, href: "/superadmin/security", color: "text-red-400" },
                { label: "Backup & Recovery", icon: HardDrive, href: "/superadmin/backup", color: "text-emerald-400" },
                { label: "Organization Tree", icon: Building2, href: "/superadmin/organization", color: "text-blue-400" },
              ].map((action, i) => (
                <Link key={i} href={action.href} className="flex items-center justify-between p-3 rounded hover:bg-dark-tertiary border border-transparent hover:border-gray-700 transition-all group">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-md bg-dark-tertiary group-hover:bg-dark-secondary ${action.color}`}>
                      <action.icon size={15} />
                    </div>
                    <span className="text-gray-300 group-hover:text-white font-medium">{action.label}</span>
                  </div>
                  <ChevronRight size={15} className="text-gray-600 group-hover:text-gray-400" />
                </Link>
              ))}
            </div>
          </div>

          <div className=" p-6">
            <div className="flex justify-between items-center my-3 my-3 mb-4">
              <h2 className="text-lg  text-white">Recent Audit Logs</h2>
              <Link href="/superadmin/audit" className="text-sm text-blue-400 hover:text-blue-300">View All</Link>
            </div>
            <div className="space-y-4">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3">
                  <div className={`mt-1 w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-emerald-500' :
                    log.status === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                  <div>
                    <p className="text-sm text-gray-200">{log.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{log.user}</span>
                      <span className="text-xs text-gray-600">•</span>
                      <span className="text-xs text-gray-500">{log.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
