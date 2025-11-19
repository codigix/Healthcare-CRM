'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, AlertTriangle, PackageX, Clock, Settings } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface AlertItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minLevel: number;
  status: 'Low Stock' | 'Out of Stock' | 'Expiring Soon';
  supplier: string;
}

export default function StockAlertsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('low-stock');

  const [lowStockItems] = useState<AlertItem[]>([
    {
      id: 'INV002',
      name: 'Ibuprofen 200mg',
      category: 'Medications',
      currentStock: 12,
      minLevel: 15,
      status: 'Low Stock',
      supplier: 'PharmaTech Inc.',
    },
    {
      id: 'INV005',
      name: 'Amoxicillin 500mg',
      category: 'Medications',
      currentStock: 8,
      minLevel: 10,
      status: 'Low Stock',
      supplier: 'MedPlus Supplies',
    },
    {
      id: 'INV007',
      name: 'Examination Table Paper',
      category: 'Medical Supplies',
      currentStock: 3,
      minLevel: 5,
      status: 'Low Stock',
      supplier: 'Health Supply Co.',
    },
    {
      id: 'INV011',
      name: 'Surgical Gloves (Medium)',
      category: 'Medical Supplies',
      currentStock: 45,
      minLevel: 50,
      status: 'Low Stock',
      supplier: 'MediEquip Solutions',
    },
    {
      id: 'INV015',
      name: 'Bandages (Box)',
      category: 'Medical Supplies',
      currentStock: 7,
      minLevel: 10,
      status: 'Low Stock',
      supplier: 'Health Supply Co.',
    },
    {
      id: 'INV018',
      name: 'Antiseptic Solution',
      category: 'Medical Supplies',
      currentStock: 4,
      minLevel: 6,
      status: 'Low Stock',
      supplier: 'MedPlus Supplies',
    },
    {
      id: 'INV023',
      name: 'Syringes 10ml',
      category: 'Medical Supplies',
      currentStock: 30,
      minLevel: 40,
      status: 'Low Stock',
      supplier: 'MediEquip Solutions',
    },
  ]);

  const [outOfStockItems] = useState<AlertItem[]>([
    {
      id: 'INV004',
      name: 'Surgical Masks (Box)',
      category: 'Medical Supplies',
      currentStock: 0,
      minLevel: 10,
      status: 'Out of Stock',
      supplier: 'MedPlus Supplies',
    },
    {
      id: 'INV009',
      name: 'Alcohol Swabs',
      category: 'Medical Supplies',
      currentStock: 0,
      minLevel: 20,
      status: 'Out of Stock',
      supplier: 'Health Supply Co.',
    },
    {
      id: 'INV012',
      name: 'Gauze Pads',
      category: 'Medical Supplies',
      currentStock: 0,
      minLevel: 15,
      status: 'Out of Stock',
      supplier: 'MediEquip Solutions',
    },
    {
      id: 'INV016',
      name: 'Cotton Balls',
      category: 'Medical Supplies',
      currentStock: 0,
      minLevel: 8,
      status: 'Out of Stock',
      supplier: 'Health Supply Co.',
    },
    {
      id: 'INV020',
      name: 'Medical Tape',
      category: 'Medical Supplies',
      currentStock: 0,
      minLevel: 12,
      status: 'Out of Stock',
      supplier: 'MedPlus Supplies',
    },
  ]);

  const [expiringSoonItems] = useState<AlertItem[]>([
    {
      id: 'INV013',
      name: 'Paracetamol 500mg',
      category: 'Medications',
      currentStock: 50,
      minLevel: 30,
      status: 'Expiring Soon',
      supplier: 'Global Pharma Ltd.',
    },
    {
      id: 'INV017',
      name: 'Aspirin 100mg',
      category: 'Medications',
      currentStock: 35,
      minLevel: 20,
      status: 'Expiring Soon',
      supplier: 'PharmaTech Inc.',
    },
    {
      id: 'INV021',
      name: 'Antibiotic Ointment',
      category: 'Medications',
      currentStock: 15,
      minLevel: 10,
      status: 'Expiring Soon',
      supplier: 'MedPlus Supplies',
    },
    {
      id: 'INV024',
      name: 'Cough Syrup',
      category: 'Medications',
      currentStock: 25,
      minLevel: 15,
      status: 'Expiring Soon',
      supplier: 'Global Pharma Ltd.',
    },
    {
      id: 'INV026',
      name: 'Eye Drops',
      category: 'Medications',
      currentStock: 18,
      minLevel: 12,
      status: 'Expiring Soon',
      supplier: 'PharmaTech Inc.',
    },
    {
      id: 'INV028',
      name: 'Vitamin C Tablets',
      category: 'Medications',
      currentStock: 40,
      minLevel: 25,
      status: 'Expiring Soon',
      supplier: 'Global Pharma Ltd.',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Low Stock':
        return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
      case 'Out of Stock':
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'Expiring Soon':
        return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  const getCurrentItems = () => {
    switch (activeTab) {
      case 'low-stock':
        return lowStockItems;
      case 'out-of-stock':
        return outOfStockItems;
      case 'expiring':
        return expiringSoonItems;
      case 'all':
        return [...lowStockItems, ...outOfStockItems, ...expiringSoonItems];
      default:
        return lowStockItems;
    }
  };

  const filteredItems = getCurrentItems().filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Stock Alerts</h1>
            <p className="text-gray-400">Monitor and manage inventory alerts</p>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary flex items-center gap-2">
              <Settings size={18} />
              Configure
            </button>
            <button className="btn-secondary">Export</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-orange-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{lowStockItems.length}</div>
                <div className="text-sm text-gray-400">Low Stock Items</div>
                <div className="text-xs text-orange-500">-12 items last week</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <PackageX className="text-red-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{outOfStockItems.length}</div>
                <div className="text-sm text-gray-400">Out of Stock Items</div>
                <div className="text-xs text-red-500">+2 items last week</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Clock className="text-yellow-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{expiringSoonItems.length}</div>
                <div className="text-sm text-gray-400">Expiring Soon</div>
                <div className="text-xs text-yellow-500">Within next 30 days</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-purple-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">7</div>
                <div className="text-sm text-gray-400">Pending Orders</div>
                <div className="text-xs text-purple-500">View orders</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-dark-tertiary">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent flex-1 outline-none"
            />
          </div>

          <div className="flex gap-4 mb-6 border-b border-dark-tertiary">
            <button
              onClick={() => setActiveTab('low-stock')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'low-stock'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setActiveTab('out-of-stock')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'out-of-stock'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Out of Stock
            </button>
            <button
              onClick={() => setActiveTab('expiring')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'expiring'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Expiring Soon
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'all'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              All Alerts
            </button>
          </div>

          <h2 className="text-xl font-semibold mb-4">
            {activeTab === 'low-stock' && 'Low Stock Items'}
            {activeTab === 'out-of-stock' && 'Out of Stock Items'}
            {activeTab === 'expiring' && 'Expiring Soon'}
            {activeTab === 'all' && 'All Alerts'}
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            {activeTab === 'low-stock' && 'Items that have fallen below their minimum stock level'}
            {activeTab === 'out-of-stock' && 'Items that are currently out of stock'}
            {activeTab === 'expiring' && 'Items expiring within the next 30 days'}
            {activeTab === 'all' && 'All inventory alerts'}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-tertiary">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Item ID</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Name</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Category</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Current Stock</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Min. Level</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Supplier</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                    <td className="py-4 px-4 text-gray-300 font-medium">{item.id}</td>
                    <td className="py-4 px-4 text-white">{item.name}</td>
                    <td className="py-4 px-4 text-gray-300">{item.category}</td>
                    <td className="py-4 px-4 text-gray-300">{item.currentStock}</td>
                    <td className="py-4 px-4 text-gray-300">{item.minLevel}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{item.supplier}</td>
                    <td className="py-4 px-4">
                      <button className="btn-primary text-xs px-3 py-1">
                        Reorder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Alert Settings</h2>
          <p className="text-gray-400 text-sm mb-6">Configure how and when you receive inventory alerts</p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-dark-tertiary/30 rounded-lg">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-gray-400">Receive alerts via email</div>
                  </div>
                  <button className="btn-primary text-sm">Configure</button>
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-tertiary/30 rounded-lg">
                  <div>
                    <div className="font-medium">Alert Frequency</div>
                    <div className="text-sm text-gray-400">Daily summary at 6:00 AM</div>
                  </div>
                  <button className="btn-primary text-sm">Configure</button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Alert Thresholds</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-dark-tertiary/30 rounded-lg">
                  <div>
                    <div className="font-medium">Low Stock Threshold</div>
                    <div className="text-sm text-gray-400">Default: 20% of minimum level</div>
                  </div>
                  <button className="btn-primary text-sm">Configure</button>
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-tertiary/30 rounded-lg">
                  <div>
                    <div className="font-medium">Expiry Alert Period</div>
                    <div className="text-sm text-gray-400">Default: 30 days before expiry</div>
                  </div>
                  <button className="btn-primary text-sm">Configure</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
