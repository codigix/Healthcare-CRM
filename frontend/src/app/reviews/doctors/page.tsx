'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, Download, Filter, MoreVertical, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface DoctorReview {
  id: string;
  doctorName: string;
  department: string;
  reviewerName: string;
  rating: number;
  reviewDate: string;
  status: 'Approved' | 'Pending' | 'Flagged';
  comment: string;
  helpful: number;
}

export default function DoctorReviewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const reviews: DoctorReview[] = [
    {
      id: 'DR001',
      doctorName: 'Dr. Sarah Johnson',
      department: 'Cardiology',
      reviewerName: 'Michael Thompson',
      rating: 5,
      reviewDate: '4/10/2025',
      status: 'Approved',
      comment: 'Excellent care and attention',
      helpful: 24,
    },
    {
      id: 'DR002',
      doctorName: 'Dr. Robert Chen',
      department: 'Neurology',
      reviewerName: 'Emily Wilson',
      rating: 4,
      reviewDate: '4/10/2025',
      status: 'Approved',
      comment: 'Very knowledgeable doctor',
      helpful: 18,
    },
    {
      id: 'DR003',
      doctorName: 'Dr. Lisa Wong',
      department: 'Orthopedics',
      reviewerName: 'James Davis',
      rating: 5,
      reviewDate: '4/09/2025',
      status: 'Pending',
      comment: 'Dr. Wong explained everything clearly and was very patient. Great experience!',
      helpful: 0,
    },
    {
      id: 'DR004',
      doctorName: 'Dr. James Miller',
      department: 'Pulmonology',
      reviewerName: 'Sarah Martinez',
      rating: 3,
      reviewDate: '4/08/2025',
      status: 'Flagged',
      comment: 'Good but wait time was long',
      helpful: 12,
    },
  ];

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.reviewerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment = departmentFilter === 'all' || review.department === departmentFilter;

    if (activeTab === 'approved') return matchesSearch && matchesDepartment && review.status === 'Approved';
    if (activeTab === 'pending') return matchesSearch && matchesDepartment && review.status === 'Pending';
    return matchesSearch && matchesDepartment;
  });

  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Flagged':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const departments = ['all', ...new Set(reviews.map((r) => r.department))];

  const stats = {
    totalReviews: reviews.length,
    avgRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
    approvedCount: reviews.filter((r) => r.status === 'Approved').length,
    pendingCount: reviews.filter((r) => r.status === 'Pending').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Doctor Reviews</h1>
            <p className="text-gray-400 mt-2">Manage and respond to patient reviews of doctors</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Reviews</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {reviews.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <span className="text-emerald-400 text-xl">📝</span>
              </div>
            </div>
          </div>

          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Average Rating</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">{stats.avgRating}</p>
                <p className="text-xs text-gray-500 mt-1">Based on 5 reviews</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <span className="text-amber-400 text-xl">⭐</span>
              </div>
            </div>
          </div>

          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Approved</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.approvedCount}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <span className="text-emerald-400 text-xl">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">{stats.pendingCount}</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <span className="text-amber-400 text-xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Helpful</p>
                <p className="text-2xl font-bold text-blue-400 mt-1">54</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 text-xl">👍</span>
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
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 pl-10 pr-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Departments</option>
              {departments.slice(1).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
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
              All Reviews
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'approved'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Pending Response
            </button>
          </div>

          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-dark-tertiary rounded-lg p-4 border border-dark-tertiary hover:border-emerald-500/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-semibold text-white">{review.comment}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          <span className="text-amber-400">{getRatingStars(review.rating)}</span>
                          {' '}
                          {review.rating}/5
                        </p>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      review.status
                    )}`}
                  >
                    {review.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                  <div>
                    <p className="text-gray-400">Doctor</p>
                    <p className="text-white font-medium">{review.doctorName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Reviewer</p>
                    <p className="text-white font-medium">{review.reviewerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Date</p>
                    <p className="text-white font-medium">{review.reviewDate}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-dark-secondary">
                  <p className="text-xs text-gray-500">Helpful: {review.helpful} votes</p>
                  <button className="p-1 hover:bg-dark-secondary rounded text-gray-400 hover:text-emerald-400 transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm text-gray-400">
            Showing {filteredReviews.length} of {reviews.length} reviews
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
