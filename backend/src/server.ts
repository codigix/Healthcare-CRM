import dotenv from 'dotenv';
dotenv.config();

// Prisma reads DATABASE_URL, while the mysql2 pool uses DB_*. Derive the former
// from the latter so both always point at the same database (an explicit
// DATABASE_URL in .env still wins).
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
if (!process.env.DATABASE_URL && DB_USER && DB_HOST && DB_PORT && DB_NAME) {
  process.env.DATABASE_URL = `mysql://${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASSWORD ?? '')}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import pool, { releaseConnectionsAfterRequest, pingDatabase } from './db';
import prisma from './prisma';


const app: Express = express();

app.use(cors({
  origin: process.env.ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Hand back any database connection a handler forgot to release (see db.ts).
app.use(releaseConnectionsAfterRequest);

import authRoutes from './routes/auth';
import doctorRoutes from './routes/doctors';
import patientRoutes from './routes/patients';
import appointmentRoutes from './routes/appointments';
import invoiceRoutes from './routes/invoices';
import dashboardRoutes from './routes/dashboard';
import dashboardReceptionRoutes from './routes/dashboard-reception';
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
import bedStatusRoutes from './routes/bed-status';
import transferRoutes from './routes/transfers';
import medicineRoutes from './routes/medicines';
import inventoryRoutes from './routes/inventory';
import bloodBankRoutes from './routes/blood-bank';
import inventoryAlertsRoutes from './routes/inventory-alerts';
import suppliersRoutes from './routes/suppliers';
import recordsRoutes from './routes/records';
import reportsRoutes from './routes/reports';
import reviewsRoutes from './routes/reviews';
import feedbackRoutes from './routes/feedback';
import servicesRoutes from './routes/services';
import notificationRoutes from './routes/notifications';
import whatsappRoutes from './routes/whatsapp';
import refillRoutes from './routes/refills';
import consentRoutes from './routes/consents';
import patientDocumentRoutes from './routes/patient-documents';

console.log('Registering routes...');
app.use('/api/auth', authRoutes);
console.log('✓ Auth routes registered');
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/dashboard/reception', dashboardReceptionRoutes);
app.use('/api/insurance-claims', insuranceClaimsRoutes);
app.use('/api/specializations', specializationRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/prescription-templates', prescriptionTemplateRoutes);
app.use('/api/ambulances', ambulanceRoutes);
app.use('/api/emergency-calls', emergencyCallsRoutes);
app.use('/api/departments/services', servicesRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/room-allotment', roomAllotmentRoutes);
app.use('/api/bed-status', bedStatusRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/blood-bank', bloodBankRoutes);
app.use('/api/inventory-alerts', inventoryAlertsRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/pharmacy/refills', refillRoutes);
app.use('/api/consents', consentRoutes);
app.use('/api/patient-documents', patientDocumentRoutes);
console.log('✓ All routes registered');

// Reports DB reachability too, so monitors/deploys detect a dead database
// instead of a "running" server whose every API call fails.
app.get('/api/health', async (_req, res) => {
  const database = await pingDatabase();
  res.status(database ? 200 : 503).json({
    status: database ? 'Server is running' : 'Database unreachable',
    database: database ? 'up' : 'down',
    uptimeSeconds: Math.round(process.uptime()),
  });
});

// Unknown API paths: answer immediately with JSON instead of Express's HTML page.
app.use('/api', (req, res) => {
  res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` });
});

// Central error handler: malformed JSON, oversized bodies and any error passed
// to next() get a JSON response instead of an HTML stack trace.
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  const status = Number(err?.status || err?.statusCode) || 500;
  if (status >= 500) console.error(`[${req.method} ${req.originalUrl}]`, err);
  if (res.headersSent) return;
  res.status(status).json({
    error: status === 400 && err?.type === 'entity.parse.failed'
      ? 'Invalid JSON in request body'
      : status === 413 ? 'Request body too large' : status >= 500 ? 'Internal server error' : err?.message || 'Request failed',
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Drop sockets from clients that stall mid-request instead of holding them open.
server.requestTimeout = 120_000;
server.headersTimeout = 65_000;
server.keepAliveTimeout = 61_000;

// One bad promise or callback must not take the whole API down for every user.
process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason);
});
process.on('uncaughtException', (error) => {
  console.error('[uncaughtException]', error);
});

let shuttingDown = false;
const shutdown = async (signal: string) => {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} received, shutting down...`);
  // Finish in-flight requests, then close the database pools.
  const forceExit = setTimeout(() => process.exit(1), 10_000);
  forceExit.unref();
  server.close(async () => {
    try {
      await Promise.allSettled([pool.end(), prisma.$disconnect()]);
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
    process.exit(0);
  });
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
