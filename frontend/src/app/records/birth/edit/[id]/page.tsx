"use client";

import { useState, useEffect, useRef } from "react";

import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { recordsAPI, doctorAPI } from "@/lib/api";

export default function EditBirthRecordPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  // Doctor Search State
  const [doctorSearchTerm, setDoctorSearchTerm] = useState("");
  const [doctorsList, setDoctorsList] = useState<any[]>([]);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [searchingDoctors, setSearchingDoctors] = useState(false);
  const doctorDropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    childName: "",
    dateOfBirth: "",
    parentFirstName: "",
    parentLastName: "",
    attendingDoctor: "",
    status: "Pending",
    weight: "",
    gender: "",
    hospitalName: "",
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        doctorDropdownRef.current &&
        !doctorDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDoctorDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (doctorSearchTerm === formData.attendingDoctor) {
      return;
    }
    const searchDoctors = async () => {
      try {
        setSearchingDoctors(true);
        const response = await doctorAPI.list(1, 10, doctorSearchTerm);
        setDoctorsList(response.data.doctors || []);
      } catch (err) {
        console.error("Failed to search doctors:", err);
      } finally {
        setSearchingDoctors(false);
      }
    };

    const timeoutId = setTimeout(searchDoctors, 300);
    return () => clearTimeout(timeoutId);
  }, [doctorSearchTerm, formData.attendingDoctor]);

  const selectDoctor = (doctor: any) => {
    setFormData((prev) => ({
      ...prev,
      attendingDoctor: doctor.name,
    }));
    setDoctorSearchTerm(doctor.name);
    setShowDoctorDropdown(false);
  };

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setFetching(true);
        const response = await recordsAPI.get(id);
        const record = response.data;

        const details =
          typeof record.details === "string"
            ? JSON.parse(record.details)
            : record.details;
        const [parentFirstName, parentLastName] = (details.parents || "")
          .split(" and ")
          .map((p: string) => p.trim());

        const doctorName = details.attendingDoctor || "";
        setFormData({
          childName: details.childName || "",
          dateOfBirth: record.date?.split("T")[0] || "",
          parentFirstName: parentFirstName || "",
          parentLastName: parentLastName || "",
          attendingDoctor: doctorName,
          status: record.status || "Pending",
          weight: details.weight?.replace(" kg", "") || "",
          gender: details.gender || "",
          hospitalName: details.hospitalName || "",
        });
        setDoctorSearchTerm(doctorName);
      } catch (err: any) {
        setError("Failed to load record");
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchRecord();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const recordData = {
        type: "birth",
        patientName: formData.childName,
        date: formData.dateOfBirth,
        details: JSON.stringify({
          childName: formData.childName,
          dateOfBirth: formData.dateOfBirth,
          parents: `${formData.parentFirstName} and ${formData.parentLastName}`,
          attendingDoctor: formData.attendingDoctor || doctorSearchTerm,
          weight: `${formData.weight} kg`,
          gender: formData.gender,
          hospitalName: formData.hospitalName,
        }),
        status: formData.status,
      };

      await recordsAPI.update(id, recordData);
      router.push("/records/birth");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update birth record");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-400">Loading record...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/records/birth"
            className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-2">Edit Birth Record</h1>
            <p className="text-gray-400">
              Update the birth record information.
            </p>
          </div>
        </div>

        <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-4">Child Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-mdfont-medium text-gray-300 mb-2">
                    Child Name *
                  </label>
                  <input
                    type="text"
                    name="childName"
                    value={formData.childName}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter child name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-mdfont-medium text-gray-300 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-mdfont-medium text-gray-300 mb-2">
                    Gender *
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
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter weight"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">
                Parents Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-mdfont-medium text-gray-300 mb-2">
                    Parent First Name *
                  </label>
                  <input
                    type="text"
                    name="parentFirstName"
                    value={formData.parentFirstName}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter first parent name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-mdfont-medium text-gray-300 mb-2">
                    Parent Last Name *
                  </label>
                  <input
                    type="text"
                    name="parentLastName"
                    value={formData.parentLastName}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter second parent name"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">
                Medical Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative" ref={doctorDropdownRef}>
                    <label className="block text-mdfont-medium text-gray-300 mb-2">
                      Attending Doctor *
                    </label>
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        value={doctorSearchTerm}
                        onChange={(e) => {
                          setDoctorSearchTerm(e.target.value);
                          setShowDoctorDropdown(true);
                          if (formData.attendingDoctor) {
                            setFormData((prev) => ({
                              ...prev,
                              attendingDoctor: "",
                            }));
                          }
                        }}
                        onFocus={() => setShowDoctorDropdown(true)}
                        placeholder="Search doctor by name..."
                        className="w-full pl-10 pr-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                    {showDoctorDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {searchingDoctors ? (
                          <div className="p-3 text-sm text-gray-400 text-center">
                            Searching...
                          </div>
                        ) : doctorsList.length > 0 ? (
                          doctorsList.map((doctor: any) => (
                            <div
                              key={doctor.id}
                              onClick={() => selectDoctor(doctor)}
                              className="px-4 py-3 hover:bg-dark-tertiary cursor-pointer border-b border-dark-tertiary last:border-0"
                            >
                              <div className="font-medium text-white">
                                {doctor.name}
                              </div>
                              {doctor.specialization && (
                                <div className="text-xs text-gray-400 mt-1">
                                  {doctor.specialization}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-sm text-gray-400 text-center">
                            No doctors found
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                <div>
                  <label className="block text-mdfont-medium text-gray-300 mb-2">
                    Hospital Name *
                  </label>
                  <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Enter hospital name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-mdfont-medium text-gray-300 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-dark-tertiary">
              <Link href="/records/birth">
                <button
                  type="button"
                  className="px-6 py-2 bg-dark-tertiary hover:bg-dark-tertiary/80 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white rounded-lg transition-colors font-medium"
              >
                {loading ? "Updating..." : "Update Record"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
