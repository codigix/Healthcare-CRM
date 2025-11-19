'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

export default function ActionModal({ isOpen, onClose, title, children, actions }: ActionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-dark-tertiary rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mb-6">
          {children}
        </div>
        {actions && (
          <div className="flex justify-end gap-3 pt-4 border-t border-dark-tertiary">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}