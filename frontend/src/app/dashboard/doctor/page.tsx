"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import Link from "next/link";

import { appointmentAPI, dashboardAPI, bloodBankAPI, patientAPI } from "@/lib/api";
import {
  Calendar,
  FileText,
  Users,
  ClipboardList,
  Clock,
  ArrowUpRight,
  Loader,
  TrendingUp,
  User,
  CheckCircle,
  AlertCircle,
  Check,
  Loader2,
} from "lucide-react";

interface DoctorStats {
  appointments: number;
  urgentAppointments: number;
  pendingReports: number;
  readyReports: number;
  activePatients: number;
  newPatients: number;
  pendingTasks: number;
  highPriorityTasks: number;
}

interface Appointment {
  id: string;
  patientName: string;
  patientAvatar?: string;
  time: string;
  duration: string;
  type: string;
  status: string;
  prescriptionStatus?: string;
}

interface UpcomingAppointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  status: string;
}

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  appointmentCount: number;
  lastAppointment: string;
}

interface Task {
  id: string;
  patientName: string;
  description: string;
  date: string;
  time: string;
  priority: "high" | "medium" | "low";
  status: string;
}

interface DashboardStats {
  totalDoctors?: number;
  totalPatients?: number;
  totalAppointments?: number;
  pendingAppointments?: number;
  totalRevenue?: number;
}

