"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";

interface TourProps {
  onComplete?: () => void;
}

export default function Tour({ onComplete }: TourProps) {
  const pathname = usePathname();

  useEffect(() => {
    const tour = new Shepherd.Tour({
      defaultStepOptions: {
        cancelIcon: {
          enabled: true,
        },
        classes: "shepherd-theme-dark",
        scrollTo: { behavior: "smooth", block: "center" },
      },
      useModalOverlay: true,
    });

    // Clear existing steps
    tour.steps = [];

    // Add steps based on current page
    if (pathname === '/dashboard') {
      addDashboardSteps(tour);
    } else if (pathname === '/doctors') {
      addDoctorsPageSteps(tour);
    } else if (pathname === '/patients') {
      addPatientsPageSteps(tour);
    } else if (pathname === '/appointments') {
      addAppointmentsPageSteps(tour);
    } else if (pathname.startsWith('/blood-bank')) {
      addBloodBankPageSteps(tour, pathname);
    } else if (pathname.startsWith('/billing')) {
      addBillingPageSteps(tour, pathname);
    } else if (pathname.startsWith('/inventory')) {
      addInventoryPageSteps(tour, pathname);
    } else if (pathname.startsWith('/staff')) {
      addStaffPageSteps(tour, pathname);
    } else if (pathname.startsWith('/pharmacy')) {
      addPharmacyPageSteps(tour, pathname);
    } else if (pathname === '/departments') {
      addDepartmentsPageSteps(tour);
    } else if (pathname.startsWith('/records')) {
      addRecordsPageSteps(tour, pathname);
    } else if (pathname.startsWith('/reports')) {
      addReportsPageSteps(tour, pathname);
    } else if (pathname.startsWith('/reviews')) {
      addReviewsPageSteps(tour, pathname);
    } else if (pathname.startsWith('/room-allotment')) {
      addRoomAllotmentPageSteps(tour, pathname);
    } else if (pathname.startsWith('/prescriptions')) {
      addPrescriptionsPageSteps(tour, pathname);
    } else {
      // Default to dashboard steps if on unknown page
      addDashboardSteps(tour);
    }

    // Start the tour
    tour.start();

    // Cleanup on unmount
    return () => {
      if (tour.isActive()) {
        tour.cancel();
      }
    };
  }, [pathname, onComplete]);

  const addDashboardSteps = (tour: Shepherd.Tour) => {

    // Welcome step
    tour.addStep({
      id: "welcome",
      title: "Welcome to MedixPro!",
      text: "Welcome to your comprehensive healthcare management system. This interactive tour will demonstrate EVERY click event and user interaction. Let's explore what happens when you click on different elements!",
      buttons: [
        {
          text: "Skip Tour",
          action: tour.cancel,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Start Interactive Tour",
          action: tour.next,
        },
      ],
    });

    // Dashboard overview
    tour.addStep({
      id: "dashboard-overview",
      title: "Dashboard Overview",
      text: 'This is your main dashboard where you can see key metrics and recent activities at a glance. Notice the "Interactive Click Events Tour" button - that\'s what you clicked to start this tour!',
      attachTo: {
        element: '[data-tour="dashboard-header"]',
        on: "bottom",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Key metrics - Revenue Card
    tour.addStep({
      id: "revenue-metric",
      title: "Revenue Metric - Click Interaction",
      text: "Clicking this Revenue card opens detailed financial reports. It shows your clinic's total earnings with trend indicators (+20.1% from last month).",
      attachTo: {
        element: '[data-tour="metrics-cards"] .card:first-child',
        on: "bottom",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Appointments Metric
    tour.addStep({
      id: "appointments-metric",
      title: "Appointments Metric - Click to Navigate",
      text: "Clicking this Appointments card takes you directly to the appointments calendar view. It shows total appointments with growth percentage.",
      attachTo: {
        element: '[data-tour="metrics-cards"] .card:nth-child(2)',
        on: "bottom",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Patients Metric
    tour.addStep({
      id: "patients-metric",
      title: "Patients Metric - Click for Patient List",
      text: "Clicking this Patients card opens the patient management interface. It displays total registered patients with growth trends.",
      attachTo: {
        element: '[data-tour="metrics-cards"] .card:nth-child(3)',
        on: "bottom",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Doctors Metric
    tour.addStep({
      id: "doctors-metric",
      title: "Doctors Metric - Click for Staff Directory",
      text: "Clicking this Doctors card shows the complete doctor directory and their active status. It displays current active medical staff count.",
      attachTo: {
        element: '[data-tour="metrics-cards"] .card:nth-child(4)',
        on: "bottom",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Charts section - Revenue Trends
    tour.addStep({
      id: "revenue-chart",
      title: "Revenue Trends Chart - Interactive Data Points",
      text: "Clicking on any bar in this chart opens detailed transaction breakdown for that period. Hover to see exact values and trends.",
      attachTo: {
        element: '[data-tour="charts-section"] .card:first-child',
        on: "top",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Patient Growth Chart
    tour.addStep({
      id: "patient-growth-chart",
      title: "Patient Growth Chart - Click for Timeline Details",
      text: "Clicking data points on this line chart shows patient registration details for that time period. Track growth patterns and trends.",
      attachTo: {
        element: '[data-tour="charts-section"] .card:nth-child(2)',
        on: "top",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Recent Appointments Table
    tour.addStep({
      id: "recent-appointments",
      title: "Recent Appointments Table - Multiple Click Actions",
      text: "This table shows recent appointments. Click patient names to open profiles, doctor names for schedules, dates for calendar view, or status badges for appointment details.",
      attachTo: {
        element: '[data-tour="charts-section"] + .card',
        on: "top",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Sidebar navigation
    tour.addStep({
      id: "sidebar-navigation",
      title: "Navigation Sidebar - Click to Expand/Collapse",
      text: 'Clicking main navigation items (like "Doctors", "Patients") expands sub-menus. Click sub-items to navigate to specific pages. The sidebar collapses on mobile.',
      attachTo: {
        element: '[data-tour="sidebar"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Doctors module - Expandable menu
    tour.addStep({
      id: "doctors-module",
      title: "Doctors Management - Complete Medical Staff System",
      text: `The Doctors module provides comprehensive medical staff management with these sub-pages:

• **Doctors List**: View, search, and manage all medical staff
• **Add Doctor**: Register new doctors with complete profile information
• **Doctor Schedule**: Manage availability and appointment slots
• **Specializations**: Track medical specialties and qualifications

Click "Explore Doctors" to navigate to the doctors list and see all available functions.`,
      attachTo: {
        element: '[data-tour="doctors-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Explore Doctors",
          action: () => {
            window.location.href = '/doctors';
          },
          classes: "shepherd-button-primary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Patients module - Direct navigation
    tour.addStep({
      id: "patients-module",
      title: "Patients Management - Complete Patient Care System",
      text: `The Patients module offers comprehensive patient management with these sub-pages:

• **Patients List**: Complete patient directory with advanced search and filtering
• **Add Patient**: Full patient registration with medical history and insurance details
• **Patient Records**: Individual patient profiles with complete medical history
• **Medical History**: Track treatments, medications, and health records

Click "Explore Patients" to navigate to the patients list and access all patient management features.`,
      attachTo: {
        element: '[data-tour="patients-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Explore Patients",
          action: () => {
            window.location.href = '/patients';
          },
          classes: "shepherd-button-primary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Appointments module - Calendar integration
    tour.addStep({
      id: "appointments-module",
      title: "Appointments Management - Complete Scheduling System",
      text: `The Appointments module provides comprehensive scheduling with these sub-pages:

• **All Appointments**: Complete appointment list with status tracking and management
• **Calendar View**: Visual calendar interface for scheduling and time management
• **Add Appointment**: Create new appointments with patient and doctor selection
• **Appointment Requests**: Manage pending appointment requests and confirmations

Click "Explore Appointments" to navigate to the appointments list and access all scheduling features.`,
      attachTo: {
        element: '[data-tour="appointments-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Explore Appointments",
          action: () => {
            window.location.href = '/appointments';
          },
          classes: "shepherd-button-primary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Ambulance module
    tour.addStep({
      id: "ambulance-module",
      title: "Ambulance Management - Emergency Medical Transportation",
      text: `The Ambulance module provides comprehensive emergency transportation management with these sub-pages:

• **Ambulance Call List**: View and manage all emergency ambulance calls with status tracking
• **Ambulance List**: Manage your fleet of ambulances and their availability
• **Ambulance Details**: Track ambulance maintenance, driver information, and equipment status

Click to navigate to ambulance management and access emergency response features.`,
      attachTo: {
        element: '[data-tour="ambulance-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Pharmacy module
    tour.addStep({
      id: "pharmacy-module",
      title: "Pharmacy Management - Complete Medicine Inventory System",
      text: `The Pharmacy module offers comprehensive pharmaceutical management with these sub-pages:

• **Medicine List**: Complete medicine inventory with stock levels and details
• **Add Medicine**: Register new medicines with dosage, price, and expiry information
• **Prescriptions**: Manage medicine prescriptions and dispensing to patients
• **Medicine Templates**: Create and manage prescription templates for common treatments

Click to navigate to pharmacy management and handle all pharmaceutical operations.`,
      attachTo: {
        element: '[data-tour="pharmacy-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Blood Bank module
    tour.addStep({
      id: "blood-bank-module",
      title: "Blood Bank Management - Complete Blood Supply System",
      text: `The Blood Bank module provides comprehensive blood inventory management with these sub-pages:

• **Blood Stock**: Track blood inventory by type and expiry status
• **Blood Donors**: Manage donor database and donation history
• **Blood Issued**: Monitor blood requests and issuance to patients
• **Blood Records**: Maintain complete blood transfusion records and history

Click to navigate to blood bank management and handle all blood-related operations.`,
      attachTo: {
        element: '[data-tour="blood-bank-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Departments module
    tour.addStep({
      id: "departments-module",
      title: "Department Management - Organize Clinic Operations",
      text: `The Departments module enables comprehensive departmental organization with these sub-pages:

• **All Departments**: View and manage all departments in your healthcare facility
• **Add Department**: Create new departments with specialization information
• **Department Services**: Manage services offered by each department
• **Department Coordination**: Oversee inter-departmental operations and resources

Click to navigate to departments management and coordinate your organizational structure.`,
      attachTo: {
        element: '[data-tour="departments-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Inventory module
    tour.addStep({
      id: "inventory-module",
      title: "Inventory Management - Complete Supply Chain System",
      text: `The Inventory module provides comprehensive supply chain management with these sub-pages:

• **Inventory List**: Track all medical supplies and equipment with stock levels
• **Add Inventory**: Register new items with details and pricing information
• **Suppliers**: Manage supplier information and procurement contacts
• **Inventory Alerts**: Monitor low stock alerts and reorder requirements

Click to navigate to inventory management and handle all supply operations.`,
      attachTo: {
        element: '[data-tour="inventory-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Staff module
    tour.addStep({
      id: "staff-module",
      title: "Staff Management - Complete Workforce Management",
      text: `The Staff module enables comprehensive employee management with these sub-pages:

• **Staff List**: View all hospital staff with roles and contact information
• **Add Staff**: Register new staff members with complete profile details
• **Staff Attendance**: Track daily attendance and work schedules
• **Staff Roles**: Manage roles, permissions, and staff classifications

Click to navigate to staff management and coordinate your workforce.`,
      attachTo: {
        element: '[data-tour="staff-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Records module
    tour.addStep({
      id: "records-module",
      title: "Vital Records - Complete Documentation System",
      text: `The Records module provides comprehensive documentation management with these sub-pages:

• **Birth Records**: Maintain birth certificates and newborn records
• **Death Records**: Track and manage death certificates and documentation
• **Medical Records**: Store complete medical history and patient documents
• **Certificate Management**: Issue and manage official certificates

Click to navigate to records management and handle vital documentation.`,
      attachTo: {
        element: '[data-tour="records-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Room Allotment module
    tour.addStep({
      id: "room-allotment-module",
      title: "Room Allotment - Complete Room Management System",
      text: `The Room Allotment module enables comprehensive room management with these sub-pages:

• **All Rooms**: View available rooms and their current status
• **Add Room**: Register new rooms with specifications and capacity
• **Allotted Rooms**: Manage patient assignments and occupancy
• **By Department**: Organize rooms by department and specialization

Click to navigate to room management and coordinate patient accommodations.`,
      attachTo: {
        element: '[data-tour="room-allotment-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Billing module
    tour.addStep({
      id: "billing-module",
      title: "Billing & Invoicing - Complete Financial Management",
      text: `The Billing module provides comprehensive financial transaction management with these sub-pages:

• **All Invoices**: View and manage patient invoices and billing history
• **Create Invoice**: Generate invoices for medical services and treatments
• **Insurance Claims**: Track and manage insurance claim submissions
• **Payment Tracking**: Monitor payment status and collections

Click to navigate to billing management and handle all financial transactions.`,
      attachTo: {
        element: '[data-tour="billing-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Reports module
    tour.addStep({
      id: "reports-module",
      title: "Reports & Analytics - Complete Business Intelligence",
      text: `The Reports module provides comprehensive analytics and reporting with these sub-pages:

• **Financial Reports**: View revenue, expenses, and financial summaries
• **Appointment Reports**: Analyze appointment trends and statistics
• **Patient Reports**: Generate patient demographics and health statistics
• **Staff Performance**: Track staff productivity and performance metrics

Click to navigate to reports and access comprehensive business intelligence.`,
      attachTo: {
        element: '[data-tour="reports-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Reviews module
    tour.addStep({
      id: "reviews-module",
      title: "Patient Reviews - Feedback Management System",
      text: `The Reviews module enables comprehensive feedback management with these sub-pages:

• **All Reviews**: View all patient and doctor reviews and ratings
• **Doctor Reviews**: Track doctor ratings and performance feedback
• **Service Reviews**: Monitor feedback on hospital services and facilities
• **Review Analytics**: Analyze feedback trends to improve service quality

Click to navigate to reviews management and monitor patient satisfaction.`,
      attachTo: {
        element: '[data-tour="reviews-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Feedback module
    tour.addStep({
      id: "feedback-module",
      title: "Feedback System - Customer Experience Management",
      text: `The Feedback module provides comprehensive feedback collection with these sub-pages:

• **All Feedback**: View and manage all patient feedback submissions
• **Collect Feedback**: Gather patient suggestions and improvement ideas
• **Complaint Management**: Handle and track patient complaints and issues
• **Feedback Analysis**: Analyze feedback to identify improvement opportunities

Click to navigate to feedback management and improve service delivery.`,
      attachTo: {
        element: '[data-tour="feedback-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Common Workflow: New Patient Registration
    tour.addStep({
      id: "workflow-patient-registration",
      title: "Common Workflow: Registering a New Patient",
      text: 'Typical patient registration: 1) Click "Patients" → "Add Patient" 2) Fill form fields 3) Click "Submit" to save 4) System shows success message and redirects to patient list.',
      attachTo: {
        element: '[data-tour="patients-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Common Workflow: Scheduling Appointment
    tour.addStep({
      id: "workflow-appointment-booking",
      title: "Common Workflow: Booking an Appointment",
      text: 'Appointment booking flow: 1) Click "Appointments" → "Add Appointment" 2) Select patient from dropdown 3) Choose doctor and time 4) Click "Book Appointment" 5) Confirmation appears.',
      attachTo: {
        element: '[data-tour="appointments-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Common Workflow: Emergency Response
    tour.addStep({
      id: "workflow-emergency-response",
      title: "Common Workflow: Emergency Ambulance Call",
      text: 'Emergency response: 1) Click "Ambulance" → "Ambulance Call List" 2) Click "New Emergency Call" 3) Enter patient details and location 4) Click "Dispatch Ambulance" 5) Track in real-time.',
      attachTo: {
        element: '[data-tour="ambulance-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Common Workflow: Blood Bank Request
    tour.addStep({
      id: "workflow-blood-request",
      title: "Common Workflow: Blood Bank Request",
      text: 'Blood request process: 1) Click "Blood Bank" → "Blood Issued" 2) Click "New Blood Request" 3) Select blood type and units needed 4) Click "Submit Request" 5) Check availability.',
      attachTo: {
        element: '[data-tour="blood-bank-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Common Workflow: Billing & Payment
    tour.addStep({
      id: "workflow-billing-payment",
      title: "Common Workflow: Processing Payments",
      text: 'Payment processing: 1) Click "Billing" → "Create Invoice" 2) Select patient and services 3) Click "Generate Invoice" 4) Click "Mark as Paid" when payment received 5) Print receipt.',
      attachTo: {
        element: '[data-tour="billing-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Authentication module
    tour.addStep({
      id: "authentication-module",
      title: "User Authentication",
      text: "Manage user accounts, roles, permissions, and access control for different staff levels in your clinic.",
      attachTo: {
        element: '[data-tour="authentication-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Settings module
    tour.addStep({
      id: "settings-module",
      title: "System Settings",
      text: "Configure system preferences, manage user permissions, and customize your clinic's operational settings.",
      attachTo: {
        element: '[data-tour="settings-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Calendar module
    tour.addStep({
      id: "calendar-module",
      title: "Calendar & Scheduling",
      text: "View integrated calendar with appointments, events, and schedule management across all departments.",
      attachTo: {
        element: '[data-tour="calendar-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Tasks module
    tour.addStep({
      id: "tasks-module",
      title: "Task Management",
      text: "Create, assign, and track tasks for staff members, monitor progress, and manage workflow efficiency.",
      attachTo: {
        element: '[data-tour="tasks-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Contacts module
    tour.addStep({
      id: "contacts-module",
      title: "Contact Management",
      text: "Maintain a comprehensive directory of patients, staff, suppliers, and other important contacts.",
      attachTo: {
        element: '[data-tour="contacts-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Email module
    tour.addStep({
      id: "email-module",
      title: "Email Communication",
      text: "Send automated emails, manage templates, and handle communication with patients and staff.",
      attachTo: {
        element: '[data-tour="email-nav"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Common UI Interactions: Search & Filter
    tour.addStep({
      id: "ui-search-filter",
      title: "Search & Filter Interactions",
      text: 'Most list pages have search bars (type to filter instantly) and filter dropdowns. Click "Apply Filters" to narrow results, "Clear Filters" to reset. Sort columns by clicking headers.',
      attachTo: {
        element: '[data-tour="sidebar"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Common UI Interactions: Forms & Buttons
    tour.addStep({
      id: "ui-forms-buttons",
      title: "Form Interactions & Action Buttons",
      text: 'Forms have "Submit/Save" buttons to save data, "Cancel" to close without saving. Edit buttons (✏️) open edit mode, Delete buttons (🗑️) show confirmation dialogs, View buttons (👁️) open detail modals.',
      attachTo: {
        element: '[data-tour="sidebar"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Common UI Interactions: Logout Process
    tour.addStep({
      id: "ui-logout-process",
      title: "Logout Process - Secure Session End",
      text: 'Clicking "Logout" at bottom of sidebar opens confirmation modal. Click "Confirm Logout" to end session and return to login, or "Cancel" to stay logged in.',
      attachTo: {
        element: '[data-tour="sidebar"]',
        on: "right",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Getting started
    tour.addStep({
      id: "getting-started",
      title: "Interactive Tour Complete - Master of MedixPro!",
      text: 'Congratulations! You now know EVERY click event and interaction in MedixPro. From dashboard metrics to emergency responses, you\'re ready to use the system like a pro. Click "Finish Tour" to start exploring!',
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Finish Interactive Tour",
          action: () => {
            tour.complete();
            onComplete?.();
          },
        },
      ],
    });
  };

  // Page-specific tour functions
  const addDoctorsPageSteps = (tour: Shepherd.Tour) => {
    // Doctors page welcome with sub-page information
    tour.addStep({
      id: "doctors-page-welcome",
      title: "Doctors Management - Complete Module Overview",
      text: `Welcome to the Doctors Management module! This comprehensive system includes several key sections:

• **Doctors List** (current page): View, search, and manage all medical staff
• **Add Doctor**: Register new doctors with complete profile information  
• **Doctor Schedule**: Manage availability and appointment slots
• **Specializations**: Track medical specialties and qualifications

Use the sidebar submenu to navigate between these sections. Let's explore the current doctors list functionality.`,
      buttons: [
        {
          text: "Back to Dashboard",
          action: () => {
            window.location.href = '/dashboard';
          },
          classes: "shepherd-button-secondary",
        },
        {
          text: "Start Doctors Tour",
          action: tour.next,
        },
      ],
    });

    // Search and filter functionality
    tour.addStep({
      id: "doctors-search-filter",
      title: "Search & Filter Doctors",
      text: "Use the search bar to find doctors by name, email, or specialization. Filter by department, experience level, or status. Click column headers to sort the list.",
      attachTo: {
        element: '.search-input, input[type="text"]',
        on: "bottom",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Add doctor navigation
    tour.addStep({
      id: "doctors-add-navigation",
      title: "Add New Doctor - Registration Process",
      text: 'Click "Add Doctor" to start the comprehensive registration process. This includes personal details, professional qualifications, medical license information, and account setup. The form has multiple tabs for organized data entry.',
      attachTo: {
        element: 'a[href="/doctors/add"], button:has(.lucide-plus)',
        on: "bottom",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Try Adding Doctor",
          action: () => {
            window.location.href = '/doctors/add';
          },
          classes: "shepherd-button-primary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Doctor actions
    tour.addStep({
      id: "doctors-actions",
      title: "Doctor Management Actions",
      text: "Each doctor row includes action buttons: View profile details, Edit information, Manage schedule, or Remove from system. Click any doctor's name to see their complete profile and patient history.",
      attachTo: {
        element: 'table tbody tr:first-child',
        on: "top",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Back to Dashboard",
          action: () => {
            window.location.href = '/dashboard';
          },
        },
      ],
    });
  };

  const addPatientsPageSteps = (tour: Shepherd.Tour) => {
    // Patients page with sub-page information
    tour.addStep({
      id: "patients-page-welcome",
      title: "Patients Management - Complete Patient Care System",
      text: `Welcome to the comprehensive Patients Management system! This module includes:

• **Patients List** (current page): Complete patient directory with search and filtering
• **Add Patient**: Full patient registration with medical history and insurance details
• **Patient Records**: Individual patient profiles with complete medical history
• **Medical History**: Track treatments, medications, and health records

The sidebar submenu provides access to all patient-related functions. Let's explore the patient management features.`,
      buttons: [
        {
          text: "Back to Dashboard",
          action: () => {
            window.location.href = '/dashboard';
          },
          classes: "shepherd-button-secondary",
        },
        {
          text: "Start Patients Tour",
          action: tour.next,
        },
      ],
    });

    // Patient search and registration
    tour.addStep({
      id: "patients-registration",
      title: "Patient Registration & Search",
      text: 'Click "Add Patient" to register new patients with comprehensive information including personal details, medical history, insurance, and emergency contacts. Use the search bar to quickly find existing patients.',
      attachTo: {
        element: 'a[href="/patients/add"], button:has(.lucide-plus)',
        on: "bottom",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Try Adding Patient",
          action: () => {
            window.location.href = '/patients/add';
          },
          classes: "shepherd-button-primary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Patient records
    tour.addStep({
      id: "patients-records",
      title: "Patient Records Management",
      text: "Click on any patient's name to view their complete medical profile, appointment history, prescriptions, and treatment records. Edit patient information or manage their care plan.",
      attachTo: {
        element: 'table tbody tr:first-child',
        on: "top",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Back to Dashboard",
          action: () => {
            window.location.href = '/dashboard';
          },
        },
      ],
    });
  };

  const addAppointmentsPageSteps = (tour: Shepherd.Tour) => {
    // Appointments page with sub-page information
    tour.addStep({
      id: "appointments-page-welcome",
      title: "Appointments Management - Complete Scheduling System",
      text: `Welcome to the comprehensive Appointments Management system! This module includes:

• **All Appointments** (current page): Complete appointment list with status tracking
• **Calendar View**: Visual calendar interface for scheduling and time management
• **Add Appointment**: Create new appointments with patient and doctor selection
• **Appointment Requests**: Manage pending appointment requests and confirmations

Navigate using the sidebar submenu to access different appointment management functions.`,
      buttons: [
        {
          text: "Back to Dashboard",
          action: () => {
            window.location.href = '/dashboard';
          },
          classes: "shepherd-button-secondary",
        },
        {
          text: "Start Appointments Tour",
          action: tour.next,
        },
      ],
    });

    // Calendar navigation
    tour.addStep({
      id: "appointments-calendar-nav",
      title: "Calendar View - Visual Scheduling",
      text: 'Click "Calendar View" to see appointments in a visual calendar format. Navigate between day, week, and month views. Click on any time slot to schedule new appointments or view existing ones.',
      attachTo: {
        element: 'a[href="/appointments/calendar"], .calendar-link',
        on: "bottom",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "View Calendar",
          action: () => {
            window.location.href = '/appointments/calendar';
          },
          classes: "shepherd-button-primary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Add appointment
    tour.addStep({
      id: "appointments-add-nav",
      title: "Schedule New Appointments",
      text: 'Click "Add Appointment" to create new bookings. Select patients from the registry, choose available doctors, pick date and time, and add appointment details. The system prevents double-booking automatically.',
      attachTo: {
        element: 'a[href="/appointments/add"], button:has(.lucide-plus)',
        on: "bottom",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Schedule Appointment",
          action: () => {
            window.location.href = '/appointments/add';
          },
          classes: "shepherd-button-primary",
        },
        {
          text: "Next",
          action: tour.next,
        },
      ],
    });

    // Appointment management
    tour.addStep({
      id: "appointments-management",
      title: "Appointment Status Management",
      text: "View all appointments with status indicators. Click to edit appointment details, mark as completed, cancel appointments, or reschedule. Filter by date, doctor, or status.",
      attachTo: {
        element: 'table tbody tr:first-child',
        on: "top",
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          classes: "shepherd-button-secondary",
        },
        {
          text: "Back to Dashboard",
          action: () => {
            window.location.href = '/dashboard';
          },
        },
      ],
    });
  };

  // Placeholder functions for other modules - can be expanded later
  const addBloodBankPageSteps = (tour: Shepherd.Tour, pathname: string) => {
    tour.addStep({
      id: "blood-bank-welcome",
      title: "Blood Bank Management",
      text: `Blood Bank module includes: Stock inventory, Donor registry, Blood requests, Issued blood tracking, and Donor registration. Navigate using the sidebar submenu.`,
      buttons: [
        {
          text: "Back to Dashboard",
          action: () => {
            window.location.href = '/dashboard';
          },
        },
      ],
    });
  };

  const addBillingPageSteps = (tour: Shepherd.Tour, pathname: string) => {
    tour.addStep({
      id: "billing-welcome",
      title: "Billing & Financial Management",
      text: `Billing module includes: Invoice creation, Payment processing, Insurance claims, Financial reports, and Payment history. Use sidebar submenu for navigation.`,
      buttons: [
        {
          text: "Back to Dashboard",
          action: () => {
            window.location.href = '/dashboard';
          },
        },
      ],
    });
  };

  const addInventoryPageSteps = (tour: Shepherd.Tour, pathname: string) => {
    tour.addStep({
      id: "inventory-welcome",
      title: "Medical Inventory Management",
      text: `Inventory module includes: Stock management, Low stock alerts, Supplier directory, Procurement tracking, and Inventory reports.`,
      buttons: [
        {
          text: "Back to Dashboard",
          action: () => {
            window.location.href = '/dashboard';
          },
        },
      ],
    });
  };

  const addStaffPageSteps = (tour: Shepherd.Tour, pathname: string) => {
    tour.addStep({
      id: "staff-welcome",
      title: "Staff Management System",
      text: `Staff module includes: Staff directory, Attendance tracking, Role management, Performance monitoring, and Staff scheduling.`,
      buttons: [
        {
          text: "Back to Dashboard",
          action: () => {
            window.location.href = '/dashboard';
          },
        },
      ],
    });
  };

  const addPharmacyPageSteps = (tour: Shepherd.Tour, pathname: string) => {
    tour.addStep({
      id: "pharmacy-welcome",
      title: "Pharmacy Management",
      text: `Pharmacy module includes: Medicine inventory, Prescription management, Drug dispensing, Stock alerts, and Pharmacy reports.`,
      buttons: [
        {
          text: "Back to Dashboard",
          action: () => {
            window.location.href = '/dashboard';
          },
        },
      ],
    });
  };

  const addDepartmentsPageSteps = (tour: Shepherd.Tour) => {
    tour.addStep({
      id: "departments-welcome",
      title: "Department Management",
      text: `Departments module includes: Department directory, Service management, Staff assignments, and Department performance tracking.`,
      buttons: [
        {
          text: "Back to Dashboard",
          action: () => {
            window.location.href = '/dashboard';
          },
        },
      ],
    });
  };

  const addRecordsPageSteps = (tour: Shepherd.Tour, pathname: string) => {
    tour.addStep({
      id: "records-welcome",
      title: "Vital Records Management",
      text: `Records module includes: Birth certificates, Death records, Medical certificates, and Official documentation management.`,
      buttons: [
        {
          text: "Back to Dashboard",
          action: () => {
            window.location.href = '/dashboard';
          },
        },
      ],
    });
  };

  const addReportsPageSteps = (tour: Shepherd.Tour, pathname: string) => {
    tour.addStep({
      id: "reports-welcome",
      title: "Reports & Analytics Dashboard",
      text: `Reports module includes: Appointment analytics, Financial reports, Patient statistics, Inventory reports, and Staff performance metrics.`,
      buttons: [
        {
          text: "Back to Dashboard",
          action: () => {
            window.location.href = '/dashboard';
          },
        },
      ],
    });
  };

  const addReviewsPageSteps = (tour: Shepherd.Tour, pathname: string) => {
    tour.addStep({
      id: "reviews-welcome",
      title: "Patient Reviews & Feedback",
      text: `Reviews module includes: Doctor ratings, Patient feedback, Service reviews, and Satisfaction analytics.`,
      buttons: [
        {
          text: "Back to Dashboard",
          action: () => {
            window.location.href = '/dashboard';
          },
        },
      ],
    });
  };

  const addRoomAllotmentPageSteps = (tour: Shepherd.Tour, pathname: string) => {
    tour.addStep({
      id: "room-allotment-welcome",
      title: "Room Allotment Management",
      text: `Room Allotment includes: Room assignments, Occupancy tracking, Department allocation, and Room availability management.`,
      buttons: [
        {
          text: "Back to Dashboard",
          action: () => {
            window.location.href = '/dashboard';
          },
        },
      ],
    });
  };

  const addPrescriptionsPageSteps = (tour: Shepherd.Tour, pathname: string) => {
    tour.addStep({
      id: "prescriptions-welcome",
      title: "Prescription Management",
      text: `Prescriptions module includes: Prescription creation, Medication tracking, Prescription templates, and Fulfillment management.`,
      buttons: [
        {
          text: "Back to Dashboard",
          action: () => {
            window.location.href = '/dashboard';
          },
        },
      ],
    });
  };

  return null;
}
