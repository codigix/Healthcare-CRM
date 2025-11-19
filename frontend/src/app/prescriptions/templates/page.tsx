'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, Plus, Edit, Trash2, Copy, Eye, AlertCircle } from 'lucide-react';
import { prescriptionTemplateAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface MedicationTemplate {
  id: string;
  name: string;
  category: string;
  medications: Array<{
    name: string;
    dosage: string;
    route: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  createdBy: string;
  lastUsed: string | null;
  createdAt: string;
  usageCount: number;
}

export default function MedicineTemplatesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<MedicationTemplate | null>(null);
  const [templates, setTemplates] = useState<MedicationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingTemplate, setEditingTemplate] = useState<MedicationTemplate | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', category: '' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({ name: '', category: '', medicines: [] });

  const tabs = [
    { id: 'all', label: 'All Templates' },
    { id: 'recent', label: 'Recently Used' },
  ];

  useEffect(() => {
    fetchTemplates();
  }, [page, searchQuery, activeTab]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await prescriptionTemplateAPI.list(page, 10, searchQuery, activeTab);
      
      const templatesData = response.data.templates || [];
      const formattedTemplates = templatesData.map((t: any) => ({
        id: t.id,
        name: t.name,
        category: t.category || 'General',
        medications: typeof t.medicines === 'string' ? JSON.parse(t.medicines) : t.medicines || [],
        createdBy: t.createdBy || 'System',
        lastUsed: t.lastUsed || null,
        createdAt: t.createdAt,
        usageCount: t.usageCount || 0,
      }));
      
      setTemplates(formattedTemplates);
      
      const total = response.data.total || 0;
      const limit = response.data.limit || 10;
      const totalPages = Math.ceil(total / limit) || 1;
      setTotalPages(totalPages);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch templates');
      console.error('Failed to fetch templates', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      await prescriptionTemplateAPI.delete(id);
      setTemplates(templates.filter(t => t.id !== id));
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(null);
      }
      alert('Template deleted successfully');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete template');
    }
  };

  const handleUseTemplate = async (template: MedicationTemplate) => {
    try {
      await prescriptionTemplateAPI.use(template.id);
      router.push(`/prescriptions/create?templateId=${template.id}`);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to use template');
    }
  };

  const handleEditTemplate = (template: MedicationTemplate) => {
    setEditingTemplate(template);
    setEditFormData({ name: template.name, category: template.category });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingTemplate) return;

    try {
      await prescriptionTemplateAPI.update(editingTemplate.id, {
        name: editFormData.name,
        category: editFormData.category,
        medicines: editingTemplate.medications,
      });
      
      const updatedTemplates = templates.map(t =>
        t.id === editingTemplate.id
          ? { ...t, name: editFormData.name, category: editFormData.category }
          : t
      );
      setTemplates(updatedTemplates);
      
      if (selectedTemplate?.id === editingTemplate.id) {
        setSelectedTemplate({
          ...selectedTemplate,
          name: editFormData.name,
          category: editFormData.category,
        });
      }
      
      setShowEditModal(false);
      setEditingTemplate(null);
      alert('Template updated successfully');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update template');
    }
  };

  const handleCreateTemplate = async () => {
    if (!createFormData.name.trim()) {
      alert('Please enter a template name');
      return;
    }

    try {
      await prescriptionTemplateAPI.create({
        name: createFormData.name,
        category: createFormData.category,
        medicines: createFormData.medicines,
      });
      
      setShowCreateModal(false);
      setCreateFormData({ name: '', category: '', medicines: [] });
      alert('Template created successfully');
      fetchTemplates();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create template');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Prescription Templates</h1>
            <p className="text-gray-400">Manage reusable medication templates for prescriptions.</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            New Template
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card">
              <div className="border-b border-dark-tertiary mb-6">
                <div className="flex gap-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setPage(1);
                      }}
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
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    className="bg-transparent py-3 flex-1 outline-none"
                  />
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                  <AlertCircle size={18} className="text-red-500" />
                  <span className="text-red-400">{error}</span>
                </div>
              )}

              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">Loading templates...</p>
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center py-8">
                  <Eye size={32} className="mx-auto text-gray-500 mb-2" />
                  <p className="text-gray-400">No templates found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-tertiary">
                        <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Template Name</th>
                        <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Category</th>
                        <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Medications</th>
                        <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Created By</th>
                        <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Last Used</th>
                        <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Usage</th>
                        <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {templates.map((template) => (
                        <tr
                          key={template.id}
                          className={`border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors cursor-pointer ${
                            selectedTemplate?.id === template.id ? 'bg-dark-tertiary/50' : ''
                          }`}
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <td className="py-4 px-4">
                            <div className="font-medium text-white">{template.name}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                              {template.category}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-300">{template.medications?.length || 0}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-300">{template.createdBy}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-300">
                              {template.lastUsed
                                ? new Date(template.lastUsed).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })
                                : 'Never'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-300">{template.usageCount} times</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleUseTemplate(template)}
                                className="p-2 hover:bg-emerald-500/20 rounded transition-colors"
                                title="Use Template"
                              >
                                <Copy size={18} className="text-emerald-500" />
                              </button>
                              <button
                                onClick={() => handleEditTemplate(template)}
                                className="p-2 hover:bg-blue-500/20 rounded transition-colors"
                                title="Edit"
                              >
                                <Edit size={18} className="text-blue-500" />
                              </button>
                              <button
                                onClick={() => handleDelete(template.id)}
                                className="p-2 hover:bg-red-500/20 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={18} className="text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-6 flex justify-between items-center">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-gray-400">Page {page} of {totalPages}</span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="card sticky top-6">
              <h2 className="text-xl font-semibold mb-6">Template Details</h2>

              {selectedTemplate ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-500 mb-2">
                      {selectedTemplate.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                        {selectedTemplate.category}
                      </span>
                      <span className="text-sm text-gray-400">
                        • Created by {selectedTemplate.createdBy}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">Medications</h4>
                    <div className="space-y-4">
                      {selectedTemplate.medications?.map((med, idx) => (
                        <div key={idx} className="p-4 bg-dark-tertiary/50 rounded-lg">
                          <div className="font-medium text-white mb-2">{med.name}</div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Dosage:</span>
                              <span className="text-gray-300">{med.dosage}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Route:</span>
                              <span className="text-gray-300">{med.route}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Frequency:</span>
                              <span className="text-gray-300">{med.frequency}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Duration:</span>
                              <span className="text-gray-300">{med.duration}</span>
                            </div>
                            {med.instructions && (
                              <div className="mt-2 pt-2 border-t border-dark-tertiary">
                                <span className="text-gray-400 text-xs">Instructions:</span>
                                <p className="text-gray-300 text-xs mt-1">{med.instructions}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-dark-tertiary">
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">Usage Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-dark-tertiary/50 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-500">
                          {selectedTemplate.usageCount}
                        </div>
                        <div className="text-xs text-gray-400">Total Uses</div>
                      </div>
                      <div className="p-3 bg-dark-tertiary/50 rounded-lg">
                        <div className="text-sm font-medium text-white">
                          {selectedTemplate.lastUsed
                            ? new Date(selectedTemplate.lastUsed).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-400">Last Used</div>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-dark-tertiary/50 rounded-lg">
                      <div className="text-sm font-medium text-white">
                        {new Date(selectedTemplate.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="text-xs text-gray-400">Created On</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUseTemplate(selectedTemplate)}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      <Copy size={18} />
                      Use Template
                    </button>
                    <button
                      onClick={() => handleEditTemplate(selectedTemplate)}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Edit size={18} />
                      Edit
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-dark-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye size={32} className="text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No template selected</h3>
                  <p className="text-gray-400 text-sm">
                    Click on a template to view its details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEditModal && editingTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-secondary rounded-lg p-6 max-w-md w-full mx-4 space-y-4">
            <h3 className="text-xl font-semibold">Edit Template</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Template Name
              </label>
              <input
                type="text"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <input
                type="text"
                value={editFormData.category}
                onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                className="input-field w-full"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSaveEdit}
                className="btn-primary flex-1"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTemplate(null);
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-secondary rounded-lg p-6 max-w-md w-full mx-4 space-y-4">
            <h3 className="text-xl font-semibold">Create New Template</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Template Name
              </label>
              <input
                type="text"
                value={createFormData.name}
                onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                placeholder="e.g., Common Antibiotics, Pain Management"
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <input
                type="text"
                value={createFormData.category}
                onChange={(e) => setCreateFormData({ ...createFormData, category: e.target.value })}
                placeholder="e.g., Antibiotics, Pain Relief"
                className="input-field w-full"
              />
            </div>

            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-300">
              <p>You can add medications to this template after creation, or leave it empty for now.</p>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleCreateTemplate}
                className="btn-primary flex-1"
              >
                Create Template
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateFormData({ name: '', category: '', medicines: [] });
                }}
                className="btn-secondary flex-1"
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
