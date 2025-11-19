"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import ActionModal from "@/components/UI/ActionModal";
import {
  Search,
  Plus,
  AlertCircle,
  Droplet,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { bloodBankAPI } from "@/lib/api";

interface BloodUnit {
  id: string;
  unitId: string;
  bloodType: string;
  quantity: number;
  collectionDate: string;
  expiryDate: string;
  status: string;
  donor?: { name: string };
  notes?: string;
}

interface ApiResponse {
  success: boolean;
  data: BloodUnit[];
  stats: Record<string, { units: number; count: number }>;
  total: number;
}

export default function BloodStockPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [bloodStock, setBloodStock] = useState<BloodUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<
    Record<string, { units: number; count: number }>
  >({});

  // Modal states
  const [selectedUnit, setSelectedUnit] = useState<BloodUnit | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    status: "",
    quantity: 1,
    expiryDate: "",
    notes: "",
  });

  useEffect(() => {
    fetchBloodStock();
  }, []);

  const fetchBloodStock = async () => {
    try {
      setLoading(true);
      const response = await bloodBankAPI.getStock();
      const data = response.data as ApiResponse;
      if (data.success) {
        setBloodStock(data.data);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching blood stock:", error);
      alert("Failed to fetch blood stock. Please ensure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (unit: BloodUnit) => {
    setSelectedUnit(unit);
    setViewModalOpen(true);
  };

  const handleEditUnit = (unit: BloodUnit) => {
    setSelectedUnit(unit);
    setEditFormData({
      status: unit.status,
      quantity: unit.quantity,
      expiryDate: unit.expiryDate.split("T")[0],
      notes: unit.notes || "",
    });
    setEditModalOpen(true);
  };

  const handleDeleteUnit = (unit: BloodUnit) => {
    setSelectedUnit(unit);
    setDeleteModalOpen(true);
  };

  const handleUpdateUnit = async () => {
    if (!selectedUnit) return;

    try {
      const response = await bloodBankAPI.updateStock(selectedUnit.id, editFormData);
      if (response.data.success) {
        alert("Blood unit updated successfully!");
        setEditModalOpen(false);
        fetchBloodStock();
      } else {
        alert("Error: " + (response.data.error || "Failed to update"));
      }
    } catch (error) {
      console.error("Error updating blood unit:", error);
      alert("Error updating blood unit");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUnit) return;

    try {
      const response = await bloodBankAPI.deleteStock(selectedUnit.id);
      if (response.data.success) {
        alert("Blood unit deleted successfully!");
        setDeleteModalOpen(false);
        fetchBloodStock();
      } else {
        alert("Error: " + (response.data.error || "Failed to delete"));
      }
    } catch (error) {
      console.error("Error deleting blood unit:", error);
      alert("Error deleting blood unit");
    }
  };

  const totalUnits = bloodStock.reduce((sum, item) => sum + item.quantity, 0);
  const expiringUnits = bloodStock.filter((b) => {
    const expiry = new Date(b.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.floor(
      (expiry.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  }).length;
  const criticalLevels = Object.values(stats).filter(
    (s: any) => s.units <= 3
  ).length;

  const getStatusColor = (units: number) => {
    if (units >= 10) return "bg-emerald-500";
    if (units >= 5) return "bg-orange-500";
    return "bg-red-500";
  };

  const getBarWidth = (units: number) => {
    const maxUnits = Math.max(...bloodStock.map((b) => b.quantity), 1);
    return `${(units / maxUnits) * 100}%`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Blood Stock</h1>
            <p className="text-gray-400">
              Manage and monitor blood inventory in the blood bank
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Plus className="text-blue-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalUnits}</div>
                <div className="text-sm text-gray-400">Total Blood Units</div>
                <div className="text-xs text-emerald-500">
                  Units available across all blood types
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Droplet className="text-blue-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm text-gray-400">
                  Blood Type Distribution
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-red-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{expiringUnits}</div>
                <div className="text-sm text-gray-400">Expiring Soon</div>
                <div className="text-xs text-red-500">
                  Units expiring within next 7 days
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-red-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{criticalLevels}</div>
                <div className="text-sm text-gray-400">Critical Levels</div>
                <div className="text-xs text-red-500">
                  Blood types with critically low inventory
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-6">
            Blood Type Distribution
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Current inventory levels for each blood type
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            {Object.entries(stats).map(([bloodType, data]) => (
              <div key={bloodType} className="text-center">
                <div
                  className={`px-4 py-2 rounded-lg ${
                    bloodType.includes("+")
                      ? "bg-blue-500/10 text-blue-500"
                      : "bg-red-500/10 text-red-500"
                  } border ${
                    bloodType.includes("+")
                      ? "border-blue-500/20"
                      : "border-red-500/20"
                  } font-semibold`}
                >
                  {bloodType}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {data.units} units
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Blood Type Availability</h3>
            <p className="text-gray-400 text-sm">
              Current inventory levels for each blood type
            </p>

            <div className="space-y-4">
              {Object.entries(stats).map(([bloodType, data]) => (
                <div key={bloodType} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold w-12">{bloodType}</span>
                    </div>
                    <span className="text-white font-medium">
                      {data.units} units
                    </span>
                  </div>
                  <div className="w-full bg-dark-tertiary rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full ${getStatusColor(
                        data.units
                      )} transition-all duration-300`}
                      style={{ width: getBarWidth(data.units) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-dark-tertiary">
            <div className="flex items-center gap-2 mb-6">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search blood units..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent flex-1 outline-none"
              />
            </div>

            <div className="flex gap-4 mb-6 border-b border-dark-tertiary">
              <button
                onClick={() => setActiveTab("all")}
                className={`pb-3 px-1 font-medium transition-colors ${
                  activeTab === "all"
                    ? "text-emerald-500 border-b-2 border-emerald-500"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                All Units
              </button>
              <button
                onClick={() => setActiveTab("available")}
                className={`pb-3 px-1 font-medium transition-colors ${
                  activeTab === "available"
                    ? "text-emerald-500 border-b-2 border-emerald-500"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setActiveTab("reserved")}
                className={`pb-3 px-1 font-medium transition-colors ${
                  activeTab === "reserved"
                    ? "text-emerald-500 border-b-2 border-emerald-500"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Reserved
              </button>
              <button
                onClick={() => setActiveTab("expiring")}
                className={`pb-3 px-1 font-medium transition-colors ${
                  activeTab === "expiring"
                    ? "text-emerald-500 border-b-2 border-emerald-500"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Expiring Soon
              </button>
            </div>

            <div className="flex gap-3 mb-6">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Types</option>
                {Object.keys(stats).map((bloodType) => (
                  <option key={bloodType} value={bloodType}>
                    {bloodType}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="expiring">Expiring Soon</option>
              </select>
              <div className="flex gap-2 ml-auto">
                <button className="btn-secondary flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                    />
                  </svg>
                  Export
                </button>
                <Link href="/blood-bank/add-unit">
                  <button className="btn-primary flex items-center gap-2">
                    <Plus size={20} />
                    Add Blood Units
                  </button>
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-400">
                Loading blood units...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-tertiary">
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                        Unit ID
                      </th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                        Blood Type
                      </th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                        Quantity
                      </th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                        Collection Date
                      </th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                        Expiry Date
                      </th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                        Status
                      </th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bloodStock.map((unit) => (
                      <tr
                        key={unit.id}
                        className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors"
                      >
                        <td className="py-4 px-4 text-gray-300">
                          {unit.unitId}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              unit.bloodType.includes("+")
                                ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                                : "bg-red-500/10 text-red-500 border border-red-500/20"
                            }`}
                          >
                            {unit.bloodType}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-300">
                          {unit.quantity} unit{unit.quantity > 1 ? "s" : ""}
                        </td>
                        <td className="py-4 px-4 text-gray-300">
                          {new Date(unit.collectionDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-gray-300">
                          {new Date(unit.expiryDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              unit.status === "Available"
                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                            }`}
                          >
                            {unit.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(unit)}
                              className="p-2 hover:bg-blue-500/20 rounded transition-colors"
                              title="View Details"
                            >
                              <Eye size={16} className="text-blue-500" />
                            </button>
                            <button
                              onClick={() => handleEditUnit(unit)}
                              className="p-2 hover:bg-yellow-500/20 rounded transition-colors"
                              title="Edit Unit"
                            >
                              <Edit size={16} className="text-yellow-500" />
                            </button>
                            <button
                              onClick={() => handleDeleteUnit(unit)}
                              className="p-2 hover:bg-red-500/20 rounded transition-colors"
                              title="Delete Unit"
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      <ActionModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Blood Unit Details"
      >
        {selectedUnit && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Unit ID
                </label>
                <p className="text-white">{selectedUnit.unitId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Blood Type
                </label>
                <p className="text-white">{selectedUnit.bloodType}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Quantity
                </label>
                <p className="text-white">
                  {selectedUnit.quantity} unit
                  {selectedUnit.quantity > 1 ? "s" : ""}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Status
                </label>
                <p className="text-white">{selectedUnit.status}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Collection Date
                </label>
                <p className="text-white">
                  {new Date(selectedUnit.collectionDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Expiry Date
                </label>
                <p className="text-white">
                  {new Date(selectedUnit.expiryDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            {selectedUnit.donor && (
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Donor
                </label>
                <p className="text-white">{selectedUnit.donor.name}</p>
              </div>
            )}
            {selectedUnit.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Notes
                </label>
                <p className="text-white">{selectedUnit.notes}</p>
              </div>
            )}
          </div>
        )}
      </ActionModal>

      {/* Edit Unit Modal */}
      <ActionModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Blood Unit"
        actions={
          <>
            <button
              onClick={() => setEditModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button onClick={handleUpdateUnit} className="btn-primary">
              Update Unit
            </button>
          </>
        }
      >
        {selectedUnit && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={editFormData.status}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="input-field w-full"
                >
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Expired">Expired</option>
                  <option value="Discarded">Discarded</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={editFormData.quantity}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      quantity: parseInt(e.target.value),
                    }))
                  }
                  className="input-field w-full"
                  min="1"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={editFormData.expiryDate}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      expiryDate: e.target.value,
                    }))
                  }
                  className="input-field w-full"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={editFormData.notes}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  className="input-field w-full resize-none"
                  rows={3}
                  placeholder="Additional notes..."
                />
              </div>
            </div>
          </div>
        )}
      </ActionModal>

      {/* Delete Confirmation Modal */}
      <ActionModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Blood Unit"
        actions={
          <>
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="btn-primary bg-red-500 hover:bg-red-600"
            >
              Delete Unit
            </button>
          </>
        }
      >
        {selectedUnit && (
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-red-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Delete Blood Unit</h3>
              <p className="text-gray-400 mb-4">
                Are you sure you want to delete blood unit{" "}
                <strong>{selectedUnit.unitId}</strong>? This action cannot be
                undone.
              </p>
              <div className="bg-dark-tertiary p-3 rounded-lg">
                <p className="text-sm text-gray-300">
                  <strong>Blood Type:</strong> {selectedUnit.bloodType}
                  <br />
                  <strong>Quantity:</strong> {selectedUnit.quantity} unit
                  {selectedUnit.quantity > 1 ? "s" : ""}
                  <br />
                  <strong>Status:</strong> {selectedUnit.status}
                </p>
              </div>
            </div>
          </div>
        )}
      </ActionModal>
    </DashboardLayout>
  );
}
