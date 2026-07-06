"use client";

import { useState } from "react";

import { Search, Plus, IndianRupee, FileText, MoreVertical } from "lucide-react";
import Link from "next/link";
import DataTable, { Column } from "@/components/ui/DataTable";

interface Invoice {
 id: string;
 patient: string;
 patientId: string;
 date: string;
 dueDate: string;
 amount: number;
 balance: number;
 status: "Paid" | "Unpaid" | "Overdue" | "Partially Paid";
 insurance: string;
}

export default function InvoicesPage() {
 const [searchQuery, setSearchQuery] = useState("");
 const [statusFilter, setStatusFilter] = useState("all");
 const [activeTab, setActiveTab] = useState("all");

 const [invoices] = useState<Invoice[]>([
 {
 id: "INV-007",
 patient: "David Miller",
 patientId: "P-00145",
 date: "2023-04-10",
 dueDate: "Due Apr 15 2023",
 amount: 845.5,
 balance: 0,
 status: "Paid",
 insurance: "Blue Cross Blue Shield",
 },
 {
 id: "INV-006",
 patient: "Michael Johnson",
 patientId: "P-00289",
 date: "2023-04-08",
 dueDate: "Due Apr 15 2023",
 amount: 1234.5,
 balance: 234.5,
 status: "Partially Paid",
 insurance: "Aetna",
 },
 {
 id: "INV-005",
 patient: "Emily Davis",
 patientId: "P-00312",
 date: "2023-04-05",
 dueDate: "Due Apr 10 2023",
 amount: 2134.5,
 balance: 0,
 status: "Paid",
 insurance: "UnitedHealthcare",
 },
 {
 id: "INV-004",
 patient: "John Smith",
 patientId: "P-00156",
 date: "2023-04-02",
 dueDate: "Due Apr 07 2023",
 amount: 1234.5,
 balance: 234.5,
 status: "Overdue",
 insurance: "Cigna",
 },
 {
 id: "INV-003",
 patient: "Sarah Thompson",
 patientId: "P-00198",
 date: "2023-04-01",
 dueDate: "Due Apr 06 2023",
 amount: 3456.5,
 balance: 0,
 status: "Paid",
 insurance: "Humana",
 },
 {
 id: "INV-002",
 patient: "Robert Wilson",
 patientId: "P-00234",
 date: "2023-03-28",
 dueDate: "Due Apr 02 2023",
 amount: 675.5,
 balance: 0,
 status: "Paid",
 insurance: "Medicare",
 },
 {
 id: "INV-001",
 patient: "Jessica Brown",
 patientId: "P-00267",
 date: "2023-03-25",
 dueDate: "Due Mar 30 2023",
 amount: 2345.5,
 balance: 0,
 status: "Paid",
 insurance: "Kaiser Permanente",
 },
 ]);

 const getStatusColor = (status: string) => {
 switch (status) {
 case "Paid":
 return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
 case "Unpaid":
 return "bg-red-500/10 text-red-500 border border-red-500/20";
 case "Overdue":
 return "bg-red-500/10 text-red-500 border border-red-500/20";
 case "Partially Paid":
 return "bg-orange-500/10 text-orange-500 border border-orange-500/20";
 default:
 return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
 }
 };

 const filteredInvoices = invoices.filter((invoice) => {
 const matchesSearch =
 invoice.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
 invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
 invoice.patientId.toLowerCase().includes(searchQuery.toLowerCase());
 const matchesStatus =
 statusFilter === "all" || invoice.status === statusFilter;
 const matchesTab =
 activeTab === "all" ||
 (activeTab === "unpaid" && invoice.status === "Unpaid") ||
 (activeTab === "paid" && invoice.status === "Paid") ||
 (activeTab === "overdue" && invoice.status === "Overdue");
 return matchesSearch && matchesStatus && matchesTab;
 });

 const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balance, 0);
 const paidThisMonth = invoices
 .filter((inv) => inv.status === "Paid")
 .reduce((sum, inv) => sum + inv.amount, 0);
 const overdueInvoices = invoices.filter(
 (inv) => inv.status === "Overdue"
 ).length;
 const insuranceClaims = 5;

    const columns_0: Column<any>[] = [
      { header: "Invoice #", accessor: (invoice) => (<>\n{invoice.id}\n</>) },
      { header: "Patient", accessor: (invoice) => (<>\n<div className="flex items-center gap-3">
     <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center font-semibold text-emerald-500">
     {invoice.patient
     .split(" ")
     .map((n) => n[0])
     .join("")}
     </div>
     <div>
     <div className="font-medium text-white">
     {invoice.patient}
     </div>
     <div className="text-mdtext-gray-400">
     {invoice.patientId}
     </div>
     </div>
     </div>\n</>) },
      { header: "Date", accessor: (invoice) => (<>\n<div className="text-white">{invoice.date}</div>\n\n<div className="text-mdtext-gray-400">
     {invoice.dueDate}
     </div>\n</>) },
      { header: "Amount", accessor: (invoice) => (<>₹\n{invoice.amount.toFixed(2)}\n</>) },
      { header: "Balance", accessor: (invoice) => (<>₹\n{invoice.balance.toFixed(2)}\n</>) },
      { header: "Status", accessor: (invoice) => (<>\n<span
     className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
     invoice.status
     )}`}
     >
     {invoice.status}
     </span>\n</>) },
      { header: "Insurance", accessor: (invoice) => (<>\n{invoice.insurance}\n</>) },
      { header: "Actions", accessor: (invoice) => (<>\n<button className="p-2 hover:bg-gray-500/20 rounded transition-colors">
     <MoreVertical size={18} className="text-gray-400" />
     </button>\n</>) },
    ];


 return (
 <>
 <div className="space-y-6">
 <div className="flex justify-between items-center">
 <div>
 <h1 className="text-3xl font-bold mb-2">Invoices</h1>
 <p className="text-gray-400">
 Manage billing and invoices for your patients
 </p>
 </div>
 <div className="flex gap-3">
 <button className="btn-secondary">Payments</button>
 <button className="btn-secondary">Insurance Claims</button>
 <Link href="/billing/create-invoice">
 <button className="btn-primary flex items-center gap-2">
 <Plus size={20} />
 Create Invoice
 </button>
 </Link>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
 <div className="card">
 <div className="flex items-center gap-3">
 <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
 <IndianRupee className="text-blue-500" size={24} />
 </div>
 <div>
 <div className="text-2xl font-bold">
 ₹{totalOutstanding.toFixed(2)}
 </div>
 <div className="text-mdtext-gray-400">Total Outstanding</div>
 <div className="text-xs text-red-500">Pending payments</div>
 </div>
 </div>
 </div>

 <div className="card">
 <div className="flex items-center gap-3">
 <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
 <IndianRupee className="text-emerald-500" size={24} />
 </div>
 <div>
 <div className="text-2xl font-bold">
 ₹{paidThisMonth.toFixed(2)}
 </div>
 <div className="text-mdtext-gray-400">Paid This Month</div>
 <div className="text-xs text-emerald-500">
 Successfully collected
 </div>
 </div>
 </div>
 </div>

 <div className="card">
 <div className="flex items-center gap-3">
 <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
 <FileText className="text-red-500" size={24} />
 </div>
 <div>
 <div className="text-2xl font-bold">{overdueInvoices}</div>
 <div className="text-mdtext-gray-400">Overdue Invoices</div>
 <div className="text-xs text-red-500">Require attention</div>
 </div>
 </div>
 </div>

 <div className="card">
 <div className="flex items-center gap-3">
 <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
 <FileText className="text-purple-500" size={24} />
 </div>
 <div>
 <div className="text-2xl font-bold">{insuranceClaims}</div>
 <div className="text-mdtext-gray-400">Insurance Claims</div>
 <div className="text-xs text-purple-500">Pending approval</div>
 </div>
 </div>
 </div>
 </div>

 <div className="card">
 <h2 className="text-xl font-semibold mb-6">All Invoices</h2>
 <p className="text-gray-400 text-mdmb-6">Showing all invoices</p>

 <div className="flex items-center gap-2 mb-6 pb-4 border-b border-dark-tertiary">
 <Search size={20} className="text-gray-400" />
 <input
 type="text"
 placeholder="Search invoices..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="bg-transparent flex-1 outline-none"
 />
 </div>

 <div className="flex gap-4 mb-6 border-b border-dark-tertiary">
 <button
 onClick={() => setActiveTab("all")}
 className={`pb-3 px-1 font-medium transition-colors ${
 activeTab === "all"
 ? "text-emerald-500 border-b-2 border-emerald-500"
 : "text-gray-400 hover:text-gray-300"
 }`}
 >
 All Invoices
 </button>
 <button
 onClick={() => setActiveTab("unpaid")}
 className={`pb-3 px-1 font-medium transition-colors ${
 activeTab === "unpaid"
 ? "text-emerald-500 border-b-2 border-emerald-500"
 : "text-gray-400 hover:text-gray-300"
 }`}
 >
 Unpaid
 </button>
 <button
 onClick={() => setActiveTab("paid")}
 className={`pb-3 px-1 font-medium transition-colors ${
 activeTab === "paid"
 ? "text-emerald-500 border-b-2 border-emerald-500"
 : "text-gray-400 hover:text-gray-300"
 }`}
 >
 Paid
 </button>
 <button
 onClick={() => setActiveTab("overdue")}
 className={`pb-3 px-1 font-medium transition-colors ${
 activeTab === "overdue"
 ? "text-emerald-500 border-b-2 border-emerald-500"
 : "text-gray-400 hover:text-gray-300"
 }`}
 >
 Overdue
 </button>
 </div>

 <div className="flex gap-3 mb-6">
 <select
 value={statusFilter}
 onChange={(e) => setStatusFilter(e.target.value)}
 className="input-field"
 >
 <option value="all">All Status</option>
 <option value="Paid">Paid</option>
 <option value="Unpaid">Unpaid</option>
 <option value="Overdue">Overdue</option>
 <option value="Partially Paid">Partially Paid</option>
 </select>
 <button className="btn-secondary ml-auto">Export</button>
 </div>

 <div className="overflow-x-auto">
 <DataTable columns={columns_0} data={filteredInvoices} enableLocalSearch enableLocalPagination />
 </div>
 </div>
 </div>
 </>
 );
}
