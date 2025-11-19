'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, Filter, MoreVertical, Eye, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Room {
  id: string;
  roomNumber: string;
  roomType: string;
  status: 'Occupied' | 'Available' | 'Maintenance';
  roomAllotments?: any[];
}

interface DepartmentData {
  department: string;
  totalRooms: number;
  occupied: number;
  available: number;
  rooms: Room[];
}

export default function RoomsByDepartmentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('Cardiology');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentsData, setDepartmentsData] = useState<DepartmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [statusUpdateModal, setStatusUpdateModal] = useState(false);
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [newStatus, setNewStatus] = useState('Available');

  useEffect(() => {
    fetchDepartmentsData();
  }, []);

  const fetchDepartmentsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/room-allotment/rooms`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch rooms');

      const data = await response.json();
      const departments = [...new Set(data.rooms.map((r: any) => r.department))] as string[];
      setAvailableDepartments(departments);
      
      if (departments.length > 0) {
        setSelectedDepartment(departments[0]);
        await fetchDepartmentRooms(departments[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch departments');
    }
  };

  const fetchDepartmentRooms = async (dept: string) => {
    try {
      const response = await fetch(`${API_URL}/room-allotment/by-department/${dept}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch department data');

      const data = await response.json();
      setDepartmentsData((prev) => {
        const existing = prev.find((d) => d.department === dept);
        if (existing) {
          return prev.map((d) => (d.department === dept ? data : d));
        }
        return [...prev, data];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch department');
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentChange = (dept: string) => {
    setSelectedDepartment(dept);
    setStatusFilter('all');
    setSearchQuery('');

    const existing = departmentsData.find((d) => d.department === dept);
    if (!existing) {
      fetchDepartmentRooms(dept);
    }
  };

  const currentDepartment = departmentsData.find((d) => d.department === selectedDepartment);

  const filteredRooms = currentDepartment
    ? currentDepartment.rooms.filter((room) => {
        const matchesSearch =
          room.roomNumber.includes(searchQuery) ||
          room.roomType.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || room.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
    : [];

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

  const handleUpdateStatus = async () => {
    if (!selectedRoom) return;
    try {
      const response = await fetch(`${API_URL}/room-allotment/rooms/${selectedRoom.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setStatusUpdateModal(false);
        await fetchDepartmentRooms(selectedDepartment);
        setOpenDropdown(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update room status');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error updating room status');
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (confirm('Are you sure you want to delete this room?')) {
      try {
        const response = await fetch(`${API_URL}/room-allotment/rooms/${roomId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          await fetchDepartmentRooms(selectedDepartment);
          setOpenDropdown(null);
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to delete room');
        }
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Error deleting room');
      }
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
                <p className="text-2xl font-bold text-white mt-1">
                  {loading ? '-' : currentDepartment?.totalRooms || 0}
                </p>
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
                <p className="text-2xl font-bold text-emerald-400 mt-1">
                  {loading ? '-' : currentDepartment?.occupied || 0}
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
                <p className="text-gray-400 text-sm">Available</p>
                <p className="text-2xl font-bold text-blue-400 mt-1">
                  {loading ? '-' : currentDepartment?.available || 0}
                </p>
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
                  {loading || !currentDepartment
                    ? '-'
                    : Math.round((currentDepartment.occupied / currentDepartment.totalRooms) * 100) + '%'}
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
              {loading ? (
                <p className="text-gray-400 text-sm">Loading departments...</p>
              ) : availableDepartments.length === 0 ? (
                <p className="text-gray-400 text-sm">No departments available</p>
              ) : (
                availableDepartments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => handleDepartmentChange(dept)}
                    className={`px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                      selectedDepartment === dept
                        ? 'bg-emerald-500 text-white'
                        : 'bg-dark-tertiary text-gray-300 hover:bg-dark-tertiary/70'
                    }`}
                  >
                    {dept}
                  </button>
                ))
              )}
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
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-3 text-center text-gray-400">
                      Loading rooms...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-3 text-center text-red-400">
                      {error}
                    </td>
                  </tr>
                ) : filteredRooms.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-3 text-center text-gray-400">
                      No rooms found
                    </td>
                  </tr>
                ) : (
                  filteredRooms.map((room) => (
                    <tr
                      key={room.id}
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
                        {room.roomAllotments && room.roomAllotments.length > 0 ? (
                          <>
                            <p className="text-white">{room.roomAllotments[0].patientName}</p>
                          </>
                        ) : (
                          <span className="text-gray-500 italic">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-sm">
                        {room.roomAllotments && room.roomAllotments.length > 0
                          ? room.roomAllotments[0].attendingDoctor
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm relative">
                        <button
                          onClick={() =>
                            setOpenDropdown(openDropdown === room.id ? null : room.id)
                          }
                          className="p-1 hover:bg-dark-tertiary rounded text-gray-400 hover:text-emerald-400 transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {openDropdown === room.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-lg z-10">
                            <button
                              onClick={() => {
                                setSelectedRoom(room);
                                setNewStatus(room.status);
                                setStatusUpdateModal(true);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-dark-tertiary hover:text-emerald-400 transition-colors border-b border-dark-tertiary text-sm"
                            >
                              <Edit2 size={14} />
                              Update Status
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRoom(room);
                                setViewDetailsModal(true);
                                setOpenDropdown(null);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-dark-tertiary hover:text-blue-400 transition-colors border-b border-dark-tertiary text-sm"
                            >
                              <Eye size={14} />
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteRoom(room.id);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-dark-tertiary hover:text-red-400 transition-colors text-sm"
                            >
                              <Trash2 size={14} />
                              Delete Room
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-400">
            Showing {filteredRooms.length} rooms in {currentDepartment?.department}
          </div>
        </div>
      </div>

      {statusUpdateModal && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold text-white mb-4">Update Room Status</h3>
            <p className="text-gray-400 mb-4">Room: {selectedRoom.roomNumber}</p>
            
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2">New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setStatusUpdateModal(false)}
                className="px-4 py-2 bg-dark-tertiary text-gray-300 rounded-lg hover:bg-dark-tertiary/70 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {viewDetailsModal && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">Room Details</h3>
            
            <div className="space-y-3 text-gray-300 text-sm">
              <div>
                <p className="text-gray-400">Room Number</p>
                <p className="text-white font-medium">{selectedRoom.roomNumber}</p>
              </div>
              <div>
                <p className="text-gray-400">Room Type</p>
                <p className="text-white font-medium">{selectedRoom.roomType}</p>
              </div>
              <div>
                <p className="text-gray-400">Status</p>
                <p className={`font-medium ${selectedRoom.status === 'Occupied' ? 'text-emerald-400' : selectedRoom.status === 'Available' ? 'text-blue-400' : 'text-red-400'}`}>
                  {selectedRoom.status}
                </p>
              </div>
              {selectedRoom.roomAllotments && selectedRoom.roomAllotments.length > 0 && (
                <>
                  <div>
                    <p className="text-gray-400">Patient</p>
                    <p className="text-white font-medium">{selectedRoom.roomAllotments[0].patientName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Doctor</p>
                    <p className="text-white font-medium">{selectedRoom.roomAllotments[0].attendingDoctor || '—'}</p>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={() => setViewDetailsModal(false)}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
