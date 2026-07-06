"use client";

import { useState } from "react";
import SystemTourModal from "./ui/SystemTourModal";

interface ModuleInfo {
 title: string;
 description: string;
 features: string[];
 icon?: string;
 actionLabel?: string;
}

interface ModuleTourProps {
 isOpen: boolean;
 onClose: () => void;
 module: ModuleInfo | null;
 onExplore?: () => void;
}

const moduleDatabase: Record<string, ModuleInfo> = {
 dashboard: {
 title: "📊 Dashboard - System Overview",
 description:
 "Welcome to your Hospital Management Dashboard! This is your central hub where you can see all key metrics and performance indicators at a glance.",
 features: [
 "Total Revenue Card: Track financial performance with month-over-month growth",
 "Metrics Overview: Quick stats on appointments, patients, and doctors",
 "Revenue Trends Chart: Visualize earnings patterns over time",
 "Patient Growth Chart: Monitor registration trends and capacity planning",
 "Recent Appointments: Quick view of latest bookings and status tracking",
 ],
 icon: "📊",
 actionLabel: "Explore Dashboard",
 },
 doctors: {
 title: "👨‍⚕️ Doctors Management - Medical Staff Control",
 description:
 "Manage your medical staff efficiently. Maintain comprehensive doctor profiles, schedules, and specialties for optimal resource allocation.",
 features: [
 "Doctors List: Browse and search all registered medical professionals",
 "Add Doctor: Register new staff members with complete profiles",
 "Doctor Schedule: Manage appointments and availability slots",
 "Specialties: Organize doctors by medical specializations",
 "Performance Tracking: Monitor doctor efficiency and patient satisfaction",
 ],
 icon: "👨‍⚕️",
 actionLabel: "Manage Doctors",
 },
 patients: {
 title: "👥 Patients Management - Patient Records System",
 description:
 "Central patient information hub. Manage all patient data, medical history, and treatment records with secure storage.",
 features: [
 "Patients List: Browse and search complete patient database",
 "Add Patient: Register new patients with comprehensive profiles",
 "Medical History: Store and track patient treatment records",
 "Contact Information: Maintain patient communication details",
 "Treatment Plans: Organize ongoing care and medication schedules",
 ],
 icon: "👥",
 actionLabel: "View Patients",
 },
 appointments: {
 title: "📅 Appointments Management - Complete Scheduling System",
 description:
 "The Appointments module provides comprehensive scheduling and management of patient bookings with multiple views and flexibility.",
 features: [
 "All Appointments: Complete appointment list with status tracking and management",
 "Calendar View: Visual appointment timeline with drag-and-drop scheduling",
 "Add Appointment: Create new appointments with automatic conflict checking",
 "Appointment Requests: Manage pending booking requests and confirmations",
 "Notification System: Automatic reminders for patients and doctors",
 ],
 icon: "📅",
 actionLabel: "Explore Appointments",
 },
 prescriptions: {
 title: "💊 Prescriptions Module - Digital Medication Management",
 description:
 "Digital prescription management for modern healthcare. Streamline medication dispensing and maintain detailed records.",
 features: [
 "All Prescriptions: Access prescription history and complete records",
 "Create Prescription: Write new prescriptions digitally with validation",
 "Dosage Management: Precise dosing instructions and frequency control",
 "Patient Medication History: Track all prescriptions and medication compliance",
 ],
 icon: "💊",
 actionLabel: "Manage Prescriptions",
 },
 ambulance: {
 title: "🚑 Ambulance Services - Emergency Response Coordination",
 description:
 "Emergency response coordination and ambulance management. Ensure rapid response for critical situations.",
 features: [
 "Ambulance Call List: Track all emergency response calls and status",
 "Ambulance Fleet: Manage vehicle inventory and availability",
 "Driver Management: Maintain driver profiles and certifications",
 "Response Tracking: Monitor call response times and efficiency",
 "Maintenance Logs: Schedule regular vehicle maintenance and inspections",
 ],
 icon: "🚑",
 actionLabel: "View Ambulances",
 },
 pharmacy: {
 title: "🏥 Pharmacy Integration - Medicine Inventory Management",
 description:
 "Integrated pharmacy management within your clinic. Connect prescriptions to dispensing with accurate inventory tracking.",
 features: [
 "Medicine List: Complete inventory of available medications",
 "Add Medicine: Stock new medications and supplies",
 "Stock Levels: Monitor medication availability and low-stock alerts",
 "Supplier Management: Organize vendor relationships and orders",
 "Expiry Tracking: Automatic alerts for expiring medications",
 ],
 icon: "🏥",
 actionLabel: "Manage Pharmacy",
 },
 "blood-bank": {
 title: "🩸 Blood Bank Management - Blood Inventory System",
 description:
 "Complete blood bank operations and inventory management. Critical for emergency transfusions and surgical procedures.",
 features: [
 "Blood Stock: Monitor blood type availability and quantities",
 "Blood Donor: Manage donor database and donation schedules",
 "Blood Issued: Track blood transfusions and usage patterns",
 "Add Blood Unit: Register new blood donations and testing",
 "Issue Blood: Process blood requests and distribution safely",
 ],
 icon: "🩸",
 actionLabel: "View Blood Bank",
 },
 departments: {
 title: "🏢 Departments Management - Specialty Organization",
 description:
 "Organize your clinic by medical specialties. Structure healthcare services by expertise areas and departments.",
 features: [
 "Department List: View all medical departments and specialties",
 "Add Department: Create new specialty departments",
 "Services Offered: Manage department-specific capabilities",
 "Department Head: Assign medical leadership and hierarchy",
 "Service Hours: Define department operating hours and schedules",
 ],
 icon: "🏢",
 actionLabel: "View Departments",
 },
 inventory: {
 title: "📦 Inventory Control - Medical Supplies Management",
 description:
 "Medical supplies and equipment inventory management. Ensure you never run out of critical supplies.",
 features: [
 "Inventory List: Track all medical supplies and equipment",
 "Add Item: Register new inventory items with details",
 "Stock Alerts: Automatic low-stock notifications and reorders",
 "Suppliers List: Manage vendor relationships and pricing",
 "Usage Reports: Analyze consumption patterns and trends",
 ],
 icon: "📦",
 actionLabel: "Manage Inventory",
 },
 staff: {
 title: "👥 Staff Management - Workforce Administration",
 description:
 "Comprehensive staff administration and HR functions. Manage your entire healthcare workforce efficiently.",
 features: [
 "All Staff: Complete staff directory and employee profiles",
 "Add Staff: Hire and onboard new employees efficiently",
 "Roles & Permissions: Control access levels and responsibilities",
 "Attendance: Track staff schedules, shifts, and presence",
 "Performance Reviews: Monitor employee productivity and evaluations",
 ],
 icon: "👥",
 actionLabel: "Manage Staff",
 },
 "room-allotment": {
 title: "🏠 Room Allotment - Bed Management System",
 description:
 "Hospital room and bed management system. Optimize bed utilization and patient accommodation.",
 features: [
 "Allotted Rooms: View current room assignments and occupancy",
 "New Allotment: Assign patients to available rooms quickly",
 "Rooms by Department: Department-specific room organization",
 "Add New Room: Register new rooms and facilities",
 "Occupancy Reports: Track bed utilization and availability",
 ],
 icon: "🏠",
 actionLabel: "View Rooms",
 },
 billing: {
 title: "💰 Billing & Payments - Financial Management",
 description:
 "Complete financial management for healthcare services. Streamline revenue collection and financial reporting.",
 features: [
 "Invoices: Generate and manage patient bills and statements",
 "Create Invoice: Process new billing requests accurately",
 "Payments History: Track all financial transactions and receipts",
 "Insurance Claims: Handle insurance processing and submissions",
 "Financial Reports: Generate revenue and expense analysis",
 ],
 icon: "💰",
 actionLabel: "Manage Billing",
 },
 reports: {
 title: "📊 Reports & Analytics - Data-Driven Decisions",
 description:
 "Comprehensive reporting for data-driven decisions. Transform your data into actionable insights.",
 features: [
 "Appointment Reports: Scheduling and utilization analytics",
 "Financial Reports: Revenue and expense analysis dashboards",
 "Patient Visit Reports: Treatment and outcome metrics",
 "Inventory Reports: Supply chain and usage statistics",
 "Staff Performance: Productivity and efficiency metrics analysis",
 ],
 icon: "📊",
 actionLabel: "View Reports",
 },
 reviews: {
 title: "⭐ Reviews & Feedback - Quality Monitoring",
 description:
 "Patient and staff feedback management. Monitor service quality and identify improvement areas.",
 features: [
 "Doctor Reviews: Patient feedback on medical care quality",
 "Patient Reviews: Overall clinic experience ratings",
 "Feedback Analytics: Analyze trends and common feedback themes",
 "Response Management: Track and respond to customer feedback",
 "Rating Reports: Generate quality assurance reports",
 ],
 icon: "⭐",
 actionLabel: "View Reviews",
 },
 settings: {
 title: "⚙️ System Settings - Configuration Control",
 description:
 "Configure your clinic management system. Customize preferences, behavior, and administrative controls.",
 features: [
 "User Preferences: Customize personal system settings and themes",
 "System Configuration: Adjust core system behavior and features",
 "Notification Settings: Control alert preferences and channels",
 "Security Settings: Manage passwords and access controls",
 "System Logs: Monitor system activities and audit trails",
 ],
 icon: "⚙️",
 actionLabel: "Configure Settings",
 },
};

