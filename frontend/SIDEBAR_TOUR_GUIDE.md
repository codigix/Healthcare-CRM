# Sidebar Tour Guide

## Overview

The Sidebar Tour is an interactive guided tour that introduces users to all the major modules and features available in the Healthcare CRM system. It provides detailed explanations of each sidebar navigation item, including their sub-modules and functionality.

## Features

- **29-Step Interactive Tour**: Comprehensive coverage of all sidebar modules plus dashboard connections
- **Smart Positioning**: Modal automatically positions itself to point at highlighted elements
- **Element-Aware Placement**: Modal appears above, below, left, or right of elements based on available space
- **Dashboard ↔ Sidebar Connections**: Shows how dashboard metrics link to detailed sidebar modules
- **Draggable Modal**: Click and drag the modal header to reposition anywhere on screen
- **Touch Support**: Full touch support for mobile devices and tablets
- **Smooth Animations**: CSS-based transitions with element highlighting
- **Typewriter Text Effect**: Character-by-character text animation for engaging experience
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Keyboard Navigation**: Full accessibility support (ESC to close, Tab navigation)
- **Progress Tracking**: Visual progress bar and step counter
- **Element Highlighting**: Blue glowing borders around highlighted elements
- **Auto-scrolling**: Automatic smooth scrolling to highlighted elements
- **Viewport Bounds**: Modal stays within screen boundaries during drag

## Tour Steps

### 1. 🏥 Dashboard Module
**Target**: `[data-tour="dashboard-nav"]`
- Central command center with key metrics and performance indicators
- Multiple dashboard views: Admin, Doctor, and Patient dashboards
- Real-time clinic performance monitoring

### 2. 👨‍⚕️ Doctors Management
**Target**: `[data-tour="doctors-nav"]`
- Complete doctor database management
- Doctors List: Browse and search all registered doctors
- Add Doctor: Register new medical staff members
- Doctor Schedule: Manage appointments and availability

### 3. 👥 Patients Management
**Target**: `[data-tour="patients-nav"]`
- Patient records and registration system
- Patients List: Complete patient database with search functionality
- Add Patient: Register new patients with comprehensive profiles

### 4. 📅 Appointments System
**Target**: `[data-tour="appointments-nav"]`
- Full appointment scheduling and management
- All Appointments: Complete appointment calendar
- Add Appointment: Schedule new patient visits
- Calendar View: Visual appointment timeline
- Appointment Requests: Handle booking requests

### 5. 💊 Prescriptions Module
**Target**: `[data-tour="prescriptions-nav"]`
- Digital prescription management system
- All Prescriptions: Access complete prescription history
- Create Prescription: Write new prescriptions digitally
- Medicine Templates: Use pre-configured medication templates

### 6. 🚑 Ambulance Services
**Target**: `[data-tour="ambulance-nav"]`
- Emergency response coordination
- Ambulance Call List: Track emergency response calls
- Ambulance List: Manage fleet availability
- Ambulance Details: Vehicle maintenance and status tracking

### 7. 🏥 Pharmacy Integration
**Target**: `[data-tour="pharmacy-nav"]`
- Integrated pharmacy management
- Medicine List: Inventory of available medications
- Add Medicine: Stock new medications and supplies

### 8. 🩸 Blood Bank Management
**Target**: `[data-tour="blood-bank-nav"]`
- Complete blood bank operations
- Blood Stock: Monitor blood type availability
- Blood Donor: Manage donor database and schedules
- Blood Issued: Track blood transfusions
- Add Blood Unit: Register new blood donations
- Issue Blood: Process blood requests and distribution

### 9. 🏥 Departments Management
**Target**: `[data-tour="departments-nav"]`
- Medical specialty organization
- Department List: View all medical departments
- Add Department: Create new specialty departments
- Services Offered: Manage department capabilities

### 10. 📦 Inventory Control
**Target**: `[data-tour="inventory-nav"]`
- Medical supplies and equipment management
- Inventory List: Track all medical supplies
- Add Item: Register new inventory items
- Stock Alerts: Automatic low-stock notifications
- Suppliers List: Manage vendor relationships

### 11. 👥 Staff Management
**Target**: `[data-tour="staff-nav"]`
- Comprehensive staff administration
- All Staff: Complete staff directory
- Add Staff: Hire and onboard employees
- Roles & Permissions: Control access and responsibilities
- Attendance: Track staff schedules and presence

### 12. 📋 Medical Records
**Target**: `[data-tour="records-nav"]`
- Vital records management for compliance
- Birth Records: Document newborn registrations
- Death Records: Maintain mortality records

### 13. 🏠 Room Allotment
**Target**: `[data-tour="room-allotment-nav"]`
- Hospital room and bed management
- Alloted Rooms: Current room assignments
- New Allotment: Assign patients to rooms
- Rooms by Department: Department-specific management
- Add New Room: Register new facilities

### 14. 💰 Billing & Payments
**Target**: `[data-tour="billing-nav"]`
- Complete financial management
- Invoices: Generate and manage patient bills
- Create Invoice: Process new billing requests
- Payments History: Track financial transactions
- Insurance Claims: Handle insurance processing

### 15. 📊 Reports & Analytics
**Target**: `[data-tour="reports-nav"]`
- Comprehensive reporting system
- Appointment Reports: Scheduling analytics
- Financial Reports: Revenue and expense analysis
- Patient Visit Reports: Treatment metrics
- Inventory Reports: Supply chain statistics
- Staff Performance: Productivity metrics
- Custom Reports: Flexible reporting tools

