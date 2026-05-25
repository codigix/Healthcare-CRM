"use client";

import { useState, useEffect, useRef } from "react";
import { appointmentAPI } from "@/lib/api";
import { Search } from "lucide-react";

interface Appointment {
  id?: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
  doctor?: { id: string; name: string };
  patient?: { id: string; name: string };
}

interface Doctor {
  id: string;
  name: string;
}

interface Patient {
  id: string;
  name: string;
}

interface AppointmentFormProps {
  appointment?: Appointment | null;
  doctors: Doctor[];
  patients: Patient[];
  onSuccess: () => void;
}

export default function AppointmentForm({
  appointment,
  doctors,
  patients,
  onSuccess,
}: AppointmentFormProps) {
  const [formData, setFormData] = useState<Appointment>({
    doctorId: "",
    patientId: "",
    date: "",
    time: "",
    status: "pending",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchPatient, setSearchPatient] = useState("");
  const [searchDoctor, setSearchDoctor] = useState("");

  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const patientDropdownRef = useRef<HTMLDivElement>(null);
  const doctorDropdownRef = useRef<HTMLDivElement>(null);

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
    if (appointment) {
      setFormData({
        ...appointment,
        doctorId: appointment.doctor?.id || "",
        patientId: appointment.patient?.id || "",
        date: appointment.date.split("T")[0],
      });
      setSearchPatient(appointment.patient?.name || "");
      setSearchDoctor(appointment.doctor?.name || "");
    } else {
      setFormData({
        doctorId: "",
        patientId: "",
        date: "",
        time: "",
        status: "pending",
        notes: "",
      });
      setSearchPatient("");
      setSearchDoctor("");
    }
  }, [appointment]);

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
      if (appointment?.id) {
        await appointmentAPI.update(appointment.id, formData);
      } else {
        await appointmentAPI.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save appointment");
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative" ref={patientDropdownRef}>
        <label className="block text-mdfont-medium text-gray-300 mb-2">
          Patient
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
          <div className="absolute z-50 w-full left-0 mt-1 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-lg max-h-48 overflow-y-auto">
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
                  className={`px-4 py-2.5 hover:bg-dark-tertiary cursor-pointer border-b border-dark-tertiary last:border-0 transition-colors flex items-center justify-between text-sm ${
                    formData.patientId === patient.id ? "bg-emerald-500/10 text-emerald-400" : ""
                  }`}
                >
                  <div>
                    <div className="font-medium text-white">{patient.name}</div>
                  </div>
                  {formData.patientId === patient.id && (
                    <div className="text-emerald-500 font-bold text-xs">Selected</div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-3 text-xs text-gray-400 text-center">
                No patients found
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative" ref={doctorDropdownRef}>
        <label className="block text-mdfont-medium text-gray-300 mb-2">
          Doctor
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
          <div className="absolute z-50 w-full left-0 mt-1 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-lg max-h-48 overflow-y-auto">
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
                  className={`px-4 py-2.5 hover:bg-dark-tertiary cursor-pointer border-b border-dark-tertiary last:border-0 transition-colors flex items-center justify-between text-sm ${
                    formData.doctorId === doctor.id ? "bg-emerald-500/10 text-emerald-400" : ""
                  }`}
                >
                  <div>
                    <div className="font-medium text-white">Dr. {doctor.name}</div>
                  </div>
                  {formData.doctorId === doctor.id && (
                    <div className="text-emerald-500 font-bold text-xs">Selected</div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-3 text-xs text-gray-400 text-center">
                No doctors found
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <label className="block text-mdfont-medium text-gray-300 mb-2">
          Date
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="input-field w-full"
          required
        />
      </div>

      <div>
        <label className="block text-mdfont-medium text-gray-300 mb-2">
          Time
        </label>
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="input-field w-full"
          required
        />
      </div>

      <div>
        <label className="block text-mdfont-medium text-gray-300 mb-2">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="input-field w-full"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div>
        <label className="block text-mdfont-medium text-gray-300 mb-2">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="input-field w-full"
          placeholder="Add appointment notes..."
          rows={3}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <button type="submit" disabled={loading || !formData.patientId || !formData.doctorId} className="btn-primary w-full">
        {loading ? "Saving..." : "Save Appointment"}
      </button>
    </form>
  );
}
