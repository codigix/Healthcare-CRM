'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, RefreshCw, AlertTriangle } from 'lucide-react';

interface InventoryItem {
  itemName: string;
  category: string;
  currentStock: string;
  reorderLevel: string;
  supplier: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export default function InventoryReportsPage() {
  const [dateRange, setDateRange] = useState('Nov 12, 2025 - Nov 12, 2025');
  const [category, setCategory] = useState('All Categories');
  const [supplier, setSupplier] = useState('All Suppliers');
  const [activeTab, setActiveTab] = useState('overview');

  const inventoryStats = [
    { label: 'Total Items', value: '1,245', change: '+28 items stock last month', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { label: 'Low Stock Items', value: '2.6%', change: '+0.6% from previous period', color: 'text-red-500', bgColor: 'bg-red-500/10' },
    { label: 'Expiring Soon', value: '1.4%', change: '-0.1% from previous period', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
    { label: 'Inventory Value', value: '$248,320', change: '+4.3% from previous period', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  ];

  const inventoryByCategory = [
    { name: 'Medications', value: 380, items: 380 },
    { name: 'Medical Supplies', value: 285, items: 285 },
    { name: 'Equipment', value: 220, items: 220 },
    { name: 'Office Supplies', value: 190, items: 190 },
    { name: 'Laboratory', value: 170, items: 170 },
  ];

  const stockStatusDistribution = [
    { name: 'In Stock', value: 85, fill: '#10b981' },
    { name: 'Low Stock', value: 10, fill: '#f59e0b' },
    { name: 'Out of Stock', value: 5, fill: '#ef4444' },
  ];

  const topLowStockItems: InventoryItem[] = [
    { itemName: 'Surgical Gloves (M)', category: 'Medical Supplies', currentStock: '24 boxes', reorderLevel: '50 boxes', supplier: 'Medline Industries', status: 'low-stock' },
    { itemName: 'Syringes 5ML', category: 'Medical Supplies', currentStock: '15 cases', reorderLevel: '30 cases', supplier: 'BD Medical', status: 'low-stock' },
    { itemName: 'Gauze Pads', category: 'Medical Supplies', currentStock: '8 packs', reorderLevel: '20 packs', supplier: 'Covidien', status: 'low-stock' },
    { itemName: 'ECG Gel', category: 'Medical Supplies', currentStock: '5 bottles', reorderLevel: '15 bottles', supplier: 'Parker Laboratories', status: 'out-of-stock' },
    { itemName: 'Saline Solution', category: 'Medications', currentStock: '2 cases', reorderLevel: '10 cases', supplier: 'Baxter International', status: 'out-of-stock' },
  ];

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      'in-stock': { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
      'low-stock': { bg: 'bg-yellow-500/10', text: 'text-yellow-500' },
      'out-of-stock': { bg: 'bg-red-500/10', text: 'text-red-500' },
    };
    return badges[status] || badges['in-stock'];
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Inventory Report</h1>
            <p className="text-gray-400">Track inventory levels, usage patterns, and supply chain metrics</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary flex items-center gap-2">
              <RefreshCw size={18} />
              Refresh
            </button>
            <button className="btn-primary flex items-center gap-2">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        <div className="flex border-b border-dark-tertiary gap-4 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'stock-levels', label: 'Stock Levels' },
            { id: 'usage-trends', label: 'Usage Trends' },
            { id: 'suppliers', label: 'Suppliers' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex gap-4 flex-wrap">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 bg-dark-tertiary rounded-lg text-white border border-dark-secondary focus:border-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 bg-dark-tertiary rounded-lg text-white border border-dark-secondary focus:border-emerald-500 outline-none"
            >
              <option>All Categories</option>
              <option>Medications</option>
              <option>Medical Supplies</option>
              <option>Equipment</option>
              <option>Office Supplies</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Supplier</label>
            <select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="px-4 py-2 bg-dark-tertiary rounded-lg text-white border border-dark-secondary focus:border-emerald-500 outline-none"
            >
              <option>All Suppliers</option>
              <option>Medline Industries</option>
              <option>BD Medical</option>
              <option>Covidien</option>
              <option>Parker Laboratories</option>
            </select>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {inventoryStats.map((stat, index) => (
                <div key={index} className={`card ${stat.bgColor}`}>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <h3 className={`text-2xl font-bold ${stat.color} my-2`}>{stat.value}</h3>
                  <p className="text-xs text-gray-500">{stat.change}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Inventory by Category</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={inventoryByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(45, 45, 45, 0.95)', border: 'none', borderRadius: '8px', color: 'white' }} />
                <Bar dataKey="items" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Stock Status Distribution</h2>
            <div className="flex justify-center items-center h-[350px]">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={stockStatusDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {stockStatusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(45, 45, 45, 0.95)', border: 'none', borderRadius: '8px', color: 'white' }} formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-yellow-500" />
              <h2 className="text-lg font-semibold">Top Low Stock Items</h2>
            </div>
            <span className="text-sm text-gray-400">Items that need immediate attention</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-tertiary">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Item Name</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Category</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Current Stock</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Reorder Level</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Supplier</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {topLowStockItems.map((item, index) => {
                  const badge = getStatusBadge(item.status);
                  return (
                    <tr key={index} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50">
                      <td className="py-3 px-4 font-medium">{item.itemName}</td>
                      <td className="py-3 px-4 text-gray-400">{item.category}</td>
                      <td className="py-3 px-4">{item.currentStock}</td>
                      <td className="py-3 px-4 text-gray-400">{item.reorderLevel}</td>
                      <td className="py-3 px-4 text-gray-400">{item.supplier}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                          {item.status === 'in-stock' && 'In Stock'}
                          {item.status === 'low-stock' && 'Low Stock'}
                          {item.status === 'out-of-stock' && 'Out of Stock'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
          </>
        )}

        {(activeTab === 'stock-levels' || activeTab === 'usage-trends' || activeTab === 'suppliers') && (
          <div className="card p-12 text-center">
            <p className="text-gray-400 text-lg">Coming soon...</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
