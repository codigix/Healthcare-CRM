const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'frontend', 'src', 'app', 'dashboard', 'receptionist', 'patient-management', 'consents', 'page.tsx');

const content = `"use client";
import NativeDataTable from "@/components/ui/NativeDataTable";
import SearchableSelect from "@/components/ui/SearchableSelect";
import React, { useState, useEffect } from 'react';
import {
  FileSignature, Upload, Printer, Download, RefreshCcw, Plus,
  Search, Filter, CheckCircle2, Clock, AlertCircle, FileText,
  Eye, Edit, Mail, MessageSquare, History, X, PenTool,
  UploadCloud, ShieldAlert, CheckSquare, Activity, User, UserCheck,
  ChevronRight, ArrowRight, ShieldCheck, FileKey, Stethoscope, Settings2
} from 'lucide-react';
import { format } from 'date-fns';

export default function ConsentsAndFormsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [consents, setConsents] = useState<any[]>([]);
  
  // Add Consent Form State
  const [newConsent, setNewConsent] = useState({
    type: '',
    department: '',
    visitType: 'OPD',
    doctorId: '',
    signedBy: '',
    witness: ''
  });

  const fetchPatients = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/patients');
      if (res.ok) {
        const data = await res.json();
        setPatients(data);
      }
    } catch (error) {
      console.error("Failed to fetch patients", error);
    }
  };

  const fetchConsents = async (patientId: string) => {
    try {
      const res = await fetch(\`http://localhost:5000/api/consents?patientId=\${patientId}\`);
      if (res.ok) {
        const data = await res.json();
        setConsents(data);
      }
    } catch (error) {
      console.error("Failed to fetch consents", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      const p = patients.find(p => p.id === selectedPatientId);
      setSelectedPatient(p || null);
      fetchConsents(selectedPatientId);
    } else {
      setSelectedPatient(null);
      setConsents([]);
    }
  }, [selectedPatientId, patients]);

  const handleAddConsent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !newConsent.type || !newConsent.department || !newConsent.visitType) {
      alert('Please fill required fields.');
      return;
    }
    
    try {
      const res = await fetch('http://localhost:5000/api/consents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedPatientId,
          ...newConsent
        })
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        fetchConsents(selectedPatientId);
        setNewConsent({ type: '', department: '', visitType: 'OPD', doctorId: '', signedBy: '', witness: '' });
      }
    } catch (error) {
      console.error("Error saving consent", error);
    }
  };

  // Stats Logic
  const totalConsents = consents.length;
  const pendingCount = consents.filter(c => c.status === 'Pending Signature' || c.status === 'Pending').length;
  const signedCount = consents.filter(c => c.status === 'Signed' || c.status === 'Approved').length;
  const expiredCount = consents.filter(c => c.status === 'Expired').length;
  const rejectedCount = consents.filter(c => c.status === 'Rejected' || c.status === 'Cancelled').length;

  const stats = [
    { label: "Total Consents", value: totalConsents, color: "blue" },
    { label: "Pending Signature", value: pendingCount, color: "amber" },
    { label: "Signed Forms", value: signedCount, color: "emerald" },
    { label: "Expired Forms", value: expiredCount, color: "rose" },
    { label: "Rejected Forms", value: rejectedCount, color: "slate" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Signed':
      case 'Approved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Pending Signature':
      case 'Witness Pending':
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Expired': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Cancelled':
      case 'Rejected': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="">
      
      {/* Searchable Select for Patient */}
      <div className="mb-6 flex flex-col md:flex-row items-center gap-4 bg-slate-900 border border-slate-800 rounded p-4 shadow-xl">
        <label className="text-sm  text-slate-300 whitespace-nowrap">Select Patient:</label>
        <SearchableSelect 
          value={selectedPatientId}
          onChange={(e: any) => setSelectedPatientId(e.target.value)}
          className="w-full md:w-96 bg-slate-950 border border-slate-800 rounded p-2 text-sm text-slate-300 focus:border-pink-500/50 outline-none"
        >
          <option value="">-- Search and Select Patient --</option>
          {patients.map(p => (
            <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
          ))}
        </SearchableSelect>
      </div>

      {/* 1. Header Section with Context */}
      <div className="bg-slate-900 border border-slate-800 rounded p-5 mb-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shrink-0">
              <FileSignature className="w-7 h-7 text-pink-400" />
            </div>
            <div>
              <h1 className="text-xl  text-slate-100 flex items-center gap-2">
                Consents & Forms
                {selectedPatient && <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs  rounded-md">ID: {selectedPatient.id}</span>}
              </h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm text-slate-400">
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {selectedPatient?.name || 'No Patient Selected'}</span>
                <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> {selectedPatient ? \`Gender: \${selectedPatient.gender}\` : ''}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button onClick={() => { if(selectedPatient) setIsAddModalOpen(true); else alert('Select a patient first.'); }} className="flex-1 md:flex-none items-center justify-center gap-2 bg-pink-600 hover:bg-pink-500 text-white p-2.5 rounded text-sm font-medium transition-colors shadow-lg shadow-pink-500/20 flex">
              <Plus className="w-4 h-4" /> Add Consent
            </button>
            <button className="flex-1 md:flex-none items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded text-sm font-medium transition-colors border border-slate-700 flex">
              <UploadCloud className="w-4 h-4" /> Upload Signed
            </button>
            <button className="items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded text-sm font-medium transition-colors border border-slate-700 hidden sm:flex">
              <Download className="w-4 h-4" />
            </button>
            <button className="items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded text-sm font-medium transition-colors border border-slate-700 hidden sm:flex">
              <Printer className="w-4 h-4" />
            </button>
            <button onClick={() => selectedPatientId && fetchConsents(selectedPatientId)} className="items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded text-sm font-medium transition-colors border border-slate-700 hidden sm:flex">
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Quick Cards */}
      {selectedPatient && (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded p-4 flex flex-col justify-center relative overflow-hidden group">
            <div className={\`absolute right-0 top-0 w-16 h-16 bg-\${stat.color}-500/10 rounded-bl-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-500\`}></div>
            <p className="text-sm font-medium text-slate-400 mb-1 relative z-10">{stat.label}</p>
            <p className={\`text-xl  text-\${stat.color}-400 relative z-10\`}>{stat.value}</p>
          </div>
        ))}
      </div>
      )}

      {/* 3. Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded p-4 mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Search forms..." className="w-full bg-slate-950 border border-slate-800 rounded py-2 pl-9 pr-4 text-sm focus:border-pink-500/50 outline-none text-slate-200" />
          </div>
          <SearchableSelect className="bg-slate-950 border border-slate-800 rounded p-2 text-sm text-slate-300 focus:border-pink-500/50 outline-none flex-1 lg:flex-none">
            <option>Consent Type (All)</option>
            <option>General Hospital Consent</option>
            <option>Surgery Consent</option>
            <option>Anesthesia Consent</option>
          </SearchableSelect>
        </div>
      </div>

      {/* 4. DataTable */}
      <div className="">
        <div className="overflow-x-auto">
          <NativeDataTable>
            <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                <th className="p-4 font-medium pl-6">Form ID & Type</th>
                <th className="p-4 font-medium">Department / Doctor</th>
                <th className="p-4 font-medium">Signatories</th>
                <th className="p-4 font-medium">Date & Version</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {consents.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No consents found for this patient.</td></tr>
              ) : consents.map((con, i) => (
                <tr key={con.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="font-medium text-slate-200">{con.type}</div>
                    <div className="text-xs text-pink-400 font-mono mt-1">{con.id} • {con.visitType}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-200">{con.department}</div>
                    <div className="text-xs text-slate-500 mt-1">{con.doctorId || '-'}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-300 flex items-center gap-1.5 text-xs"><PenTool className="w-3 h-3 text-emerald-400" /> By: {con.signedBy}</div>
                    <div className="text-slate-400 flex items-center gap-1.5 text-xs mt-1.5"><Eye className="w-3 h-3 text-blue-400" /> Wit: {con.witness}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-300 flex items-center gap-1.5"><Clock className="w-3 h-3 text-slate-500" /> {format(new Date(con.createdAt), 'dd MMM yyyy')}</div>
                    <div className="text-slate-500 text-xs mt-1.5 flex items-center gap-1.5"><History className="w-3 h-3" /> {con.version}</div>
                  </td>
                  <td className="p-4">
                    <span className={\`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border \${getStatusColor(con.status)}\`}>
                      {con.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => setIsViewModalOpen(true)} className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-md transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </NativeDataTable>
        </div>
      </div>

      {/* 5. Add Consent Modal */}
      {isAddModalOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded w-full max-w-5xl flex flex-col max-h-[95vh] shadow-2xl">

            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50 rounded-t-xl">
              <div>
                <h2 className="text-xl  text-slate-100 flex items-center gap-2"><Plus className="w-5 h-5 text-pink-400" /> Generate New Consent Form</h2>
                <p className="text-xs text-slate-400 mt-1">Select template, fill details, and collect signatures digitally.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddConsent} className="flex-1 overflow-y-auto p-6 space-y-8">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Patient Info */}
                <div>
                  <h3 className="text-sm  text-slate-300 mb-4 border-b border-slate-800 pb-2 flex items-center gap-2"><UserCheck className="w-4 h-4 text-emerald-400" /> 1. Context Information</h3>
                  <div className="bg-slate-950 border border-slate-800 rounded p-4 grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-slate-500 block text-xs">Patient</span><span className="font-medium text-slate-200">{selectedPatient.name}</span></div>
                    <div><span className="text-slate-500 block text-xs">ID</span><span className="font-medium text-slate-200">{selectedPatient.id}</span></div>
                    <div><span className="text-slate-500 block text-xs">Gender</span><span className="font-medium text-slate-200">{selectedPatient.gender}</span></div>
                    <div><span className="text-slate-500 block text-xs">Phone</span><span className="font-medium text-slate-200">{selectedPatient.phone}</span></div>
                  </div>
                </div>

                {/* Consent Setup */}
                <div>
                  <h3 className="text-sm  text-slate-300 mb-4 border-b border-slate-800 pb-2 flex items-center gap-2"><Settings2 className="w-4 h-4 text-blue-400" /> 2. Consent Setup</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Consent Category *</label>
                      <SearchableSelect 
                        value={newConsent.type}
                        onChange={(e: any) => setNewConsent({...newConsent, type: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-slate-300 focus:border-pink-500/50 outline-none"
                      >
                        <option value="">Select Category</option>
                        <option value="General Hospital Consent">General Hospital Consent</option>
                        <option value="Surgery Consent">Surgery Consent</option>
                        <option value="Anesthesia Consent">Anesthesia Consent</option>
                        <option value="Blood Transfusion Consent">Blood Transfusion Consent</option>
                        <option value="ICU Consent">ICU Consent</option>
                      </SearchableSelect>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Department *</label>
                      <input 
                        type="text"
                        value={newConsent.department}
                        onChange={(e) => setNewConsent({...newConsent, department: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-slate-300 focus:border-pink-500/50 outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Visit Type *</label>
                      <SearchableSelect 
                        value={newConsent.visitType}
                        onChange={(e: any) => setNewConsent({...newConsent, visitType: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-slate-300 focus:border-pink-500/50 outline-none"
                      >
                        <option value="OPD">OPD</option>
                        <option value="IPD">IPD</option>
                        <option value="Emergency">Emergency</option>
                      </SearchableSelect>
                    </div>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div>
                <h3 className="text-sm  text-slate-300 mb-4 border-b border-slate-800 pb-2 flex items-center gap-2"><PenTool className="w-4 h-4 text-emerald-400" /> 3. Signatures</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-medium text-slate-400 mb-1.5">Signed By</label>
                     <input 
                       type="text"
                       placeholder="e.g. Patient, Guardian"
                       value={newConsent.signedBy}
                       onChange={(e) => setNewConsent({...newConsent, signedBy: e.target.value})}
                       className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-slate-300 focus:border-pink-500/50 outline-none" 
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-medium text-slate-400 mb-1.5">Witness</label>
                     <input 
                       type="text"
                       placeholder="e.g. Receptionist"
                       value={newConsent.witness}
                       onChange={(e) => setNewConsent({...newConsent, witness: e.target.value})}
                       className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-slate-300 focus:border-pink-500/50 outline-none" 
                     />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded text-sm font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" className="p-2 bg-pink-600 text-white hover:bg-pink-500 rounded text-sm font-medium transition-colors shadow-lg shadow-pink-500/20 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Save Consent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal logic can be implemented later */}
    </div>
  );
}
`;

fs.writeFileSync(targetFile, content);
console.log('File successfully written!');
