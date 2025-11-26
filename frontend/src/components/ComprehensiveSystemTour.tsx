'use client';

import { useState } from 'react';
import SystemTourModal from './UI/SystemTourModal';
import WelcomeTourScreen from './WelcomeTourScreen';

interface TourStep {
  title: string;
  description: string;
  targetSelector?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  section: 'dashboard' | 'sidebar';
}

const welcomeStep: TourStep = {
  title: '🎉 Welcome to MedixPro System Tour',
  description: 'Welcome to your Hospital Management System! This comprehensive tour will guide you through all the features and modules available in MedixPro.\n\n📚 What You\'ll Learn:\n✓ Dashboard Overview & Analytics\n✓ Doctor & Staff Management\n✓ Patient Records System\n✓ Appointment Scheduling\n✓ Prescription Management\n✓ Ambulance Services\n✓ Pharmacy Operations\n✓ Blood Bank Management\n✓ Department Organization\n✓ Inventory Control\n✓ Room Allotment\n✓ Billing & Payments\n✓ Reports & Analytics\n\n🚀 Let\'s get started exploring your complete healthcare management system!',
  position: 'bottom',
  section: 'dashboard',
};

const dashboardSteps: TourStep[] = [
  {
    title: '📊 Dashboard Overview',
    description: 'Welcome to your Hospital Management Dashboard! This is your central hub where you can see all key metrics and performance indicators at a glance. Here you\'ll monitor your clinic\'s health, track revenue, appointments, patients, and staff all in one place.',
    targetSelector: '[data-tour="dashboard-header"]',
    position: 'bottom',
    section: 'dashboard',
  },
  {
    title: '💰 Total Revenue Card',
    description: 'This card displays your clinic\'s total earnings. The main number shows total revenue generated. Below it shows the percentage change from the last month (+20.1% means your revenue increased by 20.1%). Click this card to view detailed financial reports and transaction history.',
    targetSelector: '[data-tour="metrics-cards"] .card:nth-child(1)',
    position: 'bottom',
    section: 'dashboard',
  },
  {
    title: '📅 Appointments Card',
    description: 'Shows the total number of appointments in your system. The number displayed is your current appointment count. The percentage below (+10.1%) indicates month-over-month growth in appointments. Click to view the appointments calendar and manage bookings.',
    targetSelector: '[data-tour="metrics-cards"] .card:nth-child(2)',
    position: 'bottom',
    section: 'dashboard',
  },
  {
    title: '👥 Patients Card',
    description: 'Displays your total registered patients. This number shows all active patients in your system. The growth percentage (+19%) shows how many new patients you\'ve registered compared to last month. Click to access patient records, medical histories, and manage patient information.',
    targetSelector: '[data-tour="metrics-cards"] .card:nth-child(3)',
    position: 'bottom',
    section: 'dashboard',
  },
  {
    title: '👨‍⚕️ Doctors Card',
    description: 'Shows your active medical staff count. This displays all registered doctors currently in your system. The text "Active doctors" indicates these are available and not on leave. Click to view doctor profiles, schedules, specialties, and manage staff information.',
    targetSelector: '[data-tour="metrics-cards"] .card:nth-child(4)',
    position: 'bottom',
    section: 'dashboard',
  },
  {
    title: '📈 Revenue Trends Chart',
    description: 'This bar chart visualizes your revenue over time (weeks/months). The green bars represent revenue amounts. Each bar shows earnings for different periods. You can see revenue patterns, peaks, and dips. Hover over bars to see exact amounts. Click to export reports or view detailed transaction breakdowns.',
    targetSelector: '[data-tour="charts-section"] .card:nth-child(1)',
    position: 'top',
    section: 'dashboard',
  },
  {
    title: '📊 Patient Growth Chart',
    description: 'This line chart shows patient registration trends over time. The blue line tracks your patient growth pattern. It helps you understand if patient registrations are increasing, decreasing, or steady. Upward trends indicate growing business. Useful for capacity planning and staffing decisions.',
    targetSelector: '[data-tour="charts-section"] .card:nth-child(2)',
    position: 'top',
    section: 'dashboard',
  },
  {
    title: '🗓️ Recent Appointments Table',
    description: 'Shows your latest appointments in a table format with these columns:\n• Patient: Name of the patient\n• Doctor: Assigned doctor name\n• Date: Appointment scheduled date\n• Status: Confirmation status (pending, confirmed, completed)\n\nHover over rows to highlight them. Click patient/doctor names to view profiles. Click status badges to change appointment status.',
    targetSelector: '[data-tour="recent-appointments"]',
    position: 'top',
    section: 'dashboard',
  },
  {
    title: '🏥 Dashboard Complete!',
    description: 'You\'ve completed the dashboard tour! Next, we\'ll explore all 23+ modules in your sidebar to understand the complete Healthcare CRM system. Ready to discover more features?',
    position: 'bottom',
    section: 'dashboard',
  },
];

const sidebarSteps: TourStep[] = [
  {
    title: '🏥 Dashboard Module',
    description: 'The Dashboard is your central command center. It provides an overview of your clinic\'s performance with key metrics, charts, and recent activities. Access different dashboard views:\n\n• Admin Dashboard: Full administrative overview\n• Doctor Dashboard: Doctor-specific metrics and schedule\n• Patient Dashboard: Patient-focused information and history\n\nClick to expand and access these specialized views.',
    targetSelector: '[data-tour="dashboard-nav"]',
    position: 'right',
    section: 'sidebar',
  },
  {
    title: '👨‍⚕️ Doctors Management',
    description: 'Manage your medical staff efficiently. This module handles all doctor-related operations:\n\n• Doctors List: View and search all registered doctors\n• Add Doctor: Register new medical staff members\n• Doctor Schedule: Manage appointments and availability\n\nEssential for maintaining your healthcare team and scheduling.',
    targetSelector: '[data-tour="doctors-nav"]',
    position: 'right',
    section: 'sidebar',
  },
  {
    title: '👥 Patients Management',
    description: 'Central patient information hub. Manage patient records and registration:\n\n• Patients List: Browse and search patient database\n• Add Patient: Register new patients with complete profiles\n\nStore medical history, contact information, and treatment records for comprehensive care.',
    targetSelector: '[data-tour="patients-nav"]',
    position: 'right',
    section: 'sidebar',
  },
  {
    title: '📅 Appointments System',
    description: 'Complete appointment scheduling and management system:\n\n• All Appointments: View comprehensive appointment calendar\n• Add Appointment: Schedule new patient visits\n• Calendar View: Visual appointment timeline\n• Appointment Requests: Handle booking requests\n\nStreamline patient scheduling and reduce no-shows.',
    targetSelector: '[data-tour="appointments-nav"]',
    position: 'right',
    section: 'sidebar',
  },
  {
    title: '💊 Prescriptions Module',
    description: 'Digital prescription management for modern healthcare:\n\n• All Prescriptions: Access prescription history and records\n• Create Prescription: Write new prescriptions digitally\n• Medicine Templates: Use pre-configured medication templates\n\nEnsure accurate medication dispensing and maintain prescription records.',
    targetSelector: '[data-tour="prescriptions-nav"]',
    position: 'right',
    section: 'sidebar',
  },
  {
    title: '🚑 Ambulance Services',
    description: 'Emergency response coordination and ambulance management:\n\n• Ambulance Call List: Track emergency response calls\n• Ambulance List: Manage fleet and availability\n• Ambulance Details: Vehicle maintenance and status\n\nCritical for emergency medical services and patient transport.',
    targetSelector: '[data-tour="ambulance-nav"]',
    position: 'right',
    section: 'sidebar',
  },
  {
    title: '🏥 Pharmacy Integration',
    description: 'Integrated pharmacy management within your clinic:\n\n• Medicine List: Inventory of available medications\n• Add Medicine: Stock new medications and supplies\n\nSeamlessly connect prescriptions to pharmacy dispensing for better patient care.',
    targetSelector: '[data-tour="pharmacy-nav"]',
    position: 'right',
    section: 'sidebar',
  },
  {
    title: '🩸 Blood Bank Management',
    description: 'Complete blood bank operations and inventory:\n\n• Blood Stock: Monitor blood type availability\n• Blood Donor: Manage donor database and schedules\n• Blood Issued: Track blood transfusions and usage\n• Add Blood Unit: Register new blood donations\n• Issue Blood: Process blood requests and distribution\n\nCritical for emergency transfusions and surgical procedures.',
    targetSelector: '[data-tour="blood-bank-nav"]',
    position: 'right',
    section: 'sidebar',
  },
  {
    title: '🏥 Departments Management',
    description: 'Organize your clinic by medical specialties:\n\n• Department List: View all medical departments\n• Add Department: Create new specialty departments\n• Services Offered: Manage department capabilities\n\nStructure your healthcare services by medical expertise areas.',
    targetSelector: '[data-tour="departments-nav"]',
    position: 'right',
    section: 'sidebar',
  },
  {
    title: '📦 Inventory Control',
    description: 'Medical supplies and equipment inventory management:\n\n• Inventory List: Track all medical supplies and equipment\n• Add Item: Register new inventory items\n• Stock Alerts: Automatic low-stock notifications\n• Suppliers List: Manage vendor relationships\n\nEnsure you never run out of critical medical supplies.',
    targetSelector: '[data-tour="inventory-nav"]',
    position: 'right',
    section: 'sidebar',
  },
  {
    title: '👥 Staff Management',
    description: 'Comprehensive staff administration and HR functions:\n\n• All Staff: Complete staff directory and profiles\n• Add Staff: Hire and onboard new employees\n• Roles & Permissions: Control access and responsibilities\n• Attendance: Track staff schedules and presence\n\nManage your entire healthcare workforce efficiently.',
    targetSelector: '[data-tour="staff-nav"]',
    position: 'right',
    section: 'sidebar',
  },
  {
    title: '📋 Medical Records',
    description: 'Vital records management for healthcare compliance:\n\n• Birth Records: Document newborn registrations\n• Death Records: Maintain mortality records\n\nEssential for legal compliance and statistical reporting.',
    targetSelector: '[data-tour="records-nav"]',
    position: 'right',
    section: 'sidebar',
  },
  {
    title: '🏠 Room Allotment',
    description: 'Hospital room and bed management system:\n\n• Alloted Rooms: Current room assignments and occupancy\n• New Allotment: Assign patients to available rooms\n• Rooms by Department: Department-specific room management\n• Add New Room: Register new rooms and facilities\n\nOptimize bed utilization and patient accommodation.',
    targetSelector: '[data-tour="room-allotment-nav"]',
    position: 'right',
    section: 'sidebar',
  },
  {
    title: '💰 Billing & Payments',
    description: 'Complete financial management for healthcare services:\n\n• Invoices: Generate and manage patient bills\n• Create Invoice: Process new billing requests\n• Payments History: Track all financial transactions\n• Insurance Claims: Handle insurance processing\n\nStreamline revenue collection and financial reporting.',
    targetSelector: '[data-tour="billing-nav"]',
    position: 'right',
    section: 'sidebar',
  },
  {
    title: '📊 Reports & Analytics',
    description: 'Comprehensive reporting for data-driven decisions:\n\n• Appointment Reports: Scheduling and utilization analytics\n• Financial Reports: Revenue and expense analysis\n• Patient Visit Reports: Treatment and outcome metrics\n• Inventory Reports: Supply chain and usage statistics\n• Staff Performance: Productivity and efficiency metrics\n• Custom Reports: Flexible reporting tools\n\nTransform your data into actionable insights.',
    targetSelector: '[data-tour="reports-nav"]',
    position: 'right',
    section: 'sidebar',
  },
  {
    title: '⭐ Reviews & Feedback',
    description: 'Patient and staff feedback management:\n\n• Doctor Reviews: Patient feedback on medical care\n• Patient Reviews: Overall clinic experience ratings\n\nMonitor service quality and identify improvement areas.',
    targetSelector: '[data-tour="reviews-nav"]',
    position: 'right',
    section: 'sidebar',
  },
  {
    title: '💬 Patient Feedback',
    description: 'Direct patient communication and satisfaction tracking. Collect detailed feedback about their healthcare experience, service quality, and suggestions for improvement. Use this valuable input to enhance patient care and clinic operations.',
    targetSelector: '[data-tour="feedback-nav"]',
    position: 'right',
    section: 'sidebar',
  },
  {
    title: '⚙️ System Settings',
    description: 'Configure your clinic management system. Customize user preferences, system behavior, notification settings, and administrative controls. Maintain system security and user access management.',
    targetSelector: '[data-tour="settings-nav"]',
    position: 'right',
    section: 'sidebar',
  },
  {
    title: '🔐 Authentication',
    description: 'User authentication and access control center. Manage user accounts, passwords, security settings, and role-based permissions. Ensure secure access to sensitive patient and clinic data.',
    targetSelector: '[data-tour="authentication-nav"]',
    position: 'right',
    section: 'sidebar',
  },
  {
    title: '📆 Calendar Integration',
    description: 'Integrated calendar system for scheduling and planning. View appointments, events, and important dates in a visual calendar format. Sync with external calendars and manage recurring events.',
    targetSelector: '[data-tour="calendar-nav"]',
    position: 'right',
    section: 'sidebar',
  },
  {
    title: '✅ Task Management',
    description: 'Organize and track tasks for your healthcare team. Create, assign, and monitor tasks related to patient care, administrative duties, and clinic operations. Improve team productivity and ensure nothing falls through the cracks.',
    targetSelector: '[data-tour="tasks-nav"]',
    position: 'right',
    section: 'sidebar',
  },
  {
    title: '📞 Contacts Directory',
    description: 'Centralized contacts management for your clinic. Store and organize contact information for patients, staff, emergency contacts, and external healthcare providers. Quick access to important phone numbers and addresses.',
    targetSelector: '[data-tour="contacts-nav"]',
    position: 'right',
    section: 'sidebar',
  },
  {
    title: '📧 Email Communication',
    description: 'Integrated email system for professional communication. Send appointment reminders, test results, billing information, and other important notifications. Maintain electronic communication records for compliance.',
    targetSelector: '[data-tour="email-nav"]',
    position: 'right',
    section: 'sidebar',
  },
  {
    title: '🎯 Complete System Tour!',
    description: 'Congratulations! You\'ve completed the comprehensive Healthcare CRM tour:\n\n📊 Dashboard: Metrics, charts, and performance overview\n👥 All 23+ Modules: Complete system navigation\n\nYou now have a full understanding of your clinic management system. Explore each module to master its features. Start managing your clinic efficiently!',
    position: 'bottom',
    section: 'sidebar',
  },
];

const allSteps = [welcomeStep, ...dashboardSteps, ...sidebarSteps];

interface ComprehensiveSystemTourProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export default function ComprehensiveSystemTour({
  onComplete,
  autoStart = false,
}: ComprehensiveSystemTourProps) {
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
    if (highlightedElement) {
      highlightedElement.style.boxShadow = '';
      highlightedElement.style.borderRadius = '';
    }

    const step = allSteps[stepIndex];
    if (step.targetSelector) {
      const element = document.querySelector(step.targetSelector) as HTMLElement;
      if (element) {
        element.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.4)';
        element.style.borderRadius = '8px';
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedElement(element);

        const rect = element.getBoundingClientRect();
        const modalWidth = 400;
        const modalHeight = 300;
        const margin = 10;

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
            modalX = window.innerWidth / 2 - modalWidth / 2;
            modalY = window.innerHeight / 2 - modalHeight / 2;
        }

        modalX = Math.max(0, Math.min(modalX, window.innerWidth - modalWidth));
        modalY = Math.max(0, Math.min(modalY, window.innerHeight - modalHeight));

        setModalPosition({ x: modalX, y: modalY });
      }
    } else {
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
    if (currentStep < allSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setTimeout(() => highlightElement(nextStep), 100);
    } else {
      handleCloseTour();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setTimeout(() => highlightElement(prevStep), 100);
    }
  };

  const handleSkipTour = () => {
    handleCloseTour();
  };

  const step = allSteps[currentStep];

  const handleWelcomeStart = () => {
    setShowModal(true);
    setCurrentStep(1);
    setTimeout(() => highlightElement(1), 100);
  };

  return (
    <>
      <button
        onClick={handleStartTour}
        className="flex items-center gap-2 px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
        data-testid="comprehensive-tour-start-button"
        title="Start complete interactive system tour"
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
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        System Tour
      </button>

      {showModal && currentStep === 0 ? (
        <WelcomeTourScreen
          isOpen={showModal}
          onClose={handleCloseTour}
          onStart={handleWelcomeStart}
        />
      ) : (
        <SystemTourModal
          isOpen={showModal && currentStep > 0}
          onClose={handleCloseTour}
          title={step.title}
          description={step.description}
          currentStep={currentStep}
          totalSteps={allSteps.length}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
          onSkip={handleSkipTour}
          position={modalPosition}
        />
      )}
    </>
  );
}
