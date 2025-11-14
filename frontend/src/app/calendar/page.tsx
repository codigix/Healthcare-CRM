'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  type: 'appointment' | 'meeting' | 'reminder' | 'event';
  color: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 12));
  
  const [events] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: 'Staff Meeting',
      date: '2025-11-13',
      time: '10:00 AM',
      type: 'meeting',
      color: 'bg-blue-500',
    },
    {
      id: 2,
      title: 'Patient Follow-up',
      date: '2025-11-14',
      time: '02:00 PM',
      type: 'appointment',
      color: 'bg-emerald-500',
    },
    {
      id: 3,
      title: 'Department Review',
      date: '2025-11-15',
      time: '03:30 PM',
      type: 'meeting',
      color: 'bg-purple-500',
    },
    {
      id: 4,
      title: 'Lab Results Review',
      date: '2025-11-16',
      time: '11:00 AM',
      type: 'reminder',
      color: 'bg-yellow-500',
    },
  ]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate);
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getEventsForDate = (day: number) => {
    const dateStr = `2025-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{monthName}</h2>
              <div className="flex gap-2">
                <button
                  onClick={previousMonth}
                  className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-gray-400 text-sm py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                const dayEvents = day ? getEventsForDate(day) : [];
                const today = isToday(day as number);

                return (
                  <div
                    key={index}
                    className={`aspect-square p-2 rounded-lg border transition-colors cursor-pointer ${
                      day === null
                        ? 'bg-transparent border-transparent'
                        : today
                        ? 'bg-emerald-500/20 border-emerald-500'
                        : 'bg-dark-tertiary border-dark-secondary hover:bg-dark-secondary'
                    }`}
                  >
                    {day && (
                      <div className="h-full flex flex-col">
                        <span className={`text-sm font-semibold ${today ? 'text-emerald-400' : 'text-white'}`}>
                          {day}
                        </span>
                        <div className="flex-1 flex gap-0.5 flex-wrap content-start pt-1 overflow-hidden">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={`w-1 h-1 rounded-full ${event.color}`}
                            />
                          ))}
                          {dayEvents.length > 2 && (
                            <span className="text-xs text-gray-500 leading-none">+{dayEvents.length - 2}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Upcoming Events</h3>
              <button className="text-emerald-500 hover:text-emerald-400">
                <Plus size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {events.map((event) => {
                const eventDate = new Date(event.date);
                const today = new Date();
                const isUpcoming = eventDate >= today;

                if (!isUpcoming) return null;

                return (
                  <div key={event.id} className="p-3 bg-dark-tertiary rounded-lg border border-dark-secondary hover:border-emerald-500 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full ${event.color} mt-2 flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm">{event.title}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {eventDate.toLocaleDateString()} at {event.time}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Event Types</h3>
            <div className="space-y-2">
              {[
                { type: 'Appointment', color: 'bg-emerald-500' },
                { type: 'Meeting', color: 'bg-blue-500' },
                { type: 'Reminder', color: 'bg-yellow-500' },
                { type: 'Event', color: 'bg-purple-500' },
              ].map(({ type, color }) => (
                <div key={type} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  <span className="text-sm text-gray-300">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
