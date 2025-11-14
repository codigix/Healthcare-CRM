'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, Package, AlertTriangle, DollarSign, TrendingUp, MoreVertical, Filter } from 'lucide-react';
import Link from 'next/link';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stockLevel: number;
  maxStock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: string;
}

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const items: InventoryItem[] = [
    {
      id: 'INV001',
      name: 'Disposable Gloves (Box)',
      category: 'Medical Supplies',
      stockLevel: 45,
      maxStock: 50,
      status: 'In Stock',
      lastUpdated: '2025-04-15',
    },
    {
      id: 'INV002',
      name: 'Ibuprofen 200mg',
      category: 'Medications',
      stockLevel: 12,
      maxStock: 15,
      status: 'Low Stock',
      lastUpdated: '2025-04-14',
    },
    {
      id: 'INV003',
      name: 'Blood Pressure Monitor',
      category: 'Equipment',
      stockLevel: 5,
      maxStock: 3,
      status: 'In Stock',
      lastUpdated: '2025-04-10',
    },
    {
      id: 'INV004',
      name: 'Surgical Masks (Box)',
      category: 'Medical Supplies',
      stockLevel: 0,
      maxStock: 10,
      status: 'Out of Stock',
      lastUpdated: '2025-04-12',
    },
    {
      id: 'INV005',
      name: 'Amoxicillin 500mg',
      category: 'Medications',
      stockLevel: 8,
      maxStock: 10,
      status: 'Low Stock',
      lastUpdated: '2025-04-13',
    },
    {
      id: 'INV006',
      name: 'Syringe 5ml',
      category: 'Medical Supplies',
      stockLevel: 120,
      maxStock: 50,
      status: 'In Stock',
      lastUpdated: '2025-04-11',
    },
    {
      id: 'INV007',
      name: 'Examination Table Paper',
      category: 'Medical Supplies',
      stockLevel: 3,
      maxStock: 5,
      status: 'Low Stock',
      lastUpdated: '2025-04-09',
    },
    {
      id: 'INV008',
      name: 'Digital Thermometer',
      category: 'Equipment',
      stockLevel: 15,
      maxStock: 5,
      status: 'In Stock',
      lastUpdated: '2025-04-08',
    },
  ];

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

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'medications' && item.category === 'Medications') ||
                      (activeTab === 'supplies' && item.category === 'Medical Supplies') ||
                      (activeTab === 'equipment' && item.category === 'Equipment');
    return matchesSearch && matchesCategory && matchesStatus && matchesTab;
  });

  const totalItems = items.length;
  const lowStockItems = items.filter(i => i.status === 'Low Stock').length;
  const inventoryValue = 124750;
  const newItemsAdded = 12;

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
            <Link href="/inventory/add" className="btn-primary">
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
                <div className="text-2xl font-bold">{totalItems.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Items</div>
                <div className="text-xs text-blue-500">+{newItemsAdded} items added this month</div>
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
                <div className="text-xs text-orange-500">Near alerts</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="text-emerald-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">${inventoryValue.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Value of Inventory</div>
                <div className="text-xs text-emerald-500">+5.2% from last month</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-purple-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">38</div>
                <div className="text-sm text-gray-400">Active Suppliers</div>
                <div className="text-xs text-purple-500">View all suppliers</div>
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

          <h2 className="text-xl font-semibold mb-6">Inventory Items</h2>
          <p className="text-gray-400 text-sm mb-6">Showing {filteredItems.length} items...</p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-tertiary">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Item ID</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Name</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Category</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Stock Level</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Last Updated</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                    <td className="py-4 px-4 text-gray-300 font-medium">{item.id}</td>
                    <td className="py-4 px-4 text-white">{item.name}</td>
                    <td className="py-4 px-4 text-gray-300">{item.category}</td>
                    <td className="py-4 px-4 text-gray-300">{item.stockLevel} / {item.maxStock}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{item.lastUpdated}</td>
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
        </div>
      </div>
    </DashboardLayout>
  );
}
