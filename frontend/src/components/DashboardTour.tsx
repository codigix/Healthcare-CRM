'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import SystemTourModal from './ui/SystemTourModal';
import WelcomeTourScreen from './WelcomeTourScreen';

interface DashboardTourStep {
 title: string;
 description: string;
 actionTip?: string;
 targetSelector?: string;
 position?: 'top' | 'bottom' | 'left' | 'right';
 navigateTo?: string;
 pageLabel?: string;
}

const dashboardTourSteps: DashboardTourStep[] = [
 {
 title: '🎉 Welcome to MedixPro System Tour',
 description: 'Welcome to your Hospital Management Dashboard! This is your command center for managing all clinic operations. You\'ll see key metrics, charts, and recent activities that help you monitor your clinic\'s health at a glance.',
 actionTip: '👇 Click "Next" to begin the guided tour of all modules.',
 position: 'bottom',
 navigateTo: '/dashboard',
 pageLabel: 'Welcome to MedixPro',
 },
 {
 title: '📊 Welcome to Your Dashboard',
 description: 'Welcome to your Hospital Management Dashboard! This is your command center for managing all clinic operations. You\'ll see key metrics, charts, and recent activities that help you monitor your clinic\'s health at a glance.',
 actionTip: '👇 Let\'s explore the dashboard. Click "Next" to continue.',
 targetSelector: '[data-tour="dashboard-header"]',
 position: 'bottom',
 navigateTo: '/dashboard',
 pageLabel: 'Admin Dashboard',
 },
 {
 title: '💰 Revenue Performance',
 description: 'This card shows your clinic\'s total earnings at a glance.\n\n📌 What it shows:\n• Total revenue generated\n• Month-over-month growth percentage\n• Quick financial health indicator\n\n💡 Why it matters: Helps you understand your clinic\'s profitability and financial trends.',
 actionTip: '💡 Tip: Click this card to see detailed financial reports and payment history.',
 targetSelector: '[data-tour="metrics-cards"] .card:nth-child(1)',
 position: 'bottom',
 navigateTo: '/dashboard',
 pageLabel: 'Admin Dashboard',
 },
 {
 title: '📅 Appointment Tracking',
 description: 'This card displays your total appointments and their growth trend.\n\n📌 What it shows:\n• Total number of scheduled appointments\n• Month-over-month appointment growth\n• Booking trend indicator\n\n💡 Why it matters: Helps you understand patient demand and clinic capacity utilization.',
 actionTip: '💡 Tip: Click to access the calendar and manage appointment bookings.',
 targetSelector: '[data-tour="metrics-cards"] .card:nth-child(2)',
 position: 'bottom',
 navigateTo: '/dashboard',
 pageLabel: 'Admin Dashboard',
 },
 {
 title: '📈 Revenue Trends & Charts',
 description: 'This section visualizes your revenue and patient growth trends over time.\n\n📌 What it shows:\n• Revenue patterns and trends\n• Patient registration patterns\n• Peak and low-performing periods\n\n💡 Why it matters: Essential for identifying seasonal patterns and making business decisions.',
 actionTip: '💡 Tip: Hover over charts to see exact details. Use data for forecasting.',
 targetSelector: '[data-tour="charts-section"] .card:nth-child(1)',
 position: 'top',
 navigateTo: '/dashboard',
 pageLabel: 'Admin Dashboard',
 },
 {
 title: '👨‍⚕️ Doctors Management',
 description: 'The Doctors module helps you manage your medical staff efficiently.\n\n📌 Features:\n• Maintain doctor profiles and specialties\n• Manage doctor schedules and availability\n• Track doctor performance metrics\n\n💡 Pro Tip: Add new doctors with complete profiles including specialization and contact info.',
 actionTip: '👉 Click on the "Add Doctor" button to register a new medical professional.',
 targetSelector: 'a[href="/doctors/add"], button:has-text("Add Doctor")',
 position: 'bottom',
 navigateTo: '/doctors/add',
 pageLabel: 'Doctors Management',
 },
 {
 title: '👥 Patients Management',
 description: 'The Patients module provides comprehensive patient record management.\n\n📌 Features:\n• Register new patients with complete profiles\n• Access detailed medical histories\n• Track patient appointments and treatments\n\n💡 Pro Tip: Keep patient information up-to-date for better care coordination.',
 actionTip: '👉 Click on the "Add Patient" button to register a new patient.',
 targetSelector: 'a[href="/patients/add"], button:has-text("Add Patient")',
 position: 'bottom',
 navigateTo: '/patients/add',
 pageLabel: 'Patients Management',
 },
 {
 title: '📅 Appointments Scheduling',
 description: 'The Appointments module enables complete scheduling and management.\n\n📌 Features:\n• Create and manage appointment bookings\n• View calendar timeline\n• Handle appointment requests\n• Send patient reminders\n\n💡 Pro Tip: Schedule appointments strategically to maximize doctor availability.',
 actionTip: '👉 Click on the "Add Appointment" button to schedule a new appointment.',
 targetSelector: 'a[href="/appointments/add"], button:has-text("Add Appointment")',
 position: 'bottom',
 navigateTo: '/appointments/add',
 pageLabel: 'Appointments Scheduling',
 },
 {
 title: '💊 Prescriptions Management',
 description: 'The Prescriptions module handles digital medication management.\n\n📌 Features:\n• Create and issue digital prescriptions\n• Manage medication dosages and frequencies\n• Track patient medication history',
 actionTip: '👉 Click on the "Create Prescription" button to issue a new prescription.',
 targetSelector: 'a[href="/prescriptions/create"], button:has-text("Create Prescription")',
 position: 'bottom',
 navigateTo: '/prescriptions/create',
 pageLabel: 'Prescriptions Management',
 },
 {
 title: '🚑 Ambulance Services',
 description: 'The Ambulance module coordinates emergency response services.\n\n📌 Features:\n• Track ambulance calls and responses\n• Manage ambulance fleet inventory\n• Monitor driver availability\n• Track response times and efficiency\n\n💡 Pro Tip: Ensure ambulances are strategically positioned for rapid response.',
 actionTip: '👉 Check the ambulance call list and current fleet status.',
 targetSelector: 'a[href="/ambulance/add"], button:has-text("Add Ambulance")',
 position: 'bottom',
 navigateTo: '/ambulance/add',
 pageLabel: 'Ambulance Services',
 },
 {
 title: '🏥 Pharmacy Management',
 description: 'The Pharmacy module integrates medicine inventory with prescriptions.\n\n📌 Features:\n• Maintain medicine inventory\n• Monitor stock levels\n• Track medicine expiry dates\n• Connect prescriptions to dispensing\n\n💡 Pro Tip: Keep stock levels adequate to avoid shortages during peak hours.',
 actionTip: '👉 Click on the "Add Medicine" button to stock new medications.',
 targetSelector: 'a[href="/pharmacy/add-medicine"], button:has-text("Add Medicine")',
 position: 'bottom',
 navigateTo: '/pharmacy/add-medicine',
 pageLabel: 'Pharmacy Management',
 },
 {
 title: '🩸 Blood Bank Operations',
 description: 'The Blood Bank module manages blood inventory for transfusions.\n\n📌 Features:\n• Monitor blood type availability\n• Manage donor database\n• Track blood transfusions\n• Handle emergency blood requests\n\n💡 Pro Tip: Maintain adequate blood stock for emergency situations.',
 actionTip: '👉 Click on the "Add Blood Unit" button to register donated blood.',
 targetSelector: 'a[href="/blood-bank/add-unit"], button:has-text("Add Blood Unit")',
 position: 'bottom',
 navigateTo: '/blood-bank/add-unit',
 pageLabel: 'Blood Bank Operations',
 },
 {
 title: '🏢 Departments Management',
 description: 'The Departments module organizes your hospital by medical specialties.\n\n📌 Features:\n• Create and manage departments\n• Define services offered per department\n• Assign department heads\n• Set department operating hours\n\n💡 Pro Tip: Organize departments by specialty for better resource allocation.',
 actionTip: '👉 Click on the "Add Department" button to create a new specialty department.',
 targetSelector: 'a[href="/departments/add"], button:has-text("Add Department")',
 position: 'bottom',
 navigateTo: '/departments/add',
 pageLabel: 'Departments Management',
 },
 {
 title: '📦 Inventory Control',
 description: 'The Inventory module manages medical supplies and equipment.\n\n📌 Features:\n• Track all medical supplies\n• Monitor stock levels with alerts\n• Manage supplier relationships\n• Analyze consumption patterns\n\n💡 Pro Tip: Set up low-stock alerts to prevent supply shortages.',
 actionTip: '👉 Click on the "Add Item" button to register new inventory.',
 targetSelector: 'a[href="/inventory/add"], button:has-text("Add Item")',
 position: 'bottom',
 navigateTo: '/inventory/add',
 pageLabel: 'Inventory Control',
 },
 {
 title: '👥 Staff Management',
 description: 'The Staff module handles comprehensive workforce administration.\n\n📌 Features:\n• Maintain complete staff directory\n• Manage roles and permissions\n• Track attendance and shifts\n• Monitor performance reviews\n\n💡 Pro Tip: Properly define roles and permissions for security and efficiency.',
 actionTip: '👉 Click on the "Add Staff" button to hire new employees.',
 targetSelector: 'a[href="/staff/add"], button:has-text("Add Staff")',
 position: 'bottom',
 navigateTo: '/staff/add',
 pageLabel: 'Staff Management',
 },
 {
 title: '🏠 Room Allotment',
 description: 'The Room Allotment module optimizes bed management and patient accommodation.\n\n📌 Features:\n• View current room assignments\n• Allocate new rooms to patients\n• Organize rooms by department\n• Track occupancy rates\n\n💡 Pro Tip: Manage room allotments efficiently to maximize bed utilization.',
 actionTip: '👉 Click on the "New Allotment" button to assign a patient to a room.',
 targetSelector: 'a[href="/room-allotment/new"], button:has-text("New Allotment")',
 position: 'bottom',
 navigateTo: '/room-allotment/new',
 pageLabel: 'Room Allotment',
 },
 {
 title: '💰 Billing & Payments',
 description: 'The Billing module handles complete financial management.\n\n📌 Features:\n• Generate and manage patient invoices\n• Process payments and receipts\n• Handle insurance claims\n• Generate financial reports\n\n💡 Pro Tip: Keep accurate billing records for financial tracking and compliance.',
 actionTip: '👉 Click on the "Create Invoice" button to generate patient bills.',
 targetSelector: 'a[href="/billing/create-invoice"], button:has-text("Create Invoice")',
 position: 'bottom',
 navigateTo: '/billing/create-invoice',
 pageLabel: 'Billing & Payments',
 },
 {
 title: '📊 Reports & Analytics',
 description: 'The Reports module provides comprehensive data-driven insights.\n\n📌 Features:\n• View appointment statistics\n• Analyze financial performance\n• Track patient visit trends\n• Monitor inventory usage\n• Analyze staff performance\n\n💡 Pro Tip: Use reports regularly to identify trends and make informed decisions.',
 actionTip: '👉 Explore different report types to gain insights into your operations.',
 targetSelector: 'a[href="/reports"], button:has-text("Reports")',
 position: 'bottom',
 navigateTo: '/reports',
 pageLabel: 'Reports & Analytics',
 },
 {
 title: '✅ Comprehensive Tour Complete!',
 description: '🎉 Congratulations! You\'ve explored all major modules of MedixPro.\n\n📚 Key Modules You\'ve Learned:\n✓ Dashboard for monitoring\n✓ Doctors & Staff Management\n✓ Patient Records System\n✓ Appointment Scheduling\n✓ Prescription Management\n✓ Ambulance Services\n✓ Pharmacy Operations\n✓ Blood Bank Management\n✓ Department Organization\n✓ Inventory Control\n✓ Room Allotment\n✓ Billing & Payments\n✓ Reports & Analytics\n\n🚀 Next Steps:\n→ Start using modules for your operations\n→ Configure settings for your facility\n→ Train your staff on key features\n→ Set up automation where possible\n→ Regular monitoring using reports',
 position: 'bottom',
 },
];

