"use client";

import { useState, useEffect } from "react";
import { refillAPI } from "@/lib/api";
import { Search, AlertTriangle, PackageX, Clock, Settings, ArrowRightLeft, CheckCircle2, Loader, Check, Play, CornerDownRight } from "lucide-react";
import DataTable, { Column } from "@/components/ui/DataTable";

interface AlertItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minLevel: number;
  status: "Low Stock" | "Out of Stock" | "Expiring Soon";
  supplier: string;
}

export default function StockAlertsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("low-stock");

  // Refill Requests states
  const [refills, setRefills] = useState<any[]>([]);
  const [refillsLoading, setRefillsLoading] = useState(false);
  const [refillActionLoading, setRefillActionLoading] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [lowStockItems] = useState<AlertItem[]>([
    {
      id: "INV002",
      name: "Oxygen Cylinder 10L",
      category: "Medical Supplies",
      currentStock: 12,
      minLevel: 15,
      status: "Low Stock",
      supplier: "MediEquip Solutions",
    },
    {
      id: "INV005",
      name: "Sterile Gauze Roll 6in",
      category: "Medical Supplies",
      currentStock: 8,
      minLevel: 10,
      status: "Low Stock",
      supplier: "MedPlus Supplies",
    },
    {
      id: "INV007",
      name: "Examination Table Paper",
      category: "Medical Supplies",
      currentStock: 3,
      minLevel: 5,
      status: "Low Stock",
      supplier: "Health Supply Co.",
    },
    {
      id: "INV011",
      name: "Surgical Gloves (Medium)",
      category: "Medical Supplies",
      currentStock: 45,
      minLevel: 50,
      status: "Low Stock",
      supplier: "MediEquip Solutions",
    },
    {
      id: "INV015",
      name: "Bandages (Box)",
      category: "Medical Supplies",
      currentStock: 7,
      minLevel: 10,
      status: "Low Stock",
      supplier: "Health Supply Co.",
    },
    {
      id: "INV018",
      name: "Antiseptic Solution",
      category: "Medical Supplies",
      currentStock: 4,
      minLevel: 6,
      status: "Low Stock",
      supplier: "MedPlus Supplies",
    },
    {
      id: "INV023",
      name: "Syringes 10ml",
      category: "Medical Supplies",
      currentStock: 30,
      minLevel: 40,
      status: "Low Stock",
      supplier: "MediEquip Solutions",
    },
  ]);

  const [outOfStockItems] = useState<AlertItem[]>([
    {
      id: "INV004",
      name: "Surgical Masks (Box)",
      category: "Medical Supplies",
      currentStock: 0,
      minLevel: 10,
      status: "Out of Stock",
      supplier: "MedPlus Supplies",
    },
    {
      id: "INV009",
      name: "Alcohol Swabs",
      category: "Medical Supplies",
      currentStock: 0,
      minLevel: 20,
      status: "Out of Stock",
      supplier: "Health Supply Co.",
    },
    {
      id: "INV012",
      name: "Gauze Pads",
      category: "Medical Supplies",
      currentStock: 0,
      minLevel: 15,
      status: "Out of Stock",
      supplier: "MediEquip Solutions",
    },
    {
      id: "INV016",
      name: "Cotton Balls",
      category: "Medical Supplies",
      currentStock: 0,
      minLevel: 8,
      status: "Out of Stock",
      supplier: "Health Supply Co.",
    },
    {
      id: "INV020",
      name: "Medical Tape",
      category: "Medical Supplies",
      currentStock: 0,
      minLevel: 12,
      status: "Out of Stock",
      supplier: "MedPlus Supplies",
    },
  ]);

  const [expiringSoonItems] = useState<AlertItem[]>([
    {
      id: "INV013",
      name: "Saline IV Fluids 500ml",
      category: "Medical Supplies",
      currentStock: 50,
      minLevel: 30,
      status: "Expiring Soon",
      supplier: "Global Med Supplies",
    },
    {
      id: "INV017",
      name: "IV Catheters 20G",
      category: "Medical Supplies",
      currentStock: 35,
      minLevel: 20,
      status: "Expiring Soon",
      supplier: "Health Supply Co.",
    },
    {
      id: "INV021",
      name: "Antiseptic Wipes (Box)",
      category: "Medical Supplies",
      currentStock: 15,
      minLevel: 10,
      status: "Expiring Soon",
      supplier: "MedPlus Supplies",
    },
    {
      id: "INV024",
      name: "ECG Electrode Pads",
      category: "Medical Supplies",
      currentStock: 25,
      minLevel: 15,
      status: "Expiring Soon",
      supplier: "MediEquip Solutions",
    },
    {
      id: "INV026",
      name: "Sterile Surgical Gowns",
      category: "Medical Supplies",
      currentStock: 18,
      minLevel: 12,
      status: "Expiring Soon",
      supplier: "Global Med Supplies",
    },
    {
      id: "INV028",
      name: "Disinfectant Sprays",
      category: "Medical Supplies",
      currentStock: 40,
      minLevel: 25,
      status: "Expiring Soon",
      supplier: "Health Supply Co.",
    },
  ]);

  useEffect(() => {
    if (activeTab === "refills") {
      fetchRefills();
    }
  }, [activeTab]);

  const fetchRefills = async () => {
    try {
      setRefillsLoading(true);
      setErrorMsg("");
      const response = await refillAPI.list();
      setRefills(response.data.refills || []);
    } catch (err) {
      console.error("Failed to load pharmacy refills queue:", err);
      setErrorMsg("Failed to fetch pharmacy refill requests queue");
    } finally {
      setRefillsLoading(false);
    }
  };

  const handleUpdateRefillStatus = async (id: string, nextStatus: string) => {
    try {
      setRefillActionLoading(id);
      setErrorMsg("");
      setSuccessMsg("");

      const response = await refillAPI.update(id, { status: nextStatus });
      if (response.data.success) {
        setSuccessMsg(`✓ Successfully updated refill request ${id} to "${nextStatus}"!`);
        fetchRefills();
        setTimeout(() => setSuccessMsg(""), 5000);
      }
    } catch (err: any) {
      console.error("Failed to update refill request:", err);
      const errMsg = err.response?.data?.error || "Stock transfer failed. Check central inventory quantity.";
      setErrorMsg(errMsg);
    } finally {
      setRefillActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Low Stock":
        return "bg-orange-500/10 text-orange-500 border border-orange-500/20";
      case "Out of Stock":
        return "bg-red-500/10 text-red-500 border border-red-500/20";
      case "Expiring Soon":
        return "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
    }
  };

  const getRefillStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "Approved":
        return "bg-cyan-500/10 text-cyan-500 border border-cyan-500/20";
      case "Issued":
        return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
      case "Completed":
        return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
    }
  };

  const getCurrentItems = () => {
    switch (activeTab) {
      case "low-stock":
        return lowStockItems;
      case "out-of-stock":
        return outOfStockItems;
      case "expiring":
        return expiringSoonItems;
      case "all":
        return [...lowStockItems, ...outOfStockItems, ...expiringSoonItems];
      default:
        return lowStockItems;
    }
  };

  const filteredItems = getCurrentItems().filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns_1: Column<any>[] = [
    { header: "Item ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Category", accessor: "category" },
    { header: "Current Stock", accessor: "currentStock" },
    { header: "Min. Level", accessor: "minLevel" },
    {
      header: "Status", accessor: (item) => (<>\n<span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
        {item.status}
      </span>\n</>)
    },
    { header: "Supplier", accessor: "supplier" },
    {
      header: "Actions", accessor: (item) => (<>\n<button
        onClick={() => window.alert(`Restock order query dispatched for ${item.name} to ${item.supplier}`)}
        className="btn-secondary py-1 px-3 text-xs font-semibold text-gray-300 border border-dark-tertiary"
      >
        Procure Item
      </button>\n</>)
    },
  ];

  const columns_0: Column<any>[] = [
    { header: "Request ID", accessor: "id" },
    { header: "Medication Name", accessor: "medicineName" },
    { header: "Qty Requested", accessor: "quantityRequested" },
    { header: "Notes", accessor: (refill) => (<>\n{refill.notes || "N/A"}\n</>) },
    {
      header: "Status", accessor: (refill) => (<>\n<span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getRefillStatusColor(refill.status)}`}>
        {refill.status}
      </span>\n</>)
    },
    { header: "Date", accessor: (refill) => (<>\n{new Date(refill.createdAt).toLocaleDateString()}\n</>) },
    {
      header: "Workflow Action", accessor: (refill) => (<>\n{refill.status === "Pending" && (
        <button
          onClick={() => handleUpdateRefillStatus(refill.id, "Approved")}
          disabled={refillActionLoading === refill.id}
          className="btn-primary py-1 px-3 text-xs bg-cyan-600 hover:bg-cyan-500 text-white  transition-all disabled:opacity-50"
        >
          {refillActionLoading === refill.id ? "Approving..." : "Approve Request"}
        </button>
      )}\n\n{refill.status === "Approved" && (
        <button
          onClick={() => handleUpdateRefillStatus(refill.id, "Issued")}
          disabled={refillActionLoading === refill.id}
          className="btn-primary py-1 px-3 text-xs bg-blue-600 hover:bg-blue-500 text-white  transition-all disabled:opacity-50 flex items-center gap-1 mx-auto"
        >
          {refillActionLoading === refill.id ? "Issuing..." : (
            <>
              <Play size={12} />
              Issue Stock
            </>
          )}
        </button>
      )}\n\n{refill.status === "Issued" && (
        <button
          onClick={() => handleUpdateRefillStatus(refill.id, "Completed")}
          disabled={refillActionLoading === refill.id}
          className="btn-primary py-1 px-3 text-xs bg-emerald-600 hover:bg-emerald-500 text-white  transition-all disabled:opacity-50 flex items-center gap-1 mx-auto"
        >
          {refillActionLoading === refill.id ? "Transferring..." : (
            <>
              <Check size={12} />
              Complete Transfer
            </>
          )}
        </button>
      )}\n\n{refill.status === "Completed" && (
        <span className="text-emerald-500  flex items-center gap-1 justify-center text-xs">
          <CheckCircle2 size={13} />
          Transferred & Closed
        </span>
      )}\n</>)
    },
  ];



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-3 my-3">
        <div>
          <h1 className="text-3xl  mb-2">Central Inventory Alerts</h1>
          <p className="text-gray-400">Monitor stock reorder alerts, manage expiring assets, and verify pharmacy refill dispatches.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Settings size={15} />
            Configure Alerts
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded p-4 flex items-center gap-2">
          <CheckCircle2 size={20} className="flex-shrink-0 text-emerald-500" />
          <p className="font-semibold">{successMsg}</p>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-orange-500/10 rounded flex items-center justify-center">
              <AlertTriangle className="text-orange-500" size={24} />
            </div>
            <div>
              <div className="text-2xl ">{lowStockItems.length}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider ">Low Stock Items</div>
              <div className="text-xs text-orange-500 mt-0.5">Critical threshold reached</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-red-500/10 rounded flex items-center justify-center">
              <PackageX className="text-red-500" size={24} />
            </div>
            <div>
              <div className="text-2xl ">{outOfStockItems.length}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider ">Out of Stock</div>
              <div className="text-xs text-red-500 mt-0.5">Needs immediate reorder</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-yellow-500/10 rounded flex items-center justify-center">
              <Clock className="text-yellow-500" size={24} />
            </div>
            <div>
              <div className="text-2xl ">{expiringSoonItems.length}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider ">Expiring Soon</div>
              <div className="text-xs text-yellow-500 mt-0.5">Within 30 days</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-purple-500/10 rounded flex items-center justify-center">
              <ArrowRightLeft className="text-purple-500" size={24} />
            </div>
            <div>
              <div className="text-2xl ">Active Refills</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider ">Pharmacy Requests</div>
              <div className="text-xs text-purple-500 mt-0.5">Verify & transfer drugs</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        {activeTab !== "refills" && (
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-dark-tertiary">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent flex-1 outline-none text-white"
            />
          </div>
        )}

        <div className="flex gap-4 mb-6 border-b border-dark-tertiary">
          <button
            onClick={() => setActiveTab("low-stock")}
            className={`pb-3 px-1 font-medium transition-colors ${activeTab === "low-stock"
              ? "text-emerald-500 border-b-2 border-emerald-500"
              : "text-gray-400 hover:text-gray-300"
              }`}
          >
            Low Stock
          </button>
          <button
            onClick={() => setActiveTab("out-of-stock")}
            className={`pb-3 px-1 font-medium transition-colors ${activeTab === "out-of-stock"
              ? "text-emerald-500 border-b-2 border-emerald-500"
              : "text-gray-400 hover:text-gray-300"
              }`}
          >
            Out of Stock
          </button>
          <button
            onClick={() => setActiveTab("expiring")}
            className={`pb-3 px-1 font-medium transition-colors ${activeTab === "expiring"
              ? "text-emerald-500 border-b-2 border-emerald-500"
              : "text-gray-400 hover:text-gray-300"
              }`}
          >
            Expiring Soon
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-3 px-1 font-medium transition-colors ${activeTab === "all"
              ? "text-emerald-500 border-b-2 border-emerald-500"
              : "text-gray-400 hover:text-gray-300"
              }`}
          >
            All Alerts
          </button>
          <button
            onClick={() => setActiveTab("refills")}
            className={`pb-3 px-1 font-medium transition-colors ${activeTab === "refills"
              ? "text-emerald-500 border-b-2 border-emerald-500"
              : "text-gray-400 hover:text-gray-300"
              }`}
          >
            Pharmacy Refill Requests
          </button>
        </div>

        {activeTab === "refills" ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Pharmacy Stock Refill Requests</h2>
              <p className="text-gray-400 text-sm mt-1">Verify hospital central operational stocks and approve/transfer drug batches to pharmacy cabinets.</p>
            </div>

            {refillsLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader className="animate-spin text-emerald-500" size={32} />
              </div>
            ) : refills.length === 0 ? (
              <div className="text-center py-12 text-gray-500 italic text-sm">No pharmacy refill requests found.</div>
            ) : (
              <div className="overflow-x-auto">
                <DataTable columns={columns_0} data={refills} enableLocalSearch enableLocalPagination />
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">
              {activeTab === "low-stock" && "Low Stock Items"}
              {activeTab === "out-of-stock" && "Out of Stock Items"}
              {activeTab === "expiring" && "Expiring Soon"}
              {activeTab === "all" && "All Alerts"}
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              {activeTab === "low-stock" && "Items that have fallen below their minimum safety reorder stock levels"}
              {activeTab === "out-of-stock" && "Items that are currently completely out of stock"}
              {activeTab === "expiring" && "Items expiring within the next 30 days that require immediate replacement"}
              {activeTab === "all" && "All central inventory alerts"}
            </p>

            <div className="overflow-x-auto">
              <DataTable columns={columns_1} data={filteredItems} enableLocalSearch enableLocalPagination />
            </div>
          </div>
        )}
      </div>

      {activeTab !== "refills" && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Alert settings</h2>
          <p className="text-gray-400 text-sm mb-6">Configure thresholds and channels to receive operational alerts</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-dark-secondary rounded border border-dark-tertiary">
              <div>
                <div className="font-semibold text-white">Email alerts</div>
                <div className="text-xs text-gray-400">Send notifications for out-of-stock items immediately</div>
              </div>
              <button className="btn-secondary text-xs">Configure</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
