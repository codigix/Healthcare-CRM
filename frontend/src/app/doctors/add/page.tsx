"use client";

import { useState } from "react";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doctorAPI } from "@/lib/api";

type TabType = "personal" | "professional";

export default function AddDoctorPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    primarySpecialization: "",
    yearsOfExperience: "",
    schedule: "Monday-Friday, 9:00 AM - 5:00 PM",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.primarySpecialization || !formData.yearsOfExperience) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const doctorData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        specialization: formData.primarySpecialization,
        experience: parseInt(formData.yearsOfExperience) || 0,
        schedule: formData.schedule,
      };

      const response = await doctorAPI.create(doctorData);
      if (response.status === 201 || response.data) {
        router.push("/doctors");
      }
    } catch (err: any) {
      console.error('Error creating doctor:', err);
      setError(err.response?.data?.error || err.message || "Failed to add doctor");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "personal" as TabType, label: "Personal Information" },
    { id: "professional" as TabType, label: "Professional Details" },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/doctors"
            className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-2">Add Doctor</h1>
            <p className="text-gray-400">Add a new doctor to your clinic.</p>
          </div>
        </div>

        <div className="card">
          <div className="border-b border-dark-tertiary mb-6">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {activeTab === "personal" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Personal Information
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Enter the doctor's basic information.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-md font-medium text-gray-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter first name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-md font-medium text-gray-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter last name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-md font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-md font-medium text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "professional" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Professional Details
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Enter the doctor's professional information.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-md font-medium text-gray-300 mb-2">
                      Specialization *
                    </label>
                    <select
                      name="primarySpecialization"
                      value={formData.primarySpecialization}
                      onChange={handleChange}
                      className="input-field w-full"
                      required
                    >
                      <option value="">Select specialization</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Psychiatry">Psychiatry</option>
                      <option value="Ophthalmology">Ophthalmology</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-md font-medium text-gray-300 mb-2">
                      Years of Experience *
                    </label>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Enter years of experience"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-md font-medium text-gray-300 mb-2">
                    Doctor Schedule
                  </label>
                  <textarea
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter schedule (e.g., Monday-Friday, 9:00 AM - 5:00 PM; Saturday, 10:00 AM - 2:00 PM)"
                    rows={3}
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Enter the doctor's availability and working hours
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-dark-tertiary">
              <Link href="/doctors" className="btn-secondary">
                Cancel
              </Link>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? "Saving..." : "Save Doctor"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
