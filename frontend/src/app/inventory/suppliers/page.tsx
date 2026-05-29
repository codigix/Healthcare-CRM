"use client";

import { useState, useEffect } from "react";

import {
  Search,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Star,
  X,
  AlertCircle,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Supplier {
  id: string;
  name: string;
  category: string;
  contact: string;
  email: string;
  rating: number;
  status: "Active" | "Inactive";
}



export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errorSubmit, setErrorSubmit] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [topSupplier, setTopSupplier] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    contact: "",
    email: "",
    phone: "",
    location: "",
    description: "",
    rating: 3,
    status: "Active",
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoadingData(true);
      setErrorData("");
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_URL}/suppliers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch suppliers");
      }

      const data = await response.json();
      const supplierList = Array.isArray(data) ? data : data.data || [];
      
      setSuppliers(supplierList);
      setTotalSuppliers(supplierList.length);

      if (supplierList.length > 0) {
        const topRated = supplierList.reduce((prev, current) =>
          (prev.rating || 0) > (current.rating || 0) ? prev : current
        );
        setTopSupplier(topRated.name);
      }
    } catch (err: any) {
      setErrorData(err.message || "Failed to load suppliers");
      console.error("Error fetching suppliers:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorSubmit("");
    setLoadingSubmit(true);

    try {
      if (!formData.name || !formData.category || !formData.contact || !formData.email) {
        throw new Error("Please fill in all required fields (Name, Category, Contact Person, Email)");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

      const payloadData = {
        name: formData.name,
        category: formData.category,
        contact: formData.contact,
        email: formData.email,
        phone: formData.phone || null,
        location: formData.location || null,
        description: formData.description || null,
        rating: parseInt(String(formData.rating)) || 0,
        status: formData.status,
        contactPerson: formData.contact,
      };

      const response = await fetch(`${API_URL}/suppliers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payloadData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add supplier");
      }

      setShowAddModal(false);
      setFormData({
        name: "",
        category: "",
        contact: "",
        email: "",
        phone: "",
        location: "",
        description: "",
        rating: 3,
        status: "Active",
      });
      fetchSuppliers();
    } catch (err: any) {
      setErrorSubmit(err.message || "Failed to add supplier");
      console.error("Error adding supplier:", err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
      case "Inactive":
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || supplier.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      supplier.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "preferred" && supplier.rating >= 4) ||
      (activeTab === "equipment" && supplier.category === "Equipment") ||
      (activeTab === "supplies" && supplier.category === "Medical Supplies");
    return matchesSearch && matchesCategory && matchesStatus && matchesTab;
  });

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Suppliers</h1>
            <p className="text-gray-400">
              Manage your inventory suppliers and vendors
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowAddModal(true)} className="btn-primary">
              + Add Supplier
            </button>
            <button className="btn-secondary">Export</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Package className="text-blue-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalSuppliers}</div>
                <div className="text-mdtext-gray-400">Total Suppliers</div>
                <div className="text-xs text-blue-500">
                  {suppliers.filter(s => s.status === "Active").length} active
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <ShoppingCart className="text-emerald-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{suppliers.filter(s => s.category === "Medical Supplies").length}</div>
                <div className="text-mdtext-gray-400">Medical Supplies</div>
                <div className="text-xs text-emerald-500">
                  {suppliers.filter(s => s.category === "Equipment").length} equipment providers
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Star className="text-purple-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{topSupplier || "N/A"}</div>
                <div className="text-mdtext-gray-400">Top Supplier</div>
                <div className="text-xs text-purple-500">
                  Highest rated
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-orange-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{suppliers.length}</div>
                <div className="text-mdtext-gray-400">Total Providers</div>
                <div className="text-xs text-orange-500">
                  {suppliers.filter(s => s.rating >= 4).length} highly rated
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-dark-tertiary">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search suppliers..."
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
              All Suppliers
            </button>
            <button
              onClick={() => setActiveTab("preferred")}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === "preferred"
                  ? "text-emerald-500 border-b-2 border-emerald-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Preferred
            </button>
            <button
              onClick={() => setActiveTab("equipment")}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === "equipment"
                  ? "text-emerald-500 border-b-2 border-emerald-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Equipment
            </button>
            <button
              onClick={() => setActiveTab("supplies")}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === "supplies"
                  ? "text-emerald-500 border-b-2 border-emerald-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Medical Supplies
            </button>
          </div>

          <h2 className="text-xl font-semibold mb-4">Supplier Directory</h2>
          <p className="text-gray-400 text-mdmb-6">
            A comprehensive list of all your suppliers and vendors
          </p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-tertiary">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                    ID
                  </th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                    Name
                  </th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                    Category
                  </th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                    Contact
                  </th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
                    Rating
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
                {filteredSuppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="border-b border-dark-tertiary hover:bg-blue-500/10 transition-colors"
                  >
                    <td className="py-4 px-4 text-gray-300 font-medium">
                      {supplier.id}
                    </td>
                    <td className="py-4 px-4 text-white">{supplier.name}</td>
                    <td className="py-4 px-4 text-gray-300">
                      {supplier.category}
                    </td>
                    <td className="py-4 px-4 text-blue-400">
                      {supplier.contact}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < supplier.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-600"
                            }
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          supplier.status
                        )}`}
                      >
                        {supplier.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-gray-400 hover:text-white transition-colors">
                        •••
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>



        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-dark-secondary rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Add Supplier</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 hover:bg-dark-tertiary rounded transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {errorSubmit && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4 flex items-start gap-3">
                  <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
                  <p className="text-red-500 text-sm">{errorSubmit}</p>
                </div>
              )}

              <form onSubmit={handleAddSupplier} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Supplier Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Enter supplier name"
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="input-field w-full"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Medical Supplies">Medical Supplies</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Laboratory">Laboratory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleFormChange}
                    placeholder="Enter contact person name"
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="Enter email address"
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="Enter phone number"
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    placeholder="Enter location/city"
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Enter supplier description"
                    rows={3}
                    className="input-field w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rating
                    </label>
                    <select
                      name="rating"
                      value={formData.rating}
                      onChange={handleFormChange}
                      className="input-field w-full"
                    >
                      <option value="1">1 Star</option>
                      <option value="2">2 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="5">5 Stars</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      className="input-field w-full"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-dark-tertiary">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loadingSubmit}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingSubmit ? "Adding..." : "Add Supplier"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
