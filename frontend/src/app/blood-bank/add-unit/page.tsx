"use client";

import { useState, useEffect } from "react";

import { Calendar } from "lucide-react";
import Link from "next/link";
import { bloodBankAPI } from "@/lib/api";

export default function AddBloodUnitPage() {
  const [formData, setFormData] = useState({
    anonymousDonor: false,
    donorId: "",
    donorName: "",
    bloodGroup: "",
    quantity: "1",
    collectionDate: "",
    expiryDate: "",
    sourceType: "",
    collectionLocation: "",
    additionalNotes: "",
  });

  const [donorsList, setDonorsList] = useState<any[]>([]);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const response = await bloodBankAPI.getDonors();
      if (response.data.success) {
        setDonorsList(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching donors:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === "anonymousDonor" && checked) {
        setFormData((prev) => ({
          ...prev,
          anonymousDonor: true,
          donorId: "",
          donorName: "",
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDonorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      setFormData((prev) => ({
        ...prev,
        donorId: "",
        donorName: "",
        bloodGroup: "",
      }));
      return;
    }

    const donor = donorsList.find((d) => d.id === selectedId);
    if (donor) {
      setFormData((prev) => ({
        ...prev,
        donorId: donor.id,
        donorName: donor.name,
        bloodGroup: donor.bloodType,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        bloodType: formData.bloodGroup,
        quantity: parseInt(formData.quantity),
        donorId: formData.anonymousDonor ? null : formData.donorId || null,
        collectionDate: formData.collectionDate,
        expiryDate: formData.expiryDate,
        status: "available",
        notes: formData.additionalNotes,
      };

      const response = await bloodBankAPI.createStock(submitData);

      if (response.data.success) {
        alert("Blood unit added successfully!");
        setFormData({
          anonymousDonor: false,
          donorId: "",
          donorName: "",
          bloodGroup: "",
          quantity: "1",
          collectionDate: "",
          expiryDate: "",
          sourceType: "",
          collectionLocation: "",
          additionalNotes: "",
        });
        window.location.href = "/blood-bank/stock";
      } else {
        alert("Error: " + (response.data.error || "Failed to add blood unit"));
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error adding blood unit");
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Add Blood Unit</h1>
            <p className="text-gray-400">
              Add a new blood unit to the blood bank inventory
            </p>
          </div>
          <Link href="/blood-bank/stock">
            <button className="btn-secondary">Cancel</button>
          </Link>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Blood Unit Information</h2>
          <p className="text-gray-400 text-mdmb-6">
            Enter the details of the new blood unit to be added to the
            inventory.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="anonymousDonor"
                  id="anonymousDonor"
                  checked={formData.anonymousDonor}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-emerald-500 bg-dark-tertiary border-gray-600 rounded focus:ring-emerald-500"
                />
                <label
                  htmlFor="anonymousDonor"
                  className="text-mdfont-medium cursor-pointer"
                >
                  Anonymous Donor
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-mdfont-medium mb-2">
                    Select Registered Donor
                  </label>
                  <select
                    name="donorId"
                    value={formData.donorId}
                    onChange={handleDonorChange}
                    className="input-field w-full"
                    disabled={formData.anonymousDonor}
                  >
                    <option value="">Select a donor</option>
                    {donorsList.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.bloodType}) - ID: {d.id}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    Choose from registered blood donors.
                  </p>
                </div>

                <div>
                  <label className="block text-mdfont-medium mb-2">
                    Donor Name
                  </label>
                  <input
                    type="text"
                    name="donorName"
                    value={formData.donorName}
                    className="input-field w-full bg-dark-tertiary/30 cursor-not-allowed text-gray-400"
                    placeholder="Donor name will fill automatically"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-mdfont-medium mb-2">
                    Blood Group <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    required
                  >
                    <option value="">Select blood group</option>
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
                  <label className="block text-mdfont-medium mb-2">
                    Quantity (units) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Enter quantity"
                    min="1"
                    className="input-field w-full"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Standard unit is approximately 450ml of whole blood.
                  </p>
                </div>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-mdfont-medium mb-2">
                    Collection Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="collectionDate"
                      value={formData.collectionDate}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      required
                    />
                    <Calendar
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={18}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-mdfont-medium mb-2">
                    Expiry Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="input-field w-full"
                    />
                    <Calendar
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={18}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Typically 35-42 days after collection for whole blood.
                  </p>
                </div>

                <div>
                  <label className="block text-mdfont-medium mb-2">
                    Source Type
                  </label>
                  <select
                    name="sourceType"
                    value={formData.sourceType}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  >
                    <option value="">Select source type</option>
                    <option value="Voluntary">Voluntary Donation</option>
                    <option value="Replacement">Replacement Donation</option>
                    <option value="Autologous">Autologous Donation</option>
                    <option value="Directed">Directed Donation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-mdfont-medium mb-2">
                    Collection Location
                  </label>
                  <input
                    type="text"
                    name="collectionLocation"
                    value={formData.collectionLocation}
                    onChange={handleInputChange}
                    placeholder="Enter collection location"
                    className="input-field w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-mdfont-medium mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  placeholder="Enter any additional information or special instructions"
                  rows={4}
                  className="input-field w-full resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Link href="/blood-bank/stock">
                <button type="button" className="btn-secondary">
                  Cancel
                </button>
              </Link>
              <button type="submit" className="btn-primary">
                Add Blood Unit
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-mdtext-blue-400">
              Fields marked with <span className="text-red-500">*</span> are
              required. Make sure to fill all required fields before submitting.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
