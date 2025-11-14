'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, Shield, Users, FileText, Settings, Edit2, Trash2, Eye } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  category: string;
  description: string | null;
  staffCount: number;
  status: string;
  updatedAt: string;
}

interface ViewModalProps {
  role: Role | null;
  onClose: () => void;
}

const ViewRoleModal = ({ role, onClose }: ViewModalProps) => {
  if (!role) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-dark-secondary rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{role.name}</h2>
        <div className="space-y-3 mb-6">
          <div><span className="text-gray-400">Category:</span> <span className="text-white">{role.category}</span></div>
          <div><span className="text-gray-400">Description:</span> <span className="text-white">{role.description || 'N/A'}</span></div>
          <div><span className="text-gray-400">Staff Assigned:</span> <span className="text-white">{role.staffCount}</span></div>
          <div><span className="text-gray-400">Status:</span> <span className={`${role.status === 'Active' ? 'text-emerald-500' : 'text-red-500'}`}>{role.status}</span></div>
          <div><span className="text-gray-400">Last Updated:</span> <span className="text-white">{new Date(role.updatedAt).toLocaleDateString()}</span></div>
        </div>
        <button onClick={onClose} className="btn-secondary w-full">Close</button>
      </div>
    </div>
  );
};

export default function RolesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setRoles(data.roles);
      }
    } catch (err) {
      setError('Failed to fetch roles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          fetchRoles();
        }
      } catch (err) {
        console.error('Failed to delete role:', err);
      }
    }
  };

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || role.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalRoles = roles.length;
  const customRoles = roles.filter(r => r.category === 'Custom').length;
  const medicalRoles = roles.filter(r => r.category === 'Medical').length;
  const totalStaff = roles.reduce((sum, r) => sum + r.staffCount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Roles & Permissions</h1>
            <p className="text-gray-400">Manage staff access and security controls</p>
          </div>
          <button className="btn-primary">+ Add Role</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Shield className="text-blue-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm text-gray-400">Total Roles</div>
                <div className="text-xs text-blue-500">5 default, 2 custom</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <Users className="text-emerald-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">53</div>
                <div className="text-sm text-gray-400">Staff Assigned</div>
                <div className="text-xs text-emerald-500">Across all roles</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <FileText className="text-purple-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-gray-400">Medical Roles</div>
                <div className="text-xs text-purple-500">36 staff assigned</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Settings className="text-orange-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm text-gray-400">Permission Sets</div>
                <div className="text-xs text-orange-500">4 permission types</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-4 border-b border-dark-tertiary flex-1">
              <button className="pb-3 px-1 font-medium text-emerald-500 border-b-2 border-emerald-500">Roles</button>
              <button className="pb-3 px-1 font-medium text-gray-400 hover:text-gray-300">Templates</button>
              <button className="pb-3 px-1 font-medium text-gray-400 hover:text-gray-300">Permission Matrix</button>
              <button className="pb-3 px-1 font-medium text-gray-400 hover:text-gray-300">Audit Logs</button>
            </div>
            <button className="btn-secondary ml-4">Export</button>
          </div>

          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-dark-tertiary">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent flex-1 outline-none"
            />
          </div>

          <div className="flex gap-4 mb-6">
            <button className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-lg text-sm font-medium">All Roles</button>
            <button className="px-4 py-2 bg-dark-tertiary/30 text-gray-400 rounded-lg text-sm font-medium hover:bg-dark-tertiary/50">Medical</button>
            <button className="px-4 py-2 bg-dark-tertiary/30 text-gray-400 rounded-lg text-sm font-medium hover:bg-dark-tertiary/50">Administrative</button>
            <button className="px-4 py-2 bg-dark-tertiary/30 text-gray-400 rounded-lg text-sm font-medium hover:bg-dark-tertiary/50">Custom</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-tertiary">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Role Name</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Category</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Description</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Users</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Last Updated</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role, index) => (
                  <tr key={index} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{role.name}</span>
                        {role.name === 'Administrator' && <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs rounded">Default</span>}
                        {role.category === 'Custom' && <span className="px-2 py-1 bg-purple-500/10 text-purple-500 text-xs rounded">Custom</span>}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{role.category}</td>
                    <td className="py-4 px-4 text-gray-400 text-sm">{role.description}</td>
                    <td className="py-4 px-4 text-gray-300">{role.users}</td>
                    <td className="py-4 px-4">
                      <div className="text-gray-300 text-sm">{role.updated}</div>
                      <div className="text-gray-500 text-xs">by {role.updatedBy}</div>
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-gray-400 hover:text-white transition-colors">•••</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
