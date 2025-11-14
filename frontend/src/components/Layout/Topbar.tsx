'use client';

import { useAuthStore, useUIStore } from '@/lib/store';
import { Bell, User, Settings, Moon, Sun } from 'lucide-react';
import { useEffect } from 'react';

export default function Topbar() {
  const { user } = useAuthStore();
  const { theme, setTheme } = useUIStore();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [setTheme]);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="topbar h-16 px-6 flex items-center justify-between">
      <div className="text-lg font-semibold">
        Welcome back, {user?.name || 'User'}!
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors">
          <Settings size={20} />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-dark-tertiary">
          <div>
            <div className="text-sm font-semibold">{user?.name}</div>
            <div className="text-xs text-gray-400">{user?.role}</div>
          </div>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </div>
  );
}
