const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const departmentRoutes = require('./routes/departments');
const reportRoutes = require('./routes/reports');
const aiRoutes = require('./routes/ai');
const userRoutes = require('./routes/users');
const { initializeDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 1000 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    message: 'Healthcare CRM API is running successfully!'
  });
});

// API Documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'Healthcare CRM API',
    version: '1.0.0',
    description: 'Complete healthcare management system API',
    endpoints: {
      auth: {
        'POST /api/auth/login': 'User login',
        'POST /api/auth/register': 'User registration',
        'GET /api/auth/profile': 'Get user profile',
        'PUT /api/auth/profile': 'Update user profile',
        'PUT /api/auth/change-password': 'Change password'
      },
      users: {
        'GET /api/users': 'Get all users (Admin only)',
        'GET /api/users/:id': 'Get user by ID',
        'POST /api/users': 'Create new user',
        'PUT /api/users/:id': 'Update user',
        'DELETE /api/users/:id': 'Delete user',
        'PUT /api/users/:id/reset-password': 'Reset user password'
      },
      patients: {
        'GET /api/patients': 'Get all patients',
        'GET /api/patients/:id': 'Get patient by ID',
        'POST /api/patients': 'Create new patient',
        'PUT /api/patients/:id': 'Update patient',
        'DELETE /api/patients/:id': 'Delete patient',
        'GET /api/patients/stats/overview': 'Get patient statistics'
      },
      doctors: {
        'GET /api/doctors': 'Get all doctors',
        'GET /api/doctors/:id': 'Get doctor by ID',
        'POST /api/doctors': 'Create doctor profile',
        'PUT /api/doctors/:id': 'Update doctor profile',
        'GET /api/doctors/stats/overview': 'Get doctor statistics'
      },
      appointments: {
        'GET /api/appointments': 'Get all appointments',
        'GET /api/appointments/:id': 'Get appointment by ID',
        'POST /api/appointments': 'Create appointment',
        'PUT /api/appointments/:id': 'Update appointment',
        'DELETE /api/appointments/:id': 'Delete appointment',
        'GET /api/appointments/stats/overview': 'Get appointment statistics'
      },
      departments: {
        'GET /api/departments': 'Get all departments',
        'GET /api/departments/:id': 'Get department by ID',
        'POST /api/departments': 'Create department',
        'PUT /api/departments/:id': 'Update department',
        'DELETE /api/departments/:id': 'Delete department'
      },
      reports: {
        'GET /api/reports': 'Get all reports',
        'GET /api/reports/:id': 'Get report by ID',
        'DELETE /api/reports/:id': 'Delete report'
      },
      ai: {
        'POST /api/ai/generate-report': 'Generate AI report',
        'GET /api/ai/reports': 'Get AI reports',
        'GET /api/ai/reports/:id': 'Get AI report by ID',
        'POST /api/ai/chat': 'AI assistant chat'
      }
    },
    authentication: 'JWT Bearer token required for protected routes',
    baseURL: `http://localhost:${PORT}/api`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    availableRoutes: '/api/docs'
  });
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Healthcare CRM Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 API URL: http://localhost:${PORT}/api`);
    console.log(`📋 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
    console.log(`🔑 Default Login: admin@hospital.com / admin123`);
  });
}).catch((error) => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});