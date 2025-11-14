# MedixPro - Medical Admin Dashboard

A comprehensive medical administration dashboard built with **Next.js**, **Node.js/Express**, and **MySQL**. Inspired by the MedixPro ThemeForest template, this application provides complete healthcare management capabilities.

![MedixPro Dashboard](https://img.shields.io/badge/Status-Development-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Features

### Core Functionality
- **🔐 Authentication**: Secure JWT-based login with role-based access control
- **📊 Dashboard**: Real-time statistics, revenue trends, and patient growth analytics
- **👨‍⚕️ Doctor Management**: Add, edit, delete doctors with specialization tracking
- **👥 Patient Management**: Comprehensive patient profiles with medical history
- **📅 Appointments**: Schedule, track, and manage patient appointments
- **💰 Invoicing**: Generate professional invoices with PDF export
- **📈 Analytics**: Advanced reporting with charts and data visualization
- **⚙️ Settings**: User profile management and security settings

### Technical Features
- Dark mode UI (inspired by MedixPro template)
- Responsive design (desktop, tablet, mobile)
- Pagination and search functionality
- Real-time data updates
- CSV/PDF export capabilities
- Error handling and validation

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS** for styling
- **Recharts** for data visualization
- **Lucide Icons** for UI icons
- **Zustand** for state management
- **Axios** for API calls
- **React Query** for data fetching

### Backend
- **Node.js** + **Express.js**
- **TypeScript**
- **Prisma ORM**
- **JWT Authentication**
- **bcryptjs** for password hashing
- **PDFKit** for PDF generation

### Database
- **MySQL 8.0+**
- Normalized relational schema
- Prisma migrations support

## 📁 Project Structure

```
hospital/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # Reusable components
│   │   ├── lib/             # Utilities and stores
│   │   └── styles/          # Global styles
│   ├── package.json
│   └── .env.local
│
├── backend/                  # Express.js server
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── middleware/      # Auth middleware
│   │   └── server.ts        # Main server file
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── package.json
│   └── .env
│
├── SETUP_GUIDE.md          # Detailed setup instructions
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### 1. Database Setup
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE medixpro;
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env

# Update DATABASE_URL in .env
npx prisma migrate dev --name init
npm run dev  # Runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev  # Runs on http://localhost:3000
```

### 4. Access Application
- Open: `http://localhost:3000`
- Login with: `admin@medixpro.com` / `password123`

## 📖 API Documentation

### Authentication
```
POST   /api/auth/register       - Register user
POST   /api/auth/login          - Login user
GET    /api/auth/profile        - Get user profile
PUT    /api/auth/profile        - Update profile
POST   /api/auth/change-password - Change password
```

### Doctors
```
GET    /api/doctors             - List doctors
GET    /api/doctors/:id         - Get doctor details
POST   /api/doctors             - Create doctor
PUT    /api/doctors/:id         - Update doctor
DELETE /api/doctors/:id         - Delete doctor
```

### Patients
```
GET    /api/patients            - List patients
GET    /api/patients/:id        - Get patient details
POST   /api/patients            - Create patient
PUT    /api/patients/:id        - Update patient
DELETE /api/patients/:id        - Delete patient
```

### Appointments
```
GET    /api/appointments        - List appointments
GET    /api/appointments/:id    - Get appointment
POST   /api/appointments        - Create appointment
PUT    /api/appointments/:id    - Update appointment
DELETE /api/appointments/:id    - Delete appointment
```

### Invoices
```
GET    /api/invoices            - List invoices
GET    /api/invoices/:id        - Get invoice
POST   /api/invoices            - Create invoice
PUT    /api/invoices/:id        - Update invoice
DELETE /api/invoices/:id        - Delete invoice
GET    /api/invoices/:id/pdf    - Download invoice PDF
```

### Dashboard
```
GET    /api/dashboard/stats             - Get statistics
GET    /api/dashboard/recent-appointments - Recent appointments
GET    /api/dashboard/revenue-chart     - Revenue data
GET    /api/dashboard/patient-growth    - Growth data
```

## 🎨 UI Pages

- **Dashboard** (`/dashboard`) - Overview and statistics
- **Doctors** (`/doctors`) - Doctor management
- **Patients** (`/patients`) - Patient management
- **Appointments** (`/appointments`) - Appointment scheduling
- **Invoices** (`/invoices`) - Billing and invoices
- **Reports** (`/reports`) - Analytics and reports
- **Settings** (`/settings`) - User settings

## 🔒 Authentication

- JWT token-based authentication
- Passwords hashed with bcryptjs
- Role-based access control (Admin, Doctor, Staff)
- Protected API routes with middleware
- Token stored in localStorage (frontend)

## 📊 Database Schema

### users
- id, name, email, password, role, avatar_url, timestamps

### doctors
- id, name, email, phone, specialization, experience, schedule, avatar, timestamps

### patients
- id, name, email, phone, dob, gender, address, history, timestamps

### appointments
- id, doctor_id, patient_id, date, time, status, notes, timestamps

### invoices
- id, patient_id, amount, status, date, due_date, notes, timestamps

### activity_logs
- id, user_id, action, description, timestamp

## 🛠️ Development

### Running Tests
```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
npm run build
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build
npm run start

# Backend
cd backend
npm run build
npm run start
```

## 📦 Deployment

### Vercel (Frontend)
1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Render/Railway (Backend)
1. Push to GitHub
2. Create service in deployment platform
3. Set environment variables
4. Deploy

### AWS RDS (Database)
1. Create RDS MySQL instance
2. Update DATABASE_URL
3. Run Prisma migrations

## 🐛 Troubleshooting

### MySQL Connection Error
```bash
# Check MySQL is running
mysql -u root -p
# Verify DATABASE_URL in .env
```

### API Connection Failed
- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in frontend .env.local
- Verify no CORS issues

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

## 📝 Demo Credentials

- **Email**: admin@medixpro.com
- **Password**: password123
- **Role**: Admin

## 🤝 Contributing

This is a full-stack project. Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TailwindCSS](https://tailwindcss.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## 📧 Support

For questions or issues, please contact the development team or create an issue in the repository.

---

**Made with ❤️ for the healthcare industry**

*Version 1.0.0 - 2025*
