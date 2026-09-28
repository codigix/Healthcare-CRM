"use client";

import { useState, useEffect } from "react";
import { 
  recordsAPI, 
  doctorAPI, 
  patientAPI 
} from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { 
  Search, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Check, 
  Plus, 
  ExternalLink, 
  Bed, 
  ShieldAlert, 
  Activity, 
  ChevronRight,
  Eye,
  Edit,
  MoreVertical,
  Calendar,
  ChevronLeft,
  SlidersHorizontal,
  Filter,
  X,
  Trash,
  UserX,
  FileSpreadsheet
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";

interface AdmissionRecord {
  id: string;
  type: string;
  patientName: string;
  date: string;
  details: string;
  status: string;
  createdAt: string;
}

export default function AdmissionRequestsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  // Data State
  const [records, setRecords] = useState<AdmissionRecord[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("2024-05-01");
  const [endDate, setEndDate] = useState("2024-05-21");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedRequestedBy, setSelectedRequestedBy] = useState("All Users");
  const [selectedInsurance, setSelectedInsurance] = useState("All");
  
  // UI State
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  
  // Modals State
  const [selectedRecord, setSelectedRecord] = useState<AdmissionRecord | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  
  // New Request Form State
  const [newRequestData, setNewRequestData] = useState({
    patientId: "",
    doctorId: "",
    department: "Cardiology",
    roomType: "Deluxe Room",
    requestType: "Elective",
    priority: "High",
    preferredDate: "",
    reason: "",
    notes: "",
    insurance: "No"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Fetch admission requests (type: "Admission Request")
      const recordsRes = await recordsAPI.list(1, 200, "Admission Request");
      setRecords(recordsRes.data.records || []);

      // Fetch doctors and patients for the dropdown creation
      const [docsRes, patsRes] = await Promise.all([
        doctorAPI.list(1, 100),
        patientAPI.getAll(1, 100).catch(() => ({ data: { data: [] } }))
      ]);
      setDoctors(docsRes.data?.data || []);
      setPatients(patsRes.data?.data || patsRes.data?.patients || []);
    } catch (err) {
      console.error("Failed to load initial page data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Helpers
  const parseDetails = (detailsStr: string) => {
    try {
      if (detailsStr && detailsStr.startsWith("{")) {
        return JSON.parse(detailsStr);
      }
    } catch (e) {}

    const cleanNotes = detailsStr
      ? detailsStr.replace("Admission Recommended.\nJustification/Instructions: ", "")
      : "";
    return {
      priority: "Routine",
      requestedDepartment: "General Ward",
      recommendedRoomType: "General",
      admissionReason: "Clinical Assessment",
      clinicalNotes: cleanNotes || "Immediate room allotment advised.",
      attendingDoctorName: "Attending Doctor",
      attendingDoctorId: "",
      patientPhone: "+91 98765 43210",
      patientGender: "Male",
      patientDob: "1990-01-01",
      preferredDate: "22 May 2024",
      requestedBy: "Reception / John D.",
      sinceText: "Since 2h",
      insurance: "No"
    };
  };

  const calculateAge = (dobString: string) => {
    if (!dobString) return 30;
    try {
      const dob = new Date(dobString);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      return isNaN(age) ? 30 : age;
    } catch (e) {
      return 30;
    }
  };

  const handleAllocateRoom = (record: AdmissionRecord) => {
    const parsed = parseDetails(record.details);
    const doctorNameToShow = parsed.attendingDoctorName || "Unassigned";

    router.push(
      `/room-allotment/new?patientId=${parsed.patientId || ""}&patientName=${encodeURIComponent(record.patientName)}&notes=${encodeURIComponent(parsed.clinicalNotes || "")}&recordId=${record.id}&doctor=${encodeURIComponent(doctorNameToShow)}&department=${encodeURIComponent(parsed.requestedDepartment || "")}&roomType=${encodeURIComponent(parsed.recommendedRoomType || "")}&reason=${encodeURIComponent(parsed.admissionReason || "")}&priority=${encodeURIComponent(parsed.priority || "Routine")}`
    );
  };

  const updateRecordStatus = async (recordId: string, newStatus: string) => {
    try {
      await recordsAPI.updateStatus(recordId, newStatus);
      // Update local state
      setRecords(prev => prev.map(rec => {
        if (rec.id === recordId) {
          // Update status in record and detail's status
          const parsed = parseDetails(rec.details);
          parsed.sinceText = newStatus === "Pending Review" ? "Since 1h" : "Ready";
          return {
            ...rec,
            status: newStatus,
            details: JSON.stringify({ ...parsed, sinceText: parsed.sinceText })
          };
        }
        return rec;
      }));
      // Close open modals
      setIsViewOpen(false);
      setSelectedRecord(null);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update record status");
    }
  };

  // Seeding/Form Submission
  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    const selectedPat = patients.find(p => p.id === newRequestData.patientId);
    const selectedDoc = doctors.find(d => d.id === newRequestData.doctorId);

    if (!selectedPat) {
      setFormError("Please select a patient.");
      setIsSubmitting(false);
      return;
    }

    const patientName = selectedPat.name;
    const docName = selectedDoc ? selectedDoc.name : "Attending Doctor";

    const detailsJson = JSON.stringify({
      priority: newRequestData.priority,
      requestedDepartment: newRequestData.department,
      recommendedRoomType: newRequestData.roomType,
      admissionReason: newRequestData.reason || "Clinical Assessment",
      clinicalNotes: newRequestData.notes || "Routine admission requested.",
      attendingDoctorName: docName,
      attendingDoctorId: newRequestData.doctorId,
      preferredDate: newRequestData.preferredDate ? new Date(newRequestData.preferredDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Immediate",
      requestedBy: `Reception / ${user?.name || "Admin"}`,
      sinceText: "Since 1m",
      patientId: selectedPat.id,
      patientPhone: selectedPat.phone || "+91 98765 43210",
      patientGender: selectedPat.gender || "Male",
      patientDob: selectedPat.dob || "1990-01-01",
      insurance: newRequestData.insurance
    });

    try {
      const res = await recordsAPI.create({
        type: "Admission Request",
        patientName,
        date: new Date().toISOString(),
        details: detailsJson,
        status: "Pending Review"
      });

      // Update state and close modal
      setRecords(prev => [res.data, ...prev]);
      setIsNewRequestOpen(false);
      setNewRequestData({
        patientId: "",
        doctorId: "",
        department: "Cardiology",
        roomType: "Deluxe Room",
        requestType: "Elective",
        priority: "High",
        preferredDate: "",
        reason: "",
        notes: "",
        insurance: "No"
      });
    } catch (err: any) {
      console.error("Failed to create request:", err);
      setFormError(err.response?.data?.error || "Failed to create admission request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close dropdown helper
  useEffect(() => {
    const handleOutsideClick = () => setActiveDropdownId(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Filter Logic
  const filteredRecords = records.filter(rec => {
    const parsed = parseDetails(rec.details);
    
    // Search Query (Patient Name, UHID, Request ID, Mobile)
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const nameMatch = rec.patientName?.toLowerCase().includes(query);
      const reqIdMatch = rec.id?.toLowerCase().includes(query);
      const uhidMatch = (parsed.patientId || "").toLowerCase().includes(query);
      const phoneMatch = (parsed.patientPhone || "").toLowerCase().includes(query);
      if (!nameMatch && !reqIdMatch && !uhidMatch && !phoneMatch) return false;
    }

    // Date range filter
    if (startDate || endDate) {
      const recTime = new Date(rec.date).getTime();
      if (startDate) {
        const start = new Date(startDate + "T00:00:00").getTime();
        if (recTime < start) return false;
      }
      if (endDate) {
        const end = new Date(endDate + "T23:59:59").getTime();
        if (recTime > end) return false;
      }
    }

    // Department Filter
    if (selectedDept !== "All Departments") {
      if (parsed.requestedDepartment?.toLowerCase() !== selectedDept.toLowerCase()) return false;
    }

    // Request Type Filter
    if (selectedType !== "All Types") {
      const type = parsed.admissionReason?.toLowerCase() === "emergency" ? "Emergency" : (parsed.requestType || "Elective");
      if (type.toLowerCase() !== selectedType.toLowerCase()) return false;
    }

    // Priority Filter
    if (selectedPriority !== "All Priorities") {
      if (parsed.priority?.toLowerCase() !== selectedPriority.toLowerCase()) return false;
    }

    // Status Filter
    if (selectedStatus !== "All Status") {
      let filterStatus = selectedStatus.toLowerCase();
      let recordStatus = rec.status.toLowerCase();
      // Handle Pending Review maps
      if (filterStatus === "pending") filterStatus = "pending review";
      if (recordStatus === "pending") recordStatus = "pending review";
      
      if (recordStatus !== filterStatus) return false;
    }

    // Requested By Filter
    if (selectedRequestedBy !== "All Users") {
      const role = parsed.requestedBy?.toLowerCase().split(" / ")[0] || "";
      if (role !== selectedRequestedBy.toLowerCase()) return false;
    }

    // Insurance Filter
    if (selectedInsurance !== "All") {
      const ins = parsed.insurance || "No";
      if (ins.toLowerCase() !== selectedInsurance.toLowerCase()) return false;
    }

    return true;
  });

  // Calculate Dynamic counters based on UNFILTERED Admission Requests
  const totalCount = records.length;
  const pendingCount = records.filter(r => ["pending", "pending review"].includes(r.status.toLowerCase())).length;
  const approvedCount = records.filter(r => r.status.toLowerCase() === "approved").length;
  const onHoldCount = records.filter(r => r.status.toLowerCase() === "on hold").length;
  const rejectedCount = records.filter(r => r.status.toLowerCase() === "rejected").length;

  // Pagination
  const totalFiltered = filteredRecords.length;
  const totalPages = Math.ceil(totalFiltered / rowsPerPage);
  const paginatedRecords = filteredRecords.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending review":
      case "pending":
        return { text: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400", dot: "bg-amber-500" };
      case "approved":
        return { text: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400", dot: "bg-emerald-500" };
      case "on hold":
        return { text: "text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-900/30 dark:text-purple-400", dot: "bg-purple-500" };
      case "rejected":
        return { text: "text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400", dot: "bg-rose-500" };
      default:
        return { text: "text-slate-600 bg-slate-50 border-slate-200 dark:bg-slate-900/20 dark:border-slate-800/30 dark:text-slate-400", dot: "bg-slate-500" };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
      case "emergency":
        return "text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/20 dark:text-rose-400";
      case "medium":
      case "urgent":
        return "text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/20 dark:text-amber-400";
      default:
        return "text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/20 dark:text-blue-400";
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-dark-primary min-h-screen p-6 text-slate-800 dark:text-slate-100 space-y-6">
      
      {/* Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-gray-400 mb-2">
            <span className="hover:text-slate-600 cursor-pointer">Home</span>
            <ChevronRight size={12} />
            <span>IPD Management</span>
            <ChevronRight size={12} />
            <span>Admissions</span>
            <ChevronRight size={12} />
            <span className="text-slate-600 dark:text-gray-200 font-medium">Admission Requests</span>
          </nav>
          
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-sans flex items-center gap-2">
            <Activity className="text-blue-600 dark:text-blue-400" size={24} />
            Admission Requests
          </h1>
        </div>
        
        {/* New Admission Request Button */}
        <button
          onClick={() => setIsNewRequestOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all duration-200 flex items-center gap-1.5 active:scale-95 shrink-0"
        >
          <Plus size={16} />
          New Admission Request
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Requests */}
        <div className="bg-white dark:bg-dark-secondary p-4 rounded-xl border border-slate-200 dark:border-dark-tertiary shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
            <FileSpreadsheet size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{totalCount}</div>
            <div className="text-[10px] text-slate-400 dark:text-gray-400 uppercase tracking-wider font-semibold">Total Requests</div>
            <div className="text-[10px] text-slate-500 mt-0.5">All Status</div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white dark:bg-dark-secondary p-4 rounded-xl border border-slate-200 dark:border-dark-tertiary shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg shrink-0">
            <Clock size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{pendingCount}</div>
            <div className="text-[10px] text-slate-400 dark:text-gray-400 uppercase tracking-wider font-semibold">Pending</div>
            <div className="text-[10px] text-amber-600 mt-0.5">Awaiting Review</div>
          </div>
        </div>

        {/* Approved */}
        <div className="bg-white dark:bg-dark-secondary p-4 rounded-xl border border-slate-200 dark:border-dark-tertiary shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{approvedCount}</div>
            <div className="text-[10px] text-slate-400 dark:text-gray-400 uppercase tracking-wider font-semibold">Approved</div>
            <div className="text-[10px] text-emerald-600 mt-0.5">Ready for Admission</div>
          </div>
        </div>

        {/* On Hold */}
        <div className="bg-white dark:bg-dark-secondary p-4 rounded-xl border border-slate-200 dark:border-dark-tertiary shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg shrink-0">
            <AlertCircle size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{onHoldCount}</div>
            <div className="text-[10px] text-slate-400 dark:text-gray-400 uppercase tracking-wider font-semibold">On Hold</div>
            <div className="text-[10px] text-purple-600 mt-0.5">Need Additional Info</div>
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-white dark:bg-dark-secondary p-4 rounded-xl border border-slate-200 dark:border-dark-tertiary shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg shrink-0">
            <UserX size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{rejectedCount}</div>
            <div className="text-[10px] text-slate-400 dark:text-gray-400 uppercase tracking-wider font-semibold">Rejected</div>
            <div className="text-[10px] text-rose-600 mt-0.5">Not Approved</div>
          </div>
        </div>
      </div>

      {/* Filters & Table Card */}
      <div className="bg-white dark:bg-dark-secondary border border-slate-200 dark:border-dark-tertiary rounded-xl shadow-sm p-6 space-y-6">
        
        {/* Filters Toolbar */}
        <div className="space-y-4">
          
          {/* Row 1 Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Request Date Range */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-gray-400">Request Date Range</label>
              <div className="flex items-center gap-1">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                  className="w-full bg-slate-50 dark:bg-dark-tertiary/40 border border-slate-200 dark:border-dark-tertiary rounded px-2 py-1.5 text-xs text-slate-700 dark:text-white outline-none focus:border-blue-500"
                />
                <span className="text-slate-400 text-xs">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                  className="w-full bg-slate-50 dark:bg-dark-tertiary/40 border border-slate-200 dark:border-dark-tertiary rounded px-2 py-1.5 text-xs text-slate-700 dark:text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Department */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-gray-400">Department</label>
              <select
                value={selectedDept}
                onChange={(e) => { setSelectedDept(e.target.value); setPage(1); }}
                className="w-full bg-slate-50 dark:bg-dark-tertiary/40 border border-slate-200 dark:border-dark-tertiary rounded px-3 py-2 text-xs text-slate-700 dark:text-white outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="All Departments">All Departments</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Neurology">Neurology</option>
                <option value="Gynecology">Gynecology</option>
                <option value="General Surgery">General Surgery</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Oncology">Oncology</option>
                <option value="ENT">ENT</option>
                <option value="Urology">Urology</option>
                <option value="Pulmonology">Pulmonology</option>
              </select>
            </div>

            {/* Request Type */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-gray-400">Request Type</label>
              <select
                value={selectedType}
                onChange={(e) => { setSelectedType(e.target.value); setPage(1); }}
                className="w-full bg-slate-50 dark:bg-dark-tertiary/40 border border-slate-200 dark:border-dark-tertiary rounded px-3 py-2 text-xs text-slate-700 dark:text-white outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="All Types">All Types</option>
                <option value="Elective">Elective</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            {/* Priority */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-gray-400">Priority</label>
              <select
                value={selectedPriority}
                onChange={(e) => { setSelectedPriority(e.target.value); setPage(1); }}
                className="w-full bg-slate-50 dark:bg-dark-tertiary/40 border border-slate-200 dark:border-dark-tertiary rounded px-3 py-2 text-xs text-slate-700 dark:text-white outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="All Priorities">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-gray-400">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
                className="w-full bg-slate-50 dark:bg-dark-tertiary/40 border border-slate-200 dark:border-dark-tertiary rounded px-3 py-2 text-xs text-slate-700 dark:text-white outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="All Status">All Status</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Approved">Approved</option>
                <option value="On Hold">On Hold</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Row 2 Search, Requested By, Insurance & Reset */}
          <div className="flex flex-col lg:flex-row items-end justify-between gap-4 pt-2 border-t border-slate-100 dark:border-dark-tertiary/40">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto flex-1">
              
              {/* Requested By */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-gray-400">Requested By</label>
                <select
                  value={selectedRequestedBy}
                  onChange={(e) => { setSelectedRequestedBy(e.target.value); setPage(1); }}
                  className="w-full bg-slate-50 dark:bg-dark-tertiary/40 border border-slate-200 dark:border-dark-tertiary rounded px-3 py-2 text-xs text-slate-700 dark:text-white outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="All Users">All Users</option>
                  <option value="Reception">Reception</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              {/* Insurance */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-gray-400">Insurance</label>
                <select
                  value={selectedInsurance}
                  onChange={(e) => { setSelectedInsurance(e.target.value); setPage(1); }}
                  className="w-full bg-slate-50 dark:bg-dark-tertiary/40 border border-slate-200 dark:border-dark-tertiary rounded px-3 py-2 text-xs text-slate-700 dark:text-white outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Reset Filters */}
              <div className="flex items-end h-full">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedDept("All Departments");
                    setSelectedType("All Types");
                    setSelectedPriority("All Priorities");
                    setSelectedStatus("All Status");
                    setSelectedRequestedBy("All Users");
                    setSelectedInsurance("All");
                    setStartDate("2024-05-01");
                    setEndDate("2024-05-21");
                    setPage(1);
                  }}
                  className="text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white text-xs border border-slate-200 dark:border-dark-tertiary bg-slate-50 dark:bg-dark-tertiary/40 px-3 py-2 rounded flex items-center justify-center gap-1 w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Search Input Box */}
            <div className="relative w-full lg:max-w-md shrink-0">
              <input
                type="text"
                placeholder="Search by patient name, UHID, mobile, request ID..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="w-full bg-slate-50 dark:bg-dark-tertiary/40 border border-slate-200 dark:border-dark-tertiary rounded-lg pl-3 pr-10 py-2.5 text-xs text-slate-700 dark:text-white outline-none focus:border-blue-500 shadow-inner animate-[pulse_3s_infinite]"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-400" size={16} />
            </div>

            {/* Filters count text */}
            <div className="flex items-center gap-1 text-slate-500 dark:text-gray-400 font-semibold text-xs py-2 shrink-0">
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto border border-slate-100 dark:border-dark-tertiary/40 rounded-lg shadow-inner">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 dark:bg-dark-tertiary/40 text-slate-500 dark:text-gray-400 font-bold uppercase border-b border-slate-200 dark:border-dark-tertiary">
                <th className="p-3 w-4">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer animate-[pulse_2s_infinite]" />
                </th>
                <th className="p-3 font-semibold">Request ID</th>
                <th className="p-3 font-semibold">Request Date & Time</th>
                <th className="p-3 font-semibold">Patient Details</th>
                <th className="p-3 font-semibold">Department / Bed Type</th>
                <th className="p-3 font-semibold">Preferred Date</th>
                <th className="p-3 font-semibold">Request Type</th>
                <th className="p-3 font-semibold">Priority</th>
                <th className="p-3 font-semibold">Requested By</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-tertiary/20">
              {loading ? (
                <tr>
                  <td colSpan={11} className="p-16 text-center text-slate-500 dark:text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="animate-pulse">Loading admission requests...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-16 text-center text-slate-400 dark:text-gray-500 italic">
                    No matching admission requests found for current filters.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record) => {
                  const parsed = parseDetails(record.details);
                  const statusInfo = getStatusColor(record.status);
                  const pAge = calculateAge(parsed.patientDob);
                  const pGender = parsed.patientGender || "Male";
                  const pPhone = parsed.patientPhone || "+91 98765 43210";
                  
                  const isEmergency = parsed.admissionReason?.toLowerCase() === "emergency" || parsed.requestType?.toLowerCase() === "emergency";
                  const requestTypeLabel = isEmergency ? "Emergency" : (parsed.requestType || "Elective");

                  return (
                    <tr 
                      key={record.id} 
                      className={`hover:bg-slate-50 dark:hover:bg-dark-tertiary/10 transition-colors group ${
                        isEmergency && ["pending review", "pending"].includes(record.status.toLowerCase()) ? "bg-rose-50/20 dark:bg-rose-950/5" : ""
                      }`}
                    >
                      <td className="p-3">
                        <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                      </td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        {record.id}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-gray-300">
                        {new Date(record.date).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}{" "}
                        {new Date(record.date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <button
                            onClick={() => { setSelectedRecord(record); setIsViewOpen(true); }}
                            className="font-bold text-blue-600 dark:text-blue-400 hover:underline text-left cursor-pointer transition-colors"
                          >
                            {record.patientName}
                          </button>
                          <span className="text-[10px] text-slate-400 dark:text-gray-500 mt-0.5 leading-none">
                            UHID: {parsed.patientId ? parsed.patientId.slice(0, 8).toUpperCase() : record.id} | {pAge} Y / {pGender}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-gray-500 leading-normal font-mono">
                            {pPhone}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 dark:text-gray-200">{parsed.requestedDepartment || "General Medicine"}</span>
                          <span className="text-[10px] text-slate-400 dark:text-gray-500">{parsed.recommendedRoomType || "Private Room"}</span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-gray-300 font-medium">
                        {parsed.preferredDate || "Immediate"}
                      </td>
                      <td className="p-3 font-medium">
                        <span className={`px-2 py-0.5 rounded text-[10px] border ${
                          isEmergency ? "text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30 animate-pulse" : "text-slate-600 bg-slate-50 border-slate-100 dark:bg-slate-900/20 dark:border-slate-800/30"
                        }`}>
                          {requestTypeLabel}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] border ${getPriorityColor(parsed.priority)} font-semibold`}>
                          {parsed.priority || "Medium"}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-gray-300">
                        <div className="flex flex-col">
                          <span className="font-semibold">{parsed.requestedBy?.split(" / ")[0] || "Reception"}</span>
                          <span className="text-[10px] text-slate-400 dark:text-gray-500">{parsed.requestedBy?.split(" / ")[1] || "Staff"}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col gap-0.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 w-max ${statusInfo.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                            {record.status === "Pending" ? "Pending Review" : record.status}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-gray-500 italic pl-1 mt-0.5">
                            {parsed.sinceText || "Since 2h"}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View details */}
                          <button
                            onClick={() => { setSelectedRecord(record); setIsViewOpen(true); }}
                            title="View Details"
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-dark-tertiary text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white rounded border border-slate-200 dark:border-dark-tertiary transition-all cursor-pointer"
                          >
                            <Eye size={13} />
                          </button>
                          
                          {/* Edit / Allot bed */}
                          {["pending", "pending review", "approved"].includes(record.status.toLowerCase()) ? (
                            <button
                              onClick={() => handleAllocateRoom(record)}
                              title="Allocate Bed"
                              className="p-1.5 bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded border border-blue-200 dark:border-blue-900/30 transition-all cursor-pointer"
                            >
                              <Bed size={13} />
                            </button>
                          ) : (
                            <div className="w-7 h-7" />
                          )}
                          
                          {/* Patient documents */}
                          <Link 
                            href={`/patients/${parsed.patientId || ""}`}
                            title="View Patient Files"
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-dark-tertiary text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white rounded border border-slate-200 dark:border-dark-tertiary transition-all"
                          >
                            <FileText size={13} />
                          </Link>

                          {/* Context triple-dot dropdown */}
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdownId(activeDropdownId === record.id ? null : record.id);
                              }}
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-dark-tertiary text-slate-500 rounded border border-slate-200 dark:border-dark-tertiary transition-all cursor-pointer"
                            >
                              <MoreVertical size={13} />
                            </button>

                            {/* Dropdown Menu */}
                            {activeDropdownId === record.id && (
                              <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-dark-secondary border border-slate-200 dark:border-dark-tertiary rounded-lg shadow-lg z-20 py-1 text-xs">
                                <button
                                  onClick={() => handleAllocateRoom(record)}
                                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-dark-tertiary/35 text-blue-600 flex items-center gap-1 cursor-pointer"
                                >
                                  <Bed size={12} />
                                  Allocate Bed
                                </button>
                                <button
                                  onClick={() => updateRecordStatus(record.id, "Approved")}
                                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-dark-tertiary/35 text-emerald-600 flex items-center gap-1 cursor-pointer"
                                >
                                  <Check size={12} />
                                  Approve
                                </button>
                                <button
                                  onClick={() => updateRecordStatus(record.id, "On Hold")}
                                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-dark-tertiary/35 text-purple-600 flex items-center gap-1 cursor-pointer"
                                >
                                  <Clock size={12} />
                                  On Hold
                                </button>
                                <button
                                  onClick={() => updateRecordStatus(record.id, "Rejected")}
                                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-dark-tertiary/35 text-rose-600 flex items-center gap-1 cursor-pointer"
                                >
                                  <X size={12} />
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer, Pagination & Entry counter */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100 dark:border-dark-tertiary/40 text-xs text-slate-500 dark:text-gray-400">
          <div>
            Showing {totalFiltered > 0 ? (page - 1) * rowsPerPage + 1 : 0} to{" "}
            {Math.min(page * rowsPerPage, totalFiltered)} of {totalFiltered} entries
          </div>

          <div className="flex items-center gap-4">
            {/* Rows Per Page dropdown */}
            <div className="flex items-center gap-1">
              <span>Rows per page</span>
              <select
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(1); }}
                className="bg-white dark:bg-dark-tertiary/40 border border-slate-200 dark:border-dark-tertiary rounded px-1 py-1 text-xs text-slate-700 dark:text-white outline-none cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 border border-slate-200 dark:border-dark-tertiary bg-white dark:bg-dark-secondary hover:bg-slate-100 dark:hover:bg-dark-tertiary/50 disabled:opacity-50 disabled:cursor-not-allowed rounded text-slate-500 cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-7 h-7 flex items-center justify-center rounded font-semibold text-xs border transition-all cursor-pointer ${
                    page === i + 1
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                      : "border-slate-200 dark:border-dark-tertiary bg-white dark:bg-dark-secondary hover:bg-slate-100 dark:hover:bg-dark-tertiary/50 text-slate-700 dark:text-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 border border-slate-200 dark:border-dark-tertiary bg-white dark:bg-dark-secondary hover:bg-slate-100 dark:hover:bg-dark-tertiary/50 disabled:opacity-50 disabled:cursor-not-allowed rounded text-slate-500 cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Legend status indicators */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs pt-4 border-t border-slate-100 dark:border-dark-tertiary/40 text-slate-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Pending: Awaiting review and approval</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Approved: Ready for admission</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span>On Hold: Additional information required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Rejected: Request not approved</span>
          </div>
        </div>

      </div>

      {/* VIEW ADMISSION REQUEST MODAL */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => { setIsViewOpen(false); setSelectedRecord(null); }}
        title="Admission Request Details"
        size="lg"
      >
        {selectedRecord && (() => {
          const parsed = parseDetails(selectedRecord.details);
          const statusInfo = getStatusColor(selectedRecord.status);
          const pAge = calculateAge(parsed.patientDob);
          
          return (
            <div className="space-y-6 pt-2 pb-4 text-slate-700 dark:text-gray-200">
              
              {/* Header Box */}
              <div className="bg-slate-50 dark:bg-dark-tertiary/30 p-4 rounded-lg flex items-center justify-between border border-slate-100 dark:border-dark-tertiary/40">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{selectedRecord.patientName}</h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                    UHID: {parsed.patientId ? parsed.patientId.slice(0, 8).toUpperCase() : selectedRecord.id} | {pAge} Y / {parsed.patientGender}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${statusInfo.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                    {selectedRecord.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{parsed.sinceText}</p>
                </div>
              </div>

              {/* Info Details Grid */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
                <div>
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Request Date & Time</h4>
                  <p className="mt-1 font-medium text-slate-800 dark:text-gray-100">
                    {new Date(selectedRecord.date).toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Preferred Date</h4>
                  <p className="mt-1 font-medium text-slate-800 dark:text-gray-100">
                    {parsed.preferredDate || "Immediate"}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Department / Bed Type</h4>
                  <p className="mt-1 font-medium text-slate-800 dark:text-gray-100">
                    {parsed.requestedDepartment} / {parsed.recommendedRoomType}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Priority & Type</h4>
                  <p className="mt-1 font-medium text-slate-800 dark:text-gray-100">
                    {parsed.priority} / {parsed.admissionReason?.toLowerCase() === "emergency" ? "Emergency" : (parsed.requestType || "Elective")}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Requested By</h4>
                  <p className="mt-1 font-medium text-slate-800 dark:text-gray-100">
                    {parsed.requestedBy || "Emergency / Mike R."}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Attending Doctor</h4>
                  <p className="mt-1 font-medium text-slate-800 dark:text-gray-100">
                    Dr. {parsed.attendingDoctorName || "Unassigned"}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Insurance</h4>
                  <p className="mt-1 font-medium text-slate-800 dark:text-gray-100">
                    {parsed.insurance || "No"}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Request ID</h4>
                  <p className="mt-1 font-medium text-slate-800 dark:text-gray-100">
                    {selectedRecord.id}
                  </p>
                </div>
              </div>

              {/* Admission Reason */}
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Admission Reason</h4>
                <p className="mt-1 bg-slate-50 dark:bg-dark-tertiary/20 p-2.5 border border-slate-100 dark:border-dark-tertiary/30 rounded text-xs text-slate-800 dark:text-gray-200">
                  {parsed.admissionReason}
                </p>
              </div>

              {/* Clinical Notes */}
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Clinical Justification & Notes</h4>
                <p className="mt-1 bg-slate-50 dark:bg-dark-tertiary/20 p-2.5 border border-slate-100 dark:border-dark-tertiary/30 rounded text-xs text-slate-800 dark:text-gray-200">
                  {parsed.clinicalNotes || "No details or notes provided."}
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-wrap justify-end gap-2 pt-4 border-t border-slate-100 dark:border-dark-tertiary/40">
                {/* Status action toggles */}
                {selectedRecord.status !== "Approved" && (
                  <button
                    onClick={() => updateRecordStatus(selectedRecord.id, "Approved")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-all"
                  >
                    Approve Request
                  </button>
                )}
                {selectedRecord.status !== "On Hold" && (
                  <button
                    onClick={() => updateRecordStatus(selectedRecord.id, "On Hold")}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-all"
                  >
                    Put on Hold
                  </button>
                )}
                {selectedRecord.status !== "Rejected" && (
                  <button
                    onClick={() => updateRecordStatus(selectedRecord.id, "Rejected")}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-all"
                  >
                    Reject Request
                  </button>
                )}

                {/* Allocate Bed (Pushes to bed allocation page) */}
                {["pending review", "pending", "approved"].includes(selectedRecord.status.toLowerCase()) && (
                  <button
                    onClick={() => handleAllocateRoom(selectedRecord)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                  >
                    <Bed size={14} />
                    Allocate Bed
                  </button>
                )}
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* NEW ADMISSION REQUEST MODAL */}
      <Modal
        isOpen={isNewRequestOpen}
        onClose={() => setIsNewRequestOpen(false)}
        title="Create New Admission Request"
        size="lg"
      >
        <form onSubmit={handleCreateRequest} className="space-y-4 pt-2 pb-4 text-xs text-slate-700 dark:text-gray-200">
          
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          {/* Grid fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Patient Select */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-slate-600 dark:text-gray-400">Select Patient <span className="text-rose-500">*</span></label>
              <select
                required
                value={newRequestData.patientId}
                onChange={(e) => setNewRequestData(prev => ({ ...prev, patientId: e.target.value }))}
                className="bg-slate-50 dark:bg-dark-tertiary/40 border border-slate-200 dark:border-dark-tertiary rounded px-3 py-2 outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="">-- Choose Patient --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (UHID: {p.id.slice(0, 8).toUpperCase()})</option>
                ))}
              </select>
            </div>

            {/* Doctor Select */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-slate-600 dark:text-gray-400">Attending Doctor <span className="text-rose-500">*</span></label>
              <select
                required
                value={newRequestData.doctorId}
                onChange={(e) => setNewRequestData(prev => ({ ...prev, doctorId: e.target.value }))}
                className="bg-slate-50 dark:bg-dark-tertiary/40 border border-slate-200 dark:border-dark-tertiary rounded px-3 py-2 outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="">-- Choose Doctor --</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-slate-600 dark:text-gray-400">Requested Department</label>
              <select
                value={newRequestData.department}
                onChange={(e) => setNewRequestData(prev => ({ ...prev, department: e.target.value }))}
                className="bg-slate-50 dark:bg-dark-tertiary/40 border border-slate-200 dark:border-dark-tertiary rounded px-3 py-2 outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Cardiology">Cardiology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Neurology">Neurology</option>
                <option value="Gynecology">Gynecology</option>
                <option value="General Surgery">General Surgery</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Oncology">Oncology</option>
                <option value="ENT">ENT</option>
                <option value="Urology">Urology</option>
                <option value="Pulmonology">Pulmonology</option>
              </select>
            </div>

            {/* Room Type */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-slate-600 dark:text-gray-400">Preferred Room Type</label>
              <select
                value={newRequestData.roomType}
                onChange={(e) => setNewRequestData(prev => ({ ...prev, roomType: e.target.value }))}
                className="bg-slate-50 dark:bg-dark-tertiary/40 border border-slate-200 dark:border-dark-tertiary rounded px-3 py-2 outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Deluxe Room">Deluxe Room</option>
                <option value="Private Room">Private Room</option>
                <option value="Super Deluxe">Super Deluxe</option>
                <option value="General Ward">General Ward</option>
                <option value="ICU">ICU</option>
              </select>
            </div>

            {/* Request Type */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-slate-600 dark:text-gray-400">Request Type</label>
              <select
                value={newRequestData.requestType}
                onChange={(e) => setNewRequestData(prev => ({ ...prev, requestType: e.target.value }))}
                className="bg-slate-50 dark:bg-dark-tertiary/40 border border-slate-200 dark:border-dark-tertiary rounded px-3 py-2 outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Elective">Elective</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            {/* Priority */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-slate-600 dark:text-gray-400">Priority</label>
              <select
                value={newRequestData.priority}
                onChange={(e) => setNewRequestData(prev => ({ ...prev, priority: e.target.value }))}
                className="bg-slate-50 dark:bg-dark-tertiary/40 border border-slate-200 dark:border-dark-tertiary rounded px-3 py-2 outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Preferred Date */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-slate-600 dark:text-gray-400">Preferred Date of Admission</label>
              <input
                type="date"
                required
                value={newRequestData.preferredDate}
                onChange={(e) => setNewRequestData(prev => ({ ...prev, preferredDate: e.target.value }))}
                className="bg-slate-50 dark:bg-dark-tertiary/40 border border-slate-200 dark:border-dark-tertiary rounded px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

            {/* Insurance */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-slate-600 dark:text-gray-400">Covered by Insurance?</label>
              <select
                value={newRequestData.insurance}
                onChange={(e) => setNewRequestData(prev => ({ ...prev, insurance: e.target.value }))}
                className="bg-slate-50 dark:bg-dark-tertiary/40 border border-slate-200 dark:border-dark-tertiary rounded px-3 py-2 outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

          </div>

          {/* Admission Reason */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-slate-600 dark:text-gray-400">Diagnosis / Admission Reason <span className="text-rose-500">*</span></label>
            <input
              type="text"
              required
              placeholder="e.g. Chronic Renal Failure observation, Scheduled knee surgery, etc."
              value={newRequestData.reason}
              onChange={(e) => setNewRequestData(prev => ({ ...prev, reason: e.target.value }))}
              className="bg-slate-50 dark:bg-dark-tertiary/40 border border-slate-200 dark:border-dark-tertiary rounded px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-slate-600 dark:text-gray-400">Clinical Notes / Instructions</label>
            <textarea
              rows={3}
              placeholder="Provide specific notes or special requirements for the patient admission..."
              value={newRequestData.notes}
              onChange={(e) => setNewRequestData(prev => ({ ...prev, notes: e.target.value }))}
              className="bg-slate-50 dark:bg-dark-tertiary/40 border border-slate-200 dark:border-dark-tertiary rounded px-3 py-2 outline-none focus:border-blue-500 resize-none font-sans"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-dark-tertiary/40">
            <button
              type="button"
              onClick={() => setIsNewRequestOpen(false)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 dark:border-dark-tertiary dark:hover:bg-dark-tertiary/45 rounded font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded font-semibold cursor-pointer"
            >
              {isSubmitting ? "Creating..." : "Create Request"}
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
}
