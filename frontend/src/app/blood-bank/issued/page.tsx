'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ActionModal from '@/components/UI/ActionModal';
import { Search, Plus, Droplet, AlertCircle, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { bloodBankAPI } from '@/lib/api';

interface IssuedBlood {
  id: string;
  issueId: string;
  recipient: string;
  recipientId?: string;
  bloodType: string;
  units: number;
  issueDate: string;
  requestingDoctor: string;
  purpose: string;
  department: string;
  status: string;
}

export default function IssuedBloodPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [issuedBlood, setIssuedBlood] = useState<IssuedBlood[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIssuedBlood();
  }, []);

  const fetchIssuedBlood = async () => {
    try {
      setLoading(true);
      const response = await bloodBankAPI.getIssues();
      const data = response.data;
      if (data.success) {
        setIssuedBlood(data.data);
      }
    } catch (error) {
      console.error('Error fetching issued blood:', error);
      alert('Failed to fetch issued blood records. Please ensure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'Pending':
        return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
      case 'Completed':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  const getBloodTypeColor = (bloodType: string) => {
    return bloodType.includes('+') 
      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
      : 'bg-red-500/10 text-red-500 border border-red-500/20';
  };

  const getDepartmentColor = (department: string) => {
    const colors: { [key: string]: string } = {
      'Surgery': 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
      'Emergency': 'bg-red-500/10 text-red-500 border border-red-500/20',
      'Cardiology': 'bg-pink-500/10 text-pink-500 border border-pink-500/20',
      'Internal Medicine': 'bg-purple-500/10 text-purple-500 border border-purple-500/20',
      'Obstetrics': 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20',
      'Oncology': 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20',
      'Nephrology': 'bg-teal-500/10 text-teal-500 border border-teal-500/20'
    };
    return colors[department] || 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
  };

  const filteredIssues = issuedBlood.filter(issue => {
    const matchesSearch = issue.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.issueId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.requestingDoctor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBloodType = bloodTypeFilter === 'all' || issue.bloodType === bloodTypeFilter;
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || issue.department === departmentFilter;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'patient' && true) ||
                      (activeTab === 'external' && false) ||
                      (activeTab === 'emergency' && issue.department === 'Emergency');
    return matchesSearch && matchesBloodType && matchesStatus && matchesDepartment && matchesTab;
  });

  const totalUnitsIssued = issuedBlood.reduce((sum, issue) => sum + issue.units, 0);
  const issuedThisMonth = issuedBlood.length;
  const emergencyIssues = issuedBlood.filter(i => i.department === 'Emergency').length;
  const crossMatchedUnits = issuedBlood.filter(i => i.status === 'Completed').reduce((sum, i) => sum + i.units, 0);

  const issuesByBloodType = [
    { type: 'A+', units: 2 },
    { type: 'A-', units: 1 },
    { type: 'AB+', units: 2 },
    { type: 'AB-', units: 1 },
    { type: 'B+', units: 3 },
    { type: 'B-', units: 1 },
    { type: 'O+', units: 8 },
    { type: 'O-', units: 1 }
  ];

  const issuesByDepartment = [
    { department: 'External', units: 6, color: 'bg-blue-500' },
    { department: 'Emergency', units: 5, color: 'bg-emerald-500' },
    { department: 'Surgery', units: 2, color: 'bg-yellow-500' },
    { department: 'Cardiology', units: 2, color: 'bg-red-500' },
    { department: 'Internal Medicine', units: 1, color: 'bg-purple-500' },
    { department: 'Obstetrics', units: 1, color: 'bg-pink-500' },
    { department: 'Oncology', units: 1, color: 'bg-indigo-500' },
    { department: 'Nephrology', units: 1, color: 'bg-cyan-500' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Issued Blood</h1>
            <p className="text-gray-400">Manage issued blood units and track transfusions</p>
          </div>
          <Link href="/blood-bank/issue">
            <button className="btn-primary flex items-center gap-2">
              <Plus size={20} />
              Issue Blood
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Droplet className="text-blue-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalUnitsIssued}</div>
                <div className="text-sm text-gray-400">Total Units Issued</div>
                <div className="text-xs text-red-500">+14 from last month</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Droplet className="text-blue-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{issuedThisMonth}</div>
                <div className="text-sm text-gray-400">Issued This Month</div>
                <div className="text-xs text-blue-500">+3 compared to last month</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-red-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{emergencyIssues}</div>
                <div className="text-sm text-gray-400">Emergency Issues</div>
                <div className="text-xs text-red-500">Critical situations handled</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <Droplet className="text-emerald-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{crossMatchedUnits}</div>
                <div className="text-sm text-gray-400">Cross-Matched Units</div>
                <div className="text-xs text-emerald-500">Compatibility verified</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Issues by Blood Type</h2>
            
            <div className="space-y-3">
              {issuesByBloodType.map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="font-semibold w-12">{item.type}</span>
                    <div className="flex-1 bg-dark-tertiary rounded-full h-2">
                      <div
                        className={`h-full ${item.type.includes('+') ? 'bg-blue-500' : 'bg-red-500'} rounded-full`}
                        style={{ width: `${(item.units / 8) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-white font-medium ml-3">{item.units} units</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Issues by Department</h2>
            
            <div className="space-y-3">
              {issuesByDepartment.map((item) => (
                <div key={item.department} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm text-gray-300 w-32">{item.department}</span>
                    <div className="flex-1 bg-dark-tertiary rounded-full h-2">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${(item.units / 6) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-white font-medium ml-3">{item.units} units</span>
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
              placeholder="Search issuances..."
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
              All Issues
            </button>
            <button
              onClick={() => setActiveTab('patient')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'patient'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Patient
            </button>
            <button
              onClick={() => setActiveTab('external')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'external'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              External
            </button>
            <button
              onClick={() => setActiveTab('emergency')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'emergency'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Emergency
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
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Departments</option>
              <option value="Surgery">Surgery</option>
              <option value="Emergency">Emergency</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Internal Medicine">Internal Medicine</option>
            </select>
            <div className="flex gap-2 ml-auto">
              <button className="btn-secondary">Refresh</button>
              <button className="btn-secondary">Export</button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading issued blood records...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-tertiary">
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Issue ID</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Recipient</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Blood Type</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Issue Date</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Requesting Doctor</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Purpose</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Department</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIssues.map((issue) => (
                    <tr key={issue.id} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                      <td className="py-4 px-4 text-gray-300">{issue.issueId}</td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-white">{issue.recipient}</div>
                        <div className="text-sm text-gray-400">{issue.recipientId || 'N/A'}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBloodTypeColor(issue.bloodType)}`}>
                          {issue.bloodType} {issue.units} unit{issue.units > 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-300">{new Date(issue.issueDate).toLocaleString()}</td>
                      <td className="py-4 px-4 text-gray-300">{issue.requestingDoctor}</td>
                      <td className="py-4 px-4 text-gray-300">{issue.purpose}</td>
                      <td className="py-4 px-4 text-gray-300">{issue.department}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                          {issue.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
