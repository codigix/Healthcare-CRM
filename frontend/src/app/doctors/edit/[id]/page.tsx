"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { doctorAPI, departmentAPI } from "@/lib/api";

export default function EditDoctorPage() {
  const router = useRouter();
  const params = useParams();
  const doctorId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    schedule: "",
    departmentId: "",
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await departmentAPI.list(1, 100);
        setDepartments(response.data.departments || []);
      } catch (err) {
        console.error("Failed to fetch departments", err);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await doctorAPI.get(doctorId);
        const doctor = response.data;

        setFormData({
          name: doctor.name || "",
          email: doctor.email || "",
          phone: doctor.phone || "",
          specialization: doctor.specialization || "",
          experience: doctor.experience?.toString() || "",
          schedule: doctor.schedule || "",
          departmentId: doctor.departmentId || "",
        });
      } catch (err) {
        setError("Failed to load doctor details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctor();
    }
  }, [doctorId]);

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
      await doctorAPI.update(doctorId, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialization: formData.specialization,
        experience: parseInt(formData.experience) || 0,
        schedule: formData.schedule,
        departmentId: formData.departmentId,
      });
      router.push("/doctors");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update doctor");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-400">Loading doctor details...</p>
        </div>
      </>
    );
  }

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
            <h1 className="text-3xl font-bold mb-2">Edit Doctor</h1>
            <p className="text-gray-400">Update doctor information.</p>
          </div>
        </div>

        <div className="card">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Personal & Contact Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white border-b border-dark-tertiary pb-3">
                  Personal & Contact Information
                </h3>
                <p className="text-sm text-gray-400 mt-2">
                  Edit the doctor's personal credentials and contact settings.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-md font-medium text-gray-300 mb-2">
                    Full Name *
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
                  <label className="block text-md font-medium text-gray-300 mb-2">
                    Email Address *
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

            {/* Section 2: Professional Details */}
            <div className="space-y-6 pt-4">
              <div>
                <h3 className="text-lg font-bold text-white border-b border-dark-tertiary pb-3">
                  Professional Practice Details
                </h3>
                <p className="text-sm text-gray-400 mt-2">
                  Edit doctor specialization, years of experience, and clinical department assignment.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-md font-medium text-gray-300 mb-2">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter specialization (e.g., Cardiology)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-md font-medium text-gray-300 mb-2">
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter years of experience"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-md font-medium text-gray-300 mb-2">
                    Clinical Department *
                  </label>
                  <select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                  >
                    <option value="">Select clinical department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
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
                  placeholder="Enter schedule (e.g., Monday-Friday, 9:00 AM - 5:00 PM)"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-dark-tertiary">
              <Link href="/doctors" className="btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
