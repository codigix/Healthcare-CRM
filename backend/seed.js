const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    const dept1 = await prisma.department.create({
      data: {
        name: 'Cardiology',
        head: 'Dr. Sarah Johnson',
        location: 'Building A, Floor 3',
        staffCount: 8,
        services: 12,
        status: 'Active',
        description: 'Heart and cardiovascular diseases treatment'
      }
    });

    const dept2 = await prisma.department.create({
      data: {
        name: 'Neurology',
        head: 'Dr. Michael Chen',
        location: 'Building B, Floor 2',
        staffCount: 6,
        services: 9,
        status: 'Active',
        description: 'Brain and nervous system treatment'
      }
    });

    const dept3 = await prisma.department.create({
      data: {
        name: 'Pediatrics',
        head: 'Dr. Emily Rodriguez',
        location: 'Building A, Floor 1',
        staffCount: 10,
        services: 15,
        status: 'Active',
        description: 'Healthcare for children and adolescents'
      }
    });

    const dept4 = await prisma.department.create({
      data: {
        name: 'Orthopedics',
        head: 'Dr. James Wilson',
        location: 'Building C, Floor 2',
        staffCount: 7,
        services: 11,
        status: 'Active',
        description: 'Bone and joint treatment'
      }
    });

    const dept5 = await prisma.department.create({
      data: {
        name: 'Dermatology',
        head: 'Dr. Lisa Thompson',
        location: 'Building B, Floor 1',
        staffCount: 4,
        services: 8,
        status: 'Active',
        description: 'Skin care and treatment'
      }
    });

    console.log('Departments added successfully!');

    const ambulance1 = await prisma.ambulance.create({
      data: {
        name: 'Ambulance 1',
        registrationNumber: 'AMB-001',
        driverName: 'John Smith',
        driverPhone: '9876543210',
        status: 'available',
        location: 'Main Hospital'
      }
    });

    const ambulance2 = await prisma.ambulance.create({
      data: {
        name: 'Ambulance 2',
        registrationNumber: 'AMB-002',
        driverName: 'Jane Doe',
        driverPhone: '9876543211',
        status: 'available',
        location: 'East Wing'
      }
    });

    await prisma.emergencyCall.create({
      data: {
        patientName: 'Ram Kumar',
        phone: '9876543212',
        location: 'Sector 5, Pune',
        emergencyType: 'Cardiac Arrest',
        priority: 'High',
        status: 'Pending',
        notes: 'Patient is unconscious'
      }
    });

    await prisma.emergencyCall.create({
      data: {
        patientName: 'Priya Singh',
        phone: '9876543213',
        location: 'Market Street',
        emergencyType: 'Traffic Accident',
        priority: 'High',
        status: 'Dispatched',
        ambulanceId: ambulance1.id,
        notes: 'Multi-vehicle collision'
      }
    });

    console.log('Test data added successfully!');
  } catch (error) {
    console.error('Error adding test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
