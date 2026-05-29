"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, AlertCircle, Loader } from "lucide-react";
import Link from "next/link";
import { inventoryAPI } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Supplier {
  id: string;
  name: string;
}

export default function AddInventoryItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [suppliersLoading, setSuppliersLoading] = useState(false);

  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    quantity: "0",
    unitType: "Piece",
    reorderLevel: "5",
    supplier: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    status: "Active",
    notes: "",
    purchasePrice: "0",
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setSuppliersLoading(true);
      const token = localStorage.getItem("token");
      const headers: any = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await fetch(`${API_URL}/suppliers?page=1&limit=100`, { headers });
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data.suppliers || []);
      }
    } catch (err) {
      console.error("Failed to load suppliers:", err);
    } finally {
      setSuppliersLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.itemName || !formData.category || !formData.unitType) {
        throw new Error("Please fill in all required fields (Item Name, Category, Unit Type)");
      }

      const payload = {
        name: formData.itemName,
        category: formData.category,
        description: formData.notes,
        unitType: formData.unitType,
        supplier: formData.supplier || "Direct Procurement",
        purchaseDate: formData.purchaseDate || null,
        expiryDate: formData.expiryDate || null,
        initialQuantity: parseInt(formData.quantity) || 0,
        reorderLevel: parseInt(formData.reorderLevel) || 5,
        maximumLevel: (parseInt(formData.quantity) || 0) * 2 || 100,
        purchasePrice: parseFloat(formData.purchasePrice) || 0,
        sellingPrice: 0,
        status: formData.status,
        notes: formData.notes,
      };

      await inventoryAPI.create(payload);
      router.push("/inventory");
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to save inventory item");
      console.error("Error saving inventory item:", err);
    } finally {
      setLoading(false);
    }
  };

  // Predefined dynamic quick category tags
  const quickCategories = [
    "Hospital Equipment",
    "Consumables",
    "Medical Supplies",
    "Operational Stock",
    "Assets",
    "Cleaning Supplies",
    "Office Supplies",
  ];

  return (
    <>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Link
            href="/inventory"
            className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Add Hospital Item</h1>
            <p className="text-gray-400">Register any dynamic clinical supply, durable asset, or hospital equipment</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
            <p className="text-red-500">{error}</p>
          </div>
        )}

        <div className="card relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-500"></div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Item Name */}
              <div className="md:col-span-2">
                <label className="block text-md font-semibold text-gray-300 mb-2">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  placeholder="e.g. Syringes 5ml, Wheelchair, ICU Bed"
                  className="input-field w-full"
                  required
                />
              </div>

              {/* Dynamic Item Category */}
              <div className="md:col-span-2">
                <label className="block text-md font-semibold text-gray-300 mb-2">
                  Item Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g. Consumables, Life Support, Furniture"
                  className="input-field w-full mb-3"
                  required
                />
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-gray-500 flex items-center mr-1">Quick Tags:</span>
                  {quickCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                      className="px-3 py-1 bg-dark-tertiary hover:bg-[#1abc9c]/20 hover:text-[#1abc9c] text-gray-400 text-xs rounded-full border border-white/5 transition-all"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-md font-semibold text-gray-300 mb-2">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="input-field w-full"
                  required
                />
              </div>

              {/* Unit Type */}
              <div>
                <label className="block text-md font-semibold text-gray-300 mb-2">
                  Unit Type (Measure) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="unitType"
                  value={formData.unitType}
                  onChange={handleInputChange}
                  placeholder="e.g. Piece, Box, Pack, Cylinder"
                  className="input-field w-full"
                  required
                />
              </div>

              {/* Min Stock Level (Reorder Level) */}
              <div>
                <label className="block text-md font-semibold text-gray-300 mb-2">
                  Min Stock Level <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="reorderLevel"
                  value={formData.reorderLevel}
                  onChange={handleInputChange}
                  placeholder="5"
                  min="0"
                  className="input-field w-full"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Warns when stock falls to or below this level</p>
              </div>

              {/* Supplier Selection */}
              <div>
                <label className="block text-md font-semibold text-gray-300 mb-2">
                  Supplier
                </label>
                <select
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  className="input-field w-full"
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((sup) => (
                    <option key={sup.id} value={sup.name}>
                      {sup.name}
                    </option>
                  ))}
                  {suppliers.length === 0 && (
                    <>
                      <option value="MedPlus Supplies">MedPlus Supplies</option>
                      <option value="MediEquip Solutions">MediEquip Solutions</option>
                      <option value="Global Pharma Ltd.">Global Pharma Ltd.</option>
                      <option value="Health Supply Co.">Health Supply Co.</option>
                    </>
                  )}
                </select>
              </div>

              {/* Purchase Date */}
              <div>
                <label className="block text-md font-semibold text-gray-300 mb-2">
                  Purchase Date
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleInputChange}
                  className="input-field w-full"
                />
              </div>

              {/* Expiry Date (Optional) */}
              <div>
                <label className="block text-md font-semibold text-gray-300 mb-2">
                  Expiry Date <span className="text-xs text-gray-500 font-normal">(Optional for non-expiring assets)</span>
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="input-field w-full"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-md font-semibold text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="input-field w-full"
                >
                  <option value="Active">Available (In Use / Active)</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Inactive">Inactive / Maintenance</option>
                </select>
              </div>

              {/* Pricing Section (Procurement cost tracking) */}
              <div>
                <label className="block text-md font-semibold text-gray-300 mb-2">
                  Purchase Price per Unit (₹)
                </label>
                <input
                  type="number"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleInputChange}
                  step="0.01"
                  className="input-field w-full"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-md font-semibold text-gray-300 mb-2">
                Operational Notes / Descriptions
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Enter room assignments, maintenance schedules, or description of the supply..."
                rows={4}
                className="input-field w-full resize-none"
              />
            </div>

            <div className="flex gap-3 pt-6 border-t border-white/5">
              <Link href="/inventory" className="btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Registering Item...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Register Item
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
