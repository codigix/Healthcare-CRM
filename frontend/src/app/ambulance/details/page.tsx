'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { ArrowLeft, Calendar, Wrench, Phone, MapPin, Fuel, Users, TrendingUp, TrendingDown, Clock, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { ambulanceAPI } from '@/lib/api';

function AmbulanceDetailsContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();
  const searchParams = useSearchParams();
  const ambulanceId = searchParams.get('id');
  const [ambulanceData, setAmbulanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (ambulanceId) {
      fetchAmbulanceDetails();
    } else {
      fetchFirstAmbulance();
    }
  }, [ambulanceId]);

  const fetchFirstAmbulance = async () => {
    try {
      setLoading(true);
      const response = await ambulanceAPI.list(1, 1);
      const ambulances = response.data.ambulances || response.data;
      if (Array.isArray(ambulances) && ambulances.length > 0) {
        setAmbulanceData(ambulances[0]);
      } else {
        setError('No ambulances found in the system.');
      }
    } catch (err) {
      setError('Failed to fetch ambulance data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAmbulanceDetails = async () => {
    try {
      setLoading(true);
      const response = await ambulanceAPI.get(ambulanceId!);
      setAmbulanceData(response.data);
    } catch (err) {
      setError('Failed to fetch ambulance details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this ambulance? This action cannot be undone.')) {
      try {
        await ambulanceAPI.delete(ambulanceId!);
        router.push('/ambulance/list');
      } catch (error) {
        console.error('Failed to delete ambulance', error);
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-400">Loading ambulance details...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !ambulanceData) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-8">
          <div className="text-red-400">{error || 'Ambulance not found'}</div>
        </div>
      </DashboardLayout>
    );
  }



  const maintenanceHistory = [
    {
      date: '2023-04-02',
      type: 'Regular Service',
      description: 'Oil change, filter replacement, brake inspection',
      cost: '$450',
      status: 'Completed'
    },
    {
      date: '2023-01-15',
      type: 'Repair',
      description: 'Replaced rear suspension components',
      cost: '$890',
      status: 'Completed'
    },
    {
      date: '2022-10-20',
      type: 'Regular Service',
      description: 'Comprehensive inspection and fluid top-up',
      cost: '$320',
      status: 'Completed'
    }
  ];

  const equipment = [
    { name: 'Defibrillator', status: 'Operational', lastChecked: '2023-06-01' },
    { name: 'Oxygen Cylinders (2)', status: 'Operational', lastChecked: '2023-06-01' },
    { name: 'Stretcher', status: 'Operational', lastChecked: '2023-06-01' },
    { name: 'First Aid Kit', status: 'Operational', lastChecked: '2023-06-01' },
    { name: 'Spine Board', status: 'Operational', lastChecked: '2023-06-01' },
    { name: 'Suction Unit', status: 'Operational', lastChecked: '2023-06-01' }
  ];

  const callAssignments = [
    {
      id: 'CALL-001',
      date: '2023-06-15',
      time: '14:30',
      location: 'Downtown Area',
      patient: 'Emergency Call',
      status: 'Completed',
      duration: '45 min'
    },
    {
      id: 'CALL-002',
      date: '2023-06-14',
      time: '09:15',
      location: 'Residential Complex',
      patient: 'Medical Emergency',
      status: 'Completed',
      duration: '32 min'
    },
    {
      id: 'CALL-003',
      date: '2023-06-13',
      time: '18:45',
      location: 'Highway 101',
      patient: 'Accident Victim',
      status: 'Completed',
      duration: '58 min'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'equipment', label: 'Equipment' },
    { id: 'calls', label: 'Call Assignments' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/ambulance/list">
            <button className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors">
              <ArrowLeft size={24} />
            </button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Ambulances / {ambulanceData.id}</h1>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-sm font-medium">
                {ambulanceData.status}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href={`/ambulance/edit/${ambulanceData.id}`}>
              <button className="btn-secondary flex items-center gap-2">
                <Edit size={18} />
                Edit
              </button>
            </Link>
            <button
              onClick={handleDelete}
              className="btn-secondary flex items-center gap-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 border-red-500/20 hover:border-red-500/30"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Calendar className="text-blue-500" size={20} />
              </div>
              <div className="text-sm text-gray-400">Status</div>
            </div>
            <div className="text-xl font-bold text-emerald-500">{ambulanceData.status}</div>
            <div className="text-xs text-gray-400 mt-1">Last updated: {new Date(ambulanceData.lastUpdated).toLocaleDateString()}</div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <MapPin className="text-emerald-500" size={20} />
              </div>
              <div className="text-sm text-gray-400">Location</div>
            </div>
            <div className="text-xl font-bold">{ambulanceData.location || 'N/A'}</div>
            <div className="text-xs text-gray-400 mt-1">Current position</div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Phone className="text-orange-500" size={20} />
              </div>
              <div className="text-sm text-gray-400">Driver Phone</div>
            </div>
            <div className="text-xl font-bold">{ambulanceData.driverPhone}</div>
            <div className="text-xs text-gray-400 mt-1">Emergency contact</div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Users className="text-purple-500" size={20} />
              </div>
              <div className="text-sm text-gray-400">Driver Name</div>
            </div>
            <div className="text-xl font-bold">{ambulanceData.driverName}</div>
            <div className="text-xs text-gray-400 mt-1">Assigned driver</div>
          </div>
        </div>

        <div className="card">
          <div className="border-b border-dark-tertiary mb-6">
            <div className="flex gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 px-2 font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-emerald-500'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Ambulance Overview</h3>
                <p className="text-gray-400 text-sm mb-6">General information and specifications.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-4">General Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-dark-tertiary">
                        <span className="text-gray-400">ID:</span>
                        <span className="text-white font-medium">{ambulanceData.id}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-dark-tertiary">
                        <span className="text-gray-400">Registration Number:</span>
                        <span className="text-white font-medium">{ambulanceData.registrationNumber}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-dark-tertiary">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white font-medium">{ambulanceData.name}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-dark-tertiary">
                        <span className="text-gray-400">Driver Name:</span>
                        <span className="text-white font-medium">{ambulanceData.driverName}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-dark-tertiary">
                        <span className="text-gray-400">Driver Phone:</span>
                        <span className="text-white font-medium">{ambulanceData.driverPhone}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-dark-tertiary">
                        <span className="text-gray-400">Created Date:</span>
                        <span className="text-white font-medium">{new Date(ambulanceData.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-400">Last Updated:</span>
                        <span className="text-white font-medium">{new Date(ambulanceData.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-4">Status Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-dark-tertiary">
                        <span className="text-gray-400">Current Status:</span>
                        <span className="text-white font-medium capitalize">{ambulanceData.status}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-dark-tertiary">
                        <span className="text-gray-400">Location:</span>
                        <span className="text-white font-medium">{ambulanceData.location || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-dark-tertiary">
                        <span className="text-gray-400">Driver Name:</span>
                        <span className="text-white font-medium">{ambulanceData.driverName}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-dark-tertiary">
                        <span className="text-gray-400">Driver Phone:</span>
                        <span className="text-white font-medium">{ambulanceData.driverPhone}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-dark-tertiary">
                        <span className="text-gray-400">Registration Number:</span>
                        <span className="text-white font-medium">{ambulanceData.registrationNumber}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-dark-tertiary">
                        <span className="text-gray-400">Created:</span>
                        <span className="text-white font-medium">{new Date(ambulanceData.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-400">Last Updated:</span>
                        <span className="text-white font-medium">{new Date(ambulanceData.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-4">Ambulance Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-dark-tertiary/30 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm text-gray-400">Ambulance Name</h5>
                      <Wrench className="text-emerald-500" size={20} />
                    </div>
                    <div className="text-2xl font-bold mb-1">{ambulanceData.name}</div>
                    <div className="text-xs text-gray-400">Unique identifier</div>
                  </div>

                  <div className="p-6 bg-dark-tertiary/30 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm text-gray-400">Registration Number</h5>
                      <Clock className="text-emerald-500" size={20} />
                    </div>
                    <div className="text-2xl font-bold mb-1">{ambulanceData.registrationNumber}</div>
                    <div className="text-xs text-gray-400">Vehicle registration</div>
                  </div>

                  <div className="p-6 bg-dark-tertiary/30 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm text-gray-400">Current Status</h5>
                      <TrendingUp className="text-emerald-500" size={20} />
                    </div>
                    <div className="text-2xl font-bold mb-1 capitalize">{ambulanceData.status}</div>
                    <div className="text-xs text-emerald-500">Active status</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Maintenance History</h3>
                <p className="text-gray-400 text-sm mb-6">View past maintenance records and schedule future services.</p>

                <div className="space-y-4">
                  {maintenanceHistory.map((record, index) => (
                    <div key={index} className="p-6 bg-dark-tertiary/30 rounded-lg border border-dark-tertiary">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-white mb-1">{record.type}</h4>
                          <p className="text-sm text-gray-400">{record.description}</p>
                        </div>
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-xs">
                          {record.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar size={16} />
                          <span>{record.date}</span>
                        </div>
                        <span className="text-white font-medium">{record.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'equipment' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Equipment List</h3>
                <p className="text-gray-400 text-sm mb-6">Medical equipment and supplies onboard this ambulance.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {equipment.map((item, index) => (
                    <div key={index} className="p-4 bg-dark-tertiary/30 rounded-lg border border-dark-tertiary">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-white">{item.name}</h4>
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded text-xs">
                          {item.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Last checked: {item.lastChecked}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calls' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Call Assignments</h3>
                <p className="text-gray-400 text-sm mb-6">Recent emergency calls assigned to this ambulance.</p>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-tertiary">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Call ID</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Date & Time</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Location</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Patient</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Duration</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {callAssignments.map((call) => (
                        <tr key={call.id} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-medium text-white">{call.id}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-white">{call.date}</div>
                            <div className="text-sm text-gray-400">{call.time}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-gray-400" />
                              <span className="text-gray-300">{call.location}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-300">{call.patient}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-gray-400" />
                              <span className="text-gray-300">{call.duration}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-xs">
                              {call.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function AmbulanceDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AmbulanceDetailsContent />
    </Suspense>
  );
}
