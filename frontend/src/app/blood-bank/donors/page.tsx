'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ActionModal from '@/components/UI/ActionModal';
import { Search, Plus, Users, Calendar, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { bloodBankAPI } from '@/lib/api';

interface Donor {
  id: string;
  name: string;
  bloodType: string;
  contact: string;
  email: string;
  lastDonation?: string;
  nextEligible?: string;
  totalDonations: number;
  status: string;
}

export default function BloodDonorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    bloodType: '',
    contact: '',
    email: '',
    status: '',
    nextEligible: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    phoneNumber: ''
  });

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const response = await bloodBankAPI.getDonors();
      const data = response.data;
      if (data.success) {
        setDonors(data.data);
      }
    } catch (error) {
      console.error('Error fetching donors:', error);
      alert('Failed to fetch donors. Please ensure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (donor: Donor) => {
    setSelectedDonor(donor);
    setViewModalOpen(true);
  };

  const handleEditDonor = (donor: Donor) => {
    setSelectedDonor(donor);
    setEditFormData({
      name: donor.name,
      bloodType: donor.bloodType,
      contact: donor.contact,
      email: donor.email,
      status: donor.status,
      nextEligible: donor.nextEligible ? new Date(donor.nextEligible).toISOString().split('T')[0] : '',
      dateOfBirth: '',
      gender: '',
      address: '',
      city: '',
      phoneNumber: ''
    });
    setEditModalOpen(true);
  };

  const handleDeleteDonor = (donor: Donor) => {
    setSelectedDonor(donor);
    setDeleteModalOpen(true);
  };

  const handleUpdateDonor = async () => {
    if (!selectedDonor) return;

    try {
      const submitData = {
        bloodType: editFormData.bloodType,
        contact: editFormData.contact,
        email: editFormData.email,
        status: editFormData.status,
        nextEligible: editFormData.nextEligible
      };
      const response = await bloodBankAPI.createDonor(submitData);

      if (response.data.success) {
        alert('Donor updated successfully!');
        setEditModalOpen(false);
        fetchDonors();
      } else {
        alert('Error: ' + (response.data.error || 'Failed to update donor'));
      }
    } catch (error) {
      console.error('Error updating donor:', error);
      alert('Error updating donor');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDonor) return;

    try {
      alert('Donor records cannot be deleted. You can mark them as ineligible instead.');
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting donor:', error);
      alert('Error deleting donor');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Eligible':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'Ineligible':
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'New Donor':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'Gold Donor':
        return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  const getBloodTypeColor = (bloodType: string) => {
    return bloodType.includes('+') 
      ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
      : 'bg-red-500/10 text-red-500 border border-red-500/20';
  };

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         donor.contact.includes(searchQuery) ||
                         donor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBloodType = bloodTypeFilter === 'all' || donor.bloodType === bloodTypeFilter;
    const matchesStatus = statusFilter === 'all' || donor.status === statusFilter;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'eligible' && donor.status === 'Eligible') ||
                      (activeTab === 'ineligible' && donor.status === 'Ineligible') ||
                      (activeTab === 'new' && donor.status === 'New Donor');
    return matchesSearch && matchesBloodType && matchesStatus && matchesTab;
  });

  const totalDonors = donors.length;
  const donationsThisMonth = donors.reduce((sum, d) => sum + d.totalDonations, 0);
  const eligibleDonors = donors.filter(d => d.status === 'Eligible').length;
  const frequentDonors = donors.filter(d => d.totalDonations >= 5).length;

  const bloodTypeDistribution = [
    { type: 'O+', percentage: 38, count: 94 },
    { type: 'A+', percentage: 16, count: 40 },
    { type: 'B+', percentage: 12, count: 30 },
    { type: 'AB+', percentage: 6, count: 15 },
    { type: 'O-', percentage: 9, count: 22 },
    { type: 'A-', percentage: 7, count: 17 },
    { type: 'B-', percentage: 6, count: 15 },
    { type: 'AB-', percentage: 4, count: 10 }
  ];

  const donationFrequency = [
    { label: 'First Time', count: 56, percentage: 23 },
    { label: '2-4 Times', count: 107, percentage: 43 },
    { label: '5-9 Times', count: 34, percentage: 14 },
    { label: '10-24 Times', count: 12, percentage: 5 },
    { label: '25+ Times', count: 8, percentage: 3 }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Blood Donors</h1>
            <p className="text-gray-400">Manage and track blood donors in your blood bank</p>
          </div>
          <Link href="/blood-bank/register-donor">
            <button className="btn-primary flex items-center gap-2">
              <Plus size={20} />
              Register New Donor
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Users className="text-blue-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalDonors}</div>
                <div className="text-sm text-gray-400">Total Donors</div>
                <div className="text-xs text-emerald-500">+5 from last month</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Calendar className="text-blue-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{donationsThisMonth}</div>
                <div className="text-sm text-gray-400">Donations This Month</div>
                <div className="text-xs text-blue-500">+3 compared to last month</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <Users className="text-emerald-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{eligibleDonors}</div>
                <div className="text-sm text-gray-400">Eligible Donors</div>
                <div className="text-xs text-emerald-500">Ready for donation</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Users className="text-purple-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{frequentDonors}</div>
                <div className="text-sm text-gray-400">Frequent Donors</div>
                <div className="text-xs text-purple-500">5+ donations</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Donors by Blood Type</h2>
            <p className="text-gray-400 text-sm mb-6">Distribution of registered donors by blood type</p>
            
            <div className="grid grid-cols-4 gap-4">
              {bloodTypeDistribution.map((item) => (
                <div key={item.type} className="text-center">
                  <div className={`h-32 rounded-lg flex flex-col items-center justify-end p-3 ${item.type.includes('+') ? 'bg-blue-500' : 'bg-red-500'}`} style={{ height: `${item.percentage * 3}px` }}>
                    <div className="text-white font-bold text-lg mb-1">{item.type}</div>
                  </div>
                  <div className="mt-2 text-sm text-gray-400">{item.percentage}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Donation Frequency</h2>
            <p className="text-gray-400 text-sm mb-6">Number of donors by donation frequency</p>
            
            <div className="space-y-4">
              {donationFrequency.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">{item.label}</span>
                    <span className="text-sm text-gray-400">{item.count}</span>
                  </div>
                  <div className="w-full bg-dark-tertiary rounded-full h-2">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                      style={{ width: `${item.percentage * 2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-dark-tertiary">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search donors..."
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
              All Donors
            </button>
            <button
              onClick={() => setActiveTab('eligible')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'eligible'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Eligible
            </button>
            <button
              onClick={() => setActiveTab('ineligible')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'ineligible'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Ineligible
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'new'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              New
            </button>
          </div>

          <div className="flex gap-3 mb-6">
            <select
              value={bloodTypeFilter}
              onChange={(e) => setBloodTypeFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Blood Types</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Statuses</option>
              <option value="Eligible">Eligible</option>
              <option value="Ineligible">Ineligible</option>
              <option value="New Donor">New Donor</option>
              <option value="Gold Donor">Gold Donor</option>
            </select>
            <button className="btn-secondary ml-auto">Export</button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading donors...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-tertiary">
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Donor</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Blood Type</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Contact</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Last Donation</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Total Donations</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonors.map((donor) => (
                    <tr key={donor.id} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center font-semibold text-emerald-500">
                            {donor.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-medium text-white">{donor.name}</div>
                            <div className="text-sm text-gray-400">{donor.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBloodTypeColor(donor.bloodType)}`}>
                          {donor.bloodType}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-300">{donor.contact}</div>
                        <div className="text-xs text-gray-400">{donor.email}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-300">{donor.lastDonation ? new Date(donor.lastDonation).toLocaleDateString() : 'Never'}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(donor.status)}`}>
                          {donor.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${donor.totalDonations >= 10 ? 'bg-yellow-500/10 text-yellow-500' : 'text-gray-300'}`}>
                          {donor.totalDonations}
                          {donor.totalDonations >= 10 && ' 🏆'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(donor)}
                            className="p-2 hover:bg-blue-500/20 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} className="text-blue-500" />
                          </button>
                          <button
                            onClick={() => handleEditDonor(donor)}
                            className="p-2 hover:bg-yellow-500/20 rounded transition-colors"
                            title="Edit Donor"
                          >
                            <Edit size={16} className="text-yellow-500" />
                          </button>
                          <button
                            onClick={() => handleDeleteDonor(donor)}
                            className="p-2 hover:bg-red-500/20 rounded transition-colors"
                            title="Delete Donor"
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      <ActionModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Donor Details"
      >
        {selectedDonor && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Name</label>
                <p className="text-white">{selectedDonor.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Blood Type</label>
                <p className="text-white">{selectedDonor.bloodType}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Contact</label>
                <p className="text-white">{selectedDonor.contact}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Email</label>
                <p className="text-white">{selectedDonor.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Status</label>
                <p className="text-white">{selectedDonor.status}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Total Donations</label>
                <p className="text-white">{selectedDonor.totalDonations}</p>
              </div>
            </div>
            {selectedDonor.lastDonation && (
              <div>
                <label className="block text-sm font-medium text-gray-400">Last Donation</label>
                <p className="text-white">{new Date(selectedDonor.lastDonation).toLocaleDateString()}</p>
              </div>
            )}
            {selectedDonor.nextEligible && (
              <div>
                <label className="block text-sm font-medium text-gray-400">Next Eligible</label>
                <p className="text-white">{new Date(selectedDonor.nextEligible).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        )}
      </ActionModal>

      {/* Edit Donor Modal */}
      <ActionModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Donor"
        actions={
          <>
            <button
              onClick={() => setEditModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateDonor}
              className="btn-primary"
            >
              Update Donor
            </button>
          </>
        }
      >
        {selectedDonor && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Blood Type</label>
                <select
                  value={editFormData.bloodType}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, bloodType: e.target.value }))}
                  className="input-field w-full"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contact</label>
                <input
                  type="text"
                  value={editFormData.contact}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, contact: e.target.value }))}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="input-field w-full"
                >
                  <option value="Eligible">Eligible</option>
                  <option value="Ineligible">Ineligible</option>
                  <option value="New Donor">New Donor</option>
                  <option value="Gold Donor">Gold Donor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Next Eligible Date</label>
                <input
                  type="date"
                  value={editFormData.nextEligible}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, nextEligible: e.target.value }))}
                  className="input-field w-full"
                />
              </div>
            </div>
          </div>
        )}
      </ActionModal>

      {/* Delete Confirmation Modal */}
      <ActionModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Donor"
        actions={
          <>
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="btn-primary bg-red-500 hover:bg-red-600"
            >
              Delete Donor
            </button>
          </>
        }
      >
        {selectedDonor && (
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-red-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Delete Donor</h3>
              <p className="text-gray-400 mb-4">
                Are you sure you want to delete donor <strong>{selectedDonor.name}</strong>?
                This action cannot be undone.
              </p>
              <div className="bg-dark-tertiary p-3 rounded-lg">
                <p className="text-sm text-gray-300">
                  <strong>Blood Type:</strong> {selectedDonor.bloodType}<br />
                  <strong>Contact:</strong> {selectedDonor.contact}<br />
                  <strong>Total Donations:</strong> {selectedDonor.totalDonations}
                </p>
              </div>
            </div>
          </div>
        )}
      </ActionModal>
    </DashboardLayout>
  );
}
