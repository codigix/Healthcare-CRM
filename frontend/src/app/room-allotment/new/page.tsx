'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { ChevronLeft, Check } from 'lucide-react';
import Link from 'next/link';

export default function NewAllotmentPage() {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    attendingDoctor: '',
    emergencyContact: '',
    roomNumber: '',
    roomType: '',
    department: '',
    specialRequirements: '',
    allotmentDate: '',
    expectedDischargeDate: '',
    paymentMethod: '',
    insuranceDetails: '',
    additionalNotes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Room allotment created successfully!');
  };

  const departments = [
    'Cardiology',
    'Orthopedics',
    'Neurology',
    'Pulmonology',
    'Gastroenterology',
    'Pediatrics',
  ];

  const roomTypes = ['Private', 'Semi-Private', 'General', 'ICU'];

  const doctors = [
    'Dr. Emily Chun',
    'Dr. Michael Brown',
    'Dr. Lisa Wong',
    'Dr. James Wilson',
    'Dr. Sarah Miller',
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/room-allotment/alloted">
            <button className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors">
              <ChevronLeft size={24} className="text-gray-400" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Room Allotment Details</h1>
            <p className="text-gray-400 mt-1">Assign a room to a patient. Fill in all the required information below.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Patient Information</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Patient ID
                    </label>
                    <input
                      type="text"
                      name="patientId"
                      value={formData.patientId}
                      onChange={handleChange}
                      placeholder="Enter patient ID"
                      className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Enter the unique ID of the patient
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Patient Name
                    </label>
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleChange}
                      placeholder="Enter patient name"
                      className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Attending Doctor
                    </label>
                    <select
                      name="attendingDoctor"
                      value={formData.attendingDoctor}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Select doctor</option>
                      {doctors.map((doctor) => (
                        <option key={doctor} value={doctor}>
                          {doctor}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Emergency Contact
                    </label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      placeholder="Enter emergency contact"
                      className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Room Information</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Room Number
                    </label>
                    <select
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Select room number</option>
                      <option value="101">101</option>
                      <option value="102">102</option>
                      <option value="103">103</option>
                      <option value="201">201</option>
                      <option value="202">202</option>
                      <option value="301">301</option>
                      <option value="302">302</option>
                      <option value="405">405</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Room Type
                    </label>
                    <select
                      name="roomType"
                      value={formData.roomType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Select room type</option>
                      {roomTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Select department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Special Requirements
                    </label>
                    <input
                      type="text"
                      name="specialRequirements"
                      value={formData.specialRequirements}
                      onChange={handleChange}
                      placeholder="Enter any special requirements"
                      className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Allotment Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Allotment Date
                  </label>
                  <input
                    type="date"
                    name="allotmentDate"
                    value={formData.allotmentDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Expected Discharge Date
                  </label>
                  <input
                    type="date"
                    name="expectedDischargeDate"
                    value={formData.expectedDischargeDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Billing Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select payment method</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Insurance Details (if applicable)
                  </label>
                  <input
                    type="text"
                    name="insuranceDetails"
                    value={formData.insuranceDetails}
                    onChange={handleChange}
                    placeholder="Enter insurance details"
                    className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Additional Notes</h2>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              placeholder="Enter any additional notes"
              rows={4}
              className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="flex gap-4 justify-end">
            <Link href="/room-allotment/alloted">
              <button
                type="button"
                className="px-6 py-2 bg-dark-tertiary hover:bg-dark-tertiary/70 text-white rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <Check size={20} />
              Create Allotment
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
