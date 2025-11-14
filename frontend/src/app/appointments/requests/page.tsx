'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { appointmentAPI, doctorAPI, patientAPI } from '@/lib/api';
import { Search, CheckCircle, XCircle, Clock, MoreVertical } from 'lucide-react';
import Modal from '@/components/UI/Modal';
import AppointmentForm from '@/components/Forms/AppointmentForm';

interface AppointmentRequest {
  id: string;
  date: string;
  time: string;
  status: string;
  type?: string;
  urgency?: string;
  requestedDoctor?: string;
  preferredDate?: string;
  doctorId: string;
  patientId: string;
  doctor?: { id: string; name: string };
  patient?: { id: string; name: string };
}

interface Doctor {
  id: string;
  name: string;
}

interface Patient {
  id: string;
  name: string;
}

export default function AppointmentRequestsPage() {
  const [requests, setRequests] = useState<AppointmentRequest[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AppointmentRequest | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appointmentsRes, doctorsRes, patientsRes] = await Promise.all([
        appointmentAPI.list(1, 100),
        doctorAPI.list(1, 100),
        patientAPI.list(1, 100),
      ]);
      
      setRequests(appointmentsRes.data.appointments);
      setDoctors(doctorsRes.data.doctors);
      setPatients(patientsRes.data.patients);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await appointmentAPI.update(id, { status: 'confirmed' });
      fetchData();
    } catch (error) {
      console.error('Failed to approve request', error);
    }
  };

  const handleReject = async (id: string) => {
    if (confirm('Are you sure you want to reject this appointment request?')) {
      try {
        await appointmentAPI.update(id, { status: 'cancelled' });
        fetchData();
      } catch (error) {
        console.error('Failed to reject request', error);
      }
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'medium':
        return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
      case 'normal':
      case 'low':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  const tabs = [
    { id: 'pending', label: 'Pending Requests' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
  ];

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         req.doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'pending') return matchesSearch && req.status.toLowerCase() === 'pending';
    if (activeTab === 'approved') return matchesSearch && req.status.toLowerCase() === 'confirmed';
    if (activeTab === 'rejected') return matchesSearch && req.status.toLowerCase() === 'cancelled';
    return matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Appointment Requests</h1>
            <p className="text-gray-400">Review and process incoming appointment requests.</p>
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

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 flex items-center gap-2 bg-dark-tertiary rounded-lg px-4">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent py-3 flex-1 outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading requests...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-dark-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={32} className="text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No {activeTab} requests</h3>
              <p className="text-gray-400">There are no appointment requests in this category.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-6 bg-dark-tertiary/50 rounded-lg border border-dark-tertiary hover:border-gray-600 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-semibold text-lg">
                            {request.patient.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{request.patient.name}</h3>
                            <p className="text-sm text-gray-400">
                              Requested: {new Date(request.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        {request.urgency && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                            {request.urgency} Priority
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Requested Doctor:</span>
                          <p className="font-medium text-white mt-1">
                            {request.requestedDoctor || `Dr. ${request.doctor.name}`}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">Preferred Date:</span>
                          <p className="font-medium text-white mt-1">
                            {request.preferredDate || new Date(request.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">Type:</span>
                          <p className="font-medium text-white mt-1">{request.type || 'Check-up'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2">
                      {activeTab === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors"
                          >
                            <CheckCircle size={18} />
                            <span className="hidden md:inline">Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg transition-colors"
                          >
                            <XCircle size={18} />
                            <span className="hidden md:inline">Reject</span>
                          </button>
                        </>
                      )}
                      {activeTab === 'approved' && (
                        <span className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg">
                          <CheckCircle size={18} />
                          Approved
                        </span>
                      )}
                      {activeTab === 'rejected' && (
                        <span className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg">
                          <XCircle size={18} />
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Clock className="text-orange-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {requests.filter(r => r.status.toLowerCase() === 'pending').length}
                </div>
                <div className="text-sm text-gray-400">Pending Requests</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-emerald-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {requests.filter(r => r.status.toLowerCase() === 'confirmed').length}
                </div>
                <div className="text-sm text-gray-400">Approved</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <XCircle className="text-red-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {requests.filter(r => r.status.toLowerCase() === 'cancelled').length}
                </div>
                <div className="text-sm text-gray-400">Rejected</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title="Process Request"
      >
        {selectedRequest && (
          <AppointmentForm
            appointment={selectedRequest}
            doctors={doctors}
            patients={patients}
            onSuccess={() => {
              setShowModal(false);
              fetchData();
            }}
          />
        )}
      </Modal>
    </DashboardLayout>
  );
}
