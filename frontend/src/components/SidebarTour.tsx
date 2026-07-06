'use client';

import { useState } from 'react';
import SystemTourModal from './ui/SystemTourModal';

interface SidebarTourStep {
 title: string;
 description: string;
 targetSelector?: string;
 position?: 'top' | 'bottom' | 'left' | 'right';
}

const sidebarTourSteps: SidebarTourStep[] = [
 {
 title: '🏥 Dashboard Module',
 description: 'The Dashboard is your central command center. It provides an overview of your clinic\'s performance with key metrics, charts, and recent activities. Access different dashboard views:\n\n• Admin Dashboard: Full administrative overview\n• Doctor Dashboard: Doctor-specific metrics and schedule\n• Patient Dashboard: Patient-focused information and history\n\nClick to expand and access these specialized views.',
 targetSelector: '[data-tour="dashboard-nav"]',
 position: 'top',
 },
 {
 title: '👨‍⚕️ Doctors Management',
 description: 'Manage your medical staff efficiently. This module handles all doctor-related operations:\n\n• Doctors List: View and search all registered doctors\n• Add Doctor: Register new medical staff members\n• Doctor Schedule: Manage appointments and availability\n\nEssential for maintaining your healthcare team and scheduling.',
 targetSelector: '[data-tour="doctors-nav"]',
 position: 'top',
 },
 {
 title: '👥 Patients Management',
 description: 'Central patient information hub. Manage patient records and registration:\n\n• Patients List: Browse and search patient database\n• Add Patient: Register new patients with complete profiles\n\nStore medical history, contact information, and treatment records for comprehensive care.',
 targetSelector: '[data-tour="patients-nav"]',
 position: 'top',
 },
 {
 title: '📅 Appointments System',
 description: 'Complete appointment scheduling and management system:\n\n• All Appointments: View comprehensive appointment calendar\n• Add Appointment: Schedule new patient visits\n• Calendar View: Visual appointment timeline\n• Appointment Requests: Handle booking requests\n\nStreamline patient scheduling and reduce no-shows.',
 targetSelector: '[data-tour="appointments-nav"]',
 position: 'top',
 },
 {
 title: '💊 Prescriptions Module',
 description: 'Digital prescription management for modern healthcare:\n\n• All Prescriptions: Access prescription history and records\n• Create Prescription: Write new prescriptions digitally\n\nEnsure accurate medication dispensing and maintain prescription records.',
 targetSelector: '[data-tour="prescriptions-nav"]',
 position: 'top',
 },
 {
 title: '🚑 Ambulance Services',
 description: 'Emergency response coordination and ambulance management:\n\n• Ambulance Call List: Track emergency response calls\n• Ambulance List: Manage fleet and availability\n• Ambulance Details: Vehicle maintenance and status\n\nCritical for emergency medical services and patient transport.',
 targetSelector: '[data-tour="ambulance-nav"]',
 position: 'top',
 },
 {
 title: '🏥 Pharmacy Integration',
 description: 'Integrated pharmacy management within your clinic:\n\n• Medicine List: Inventory of available medications\n• Add Medicine: Stock new medications and supplies\n\nSeamlessly connect prescriptions to pharmacy dispensing for better patient care.',
 targetSelector: '[data-tour="pharmacy-nav"]',
 position: 'top',
 },
 {
 title: '🩸 Blood Bank Management',
 description: 'Complete blood bank operations and inventory:\n\n• Blood Stock: Monitor blood type availability\n• Blood Donor: Manage donor database and schedules\n• Blood Issued: Track blood transfusions and usage\n• Add Blood Unit: Register new blood donations\n• Issue Blood: Process blood requests and distribution\n\nCritical for emergency transfusions and surgical procedures.',
 targetSelector: '[data-tour="blood-bank-nav"]',
 position: 'top',
 },
 {
 title: '🏥 Departments Management',
 description: 'Organize your clinic by medical specialties:\n\n• Department List: View all medical departments\n• Add Department: Create new specialty departments\n• Services Offered: Manage department capabilities\n\nStructure your healthcare services by medical expertise areas.',
 targetSelector: '[data-tour="departments-nav"]',
 position: 'top',
 },
 {
 title: '📦 Inventory Control',
 description: 'Medical supplies and equipment inventory management:\n\n• Inventory List: Track all medical supplies and equipment\n• Add Item: Register new inventory items\n• Stock Alerts: Automatic low-stock notifications\n• Suppliers List: Manage vendor relationships\n\nEnsure you never run out of critical medical supplies.',
 targetSelector: '[data-tour="inventory-nav"]',
 position: 'top',
 },
 {
 title: '👥 Staff Management',
 description: 'Comprehensive staff administration and HR functions:\n\n• All Staff: Complete staff directory and profiles\n• Add Staff: Hire and onboard new employees\n• Roles & Permissions: Control access and responsibilities\n• Attendance: Track staff schedules and presence\n\nManage your entire healthcare workforce efficiently.',
 targetSelector: '[data-tour="staff-nav"]',
 position: 'top',
 },
 {
 title: '📋 Medical Records',
 description: 'Vital records management for healthcare compliance:\n\n• Birth Records: Document newborn registrations\n• Death Records: Maintain mortality records\n\nEssential for legal compliance and statistical reporting.',
 targetSelector: '[data-tour="records-nav"]',
 position: 'top',
 },
 {
 title: '🏠 Room Allotment',
 description: 'Hospital room and bed management system:\n\n• Alloted Rooms: Current room assignments and occupancy\n• New Allotment: Assign patients to available rooms\n• Rooms by Department: Department-specific room management\n• Add New Room: Register new rooms and facilities\n\nOptimize bed utilization and patient accommodation.',
 targetSelector: '[data-tour="room-allotment-nav"]',
 position: 'top',
 },
 {
 title: '💰 Billing & Payments',
 description: 'Complete financial management for healthcare services:\n\n• Invoices: Generate and manage patient bills\n• Create Invoice: Process new billing requests\n• Payments History: Track all financial transactions\n• Insurance Claims: Handle insurance processing\n\nStreamline revenue collection and financial reporting.',
 targetSelector: '[data-tour="billing-nav"]',
 position: 'top',
 },
 {
 title: '📊 Reports & Analytics',
 description: 'Comprehensive reporting for data-driven decisions:\n\n• Appointment Reports: Scheduling and utilization analytics\n• Financial Reports: Revenue and expense analysis\n• Patient Visit Reports: Treatment and outcome metrics\n• Inventory Reports: Supply chain and usage statistics\n• Staff Performance: Productivity and efficiency metrics\n• Custom Reports: Flexible reporting tools\n\nTransform your data into actionable insights.',
 targetSelector: '[data-tour="reports-nav"]',
 position: 'top',
 },
 {
 title: '⭐ Reviews & Feedback',
 description: 'Patient and staff feedback management:\n\n• Doctor Reviews: Patient feedback on medical care\n• Patient Reviews: Overall clinic experience ratings\n\nMonitor service quality and identify improvement areas.',
 targetSelector: '[data-tour="reviews-nav"]',
 position: 'top',
 },
 {
 title: '💬 Patient Feedback',
 description: 'Direct patient communication and satisfaction tracking. Collect detailed feedback about their healthcare experience, service quality, and suggestions for improvement. Use this valuable input to enhance patient care and clinic operations.',
 targetSelector: '[data-tour="feedback-nav"]',
 position: 'top',
 },
 {
 title: '⚙️ System Settings',
 description: 'Configure your clinic management system. Customize user preferences, system behavior, notification settings, and administrative controls. Maintain system security and user access management.',
 targetSelector: '[data-tour="settings-nav"]',
 position: 'top',
 },
 {
 title: '🔐 Authentication',
 description: 'User authentication and access control center. Manage user accounts, passwords, security settings, and role-based permissions. Ensure secure access to sensitive patient and clinic data.',
 targetSelector: '[data-tour="authentication-nav"]',
 position: 'top',
 },
 {
 title: '📆 Calendar Integration',
 description: 'Integrated calendar system for scheduling and planning. View appointments, events, and important dates in a visual calendar format. Sync with external calendars and manage recurring events.',
 targetSelector: '[data-tour="calendar-nav"]',
 position: 'top',
 },
 {
 title: '✅ Task Management',
 description: 'Organize and track tasks for your healthcare team. Create, assign, and monitor tasks related to patient care, administrative duties, and clinic operations. Improve team productivity and ensure nothing falls through the cracks.',
 targetSelector: '[data-tour="tasks-nav"]',
 position: 'top',
 },
 {
 title: '📞 Contacts Directory',
 description: 'Centralized contacts management for your clinic. Store and organize contact information for patients, staff, emergency contacts, and external healthcare providers. Quick access to important phone numbers and addresses.',
 targetSelector: '[data-tour="contacts-nav"]',
 position: 'top',
 },
 {
 title: '📧 Email Communication',
 description: 'Integrated email system for professional communication. Send appointment reminders, test results, billing information, and other important notifications. Maintain electronic communication records for compliance.',
 targetSelector: '[data-tour="email-nav"]',
 position: 'top',
 },
 {
 title: '🎯 Sidebar Tour Complete!',
 description: 'You\'ve explored all major modules in your Healthcare CRM system:\n\n• Core Modules: Dashboard, Doctors, Patients, Appointments\n• Medical Services: Prescriptions, Ambulance, Pharmacy, Blood Bank\n• Administration: Departments, Inventory, Staff, Records\n• Facilities: Room Allotment, Billing, Reports\n• Communication: Reviews, Feedback, Calendar, Tasks, Email\n\nEach module contains sub-sections for detailed management. Click any module to explore its features and start managing your clinic efficiently!',
 position: 'bottom',
 },
];

