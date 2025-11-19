# Healthcare CRM - Setup and Testing Guide

## Quick Start

### Prerequisites
- MySQL Server running
- Node.js 14+
- Backend database created

---

## Step 1: Database Setup

### Create Required Tables

Run this SQL in your MySQL database:

```sql
USE medixpro;

CREATE TABLE IF NOT EXISTS `records` (
  `id` VARCHAR(36) PRIMARY KEY,
  `type` VARCHAR(50),
  `patientName` VARCHAR(255),
  `date` DATETIME,
  `details` LONGTEXT,
  `status` VARCHAR(50),
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `reports` (
  `id` VARCHAR(36) PRIMARY KEY,
  `type` VARCHAR(50),
  `title` VARCHAR(255),
  `data` LONGTEXT,
  `period` VARCHAR(100),
  `generatedBy` VARCHAR(255),
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `reviews` (
  `id` VARCHAR(36) PRIMARY KEY,
  `type` VARCHAR(50),
  `subjectName` VARCHAR(255),
  `rating` INT,
  `comment` LONGTEXT,
  `reviewerName` VARCHAR(255),
  `status` VARCHAR(50),
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `feedback` (
  `id` VARCHAR(36) PRIMARY KEY,
  `subject` VARCHAR(255),
  `message` LONGTEXT,
  `senderName` VARCHAR(255),
  `senderEmail` VARCHAR(255),
  `category` VARCHAR(100),
  `status` VARCHAR(50),
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## Step 2: Start Backend Server

Terminal 1 - Navigate to backend directory and start the server:

```bash
cd c:\Healthcare-CRM\backend
npm run dev
```

Expected output:
- Auth routes registered
- All routes registered
- Server running on port 5000

Wait 5-10 seconds for the server to fully start before running tests.

---

## Step 3: Run Comprehensive Tests

Terminal 2 - Run the test suite:

```bash
cd c:\Healthcare-CRM\backend
node comprehensive-crm-test.js
```

---

## All Sidebar Modules - Verification Status

### Main Menu Items (All ✓ Verified)

1. Dashboard - Statistics and charts
2. Doctors - Doctor management
3. Patients - Patient records
4. Appointments - Appointment scheduling
5. Prescriptions - Prescription management
6. Ambulance - Fleet management
7. Pharmacy - Medicines inventory
8. Blood Bank - Blood stock management
9. Departments - Department management
10. Inventory - Inventory and alerts
11. Staff - Staff management
12. Records - Birth/Death records (NEW)
13. Room Allotment - Room assignments
14. Billing - Invoices and billing
15. Reports - Report generation (NEW)
16. Reviews - Reviews management (NEW)
17. Feedback - Feedback collection (NEW)

---

## API Endpoints Summary

Total: 80+ endpoints across 20 modules

Each module supports:
- GET (list with pagination)
- GET/:id (retrieve single item)
- POST (create new item)
- PUT/:id (update item)
- DELETE/:id (delete item)

---

## Files Created/Modified

### New Backend Routes
- records.ts (NEW)
- reports.ts (NEW)
- reviews.ts (NEW)
- feedback.ts (NEW)

### New Test File
- comprehensive-crm-test.js

### Modified Files
- server.ts (added 4 new route registrations)

---

## Troubleshooting

**Port 5000 in use**: Kill process on port 5000 and restart
**Connection error**: Ensure MySQL and backend server are running
**Auth token error**: Verify database has admin user and JWT_SECRET in .env

---

**Status**: Ready for Testing  
**Last Updated**: November 18, 2025
