'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, Plus, Package, AlertCircle, MoreVertical } from 'lucide-react';
import Link from 'next/link';

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  stock: number;
  expiryDate: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export default function MedicineListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [medicines] = useState<Medicine[]>([
    {
      id: 'MED001',
      name: 'Amoxicillin 500mg',
      genericName: 'Amoxicillin',
      category: 'Antibiotics',
      stock: 1250,
      expiryDate: '2025-06-15',
      status: 'In Stock'
    },
    {
      id: 'MED002',
      name: 'Paracetamol 500mg',
      genericName: 'Acetaminophen',
      category: 'Analgesics',
      stock: 2500,
      expiryDate: '2025-08-22',
      status: 'In Stock'
    },
    {
      id: 'MED003',
      name: 'Metformin 850mg',
      genericName: 'Metformin HCl',
      category: 'Antidiabetics',
      stock: 850,
      expiryDate: '2024-12-10',
      status: 'In Stock'
    },
    {
      id: 'MED004',
      name: 'Lisinopril 10mg',
      genericName: 'Lisinopril',
      category: 'Antihypertensives',
      stock: 120,
      expiryDate: '2024-09-30',
      status: 'Low Stock'
    },
    {
      id: 'MED005',
      name: 'Morphine 15mg',
      genericName: 'Morphine Sulfate',
      category: 'Analgesics',
      stock: 75,
      expiryDate: '2024-11-05',
      status: 'In Stock'
    },
    {
      id: 'MED006',
      name: 'Cetirizine 10mg',
      genericName: 'Cetirizine HCl',
      category: 'Antihistamines',
      stock: 0,
      expiryDate: '2025-03-18',
      status: 'Out of Stock'
    },
    {
      id: 'MED007',
      name: 'Atorvastatin 20mg',
      genericName: 'Atorvastatin Calcium',
      category: 'Statins',
      stock: 450,
      expiryDate: '2025-01-25',
      status: 'In Stock'
    },
    {
      id: 'MED008',
      name: 'Diazepam 5mg',
      genericName: 'Diazepam',
      category: 'Anxiolytics',
      stock: 80,
      expiryDate: '2024-10-12',
      status: 'Low Stock'
    },
    {
      id: 'MED009',
      name: 'Ibuprofen 400mg',
      genericName: 'Ibuprofen',
      category: 'NSAIDs',
      stock: 2800,
      expiryDate: '2025-05-20',
      status: 'In Stock'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'Low Stock':
        return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
      case 'Out of Stock':
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Antibiotics': 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
      'Analgesics': 'bg-purple-500/10 text-purple-500 border border-purple-500/20',
      'Antidiabetics': 'bg-pink-500/10 text-pink-500 border border-pink-500/20',
      'Antihypertensives': 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20',
      'Antihistamines': 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
      'Statins': 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20',
      'Anxiolytics': 'bg-orange-500/10 text-orange-500 border border-orange-500/20',
      'NSAIDs': 'bg-green-500/10 text-green-500 border border-green-500/20'
    };
    return colors[category] || 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
  };

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         medicine.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'prescription' && ['Antibiotics', 'Analgesics'].includes(medicine.category)) ||
                      (activeTab === 'otc' && !['Antibiotics', 'Analgesics'].includes(medicine.category)) ||
                      (activeTab === 'controlled' && ['Anxiolytics'].includes(medicine.category));
    const matchesStatus = statusFilter === 'all' || medicine.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || medicine.category === categoryFilter;
    return matchesSearch && matchesTab && matchesStatus && matchesCategory;
  });

  const totalMedicines = medicines.length;
  const lowStockItems = medicines.filter(m => m.status === 'Low Stock').length;
  const expiringSoon = medicines.filter(m => {
    const daysUntilExpiry = Math.floor((new Date(m.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  }).length;
  const categories = Array.from(new Set(medicines.map(m => m.category))).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Medicine List</h1>
            <p className="text-gray-400">Manage and view all medicines in the pharmacy inventory</p>
          </div>
          <Link href="/pharmacy/add-medicine">
            <button className="btn-primary flex items-center gap-2">
              <Plus size={20} />
              Add New Medicine
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Package className="text-blue-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalMedicines.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Medicines</div>
                <div className="text-xs text-emerald-500">+24 added this month</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-orange-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{lowStockItems}</div>
                <div className="text-sm text-gray-400">Low Stock Items</div>
                <div className="text-xs text-orange-500">Need restocking soon</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-red-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{expiringSoon}</div>
                <div className="text-sm text-gray-400">Expiring Soon</div>
                <div className="text-xs text-red-500">Within next 30 days</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Package className="text-purple-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{categories}</div>
                <div className="text-sm text-gray-400">Categories</div>
                <div className="text-xs text-gray-500">Medicine categories</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-dark-tertiary">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent flex-1 outline-none"
            />
          </div>

          <div className="flex gap-4 mb-6 border-b border-dark-tertiary">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'all'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('prescription')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'prescription'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Prescription
            </button>
            <button
              onClick={() => setActiveTab('otc')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'otc'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              OTC
            </button>
            <button
              onClick={() => setActiveTab('controlled')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'controlled'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Controlled
            </button>
          </div>

          <div className="flex gap-3 mb-6">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Categories</option>
              <option value="Antibiotics">Antibiotics</option>
              <option value="Analgesics">Analgesics</option>
              <option value="Antidiabetics">Antidiabetics</option>
              <option value="Antihypertensives">Antihypertensives</option>
              <option value="Antihistamines">Antihistamines</option>
              <option value="Statins">Statins</option>
              <option value="Anxiolytics">Anxiolytics</option>
              <option value="NSAIDs">NSAIDs</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-tertiary">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">ID</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Medicine Name</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Category</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Stock</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Expiry Date</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.map((medicine) => (
                  <tr key={medicine.id} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="text-gray-300">{medicine.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-white">{medicine.name}</div>
                      <div className="text-sm text-gray-400">{medicine.genericName}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(medicine.category)}`}>
                        {medicine.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white">{medicine.stock} units</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-300">{medicine.expiryDate}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(medicine.status)}`}>
                        {medicine.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="p-2 hover:bg-gray-500/20 rounded transition-colors" title="More">
                        <MoreVertical size={18} className="text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-dark-tertiary">
            <p className="text-gray-400 text-sm">
              Showing 1 to {filteredMedicines.length} of {medicines.length} medicines
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-dark-tertiary rounded-lg hover:bg-dark-tertiary/70 transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 bg-dark-tertiary rounded-lg hover:bg-dark-tertiary/70 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
