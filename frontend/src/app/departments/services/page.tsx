'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ServiceViewModal from '@/components/ServiceViewModal';
import { Search, Stethoscope, DollarSign, Clock, TrendingUp, MoreVertical, Edit2, Eye, Trash2 } from 'lucide-react';

interface Department {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
  type: string;
  duration: number;
  price: number;
  description: string;
  status: string;
  department: Department;
  createdAt: string;
  updatedAt: string;
}

export default function ServicesOfferedPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchServicesAndDepartments();
  }, [page, searchQuery, departmentFilter, typeFilter, activeTab]);

  const fetchServicesAndDepartments = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (searchQuery) queryParams.append('search', searchQuery);
      if (departmentFilter !== 'all') queryParams.append('departmentId', departmentFilter);
      if (typeFilter !== 'all') queryParams.append('type', typeFilter);

      const [servicesRes, deptRes] = await Promise.all([
        fetch(`http://localhost:5000/api/departments/services?${queryParams}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }),
        fetch('http://localhost:5000/api/departments?limit=100', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }),
      ]);

      if (servicesRes.ok) {
        const data = await servicesRes.json();
        let filteredServices = data.services || [];

        if (activeTab !== 'all') {
          const typeMap: { [key: string]: string } = {
            diagnostic: 'Diagnostic',
            treatment: 'Treatment',
            preventive: 'Preventive',
          };
          filteredServices = filteredServices.filter((s: Service) => s.type === typeMap[activeTab]);
        }

        setServices(filteredServices);
        setTotal(data.total || 0);
      }

      if (deptRes.ok) {
        const data = await deptRes.json();
        setDepartments(data.departments || []);
      }
    } catch (err) {
      console.error('Failed to fetch services', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    setDeleting(serviceId);
    try {
      const res = await fetch(`http://localhost:5000/api/departments/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.ok) {
        setServices(services.filter(s => s.id !== serviceId));
        setTotal(total - 1);
      } else {
        alert('Failed to delete service');
      }
    } catch (err) {
      console.error('Failed to delete service', err);
      alert('Failed to delete service');
    } finally {
      setDeleting(null);
    }
  };

  const handleView = (service: Service) => {
    setSelectedService(service);
    setShowViewModal(true);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Diagnostic':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'Treatment':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'Preventive':
        return 'bg-purple-500/10 text-purple-500 border border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  const totalServices = services.length;
  const avgDuration = services.length > 0 ? Math.round(services.reduce((sum, s) => sum + s.duration, 0) / services.length) : 0;
  const totalRevenue = services.reduce((sum, s) => sum + (s.price * 1), 0);
  const mostPopularService = services.length > 0 ? services[0] : null;

  const departmentMap: { [key: string]: string } = {};
  departments.forEach(dept => {
    departmentMap[dept.id] = dept.name;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Services Offered</h1>
            <p className="text-gray-400">Manage and view all services offered across departments</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/departments/services/add')}
              className="btn-primary"
            >
              + Add New Service
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Stethoscope className="text-blue-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalServices}</div>
                <div className="text-sm text-gray-400">Total Services</div>
                <div className="text-xs text-blue-500">Across 12 departments</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-emerald-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{mostPopularService?.name || 'N/A'}</div>
                <div className="text-sm text-gray-400">Latest Service</div>
                <div className="text-xs text-emerald-500">${mostPopularService ? parseFloat(String(mostPopularService.price)).toFixed(2) : '0.00'}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Clock className="text-orange-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{avgDuration} min</div>
                <div className="text-sm text-gray-400">Average Duration</div>
                <div className="text-xs text-orange-500">Across all services</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="text-purple-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">${parseFloat(String(totalRevenue)).toFixed(2)}</div>
                <div className="text-sm text-gray-400">Total Revenue</div>
                <div className="text-xs text-purple-500">{services.length} active services</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-6">All Services</h2>
          <p className="text-gray-400 text-sm mb-6">Showing {services.length} of {total} services</p>

          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-dark-tertiary">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent flex-1 outline-none"
            />
          </div>

          <div className="flex gap-4 mb-6 border-b border-dark-tertiary">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'all'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('diagnostic')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'diagnostic'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Diagnostic
            </button>
            <button
              onClick={() => setActiveTab('treatment')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'treatment'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Treatment
            </button>
            <button
              onClick={() => setActiveTab('preventive')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'preventive'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Preventive
            </button>
          </div>

          <div className="flex gap-3 mb-6">
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setPage(1);
              }}
              className="input-field"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="Diagnostic">Diagnostic</option>
              <option value="Treatment">Treatment</option>
              <option value="Preventive">Preventive</option>
            </select>
            <button className="btn-secondary ml-auto">Filter</button>
            <button className="btn-secondary">Export</button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-400">Loading services...</div>
            </div>
          ) : services.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-400">No services found</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-tertiary">
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Service Name</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Department</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Type</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Duration</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Price</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-medium text-white">{service.name}</div>
                        <div className="text-sm text-gray-400">{service.id}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-300">{service.department?.name || 'N/A'}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(service.type)}`}>
                          {service.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-300">{service.duration} min</td>
                      <td className="py-4 px-4 text-white font-medium">${parseFloat(String(service.price)).toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          service.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                          {service.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(service)}
                            className="p-2 hover:bg-blue-500/20 rounded transition-colors text-blue-400 hover:text-blue-300"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => router.push(`/departments/services/edit?id=${service.id}`)}
                            className="p-2 hover:bg-emerald-500/20 rounded transition-colors text-emerald-400 hover:text-emerald-300"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(service.id)}
                            disabled={deleting === service.id}
                            className="p-2 hover:bg-red-500/20 rounded transition-colors text-red-400 hover:text-red-300 disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && services.length > 0 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-dark-tertiary">
              <p className="text-sm text-gray-400">Showing {services.length} of {total} services</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="btn-secondary disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-300">Page {page}</span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page * limit >= total}
                  className="btn-primary disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        <ServiceViewModal
          service={selectedService}
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
        />
      </div>
    </DashboardLayout>
  );
}
