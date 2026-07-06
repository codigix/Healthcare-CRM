"use client";

import { useState, useEffect } from "react";

import { Search, Eye, Edit, Trash2, Filter, MoreVertical } from "lucide-react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import DataTable, { Column } from "@/components/ui/DataTable";

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
 expectedDischargeDate?: string;
 additionalNotes?: string;
 status: string;
 room: RoomData;
 bed?: string | null;
}

export default function AllotedRoomsPage() {
 const [searchQuery, setSearchQuery] = useState("");
 const [statusFilter, setStatusFilter] = useState("all");
 const [departmentFilter, setDepartmentFilter] = useState("all");
 const [allotedRooms, setAllotedRooms] = useState<AllotedRoom[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 const [departments, setDepartments] = useState<string[]>(["all"]);

 // Modal State
 const [viewRoomId, setViewRoomId] = useState<string | null>(null);
 const [editRoomId, setEditRoomId] = useState<string | null>(null);
 const [editData, setEditData] = useState({
 status: "",
 expectedDischargeDate: "",
 additionalNotes: "",
 });
 const [saving, setSaving] = useState(false);

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
 (data.allotments || [])
 .map((room: AllotedRoom) => room.room?.department)
 .filter(Boolean)
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

 const handleEditClick = (room: AllotedRoom) => {
 setEditRoomId(room.id);
 setEditData({
 status: room.status || "Occupied",
 expectedDischargeDate: room.expectedDischargeDate ? room.expectedDischargeDate.split('T')[0] : "",
 additionalNotes: room.additionalNotes || "",
 });
 };

 const handleUpdate = async () => {
 if (!editRoomId) return;
 try {
 setSaving(true);
 const response = await fetch(`${API_URL}/room-allotment/allotments/${editRoomId}`, {
 method: "PUT",
 headers: {
 "Content-Type": "application/json",
 Authorization: `Bearer ${localStorage.getItem("token")}`,
 },
 body: JSON.stringify(editData),
 });

 if (!response.ok) {
 const error = await response.json();
 throw new Error(error.error || "Failed to update");
 }
 
 setEditRoomId(null);
 fetchAllotments();
 } catch (err) {
 alert(err instanceof Error ? err.message : "Failed to update");
 } finally {
 setSaving(false);
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

    const columns_0: Column<any>[] = [
      { header: "Allotment ID", accessor: (room) => (<>#\n{room.id.slice(0, 8).toUpperCase()}\n</>) },
      { header: "Patient", accessor: (room) => (<>\n<div>
     <p className="text-white font-medium">
     {room.patientName}
     </p>
     <p className="text-gray-400 text-[10px] font-mono mt-0.5 block uppercase">
     UHID: {room.patientId.slice(0, 8)}
     </p>
     </div>\n</>) },
      { header: "Room", accessor: (room) => (<>\n{room.room.roomNumber}\n</>) },
      { header: "Bed Slot", accessor: (room) => (<>\n{room.bed ? (
     <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-xs font-bold font-sans">
     {room.bed}
     </span>
     ) : (
     <span className="text-gray-500 italic text-xs">Unspecified</span>
     )}\n</>) },
      { header: "Room Type", accessor: (room) => (<>\n<span
     className={`px-2 py-1 rounded text-xs font-medium ${getRoomTypeColor(
     room.room.roomType
     )}`}
     >
     {room.room.roomType}
     </span>\n</>) },
      { header: "Department", accessor: (room) => (<>\n{room.room.department}\n</>) },
      { header: "Status", accessor: (room) => (<>\n<span
     className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
     room.status
     )}`}
     >
     {room.status}
     </span>\n</>) },
      { header: "Doctor", accessor: (room) => (<>\n{room.attendingDoctor}\n</>) },
      { header: "Actions", accessor: (room) => (<>\n<div className="flex items-center gap-2">
     <button 
     onClick={() => setViewRoomId(room.id)}
     className="p-1 hover:bg-dark-tertiary rounded text-gray-400 hover:text-emerald-400 transition-colors"
     >
     <Eye size={16} />
     </button>
     <button 
     onClick={() => handleEditClick(room)}
     className="p-1 hover:bg-dark-tertiary rounded text-gray-400 hover:text-blue-400 transition-colors"
     >
     <Edit size={16} />
     </button>
     <button
     onClick={() => handleDelete(room.id)}
     className="p-1 hover:bg-dark-tertiary rounded text-gray-400 hover:text-red-400 transition-colors"
     >
     <Trash2 size={16} />
     </button>
     </div>\n</>) },
    ];


 return (
 <>
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
 className="px-3 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white text-mdfocus:outline-none focus:border-emerald-500"
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
 className="px-3 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white text-mdfocus:outline-none focus:border-emerald-500"
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
 <DataTable columns={columns_0} data={filteredRooms} enableLocalSearch enableLocalPagination />
 </div>

 <div className="mt-4 flex justify-between items-center text-mdtext-gray-400">
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

 {/* View Modal */}
 <Modal
 isOpen={!!viewRoomId}
 onClose={() => setViewRoomId(null)}
 title="Allotment Details"
 >
 {(() => {
 const room = allotedRooms.find((r) => r.id === viewRoomId);
 if (!room) return null;
 return (
 <div className="space-y-4 text-gray-300">
 <div className="flex justify-between items-center pb-2 border-b border-dark-tertiary/40">
 <span className="text-xs text-emerald-400 font-bold font-mono">Allotment: #{room.id.slice(0, 8).toUpperCase()}</span>
 <span className="text-[9px] text-gray-500 font-mono select-all" title="Click to copy full database ID">UUID: {room.id}</span>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <p className="text-sm text-gray-400">Patient</p>
 <p className="font-medium text-white">{room.patientName}</p>
 <p className="text-xs font-mono">UHID: {room.patientId.slice(0, 8).toUpperCase()}</p>
 </div>
 <div>
 <p className="text-sm text-gray-400">Doctor</p>
 <p className="font-medium text-white">{room.attendingDoctor}</p>
 </div>
 <div>
 <p className="text-sm text-gray-400">Room & Bed Slot</p>
 <p className="font-medium text-white">Room {room.room.roomNumber} • Bed {room.bed || "N/A"}</p>
 <p className="text-xs">{room.room.department} • {room.room.roomType}</p>
 </div>
 <div>
 <p className="text-sm text-gray-400">Status</p>
 <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(room.status)}`}>
 {room.status}
 </span>
 </div>
 <div>
 <p className="text-sm text-gray-400">Allotment Date</p>
 <p>{new Date(room.allotmentDate).toLocaleDateString()}</p>
 </div>
 <div>
 <p className="text-sm text-gray-400">Expected Discharge</p>
 <p>{room.expectedDischargeDate ? new Date(room.expectedDischargeDate).toLocaleDateString() : 'N/A'}</p>
 </div>
 </div>
 <div>
 <p className="text-sm text-gray-400 mb-1">Additional Notes</p>
 <div className="p-3 bg-dark-tertiary rounded-lg min-h-[60px] text-sm">
 {room.additionalNotes || 'No notes provided.'}
 </div>
 </div>
 </div>
 );
 })()}
 </Modal>

 {/* Edit Modal */}
 <Modal
 isOpen={!!editRoomId}
 onClose={() => setEditRoomId(null)}
 title="Edit Allotment"
 >
 <div className="space-y-4">
 <div>
 <label className="block text-sm text-gray-400 mb-2">Status</label>
 <select
 value={editData.status}
 onChange={(e) => setEditData({ ...editData, status: e.target.value })}
 className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white focus:outline-none focus:border-emerald-500"
 >
 <option value="Occupied">Occupied</option>
 <option value="Discharged">Discharged</option>
 <option value="Reserved">Reserved</option>
 </select>
 </div>
 <div>
 <label className="block text-sm text-gray-400 mb-2">Expected Discharge Date</label>
 <input
 type="date"
 value={editData.expectedDischargeDate}
 onChange={(e) => setEditData({ ...editData, expectedDischargeDate: e.target.value })}
 className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white focus:outline-none focus:border-emerald-500"
 />
 </div>
 <div>
 <label className="block text-sm text-gray-400 mb-2">Additional Notes</label>
 <textarea
 value={editData.additionalNotes}
 onChange={(e) => setEditData({ ...editData, additionalNotes: e.target.value })}
 className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white focus:outline-none focus:border-emerald-500 resize-none h-24"
 placeholder="Enter any notes..."
 />
 </div>
 <div className="flex justify-end gap-3 mt-6">
 <button
 onClick={() => setEditRoomId(null)}
 className="px-4 py-2 bg-dark-tertiary text-white rounded-lg hover:bg-dark-tertiary/80 transition-colors"
 >
 Cancel
 </button>
 <button
 onClick={handleUpdate}
 disabled={saving}
 className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
 >
 {saving ? 'Saving...' : 'Save Changes'}
 </button>
 </div>
 </div>
 </Modal>
 </>
 );
}
