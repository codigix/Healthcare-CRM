'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { ChevronLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function NewAllotmentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    patientPhone: '',
    attendingDoctor: '',
    emergencyContact: '',
    roomId: '',
    specialRequirements: '',
    allotmentDate: '',
    expectedDischargeDate: '',
    paymentMethod: '',
    insuranceDetails: '',
    additionalNotes: '',
  });

  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAvailableRooms();
  }, []);

  const fetchAvailableRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/room-allotment/rooms`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch rooms');

      const data = await response.json();
      setRooms(data.rooms);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'roomId') {
      const room = rooms.find((r) => r.id === value);
      setSelectedRoom(room);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.patientName || !formData.roomId || !formData.attendingDoctor || !formData.allotmentDate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`${API_URL}/room-allotment/allotments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...formData,
          status: 'Occupied'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create allotment');
      }

      alert('Room allotment created successfully!');
      router.push('/room-allotment/alloted');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create allotment');
    } finally {
      setSubmitting(false);
    }
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
                      Patient Phone
                    </label>
                    <input
                      type="text"
                      name="patientPhone"
                      value={formData.patientPhone}
                      onChange={handleChange}
                      placeholder="Enter patient phone"
                      className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    />
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
                      name="roomId"
                      value={formData.roomId}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Select room</option>
                      {rooms.filter((r) => r.status === 'Available').map((room) => (
                        <option key={room.id} value={room.id}>
                          Room {room.roomNumber} - {room.roomType}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Room Type
                    </label>
                    <input
                      type="text"
                      value={selectedRoom?.roomType || ''}
                      readOnly
                      className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-gray-400 cursor-not-allowed"
                      placeholder="Select a room to see type"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      value={selectedRoom?.department || ''}
                      readOnly
                      className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-gray-400 cursor-not-allowed"
                      placeholder="Select a room to see department"
                    />
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
              disabled={submitting || loading}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <Check size={20} />
              {submitting ? 'Creating...' : 'Create Allotment'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
