"use client";

import { useState, useEffect, useRef } from "react";

import { appointmentAPI, doctorAPI, patientAPI } from "@/lib/api";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  UserCheck,
  FileText,
  CheckCircle,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Doctor {
  id: string;
  name: string;
  specialization?: string;
}

interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export default function AddAppointmentPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchPatient, setSearchPatient] = useState("");
  const [searchDoctor, setSearchDoctor] = useState("");

  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const patientDropdownRef = useRef<HTMLDivElement>(null);
  const doctorDropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    appointmentType: "",
    date: "",
    time: "",
    duration: "30",
    status: "scheduled",
    reason: "",
    notes: "",
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        patientDropdownRef.current &&
        !patientDropdownRef.current.contains(event.target as Node)
      ) {
        setShowPatientDropdown(false);
      }
      if (
        doctorDropdownRef.current &&
        !doctorDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDoctorDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [doctorsRes, patientsRes] = await Promise.all([
        doctorAPI.list(1, 100),
        patientAPI.list(1, 100),
      ]);
      setDoctors(doctorsRes.data.doctors);
      setPatients(patientsRes.data.patients);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await appointmentAPI.create({
        doctorId: formData.doctorId,
        patientId: formData.patientId,
        date: formData.date,
        time: formData.time,
        status: formData.status,
        notes:
          formData.notes +
          (formData.reason ? `\nReason: ${formData.reason}` : ""),
      });
      const appointmentId = response.data.appointment?.id || response.data.id;
      router.push(`/appointments/success?id=${appointmentId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create appointment");
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchPatient.toLowerCase())
  );

  const filteredDoctors = doctors.filter((d) =>
    d.name.toLowerCase().includes(searchDoctor.toLowerCase())
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/appointments/all">
            <button className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors">
              <ArrowLeft size={24} />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-2">Add Appointment</h1>
            <p className="text-gray-400">
              Schedule a new appointment for a patient.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="card p-6 md:p-8 space-y-8">
            {/* Section 1: Patient & Doctor Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Select Patient */}
              <div className="relative" ref={patientDropdownRef}>
                <label className="block text-md font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <User size={18} className="text-emerald-500" />
                  Select Patient
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchPatient}
                    onChange={(e) => {
                      setSearchPatient(e.target.value);
                      setShowPatientDropdown(true);
                      if (formData.patientId) {
                        setFormData((prev) => ({
                          ...prev,
                          patientId: "",
                        }));
                      }
                    }}
                    onFocus={() => setShowPatientDropdown(true)}
                    className="input-field w-full !pl-10"
                    required
                  />
                </div>

                {showPatientDropdown && (
                  <div className="absolute z-20 w-full left-0 mt-1 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((patient) => (
                        <div
                          key={patient.id}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              patientId: patient.id,
                            }));
                            setSearchPatient(patient.name);
                            setShowPatientDropdown(false);
                          }}
                          className={`px-4 py-3 hover:bg-dark-tertiary cursor-pointer border-b border-dark-tertiary last:border-0 transition-colors flex items-center justify-between ${
                            formData.patientId === patient.id ? "bg-emerald-500/10 text-emerald-400" : ""
                          }`}
                        >
                          <div>
                            <div className="font-medium">{patient.name}</div>
                            {patient.email && (
                              <div className="text-xs text-gray-400 mt-1">
                                {patient.email}
                              </div>
                            )}
                          </div>
                          {formData.patientId === patient.id && (
                            <div className="text-emerald-500 font-bold text-sm">Selected</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-sm text-gray-400 text-center">
                        No patients found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Select Doctor */}
              <div className="relative" ref={doctorDropdownRef}>
                <label className="block text-md font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <UserCheck size={18} className="text-emerald-500" />
                  Select Doctor
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search doctors..."
                    value={searchDoctor}
                    onChange={(e) => {
                      setSearchDoctor(e.target.value);
                      setShowDoctorDropdown(true);
                      if (formData.doctorId) {
                        setFormData((prev) => ({
                          ...prev,
                          doctorId: "",
                        }));
                      }
                    }}
                    onFocus={() => setShowDoctorDropdown(true)}
                    className="input-field w-full !pl-10"
                    required
                  />
                </div>

                {showDoctorDropdown && (
                  <div className="absolute z-20 w-full left-0 mt-1 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredDoctors.length > 0 ? (
                      filteredDoctors.map((doctor) => (
                        <div
                          key={doctor.id}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              doctorId: doctor.id,
                            }));
                            setSearchDoctor(doctor.name);
                            setShowDoctorDropdown(false);
                          }}
                          className={`px-4 py-3 hover:bg-dark-tertiary cursor-pointer border-b border-dark-tertiary last:border-0 transition-colors flex items-center justify-between ${
                            formData.doctorId === doctor.id ? "bg-emerald-500/10 text-emerald-400" : ""
                          }`}
                        >
                          <div>
                            <div className="font-medium">Dr. {doctor.name}</div>
                            {doctor.specialization && (
                              <div className="text-xs text-gray-400 mt-1">
                                {doctor.specialization}
                              </div>
                            )}
                          </div>
                          {formData.doctorId === doctor.id && (
                            <div className="text-emerald-500 font-bold text-sm">Selected</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-sm text-gray-400 text-center">
                        No doctors found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <hr className="border-dark-tertiary" />

            {/* Section 2: Appointment Details & Status */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-emerald-400">
                <FileText size={20} />
                Appointment Information
              </h3>

              {/* Row 1: Appointment Type & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-md font-medium text-gray-300 mb-2">
                    Appointment Type
                  </label>
                  <select
                    name="appointmentType"
                    value={formData.appointmentType}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                  >
                    <option value="">Select appointment type</option>
                    <option value="Check-up">Check-up</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Dental Cleaning">Dental Cleaning</option>
                    <option value="X-Ray">X-Ray</option>
                    <option value="Therapy Session">Therapy Session</option>
                    <option value="Vaccination">Vaccination</option>
                    <option value="Annual Physical">Annual Physical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-md font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input-field w-full"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">
                      Tentative (Pending Confirmation)
                    </option>
                    <option value="pending">Add to Waitlist</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Date, Time & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-md font-medium text-gray-300 mb-2">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="input-field w-full !pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-md font-medium text-gray-300 mb-2">
                    Time
                  </label>
                  <div className="relative">
                    <Clock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="input-field w-full !pl-10"
                      required
                    >
                      <option value="">Select time slot</option>
                      <option value="08:00">08:00 AM</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">01:00 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="17:00">05:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-md font-medium text-gray-300 mb-2">
                    Duration
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="input-field w-full"
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Reason & Staff Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-md font-medium text-gray-300 mb-2">
                    Reason for Visit
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter the reason for the appointment"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-md font-medium text-gray-300 mb-2">
                    Notes for Staff
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter any additional notes for staff"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <hr className="border-dark-tertiary" />

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
              <Link href="/appointments/all" className="w-full sm:w-auto">
                <button type="button" className="btn-secondary w-full">
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={loading || !formData.patientId || !formData.doctorId}
                className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                {loading ? "Creating..." : "Create Appointment"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