interface SidebarTourProps {
 onComplete?: () => void;
 autoStart?: boolean;
}

export default function SidebarTour({
 onComplete,
 autoStart = false,
}: SidebarTourProps) {
 const [currentStep, setCurrentStep] = useState(0);
 const [showModal, setShowModal] = useState(autoStart);
 const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
 const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

 const handleStartTour = () => {
 setCurrentStep(0);
 setShowModal(true);
 highlightElement(0);
 };

 const highlightElement = (stepIndex: number) => {
 // Remove previous highlight
 if (highlightedElement) {
 highlightedElement.style.boxShadow = '';
 highlightedElement.style.borderRadius = '';
 }

 const step = sidebarTourSteps[stepIndex];
 if (step.targetSelector) {
 const element = document.querySelector(step.targetSelector) as HTMLElement;
 if (element) {
 element.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.4)';
 element.style.borderRadius = '8px';
 element.scrollIntoView({ behavior: 'smooth', block: 'center' });
 setHighlightedElement(element);

 // Calculate modal position based on element and step position
 const rect = element.getBoundingClientRect();
 const modalWidth = 400; // Approximate modal width
 const modalHeight = 300; // Approximate modal height
 const margin = 10; // Space between modal and element (reduced for closer positioning)

 let modalX = 0;
 let modalY = 0;

 switch (step.position) {
 case 'top':
 modalX = rect.left + (rect.width / 2) - (modalWidth / 2);
 modalY = rect.top - modalHeight - margin;
 break;
 case 'bottom':
 modalX = rect.left + (rect.width / 2) - (modalWidth / 2);
 modalY = rect.bottom + margin;
 break;
 case 'left':
 modalX = rect.left - modalWidth - margin;
 modalY = rect.top + (rect.height / 2) - (modalHeight / 2);
 break;
 case 'right':
 modalX = rect.right + margin;
 modalY = rect.top + (rect.height / 2) - (modalHeight / 2);
 break;
 default:
 // Center position as fallback
 modalX = window.innerWidth / 2 - modalWidth / 2;
 modalY = window.innerHeight / 2 - modalHeight / 2;
 }

 // Ensure modal stays within viewport bounds
 modalX = Math.max(0, Math.min(modalX, window.innerWidth - modalWidth));
 modalY = Math.max(0, Math.min(modalY, window.innerHeight - modalHeight));

 setModalPosition({ x: modalX, y: modalY });
 }
 } else {
 // No target element, center the modal
 setModalPosition({
 x: window.innerWidth / 2 - 200,
 y: window.innerHeight / 2 - 150
 });
 }
 };

 const handleCloseTour = () => {
 setShowModal(false);
 if (highlightedElement) {
 highlightedElement.style.boxShadow = '';
 highlightedElement.style.borderRadius = '';
 }
 if (onComplete) {
 onComplete();
 }
 };

 const handleNextStep = () => {
 if (currentStep < sidebarTourSteps.length - 1) {
 const nextStep = currentStep + 1;
 setCurrentStep(nextStep);
 // Reset drag state for new step
 setTimeout(() => highlightElement(nextStep), 100);
 } else {
 handleCloseTour();
 }
 };

 const handlePrevStep = () => {
 if (currentStep > 0) {
 const prevStep = currentStep - 1;
 setCurrentStep(prevStep);
 // Reset drag state for new step
 setTimeout(() => highlightElement(prevStep), 100);
 }
 };

 const handleSkipTour = () => {
 handleCloseTour();
 };

 const step = sidebarTourSteps[currentStep];

 return (
 <>
 <button
 onClick={handleStartTour}
 className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
 data-testid="sidebar-tour-start-button"
 title="Start interactive sidebar tour"
 >
 <svg
 className="w-5 h-5"
 fill="none"
 stroke="currentColor"
 viewBox="0 0 24 24"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
 />
 </svg>
 Sidebar Tour
 </button>

 <SystemTourModal
 isOpen={showModal}
 onClose={handleCloseTour}
 title={step.title}
 description={step.description}
 currentStep={currentStep + 1}
 totalSteps={sidebarTourSteps.length}
 onNext={handleNextStep}
 onPrev={handlePrevStep}
 onSkip={handleSkipTour}
 position={modalPosition}
 />
 </>
 );
}