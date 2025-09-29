import React from 'react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mt-4">Page Not Found</h2>
          <p className="text-gray-600 mt-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <a
            href="/dashboard"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Go to Dashboard
          </a>
          
          <div className="text-sm text-gray-500">
            <p>Need help? Contact support or try one of these links:</p>
            <div className="mt-2 space-x-4">
              <a href="/patients" className="text-blue-600 hover:text-blue-700">Patients</a>
              <a href="/appointments" className="text-blue-600 hover:text-blue-700">Appointments</a>
              <a href="/reports" className="text-blue-600 hover:text-blue-700">Reports</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
