import React from 'react';
import { useSelector } from 'react-redux';

const Header = () => {
  const { user } = useSelector(state => state.auth);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Welcome back, {user?.first_name}!
          </h2>
          <p className="text-sm text-gray-600">
            Here's what's happening with your healthcare system today.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;