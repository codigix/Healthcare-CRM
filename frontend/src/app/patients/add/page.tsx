'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { patientAPI } from '@/lib/api';

type TabType = 'personal' | 'medical' | 'insurance' | 'consent';

export default function AddPatientPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    email: '',
    phone: '',
    alternativePhone: '',
    preferredContactMethod: 'phone',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
    emergencyContactEmail: '',
    profilePhoto: null as File | null,
    bloodType: '',
    height: '',
    weight: '',
    allergies: '',
    currentMedications: '',
    chronicConditions: '',
    pastSurgeries: '',
    previousHospitalizations: '',
    familyMedicalHistory: {
      diabetes: false,
      hypertension: false,
      asthma: false,
      heartDisease: false,
      cancer: false,
      mentalHealthConditions: false,
    },
    additionalFamilyHistory: '',
    smokingStatus: '',
    alcoholConsumption: '',
    exerciseFrequency: '',
    dietaryHabits: '',
    primaryInsuranceProvider: '',
    primaryPolicyNumber: '',
    primaryGroupNumber: '',
    primaryPolicyHolderName: '',
    primaryRelationshipToPatient: '',
    primaryInsurancePhone: '',
    secondaryInsuranceProvider: '',
    secondaryPolicyNumber: '',
    preferredBillingMethod: '',
    paymentMethods: {
      creditCard: false,
      cash: false,
      onlinePayment: false,
      debitCard: false,
      check: false,
    },
    consentDocuments: [] as File[],
    communicationPreferences: {
      appointmentReminders: false,
      labResultNotifications: false,
      prescriptionNotifications: false,
      clinicNewsletterUpdates: false,
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name.startsWith('familyMedicalHistory.')) {
        const field = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          familyMedicalHistory: { ...prev.familyMedicalHistory, [field]: checked }
        }));
      } else if (name.startsWith('paymentMethods.')) {
        const field = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          paymentMethods: { ...prev.paymentMethods, [field]: checked }
        }));
      } else if (name.startsWith('communicationPreferences.')) {
        const field = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          communicationPreferences: { ...prev.communicationPreferences, [field]: checked }
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else if (type === 'radio') {
      setFormData(prev => ({ ...prev, [name]: value }));
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
      const patientData = {
        name: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        dob: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
      };

      await patientAPI.create(patientData);
      router.push('/patients');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add patient');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'personal' as TabType, label: 'Personal Information' },
    { id: 'medical' as TabType, label: 'Medical Information' },
    { id: 'insurance' as TabType, label: 'Insurance & Billing' },
    { id: 'consent' as TabType, label: 'Consent & Documents' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/patients" className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-2">Add Patient</h1>
            <p className="text-gray-400">Register a new patient in your clinic.</p>
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
                  <p className="text-sm text-gray-400 mb-6">Enter the patient's personal details.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      Middle Name (Optional)
                    </label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter middle name"
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
                      required
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
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Marital Status
                    </label>
                    <select
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleChange}
                      className="input-field w-full"
                    >
                      <option value="">Select status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      Alternative Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      name="alternativePhone"
                      value={formData.alternativePhone}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter alternative phone"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Preferred Contact Method
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="preferredContactMethod"
                        value="phone"
                        checked={formData.preferredContactMethod === 'phone'}
                        onChange={handleChange}
                        className="w-4 h-4 text-emerald-500"
                      />
                      <span className="text-gray-300">Phone</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="preferredContactMethod"
                        value="email"
                        checked={formData.preferredContactMethod === 'email'}
                        onChange={handleChange}
                        className="w-4 h-4 text-emerald-500"
                      />
                      <span className="text-gray-300">Email</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="preferredContactMethod"
                        value="sms"
                        checked={formData.preferredContactMethod === 'sms'}
                        onChange={handleChange}
                        className="w-4 h-4 text-emerald-500"
                      />
                      <span className="text-gray-300">SMS</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 mt-8">Emergency Contact</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Contact Name
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
                      Relationship
                    </label>
                    <input
                      type="text"
                      name="emergencyContactRelationship"
                      value={formData.emergencyContactRelationship}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter relationship"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
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

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      name="emergencyContactEmail"
                      value={formData.emergencyContactEmail}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter emergency contact email"
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

            {activeTab === 'medical' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Medical Information</h3>
                  <p className="text-sm text-gray-400 mb-6">Enter the patient's medical history and details.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Blood Type
                    </label>
                    <select
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleChange}
                      className="input-field w-full"
                    >
                      <option value="">Select blood type</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter height"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter weight"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Allergies
                  </label>
                  <textarea
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="List any allergies (medications, food, etc.)"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Medications
                  </label>
                  <textarea
                    name="currentMedications"
                    value={formData.currentMedications}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="List any current medications"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Chronic Conditions
                  </label>
                  <textarea
                    name="chronicConditions"
                    value={formData.chronicConditions}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="List any chronic conditions"
                    rows={3}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 mt-8">Medical History</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Past Surgeries
                  </label>
                  <textarea
                    name="pastSurgeries"
                    value={formData.pastSurgeries}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="List any past surgeries with dates"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Previous Hospitalizations
                  </label>
                  <textarea
                    name="previousHospitalizations"
                    value={formData.previousHospitalizations}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="List any previous hospitalizations with dates"
                    rows={3}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 mt-8">Family Medical History</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-3 bg-dark-tertiary rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      name="familyMedicalHistory.diabetes"
                      checked={formData.familyMedicalHistory.diabetes}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300">Diabetes</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-dark-tertiary rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      name="familyMedicalHistory.hypertension"
                      checked={formData.familyMedicalHistory.hypertension}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300">Hypertension</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-dark-tertiary rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      name="familyMedicalHistory.asthma"
                      checked={formData.familyMedicalHistory.asthma}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300">Asthma</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-dark-tertiary rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      name="familyMedicalHistory.heartDisease"
                      checked={formData.familyMedicalHistory.heartDisease}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300">Heart Disease</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-dark-tertiary rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      name="familyMedicalHistory.cancer"
                      checked={formData.familyMedicalHistory.cancer}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300">Cancer</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-dark-tertiary rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      name="familyMedicalHistory.mentalHealthConditions"
                      checked={formData.familyMedicalHistory.mentalHealthConditions}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300">Mental Health Conditions</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Additional Family History Notes
                  </label>
                  <textarea
                    name="additionalFamilyHistory"
                    value={formData.additionalFamilyHistory}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter any additional family medical history"
                    rows={3}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 mt-8">Lifestyle Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Smoking Status
                    </label>
                    <select
                      name="smokingStatus"
                      value={formData.smokingStatus}
                      onChange={handleChange}
                      className="input-field w-full"
                    >
                      <option value="">Select status</option>
                      <option value="Never">Never</option>
                      <option value="Former">Former</option>
                      <option value="Current">Current</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Alcohol Consumption
                    </label>
                    <select
                      name="alcoholConsumption"
                      value={formData.alcoholConsumption}
                      onChange={handleChange}
                      className="input-field w-full"
                    >
                      <option value="">Select consumption</option>
                      <option value="None">None</option>
                      <option value="Occasional">Occasional</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Heavy">Heavy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Exercise Frequency
                    </label>
                    <select
                      name="exerciseFrequency"
                      value={formData.exerciseFrequency}
                      onChange={handleChange}
                      className="input-field w-full"
                    >
                      <option value="">Select frequency</option>
                      <option value="None">None</option>
                      <option value="1-2 times/week">1-2 times/week</option>
                      <option value="3-4 times/week">3-4 times/week</option>
                      <option value="5+ times/week">5+ times/week</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Dietary Habits
                  </label>
                  <textarea
                    name="dietaryHabits"
                    value={formData.dietaryHabits}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Describe dietary habits"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {activeTab === 'insurance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Insurance & Billing Information</h3>
                  <p className="text-sm text-gray-400 mb-6">Enter the patient's insurance and payment details.</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Primary Insurance</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Insurance Provider
                    </label>
                    <input
                      type="text"
                      name="primaryInsuranceProvider"
                      value={formData.primaryInsuranceProvider}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter insurance provider"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Policy Number
                    </label>
                    <input
                      type="text"
                      name="primaryPolicyNumber"
                      value={formData.primaryPolicyNumber}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter policy number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Group Number
                    </label>
                    <input
                      type="text"
                      name="primaryGroupNumber"
                      value={formData.primaryGroupNumber}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter group number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Policy Holder Name
                    </label>
                    <input
                      type="text"
                      name="primaryPolicyHolderName"
                      value={formData.primaryPolicyHolderName}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter policy holder name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Relationship to Patient
                    </label>
                    <select
                      name="primaryRelationshipToPatient"
                      value={formData.primaryRelationshipToPatient}
                      onChange={handleChange}
                      className="input-field w-full"
                    >
                      <option value="">Select relationship</option>
                      <option value="Self">Self</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Child">Child</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Insurance Phone Number
                    </label>
                    <input
                      type="tel"
                      name="primaryInsurancePhone"
                      value={formData.primaryInsurancePhone}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter insurance phone number"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4 mt-8">Secondary Insurance</h4>
                  <label className="flex items-center gap-2 mb-4">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-gray-300 text-sm">Enable secondary insurance</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Insurance Provider
                    </label>
                    <input
                      type="text"
                      name="secondaryInsuranceProvider"
                      value={formData.secondaryInsuranceProvider}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter insurance provider"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Policy Number
                    </label>
                    <input
                      type="text"
                      name="secondaryPolicyNumber"
                      value={formData.secondaryPolicyNumber}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter policy number"
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4 mt-8">Billing Preferences</h4>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Billing Method
                  </label>
                  <select
                    name="preferredBillingMethod"
                    value={formData.preferredBillingMethod}
                    onChange={handleChange}
                    className="input-field w-full"
                  >
                    <option value="">Select method</option>
                    <option value="Email">Email</option>
                    <option value="Mail">Mail</option>
                    <option value="Online Portal">Online Portal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Payment Methods
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 p-3 bg-dark-tertiary rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        name="paymentMethods.creditCard"
                        checked={formData.paymentMethods.creditCard}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300">Credit Card</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-dark-tertiary rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        name="paymentMethods.debitCard"
                        checked={formData.paymentMethods.debitCard}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300">Debit Card</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-dark-tertiary rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        name="paymentMethods.cash"
                        checked={formData.paymentMethods.cash}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300">Cash</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-dark-tertiary rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        name="paymentMethods.check"
                        checked={formData.paymentMethods.check}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300">Check</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-dark-tertiary rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        name="paymentMethods.onlinePayment"
                        checked={formData.paymentMethods.onlinePayment}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300">Online Payment</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'consent' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Consent & Documents</h3>
                  <p className="text-sm text-gray-400 mb-6">Manage patient consent forms and documents.</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Required Consent Forms</h4>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-dark-tertiary rounded-lg">
                    <div>
                      <p className="font-medium">HIPAA Consent Form</p>
                      <p className="text-sm text-gray-400">Patient consent for use and disclosure of health information</p>
                    </div>
                    <button className="btn-secondary">Upload</button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-dark-tertiary rounded-lg">
                    <div>
                      <p className="font-medium">Treatment Consent</p>
                      <p className="text-sm text-gray-400">Consent to receive medical treatment</p>
                    </div>
                    <button className="btn-secondary">Upload</button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-dark-tertiary rounded-lg">
                    <div>
                      <p className="font-medium">Financial Agreement</p>
                      <p className="text-sm text-gray-400">Agreement to pay for services</p>
                    </div>
                    <button className="btn-secondary">Upload</button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4 mt-8">Additional Documents</h4>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Document Type
                  </label>
                  <select className="input-field w-full">
                    <option value="">Select document type</option>
                    <option value="ID">ID Document</option>
                    <option value="Insurance">Insurance Card</option>
                    <option value="Medical">Medical Records</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload Document
                  </label>
                  <div className="border-2 border-dashed border-dark-tertiary rounded-lg p-8 text-center">
                    <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-300 mb-2">Upload additional patient documents. PDF, JPG or PNG. Max 10MB.</p>
                    <button type="button" className="btn-secondary mt-2">
                      Choose File
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4 mt-8">Communication Preferences</h4>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-3 bg-dark-tertiary rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      name="communicationPreferences.appointmentReminders"
                      checked={formData.communicationPreferences.appointmentReminders}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300">Receive appointment reminders</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-dark-tertiary rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      name="communicationPreferences.labResultNotifications"
                      checked={formData.communicationPreferences.labResultNotifications}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300">Receive lab result notifications</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-dark-tertiary rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      name="communicationPreferences.prescriptionNotifications"
                      checked={formData.communicationPreferences.prescriptionNotifications}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300">Receive prescription notifications</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-dark-tertiary rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      name="communicationPreferences.clinicNewsletterUpdates"
                      checked={formData.communicationPreferences.clinicNewsletterUpdates}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300">Receive clinic newsletter and updates</span>
                  </label>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-dark-tertiary">
              <Link href="/patients" className="btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Registering...' : 'Register Patient'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
