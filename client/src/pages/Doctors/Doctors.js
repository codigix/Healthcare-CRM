import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

import { fetchDoctors, createDoctor, updateDoctor, clearError } from '../../slices/doctorsSlice';
import { fetchDepartments } from '../../slices/departmentsSlice';

const Doctors = () => {
  const dispatch = useDispatch();
  const { doctors, isLoading, error } = useSelector((state) => state.doctors);
  const { departments } = useSelector((state) => state.departments);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  useEffect(() => {
    dispatch(fetchDoctors());
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data) => {
    try {
      if (selectedDoctor) {
        await dispatch(updateDoctor({ 
          id: selectedDoctor.id, 
          doctorData: data 
        })).unwrap();
        toast.success('Doctor profile updated successfully!');
        setShowEditModal(false);
      } else {
        await dispatch(createDoctor(data)).unwrap();
        toast.success('Doctor profile created successfully!');
        setShowAddModal(false);
      }
      reset();
      setSelectedDoctor(null);
      dispatch(fetchDoctors());
    } catch (error) {
      toast.error(error || 'Failed to save doctor profile');
    }
  };

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setValue('userId', doctor.user_id);
    setValue('departmentId', doctor.department_id);
    setValue('specialization', doctor.specialization);
    setValue('licenseNumber', doctor.license_number);
    setValue('experienceYears', doctor.experience_years);
    setValue('consultationFee', doctor.consultation_fee);
    setValue('bio', doctor.bio);
    setShowEditModal(true);
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = !searchQuery || 
      `${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialization = !specializationFilter || 
      doctor.specialization === specializationFilter;
    
    return matchesSearch && matchesSpecialization;
  });

  const specializations = [...new Set(doctors.map(doctor => doctor.specialization).filter(Boolean))];

  const getAvailabilityStatus = (schedule) => {
    if (!schedule) return { status: 'unknown', text: 'Unknown' };
    
    try {
      const scheduleData = typeof schedule === 'string' ? JSON.parse(schedule) : schedule;
      const now = new Date();
      const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const todaySchedule = scheduleData[dayNames[currentDay]];
      
      if (!todaySchedule || !todaySchedule.start || !todaySchedule.end) {
        return { status: 'offline', text: 'Offline' };
      }
      
      const startTime = parseInt(todaySchedule.start.split(':')[0]) * 60 + parseInt(todaySchedule.start.split(':')[1]);
      const endTime = parseInt(todaySchedule.end.split(':')[0]) * 60 + parseInt(todaySchedule.end.split(':')[1]);
      
      if (currentTime >= startTime && currentTime <= endTime) {
        return { status: 'online', text: 'Available' };
      } else {
        return { status: 'offline', text: 'Offline' };
      }
    } catch (error) {
      return { status: 'unknown', text: 'Unknown' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage doctor profiles and specializations
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 btn-primary"
        >
          Add New Doctor
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <select
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="input-field"
            >
              <option value="">All Specializations</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            <button className="btn-secondary">
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="flex items-center">
              <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-2">Loading doctors...</span>
            </div>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <span className="text-4xl mb-4 block">👨‍⚕️</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-500 mb-4">Add your first doctor to get started.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              Add Doctor
            </button>
          </div>
        ) : (
          filteredDoctors.map((doctor) => {
            const availability = getAvailabilityStatus(doctor.availability_schedule);
            return (
              <div key={doctor.id} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-lg">
                        {doctor.first_name?.charAt(0)}{doctor.last_name?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Dr. {doctor.first_name} {doctor.last_name}
                      </h3>
                      <p className="text-sm text-gray-500">{doctor.specialization}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(doctor)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Department</span>
                    <span className="text-sm font-medium text-gray-900">
                      {doctor.department_name || 'Not assigned'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Experience</span>
                    <span className="text-sm font-medium text-gray-900">
                      {doctor.experience_years} years
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Consultation Fee</span>
                    <span className="text-sm font-medium text-gray-900">
                      ${doctor.consultation_fee}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      availability.status === 'online' 
                        ? 'bg-green-100 text-green-800' 
                        : availability.status === 'offline'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {availability.text}
                    </span>
                  </div>
                </div>

                {doctor.bio && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {doctor.bio}
                    </p>
                  </div>
                )}

                <div className="flex space-x-2 pt-3 border-t border-gray-200">
                  <Link
                    to={`/doctors/${doctor.id}`}
                    className="flex-1 btn-secondary text-center text-sm"
                  >
                    View Profile
                  </Link>
                  <button className="flex-1 btn-primary text-sm">
                    Schedule
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Doctor Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedDoctor ? 'Edit Doctor Profile' : 'Add New Doctor'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedDoctor(null);
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
                    <label className="label">User Account</label>
                    <select
                      {...register('userId', { required: 'User account is required' })}
                      className="input-field"
                      disabled={!!selectedDoctor}
                    >
                      <option value="">Select User Account</option>
                      {/* This would be populated with users who have role 'doctor' */}
                    </select>
                    {errors.userId && (
                      <p className="mt-1 text-sm text-red-600">{errors.userId.message}</p>
                    )}
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Specialization *</label>
                    <input
                      {...register('specialization', { required: 'Specialization is required' })}
                      type="text"
                      className="input-field"
                      placeholder="Cardiology, Neurology, etc."
                    />
                    {errors.specialization && (
                      <p className="mt-1 text-sm text-red-600">{errors.specialization.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="label">License Number *</label>
                    <input
                      {...register('licenseNumber', { required: 'License number is required' })}
                      type="text"
                      className="input-field"
                      placeholder="MD123456"
                    />
                    {errors.licenseNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.licenseNumber.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Experience (Years) *</label>
                    <input
                      {...register('experienceYears', { 
                        required: 'Experience is required',
                        min: { value: 0, message: 'Experience must be 0 or more' }
                      })}
                      type="number"
                      min="0"
                      className="input-field"
                      placeholder="5"
                    />
                    {errors.experienceYears && (
                      <p className="mt-1 text-sm text-red-600">{errors.experienceYears.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="label">Consultation Fee ($) *</label>
                    <input
                      {...register('consultationFee', { 
                        required: 'Consultation fee is required',
                        min: { value: 0, message: 'Fee must be 0 or more' }
                      })}
                      type="number"
                      min="0"
                      step="0.01"
                      className="input-field"
                      placeholder="150.00"
                    />
                    {errors.consultationFee && (
                      <p className="mt-1 text-sm text-red-600">{errors.consultationFee.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label">Bio</label>
                  <textarea
                    {...register('bio')}
                    rows={4}
                    className="input-field"
                    placeholder="Brief professional biography..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      setSelectedDoctor(null);
                      reset();
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {selectedDoctor ? 'Update Doctor' : 'Add Doctor'}
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

export default Doctors;