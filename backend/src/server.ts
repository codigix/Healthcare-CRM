import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import cors from 'cors';
import pool from './db';

console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRoutes from './routes/auth';
import doctorRoutes from './routes/doctors';
import patientRoutes from './routes/patients';
import appointmentRoutes from './routes/appointments';
import invoiceRoutes from './routes/invoices';
import dashboardRoutes from './routes/dashboard';
import insuranceClaimsRoutes from './routes/insurance-claims';
import specializationRoutes from './routes/specializations';
import prescriptionRoutes from './routes/prescriptions';
import prescriptionTemplateRoutes from './routes/prescription-templates';
import ambulanceRoutes from './routes/ambulances';
import emergencyCallsRoutes from './routes/emergency-calls';
import departmentRoutes from './routes/departments';
import staffRoutes from './routes/staff';
import attendanceRoutes from './routes/attendance';
import roomAllotmentRoutes from './routes/room-allotment';
import medicineRoutes from './routes/medicines';
import bloodBankRoutes from './routes/blood-bank';
import inventoryAlertsRoutes from './routes/inventory-alerts';
import suppliersRoutes from './routes/suppliers';
import recordsRoutes from './routes/records';
import reportsRoutes from './routes/reports';
import reviewsRoutes from './routes/reviews';
import feedbackRoutes from './routes/feedback';

console.log('Registering routes...');
app.use('/api/auth', authRoutes);
console.log('✓ Auth routes registered');
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/insurance-claims', insuranceClaimsRoutes);
app.use('/api/specializations', specializationRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/prescription-templates', prescriptionTemplateRoutes);
app.use('/api/ambulances', ambulanceRoutes);
app.use('/api/emergency-calls', emergencyCallsRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/room-allotment', roomAllotmentRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/blood-bank', bloodBankRoutes);
app.use('/api/inventory-alerts', inventoryAlertsRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/feedback', feedbackRoutes);
console.log('✓ All routes registered');

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT ;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGTERM', async () => {
  try {
    await pool.end();
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
  process.exit(0);
});
