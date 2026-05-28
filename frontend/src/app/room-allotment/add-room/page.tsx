"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Check, LayoutGrid, Bed, HeartPulse, FileText, CheckSquare, ShieldCheck, HelpCircle, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { departmentAPI } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AddNewRoomPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "", // Represents Ward Type / Room Category
    department: "",
    floor: "",
    capacity: "",
    pricePerDay: "",
    status: "Available",
    description: "",
    television: false,
    attachedBathroom: false,
    airConditioning: false,
    wheelchairAccessible: false,
    wifi: false,
    oxygenSupply: false,
    telephone: false,
    nursecallButton: false,
    ventilator: false,
    patientMonitor: false,
    additionalNotes: "",
  });

  // Unique status per bed state for starting bed statuses
  const [bedStatuses, setBedStatuses] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Searchable Department selector states
  const [searchDept, setSearchDept] = useState("");
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const deptDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deptDropdownRef.current && !deptDropdownRef.current.contains(event.target as Node)) {
        setShowDeptDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    const checkedInput = e.target as HTMLInputElement;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: isCheckbox ? checkedInput.checked : value,
      };

      // Automatically sync Room Category with Ward Type if updated
      if (name === "wardType") {
        updated.roomType = value;
      }

      return updated;
    });
  };

  const handleBedStatusChange = (bedId: string, status: string) => {
    setBedStatuses(prev => ({
      ...prev,
      [bedId]: status
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.roomNumber ||
      !formData.roomType ||
      !formData.department ||
      !formData.floor ||
      !formData.capacity ||
      !formData.pricePerDay
    ) {
      alert("Please fill in all required fields in Sections 1 and 2.");
      return;
    }

    try {
      setSubmitting(true);

      // We send the form payload to the backend
      const payload = {
        ...formData,
        // We can pass starting bed statuses if the backend supports individual bed configurations in future,
        // or let it derive from room capacity.
        bedStatuses,
      };

      const response = await fetch(`${API_URL}/room-allotment/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to create room");
      }

      alert("Clinical Room & Bed structure created successfully!");
      router.push("/room-allotment/by-department");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create room");
    } finally {
      setSubmitting(false);
    }
  };

  const [activeDepartments, setActiveDepartments] = useState<string[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await departmentAPI.list(1, 100);
        const activeDepts = (res.data.departments || [])
          .filter((d: any) => d.status === "Active")
          .map((d: any) => d.name);
        
        if (activeDepts.length > 0) {
          setActiveDepartments(activeDepts);
        }
      } catch (err) {
        console.error("Failed to load departments from API:", err);
      }
    };
    fetchDepartments();
  }, []);

  const fallbackDepartments = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "ICU",
    "Emergency",
    "General Medicine",
  ];

  // Merge case-insensitively: prioritize API active departments, but include fallbacks if missing
  const mergedDepartments = [...activeDepartments];
  fallbackDepartments.forEach(fallback => {
    const exists = activeDepartments.some(d => d.toLowerCase() === fallback.toLowerCase());
    if (!exists) {
      mergedDepartments.push(fallback);
    }
  });

  const departments = mergedDepartments;

  const formatDeptName = (name: string) => {
    return name || "";
  };

  const wardTypes = [
    "General Ward",
    "Semi Private",
    "Private Room",
    "Deluxe Room",
    "ICU",
    "Isolation Room",
    "Emergency Observation",
  ];

  const floors = ["Ground", "First", "Second", "Third", "Fourth", "Fifth"];
  const roomStatuses = ["Available", "Occupied", "Reserved", "Cleaning", "Maintenance", "Isolation Active"];
  const singleBedStatuses = ["Available", "Blocked", "Under Cleaning"];

  const alphabeticalBeds = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const capacityNum = parseInt(formData.capacity) || 0;
  const roomNum = formData.roomNumber || "";
  
  const generatedBeds = [];
  for (let i = 0; i < capacityNum; i++) {
    const bedId = roomNum ? `${roomNum}-${alphabeticalBeds[i] || i + 1}` : `Bed ${alphabeticalBeds[i] || i + 1}`;
    generatedBeds.push({
      id: bedId,
      label: capacityNum === 1 ? `${roomNum || "Room"}-Single Bed` : bedId,
    });
  }

  return (
    <>
      <div className="space-y-6 pb-20">
        
        {/* TOP BAR BAR */}
        <div className="flex items-center gap-4 border-b border-dark-tertiary/40 pb-5">
          <Link href="/room-allotment/by-department">
            <button className="p-2.5 hover:bg-dark-tertiary rounded-xl transition-colors border border-dark-tertiary bg-dark-tertiary/20">
              <ChevronLeft size={18} className="text-gray-400" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white font-outfit">Add Clinical Room & Ward</h1>
            <p className="text-gray-400 mt-1">Configure a multi-specialty ward structure with automatic bed generation</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
          
          {/* SECTION 1 & SECTION 2 GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* SECTION 1 — Department Mapping */}
            <div className="bg-dark-secondary border border-dark-tertiary rounded-xl p-6 shadow-md space-y-4">
              <div className="flex items-center gap-2 border-b border-dark-tertiary/60 pb-3">
                <LayoutGrid className="text-emerald-400" size={16} />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">SECTION 1 — Department Mapping</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Department *
                  </label>
                  <div className="relative" ref={deptDropdownRef}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search clinical department..."
                        value={searchDept}
                        onChange={(e) => {
                          setSearchDept(e.target.value);
                          setShowDeptDropdown(true);
                          setFormData(prev => ({ ...prev, department: "" }));
                        }}
                        onFocus={() => setShowDeptDropdown(true)}
                        className="w-full pl-9 pr-4 py-2 bg-dark-tertiary border border-dark-tertiary/75 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 h-[38px] font-semibold"
                      />
                    </div>
                    {showDeptDropdown && (
                      <div className="absolute z-50 w-full mt-1 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-xl max-h-60 overflow-y-auto">
                        {departments
                          .filter((d) => formatDeptName(d).toLowerCase().includes(searchDept.toLowerCase()))
                          .map((dept) => (
                            <div
                              key={dept}
                              onClick={() => {
                                setFormData(prev => ({ ...prev, department: dept }));
                                setSearchDept(formatDeptName(dept));
                                setShowDeptDropdown(false);
                              }}
                              className="px-4 py-2.5 hover:bg-dark-tertiary cursor-pointer border-b border-dark-tertiary/40 last:border-0 text-xs text-white font-semibold flex items-center justify-between"
                            >
                              <span>{formatDeptName(dept)}</span>
                            </div>
                          ))}
                        {departments.filter((d) => formatDeptName(d).toLowerCase().includes(searchDept.toLowerCase())).length === 0 && (
                          <div className="p-3 text-xs text-gray-400 text-center">No matching departments</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Ward Type *
                  </label>
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-dark-tertiary border border-dark-tertiary/75 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 h-[38px] font-semibold"
                  >
                    <option value="">Select Ward / Room Category</option>
                    {wardTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Floor *
                  </label>
                  <select
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-dark-tertiary border border-dark-tertiary/75 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 h-[38px] font-semibold"
                  >
                    <option value="">Select Floor Level</option>
                    {floors.map((floor) => (
                      <option key={floor} value={floor}>
                        {floor} Floor
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2 — Room Information */}
            <div className="bg-dark-secondary border border-dark-tertiary rounded-xl p-6 shadow-md space-y-4">
              <div className="flex items-center gap-2 border-b border-dark-tertiary/60 pb-3">
                <LayoutGrid className="text-emerald-400" size={16} />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">SECTION 2 — Room Information</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Room Number *
                    </label>
                    <input
                      type="text"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleChange}
                      placeholder="e.g. 101 or ICU-1"
                      className="w-full px-3 py-2 bg-dark-tertiary border border-dark-tertiary/75 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 h-[38px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Room Category *
                    </label>
                    <select
                      name="roomType"
                      value={formData.roomType}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-dark-tertiary border border-dark-tertiary/75 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 h-[38px] font-semibold"
                    >
                      <option value="">Select Category</option>
                      {wardTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Room Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-dark-tertiary border border-dark-tertiary/75 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 h-[38px] font-semibold"
                    >
                      {roomStatuses.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Daily Charges ($) *
                    </label>
                    <input
                      type="number"
                      name="pricePerDay"
                      value={formData.pricePerDay}
                      onChange={handleChange}
                      placeholder="Charges per day"
                      className="w-full px-3 py-2 bg-dark-tertiary border border-dark-tertiary/75 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 h-[38px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Capacity (Beds) *
                  </label>
                  <select
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-dark-tertiary border border-dark-tertiary/75 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 h-[38px] font-semibold"
                  >
                    <option value="">Select Bed Capacity</option>
                    <option value="1">1 Bed (Single Room)</option>
                    <option value="2">2 Beds (Semi-Private)</option>
                    <option value="3">3 Beds (Multi-Bed Room)</option>
                    <option value="4">4 Beds (Ward Room)</option>
                    <option value="5">5 Beds (Observation Wards)</option>
                    <option value="6">6 Beds (General Wards)</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* SECTION 3 — Bed Configuration */}
          <div className="bg-dark-secondary border border-dark-tertiary rounded-xl p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2 border-b border-dark-tertiary/60 pb-3">
              <Bed className="text-emerald-400" size={16} />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">SECTION 3 — Bed Configuration (Real-time Preview)</h2>
            </div>

            {generatedBeds.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-dark-tertiary/60 rounded-xl bg-dark-tertiary/10 text-gray-500 text-xs italic">
                Select room capacity and enter room number above to auto-generate physical bed allocations.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                  {generatedBeds.map((bed, idx) => {
                    const currentStatus = bedStatuses[bed.id] || "Available";
                    
                    return (
                      <div 
                        key={bed.id}
                        className="bg-dark-tertiary/20 border border-dark-tertiary p-4 rounded-xl flex flex-col justify-between items-center text-center gap-3 animate-fadeIn"
                      >
                        <div className="p-2 bg-emerald-500/10 rounded-full text-emerald-400 shrink-0">
                          <Bed size={16} />
                        </div>
                        
                        <div>
                          <span className="text-xs font-bold text-white block truncate max-w-full font-mono">{bed.label}</span>
                          <span className="text-[9px] text-gray-500 block uppercase tracking-widest mt-0.5">Bed Suffix: {alphabeticalBeds[idx]}</span>
                        </div>

                        <div className="w-full">
                          <label className="block text-[8px] font-bold text-gray-500 uppercase tracking-widest text-left mb-1">Status</label>
                          <select
                            value={currentStatus}
                            onChange={(e) => handleBedStatusChange(bed.id, e.target.value)}
                            className="w-full px-2 py-1 bg-dark-secondary border border-dark-tertiary rounded text-[10px] text-emerald-400 font-bold focus:outline-none focus:border-emerald-500 focus:text-white shrink-0"
                          >
                            {singleBedStatuses.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <p className="text-[10px] text-emerald-400 flex items-center gap-1.5 font-semibold bg-emerald-500/5 px-3 py-2 rounded-lg border border-emerald-500/10 max-w-fit">
                  <ShieldCheck size={13} />
                  System will automatically generate and register these {capacityNum} beds dynamically under physical room {roomNum || "?"}.
                </p>
              </div>
            )}
          </div>

          {/* SECTION 4 — Medical Facilities */}
          <div className="bg-dark-secondary border border-dark-tertiary rounded-xl p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2 border-b border-dark-tertiary/60 pb-3">
              <HeartPulse className="text-emerald-400" size={16} />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">SECTION 4 — Medical Facilities Checklist</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              
              <label className="flex items-center gap-3 cursor-pointer hover:bg-dark-tertiary/20 p-2.5 rounded-lg border border-transparent hover:border-dark-tertiary/40 transition-all group">
                <input
                  type="checkbox"
                  name="oxygenSupply"
                  checked={formData.oxygenSupply}
                  onChange={handleChange}
                  className="w-4 h-4 bg-dark-tertiary border border-dark-tertiary rounded accent-emerald-500 cursor-pointer group-hover:scale-105 transition-transform"
                />
                <span className="text-gray-300 group-hover:text-white text-xs font-semibold">Oxygen Support</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer hover:bg-dark-tertiary/20 p-2.5 rounded-lg border border-transparent hover:border-dark-tertiary/40 transition-all group">
                <input
                  type="checkbox"
                  name="ventilator"
                  checked={formData.ventilator}
                  onChange={handleChange}
                  className="w-4 h-4 bg-dark-tertiary border border-dark-tertiary rounded accent-emerald-500 cursor-pointer group-hover:scale-105 transition-transform"
                />
                <span className="text-gray-300 group-hover:text-white text-xs font-semibold">Ventilator</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer hover:bg-dark-tertiary/20 p-2.5 rounded-lg border border-transparent hover:border-dark-tertiary/40 transition-all group">
                <input
                  type="checkbox"
                  name="patientMonitor"
                  checked={formData.patientMonitor}
                  onChange={handleChange}
                  className="w-4 h-4 bg-dark-tertiary border border-dark-tertiary rounded accent-emerald-500 cursor-pointer group-hover:scale-105 transition-transform"
                />
                <span className="text-gray-300 group-hover:text-white text-xs font-semibold">Patient Monitor</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer hover:bg-dark-tertiary/20 p-2.5 rounded-lg border border-transparent hover:border-dark-tertiary/40 transition-all group">
                <input
                  type="checkbox"
                  name="nursecallButton"
                  checked={formData.nursecallButton}
                  onChange={handleChange}
                  className="w-4 h-4 bg-dark-tertiary border border-dark-tertiary rounded accent-emerald-500 cursor-pointer group-hover:scale-105 transition-transform"
                />
                <span className="text-gray-300 group-hover:text-white text-xs font-semibold">Nurse Call Button</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer hover:bg-dark-tertiary/20 p-2.5 rounded-lg border border-transparent hover:border-dark-tertiary/40 transition-all group">
                <input
                  type="checkbox"
                  name="attachedBathroom"
                  checked={formData.attachedBathroom}
                  onChange={handleChange}
                  className="w-4 h-4 bg-dark-tertiary border border-dark-tertiary rounded accent-emerald-500 cursor-pointer group-hover:scale-105 transition-transform"
                />
                <span className="text-gray-300 group-hover:text-white text-xs font-semibold">Attached Bathroom</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer hover:bg-dark-tertiary/20 p-2.5 rounded-lg border border-transparent hover:border-dark-tertiary/40 transition-all group">
                <input
                  type="checkbox"
                  name="airConditioning"
                  checked={formData.airConditioning}
                  onChange={handleChange}
                  className="w-4 h-4 bg-dark-tertiary border border-dark-tertiary rounded accent-emerald-500 cursor-pointer group-hover:scale-105 transition-transform"
                />
                <span className="text-gray-300 group-hover:text-white text-xs font-semibold">Air Conditioning</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer hover:bg-dark-tertiary/20 p-2.5 rounded-lg border border-transparent hover:border-dark-tertiary/40 transition-all group">
                <input
                  type="checkbox"
                  name="wheelchairAccessible"
                  checked={formData.wheelchairAccessible}
                  onChange={handleChange}
                  className="w-4 h-4 bg-dark-tertiary border border-dark-tertiary rounded accent-emerald-500 cursor-pointer group-hover:scale-105 transition-transform"
                />
                <span className="text-gray-300 group-hover:text-white text-xs font-semibold">Wheelchair Access</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer hover:bg-dark-tertiary/20 p-2.5 rounded-lg border border-transparent hover:border-dark-tertiary/40 transition-all group">
                <input
                  type="checkbox"
                  name="wifi"
                  checked={formData.wifi}
                  onChange={handleChange}
                  className="w-4 h-4 bg-dark-tertiary border border-dark-tertiary rounded accent-emerald-500 cursor-pointer group-hover:scale-105 transition-transform"
                />
                <span className="text-gray-300 group-hover:text-white text-xs font-semibold">WiFi Support</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer hover:bg-dark-tertiary/20 p-2.5 rounded-lg border border-transparent hover:border-dark-tertiary/40 transition-all group">
                <input
                  type="checkbox"
                  name="television"
                  checked={formData.television}
                  onChange={handleChange}
                  className="w-4 h-4 bg-dark-tertiary border border-dark-tertiary rounded accent-emerald-500 cursor-pointer group-hover:scale-105 transition-transform"
                />
                <span className="text-gray-300 group-hover:text-white text-xs font-semibold">Television</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer hover:bg-dark-tertiary/20 p-2.5 rounded-lg border border-transparent hover:border-dark-tertiary/40 transition-all group">
                <input
                  type="checkbox"
                  name="telephone"
                  checked={formData.telephone}
                  onChange={handleChange}
                  className="w-4 h-4 bg-dark-tertiary border border-dark-tertiary rounded accent-emerald-500 cursor-pointer group-hover:scale-105 transition-transform"
                />
                <span className="text-gray-300 group-hover:text-white text-xs font-semibold">Telephone</span>
              </label>
            </div>
          </div>

          {/* SECTION 5 — Additional Notes */}
          <div className="bg-dark-secondary border border-dark-tertiary rounded-xl p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2 border-b border-dark-tertiary/60 pb-3">
              <FileText className="text-emerald-400" size={16} />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">SECTION 5 — Additional Notes & Directives</h2>
            </div>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              placeholder="Enter special nurse directives, equipment setup requests, dietary instructions, or ward classifications..."
              rows={4}
              className="w-full px-4 py-3 bg-dark-tertiary border border-dark-tertiary/75 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none font-sans"
            />
          </div>

          {/* FORM ACTIONS */}
          <div className="flex gap-4 justify-end pt-4">
            <Link href="/room-allotment/by-department">
              <button
                type="button"
                className="px-6 py-2.5 bg-dark-tertiary hover:bg-dark-tertiary/70 text-gray-300 rounded-lg transition-colors text-xs font-bold border border-dark-tertiary/40 shadow-sm"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 text-white rounded-lg transition-all text-xs font-bold flex items-center gap-1.5 shadow shadow-emerald-500/10 active:scale-95"
            >
              <Check size={14} />
              {submitting ? "Creating Structure..." : "Create Room & Beds"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
