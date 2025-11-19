'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { recordsAPI } from '@/lib/api';

export default function AddBirthRecordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    childName: '',
    dateOfBirth: '',
    parentFirstName: '',
    parentLastName: '',
    attendingDoctor: '',
    status: 'Pending',
    weight: '',
    gender: '',
    hospitalName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const recordData = {
        type: 'birth',
        patientName: formData.childName,
        date: formData.dateOfBirth,
        details: JSON.stringify({
          childName: formData.childName,
          dateOfBirth: formData.dateOfBirth,
          parents: `${formData.parentFirstName} and ${formData.parentLastName}`,
          attendingDoctor: formData.attendingDoctor,
          weight: formData.weight,
          gender: formData.gender,
          hospitalName: formData.hospitalName,
        }),
        status: formData.status,
      };

      await recordsAPI.create(recordData);
      router.push('/records/birth');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add birth record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/records/birth" className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-2">Add Birth Record</h1>
            <p className="text-gray-400">Register a new birth record in the system.</p>
          </div>
        </div>

        <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-4">Child Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Child Name *
                  </label>
                  <input
                    type="text"
                    name="childName"
                    value={formData.childName}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter child name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter weight"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Parents Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Parent First Name *
                  </label>
                  <input
                    type="text"
                    name="parentFirstName"
                    value={formData.parentFirstName}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter first parent name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Parent Last Name *
                  </label>
                  <input
                    type="text"
                    name="parentLastName"
                    value={formData.parentLastName}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter second parent name"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Medical Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Attending Doctor *
                  </label>
                  <input
                    type="text"
                    name="attendingDoctor"
                    value={formData.attendingDoctor}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter doctor name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hospital Name *
                  </label>
                  <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter hospital name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-dark-tertiary">
              <Link href="/records/birth">
                <button
                  type="button"
                  className="px-6 py-2 bg-dark-tertiary hover:bg-dark-tertiary/80 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white rounded-lg transition-colors font-medium"
              >
                {loading ? 'Adding...' : 'Add Record'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
