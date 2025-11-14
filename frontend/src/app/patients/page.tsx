'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { patientAPI } from '@/lib/api';
import { Plus, Search, Filter, MoreVertical, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  age?: number;
  status?: string;
  lastVisit?: string;
  condition?: string;
  doctor?: string;
  address?: string;
  history?: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, [page, search]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.list(page, 10, search);
      setPatients(response.data.patients);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Failed to fetch patients', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientAPI.delete(id);
        fetchPatients();
      } catch (error) {
        console.error('Failed to delete patient', error);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Patients</h1>
            <p className="text-gray-400">Manage your patients and their medical records.</p>
          </div>
          <Link href="/patients/add" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Add Patient
          </Link>
        </div>

        <div className="card">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Patients List</h2>
            <p className="text-gray-400 text-sm">A list of all patients in your clinic with their details.</p>
          </div>

          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 bg-dark-tertiary rounded-lg px-4 flex-1 max-w-md">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent py-3 flex-1 outline-none"
              />
            </div>
            <button className="p-3 bg-dark-tertiary hover:bg-dark-tertiary/80 rounded-lg transition-colors">
              <Filter size={20} />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-tertiary">
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Name</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Age/Gender</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Last Visit</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Condition</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Doctor</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-semibold">
                            {patient.name.charAt(0)}
                          </div>
                          <span className="font-medium">{patient.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-300">
                        {patient.age || 'N/A'} • {patient.gender}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          patient.status === 'Inactive' 
                            ? 'bg-yellow-500/20 text-yellow-500' 
                            : 'bg-emerald-500/20 text-emerald-500'
                        }`}>
                          {patient.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-300">{patient.lastVisit || 'N/A'}</td>
                      <td className="py-4 px-4 text-gray-300">{patient.condition || 'N/A'}</td>
                      <td className="py-4 px-4 text-gray-300">{patient.doctor || 'N/A'}</td>
                      <td className="py-4 px-4 relative">
                        <div className="flex items-center justify-center">
                          <button 
                            onClick={() => setOpenMenuId(openMenuId === patient.id ? null : patient.id)}
                            className="p-2 hover:bg-dark-tertiary rounded transition-colors"
                          >
                            <MoreVertical size={18} className="text-gray-400" />
                          </button>
                          
                          {openMenuId === patient.id && (
                            <div className="absolute right-0 mt-2 w-40 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-lg z-10 top-full">
                              <Link href={`/patients/edit/${patient.id}`}>
                                <button className="w-full text-left px-4 py-2 hover:bg-dark-tertiary transition-colors flex items-center gap-2 text-gray-300 hover:text-white first:rounded-t-lg">
                                  <Edit size={16} />
                                  Edit
                                </button>
                              </Link>
                              <button
                                onClick={() => {
                                  handleDelete(patient.id);
                                  setOpenMenuId(null);
                                }}
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
        </div>
      </div>
    </DashboardLayout>
  );
}
