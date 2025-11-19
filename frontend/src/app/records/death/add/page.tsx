'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { recordsAPI } from '@/lib/api';

export default function AddDeathRecordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    dateOfDeath: '',
    causeOfDeath: '',
    status: 'Pending',
    department: '',
    attendingDoctor: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const recordData = {
        type: 'death',
        patientName: formData.name,
        date: formData.dateOfDeath,
        details: JSON.stringify({
          name: formData.name,
          age: parseInt(formData.age),
          dateOfDeath: formData.dateOfDeath,
          causeOfDeath: formData.causeOfDeath,
          department: formData.department,
          attendingDoctor: formData.attendingDoctor,
        }),
        status: formData.status,
      };

      await recordsAPI.create(recordData);
      router.push('/records/death');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add death record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/records/death" className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-2">Add Death Record</h1>
            <p className="text-gray-400">Register a new death record in the system.</p>
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
              <h3 className="text-lg font-semibold mb-4">Deceased Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter age"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date of Death *
                  </label>
                  <input
                    type="date"
                    name="dateOfDeath"
                    value={formData.dateOfDeath}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Department *
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter department"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Medical Information</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cause of Death *
                  </label>
                  <textarea
                    name="causeOfDeath"
                    value={formData.causeOfDeath}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter cause of death"
                    rows={4}
                    required
                  />
                </div>

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
                      <option value="Under Review">Under Review</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-dark-tertiary">
              <Link href="/records/death">
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
