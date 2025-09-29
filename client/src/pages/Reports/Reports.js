import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

import { fetchReports, generateReport, deleteReport, clearError } from '../../slices/reportsSlice';
import { fetchPatients } from '../../slices/patientsSlice';
import { fetchDoctors } from '../../slices/doctorsSlice';
import { fetchDepartments } from '../../slices/departmentsSlice';

const Reports = () => {
  const dispatch = useDispatch();
  const { reports, pagination, isLoading, isGeneratingReport, error } = useSelector((state) => state.reports);
  const { patients } = useSelector((state) => state.patients);
  const { doctors } = useSelector((state) => state.doctors);
  const { departments } = useSelector((state) => state.departments);
  
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportTypeFilter, setReportTypeFilter] = useState('');

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const selectedReportType = watch('reportType');

  useEffect(() => {
    dispatch(fetchReports({ page: currentPage, reportType: reportTypeFilter }));
    dispatch(fetchPatients());
    dispatch(fetchDoctors());
    dispatch(fetchDepartments());
  }, [dispatch, currentPage, reportTypeFilter]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data) => {
    try {
      await dispatch(generateReport(data)).unwrap();
      toast.success('Report generated successfully!');
      setShowGenerateModal(false);
      reset();
      dispatch(fetchReports({ page: currentPage, reportType: reportTypeFilter }));
    } catch (error) {
      toast.error(error || 'Failed to generate report');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await dispatch(deleteReport(id)).unwrap();
        toast.success('Report deleted successfully!');
        dispatch(fetchReports({ page: currentPage, reportType: reportTypeFilter }));
      } catch (error) {
        toast.error(error || 'Failed to delete report');
      }
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReportTypeBadge = (type) => {
    const typeClasses = {
      patient_summary: 'bg-blue-100 text-blue-800',
      department_analytics: 'bg-green-100 text-green-800',
      financial_report: 'bg-yellow-100 text-yellow-800',
      operational_report: 'bg-purple-100 text-purple-800',
      custom: 'bg-gray-100 text-gray-800',
    };
    return `status-badge ${typeClasses[type] || typeClasses.custom}`;
  };

  const getReportTypeLabel = (type) => {
    const labels = {
      patient_summary: 'Patient Summary',
      department_analytics: 'Department Analytics',
      financial_report: 'Financial Report',
      operational_report: 'Operational Report',
      custom: 'Custom Report',
    };
    return labels[type] || 'Custom Report';
  };

  const getReportParameters = (reportType) => {
    switch (reportType) {
      case 'patient_summary':
        return (
          <div>
            <label className="label">Select Patient</label>
            <select {...register('parameters.patientId')} className="input-field">
              <option value="">All Patients</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.first_name} {patient.last_name} ({patient.patient_id})
                </option>
              ))}
            </select>
          </div>
        );
      case 'department_analytics':
        return (
          <div>
            <label className="label">Select Department</label>
            <select {...register('parameters.departmentId')} className="input-field">
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        );
      case 'financial_report':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Start Date</label>
              <input
                {...register('parameters.startDate')}
                type="date"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">End Date</label>
              <input
                {...register('parameters.endDate')}
                type="date"
                className="input-field"
              />
            </div>
          </div>
        );
      case 'operational_report':
        return (
          <div>
            <label className="label">Report Period</label>
            <select {...register('parameters.period')} className="input-field">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        );
      case 'custom':
        return (
          <div>
            <label className="label">Custom Prompt</label>
            <textarea
              {...register('parameters.customPrompt', { required: 'Custom prompt is required' })}
              rows={4}
              className="input-field"
              placeholder="Describe what kind of report you want to generate..."
            />
            {errors.parameters?.customPrompt && (
              <p className="mt-1 text-sm text-red-600">{errors.parameters.customPrompt.message}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            AI-generated insights and analytics for your hospital
          </p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="mt-4 sm:mt-0 btn-primary"
        >
          Generate New Report
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div>
              <label className="label">Report Type</label>
              <select
                value={reportTypeFilter}
                onChange={(e) => setReportTypeFilter(e.target.value)}
                className="input-field"
              >
                <option value="">All Types</option>
                <option value="patient_summary">Patient Summary</option>
                <option value="department_analytics">Department Analytics</option>
                <option value="financial_report">Financial Report</option>
                <option value="operational_report">Operational Report</option>
                <option value="custom">Custom Report</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="btn-secondary">
              Export All
            </button>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="flex items-center">
              <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-2">Loading reports...</span>
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <span className="text-4xl mb-4 block">📊</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-500 mb-4">Generate your first AI report to get started.</p>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="btn-primary"
            >
              Generate Report
            </button>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {report.title}
                  </h3>
                  <span className={getReportTypeBadge(report.report_type)}>
                    {getReportTypeLabel(report.report_type)}
                  </span>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleViewReport(report)}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mb-3">
                <p>Generated by: {report.first_name} {report.last_name}</p>
                <p>Created: {formatDate(report.created_at)}</p>
              </div>
              
              <div className="text-sm text-gray-700 line-clamp-3">
                {report.content.length > 150 
                  ? `${report.content.substring(0, 150)}...` 
                  : report.content
                }
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-200">
                <button
                  onClick={() => handleViewReport(report)}
                  className="w-full btn-secondary text-sm"
                >
                  Read Full Report
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {pagination.page * pagination.limit - pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
              disabled={currentPage === pagination.pages}
              className="btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Generate AI Report</h3>
                <button
                  onClick={() => {
                    setShowGenerateModal(false);
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
                  <label className="label">Report Title *</label>
                  <input
                    {...register('title', { required: 'Report title is required' })}
                    type="text"
                    className="input-field"
                    placeholder="Enter report title..."
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Report Type *</label>
                  <select
                    {...register('reportType', { required: 'Report type is required' })}
                    className="input-field"
                  >
                    <option value="">Select Report Type</option>
                    <option value="patient_summary">Patient Summary</option>
                    <option value="department_analytics">Department Analytics</option>
                    <option value="financial_report">Financial Report</option>
                    <option value="operational_report">Operational Report</option>
                    <option value="custom">Custom Report</option>
                  </select>
                  {errors.reportType && (
                    <p className="mt-1 text-sm text-red-600">{errors.reportType.message}</p>
                  )}
                </div>

                {selectedReportType && getReportParameters(selectedReportType)}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowGenerateModal(false);
                      reset();
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGeneratingReport}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingReport ? 'Generating...' : 'Generate Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Report View Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedReport.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={getReportTypeBadge(selectedReport.report_type)}>
                      {getReportTypeLabel(selectedReport.report_type)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Generated by {selectedReport.first_name} {selectedReport.last_name}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="prose max-w-none">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-900">
                    {selectedReport.content}
                  </pre>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button className="btn-primary">
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;