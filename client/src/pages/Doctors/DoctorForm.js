import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createDoctor, updateDoctor, fetchDoctor } from '../../slices/doctorsSlice';
import { fetchDepartments } from '../../slices/departmentsSlice';

const DoctorForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { currentDoctor, loading, error } = useSelector(state => state.doctors);
  const { departments } = useSelector(state => state.departments);

  const [formData, setFormData] = useState({
    user_id: '',
    department_id: '',
    specialization: '',
    license_number: '',
    experience_years: '',
    consultation_fee: '',
    bio: '',
    availability_schedule: {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: '09:00', end: '13:00', available: false },
      sunday: { start: '09:00', end: '13:00', available: false }
    }
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchDoctor(id));
    }
    dispatch(fetchDepartments());
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentDoctor) {
      setFormData({
        user_id: currentDoctor.user_id || '',
        department_id: currentDoctor.department_id || '',
        specialization: currentDoctor.specialization || '',
        license_number: currentDoctor.license_number || '',
        experience_years: currentDoctor.experience_years || '',
        consultation_fee: currentDoctor.consultation_fee || '',
        bio: currentDoctor.bio || '',
        availability_schedule: currentDoctor.availability_schedule || formData.availability_schedule
      });
    }
  }, [currentDoctor, isEdit]);

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

  const handleScheduleChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      availability_schedule: {
        ...prev.availability_schedule,
        [day]: {
          ...prev.availability_schedule[day],
          [field]: value
        }
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.user_id) {
      newErrors.user_id = 'User is required';
    }

    if (!formData.department_id) {
      newErrors.department_id = 'Department is required';
    }

    if (!formData.specialization.trim()) {
      newErrors.specialization = 'Specialization is required';
    }

    if (!formData.license_number.trim()) {
      newErrors.license_number = 'License number is required';
    }

    if (!formData.experience_years || formData.experience_years < 0) {
      newErrors.experience_years = 'Experience years must be a positive number';
    }

    if (!formData.consultation_fee || formData.consultation_fee < 0) {
      newErrors.consultation_fee = 'Consultation fee must be a positive number';
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
        await dispatch(updateDoctor({ id, data: formData })).unwrap();
      } else {
        await dispatch(createDoctor(formData)).unwrap();
      }
      navigate('/doctors');
    } catch (error) {
      console.error('Error saving doctor:', error);
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
            {isEdit ? 'Edit Doctor Profile' : 'Add New Doctor'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'Update doctor information' : 'Enter doctor details to create a new profile'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User *
              </label>
              <select
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.user_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select User</option>
                {/* This would be populated with users who have doctor role */}
              </select>
              {errors.user_id && (
                <p className="text-red-500 text-sm mt-1">{errors.user_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.department_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {errors.department_id && (
                <p className="text-red-500 text-sm mt-1">{errors.department_id}</p>
              )}
            </div>
          </div>

          {/* Professional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization *
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.specialization ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Cardiology, Neurology"
              />
              {errors.specialization && (
                <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number *
              </label>
              <input
                type="text"
                name="license_number"
                value={formData.license_number}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.license_number ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter license number"
              />
              {errors.license_number && (
                <p className="text-red-500 text-sm mt-1">{errors.license_number}</p>
              )}
            </div>
          </div>

          {/* Experience and Fees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience (Years) *
              </label>
              <input
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.experience_years ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Years of experience"
              />
              {errors.experience_years && (
                <p className="text-red-500 text-sm mt-1">{errors.experience_years}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consultation Fee ($) *
              </label>
              <input
                type="number"
                name="consultation_fee"
                value={formData.consultation_fee}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.consultation_fee ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Consultation fee"
              />
              {errors.consultation_fee && (
                <p className="text-red-500 text-sm mt-1">{errors.consultation_fee}</p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biography
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter doctor's biography and qualifications"
            />
          </div>

          {/* Availability Schedule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Availability Schedule
            </label>
            <div className="space-y-4">
              {Object.entries(formData.availability_schedule).map(([day, schedule]) => (
                <div key={day} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="w-24">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={schedule.available}
                        onChange={(e) => handleScheduleChange(day, 'available', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="capitalize font-medium">{day}</span>
                    </label>
                  </div>
                  
                  {schedule.available && (
                    <>
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">Start Time</label>
                        <input
                          type="time"
                          value={schedule.start}
                          onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">End Time</label>
                        <input
                          type="time"
                          value={schedule.end}
                          onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/doctors')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Doctor' : 'Create Doctor')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorForm;
