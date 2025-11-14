'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Mail, Archive, Trash2, Star, Search, Plus } from 'lucide-react';

interface EmailMessage {
  id: number;
  from: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  starred: boolean;
  hasAttachment: boolean;
}

export default function EmailPage() {
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [emails, setEmails] = useState<EmailMessage[]>([
    {
      id: 1,
      from: 'dr.johnson@medixpro.com',
      subject: 'Your Recent Test Results',
      preview: 'Dear Mr. Smith, I\'m pleased to inform you that your recent blood tests came back normal. No further action is needed at this time.',
      date: 'over 2 years ago',
      read: false,
      starred: false,
      hasAttachment: false,
    },
    {
      id: 2,
      from: 'admin@medixpro.com',
      subject: 'Staff Meeting - April 20th',
      preview: 'Dear Dr. Johnson, This is a reminder about the upcoming staff meeting on April 20th at 9:00 AM in Conference Room A.',
      date: 'over 2 years ago',
      read: true,
      starred: false,
      hasAttachment: false,
    },
    {
      id: 3,
      from: 'insurance@healthcare.com',
      subject: 'Claim #87654 - Additional Information Required',
      preview: 'You need additional documentation for claim #87654. Please provide the requested information within 14 days.',
      date: 'over 2 years ago',
      read: false,
      starred: true,
      hasAttachment: true,
    },
    {
      id: 4,
      from: 'dr.smith@medixpro.com',
      subject: 'Patient Referral - Cardiology Consultation',
      preview: 'Dear colleague, I\'m referring a patient for cardiology consultation. Patient records attached.',
      date: 'over 2 years ago',
      read: true,
      starred: false,
      hasAttachment: true,
    },
    {
      id: 5,
      from: 'hr@medixpro.com',
      subject: 'Annual Leave Balance Update',
      preview: 'This is a reminder that you have 15 days of annual leave remaining that must be used before December 31st.',
      date: 'over 2 years ago',
      read: true,
      starred: false,
      hasAttachment: false,
    },
  ]);

  const folders = [
    { id: 'inbox', label: 'Inbox', count: 5, icon: Mail },
    { id: 'sent', label: 'Sent', count: 12, icon: Mail },
    { id: 'draft', label: 'Draft', count: 3, icon: Mail },
    { id: 'bin', label: 'Bin', count: 2, icon: Trash2 },
    { id: 'archive', label: 'Archive', count: 24, icon: Archive },
  ];

  const toggleStar = (id: number) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, starred: !email.starred } : email
    ));
  };

  return (
    <DashboardLayout>
      <div className="flex gap-6 h-full">
        <div className="w-64 border-r border-dark-tertiary">
          <div className="p-4">
            <button className="w-full btn-primary flex items-center justify-center gap-2 mb-6">
              <Plus size={18} />
              Compose
            </button>
          </div>

          <div className="space-y-1 px-2">
            {folders.map((folder) => {
              const Icon = folder.icon;
              return (
                <button
                  key={folder.id}
                  onClick={() => setActiveFolder(folder.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    activeFolder === folder.id
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'text-gray-400 hover:bg-dark-tertiary'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={18} />
                    <span className="text-sm font-medium">{folder.label}</span>
                  </div>
                  <span className={`text-xs font-semibold ${activeFolder === folder.id ? 'text-emerald-500' : 'text-gray-500'}`}>
                    {folder.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-dark-tertiary">
            <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Labels</div>
            <div className="space-y-1 px-2">
              {['Patient', 'Admin', 'Lab', 'Pharmacy', 'Insurance'].map((label) => (
                <button
                  key={label}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-dark-tertiary transition-colors"
                >
                  • {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search emails..."
                className="flex-1 bg-transparent border-none outline-none text-gray-300 placeholder-gray-500"
              />
            </div>

            <div className="space-y-2">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className={`p-4 rounded-lg border border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors cursor-pointer ${
                    !email.read ? 'bg-dark-secondary' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleStar(email.id)}
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        <Star size={18} fill={email.starred ? 'currentColor' : 'none'} />
                      </button>
                      <div>
                        <p className={`font-medium ${!email.read ? 'text-white' : 'text-gray-300'}`}>
                          {email.from}
                        </p>
                        <p className={`text-sm ${!email.read ? 'font-semibold text-white' : 'text-gray-500'}`}>
                          {email.subject}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{email.preview}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{email.date}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-500 mt-4">Page 1 of 1</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
