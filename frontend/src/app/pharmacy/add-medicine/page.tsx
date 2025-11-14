'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Upload } from 'lucide-react';
import Link from 'next/link';

export default function AddMedicinePage() {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    medicineName: '',
    genericName: '',
    category: '',
    medicineType: '',
    description: '',
    medicineForm: 'tablet',
    manufacturer: '',
    supplier: '',
    manufacturingDate: '',
    expiryDate: '',
    batchNumber: '',
    dosage: '',
    sideEffects: '',
    precautions: '',
    initialQuantity: '',
    reorderLevel: '',
    maximumLevel: '',
    purchasePrice: '',
    sellingPrice: '',
    taxRate: '',
    roomTemperature: false,
    frozen: false,
    refrigerated: false,
    protectFromLight: false,
    activeForSale: true
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
            <h1 className="text-3xl font-bold mb-2">Add New Medicine</h1>
          </div>
          <Link href="/pharmacy/medicines">
            <button className="btn-secondary">
              Cancel
            </button>
          </Link>
        </div>

        <div className="card">
          <div className="flex gap-4 mb-6 border-b border-dark-tertiary">
            <button
              onClick={() => setActiveTab('basic')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'basic'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Basic Information
            </button>
            <button
              onClick={() => setActiveTab('detailed')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'detailed'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Detailed Information
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'inventory'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Inventory & Pricing
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                <p className="text-gray-400 text-sm mb-6">Enter the basic details of the medicine</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Medicine Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="medicineName"
                      value={formData.medicineName}
                      onChange={handleInputChange}
                      placeholder="Enter medicine name"
                      className="input-field w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Generic Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="genericName"
                      value={formData.genericName}
                      onChange={handleInputChange}
                      placeholder="Enter generic name"
                      className="input-field w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="Antibiotics">Antibiotics</option>
                      <option value="Analgesics">Analgesics</option>
                      <option value="Antidiabetics">Antidiabetics</option>
                      <option value="Antihypertensives">Antihypertensives</option>
                      <option value="Antihistamines">Antihistamines</option>
                      <option value="Statins">Statins</option>
                      <option value="Anxiolytics">Anxiolytics</option>
                      <option value="NSAIDs">NSAIDs</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Medicine Type
                    </label>
                    <select
                      name="medicineType"
                      value={formData.medicineType}
                      onChange={handleInputChange}
                      className="input-field w-full"
                    >
                      <option value="">Select type</option>
                      <option value="Prescription">Prescription</option>
                      <option value="OTC">OTC</option>
                      <option value="Controlled">Controlled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter medicine description"
                    rows={4}
                    className="input-field w-full resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Medicine Form</label>
                  <div className="flex flex-wrap gap-4">
                    {['tablet', 'capsule', 'syrup', 'injection', 'cream/ointment', 'drops', 'other'].map((form) => (
                      <label key={form} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="medicineForm"
                          value={form}
                          checked={formData.medicineForm === form}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-emerald-500 bg-dark-tertiary border-gray-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm capitalize">{form}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Link href="/pharmacy/medicines">
                    <button type="button" className="btn-secondary">
                      Cancel
                    </button>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActiveTab('detailed')}
                    className="btn-primary"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'detailed' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Detailed Information</h2>
                <p className="text-gray-400 text-sm mb-6">Enter detailed specifications of the medicine</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Manufacturer</label>
                    <input
                      type="text"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleInputChange}
                      placeholder="Enter manufacturer name"
                      className="input-field w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Supplier</label>
                    <input
                      type="text"
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleInputChange}
                      placeholder="Enter supplier name"
                      className="input-field w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Manufacturing Date</label>
                    <input
                      type="date"
                      name="manufacturingDate"
                      value={formData.manufacturingDate}
                      onChange={handleInputChange}
                      className="input-field w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry Date</label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="input-field w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Batch Number</label>
                    <input
                      type="text"
                      name="batchNumber"
                      value={formData.batchNumber}
                      onChange={handleInputChange}
                      placeholder="Enter batch number"
                      className="input-field w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Dosage</label>
                    <input
                      type="text"
                      name="dosage"
                      value={formData.dosage}
                      onChange={handleInputChange}
                      placeholder="e.g., 100mg, 5ml"
                      className="input-field w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Side Effects</label>
                  <textarea
                    name="sideEffects"
                    value={formData.sideEffects}
                    onChange={handleInputChange}
                    placeholder="Enter potential side effects"
                    rows={3}
                    className="input-field w-full resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Precautions & Warnings</label>
                  <textarea
                    name="precautions"
                    value={formData.precautions}
                    onChange={handleInputChange}
                    placeholder="Enter precautions and warnings"
                    rows={3}
                    className="input-field w-full resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('basic')}
                    className="btn-secondary"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('inventory')}
                    className="btn-primary"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Inventory & Pricing</h2>
                <p className="text-gray-400 text-sm mb-6">Enter inventory and pricing details</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Initial Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="initialQuantity"
                      value={formData.initialQuantity}
                      onChange={handleInputChange}
                      placeholder="Enter quantity"
                      className="input-field w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Reorder Level</label>
                    <input
                      type="number"
                      name="reorderLevel"
                      value={formData.reorderLevel}
                      onChange={handleInputChange}
                      placeholder="Enter reorder level"
                      className="input-field w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Maximum Level</label>
                    <input
                      type="number"
                      name="maximumLevel"
                      value={formData.maximumLevel}
                      onChange={handleInputChange}
                      placeholder="Enter maximum level"
                      className="input-field w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Purchase Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="purchasePrice"
                      value={formData.purchasePrice}
                      onChange={handleInputChange}
                      placeholder="Enter purchase price"
                      className="input-field w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Selling Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="sellingPrice"
                      value={formData.sellingPrice}
                      onChange={handleInputChange}
                      placeholder="Enter selling price"
                      className="input-field w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      name="taxRate"
                      value={formData.taxRate}
                      onChange={handleInputChange}
                      placeholder="Enter tax rate"
                      className="input-field w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Storage Conditions</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="roomTemperature"
                        checked={formData.roomTemperature}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-emerald-500 bg-dark-tertiary border-gray-600 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm">Room Temperature</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="frozen"
                        checked={formData.frozen}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-emerald-500 bg-dark-tertiary border-gray-600 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm">Frozen</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="refrigerated"
                        checked={formData.refrigerated}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-emerald-500 bg-dark-tertiary border-gray-600 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm">Refrigerated</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="protectFromLight"
                        checked={formData.protectFromLight}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-emerald-500 bg-dark-tertiary border-gray-600 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm">Protect from Light</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Upload Images</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-2 border-dashed border-dark-tertiary rounded-lg p-8 text-center hover:border-gray-600 transition-colors cursor-pointer">
                      <Upload className="mx-auto mb-3 text-gray-400" size={32} />
                      <p className="text-sm text-gray-400 mb-1">Click to upload medicine image</p>
                    </div>
                    <div className="border-2 border-dashed border-dark-tertiary rounded-lg p-8 text-center hover:border-gray-600 transition-colors cursor-pointer">
                      <Upload className="mx-auto mb-3 text-gray-400" size={32} />
                      <p className="text-sm text-gray-400 mb-1">Click to upload package image</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="activeForSale"
                      checked={formData.activeForSale}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-emerald-500 bg-dark-tertiary border-gray-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm font-medium">Active (Available for sale)</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('detailed')}
                    className="btn-secondary"
                  >
                    Previous
                  </button>
                  <button type="submit" className="btn-primary">
                    Save Medicine
                  </button>
                </div>
              </div>
            )}
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
