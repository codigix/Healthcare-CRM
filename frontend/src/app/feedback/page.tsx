'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, Download, Plus, Eye, MessageCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface Survey {
  id: string;
  title: string;
  description: string;
  totalResponses: number;
  averageRating: number;
  completionRate: number;
  status: 'Active' | 'Completed' | 'Draft';
  createdDate: string;
  lastUpdated: string;
}

export default function FeedbackManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('surveys');

  const surveys: Survey[] = [
    {
      id: 'SRV001',
      title: 'Patient Satisfaction Survey',
      description: 'General satisfaction survey for all patients',
      totalResponses: 128,
      averageRating: 4.2,
      completionRate: 75,
      status: 'Active',
      createdDate: '3/10/2025',
      lastUpdated: '4/10/2025',
    },
    {
      id: 'SRV002',
      title: 'Emergency Department Experience',
      description: 'Feedback on emergency department visits',
      totalResponses: 84,
      averageRating: 3.8,
      completionRate: 65,
      status: 'Active',
      createdDate: '2/20/2025',
      lastUpdated: '4/10/2025',
    },
    {
      id: 'SRV003',
      title: 'Staff Performance Review',
      description: 'Staff performance and courtesy feedback',
      totalResponses: 92,
      averageRating: 4.5,
      completionRate: 80,
      status: 'Completed',
      createdDate: '1/15/2025',
      lastUpdated: '3/20/2025',
    },
    {
      id: 'SRV004',
      title: 'Facility Cleanliness Survey',
      description: 'General facility cleanliness and maintenance',
      totalResponses: 156,
      averageRating: 4.1,
      completionRate: 88,
      status: 'Active',
      createdDate: '2/01/2025',
      lastUpdated: '4/05/2025',
    },
    {
      id: 'SRV005',
      title: 'Doctor Consultation Quality',
      description: 'Doctor consultation quality and time spent',
      totalResponses: 67,
      averageRating: 4.3,
      completionRate: 72,
      status: 'Active',
      createdDate: '3/05/2025',
      lastUpdated: '4/08/2025',
    },
  ];

  const filteredSurveys = surveys.filter((survey) =>
    survey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    survey.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSurveys = surveys.length;
  const totalResponses = surveys.reduce((sum, s) => sum + s.totalResponses, 0);
  const avgRating = (surveys.reduce((sum, s) => sum + s.averageRating, 0) / surveys.length).toFixed(2);
  const avgCompletion = Math.round(surveys.reduce((sum, s) => sum + s.completionRate, 0) / surveys.length);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Completed':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Draft':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Feedback Management</h1>
            <p className="text-gray-400 mt-2">Create and manage patient feedback surveys</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Surveys</p>
                <p className="text-2xl font-bold text-white mt-1">{totalSurveys}</p>
                <p className="text-xs text-gray-500 mt-1">Active surveys</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="text-emerald-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Responses</p>
                <p className="text-2xl font-bold text-white mt-1">{totalResponses}</p>
                <p className="text-xs text-gray-500 mt-1">From all surveys</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-blue-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Average Rating</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">{avgRating}/5</p>
                <p className="text-xs text-gray-500 mt-1">Overall satisfaction score</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <span className="text-amber-400 text-xl">⭐</span>
              </div>
            </div>
          </div>

          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completion Rate</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">{avgCompletion}%</p>
                <p className="text-xs text-gray-500 mt-1">Average completion percentage</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <span className="text-emerald-400 text-xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search surveys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 pl-10 pr-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium">
              <Plus size={18} />
              <span>Create Survey</span>
            </button>
          </div>

          <div className="flex gap-2 mb-6 border-b border-dark-tertiary">
            <button
              onClick={() => setActiveTab('surveys')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'surveys'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Surveys
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'recent'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Recent Responses
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Analytics
            </button>
          </div>

          {activeTab === 'surveys' && (
            <div className="space-y-4">
              {filteredSurveys.map((survey) => (
                <div
                  key={survey.id}
                  className="bg-dark-tertiary rounded-lg p-4 hover:bg-dark-tertiary/70 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{survey.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{survey.description}</p>
                    </div>
                    <button className="p-2 hover:bg-dark-secondary rounded text-gray-400 hover:text-emerald-400 transition-colors">
                      <Eye size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-400">Responses</p>
                      <p className="text-lg font-semibold text-white">{survey.totalResponses}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Average Rating</p>
                      <p className="text-lg font-semibold text-amber-400">{survey.averageRating}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Completion Rate</p>
                      <p className="text-lg font-semibold text-emerald-400">{survey.completionRate}%</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          survey.status
                        )}`}
                      >
                        {survey.status}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-dark-secondary rounded-full h-1">
                    <div
                      className="bg-emerald-500 h-1 rounded-full"
                      style={{ width: `${survey.completionRate}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Created on {survey.createdDate} • Last updated {survey.lastUpdated}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'recent' && (
            <div className="text-center py-8">
              <MessageCircle className="mx-auto text-gray-500 mb-3" size={40} />
              <p className="text-gray-400">Recent responses will appear here</p>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="text-center py-8">
              <TrendingUp className="mx-auto text-gray-500 mb-3" size={40} />
              <p className="text-gray-400">Analytics dashboard will appear here</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
