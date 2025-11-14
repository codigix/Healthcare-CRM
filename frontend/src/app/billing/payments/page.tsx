'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, DollarSign, CreditCard, MoreVertical } from 'lucide-react';

interface Payment {
  id: string;
  patient: string;
  patientId: string;
  invoiceId: string;
  date: string;
  amount: number;
  method: string;
  status: 'Completed' | 'Pending' | 'Failed' | 'Processing';
}

export default function PaymentsHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const [payments] = useState<Payment[]>([
    {
      id: 'PMT-007',
      patient: 'Michael Johnson',
      patientId: 'P-00145',
      invoiceId: 'INV-002',
      date: '2024-04-08',
      amount: 1000.00,
      method: 'Credit Card',
      status: 'Pending'
    },
    {
      id: 'PMT-006',
      patient: 'Emily Davis',
      patientId: 'P-00289',
      invoiceId: 'INV-003',
      date: '2024-04-08',
      amount: 1000.00,
      method: 'Credit Card',
      status: 'Failed'
    },
    {
      id: 'PMT-005',
      patient: 'John Smith',
      patientId: 'P-00312',
      invoiceId: 'INV-001',
      date: '2024-04-08',
      amount: 1000.00,
      method: 'Debit Card',
      status: 'Completed'
    },
    {
      id: 'PMT-004',
      patient: 'Robert Wilson',
      patientId: 'P-00156',
      invoiceId: 'INV-004',
      date: '2024-04-08',
      amount: 675.00,
      method: 'Debit Card',
      status: 'Completed'
    },
    {
      id: 'PMT-003',
      patient: 'Jessica Brown',
      patientId: 'P-00198',
      invoiceId: 'INV-004',
      date: '2024-04-08',
      amount: 2345.00,
      method: 'Bank Transfer',
      status: 'Completed'
    },
    {
      id: 'PMT-002',
      patient: 'Sarah Thompson',
      patientId: 'P-00234',
      invoiceId: 'INV-006',
      date: '2024-04-06',
      amount: 3456.00,
      method: 'Cash',
      status: 'Completed'
    },
    {
      id: 'PMT-001',
      patient: 'John Smith',
      patientId: 'P-00267',
      invoiceId: 'INV-001',
      date: '2024-04-01',
      amount: 845.00,
      method: 'Insurance',
      status: 'Processing'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'Pending':
        return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
      case 'Failed':
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'Processing':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.invoiceId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'completed' && payment.status === 'Completed') ||
                      (activeTab === 'pending' && payment.status === 'Pending') ||
                      (activeTab === 'failed' && payment.status === 'Failed');
    return matchesSearch && matchesStatus && matchesMethod && matchesTab;
  });

  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);
  const failedPayments = payments.filter(p => p.status === 'Failed').reduce((sum, p) => sum + p.amount, 0);

  const paymentMethods = [
    { method: 'Credit Card', count: 1 },
    { method: 'Debit Card', count: 1 },
    { method: 'Bank Transfer', count: 1 },
    { method: 'Cash', count: 1 },
    { method: 'Insurance', count: 1 },
    { method: 'Other', count: 1 }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Payments History</h1>
            <p className="text-gray-400">Track and manage all payment transactions</p>
          </div>
          <div className="flex gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input-field"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="text-emerald-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">${totalPayments.toFixed(2)}</div>
                <div className="text-sm text-gray-400">Total Payments</div>
                <div className="text-xs text-emerald-500">All time collected</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="text-orange-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">${pendingPayments.toFixed(2)}</div>
                <div className="text-sm text-gray-400">Pending Payments</div>
                <div className="text-xs text-orange-500">Awaiting processing</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="text-red-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">${failedPayments.toFixed(2)}</div>
                <div className="text-sm text-gray-400">Failed Payments</div>
                <div className="text-xs text-red-500">Require attention</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <CreditCard className="text-blue-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{paymentMethods.length}</div>
                <div className="text-sm text-gray-400">Payment Methods</div>
                <div className="text-xs text-blue-500">Available options</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {paymentMethods.map((pm) => (
              <div key={pm.method} className="p-4 bg-dark-tertiary/30 rounded-lg text-center">
                <div className="text-2xl font-bold mb-1">{pm.count}</div>
                <div className="text-sm text-gray-400">{pm.method}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-6">All Payments</h2>
          <p className="text-gray-400 text-sm mb-6">View and analyze payment transactions</p>

          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-dark-tertiary">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search payments..."
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
              All Payments
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'completed'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab('failed')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'failed'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Failed
            </button>
          </div>

          <div className="flex gap-3 mb-6">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Processing">Processing</option>
            </select>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Methods</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
              <option value="Insurance">Insurance</option>
            </select>
            <button className="btn-secondary ml-auto">Export</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-tertiary">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Payment ID</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Patient</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Invoice</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Date</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Amount</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Method</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                    <td className="py-4 px-4 text-gray-300 font-medium">{payment.id}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center font-semibold text-emerald-500">
                          {payment.patient.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium text-white">{payment.patient}</div>
                          <div className="text-sm text-gray-400">{payment.patientId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{payment.invoiceId}</td>
                    <td className="py-4 px-4 text-gray-300">{payment.date}</td>
                    <td className="py-4 px-4 text-white font-medium">${payment.amount.toFixed(2)}</td>
                    <td className="py-4 px-4 text-gray-300">{payment.method}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
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
