'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { ArrowLeft, Building2, User, MapPin, Phone, Mail, FileText, Users, Stethoscope } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
}

export default function AddDepartmentPage() {
  const [formData, setFormData] = useState({
    departmentName: '',
    headOfDepartment: '',
    location: '',
    contactEmail: '',
    contactPhone: '',
    status: 'Active',
    description: '',
    assignedStaff: [] as string[],
    availableServices: [] as string[]
  });

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const services = [
    { id: '1', name: 'General Consultation', description: 'Initial patient assessment and diagnosis' },
    { id: '2', name: 'Specialized Treatment', description: 'Advanced procedures specific to department' },
    { id: '3', name: 'Emergency Care', description: 'Urgent medical attention' },
    { id: '4', name: 'Follow-up Visits', description: 'Post-treatment monitoring and care' },
    { id: '5', name: 'Diagnostic Testing', description: 'Comprehensive tests and screenings' },
    { id: '6', name: 'Preventive Care', description: 'Routine maintenance and disease prevention' }
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/departments/doctors/list`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch doctors');
        const data = await response.json();
        setDoctors(data);
        setError('');
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStaffToggle = (staffId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedStaff: prev.assignedStaff.includes(staffId)
        ? prev.assignedStaff.filter(id => id !== staffId)
        : [...prev.assignedStaff, staffId]
    }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      availableServices: prev.availableServices.includes(serviceId)
        ? prev.availableServices.filter(id => id !== serviceId)
        : [...prev.availableServices, serviceId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.departmentName,
        head: formData.headOfDepartment,
        location: formData.location,
        status: formData.status,
        description: formData.description,
        staffCount: formData.assignedStaff.length,
        services: formData.availableServices.length,
      };
      const { departmentAPI } = await import('@/lib/api');
      await departmentAPI.create(payload);
      window.location.href = '/departments';
    } catch (err) {
      console.error('Failed to create department', err);
      setError('Failed to create department');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/departments" className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-2">Add Department</h1>
            <p className="text-gray-400">Create a new department in your clinic</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Department Information</h2>
            <p className="text-gray-400 text-sm mb-6">Enter the details for the new department</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Department Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="departmentName"
                    value={formData.departmentName}
                    onChange={handleInputChange}
                    placeholder="e.g. Cardiology"
                    className="input-field pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">The official name of the department</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Head of Department <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    name="headOfDepartment"
                    value={formData.headOfDepartment}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    required
                    disabled={loading}
                  >
                    <option value="">{loading ? 'Loading doctors...' : 'Select a doctor'}</option>
                    {error && <option disabled>{error}</option>}
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.name}>{doctor.name} - {doctor.specialization}</option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-1">The doctor who will lead this department</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Building A, Floor 3"
                    className="input-field pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Physical location of the department</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Current operational status</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="department@clinic.com"
                    className="input-field pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Department contact email</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                    className="input-field pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Department contact phone</p>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide a description of the department's purpose, specialties, and functions..."
                  className="input-field pl-10 min-h-[120px]"
                  rows={5}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Detailed description of the department</p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Users size={24} />
              Assign Staff
            </h2>
            <p className="text-gray-400 text-sm mb-6">Select staff members (doctors) to assign to this department. Count: {formData.assignedStaff.length}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {loading ? (
                <div className="col-span-3 text-center text-gray-400">Loading doctors...</div>
              ) : doctors.length === 0 ? (
                <div className="col-span-3 text-center text-gray-400">No doctors available</div>
              ) : (
                doctors.map(doctor => (
                  <div
                    key={doctor.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.assignedStaff.includes(doctor.id)
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-dark-tertiary hover:border-gray-500'
                    }`}
                    onClick={() => handleStaffToggle(doctor.id)}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.assignedStaff.includes(doctor.id)}
                        onChange={() => handleStaffToggle(doctor.id)}
                        className="w-4 h-4"
                      />
                      <div>
                        <div className="font-medium text-white">{doctor.name}</div>
                        <div className="text-sm text-gray-400">{doctor.specialization}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Stethoscope size={24} />
              Available Services
            </h2>
            <p className="text-gray-400 text-sm mb-6">Select services that will be offered by this department. Count: {formData.availableServices.length}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map(service => (
                <div
                  key={service.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.availableServices.includes(service.id)
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-dark-tertiary hover:border-gray-500'
                  }`}
                  onClick={() => handleServiceToggle(service.id)}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.availableServices.includes(service.id)}
                      onChange={() => handleServiceToggle(service.id)}
                      className="w-4 h-4 mt-1"
                    />
                    <div>
                      <div className="font-medium text-white">{service.name}</div>
                      <div className="text-sm text-gray-400">{service.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Link href="/departments" className="btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn-primary">
              Create Department
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
