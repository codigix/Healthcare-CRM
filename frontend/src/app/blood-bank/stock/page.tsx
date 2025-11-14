'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, Plus, AlertCircle, Droplet } from 'lucide-react';

interface BloodType {
  type: string;
  units: number;
  color: string;
}

export default function BloodStockPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const [bloodStock] = useState<BloodType[]>([
    { type: 'A+', units: 32, color: 'bg-emerald-500' },
    { type: 'A-', units: 8, color: 'bg-orange-500' },
    { type: 'B+', units: 8, color: 'bg-emerald-500' },
    { type: 'B-', units: 2, color: 'bg-red-500' },
    { type: 'AB+', units: 3, color: 'bg-orange-500' },
    { type: 'AB-', units: 1, color: 'bg-red-500' },
    { type: 'O+', units: 15, color: 'bg-emerald-500' },
    { type: 'O-', units: 5, color: 'bg-emerald-500' }
  ]);

  const totalUnits = bloodStock.reduce((sum, item) => sum + item.units, 0);
  const expiringUnits = 10;
  const criticalLevels = bloodStock.filter(b => b.units <= 3).length;

  const getStatusColor = (units: number) => {
    if (units >= 10) return 'bg-emerald-500';
    if (units >= 5) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getBarWidth = (units: number) => {
    const maxUnits = Math.max(...bloodStock.map(b => b.units));
    return `${(units / maxUnits) * 100}%`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Blood Stock</h1>
            <p className="text-gray-400">Manage and monitor blood inventory in the blood bank</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Plus className="text-blue-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalUnits}</div>
                <div className="text-sm text-gray-400">Total Blood Units</div>
                <div className="text-xs text-emerald-500">Units available across all blood types</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Droplet className="text-blue-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm text-gray-400">Blood Type Distribution</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-red-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{expiringUnits}</div>
                <div className="text-sm text-gray-400">Expiring Soon</div>
                <div className="text-xs text-red-500">Units expiring within next 7 days</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-red-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{criticalLevels}</div>
                <div className="text-sm text-gray-400">Critical Levels</div>
                <div className="text-xs text-red-500">Blood types with critically low inventory</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Blood Type Distribution</h2>
          <p className="text-gray-400 text-sm mb-6">Current inventory levels for each blood type</p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            {bloodStock.map((blood) => (
              <div key={blood.type} className="text-center">
                <div className={`px-4 py-2 rounded-lg ${blood.type.includes('+') ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'} border ${blood.type.includes('+') ? 'border-blue-500/20' : 'border-red-500/20'} font-semibold`}>
                  {blood.type}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Blood Type Availability</h3>
            <p className="text-gray-400 text-sm">Current inventory levels for each blood type</p>

            <div className="space-y-4">
              {bloodStock.map((blood) => (
                <div key={blood.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold w-12">{blood.type}</span>
                    </div>
                    <span className="text-white font-medium">{blood.units} units</span>
                  </div>
                  <div className="w-full bg-dark-tertiary rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full ${getStatusColor(blood.units)} transition-all duration-300`}
                      style={{ width: getBarWidth(blood.units) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-dark-tertiary">
            <div className="flex items-center gap-2 mb-6">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search blood units..."
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
                All Units
              </button>
              <button
                onClick={() => setActiveTab('available')}
                className={`pb-3 px-1 font-medium transition-colors ${
                  activeTab === 'available'
                    ? 'text-emerald-500 border-b-2 border-emerald-500'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setActiveTab('reserved')}
                className={`pb-3 px-1 font-medium transition-colors ${
                  activeTab === 'reserved'
                    ? 'text-emerald-500 border-b-2 border-emerald-500'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Reserved
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
            </div>

            <div className="flex gap-3 mb-6">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Types</option>
                {bloodStock.map(b => (
                  <option key={b.type} value={b.type}>{b.type}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="expiring">Expiring Soon</option>
              </select>
              <div className="flex gap-2 ml-auto">
                <button className="btn-secondary flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  Export
                </button>
                <button className="btn-primary flex items-center gap-2">
                  <Plus size={20} />
                  Add Blood Units
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-tertiary">
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Unit ID</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Blood Type</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Donor</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Collection Date</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Expiry Date</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                    <td className="py-4 px-4 text-gray-300">BU-2023-001</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        A+
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300">John Smith</td>
                    <td className="py-4 px-4 text-gray-300">2023-11-01</td>
                    <td className="py-4 px-4 text-gray-300">2024-01-30</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        Available
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
