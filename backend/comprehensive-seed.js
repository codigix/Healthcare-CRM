const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('🌱 Starting comprehensive database seed...\n');

    // Clear existing data (optional - comment out to keep data)
    console.log('🗑️  Clearing existing data...');
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
    await prisma.medicine.deleteMany({});
    await prisma.patient.deleteMany({});
    await prisma.doctor.deleteMany({});
    await prisma.specialization.deleteMany({});
    await prisma.department.deleteMany({});
    await prisma.activityLog.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✓ Data cleared\n');

    // 1. CREATE USERS
    console.log('👤 Creating users...');
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@medixpro.com',
        password: await bcrypt.hash('password123', 10),
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
      }
    });

    const doctorUser = await prisma.user.create({
      data: {
        name: 'Doctor User',
        email: 'doctor@medixpro.com',
        password: await bcrypt.hash('password123', 10),
        role: 'doctor',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor'
      }
    });
    console.log('✓ Users created\n');

    // 2. CREATE DEPARTMENTS
    console.log('🏥 Creating departments...');
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
    console.log('✓ Departments created\n');

    // 3. CREATE SPECIALIZATIONS
    console.log('🎓 Creating specializations...');
    const spec1 = await prisma.specialization.create({
      data: {
        name: 'Cardiology Specialist',
        description: 'Specializes in heart diseases',
        department: dept1.name,
        doctorCount: 5,
        status: 'active'
      }
    });

    const spec2 = await prisma.specialization.create({
      data: {
        name: 'Neurologist',
        description: 'Specializes in brain and nervous system',
        department: dept2.name,
        doctorCount: 3,
        status: 'active'
      }
    });

    const spec3 = await prisma.specialization.create({
      data: {
        name: 'Pediatrician',
        description: 'Specializes in child healthcare',
        department: dept3.name,
        doctorCount: 6,
        status: 'active'
      }
    });

    const spec4 = await prisma.specialization.create({
      data: {
        name: 'Orthopedic Surgeon',
        description: 'Specializes in bone and joint surgery',
        department: dept4.name,
        doctorCount: 4,
        status: 'active'
      }
    });
    console.log('✓ Specializations created\n');

    // 4. CREATE DOCTORS
    console.log('👨‍⚕️ Creating doctors...');
    const doc1 = await prisma.doctor.create({
      data: {
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar@medixpro.com',
        phone: '9876543210',
        specialization: spec1.name,
        experience: 15,
        schedule: 'Monday to Friday, 9AM-5PM',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh'
      }
    });

    const doc2 = await prisma.doctor.create({
      data: {
        name: 'Dr. Priya Sharma',
        email: 'priya.sharma@medixpro.com',
        phone: '9876543211',
        specialization: spec2.name,
        experience: 12,
        schedule: 'Tuesday to Saturday, 10AM-6PM',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya'
      }
    });

    const doc3 = await prisma.doctor.create({
      data: {
        name: 'Dr. Amit Patel',
        email: 'amit.patel@medixpro.com',
        phone: '9876543212',
        specialization: spec3.name,
        experience: 8,
        schedule: 'Monday to Thursday, 8AM-4PM',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit'
      }
    });

    const doc4 = await prisma.doctor.create({
      data: {
        name: 'Dr. Neha Gupta',
        email: 'neha.gupta@medixpro.com',
        phone: '9876543213',
        specialization: spec4.name,
        experience: 10,
        schedule: 'Monday to Friday, 11AM-7PM',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neha'
      }
    });
    console.log('✓ Doctors created\n');

    // 5. CREATE PATIENTS
    console.log('🧑‍🦰 Creating patients...');
    const patient1 = await prisma.patient.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '9876543220',
        dob: new Date('1985-05-15'),
        gender: 'Male',
        address: '123 Main Street, Pune',
        history: 'No major medical history'
      }
    });

    const patient2 = await prisma.patient.create({
      data: {
        name: 'Maria Garcia',
        email: 'maria.garcia@email.com',
        phone: '9876543221',
        dob: new Date('1990-08-22'),
        gender: 'Female',
        address: '456 Oak Avenue, Mumbai',
        history: 'Diabetes Type 2'
      }
    });

    const patient3 = await prisma.patient.create({
      data: {
        name: 'Ravi Singh',
        email: 'ravi.singh@email.com',
        phone: '9876543222',
        dob: new Date('1988-03-10'),
        gender: 'Male',
        address: '789 Pine Road, Delhi',
        history: 'Hypertension'
      }
    });

    const patient4 = await prisma.patient.create({
      data: {
        name: 'Ananya Kapoor',
        email: 'ananya.kapoor@email.com',
        phone: '9876543223',
        dob: new Date('1995-12-05'),
        gender: 'Female',
        address: '321 Maple Drive, Bangalore',
        history: 'No medical conditions'
      }
    });

    const patient5 = await prisma.patient.create({
      data: {
        name: 'Vikram Desai',
        email: 'vikram.desai@email.com',
        phone: '9876543224',
        dob: new Date('1980-07-18'),
        gender: 'Male',
        address: '654 Cedar Lane, Hyderabad',
        history: 'Heart condition, under monitoring'
      }
    });
    console.log('✓ Patients created\n');

    // 6. CREATE APPOINTMENTS
    console.log('📅 Creating appointments...');
    const appt1 = await prisma.appointment.create({
      data: {
        doctorId: doc1.id,
        patientId: patient1.id,
        date: new Date('2025-11-20T10:00:00'),
        time: '10:00 AM',
        status: 'scheduled',
        notes: 'Regular checkup'
      }
    });

    const appt2 = await prisma.appointment.create({
      data: {
        doctorId: doc2.id,
        patientId: patient2.id,
        date: new Date('2025-11-21T02:00:00'),
        time: '2:00 PM',
        status: 'completed',
        notes: 'Follow-up consultation'
      }
    });

    const appt3 = await prisma.appointment.create({
      data: {
        doctorId: doc3.id,
        patientId: patient3.id,
        date: new Date('2025-11-22T03:30:00'),
        time: '3:30 PM',
        status: 'scheduled',
        notes: 'Blood pressure check'
      }
    });

    const appt4 = await prisma.appointment.create({
      data: {
        doctorId: doc4.id,
        patientId: patient4.id,
        date: new Date('2025-11-23T11:00:00'),
        time: '11:00 AM',
        status: 'pending',
        notes: 'Orthopedic consultation'
      }
    });
    console.log('✓ Appointments created\n');

    // 7. CREATE MEDICINES
    console.log('💊 Creating medicines...');
    const med1 = await prisma.medicine.create({
      data: {
        name: 'Aspirin 500mg',
        genericName: 'Acetylsalicylic Acid',
        category: 'Analgesics',
        medicineType: 'OTC',
        description: 'Pain reliever and fever reducer',
        medicineForm: 'tablet',
        manufacturer: 'PharmaCo Ltd',
        supplier: 'MediSupply Inc',
        manufacturingDate: new Date('2024-01-15'),
        expiryDate: new Date('2026-01-15'),
        batchNumber: 'ASPI-2024-001',
        dosage: '500mg',
        sideEffects: 'Stomach upset, heartburn',
        precautions: 'Avoid if allergic to aspirin',
        initialQuantity: 500,
        reorderLevel: 100,
        maximumLevel: 1000,
        purchasePrice: 2.5,
        sellingPrice: 4.99,
        taxRate: 5,
        roomTemperature: true,
        status: 'Active'
      }
    });

    const med2 = await prisma.medicine.create({
      data: {
        name: 'Amoxicillin 500mg',
        genericName: 'Amoxicillin',
        category: 'Antibiotics',
        medicineType: 'Prescription',
        description: 'Antibiotic for bacterial infections',
        medicineForm: 'capsule',
        manufacturer: 'PharmaCare Global',
        supplier: 'MediSupply Inc',
        manufacturingDate: new Date('2024-03-20'),
        expiryDate: new Date('2026-03-20'),
        batchNumber: 'AMOX-2024-002',
        dosage: '500mg',
        sideEffects: 'Allergic reaction, diarrhea',
        precautions: 'Avoid if penicillin allergy',
        initialQuantity: 300,
        reorderLevel: 75,
        maximumLevel: 800,
        purchasePrice: 3.75,
        sellingPrice: 7.5,
        taxRate: 5,
        refrigerated: true,
        status: 'Active'
      }
    });

    const med3 = await prisma.medicine.create({
      data: {
        name: 'Metformin 850mg',
        genericName: 'Metformin Hydrochloride',
        category: 'Antidiabetics',
        medicineType: 'Prescription',
        description: 'Diabetes medication',
        medicineForm: 'tablet',
        manufacturer: 'DiabetesCare Ltd',
        supplier: 'MediSupply Inc',
        manufacturingDate: new Date('2024-02-10'),
        expiryDate: new Date('2026-02-10'),
        batchNumber: 'METF-2024-003',
        dosage: '850mg',
        sideEffects: 'Nausea, metallic taste',
        precautions: 'Monitor kidney function',
        initialQuantity: 400,
        reorderLevel: 100,
        maximumLevel: 1200,
        purchasePrice: 1.8,
        sellingPrice: 3.99,
        taxRate: 5,
        roomTemperature: true,
        status: 'Active'
      }
    });

    const med4 = await prisma.medicine.create({
      data: {
        name: 'Lisinopril 10mg',
        genericName: 'Lisinopril',
        category: 'Antihypertensives',
        medicineType: 'Prescription',
        description: 'Blood pressure medication',
        medicineForm: 'tablet',
        manufacturer: 'CardioHealth Inc',
        supplier: 'MediSupply Inc',
        manufacturingDate: new Date('2024-04-05'),
        expiryDate: new Date('2026-04-05'),
        batchNumber: 'LISI-2024-004',
        dosage: '10mg',
        sideEffects: 'Dizziness, dry cough',
        precautions: 'Monitor blood pressure regularly',
        initialQuantity: 250,
        reorderLevel: 50,
        maximumLevel: 600,
        purchasePrice: 2.1,
        sellingPrice: 4.5,
        taxRate: 5,
        roomTemperature: true,
        status: 'Active'
      }
    });

    const med5 = await prisma.medicine.create({
      data: {
        name: 'Cetirizine 10mg',
        genericName: 'Cetirizine Hydrochloride',
        category: 'Antihistamines',
        medicineType: 'OTC',
        description: 'Allergy relief',
        medicineForm: 'tablet',
        manufacturer: 'AllergyRelief Ltd',
        supplier: 'MediSupply Inc',
        manufacturingDate: new Date('2024-05-12'),
        expiryDate: new Date('2026-05-12'),
        batchNumber: 'CETI-2024-005',
        dosage: '10mg',
        sideEffects: 'Drowsiness, dry mouth',
        precautions: 'Avoid driving if drowsy',
        initialQuantity: 600,
        reorderLevel: 150,
        maximumLevel: 1500,
        purchasePrice: 1.5,
        sellingPrice: 3.99,
        taxRate: 5,
        roomTemperature: true,
        status: 'Active'
      }
    });

    const med6 = await prisma.medicine.create({
      data: {
        name: 'Atorvastatin 20mg',
        genericName: 'Atorvastatin Calcium',
        category: 'Statins',
        medicineType: 'Prescription',
        description: 'Cholesterol medication',
        medicineForm: 'tablet',
        manufacturer: 'CholesterolControl Inc',
        supplier: 'MediSupply Inc',
        manufacturingDate: new Date('2024-06-01'),
        expiryDate: new Date('2026-06-01'),
        batchNumber: 'ATOR-2024-006',
        dosage: '20mg',
        sideEffects: 'Muscle pain, liver issues',
        precautions: 'Regular liver function tests',
        initialQuantity: 350,
        reorderLevel: 80,
        maximumLevel: 900,
        purchasePrice: 4.2,
        sellingPrice: 8.99,
        taxRate: 5,
        roomTemperature: true,
        status: 'Active'
      }
    });

    const med7 = await prisma.medicine.create({
      data: {
        name: 'Ibuprofen 400mg',
        genericName: 'Ibuprofen',
        category: 'NSAIDs',
        medicineType: 'OTC',
        description: 'Pain and inflammation relief',
        medicineForm: 'tablet',
        manufacturer: 'PainRelief Ltd',
        supplier: 'MediSupply Inc',
        manufacturingDate: new Date('2024-07-08'),
        expiryDate: new Date('2026-07-08'),
        batchNumber: 'IBUP-2024-007',
        dosage: '400mg',
        sideEffects: 'Stomach upset, heartburn',
        precautions: 'Take with food',
        initialQuantity: 800,
        reorderLevel: 200,
        maximumLevel: 2000,
        purchasePrice: 1.2,
        sellingPrice: 2.99,
        taxRate: 5,
        roomTemperature: true,
        status: 'Active'
      }
    });

    const med8 = await prisma.medicine.create({
      data: {
        name: 'Alprazolam 1mg',
        genericName: 'Alprazolam',
        category: 'Anxiolytics',
        medicineType: 'Controlled',
        description: 'Anti-anxiety medication',
        medicineForm: 'tablet',
        manufacturer: 'AnxietyControl Ltd',
        supplier: 'MediSupply Inc',
        manufacturingDate: new Date('2024-08-15'),
        expiryDate: new Date('2026-08-15'),
        batchNumber: 'ALPR-2024-008',
        dosage: '1mg',
        sideEffects: 'Drowsiness, dependence risk',
        precautions: 'Use with caution, not for long term',
        initialQuantity: 150,
        reorderLevel: 30,
        maximumLevel: 400,
        purchasePrice: 5.5,
        sellingPrice: 11.99,
        taxRate: 5,
        roomTemperature: true,
        status: 'Active'
      }
    });
    console.log('✓ Medicines created\n');

    // 8. CREATE PRESCRIPTIONS
    console.log('📝 Creating prescriptions...');
    const pres1 = await prisma.prescription.create({
      data: {
        patientId: patient1.id,
        doctorId: doc1.id,
        prescriptionDate: new Date('2025-11-15'),
        prescriptionType: 'Standard',
        diagnosis: 'Hypertension',
        notesForPharmacist: 'Take with food',
        status: 'Active',
        medications: 'Lisinopril 10mg - 1 tablet daily'
      }
    });

    const pres2 = await prisma.prescription.create({
      data: {
        patientId: patient2.id,
        doctorId: doc2.id,
        prescriptionDate: new Date('2025-11-14'),
        prescriptionType: 'Standard',
        diagnosis: 'Diabetes Type 2',
        notesForPharmacist: 'Monitor blood sugar levels',
        status: 'Active',
        medications: 'Metformin 850mg - 2 tablets twice daily'
      }
    });

    const pres3 = await prisma.prescription.create({
      data: {
        patientId: patient3.id,
        doctorId: doc3.id,
        prescriptionDate: new Date('2025-11-13'),
        prescriptionType: 'Standard',
        diagnosis: 'Bacterial Infection',
        notesForPharmacist: 'Complete full course',
        status: 'Active',
        medications: 'Amoxicillin 500mg - 1 capsule three times daily'
      }
    });
    console.log('✓ Prescriptions created\n');

    // 9. CREATE INVOICES
    console.log('💰 Creating invoices...');
    const inv1 = await prisma.invoice.create({
      data: {
        patientId: patient1.id,
        amount: 5000.00,
        status: 'pending',
        date: new Date('2025-11-15'),
        dueDate: new Date('2025-12-15'),
        notes: 'Consultation + Lab Tests'
      }
    });

    const inv2 = await prisma.invoice.create({
      data: {
        patientId: patient2.id,
        amount: 3500.00,
        status: 'paid',
        date: new Date('2025-11-10'),
        dueDate: new Date('2025-11-20'),
        notes: 'Diabetes Management Program'
      }
    });

    const inv3 = await prisma.invoice.create({
      data: {
        patientId: patient3.id,
        amount: 2500.00,
        status: 'pending',
        date: new Date('2025-11-12'),
        dueDate: new Date('2025-12-12'),
        notes: 'General Checkup + Blood Tests'
      }
    });
    console.log('✓ Invoices created\n');

    // 10. CREATE INSURANCE CLAIMS
    console.log('📋 Creating insurance claims...');
    const claim1 = await prisma.insuranceClaim.create({
      data: {
        patientId: patient1.id,
        provider: 'HealthCare Insurance Co',
        policyNumber: 'POL-2024-001',
        type: 'Medical',
        amount: 5000.00,
        status: 'Draft',
        notes: 'Consultation and medications'
      }
    });

    const claim2 = await prisma.insuranceClaim.create({
      data: {
        patientId: patient2.id,
        provider: 'Life Insurance Ltd',
        policyNumber: 'POL-2024-002',
        type: 'Medical',
        amount: 3500.00,
        status: 'Submitted',
        submittedDate: new Date('2025-11-14'),
        notes: 'Diabetes treatment cost'
      }
    });
    console.log('✓ Insurance claims created\n');

    // 11. CREATE AMBULANCES & EMERGENCY CALLS
    console.log('🚑 Creating ambulances and emergency calls...');
    const amb1 = await prisma.ambulance.create({
      data: {
        name: 'Ambulance 1',
        registrationNumber: 'AMB-001',
        driverName: 'John Smith',
        driverPhone: '9876543250',
        status: 'available',
        location: 'Main Hospital'
      }
    });

    const amb2 = await prisma.ambulance.create({
      data: {
        name: 'Ambulance 2',
        registrationNumber: 'AMB-002',
        driverName: 'Jane Doe',
        driverPhone: '9876543251',
        status: 'available',
        location: 'East Wing'
      }
    });

    const amb3 = await prisma.ambulance.create({
      data: {
        name: 'Ambulance 3',
        registrationNumber: 'AMB-003',
        driverName: 'Mike Johnson',
        driverPhone: '9876543252',
        status: 'in_use',
        location: 'Sector 5'
      }
    });

    const emerg1 = await prisma.emergencyCall.create({
      data: {
        patientName: 'Ram Kumar',
        phone: '9876543260',
        location: 'Sector 5, Pune',
        emergencyType: 'Cardiac Arrest',
        priority: 'High',
        status: 'Pending',
        notes: 'Patient is unconscious'
      }
    });

    const emerg2 = await prisma.emergencyCall.create({
      data: {
        patientName: 'Priya Singh',
        phone: '9876543261',
        location: 'Market Street',
        emergencyType: 'Traffic Accident',
        priority: 'High',
        status: 'Dispatched',
        ambulanceId: amb1.id,
        notes: 'Multi-vehicle collision'
      }
    });

    const emerg3 = await prisma.emergencyCall.create({
      data: {
        patientName: 'Arjun Reddy',
        phone: '9876543262',
        location: 'Downtown Hospital',
        emergencyType: 'Severe Allergy',
        priority: 'Medium',
        status: 'Completed',
        ambulanceId: amb2.id,
        notes: 'Treated and discharged'
      }
    });
    console.log('✓ Ambulances and emergency calls created\n');

    // 12. CREATE ROLES
    console.log('👥 Creating roles...');
    const role1 = await prisma.role.create({
      data: {
        name: 'Manager',
        category: 'Administration',
        description: 'Hospital Manager',
        status: 'Active'
      }
    });

    const role2 = await prisma.role.create({
      data: {
        name: 'Nurse',
        category: 'Medical',
        description: 'Hospital Nurse',
        status: 'Active'
      }
    });

    const role3 = await prisma.role.create({
      data: {
        name: 'Technician',
        category: 'Support',
        description: 'Lab Technician',
        status: 'Active'
      }
    });

    const role4 = await prisma.role.create({
      data: {
        name: 'Receptionist',
        category: 'Administration',
        description: 'Front Desk Receptionist',
        status: 'Active'
      }
    });
    console.log('✓ Roles created\n');

    // 13. CREATE STAFF
    console.log('👔 Creating staff...');
    const staff1 = await prisma.staff.create({
      data: {
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'rajesh@medixpro.com',
        phone: '9876543300',
        dateOfBirth: new Date('1985-04-10'),
        gender: 'Male',
        address: '123 Hospital Lane',
        city: 'Pune',
        postalCode: '411001',
        country: 'India',
        emergencyContact: 'Priya Kumar',
        emergencyPhone: '9876543301',
        relationship: 'Spouse',
        roleId: role1.id,
        department: dept1.name,
        joinedDate: new Date('2022-01-15'),
        status: 'Active'
      }
    });

    const staff2 = await prisma.staff.create({
      data: {
        firstName: 'Neha',
        lastName: 'Sharma',
        email: 'neha@medixpro.com',
        phone: '9876543302',
        dateOfBirth: new Date('1990-06-20'),
        gender: 'Female',
        address: '456 Main Street',
        city: 'Mumbai',
        postalCode: '400001',
        country: 'India',
        emergencyContact: 'Rohan Sharma',
        emergencyPhone: '9876543303',
        relationship: 'Brother',
        roleId: role2.id,
        department: dept2.name,
        joinedDate: new Date('2023-03-10'),
        status: 'Active'
      }
    });

    const staff3 = await prisma.staff.create({
      data: {
        firstName: 'Amit',
        lastName: 'Patel',
        email: 'amit@medixpro.com',
        phone: '9876543304',
        dateOfBirth: new Date('1988-08-15'),
        gender: 'Male',
        address: '789 Oak Avenue',
        city: 'Delhi',
        postalCode: '110001',
        country: 'India',
        emergencyContact: 'Meera Patel',
        emergencyPhone: '9876543305',
        relationship: 'Sister',
        roleId: role3.id,
        department: dept3.name,
        joinedDate: new Date('2021-09-05'),
        status: 'Active'
      }
    });

    const staff4 = await prisma.staff.create({
      data: {
        firstName: 'Priya',
        lastName: 'Singh',
        email: 'priya@medixpro.com',
        phone: '9876543306',
        dateOfBirth: new Date('1992-02-28'),
        gender: 'Female',
        address: '321 Pine Road',
        city: 'Bangalore',
        postalCode: '560001',
        country: 'India',
        emergencyContact: 'Vikram Singh',
        emergencyPhone: '9876543307',
        relationship: 'Father',
        roleId: role4.id,
        department: dept4.name,
        joinedDate: new Date('2023-07-20'),
        status: 'Active'
      }
    });

    const staff5 = await prisma.staff.create({
      data: {
        firstName: 'Arun',
        lastName: 'Desai',
        email: 'arun@medixpro.com',
        phone: '9876543308',
        dateOfBirth: new Date('1987-11-12'),
        gender: 'Male',
        address: '654 Cedar Lane',
        city: 'Hyderabad',
        postalCode: '500001',
        country: 'India',
        emergencyContact: 'Anjali Desai',
        emergencyPhone: '9876543309',
        relationship: 'Wife',
        roleId: role2.id,
        department: dept5.name,
        joinedDate: new Date('2022-05-15'),
        status: 'Active'
      }
    });
    console.log('✓ Staff created\n');

    // 14. CREATE ATTENDANCE
    console.log('📍 Creating attendance records...');
    const today = new Date();
    await prisma.attendance.create({
      data: {
        staffId: staff1.id,
        checkIn: new Date(today.setHours(9, 0, 0)),
        checkOut: new Date(today.setHours(17, 30, 0)),
        hours: 8.5,
        status: 'Present',
        date: new Date()
      }
    });

    await prisma.attendance.create({
      data: {
        staffId: staff2.id,
        checkIn: new Date(today.setHours(9, 15, 0)),
        checkOut: new Date(today.setHours(18, 0, 0)),
        hours: 8.75,
        status: 'Present',
        date: new Date()
      }
    });

    await prisma.attendance.create({
      data: {
        staffId: staff3.id,
        checkIn: null,
        checkOut: null,
        hours: 0,
        status: 'Absent',
        date: new Date()
      }
    });
    console.log('✓ Attendance records created\n');

    // 15. CREATE LEAVE REQUESTS
    console.log('🏖️ Creating leave requests...');
    await prisma.leaveRequest.create({
      data: {
        staffId: staff1.id,
        leaveType: 'Casual',
        startDate: new Date('2025-11-25'),
        endDate: new Date('2025-11-27'),
        reason: 'Personal work',
        status: 'Approved',
        approvedBy: adminUser.id,
        approvedDate: new Date('2025-11-17')
      }
    });

    await prisma.leaveRequest.create({
      data: {
        staffId: staff2.id,
        leaveType: 'Sick',
        startDate: new Date('2025-11-20'),
        endDate: new Date('2025-11-21'),
        reason: 'Fever and cold',
        status: 'Pending',
        approvedBy: null,
        approvedDate: null
      }
    });
    console.log('✓ Leave requests created\n');

    // 16. CREATE ROOMS
    console.log('🛏️ Creating rooms...');
    const room1 = await prisma.room.create({
      data: {
        roomNumber: '101',
        roomType: 'Standard',
        department: dept1.name,
        floor: '1',
        capacity: 2,
        pricePerDay: 2000.00,
        status: 'Available',
        description: 'Standard room with basic amenities',
        television: true,
        attachedBathroom: true,
        airConditioning: true,
        wheelchairAccessible: false,
        wifi: true,
        oxygenSupply: true,
        telephone: true,
        nursecallButton: true,
        additionalNotes: 'Recently renovated'
      }
    });

    const room2 = await prisma.room.create({
      data: {
        roomNumber: '102',
        roomType: 'Deluxe',
        department: dept1.name,
        floor: '1',
        capacity: 1,
        pricePerDay: 3500.00,
        status: 'Occupied',
        description: 'Premium room with all amenities',
        television: true,
        attachedBathroom: true,
        airConditioning: true,
        wheelchairAccessible: true,
        wifi: true,
        oxygenSupply: true,
        telephone: true,
        nursecallButton: true,
        additionalNotes: 'Best room in the ward'
      }
    });

    const room3 = await prisma.room.create({
      data: {
        roomNumber: '201',
        roomType: 'Semi-Private',
        department: dept2.name,
        floor: '2',
        capacity: 4,
        pricePerDay: 1500.00,
        status: 'Available',
        description: 'Semi-private room for 4 patients',
        television: true,
        attachedBathroom: false,
        airConditioning: true,
        wheelchairAccessible: false,
        wifi: true,
        oxygenSupply: true,
        telephone: false,
        nursecallButton: true,
        additionalNotes: 'Shared bathroom available'
      }
    });

    const room4 = await prisma.room.create({
      data: {
        roomNumber: '202',
        roomType: 'ICU',
        department: dept2.name,
        floor: '2',
        capacity: 1,
        pricePerDay: 5000.00,
        status: 'Occupied',
        description: 'Intensive Care Unit room',
        television: false,
        attachedBathroom: true,
        airConditioning: true,
        wheelchairAccessible: true,
        wifi: true,
        oxygenSupply: true,
        telephone: false,
        nursecallButton: true,
        additionalNotes: '24x7 monitoring available'
      }
    });

    const room5 = await prisma.room.create({
      data: {
        roomNumber: '301',
        roomType: 'General Ward',
        department: dept3.name,
        floor: '3',
        capacity: 6,
        pricePerDay: 1000.00,
        status: 'Available',
        description: 'General ward room',
        television: true,
        attachedBathroom: false,
        airConditioning: true,
        wheelchairAccessible: false,
        wifi: false,
        oxygenSupply: true,
        telephone: false,
        nursecallButton: true,
        additionalNotes: 'Basic facilities'
      }
    });
    console.log('✓ Rooms created\n');

    // 17. CREATE ROOM ALLOTMENTS
    console.log('🚪 Creating room allotments...');
    await prisma.roomAllotment.create({
      data: {
        patientId: patient1.id,
        patientName: patient1.name,
        patientPhone: patient1.phone,
        roomId: room2.id,
        attendingDoctor: doc1.name,
        emergencyContact: 'Sarah Doe',
        specialRequirements: 'Requires oxygen support',
        allotmentDate: new Date('2025-11-15'),
        expectedDischargeDate: new Date('2025-11-22'),
        status: 'Occupied',
        paymentMethod: 'Credit Card',
        insuranceDetails: 'Covered by HealthCare Insurance Co',
        additionalNotes: 'Post-operative care'
      }
    });

    await prisma.roomAllotment.create({
      data: {
        patientId: patient2.id,
        patientName: patient2.name,
        patientPhone: patient2.phone,
        roomId: room4.id,
        attendingDoctor: doc2.name,
        emergencyContact: 'Michael Garcia',
        specialRequirements: 'ICU monitoring required',
        allotmentDate: new Date('2025-11-12'),
        expectedDischargeDate: new Date('2025-11-25'),
        status: 'Occupied',
        paymentMethod: 'Insurance',
        insuranceDetails: 'Covered by Life Insurance Ltd',
        additionalNotes: 'Critical condition - under observation'
      }
    });
    console.log('✓ Room allotments created\n');

    // 18. CREATE PRESCRIPTION TEMPLATES
    console.log('📋 Creating prescription templates...');
    await prisma.prescriptionTemplate.create({
      data: {
        name: 'Hypertension Management',
        category: 'Cardiovascular',
        medications: 'Lisinopril 10mg - 1 tablet daily, Amlodipine 5mg - 1 tablet daily',
        createdBy: doc1.id,
        usageCount: 0
      }
    });

    await prisma.prescriptionTemplate.create({
      data: {
        name: 'Diabetes Control',
        category: 'Endocrinology',
        medications: 'Metformin 850mg - 2 tablets twice daily, Glipizide 5mg - 1 tablet daily',
        createdBy: doc2.id,
        usageCount: 0
      }
    });

    await prisma.prescriptionTemplate.create({
      data: {
        name: 'Infection Treatment',
        category: 'Infectious Diseases',
        medications: 'Amoxicillin 500mg - 1 capsule three times daily, Azithromycin 250mg - 1 tablet daily',
        createdBy: doc3.id,
        usageCount: 0
      }
    });
    console.log('✓ Prescription templates created\n');

    // 19. CREATE SERVICES
    console.log('🏥 Creating services...');
    await prisma.service.create({
      data: {
        name: 'ECG Test',
        departmentId: dept1.id,
        type: 'Diagnostic',
        duration: 30,
        price: 500.00,
        description: 'Electrocardiogram test',
        status: 'Active'
      }
    });

    await prisma.service.create({
      data: {
        name: 'Blood Pressure Monitoring',
        departmentId: dept1.id,
        type: 'Monitoring',
        duration: 15,
        price: 200.00,
        description: 'Continuous blood pressure monitoring',
        status: 'Active'
      }
    });

    await prisma.service.create({
      data: {
        name: 'CT Scan Brain',
        departmentId: dept2.id,
        type: 'Diagnostic',
        duration: 45,
        price: 3000.00,
        description: 'Brain CT scan',
        status: 'Active'
      }
    });

    await prisma.service.create({
      data: {
        name: 'Pediatric Consultation',
        departmentId: dept3.id,
        type: 'Consultation',
        duration: 30,
        price: 800.00,
        description: 'Consultation with pediatrician',
        status: 'Active'
      }
    });

    await prisma.service.create({
      data: {
        name: 'Orthopedic Surgery',
        departmentId: dept4.id,
        type: 'Surgery',
        duration: 120,
        price: 15000.00,
        description: 'Surgical procedure',
        status: 'Active'
      }
    });
    console.log('✓ Services created\n');

    // 20. CREATE ACTIVITY LOGS
    console.log('📊 Creating activity logs...');
    await prisma.activityLog.create({
      data: {
        userId: adminUser.id,
        action: 'Created',
        description: 'Created 5 new departments'
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: doctorUser.id,
        action: 'Updated',
        description: 'Updated patient prescription'
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: adminUser.id,
        action: 'Deleted',
        description: 'Deleted old emergency record'
      }
    });
    console.log('✓ Activity logs created\n');

    console.log('\n✅ Comprehensive database seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log('✓ Users: 2');
    console.log('✓ Departments: 5');
    console.log('✓ Specializations: 4');
    console.log('✓ Doctors: 4');
    console.log('✓ Patients: 5');
    console.log('✓ Appointments: 4');
    console.log('✓ Medicines: 8');
    console.log('✓ Prescriptions: 3');
    console.log('✓ Invoices: 3');
    console.log('✓ Insurance Claims: 2');
    console.log('✓ Ambulances: 3');
    console.log('✓ Emergency Calls: 3');
    console.log('✓ Roles: 4');
    console.log('✓ Staff: 5');
    console.log('✓ Attendance Records: 3');
    console.log('✓ Leave Requests: 2');
    console.log('✓ Rooms: 5');
    console.log('✓ Room Allotments: 2');
    console.log('✓ Prescription Templates: 3');
    console.log('✓ Services: 5');
    console.log('✓ Activity Logs: 3');
    console.log('\n🔗 Database URL: ' + process.env.DATABASE_URL);
    console.log('✅ All data is persistently stored in MySQL database!\n');
  } catch (error) {
    console.error('❌ Error during seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
