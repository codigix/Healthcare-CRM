"use client";

import { useState, useEffect } from "react";

import { dashboardAPI, notificationAPI } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  IndianRupee,
  Calendar,
  Users,
  UserCheck,
  TrendingUp,
  Calendar as CalendarIcon,
  FileText,
  Bell,
  BarChart3,
} from "lucide-react";

interface Stats {
  totalDoctors?: number;
  totalPatients?: number;
  totalAppointments?: number;
  totalRevenue?: number;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  patient: { name: string; avatar?: string };
  type: string;
  status: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [revenueData, setRevenueData] = useState([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Notification Console test state
  const [liveNotifications, setLiveNotifications] = useState<any[]>([]);
  const [testNotifTitle, setTestNotifTitle] = useState("");
  const [testNotifMsg, setTestNotifMsg] = useState("");
  const [testNotifType, setTestNotifType] = useState("info");
  const [testNotifDept, setTestNotifDept] = useState("");
  const [dispatchingNotif, setDispatchingNotif] = useState(false);

  const fetchLiveNotifications = async () => {
    try {
      const res = await notificationAPI.list();
      setLiveNotifications(res.data.notifications || []);
    } catch (e) {
      console.error("Failed to fetch live notifications", e);
    }
  };

  const handleSendTestNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testNotifTitle.trim() || !testNotifMsg.trim()) return;

    try {
      setDispatchingNotif(true);
      await notificationAPI.create({
        title: testNotifTitle.trim(),
        message: testNotifMsg.trim(),
        type: testNotifType,
        department: testNotifDept || null,
        senderName: "Admin Console"
      });
      setTestNotifTitle("");
      setTestNotifMsg("");
      fetchLiveNotifications();
    } catch (error) {
      console.error("Failed to send test notification:", error);
    } finally {
      setDispatchingNotif(false);
    }
  };

