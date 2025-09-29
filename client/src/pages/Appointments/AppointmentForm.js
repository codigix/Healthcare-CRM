import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createAppointment, updateAppointment, fetchAppointment } from '../../slices/appointmentsSlice';
import { fetchPatients } from '../../slices/patientsSlice';
import { fetchDoctors } from '../../slices/doctorsSlice';
import { fetchDepartments } from '../../slices/departmentsSlice';

const AppointmentForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { currentAppointment, loading, error } = useSelector(state => state.appointments);
  const { patients } = useSelector(state => state.patients);
  const { doctors } = useSelector(state => state.doctors);
  const { departments } = useSelector(state => state.departments);

  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    department_id: '',
    appointment_date: '',
    appointment_time: '',
    duration_minutes: 30,
    status: 'scheduled',
    type: 'consultation',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchAppointment(id));
    }
    dispatch(fetchPatients());
    dispatch(fetchDoctors());
    dispatch(fetchDepartments());
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentAppointment) {
      setFormData({
        patient_id: currentAppointment.patient_id || '',
        doctor_id: currentAppointment.doctor_id || '',
        department_id: currentAppointment.department_id || '',
        appointment_date: currentAppointment.appointment_date || '',
        appointment_time: currentAppointment.appointment_time || '',
        duration_minutes: currentAppointment.duration_minutes || 30,
        status: currentAppointment.status || 'scheduled',
        type: currentAppointment.type || 'consultation',
        notes: currentAppointment.notes || ''
      });
    }
  }, [currentAppointment, isEdit]);

  // Generate available time slots
  useEffect(() => {
    if (formData.doctor_id && formData.appointment_date) {
      generateTimeSlots();
    }
  }, [formData.doctor_id, formData.appointment_date]);

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    const slotDuration = 30;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += slotDuration) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    setAvailableSlots(slots);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patient_id) {
      newErrors.patient_id = 'Patient is required';
    }

    if (!formData.doctor_id) {
      newErrors.doctor_id = 'Doctor is required';
    }

    if (!formData.appointment_date) {
      newErrors.appointment_date = 'Appointment date is required';
    } else {
      const appointmentDate = new Date(formData.appointment_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (appointmentDate < today) {
        newErrors.appointment_date = 'Appointment date cannot be in the past';
      }
    }

    if (!formData.appointment_time) {
      newErrors.appointment_time = 'Appointment time is required';
    }

    if (!formData.duration_minutes || formData.duration_minutes < 15) {
      newErrors.duration_minutes = 'Duration must be at least 15 minutes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isEdit) {
        await dispatch(updateAppointment({ id, data: formData })).unwrap();
      } else {
        await dispatch(createAppointment(formData)).unwrap();
      }
      navigate('/appointments');
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Appointment' : 'Schedule New Appointment'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'Update appointment details' : 'Book a new appointment'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Patient and Doctor Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient *
              </label>
              <select
                name="patient_id"
                value={formData.patient_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.patient_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name} ({patient.patient_id})
                  </option>
                ))}
              </select>
              {errors.patient_id && (
                <p className="text-red-500 text-sm mt-1">{errors.patient_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doctor *
              </label>
              <select
                name="doctor_id"
                value={formData.doctor_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.doctor_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.user?.first_name} {doctor.user?.last_name} - {doctor.specialization}
                  </option>
                ))}
              </select>
              {errors.doctor_id && (
                <p className="text-red-500 text-sm mt-1">{errors.doctor_id}</p>
              )}
            </div>
          </div>

          {/* Department Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Date *
              </label>
              <input
                type="date"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.appointment_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.appointment_date && (
                <p className="text-red-500 text-sm mt-1">{errors.appointment_date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Time *
              </label>
              <select
                name="appointment_time"
                value={formData.appointment_time}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.appointment_time ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Time</option>
                {availableSlots.map(slot => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {errors.appointment_time && (
                <p className="text-red-500 text-sm mt-1">{errors.appointment_time}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (Minutes) *
              </label>
              <select
                name="duration_minutes"
                value={formData.duration_minutes}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.duration_minutes ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
                <option value="120">120 minutes</option>
              </select>
              {errors.duration_minutes && (
                <p className="text-red-500 text-sm mt-1">{errors.duration_minutes}</p>
              )}
            </div>
          </div>

          {/* Status and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No Show</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="consultation">Consultation</option>
                <option value="follow_up">Follow-up</option>
                <option value="emergency">Emergency</option>
                <option value="surgery">Surgery</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter any additional notes or special requirements"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/appointments')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Appointment' : 'Schedule Appointment')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
