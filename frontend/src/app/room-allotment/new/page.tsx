"use client";

import { useState, useEffect, useRef } from "react";

import { ChevronLeft, Check, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { patientAPI, doctorAPI } from "@/lib/api";
import { Suspense } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function NewAllotmentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [prefillRecordId, setPrefillRecordId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    patientPhone: "",
    attendingDoctor: "",
    emergencyContact: "",
    roomId: "",
    specialRequirements: "",
    allotmentDate: "",
    expectedDischargeDate: "",
    paymentMethod: "",
    insuranceDetails: "",
    additionalNotes: "",
  });

  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Patient Search State
  const [patientSearchTerm, setPatientSearchTerm] = useState("");
  const [patientsList, setPatientsList] = useState<any[]>([]);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [searchingPatients, setSearchingPatients] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Doctor Search State
  const [doctorSearchTerm, setDoctorSearchTerm] = useState("");
  const [doctorsList, setDoctorsList] = useState<any[]>([]);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [searchingDoctors, setSearchingDoctors] = useState(false);
  const doctorDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAvailableRooms();
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPatientDropdown(false);
      }
      if (doctorDropdownRef.current && !doctorDropdownRef.current.contains(event.target as Node)) {
        setShowDoctorDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const prefillPatientId = searchParams.get("patientId");
    const prefillPatientName = searchParams.get("patientName");
    const prefillNotes = searchParams.get("notes");
    const recordIdParam = searchParams.get("recordId");

    if (prefillPatientName) {
      setFormData(prev => ({
        ...prev,
        patientId: prefillPatientId || "",
        patientName: prefillPatientName,
        additionalNotes: prefillNotes ? `Clinical Referral Instructions: ${prefillNotes}` : "",
        allotmentDate: new Date().toISOString().split('T')[0]
      }));
      setPatientSearchTerm(prefillPatientName);
    }
    if (recordIdParam) {
      setPrefillRecordId(recordIdParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const searchPatients = async () => {
      try {
        setSearchingPatients(true);
        const response = await patientAPI.list(1, 10, patientSearchTerm);
        setPatientsList(response.data.patients || []);
      } catch (err) {
        console.error("Failed to search patients:", err);
      } finally {
        setSearchingPatients(false);
      }
    };

    const timeoutId = setTimeout(searchPatients, 300);
    return () => clearTimeout(timeoutId);
  }, [patientSearchTerm]);

  const selectPatient = (patient: any) => {
    setFormData(prev => ({
      ...prev,
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone || prev.patientPhone
    }));
    setPatientSearchTerm(patient.name);
    setShowPatientDropdown(false);
  };

  useEffect(() => {
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
  }, [doctorSearchTerm]);

  const selectDoctor = (doctor: any) => {
    setFormData(prev => ({
      ...prev,
      attendingDoctor: doctor.name
    }));
    setDoctorSearchTerm(doctor.name);
    setShowDoctorDropdown(false);
  };

  const fetchAvailableRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/room-allotment/rooms`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch rooms");

      const data = await response.json();
      setRooms(data.rooms);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "roomId") {
      const room = rooms.find((r) => r.id === value);
      setSelectedRoom(room);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.patientId ||
      !formData.patientName ||
      !formData.roomId ||
      !formData.attendingDoctor ||
      !formData.allotmentDate
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`${API_URL}/room-allotment/allotments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          status: "Occupied",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create allotment");
      }

      // If pre-filled from an admission request, mark that request as completed
      if (prefillRecordId) {
        try {
          await fetch(`${API_URL}/records/${prefillRecordId}/status`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ status: "Completed" }),
          });
        } catch (statusErr) {
          console.error("Failed to update admission request status:", statusErr);
        }
      }

      alert("Room allotment created successfully!");
      router.push("/room-allotment/alloted");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create allotment");
    } finally {
      setSubmitting(false);
    }
  };

  const departments = [
    "Cardiology",
    "Orthopedics",
    "Neurology",
    "Pulmonology",
    "Gastroenterology",
    "Pediatrics",
  ];

  const roomTypes = ["Private", "Semi-Private", "General", "ICU"];

  const doctors = [
    "Dr. Emily Chun",
    "Dr. Michael Brown",
    "Dr. Lisa Wong",
    "Dr. James Wilson",
    "Dr. Sarah Miller",
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/room-allotment/alloted">
            <button className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors">
              <ChevronLeft size={24} className="text-gray-400" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Room Allotment Details
            </h1>
            <p className="text-gray-400 mt-1">
              Assign a room to a patient. Fill in all the required information
              below.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-4">
                  Patient Information
                </h2>

                <div className="space-y-4">
                  <div className="relative" ref={dropdownRef}>
                    <label className="block text-mdfont-medium text-gray-300 mb-2">
                      Search Patient
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={patientSearchTerm}
                        onChange={(e) => {
                          setPatientSearchTerm(e.target.value);
                          setShowPatientDropdown(true);
                          if (formData.patientId) {
                            setFormData(prev => ({ ...prev, patientId: "", patientName: "" }));
                          }
                        }}
                        onFocus={() => setShowPatientDropdown(true)}
                        placeholder="Search patient by name..."
                        className="w-full pl-10 pr-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    {showPatientDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {searchingPatients ? (
                          <div className="p-3 text-sm text-gray-400 text-center">Searching...</div>
                        ) : patientsList.length > 0 ? (
                          patientsList.map((patient: any) => (
                            <div
                              key={patient.id}
                              onClick={() => selectPatient(patient)}
                              className="px-4 py-3 hover:bg-dark-tertiary cursor-pointer border-b border-dark-tertiary last:border-0"
                            >
                              <div className="font-medium text-white">{patient.name}</div>
                              <div className="text-xs text-gray-400 mt-1">
                                ID: {patient.id} {patient.phone ? `• Phone: ${patient.phone}` : ""}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-sm text-gray-400 text-center">No patients found</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-mdfont-medium text-gray-300 mb-2">
                        Patient ID
                      </label>
                      <input
                        type="text"
                        name="patientId"
                        value={formData.patientId}
                        readOnly
                        className="w-full px-4 py-2 bg-dark-tertiary/50 border border-dark-tertiary rounded-lg text-gray-400 cursor-not-allowed"
                        placeholder="Auto-filled"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-mdfont-medium text-gray-300 mb-2">
                        Patient Name
                      </label>
                      <input
                        type="text"
                        name="patientName"
                        value={formData.patientName}
                        readOnly
                        className="w-full px-4 py-2 bg-dark-tertiary/50 border border-dark-tertiary rounded-lg text-gray-400 cursor-not-allowed"
                        placeholder="Auto-filled"
                      />
                    </div>
                  </div>

                  <div className="relative" ref={doctorDropdownRef}>
                    <label className="block text-mdfont-medium text-gray-300 mb-2">
                      Attending Doctor
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={doctorSearchTerm}
                        onChange={(e) => {
                          setDoctorSearchTerm(e.target.value);
                          setShowDoctorDropdown(true);
                          if (formData.attendingDoctor) {
                            setFormData(prev => ({ ...prev, attendingDoctor: "" }));
                          }
                        }}
                        onFocus={() => setShowDoctorDropdown(true)}
                        placeholder="Search doctor by name..."
                        className="w-full pl-10 pr-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    {showDoctorDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {searchingDoctors ? (
                          <div className="p-3 text-sm text-gray-400 text-center">Searching...</div>
                        ) : doctorsList.length > 0 ? (
                          doctorsList.map((doctor: any) => (
                            <div
                              key={doctor.id}
                              onClick={() => selectDoctor(doctor)}
                              className="px-4 py-3 hover:bg-dark-tertiary cursor-pointer border-b border-dark-tertiary last:border-0"
                            >
                              <div className="font-medium text-white">{doctor.name}</div>
                              {doctor.specialization && (
                                <div className="text-xs text-gray-400 mt-1">
                                  {doctor.specialization}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-sm text-gray-400 text-center">No doctors found</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-mdfont-medium text-gray-300 mb-2">
                      Patient Phone
                    </label>
                    <input
                      type="text"
                      name="patientPhone"
                      value={formData.patientPhone}
                      onChange={handleChange}
                      placeholder="Enter patient phone"
                      className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-mdfont-medium text-gray-300 mb-2">
                      Emergency Contact
                    </label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      placeholder="Enter emergency contact"
                      className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-4">
                  Room Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-mdfont-medium text-gray-300 mb-2">
                      Room Number
                    </label>
                    <select
                      name="roomId"
                      value={formData.roomId}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Select room</option>
                      {rooms
                        .filter((r) => r.status === "Available")
                        .map((room) => (
                          <option key={room.id} value={room.id}>
                            Room {room.roomNumber} - {room.roomType}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-mdfont-medium text-gray-300 mb-2">
                      Room Type
                    </label>
                    <input
                      type="text"
                      value={selectedRoom?.roomType || ""}
                      readOnly
                      className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-gray-400 cursor-not-allowed"
                      placeholder="Select a room to see type"
                    />
                  </div>

                  <div>
                    <label className="block text-mdfont-medium text-gray-300 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      value={selectedRoom?.department || ""}
                      readOnly
                      className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-gray-400 cursor-not-allowed"
                      placeholder="Select a room to see department"
                    />
                  </div>

                  <div>
                    <label className="block text-mdfont-medium text-gray-300 mb-2">
                      Special Requirements
                    </label>
                    <input
                      type="text"
                      name="specialRequirements"
                      value={formData.specialRequirements}
                      onChange={handleChange}
                      placeholder="Enter any special requirements"
                      className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Allotment Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-mdfont-medium text-gray-300 mb-2">
                    Allotment Date
                  </label>
                  <input
                    type="date"
                    name="allotmentDate"
                    value={formData.allotmentDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-mdfont-medium text-gray-300 mb-2">
                    Expected Discharge Date
                  </label>
                  <input
                    type="date"
                    name="expectedDischargeDate"
                    value={formData.expectedDischargeDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Billing Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-mdfont-medium text-gray-300 mb-2">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select payment method</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-mdfont-medium text-gray-300 mb-2">
                    Insurance Details (if applicable)
                  </label>
                  <input
                    type="text"
                    name="insuranceDetails"
                    value={formData.insuranceDetails}
                    onChange={handleChange}
                    placeholder="Enter insurance details"
                    className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Additional Notes
            </h2>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              placeholder="Enter any additional notes"
              rows={4}
              className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="flex gap-4 justify-end">
            <Link href="/room-allotment/alloted">
              <button
                type="button"
                className="px-6 py-2 bg-dark-tertiary hover:bg-dark-tertiary/70 text-white rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={submitting || loading}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <Check size={20} />
              {submitting ? "Creating..." : "Create Allotment"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default function NewAllotmentPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-gray-400">Loading Allotment Panel...</div>}>
      <NewAllotmentPageContent />
    </Suspense>
  );
}