  useEffect(() => {
    if (activeTab === "notifications") {
      fetchLiveNotifications();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsRes, revenueRes, appointmentsRes] = await Promise.all([
          dashboardAPI.stats().catch(() => ({ data: {} })),
          dashboardAPI.revenueChart().catch(() => ({ data: [] })),
          dashboardAPI.recentAppointments().catch(() => ({ data: [] })),
        ]);

        setStats(statsRes.data || {});
        setRevenueData(revenueRes.data || []);

        const aptList = appointmentsRes.data || [];
        const mapped = (Array.isArray(aptList) ? aptList : [])
          .slice(0, 12)
          .map((apt: any) => ({
            id: apt.id,
            date: apt.date,
            time: apt.time,
            patient: apt.patient || { name: "Unknown" },
            type: "Check-up",
            status: apt.status || "confirmed",
          }));

        setAppointments(mapped);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "completed":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "in progress":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "scheduled":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const formatTime = (time24: string) => {
    if (!time24 || !time24.includes(":")) return time24;
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400 mt-1">
              Welcome back, Dr. Johnson! Here's what's happening today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-dark-secondary rounded-lg hover:bg-dark-tertiary transition-colors">
              <CalendarIcon size={18} />
              <span className="text-sm">Nov 11, 2025 - Nov 11, 2025</span>
            </button>
            <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
              Export
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
            {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card card-hover border border-dark-tertiary">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <IndianRupee className="text-emerald-500" size={20} />
                      <p className="text-gray-400 text-sm">Total Revenue</p>
                    </div>
                    <p className="text-3xl font-bold">
                      ₹
                      {(typeof stats?.totalRevenue === "number"
                        ? stats.totalRevenue.toFixed(2)
                        : "0.00"
                      ).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </p>
                    <p className="text-emerald-500 text-mdmt-2 flex items-center gap-1">
                      <TrendingUp size={14} />
                      +20.1% from last month
                    </p>
                  </div>
                </div>
              </div>

              <div className="card card-hover border border-dark-tertiary">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="text-blue-500" size={20} />
                      <p className="text-gray-400 text-sm">Appointments</p>
                    </div>
                    <p className="text-3xl font-bold">
                      +{stats?.totalAppointments?.toLocaleString() || "2,350"}
                    </p>
                    <p className="text-blue-500 text-mdmt-2 flex items-center gap-1">
                      <TrendingUp size={14} />
                      +10.1% from last month
                    </p>
                  </div>
                </div>
              </div>

              <div className="card card-hover border border-dark-tertiary">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="text-yellow-500" size={20} />
                      <p className="text-gray-400 text-sm">Patients</p>
                    </div>
                    <p className="text-3xl font-bold">
                      +{stats?.totalPatients?.toLocaleString() || "12,234"}
                    </p>
                    <p className="text-yellow-500 text-mdmt-2 flex items-center gap-1">
                      <TrendingUp size={14} />
                      +19% from last month
                    </p>
                  </div>
                </div>
              </div>

              <div className="card card-hover border border-dark-tertiary">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <UserCheck className="text-purple-500" size={20} />
                      <p className="text-gray-400 text-sm">Staff</p>
                    </div>
                    <p className="text-3xl font-bold">
                      +{stats?.totalDoctors || "573"}
                    </p>
                    <p className="text-purple-500 text-mdmt-2 flex items-center gap-1">
                      <TrendingUp size={14} />
                      +4 new this month
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex gap-4 border-b border-dark-tertiary mb-6">
                {["overview", "analytics", "reports", "notifications"].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-3 text-mdfont-medium capitalize transition-colors relative ${
                        activeTab === tab
                          ? "text-white"
                          : "text-gray-400 hover:text-gray-300"
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
                      )}
                    </button>
                  )
                )}
              </div>

              {activeTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Overview</h3>
                    <p className="text-gray-400 text-mdmb-6">
                      Patient visits and revenue for the current period.
                    </p>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={revenueData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.05)"
                        />
                        <XAxis
                          dataKey="name"
                          stroke="rgba(255,255,255,0.5)"
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis
                          stroke="rgba(255,255,255,0.5)"
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(30, 30, 30, 0.95)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar
                          dataKey="value"
                          fill="rgb(26, 188, 156)"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Recent Appointments
                    </h3>
                    <p className="text-gray-400 text-mdmb-6">
                      You have {appointments.length} recent appointments.
                    </p>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {appointments.length > 0 ? (
                        appointments.map((apt) => (
                          <div
                            key={apt.id}
                            className="flex items-center justify-between p-3 bg-dark-secondary rounded-lg hover:bg-dark-tertiary transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-mdfont-semibold">
                                {apt.patient.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {apt.patient.name}
                                </p>
                                <p className="text-mdtext-gray-400">
                                  {apt.type}
                                </p>
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                  <CalendarIcon size={12} />
                                  {new Date(apt.date).toLocaleDateString()}{" "}
                                  {formatTime(apt.time)}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                apt.status
                              )}`}
                            >
                              {apt.status.charAt(0).toUpperCase() +
                                apt.status.slice(1)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-4">
                          No recent appointments
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">
                    Key Performance Indicators
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-dark-secondary rounded-lg p-4 border border-dark-tertiary">
                      <p className="text-gray-400 text-mdmb-2">
                        Appointment Completion Rate
                      </p>
                      <p className="text-2xl font-bold">87%</p>
                      <p className="text-emerald-500 text-xs mt-2">
                        +5% from last month
                      </p>
                    </div>
                    <div className="bg-dark-secondary rounded-lg p-4 border border-dark-tertiary">
                      <p className="text-gray-400 text-mdmb-2">
                        Average Rating
                      </p>
                      <p className="text-2xl font-bold">4.8/5</p>
                      <p className="text-emerald-500 text-xs mt-2">
                        Based on 342 reviews
                      </p>
                    </div>
                    <div className="bg-dark-secondary rounded-lg p-4 border border-dark-tertiary">
                      <p className="text-gray-400 text-mdmb-2">
                        Patient Satisfaction
                      </p>
                      <p className="text-2xl font-bold">92%</p>
                      <p className="text-emerald-500 text-xs mt-2">
                        +3% from last month
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Monthly Performance
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={revenueData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.05)"
                        />
                        <XAxis
                          dataKey="name"
                          stroke="rgba(255,255,255,0.5)"
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis
                          stroke="rgba(255,255,255,0.5)"
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(30, 30, 30, 0.95)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar
                          dataKey="value"
                          fill="rgb(26, 188, 156)"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === "reports" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Available Reports
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-dark-secondary rounded-lg border border-dark-tertiary hover:bg-dark-tertiary transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FileText className="text-blue-500" size={24} />
                        <div>
                          <p className="font-medium">Revenue Report</p>
                          <p className="text-mdtext-gray-400">
                            Monthly revenue summary and trends
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-emerald-500/20 text-emerald-500 rounded hover:bg-emerald-500/30 transition-colors text-sm">
                        Generate
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-dark-secondary rounded-lg border border-dark-tertiary hover:bg-dark-tertiary transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FileText className="text-emerald-500" size={24} />
                        <div>
                          <p className="font-medium">Patient Demographics</p>
                          <p className="text-mdtext-gray-400">
                            Patient distribution and statistics
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-emerald-500/20 text-emerald-500 rounded hover:bg-emerald-500/30 transition-colors text-sm">
                        Generate
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-dark-secondary rounded-lg border border-dark-tertiary hover:bg-dark-tertiary transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FileText className="text-yellow-500" size={24} />
                        <div>
                          <p className="font-medium">Staff Performance</p>
                          <p className="text-mdtext-gray-400">
                            Doctor and staff performance metrics
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-emerald-500/20 text-emerald-500 rounded hover:bg-emerald-500/30 transition-colors text-sm">
                        Generate
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Dispatch Notification Form */}
                  <div className="lg:col-span-1 bg-dark-secondary border border-dark-tertiary p-5 rounded-xl space-y-4">
                    <div className="border-b border-dark-tertiary pb-3">
                      <h3 className="text-md font-bold text-white">Dispatch Notification</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Send a real-time notification to a targeted department or system-wide.
                      </p>
                    </div>
                    
                    <form onSubmit={handleSendTestNotification} className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1.5">
                          Target Department
                        </label>
                        <select
                          value={testNotifDept}
                          onChange={(e) => setTestNotifDept(e.target.value)}
                          className="w-full text-xs bg-dark-tertiary border border-dark-tertiary/60 rounded px-2.5 py-2 outline-none text-gray-300 transition-colors focus:border-emerald-500/50"
                        >
                          <option value="">Global System (Everyone)</option>
                          <option value="doctor">Doctors</option>
                          <option value="admin">Administrators</option>
                          <option value="cardiology">Cardiology Department</option>
                          <option value="laboratory">Laboratory Department</option>
                          <option value="pharmacy">Pharmacy Department</option>
                          <option value="reception">Reception / Desk Staff</option>
                          <option value="room-allotment">Room Allotment Department</option>
                          <option value="billing">Billing Department</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1.5">
                          Severity Level
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { value: 'info', label: 'Info', color: 'border-blue-500/30 text-blue-400 bg-blue-500/5' },
                            { value: 'success', label: 'Success', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' },
                            { value: 'warning', label: 'Warning', color: 'border-amber-500/30 text-amber-400 bg-amber-500/5' },
                            { value: 'danger', label: 'Danger', color: 'border-red-500/30 text-red-400 bg-red-500/5' }
                          ].map(t => (
                            <button
                              key={t.value}
                              type="button"
                              onClick={() => setTestNotifType(t.value)}
                              className={`py-1.5 px-1 text-[11px] font-bold rounded border text-center transition-all ${
                                testNotifType === t.value 
                                  ? 'border-emerald-500 bg-emerald-500/20 text-white scale-105 shadow-sm font-bold'
                                  : t.color + ' opacity-75 hover:opacity-100'
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1.5">
                          Notification Title
                        </label>
                        <input
                          type="text"
                          required
                          value={testNotifTitle}
                          onChange={(e) => setTestNotifTitle(e.target.value)}
                          placeholder="e.g., Critical Stock Alert"
                          className="w-full text-xs bg-dark-tertiary border border-dark-tertiary/60 rounded px-2.5 py-2 outline-none text-gray-300 transition-colors focus:border-emerald-500/50"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1.5">
                          Message Body
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={testNotifMsg}
                          onChange={(e) => setTestNotifMsg(e.target.value)}
                          placeholder="State the core notification summary details here..."
                          className="w-full text-xs bg-dark-tertiary border border-dark-tertiary/60 rounded px-2.5 py-2 outline-none text-gray-300 transition-colors focus:border-emerald-500/50"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={dispatchingNotif}
                        className="w-full py-2.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 border border-emerald-500/20 hover:shadow-emerald-500/20"
                      >
                        {dispatchingNotif ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin animate-faster"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <TrendingUp size={13} />
                            Dispatch Notification
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Right: Live Notification Log */}
                  <div className="lg:col-span-2 bg-dark-secondary border border-dark-tertiary p-5 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-dark-tertiary pb-3">
                      <div>
                        <h3 className="text-md font-bold text-white">Live Dispatched Log</h3>
                        <p className="text-xs text-gray-400 mt-1">
                          Monitor notifications dispatched in the system database.
                        </p>
                      </div>
                      <button 
                        onClick={fetchLiveNotifications}
                        className="text-xs bg-dark-tertiary border border-dark-tertiary/60 hover:bg-dark-tertiary text-gray-300 rounded px-3 py-1.5 transition-colors font-semibold"
                      >
                        Refresh Log
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                      {liveNotifications.length === 0 ? (
                        <div className="text-center py-12 text-xs text-gray-500 italic border border-dashed border-dark-tertiary/40 rounded-lg">
                          No notifications found in the database. Create one to test!
                        </div>
                      ) : (
                        liveNotifications.map((notif: any) => (
                          <div 
                            key={notif.id} 
                            className={`flex items-start gap-4 p-3.5 rounded-lg border transition-colors ${
                              notif.type === 'danger' || notif.type === 'error' ? 'bg-red-500/5 border-red-500/10' :
                              notif.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/10' :
                              notif.type === 'warning' ? 'bg-amber-500/5 border-amber-500/10' :
                              'bg-blue-500/5 border-blue-500/10'
                            }`}
                          >
                            <div className="flex-1">
                              <div className="flex justify-between items-center gap-2">
                                <p className={`font-bold text-xs ${
                                  notif.type === 'danger' || notif.type === 'error' ? 'text-red-400' :
                                  notif.type === 'success' ? 'text-emerald-400' :
                                  notif.type === 'warning' ? 'text-amber-400' :
                                  'text-blue-400'
                                }`}>
                                  {notif.title}
                                </p>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[9px] bg-dark-tertiary border border-dark-tertiary/80 text-gray-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider font-mono">
                                    {notif.department || "GLOBAL"}
                                  </span>
                                  {notif.isRead ? (
                                    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 px-1.5 py-0.5 rounded font-semibold">
                                      Read
                                    </span>
                                  ) : (
                                    <span className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/15 px-1.5 py-0.5 rounded font-semibold animate-pulse">
                                      Unread
                                    </span>
                                  )}
                                </div>
                              </div>
                              <p className="text-[11px] text-gray-300 mt-1.5 leading-relaxed">{notif.message}</p>
                              <div className="flex items-center gap-2 mt-2.5 text-[9px] text-gray-500 font-semibold">
                                <span>Sender: {notif.senderName || 'System'}</span>
                                <span>•</span>
                                <span>{new Date(notif.createdAt).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
