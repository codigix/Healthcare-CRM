'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, Package, ShoppingCart, DollarSign, TrendingUp, Star, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Supplier {
  id: string;
  name: string;
  category: string;
  contact: string;
  email: string;
  rating: number;
  status: 'Active' | 'Inactive';
}

interface FeaturedSupplier {
  id: string;
  name: string;
  description: string;
  contact: string;
  phone: string;
  email: string;
  location: string;
  rating: number;
  badge: string;
}

interface RecentOrder {
  supplier: string;
  orderId: string;
  date: string;
  amount: number;
  status: string;
}

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('active');
  const [activeTab, setActiveTab] = useState('all');

  const [suppliers] = useState<Supplier[]>([
    {
      id: 'SUP001',
      name: 'MedPlus Supplies',
      category: 'Medical Supplies',
      contact: 'contact@medplus.com',
      email: 'sales@medplus.com',
      rating: 5,
      status: 'Active',
    },
    {
      id: 'SUP002',
      name: 'PharmaTech Inc.',
      category: 'Medications',
      contact: 'sales@pharmatech.com',
      email: 'sales@pharmatech.com',
      rating: 4,
      status: 'Active',
    },
    {
      id: 'SUP003',
      name: 'MediEquip Solutions',
      category: 'Equipment',
      contact: 'info@mediequip.com',
      email: 'info@mediequip.com',
      rating: 4,
      status: 'Active',
    },
    {
      id: 'SUP004',
      name: 'Health Supply Co.',
      category: 'Medical Supplies',
      contact: 'order@healthsupply.com',
      email: 'order@healthsupply.com',
      rating: 3,
      status: 'Active',
    },
    {
      id: 'SUP005',
      name: 'Office Depot Medical',
      category: 'Office Supplies',
      contact: 'medical@officedepot.com',
      email: 'medical@officedepot.com',
      rating: 4,
      status: 'Active',
    },
    {
      id: 'SUP006',
      name: 'Global Pharma Ltd.',
      category: 'Medications',
      contact: 'sales@globalpharma.com',
      email: 'sales@globalpharma.com',
      rating: 5,
      status: 'Active',
    },
    {
      id: 'SUP008',
      name: 'Lab Supplies Direct',
      category: 'Laboratory',
      contact: 'order@labsupplies.com',
      email: 'order@labsupplies.com',
      rating: 3,
      status: 'Active',
    },
  ]);

  const [featuredSuppliers] = useState<FeaturedSupplier[]>([
    {
      id: 'SUP001',
      name: 'MedPlus Supplies',
      description: 'Leading provider of high-quality medical supplies and equipment for healthcare facilities.',
      contact: 'Sarah Johnson',
      phone: '(555) 123-4567',
      email: 'contact@medplus.com',
      location: 'Chicago, IL',
      rating: 5,
      badge: 'Active',
    },
    {
      id: 'SUP002',
      name: 'PharmaTech Inc.',
      description: 'Specialized pharmaceutical supplier with a wide range of medications and healthcare products.',
      contact: 'Michael Chen',
      phone: '(543) 987-5643',
      email: 'sales@pharmatech.com',
      location: 'Boston, MA',
      rating: 4,
      badge: 'Active',
    },
    {
      id: 'SUP003',
      name: 'MediEquip Solutions',
      description: 'Premium medical equipment provider specializing in diagnostic and treatment devices.',
      contact: 'David Rodriguez',
      phone: '(555) 456-7890',
      email: 'info@mediequip.com',
      location: 'San Diego, CA',
      rating: 4,
      badge: 'Active',
    },
    {
      id: 'SUP006',
      name: 'Global Pharma Ltd.',
      description: 'International pharmaceutical supplier with extensive inventory of medications and treatments.',
      contact: 'James Wilson',
      phone: '(553) 789-0123',
      email: 'sales@globalpharma.com',
      location: 'New York, NY',
      rating: 5,
      badge: 'Active',
    },
  ]);

  const [recentOrders] = useState<RecentOrder[]>([
    {
      supplier: 'MedPlus Supplies',
      orderId: '#ORD4815',
      date: 'Apr 15, 2025',
      amount: 1245.00,
      status: 'Delivered',
    },
    {
      supplier: 'PharmaTech Inc.',
      orderId: '#ORD4815',
      date: 'Apr 15, 2025',
      amount: 876.50,
      status: 'Shipped',
    },
    {
      supplier: 'MediEquip Solutions',
      orderId: '#ORD4841',
      date: 'Apr 12, 2025',
      amount: 2340.75,
      status: 'Processing',
    },
    {
      supplier: 'Health Supply Co.',
      orderId: '#ORD4808',
      date: 'Apr 10, 2025',
      amount: 567.25,
      status: 'Delivered',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'Inactive':
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'Shipped':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'Processing':
        return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || supplier.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || supplier.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'preferred' && supplier.rating >= 4) ||
                      (activeTab === 'medications' && supplier.category === 'Medications') ||
                      (activeTab === 'supplies' && supplier.category === 'Medical Supplies');
    return matchesSearch && matchesCategory && matchesStatus && matchesTab;
  });

  const uniqueCategories = Array.from(new Set(suppliers.map(s => s.category)));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Suppliers</h1>
            <p className="text-gray-400">Manage your inventory suppliers and vendors</p>
          </div>
          <div className="flex gap-3">
            <button className="btn-primary">+ Add Supplier</button>
            <button className="btn-secondary">Export</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Package className="text-blue-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">38</div>
                <div className="text-sm text-gray-400">Total Suppliers</div>
                <div className="text-xs text-blue-500">+3 added this quarter</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <ShoppingCart className="text-emerald-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-gray-400">Active Orders</div>
                <div className="text-xs text-emerald-500">+4 orders this week</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Star className="text-purple-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">MedPlus</div>
                <div className="text-sm text-gray-400">Top Supplier</div>
                <div className="text-xs text-purple-500">98% reliability rating</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="text-orange-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">$24,350</div>
                <div className="text-sm text-gray-400">Monthly Spend</div>
                <div className="text-xs text-orange-500">-8% from last month</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-dark-tertiary">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search suppliers..."
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
              All Suppliers
            </button>
            <button
              onClick={() => setActiveTab('preferred')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'preferred'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Preferred
            </button>
            <button
              onClick={() => setActiveTab('medications')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'medications'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Medications
            </button>
            <button
              onClick={() => setActiveTab('supplies')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'supplies'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Medical Supplies
            </button>
          </div>

          <h2 className="text-xl font-semibold mb-4">Supplier Directory</h2>
          <p className="text-gray-400 text-sm mb-6">A comprehensive list of all your suppliers and vendors</p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-tertiary">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">ID</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Name</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Category</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Contact</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Rating</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors">
                    <td className="py-4 px-4 text-gray-300 font-medium">{supplier.id}</td>
                    <td className="py-4 px-4 text-white">{supplier.name}</td>
                    <td className="py-4 px-4 text-gray-300">{supplier.category}</td>
                    <td className="py-4 px-4 text-blue-400">{supplier.contact}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < supplier.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(supplier.status)}`}>
                        {supplier.status}
                      </span>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Featured Suppliers</h2>
            <p className="text-gray-400 text-sm mb-6">Your top-rated and most reliable suppliers</p>

            <div className="space-y-4">
              {featuredSuppliers.map((supplier) => (
                <div key={supplier.id} className="p-4 bg-dark-tertiary/30 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <Package className="text-emerald-500" size={20} />
                      </div>
                      <div>
                        <div className="font-semibold">{supplier.name}</div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(supplier.badge)}`}>
                          {supplier.badge}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < supplier.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{supplier.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Phone size={14} />
                      <span>{supplier.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Mail size={14} />
                      <span>{supplier.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin size={14} />
                      <span>{supplier.location}</span>
                    </div>
                  </div>
                  <button className="mt-4 w-full btn-secondary text-sm flex items-center justify-center gap-2">
                    <ExternalLink size={14} />
                    Visit Website
                  </button>
                </div>
              ))}
            </div>

            <button className="mt-4 w-full btn-secondary text-sm">View All Orders</button>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
            <p className="text-gray-400 text-sm mb-6">Your most recent supplier orders</p>

            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div key={index} className="p-4 bg-dark-tertiary/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">{order.supplier}</div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getOrderStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Order {order.orderId} • {order.date}</span>
                    <span className="font-semibold text-white">${order.amount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-4 w-full btn-secondary text-sm">View All Orders</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
