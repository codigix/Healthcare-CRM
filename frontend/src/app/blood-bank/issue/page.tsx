'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Calendar } from 'lucide-react';
import Link from 'next/link';
import { bloodBankAPI } from '@/lib/api';

export default function IssueBloodPage() {
  const [formData, setFormData] = useState({
    requestType: 'patient',
    patient: '',
    bloodType: '',
    numberOfUnits: '1',
    department: '',
    requestingDoctor: '',
    issueDate: '',
    emergencyRequest: false,
    purpose: '',
    additionalNotes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        bloodType: formData.bloodType,
        units: parseInt(formData.numberOfUnits),
        recipient: formData.patient || 'Unknown',
        recipientId: formData.patient || null,
        requestingDoctor: formData.requestingDoctor || 'Unknown',
        purpose: formData.purpose || 'Medical',
        department: formData.department || 'General'
      };

      const response = await bloodBankAPI.createIssue(submitData);

      if (response.data.success) {
        alert('Blood issued successfully!');
        setFormData({
          requestType: 'patient',
          patient: '',
          bloodType: '',
          numberOfUnits: '1',
          department: '',
          requestingDoctor: '',
          issueDate: '',
          emergencyRequest: false,
          purpose: '',
          additionalNotes: ''
        });
        window.location.href = '/blood-bank/issued';
      } else {
        alert('Error: ' + (response.data.error || 'Failed to issue blood'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error issuing blood');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Issue Blood</h1>
            <p className="text-gray-400">Complete this form below to issue blood to a patient or external recipient.</p>
          </div>
          <Link href="/blood-bank/issued">
            <button className="btn-secondary">Cancel</button>
          </Link>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Blood Issue Form</h2>
          <p className="text-gray-400 text-sm mb-6">Fill out required information to issue blood units.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Request Type</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="requestType"
                      value="patient"
                      checked={formData.requestType === 'patient'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-emerald-500 bg-dark-tertiary border-gray-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm">Internal Patient</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="requestType"
                      value="external"
                      checked={formData.requestType === 'external'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-emerald-500 bg-dark-tertiary border-gray-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm">External Recipient</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Patient <span className="text-red-500">*</span>
                </label>
                <select
                  name="patient"
                  value={formData.patient}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                >
                  <option value="">Select patient</option>
                  <option value="P-001">John Smith - P-001</option>
                  <option value="P-002">Sarah Johnson - P-002</option>
                  <option value="P-003">Michael Chen - P-003</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Blood Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    required
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
                  <p className="text-xs text-gray-400 mt-1">Each unit is approximately 450ml of whole blood.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Number of Units <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="numberOfUnits"
                    value={formData.numberOfUnits}
                    onChange={handleInputChange}
                    placeholder="Enter number of units"
                    min="1"
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  >
                    <option value="">Select department</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Internal Medicine">Internal Medicine</option>
                    <option value="Obstetrics">Obstetrics</option>
                    <option value="Oncology">Oncology</option>
                    <option value="Nephrology">Nephrology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Requesting Doctor
                  </label>
                  <select
                    name="requestingDoctor"
                    value={formData.requestingDoctor}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  >
                    <option value="">Select doctor</option>
                    <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
                    <option value="Dr. Michael Chen">Dr. Michael Chen</option>
                    <option value="Dr. Lisa Anderson">Dr. Lisa Anderson</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Issue Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      name="issueDate"
                      value={formData.issueDate}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      required
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="emergencyRequest"
                      checked={formData.emergencyRequest}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-emerald-500 bg-dark-tertiary border-gray-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm font-medium">Emergency Request</span>
                  </label>
                  <p className="text-xs text-gray-400 ml-6">Mark this if the blood is needed for an emergency situation.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Purpose
                </label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  className="input-field w-full"
                >
                  <option value="">Select the purpose of this issued blood</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Trauma">Trauma</option>
                  <option value="Anemia">Anemia Treatment</option>
                  <option value="Cancer">Cancer Treatment</option>
                  <option value="Childbirth">Childbirth</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  placeholder="Any additional information or special instructions"
                  rows={4}
                  className="input-field w-full resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Link href="/blood-bank/issued">
                <button type="button" className="btn-secondary">
                  Cancel
                </button>
              </Link>
              <button type="submit" className="btn-primary">
                Issue Blood
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-400">
              Fields marked with <span className="text-red-500">*</span> are required. Make sure to fill all required fields before submitting.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
