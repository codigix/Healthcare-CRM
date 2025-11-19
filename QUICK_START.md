# Healthcare CRM - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Seed Database with Mock Data
```bash
cd backend
node comprehensive-seed.js
```

Expected output:
```
✅ Comprehensive database seed completed successfully!
📊 Summary:
✓ 80+ records across 21 tables
✓ All data persisted in MySQL
```

### Step 2: Start Backend Server
```bash
cd backend
npm run dev
```

Expected: `Server running on port 5000`

### Step 3: Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
```

Expected: `▲ Next.js started on http://localhost:3000`

### Step 4: Login to Application
- URL: `http://localhost:3000/login`
- Email: `admin@medixpro.com`
- Password: `password123`

### Step 5: View Your Data
- **Inventory**: http://localhost:3000/inventory
- **Medicines**: http://localhost:3000/pharmacy/medicines
- **Patients**: http://localhost:3000/patients
- **Dashboard**: http://localhost:3000/dashboard

---

## ✅ Verify Data Persistence

### Test 1: Check Data in Database
```bash
cd backend
node verify-data-persistence.js
```

You should see:
```
✅ Tables Verified: 21/21
📊 Total Records: 80

🎉 SUCCESS! All data is persisted in MySQL database!
```

### Test 2: Refresh Browser
1. Go to http://localhost:3000/inventory
2. You should see all 8 medicines
3. **Press F5 to refresh**
4. All medicines still visible ✅

### Test 3: Restart Backend
1. Stop backend (Ctrl+C)
2. Start backend again (`npm run dev`)
3. Go to http://localhost:3000/inventory
4. All medicines still visible ✅

---

## 📊 What's in the Database?

| Category | Count | Examples |
|----------|-------|----------|
| 💊 Medicines | 8 | Aspirin, Amoxicillin, Metformin, etc. |
| 👤 Patients | 5 | John Doe, Maria Garcia, Ravi Singh, etc. |
| 👨‍⚕️ Doctors | 4 | Dr. Rajesh Kumar, Dr. Priya Sharma, etc. |
| 🏥 Departments | 5 | Cardiology, Neurology, Pediatrics, etc. |
| 📅 Appointments | 6 | Multiple doctor-patient meetings |
| 👔 Staff | 5 | Hospital employees with roles |
| 🛏️ Rooms | 5 | Hospital rooms (Standard, ICU, General Ward) |
| 🚑 Ambulances | 3 | Emergency vehicles with drivers |
| 📋 Invoices | 3 | Patient billing records |
| And more... | 40+ | Complete healthcare management data |

---

## 🔧 Useful Commands

### Development
```bash
# Build backend TypeScript
npm run build

# Check TypeScript errors
npm run build

# Watch Prisma schema changes
npm run prisma:generate
```

### Database
```bash
# Reseed database (clear and repopulate)
node cleanup-db.js
node comprehensive-seed.js

# Verify all data
node verify-data-persistence.js

# Launch Prisma Studio (visual DB editor)
npm run prisma:studio
```

### Frontend
```bash
# Build for production
npm run build

# Start production build
npm run start
```

---

## 🐛 Troubleshooting

### "Cannot connect to database"
```bash
# Check if MySQL is running
# On Windows: Start MySQL Service
# URL should be: mysql://root:Backend@localhost:3306/medixpro
```

### "No medicines showing in inventory"
```bash
# Run seed script
node comprehensive-seed.js

# Verify data exists
node verify-data-persistence.js
```

### "Port 5000 already in use"
```bash
# Stop the old process or use different port
# Set in backend/.env: PORT=5001
```

### "Frontend shows loading forever"
1. Check browser console (F12)
2. Verify backend is running: http://localhost:5000/api/health
3. Check frontend .env: NEXT_PUBLIC_API_URL=http://localhost:5000/api

---

## 📱 Key Features to Test

### 1. Inventory Management
- ✅ View all medicines with stock levels
- ✅ Search for specific medicines
- ✅ Filter by category
- ✅ Filter by status (In Stock, Low Stock, Out of Stock)
- ✅ **Data persists on refresh**

### 2. Patient Management
- ✅ View all patients
- ✅ Patient details and history
- ✅ Appointments linked to patients
- ✅ Invoice tracking

### 3. Doctor Management
- ✅ View doctors with specializations
- ✅ Schedule information
- ✅ Experience levels
- ✅ Appointment availability

### 4. Dashboard
- ✅ Real-time statistics
- ✅ Recent appointments
- ✅ Revenue analytics
- ✅ Patient growth charts

---

## 🎯 What's Fixed in This Release

✅ **Database Connection**
- Fixed: Multiple Prisma client instances
- Solution: Centralized shared client (backend/src/db.ts)

✅ **Frontend Data Fetching**
- Fixed: Hardcoded inventory data
- Solution: Real API integration with lifecycle hooks

✅ **Data Persistence**
- Fixed: Data lost on page refresh
- Solution: Proper database storage and retrieval

✅ **Mock Data**
- Added: 80+ records across 21 tables
- Complete: Realistic healthcare data for testing

---

## 📞 Support

### Common Issues
1. **Data not loading**: Check backend console for errors
2. **API errors**: Verify database connection
3. **Login issues**: Use admin@medixpro.com / password123
4. **Slow performance**: Run on local machine (localhost)

### Useful Files
- Backend routes: `backend/src/routes/`
- Frontend pages: `frontend/src/app/`
- Database schema: `backend/prisma/schema.prisma`
- Environment: `.env` files in backend and frontend

---

## 🚀 Next Steps

After verification:
1. **Add more test data** using the same seed pattern
2. **Customize forms** for your specific needs
3. **Add real authentication** (currently demo mode)
4. **Deploy to production** with proper security
5. **Set up backups** for your database

---

## 📋 Files Changed

### Created
- `backend/src/db.ts` - Shared Prisma client
- `backend/comprehensive-seed.js` - Mock data generator
- `backend/cleanup-db.js` - Database cleanup
- `backend/verify-data-persistence.js` - Data verification
- `backend/comprehensive-test.js` - API testing

### Updated
- `backend/src/server.ts` - Uses shared Prisma client
- 16 route files in `backend/src/routes/` - Uses shared Prisma client
- `frontend/src/app/inventory/page.tsx` - Real API integration

### Documentation
- `FIXES_APPLIED.md` - Technical details
- `DATA_PERSISTENCE_COMPLETE.md` - Full documentation
- `QUICK_START.md` - This file

---

**Status: ✅ READY TO USE**

Start with Step 1 above and you'll have a fully functional healthcare CRM with real data!
