'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, UserCheck, UserX, Clock, AlertTriangle, Calendar, Download, Edit2, Trash2 } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  staffId: string;
  staff: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    department: string;
  };
  checkIn: string;
  checkOut: string;
  hours: number;
  status: string;
  date: string;
}

export default function AttendancePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attendance?date=${selectedDate}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAttendanceRecords(data.attendance);
      }
    } catch (err) {
      setError('Failed to fetch attendance records');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const presentCount = attendanceRecords.filter(r => r.status === 'Present').length;
  const absentCount = attendanceRecords.filter(r => r.status === 'Absent').length;
  const onLeaveCount = attendanceRecords.filter(r => r.status === 'On Leave').length;
  const lateCount = attendanceRecords.filter(r => r.status === 'On Late').length;

  const filteredRecords = attendanceRecords.filter(record =>
    `${record.staff.firstName} ${record.staff.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.staff.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Staff Attendance</h1>
            <p className="text-gray-400">Track and manage staff attendance records</p>
          </div>
          <div className="flex gap-3">
            <button className="btn-primary">Record Time</button>
            <button className="btn-secondary">Export</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <UserCheck className="text-emerald-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{presentCount}</div>
                <div className="text-sm text-gray-400">Present Today</div>
                <div className="text-xs text-emerald-500">+0%</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <UserX className="text-red-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{absentCount}</div>
                <div className="text-sm text-gray-400">Absent Today</div>
                <div className="text-xs text-red-500">Unplanned absences</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Clock className="text-blue-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{onLeaveCount}</div>
                <div className="text-sm text-gray-400">On Leave</div>
                <div className="text-xs text-blue-500">Approved leave requests</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-orange-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{lateCount}</div>
                <div className="text-sm text-gray-400">Late Arrivals</div>
                <div className="text-xs text-orange-500">More than 30 minutes late</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none flex-1"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-dark-tertiary rounded-lg">
                <Calendar size={18} className="text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent outline-none text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-6 border-b border-dark-tertiary">
            <button className="pb-3 px-1 font-medium text-emerald-500 border-b-2 border-emerald-500">Daily Attendance</button>
            <button className="pb-3 px-1 font-medium text-gray-400 hover:text-gray-300">Calendar View</button>
            <button className="pb-3 px-1 font-medium text-gray-400 hover:text-gray-300">Timesheets</button>
            <button className="pb-3 px-1 font-medium text-gray-400 hover:text-gray-300">Leave Requests</button>
            <button className="pb-3 px-1 font-medium text-gray-400 hover:text-gray-300">Reports</button>
          </div>

          <h2 className="text-xl font-semibold mb-4">Daily Attendance Record</h2>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading attendance records...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-tertiary">
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Staff</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Department</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Role</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Check In</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Check Out</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Hours</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center font-semibold text-emerald-500 text-sm">
                            {`${record.staff.firstName[0]}${record.staff.lastName[0]}`}
                          </div>
                          <span className="text-white">{record.staff.firstName} {record.staff.lastName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-300">{record.staff.department}</td>
                      <td className="py-4 px-4 text-gray-300">{record.staff.role}</td>
                      <td className="py-4 px-4 text-gray-300">{record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : '-'}</td>
                      <td className="py-4 px-4 text-gray-300">{record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : '-'}</td>
                      <td className="py-4 px-4 text-gray-300">{record.hours.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          record.status === 'Present' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                          record.status === 'On Late' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                          record.status === 'Absent' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                          'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                        }`}>
                          {record.status}
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
