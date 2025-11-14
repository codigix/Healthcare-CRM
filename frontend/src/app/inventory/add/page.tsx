'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function AddInventoryItemPage() {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    itemName: '',
    itemId: '',
    category: '',
    subcategory: '',
    description: '',
    unitOfMeasure: '',
    unitQuantity: '',
    storageLocation: '',
    manufacturer: '',
    brand: '',
    modelVersion: '',
    expiryTracking: '',
    requiresRefrigeration: false,
    hazardousMaterial: false,
    controlledSubstance: false,
    sterile: false,
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        <div className="flex items-center gap-4">
          <Link href="/inventory" className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Add Inventory Item</h1>
            <p className="text-gray-400">Add a new item to your inventory</p>
          </div>
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
              Item Details
            </button>
            <button
              onClick={() => setActiveTab('stock')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'stock'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Stock Management
            </button>
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'suppliers'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Suppliers
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                  <p className="text-gray-400 text-sm mb-6">Enter the basic details of the inventory item</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Item Name</label>
                      <input
                        type="text"
                        name="itemName"
                        value={formData.itemName}
                        onChange={handleInputChange}
                        placeholder="Enter item name"
                        className="input-field w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Item ID/SKU</label>
                      <input
                        type="text"
                        name="itemId"
                        value={formData.itemId}
                        onChange={handleInputChange}
                        placeholder="Enter item ID or SKU"
                        className="input-field w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="input-field w-full"
                        required
                      >
                        <option value="">Select category</option>
                        <option value="Medical Supplies">Medical Supplies</option>
                        <option value="Medications">Medications</option>
                        <option value="Equipment">Equipment</option>
                        <option value="Office Supplies">Office Supplies</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Subcategory</label>
                      <select
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleInputChange}
                        className="input-field w-full"
                      >
                        <option value="">Select subcategory</option>
                        <option value="Disposables">Disposables</option>
                        <option value="Surgical">Surgical</option>
                        <option value="Diagnostic">Diagnostic</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter item description"
                        rows={4}
                        className="input-field w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Unit of Measure</label>
                      <select
                        name="unitOfMeasure"
                        value={formData.unitOfMeasure}
                        onChange={handleInputChange}
                        className="input-field w-full"
                        required
                      >
                        <option value="">Select unit</option>
                        <option value="Box">Box</option>
                        <option value="Piece">Piece</option>
                        <option value="Bottle">Bottle</option>
                        <option value="Pack">Pack</option>
                        <option value="Unit">Unit</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Unit Quantity</label>
                      <input
                        type="number"
                        name="unitQuantity"
                        value={formData.unitQuantity}
                        onChange={handleInputChange}
                        placeholder="Quantity per unit"
                        className="input-field w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Storage Location</label>
                      <input
                        type="text"
                        name="storageLocation"
                        value={formData.storageLocation}
                        onChange={handleInputChange}
                        placeholder="Enter storage location"
                        className="input-field w-full"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
                  <p className="text-gray-400 text-sm mb-6">Enter additional details about the item</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Manufacturer</label>
                      <input
                        type="text"
                        name="manufacturer"
                        value={formData.manufacturer}
                        onChange={handleInputChange}
                        placeholder="Enter manufacturer"
                        className="input-field w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Brand</label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        placeholder="Enter brand name"
                        className="input-field w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Model/Version</label>
                      <input
                        type="text"
                        name="modelVersion"
                        value={formData.modelVersion}
                        onChange={handleInputChange}
                        placeholder="Enter model or version"
                        className="input-field w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Expiry Tracking</label>
                      <select
                        name="expiryTracking"
                        value={formData.expiryTracking}
                        onChange={handleInputChange}
                        className="input-field w-full"
                      >
                        <option value="">Select option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Item Properties</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="requiresRefrigeration"
                          checked={formData.requiresRefrigeration}
                          onChange={handleInputChange}
                          className="w-4 h-4 rounded border-gray-600 bg-dark-tertiary text-emerald-500 focus:ring-emerald-500"
                        />
                        <span className="text-sm">Requires Refrigeration</span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="hazardousMaterial"
                          checked={formData.hazardousMaterial}
                          onChange={handleInputChange}
                          className="w-4 h-4 rounded border-gray-600 bg-dark-tertiary text-emerald-500 focus:ring-emerald-500"
                        />
                        <span className="text-sm">Hazardous Material</span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="controlledSubstance"
                          checked={formData.controlledSubstance}
                          onChange={handleInputChange}
                          className="w-4 h-4 rounded border-gray-600 bg-dark-tertiary text-emerald-500 focus:ring-emerald-500"
                        />
                        <span className="text-sm">Controlled Substance</span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="sterile"
                          checked={formData.sterile}
                          onChange={handleInputChange}
                          className="w-4 h-4 rounded border-gray-600 bg-dark-tertiary text-emerald-500 focus:ring-emerald-500"
                        />
                        <span className="text-sm">Sterile</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium mb-2">Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Enter any additional notes"
                      rows={4}
                      className="input-field w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stock' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Stock Management</h2>
                  <p className="text-gray-400 text-sm mb-6">Configure stock levels and reorder settings</p>
                  <div className="text-center py-12 text-gray-400">
                    Stock management features coming soon...
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'suppliers' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Suppliers</h2>
                  <p className="text-gray-400 text-sm mb-6">Manage suppliers for this item</p>
                  <div className="text-center py-12 text-gray-400">
                    Supplier management features coming soon...
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-8 pt-6 border-t border-dark-tertiary">
              <Link href="/inventory" className="btn-secondary">
                Cancel
              </Link>
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Save size={18} />
                Save Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
