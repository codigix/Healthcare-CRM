const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
  try {
    console.log('Clearing all tables...');
    await prisma.roomAllotment.deleteMany({});
    await prisma.room.deleteMany({});
    await prisma.attendance.deleteMany({});
    await prisma.leaveRequest.deleteMany({});
    await prisma.staff.deleteMany({});
    await prisma.role.deleteMany({});
    await prisma.service.deleteMany({});
    await prisma.emergencyCall.deleteMany({});
    await prisma.ambulance.deleteMany({});
    await prisma.insuranceClaim.deleteMany({});
    await prisma.invoice.deleteMany({});
    await prisma.prescriptionTemplate.deleteMany({});
    await prisma.prescription.deleteMany({});
    await prisma.appointment.deleteMany({});
    await prisma.patient.deleteMany({});
    await prisma.doctor.deleteMany({});
    await prisma.specialization.deleteMany({});
    await prisma.department.deleteMany({});
    await prisma.activityLog.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.medicine.deleteMany({});
    console.log('✓ All data cleared successfully');
    await prisma.$disconnect();
  } catch (e) {
    console.error('Error:', e.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

cleanup();
