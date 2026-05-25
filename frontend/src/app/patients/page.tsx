'use client';

import { useState, useEffect } from 'react';

import { patientAPI } from '@/lib/api';
import { Plus, Search, Filter, MoreVertical, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';

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
  doctorSpecialty?: string;
  address?: string;
  history?: string;
}

const calculateAge = (dob: string): number => {
  if (!dob) return 0;
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age < 0 ? 0 : age;
};

export default function PatientsPage() {
  const { user } = useAuthStore();
  const isDoctor = user?.role === 'doctor';

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
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Patients</h1>
            <p className="text-gray-400">Manage your patients and their medical records.</p>
          </div>
          {!isDoctor && (
            <Link href="/patients/add" className="btn-primary flex items-center gap-2">
              <Plus size={20} />
              Add Patient
            </Link>
          )}
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
                    {!isDoctor && <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => {
                    const displayAge = patient.age && patient.age > 0 ? patient.age : calculateAge(patient.dob);
                    return (
                    <tr key={patient.id} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-semibold">
                            {patient.name.charAt(0).toUpperCase()}
                          </div>
                          <Link href={`/patients/${patient.id}`} className="font-medium hover:text-emerald-400 transition-colors">
                            {patient.name}
                          </Link>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-300">
                        {displayAge > 0 ? displayAge : '-'} • {patient.gender || '-'}
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
                      <td className="py-4 px-4 text-gray-300">{patient.lastVisit ? patient.lastVisit : '-'}</td>
                      {!isDoctor && (
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/patients/edit/${patient.id}`} title="Edit Patient">
                              <button className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors border border-emerald-500/20 flex items-center justify-center">
                                <Edit size={15} />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDelete(patient.id)}
                              title="Delete Patient"
                              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20 flex items-center justify-center"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading && patients.length > 0 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-dark-tertiary">
              <p className="text-gray-400 text-sm">
                Showing {patients.length > 0 ? (page - 1) * 10 + 1 : 0} to{" "}
                {Math.min(page * 10, total)} of {total} patients
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 bg-dark-tertiary rounded-lg hover:bg-dark-tertiary/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={page * 10 >= total}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 bg-dark-tertiary rounded-lg hover:bg-dark-tertiary/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
