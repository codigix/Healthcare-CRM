'use client';

import { useState, useEffect } from 'react';

import { invoiceAPI, patientAPI } from '@/lib/api';
import { Plus, Edit2, Trash2, Download, Search } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import InvoiceForm from '@/components/Forms/InvoiceForm';
import DataTable, { Column } from "@/components/ui/DataTable";

interface Invoice {
   id: string;
   amount: number;
   status: string;
   date: string;
   patientId: string;
   dueDate?: string;
   notes?: string;
   patient?: { id: string; name: string };
}

interface Patient {
   id: string;
   name: string;
}

export default function InvoicesPage() {
   const [invoices, setInvoices] = useState<Invoice[]>([]);
   const [patients, setPatients] = useState<Patient[]>([]);
   const [page, setPage] = useState(1);
   const [total, setTotal] = useState(0);
   const [loading, setLoading] = useState(true);
   const [showModal, setShowModal] = useState(false);
   const [editingId, setEditingId] = useState<string | null>(null);
   const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
   const [statusFilter, setStatusFilter] = useState('');

   useEffect(() => {
      fetchData();
   }, [page, statusFilter]);

   const fetchData = async () => {
      try {
         setLoading(true);
         const filters: any = { page, limit: 10 };
         if (statusFilter) filters.status = statusFilter;

         const [invoicesRes, patientsRes] = await Promise.all([
            invoiceAPI.list(page, 10, filters),
            patientAPI.list(1, 100),
         ]);

         setInvoices(invoicesRes.data.invoices);
         setTotal(invoicesRes.data.total);
         setPatients(patientsRes.data.patients);
      } catch (error) {
         console.error('Failed to fetch data', error);
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async (id: string) => {
      if (confirm('Are you sure you want to delete this invoice?')) {
         try {
            await invoiceAPI.delete(id);
            fetchData();
         } catch (error) {
            console.error('Failed to delete invoice', error);
         }
      }
   };

   const handleDownload = async (id: string) => {
      try {
         const response = await invoiceAPI.downloadPdf(id);
         const url = window.URL.createObjectURL(new Blob([response.data]));
         const link = document.createElement('a');
         link.href = url;
         link.setAttribute('download', `invoice-${id}.pdf`);
         document.body.appendChild(link);
         link.click();
         link.parentNode?.removeChild(link);
      } catch (error) {
         console.error('Failed to download PDF', error);
      }
   };

   const handleEdit = (invoice: Invoice) => {
      setEditingInvoice(invoice);
      setEditingId(invoice.id);
      setShowModal(true);
   };

   const handleAdd = () => {
      setEditingInvoice(null);
      setEditingId(null);
      setShowModal(true);
   };

   const getStatusColor = (status: string) => {
      switch (status) {
         case 'paid':
            return 'status-confirmed';
         case 'pending':
            return 'status-pending';
         default:
            return 'status-tertiary';
      }
   };

   const columns_0: Column<any>[] = [
      { header: "Invoice ID", accessor: (inv) => (<>{inv.id.substring(0, 8)}</>) },
      { header: "Patient", accessor: (inv) => (<>{inv.patient.name}</>) },
      { header: "Amount", accessor: (inv) => (<>₹\n{inv.amount}</>) },
      { header: "Date", accessor: (inv) => (<>{new Date(inv.date).toLocaleDateString()}</>) },
      {
         header: "Status", accessor: (inv) => (<>\n<span className={`status-badge ${getStatusColor(inv.status)}`}>
            {inv.status}
         </span>\n</>)
      },
      {
         header: "Actions", accessor: (inv) => (<>\n<div className="flex gap-2">
            <button
               onClick={() => handleDownload(inv.id)}
               className="p-2 hover:bg-green-500 hover:bg-opacity-20 rounded transition-colors"
               title="Download PDF"
            >
               <Download size={15} className="text-green-500" />
            </button>
            <button
               onClick={() => handleEdit(inv)}
               className="p-2 hover:bg-blue-500 hover:bg-opacity-20 rounded transition-colors"
            >
               <Edit2 size={15} className="text-blue-500" />
            </button>
            <button
               onClick={() => handleDelete(inv.id)}
               className="p-2 hover:bg-red-500 hover:bg-opacity-20 rounded transition-colors"
            >
               <Trash2 size={15} className="text-red-500" />
            </button>
         </div>\n</>)
      },
   ];


   return (
      <>
         <div className="space-y-6">
            <div className="flex justify-between items-center my-3 my-3">
               <div>
                  <h1 className="text-3xl  mb-2">Invoices</h1>
                  <p className="text-gray-400">Manage patient billing and invoices</p>
               </div>
               <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
                  <Plus size={20} />
                  New Invoice
               </button>
            </div>

            <div className="card">
               <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 flex items-center gap-2 bg-dark-tertiary rounded px-4">
                     <Search size={20} className="text-gray-400" />
                     <input
                        type="text"
                        placeholder="Search invoices..."
                        className="bg-transparent py-3 flex-1 outline-none"
                     />
                  </div>
                  <select
                     value={statusFilter}
                     onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                     }}
                     className="input-field"
                  >
                     <option value="">All Status</option>
                     <option value="paid">Paid</option>
                     <option value="pending">Pending</option>
                  </select>
               </div>

               {loading ? (
                  <div className="text-center py-8 text-gray-400">Loading...</div>
               ) : (
                  <div className="overflow-x-auto">
                     <DataTable columns={columns_0} data={invoices} enableLocalSearch enableLocalPagination />
                  </div>
               )}

               <div className="flex justify-between items-center my-3 my-3 mt-4">
                  <p className="text-gray-400 text-sm">Showing 1 to {invoices.length} of {total}</p>
                  <div className="flex gap-2">
                     <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="btn-secondary disabled:opacity-50"
                     >
                        Previous
                     </button>
                     <button
                        disabled={page * 10 >= total}
                        onClick={() => setPage(page + 1)}
                        className="btn-secondary disabled:opacity-50"
                     >
                        Next
                     </button>
                  </div>
               </div>
            </div>
         </div>

         <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Invoice' : 'New Invoice'}>
            <InvoiceForm
               invoice={editingInvoice}
               patients={patients}
               onSuccess={() => {
                  setShowModal(false);
                  fetchData();
               }}
            />
         </Modal>
      </>
   );
}
