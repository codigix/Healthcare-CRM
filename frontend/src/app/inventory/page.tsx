'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, Package, AlertTriangle, DollarSign, TrendingUp, MoreVertical, Filter, Loader } from 'lucide-react';
import Link from 'next/link';
import { medicineAPI } from '@/lib/api';

interface InventoryItem {
  id: string;
  name: string;
  genericName?: string;
  category: string;
  initialQuantity: number;
  reorderLevel: number;
  maximumLevel: number;
  purchasePrice: number;
  sellingPrice: number;
  status: string;
}

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    fetchInventory();
  }, [page, searchQuery, categoryFilter, statusFilter]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError('');
      const filters: any = {};
      if (searchQuery) filters.search = searchQuery;
      if (categoryFilter !== 'all') filters.category = categoryFilter;
      if (statusFilter !== 'all') filters.status = statusFilter;

      const response = await medicineAPI.list(page, 10, filters);
      const medicines = response.data.medicines;
      
      const value = medicines.reduce((sum: number, m: any) => 
        sum + (parseFloat(m.purchasePrice) * m.initialQuantity), 0
      );
      
      setItems(medicines);
      setTotal(response.data.total);
      setTotalValue(value);
    } catch (err: any) {
      setError('Failed to fetch inventory');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (quantity: number, reorderLevel: number) => {
    if (quantity === 0) return 'bg-red-500/10 text-red-500 border border-red-500/20';
    if (quantity <= reorderLevel) return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
    return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
  };

  const getStatusLabel = (quantity: number, reorderLevel: number) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= reorderLevel) return 'Low Stock';
    return 'In Stock';
  };

  const filteredItems = items.filter(item => {
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'medications' && ['Antibiotics', 'Analgesics', 'Antidiabetics'].includes(item.category)) ||
                      (activeTab === 'supplies' && item.category === 'Medical Supplies') ||
                      (activeTab === 'equipment' && item.category === 'Equipment');
    return matchesTab;
  });

  const lowStockItems = items.filter(m => getStatusLabel(m.initialQuantity, m.reorderLevel) === 'Low Stock').length;
  const uniqueCategories = Array.from(new Set(items.map(i => i.category)));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
            <p className="text-gray-400">Manage your clinic&apos;s inventory, supplies, and equipment</p>
          </div>
          <div className="flex gap-3">
            <Link href="/pharmacy/add-medicine" className="btn-primary">
              + Add Item
            </Link>
            <button className="btn-secondary">Export</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Package className="text-blue-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{total.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Items</div>
                <div className="text-xs text-blue-500">Medicines in inventory</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-orange-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{lowStockItems}</div>
                <div className="text-sm text-gray-400">Low Stock Items</div>
                <div className="text-xs text-orange-500">Need restocking</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="text-emerald-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">${typeof totalValue === 'number' ? totalValue.toLocaleString('en-US', {maximumFractionDigits: 0}) : totalValue}</div>
                <div className="text-sm text-gray-400">Value of Inventory</div>
                <div className="text-xs text-emerald-500">Purchase value</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-purple-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{uniqueCategories.length}</div>
                <div className="text-sm text-gray-400">Categories</div>
                <div className="text-xs text-purple-500">Active categories</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-dark-tertiary">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search inventory..."
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
              All Items
            </button>
            <button
              onClick={() => setActiveTab('medications')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'medications'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Medications
            </button>
            <button
              onClick={() => setActiveTab('supplies')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'supplies'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Medical Supplies
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'equipment'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Equipment
            </button>
          </div>

          <div className="flex gap-3 mb-6">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
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
            <button className="btn-secondary ml-auto flex items-center gap-2">
              <Filter size={18} />
              Filter
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="animate-spin text-emerald-500" size={32} />
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-6">Inventory Items</h2>
              <p className="text-gray-400 text-sm mb-6">Showing {filteredItems.length} items out of {total} total...</p>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-tertiary">
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Medicine ID</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Name</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Category</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Stock Level</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Unit Price</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                        <td className="py-4 px-4 text-gray-300 font-medium">{item.id.slice(0, 8)}</td>
                        <td className="py-4 px-4 text-white">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-400">{item.genericName || 'N/A'}</div>
                        </td>
                        <td className="py-4 px-4 text-gray-300">{item.category}</td>
                        <td className="py-4 px-4 text-gray-300">{item.initialQuantity} / {item.maximumLevel}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.initialQuantity, item.reorderLevel)}`}>
                            {getStatusLabel(item.initialQuantity, item.reorderLevel)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-300">${typeof item.purchasePrice === 'string' ? parseFloat(item.purchasePrice).toFixed(2) : item.purchasePrice.toFixed(2)}</td>
                        <td className="py-4 px-4">
                          <button className="p-2 hover:bg-gray-500/20 rounded transition-colors">
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
                  Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} items
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
                    disabled={page * 10 >= total}
                    className="px-4 py-2 bg-dark-tertiary rounded-lg hover:bg-dark-tertiary/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
