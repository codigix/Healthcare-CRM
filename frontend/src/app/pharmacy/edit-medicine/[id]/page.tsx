'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Upload, Loader, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { medicineAPI } from '@/lib/api';

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  medicineType: string;
  description: string;
  medicineForm: string;
  manufacturer: string;
  supplier: string;
  manufacturingDate: string | null;
  expiryDate: string | null;
  batchNumber: string;
  dosage: string;
  sideEffects: string;
  precautions: string;
  initialQuantity: number;
  reorderLevel: number;
  maximumLevel: number;
  purchasePrice: number;
  sellingPrice: number;
  taxRate: number;
  roomTemperature: boolean;
  frozen: boolean;
  refrigerated: boolean;
  protectFromLight: boolean;
  status: string;
}

export default function EditMedicinePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
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

  useEffect(() => {
    fetchMedicine();
  }, [params.id]);

  const fetchMedicine = async () => {
    try {
      setLoading(true);
      setFetchError('');
      const response = await medicineAPI.get(params.id);
      const medicine: Medicine = response.data;
      
      setFormData({
        medicineName: medicine.name,
        genericName: medicine.genericName,
        category: medicine.category,
        medicineType: medicine.medicineType,
        description: medicine.description,
        medicineForm: medicine.medicineForm,
        manufacturer: medicine.manufacturer,
        supplier: medicine.supplier,
        manufacturingDate: medicine.manufacturingDate ? medicine.manufacturingDate.split('T')[0] : '',
        expiryDate: medicine.expiryDate ? medicine.expiryDate.split('T')[0] : '',
        batchNumber: medicine.batchNumber,
        dosage: medicine.dosage,
        sideEffects: medicine.sideEffects,
        precautions: medicine.precautions,
        initialQuantity: medicine.initialQuantity.toString(),
        reorderLevel: medicine.reorderLevel.toString(),
        maximumLevel: medicine.maximumLevel.toString(),
        purchasePrice: medicine.purchasePrice.toString(),
        sellingPrice: medicine.sellingPrice.toString(),
        taxRate: medicine.taxRate.toString(),
        roomTemperature: medicine.roomTemperature,
        frozen: medicine.frozen,
        refrigerated: medicine.refrigerated,
        protectFromLight: medicine.protectFromLight,
        activeForSale: medicine.status === 'Active'
      });
    } catch (err: any) {
      setFetchError('Failed to load medicine details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.medicineName || !formData.genericName || !formData.category || !formData.medicineType || !formData.purchasePrice || !formData.sellingPrice) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setSaving(true);
      setError('');
      
      const medicineData = {
        name: formData.medicineName,
        genericName: formData.genericName,
        category: formData.category,
        medicineType: formData.medicineType,
        description: formData.description,
        medicineForm: formData.medicineForm,
        manufacturer: formData.manufacturer,
        supplier: formData.supplier,
        manufacturingDate: formData.manufacturingDate || null,
        expiryDate: formData.expiryDate || null,
        batchNumber: formData.batchNumber,
        dosage: formData.dosage,
        sideEffects: formData.sideEffects,
        precautions: formData.precautions,
        initialQuantity: Number(formData.initialQuantity),
        reorderLevel: Number(formData.reorderLevel),
        maximumLevel: Number(formData.maximumLevel),
        purchasePrice: Number(formData.purchasePrice),
        sellingPrice: Number(formData.sellingPrice),
        taxRate: Number(formData.taxRate),
        roomTemperature: formData.roomTemperature,
        frozen: formData.frozen,
        refrigerated: formData.refrigerated,
        protectFromLight: formData.protectFromLight,
        status: formData.activeForSale ? 'Active' : 'Inactive',
      };

      await medicineAPI.update(params.id, medicineData);
      router.push(`/pharmacy/medicines/${params.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update medicine');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-emerald-500" size={32} />
        </div>
      </DashboardLayout>
    );
  }

  if (fetchError) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Link href="/pharmacy/medicines">
            <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
              <ArrowLeft size={20} />
              Back to Medicines
            </button>
          </Link>
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg">
            {fetchError}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Edit Medicine</h1>
          </div>
          <Link href={`/pharmacy/medicines/${params.id}`}>
            <button className="btn-secondary">
              Cancel
            </button>
          </Link>
        </div>

        <div className="card">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

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
                <p className="text-gray-400 text-sm mb-6">Edit the basic details of the medicine</p>

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
                      Medicine Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="medicineType"
                      value={formData.medicineType}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      required
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
                  <Link href={`/pharmacy/medicines/${params.id}`}>
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
                <p className="text-gray-400 text-sm mb-6">Edit detailed specifications of the medicine</p>

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
                <p className="text-gray-400 text-sm mb-6">Edit inventory and pricing details</p>

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
                    disabled={saving}
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Update Medicine'
                    )}
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
