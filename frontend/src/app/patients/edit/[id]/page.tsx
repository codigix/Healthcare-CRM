"use client";

import { useState, useEffect } from "react";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { patientAPI } from "@/lib/api";

import { useAuthStore } from "@/lib/store";

type TabType = "personal" | "medical";

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      const role = user.role?.toLowerCase();
      const dept = user.department?.toLowerCase();
      if (role === "doctor" || role === "laboratory" || dept === "doctor" || dept === "laboratory") {
        router.replace("/patients");
      }
    }
  }, [user, router]);

  const userRole = user?.role?.toLowerCase();
  const userDept = user?.department?.toLowerCase();
  if (userRole === "doctor" || userRole === "laboratory" || userDept === "doctor" || userDept === "laboratory") {
    return null;
  }

  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    history: "",
    bloodGroup: "",
    status: "Active",
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await patientAPI.get(patientId);
        const patient = response.data;

        const dobDate = new Date(patient.dob);
        const formattedDob = dobDate.toISOString().split("T")[0];

        setFormData({
          name: patient.name || "",
          email: patient.email || "",
          phone: patient.phone || "",
          dob: formattedDob,
          gender: patient.gender || "",
          address: patient.address || "",
          history: patient.history || "",
          bloodGroup: patient.bloodGroup || "",
          status: patient.status || "Active",
        });
      } catch (err) {
        setError("Failed to load patient details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await patientAPI.update(patientId, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        address: formData.address,
        history: formData.history,
        bloodGroup: formData.bloodGroup || null,
        status: formData.status || "Active",
      });
      router.push("/patients");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update patient");
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { id: "personal" as TabType, label: "Personal Information" },
    { id: "medical" as TabType, label: "Medical Information" },
  ];

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-400">Loading patient details...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/patients"
            className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-2">Edit Patient</h1>
            <p className="text-gray-400">Update patient information.</p>
          </div>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Personal Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-emerald-400 mb-1">Personal Information</h3>
                <p className="text-gray-400 text-xs">Edit the patient's personal details.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-mdfont-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-mdfont-medium text-gray-300 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-mdfont-medium text-gray-300 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-mdfont-medium text-gray-300 mb-2">
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="input-field w-full"
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
                  <label className="block text-mdfont-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input-field w-full"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-mdfont-medium text-gray-300 mb-2">
                    Email
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
                  <label className="block text-mdfont-medium text-gray-300 mb-2">
                    Phone Number
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

              <div>
                <label className="block text-mdfont-medium text-gray-300 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="Enter address"
                  rows={3}
                />
              </div>
            </div>

            <hr className="border-dark-tertiary" />

            {/* Section 2: Medical Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-emerald-400 mb-1">Medical Background</h3>
                <p className="text-gray-400 text-xs">Edit the patient's medical history.</p>
              </div>

              <div>
                <label className="block text-mdfont-medium text-gray-300 mb-2">
                  Medical History / Conditions
                </label>
                <textarea
                  name="history"
                  value={formData.history}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="Enter medical history, allergies, chronic conditions, etc."
                  rows={5}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
              <Link href="/patients" className="btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
