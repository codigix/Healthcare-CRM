# MedixPro Medical Admin Dashboard - Setup Guide

## Project Overview

MedixPro is a full-stack medical admin dashboard built with:
- **Frontend**: Next.js 14 (App Router) + TailwindCSS + ShadCN/UI + Recharts
- **Backend**: Node.js + Express.js + Prisma ORM
- **Database**: MySQL

## Prerequisites

- Node.js 18+ and npm
- MySQL Server 8.0+
- Git

## Local Development Setup

### 1. Database Setup

Create a MySQL database:

```bash
mysql -u root -p
CREATE DATABASE medixpro;
EXIT;
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (already provided)
cp .env.example .env

# Update DATABASE_URL in .env with your MySQL credentials
# Example: DATABASE_URL="mysql://root:password@localhost:3306/medixpro"

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Start backend server
npm run dev
```

Backend will run on: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file (already provided)
cp .env.example .env.local

# Update NEXT_PUBLIC_API_URL in .env.local if needed
# Default: NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start frontend development server
npm run dev
```

Frontend will run on: `http://localhost:3000`

## Default Login Credentials

After running migrations, create admin user:

```bash
# In backend directory
npx ts-node -e "
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@medixpro.com',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log('Admin user created:', user);
}

main().catch(console.error);
"
```

Login with:
- **Email**: admin@medixpro.com
- **Password**: password123

## Project Structure

```
hospital/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/
│   │   │   ├── doctors/
│   │   │   ├── patients/
│   │   │   ├── appointments/
│   │   │   ├── invoices/
│   │   │   ├── reports/
│   │   │   ├── settings/
│   │   │   ├── login/
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   ├── Forms/
│   │   │   └── UI/
│   │   └── lib/
│   │       ├── api.ts
│   │       └── store.ts
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── doctors.ts
│   │   │   ├── patients.ts
│   │   │   ├── appointments.ts
│   │   │   ├── invoices.ts
│   │   │   └── dashboard.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
```

## Features

### 1. Authentication
- Email/password login
- JWT token-based authentication
- Role-based access control (admin, doctor, staff)
- Protected routes

### 2. Dashboard
- Summary statistics (revenue, appointments, patients, doctors)
- Revenue trends chart
- Patient growth chart
- Recent appointments list

### 3. Doctors Management
- List doctors with search and pagination
- Add/Edit/Delete doctor profiles
- Doctor specialization and experience tracking
- Schedule management

### 4. Patients Management
- List patients with search and pagination
- Add/Edit/Delete patient profiles
- Medical history tracking
- Demographics management

### 5. Appointments
- Schedule appointments with doctor and patient
- Appointment status tracking (pending, confirmed, completed)
- Filter by status and date range
- Edit and delete appointments

### 6. Invoices & Billing
- Generate invoices for patients
- Track payment status
- PDF export functionality
- Due date tracking

### 7. Reports & Analytics
- Revenue trends visualization
- Patient growth tracking
- Monthly analytics
- CSV export functionality

### 8. Settings
- User profile management
- Password change
- Notification preferences
- Theme settings

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Doctors
- `GET /api/doctors` - List doctors (paginated)
- `GET /api/doctors/:id` - Get doctor details
- `POST /api/doctors` - Create doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Patients
- `GET /api/patients` - List patients (paginated)
- `GET /api/patients/:id` - Get patient details
- `POST /api/patients` - Create patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Appointments
- `GET /api/appointments` - List appointments (with filters)
- `GET /api/appointments/:id` - Get appointment details
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Invoices
- `GET /api/invoices` - List invoices (paginated)
- `GET /api/invoices/:id` - Get invoice details
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `GET /api/invoices/:id/pdf` - Download invoice as PDF

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-appointments` - Recent appointments
- `GET /api/dashboard/revenue-chart` - Revenue data
- `GET /api/dashboard/patient-growth` - Patient growth data

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
DATABASE_URL=mysql://root:password@localhost:3306/medixpro
JWT_SECRET=your_jwt_secret_key_here_change_in_production
PORT=5000
NODE_ENV=development
```

## Database Schema

### Users Table
- id, name, email, password_hash, role, avatar_url

### Doctors Table
- id, name, email, phone, specialization, experience, schedule, avatar

### Patients Table
- id, name, email, phone, dob, gender, address, history

### Appointments Table
- id, doctor_id, patient_id, date, time, status, notes

### Invoices Table
- id, patient_id, amount, status, date, due_date, notes

### Activity Logs Table
- id, user_id, action, description, timestamp

## Production Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api`
4. Deploy

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository to deployment platform
3. Set environment variables:
   - `DATABASE_URL=mysql://...`
   - `JWT_SECRET=strong_secret_key`
   - `NODE_ENV=production`
4. Deploy

### Database (AWS RDS/DigitalOcean)
1. Create managed MySQL database
2. Update `DATABASE_URL` in backend environment
3. Run Prisma migrations in production

## Testing

```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
npm run build
```

## Troubleshooting

### Database Connection Error
- Check MySQL is running
- Verify DATABASE_URL credentials
- Ensure database exists

### API Not Connecting
- Check backend is running on port 5000
- Verify NEXT_PUBLIC_API_URL is correct
- Check CORS settings

### Port Already in Use
```bash
# Kill process on port 3000 or 5000
# On Windows
taskkill /PID <PID> /F

# On Mac/Linux
kill -9 <PID>
```

## Support & Documentation

For more information on technologies used:
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [MySQL Documentation](https://dev.mysql.com/doc/)
