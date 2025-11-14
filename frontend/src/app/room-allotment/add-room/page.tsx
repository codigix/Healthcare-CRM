'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { ChevronLeft, Check } from 'lucide-react';
import Link from 'next/link';

export default function AddNewRoomPage() {
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: '',
    department: '',
    floor: '',
    capacity: '',
    pricePerDay: '',
    status: 'Available',
    description: '',
    television: false,
    attachedBathroom: false,
    airConditioning: false,
    wheelchairAccessible: false,
    wifi: false,
    oxygenSupply: false,
    telephone: false,
    nursecallButton: false,
    additionalNotes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checkedInput = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? checkedInput.checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Room added successfully!');
  };

  const departments = [
    'Cardiology',
    'Orthopedics',
    'Neurology',
    'Pulmonology',
    'Gastroenterology',
    'Pediatrics',
    'ICU',
    'Emergency',
  ];

  const roomTypes = ['Private', 'Semi-Private', 'General', 'ICU'];
  const floors = ['Ground', 'First', 'Second', 'Third', 'Fourth', 'Fifth'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/room-allotment/by-department">
            <button className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors">
              <ChevronLeft size={24} className="text-gray-400" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Add New Room</h1>
            <p className="text-gray-400 mt-1">
              Add a new room to the hospital inventory. Fill in all the required information below.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Room Number
                  </label>
                  <input
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    placeholder="Enter room number"
                    className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Enter a unique room number
                  </p>
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
                    Floor
                  </label>
                  <select
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select floor</option>
                    {floors.map((floor) => (
                      <option key={floor} value={floor}>
                        {floor}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Additional Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Capacity (Beds)
                  </label>
                  <select
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select capacity</option>
                    <option value="1">1 Bed</option>
                    <option value="2">2 Beds</option>
                    <option value="3">3 Beds</option>
                    <option value="4">4 Beds</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price Per Day
                  </label>
                  <input
                    type="number"
                    name="pricePerDay"
                    value={formData.pricePerDay}
                    onChange={handleChange}
                    placeholder="Enter price"
                    className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Available">Available</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Reserved">Reserved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter room description"
                    className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Facilities</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="television"
                  checked={formData.television}
                  onChange={handleChange}
                  className="w-4 h-4 bg-dark-tertiary border border-dark-tertiary rounded accent-emerald-500 cursor-pointer"
                />
                <span className="text-gray-300 text-sm">Television</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="attachedBathroom"
                  checked={formData.attachedBathroom}
                  onChange={handleChange}
                  className="w-4 h-4 bg-dark-tertiary border border-dark-tertiary rounded accent-emerald-500 cursor-pointer"
                />
                <span className="text-gray-300 text-sm">Attached Bathroom</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="airConditioning"
                  checked={formData.airConditioning}
                  onChange={handleChange}
                  className="w-4 h-4 bg-dark-tertiary border border-dark-tertiary rounded accent-emerald-500 cursor-pointer"
                />
                <span className="text-gray-300 text-sm">Air Conditioning</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="wheelchairAccessible"
                  checked={formData.wheelchairAccessible}
                  onChange={handleChange}
                  className="w-4 h-4 bg-dark-tertiary border border-dark-tertiary rounded accent-emerald-500 cursor-pointer"
                />
                <span className="text-gray-300 text-sm">Wheelchair Accessible</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="wifi"
                  checked={formData.wifi}
                  onChange={handleChange}
                  className="w-4 h-4 bg-dark-tertiary border border-dark-tertiary rounded accent-emerald-500 cursor-pointer"
                />
                <span className="text-gray-300 text-sm">WiFi</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="oxygenSupply"
                  checked={formData.oxygenSupply}
                  onChange={handleChange}
                  className="w-4 h-4 bg-dark-tertiary border border-dark-tertiary rounded accent-emerald-500 cursor-pointer"
                />
                <span className="text-gray-300 text-sm">Oxygen Supply</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="telephone"
                  checked={formData.telephone}
                  onChange={handleChange}
                  className="w-4 h-4 bg-dark-tertiary border border-dark-tertiary rounded accent-emerald-500 cursor-pointer"
                />
                <span className="text-gray-300 text-sm">Telephone</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="nursecallButton"
                  checked={formData.nursecallButton}
                  onChange={handleChange}
                  className="w-4 h-4 bg-dark-tertiary border border-dark-tertiary rounded accent-emerald-500 cursor-pointer"
                />
                <span className="text-gray-300 text-sm">Nurse Call Button</span>
              </label>
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
            <Link href="/room-allotment/by-department">
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
              Add Room
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
