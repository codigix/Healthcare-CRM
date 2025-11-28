# Patient Management - Quick Start Guide

## What Changed

### Patient Add Form (Simplified)
The patient add form was **massively simplified** from a 4-tab complex form to a clean 2-tab form that only includes fields that actually get saved.

| Before | After |
|--------|-------|
| 4 tabs | 2 tabs |
| 50+ fields | 8 fields |
| Complex state management | Simple form data |
| Insurance, Emergency Contact, Payment info (NOT SAVED) | Only savable fields |

### Patient List (Improved Display)
The patient list now properly displays patient information with better handling of:
- Age calculation (no more "0 years" or undefined)
- Null field display (shows "-" instead of blank)
- Better formatting and visual consistency

## Quick Test Workflow

### 1. Add a Patient
```
✓ Go to http://localhost:3000/patients/add
✓ Tab 1 - Personal Information:
  - First Name: "Anu"
  - Last Name: "Pawar"  
  - Date of Birth: "1998-05-15"
  - Gender: "Female"
  - Email: "anu@example.com"
  - Phone: "9876543210"
  - Address: "123 Main St" (optional)

✓ Tab 2 - Medical History:
  - History: "Allergic to Penicillin" (optional)

✓ Click "Save Patient"
```

### 2. View Patient in List
```
✓ Should see patient in list with:
  - Name: "Anu Pawar"
  - Age: 27 (calculated from DOB)
  - Gender: Female
  - Status: Active
  - Other fields: "-" if empty
```

### 3. Edit Patient
```
✓ Click three dots menu next to patient
✓ Click "Edit"
✓ Modify information
✓ Click "Save Patient"
✓ Changes appear in list
```

## What Fields Get Saved

✅ **These save to database:**
- First Name + Last Name (combined as "name")
- Email
- Phone
- Date of Birth
- Gender
- Address
- Medical History

❌ **These DON'T save (removed from form):**
- Middle Name
- Marital Status
- City/State/Zip Code
- Alternative Phone
- Preferred Contact Method
- Emergency Contact
- Insurance Information
- Payment Methods
- Profile Photo

## Age Calculation

**How it works:**
1. Backend calculates age from DOB when returning patient list
2. Frontend checks if age > 0
3. If age = 0 or undefined, frontend recalculates
4. Displays age or "-" if not available

**Examples:**
- DOB: "2000-01-15" → Age: "25"
- DOB: null or invalid → Age: "-"
- DOB: "2025-11-28" → Age: "0" or "-" (possible future date)

## Common Issues & Solutions

### Age shows as 0 or "-"
**Solution**: Ensure Date of Birth is filled correctly
- Check format: YYYY-MM-DD
- Verify it's before today's date
- Re-save the patient record

### Missing fields in list display
**Solution**: This is expected - only these fields show:
- Name
- Age/Gender
- Status
- Last Visit
- Condition
- Doctor
- Actions menu

### Patient not appearing after save
**Solution:**
1. Check browser console (F12) for errors
2. Check network tab - ensure POST returns 201 status
3. Refresh the page (Ctrl+R)
4. Check backend logs for database errors

### Date formatting
**Frontend display format:** "Nov 28, 2025"
**Database storage format:** ISO 8601 (2025-11-28T00:00:00.000Z)

## File Sizes (Improvements)

| File | Before | After | Reduction |
|------|--------|-------|-----------|
| patients/add/page.tsx | 49.8 KB | 10 KB | 80% ↓ |
| patients/page.tsx | 7.88 KB | 7.98 KB | 1% (added age calc) |
| Build time | ~50s | ~50s | Same |

## API Endpoints Used

### Create Patient
```
POST /api/patients
Content-Type: application/json

{
  "name": "Anu Pawar",
  "email": "anu@gmail.com",
  "phone": "9876543210",
  "dob": "1998-05-15",
  "gender": "Female",
  "address": "123 Main St",
  "history": "Allergic to Penicillin"
}
```

### Get Patients List
```
GET /api/patients?page=1&limit=10&search=""
Authorization: Bearer {token}

Response includes:
- age (calculated from dob)
- status (default: "Active")
- lastVisit (from appointments)
- condition (from history field)
- doctor (from doctorId join)
```

### Update Patient
```
PUT /api/patients/{id}
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@email.com",
  "phone": "9999999999",
  "dob": "1998-05-15",
  "gender": "Female",
  "address": "123 New St",
  "history": "Updated history"
}
```

### Delete Patient
```
DELETE /api/patients/{id}
```

## Browser Developer Tools Tips

### Check API Response
1. Open DevTools (F12)
2. Go to Network tab
3. Look for POST/GET/PUT requests to `/api/patients`
4. Click request and check Response tab
5. Verify data structure matches expectations

### Check Console Logs
```javascript
// Backend logs on create:
console.log('Creating patient with data:', patientData);

// Frontend logs:
console.error('Error creating patient:', err);
```

## Database Query Reference

### Check patient data directly
```sql
-- All patients
SELECT * FROM patients ORDER BY createdAt DESC;

-- Patients with age calculation
SELECT 
  id, 
  name, 
  email, 
  phone, 
  dob,
  YEAR(CURDATE()) - YEAR(dob) - (DATE_FORMAT(CURDATE(), '%m%d') < DATE_FORMAT(dob, '%m%d')) as age,
  gender,
  address,
  history
FROM patients;

-- Count patients
SELECT COUNT(*) as total FROM patients;
```

## Deployment Notes

### Before going to production:
1. ✓ Test patient add flow
2. ✓ Test patient list display with 50+ patients
3. ✓ Test age calculation for various DOBs
4. ✓ Verify database backups
5. ✓ Check database constraints
6. ✓ Test API response times

### After deployment:
1. Monitor error logs
2. Check age calculations for first week
3. Verify null fields display correctly
4. Monitor database query performance
5. Get user feedback on new form

## Contact & Support

For issues or questions:
1. Check logs: backend server logs + browser console
2. Review this document: PATIENTS_PAGE_IMPROVEMENTS.md
3. Check API endpoints in backend/src/routes/patients.ts
4. Verify database schema in backend/prisma/schema.prisma
