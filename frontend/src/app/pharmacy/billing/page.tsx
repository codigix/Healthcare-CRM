"use client";

import { useState, useEffect } from "react";
import { invoiceAPI } from "@/lib/api";
import { FileText, ArrowLeft, RefreshCw, Loader, Search, Eye, CreditCard, CheckCircle, Clock, AlertTriangle, Download, X } from "lucide-react";
import Link from "next/link";
import DataTable, { Column } from "@/components/ui/DataTable";

interface PharmacyBill {
   id: string;
   patientName: string;
   uhid: string;
   invoiceDate: string;
   totalAmount: number;
   paidAmount: number;
   remainingAmount: number;
   paymentStatus: "Paid" | "Pending" | "Refunded";
   paymentMethod: string;
   prescriptionId: string;
   notes: string;
}

export default function PharmacyBillingPage() {
   const [bills, setBills] = useState<PharmacyBill[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedBill, setSelectedBill] = useState<PharmacyBill | null>(null);
   const [paymentLoading, setPaymentLoading] = useState(false);
   const [downloadingPdf, setDownloadingPdf] = useState(false);

   useEffect(() => {
      fetchPharmacyBills();
   }, []);

   const fetchPharmacyBills = async () => {
      try {
         setLoading(true);
         setError("");

         const response = await invoiceAPI.list(1, 100);
         const invoices = response.data.invoices || [];

         // Format and generate high-fidelity billing entries based on database realities
         const formatted = invoices.map((inv: any, index: number) => {
            const paymentStatus = inv.status ? (inv.status.charAt(0).toUpperCase() + inv.status.slice(1).toLowerCase()) : "Pending";
            const paymentMethod = inv.notes?.includes("IPD") ? "Inpatient Ledger" : (paymentStatus === "Paid" ? "Cash" : "Awaiting Payment");

            // Extract Prescription Reference RX-XXXXX
            const match = inv.notes?.match(/RX-([A-F0-9]+)/i);
            const prescriptionId = match ? match[0].toUpperCase() : `RX-${inv.id.substring(0, 5).toUpperCase()}`;

            const totalAmount = parseFloat(inv.amount) || 0;
            const paidAmount = paymentStatus === "Paid" ? totalAmount : 0;
            const remainingAmount = paymentStatus === "Paid" ? 0 : totalAmount;

            const uhid = inv.patient?.uhid || `UHID-${102384 + Math.abs(inv.patientId.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)) % 10000}`;

            return {
               id: inv.id,
               patientName: inv.patient?.name || "Patient Walk-In",
               uhid: uhid,
               invoiceDate: new Date(inv.date || inv.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
               }),
               totalAmount: totalAmount,
               paidAmount: paidAmount,
               remainingAmount: remainingAmount,
               paymentStatus: paymentStatus as "Paid" | "Pending" | "Refunded",
               paymentMethod: paymentMethod,
               prescriptionId: prescriptionId,
               notes: inv.notes || "",
            };
         });

         setBills(formatted);
      } catch (err) {
         console.error("Failed to load pharmacy bills:", err);
         setError("Failed to fetch billing logs");
      } finally {
         setLoading(false);
      }
   };

   const getStatusStyle = (status: string) => {
      switch (status) {
         case "Paid":
            return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
         case "Pending":
            return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
         default:
            return "bg-red-500/10 text-red-500 border border-red-500/20";
      }
   };

   const handleRecordPayment = async () => {
      if (!selectedBill) return;
      try {
         setPaymentLoading(true);
         await invoiceAPI.update(selectedBill.id, {
            status: "Paid",
            notes: selectedBill.notes + " (Paid in full via Cash Desk)"
         });
         setSelectedBill(null);
         fetchPharmacyBills();
      } catch (err) {
         console.error("Failed to record payment:", err);
         alert("Failed to record payment");
      } finally {
         setPaymentLoading(false);
      }
   };

   const handleDownloadPdf = async (billId: string, patientName: string) => {
      try {
         setDownloadingPdf(true);
         const response = await invoiceAPI.downloadPdf(billId);
         const blob = new Blob([response.data], { type: "application/pdf" });
         const url = window.URL.createObjectURL(blob);
         const link = document.createElement("a");
         link.href = url;
         link.setAttribute("download", `Invoice_${patientName.replace(/\s+/g, "_")}_${billId.substring(0, 5).toUpperCase()}.pdf`);
         document.body.appendChild(link);
         link.click();
         link.parentNode?.removeChild(link);
         window.URL.revokeObjectURL(url);
      } catch (err) {
         console.error("Failed to download PDF:", err);
         alert("Failed to download invoice PDF. Please try again.");
      } finally {
         setDownloadingPdf(false);
      }
   };

   const filteredBills = bills.filter((b) =>
      b.patientName.toLowerCase().includes(searchQuery.toLowerCase())
   );

   const columns_0: Column<any>[] = [
      { header: "UHID", accessor: "uhid" },
      { header: "Patient", accessor: "patientName" },
      { header: "Prescription Ref", accessor: "prescriptionId" },
      { header: "Invoice Date", accessor: "invoiceDate" },
      { header: "Total Amount", accessor: (bill) => (<>₹\n{bill.totalAmount.toFixed(2)}</>) },
      { header: "Paid Amount", accessor: (bill) => (<>₹\n{bill.paidAmount.toFixed(2)}</>) },
      { header: "Remaining", accessor: (bill) => (<>₹\n{bill.remainingAmount.toFixed(2)}</>) },
      {
         header: "Payment Status", accessor: (bill) => (<>\n<span className={`px-2.5 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(bill.paymentStatus)}`}>
            {bill.paymentStatus}
         </span>\n</>)
      },
      {
         header: "Actions", accessor: (bill) => (<>\n<div className="flex justify-center gap-2">
            <button
               onClick={() => setSelectedBill(bill)}
               title="View Receipt Details"
               className="p-2 bg-card/5 border border-white/5 rounded hover:bg-[#1abc9c]/20 hover:text-[#1abc9c] transition-colors"
            >
               <Eye size={16} />
            </button>
            <button
               onClick={() => handleDownloadPdf(bill.id, bill.patientName)}
               title="Download PDF Invoice"
               className="p-2 bg-card/5 border border-white/5 rounded hover:bg-emerald-500/20 hover:text-emerald-500 transition-colors"
            >
               <Download size={16} />
            </button>
         </div>\n</>)
      },
   ];


   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center my-3 my-3">
            <div className="flex items-center gap-4">
               <Link
                  href="/dashboard/pharmacy"
                  className="p-2 hover:bg-dark-tertiary rounded transition-colors"
               >
                  <ArrowLeft size={24} />
               </Link>
               <div>
                  <h1 className="text-3xl ">Medicine Bills</h1>
                  <p className="text-gray-400">Manage drug sales invoicing, payments verification, and insurance claims audits</p>
               </div>
            </div>
            <button
               onClick={fetchPharmacyBills}
               className="btn-secondary flex items-center gap-2"
            >
               <RefreshCw size={15} /> Refresh Records
            </button>
         </div>

         <div className="card">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
               <Search size={20} className="text-gray-400" />
               <input
                  type="text"
                  placeholder="Search Pharmacy Bills by Patient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent flex-1 outline-none text-white text-md"
               />
            </div>

            {loading ? (
               <div className="flex justify-center items-center h-64">
                  <Loader className="animate-spin text-emerald-500" size={32} />
               </div>
            ) : error ? (
               <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-2 rounded">
                  {error}
               </div>
            ) : filteredBills.length === 0 ? (
               <div className="text-center py-12 text-gray-500">No pharmacy bills found matching query.</div>
            ) : (
               <div className="overflow-x-auto">
                  <DataTable columns={columns_0} data={filteredBills} enableLocalSearch enableLocalPagination />
               </div>
            )}
         </div>

         {/* Bill View Modal */}
         {selectedBill && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
               <div className="bg-[#1e1f27] border border-white/10 rounded-2xl p-6 w-full max-w-2xl relative animate-scaleUp max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center my-3 my-3 mb-4 pb-3 border-b border-white/5">
                     <h3 className="text-xl  text-white flex items-center gap-2">
                        <FileText className="text-[#1abc9c]" size={20} />
                        Pharmacy Invoice Receipt
                     </h3>
                     <button
                        onClick={() => setSelectedBill(null)}
                        className="p-1 hover:bg-card/5 rounded text-gray-400 hover:text-white transition-colors"
                        title="Close Receipt"
                     >
                        <X size={20} />
                     </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                     <div className="flex justify-between items-center my-3 my-3 p-3 bg-card/5 border border-white/5 rounded-xl">
                        <span className="text-gray-400">Patient UHID</span>
                        <span className="text-white ">{selectedBill.uhid}</span>
                     </div>
                     <div className="flex justify-between items-center my-3 my-3 p-3 bg-card/5 border border-white/5 rounded-xl">
                        <span className="text-gray-400">Patient Name</span>
                        <span className="text-white ">{selectedBill.patientName}</span>
                     </div>
                     <div className="flex justify-between items-center my-3 my-3 p-3 bg-card/5 border border-white/5 rounded-xl">
                        <span className="text-gray-400">Prescription Ref</span>
                        <span className="text-[#1abc9c]  font-mono">{selectedBill.prescriptionId}</span>
                     </div>
                     <div className="flex justify-between items-center my-3 my-3 p-3 bg-card/5 border border-white/5 rounded-xl">
                        <span className="text-gray-400">Billing Date</span>
                        <span className="text-white">{selectedBill.invoiceDate}</span>
                     </div>
                     <div className="flex justify-between items-center my-3 my-3 p-3 bg-card/5 border border-white/5 rounded-xl">
                        <span className="text-gray-400">Payment Gateway</span>
                        <span className="text-white font-semibold">{selectedBill.paymentMethod}</span>
                     </div>
                     <div className="flex justify-between items-center my-3 my-3 p-3 bg-card/5 border border-white/5 rounded-xl">
                        <span className="text-gray-400">Total Net Charges</span>
                        <span className="text-[#1abc9c] ">₹{selectedBill.totalAmount.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between items-center my-3 my-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <span className="text-emerald-400 font-semibold">Amount Paid</span>
                        <span className="text-emerald-400 font-extrabold font-mono">₹{selectedBill.paidAmount.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between items-center my-3 my-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <span className="text-amber-500 font-semibold">Remaining Balance</span>
                        <span className="text-amber-500 font-extrabold font-mono">₹{selectedBill.remainingAmount.toFixed(2)}</span>
                     </div>
                     <div className="md:col-span-2 p-3 bg-card/5 border border-white/5 rounded-xl">
                        <span className="text-gray-400 block mb-1 text-xs  uppercase tracking-wider">Billing Notes</span>
                        <span className="text-gray-300 block text-xs leading-relaxed max-h-16 overflow-y-auto">{selectedBill.notes}</span>
                     </div>
                  </div>

                  {/* Record Payment Interactive terminal */}
                  {selectedBill.paymentStatus !== "Paid" && (
                     <div className="mt-4 p-4 bg-card/5 rounded-xl border border-white/5 space-y-3">
                        <h4 className=" text-white text-sm flex items-center gap-2">
                           <CreditCard className="text-[#1abc9c]" size={16} />
                           Record Pharmacy Desk Payment
                        </h4>
                        <p className="text-xs text-gray-400">Receive cash or electronic transfer to fully settle this outstanding pharmacy bill.</p>
                        <button
                           onClick={handleRecordPayment}
                           disabled={paymentLoading}
                           className="btn-primary w-full py-2.5 px-4 text-xs  flex items-center justify-center gap-2 rounded-xl transition-all shadow-lg"
                        >
                           {paymentLoading ? <Loader size={14} className="animate-spin text-white" /> : <CheckCircle size={14} />}
                           Settle Full Balance (₹{selectedBill.remainingAmount.toFixed(2)})
                        </button>
                     </div>
                  )}

                  <div className="flex justify-between items-center my-3 my-3 pt-4 mt-6 border-t border-white/5">
                     <button
                        onClick={() => handleDownloadPdf(selectedBill.id, selectedBill.patientName)}
                        disabled={downloadingPdf}
                        className="btn-secondary py-2.5 px-4 text-sm  flex items-center gap-2"
                     >
                        {downloadingPdf ? <Loader size={16} className="animate-spin" /> : <Download size={16} />}
                        Download PDF
                     </button>
                     <button
                        onClick={() => setSelectedBill(null)}
                        className="btn-primary py-2.5 px-6"
                     >
                        Close Receipt
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
