import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { fetchPatient, clearCurrentPatient, clearError } from '../../slices/patientsSlice';

const PatientDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentPatient, isLoading, error } = useSelector((state) => state.patients);

  useEffect(() => {
    if (id) {
      dispatch(fetchPatient(id));
    }
    return () => {
      dispatch(clearCurrentPatient());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center">
          <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-2">Loading patient details...</span>
        </div>
      </div>
    );
  }

  if (!currentPatient) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Patient not found</h2>
        <p className="mt-2 text-gray-600">The patient you're looking for doesn't exist.</p>
        <Link to="/patients" className="mt-4 inline-block btn-primary">
          Back to Patients
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '-';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/patients" className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentPatient.first_name} {currentPatient.last_name}
            </h1>
            <p className="text-sm text-gray-500">Patient ID: {currentPatient.patient_id}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            Edit Patient
          </button>
          <button className="btn-primary">
            Schedule Appointment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-gray-900">{currentPatient.first_name} {currentPatient.last_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Patient ID</label>
                <p className="text-gray-900 font-mono">{currentPatient.patient_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{currentPatient.email || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{currentPatient.phone || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="text-gray-900">{formatDate(currentPatient.date_of_birth)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Age</label>
                <p className="text-gray-900">{calculateAge(currentPatient.date_of_birth)} years</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Gender</label>
                <p className="text-gray-900">
                  {currentPatient.gender ? currentPatient.gender.charAt(0).toUpperCase() + currentPatient.gender.slice(1) : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Blood Type</label>
                <p className="text-gray-900">{currentPatient.blood_type || '-'}</p>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
            <div>
              <label className="text-sm font-medium text-gray-500">Address</label>
              <p className="text-gray-900">{currentPatient.address || '-'}</p>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Contact Name</label>
                <p className="text-gray-900">{currentPatient.emergency_contact_name || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Contact Phone</label>
                <p className="text-gray-900">{currentPatient.emergency_contact_phone || '-'}</p>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Allergies</label>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {currentPatient.allergies || 'No known allergies'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Medical History</label>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {currentPatient.medical_history || 'No significant medical history'}
                </p>
              </div>
            </div>
          </div>

          {/* Insurance Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Insurance Provider</label>
                <p className="text-gray-900">{currentPatient.insurance_provider || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Insurance Number</label>
                <p className="text-gray-900">{currentPatient.insurance_number || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full btn-primary">
                Schedule Appointment
              </button>
              <button className="w-full btn-secondary">
                Add Medical Record
              </button>
              <button className="w-full btn-secondary">
                View Lab Results
              </button>
              <button className="w-full btn-secondary">
                Generate Report
              </button>
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Appointments</h3>
            {currentPatient.appointments && currentPatient.appointments.length > 0 ? (
              <div className="space-y-3">
                {currentPatient.appointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          Dr. {appointment.doctor_first_name} {appointment.doctor_last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(appointment.appointment_date)} at {appointment.appointment_time}
                        </p>
                      </div>
                      <span className={`status-badge ${
                        appointment.status === 'completed' ? 'status-completed' :
                        appointment.status === 'scheduled' ? 'status-scheduled' :
                        appointment.status === 'cancelled' ? 'status-cancelled' :
                        'status-confirmed'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
                <Link to="/appointments" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All Appointments
                </Link>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No recent appointments</p>
            )}
          </div>

          {/* Medical Records */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Medical Records</h3>
            {currentPatient.medicalRecords && currentPatient.medicalRecords.length > 0 ? (
              <div className="space-y-3">
                {currentPatient.medicalRecords.slice(0, 3).map((record) => (
                  <div key={record.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          Dr. {record.doctor_first_name} {record.doctor_last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(record.created_at)}
                        </p>
                        {record.diagnosis && (
                          <p className="text-sm text-gray-700 mt-1">
                            {record.diagnosis.length > 50 
                              ? `${record.diagnosis.substring(0, 50)}...` 
                              : record.diagnosis
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <Link to="/medical-records" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All Records
                </Link>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No medical records</p>
            )}
          </div>

          {/* Patient Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Appointments</span>
                <span className="font-medium">{currentPatient.appointments?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Medical Records</span>
                <span className="font-medium">{currentPatient.medicalRecords?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Last Visit</span>
                <span className="font-medium">
                  {currentPatient.appointments?.length > 0 
                    ? formatDate(currentPatient.appointments[0].appointment_date)
                    : '-'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;