### 16. ⭐ Reviews & Feedback
**Target**: `[data-tour="reviews-nav"]`
- Patient and staff feedback system
- Doctor Reviews: Patient feedback on care quality
- Patient Reviews: Overall clinic experience ratings

### 17. 💬 Patient Feedback
**Target**: `[data-tour="feedback-nav"]`
- Direct patient communication channel
- Collect detailed feedback about healthcare experience
- Monitor service quality and identify improvements

### 18. ⚙️ System Settings
**Target**: `[data-tour="settings-nav"]`
- System configuration and preferences
- User settings, system behavior, and security controls
- Administrative system management

### 19. 🔐 Authentication
**Target**: `[data-tour="authentication-nav"]`
- User authentication and access control
- Account management, passwords, and security settings
- Role-based permissions system

### 20. 📆 Calendar Integration
**Target**: `[data-tour="calendar-nav"]`
- Integrated calendar system for scheduling
- Visual calendar with appointments and events
- External calendar synchronization

### 21. ✅ Task Management
**Target**: `[data-tour="tasks-nav"]`
- Team task organization and tracking
- Create, assign, and monitor healthcare tasks
- Improve team productivity and coordination

### 22. 📞 Contacts Directory
**Target**: `[data-tour="contacts-nav"]`
- Centralized contacts management
- Store patient, staff, and external provider information
- Quick access to important contact details

### 23. 📧 Email Communication
**Target**: `[data-tour="email-nav"]`
- Integrated email system
- Send appointment reminders and test results
- Maintain electronic communication records

## Usage

### Starting the Tour

1. Navigate to any page in the Healthcare CRM
2. Look for the green "Sidebar Tour" button in the top navigation bar
3. Click the button to start the interactive tour
4. The tour will begin with the Dashboard module explanation

### Navigation Controls

- **Next**: Move to the next step in the tour
- **Previous**: Go back to the previous step
- **Skip**: End the tour immediately
- **ESC Key**: Close the tour modal
- **Tab**: Navigate between modal controls (accessibility)

### Tour Features

- **Element Highlighting**: Each step highlights the corresponding sidebar item with a blue glowing border
- **Auto-scrolling**: The page automatically scrolls to bring highlighted elements into view
- **Smart Positioning**: Modal repositions automatically for each step to point at the highlighted element
- **Progress Indicator**: Visual progress bar shows current position in the tour
- **Typewriter Effect**: Text appears character-by-character for engaging presentation
- **Drag to Reposition**: Click and drag the modal header to move it anywhere on screen
- **Touch Support**: Touch and drag on mobile devices and tablets

### Positioning Logic

The modal uses intelligent positioning to always point at the relevant element:

- **Top Position**: Modal appears above the element (default for most sidebar items)
- **Bottom Position**: Modal appears below when above would be off-screen
- **Left/Right Position**: Modal positions to the side when vertical space is limited
- **Auto-Adjustment**: Automatically repositions when screen boundaries are reached

### Drag Controls

| Action | How to Use | Description |
|--------|------------|-------------|
| **Start Drag** | Click and hold modal header | Grab cursor appears, modal becomes draggable |
| **Drag Modal** | Move mouse/touch while holding | Modal follows cursor movement |
| **Stop Drag** | Release mouse button/touch | Modal stays in new position |
| **Boundary Limits** | Drag near screen edges | Modal automatically stays within viewport |

## Technical Implementation

### Component Structure

```tsx
<SidebarTour
  onComplete?: () => void;
  autoStart?: boolean;
/>
```

### Props

- `onComplete`: Optional callback function called when tour completes
- `autoStart`: Boolean to automatically start tour on component mount

### Dependencies

- React hooks (useState)
- SystemTourModal component
- Tailwind CSS for styling
- Lucide React icons

### Data Attributes

The tour uses specific data attributes to target sidebar elements:

- `data-tour="dashboard-nav"`
- `data-tour="doctors-nav"`
- `data-tour="patients-nav"`
- etc.

These attributes are automatically added to sidebar navigation items.

## Customization

### Modifying Tour Steps

Edit the `sidebarTourSteps` array in `SidebarTour.tsx`:

```tsx
const sidebarTourSteps: SidebarTourStep[] = [
  {
    title: '🏥 Custom Title',
    description: 'Custom description...',
    targetSelector: '[data-tour="custom-nav"]',
    position: 'right',
  },
  // ... more steps
];
```

### Adjusting Animation Speed

Modify the typewriter effect speed in `SystemTourModal.tsx`:

```tsx
const typingSpeed = 30; // milliseconds per character
```

### Changing Highlight Colors

Update the highlight styling in the `highlightElement` function:

```tsx
element.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.4)';
```

## Accessibility

- Full keyboard navigation support
- Screen reader compatible
- High contrast element highlighting
- Focus management within modal
- ARIA labels and descriptions

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for all screen sizes

## Integration

The SidebarTour is integrated into the Topbar component and available on all pages. It uses the existing sidebar navigation structure and doesn't require additional setup.

## Testing

Comprehensive test coverage includes:

- Tour initialization and modal display
- Step navigation (next/previous)
- Element highlighting functionality
- Keyboard navigation
- Tour completion and cleanup
- Error handling for missing elements

Run tests with: `npm test SidebarTour.test.tsx`