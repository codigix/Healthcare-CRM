import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { fetchPatientStats } from '../../slices/patientsSlice';
import { fetchDoctorStats } from '../../slices/doctorsSlice';
import { fetchAppointmentStats } from '../../slices/appointmentsSlice';
import { fetchDepartments } from '../../slices/departmentsSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats: patientStats } = useSelector((state) => state.patients);
  const { stats: doctorStats } = useSelector((state) => state.doctors);
  const { stats: appointmentStats } = useSelector((state) => state.appointments);
  const { departments } = useSelector((state) => state.departments);

  useEffect(() => {
    // Fetch dashboard data
    dispatch(fetchPatientStats());
    dispatch(fetchDoctorStats());
    dispatch(fetchAppointmentStats());
    dispatch(fetchDepartments());
  }, [dispatch]);

  const statsCards = [
    {
      title: 'Total Patients',
      value: patientStats?.totalPatients || 0,
      change: `+${patientStats?.newThisMonth || 0} this month`,
      icon: '👥',
      color: 'bg-blue-500',
      link: '/patients'
    },
    {
      title: 'Total Doctors',
      value: doctorStats?.totalDoctors || 0,
      change: 'Active staff',
      icon: '👨‍⚕️',
      color: 'bg-green-500',
      link: '/doctors'
    },
    {
      title: 'Today\'s Appointments',
      value: appointmentStats?.todayAppointments || 0,
      change: `${appointmentStats?.upcomingAppointments || 0} upcoming`,
      icon: '📅',
      color: 'bg-purple-500',
      link: '/appointments'
    },
    {
      title: 'Departments',
      value: departments?.length || 0,
      change: 'Multispecialty',
      icon: '🏥',
      color: 'bg-orange-500',
      link: '/departments'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Patient',
      description: 'Register a new patient',
      icon: '👤',
      link: '/patients',
      color: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      title: 'Schedule Appointment',
      description: 'Book a new appointment',
      icon: '📅',
      link: '/appointments',
      color: 'bg-green-50 hover:bg-green-100'
    },
    {
      title: 'Generate Report',
      description: 'Create AI-powered reports',
      icon: '📊',
      link: '/reports',
      color: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      title: 'AI Assistant',
      description: 'Get help from AI',
      icon: '🤖',
      link: '/ai-assistant',
      color: 'bg-orange-50 hover:bg-orange-100'
    }
  ];

  const recentActivities = [
    {
      type: 'appointment',
      message: 'New appointment scheduled with Dr. Smith',
      time: '2 hours ago',
      icon: '📅'
    },
    {
      type: 'patient',
      message: 'Patient John Doe registered',
      time: '4 hours ago',
      icon: '👤'
    },
    {
      type: 'report',
      message: 'Monthly report generated',
      time: '1 day ago',
      icon: '📊'
    },
    {
      type: 'department',
      message: 'Cardiology department updated',
      time: '2 days ago',
      icon: '🏥'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-blue-100">
          Here's what's happening at your hospital today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="card hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`p-4 rounded-lg ${action.color} transition-colors duration-200`}
              >
                <div className="text-center">
                  <span className="text-3xl mb-2 block">{action.icon}</span>
                  <h4 className="font-medium text-gray-900">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <span className="text-lg">{activity.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Department Overview</h3>
          <Link to="/departments" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments?.slice(0, 6).map((dept) => (
            <div key={dept.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
              <h4 className="font-medium text-gray-900">{dept.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{dept.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">{dept.location}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {dept.doctor_count} doctors
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="card bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-2xl">🤖</span>
          <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Patient Trends</h4>
            <p className="text-sm text-gray-600">
              Patient registrations increased by 15% this month compared to last month.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Appointment Efficiency</h4>
            <p className="text-sm text-gray-600">
              Average appointment duration decreased by 8% due to better scheduling.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Resource Utilization</h4>
            <p className="text-sm text-gray-600">
              Cardiology department shows 95% capacity utilization this week.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Link
            to="/ai-assistant"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            <span className="mr-2">🤖</span>
            Get More AI Insights
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
