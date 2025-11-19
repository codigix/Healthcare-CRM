'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, Plus, Package, AlertCircle, MoreVertical, Loader } from 'lucide-react';
import Link from 'next/link';
import { medicineAPI } from '@/lib/api';

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  initialQuantity: number;
  reorderLevel: number;
  expiryDate: string | null;
  status: string;
  medicineType: string;
  purchasePrice: number;
  sellingPrice: number;
}

export default function MedicineListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: string | null }>({ show: false, id: null });

  const limit = 10;

  useEffect(() => {
    fetchMedicines();
  }, [page, statusFilter, categoryFilter, searchQuery]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      setError('');
      const filters: any = {};
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (categoryFilter !== 'all') filters.category = categoryFilter;
      if (searchQuery) filters.search = searchQuery;

      const response = await medicineAPI.list(page, limit, filters);
      setMedicines(response.data.medicines);
      setTotal(response.data.total);
    } catch (err: any) {
      setError('Failed to fetch medicines');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await medicineAPI.delete(id);
      setMedicines(medicines.filter(m => m.id !== id));
      setDeleteModal({ show: false, id: null });
    } catch (err) {
      setError('Failed to delete medicine');
    }
  };

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

  const getStatusLabel = (medicine: Medicine) => {
    if (medicine.initialQuantity === 0) return 'Out of Stock';
    if (medicine.initialQuantity <= (medicine.reorderLevel || 50)) return 'Low Stock';
    return 'In Stock';
  };

  const filteredMedicines = medicines.filter(medicine => {
    const medicineType = medicine.medicineType || '';
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'prescription' && medicineType === 'Prescription') ||
                      (activeTab === 'otc' && medicineType === 'OTC') ||
                      (activeTab === 'controlled' && medicineType === 'Controlled');
    return matchesTab;
  });

  const totalMedicines = total;
  const lowStockItems = medicines.filter(m => getStatusLabel(m) === 'Low Stock').length;
  const expiringSoon = medicines.filter(m => {
    if (!m.expiryDate) return false;
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

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="animate-spin text-emerald-500" size={32} />
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : filteredMedicines.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No medicines found
            </div>
          ) : (
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
                        <span className="text-gray-300 text-sm">{medicine.id.slice(0, 8)}</span>
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
                        <span className="text-white">{medicine.initialQuantity} units</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-300">{medicine.expiryDate ? new Date(medicine.expiryDate).toLocaleDateString() : 'N/A'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(getStatusLabel(medicine))}`}>
                          {getStatusLabel(medicine)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Link href={`/pharmacy/medicines/${medicine.id}`}>
                            <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-xs hover:bg-blue-500/30 transition-colors">
                              View
                            </button>
                          </Link>
                          <Link href={`/pharmacy/edit-medicine/${medicine.id}`}>
                            <button className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs hover:bg-yellow-500/30 transition-colors">
                              Edit
                            </button>
                          </Link>
                          <button
                            onClick={() => setDeleteModal({ show: true, id: medicine.id })}
                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-dark-tertiary">
            <p className="text-gray-400 text-sm">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalMedicines)} of {totalMedicines} medicines
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-dark-tertiary rounded-lg hover:bg-dark-tertiary/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page * limit >= totalMedicines}
                className="px-4 py-2 bg-dark-tertiary rounded-lg hover:bg-dark-tertiary/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6 max-w-sm">
            <h2 className="text-lg font-bold mb-2">Delete Medicine</h2>
            <p className="text-gray-400 mb-6">Are you sure you want to delete this medicine? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal({ show: false, id: null })}
                className="px-4 py-2 bg-dark-tertiary rounded-lg hover:bg-dark-tertiary/70 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteModal.id && handleDelete(deleteModal.id)}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
