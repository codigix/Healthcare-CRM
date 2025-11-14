'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { appointmentAPI, doctorAPI, patientAPI } from '@/lib/api';
import { ArrowLeft, Calendar, Clock, User, UserCheck, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  const [error, setError] = useState('');
  const [searchPatient, setSearchPatient] = useState('');
  const [searchDoctor, setSearchDoctor] = useState('');

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentType: '',
    date: '',
    time: '',
    duration: '30',
    status: 'scheduled',
    reason: '',
    notes: '',
  });

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
      console.error('Failed to fetch data', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await appointmentAPI.create({
        doctorId: formData.doctorId,
        patientId: formData.patientId,
        date: formData.date,
        time: formData.time,
        status: formData.status,
        notes: formData.notes + (formData.reason ? `\nReason: ${formData.reason}` : ''),
      });
      router.push('/appointments/all');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchPatient.toLowerCase())
  );

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(searchDoctor.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/appointments/all">
            <button className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors">
              <ArrowLeft size={24} />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-2">Add Appointment</h1>
            <p className="text-gray-400">Schedule a new appointment for a patient.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FileText size={20} className="text-emerald-500" />
                Appointment Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="input-field w-full pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="input-field w-full pl-10"
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration (minutes)
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

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
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
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <User size={20} className="text-emerald-500" />
                Select Patient
              </h2>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchPatient}
                    onChange={(e) => setSearchPatient(e.target.value)}
                    className="input-field w-full"
                  />
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredPatients.map((patient) => (
                    <label
                      key={patient.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.patientId === patient.id
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-dark-tertiary hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="patientId"
                        value={patient.id}
                        checked={formData.patientId === patient.id}
                        onChange={handleChange}
                        className="w-4 h-4 text-emerald-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{patient.name}</div>
                        {patient.email && (
                          <div className="text-sm text-gray-400">{patient.email}</div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                <Link href="/patients/add">
                  <button type="button" className="btn-secondary w-full">
                    Register New Patient
                  </button>
                </Link>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <UserCheck size={20} className="text-emerald-500" />
                Select Doctor
              </h2>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Search doctors..."
                    value={searchDoctor}
                    onChange={(e) => setSearchDoctor(e.target.value)}
                    className="input-field w-full"
                  />
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredDoctors.map((doctor) => (
                    <label
                      key={doctor.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.doctorId === doctor.id
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-dark-tertiary hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="doctorId"
                        value={doctor.id}
                        checked={formData.doctorId === doctor.id}
                        onChange={handleChange}
                        className="w-4 h-4 text-emerald-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium">Dr. {doctor.name}</div>
                        {doctor.specialization && (
                          <div className="text-sm text-gray-400">{doctor.specialization}</div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Appointment Status</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input-field w-full"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Tentative (Pending Confirmation)</option>
                    <option value="pending">Add to Waitlist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notes for Staff
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter any additional notes for staff"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !formData.patientId || !formData.doctorId}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              {loading ? 'Creating...' : 'Create Appointment'}
            </button>

            <Link href="/appointments/all">
              <button type="button" className="btn-secondary w-full">
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
