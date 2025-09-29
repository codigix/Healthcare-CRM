import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { fetchDoctor, clearCurrentDoctor, clearError } from '../../slices/doctorsSlice';

const DoctorDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentDoctor, isLoading, error } = useSelector((state) => state.doctors);

  useEffect(() => {
    if (id) {
      dispatch(fetchDoctor(id));
    }
    return () => {
      dispatch(clearCurrentDoctor());
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
          <span className="ml-2">Loading doctor details...</span>
        </div>
      </div>
    );
  }

  if (!currentDoctor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Doctor not found</h2>
        <p className="mt-2 text-gray-600">The doctor you're looking for doesn't exist.</p>
        <Link to="/doctors" className="mt-4 inline-block btn-primary">
          Back to Doctors
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getAvailabilitySchedule = () => {
    if (!currentDoctor.availability_schedule) return null;
    
    try {
      return typeof currentDoctor.availability_schedule === 'string' 
        ? JSON.parse(currentDoctor.availability_schedule)
        : currentDoctor.availability_schedule;
    } catch (error) {
      return null;
    }
  };

  const schedule = getAvailabilitySchedule();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/doctors" className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-xl">
                {currentDoctor.first_name?.charAt(0)}{currentDoctor.last_name?.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dr. {currentDoctor.first_name} {currentDoctor.last_name}
              </h1>
              <p className="text-sm text-gray-500">{currentDoctor.specialization}</p>
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            Edit Profile
          </button>
          <button className="btn-primary">
            Schedule Appointment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doctor Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-gray-900">
                  Dr. {currentDoctor.first_name} {currentDoctor.last_name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Specialization</label>
                <p className="text-gray-900">{currentDoctor.specialization}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">License Number</label>
                <p className="text-gray-900 font-mono">{currentDoctor.license_number}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Experience</label>
                <p className="text-gray-900">{currentDoctor.experience_years} years</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Department</label>
                <p className="text-gray-900">{currentDoctor.department_name || 'Not assigned'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Consultation Fee</label>
                <p className="text-gray-900">${currentDoctor.consultation_fee}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{currentDoctor.email || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{currentDoctor.phone || '-'}</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          {currentDoctor.bio && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Biography</h3>
              <p className="text-gray-700 leading-relaxed">{currentDoctor.bio}</p>
            </div>
          )}

          {/* Availability Schedule */}
          {schedule && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(schedule).map(([day, times]) => (
                  <div key={day} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 capitalize mb-2">
                      {day}
                    </h4>
                    {times.start && times.end ? (
                      <p className="text-sm text-gray-600">
                        {formatTime(times.start)} - {formatTime(times.end)}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">Not available</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Appointments */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
            {currentDoctor.upcomingAppointments && currentDoctor.upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {currentDoctor.upcomingAppointments.slice(0, 5).map((appointment) => (
                  <div key={appointment.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {appointment.patient_first_name} {appointment.patient_last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(appointment.appointment_date)} at {formatTime(appointment.appointment_time)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Patient ID: {appointment.patient_id}
                        </p>
                      </div>
                      <span className={`status-badge ${
                        appointment.status === 'scheduled' ? 'status-scheduled' :
                        appointment.status === 'confirmed' ? 'status-confirmed' :
                        'status-cancelled'
                      }`}>
                        {appointment.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
                <Link to="/appointments" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All Appointments
                </Link>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No upcoming appointments</p>
            )}
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
                View Calendar
              </button>
              <button className="w-full btn-secondary">
                Update Schedule
              </button>
              <button className="w-full btn-secondary">
                Generate Report
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Appointments</span>
                <span className="font-medium">{currentDoctor.upcomingAppointments?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Experience</span>
                <span className="font-medium">{currentDoctor.experience_years} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Consultation Fee</span>
                <span className="font-medium">${currentDoctor.consultation_fee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Department</span>
                <span className="font-medium text-xs">
                  {currentDoctor.department_name || 'Unassigned'}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900">{currentDoctor.email || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-sm text-gray-900">{currentDoctor.phone || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Department</label>
                <p className="text-sm text-gray-900">{currentDoctor.department_name || 'Not assigned'}</p>
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">License Number</label>
                <p className="text-sm text-gray-900 font-mono">{currentDoctor.license_number}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Specialization</label>
                <p className="text-sm text-gray-900">{currentDoctor.specialization}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Years of Experience</label>
                <p className="text-sm text-gray-900">{currentDoctor.experience_years} years</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;