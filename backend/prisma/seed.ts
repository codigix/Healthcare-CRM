import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.user.deleteMany({});
    await prisma.appointment.deleteMany({});
    await prisma.insuranceClaim.deleteMany({});
    await prisma.invoice.deleteMany({});
    await prisma.doctor.deleteMany({});
    await prisma.patient.deleteMany({});
    await prisma.activityLog.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@medixpro.com',
        password: hashedPassword,
        role: 'admin',
      },
    });

    const doctors = await prisma.doctor.createMany({
      data: [
        {
          name: 'Dr. John Smith',
          email: 'john.smith@medixpro.com',
          phone: '555-0101',
          specialization: 'Cardiology',
          experience: 12,
        },
        {
          name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@medixpro.com',
          phone: '555-0102',
          specialization: 'Dermatology',
          experience: 8,
        },
        {
          name: 'Dr. Michael Brown',
          email: 'michael.brown@medixpro.com',
          phone: '555-0103',
          specialization: 'Neurology',
          experience: 15,
        },
      ],
    });

    const patients = await prisma.patient.createMany({
      data: [
        {
          name: 'John Smith',
          email: 'john@patient.com',
          phone: '555-1001',
          dob: new Date('1985-05-15'),
          gender: 'Male',
          address: '123 Main St, New York, NY',
        },
        {
          name: 'Emily Davis',
          email: 'emily@patient.com',
          phone: '555-1002',
          dob: new Date('1990-08-22'),
          gender: 'Female',
          address: '456 Oak Ave, Los Angeles, CA',
        },
        {
          name: 'Robert Wilson',
          email: 'robert@patient.com',
          phone: '555-1003',
          dob: new Date('1980-03-10'),
          gender: 'Male',
          address: '789 Pine Rd, Chicago, IL',
        },
        {
          name: 'Jessica Brown',
          email: 'jessica@patient.com',
          phone: '555-1004',
          dob: new Date('1995-11-30'),
          gender: 'Female',
          address: '321 Elm St, Houston, TX',
        },
        {
          name: 'Sarah Thompson',
          email: 'sarah@patient.com',
          phone: '555-1005',
          dob: new Date('1988-07-18'),
          gender: 'Female',
          address: '654 Maple Dr, Phoenix, AZ',
        },
        {
          name: 'David Miller',
          email: 'david@patient.com',
          phone: '555-1006',
          dob: new Date('1992-02-14'),
          gender: 'Male',
          address: '987 Cedar Ln, Philadelphia, PA',
        },
      ],
    });

    const allPatients = await prisma.patient.findMany();
    const allDoctors = await prisma.doctor.findMany();

    await prisma.insuranceClaim.createMany({
      data: [
        {
          patientId: allPatients[0].id,
          provider: 'Blue Cross Blue Shield',
          policyNumber: 'POL-12345',
          type: 'Medical',
          amount: 1234.50,
          status: 'Approved',
          submittedDate: new Date('2024-04-15'),
        },
        {
          patientId: allPatients[1].id,
          provider: 'Aetna',
          policyNumber: 'POL-67890',
          type: 'Medical',
          amount: 2345.00,
          status: 'Pending',
          submittedDate: new Date('2024-04-10'),
        },
        {
          patientId: allPatients[2].id,
          provider: 'UnitedHealthcare',
          policyNumber: 'POL-11223',
          type: 'Medical',
          amount: 1456.00,
          status: 'Approved',
          submittedDate: new Date('2024-04-05'),
        },
        {
          patientId: allPatients[3].id,
          provider: 'Cigna',
          policyNumber: 'POL-44556',
          type: 'Dental',
          amount: 3456.00,
          status: 'Rejected',
          submittedDate: new Date('2024-04-02'),
        },
        {
          patientId: allPatients[4].id,
          provider: 'Humana',
          policyNumber: 'POL-77889',
          type: 'Medical',
          amount: 1789.00,
          status: 'Pending',
          submittedDate: new Date('2024-04-01'),
        },
        {
          patientId: allPatients[5].id,
          provider: 'Medicare',
          policyNumber: 'POL-99001',
          type: 'Medical',
          amount: 2890.00,
          status: 'Draft',
        },
      ],
    });

    await prisma.invoice.createMany({
      data: [
        {
          patientId: allPatients[0].id,
          amount: 500.00,
          status: 'paid',
          dueDate: new Date('2024-05-15'),
        },
        {
          patientId: allPatients[1].id,
          amount: 750.00,
          status: 'pending',
          dueDate: new Date('2024-05-20'),
        },
        {
          patientId: allPatients[2].id,
          amount: 1200.00,
          status: 'paid',
          dueDate: new Date('2024-05-10'),
        },
      ],
    });

    console.log('Database seeded successfully');
    console.log({
      users: 1,
      doctors: 3,
      patients: 6,
      insuranceClaims: 6,
      invoices: 3,
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