export default function ModuleTour({
 isOpen,
 onClose,
 module,
 onExplore,
}: ModuleTourProps) {
 const [showDetails, setShowDetails] = useState(false);

 if (!module) return null;

 const handleExplore = () => {
 if (onExplore) {
 onExplore();
 }
 onClose();
 };

 return (
 <div
 className="fixed inset-0 bg-black/50 z-40 p-4 animate-in fade-in duration-200"
 onClick={(e) => {
 if (e.target === e.currentTarget) {
 onClose();
 }
 }}
 >
 <style>{`
 @keyframes slideInScale {
 from {
 opacity: 0;
 transform: scale(0.95) translateY(-20px);
 }
 to {
 opacity: 1;
 transform: scale(1) translateY(0);
 }
 }

 .module-tour-modal {
 animation: slideInScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
 }
 `}</style>

 <div className="module-tour-modal bg-dark-secondary border border-dark-tertiary rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
 <div className="flex justify-between items-start p-6 border-b border-dark-tertiary bg-gradient-to-r from-blue-600/10 to-blue-600/5">
 <div>
 <h2 className="text-2xl font-bold text-white mb-2">
 {module.title}
 </h2>
 <p className="text-gray-300 text-sm">{module.description}</p>
 </div>
 <button
 onClick={onClose}
 className="text-gray-400 hover:text-white transition-colors"
 >
 ✕
 </button>
 </div>

 <div className="flex-1 overflow-y-auto p-6">
 <h3 className="text-lg font-semibold text-white mb-4">
 Key Features:
 </h3>
 <ul className="space-y-3">
 {module.features.map((feature, idx) => (
 <li key={idx} className="flex items-start gap-3">
 <span className="text-blue-400 font-bold flex-shrink-0">•</span>
 <span className="text-gray-200 text-mdleading-relaxed">
 {feature}
 </span>
 </li>
 ))}
 </ul>
 </div>

 <div className="flex justify-between items-center p-6 border-t border-dark-tertiary bg-dark">
 <button
 onClick={onClose}
 className="px-4 py-2 bg-dark-tertiary hover:bg-dark-tertiary/80 text-white rounded-lg transition-colors"
 >
 Back
 </button>
 <button
 onClick={handleExplore}
 className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
 >
 {module.actionLabel || "Explore"}
 <span>→</span>
 </button>
 </div>
 </div>
 </div>
 );
}
