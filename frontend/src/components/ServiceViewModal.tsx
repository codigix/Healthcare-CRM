'use client';

import { X } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  type: string;
  duration: number;
  price: number;
  description: string;
  status: string;
  department: { name: string };
  createdAt: string;
  updatedAt: string;
}

interface ServiceViewModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ServiceViewModal({ service, isOpen, onClose }: ServiceViewModalProps) {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-dark-secondary rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-dark-secondary flex justify-between items-center p-6 border-b border-dark-tertiary">
          <h2 className="text-2xl font-bold">{service.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-500/20 rounded transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Service ID</p>
              <p className="font-medium">{service.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Department</p>
              <p className="font-medium">{service.department?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Service Type</p>
              <p className="font-medium">{service.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                service.status === 'Active'
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  : 'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}>
                {service.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Duration</p>
              <p className="font-medium">{service.duration} minutes</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Price</p>
              <p className="font-medium">${parseFloat(String(service.price)).toFixed(2)}</p>
            </div>
          </div>

          {service.description && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Description</p>
              <p className="text-gray-300">{service.description}</p>
            </div>
          )}

          <div className="pt-4 border-t border-dark-tertiary">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Created</p>
                <p className="text-gray-300">{new Date(service.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Last Updated</p>
                <p className="text-gray-300">{new Date(service.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
