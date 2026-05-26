"use client";

import { useState, useEffect } from "react";
import { appointmentAPI, doctorAPI, patientAPI } from "@/lib/api";
import { Plus, Edit2, Trash2, Search, Filter, Calendar, Loader2, Check, Activity, Send } from "lucide-react";
import Modal from "@/components/UI/Modal";
import AppointmentForm from "@/components/Forms/AppointmentForm";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
  type?: string;
  duration?: string;
  doctorId: string;
  patientId: string;
  doctor?: { id: string; name: string };
  patient?: { id: string; name: string };
  tokenNumber?: string;
  department?: string;
  visitType?: string;
}

interface Doctor {
  id: string;
  name: string;
}

interface Patient {
  id: string;
  name: string;
}

export default function AppointmentsPage() {
  const { user } = useAuthStore();
  const isDoctor = user?.role === "doctor" || user?.department?.toLowerCase() === "doctor";

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleSendLabRequest = async (id: string) => {
    try {
      setActionLoading(`${id}-lab`);
      await appointmentAPI.sendLabRequest(id);
      await fetchData();
    } catch (error: any) {
      console.error("Failed to send lab request:", error);
      alert(error.response?.data?.error || "Failed to send laboratory request.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendAdmissionRequest = async (id: string) => {
    try {
      setActionLoading(`${id}-admission`);
      await appointmentAPI.sendAdmissionRequest(id);
      await fetchData();
    } catch (error: any) {
      console.error("Failed to send admission request:", error);
      alert(error.response?.data?.error || "Failed to send admission request.");
    } finally {
      setActionLoading(null);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const filters: any = { page, limit: 10 };
      if (statusFilter && statusFilter !== "all") filters.status = statusFilter;

      const [appointmentsRes, doctorsRes, patientsRes] = await Promise.all([
        appointmentAPI.list(page, 10, filters),
        doctorAPI.list(1, 100),
        patientAPI.list(1, 100),
      ]);

      setAppointments(appointmentsRes.data.appointments || []);
      setTotal(appointmentsRes.data.total || 0);
      setDoctors(doctorsRes.data.doctors || []);
      setPatients(patientsRes.data.patients || []);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, statusFilter, user, isDoctor]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      try {
        await appointmentAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error("Failed to delete appointment", error);
      }
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setEditingId(appointment.id);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingAppointment(null);
    setEditingId(null);
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "in progress":
        return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (isDoctor && user) {
      const aptDocId = apt.doctorId || apt.doctor?.id;
      const matchesDoctor = 
        (user.doctorId && aptDocId === user.doctorId) || 
        (apt.doctor?.name && user.name && (
          apt.doctor.name.toLowerCase().includes(user.name.toLowerCase()) || 
          user.name.toLowerCase().includes(apt.doctor.name.toLowerCase())
        ));
      if (!matchesDoctor) return false;
    }

    const matchesSearch =
      (apt.patient?.name && apt.patient.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (apt.doctor?.name && apt.doctor.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (apt.tokenNumber && apt.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (apt.department && apt.department.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus =
      statusFilter === "all" || apt.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">Appointments</h1>
            <p className="text-gray-400">Schedule and manage hospital appointments</p>
          </div>
          <div className="flex gap-3">
            <Link href="/appointments/calendar">
              <button className="btn-secondary flex items-center gap-2">
                <Calendar size={20} />
                Calendar View
              </button>
            </Link>
            {!isDoctor && (
              <button onClick={handleAdd} className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-emerald-500/10">
                <Plus size={20} />
                New Appointment
              </button>
            )}
          </div>
        </div>

        <div className="card bg-dark-secondary border border-dark-tertiary p-6 rounded-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 flex items-center gap-2 bg-dark-tertiary/45 border border-dark-tertiary/20 rounded-lg px-4">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent py-3 flex-1 outline-none text-white text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="input-field py-2 bg-dark-tertiary/30"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {loading && appointments.length === 0 ? (
            <div className="text-center py-8 text-gray-400">Loading appointments...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-tertiary">
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                      Token Number
                    </th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                      Patient Name
                    </th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                      Department
                    </th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                      Doctor
                    </th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                      Date & Time
                    </th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                      Visit Type
                    </th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                      Appointment Status
                    </th>
                    <th className="text-right py-4 px-4 text-gray-400 font-medium text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-gray-500 text-sm">
                        No appointments found.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((apt) => (
                      <tr
                        key={apt.id}
                        className="border-b border-dark-tertiary hover:bg-dark-tertiary/20 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <span className="bg-dark-tertiary text-gray-300 border border-dark-tertiary/80 px-2.5 py-1 rounded font-mono text-xs font-bold uppercase shadow-sm">
                            {apt.tokenNumber || "GEN-000"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-semibold text-sm">
                              {apt.patient?.name?.charAt(0) || "?"}
                            </div>
                            <Link
                              href={`/patients/${apt.patientId}`}
                              className="font-semibold hover:text-emerald-400 transition-colors text-white text-sm"
                            >
                              {apt.patient?.name || "Unknown"}
                            </Link>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded text-xs font-semibold">
                            {apt.department || "General"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-300 font-medium text-sm">
                          Dr. {apt.doctor?.name || "Unassigned"}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col text-sm">
                            <span className="text-white font-semibold">
                              {new Date(apt.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5">
                              {apt.time}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-300 text-xs font-medium bg-dark-tertiary/45 border border-dark-tertiary/60 px-2 py-0.5 rounded">
                            {apt.visitType || apt.type || "Check-up"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              apt.status
                            )}`}
                          >
                            {apt.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2.5">
                            {isDoctor && apt.status?.toLowerCase() !== "completed" ? (
                              <Link href={`/appointments/consultation/${apt.id}`}>
                                <button
                                  className="px-3.5 py-1.5 text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg transition-all shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 flex items-center gap-2 border border-emerald-500/20 active:scale-95"
                                  title="Start Consultation"
                                >
                                  <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                  </span>
                                  Start Consultation
                                </button>
                              </Link>
                            ) : apt.status?.toLowerCase() === "completed" ? (
                              (() => {
                                let parsedNotes: any = null;
                                if (apt.notes) {
                                  try {
                                    parsedNotes = JSON.parse(apt.notes);
                                  } catch (e) {}
                                }

                                const hasLabAction = parsedNotes?.labTestsActive === true;
                                const hasAdmissionAction = parsedNotes?.admissionRecommended === true;

                                if (hasLabAction || hasAdmissionAction) {
                                  return (
                                    <div className="flex flex-wrap items-center justify-end gap-2">
                                      {hasLabAction && (
                                        parsedNotes.labRequestSent ? (
                                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                                            <Check size={13} className="text-emerald-400" />
                                            Test Request Sent
                                          </span>
                                        ) : isDoctor ? (
                                          <button
                                            onClick={() => handleSendLabRequest(apt.id)}
                                            disabled={actionLoading === `${apt.id}-lab`}
                                            className="px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/25 flex items-center gap-1.5 border border-blue-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                          >
                                            {actionLoading === `${apt.id}-lab` ? (
                                              <Loader2 size={13} className="animate-spin" />
                                            ) : (
                                              <Activity size={13} />
                                            )}
                                            Send Test Request
                                          </button>
                                        ) : (
                                          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                                            <Loader2 size={13} className="animate-pulse" />
                                            Lab Request Pending
                                          </span>
                                        )
                                      )}

                                      {hasAdmissionAction && (
                                        parsedNotes.admissionRequestSent ? (
                                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                                            <Check size={13} className="text-emerald-400" />
                                            Admission Request Sent
                                          </span>
                                        ) : isDoctor ? (
                                          <button
                                            onClick={() => handleSendAdmissionRequest(apt.id)}
                                            disabled={actionLoading === `${apt.id}-admission`}
                                            className="px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg transition-all shadow-md shadow-purple-500/10 hover:shadow-purple-500/25 flex items-center gap-1.5 border border-purple-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                          >
                                            {actionLoading === `${apt.id}-admission` ? (
                                              <Loader2 size={13} className="animate-spin" />
                                            ) : (
                                              <Send size={13} />
                                            )}
                                            Send Admission Request
                                          </button>
                                        ) : (
                                          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                                            <Loader2 size={13} className="animate-pulse" />
                                            Admission Pending
                                          </span>
                                        )
                                      )}
                                    </div>
                                  );
                                }

                                return (
                                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                                    ✓ Consultation Completed
                                  </span>
                                );
                              })()
                            ) : null}
                            {!isDoctor && (
                              <>
                                <button
                                  onClick={() => handleEdit(apt)}
                                  className="p-1.5 bg-dark-tertiary/30 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 rounded transition-all"
                                  title="Edit"
                                >
                                  <Edit2 size={15} />
                                </button>
                                <button
                                  onClick={() => handleDelete(apt.id)}
                                  className="p-1.5 bg-dark-tertiary/30 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded transition-all"
                                  title="Delete"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-dark-tertiary">
            <p className="text-gray-400 text-sm">
              Showing {filteredAppointments.length > 0 ? (page - 1) * 10 + 1 : 0} to{" "}
              {Math.min(page * 10, isDoctor ? filteredAppointments.length : total)} of {isDoctor ? filteredAppointments.length : total} appointments
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-dark-tertiary rounded-lg hover:bg-dark-tertiary/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Previous
              </button>
              <button
                disabled={page * 10 >= total}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-dark-tertiary rounded-lg hover:bg-dark-tertiary/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? "Edit Appointment" : "New Appointment"}
      >
        <AppointmentForm
          appointment={editingAppointment}
          doctors={doctors}
          patients={patients}
          onSuccess={() => {
            setShowModal(false);
            fetchData();
          }}
        />
      </Modal>
    </>
  );
}
