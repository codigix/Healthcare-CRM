'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, Plus, Phone, MapPin, Clock, User, Truck as AmbulanceIcon, AlertCircle, CheckCircle, X } from 'lucide-react';
import { emergencyCallsAPI } from '@/lib/api';
import Link from 'next/link';

interface EmergencyCall {
  id: string;
  callTime: string;
  patientName: string;
  location: string;
  emergencyType: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Dispatched' | 'En Route' | 'Arrived' | 'Completed';
  ambulanceId?: string;
  driver?: string;
  responseTime?: string;
  notes?: string;
}

export default function AmbulanceCallsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [calls, setCalls] = useState<EmergencyCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingCall, setAddingCall] = useState(false);

  const [newCall, setNewCall] = useState({
    patientName: '',
    phone: '',
    location: '',
    emergencyType: '',
    priority: 'High' as const,
    notes: ''
  });

  useEffect(() => {
    fetchCalls();
  }, [searchQuery]);

  const fetchCalls = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await emergencyCallsAPI.list(1, 100, searchQuery);
      const callsData = response.data.emergencyCalls || [];
      setCalls(callsData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch emergency calls');
      console.error('Failed to fetch calls', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCall.patientName || !newCall.phone || !newCall.location || !newCall.emergencyType) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setAddingCall(true);
      const callData = {
        patientName: newCall.patientName,
        phone: newCall.phone,
        location: newCall.location,
        emergencyType: newCall.emergencyType,
        priority: newCall.priority,
        notes: newCall.notes,
        status: 'Pending',
      };
      await emergencyCallsAPI.create(callData);
      setNewCall({
        patientName: '',
        phone: '',
        location: '',
        emergencyType: '',
        priority: 'High',
        notes: ''
      });
      setShowAddModal(false);
      fetchCalls();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create emergency call');
    } finally {
      setAddingCall(false);
    }
  };

  const handleStatusUpdate = async (callId: string, newStatus: string) => {
    setCalls(prevCalls =>
      prevCalls.map(call =>
        call.id === callId ? { ...call, status: newStatus as any } : call
      )
    );
    setOpenMenuId(null);
    try {
      await emergencyCallsAPI.updateStatus(callId, newStatus);
    } catch (error) {
      console.error('Failed to update call status', error);
      setCalls(calls);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'Medium':
        return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
      case 'Low':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'En Route':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'Dispatched':
        return 'bg-purple-500/10 text-purple-500 border border-purple-500/20';
      case 'Arrived':
        return 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20';
      case 'Pending':
        return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         call.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         call.emergencyType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || call.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || call.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const pendingCalls = calls.filter(c => c.status === 'Pending').length;
  const activeCalls = calls.filter(c => ['Dispatched', 'En Route', 'Arrived'].includes(c.status)).length;
  const completedToday = calls.filter(c => c.status === 'Completed').length;
  const highPriority = calls.filter(c => c.priority === 'High').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Ambulance Call List</h1>
            <p className="text-gray-400">Manage and track emergency calls and ambulance dispatches</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            New Emergency Call
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-orange-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{pendingCalls}</div>
                <div className="text-sm text-gray-400">Pending Calls</div>
                <div className="text-xs text-orange-500">Awaiting dispatch</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <AmbulanceIcon className="text-blue-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeCalls}</div>
                <div className="text-sm text-gray-400">Active Calls</div>
                <div className="text-xs text-blue-500">Currently in progress</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <Phone className="text-emerald-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{completedToday}</div>
                <div className="text-sm text-gray-400">Completed Today</div>
                <div className="text-xs text-emerald-500">Successfully handled</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-red-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{highPriority}</div>
                <div className="text-sm text-gray-400">High Priority</div>
                <div className="text-xs text-red-500">Urgent attention needed</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Emergency Calls</h2>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
            <div className="flex-1 flex items-center gap-2 bg-dark-tertiary rounded-lg px-4 w-full">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search calls..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent py-3 flex-1 outline-none"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field flex-1 md:flex-none"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Dispatched">Dispatched</option>
                <option value="En Route">En Route</option>
                <option value="Arrived">Arrived</option>
                <option value="Completed">Completed</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="input-field flex-1 md:flex-none"
              >
                <option value="all">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-400">Loading emergency calls...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCalls.length === 0 ? (
                <div className="flex justify-center items-center py-8">
                  <div className="text-gray-400">No emergency calls found</div>
                </div>
              ) : (
                filteredCalls.map((call) => (
              <div
                key={call.id}
                className="p-6 bg-dark-tertiary/30 rounded-lg border border-dark-tertiary hover:border-gray-600 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{call.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(call.priority)}`}>
                            {call.priority} Priority
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                            {call.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-1">
                          <span className="font-medium text-white">{call.emergencyType}</span> - {call.patientName}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <div>
                          <div className="text-gray-400 text-xs">Call Time</div>
                          <div className="text-white">{call.callTime}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <div>
                          <div className="text-gray-400 text-xs">Location</div>
                          <div className="text-white">{call.location}</div>
                        </div>
                      </div>

                      {call.ambulanceId && (
                        <div className="flex items-center gap-2">
                          <AmbulanceIcon size={16} className="text-gray-400" />
                          <div>
                            <div className="text-gray-400 text-xs">Ambulance</div>
                            <div className="text-white">{call.ambulanceId}</div>
                          </div>
                        </div>
                      )}

                      {call.driver && (
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-gray-400" />
                          <div>
                            <div className="text-gray-400 text-xs">Driver</div>
                            <div className="text-white">{call.driver}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {call.responseTime && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={16} className="text-emerald-500" />
                        <span className="text-gray-400">Response Time:</span>
                        <span className="text-emerald-500 font-medium">{call.responseTime}</span>
                      </div>
                    )}

                    {call.notes && (
                      <div className="p-3 bg-dark-secondary rounded-lg">
                        <div className="text-xs text-gray-400 mb-1">Notes:</div>
                        <p className="text-sm text-gray-300">{call.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex lg:flex-col gap-2 relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === call.id ? null : call.id)}
                      className="btn-secondary whitespace-nowrap flex items-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Update Status
                    </button>

                    {openMenuId === call.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-lg z-10 top-full">
                        <button
                          onClick={() => handleStatusUpdate(call.id, 'Pending')}
                          className="w-full text-left px-4 py-2 hover:bg-dark-tertiary transition-colors flex items-center gap-2 text-gray-300 hover:text-white first:rounded-t-lg text-sm"
                        >
                          Pending
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(call.id, 'Dispatched')}
                          className="w-full text-left px-4 py-2 hover:bg-dark-tertiary transition-colors flex items-center gap-2 text-gray-300 hover:text-white text-sm"
                        >
                          Dispatched
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(call.id, 'En Route')}
                          className="w-full text-left px-4 py-2 hover:bg-dark-tertiary transition-colors flex items-center gap-2 text-gray-300 hover:text-white text-sm"
                        >
                          En Route
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(call.id, 'Arrived')}
                          className="w-full text-left px-4 py-2 hover:bg-dark-tertiary transition-colors flex items-center gap-2 text-gray-300 hover:text-white text-sm"
                        >
                          Arrived
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(call.id, 'Completed')}
                          className="w-full text-left px-4 py-2 hover:bg-dark-tertiary transition-colors flex items-center gap-2 text-gray-300 hover:text-white last:rounded-b-lg text-sm"
                        >
                          Completed
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
            )}
            </div>
          )}

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-dark-tertiary">
            <p className="text-gray-400 text-sm">
              Showing 1 to {filteredCalls.length} of {calls.length} calls
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-dark-tertiary rounded-lg hover:bg-dark-tertiary/70 transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 bg-dark-tertiary rounded-lg hover:bg-dark-tertiary/70 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-dark-secondary border border-dark-tertiary rounded-lg shadow-lg w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Add Emergency Call</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 hover:bg-dark-tertiary rounded transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddCall} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    value={newCall.patientName}
                    onChange={(e) => setNewCall({...newCall, patientName: e.target.value})}
                    className="input-field w-full"
                    placeholder="Enter patient name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    value={newCall.phone}
                    onChange={(e) => setNewCall({...newCall, phone: e.target.value})}
                    className="input-field w-full"
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={newCall.location}
                    onChange={(e) => setNewCall({...newCall, location: e.target.value})}
                    className="input-field w-full"
                    placeholder="Enter location"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Emergency Type *
                  </label>
                  <select
                    value={newCall.emergencyType}
                    onChange={(e) => setNewCall({...newCall, emergencyType: e.target.value})}
                    className="input-field w-full"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Cardiac Arrest">Cardiac Arrest</option>
                    <option value="Fall Injury">Fall Injury</option>
                    <option value="Traffic Accident">Traffic Accident</option>
                    <option value="Breathing Difficulty">Breathing Difficulty</option>
                    <option value="Allergic Reaction">Allergic Reaction</option>
                    <option value="Workplace Injury">Workplace Injury</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={newCall.priority}
                    onChange={(e) => setNewCall({...newCall, priority: e.target.value as any})}
                    className="input-field w-full"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={newCall.notes}
                    onChange={(e) => setNewCall({...newCall, notes: e.target.value})}
                    className="input-field w-full"
                    placeholder="Enter additional notes"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={addingCall}
                    className="btn-primary flex-1"
                  >
                    {addingCall ? 'Creating...' : 'Create Call'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
