'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, Eye, Edit, Trash2, Filter, MoreVertical } from 'lucide-react';
import Link from 'next/link';

interface AllotedRoom {
  id: string;
  allotmentId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  roomNumber: string;
  roomType: string;
  department: string;
  allotmentDate: string;
  status: 'Occupied' | 'Discharged' | 'Reserved';
  doctor: string;
}

export default function AllotedRoomsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const allotedRooms: AllotedRoom[] = [
    {
      id: 'RA-001',
      allotmentId: 'A-1001',
      patientId: 'P-1001',
      patientName: 'John Smith',
      patientPhone: '+1-201-555-0123',
      roomNumber: '301',
      roomType: 'Private',
      department: 'Cardiology',
      allotmentDate: '2025-04-10',
      status: 'Occupied',
      doctor: 'Dr. Emily Chun',
    },
    {
      id: 'RA-002',
      allotmentId: 'A-1002',
      patientId: 'P-1002',
      patientName: 'Sarah Johnson',
      patientPhone: '+1-201-555-0124',
      roomNumber: '208',
      roomType: 'Semi-Private',
      department: 'Orthopedics',
      allotmentDate: '2025-04-08',
      status: 'Occupied',
      doctor: 'Dr. Michael Brown',
    },
    {
      id: 'RA-003',
      allotmentId: 'A-1003',
      patientId: 'P-1003',
      patientName: 'Robert Davis',
      patientPhone: '+1-201-555-0125',
      roomNumber: '102',
      roomType: 'General',
      department: 'Neurology',
      allotmentDate: '2025-04-12',
      status: 'Occupied',
      doctor: 'Dr. Lisa Wong',
    },
    {
      id: 'RA-004',
      allotmentId: 'A-1004',
      patientId: 'P-1004',
      patientName: 'Maria Garcia',
      patientPhone: '+1-201-555-0126',
      roomNumber: '405',
      roomType: 'ICU',
      department: 'Pulmonology',
      allotmentDate: '2025-04-07',
      status: 'Occupied',
      doctor: 'Dr. James Wilson',
    },
    {
      id: 'RA-005',
      allotmentId: 'A-1005',
      patientId: 'P-1005',
      patientName: 'David Lee',
      patientPhone: '+1-201-555-0127',
      roomNumber: '210',
      roomType: 'Semi-Private',
      department: 'Gastroenterology',
      allotmentDate: '2025-04-06',
      status: 'Discharged',
      doctor: 'Dr. Sarah Miller',
    },
    {
      id: 'RA-006',
      allotmentId: 'A-1006',
      patientId: 'P-1006',
      patientName: 'Jennifer Martinez',
      patientPhone: '+1-201-555-0128',
      roomNumber: '312',
      roomType: 'Private',
      department: 'Cardiology',
      allotmentDate: '2025-04-11',
      status: 'Reserved',
      doctor: 'Dr. Emily Chun',
    },
  ];

  const filteredRooms = allotedRooms.filter((room) => {
    const matchesSearch =
      room.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.roomNumber.includes(searchQuery) ||
      room.patientId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    const matchesDepartment =
      departmentFilter === 'all' || room.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Occupied':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Discharged':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'Reserved':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getRoomTypeColor = (roomType: string) => {
    switch (roomType) {
      case 'ICU':
        return 'bg-red-500/10 text-red-400';
      case 'Private':
        return 'bg-emerald-500/10 text-emerald-400';
      case 'Semi-Private':
        return 'bg-blue-500/10 text-blue-400';
      case 'General':
        return 'bg-amber-500/10 text-amber-400';
      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  const departments = ['all', ...new Set(allotedRooms.map((room) => room.department))];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Alloted Rooms</h1>
          <p className="text-gray-400 mt-2">Manage patient room allocations and assignments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Rooms Alloted</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {allotedRooms.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <span className="text-emerald-400 text-xl">📍</span>
              </div>
            </div>
          </div>

          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Currently Occupied</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">
                  {allotedRooms.filter((r) => r.status === 'Occupied').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <span className="text-emerald-400 text-xl">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Discharged</p>
                <p className="text-2xl font-bold text-red-400 mt-1">
                  {allotedRooms.filter((r) => r.status === 'Discharged').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <span className="text-red-400 text-xl">✕</span>
              </div>
            </div>
          </div>

          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Reserved</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">
                  {allotedRooms.filter((r) => r.status === 'Reserved').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <span className="text-amber-400 text-xl">⏱</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by patient name, room, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-80 pl-10 pr-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <Link href="/room-allotment/new">
              <button className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium">
                + New Allotment
              </button>
            </Link>
          </div>

          <div className="flex gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="Occupied">Occupied</option>
                <option value="Discharged">Discharged</option>
                <option value="Reserved">Reserved</option>
              </select>
            </div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Departments</option>
              {departments.slice(1).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-tertiary">
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Allotment ID
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Patient
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Room
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Room Type
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Department
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Doctor
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((room) => (
                  <tr
                    key={room.id}
                    className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-white text-sm font-medium">
                      {room.allotmentId}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <p className="text-white font-medium">{room.patientName}</p>
                        <p className="text-gray-400 text-xs">{room.patientId}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white font-medium text-sm">
                      {room.roomNumber}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRoomTypeColor(room.roomType)}`}>
                        {room.roomType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-sm">
                      {room.department}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          room.status
                        )}`}
                      >
                        {room.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-sm">
                      {room.doctor}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-dark-tertiary rounded text-gray-400 hover:text-emerald-400 transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-1 hover:bg-dark-tertiary rounded text-gray-400 hover:text-blue-400 transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-1 hover:bg-dark-tertiary rounded text-gray-400 hover:text-red-400 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
            <span>Showing {filteredRooms.length} allotments</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-dark-tertiary hover:bg-dark-tertiary/70 rounded transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded">1</button>
              <button className="px-3 py-1 bg-dark-tertiary hover:bg-dark-tertiary/70 rounded transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
