'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Plus, Trash2, Calendar } from 'lucide-react';
import Link from 'next/link';

interface ServiceItem {
  id: string;
  service: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export default function CreateInvoicePage() {
  const [formData, setFormData] = useState({
    invoiceNumber: 'INV-008',
    invoiceType: 'standard',
    invoiceDate: '',
    dueDate: '',
    reference: '',
    patient: '',
    insuranceProvider: '',
    policyNumber: '',
    groupNumber: '',
    coveragePercentage: '',
    paymentTerms: 'net30',
    notes: ''
  });

  const [services, setServices] = useState<ServiceItem[]>([
    { id: '1', service: '', description: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);

  const [paymentMethods, setPaymentMethods] = useState({
    creditCard: false,
    debitCard: false,
    bankTransfer: false,
    paypal: false,
    cash: false,
    check: false,
    insurance: false,
    other: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethods(prev => ({ ...prev, [method]: !prev[method as keyof typeof prev] }));
  };

  const addService = () => {
    setServices([...services, { id: Date.now().toString(), service: '', description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const updateService = (id: string, field: string, value: any) => {
    setServices(services.map(s => {
      if (s.id === id) {
        const updated = { ...s, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return s;
    }));
  };

  const subtotal = services.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.1;
  const discount = 0;
  const total = subtotal + tax - discount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Invoice created:', { formData, services, paymentMethods });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Create Invoice</h1>
            <p className="text-gray-400">Create a new invoice for a patient</p>
          </div>
          <Link href="/billing/invoices">
            <button className="btn-secondary">Cancel</button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Invoice Details</h2>
              <p className="text-gray-400 text-sm mb-6">Enter the details for this new invoice</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Invoice Number</label>
                  <input
                    type="text"
                    name="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Invoice Type</label>
                  <select
                    name="invoiceType"
                    value={formData.invoiceType}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  >
                    <option value="standard">Standard Invoice</option>
                    <option value="proforma">Pro Forma Invoice</option>
                    <option value="recurring">Recurring Invoice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Invoice Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="invoiceDate"
                      value={formData.invoiceDate}
                      onChange={handleInputChange}
                      className="input-field w-full"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Due date is 15/03/23</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Due Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className="input-field w-full"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Due date is 15/03/23</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Reference / PO Number (Optional)</label>
                  <input
                    type="text"
                    name="reference"
                    value={formData.reference}
                    onChange={handleInputChange}
                    placeholder="Enter reference or PO number"
                    className="input-field w-full"
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Items & Services</h2>

              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={service.id} className="p-4 bg-dark-tertiary/30 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Item {index + 1}</h3>
                      {services.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeService(service.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Select service or item</label>
                        <input
                          type="text"
                          value={service.service}
                          onChange={(e) => updateService(service.id, 'service', e.target.value)}
                          placeholder="Enter service name"
                          className="input-field w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Quantity</label>
                        <input
                          type="number"
                          value={service.quantity}
                          onChange={(e) => updateService(service.id, 'quantity', parseFloat(e.target.value) || 0)}
                          min="1"
                          className="input-field w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Unit Price</label>
                        <input
                          type="number"
                          value={service.unitPrice}
                          onChange={(e) => updateService(service.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="input-field w-full"
                        />
                      </div>

                      <div className="md:col-span-4">
                        <label className="block text-sm font-medium mb-2">Additional description</label>
                        <textarea
                          value={service.description}
                          onChange={(e) => updateService(service.id, 'description', e.target.value)}
                          rows={2}
                          className="input-field w-full resize-none"
                        />
                      </div>

                      <div className="md:col-span-4 flex justify-end">
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Total</div>
                          <div className="text-xl font-bold">${service.total.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addService}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Add Item
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-dark-tertiary space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tax (10%):</span>
                  <span className="text-white font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Discount:</span>
                  <span className="text-white font-medium">-${discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-dark-tertiary">
                  <span>Total:</span>
                  <span className="text-emerald-500">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Additional Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Enter any additional notes for this invoice"
                    rows={4}
                    className="input-field w-full resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Payment Terms</label>
                  <select
                    name="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  >
                    <option value="net30">Net 30 Days</option>
                    <option value="net15">Net 15 Days</option>
                    <option value="net7">Net 7 Days</option>
                    <option value="due">Due on Receipt</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Patient Information</h2>
              <p className="text-gray-400 text-sm mb-6">Select a patient for this invoice</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Search patient...</label>
                  <select
                    name="patient"
                    value={formData.patient}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  >
                    <option value="">Select patient</option>
                    <option value="john-smith">John Smith - P-00145</option>
                    <option value="sarah-johnson">Sarah Johnson - P-00289</option>
                    <option value="michael-chen">Michael Chen - P-00312</option>
                  </select>
                </div>

                {formData.patient && (
                  <div className="p-4 bg-dark-tertiary/30 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center font-semibold text-emerald-500">
                        JS
                      </div>
                      <div>
                        <div className="font-medium">John Smith</div>
                        <div className="text-sm text-gray-400">ID: P-00145</div>
                      </div>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="text-gray-400">Email: <span className="text-white">john.smith@example.com</span></div>
                      <div className="text-gray-400">Phone: <span className="text-white">+1 (555) 123-4567</span></div>
                      <div className="text-gray-400">Address: <span className="text-white">123 Main St, City, State 12345</span></div>
                    </div>
                    <button className="text-emerald-500 text-sm mt-3 hover:underline">View patient details</button>
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Insurance Information</h2>
              <p className="text-gray-400 text-sm mb-6">Patient's insurance details</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Insurance Provider</label>
                  <select
                    name="insuranceProvider"
                    value={formData.insuranceProvider}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  >
                    <option value="">Select provider</option>
                    <option value="blue-cross">Blue Cross Blue Shield</option>
                    <option value="aetna">Aetna</option>
                    <option value="united">UnitedHealthcare</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Policy Number</label>
                  <input
                    type="text"
                    name="policyNumber"
                    value={formData.policyNumber}
                    onChange={handleInputChange}
                    placeholder="Enter policy number"
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Group Number</label>
                  <input
                    type="text"
                    name="groupNumber"
                    value={formData.groupNumber}
                    onChange={handleInputChange}
                    placeholder="Enter group number"
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Coverage %</label>
                  <input
                    type="number"
                    name="coveragePercentage"
                    value={formData.coveragePercentage}
                    onChange={handleInputChange}
                    placeholder="e.g., 80"
                    min="0"
                    max="100"
                    className="input-field w-full"
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Payment Options</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-3">Accepted Payment Methods</label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(paymentMethods).map(([key, value]) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handlePaymentMethodChange(key)}
                          className="w-4 h-4 text-emerald-500 bg-dark-tertiary border-gray-600 rounded focus:ring-emerald-500"
                        />
                        <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button className="btn-secondary w-full">View Payment Plan</button>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href="/billing/invoices" className="flex-1">
                <button type="button" className="btn-secondary w-full">Save as Draft</button>
              </Link>
              <button type="submit" className="btn-primary flex-1">Create Invoice</button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
