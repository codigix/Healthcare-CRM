"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/UI/Modal";
import { Loader } from "lucide-react";
import { medicineAPI } from "@/lib/api";

interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  initialQuantity: number;
  batchNumber?: string;
  expiryDate?: string | null;
  purchasePrice?: number;
  sellingPrice?: number;
  supplier?: string;
}

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine | null;
  onSuccess: () => void;
}

export default function AddStockModal({
  isOpen,
  onClose,
  medicine,
  onSuccess,
}: AddStockModalProps) {
  const [addedQuantity, setAddedQuantity] = useState("100");
  const [batchNumber, setBatchNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [supplier, setSupplier] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Search/Dropdown States
  const [medicinesList, setMedicinesList] = useState<Medicine[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch medicines if medicine prop is null (opened from list header)
  useEffect(() => {
    if (isOpen && !medicine) {
      fetchMedicines();
    }
  }, [isOpen, medicine]);

  const fetchMedicines = async () => {
    try {
      const response = await medicineAPI.list(1, 200);
      setMedicinesList(response.data.medicines || []);
    } catch (err) {
      console.error("Failed to load medicines list for selection:", err);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".searchable-medicine-select")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // Sync selected medicine when medicine prop changes or selection happens
  useEffect(() => {
    if (medicine) {
      setSelectedMedicine(medicine);
      setSearchTerm(medicine.name);
    } else {
      setSelectedMedicine(null);
      setSearchTerm("");
    }
  }, [medicine, isOpen]);

  // Pre-populate form fields when active medicine changes
  useEffect(() => {
    const activeMed = medicine || selectedMedicine;
    if (activeMed) {
      setBatchNumber(activeMed.batchNumber || "");
      
      if (activeMed.expiryDate) {
        const dateObj = new Date(activeMed.expiryDate);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        setExpiryDate(`${yyyy}-${mm}-${dd}`);
      } else {
        setExpiryDate("");
      }

      setPurchasePrice(activeMed.purchasePrice ? String(parseFloat(String(activeMed.purchasePrice))) : "");
      setSellingPrice(activeMed.sellingPrice ? String(parseFloat(String(activeMed.sellingPrice))) : "");
      setSupplier(activeMed.supplier || "");
      setAddedQuantity("100");
      setNotes("");
      setError("");
    } else {
      setBatchNumber("");
      setExpiryDate("");
      setPurchasePrice("");
      setSellingPrice("");
      setSupplier("");
      setAddedQuantity("100");
      setNotes("");
      setError("");
    }
  }, [medicine, selectedMedicine, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeMedicine = medicine || selectedMedicine;
    if (!activeMedicine) {
      setError("Please select a medicine.");
      return;
    }

    const qty = parseInt(addedQuantity);
    if (isNaN(qty) || qty <= 0) {
      setError("Please enter a valid positive quantity.");
      return;
    }

    if (!batchNumber.trim()) {
      setError("Batch Number is required.");
      return;
    }

    if (!expiryDate) {
      setError("Expiry Date is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload: any = {
        addedQuantity: qty,
        notes: notes.trim() || `Direct pharmacy stock intake (+${qty} units)`,
      };

      if (batchNumber.trim()) payload.batchNumber = batchNumber.trim();
      if (expiryDate) payload.expiryDate = expiryDate;
      if (purchasePrice) payload.purchasePrice = parseFloat(purchasePrice);
      if (sellingPrice) payload.sellingPrice = parseFloat(sellingPrice);
      if (supplier.trim()) payload.supplier = supplier.trim();

      await medicineAPI.addStock(activeMedicine.id, payload);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Failed to add stock:", err);
      setError(err.response?.data?.error || "Failed to update stock. Check connection.");
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = medicinesList.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.genericName && m.genericName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeMedicine = medicine || selectedMedicine;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Pharmacy Stock"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
        {/* Medicine Selection Searchable Dropdown */}
        {!medicine ? (
          <div className="relative searchable-medicine-select">
            <label className="block text-xs font-bold text-gray-300 mb-1">
              Select Medicine <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search and select a medicine..."
                value={selectedMedicine ? selectedMedicine.name : searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (selectedMedicine) {
                    setSelectedMedicine(null);
                  }
                  setDropdownOpen(true);
                }}
                onFocus={() => setDropdownOpen(true)}
                className="input-field w-full text-sm font-sans"
              />
              {selectedMedicine && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMedicine(null);
                    setSearchTerm("");
                    setDropdownOpen(true);
                  }}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-white text-xs"
                >
                  Clear
                </button>
              )}
            </div>
            
            {/* Dropdown list */}
            {dropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-[#1a202c] border border-dark-tertiary rounded-lg shadow-xl max-h-48 overflow-y-auto divide-y divide-dark-tertiary/40">
                {filteredMedicines.length === 0 ? (
                  <div className="p-3 text-xs text-gray-500 italic">No matching medicines found</div>
                ) : (
                  filteredMedicines.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedMedicine(m);
                        setSearchTerm(m.name);
                        setDropdownOpen(false);
                      }}
                      className="p-2.5 hover:bg-emerald-500/10 cursor-pointer transition-colors"
                    >
                      <div className="font-bold text-white text-xs">{m.name}</div>
                      {m.genericName && (
                        <div className="text-gray-400 text-[10px] italic">{m.genericName}</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Medicine Name</p>
            <p className="text-sm text-white font-bold mt-0.5">{medicine.name}</p>
          </div>
        )}

        {/* Render rest of form only if a medicine is active */}
        {activeMedicine ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Current Stock</p>
                <p className="text-sm text-emerald-400 font-bold mt-0.5">{activeMedicine.initialQuantity} units</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Stock Quantity to Add <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={addedQuantity}
                  onChange={(e) => setAddedQuantity(e.target.value)}
                  className="input-field w-full text-sm font-sans"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Batch Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. BAT-2026-001"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="input-field w-full text-sm font-sans"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="input-field w-full text-sm font-sans"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Purchase Price (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  className="input-field w-full text-sm font-sans"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Selling Price (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className="input-field w-full text-sm font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Supplier
              </label>
              <input
                type="text"
                placeholder="e.g. MediCare Distributors"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="input-field w-full text-sm font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Transaction Notes
              </label>
              <textarea
                placeholder="Provide reason or context (e.g. Weekly replenishment)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full text-sm bg-dark-tertiary border border-dark-tertiary rounded-lg p-3 outline-none text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-sans"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs px-3 py-2 rounded-lg font-sans">
                {error}
              </div>
            )}

            <div className="flex gap-3 justify-end pt-3 border-t border-dark-tertiary/20 font-sans">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-dark-tertiary hover:bg-dark-tertiary/70 text-white rounded-lg transition-colors font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 text-white rounded-lg transition-colors font-bold text-xs flex items-center gap-1 shadow shadow-emerald-600/25"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={14} />
                    Saving...
                  </>
                ) : (
                  "Update Stock"
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-6 text-gray-500 italic font-sans">
            Please search and select a medicine to add stock.
          </div>
        )}
      </form>
    </Modal>
  );
}
