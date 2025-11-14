'use client';

import Link from 'next/link';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Calendar, TrendingUp, Package, Users, BarChart3, ChevronRight } from 'lucide-react';

export default function ReportsPage() {
  const reportCards = [
    {
      icon: Calendar,
      title: 'Appointment Reports',
      description: 'Track appointment metrics, trends, and patient attendance',
      stats: [
        { label: 'Total Appointments', value: '1,248' },
        { label: 'Completion Rate', value: '70.2%' },
      ],
      href: '/reports/appointment',
      color: 'from-blue-500/10 to-blue-500/5',
      iconColor: 'text-blue-500',
    },
    {
      icon: TrendingUp,
      title: 'Financial Reports',
      description: 'Track revenue, expenses, and financial performance metrics',
      stats: [
        { label: 'Total Revenue', value: '$128,450' },
        { label: 'Net Profit', value: '$41,125' },
      ],
      href: '/reports/financial',
      color: 'from-emerald-500/10 to-emerald-500/5',
      iconColor: 'text-emerald-500',
    },
    {
      icon: Package,
      title: 'Inventory Reports',
      description: 'Track inventory levels, usage patterns, and supply chain metrics',
      stats: [
        { label: 'Total Items', value: '1,245' },
        { label: 'Inventory Value', value: '$248,320' },
      ],
      href: '/reports/inventory',
      color: 'from-purple-500/10 to-purple-500/5',
      iconColor: 'text-purple-500',
    },
    {
      icon: Users,
      title: 'Patient Visit Reports',
      description: 'Analyze patient visits, demographics, and health trends',
      stats: [
        { label: 'Total Visits', value: '3,842' },
        { label: 'New Patients', value: '428' },
      ],
      href: '/reports/patient-visit',
      color: 'from-yellow-500/10 to-yellow-500/5',
      iconColor: 'text-yellow-500',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reports</h1>
          <p className="text-gray-400">Access and generate detailed reports for your clinic</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportCards.map((report, index) => {
            const Icon = report.icon;
            return (
              <Link
                key={index}
                href={report.href}
                className={`group card bg-gradient-to-br ${report.color} border border-dark-tertiary hover:border-dark-secondary transition-all duration-300 cursor-pointer`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-lg bg-dark-tertiary group-hover:bg-dark-secondary transition-colors`}>
                    <Icon size={24} className={report.iconColor} />
                  </div>
                  <ChevronRight size={20} className="text-gray-500 group-hover:text-gray-300 transition-colors" />
                </div>

                <h2 className="text-xl font-semibold mb-2">{report.title}</h2>
                <p className="text-gray-400 text-sm mb-4">{report.description}</p>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-dark-tertiary">
                  {report.stats.map((stat, statIndex) => (
                    <div key={statIndex}>
                      <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                      <p className="text-lg font-semibold text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={24} className="text-emerald-500" />
            <h2 className="text-2xl font-semibold">Quick Stats</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card">
              <p className="text-gray-400 text-sm mb-2">Total Appointments</p>
              <h3 className="text-3xl font-bold text-blue-500">1,248</h3>
              <p className="text-xs text-emerald-500 mt-2">+12% from last month</p>
            </div>
            <div className="card">
              <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
              <h3 className="text-3xl font-bold text-emerald-500">$128K</h3>
              <p className="text-xs text-emerald-500 mt-2">+15.2% from last month</p>
            </div>
            <div className="card">
              <p className="text-gray-400 text-sm mb-2">Inventory Items</p>
              <h3 className="text-3xl font-bold text-purple-500">1,245</h3>
              <p className="text-xs text-emerald-500 mt-2">+28 items this month</p>
            </div>
            <div className="card">
              <p className="text-gray-400 text-sm mb-2">Patient Visits</p>
              <h3 className="text-3xl font-bold text-yellow-500">3,842</h3>
              <p className="text-xs text-emerald-500 mt-2">+18.3% from last month</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
