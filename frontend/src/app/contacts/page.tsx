'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, Plus, Mail, Phone, MapPin } from 'lucide-react';

interface Contact {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  department: string;
  location: string;
  avatar: string;
}

export default function ContactsPage() {
  const [contacts] = useState<Contact[]>([
    {
      id: 1,
      name: 'Dr. James Wilson',
      role: 'Cardiologist',
      email: 'dr.james@medixpro.com',
      phone: '+1 (555) 123-4567',
      department: 'Cardiology',
      location: 'Floor 3, Room 301',
      avatar: 'JW',
    },
    {
      id: 2,
      name: 'Dr. Sarah Johnson',
      role: 'General Practitioner',
      email: 'dr.sarah@medixpro.com',
      phone: '+1 (555) 234-5678',
      department: 'General Medicine',
      location: 'Floor 2, Room 201',
      avatar: 'SJ',
    },
    {
      id: 3,
      name: 'Nurse Emily Chen',
      role: 'Head Nurse',
      email: 'emily.chen@medixpro.com',
      phone: '+1 (555) 345-6789',
      department: 'Nursing',
      location: 'Floor 1, Nurses Station',
      avatar: 'EC',
    },
    {
      id: 4,
      name: 'Dr. Michael Brown',
      role: 'Surgeon',
      email: 'dr.michael@medixpro.com',
      phone: '+1 (555) 456-7890',
      department: 'Surgery',
      location: 'Floor 4, OR Wing',
      avatar: 'MB',
    },
    {
      id: 5,
      name: 'Admin Staff',
      role: 'Administrative Manager',
      email: 'admin@medixpro.com',
      phone: '+1 (555) 567-8901',
      department: 'Administration',
      location: 'Floor 1, Admin Office',
      avatar: 'AS',
    },
    {
      id: 6,
      name: 'Dr. Lisa Anderson',
      role: 'Neurologist',
      email: 'dr.lisa@medixpro.com',
      phone: '+1 (555) 678-9012',
      department: 'Neurology',
      location: 'Floor 3, Room 302',
      avatar: 'LA',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || contact.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = ['all', ...new Set(contacts.map(c => c.department))];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Contacts</h1>
            <p className="text-gray-400">Manage your clinic contacts and staff directory</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Add Contact
          </button>
        </div>

        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px] relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-tertiary rounded-lg text-white border border-dark-secondary focus:border-emerald-500 outline-none"
            />
          </div>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-4 py-2 bg-dark-tertiary rounded-lg text-white border border-dark-secondary focus:border-emerald-500 outline-none"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'all' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="card p-6 hover:bg-dark-secondary transition-colors"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center font-bold text-white text-lg">
                  {contact.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{contact.name}</h3>
                  <p className="text-sm text-gray-400">{contact.role}</p>
                  <p className="text-xs text-gray-500 mt-1">{contact.department}</p>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 text-sm text-gray-300 hover:text-emerald-400 transition-colors"
                >
                  <Mail size={16} className="text-gray-500" />
                  <span className="truncate">{contact.email}</span>
                </a>
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-3 text-sm text-gray-300 hover:text-emerald-400 transition-colors"
                >
                  <Phone size={16} className="text-gray-500" />
                  {contact.phone}
                </a>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <MapPin size={16} className="text-gray-500 flex-shrink-0" />
                  {contact.location}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-dark-tertiary flex gap-2">
                <button className="flex-1 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors">
                  Message
                </button>
                <button className="flex-1 py-2 rounded-lg bg-dark-tertiary text-gray-300 text-sm font-medium hover:bg-dark-secondary transition-colors">
                  Call
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No contacts found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
