"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
   ArrowLeft,
   Calendar,
   Wrench,
   Phone,
   MapPin,
   Fuel,
   Users,
   TrendingUp,
   TrendingDown,
   Clock,
   Edit,
   Trash2,
} from "lucide-react";
import Link from "next/link";
import { ambulanceAPI } from "@/lib/api";
import DataTable, { Column } from "@/components/ui/DataTable";

function AmbulanceDetailsContent() {
   const [activeTab, setActiveTab] = useState("overview");
   const router = useRouter();
   const searchParams = useSearchParams();
   const ambulanceId = searchParams.get("id");
   const [ambulanceData, setAmbulanceData] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");

   useEffect(() => {
      if (ambulanceId) {
         fetchAmbulanceDetails();
      } else {
         fetchFirstAmbulance();
      }
   }, [ambulanceId]);

   const fetchFirstAmbulance = async () => {
      try {
         setLoading(true);
         const response = await ambulanceAPI.list(1, 1);
         const ambulances = response.data.ambulances || response.data;
         if (Array.isArray(ambulances) && ambulances.length > 0) {
            setAmbulanceData(ambulances[0]);
         } else {
            setError("No ambulances found in the system.");
         }
      } catch (err) {
         setError("Failed to fetch ambulance data");
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   const fetchAmbulanceDetails = async () => {
      try {
         setLoading(true);
         const response = await ambulanceAPI.get(ambulanceId!);
         setAmbulanceData(response.data);
      } catch (err) {
         setError("Failed to fetch ambulance details");
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async () => {
      if (
         confirm(
            "Are you sure you want to delete this ambulance? This action cannot be undone."
         )
      ) {
         try {
            await ambulanceAPI.delete(ambulanceId!);
            router.push("/ambulance/list");
         } catch (error) {
            console.error("Failed to delete ambulance", error);
         }
      }
   };

   if (loading) {
      return (
         <>
            <div className="flex justify-center items-center py-8">
               <div className="text-gray-400">Loading ambulance details...</div>
            </div>
         </>
      );
   }

   if (error || !ambulanceData) {
      return (
         <>
            <div className="flex justify-center items-center py-8">
               <div className="text-red-400">{error || "Ambulance not found"}</div>
            </div>
         </>
      );
   }

   const maintenanceHistory = [
      {
         date: "2023-04-02",
         type: "Regular Service",
         description: "Oil change, filter replacement, brake inspection",
         cost: "₹450",
         status: "Completed",
      },
      {
         date: "2023-01-15",
         type: "Repair",
         description: "Replaced rear suspension components",
         cost: "₹890",
         status: "Completed",
      },
      {
         date: "2022-10-20",
         type: "Regular Service",
         description: "Comprehensive inspection and fluid top-up",
         cost: "₹320",
         status: "Completed",
      },
   ];

   const equipment = [
      { name: "Defibrillator", status: "Operational", lastChecked: "2023-06-01" },
      {
         name: "Oxygen Cylinders (2)",
         status: "Operational",
         lastChecked: "2023-06-01",
      },
      { name: "Stretcher", status: "Operational", lastChecked: "2023-06-01" },
      { name: "First Aid Kit", status: "Operational", lastChecked: "2023-06-01" },
      { name: "Spine Board", status: "Operational", lastChecked: "2023-06-01" },
      { name: "Suction Unit", status: "Operational", lastChecked: "2023-06-01" },
   ];

   const callAssignments = [
      {
         id: "CALL-001",
         date: "2023-06-15",
         time: "14:30",
         location: "Downtown Area",
         patient: "Emergency Call",
         status: "Completed",
         duration: "45 min",
      },
      {
         id: "CALL-002",
         date: "2023-06-14",
         time: "09:15",
         location: "Residential Complex",
         patient: "Medical Emergency",
         status: "Completed",
         duration: "32 min",
      },
      {
         id: "CALL-003",
         date: "2023-06-13",
         time: "18:45",
         location: "Highway 101",
         patient: "Accident Victim",
         status: "Completed",
         duration: "58 min",
      },
   ];

   const tabs = [
      { id: "overview", label: "Overview" },
      { id: "maintenance", label: "Maintenance" },
      { id: "equipment", label: "Equipment" },
      { id: "calls", label: "Call Assignments" },
   ];

   const columns_0: Column<any>[] = [
      {
         header: "Call ID", accessor: (call) => (<>\n<span className="font-medium text-white">
            {call.id}
         </span>\n</>)
      },
      {
         header: "Date & Time", accessor: (call) => (<>\n<div className="text-white">{call.date}</div>\n\n<div className="text-mdtext-gray-400">
            {call.time}
         </div>\n</>)
      },
      {
         header: "Location", accessor: (call) => (<>\n<div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-400" />
            <span className="text-gray-300">
               {call.location}
            </span>
         </div>\n</>)
      },
      {
         header: "Patient", accessor: (call) => (<>\n<span className="text-gray-300">
            {call.patient}
         </span>\n</>)
      },
      {
         header: "Duration", accessor: (call) => (<>\n<div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <span className="text-gray-300">
               {call.duration}
            </span>
         </div>\n</>)
      },
      {
         header: "Status", accessor: (call) => (<>\n<span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-xs">
            {call.status}
         </span>\n</>)
      },
   ];


   return (
      <>
         <div className="space-y-6">
            <div className="flex items-center gap-4">
               <Link href="/ambulance/list">
                  <button className="p-2 hover:bg-dark-tertiary rounded transition-colors">
                     <ArrowLeft size={24} />
                  </button>
               </Link>
               <div className="flex-1">
                  <div className="flex items-center gap-2">
                     <h1 className="text-3xl ">
                        Ambulances / {ambulanceData.id}
                     </h1>
                     <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-mdfont-medium">
                        {ambulanceData.status}
                     </span>
                  </div>
               </div>
               <div className="flex gap-3">
                  <Link href={`/ambulance/edit/${ambulanceData.id}`}>
                     <button className="btn-secondary flex items-center gap-2">
                        <Edit size={15} />
                        Edit
                     </button>
                  </Link>
                  <button
                     onClick={handleDelete}
                     className="btn-secondary flex items-center gap-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 border-red-500/20 hover:border-red-500/30"
                  >
                     <Trash2 size={15} />
                     Delete
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="card">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="w-10 h-10 bg-blue-500/10 rounded flex items-center justify-center">
                        <Calendar className="text-blue-500" size={20} />
                     </div>
                     <div className="text-mdtext-gray-400">Status</div>
                  </div>
                  <div className="text-xl  text-emerald-500">
                     {ambulanceData.status}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                     Last updated:{" "}
                     {new Date(ambulanceData.lastUpdated).toLocaleDateString()}
                  </div>
               </div>

               <div className="card">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="w-10 h-10 bg-emerald-500/10 rounded flex items-center justify-center">
                        <MapPin className="text-emerald-500" size={20} />
                     </div>
                     <div className="text-mdtext-gray-400">Location</div>
                  </div>
                  <div className="text-xl ">
                     {ambulanceData.location || "N/A"}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Current position</div>
               </div>

               <div className="card">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="w-10 h-10 bg-orange-500/10 rounded flex items-center justify-center">
                        <Phone className="text-orange-500" size={20} />
                     </div>
                     <div className="text-mdtext-gray-400">Driver Phone</div>
                  </div>
                  <div className="text-xl ">{ambulanceData.driverPhone}</div>
                  <div className="text-xs text-gray-400 mt-1">Emergency contact</div>
               </div>

               <div className="card">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="w-10 h-10 bg-purple-500/10 rounded flex items-center justify-center">
                        <Users className="text-purple-500" size={20} />
                     </div>
                     <div className="text-mdtext-gray-400">Driver Name</div>
                  </div>
                  <div className="text-xl ">{ambulanceData.driverName}</div>
                  <div className="text-xs text-gray-400 mt-1">Assigned driver</div>
               </div>
            </div>

            <div className="card">
               <div className="border-b border-dark-tertiary mb-6">
                  <div className="flex gap-6">
                     {tabs.map((tab) => (
                        <button
                           key={tab.id}
                           onClick={() => setActiveTab(tab.id)}
                           className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === tab.id
                              ? "text-emerald-500"
                              : "text-gray-400 hover:text-gray-300"
                              }`}
                        >
                           {tab.label}
                           {activeTab === tab.id && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
                           )}
                        </button>
                     ))}
                  </div>
               </div>

               {activeTab === "overview" && (
                  <div className="space-y-6">
                     <div>
                        <h3 className="text-lg font-semibold mb-4">
                           Ambulance Overview
                        </h3>
                        <p className="text-gray-400 text-mdmb-6">
                           General information and specifications.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                              <h4 className="text-mdfont-semibold text-gray-300 mb-4">
                                 General Information
                              </h4>
                              <div className="space-y-3">
                                 <div className="flex justify-between py-2 border-b border-dark-tertiary">
                                    <span className="text-gray-400">ID:</span>
                                    <span className="text-white font-medium">
                                       {ambulanceData.id}
                                    </span>
                                 </div>
                                 <div className="flex justify-between py-2 border-b border-dark-tertiary">
                                    <span className="text-gray-400">
                                       Registration Number:
                                    </span>
                                    <span className="text-white font-medium">
                                       {ambulanceData.registrationNumber}
                                    </span>
                                 </div>
                                 <div className="flex justify-between py-2 border-b border-dark-tertiary">
                                    <span className="text-gray-400">Name:</span>
                                    <span className="text-white font-medium">
                                       {ambulanceData.name}
                                    </span>
                                 </div>
                                 <div className="flex justify-between py-2 border-b border-dark-tertiary">
                                    <span className="text-gray-400">Driver Name:</span>
                                    <span className="text-white font-medium">
                                       {ambulanceData.driverName}
                                    </span>
                                 </div>
                                 <div className="flex justify-between py-2 border-b border-dark-tertiary">
                                    <span className="text-gray-400">Driver Phone:</span>
                                    <span className="text-white font-medium">
                                       {ambulanceData.driverPhone}
                                    </span>
                                 </div>
                                 <div className="flex justify-between py-2 border-b border-dark-tertiary">
                                    <span className="text-gray-400">Created Date:</span>
                                    <span className="text-white font-medium">
                                       {new Date(
                                          ambulanceData.createdAt
                                       ).toLocaleDateString()}
                                    </span>
                                 </div>
                                 <div className="flex justify-between py-2">
                                    <span className="text-gray-400">Last Updated:</span>
                                    <span className="text-white font-medium">
                                       {new Date(
                                          ambulanceData.lastUpdated
                                       ).toLocaleDateString()}
                                    </span>
                                 </div>
                              </div>
                           </div>

                           <div>
                              <h4 className="text-mdfont-semibold text-gray-300 mb-4">
                                 Status Information
                              </h4>
                              <div className="space-y-3">
                                 <div className="flex justify-between py-2 border-b border-dark-tertiary">
                                    <span className="text-gray-400">Current Status:</span>
                                    <span className="text-white font-medium capitalize">
                                       {ambulanceData.status}
                                    </span>
                                 </div>
                                 <div className="flex justify-between py-2 border-b border-dark-tertiary">
                                    <span className="text-gray-400">Location:</span>
                                    <span className="text-white font-medium">
                                       {ambulanceData.location || "Unknown"}
                                    </span>
                                 </div>
                                 <div className="flex justify-between py-2 border-b border-dark-tertiary">
                                    <span className="text-gray-400">Driver Name:</span>
                                    <span className="text-white font-medium">
                                       {ambulanceData.driverName}
                                    </span>
                                 </div>
                                 <div className="flex justify-between py-2 border-b border-dark-tertiary">
                                    <span className="text-gray-400">Driver Phone:</span>
                                    <span className="text-white font-medium">
                                       {ambulanceData.driverPhone}
                                    </span>
                                 </div>
                                 <div className="flex justify-between py-2 border-b border-dark-tertiary">
                                    <span className="text-gray-400">
                                       Registration Number:
                                    </span>
                                    <span className="text-white font-medium">
                                       {ambulanceData.registrationNumber}
                                    </span>
                                 </div>
                                 <div className="flex justify-between py-2 border-b border-dark-tertiary">
                                    <span className="text-gray-400">Created:</span>
                                    <span className="text-white font-medium">
                                       {new Date(
                                          ambulanceData.createdAt
                                       ).toLocaleDateString()}
                                    </span>
                                 </div>
                                 <div className="flex justify-between py-2">
                                    <span className="text-gray-400">Last Updated:</span>
                                    <span className="text-white font-medium">
                                       {new Date(
                                          ambulanceData.lastUpdated
                                       ).toLocaleDateString()}
                                    </span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div>
                        <h4 className="text-mdfont-semibold text-gray-300 mb-4">
                           Ambulance Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <div className="p-6 bg-dark-tertiary/30 rounded">
                              <div className="flex items-center justify-between mb-3">
                                 <h5 className="text-mdtext-gray-400">Ambulance Name</h5>
                                 <Wrench className="text-emerald-500" size={20} />
                              </div>
                              <div className="text-2xl  mb-1">
                                 {ambulanceData.name}
                              </div>
                              <div className="text-xs text-gray-400">
                                 Unique identifier
                              </div>
                           </div>

                           <div className="p-6 bg-dark-tertiary/30 rounded">
                              <div className="flex items-center justify-between mb-3">
                                 <h5 className="text-mdtext-gray-400">
                                    Registration Number
                                 </h5>
                                 <Clock className="text-emerald-500" size={20} />
                              </div>
                              <div className="text-2xl  mb-1">
                                 {ambulanceData.registrationNumber}
                              </div>
                              <div className="text-xs text-gray-400">
                                 Vehicle registration
                              </div>
                           </div>

                           <div className="p-6 bg-dark-tertiary/30 rounded">
                              <div className="flex items-center justify-between mb-3">
                                 <h5 className="text-mdtext-gray-400">Current Status</h5>
                                 <TrendingUp className="text-emerald-500" size={20} />
                              </div>
                              <div className="text-2xl  mb-1 capitalize">
                                 {ambulanceData.status}
                              </div>
                              <div className="text-xs text-emerald-500">
                                 Active status
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === "maintenance" && (
                  <div className="space-y-6">
                     <div>
                        <h3 className="text-lg font-semibold mb-4">
                           Maintenance History
                        </h3>
                        <p className="text-gray-400 text-mdmb-6">
                           View past maintenance records and schedule future services.
                        </p>

                        <div className="space-y-4">
                           {maintenanceHistory.map((record, index) => (
                              <div
                                 key={index}
                                 className="p-6 bg-dark-tertiary/30 rounded border border-dark-tertiary"
                              >
                                 <div className="flex justify-between items-start mb-3">
                                    <div>
                                       <h4 className="font-semibold text-white mb-1">
                                          {record.type}
                                       </h4>
                                       <p className="text-mdtext-gray-400">
                                          {record.description}
                                       </p>
                                    </div>
                                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-xs">
                                       {record.status}
                                    </span>
                                 </div>
                                 <div className="flex justify-between items-center my-3 my-3 text-sm">
                                    <div className="flex items-center gap-2 text-gray-400">
                                       <Calendar size={16} />
                                       <span>{record.date}</span>
                                    </div>
                                    <span className="text-white font-medium">
                                       {record.cost}
                                    </span>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === "equipment" && (
                  <div className="space-y-6">
                     <div>
                        <h3 className="text-lg font-semibold mb-4">Equipment List</h3>
                        <p className="text-gray-400 text-mdmb-6">
                           Medical equipment and supplies onboard this ambulance.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {equipment.map((item, index) => (
                              <div
                                 key={index}
                                 className="p-4 bg-dark-tertiary/30 rounded border border-dark-tertiary"
                              >
                                 <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-white">{item.name}</h4>
                                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded text-xs">
                                       {item.status}
                                    </span>
                                 </div>
                                 <div className="text-xs text-gray-400">
                                    Last checked: {item.lastChecked}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === "calls" && (
                  <div className="space-y-6">
                     <div>
                        <h3 className="text-lg font-semibold mb-4">Call Assignments</h3>
                        <p className="text-gray-400 text-mdmb-6">
                           Recent emergency calls assigned to this ambulance.
                        </p>

                        <div className="overflow-x-auto">
                           <DataTable columns={columns_0} data={callAssignments} enableLocalSearch enableLocalPagination />
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </>
   );
}

export default function AmbulanceDetailsPage() {
   return (
      <Suspense fallback={<div>Loading...</div>}>
         <AmbulanceDetailsContent />
      </Suspense>
   );
}
