"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Search, FileText, MoreVertical, Plus, Edit, Trash2 } from "lucide-react";
import { insuranceClaimsAPI, patientAPI, doctorAPI } from "@/lib/api";

interface Patient {
  id: string;
  name: string;
}

interface InsuranceClaim {
  id: string;
  patient: Patient;
  patientId: string;
  provider: string;
  policyNumber: string;
  submittedDate: string | null;
  amount: number | { D?: string[] };
  status: "Approved" | "Pending" | "Rejected" | "Draft";
  type: string;
}

interface StatisticsData {
  totalClaims: number;
  approvedAmount: number;
  pendingClaims: number;
  successRate: string;
}

export default function InsuranceClaimsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [statistics, setStatistics] = useState<StatisticsData>({
    totalClaims: 0,
    approvedAmount: 0,
    pendingClaims: 0,
    successRate: "0",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<{ id: string; name: string }[]>([]);
  const [newForm, setNewForm] = useState({
    patientId: "",
    provider: "",
    policyNumber: "",
    amount: "",
    type: "",
  });
  const [editForm, setEditForm] = useState({
    patientId: "",
    provider: "",
    policyNumber: "",
    amount: "",
    type: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [claimsRes, statsRes, patientsRes, doctorsRes] = await Promise.all([
          insuranceClaimsAPI.list(1, 100),
          insuranceClaimsAPI.getStatistics(),
          patientAPI.list(1, 100),
          doctorAPI.list(1, 100),
        ]);

        setClaims(claimsRes.data.claims || []);
        setStatistics(statsRes.data);
        setPatients(patientsRes.data.patients || []);
        setDoctors(doctorsRes.data.doctors || []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-blue-600/10 text-blue-600 border border-blue-600/20";
      case "Pending":
        return "bg-orange-500/10 text-orange-500 border border-orange-500/20";
      case "Rejected":
        return "bg-red-500/10 text-red-500 border border-red-500/20";
      case "Draft":
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
    }
  };

  const filteredClaims = claims.filter((claim) => {
    const patientName = claim.patient?.name || "";
    const matchesSearch =
      patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || claim.status === statusFilter;
    const matchesProvider =
      providerFilter === "all" || claim.provider === providerFilter;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "approved" && claim.status === "Approved") ||
      (activeTab === "pending" && claim.status === "Pending") ||
      (activeTab === "rejected" && claim.status === "Rejected") ||
      (activeTab === "draft" && claim.status === "Draft");
    return matchesSearch && matchesStatus && matchesProvider && matchesTab;
  });

  const convertAmount = (amount: any): number => {
    if (typeof amount === "number") return amount;
    if (typeof amount === "string") return parseFloat(amount);
    return 0;
  };

  const handleAddNew = async () => {
    if (newForm.patientId && newForm.provider && newForm.policyNumber && newForm.amount && newForm.type) {
      try {
        const payload = {
          patientId: newForm.patientId,
          provider: newForm.provider,
          policyNumber: newForm.policyNumber,
          amount: parseFloat(newForm.amount),
          type: newForm.type,
          status: "Draft",
        };
        await insuranceClaimsAPI.create(payload);
        const claimsRes = await insuranceClaimsAPI.list(1, 100);
        setClaims(claimsRes.data.claims || []);
        setNewForm({ patientId: "", provider: "", policyNumber: "", amount: "", type: "" });
        setIsAddingNew(false);
      } catch (err) {
        console.error("Failed to add claim", err);
      }
    }
  };

  const handleEdit = (claim: InsuranceClaim) => {
    setEditingId(claim.id);
    setEditForm({
      patientId: claim.patientId,
      provider: claim.provider,
      policyNumber: claim.policyNumber,
      amount: convertAmount(claim.amount).toString(),
      type: claim.type,
    });
    setOpenMenuId(null);
  };

  const handleSaveEdit = async () => {
    if (editingId && editForm.patientId && editForm.provider && editForm.policyNumber && editForm.amount && editForm.type) {
      try {
        const payload = {
          patientId: editForm.patientId,
          provider: editForm.provider,
          policyNumber: editForm.policyNumber,
          amount: parseFloat(editForm.amount),
          type: editForm.type,
        };
        await insuranceClaimsAPI.update(editingId, payload);
        const claimsRes = await insuranceClaimsAPI.list(1, 100);
        setClaims(claimsRes.data.claims || []);
        setEditingId(null);
      } catch (err) {
        console.error("Failed to update claim", err);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this insurance claim?")) {
      try {
        await insuranceClaimsAPI.delete(id);
        setClaims(prev => prev.filter(claim => claim.id !== id));
        setOpenMenuId(null);
      } catch (err) {
        console.error("Failed to delete claim", err);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Insurance Claims</h1>
            <p className="text-gray-400">
              Manage and track insurance claims for patient services
            </p>
          </div>
          <div className="flex gap-3">
            <select className="input-field">
              <option>Mar 15, 2025 - Nov 14, 2025</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading insurance claims...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="text-blue-500" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {statistics.totalClaims}
                  </div>
                  <div className="text-sm text-gray-400">Total Claims</div>
                  <div className="text-xs text-blue-500">All submissions</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center">
                  <FileText className="text-blue-600" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    ${convertAmount(statistics.approvedAmount).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">Approved Claims</div>
                  <div className="text-xs text-blue-600">
                    Successfully processed
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="text-orange-500" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {statistics.pendingClaims}
                  </div>
                  <div className="text-sm text-gray-400">Pending Claims</div>
                  <div className="text-xs text-orange-500">Under review</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="text-purple-500" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {statistics.successRate}%
                  </div>
                  <div className="text-sm text-gray-400">Claim Success Rate</div>
                  <div className="text-xs text-purple-500">
                    Approval percentage
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">All Insurance Claims</h2>
            <p className="text-gray-400 text-sm mb-6">
              View and manage insurance claims
            </p>

            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-dark-tertiary">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search claims..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent flex-1 outline-none"
              />
            </div>

            <div className="flex bg-dark-tertiary rounded-lg p-1 mb-6 w-fit">
              <button
                onClick={() => {
                  setActiveTab("all");
                  setStatusFilter("all");
                }}
                className={`px-4 py-2 rounded transition-colors font-medium ${
                  activeTab === "all"
                    ? "bg-emerald-500 text-white"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                All Claims
              </button>
              <button
                onClick={() => {
                  setActiveTab("approved");
                  setStatusFilter("Approved");
                }}
                className={`px-4 py-2 rounded transition-colors font-medium ${
                  activeTab === "approved"
                    ? "bg-emerald-500 text-white"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => {
                  setActiveTab("pending");
                  setStatusFilter("Pending");
                }}
                className={`px-4 py-2 rounded transition-colors font-medium ${
                  activeTab === "pending"
                    ? "bg-emerald-500 text-white"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => {
                  setActiveTab("rejected");
                  setStatusFilter("Rejected");
                }}
                className={`px-4 py-2 rounded transition-colors font-medium ${
                  activeTab === "rejected"
                    ? "bg-emerald-500 text-white"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Rejected
              </button>
              <button
                onClick={() => {
                  setActiveTab("draft");
                  setStatusFilter("Draft");
                }}
                className={`px-4 py-2 rounded transition-colors font-medium ${
                  activeTab === "draft"
                    ? "bg-emerald-500 text-white"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Draft
              </button>
            </div>

            <div className="flex gap-3 mb-6">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
                <option value="Draft">Draft</option>
              </select>
              <select
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Providers</option>
                <option value="Blue Cross Blue Shield">
                  Blue Cross Blue Shield
                </option>
                <option value="Aetna">Aetna</option>
                <option value="UnitedHealthcare">UnitedHealthcare</option>
                <option value="Cigna">Cigna</option>
                <option value="Humana">Humana</option>
                <option value="Medicare">Medicare</option>
              </select>
              <button
                onClick={() => setIsAddingNew(true)}
                className="btn-primary flex items-center gap-2 ml-auto"
              >
                <Plus size={20} />
                Add New Claim
              </button>
              <button className="btn-secondary">Export</button>
            </div>

            <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-tertiary">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                    Claim ID
                  </th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                    Patient
                  </th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                    Provider
                  </th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                    Submitted
                  </th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                    Amount
                  </th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                    Status
                  </th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                    Type
                  </th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.map((claim) => (
                  <tr
                    key={claim.id}
                    className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors"
                  >
                    <td className="py-4 px-4 text-gray-300 font-medium">
                      {claim.id}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-white">
                        {claim.patient?.name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-400">
                        {claim.patientId}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-white">{claim.provider}</div>
                      <div className="text-sm text-gray-400">
                        {claim.policyNumber}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {claim.submittedDate
                        ? new Date(claim.submittedDate).toLocaleDateString()
                        : "Not submitted"}
                    </td>
                    <td className="py-4 px-4 text-white font-medium">
                      ${convertAmount(claim.amount).toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          claim.status
                        )}`}
                      >
                        {claim.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{claim.type}</td>
                    <td className="py-4 px-4 relative">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === claim.id ? null : claim.id)}
                          className="p-2 hover:bg-dark-tertiary rounded transition-colors"
                        >
                          <MoreVertical size={18} className="text-gray-400" />
                        </button>

                        {openMenuId === claim.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-lg z-10 top-full">
                            <button
                              onClick={() => handleEdit(claim)}
                              className="w-full text-left px-4 py-2 hover:bg-dark-tertiary transition-colors flex items-center gap-2 text-gray-300 hover:text-white first:rounded-t-lg"
                            >
                              <Edit size={16} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(claim.id)}
                              className="w-full text-left px-4 py-2 hover:bg-red-500/20 transition-colors flex items-center gap-2 text-red-400 hover:text-red-300 last:rounded-b-lg"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            {filteredClaims.length === 0 && !loading && (
              <div className="text-center py-8">
                <p className="text-gray-400">No insurance claims found</p>
              </div>
            )}
          </div>
        )}

        {isAddingNew && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4">Add New Insurance Claim</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Patient</label>
                  <select
                    value={newForm.patientId}
                    onChange={(e) => setNewForm(prev => ({ ...prev, patientId: e.target.value }))}
                    className="input-field w-full"
                  >
                    <option value="">Select a patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>{patient.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Insurance Provider</label>
                  <input
                    type="text"
                    value={newForm.provider}
                    onChange={(e) => setNewForm(prev => ({ ...prev, provider: e.target.value }))}
                    className="input-field w-full"
                    placeholder="e.g., Blue Cross Blue Shield"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Policy Number</label>
                  <input
                    type="text"
                    value={newForm.policyNumber}
                    onChange={(e) => setNewForm(prev => ({ ...prev, policyNumber: e.target.value }))}
                    className="input-field w-full"
                    placeholder="Policy number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newForm.amount}
                    onChange={(e) => setNewForm(prev => ({ ...prev, amount: e.target.value }))}
                    className="input-field w-full"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Claim Type</label>
                  <input
                    type="text"
                    value={newForm.type}
                    onChange={(e) => setNewForm(prev => ({ ...prev, type: e.target.value }))}
                    className="input-field w-full"
                    placeholder="e.g., Medical, Dental, Vision"
                  />
                </div>

                <div className="text-sm text-gray-400 p-3 bg-dark-tertiary rounded">
                  Available Doctors: <span className="font-semibold text-white">{doctors.length}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddNew}
                  className="flex-1 btn-primary"
                >
                  Add
                </button>
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {editingId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4">Edit Insurance Claim</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Patient</label>
                  <select
                    value={editForm.patientId}
                    onChange={(e) => setEditForm(prev => ({ ...prev, patientId: e.target.value }))}
                    className="input-field w-full"
                  >
                    <option value="">Select a patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>{patient.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Insurance Provider</label>
                  <input
                    type="text"
                    value={editForm.provider}
                    onChange={(e) => setEditForm(prev => ({ ...prev, provider: e.target.value }))}
                    className="input-field w-full"
                    placeholder="e.g., Blue Cross Blue Shield"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Policy Number</label>
                  <input
                    type="text"
                    value={editForm.policyNumber}
                    onChange={(e) => setEditForm(prev => ({ ...prev, policyNumber: e.target.value }))}
                    className="input-field w-full"
                    placeholder="Policy number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.amount}
                    onChange={(e) => setEditForm(prev => ({ ...prev, amount: e.target.value }))}
                    className="input-field w-full"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Claim Type</label>
                  <input
                    type="text"
                    value={editForm.type}
                    onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value }))}
                    className="input-field w-full"
                    placeholder="e.g., Medical, Dental, Vision"
                  />
                </div>

                <div className="text-sm text-gray-400 p-3 bg-dark-tertiary rounded">
                  Available Doctors: <span className="font-semibold text-white">{doctors.length}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 btn-primary"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
