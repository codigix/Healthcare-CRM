import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app: Express = express();
const prisma = new PrismaClient();

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

app.use('/api/auth', authRoutes);
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
