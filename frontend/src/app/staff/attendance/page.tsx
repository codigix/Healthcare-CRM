'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ActionModal from '@/components/UI/ActionModal';
import { Search, UserCheck, UserX, Clock, AlertTriangle, Calendar, Download, Edit2, Trash2 } from 'lucide-react';
import { attendanceAPI, staffAPI } from '@/lib/api';

interface AttendanceRecord {
  id: string;
  staffId: string;
  staff: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
  };
  checkIn: string;
  checkOut: string;
  hours: number;
  status: string;
  date: string;
}

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
}

export default function AttendancePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recordTimeModalOpen, setRecordTimeModalOpen] = useState(false);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [activeTab, setActiveTab] = useState('daily');
  const [recordFormData, setRecordFormData] = useState({
    staffId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    checkIn: '',
    checkOut: '',
    hours: 0,
  });

  useEffect(() => {
    fetchAttendance();
    fetchStaffList();
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

  const fetchStaffList = async () => {
    try {
      const response = await staffAPI.list(1, 100);
      setStaffList(response.data.staff || []);
    } catch (err) {
      console.error('Error fetching staff:', err);
    }
  };

  const handleRecordTimeClick = () => {
    setRecordFormData({
      staffId: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Present',
      checkIn: '',
      checkOut: '',
      hours: 0,
    });
    setRecordTimeModalOpen(true);
  };

  const calculateHours = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return 0;
    const checkInTime = new Date(`2000-01-01T${checkIn}`);
    const checkOutTime = new Date(`2000-01-01T${checkOut}`);
    const diff = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
    return Math.max(0, diff);
  };

  const handleRecordTimeSubmit = async () => {
    if (!recordFormData.staffId) {
      alert('Please select a staff member');
      return;
    }

    try {
      const hours = calculateHours(recordFormData.checkIn, recordFormData.checkOut);
      const payload = {
        staffId: recordFormData.staffId,
        date: recordFormData.date,
        status: recordFormData.status,
        checkIn: recordFormData.checkIn ? `${recordFormData.date}T${recordFormData.checkIn}` : null,
        checkOut: recordFormData.checkOut ? `${recordFormData.date}T${recordFormData.checkOut}` : null,
        hours: hours,
      };

      await attendanceAPI.create(payload);
      alert('Attendance recorded successfully!');
      setRecordTimeModalOpen(false);
      fetchAttendance();
    } catch (err) {
      console.error('Error recording attendance:', err);
      alert('Error recording attendance');
    }
  };

  const presentCount = attendanceRecords.filter(r => r.status === 'Present').length;
  const absentCount = attendanceRecords.filter(r => r.status === 'Absent').length;
  const onLeaveCount = attendanceRecords.filter(r => r.status === 'On Leave').length;
  const lateCount = attendanceRecords.filter(r => r.status === 'On Late').length;

  const filteredRecords = attendanceRecords.filter(record =>
    `${record.staff.firstName} ${record.staff.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.staff.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getMonthCalendarDays = () => {
    const year = new Date(selectedDate).getFullYear();
    const month = new Date(selectedDate).getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const getAttendanceByDate = (date: string) => {
    return attendanceRecords.filter(record => 
      record.date.split('T')[0] === date
    );
  };

  const getStatusColor = (date: string) => {
    const dayRecords = getAttendanceByDate(date);
    if (dayRecords.length === 0) return 'bg-gray-700';
    const presentCount = dayRecords.filter(r => r.status === 'Present').length;
    const totalCount = dayRecords.length;
    if (presentCount === totalCount) return 'bg-emerald-500';
    if (presentCount > 0) return 'bg-blue-500';
    return 'bg-red-500';
  };

  const getWeeklyTimesheets = () => {
    const startDate = new Date(selectedDate);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const weeklySummary: Record<string, { staff: string; hours: number; status: string }[]> = {};
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayRecords = getAttendanceByDate(dateStr);
      weeklySummary[dateStr] = dayRecords.map(r => ({
        staff: `${r.staff.firstName} ${r.staff.lastName}`,
        hours: r.hours,
        status: r.status
      }));
    }
    return weeklySummary;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Staff Attendance</h1>
            <p className="text-gray-400">Track and manage staff attendance records</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleRecordTimeClick} className="btn-primary">Record Time</button>
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

          <div className="flex gap-4 mb-6 border-b border-dark-tertiary overflow-x-auto">
            <button 
              onClick={() => setActiveTab('daily')}
              className={`pb-3 px-1 font-medium whitespace-nowrap transition-colors ${
                activeTab === 'daily'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Daily Attendance
            </button>
            <button 
              onClick={() => setActiveTab('calendar')}
              className={`pb-3 px-1 font-medium whitespace-nowrap transition-colors ${
                activeTab === 'calendar'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Calendar View
            </button>
            <button 
              onClick={() => setActiveTab('timesheets')}
              className={`pb-3 px-1 font-medium whitespace-nowrap transition-colors ${
                activeTab === 'timesheets'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Timesheets
            </button>
            <button 
              onClick={() => setActiveTab('leaves')}
              className={`pb-3 px-1 font-medium whitespace-nowrap transition-colors ${
                activeTab === 'leaves'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Leave Requests
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className={`pb-3 px-1 font-medium whitespace-nowrap transition-colors ${
                activeTab === 'reports'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Reports
            </button>
          </div>

          {activeTab === 'daily' && (
            <>
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
            </>
          )}

          {activeTab === 'calendar' && (
            <>
              <h2 className="text-xl font-semibold mb-6">Attendance Calendar - {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-semibold text-gray-400 py-2">
                    {day}
                  </div>
                ))}
                {getMonthCalendarDays().map((day, index) => {
                  const dateStr = day.toISOString().split('T')[0];
                  const dayRecords = getAttendanceByDate(dateStr);
                  const statusColor = getStatusColor(dateStr);
                  
                  return (
                    <div key={index} className={`aspect-square rounded-lg p-2 ${statusColor} cursor-pointer hover:opacity-80 transition-opacity flex flex-col items-center justify-center text-center`}>
                      <div className="text-sm font-semibold text-white">{day.getDate()}</div>
                      <div className="text-xs text-gray-200 mt-1">{dayRecords.length} record{dayRecords.length !== 1 ? 's' : ''}</div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                    <div>
                      <p className="text-sm text-gray-400">All Present</p>
                      <p className="text-lg font-semibold text-emerald-400">{getMonthCalendarDays().filter(day => getStatusColor(day.toISOString().split('T')[0]) === 'bg-emerald-500').length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <div>
                      <p className="text-sm text-gray-400">Partial</p>
                      <p className="text-lg font-semibold text-blue-400">{getMonthCalendarDays().filter(day => getStatusColor(day.toISOString().split('T')[0]) === 'bg-blue-500').length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <div>
                      <p className="text-sm text-gray-400">Absent</p>
                      <p className="text-lg font-semibold text-red-400">{getMonthCalendarDays().filter(day => getStatusColor(day.toISOString().split('T')[0]) === 'bg-red-500').length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'timesheets' && (
            <>
              <h2 className="text-xl font-semibold mb-6">Weekly Timesheets</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-tertiary">
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Date</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Staff Member</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Check In</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Check Out</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Hours Worked</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(getWeeklyTimesheets()).map(([date, staffList]) => (
                      staffList.length > 0 ? (
                        staffList.map((staff, idx) => (
                          <tr key={`${date}-${idx}`} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                            <td className="py-4 px-4 text-gray-300">
                              {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </td>
                            <td className="py-4 px-4 text-gray-300">{staff.staff}</td>
                            <td className="py-4 px-4 text-gray-300">
                              {attendanceRecords.find(r => r.date.split('T')[0] === date && `${r.staff.firstName} ${r.staff.lastName}` === staff.staff)?.checkIn
                                ? new Date(attendanceRecords.find(r => r.date.split('T')[0] === date && `${r.staff.firstName} ${r.staff.lastName}` === staff.staff)!.checkIn).toLocaleTimeString()
                                : '-'}
                            </td>
                            <td className="py-4 px-4 text-gray-300">
                              {attendanceRecords.find(r => r.date.split('T')[0] === date && `${r.staff.firstName} ${r.staff.lastName}` === staff.staff)?.checkOut
                                ? new Date(attendanceRecords.find(r => r.date.split('T')[0] === date && `${r.staff.firstName} ${r.staff.lastName}` === staff.staff)!.checkOut).toLocaleTimeString()
                                : '-'}
                            </td>
                            <td className="py-4 px-4 text-gray-300 font-semibold">{staff.hours.toFixed(2)}h</td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                staff.status === 'Present' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                staff.status === 'On Late' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                                staff.status === 'Absent' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                              }`}>
                                {staff.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr key={date} className="border-b border-dark-tertiary">
                          <td colSpan={6} className="py-4 px-4 text-center text-gray-400">
                            No records for {new Date(date).toLocaleDateString()}
                          </td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Total Hours (This Week)</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {Object.values(getWeeklyTimesheets()).flat().reduce((sum, s) => sum + s.hours, 0).toFixed(1)}h
                  </p>
                </div>
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Average Hours/Day</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {(Object.values(getWeeklyTimesheets()).flat().reduce((sum, s) => sum + s.hours, 0) / 7).toFixed(1)}h
                  </p>
                </div>
                <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Days Worked</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {Object.entries(getWeeklyTimesheets()).filter(([_, staff]) => staff.length > 0).length}/7
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'leaves' && (
            <>
              <h2 className="text-xl font-semibold mb-6">Leave Requests</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Pending Requests</p>
                  <p className="text-3xl font-bold text-blue-400">0</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Approved</p>
                  <p className="text-3xl font-bold text-emerald-400">0</p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Rejected</p>
                  <p className="text-3xl font-bold text-orange-400">0</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-dark-tertiary rounded-lg p-6 border border-dark-tertiary">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Sick Leave</h3>
                      <p className="text-sm text-gray-400 mb-3">2025-01-15 to 2025-01-17 (3 days)</p>
                      <p className="text-sm text-gray-300">Reason: Medical checkup</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-medium">Pending</span>
                  </div>
                </div>
                <div className="bg-dark-tertiary rounded-lg p-6 border border-dark-tertiary">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Annual Leave</h3>
                      <p className="text-sm text-gray-400 mb-3">2025-02-20 to 2025-02-28 (9 days)</p>
                      <p className="text-sm text-gray-300">Reason: Vacation with family</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-medium">Approved</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'reports' && (
            <>
              <h2 className="text-xl font-semibold mb-6">Attendance Reports</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Month Attendance Rate</p>
                  <p className="text-2xl font-bold text-emerald-400">95%</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Average Daily Hours</p>
                  <p className="text-2xl font-bold text-blue-400">8.5h</p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Late Arrivals</p>
                  <p className="text-2xl font-bold text-orange-400">2</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Absences</p>
                  <p className="text-2xl font-bold text-red-400">1</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-dark-tertiary rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Monthly Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-dark-secondary">
                      <span className="text-gray-300">Working Days</span>
                      <span className="font-semibold text-white">22</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-dark-secondary">
                      <span className="text-gray-300">Days Present</span>
                      <span className="font-semibold text-emerald-400">21</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-dark-secondary">
                      <span className="text-gray-300">Days Absent</span>
                      <span className="font-semibold text-red-400">1</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-dark-secondary">
                      <span className="text-gray-300">Total Hours</span>
                      <span className="font-semibold text-blue-400">176.5h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Average Hours/Day</span>
                      <span className="font-semibold text-white">8.4h</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <ActionModal
        isOpen={recordTimeModalOpen}
        onClose={() => setRecordTimeModalOpen(false)}
        title="Record Attendance Time"
        actions={
          <>
            <button
              onClick={() => setRecordTimeModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleRecordTimeSubmit}
              className="btn-primary"
            >
              Record Time
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Staff Member</label>
            <select
              value={recordFormData.staffId}
              onChange={(e) =>
                setRecordFormData((prev) => ({
                  ...prev,
                  staffId: e.target.value,
                }))
              }
              className="input-field w-full"
            >
              <option value="">Select a staff member</option>
              {staffList.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.firstName} {staff.lastName} - {staff.department}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={recordFormData.date}
              onChange={(e) =>
                setRecordFormData((prev) => ({
                  ...prev,
                  date: e.target.value,
                }))
              }
              className="input-field w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Check In Time</label>
              <input
                type="time"
                value={recordFormData.checkIn}
                onChange={(e) =>
                  setRecordFormData((prev) => ({
                    ...prev,
                    checkIn: e.target.value,
                  }))
                }
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Check Out Time</label>
              <input
                type="time"
                value={recordFormData.checkOut}
                onChange={(e) =>
                  setRecordFormData((prev) => ({
                    ...prev,
                    checkOut: e.target.value,
                  }))
                }
                className="input-field w-full"
              />
            </div>
          </div>

          {recordFormData.checkIn && recordFormData.checkOut && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-sm text-blue-300">
                Total Hours: <strong>{calculateHours(recordFormData.checkIn, recordFormData.checkOut).toFixed(2)}</strong>
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={recordFormData.status}
              onChange={(e) =>
                setRecordFormData((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
              className="input-field w-full"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="On Leave">On Leave</option>
              <option value="On Late">Late</option>
            </select>
          </div>
        </div>
      </ActionModal>
    </DashboardLayout>
  );
}
