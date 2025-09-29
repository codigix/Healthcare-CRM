import React from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Main Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import NotFound from './pages/NotFound/NotFound';

// Management Pages
import Patients from './pages/Patients/Patients';
import PatientDetails from './pages/Patients/PatientDetails';
import PatientForm from './pages/Patients/PatientForm';

import Doctors from './pages/Doctors/Doctors';
import DoctorDetails from './pages/Doctors/DoctorDetails';
import DoctorForm from './pages/Doctors/DoctorForm';

import Appointments from './pages/Appointments/Appointments';
import AppointmentDetails from './pages/Appointments/AppointmentDetails';
import AppointmentForm from './pages/Appointments/AppointmentForm';

import Departments from './pages/Departments/Departments';
import DepartmentDetails from './pages/Departments/DepartmentDetails';
import DepartmentForm from './pages/Departments/DepartmentForm';

import Reports from './pages/Reports/Reports';
import AIAssistant from './pages/AIAssistant/AIAssistant';

// Admin Pages
import Users from './pages/Users/Users';
import UserDetails from './pages/Users/UserDetails';
import UserForm from './pages/Users/UserForm';

// Analytics Pages
import Analytics from './pages/Analytics/Analytics';
import PatientAnalytics from './pages/Analytics/PatientAnalytics';
import DoctorAnalytics from './pages/Analytics/DoctorAnalytics';
import AppointmentAnalytics from './pages/Analytics/AppointmentAnalytics';

// Settings Pages
import Settings from './pages/Settings/Settings';
import SystemSettings from './pages/Settings/SystemSettings';
import UserSettings from './pages/Settings/UserSettings';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          {/* Dashboard */}
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Profile */}
          <Route path="profile" element={<Profile />} />
          
          {/* Patient Management */}
          <Route path="patients" element={<Patients />} />
          <Route path="patients/new" element={<PatientForm />} />
          <Route path="patients/:id" element={<PatientDetails />} />
          <Route path="patients/:id/edit" element={<PatientForm />} />
          
          {/* Doctor Management */}
          <Route path="doctors" element={<Doctors />} />
          <Route path="doctors/new" element={<DoctorForm />} />
          <Route path="doctors/:id" element={<DoctorDetails />} />
          <Route path="doctors/:id/edit" element={<DoctorForm />} />
          
          {/* Appointment Management */}
          <Route path="appointments" element={<Appointments />} />
          <Route path="appointments/new" element={<AppointmentForm />} />
          <Route path="appointments/:id" element={<AppointmentDetails />} />
          <Route path="appointments/:id/edit" element={<AppointmentForm />} />
          
          {/* Department Management */}
          <Route path="departments" element={<Departments />} />
          <Route path="departments/new" element={<DepartmentForm />} />
          <Route path="departments/:id" element={<DepartmentDetails />} />
          <Route path="departments/:id/edit" element={<DepartmentForm />} />
          
          {/* Reports & AI */}
          <Route path="reports" element={<Reports />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          
          {/* Analytics */}
          <Route path="analytics" element={<Analytics />} />
          <Route path="analytics/patients" element={<PatientAnalytics />} />
          <Route path="analytics/doctors" element={<DoctorAnalytics />} />
          <Route path="analytics/appointments" element={<AppointmentAnalytics />} />
          
          {/* Settings */}
          <Route path="settings" element={<Settings />} />
          <Route path="settings/system" element={<SystemSettings />} />
          <Route path="settings/user" element={<UserSettings />} />
          
          {/* Admin Routes */}
          <Route path="users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Users />
            </ProtectedRoute>
          } />
          <Route path="users/new" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserForm />
            </ProtectedRoute>
          } />
          <Route path="users/:id" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserDetails />
            </ProtectedRoute>
          } />
          <Route path="users/:id/edit" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserForm />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;