"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Search, Eye, Edit, Trash2, Filter, MoreVertical } from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface RoomData {
  id: string;
  roomNumber: string;
  roomType: string;
  department: string;
}

interface AllotedRoom {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string | null;
  roomId: string;
  attendingDoctor: string;
  allotmentDate: string;
  status: string;
  room: RoomData;
}

export default function AllotedRoomsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [allotedRooms, setAllotedRooms] = useState<AllotedRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState<string[]>(["all"]);

  useEffect(() => {
    fetchAllotments();
  }, []);

  const fetchAllotments = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/room-allotment/allotments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch allotments");

      const data = await response.json();
      setAllotedRooms(data.allotments || []);

      const uniqueDepts = [
        "all",
        ...new Set(
          (data.allotments || []).map((room: AllotedRoom) => room.room?.department).filter(Boolean)
        ),
      ];
      setDepartments(uniqueDepts as string[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this allotment?")) return;

    try {
      const response = await fetch(
        `${API_URL}/room-allotment/allotments/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete");
      }
      fetchAllotments();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const filteredRooms = allotedRooms.filter((room) => {
    const matchesSearch =
      room.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.room.roomNumber.includes(searchQuery) ||
      room.patientId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || room.status === statusFilter;
    const matchesDepartment =
      departmentFilter === "all" || room.room.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Occupied":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Discharged":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      case "Reserved":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  const getRoomTypeColor = (roomType: string) => {
    switch (roomType) {
      case "ICU":
        return "bg-red-500/10 text-red-400";
      case "Private":
        return "bg-emerald-500/10 text-emerald-400";
      case "Semi-Private":
        return "bg-blue-500/10 text-blue-400";
      case "General":
        return "bg-amber-500/10 text-amber-400";
      default:
        return "bg-gray-500/10 text-gray-400";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Alloted Rooms</h1>
          <p className="text-gray-400 mt-2">
            Manage patient room allocations and assignments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Rooms Alloted</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {loading ? "-" : allotedRooms.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <span className="text-emerald-400 text-xl">📍</span>
              </div>
            </div>
          </div>

          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Currently Occupied</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">
                  {loading
                    ? "-"
                    : allotedRooms.filter((r) => r.status === "Occupied")
                        .length}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <span className="text-emerald-400 text-xl">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Discharged</p>
                <p className="text-2xl font-bold text-red-400 mt-1">
                  {loading
                    ? "-"
                    : allotedRooms.filter((r) => r.status === "Discharged")
                        .length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <span className="text-red-400 text-xl">✕</span>
              </div>
            </div>
          </div>

          <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Reserved</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">
                  {loading
                    ? "-"
                    : allotedRooms.filter((r) => r.status === "Reserved")
                        .length}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <span className="text-amber-400 text-xl">⏱</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by patient name, room, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-80 pl-10 pr-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <Link href="/room-allotment/new">
              <button className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium">
                + New Allotment
              </button>
            </Link>
          </div>

          <div className="flex gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="Occupied">Occupied</option>
                <option value="Discharged">Discharged</option>
                <option value="Reserved">Reserved</option>
              </select>
            </div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Departments</option>
              {departments.slice(1).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-tertiary">
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Allotment ID
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Patient
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Room
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Room Type
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Department
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Doctor
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-3 text-center text-gray-400"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-3 text-center text-red-400"
                    >
                      {error}
                    </td>
                  </tr>
                ) : filteredRooms.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-3 text-center text-gray-400"
                    >
                      No allotments found
                    </td>
                  </tr>
                ) : (
                  filteredRooms.map((room) => (
                    <tr
                      key={room.id}
                      className="border-b border-dark-tertiary hover:bg-dark-tertiary/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-white text-sm font-medium">
                        {room.id}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <p className="text-white font-medium">
                            {room.patientName}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {room.patientId}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white font-medium text-sm">
                        {room.room.roomNumber}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getRoomTypeColor(
                            room.room.roomType
                          )}`}
                        >
                          {room.room.roomType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-sm">
                        {room.room.department}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            room.status
                          )}`}
                        >
                          {room.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-sm">
                        {room.attendingDoctor}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-dark-tertiary rounded text-gray-400 hover:text-emerald-400 transition-colors">
                            <Eye size={16} />
                          </button>
                          <Link href={`/room-allotment/edit/${room.id}`}>
                            <button className="p-1 hover:bg-dark-tertiary rounded text-gray-400 hover:text-blue-400 transition-colors">
                              <Edit size={16} />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(room.id)}
                            className="p-1 hover:bg-dark-tertiary rounded text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
            <span>Showing {filteredRooms.length} allotments</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-dark-tertiary hover:bg-dark-tertiary/70 rounded transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded">
                1
              </button>
              <button className="px-3 py-1 bg-dark-tertiary hover:bg-dark-tertiary/70 rounded transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