interface DashboardTourProps {
 onComplete?: () => void;
 showStartButton?: boolean;
}

export default function DashboardTour({
 onComplete,
 showStartButton = true,
}: DashboardTourProps) {
 const router = useRouter();
 const pathname = usePathname();
 const [currentStep, setCurrentStep] = useState(0);
 const [showModal, setShowModal] = useState(false);
 const [showWelcome, setShowWelcome] = useState(false);
 const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
 const [overlayElement, setOverlayElement] = useState<HTMLDivElement | null>(null);
 const [isNavigating, setIsNavigating] = useState(false);

 useEffect(() => {
 if (showModal) {
 ensureOverlayExists();
 if (dashboardTourSteps[currentStep].targetSelector) {
 const timer = setTimeout(() => highlightElement(currentStep), 500);
 return () => clearTimeout(timer);
 }
 } else {
 cleanupOverlay();
 }
 }, [showModal, currentStep, pathname]);

 const handleStartTour = () => {
 setCurrentStep(0);
 setShowModal(true);
 navigateToStep(0);
 };

 const handleWelcomeStart = () => {
 setShowWelcome(false);
 setCurrentStep(0);
 setShowModal(true);
 navigateToStep(0);
 };

 const navigateToStep = (stepIndex: number) => {
 const step = dashboardTourSteps[stepIndex];
 if (step.navigateTo && pathname !== step.navigateTo) {
 setIsNavigating(true);
 router.push(step.navigateTo);
 const timer = setTimeout(() => setIsNavigating(false), 1500);
 return () => clearTimeout(timer);
 }
 };

 const highlightElement = (stepIndex: number) => {
 if (highlightedElement) {
 highlightedElement.classList.remove('tour-highlight-pulse');
 }
 if (overlayElement) {
 overlayElement.remove();
 setOverlayElement(null);
 }

 const step = dashboardTourSteps[stepIndex];
 if (step.targetSelector) {
 let element = document.querySelector(step.targetSelector) as HTMLElement;
 
 if (!element && step.navigateTo) {
 const fallbackSelectors = [
 'button:nth-of-type(1)',
 'a[href*="add"]',
 '[data-tour]',
 '.card:first-child'
 ];
 
 for (const selector of fallbackSelectors) {
 element = document.querySelector(selector) as HTMLElement;
 if (element) break;
 }
 }

 if (element) {
 element.classList.add('tour-highlight-pulse');
 element.scrollIntoView({ behavior: 'smooth', block: 'center' });
 setHighlightedElement(element);
 }
 }
 };

 const handleCloseTour = () => {
 setShowModal(false);
 if (highlightedElement) {
 highlightedElement.classList.remove('tour-highlight-pulse');
 setHighlightedElement(null);
 }
 cleanupOverlay();
 document.body.style.cursor = '';
 document.body.style.userSelect = '';
 if (onComplete) {
 onComplete();
 }
 };

 const cleanupOverlay = () => {
 if (overlayElement) {
 try {
 overlayElement.remove();
 } catch (e) {
 console.error('Error removing overlay:', e);
 }
 }
 const allOverlays = document.querySelectorAll('.tour-overlay');
 allOverlays.forEach(overlay => {
 try {
 overlay.remove();
 } catch (e) {
 console.error('Error removing tour overlay:', e);
 }
 });
 setOverlayElement(null);
 };

 const ensureOverlayExists = () => {
 if (overlayElement) return;
 
 const existingOverlay = document.querySelector('.tour-overlay');
 if (existingOverlay) {
 setOverlayElement(existingOverlay as HTMLDivElement);
 return;
 }

 const overlay = document.createElement('div');
 overlay.className = 'tour-overlay';
 overlay.addEventListener('click', (e) => {
 e.stopPropagation();
 e.preventDefault();
 });
 overlay.addEventListener('mousedown', (e) => {
 e.stopPropagation();
 e.preventDefault();
 });
 overlay.addEventListener('touchstart', (e) => {
 e.stopPropagation();
 e.preventDefault();
 });
 document.body.appendChild(overlay);
 setOverlayElement(overlay);
 };

 const handleNextStep = () => {
 if (currentStep < dashboardTourSteps.length - 1) {
 const nextStep = currentStep + 1;
 setCurrentStep(nextStep);
 navigateToStep(nextStep);
 } else {
 handleCloseTour();
 }
 };

 const handlePrevStep = () => {
 if (currentStep > 0) {
 const prevStep = currentStep - 1;
 setCurrentStep(prevStep);
 navigateToStep(prevStep);
 }
 };

 const handleSkipTour = () => {
 handleCloseTour();
 };

 useEffect(() => {
 return () => {
 cleanupOverlay();
 };
 }, []);

 const step = dashboardTourSteps[currentStep];

 return (
 <>
 <style>{`
 @keyframes tourPulse {
 0%, 100% {
 box-shadow: 0 0 0 4px rgba(26, 188, 156, 0.5), 0 0 20px rgba(26, 188, 156, 0.4), inset 0 0 20px rgba(26, 188, 156, 0.1);
 }
 50% {
 box-shadow: 0 0 0 8px rgba(26, 188, 156, 0.3), 0 0 30px rgba(26, 188, 156, 0.6), inset 0 0 20px rgba(26, 188, 156, 0.2);
 }
 }

 .tour-highlight-pulse {
 animation: tourPulse 2s ease-in-out infinite !important;
 border-radius: 8px !important;
 position: relative !important;
 z-index: 1000 !important;
 }

 .tour-overlay {
 position: fixed;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 width: 100%;
 height: 100%;
 background: rgba(0, 0, 0, 0.7);
 z-index: 9998 !important;
 pointer-events: auto !important;
 cursor: default;
 will-change: pointer-events;
 }
 
 .tour-overlay * {
 pointer-events: none !important;
 }
 
 .tour-overlay.hidden {
 display: none !important;
 }
 `}</style>



 {showModal && currentStep === 0 ? (
 <div className="fixed inset-0 bg-black/80 z-[9998] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
 <style>{`
 @keyframes fadeIn {
 from { opacity: 0; transform: scale(0.95); }
 to { opacity: 1; transform: scale(1); }
 }
 
 @keyframes float {
 0%, 100% { transform: translateY(0px); }
 50% { transform: translateY(-10px); }
 }
 
 @keyframes pulse-glow {
 0%, 100% { box-shadow: 0 0 0 0 rgba(26, 188, 156, 0.7); }
 50% { box-shadow: 0 0 0 10px rgba(26, 188, 156, 0); }
 }
 
 .welcome-card {
 animation: fadeIn 0.6s ease-out;
 max-height: calc(100vh - 48px);
 overflow-y: auto;
 }
 
 .welcome-card::-webkit-scrollbar {
 width: 6px;
 }
 
 .welcome-card::-webkit-scrollbar-track {
 background: transparent;
 }
 
 .welcome-card::-webkit-scrollbar-thumb {
 background: rgba(26, 188, 156, 0.3);
 border-radius: 3px;
 }
 
 .welcome-card::-webkit-scrollbar-thumb:hover {
 background: rgba(26, 188, 156, 0.5);
 }
 
 .hospital-icon {
 animation: float 3s ease-in-out infinite;
 }
 
 .pulse-icon {
 animation: pulse-glow 2s ease-in-out infinite;
 }
 
 .gradient-bg {
 background: linear-gradient(135deg, #171B1E 0%, #1E1F27 100%);
 }
 `}</style>

 <div className="welcome-card bg-dark-secondary border border-dark-tertiary rounded-2xl shadow-2xl w-full max-w-md">
 <div className="gradient-bg p-6 relative overflow-hidden">
 <button
 onClick={handleCloseTour}
 className="absolute top-4 right-4 p-2 hover:bg-dark-tertiary rounded-lg transition-colors"
 >
 <X size={20} className="text-gray-400" />
 </button>

 <div className="relative z-10 text-center">
 <div className="flex justify-center mb-6">
 <div className="relative">
 <div className="pulse-icon absolute inset-0 rounded-full"></div>
 <div className="relative bg-gradient-to-br from-accent to-accent-dark p-6 rounded-full w-24 h-24 flex items-center justify-center">
 {/* <svg
 className="hospital-icon w-12 h-12 text-white"
 fill="currentColor"
 viewBox="0 0 24 24"
 >
 <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 9h-2v2h-2v-2h-2v-2h2V8h2v2h2v2z" />
 </svg> */}
 <img src="/hospital-GIF.gif" alt="" className='w-[10%] h-[10%] object-contain' />
 </div>
 </div>
 </div>

 <h1 className="text-2xl font-bold text-white mb-2">
 Welcome to MedixPro
 </h1>
 <p className="text-gray-400 text-md mb-2">
 Advanced Hospital Management System
 </p>
 <p className="text-accent text-sm font-semibold">
 Multispeciality Healthcare Excellence
 </p>
 </div>
 </div>



 <div className="p-6 bg-dark-primary flex flex-col sm:flex-row gap-3 justify-center">
 <button
 onClick={handleCloseTour}
 className="px-8 py-3 rounded-lg bg-dark-tertiary hover:bg-dark-tertiary/80 text-white transition-colors font-medium"
 >
 Skip Tour
 </button>
 <button
 onClick={handleNextStep}
 className="px-8 py-3 rounded-lg bg-accent hover:bg-accent-dark text-white transition-colors text-sm flex items-center justify-center gap-2"
 >
 <span>▶</span>
 Start Guided Tour
 </button>
 </div>

 <div className="h-1 bg-dark-tertiary">
 <div className="h-full bg-gradient-to-r from-accent to-accent-dark" 
 style={{ width: `${(1 / dashboardTourSteps.length) * 100}%` }}></div>
 </div>
 </div>
 </div>
 ) : (
 <SystemTourModal
 isOpen={showModal && currentStep > 0}
 onClose={handleCloseTour}
 title={step.title}
 description={step.description}
 actionTip={step.actionTip}
 currentStep={currentStep}
 totalSteps={dashboardTourSteps.length}
 onNext={handleNextStep}
 onPrev={handlePrevStep}
 onSkip={handleSkipTour}
 targetElement={highlightedElement}
 isNavigating={isNavigating}
 pageLabel={step.pageLabel}
 />
 )}

 <WelcomeTourScreen
 isOpen={showWelcome}
 onClose={() => setShowWelcome(false)}
 onStart={handleWelcomeStart}
 />
 </>
 );
}