export default function DoctorDashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("schedule");
  const [loading, setLoading] = useState(true);
  const [doctorStats, setDoctorStats] = useState<DoctorStats>({
    appointments: 0,
    urgentAppointments: 0,
    pendingReports: 0,
    readyReports: 0,
    activePatients: 0,
    newPatients: 0,
    pendingTasks: 0,
    highPriorityTasks: 0,
  });
  const [todaySchedule, setTodaySchedule] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    UpcomingAppointment[]
  >([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [allPatients, setAllPatients] = useState<any[]>([]);
  const [bloodFormData, setBloodFormData] = useState({
    patient: "",
    bloodType: "",
    numberOfUnits: "1",
    department: "Surgery",
    purpose: "Surgery",
    emergencyRequest: false,
    additionalNotes: ""
  });
  const [submittingBloodRequest, setSubmittingBloodRequest] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayRes = await appointmentAPI.list(1, 100, {
          startDate: today.toISOString(),
          endDate: tomorrow.toISOString(),
          doctorId: user?.doctorId
        });

        const nextWeekRes = await appointmentAPI.list(1, 100, {
          startDate: tomorrow.toISOString(),
          doctorId: user?.doctorId
        });

        const pendingRes = await appointmentAPI.list(1, 100, {
          status: "pending",
          doctorId: user?.doctorId
        });

        const allAppointmentsRes = await appointmentAPI.list(1, 1000, {
          doctorId: user?.doctorId
        });

        const todayAppts = todayRes.data.appointments || [];
        const upcomingAppts = nextWeekRes.data.appointments || [];
        const pendingAppts = pendingRes.data.appointments || [];
        const allAppts = allAppointmentsRes.data.appointments || [];

        const todayMapped: Appointment[] = todayAppts.map((apt: any) => ({
          id: apt.id,
          patientName: apt.patient?.name || "Unknown Patient",
          time: apt.time || "00:00",
          duration: "30 min",
          type: "Check-up",
          status: apt.status || "confirmed",
          prescriptionStatus: apt.prescriptionStatus,
        }));

        const upcomingMapped: UpcomingAppointment[] = upcomingAppts.map(
          (apt: any) => ({
            id: apt.id,
            patientName: apt.patient?.name || "Unknown Patient",
            date: new Date(apt.date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            }),
            time: apt.time || "00:00",
            type: "Check-up",
            status: apt.status || "confirmed",
          })
        );

        const patientMap = new Map<string, Patient>();
        allAppts.forEach((apt: any) => {
          if (apt.patient?.id && !patientMap.has(apt.patient.id)) {
            patientMap.set(apt.patient.id, {
              id: apt.patient.id,
              name: apt.patient.name || "Unknown Patient",
              email: apt.patient.email || "N/A",
              phone: apt.patient.phone || "N/A",
              appointmentCount: 0,
              lastAppointment: "",
            });
          } else if (apt.patient?.id && patientMap.has(apt.patient.id)) {
            const existingPatient = patientMap.get(apt.patient.id)!;
            if (!existingPatient.email || existingPatient.email === "N/A") {
              existingPatient.email = apt.patient.email || "N/A";
            }
            if (!existingPatient.phone || existingPatient.phone === "N/A") {
              existingPatient.phone = apt.patient.phone || "N/A";
            }
          }
        });

        allAppts.forEach((apt: any) => {
          if (apt.patient?.id && patientMap.has(apt.patient.id)) {
            const patient = patientMap.get(apt.patient.id)!;
            patient.appointmentCount++;
            const aptDate = new Date(apt.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            if (!patient.lastAppointment) {
              patient.lastAppointment = aptDate;
            }
          }
        });

        const tasksMapped: Task[] = pendingAppts.map((apt: any) => ({
          id: apt.id,
          patientName: apt.patient?.name || "Unknown Patient",
          description: `Appointment with ${
            apt.patient?.name || "Unknown Patient"
          }`,
          date: new Date(apt.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          time: apt.time || "00:00",
          priority: "high",
          status: apt.status || "pending",
        }));

        const dashboardStats = await dashboardAPI.stats();

        setTodaySchedule(todayMapped);
        setUpcomingAppointments(upcomingMapped);
        setPatients(Array.from(patientMap.values()));
        setTasks(tasksMapped);
        setStats(dashboardStats.data);

        setDoctorStats({
          appointments: todayAppts.length,
          urgentAppointments: todayAppts.filter(
            (a: any) => a.status === "urgent"
          ).length,
          pendingReports: 0,
          readyReports: 0,
          activePatients: patientMap.size,
          newPatients: 0,
          pendingTasks: pendingAppts.length,
          highPriorityTasks: pendingAppts.length,
        });
      } catch (err) {
        console.error("Failed to fetch data", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchPatientsList = async () => {
      try {
        const res = await patientAPI.list(1, 200);
        setAllPatients(res.data.patients || []);
      } catch (e) {
        console.error("Failed to load patients for blood issuance dropdown", e);
      }
    };
    fetchPatientsList();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "urgent":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "check-up":
        return "bg-emerald-500/10 text-emerald-500";
      case "follow-up":
        return "bg-blue-500/10 text-blue-500";
      case "consultation":
        return "bg-purple-500/10 text-purple-500";
      case "new patient":
        return "bg-yellow-500/10 text-yellow-500";
      default:
        return "bg-gray-500/10 text-gray-400";
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
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Doctor</h1>
          <p className="text-gray-400 mt-1">
            Here's what's happening with your patients today.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-2">
              <Loader className="animate-spin" size={24} />
              <p className="text-gray-400">Loading appointments...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
            {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card card-hover border-l-4 border-l-blue-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Calendar className="text-blue-500" size={20} />
                      </div>
                      <div>
                        <p className="text-mdtext-gray-400">Appointments</p>
                        <p className="text-xs text-red-400">
                          {doctorStats.urgentAppointments} urgent
                        </p>
                      </div>
                    </div>
                    <p className="text-3xl font-bold mb-2">
                      {doctorStats.appointments}
                    </p>
                    <p className="text-mdtext-gray-400">
                      Today's consultations
                    </p>
                    <button className="mt-3 text-blue-500 text-mdflex items-center gap-1 hover:gap-2 transition-all">
                      View Schedule <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="card card-hover border-l-4 border-l-emerald-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <FileText className="text-emerald-500" size={20} />
                      </div>
                      <div>
                        <p className="text-mdtext-gray-400">Pending Reports</p>
                        <p className="text-xs text-emerald-400">
                          {doctorStats.readyReports} ready
                        </p>
                      </div>
                    </div>
                    <p className="text-3xl font-bold mb-2">
                      {doctorStats.pendingReports}
                    </p>
                    <p className="text-mdtext-gray-400">
                      Lab results awaiting review
                    </p>
                    <button className="mt-3 text-emerald-500 text-mdflex items-center gap-1 hover:gap-2 transition-all">
                      Review Reports <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="card card-hover border-l-4 border-l-yellow-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-yellow-500/10 rounded-lg">
                        <Users className="text-yellow-500" size={20} />
                      </div>
                      <div>
                        <p className="text-mdtext-gray-400">Active Patients</p>
                        <p className="text-xs text-yellow-400">
                          {doctorStats.newPatients} new
                        </p>
                      </div>
                    </div>
                    <p className="text-3xl font-bold mb-2">
                      {doctorStats.activePatients}
                    </p>
                    <p className="text-mdtext-gray-400">
                      Total patient count this week
                    </p>
                    <button className="mt-3 text-yellow-500 text-mdflex items-center gap-1 hover:gap-2 transition-all">
                      Patient Records <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="card card-hover border-l-4 border-l-purple-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <ClipboardList className="text-purple-500" size={20} />
                      </div>
                      <div>
                        <p className="text-mdtext-gray-400">Pending Tasks</p>
                        <p className="text-xs text-red-400">
                          {doctorStats.highPriorityTasks} high priority
                        </p>
                      </div>
                    </div>
                    <p className="text-3xl font-bold mb-2">
                      {doctorStats.pendingTasks}
                    </p>
                    <p className="text-mdtext-gray-400">
                      Tasks requiring attention
                    </p>
                    <button className="mt-3 text-purple-500 text-mdflex items-center gap-1 hover:gap-2 transition-all">
                      View Tasks <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex gap-4 border-b border-dark-tertiary mb-6 overflow-x-auto">
                {["schedule", "patients", "tasks", "stats", "issue blood"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-mdfont-medium capitalize transition-colors relative whitespace-nowrap ${
                      activeTab === tab
                        ? "text-white"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    {tab === "issue blood" ? "Issue Blood" : tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
                    )}
                  </button>
                ))}
              </div>

              {activeTab === "schedule" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Today's Schedule
                    </h3>
                    <p className="text-gray-400 text-mdmb-6">
                      You have {doctorStats.appointments} appointments scheduled
                      for today
                    </p>
                    <div className="space-y-3">
                      {todaySchedule.map((apt) => (
                        <div
                          key={apt.id}
                          className="flex items-center justify-between p-4 bg-dark-secondary rounded-lg hover:bg-dark-tertiary transition-colors border border-dark-tertiary"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-mdfont-semibold">
                              {apt.patientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <p className="font-semibold">{apt.patientName}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <p className="text-mdtext-gray-400 flex items-center gap-1">
                                  <Clock size={14} />
                                  {formatTime(apt.time)} • {apt.duration}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                                apt.type
                              )}`}
                            >
                              {apt.type}
                            </span>
                            {apt.status?.toLowerCase() === "completed" ? (
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                                  ✓ Completed
                                </span>
                                {apt.prescriptionStatus !== null && apt.prescriptionStatus !== undefined && (
                                  apt.prescriptionStatus === "Completed" ? (
                                    <span className="text-xs font-bold text-[#1abc9c] bg-[#1abc9c]/10 border border-[#1abc9c]/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5" title="Pharmacy has dispensed all medications and cleared bills.">
                                      <Check size={13} className="text-[#1abc9c]" />
                                      Rx: Dispensed
                                    </span>
                                  ) : (
                                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5 animate-pulse" title="Awaiting medication dispense and stock allocation at pharmacy.">
                                      <Loader2 size={13} className="animate-spin text-amber-500" />
                                      Rx: Dispense Pending
                                    </span>
                                  )
                                )}
                              </div>
                            ) : (
                              <Link href={`/appointments/consultation/${apt.id}`}>
                                <button className="px-4 py-2 bg-dark-tertiary hover:bg-emerald-500 text-white rounded-lg text-mdtransition-colors active:scale-95">
                                  Start Consultation
                                </button>
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Upcoming Appointments
                    </h3>
                    <p className="text-gray-400 text-mdmb-6">
                      Your upcoming appointments for the week
                    </p>
                    <div className="space-y-3">
                      {upcomingAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          className="p-4 bg-dark-secondary rounded-lg hover:bg-dark-tertiary transition-colors border border-dark-tertiary"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold">{apt.patientName}</p>
                              <p className="text-mdtext-gray-400 mt-1">
                                {apt.date} at {formatTime(apt.time)}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                apt.status
                              )}`}
                            >
                              {apt.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                                apt.type
                              )}`}
                            >
                              {apt.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "patients" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Active Patients ({patients.length})
                  </h3>
                  {patients.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Users className="mx-auto mb-4" size={48} />
                      <p>No active patients</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-dark-tertiary">
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">
                              Name
                            </th>
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">
                              Email
                            </th>
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">
                              Phone
                            </th>
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">
                              Appointments
                            </th>
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">
                              Last Visit
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {patients.map((patient) => (
                            <tr
                              key={patient.id}
                              className="border-b border-dark-tertiary hover:bg-dark-secondary transition-colors"
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-mdfont-semibold">
                                    {patient.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </div>
                                  <span className="font-medium">
                                    {patient.name}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-gray-400">
                                {patient.email}
                              </td>
                              <td className="py-3 px-4 text-gray-400">
                                {patient.phone}
                              </td>
                              <td className="py-3 px-4">
                                <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm">
                                  {patient.appointmentCount}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-gray-400">
                                {patient.lastAppointment || "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "tasks" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Pending Tasks ({tasks.length})
                  </h3>
                  {tasks.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <ClipboardList className="mx-auto mb-4" size={48} />
                      <p>No pending tasks</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-start justify-between p-4 bg-dark-secondary rounded-lg hover:bg-dark-tertiary transition-colors border border-dark-tertiary"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 bg-red-500/10 rounded-lg mt-1">
                              <AlertCircle className="text-red-500" size={18} />
                            </div>
                            <div>
                              <p className="font-semibold">
                                {task.patientName}
                              </p>
                              <p className="text-mdtext-gray-400 mt-1">
                                {task.description}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  {task.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock size={14} />
                                  {formatTime(task.time)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2">
                            High Priority
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "issue blood" && (
                <div className="space-y-6 max-w-3xl">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      Issue Blood & Request Transfusion
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Submit a request to issue blood units for a patient. Once submitted, this request will be immediately logged and visible to the Inventory Department.
                    </p>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!bloodFormData.patient || !bloodFormData.bloodType || !bloodFormData.numberOfUnits) {
                        alert("Please fill in all required fields.");
                        return;
                      }

                      try {
                        setSubmittingBloodRequest(true);
                        const selectedPatient = allPatients.find(p => p.id === bloodFormData.patient);
                        const submitData = {
                          bloodType: bloodFormData.bloodType,
                          units: parseInt(bloodFormData.numberOfUnits),
                          recipient: selectedPatient ? selectedPatient.name : "Unknown Recipient",
                          recipientId: bloodFormData.patient,
                          requestingDoctor: `Dr. ${user?.name || "Doctor"}`,
                          purpose: bloodFormData.purpose || "Medical",
                          department: bloodFormData.department || "General",
                        };

                        const response = await bloodBankAPI.createIssue(submitData);
                        if (response.data && response.data.success) {
                          alert("Blood issue request submitted successfully!");
                          setBloodFormData({
                            patient: "",
                            bloodType: "",
                            numberOfUnits: "1",
                            department: "Surgery",
                            purpose: "Surgery",
                            emergencyRequest: false,
                            additionalNotes: ""
                          });
                          setActiveTab("schedule");
                        } else {
                          alert("Error submitting request: " + (response.data.error || "Failed to issue blood"));
                        }
                      } catch (error) {
                        console.error("Error submitting blood issue request:", error);
                        alert("Error submitting blood issue request");
                      } finally {
                        setSubmittingBloodRequest(false);
                      }
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                          Recipient Patient <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={bloodFormData.patient}
                          onChange={(e) => setBloodFormData(prev => ({ ...prev, patient: e.target.value }))}
                          className="input-field w-full"
                          required
                        >
                          <option value="">Select recipient patient</option>
                          {allPatients.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.id})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                          Blood Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={bloodFormData.bloodType}
                          onChange={(e) => setBloodFormData(prev => ({ ...prev, bloodType: e.target.value }))}
                          className="input-field w-full"
                          required
                        >
                          <option value="">Select blood type</option>
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                          Number of Units <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={bloodFormData.numberOfUnits}
                          onChange={(e) => setBloodFormData(prev => ({ ...prev, numberOfUnits: e.target.value }))}
                          placeholder="Enter number of units"
                          min="1"
                          className="input-field w-full"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                          Requesting Doctor
                        </label>
                        <input
                          type="text"
                          value={`Dr. ${user?.name || "Doctor"}`}
                          disabled
                          className="input-field w-full opacity-60 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                          Department
                        </label>
                        <select
                          value={bloodFormData.department}
                          onChange={(e) => setBloodFormData(prev => ({ ...prev, department: e.target.value }))}
                          className="input-field w-full"
                        >
                          <option value="Emergency">Emergency</option>
                          <option value="Surgery">Surgery</option>
                          <option value="Cardiology">Cardiology</option>
                          <option value="Internal Medicine">Internal Medicine</option>
                          <option value="Obstetrics">Obstetrics</option>
                          <option value="Oncology">Oncology</option>
                          <option value="Nephrology">Nephrology</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                          Purpose of Transfusion
                        </label>
                        <select
                          value={bloodFormData.purpose}
                          onChange={(e) => setBloodFormData(prev => ({ ...prev, purpose: e.target.value }))}
                          className="input-field w-full"
                        >
                          <option value="Surgery">Surgery</option>
                          <option value="Trauma">Trauma</option>
                          <option value="Anemia">Anemia Treatment</option>
                          <option value="Cancer">Cancer Treatment</option>
                          <option value="Childbirth">Childbirth</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 py-2">
                      <input
                        type="checkbox"
                        id="emergencyRequest"
                        checked={bloodFormData.emergencyRequest}
                        onChange={(e) => setBloodFormData(prev => ({ ...prev, emergencyRequest: e.target.checked }))}
                        className="w-4 h-4 text-emerald-500 bg-dark-tertiary border-gray-600 rounded focus:ring-emerald-500 cursor-pointer"
                      />
                      <label htmlFor="emergencyRequest" className="text-sm font-medium text-red-400 cursor-pointer select-none">
                        Mark as High-Priority Emergency Request
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Clinical Notes / Special Instructions
                      </label>
                      <textarea
                        value={bloodFormData.additionalNotes}
                        onChange={(e) => setBloodFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                        placeholder="Provide any relevant diagnosis details or instructions"
                        rows={3}
                        className="input-field w-full resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submittingBloodRequest}
                        className="btn-primary flex items-center justify-center gap-2 px-6 py-2.5"
                      >
                        {submittingBloodRequest ? "Submitting Request..." : "Submit Blood Issue Request"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "stats" && (
                <div>
                  <h3 className="text-lg font-semibold mb-6">
                    Dashboard Statistics
                  </h3>
                  {stats ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-4 bg-dark-secondary rounded-lg border border-dark-tertiary">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-gray-400 text-mdmb-1">
                              Total Doctors
                            </p>
                            <p className="text-3xl font-bold">
                              {stats.totalDoctors || 0}
                            </p>
                          </div>
                          <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Users className="text-blue-500" size={24} />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-dark-secondary rounded-lg border border-dark-tertiary">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-gray-400 text-mdmb-1">
                              Total Patients
                            </p>
                            <p className="text-3xl font-bold">
                              {stats.totalPatients || 0}
                            </p>
                          </div>
                          <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <User className="text-emerald-500" size={24} />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-dark-secondary rounded-lg border border-dark-tertiary">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-gray-400 text-mdmb-1">
                              Total Appointments
                            </p>
                            <p className="text-3xl font-bold">
                              {stats.totalAppointments || 0}
                            </p>
                          </div>
                          <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Calendar className="text-purple-500" size={24} />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-dark-secondary rounded-lg border border-dark-tertiary">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-gray-400 text-mdmb-1">
                              Pending Appointments
                            </p>
                            <p className="text-3xl font-bold">
                              {stats.pendingAppointments || 0}
                            </p>
                          </div>
                          <div className="p-2 bg-yellow-500/10 rounded-lg">
                            <AlertCircle
                              className="text-yellow-500"
                              size={24}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-dark-secondary rounded-lg border border-dark-tertiary lg:col-span-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-gray-400 text-mdmb-1">
                              Total Revenue
                            </p>
                            <p className="text-3xl font-bold">
                              ₹
                              {typeof stats.totalRevenue === "number"
                                ? stats.totalRevenue.toFixed(2)
                                : "0.00"}
                            </p>
                          </div>
                          <div className="p-2 bg-green-500/10 rounded-lg">
                            <TrendingUp className="text-green-500" size={24} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <Loader className="mx-auto mb-4 animate-spin" size={48} />
                      <p>Loading statistics...</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
