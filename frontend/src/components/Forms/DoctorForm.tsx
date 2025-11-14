'use client';

import { useState, useEffect } from 'react';
import { doctorAPI } from '@/lib/api';

interface Doctor {
  id?: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: number;
  schedule?: string;
  avatar?: string;
}

interface DoctorFormProps {
  doctor?: Doctor | null;
  onSuccess: () => void;
}

export default function DoctorForm({ doctor, onSuccess }: DoctorFormProps) {
  const [formData, setFormData] = useState<Doctor>({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: 0,
    schedule: '',
    avatar: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (doctor) {
      setFormData(doctor);
    }
  }, [doctor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'experience' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (doctor?.id) {
        await doctorAPI.update(doctor.id, formData);
      } else {
        await doctorAPI.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save doctor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input-field w-full"
          placeholder="Dr. John Smith"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="input-field w-full"
          placeholder="doctor@medixpro.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="input-field w-full"
          placeholder="+1 (555) 000-0000"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Specialization
        </label>
        <input
          type="text"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          className="input-field w-full"
          placeholder="Cardiology"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Experience (years)
        </label>
        <input
          type="number"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          className="input-field w-full"
          placeholder="10"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Schedule
        </label>
        <input
          type="text"
          name="schedule"
          value={formData.schedule}
          onChange={handleChange}
          className="input-field w-full"
          placeholder="Mon-Fri: 9AM-5PM"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? 'Saving...' : 'Save Doctor'}
      </button>
    </form>
  );
}
