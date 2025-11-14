'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Plus, Search, Calendar, AlertCircle, CheckCircle2, Circle } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'to-do' | 'in-progress' | 'completed';
  dueDate: string;
  assignee: string;
  labels: string[];
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Review patient records',
      description: 'Go through the latest patient records and update the system',
      priority: 'high',
      status: 'to-do',
      dueDate: 'Nov 15, 2025',
      assignee: 'Dr. Sarah Johnson',
      labels: ['Patient Management'],
    },
    {
      id: 2,
      title: 'Order medical supplies',
      description: 'Order medical supplies online for distributed items',
      priority: 'medium',
      status: 'in-progress',
      dueDate: 'Due Nov 14, 2025',
      assignee: 'Nurse Wilson',
      labels: ['Procurement'],
    },
    {
      id: 3,
      title: 'Schedule staff meeting',
      description: 'Arrange monthly staff meeting and prepare agenda',
      priority: 'low',
      status: 'completed',
      dueDate: 'Due Nov 15, 2025',
      assignee: 'Admin Staff',
      labels: ['Administration'],
    },
    {
      id: 4,
      title: 'Update clinic protocols',
      description: 'Review and update clinic protocols based on new guidelines',
      priority: 'high',
      status: 'to-do',
      dueDate: 'Due Nov 9, 2025',
      assignee: 'Dr. Sarah Johnson',
      labels: ['Compliance'],
    },
    {
      id: 5,
      title: 'Follow up with patients',
      description: 'Call patients who had appointments this week for follow-up',
      priority: 'medium',
      status: 'in-progress',
      dueDate: 'Due Nov 15, 2025',
      assignee: 'Nurse Wilson',
      labels: ['Patient Care'],
    },
    {
      id: 6,
      title: 'Prepare monthly report',
      description: 'Complete statistics and prepare the monthly clinic performance report',
      priority: 'high',
      status: 'to-do',
      dueDate: 'Due Nov 9, 2025',
      assignee: 'Dr. Sarah Johnson',
      labels: ['Reporting'],
    },
    {
      id: 7,
      title: 'Organize patient files',
      description: 'Sort and organize physical patient files in the storage room',
      priority: 'low',
      status: 'to-do',
      dueDate: 'Due Nov 20, 2025',
      assignee: 'Admin Staff',
      labels: ['Organization'],
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'to-do' | 'in-progress' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filterStatus === 'all' || task.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || task.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-500';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'low':
        return 'bg-blue-500/20 text-blue-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={20} className="text-emerald-500" />;
      case 'in-progress':
        return <AlertCircle size={20} className="text-yellow-500" />;
      default:
        return <Circle size={20} className="text-gray-500" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tasks</h1>
            <p className="text-gray-400">Manage your tasks and track progress • {filteredTasks.length} tasks</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Add Task
          </button>
        </div>

        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px] relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 bg-dark-tertiary rounded-lg text-white border border-dark-secondary focus:border-emerald-500 outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 bg-dark-tertiary rounded-lg text-white border border-dark-secondary focus:border-emerald-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="to-do">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="px-4 py-2 bg-dark-tertiary rounded-lg text-white border border-dark-secondary focus:border-emerald-500 outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="card p-4 hover:bg-dark-secondary transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <button className="mt-1">
                  {getStatusIcon(task.status)}
                </button>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className={`font-semibold ${
                        task.status === 'completed' ? 'line-through text-gray-500' : 'text-white'
                      }`}>
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap mt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar size={16} />
                      {task.dueDate}
                    </div>
                    <span className="text-sm text-gray-400">{task.assignee}</span>
                    <div className="flex gap-2">
                      {task.labels.map((label) => (
                        <span
                          key={label}
                          className="px-2 py-1 bg-dark-tertiary rounded text-xs text-gray-300"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-secondary rounded-lg p-6 w-full max-w-md mx-4 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Task</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Task title"
                  className="w-full px-4 py-2 bg-dark-tertiary rounded-lg text-white border border-dark-secondary focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  placeholder="Task description"
                  rows={3}
                  className="w-full px-4 py-2 bg-dark-tertiary rounded-lg text-white border border-dark-secondary focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select className="w-full px-4 py-2 bg-dark-tertiary rounded-lg text-white border border-dark-secondary focus:border-emerald-500 outline-none">
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                  <select className="w-full px-4 py-2 bg-dark-tertiary rounded-lg text-white border border-dark-secondary focus:border-emerald-500 outline-none">
                    <option>Medium</option>
                    <option>High</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 bg-dark-tertiary rounded-lg text-white border border-dark-secondary focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Assigned To</label>
                <input
                  type="text"
                  placeholder="Person responsible"
                  className="w-full px-4 py-2 bg-dark-tertiary rounded-lg text-white border border-dark-secondary focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-gray-300 border border-dark-tertiary hover:bg-dark-tertiary transition-colors"
                >
                  Cancel
                </button>
                <button className="btn-primary px-4 py-2">
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
