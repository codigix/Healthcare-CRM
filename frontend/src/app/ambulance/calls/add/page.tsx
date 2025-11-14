'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { ArrowLeft, AlertCircle, Phone, MapPin, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { emergencyCallsAPI } from '@/lib/api';

export default function AddEmergencyCallPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    patientName: '',
    location: '',
    emergencyType: '',
    priority: 'Medium',
    phone: '',
    additionalInfo: '',
  });

  const emergencyTypes = [
    'Cardiac Arrest',
    'Fall Injury',
    'Traffic Accident',
    'Breathing Difficulty',
    'Allergic Reaction',
    'Workplace Injury',
    'Stroke',
    'Severe Bleeding',
    'Chest Pain',
    'Unconsciousness',
    'Poisoning',
    'Other',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await emergencyCallsAPI.create({
        patientName: formData.patientName,
        location: formData.location,
        emergencyType: formData.emergencyType,
        priority: formData.priority,
        status: 'Pending',
        callTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
        phone: formData.phone,
        notes: formData.additionalInfo,
      });
      router.push('/ambulance/calls');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create emergency call');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/ambulance/calls" className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-2">New Emergency Call</h1>
            <p className="text-gray-400">Register and dispatch a new emergency call.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle size={20} className="text-orange-500" />
                  Emergency Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter patient name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter address or location"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Emergency Type *
                    </label>
                    <select
                      name="emergencyType"
                      value={formData.emergencyType}
                      onChange={handleChange}
                      className="input-field w-full"
                      required
                    >
                      <option value="">Select emergency type</option>
                      {emergencyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Priority Level *
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="input-field w-full"
                      required
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    className="input-field w-full"
                    rows={4}
                    placeholder="Enter any additional information about the emergency..."
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex gap-2">
                  <AlertCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-400">
                    <p className="font-medium mb-1">Emergency Call Status</p>
                    <p>This call will be created with "Pending" status and assigned to an available ambulance.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                <AlertCircle size={18} />
                {loading ? 'Creating Call...' : 'Create Emergency Call'}
              </button>
              <Link href="/ambulance/calls">
                <button type="button" className="btn-secondary">
                  Cancel
                </button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
