'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, Filter, MoreVertical } from 'lucide-react';
import Link from 'next/link';

interface Room {
  roomNumber: string;
  roomType: string;
  status: 'Occupied' | 'Available' | 'Maintenance';
  patient?: string;
  doctor: string;
}

interface DepartmentData {
  name: string;
  totalRooms: number;
  occupied: number;
  available: number;
  rooms: Room[];
}

export default function RoomsByDepartmentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('Cardiology');
  const [statusFilter, setStatusFilter] = useState('all');

  const departmentsData: DepartmentData[] = [
    {
      name: 'Cardiology',
      totalRooms: 25,
      occupied: 7,
      available: 5,
      rooms: [
        { roomNumber: '101', roomType: 'Private', status: 'Occupied', patient: 'John Smith', doctor: 'Dr. Emily Chun' },
        { roomNumber: '102', roomType: 'Private', status: 'Available', doctor: 'Dr. Emily Chun' },
        { roomNumber: '103', roomType: 'Semi-Private', status: 'Occupied', patient: 'Maria Garcia', doctor: 'Dr. James Wilson' },
        { roomNumber: '104', roomType: 'Semi-Private', status: 'Occupied', patient: 'Robert Davis', doctor: 'Dr. Emily Chun' },
        { roomNumber: '105', roomType: 'General', status: 'Available', doctor: 'Dr. Emily Chun' },
      ],
    },
    {
      name: 'Orthopedics',
      totalRooms: 20,
      occupied: 15,
      available: 3,
      rooms: [
        { roomNumber: '201', roomType: 'Private', status: 'Occupied', patient: 'Sarah Johnson', doctor: 'Dr. Michael Brown' },
        { roomNumber: '202', roomType: 'Semi-Private', status: 'Occupied', patient: 'David Lee', doctor: 'Dr. Sarah Miller' },
        { roomNumber: '203', roomType: 'General', status: 'Available', doctor: 'Dr. Michael Brown' },
        { roomNumber: '204', roomType: 'General', status: 'Available', doctor: 'Dr. Michael Brown' },
        { roomNumber: '205', roomType: 'Semi-Private', status: 'Occupied', patient: 'Jennifer Martinez', doctor: 'Dr. Michael Brown' },
      ],
    },
    {
      name: 'Neurology',
      totalRooms: 15,
      occupied: 10,
      available: 5,
      rooms: [
        { roomNumber: '301', roomType: 'Private', status: 'Occupied', patient: 'Robert Davis', doctor: 'Dr. Lisa Wong' },
        { roomNumber: '302', roomType: 'Semi-Private', status: 'Available', doctor: 'Dr. Lisa Wong' },
        { roomNumber: '303', roomType: 'General', status: 'Occupied', patient: 'John Smith', doctor: 'Dr. Lisa Wong' },
        { roomNumber: '304', roomType: 'General', status: 'Available', doctor: 'Dr. Lisa Wong' },
        { roomNumber: '305', roomType: 'Private', status: 'Maintenance', doctor: 'Dr. Lisa Wong' },
      ],
    },
  ];

  const currentDepartment = departmentsData.find((d) => d.name === selectedDepartment) || departmentsData[0];

  const filteredRooms = currentDepartment.rooms.filter((room) => {
    const matchesSearch =
      room.roomNumber.includes(searchQuery) ||
      room.roomType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.patient?.toLowerCase().includes(searchQuery.toLowerCase()) || false);

    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Occupied':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Available':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Maintenance':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Rooms by Department</h1>
          <p className="text-gray-400 mt-2">View and manage rooms organized by department</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Rooms</p>
                <p className="text-2xl font-bold text-white mt-1">{currentDepartment.totalRooms}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <span className="text-emerald-400 text-xl">🏥</span>
              </div>
            </div>
          </div>

          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Occupied</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">{currentDepartment.occupied}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <span className="text-emerald-400 text-xl">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Available</p>
                <p className="text-2xl font-bold text-blue-400 mt-1">{currentDepartment.available}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 text-xl">✨</span>
              </div>
            </div>
          </div>

          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Occupancy Rate</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">
                  {Math.round((currentDepartment.occupied / currentDepartment.totalRooms) * 100)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <span className="text-amber-400 text-xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Department Tabs</h2>
            <div className="flex gap-2 flex-wrap">
              {departmentsData.map((dept) => (
                <button
                  key={dept.name}
                  onClick={() => {
                    setSelectedDepartment(dept.name);
                    setStatusFilter('all');
                    setSearchQuery('');
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                    selectedDepartment === dept.name
                      ? 'bg-emerald-500 text-white'
                      : 'bg-dark-tertiary text-gray-300 hover:bg-dark-tertiary/70'
                  }`}
                >
                  {dept.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by room number, type, or patient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 pl-10 pr-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <Link href="/room-allotment/add-room">
              <button className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium whitespace-nowrap">
                + Add New Room
              </button>
            </Link>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Statuses</option>
                <option value="Occupied">Occupied</option>
                <option value="Available">Available</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-tertiary">
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Room Number
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Room Type
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Patient
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
                {filteredRooms.map((room, index) => (
                  <tr
                    key={index}
                    className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-white font-bold text-sm">
                      {room.roomNumber}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRoomTypeColor(room.roomType)}`}>
                        {room.roomType}
                      </span>
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
                      {room.patient ? (
                        <>
                          <p className="text-white">{room.patient}</p>
                        </>
                      ) : (
                        <span className="text-gray-500 italic">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-sm">
                      {room.doctor}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button className="p-1 hover:bg-dark-tertiary rounded text-gray-400 hover:text-emerald-400 transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-400">
            Showing {filteredRooms.length} rooms in {currentDepartment.name}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
