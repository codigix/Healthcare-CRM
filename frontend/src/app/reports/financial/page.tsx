'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';

interface FinancialTransaction {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export default function FinancialReportsPage() {
  const [dateRange, setDateRange] = useState('Nov 12, 2025 - Nov 12, 2025');
  const [department, setDepartment] = useState('All Departments');
  const [service, setService] = useState('All Services');
  const [activeTab, setActiveTab] = useState('overview');

  const financialStats = [
    { label: 'Total Revenue', value: '$128,450', change: '+15.2% from last month', color: 'text-emerald-500', icon: TrendingUp },
    { label: 'Total Expenses', value: '$87,325', change: '-5.4% from last month', color: 'text-blue-500', icon: TrendingDown },
    { label: 'Net Profit', value: '$41,125', change: '+12.3% from last month', color: 'text-yellow-500', icon: TrendingUp },
    { label: 'Outstanding Payments', value: '$23,540', change: '+1.5% from last month', color: 'text-red-500', icon: TrendingUp },
  ];

  const revenueVsExpenses = [
    { month: 'Jan', revenue: 98000, expenses: 65000, profit: 33000 },
    { month: 'Feb', revenue: 105000, expenses: 71000, profit: 34000 },
    { month: 'Mar', revenue: 112000, expenses: 78000, profit: 34000 },
    { month: 'Apr', revenue: 118000, expenses: 82000, profit: 36000 },
    { month: 'May', revenue: 125000, expenses: 85000, profit: 40000 },
    { month: 'Jun', revenue: 128450, expenses: 87325, profit: 41125 },
  ];

  const revenueByDepartment = [
    { name: 'Cardiology', value: 28, fill: '#3b82f6' },
    { name: 'Orthopedics', value: 22, fill: '#10b981' },
    { name: 'Neurology', value: 18, fill: '#f59e0b' },
    { name: 'Pediatrics', value: 14, fill: '#ec4899' },
    { name: 'Dermatology', value: 10, fill: '#8b5cf6' },
    { name: 'Other', value: 8, fill: '#6b7280' },
  ];

  const expenseBreakdown = [
    { month: 'Jan', staffCost: 35000, medicalSupplies: 18000, utilities: 8000, maintenance: 4000 },
    { month: 'Feb', staffCost: 38000, medicalSupplies: 20000, utilities: 8500, maintenance: 4500 },
    { month: 'Mar', staffCost: 40000, medicalSupplies: 22000, utilities: 9000, maintenance: 7000 },
    { month: 'Apr', staffCost: 42000, medicalSupplies: 24000, utilities: 9500, maintenance: 6500 },
    { month: 'May', staffCost: 44000, medicalSupplies: 25000, utilities: 10000, maintenance: 6000 },
    { month: 'Jun', staffCost: 45000, medicalSupplies: 26000, utilities: 10325, maintenance: 6000 },
  ];

  const financialSummary = [
    { month: 'April 2025', revenue: '$118,000', expenses: '$82,000', profit: '$36,000', margin: '31%', growth: '+12.8%' },
    { month: 'March 2025', revenue: '$112,000', expenses: '$78,000', profit: '$34,000', margin: '30%', growth: '+8.5%' },
    { month: 'February 2025', revenue: '$105,000', expenses: '$71,000', profit: '$34,000', margin: '32%', growth: '+7.1%' },
    { month: 'January 2025', revenue: '$98,000', expenses: '$65,000', profit: '$33,000', margin: '34%', growth: '+5.2%' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Financial Reports</h1>
            <p className="text-gray-400">Track revenue, expenses, and financial performance metrics</p>
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
            { id: 'revenue', label: 'Revenue' },
            { id: 'expenses', label: 'Expenses' },
            { id: 'transactions', label: 'Transactions' },
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
            <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="px-4 py-2 bg-dark-tertiary rounded-lg text-white border border-dark-secondary focus:border-emerald-500 outline-none"
            >
              <option>All Departments</option>
              <option>Cardiology</option>
              <option>Orthopedics</option>
              <option>Neurology</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Service</label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="px-4 py-2 bg-dark-tertiary rounded-lg text-white border border-dark-secondary focus:border-emerald-500 outline-none"
            >
              <option>All Services</option>
              <option>Consultations</option>
              <option>Surgery</option>
              <option>Treatments</option>
            </select>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {financialStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="card">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                      <Icon size={18} className={stat.color} />
                    </div>
                    <h3 className={`text-2xl font-bold ${stat.color} my-2`}>{stat.value}</h3>
                    <p className="text-xs text-gray-500">{stat.change}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Revenue vs Expenses</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={revenueVsExpenses}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(45, 45, 45, 0.95)', border: 'none', borderRadius: '8px', color: 'white' }} formatter={(value) => `$${value}`} />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expenses" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="profit" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Revenue by Department</h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie data={revenueByDepartment} cx="50%" cy="50%" outerRadius={100} paddingAngle={2} dataKey="value">
                  {revenueByDepartment.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(45, 45, 45, 0.95)', border: 'none', borderRadius: '8px', color: 'white' }} formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Expense Breakdown by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expenseBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(45, 45, 45, 0.95)', border: 'none', borderRadius: '8px', color: 'white' }} formatter={(value) => `$${value}`} />
              <Legend />
              <Bar dataKey="staffCost" stackId="a" fill="#ef4444" name="Staff Cost" />
              <Bar dataKey="medicalSupplies" stackId="a" fill="#3b82f6" name="Medical Supplies" />
              <Bar dataKey="utilities" stackId="a" fill="#f59e0b" name="Utilities" />
              <Bar dataKey="maintenance" stackId="a" fill="#10b981" name="Maintenance" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Financial Summary</h2>
            <button className="text-emerald-500 hover:text-emerald-400 text-sm font-medium">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-tertiary">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Month</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Revenue</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Expenses</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Profit</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Margin</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Growth</th>
                </tr>
              </thead>
              <tbody>
                {financialSummary.map((row, index) => (
                  <tr key={index} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50">
                    <td className="py-3 px-4">{row.month}</td>
                    <td className="py-3 px-4 text-emerald-500 font-medium">{row.revenue}</td>
                    <td className="py-3 px-4 text-red-500">{row.expenses}</td>
                    <td className="py-3 px-4 text-yellow-500 font-medium">{row.profit}</td>
                    <td className="py-3 px-4">{row.margin}</td>
                    <td className="py-3 px-4 text-emerald-500">{row.growth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
          </>
        )}

        {(activeTab === 'revenue' || activeTab === 'expenses' || activeTab === 'transactions') && (
          <div className="card p-12 text-center">
            <p className="text-gray-400 text-lg">Coming soon...</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
