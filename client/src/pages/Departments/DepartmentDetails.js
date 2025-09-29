import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { fetchDepartment, clearCurrentDepartment, clearError } from '../../slices/departmentsSlice';

const DepartmentDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentDepartment, isLoading, error } = useSelector((state) => state.departments);

  useEffect(() => {
    if (id) {
      dispatch(fetchDepartment(id));
    }
    return () => {
      dispatch(clearCurrentDepartment());
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
          <span className="ml-2">Loading department details...</span>
        </div>
      </div>
    );
  }

  if (!currentDepartment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Department not found</h2>
        <p className="mt-2 text-gray-600">The department you're looking for doesn't exist.</p>
        <Link to="/departments" className="mt-4 inline-block btn-primary">
          Back to Departments
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/departments" className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentDepartment.name}</h1>
            <p className="text-sm text-gray-500">{currentDepartment.description}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            Edit Department
          </button>
          <button className="btn-primary">
            Manage Staff
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Department Name</label>
                <p className="text-gray-900">{currentDepartment.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Location</label>
                <p className="text-gray-900">{currentDepartment.location || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{currentDepartment.phone || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{currentDepartment.email || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Head Doctor</label>
                <p className="text-gray-900">
                  {currentDepartment.head_doctor_first_name && currentDepartment.head_doctor_last_name
                    ? `Dr. ${currentDepartment.head_doctor_first_name} ${currentDepartment.head_doctor_last_name}`
                    : 'Not assigned'
                  }
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="text-gray-900">{formatDate(currentDepartment.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {currentDepartment.description && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed">{currentDepartment.description}</p>
            </div>
          )}

          {/* Statistics */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {currentDepartment.statistics?.total_appointments || 0}
                </div>
                <div className="text-sm text-gray-600">Total Appointments</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {currentDepartment.statistics?.completed_appointments || 0}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {currentDepartment.statistics?.upcoming_appointments || 0}
                </div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </div>
            </div>
          </div>

          {/* Staff Members */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Members</h3>
            {currentDepartment.doctors && currentDepartment.doctors.length > 0 ? (
              <div className="space-y-3">
                {currentDepartment.doctors.map((doctor) => (
                  <div key={doctor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {doctor.first_name?.charAt(0)}{doctor.last_name?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Dr. {doctor.first_name} {doctor.last_name}
                        </p>
                        <p className="text-sm text-gray-500">{doctor.specialization}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {doctor.experience_years} years exp.
                      </p>
                      <p className="text-xs text-gray-500">
                        ${doctor.consultation_fee} consultation
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No staff members assigned to this department</p>
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
                Add Staff Member
              </button>
              <button className="w-full btn-secondary">
                View Appointments
              </button>
              <button className="w-full btn-secondary">
                Update Schedule
              </button>
              <button className="w-full btn-secondary">
                Generate Report
              </button>
            </div>
          </div>

          {/* Department Overview */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Staff Members</span>
                <span className="font-medium">{currentDepartment.doctors?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Appointments</span>
                <span className="font-medium">{currentDepartment.statistics?.total_appointments || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Completion Rate</span>
                <span className="font-medium">
                  {currentDepartment.statistics?.total_appointments > 0
                    ? Math.round((currentDepartment.statistics?.completed_appointments / currentDepartment.statistics?.total_appointments) * 100)
                    : 0
                  }%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Location</label>
                <p className="text-sm text-gray-900">{currentDepartment.location || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-sm text-gray-900">{currentDepartment.phone || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900">{currentDepartment.email || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Department created</p>
                  <p className="text-xs text-gray-500">{formatDate(currentDepartment.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Staff members added</p>
                  <p className="text-xs text-gray-500">Recently</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Appointments scheduled</p>
                  <p className="text-xs text-gray-500">This week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetails;