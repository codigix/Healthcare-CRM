'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Calendar } from 'lucide-react';
import Link from 'next/link';
import { bloodBankAPI } from '@/lib/api';

export default function RegisterDonorPage() {
  const [formData, setFormData] = useState({
    name: '',
    bloodType: '',
    contact: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    phoneNumber: ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const submitData = {
        name: formData.name,
        bloodType: formData.bloodType,
        contact: formData.contact,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender || null,
        address: formData.address || null,
        city: formData.city || null,
        phoneNumber: formData.phoneNumber || null
      };
      
      const response = await bloodBankAPI.createDonor(submitData);

      if (response.data.success) {
        alert('Donor registered successfully!');
        setFormData({
          name: '',
          bloodType: '',
          contact: '',
          email: '',
          dateOfBirth: '',
          gender: '',
          address: '',
          city: '',
          phoneNumber: ''
        });
        window.location.href = '/blood-bank/donors';
      } else {
        alert('Error: ' + (response.data.error || 'Failed to register donor'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error registering donor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Register Blood Donor</h1>
            <p className="text-gray-400">Add a new blood donor to the blood bank system</p>
          </div>
          <Link href="/blood-bank/donors">
            <button className="btn-secondary">Cancel</button>
          </Link>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Donor Information</h2>
          <p className="text-gray-400 text-sm mb-6">Enter the details of the new blood donor to register them in the system.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className="input-field w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Blood Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                >
                  <option value="">Select blood type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className="input-field w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="Enter contact number"
                  className="input-field w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="input-field w-full"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                  className="input-field w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter full address"
                rows={3}
                className="input-field w-full resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Link href="/blood-bank/donors">
                <button type="button" className="btn-secondary">
                  Cancel
                </button>
              </Link>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Registering...' : 'Register Donor'}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-400">
              Fields marked with <span className="text-red-500">*</span> are required. Make sure to fill all required fields before submitting.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
