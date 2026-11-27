'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'max';
    className?: string;
}

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

/**
 * Shared popup. Rendered into <body> (a portal) so it always sits above the sidebar
 * and top bar, with a see-through dimmed backdrop in both themes. Closes on Escape
 * or a click on the backdrop, and stops the page behind it from scrolling.
 */
export default function Modal({ isOpen, onClose, title, children, size = 'md', className = '' }: ModalProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKey);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-[2px]"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.55)' }}
            onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            <div className={`card w-full ${sizeClasses[size] || sizeClasses.md} max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn ${className}`}>
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-700/40">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="p-1 rounded text-gray-400 hover:text-gray-200 hover:bg-dark-tertiary transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>,
        document.body,
    );
}
