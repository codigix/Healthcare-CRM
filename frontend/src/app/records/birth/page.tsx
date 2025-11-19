'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, Download, Plus, Edit, Trash2, MoreVertical, Filter } from 'lucide-react';
import Link from 'next/link';
import { recordsAPI } from '@/lib/api';

interface BirthRecord {
  id: string;
  childName: string;
  dateOfBirth: string;
  parents: string;
  attendingDoctor: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  weight: string;
  gender: string;
  hospitalName: string;
}

export default function BirthRecordsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [birthRecords, setBirthRecords] = useState<BirthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: string | null }>({ show: false, id: null });
  const [statusUpdate, setStatusUpdate] = useState<{ show: boolean; id: string | null; status: string }>({ show: false, id: null, status: '' });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await recordsAPI.list(1, 100, 'birth');
      const records = response.data.records.map((record: any) => {
        const details = typeof record.details === 'string' ? JSON.parse(record.details) : record.details;
        return {
          id: record.id,
          childName: details.childName || record.patientName || '',
          dateOfBirth: record.date?.split('T')[0] || '',
          parents: details.parents || '',
          attendingDoctor: details.attendingDoctor || '',
          status: record.status || 'Pending',
          weight: details.weight || '',
          gender: details.gender || '',
          hospitalName: details.hospitalName || '',
        };
      });
      setBirthRecords(records);
    } catch (error) {
      console.error('Failed to fetch records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await recordsAPI.delete(id);
      setBirthRecords(prev => prev.filter(r => r.id !== id));
      setDeleteConfirm({ show: false, id: null });
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await recordsAPI.updateStatus(id, newStatus);
      setBirthRecords(prev =>
        prev.map(r => (r.id === id ? { ...r, status: newStatus as any } : r))
      );
      setStatusUpdate({ show: false, id: null, status: '' });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Rejected':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const filteredRecords = birthRecords.filter((record) => {
    const matchesSearch =
      record.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.parents.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'verified') return matchesSearch && record.status === 'Verified';
    if (activeTab === 'pending') return matchesSearch && record.status === 'Pending';
    return matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Birth Records</h1>
            <p className="text-gray-400 mt-2">Manage and track all birth records in the system</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>

        <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 pl-10 pr-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <Link href="/records/birth/add">
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium">
                <Plus size={18} />
                <span>Add Record</span>
              </button>
            </Link>
          </div>

          <div className="flex gap-2 mb-6 border-b border-dark-tertiary">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'all'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => setActiveTab('verified')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'verified'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Verified
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Pending
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400">
              Loading records...
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No records found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-tertiary">
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                      Record ID
                    </th>
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                      Child Name
                    </th>
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                      Date of Birth
                    </th>
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                      Parents
                    </th>
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                      Attending Doctor
                    </th>
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-white text-sm font-medium">{record.id}</td>
                      <td className="px-4 py-3 text-white text-sm font-medium">{record.childName}</td>
                      <td className="px-4 py-3 text-gray-300 text-sm">{record.dateOfBirth}</td>
                      <td className="px-4 py-3 text-gray-300 text-sm">{record.parents}</td>
                      <td className="px-4 py-3 text-gray-300 text-sm">{record.attendingDoctor}</td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => setStatusUpdate({ show: true, id: record.id, status: record.status })}
                          className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(
                            record.status
                          )}`}
                        >
                          {record.status}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Link href={`/records/birth/edit/${record.id}`}>
                            <button className="p-1 hover:bg-dark-tertiary rounded text-gray-400 hover:text-blue-400 transition-colors">
                              <Edit size={16} />
                            </button>
                          </Link>
                          <button
                            onClick={() => setDeleteConfirm({ show: true, id: record.id })}
                            className="p-1 hover:bg-dark-tertiary rounded text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
            <span>Showing {filteredRecords.length} records</span>
          </div>
        </div>
      </div>

      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Record</h3>
            <p className="text-gray-400 mb-6">Are you sure you want to delete this birth record? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm({ show: false, id: null })}
                className="px-4 py-2 bg-dark-tertiary hover:bg-dark-tertiary/80 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteConfirm.id && handleDelete(deleteConfirm.id)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {statusUpdate.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-white mb-4">Update Status</h3>
            <select
              value={statusUpdate.status}
              onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
              className="input-field w-full mb-6"
            >
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setStatusUpdate({ show: false, id: null, status: '' })}
                className="px-4 py-2 bg-dark-tertiary hover:bg-dark-tertiary/80 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => statusUpdate.id && handleStatusUpdate(statusUpdate.id, statusUpdate.status)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
