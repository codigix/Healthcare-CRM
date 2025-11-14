'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, Send, Circle } from 'lucide-react';

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  isOwn: boolean;
}

interface Conversation {
  id: number;
  name: string;
  role: string;
  status: 'online' | 'offline';
  avatar: string;
  lastMessage: string;
  unread: number;
}

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [messageText, setMessageText] = useState('');

  const conversations: Conversation[] = [
    {
      id: 1,
      name: 'Dr. James Wilson',
      role: 'Cardiologist',
      status: 'online',
      avatar: 'DJ',
      lastMessage: 'I\'ll check the patient\'s records for any history of autoimmune disorders as well',
      unread: 0,
    },
    {
      id: 2,
      name: 'Nurse Emily Chen',
      role: 'Nurse',
      status: 'offline',
      avatar: 'NE',
      lastMessage: 'The lab results are on ready',
      unread: 2,
    },
    {
      id: 3,
      name: 'Cardiology Department',
      role: 'Department',
      status: 'online',
      avatar: 'CD',
      lastMessage: 'Meeting scheduled for tomorrow',
      unread: 0,
    },
    {
      id: 4,
      name: 'Dr. Sarah Johnson',
      role: 'General Practitioner',
      status: 'offline',
      avatar: 'SJ',
      lastMessage: 'Please update the patient status',
      unread: 0,
    },
    {
      id: 5,
      name: 'Emergency Response Team',
      role: 'Department',
      status: 'offline',
      avatar: 'ER',
      lastMessage: 'New protocol document shared',
      unread: 0,
    },
    {
      id: 6,
      name: 'Dr. Michael Brown',
      role: 'Surgeon',
      status: 'offline',
      avatar: 'MB',
      lastMessage: 'I\'ve suggested the prescription',
      unread: 1,
    },
    {
      id: 7,
      name: 'Admin Staff',
      role: 'Department',
      status: 'offline',
      avatar: 'AS',
      lastMessage: 'New insurance forms available',
      unread: 0,
    },
  ];

  const messages: Message[] = [
    {
      id: 1,
      sender: 'Dr. James Wilson',
      text: 'Hello Dr. Johnson, I need to consult with you about a patient with unusual cardiac symptoms.',
      time: '10:30 AM',
      isOwn: false,
    },
    {
      id: 2,
      sender: 'You',
      text: 'Of course, Dr. Wilson. What are the symptoms you\'re seeing?',
      time: '10:32 AM',
      isOwn: true,
    },
    {
      id: 3,
      sender: 'Dr. James Wilson',
      text: 'The patient has intermittent chest pain, but their ECG shows normal sinus rhythm. However, there\'s an elevation in troponin levels.',
      time: '10:33 AM',
      isOwn: false,
    },
    {
      id: 4,
      sender: 'You',
      text: 'That\'s interesting. Have you checked for pericarditis? Sometimes it can present with chest pain and elevated troponin.',
      time: '10:40 AM',
      isOwn: true,
    },
    {
      id: 5,
      sender: 'Dr. James Wilson',
      text: 'I haven\'t considered that. I\'ll order an echocardiogram to check for pericardial effusion.',
      time: '10:40 AM',
      isOwn: false,
    },
    {
      id: 6,
      sender: 'You',
      text: 'I\'ll check the patient\'s records for any history of autoimmune disorders as well',
      time: '10:47 AM',
      isOwn: true,
    },
  ];

  const activeConversation = conversations.find(c => c.id === selectedConversation);

  return (
    <DashboardLayout>
      <div className="flex gap-6 h-[calc(100vh-120px)]">
        <div className="w-80 border-r border-dark-tertiary flex flex-col">
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">Messages</h2>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                placeholder="Search conversations"
                className="w-full pl-10 pr-4 py-2 bg-dark-tertiary rounded-lg text-sm text-gray-300 placeholder-gray-500 border border-dark-secondary focus:border-emerald-500 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-dark-tertiary transition-colors">
                All
              </button>
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-dark-tertiary transition-colors">
                Unread
              </button>
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-dark-tertiary transition-colors">
                Groups
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 px-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedConversation === conv.id
                    ? 'bg-dark-secondary'
                    : 'hover:bg-dark-tertiary'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center font-semibold text-white text-sm">
                      {conv.avatar}
                    </div>
                    {conv.status === 'online' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border 2 border-dark-secondary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <p className="font-medium text-sm text-white">{conv.name}</p>
                      {conv.unread > 0 && (
                        <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full font-semibold">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{conv.role}</p>
                    <p className="text-xs text-gray-400 truncate mt-1">{conv.lastMessage}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {activeConversation && (
            <>
              <div className="border-b border-dark-tertiary p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center font-semibold text-white">
                      {activeConversation.avatar}
                    </div>
                    {activeConversation.status === 'online' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-dark-secondary" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{activeConversation.name}</p>
                    <p className="text-sm text-gray-400">
                      {activeConversation.status === 'online' ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.isOwn
                          ? 'bg-emerald-500/20 text-emerald-100 rounded-br-none'
                          : 'bg-dark-secondary text-gray-300 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-dark-tertiary p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-dark-tertiary rounded-lg px-4 py-2 text-gray-300 placeholder-gray-500 border border-dark-secondary focus:border-emerald-500 outline-none"
                  />
                  <button className="btn-primary px-6 py-2 flex items-center gap-2">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
