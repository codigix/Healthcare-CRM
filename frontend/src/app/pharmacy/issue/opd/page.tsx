"use client";

import { useState, useEffect } from "react";
import { medicineAPI, patientAPI } from "@/lib/api";
import { Pill, ArrowLeft, RefreshCw, Loader, Search, CheckCircle2, User, FileText, ShoppingCart, Trash2, Plus, Receipt, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface CartItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  taxRate: number;
}

interface Medicine {
  id: string;
  name: string;
  category: string;
  initialQuantity: number;
  sellingPrice: number;
  purchasePrice: number;
  taxRate: number;
}

export default function OPDMedicineIssuePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedMedId, setSelectedMedId] = useState("");
  const [issueQty, setIssueQty] = useState("1");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await medicineAPI.list(1, 100);
      setMedicines(response.data.medicines || []);
    } catch (err) {
      console.error("Failed to load medicines:", err);
    }
  };

  const handleAddToCart = () => {
    setError("");
    if (!selectedMedId) {
      setError("Please select a medication to add to cart");
      return;
    }

    const qty = parseInt(issueQty);
    if (isNaN(qty) || qty <= 0) {
      setError("Please specify a valid quantity greater than zero");
      return;
    }

    const selectedMed = medicines.find((m) => m.id === selectedMedId);
    if (!selectedMed) return;

    if (selectedMed.initialQuantity < qty) {
      setError(`Insufficient stock. Only ${selectedMed.initialQuantity} units available.`);
      return;
    }

    // Check if already in cart
    const existing = cart.find((item) => item.id === selectedMedId);
    if (existing) {
      if (selectedMed.initialQuantity < existing.quantity + qty) {
        setError(`Insufficient stock for total requested quantity.`);
        return;
      }
      setCart(
        cart.map((item) =>
          item.id === selectedMedId ? { ...item, quantity: item.quantity + qty } : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: selectedMed.id,
          name: selectedMed.name,
          category: selectedMed.category,
          quantity: qty,
          purchasePrice: parseFloat(selectedMed.purchasePrice as any) || 0,
          sellingPrice: parseFloat(selectedMed.sellingPrice as any) || 0,
          taxRate: parseFloat(selectedMed.taxRate as any) || 0,
        },
      ]);
    }

    setSelectedMedId("");
    setIssueQty("1");
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleIssueBill = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!patientName) {
      setError("Please specify Patient Name");
      return;
    }

    if (cart.length === 0) {
      setError("Please add at least one medication to the cart");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Loop through cart items and reduce stock in database
      for (const item of cart) {
        const med = medicines.find((m) => m.id === item.id);
        if (med) {
          const remainingStock = Math.max(0, med.initialQuantity - item.quantity);
          await medicineAPI.update(item.id, {
            initialQuantity: remainingStock,
          });
        }
      }

      setSuccess(`✓ Successfully issued OPD medicine bill to ${patientName}! Receipt generated.`);
      setCart([]);
      setPatientName("");
      setPatientPhone("");
      fetchMedicines();
    } catch (err) {
      console.error("Failed to issue drugs:", err);
      setError("Dispensation failed. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  // Calculations helper
  const subtotal = cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
  const tax = cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity * (item.taxRate / 100), 0);
  const total = subtotal + tax;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/pharmacy"
            className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">OPD Medicine Issue</h1>
            <p className="text-gray-400">Dispense drugs, issue dosage instructions, and print instant outpatient pharmacy bills</p>
          </div>
        </div>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg p-4 flex items-center gap-3 animate-slideIn">
          <CheckCircle2 size={20} className="flex-shrink-0" />
          <p className="font-semibold">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg flex items-start gap-2">
          <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prescription form & cart assembly */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Details Form */}
          <div className="card space-y-4">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2 border-b border-white/5 pb-2">
              <User size={18} className="text-[#1abc9c]" /> Patient Demographics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Patient Name *</label>
                <input
                  type="text"
                  placeholder="Enter Outpatient Name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="input-field w-full text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Mobile Phone</label>
                <input
                  type="text"
                  placeholder="Enter phone number"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="input-field w-full text-sm"
                />
              </div>
            </div>
          </div>

          {/* Add Item form */}
          <div className="card space-y-4">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2 border-b border-white/5 pb-2">
              <Pill size={18} className="text-[#1abc9c]" /> Select Medications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Drug / Medicine Name</label>
                <select
                  value={selectedMedId}
                  onChange={(e) => setSelectedMedId(e.target.value)}
                  className="input-field w-full text-sm"
                >
                  <option value="">Select Medication from stock</option>
                  {medicines.map((m) => (
                    <option key={m.id} value={m.id} disabled={m.initialQuantity <= 0}>
                      {m.name} ({m.initialQuantity} available) - ₹{parseFloat(m.sellingPrice as any).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Quantity</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={issueQty}
                    onChange={(e) => setIssueQty(e.target.value)}
                    className="input-field w-full text-center text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="btn-primary py-2 px-3 flex items-center justify-center gap-1 text-sm flex-shrink-0"
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Active Cart */}
          <div className="card">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
              <ShoppingCart size={18} className="text-[#1abc9c]" /> Medicine Cart Checklist
            </h3>
            {cart.length === 0 ? (
              <div className="text-center py-12 text-gray-500 italic text-sm">Cart is currently empty. Add medicines above.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5 text-xs text-gray-500 uppercase">
                      <th className="text-left py-2 px-3">Item</th>
                      <th className="text-left py-2 px-3">Category</th>
                      <th className="text-center py-2 px-3">Price</th>
                      <th className="text-center py-2 px-3">Qty</th>
                      <th className="text-right py-2 px-3">Total</th>
                      <th className="text-center py-2 px-3">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.id} className="border-b border-white/5 text-sm hover:bg-white/5">
                        <td className="py-3 px-3 text-white font-semibold">{item.name}</td>
                        <td className="py-3 px-3 text-gray-400">{item.category}</td>
                        <td className="py-3 px-3 text-center text-gray-300">₹{item.sellingPrice.toFixed(2)}</td>
                        <td className="py-3 px-3 text-center text-white font-bold">{item.quantity}</td>
                        <td className="py-3 px-3 text-right text-[#1abc9c] font-bold">
                          ₹{(item.sellingPrice * item.quantity).toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Dispatch invoice summary */}
        <div className="lg:col-span-1">
          <form onSubmit={handleIssueBill} className="card space-y-6 sticky top-6 border border-[#1abc9c]/20">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 border-b border-white/5 pb-2">
              <Receipt size={20} className="text-[#1abc9c]" /> Invoice Dispatch
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center text-gray-400">
                <span>Cart Subtotal</span>
                <span className="font-semibold text-white">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>Tax Rate Calculation</span>
                <span className="font-semibold text-white">₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-white/5 pt-4 flex justify-between items-center text-md font-bold text-white">
                <span>Net Total Bill</span>
                <span className="text-xl text-[#1abc9c]">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <button
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full btn-primary py-3 flex items-center justify-center gap-1.5 font-bold shadow-lg shadow-[#1abc9c]/10"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileText size={18} /> Dispense & Print Invoice
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
