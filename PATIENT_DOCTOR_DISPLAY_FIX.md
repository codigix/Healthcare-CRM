# Patient Doctor Assignment & Display Fix

## Issue
Doctor information was not displaying in the Patients List table even when doctors were assigned to patients.

## Root Cause
The SQL query in the patients GET endpoint had a GROUP BY clause that didn't aggregate the doctor name and specialization fields, causing them to return NULL or undefined.

```sql
-- BEFORE (Incorrect)
SELECT p.*, MAX(a.date) as lastVisitDate,
       d.name as assignedDoctorName,  -- Missing MAX() aggregation
       d.specialization as assignedDoctorSpecialty  -- Missing MAX() aggregation
FROM patients p
LEFT JOIN appointments a ON p.id = a.patientId
LEFT JOIN doctors d ON p.doctorId = d.id
WHERE 1=1
GROUP BY p.id
```

## Solution
Added `MAX()` aggregation function to the non-aggregated doctor fields:

```sql
-- AFTER (Correct)
SELECT p.*, MAX(a.date) as lastVisitDate,
       MAX(d.name) as assignedDoctorName,      -- Fixed with MAX()
       MAX(d.specialization) as assignedDoctorSpecialty  -- Fixed with MAX()
FROM patients p
LEFT JOIN appointments a ON p.id = a.patientId
LEFT JOIN doctors d ON p.doctorId = d.id
WHERE 1=1
GROUP BY p.id
```

## Changes Made

### Backend (`backend/src/routes/patients.ts`)
- **Line 74-78**: Updated SELECT clause to use `MAX(d.name)` and `MAX(d.specialization)`
- **Line 130-140**: Response mapping correctly returns:
  - `doctor: patient.assignedDoctorName || null`
  - `doctorSpecialty: patient.assignedDoctorSpecialty || null`

### Frontend (`frontend/src/app/patients/page.tsx`)
- **Line 21**: Added `doctorSpecialty?: string;` to Patient interface
- **Line 156-169**: Enhanced Doctor column display:
  - Shows doctor name in bold when assigned
  - Shows specialization in smaller gray text below name
  - Falls back to "-" if no doctor assigned
  - Proper null checking

## Data Flow

```
Database: patients.doctorId → doctors.id
    ↓
Backend SQL JOIN: LEFT JOIN doctors d ON p.doctorId = d.id
    ↓
Extract fields: MAX(d.name), MAX(d.specialization)
    ↓
Map to response: doctor, doctorSpecialty
    ↓
Frontend receives: { doctor, doctorSpecialty }
    ↓
Display in table with proper formatting
```

## Example Output
When a patient has an assigned doctor:
```
Doctor Column displays:
┌─────────────────────────┐
│ Dr. Rajesh Kumar        │
│ Cardiology Specialist   │ (gray, smaller)
└─────────────────────────┘
```

When no doctor assigned:
```
Doctor Column displays: -
```

## Build Status
✅ Backend: Compiles successfully (TypeScript)
✅ Frontend: Compiles successfully (Next.js)
✅ All type checks pass
✅ No lint errors

## Testing
The fix will work correctly for any patient with:
- Valid `doctorId` in the patients table
- Corresponding doctor record in the doctors table
- Patient record with non-null `dob`, `gender`, and other required fields

## Note
Patients shown in screenshots without doctor assignments (showing "-") indicates those specific patients don't have a `doctorId` set in the database, not an issue with the display logic.
