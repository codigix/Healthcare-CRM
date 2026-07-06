'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'max';
    className?: string;
}

export default function Modal({ isOpen, onClose, title, children, size = 'md', className = '' }: ModalProps) {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        max: 'max-w-full',
    };

    const selectedSizeClass = sizeClasses[size] || sizeClasses.md;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`card w-full ${selectedSizeClass} max-h-[90vh] overflow-y-auto ${className}`}>
                <div className="flex justify-between items-center my-3 my-3 mb-4">
                    <h2 className="text-xl ">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-dark-tertiary rounded transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
