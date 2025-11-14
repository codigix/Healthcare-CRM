'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { doctorAPI } from '@/lib/api';

type TabType = 'personal' | 'professional' | 'account';

export default function AddDoctorPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    email: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    profilePhoto: null as File | null,
    primarySpecialization: '',
    secondarySpecialization: '',
    medicalLicenseNumber: '',
    licenseExpiryDate: '',
    qualifications: '',
    yearsOfExperience: '',
    education: '',
    certifications: '',
    department: '',
    position: '',
    schedule: 'Monday-Friday, 9:00 AM - 5:00 PM',
    username: '',
    temporaryPassword: '',
    emailAddress: '',
    patientRecords: false,
    prescriptions: false,
    billing: false,
    reports: false,
    appointmentNotifications: false,
    patientUpdates: false,
    systemNotifications: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, profilePhoto: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const doctorData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email || formData.emailAddress,
        phone: formData.phone,
        specialization: formData.primarySpecialization,
        experience: parseInt(formData.yearsOfExperience) || 0,
        schedule: formData.schedule,
      };

      await doctorAPI.create(doctorData);
      router.push('/doctors');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add doctor');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'personal' as TabType, label: 'Personal Information' },
    { id: 'professional' as TabType, label: 'Professional Details' },
    { id: 'account' as TabType, label: 'Account Settings' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/doctors" className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-2">Add Doctor</h1>
            <p className="text-gray-400">Add a new doctor to your clinic.</p>
          </div>
        </div>

        <div className="card">
          <div className="border-b border-dark-tertiary mb-6">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <p className="text-sm text-gray-400 mb-6">Enter the doctor's personal details.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter first name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter last name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="input-field w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="input-field w-full"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter address"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter state"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter zip code"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 mt-8">Contact Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Emergency Contact Name
                    </label>
                    <input
                      type="text"
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter emergency contact name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Emergency Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="emergencyContactPhone"
                      value={formData.emergencyContactPhone}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter emergency contact phone"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 mt-8">Profile Photo</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload Photo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-dark-tertiary flex items-center justify-center">
                      <Upload size={32} className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                        id="profile-photo"
                      />
                      <label
                        htmlFor="profile-photo"
                        className="btn-secondary cursor-pointer inline-block"
                      >
                        Upload Photo
                      </label>
                      <p className="text-xs text-gray-400 mt-2">
                        Upload a profile photo. JPG, PNG or GIF. Max 2MB.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'professional' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Professional Details</h3>
                  <p className="text-sm text-gray-400 mb-6">Enter the doctor's professional information.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Primary Specialization
                    </label>
                    <select
                      name="primarySpecialization"
                      value={formData.primarySpecialization}
                      onChange={handleChange}
                      className="input-field w-full"
                      required
                    >
                      <option value="">Select specialization</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Psychiatry">Psychiatry</option>
                      <option value="Ophthalmology">Ophthalmology</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Secondary Specialization (Optional)
                    </label>
                    <select
                      name="secondarySpecialization"
                      value={formData.secondarySpecialization}
                      onChange={handleChange}
                      className="input-field w-full"
                    >
                      <option value="">Select specialization</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Psychiatry">Psychiatry</option>
                      <option value="Ophthalmology">Ophthalmology</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Medical License Number
                    </label>
                    <input
                      type="text"
                      name="medicalLicenseNumber"
                      value={formData.medicalLicenseNumber}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter license number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      License Expiry Date
                    </label>
                    <input
                      type="date"
                      name="licenseExpiryDate"
                      value={formData.licenseExpiryDate}
                      onChange={handleChange}
                      className="input-field w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Qualifications
                  </label>
                  <textarea
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter qualifications (MD, PhD, etc.)"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter years of experience"
                    required
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 mt-8">Education & Training</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Education
                  </label>
                  <textarea
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter education details"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Certifications
                  </label>
                  <textarea
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter certifications"
                    rows={3}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 mt-8">Department & Position</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="input-field w-full"
                    >
                      <option value="">Select department</option>
                      <option value="Internal Medicine">Internal Medicine</option>
                      <option value="Neuroscience">Neuroscience</option>
                      <option value="Child Health">Child Health</option>
                      <option value="Surgery">Surgery</option>
                      <option value="Skin Health">Skin Health</option>
                      <option value="Mental Health">Mental Health</option>
                      <option value="Eye Care">Eye Care</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Position
                    </label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="input-field w-full"
                    >
                      <option value="">Select position</option>
                      <option value="Chief">Chief</option>
                      <option value="Senior">Senior</option>
                      <option value="Junior">Junior</option>
                      <option value="Consultant">Consultant</option>
                      <option value="Resident">Resident</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 mt-8">Working Schedule</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Doctor Schedule
                  </label>
                  <textarea
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter schedule (e.g., Monday-Friday, 9:00 AM - 5:00 PM; Saturday, 10:00 AM - 2:00 PM)"
                    rows={3}
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Enter the doctor's availability and working hours
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                  <p className="text-sm text-gray-400 mb-6">Configure the doctor's account and system access.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Temporary Password
                    </label>
                    <input
                      type="password"
                      name="temporaryPassword"
                      value={formData.temporaryPassword}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter temporary password"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter email address"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    This will be used for login and notifications.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 mt-8">System Access</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-dark-tertiary rounded-lg">
                    <div>
                      <p className="font-medium">Patient Records</p>
                      <p className="text-sm text-gray-400">Allow access to patient records</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="patientRecords"
                        checked={formData.patientRecords}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-dark-tertiary rounded-lg">
                    <div>
                      <p className="font-medium">Prescriptions</p>
                      <p className="text-sm text-gray-400">Allow creating and managing prescriptions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="prescriptions"
                        checked={formData.prescriptions}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-dark-tertiary rounded-lg">
                    <div>
                      <p className="font-medium">Billing</p>
                      <p className="text-sm text-gray-400">Allow access to billing information</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="billing"
                        checked={formData.billing}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-dark-tertiary rounded-lg">
                    <div>
                      <p className="font-medium">Reports</p>
                      <p className="text-sm text-gray-400">Allow access to reports and analytics</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="reports"
                        checked={formData.reports}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 mt-8">Notifications</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-dark-tertiary rounded-lg">
                    <div>
                      <p className="font-medium">Appointment Notifications</p>
                      <p className="text-sm text-gray-400">Receive notifications for new appointments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="appointmentNotifications"
                        checked={formData.appointmentNotifications}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-dark-tertiary rounded-lg">
                    <div>
                      <p className="font-medium">Patient Updates</p>
                      <p className="text-sm text-gray-400">Receive notifications for patient updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="patientUpdates"
                        checked={formData.patientUpdates}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-dark-tertiary rounded-lg">
                    <div>
                      <p className="font-medium">System Notifications</p>
                      <p className="text-sm text-gray-400">Receive system and administrative notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="systemNotifications"
                        checked={formData.systemNotifications}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-dark-tertiary">
              <Link href="/doctors" className="btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Saving...' : 'Save Doctor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
