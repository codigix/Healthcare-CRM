import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEPARTMENTS = [
    { role: 'superadmin', email: 'superadmin@medixpro.com', name: 'Super Admin', department: 'Super Admin' },
    { role: 'admin', email: 'admin@medixpro.com', name: 'Admin', department: 'Administration' },
    { role: 'receptionist', email: 'receptionist@medixpro.com', name: 'Receptionist', department: 'Reception & Front Office' },
    { role: 'doctor', email: 'doctor@medixpro.com', name: 'Doctor', department: 'Clinical Services' },
    { role: 'nurse', email: 'nurse@medixpro.com', name: 'Nurse', department: 'Nursing & Patient Care' },
    { role: 'laboratory', email: 'laboratory@medixpro.com', name: 'Lab Tech', department: 'Diagnostics' },
    { role: 'ot', email: 'ot@medixpro.com', name: 'OT Manager', department: 'OT & Critical Care' },
    { role: 'pharmacy', email: 'pharmacy@medixpro.com', name: 'Pharmacist', department: 'Pharmacy' },
    { role: 'inventory', email: 'inventory@medixpro.com', name: 'Inventory Manager', department: 'Inventory & Procurement' },
    { role: 'finance', email: 'finance@medixpro.com', name: 'Finance Admin', department: 'Finance & Accounts' },
    { role: 'hr', email: 'hr@medixpro.com', name: 'HR Manager', department: 'Human Resources' },
    { role: 'records', email: 'records@medixpro.com', name: 'Records Keeper', department: 'Medical Records & Quality' },
    { role: 'crm', email: 'crm@medixpro.com', name: 'CRM Executive', department: 'Patient Relationship (CRM)' },
    { role: 'facilities', email: 'facilities@medixpro.com', name: 'Facilities Manager', department: 'Facilities & Support' },
    { role: 'it', email: 'it@medixpro.com', name: 'IT Admin', department: 'IT & System' },
    { role: 'executive', email: 'executive@medixpro.com', name: 'Executive', department: 'Executive MIS' },
];

async function main() {
    console.log('Seeding dummy logins...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    for (const dept of DEPARTMENTS) {
        // Upsert to ensure they exist, updated with correct hash if changed
        const user = await prisma.user.upsert({
            where: { email: dept.email },
            update: {
                password: hashedPassword,
                role: dept.role,
                department: dept.department,
            },
            create: {
                name: dept.name,
                email: dept.email,
                password: hashedPassword,
                role: dept.role,
                department: dept.department,
            },
        });
        console.log(`Upserted dummy user: ${user.email} (${user.role})`);
    }

    console.log('Seeding complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
