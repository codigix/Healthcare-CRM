const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedBloodBank() {
  try {
    console.log('🔄 Seeding blood bank data...');

    const donors = await prisma.bloodDonor.createMany({
      data: [
        {
          name: 'John Smith',
          bloodType: 'O+',
          contact: '+1 (555) 123-4567',
          email: 'john.smith@example.com',
          lastDonation: new Date('2024-03-15'),
          nextEligible: new Date('2024-07-15'),
          totalDonations: 8,
          status: 'Eligible',
          gender: 'Male',
          dateOfBirth: new Date('1985-05-20'),
          address: '123 Main St',
          city: 'New York',
          phoneNumber: '+1 (555) 123-4567'
        },
        {
          name: 'Sarah Johnson',
          bloodType: 'A-',
          contact: '+1 (555) 987-6543',
          email: 'sarah.johnson@example.com',
          lastDonation: new Date('2024-05-22'),
          nextEligible: new Date('2024-09-22'),
          totalDonations: 3,
          status: 'Ineligible',
          gender: 'Female',
          dateOfBirth: new Date('1990-12-10'),
          address: '456 Oak Ave',
          city: 'Los Angeles',
          phoneNumber: '+1 (555) 987-6543'
        },
        {
          name: 'Michael Chen',
          bloodType: 'B+',
          contact: '+1 (555) 456-7890',
          email: 'michael.chen@example.com',
          lastDonation: new Date('2024-01-10'),
          nextEligible: new Date('2024-05-10'),
          totalDonations: 12,
          status: 'Eligible',
          gender: 'Male',
          dateOfBirth: new Date('1988-08-15'),
          address: '789 Pine St',
          city: 'Chicago',
          phoneNumber: '+1 (555) 456-7890'
        },
        {
          name: 'Emily Rodriguez',
          bloodType: 'AB+',
          contact: '+1 (555) 234-5678',
          email: 'emily.r@example.com',
          totalDonations: 0,
          status: 'New Donor',
          gender: 'Female',
          dateOfBirth: new Date('1995-03-22'),
          address: '321 Elm St',
          city: 'Houston',
          phoneNumber: '+1 (555) 234-5678'
        }
      ]
    });

    console.log(`✅ Created ${donors.count} blood donors`);

    const bloodUnits = await prisma.bloodUnit.createMany({
      data: [
        {
          unitId: 'BU-2025-00001',
          bloodType: 'A+',
          donorId: donors[0] ? null : null,
          quantity: 3,
          screeningComplete: true,
          processingComplete: true,
          collectionDate: new Date('2024-11-10'),
          expiryDate: new Date('2024-12-22'),
          sourceType: 'Voluntary Donation',
          collectionLocation: 'Main Blood Bank',
          status: 'Available',
          notes: 'Standard whole blood donation'
        },
        {
          unitId: 'BU-2025-00002',
          bloodType: 'A-',
          quantity: 1,
          screeningComplete: true,
          processingComplete: true,
          collectionDate: new Date('2024-11-12'),
          expiryDate: new Date('2024-12-24'),
          sourceType: 'Voluntary Donation',
          collectionLocation: 'Main Blood Bank',
          status: 'Available',
          notes: null
        },
        {
          unitId: 'BU-2025-00003',
          bloodType: 'B+',
          quantity: 4,
          screeningComplete: true,
          processingComplete: true,
          collectionDate: new Date('2024-11-08'),
          expiryDate: new Date('2024-12-20'),
          sourceType: 'Voluntary Donation',
          collectionLocation: 'Mobile Unit',
          status: 'Available',
          notes: null
        },
        {
          unitId: 'BU-2025-00004',
          bloodType: 'B-',
          quantity: 2,
          screeningComplete: true,
          processingComplete: false,
          collectionDate: new Date('2024-11-14'),
          expiryDate: new Date('2024-12-26'),
          sourceType: 'Replacement Donation',
          collectionLocation: 'Hospital Unit',
          status: 'Available',
          notes: 'Pending processing'
        },
        {
          unitId: 'BU-2025-00005',
          bloodType: 'AB+',
          quantity: 2,
          screeningComplete: true,
          processingComplete: true,
          collectionDate: new Date('2024-11-11'),
          expiryDate: new Date('2024-12-23'),
          sourceType: 'Voluntary Donation',
          collectionLocation: 'Main Blood Bank',
          status: 'Available',
          notes: null
        },
        {
          unitId: 'BU-2025-00006',
          bloodType: 'AB-',
          quantity: 1,
          screeningComplete: true,
          processingComplete: true,
          collectionDate: new Date('2024-11-13'),
          expiryDate: new Date('2024-12-25'),
          sourceType: 'Voluntary Donation',
          collectionLocation: 'Main Blood Bank',
          status: 'Available',
          notes: 'Rare blood type'
        },
        {
          unitId: 'BU-2025-00007',
          bloodType: 'O+',
          quantity: 5,
          screeningComplete: true,
          processingComplete: true,
          collectionDate: new Date('2024-11-09'),
          expiryDate: new Date('2024-12-21'),
          sourceType: 'Voluntary Donation',
          collectionLocation: 'Community Drive',
          status: 'Available',
          notes: 'Most needed blood type'
        },
        {
          unitId: 'BU-2025-00008',
          bloodType: 'O-',
          quantity: 2,
          screeningComplete: true,
          processingComplete: true,
          collectionDate: new Date('2024-11-15'),
          expiryDate: new Date('2024-12-27'),
          sourceType: 'Voluntary Donation',
          collectionLocation: 'Main Blood Bank',
          status: 'Available',
          notes: 'Universal donor'
        }
      ]
    });

    console.log(`✅ Created ${bloodUnits.count} blood units`);

    const bloodIssues = await prisma.bloodIssue.createMany({
      data: [
        {
          issueId: 'ISS-2025-00001',
          recipient: 'John Smith',
          recipientId: 'P-00145',
          bloodType: 'O+',
          units: 2,
          issueDate: new Date('2024-11-16 09:30:00'),
          requestingDoctor: 'Dr. Sarah Johnson',
          purpose: 'Surgery - Appendectomy',
          department: 'Surgery',
          status: 'Approved',
          notes: 'Pre-operative transfusion'
        },
        {
          issueId: 'ISS-2025-00002',
          recipient: 'Emily Davis',
          recipientId: 'P-00289',
          bloodType: 'A-',
          units: 1,
          issueDate: new Date('2024-11-15 14:15:00'),
          requestingDoctor: 'Dr. Michael Chen',
          purpose: 'Emergency - Trauma',
          department: 'Emergency',
          status: 'Completed',
          notes: 'Accident victim'
        },
        {
          issueId: 'ISS-2025-00003',
          recipient: 'Robert Wilson',
          recipientId: 'P-00312',
          bloodType: 'B+',
          units: 3,
          issueDate: new Date('2024-11-14 11:00:00'),
          requestingDoctor: 'Dr. Lisa Anderson',
          purpose: 'Surgery - Cardiac',
          department: 'Cardiology',
          status: 'Completed',
          notes: 'Open heart surgery'
        }
      ]
    });

    console.log(`✅ Created ${bloodIssues.count} blood issue records`);

    console.log('✅ Blood bank seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding blood bank data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedBloodBank();
