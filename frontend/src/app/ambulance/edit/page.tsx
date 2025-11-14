'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ambulanceAPI } from '@/lib/api';

function EditAmbulanceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ambulanceId = searchParams.get('id');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchLoading, setFetchLoading] = useState(true);

  const [formData, setFormData] = useState({
    registration: '',
    model: '',
    year: new Date().getFullYear(),
    type: '',
    status: 'Available',
    driver: '',
    location: '',
    fuelType: 'Diesel',
    mileage: '',
    capacity: '',
    lastMaintenance: '',
    nextMaintenance: '',
  });

  useEffect(() => {
    if (ambulanceId) {
      fetchAmbulance();
    }
  }, [ambulanceId]);

  const fetchAmbulance = async () => {
    try {
      setFetchLoading(true);
      const response = await ambulanceAPI.get(ambulanceId!);
      const data = response.data;
      setFormData({
        registration: data.registration || '',
        model: data.model || '',
        year: data.year || new Date().getFullYear(),
        type: data.type || '',
        status: data.status || 'Available',
        driver: data.driver || '',
        location: data.location || '',
        fuelType: data.fuelType || 'Diesel',
        mileage: data.mileage || '',
        capacity: data.capacity || '',
        lastMaintenance: data.lastMaintenance || '',
        nextMaintenance: data.nextMaintenance || '',
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch ambulance details');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await ambulanceAPI.update(ambulanceId!, formData);
      router.push(`/ambulance/details?id=${ambulanceId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update ambulance');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/ambulance/details?id=${ambulanceId}`} className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold mb-2">Edit Ambulance</h1>
          <p className="text-gray-400">Update ambulance information and details.</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">General Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    name="registration"
                    value={formData.registration}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Model
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Basic Life Support">Basic Life Support</option>
                    <option value="Advanced Life Support">Advanced Life Support</option>
                    <option value="Patient Transport">Patient Transport</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                  >
                    <option value="Available">Available</option>
                    <option value="On Call">On Call</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fuel Type
                  </label>
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Operational Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Driver
                  </label>
                  <input
                    type="text"
                    name="driver"
                    value={formData.driver}
                    onChange={handleChange}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mileage
                  </label>
                  <input
                    type="text"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="e.g., 12,450 km"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Capacity
                  </label>
                  <input
                    type="text"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="e.g., 2 stretchers, 3 seated"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Maintenance
                  </label>
                  <input
                    type="date"
                    name="lastMaintenance"
                    value={formData.lastMaintenance}
                    onChange={handleChange}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Next Maintenance
                  </label>
                  <input
                    type="date"
                    name="nextMaintenance"
                    value={formData.nextMaintenance}
                    onChange={handleChange}
                    className="input-field w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <Link href={`/ambulance/details?id=${ambulanceId}`}>
              <button type="button" className="btn-secondary">
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditAmbulancePage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="flex justify-center items-center py-8"><div className="text-gray-400">Loading...</div></div>}>
        <EditAmbulanceContent />
      </Suspense>
    </DashboardLayout>
  );
}
