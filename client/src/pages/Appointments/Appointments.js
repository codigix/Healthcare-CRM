import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

import { fetchAppointments, createAppointment, updateAppointment, deleteAppointment, clearError } from '../../slices/appointmentsSlice';
import { fetchPatients } from '../../slices/patientsSlice';
import { fetchDoctors } from '../../slices/doctorsSlice';
import { fetchDepartments } from '../../slices/departmentsSlice';

const Appointments = () => {
  const dispatch = useDispatch();
  const { appointments, pagination, isLoading, error } = useSelector((state) => state.appointments);
  const { patients } = useSelector((state) => state.patients);
  const { doctors } = useSelector((state) => state.doctors);
  const { departments } = useSelector((state) => state.departments);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm();
  const selectedDoctor = watch('doctorId');

  useEffect(() => {
    dispatch(fetchAppointments({ 
      page: currentPage, 
      status: statusFilter,
      date: dateFilter 
    }));
    dispatch(fetchPatients());
    dispatch(fetchDoctors());
    dispatch(fetchDepartments());
  }, [dispatch, currentPage, statusFilter, dateFilter]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data) => {
    try {
      if (selectedAppointment) {
        await dispatch(updateAppointment({ 
          id: selectedAppointment.id, 
          appointmentData: data 
        })).unwrap();
        toast.success('Appointment updated successfully!');
        setShowEditModal(false);
      } else {
        await dispatch(createAppointment(data)).unwrap();
        toast.success('Appointment created successfully!');
        setShowAddModal(false);
      }
      reset();
      setSelectedAppointment(null);
      dispatch(fetchAppointments({ 
        page: currentPage, 
        status: statusFilter,
        date: dateFilter 
      }));
    } catch (error) {
      toast.error(error || 'Failed to save appointment');
    }
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setValue('patientId', appointment.patient_id);
    setValue('doctorId', appointment.doctor_id);
    setValue('departmentId', appointment.department_id);
    setValue('appointmentDate', appointment.appointment_date);
    setValue('appointmentTime', appointment.appointment_time);
    setValue('durationMinutes', appointment.duration_minutes);
    setValue('type', appointment.type);
    setValue('notes', appointment.notes);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await dispatch(deleteAppointment(id)).unwrap();
        toast.success('Appointment deleted successfully!');
        dispatch(fetchAppointments({ 
          page: currentPage, 
          status: statusFilter,
          date: dateFilter 
        }));
      } catch (error) {
        toast.error(error || 'Failed to delete appointment');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await dispatch(updateAppointment({ 
        id, 
        appointmentData: { status: newStatus } 
      })).unwrap();
      toast.success('Appointment status updated!');
      dispatch(fetchAppointments({ 
        page: currentPage, 
        status: statusFilter,
        date: dateFilter 
      }));
    } catch (error) {
      toast.error(error || 'Failed to update appointment status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      scheduled: 'status-scheduled',
      confirmed: 'status-confirmed',
      in_progress: 'status-in-progress',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
      no_show: 'status-no-show',
    };
    return `status-badge ${statusClasses[status] || 'status-scheduled'}`;
  };

  const getStatusOptions = (currentStatus) => {
    const allStatuses = [
      { value: 'scheduled', label: 'Scheduled' },
      { value: 'confirmed', label: 'Confirmed' },
      { value: 'in_progress', label: 'In Progress' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' },
      { value: 'no_show', label: 'No Show' },
    ];
    
    return allStatuses.filter(status => status.value !== currentStatus);
  };

  const getAvailableTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage patient appointments and schedules
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 btn-primary"
        >
          Schedule Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div>
              <label className="label">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No Show</option>
              </select>
            </div>
            <div>
              <label className="label">Date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="btn-secondary">
              Export
            </button>
            <button className="btn-secondary">
              Calendar View
            </button>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Patient</th>
                <th className="table-header">Doctor</th>
                <th className="table-header">Department</th>
                <th className="table-header">Date & Time</th>
                <th className="table-header">Type</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="table-cell text-center py-8">
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="ml-2">Loading appointments...</span>
                    </div>
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="table-cell text-center py-8 text-gray-500">
                    No appointments found
                  </td>
                </tr>
              ) : (
                appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div>
                        <div className="font-medium text-gray-900">
                          {appointment.patient_first_name} {appointment.patient_last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {appointment.patient_id}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="font-medium text-gray-900">
                        Dr. {appointment.doctor_first_name} {appointment.doctor_last_name}
                      </div>
                    </td>
                    <td className="table-cell text-gray-500">
                      {appointment.department_name || '-'}
                    </td>
                    <td className="table-cell">
                      <div>
                        <div className="font-medium text-gray-900">
                          {formatDate(appointment.appointment_date)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatTime(appointment.appointment_time)}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell text-gray-500">
                      {appointment.type ? appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1) : '-'}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <span className={getStatusBadge(appointment.status)}>
                          {appointment.status.replace('_', ' ')}
                        </span>
                        <select
                          value={appointment.status}
                          onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value={appointment.status}>
                            {appointment.status.replace('_', ' ')}
                          </option>
                          {getStatusOptions(appointment.status).map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(appointment)}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(appointment.id)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                disabled={currentPage === pagination.pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">{(currentPage - 1) * pagination.limit + 1}</span>
                  {' '}to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * pagination.limit, pagination.total)}
                  </span>
                  {' '}of{' '}
                  <span className="font-medium">{pagination.total}</span>
                  {' '}results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {[...Array(pagination.pages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                    disabled={currentPage === pagination.pages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Appointment Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedAppointment(null);
                    reset();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Patient *</label>
                    <select
                      {...register('patientId', { required: 'Patient is required' })}
                      className="input-field"
                    >
                      <option value="">Select Patient</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.first_name} {patient.last_name} ({patient.patient_id})
                        </option>
                      ))}
                    </select>
                    {errors.patientId && (
                      <p className="mt-1 text-sm text-red-600">{errors.patientId.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="label">Doctor *</label>
                    <select
                      {...register('doctorId', { required: 'Doctor is required' })}
                      className="input-field"
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialization}
                        </option>
                      ))}
                    </select>
                    {errors.doctorId && (
                      <p className="mt-1 text-sm text-red-600">{errors.doctorId.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label">Department</label>
                  <select {...register('departmentId')} className="input-field">
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="label">Date *</label>
                    <input
                      {...register('appointmentDate', { required: 'Date is required' })}
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      className="input-field"
                    />
                    {errors.appointmentDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.appointmentDate.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="label">Time *</label>
                    <select
                      {...register('appointmentTime', { required: 'Time is required' })}
                      className="input-field"
                    >
                      <option value="">Select Time</option>
                      {getAvailableTimeSlots().map((time) => (
                        <option key={time} value={time}>
                          {formatTime(time)}
                        </option>
                      ))}
                    </select>
                    {errors.appointmentTime && (
                      <p className="mt-1 text-sm text-red-600">{errors.appointmentTime.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="label">Duration (minutes)</label>
                    <select {...register('durationMinutes')} className="input-field">
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="90">90 minutes</option>
                      <option value="120">120 minutes</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Appointment Type</label>
                  <select {...register('type')} className="input-field">
                    <option value="consultation">Consultation</option>
                    <option value="follow_up">Follow-up</option>
                    <option value="emergency">Emergency</option>
                    <option value="surgery">Surgery</option>
                  </select>
                </div>

                <div>
                  <label className="label">Notes</label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className="input-field"
                    placeholder="Additional notes or special requirements..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      setSelectedAppointment(null);
                      reset();
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {selectedAppointment ? 'Update Appointment' : 'Schedule Appointment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;