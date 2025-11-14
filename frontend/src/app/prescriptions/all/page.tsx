'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, Filter, Plus, MoreVertical, Download, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { prescriptionAPI, patientAPI, doctorAPI } from '@/lib/api';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: string;
  instructions: string;
  allowRefills: boolean;
  refillCount: number;
}

interface Prescription {
  id: string;
  patient: {
    id: string;
    name: string;
    gender?: string;
    dob?: string;
  };
  doctor: {
    id: string;
    name: string;
  };
  prescriptionDate: string;
  prescriptionType: string;
  diagnosis?: string;
  notesForPharmacist?: string;
  medications: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function AllPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prescRes, patRes, docRes] = await Promise.all([
        prescriptionAPI.list(1, 100, searchQuery),
        patientAPI.list(1, 100),
        doctorAPI.list(1, 100),
      ]);
      
      setPrescriptions(prescRes.data.prescriptions || []);
      setPatients(patRes.data.patients || []);
      setDoctors(docRes.data.doctors || []);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'expired':
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'pending':
        return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  const handleEdit = (prescription: Prescription) => {
    setEditingId(prescription.id);
    setEditForm({
      patientId: prescription.patient.id,
      doctorId: prescription.doctor.id,
      prescriptionDate: prescription.prescriptionDate.split('T')[0],
      prescriptionType: prescription.prescriptionType,
      diagnosis: prescription.diagnosis || '',
      notesForPharmacist: prescription.notesForPharmacist || '',
      status: prescription.status,
      medications: typeof prescription.medications === 'string' ? JSON.parse(prescription.medications) : prescription.medications,
    });
    setOpenMenuId(null);
  };

  const handleSaveEdit = async () => {
    if (editingId && editForm) {
      try {
        await prescriptionAPI.update(editingId, editForm);
        await fetchData();
        setEditingId(null);
      } catch (err) {
        console.error('Failed to update prescription', err);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this prescription?')) {
      try {
        await prescriptionAPI.delete(id);
        setPrescriptions(prev => prev.filter(p => p.id !== id));
        setOpenMenuId(null);
      } catch (err) {
        console.error('Failed to delete prescription', err);
      }
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prescription.doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prescription.status?.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const parseMedications = (med: string): Medication[] => {
    try {
      return typeof med === 'string' ? JSON.parse(med) : med;
    } catch {
      return [];
    }
  };

  const calculateAge = (dob: string | undefined) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Prescriptions</h1>
            <p className="text-gray-400">Manage patient prescriptions and medications.</p>
          </div>
          <Link href="/prescriptions/create">
            <button className="btn-primary flex items-center gap-2">
              <Plus size={20} />
              Create Prescription
            </button>
          </Link>
        </div>

        <div className="card">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
            <div className="flex-1 flex items-center gap-2 bg-dark-tertiary rounded-lg px-4 w-full">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search prescriptions..."
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
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="pending">Pending</option>
              </select>
              <button className="btn-secondary flex items-center gap-2">
                <Filter size={20} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading prescriptions...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-tertiary">
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Patient</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Doctor</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Date</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Type</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Medications</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrescriptions.map((prescription) => (
                    <tr key={prescription.id} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-semibold">
                            {prescription.patient.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{prescription.patient.name}</div>
                            {prescription.patient.dob && (
                              <div className="text-sm text-gray-400">
                                {calculateAge(prescription.patient.dob)}y • {prescription.patient.gender}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-300">Dr. {prescription.doctor.name}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white">
                          {new Date(prescription.prescriptionDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-300 text-sm">{prescription.prescriptionType}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                          {prescription.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-400">
                          {parseMedications(prescription.medications).length} medication(s)
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2 relative">
                          <button
                            onClick={() => setViewingId(prescription.id)}
                            className="p-2 hover:bg-blue-500/20 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} className="text-blue-500" />
                          </button>
                          <button className="p-2 hover:bg-emerald-500/20 rounded transition-colors" title="Download">
                            <Download size={18} className="text-emerald-500" />
                          </button>
                          <button
                            onClick={() => setOpenMenuId(openMenuId === prescription.id ? null : prescription.id)}
                            className="p-2 hover:bg-gray-500/20 rounded transition-colors"
                            title="More"
                          >
                            <MoreVertical size={18} className="text-gray-400" />
                          </button>
                          
                          {openMenuId === prescription.id && (
                            <div className="absolute right-0 mt-2 w-40 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-lg z-10 top-full">
                              <button
                                onClick={() => handleEdit(prescription)}
                                className="w-full text-left px-4 py-2 hover:bg-dark-tertiary transition-colors flex items-center gap-2 text-gray-300 hover:text-white first:rounded-t-lg"
                              >
                                <Edit size={16} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(prescription.id)}
                                className="w-full text-left px-4 py-2 hover:bg-red-500/20 transition-colors flex items-center gap-2 text-red-400 hover:text-red-300 last:rounded-b-lg"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredPrescriptions.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No prescriptions found matching your search.
            </div>
          )}
        </div>
      </div>

      {viewingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {prescriptions.find(p => p.id === viewingId) && (
              <>
                <h3 className="text-xl font-semibold mb-6">Prescription Details</h3>
                {(() => {
                  const prescription = prescriptions.find(p => p.id === viewingId);
                  if (!prescription) return null;
                  
                  const meds = parseMedications(prescription.medications);
                  const age = calculateAge(prescription.patient.dob);
                  
                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400">Patient</label>
                          <p className="text-white font-medium">{prescription.patient.name}</p>
                          {age && <p className="text-sm text-gray-400">{age} years old • {prescription.patient.gender}</p>}
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Doctor</label>
                          <p className="text-white font-medium">Dr. {prescription.doctor.name}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Date</label>
                          <p className="text-white font-medium">
                            {new Date(prescription.prescriptionDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Type</label>
                          <p className="text-white font-medium">{prescription.prescriptionType}</p>
                        </div>
                      </div>

                      {prescription.diagnosis && (
                        <div>
                          <label className="text-sm text-gray-400">Diagnosis</label>
                          <p className="text-white">{prescription.diagnosis}</p>
                        </div>
                      )}

                      <div>
                        <label className="text-sm text-gray-400 block mb-2">Medications</label>
                        <div className="space-y-3">
                          {meds.map((med, idx) => (
                            <div key={idx} className="bg-dark-tertiary/50 p-3 rounded">
                              <p className="font-medium text-white">{med.name}</p>
                              <div className="text-sm text-gray-400 mt-1">
                                <p>{med.dosage} • {med.frequency}</p>
                                <p>{med.duration} {med.duration} • {med.route}</p>
                                {med.instructions && <p className="mt-1">{med.instructions}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {prescription.notesForPharmacist && (
                        <div>
                          <label className="text-sm text-gray-400">Notes for Pharmacist</label>
                          <p className="text-white">{prescription.notesForPharmacist}</p>
                        </div>
                      )}
                    </div>
                  );
                })()}
                <button
                  onClick={() => setViewingId(null)}
                  className="btn-secondary w-full mt-6"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {editingId && editForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Edit Prescription</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Prescription Type</label>
                <select
                  value={editForm.prescriptionType}
                  onChange={(e) => setEditForm(prev => ({ ...prev, prescriptionType: e.target.value }))}
                  className="input-field w-full"
                >
                  <option value="Standard">Standard</option>
                  <option value="Controlled">Controlled Substance</option>
                  <option value="Compound">Compound</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Diagnosis</label>
                <textarea
                  value={editForm.diagnosis}
                  onChange={(e) => setEditForm(prev => ({ ...prev, diagnosis: e.target.value }))}
                  className="input-field w-full"
                  placeholder="Diagnosis"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                  className="input-field w-full"
                >
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveEdit}
                className="flex-1 btn-primary"
              >
                Save
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
