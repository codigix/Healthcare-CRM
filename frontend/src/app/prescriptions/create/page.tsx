'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { ArrowLeft, Plus, Trash2, FileText, User, Calendar, Pill, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { prescriptionAPI, patientAPI, doctorAPI, prescriptionTemplateAPI } from '@/lib/api';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  instructions: string;
  allowRefills: boolean;
  refillCount: number;
}

interface Patient {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  allergies?: string[];
  conditions?: string[];
}

export default function CreatePrescriptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchPatient, setSearchPatient] = useState('');
  const [useTemplate, setUseTemplate] = useState(false);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');

  const [formData, setFormData] = useState({
    patientId: '',
    prescriptionDate: new Date().toISOString().split('T')[0],
    prescriptionType: 'Standard',
    diagnosis: '',
    notesForPharmacist: '',
  });

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: '',
      dosage: '',
      route: 'Oral',
      frequency: '',
      duration: '30',
      instructions: '',
      allowRefills: false,
      refillCount: 0,
    }
  ]);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patRes, docRes] = await Promise.all([
          patientAPI.list(1, 100),
          doctorAPI.list(1, 100),
        ]);
        setPatients(patRes.data.patients || []);
        setDoctors(docRes.data.doctors || []);
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (useTemplate) {
      const fetchTemplates = async () => {
        try {
          const response = await prescriptionTemplateAPI.list(1, 100, '', 'all');
          setTemplates(response.data.data || []);
        } catch (err) {
          console.error('Failed to fetch templates', err);
        }
      };
      fetchTemplates();
    }
  }, [useTemplate]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template && template.medications) {
      const templateMeds = Array.isArray(template.medications) 
        ? template.medications 
        : typeof template.medications === 'string' 
          ? JSON.parse(template.medications) 
          : [];
      
      const newMeds = templateMeds.map((med: any, idx: number) => ({
        id: Date.now().toString() + idx,
        name: med.name || '',
        dosage: med.dosage || '',
        route: med.route || 'Oral',
        frequency: med.frequency || '',
        duration: med.duration || '30',
        instructions: med.instructions || '',
        allowRefills: false,
        refillCount: 0,
      }));
      
      setMedications(newMeds.length > 0 ? newMeds : medications);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePatientSelect = (patientId: string) => {
    setFormData(prev => ({ ...prev, patientId }));
    const patient = patients.find(p => p.id === patientId);
    setSelectedPatient(patient || null);
  };

  const addMedication = () => {
    setMedications([
      ...medications,
      {
        id: Date.now().toString(),
        name: '',
        dosage: '',
        route: 'Oral',
        frequency: '',
        duration: '30',
        instructions: '',
        allowRefills: false,
        refillCount: 0,
      }
    ]);
  };

  const removeMedication = (id: string) => {
    if (medications.length > 1) {
      setMedications(medications.filter(med => med.id !== id));
    }
  };

  const updateMedication = (id: string, field: string, value: any) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.patientId || !selectedDoctor) {
      setError('Please select a patient and doctor');
      setLoading(false);
      return;
    }

    if (!medications[0].name || !medications[0].dosage || !medications[0].frequency) {
      setError('Please add at least one medication');
      setLoading(false);
      return;
    }

    try {
      await prescriptionAPI.create({
        patientId: formData.patientId,
        doctorId: selectedDoctor.id,
        prescriptionDate: formData.prescriptionDate,
        prescriptionType: formData.prescriptionType,
        diagnosis: formData.diagnosis || null,
        notesForPharmacist: formData.notesForPharmacist || null,
        medications: medications.map(({ id, ...med }) => med),
        status: 'Active',
      });

      if (saveAsTemplate && templateName.trim()) {
        await prescriptionTemplateAPI.create({
          name: templateName,
          category: formData.prescriptionType,
          medications: medications.map(({ id, ...med }) => med),
          createdBy: selectedDoctor.name || 'Unknown',
        });
      }

      router.push('/prescriptions/all');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchPatient.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/prescriptions/all">
            <button className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors">
              <ArrowLeft size={24} />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-2">Create Prescription</h1>
            <p className="text-gray-400">Create a new prescription for a patient.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FileText size={20} className="text-emerald-500" />
                Prescription Details
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Prescription Date
                    </label>
                    <input
                      type="date"
                      name="prescriptionDate"
                      value={formData.prescriptionDate}
                      onChange={handleChange}
                      className="input-field w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Prescription Type
                    </label>
                    <select
                      name="prescriptionType"
                      value={formData.prescriptionType}
                      onChange={handleChange}
                      className="input-field w-full"
                    >
                      <option value="Standard">Standard</option>
                      <option value="Controlled">Controlled Substance</option>
                      <option value="Compound">Compound</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Diagnosis
                  </label>
                  <textarea
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter diagnosis or reason for prescription"
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                  <input
                    type="checkbox"
                    id="useTemplate"
                    checked={useTemplate}
                    onChange={(e) => setUseTemplate(e.target.checked)}
                    className="w-4 h-4 text-emerald-500"
                  />
                  <label htmlFor="useTemplate" className="text-sm text-gray-700 cursor-pointer">
                    Use Medication Template
                  </label>
                  {useTemplate && (
                    <select 
                      value={selectedTemplate}
                      onChange={(e) => handleTemplateSelect(e.target.value)}
                      className="input-field ml-auto"
                    >
                      <option value="">Select a template</option>
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Pill size={20} className="text-emerald-500" />
                  Medications
                </h2>
                <button
                  type="button"
                  onClick={addMedication}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add Medication
                </button>
              </div>

              <div className="space-y-6">
                {medications.map((medication, index) => (
                  <div key={medication.id} className="p-6 bg-white rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Medication #{index + 1}</h3>
                      {medications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedication(medication.id)}
                          className="p-2 hover:bg-red-500/20 rounded transition-colors text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Medication Name
                        </label>
                        <input
                          type="text"
                          value={medication.name}
                          onChange={(e) => updateMedication(medication.id, 'name', e.target.value)}
                          className="input-field w-full"
                          placeholder="Select medication..."
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dosage
                          </label>
                          <select
                            value={medication.dosage}
                            onChange={(e) => updateMedication(medication.id, 'dosage', e.target.value)}
                            className="input-field w-full"
                            required
                          >
                            <option value="">Select dosage</option>
                            <option value="5mg">5mg</option>
                            <option value="10mg">10mg</option>
                            <option value="20mg">20mg</option>
                            <option value="50mg">50mg</option>
                            <option value="100mg">100mg</option>
                            <option value="250mg">250mg</option>
                            <option value="500mg">500mg</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Route
                          </label>
                          <select
                            value={medication.route}
                            onChange={(e) => updateMedication(medication.id, 'route', e.target.value)}
                            className="input-field w-full"
                          >
                            <option value="Oral">Oral</option>
                            <option value="Topical">Topical</option>
                            <option value="Injection">Injection</option>
                            <option value="Inhalation">Inhalation</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Frequency
                          </label>
                          <select
                            value={medication.frequency}
                            onChange={(e) => updateMedication(medication.id, 'frequency', e.target.value)}
                            className="input-field w-full"
                            required
                          >
                            <option value="">Select frequency</option>
                            <option value="Once daily">Once daily</option>
                            <option value="Twice daily">Twice daily</option>
                            <option value="Three times daily">Three times daily</option>
                            <option value="Four times daily">Four times daily</option>
                            <option value="As needed">As needed</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={medication.duration}
                              onChange={(e) => updateMedication(medication.id, 'duration', e.target.value)}
                              className="input-field flex-1"
                              min="1"
                              required
                            />
                            <select className="input-field">
                              <option value="days">Days</option>
                              <option value="weeks">Weeks</option>
                              <option value="months">Months</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Special Instructions
                        </label>
                        <textarea
                          value={medication.instructions}
                          onChange={(e) => updateMedication(medication.id, 'instructions', e.target.value)}
                          className="input-field w-full"
                          placeholder="Enter any special instructions for this medication"
                          rows={2}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => updateMedication(medication.id, 'allowRefills', !medication.allowRefills)}
                            className="text-emerald-500"
                          >
                            {medication.allowRefills ? <ToggleRight size={24} /> : <ToggleLeft size={24} className="text-gray-500" />}
                          </button>
                          <label className="text-sm text-gray-700">
                            Allow Refills
                          </label>
                        </div>
                        {medication.allowRefills && (
                          <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-700">Number of Refills:</label>
                            <input
                              type="number"
                              value={medication.refillCount}
                              onChange={(e) => updateMedication(medication.id, 'refillCount', parseInt(e.target.value))}
                              className="input-field w-20"
                              min="0"
                              max="12"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Additional Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notes for Pharmacist
                  </label>
                  <textarea
                    name="notesForPharmacist"
                    value={formData.notesForPharmacist}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter any additional notes for the pharmacist"
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                  <input
                    type="checkbox"
                    id="saveAsTemplate"
                    checked={saveAsTemplate}
                    onChange={(e) => setSaveAsTemplate(e.target.checked)}
                    className="w-4 h-4 text-emerald-500"
                  />
                  <label htmlFor="saveAsTemplate" className="text-sm text-gray-700 cursor-pointer flex-1">
                    Save as Template
                  </label>
                </div>

                {saveAsTemplate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Template Name
                    </label>
                    <input
                      type="text"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      className="input-field w-full"
                      placeholder="Enter a name for this template"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <User size={20} className="text-emerald-500" />
                Doctor & Patient Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Doctor
                  </label>
                  <select
                    value={selectedDoctor?.id || ''}
                    onChange={(e) => {
                      const doctor = doctors.find(d => d.id === e.target.value);
                      setSelectedDoctor(doctor || null);
                    }}
                    className="input-field w-full"
                    required
                  >
                    <option value="">Select a doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="border-t border-dark-tertiary pt-4 mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Search and select a patient for this prescription.
                  </label>
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchPatient}
                    onChange={(e) => setSearchPatient(e.target.value)}
                    className="input-field w-full"
                  />
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredPatients.map((patient) => (
                    <label
                      key={patient.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.patientId === patient.id
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-dark-tertiary hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="patientId"
                        value={patient.id}
                        checked={formData.patientId === patient.id}
                        onChange={() => handlePatientSelect(patient.id)}
                        className="w-4 h-4 text-emerald-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{patient.name}</div>
                        {patient.age && (
                          <div className="text-sm text-gray-400">
                            {patient.age}y • {patient.gender}
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                {selectedPatient && (
                  <div className="mt-4 p-4 bg-white rounded-lg space-y-3">
                    <div>
                      <div className="text-xs text-gray-700 mb-1">Allergies:</div>
                      {selectedPatient.allergies && selectedPatient.allergies.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedPatient.allergies.map((allergy, idx) => (
                            <span key={idx} className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20">
                              {allergy}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-700">No known allergies</span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-gray-700 mb-1">Conditions:</div>
                      {selectedPatient.conditions && selectedPatient.conditions.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedPatient.conditions.map((condition, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20">
                              {condition}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-700">No conditions listed</span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
                    >
                      View patient details →
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Prescription Options</h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="electronic"
                    name="prescriptionFormat"
                    defaultChecked
                    className="w-4 h-4 text-emerald-500"
                  />
                  <label htmlFor="electronic" className="text-sm text-gray-300 cursor-pointer">
                    Electronic Prescription
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="print"
                    name="prescriptionFormat"
                    className="w-4 h-4 text-emerald-500"
                  />
                  <label htmlFor="print" className="text-sm text-gray-300 cursor-pointer">
                    Print Prescription
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="both"
                    name="prescriptionFormat"
                    className="w-4 h-4 text-emerald-500"
                  />
                  <label htmlFor="both" className="text-sm text-gray-300 cursor-pointer">
                    Both Electronic and Print
                  </label>
                </div>

                <div className="pt-4 border-t border-dark-tertiary">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="notifyPatient"
                      defaultChecked
                      className="w-4 h-4 text-emerald-500"
                    />
                    <label htmlFor="notifyPatient" className="text-sm text-gray-300 cursor-pointer">
                      Notify Patient
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="markAsUrgent"
                    className="w-4 h-4 text-emerald-500"
                  />
                  <label htmlFor="markAsUrgent" className="text-sm text-gray-300 cursor-pointer">
                    Mark as Urgent
                  </label>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !formData.patientId || !selectedDoctor || medications.some(m => !m.name || !m.dosage || !m.frequency)}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {loading ? 'Creating...' : 'Create Prescription'}
            </button>

            <Link href="/prescriptions/all">
              <button type="button" className="btn-secondary w-full">
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
