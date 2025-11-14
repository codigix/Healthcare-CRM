'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, Plus, Truck as AmbulanceIcon, Wrench, MapPin, MoreVertical, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { ambulanceAPI } from '@/lib/api';

interface Ambulance {
  id: string;
  name: string;
  registrationNumber: string;
  driverName: string;
  driverPhone: string;
  status: string;
  location?: string;
  lastUpdated?: string;
  emergencyCalls?: any[];
}

export default function AmbulanceListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAmbulances();
  }, [searchQuery]);

  const fetchAmbulances = async () => {
    try {
      setLoading(true);
      const response = await ambulanceAPI.list(1, 100, searchQuery);
      console.log('Ambulance API response:', response.data);
      const ambulancesList = response.data.ambulances || response.data;
      console.log('Setting ambulances:', ambulancesList);
      setAmbulances(Array.isArray(ambulancesList) ? ambulancesList : []);
    } catch (error) {
      console.error('Failed to fetch ambulances', error);
      setAmbulances([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this ambulance?')) {
      try {
        await ambulanceAPI.delete(id);
        fetchAmbulances();
        setOpenMenuId(null);
      } catch (error) {
        console.error('Failed to delete ambulance', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'on call':
      case 'dispatched':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'maintenance':
        return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  const filteredAmbulances = ambulances.filter(ambulance => {
    const matchesSearch = 
      (ambulance.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (ambulance.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (ambulance.driverName?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesStatus = statusFilter === 'all' || ambulance.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalAmbulances = ambulances.length;
  const availableCount = ambulances.filter(a => a.status?.toLowerCase() === 'available').length;
  const onCallCount = ambulances.filter(a => a.status?.toLowerCase().includes('dispatched') || a.status?.toLowerCase().includes('on call')).length;
  const maintenanceCount = ambulances.filter(a => a.status?.toLowerCase() === 'maintenance').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Ambulance List</h1>
            <p className="text-gray-400">Manage and track all ambulances in the fleet</p>
          </div>
          <Link href="/ambulance/add">
            <button className="btn-primary flex items-center gap-2">
              <Plus size={20} />
              Add New Ambulance
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <AmbulanceIcon className="text-blue-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalAmbulances}</div>
                <div className="text-sm text-gray-400">Total Ambulances</div>
                <div className="text-xs text-emerald-500">+1 from last month</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <AmbulanceIcon className="text-emerald-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{availableCount}</div>
                <div className="text-sm text-gray-400">Available Ambulances</div>
                <div className="text-xs text-gray-500">2 on call, 1 in maintenance</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Wrench className="text-orange-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{maintenanceCount}</div>
                <div className="text-sm text-gray-400">Maintenance Due</div>
                <div className="text-xs text-orange-500">Next scheduled: May 20, 2023</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <MapPin className="text-blue-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{onCallCount}</div>
                <div className="text-sm text-gray-400">On Call</div>
                <div className="text-xs text-blue-500">Active emergency calls</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Ambulance Fleet</h2>
          <p className="text-gray-400 text-sm mb-6">View and manage all ambulances in your fleet.</p>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
            <div className="flex-1 flex items-center gap-2 bg-dark-tertiary rounded-lg px-4 w-full">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search ambulances..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent py-3 flex-1 outline-none"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field flex-1 md:flex-none"
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="dispatched">Dispatched</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-400">Loading ambulances...</div>
            </div>
          )}

          {!loading && filteredAmbulances.length === 0 && (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-400">No ambulances found. {ambulances.length === 0 ? 'Add a new ambulance to get started.' : ''}</div>
            </div>
          )}

          {!loading && filteredAmbulances.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-tertiary">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">ID</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Registration</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Name</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Driver</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Phone</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Location</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAmbulances.map((ambulance) => (
                  <tr key={ambulance.id} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <AmbulanceIcon className="text-blue-500" size={20} />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-white">{ambulance.registrationNumber}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-white">{ambulance.name}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ambulance.status)}`}>
                        {ambulance.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-300">{ambulance.driverName}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-300">{ambulance.driverPhone}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <span className="text-gray-300">{ambulance.location || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 relative">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === ambulance.id ? null : ambulance.id)}
                          className="p-2 hover:bg-dark-tertiary rounded transition-colors"
                        >
                          <MoreVertical size={18} className="text-gray-400" />
                        </button>

                        {openMenuId === ambulance.id && (
                          <div className="absolute right-0 mt-2 w-40 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-lg z-10 top-full">
                            <Link href={`/ambulance/details?id=${ambulance.id}`}>
                              <button className="w-full text-left px-4 py-2 hover:bg-dark-tertiary transition-colors flex items-center gap-2 text-gray-300 hover:text-white first:rounded-t-lg">
                                <Edit size={16} />
                                View Details
                              </button>
                            </Link>
                            <Link href={`/ambulance/edit/${ambulance.id}`}>
                              <button className="w-full text-left px-4 py-2 hover:bg-dark-tertiary transition-colors flex items-center gap-2 text-gray-300 hover:text-white">
                                <Edit size={16} />
                                Edit
                              </button>
                            </Link>
                            <button
                              onClick={() => {
                                handleDelete(ambulance.id);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-red-500/20 transition-colors flex items-center gap-2 text-red-400 hover:text-red-300 last:rounded-b-lg"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}

          {!loading && filteredAmbulances.length > 0 && (
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-dark-tertiary">
            <p className="text-gray-400 text-sm">
              Showing 1 to {filteredAmbulances.length} of {ambulances.length} ambulances
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
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
