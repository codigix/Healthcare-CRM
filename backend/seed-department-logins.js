require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const departments = [
  { dept: 'Administration', role: 'Super Admin', email: 'admin@medixpro.com' },
  { dept: 'Front Office', role: 'Receptionist', email: 'frontoffice@medixpro.com' },
  { dept: 'Clinical Services', role: 'Doctor', email: 'clinical@medixpro.com' },
  { dept: 'Nursing & Patient Care', role: 'Nurse', email: 'nursing@medixpro.com' },
  { dept: 'Diagnostics', role: 'Lab Technician', email: 'diagnostics@medixpro.com' },
  { dept: 'OT & Critical Care', role: 'OT Staff', email: 'ot@medixpro.com' },
  { dept: 'Pharmacy', role: 'Pharmacist', email: 'pharmacy@medixpro.com' },
  { dept: 'Inventory & Procurement', role: 'Store Manager', email: 'inventory@medixpro.com' },
  { dept: 'Finance & Accounts', role: 'Accountant', email: 'finance@medixpro.com' },
  { dept: 'Human Resources', role: 'HR', email: 'hr@medixpro.com' },
  { dept: 'Medical Records & Quality', role: 'MRD Team', email: 'mrd@medixpro.com' },
  { dept: 'Patient Relationship', role: 'CRM', email: 'crm@medixpro.com' },
  { dept: 'Facilities & Support', role: 'Maintenance', email: 'facilities@medixpro.com' },
  { dept: 'Executive MIS', role: 'Management', email: 'ceo@medixpro.com' },
  { dept: 'IT & System', role: 'IT Admin', email: 'it@medixpro.com' }
];

async function seed() {
  try {
    const password = 'Kale@1234';
    const hashedPassword = await bcrypt.hash(password, 10);

    for (const d of departments) {
      await prisma.user.upsert({
        where: { email: d.email },
        update: {
          department: d.dept,
          role: d.role,
          password: hashedPassword
        },
        create: {
          name: `${d.role} User`,
          email: d.email,
          password: hashedPassword,
          department: d.dept,
          role: d.role
        }
      });
      console.log(`Upserted user: ${d.email} in ${d.dept}`);
    }
    console.log('Successfully seeded all department users.');
  } catch (err) {
    console.error('Error seeding users:', err);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
