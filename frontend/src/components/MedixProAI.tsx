'use client';

import { useState, useRef, useEffect } from 'react';
import { medixproAI, WorkflowResult, DoctorSchedule } from '@/lib/medixproAI';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  result?: WorkflowResult;
  isDoctorSchedule?: boolean;
}

export default function MedixProAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! 👋 I\'m MedixPro AI Assistant.\n\n📅 I can help you:\n• Book appointments: "John Cardiology"\n• Check doctor schedule: "Dr. Sanika schedule" or "Sanika availability"\n• Room allocation: "Room 101" or "Show all rooms"',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const parseUserInput = (text: string) => {
    const parts = text.split(/[\s,]+/).filter(Boolean);
    let patientName = '';
    let specialization = '';
    let isDoctorQuery = false;
    let isRoomQuery = false;
    let roomNumber = '';

    const specializationKeywords = [
      'cardiology', 'orthopedics', 'neurology', 'dermatology', 
      'pediatrics', 'gynecology', 'psychiatry', 'oncology',
      'ophthalmology', 'ent', 'general', 'surgery', 'internal'
    ];

    const doctorKeywords = ['dr', 'doctor', 'schedule', 'availability', 'appointments', 'slots', 'timing'];
    const roomKeywords = ['room', 'rooms', 'bed', 'beds', 'allocation', 'capacity', 'occupied', 'patients', 'deluxe', 'standard', 'icu'];
    const lowerText = text.toLowerCase();
    
    if (doctorKeywords.some(keyword => lowerText.includes(keyword))) {
      isDoctorQuery = true;
    }

    if (roomKeywords.some(keyword => lowerText.includes(keyword))) {
      isRoomQuery = true;
    }

    for (const part of parts) {
      const lowerPart = part.toLowerCase();
      if (specializationKeywords.some(spec => lowerPart.includes(spec))) {
        specialization = part;
      } else if (/^\d+$/.test(part) && isRoomQuery) {
        roomNumber = part;
      } else if (lowerPart !== 'dr' && lowerPart !== 'doctor' && lowerPart !== 'schedule' && 
                 lowerPart !== 'availability' && lowerPart !== 'appointments' && lowerPart !== 'slots' &&
                 lowerPart !== 'timing' && !roomKeywords.some(kw => lowerPart.includes(kw)) && part.length > 2) {
        patientName += (patientName ? ' ' : '') + part;
      }
    }

    return { 
      patientName: patientName.trim(), 
      specialization: specialization.trim(),
      isDoctorQuery,
      isRoomQuery,
      roomNumber
    };
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { patientName, specialization, isDoctorQuery, isRoomQuery, roomNumber } = parseUserInput(input);

      if (!patientName && !isDoctorQuery && !isRoomQuery) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: '❓ I can help you with:\n• Booking appointments: "John Cardiology"\n• Checking doctor schedule: "Dr. Sanika Mote schedule"\n• Room allocation: "Room 101" or "Show all rooms"',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }

      if (isRoomQuery) {
        const loadingMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: roomNumber ? `🔄 Loading Room ${roomNumber} details...` : '🔄 Loading room allocation summary...',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, loadingMessage]);

        const result = await medixproAI.fetchRoomAllocation(roomNumber || undefined, !roomNumber);

        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            id: (Date.now() + 2).toString(),
            type: 'assistant',
            content: result.success 
              ? `✅ ${result.summary}`
              : `❌ ${result.summary}`,
            timestamp: new Date(),
            result,
            isDoctorSchedule: false,
          };
          return updated;
        });
      } else if (isDoctorQuery) {
        const loadingMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `🔄 Loading Dr. ${patientName}'s schedule...`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, loadingMessage]);

        const result = await medixproAI.fetchDoctorSchedule(patientName);

        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            id: (Date.now() + 2).toString(),
            type: 'assistant',
            content: result.success 
              ? `✅ ${result.summary}`
              : `❌ ${result.summary}`,
            timestamp: new Date(),
            result,
            isDoctorSchedule: result.success,
          };
          return updated;
        });
      } else {
        const loadingMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `🔄 Processing appointment for ${patientName}${specialization ? ` (${specialization})` : ''}...`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, loadingMessage]);

        const result = await medixproAI.processAppointmentWorkflow(patientName, specialization || undefined);

        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            id: (Date.now() + 2).toString(),
            type: 'assistant',
            content: result.success 
              ? `✅ Appointment Successfully Booked!\n\n${result.summary}`
              : `❌ ${result.summary}`,
            timestamp: new Date(),
            result,
          };
          return updated;
        });
      }
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `⚠️ Error: ${error.message || 'An error occurred. Please try again.'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 group"
        aria-label="MedixPro AI Assistant"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>

          <div className="relative w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer border border-blue-400">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
            </svg>
          </div>

          <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-blue-400 animate-pulse"></div>
        </div>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-96 bg-gradient-to-b from-slate-900 to-slate-950 border-l border-slate-700 shadow-2xl transform transition-transform duration-300 z-50 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        ref={sidebarRef}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h2 className="text-white font-bold text-lg">MedixPro AI</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/10 p-1 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-lg px-4 py-2 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none max-w-xs'
                    : 'bg-slate-800 text-gray-100 rounded-bl-none border border-slate-700 max-w-2xl'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                
                {message.result?.roomAllocationDetails && (
                  <div className="mt-4 space-y-3">
                    <div className="bg-slate-700/50 rounded p-3 border border-blue-500/30">
                      <div className="font-semibold text-blue-400 mb-3">🏥 {message.result.roomAllocationDetails.roomNumber} – {message.result.roomAllocationDetails.roomType}</div>
                      <div className="text-xs space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-slate-800 rounded p-2">
                            <div className="text-gray-400">Capacity</div>
                            <div className="text-lg font-semibold text-blue-300">{message.result.roomAllocationDetails.capacity}</div>
                          </div>
                          <div className="bg-slate-800 rounded p-2">
                            <div className="text-gray-400">Occupied</div>
                            <div className="text-lg font-semibold text-orange-400">{message.result.roomAllocationDetails.occupied}</div>
                          </div>
                          <div className="bg-slate-800 rounded p-2 col-span-2">
                            <div className="text-gray-400">Status</div>
                            <div className={`text-lg font-semibold ${message.result.roomAllocationDetails.status === 'available' ? 'text-green-400' : 'text-red-400'}`}>
                              {message.result.roomAllocationDetails.status === 'available' ? '✅ Available' : '❌ Full'}
                            </div>
                          </div>
                        </div>
                        {message.result.roomAllocationDetails.patients.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-600">
                            <div className="font-semibold text-gray-300 mb-2">👥 Patients Inside</div>
                            <div className="space-y-1">
                              {message.result.roomAllocationDetails.patients.map((patient, idx) => (
                                <div key={idx} className="bg-slate-800/50 rounded p-2 text-gray-300 text-xs">
                                  <div>{patient.patientName} – Token {patient.tokenNumber} – {patient.checkInTime}</div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-2 text-xs text-green-400">
                              ➡ {message.result.roomAllocationDetails.capacity - message.result.roomAllocationDetails.occupied} bed(s) still available.
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {message.result?.roomAllocationSummary && (
                  <div className="mt-4 space-y-3">
                    <div className="bg-slate-700/50 rounded p-3 border border-blue-500/30">
                      <div className="font-semibold text-blue-400 mb-3">🏥 Room Allocation Summary</div>
                      <div className="text-xs">
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-slate-600">
                                <th className="text-left py-1 px-2 text-gray-400">Room</th>
                                <th className="text-left py-1 px-2 text-gray-400">Type</th>
                                <th className="text-left py-1 px-2 text-gray-400">Cap</th>
                                <th className="text-left py-1 px-2 text-gray-400">Occ</th>
                                <th className="text-left py-1 px-2 text-gray-400">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {message.result.roomAllocationSummary.rooms.map((room, idx) => (
                                <tr key={idx} className="border-b border-slate-700">
                                  <td className="py-1 px-2 text-gray-300">{room.roomNumber}</td>
                                  <td className="py-1 px-2 text-gray-300">{room.roomType}</td>
                                  <td className="py-1 px-2 text-gray-300">{room.capacity}</td>
                                  <td className="py-1 px-2 text-orange-400 font-semibold">{room.occupied}</td>
                                  <td className="py-1 px-2">
                                    {room.status === 'available' ? (
                                      <span className="text-green-400 font-semibold">✅ Avail</span>
                                    ) : (
                                      <span className="text-red-400 font-semibold">❌ Full</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {message.isDoctorSchedule && message.result?.doctorSchedule && (
                  <div className="mt-4 space-y-3">
                    <div className="bg-slate-700/50 rounded p-3 border border-purple-500/30">
                      <div className="font-semibold text-purple-400 mb-3">👨‍⚕️ {message.result.doctorSchedule.doctorName} ({message.result.doctorSchedule.specialization})</div>
                      <div className="text-xs">
                        <div className="font-semibold text-gray-300 mb-2">Today's Schedule:</div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-slate-600">
                                <th className="text-left py-1 px-2 text-gray-400">Time</th>
                                <th className="text-left py-1 px-2 text-gray-400">Patient</th>
                                <th className="text-left py-1 px-2 text-gray-400">Room</th>
                                <th className="text-left py-1 px-2 text-gray-400">Token</th>
                              </tr>
                            </thead>
                            <tbody>
                              {message.result.doctorSchedule.slots.map((slot, idx) => (
                                <tr key={idx} className={`border-b border-slate-700 ${slot.status === 'booked' ? 'bg-red-950/20' : 'bg-green-950/20'}`}>
                                  <td className="py-1 px-2 text-gray-300">{slot.time}</td>
                                  <td className="py-1 px-2 text-gray-300">{slot.patient || '—'}</td>
                                  <td className="py-1 px-2 text-gray-300">{slot.room || '—'}</td>
                                  <td className="py-1 px-2">
                                    {slot.status === 'booked' ? (
                                      <span className="text-red-400 font-semibold">{slot.token}</span>
                                    ) : (
                                      <span className="text-green-400 font-semibold">Free</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {message.result && message.result.success && message.result.patientName && (
                  <div className="mt-3 space-y-2">
                    {message.result.patientName && (
                      <div className="bg-slate-700/50 rounded p-2 text-xs space-y-1 border border-cyan-500/30">
                        <div className="font-semibold text-cyan-400 mb-2">👤 Patient Details</div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Name:</span>
                          <span className="text-gray-200">{message.result.patientName}</span>
                        </div>
                        {message.result.patientAge && (
                          <div className="flex justify-between">
                            <span className="text-gray-300">Age:</span>
                            <span className="text-gray-200">{message.result.patientAge}</span>
                          </div>
                        )}
                        {message.result.patientGender && (
                          <div className="flex justify-between">
                            <span className="text-gray-300">Gender:</span>
                            <span className="text-gray-200">{message.result.patientGender}</span>
                          </div>
                        )}
                        {message.result.patientPhone && (
                          <div className="flex justify-between">
                            <span className="text-gray-300">Phone:</span>
                            <span className="text-gray-200">{message.result.patientPhone}</span>
                          </div>
                        )}
                        {message.result.lastVisit && (
                          <div className="flex justify-between">
                            <span className="text-gray-300">Last Visit:</span>
                            <span className="text-gray-200">{message.result.lastVisit}</span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="bg-slate-700/50 rounded p-2 text-xs space-y-1 border border-green-500/30">
                      <div className="font-semibold text-green-400 mb-2">✅ Appointment Details</div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Token:</span>
                        <span className="text-green-400 font-bold">{message.result.tokenNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Room:</span>
                        <span className="text-gray-200">{message.result.roomNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Time:</span>
                        <span className="text-gray-200">{message.result.appointmentTime}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700 rounded-lg rounded-bl-none px-4 py-2">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-slate-800/50 border-t border-slate-700 px-4 py-4 flex-shrink-0">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., John Cardiology, Dr. Sanika, or Room 101"
              disabled={isLoading}
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 text-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white px-4 py-2 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z"></path>
              </svg>
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2">Appointment: "John Cardiology" | Doctor: "Dr. Sanika" | Rooms: "Room 101" or "All rooms"</p>
        </div>

        {/* Footer */}
        <div className="bg-slate-800 border-t border-slate-700 px-4 py-2 text-xs text-gray-500 text-center flex-shrink-0">
          Healthcare CRM • MedixPro AI
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
