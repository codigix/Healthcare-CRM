'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

export default function AddBloodUnitPage() {
  const [formData, setFormData] = useState({
    anonymousDonor: false,
    donorId: '',
    donorName: '',
    bloodGroup: '',
    quantity: '1',
    screeningComplete: false,
    processingComplete: false,
    collectionDate: '',
    expiryDate: '',
    sourceType: '',
    collectionLocation: '',
    additionalNotes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Add Blood Unit</h1>
            <p className="text-gray-400">Add a new blood unit to the blood bank inventory</p>
          </div>
          <Link href="/blood-bank/stock">
            <button className="btn-secondary">Cancel</button>
          </Link>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Blood Unit Information</h2>
          <p className="text-gray-400 text-sm mb-6">Enter the details of the new blood unit to be added to the inventory.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="anonymousDonor"
                  id="anonymousDonor"
                  checked={formData.anonymousDonor}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-emerald-500 bg-dark-tertiary border-gray-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="anonymousDonor" className="text-sm font-medium cursor-pointer">
                  Anonymous Donor
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Donor ID
                  </label>
                  <input
                    type="text"
                    name="donorId"
                    value={formData.donorId}
                    onChange={handleInputChange}
                    placeholder="Enter donor ID"
                    className="input-field w-full"
                    disabled={formData.anonymousDonor}
                  />
                  <p className="text-xs text-gray-400 mt-1">Enter the unique ID of the donor.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Donor Name
                  </label>
                  <input
                    type="text"
                    name="donorName"
                    value={formData.donorName}
                    onChange={handleInputChange}
                    placeholder="Enter donor name"
                    className="input-field w-full"
                    disabled={formData.anonymousDonor}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Blood Group <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    required
                  >
                    <option value="">Select blood group</option>
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
                    Quantity (units) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Enter quantity"
                    min="1"
                    className="input-field w-full"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">Standard unit is approximately 450ml of whole blood.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="screeningComplete"
                    id="screeningComplete"
                    checked={formData.screeningComplete}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-emerald-500 bg-dark-tertiary border-gray-600 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="screeningComplete" className="text-sm font-medium cursor-pointer">
                    Screening Complete
                  </label>
                  <p className="text-xs text-gray-400">Blood has been screened for infectious diseases.</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="processingComplete"
                    id="processingComplete"
                    checked={formData.processingComplete}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-emerald-500 bg-dark-tertiary border-gray-600 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="processingComplete" className="text-sm font-medium cursor-pointer">
                    Processing Complete
                  </label>
                  <p className="text-xs text-gray-400">Blood has been processed and is ready for storage.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Collection Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="collectionDate"
                      value={formData.collectionDate}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      required
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expiry Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="input-field w-full"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Typically 35-42 days after collection for whole blood.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Source Type
                  </label>
                  <select
                    name="sourceType"
                    value={formData.sourceType}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  >
                    <option value="">Select source type</option>
                    <option value="Voluntary">Voluntary Donation</option>
                    <option value="Replacement">Replacement Donation</option>
                    <option value="Autologous">Autologous Donation</option>
                    <option value="Directed">Directed Donation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Collection Location
                  </label>
                  <input
                    type="text"
                    name="collectionLocation"
                    value={formData.collectionLocation}
                    onChange={handleInputChange}
                    placeholder="Enter collection location"
                    className="input-field w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  placeholder="Enter any additional information or special instructions"
                  rows={4}
                  className="input-field w-full resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Link href="/blood-bank/stock">
                <button type="button" className="btn-secondary">
                  Cancel
                </button>
              </Link>
              <button type="submit" className="btn-primary">
                Add Blood Unit
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
