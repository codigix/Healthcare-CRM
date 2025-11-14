'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, Building2, Users, Stethoscope, MoreVertical, Edit, Trash2, Plus, Eye } from 'lucide-react';
import Link from 'next/link';
import { departmentAPI } from '@/lib/api';

interface Department {
  id: string;
  name: string;
  head: string;
  staffCount: number;
  services: number;
  status: 'Active' | 'Inactive';
  location: string;
}

interface Statistics {
  totalDepartments: number;
  activeDepartments: number;
  totalStaff: number;
  totalServices: number;
}

export default function DepartmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<Statistics>({
    totalDepartments: 0,
    activeDepartments: 0,
    totalStaff: 0,
    totalServices: 0,
  });
  const [editForm, setEditForm] = useState({
    name: '',
    head: '',
    location: '',
    staffCount: 0,
    services: 0,
    status: 'Active' as 'Active' | 'Inactive',
  });

  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [deptRes, statsRes] = await Promise.all([
          departmentAPI.list(1, 100),
          departmentAPI.getStatistics(),
        ]);

        setDepartments(deptRes.data.departments || []);
        setStatistics(statsRes.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch departments');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'Inactive':
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  const handleView = (dept: Department) => {
    setViewingId(dept.id);
    setOpenMenuId(null);
  };

  const handleEdit = (dept: Department) => {
    setEditingId(dept.id);
    setEditForm({
      name: dept.name,
      head: dept.head,
      location: dept.location,
      staffCount: dept.staffCount,
      services: dept.services,
      status: dept.status,
    });
    setOpenMenuId(null);
  };

  const handleSaveEdit = async () => {
    if (editingId && editForm.name && editForm.head && editForm.location) {
      try {
        const payload = {
          name: editForm.name,
          head: editForm.head,
          location: editForm.location,
          staffCount: editForm.staffCount,
          services: editForm.services,
          status: editForm.status,
        };
        await departmentAPI.update(editingId, payload);
        const deptRes = await departmentAPI.list(1, 100);
        setDepartments(deptRes.data.departments || []);
        setEditingId(null);
      } catch (err) {
        console.error('Failed to update department', err);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentAPI.delete(id);
        setDepartments(prev => prev.filter(dept => dept.id !== id));
        setOpenMenuId(null);
      } catch (err) {
        console.error('Failed to delete department', err);
      }
    }
  };

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dept.head.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dept.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || dept.status === statusFilter;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && dept.status === 'Active') ||
                      (activeTab === 'inactive' && dept.status === 'Inactive');
    return matchesSearch && matchesStatus && matchesTab;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Departments</h1>
            <p className="text-gray-400">Manage your clinic's departments and staff assignments</p>
          </div>
          <div className="flex gap-3">
            <Link href="/departments/add" className="btn-primary">
              + Add Department
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading departments...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Building2 className="text-blue-500" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{statistics.totalDepartments}</div>
                  <div className="text-sm text-gray-400">Total Departments</div>
                  <div className="text-xs text-blue-500">{statistics.activeDepartments} active</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <Users className="text-emerald-500" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{statistics.totalStaff}</div>
                  <div className="text-sm text-gray-400">Total Staff</div>
                  <div className="text-xs text-emerald-500">Across all departments</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Stethoscope className="text-purple-500" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{statistics.totalServices}</div>
                  <div className="text-sm text-gray-400">Services Offered</div>
                  <div className="text-xs text-purple-500">Total available services</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Department List</h2>
          <p className="text-gray-400 text-sm mb-6">View and manage all departments in your clinic</p>

          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-dark-tertiary">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search departments..."
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
              All Departments
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'active'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('inactive')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'inactive'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Inactive
            </button>
          </div>

          <div className="flex gap-3 mb-6">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <Link href="/departments/add" className="btn-primary ml-auto flex items-center gap-2">
              <Plus size={20} />
              Add Department
            </Link>
            <button className="btn-secondary">Export</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-tertiary">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Department Name</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Head of Department</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Staff Count</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Services</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepartments.map((dept) => (
                  <tr key={dept.id} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium text-white">{dept.name}</div>
                      <div className="text-sm text-gray-400">{dept.location}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-white">{dept.head}</div>
                      <div className="text-sm text-gray-400">{dept.id}</div>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{dept.staffCount}</td>
                    <td className="py-4 px-4 text-gray-300">{dept.services}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(dept.status)}`}>
                        {dept.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 relative">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === dept.id ? null : dept.id)}
                          className="p-2 hover:bg-dark-tertiary rounded transition-colors"
                        >
                          <MoreVertical size={18} className="text-gray-400" />
                        </button>

                        {openMenuId === dept.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-lg z-10 top-full">
                            <button
                              onClick={() => handleView(dept)}
                              className="w-full text-left px-4 py-2 hover:bg-dark-tertiary transition-colors flex items-center gap-2 text-gray-300 hover:text-white first:rounded-t-lg"
                            >
                              <Eye size={16} />
                              View
                            </button>
                            <button
                              onClick={() => handleEdit(dept)}
                              className="w-full text-left px-4 py-2 hover:bg-dark-tertiary transition-colors flex items-center gap-2 text-gray-300 hover:text-white"
                            >
                              <Edit size={16} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(dept.id)}
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
        </div>

        {viewingId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              {departments.find(d => d.id === viewingId) && (
                <>
                  <h3 className="text-xl font-semibold mb-6">{departments.find(d => d.id === viewingId)?.name}</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Department ID</label>
                      <p className="text-gray-400">{viewingId}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Head of Department</label>
                      <p className="text-gray-400">{departments.find(d => d.id === viewingId)?.head}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                      <p className="text-gray-400">{departments.find(d => d.id === viewingId)?.location}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Staff Count</label>
                      <p className="text-gray-400">{departments.find(d => d.id === viewingId)?.staffCount}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Services Offered</label>
                      <p className="text-gray-400">{departments.find(d => d.id === viewingId)?.services}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(departments.find(d => d.id === viewingId)?.status || 'Active')}`}>
                        {departments.find(d => d.id === viewingId)?.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setViewingId(null)}
                      className="flex-1 btn-secondary"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {editingId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4">Edit Department</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Department Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field w-full"
                    placeholder="Department name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Head of Department</label>
                  <input
                    type="text"
                    value={editForm.head}
                    onChange={(e) => setEditForm(prev => ({ ...prev, head: e.target.value }))}
                    className="input-field w-full"
                    placeholder="Doctor name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    className="input-field w-full"
                    placeholder="Location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Staff Count</label>
                  <input
                    type="number"
                    value={editForm.staffCount}
                    onChange={(e) => setEditForm(prev => ({ ...prev, staffCount: parseInt(e.target.value) || 0 }))}
                    className="input-field w-full"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Services Offered</label>
                  <input
                    type="number"
                    value={editForm.services}
                    onChange={(e) => setEditForm(prev => ({ ...prev, services: parseInt(e.target.value) || 0 }))}
                    className="input-field w-full"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as 'Active' | 'Inactive' }))}
                    className="input-field w-full"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 btn-primary"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
