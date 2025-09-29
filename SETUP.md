# Healthcare CRM - Complete Setup Guide

## 🏥 AI-Powered Healthcare Management System

A comprehensive healthcare management system for multispecialty hospitals with AI-powered reporting and workflow assistance, built with React, Node.js, MySQL, and Tailwind CSS.

## ✨ Features

### Core Features
- 🏥 **Multispecialty Hospital Management**
- 👥 **Patient Management System**
- 👨‍⚕️ **Doctor & Staff Management**
- 📅 **Appointment Scheduling**
- 🤖 **AI-Powered Reports & Analytics**
- 🔐 **Role-based Authentication**
- 📊 **Real-time Dashboard**
- 💊 **Medical Records Management**
- 🏥 **Department Management**

### AI Features
- 🤖 **AI Assistant** for workflow assistance
- 📈 **Automated Report Generation**
- 🔍 **Intelligent Analytics**
- 💡 **Smart Insights**
- 📊 **Predictive Analytics**

## 🛠️ Tech Stack

- **Frontend**: React JSX, Tailwind CSS, Redux Toolkit
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **AI Integration**: OpenAI API
- **Authentication**: JWT tokens
- **Charts**: Chart.js with React integration

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- OpenAI API key (for AI features)

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install all project dependencies
npm run install-all
```

### 2. Database Setup

```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE healthcare_crm;

# Setup database tables and initial data
cd server
node setup-database.js
```

### 3. Environment Configuration

#### Server Environment (server/.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=healthcare_crm
JWT_SECRET=your_super_secret_jwt_key_here
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
NODE_ENV=development
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

#### Client Environment (client/.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run server  # Backend only
npm run client  # Frontend only
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Default Login**: admin@hospital.com / admin123

## 📁 Project Structure

```
healthcare-crm/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── slices/         # Redux slices
│   │   ├── services/       # API services
│   │   └── store/          # Redux store
│   └── public/
├── server/                 # Node.js backend
│   ├── config/            # Database config
│   ├── middleware/         # Auth middleware
│   ├── routes/            # API routes
│   └── index.js           # Server entry point
├── database/              # Database schemas
└── docs/                  # Documentation
```

## 🔐 Authentication & Roles

### User Roles
- **Admin**: Full system access
- **Doctor**: Patient care, appointments, medical records
- **Nurse**: Patient care, basic records
- **Receptionist**: Patient registration, appointment scheduling

### Default Credentials
- **Email**: admin@hospital.com
- **Password**: admin123

## 🤖 AI Features

### AI Report Generation
- Patient summaries
- Department analytics
- Financial reports
- Operational insights
- Custom reports

### AI Assistant
- Workflow assistance
- Medical insights
- Appointment optimization
- Resource recommendations

## 📊 Dashboard Features

### Main Dashboard
- Real-time statistics
- Quick actions
- Recent activities
- Department overview
- AI insights

### Analytics
- Patient trends
- Appointment efficiency
- Resource utilization
- Performance metrics

## 🏥 Hospital Management

### Patient Management
- Patient registration
- Medical history
- Appointment tracking
- Insurance management
- Emergency contacts

### Doctor Management
- Doctor profiles
- Specializations
- Schedules
- Performance tracking
- Department assignments

### Appointment System
- Scheduling
- Calendar view
- Status tracking
- Conflict detection
- Reminders

### Department Management
- Department setup
- Staff assignment
- Resource allocation
- Performance metrics

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start both servers
npm run server       # Backend only
npm run client       # Frontend only

# Production
npm run build        # Build frontend
npm start            # Start production server

# Database
npm run setup-db     # Setup database
```

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

#### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Create patient
- `GET /api/patients/:id` - Get patient details
- `PUT /api/patients/:id` - Update patient

#### Doctors
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Create doctor
- `GET /api/doctors/:id` - Get doctor details

#### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment

#### AI & Reports
- `POST /api/ai/generate-report` - Generate AI report
- `POST /api/ai/chat` - AI assistant chat
- `GET /api/ai/reports` - Get AI reports

## 🚀 Deployment

### Production Build

```bash
# Build frontend
cd client
npm run build

# Start production server
cd ../server
npm start
```

### Environment Variables
Ensure all environment variables are properly configured for production.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

## 🔮 Future Enhancements

- Mobile app integration
- Advanced AI features
- Telemedicine support
- Integration with medical devices
- Advanced analytics
- Multi-language support
- Advanced security features

---

**Built with ❤️ for healthcare professionals**
