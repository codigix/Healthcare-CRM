import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

import { fetchDepartments, createDepartment, updateDepartment, deleteDepartment, clearError } from '../../slices/departmentsSlice';
import { fetchDoctors } from '../../slices/doctorsSlice';

const Departments = () => {
  const dispatch = useDispatch();
  const { departments, isLoading, error } = useSelector((state) => state.departments);
  const { doctors } = useSelector((state) => state.doctors);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data) => {
    try {
      if (selectedDepartment) {
        await dispatch(updateDepartment({ 
          id: selectedDepartment.id, 
          departmentData: data 
        })).unwrap();
        toast.success('Department updated successfully!');
        setShowEditModal(false);
      } else {
        await dispatch(createDepartment(data)).unwrap();
        toast.success('Department created successfully!');
        setShowAddModal(false);
      }
      reset();
      setSelectedDepartment(null);
      dispatch(fetchDepartments());
    } catch (error) {
      toast.error(error || 'Failed to save department');
    }
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setValue('name', department.name);
    setValue('description', department.description);
    setValue('headDoctorId', department.head_doctor_id);
    setValue('location', department.location);
    setValue('phone', department.phone);
    setValue('email', department.email);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await dispatch(deleteDepartment(id)).unwrap();
        toast.success('Department deleted successfully!');
        dispatch(fetchDepartments());
      } catch (error) {
        toast.error(error || 'Failed to delete department');
      }
    }
  };

  const filteredDepartments = departments.filter(dept =>
    !searchQuery || 
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDepartmentStats = (department) => {
    const departmentDoctors = doctors.filter(doctor => doctor.department_id === department.id);
    return {
      doctorCount: departmentDoctors.length,
      totalAppointments: department.total_appointments || 0,
      completedAppointments: department.completed_appointments || 0,
      upcomingAppointments: department.upcoming_appointments || 0
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage hospital departments and specialties
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 btn-primary"
        >
          Add Department
        </button>
      </div>

      {/* Search */}
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
                placeholder="Search departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="btn-secondary">
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="flex items-center">
              <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-2">Loading departments...</span>
            </div>
          </div>
        ) : filteredDepartments.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <span className="text-4xl mb-4 block">🏥</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
            <p className="text-gray-500 mb-4">Add your first department to get started.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              Add Department
            </button>
          </div>
        ) : (
          filteredDepartments.map((department) => {
            const stats = getDepartmentStats(department);
            return (
              <div key={department.id} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {department.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {department.description || 'No description provided'}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(department)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(department.id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Location</span>
                    <span className="text-sm font-medium text-gray-900">
                      {department.location || 'Not specified'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Head Doctor</span>
                    <span className="text-sm font-medium text-gray-900">
                      {department.head_doctor_first_name && department.head_doctor_last_name
                        ? `Dr. ${department.head_doctor_first_name} ${department.head_doctor_last_name}`
                        : 'Not assigned'
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Doctors</span>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.doctorCount} doctors
                    </span>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {stats.totalAppointments}
                    </div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {stats.completedAppointments}
                    </div>
                    <div className="text-xs text-gray-500">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-orange-600">
                      {stats.upcomingAppointments}
                    </div>
                    <div className="text-xs text-gray-500">Upcoming</div>
                  </div>
                </div>

                <div className="flex space-x-2 pt-3 border-t border-gray-200">
                  <Link
                    to={`/departments/${department.id}`}
                    className="flex-1 btn-secondary text-center text-sm"
                  >
                    View Details
                  </Link>
                  <button className="flex-1 btn-primary text-sm">
                    Manage Staff
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Department Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedDepartment ? 'Edit Department' : 'Add New Department'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedDepartment(null);
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
                <div>
                  <label className="label">Department Name *</label>
                  <input
                    {...register('name', { required: 'Department name is required' })}
                    type="text"
                    className="input-field"
                    placeholder="Cardiology, Neurology, etc."
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="input-field"
                    placeholder="Brief description of the department..."
                  />
                </div>

                <div>
                  <label className="label">Head Doctor</label>
                  <select {...register('headDoctorId')} className="input-field">
                    <option value="">Select Head Doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Location</label>
                    <input
                      {...register('location')}
                      type="text"
                      className="input-field"
                      placeholder="Floor 2, Wing A"
                    />
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="input-field"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Email</label>
                  <input
                    {...register('email', {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="input-field"
                    placeholder="cardiology@hospital.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      setSelectedDepartment(null);
                      reset();
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {selectedDepartment ? 'Update Department' : 'Add Department'}
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

export default Departments;