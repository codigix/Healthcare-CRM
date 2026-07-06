"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MoreVertical, Eye, Edit2, Trash2, Bed, Activity, ShieldAlert, Sparkles, Clock, LayoutGrid, HeartPulse } from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface AllotmentData {
    id: string;
    patientId: string;
    patientName: string;
    attendingDoctor: string;
    status: string;
    bed?: string;
}

interface Room {
    id: string;
    roomNumber: string;
    roomType: string;
    status: string;
    department: string;
    floor: string;
    capacity: number;
    pricePerDay: string;
    television?: boolean;
    attachedBathroom?: boolean;
    airConditioning?: boolean;
    wheelchairAccessible?: boolean;
    wifi?: boolean;
    oxygenSupply?: boolean;
    telephone?: boolean;
    nursecallButton?: boolean;
    ventilator?: boolean;
    patientMonitor?: boolean;
    additionalNotes?: string;
    roomAllotments?: AllotmentData[];
}

interface DepartmentData {
    department: string;
    totalRooms: number;
    occupied: number;
    available: number;
    rooms: Room[];
}

export default function RoomsByDepartmentPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("Cardiology");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [bedStatusFilter, setBedStatusFilter] = useState("all");
    const [departmentsData, setDepartmentsData] = useState<DepartmentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);

    // Modal states
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [statusUpdateModal, setStatusUpdateModal] = useState(false);
    const [viewDetailsModal, setViewDetailsModal] = useState(false);
    const [newStatus, setNewStatus] = useState("Available");
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // Bed details modal
    const [selectedBedDetails, setSelectedBedDetails] = useState<any>(null);

    useEffect(() => {
        fetchDepartmentsData();
    }, []);

    const fetchDepartmentsData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/room-allotment/rooms`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch rooms");

            const data = await response.json();

            const staticDepts = [
                "Cardiology",
                "Neurology",
                "Orthopedics",
                "Pediatrics",
                "ICU",
                "Emergency",
                "General Medicine",
            ];

            // Fetch active departments from backend API
            let activeDepts: string[] = [];
            try {
                const deptsRes = await fetch(`${API_URL}/departments?page=1&limit=100`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (deptsRes.ok) {
                    const deptsData = await deptsRes.json();
                    activeDepts = (deptsData.departments || [])
                        .filter((d: any) => d.status === "Active")
                        .map((d: any) => d.name);
                }
            } catch (err) {
                console.error("Failed to fetch active departments:", err);
            }

            const derived = data.rooms ? data.rooms.map((r: any) => r.department) : [];

            // Merge case-insensitively to avoid case-duplicated entries (e.g. Cardiology vs cardiology)
            const mergedDeptsList = [...activeDepts];
            staticDepts.forEach(fallback => {
                const exists = activeDepts.some(d => d.toLowerCase() === fallback.toLowerCase());
                if (!exists) {
                    mergedDeptsList.push(fallback);
                }
            });
            derived.forEach(dName => {
                if (dName) {
                    const exists = mergedDeptsList.some(d => d.toLowerCase() === dName.toLowerCase());
                    if (!exists) {
                        mergedDeptsList.push(dName);
                    }
                }
            });

            const departments = mergedDeptsList;

            setAvailableDepartments(departments);

            if (departments.length > 0) {
                // Find first department with rooms, or default to Cardiology
                const firstWithRooms = departments.find(d => data.rooms.some((r: any) => r.department === d)) || departments[0];
                setSelectedDepartment(firstWithRooms);
                await fetchDepartmentRooms(firstWithRooms);
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to fetch departments"
            );
        }
    };

    const fetchDepartmentRooms = async (dept: string) => {
        try {
            const response = await fetch(
                `${API_URL}/room-allotment/by-department/${dept}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (!response.ok) throw new Error("Failed to fetch department data");

            const data = await response.json();
            setDepartmentsData((prev) => {
                const existing = prev.find((d) => d.department === dept);
                if (existing) {
                    return prev.map((d) => (d.department === dept ? data : d));
                }
                return [...prev, data];
            });
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to fetch department"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDepartmentChange = (dept: string) => {
        setSelectedDepartment(dept);
        setCategoryFilter("all");
        setBedStatusFilter("all");
        setSearchQuery("");

        const existing = departmentsData.find((d) => d.department === dept);
        if (!existing) {
            fetchDepartmentRooms(dept);
        }
    };

    const currentDepartment = departmentsData.find(
        (d) => d.department === selectedDepartment
    );

    // Helper: Get systematic alphabetical beds list for a room
    const getRoomBeds = (room: Room) => {
        const alphabeticalBeds = ["A", "B", "C", "D", "E", "F", "G", "H"];
        const capacity = room.capacity || 1;
        const beds = [];

        // Filter allotments for this room in roomAllotments
        const activeAllotments = room.roomAllotments || [];

        for (let i = 0; i < capacity; i++) {
            const bedId = capacity === 1 ? `${room.roomNumber}-Single Bed` : `${room.roomNumber}-${alphabeticalBeds[i] || i + 1}`;

            // Match systematic Bed ID or legacy string indexes
            const activeAllotment = activeAllotments.find(
                (a) => a.bed === bedId || a.bed === `Bed ${alphabeticalBeds[i]}` || (capacity === 1 && !a.bed)
            );

            let bedStatus = "Available";
            let patientName = "";
            let doctorName = "";
            let allotmentId = "";

            if (activeAllotment) {
                bedStatus = activeAllotment.status || "Occupied";
                patientName = activeAllotment.patientName || "Unknown Patient";
                doctorName = activeAllotment.attendingDoctor || "Unassigned Doctor";
                allotmentId = activeAllotment.id;
            } else {
                // Fallback to room level statuses
                if (room.status === "Maintenance") bedStatus = "Blocked";
                else if (room.status === "Cleaning") bedStatus = "Under Cleaning";
                else if (room.status === "Isolation Active") bedStatus = "Blocked";
                else if (room.status === "Reserved") bedStatus = "Reserved";
            }

            beds.push({
                name: bedId,
                status: bedStatus,
                patientName,
                doctorName,
                allotmentId,
            });
        }
        return beds;
    };

    // Advanced filters calculation
    const filteredRooms = currentDepartment
        ? currentDepartment.rooms.filter((room) => {
            const matchesSearch =
                room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                room.roomType.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory =
                categoryFilter === "all" || room.roomType === categoryFilter;

            // Match bed level status
            const matchesBedStatus =
                bedStatusFilter === "all" ||
                getRoomBeds(room).some(b => b.status.toLowerCase() === bedStatusFilter.toLowerCase());

            return matchesSearch && matchesCategory && matchesBedStatus;
        })
        : [];

    const handleUpdateStatus = async () => {
        if (!selectedRoom) return;
        try {
            const response = await fetch(
                `${API_URL}/room-allotment/rooms/${selectedRoom.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (response.ok) {
                setStatusUpdateModal(false);
                await fetchDepartmentRooms(selectedDepartment);
                setOpenDropdown(null);
            } else {
                const error = await response.json();
                alert(error.error || "Failed to update room status");
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : "Error updating room status");
        }
    };

    const handleDeleteRoom = async (roomId: string) => {
        if (confirm("Are you sure you want to delete this room and release its beds?")) {
            try {
                const response = await fetch(
                    `${API_URL}/room-allotment/rooms/${roomId}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                if (response.ok) {
                    await fetchDepartmentRooms(selectedDepartment);
                    setOpenDropdown(null);
                } else {
                    const error = await response.json();
                    alert(error.error || "Failed to delete room");
                }
            } catch (err) {
                alert(err instanceof Error ? err.message : "Error deleting room");
            }
        }
    };

    // Calculated Wards Top Stats
    const getStats = () => {
        if (!currentDepartment) return { totalRooms: 0, totalBeds: 0, occupiedBeds: 0, reservedBeds: 0, availableBeds: 0, icuBeds: 0, wardBeds: 0 };

        let totalRooms = currentDepartment.rooms.length;
        let totalBeds = 0;
        let occupiedBeds = 0;
        let reservedBeds = 0;
        let cleaningBeds = 0;
        let blockedBeds = 0;
        let icuBeds = 0;
        let wardBeds = 0;

        currentDepartment.rooms.forEach(room => {
            const beds = getRoomBeds(room);
            totalBeds += beds.length;

            // Categorize dynamic bed spaces
            if (room.roomType?.toLowerCase().includes("icu")) {
                icuBeds += beds.length;
            } else {
                wardBeds += beds.length;
            }

            beds.forEach(b => {
                if (b.status === "Occupied") occupiedBeds++;
                else if (b.status === "Reserved") reservedBeds++;
                else if (b.status === "Under Cleaning") cleaningBeds++;
                else if (b.status === "Blocked") blockedBeds++;
            });
        });

        const availableBeds = totalBeds - occupiedBeds - reservedBeds - cleaningBeds - blockedBeds;

        return {
            totalRooms,
            totalBeds,
            occupiedBeds,
            reservedBeds,
            availableBeds,
            icuBeds,
            wardBeds
        };
    };

    const stats = getStats();

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Occupied":
                return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
            case "Available":
                return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
            case "Reserved":
                return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
            case "Cleaning":
                return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
            case "Maintenance":
                return "bg-rose-950/20 text-rose-300 border border-rose-900/30";
            case "Isolation Active":
                return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
            default:
                return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
        }
    };

    const getRoomTypeColor = (roomType: string) => {
        switch (roomType) {
            case "ICU":
                return "bg-rose-500/15 text-rose-400 border border-rose-500/25";
            case "Isolation Room":
                return "bg-purple-500/15 text-purple-400 border border-purple-500/25";
            case "Private Room":
                return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25";
            case "Semi Private":
                return "bg-blue-500/15 text-blue-400 border border-blue-500/25";
            case "Deluxe Room":
                return "bg-amber-500/15 text-amber-300 border border-amber-500/25";
            default:
                return "bg-gray-500/15 text-gray-300 border border-gray-500/25";
        }
    };

    const getBedIconColor = (status: string) => {
        switch (status) {
            case "Available":
                return "text-emerald-400 border-emerald-500/25 bg-emerald-500/[0.02] hover:border-emerald-500/50 hover:bg-emerald-500/[0.04]";
            case "Occupied":
                return "text-rose-400 border-rose-500/20 bg-rose-500/[0.03]";
            case "Reserved":
                return "text-amber-400 border-amber-500/20 bg-amber-500/[0.03]";
            case "Under Cleaning":
                return "text-blue-400 border-blue-500/20 bg-blue-500/[0.03]";
            case "Blocked":
                return "text-rose-300 border-rose-950/20 bg-rose-950/20";
            default:
                return "text-gray-500 border-dark-tertiary bg-dark-tertiary/10";
        }
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

    return (
        <>
            <div className="space-y-6 pb-20">
                <div>
                    <h1 className="text-3xl  text-white font-outfit">Rooms & Beds Dashboard</h1>
                    <p className="text-gray-400 mt-1 text-xs">Live clinical floor layout, bed occupancy metrics, and department ward statuses</p>
                </div>

                {/* SECTION 7 STATS SUMMARY SECTION */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div className="bg-dark-secondary border border-dark-tertiary rounded-xl p-5 shadow-sm">
                        <p className="text-gray-500 text-[10px] uppercase  tracking-wider">Total Rooms</p>
                        <p className="text-2xl  text-white mt-1">
                            {loading ? "-" : stats.totalRooms}
                        </p>
                    </div>

                    <div className="bg-dark-secondary border border-dark-tertiary rounded-xl p-5 shadow-sm">
                        <p className="text-gray-500 text-[10px] uppercase  tracking-wider">Total Beds</p>
                        <p className="text-2xl  text-blue-400 mt-1">
                            {loading ? "-" : stats.totalBeds}
                        </p>
                    </div>

                    <div className="bg-dark-secondary border border-dark-tertiary rounded-xl p-5 shadow-sm">
                        <p className="text-gray-500 text-[10px] uppercase  tracking-wider">Available Beds</p>
                        <p className="text-2xl  text-emerald-400 mt-1">
                            {loading ? "-" : stats.availableBeds}
                        </p>
                    </div>

                    <div className="bg-dark-secondary border border-dark-tertiary rounded-xl p-5 shadow-sm">
                        <p className="text-gray-500 text-[10px] uppercase  tracking-wider">Occupied Beds</p>
                        <p className="text-2xl  text-rose-400 mt-1">
                            {loading ? "-" : stats.occupiedBeds}
                        </p>
                    </div>

                    <div className="bg-dark-secondary border border-dark-tertiary rounded-xl p-5 shadow-sm">
                        <p className="text-gray-500 text-[10px] uppercase  tracking-wider">ICU Beds</p>
                        <p className="text-2xl  text-rose-500 mt-1">
                            {loading ? "-" : stats.icuBeds}
                        </p>
                    </div>

                    <div className="bg-dark-secondary border border-dark-tertiary rounded-xl p-5 shadow-sm">
                        <p className="text-gray-500 text-[10px] uppercase  tracking-wider">Ward Beds</p>
                        <p className="text-2xl  text-amber-400 mt-1">
                            {loading ? "-" : stats.wardBeds}
                        </p>
                    </div>
                </div>

                {/* WARD VIEW AND FILTERS PANEL */}
                <div className="bg-dark-secondary border border-dark-tertiary rounded-xl p-6 shadow-md space-y-6">

                    {/* Department selections */}
                    <div>
                        <h2 className="text-xs  text-gray-400 uppercase tracking-widest mb-3">Clinical Departments</h2>
                        <div className="flex gap-2 flex-wrap">
                            {availableDepartments.map((dept) => (
                                <button
                                    key={dept}
                                    onClick={() => handleDepartmentChange(dept)}
                                    className={`p-2 rounded transition-all text-xs  ${selectedDepartment === dept
                                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/10 active:scale-95"
                                        : "bg-dark-tertiary/65 text-gray-400 hover:text-white border border-dark-tertiary/20"
                                        }`}
                                >
                                    {dept} Department
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filtering row */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t border-dark-tertiary/40">
                        <div className="relative flex-1 md:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search room number..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full md:w-60 pl-9 pr-4 py-2 bg-dark-tertiary border border-dark-tertiary/70 rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
                            <div className="flex items-center gap-2">
                                <Filter size={13} className="text-gray-400" />

                                {/* Category filter */}
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="px-3 py-1.5 bg-dark-tertiary border border-dark-tertiary rounded text-xs text-white focus:outline-none focus:border-emerald-500 h-[36px] font-semibold"
                                >
                                    <option value="all">All Room Categories</option>
                                    {wardTypes.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>

                                {/* Bed Status filter */}
                                <select
                                    value={bedStatusFilter}
                                    onChange={(e) => setBedStatusFilter(e.target.value)}
                                    className="px-3 py-1.5 bg-dark-tertiary border border-dark-tertiary rounded text-xs text-white focus:outline-none focus:border-emerald-500 h-[36px] font-semibold"
                                >
                                    <option value="all">All Bed Statuses</option>
                                    <option value="Available">Available Beds</option>
                                    <option value="Occupied">Occupied Beds</option>
                                    <option value="Reserved">Reserved Beds</option>
                                    <option value="Blocked">Blocked Beds</option>
                                    <option value="Under Cleaning">Under Cleaning</option>
                                </select>
                            </div>

                            <Link href="/room-allotment/add-room" className="ml-auto md:ml-0">
                                <button className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded transition-all text-xs  shadow-md shadow-emerald-500/10 active:scale-95">
                                    + Add New Room
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* ROOM & BEDS GRID LAYOUT */}
                    {loading ? (
                        <div className="text-center py-16 text-gray-400 animate-pulse flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-xs">Loading department wards...</p>
                        </div>
                    ) : filteredRooms.length === 0 ? (
                        <div className="text-center py-16 text-gray-500 text-sm italic border border-dashed border-dark-tertiary/50 rounded-xl">
                            No clinical rooms found in {selectedDepartment} matching selected category or bed status.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                            {filteredRooms.map((room) => {
                                const roomBedsList = getRoomBeds(room);
                                const occupiedBedsCount = roomBedsList.filter(b => b.status === "Occupied").length;

                                return (
                                    <div
                                        key={room.id}
                                        className="bg-dark-tertiary/15 border border-dark-tertiary/70 rounded-xl p-5 space-y-4 hover:border-dark-tertiary transition-all shadow-sm hover:shadow-lg relative flex flex-col justify-between"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white  text-lg font-outfit">Room {room.roomNumber}</span>
                                                        <span className={`px-2 py-0.5 rounded text-[9px]  border uppercase tracking-wider ${getRoomTypeColor(room.roomType)}`}>
                                                            {room.roomType}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 mt-0.5">Floor {room.floor} • ${parseFloat(room.pricePerDay)}/Day</p>
                                                </div>

                                                {/* Room options dropdown menu */}
                                                <div className="relative">
                                                    <button
                                                        onClick={() =>
                                                            setOpenDropdown(openDropdown === room.id ? null : room.id)
                                                        }
                                                        className="p-1.5 hover:bg-dark-tertiary/60 rounded text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        <MoreVertical size={14} />
                                                    </button>
                                                    {openDropdown === room.id && (
                                                        <div className="absolute right-0 mt-1 w-44 bg-dark-secondary border border-dark-tertiary rounded shadow-xl z-20 overflow-hidden divide-y divide-dark-tertiary/50">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedRoom(room);
                                                                    setNewStatus(room.status);
                                                                    setStatusUpdateModal(true);
                                                                }}
                                                                className="w-full flex items-center gap-2 p-2.5 text-gray-300 hover:bg-dark-tertiary hover:text-emerald-400 transition-colors text-xs font-semibold text-left"
                                                            >
                                                                <Edit2 size={13} />
                                                                Room Status
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedRoom(room);
                                                                    setViewDetailsModal(true);
                                                                    setOpenDropdown(null);
                                                                }}
                                                                className="w-full flex items-center gap-2 p-2.5 text-gray-300 hover:bg-dark-tertiary hover:text-blue-400 transition-colors text-xs font-semibold text-left"
                                                            >
                                                                <Eye size={13} />
                                                                Room Features
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    handleDeleteRoom(room.id);
                                                                }}
                                                                className="w-full flex items-center gap-2 p-2.5 text-rose-500 hover:bg-rose-950/20 transition-colors text-xs font-semibold text-left"
                                                            >
                                                                <Trash2 size={13} />
                                                                Delete Room
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Room Occupancy status bar */}
                                            <div className="flex justify-between items-center my-3 my-3 text-[10px] text-gray-400 font-semibold mt-1">
                                                <span>Beds: {occupiedBedsCount}/{room.capacity} Occupied</span>
                                                <span className={`px-2 py-0.5 rounded-full text-[9px]  border uppercase ${getStatusColor(room.status)}`}>
                                                    {room.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* LIVE BEDS GRID LAYOUT IN SYSTEMATIC FORMAT [Room]-[Letter] */}
                                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dark-tertiary/20">
                                            {roomBedsList.map((bedItem) => {
                                                const isOccupied = ["occupied", "reserved"].includes(bedItem.status.toLowerCase());

                                                return (
                                                    <div
                                                        key={bedItem.name}
                                                        onClick={() => {
                                                            if (isOccupied) {
                                                                setSelectedBedDetails({
                                                                    ...bedItem,
                                                                    roomNumber: room.roomNumber,
                                                                    roomType: room.roomType,
                                                                    department: room.department
                                                                });
                                                            }
                                                        }}
                                                        className={`p-2.5 rounded border text-left transition-all flex items-center gap-2 ${isOccupied ? "cursor-pointer active:scale-95 hover:border-emerald-500/40" : "cursor-default"
                                                            } ${getBedIconColor(bedItem.status)}`}
                                                    >
                                                        <Bed size={13} className="shrink-0" />
                                                        <div className="min-w-0 flex-1">
                                                            <span className="text-[10px]  block leading-none font-mono">{bedItem.name}</span>
                                                            <span className="text-[8px] text-gray-500 truncate block mt-1 leading-none font-semibold">
                                                                {isOccupied ? bedItem.patientName : bedItem.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* BED OCCUPANCY INFO POPUP MODAL */}
            {selectedBedDetails && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-dark-secondary border border-dark-tertiary rounded-xl p-6 w-full max-w-sm shadow-xl space-y-4">
                        <div className="flex items-center gap-2 border-b border-dark-tertiary pb-3">
                            <ShieldAlert className="text-emerald-400 shrink-0 animate-pulse" size={15} />
                            <h3 className="text-base  text-white uppercase tracking-wider font-outfit">Bed Occupancy Details</h3>
                        </div>

                        <div className="space-y-3.5 text-xs text-gray-300">
                            <div className="grid grid-cols-2 gap-4 bg-dark-tertiary/30 p-3 rounded border border-dark-tertiary/40 font-mono">
                                <div>
                                    <p className="text-[10px] text-gray-500  uppercase tracking-wider">Bed Slot ID</p>
                                    <p className=" text-white text-xs mt-0.5">{selectedBedDetails.name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500  uppercase tracking-wider">Location</p>
                                    <p className=" text-white text-xs mt-0.5">Room {selectedBedDetails.roomNumber}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] text-gray-500  uppercase tracking-wider">Admitted Patient Name</p>
                                <p className=" text-white text-xs mt-0.5">{selectedBedDetails.patientName}</p>
                            </div>

                            <div>
                                <p className="text-[10px] text-gray-500  uppercase tracking-wider">Attending Clinician</p>
                                <p className="font-semibold text-purple-400 text-xs mt-0.5">Dr. {selectedBedDetails.doctorName}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] text-gray-500  uppercase tracking-wider">Clinical Status</p>
                                    <span className={`px-2 py-0.5 rounded text-[10px]  border uppercase mt-1 inline-block ${selectedBedDetails.status.toLowerCase() === "occupied" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                        }`}>
                                        {selectedBedDetails.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500  uppercase tracking-wider">Department</p>
                                    <p className="font-semibold text-white mt-0.5 text-xs">{selectedBedDetails.department}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-dark-tertiary/40">
                            <button
                                onClick={() => setSelectedBedDetails(null)}
                                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs  transition-all shadow shadow-emerald-500/10 active:scale-95"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* UPDATE STATUS MODAL */}
            {statusUpdateModal && selectedRoom && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-dark-secondary border border-dark-tertiary rounded-xl p-6 w-full max-w-sm shadow-xl space-y-4">
                        <h3 className="text-lg  text-white font-outfit">Update Room Status</h3>
                        <p className="text-gray-400 text-xs">
                            Configure operational status for Room <strong className="text-white font-mono">{selectedRoom.roomNumber}</strong> ({selectedRoom.roomType})
                        </p>

                        <div>
                            <label className="block text-gray-400 text-xs  mb-2">New Status</label>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full p-2 bg-dark-tertiary border border-dark-tertiary rounded text-xs text-white focus:outline-none focus:border-emerald-500 h-[38px] font-semibold"
                            >
                                <option value="Available">Available (Ready for occupancy)</option>
                                <option value="Occupied">Occupied (Beds allotted)</option>
                                <option value="Reserved">Reserved (Incoming Patient)</option>
                                <option value="Cleaning">Cleaning (Sanitization/Housekeeping)</option>
                                <option value="Maintenance">Maintenance (Equipment repair)</option>
                                <option value="Isolation Active">Isolation Active (Contagion Protocol)</option>
                            </select>
                        </div>

                        <div className="flex gap-2 justify-end pt-4 border-t border-dark-tertiary/40">
                            <button
                                onClick={() => setStatusUpdateModal(false)}
                                className="p-2 bg-dark-tertiary text-gray-300 rounded hover:bg-dark-tertiary/70 transition-colors text-xs "
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded transition-all text-xs  active:scale-95 animate-fadeIn"
                            >
                                Update Room
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW DETAILS MODAL */}
            {viewDetailsModal && selectedRoom && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-dark-secondary border border-dark-tertiary rounded-xl p-6 w-full max-w-sm shadow-xl space-y-4">
                        <h3 className="text-lg  text-white font-outfit border-b border-dark-tertiary pb-3 mb-2 flex items-center gap-2">
                            <HeartPulse className="text-emerald-400" size={15} />
                            Room Facilities & Features
                        </h3>

                        <div className="space-y-4 text-xs text-gray-300 leading-normal">
                            <div className="grid grid-cols-2 gap-4 bg-dark-tertiary/20 p-3 rounded border border-dark-tertiary/40 font-mono">
                                <div>
                                    <p className="text-gray-500  uppercase tracking-wider text-[9px]">Room ID</p>
                                    <p className="text-white  text-xs mt-0.5">{selectedRoom.roomNumber}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500  uppercase tracking-wider text-[9px]">Category</p>
                                    <p className="text-white  text-xs mt-0.5 truncate">{selectedRoom.roomType}</p>
                                </div>
                            </div>

                            {/* Grid checklist of facilities */}
                            <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                                <div className="flex items-center justify-between bg-dark-tertiary/10 p-2 rounded">
                                    <span className="text-gray-400">Oxygen Support</span>
                                    <span className={` ${selectedRoom.oxygenSupply ? "text-emerald-400" : "text-gray-600"}`}>
                                        {selectedRoom.oxygenSupply ? "Yes" : "No"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between bg-dark-tertiary/10 p-2 rounded">
                                    <span className="text-gray-400">Ventilator</span>
                                    <span className={` ${selectedRoom.ventilator ? "text-emerald-400" : "text-gray-600"}`}>
                                        {selectedRoom.ventilator ? "Yes" : "No"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between bg-dark-tertiary/10 p-2 rounded">
                                    <span className="text-gray-400">Patient Monitor</span>
                                    <span className={` ${selectedRoom.patientMonitor ? "text-emerald-400" : "text-gray-600"}`}>
                                        {selectedRoom.patientMonitor ? "Yes" : "No"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between bg-dark-tertiary/10 p-2 rounded">
                                    <span className="text-gray-400">Nurse Call Button</span>
                                    <span className={` ${selectedRoom.nursecallButton ? "text-emerald-400" : "text-gray-600"}`}>
                                        {selectedRoom.nursecallButton ? "Yes" : "No"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between bg-dark-tertiary/10 p-2 rounded">
                                    <span className="text-gray-400">Attached Bathroom</span>
                                    <span className={` ${selectedRoom.attachedBathroom ? "text-emerald-400" : "text-gray-600"}`}>
                                        {selectedRoom.attachedBathroom ? "Yes" : "No"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between bg-dark-tertiary/10 p-2 rounded">
                                    <span className="text-gray-400">Air Conditioner</span>
                                    <span className={` ${selectedRoom.airConditioning ? "text-emerald-400" : "text-gray-600"}`}>
                                        {selectedRoom.airConditioning ? "Yes" : "No"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between bg-dark-tertiary/10 p-2 rounded">
                                    <span className="text-gray-400">Wheelchair Access</span>
                                    <span className={` ${selectedRoom.wheelchairAccessible ? "text-emerald-400" : "text-gray-600"}`}>
                                        {selectedRoom.wheelchairAccessible ? "Yes" : "No"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between bg-dark-tertiary/10 p-2 rounded">
                                    <span className="text-gray-400">WiFi Support</span>
                                    <span className={` ${selectedRoom.wifi ? "text-emerald-400" : "text-gray-600"}`}>
                                        {selectedRoom.wifi ? "Yes" : "No"}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <p className="text-gray-500  uppercase tracking-wider text-[9px] mb-1">Additional Operational Notes</p>
                                <div className="p-3 bg-dark-tertiary/30 rounded min-h-[50px] border border-dark-tertiary/40 text-[11px] text-gray-400 italic">
                                    {selectedRoom.additionalNotes || "No specific nursing or equipment directives are recorded for this room structure."}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-dark-tertiary/40">
                            <button
                                onClick={() => setViewDetailsModal(false)}
                                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs  transition-all active:scale-95"
                            >
                                Close Panel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
