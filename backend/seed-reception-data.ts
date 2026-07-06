import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Reception Dashboard Data...");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    startOfWeek.setDate(diff);

    // 1. Create Departments & Doctors
    const depts = ["Cardiology", "Gynecology", "Orthopedics", "Dermatology", "General Medicine", "Neurology"];
    const doctors = [];
    for (let i = 0; i < 6; i++) {
        const doc = await prisma.doctor.upsert({
            where: { email: `doc${i}@test.com` },
            update: {},
            create: {
                name: `Dr. ${['Amit Verma', 'Neha Joshi', 'Rajesh Kumar', 'Ritu Sharma', 'Vivek Joshi', 'Sandeep Rao'][i]}`,
                email: `doc${i}@test.com`,
                phone: "1234567890",
                specialization: depts[i],
                experience: 10,
            }
        });
        doctors.push(doc);
    }

    // 2. Create Rooms
    const roomTypes = [
        { type: "General Beds", count: 120, capacity: 1, floor: "1" },
        { type: "Private Rooms", count: 35, capacity: 1, floor: "2" },
        { type: "Deluxe Rooms", count: 15, capacity: 1, floor: "3" },
        { type: "ICU Beds", count: 20, capacity: 1, floor: "4" },
        { type: "NICU Beds", count: 10, capacity: 1, floor: "4" },
    ];
    for (const rt of roomTypes) {
        for (let i = 1; i <= rt.count; i++) {
            await prisma.room.upsert({
                where: { roomNumber_floor: { roomNumber: `${rt.type.substring(0,3)}-${i}`, floor: rt.floor } },
                update: {},
                create: {
                    roomNumber: `${rt.type.substring(0,3)}-${i}`,
                    roomType: rt.type,
                    department: "General",
                    floor: rt.floor,
                    capacity: rt.capacity,
                    pricePerDay: 1000,
                    status: (Math.random() > 0.3) ? 'Available' : 'Occupied',
                }
            });
        }
    }

    // 3. Create Patients (Registrations)
    // Create 150 for today, 130 for yesterday
    const patients = [];
    for(let i=0; i<15; i++) { // scaled down for speed, but representing 150
        const p = await prisma.patient.create({
            data: {
                name: `Patient Today ${i}`,
                email: `today${i}@test.com`,
                phone: "9876543210",
                dob: new Date("1990-01-01"),
                gender: i%2===0 ? "Male" : "Female",
                createdAt: new Date(today.getTime() + Math.random()*86400000), // Random time today
            }
        });
        patients.push(p);
    }
    for(let i=0; i<10; i++) {
        await prisma.patient.create({
            data: {
                name: `Patient Yday ${i}`,
                email: `yday${i}@test.com`,
                phone: "9876543210",
                dob: new Date("1990-01-01"),
                gender: i%2===0 ? "Male" : "Female",
                createdAt: new Date(yesterday.getTime() + Math.random()*86400000), // Random time yesterday
            }
        });
    }

    // 4. Create Appointments
    for(let i=0; i<15; i++) {
        const doc = doctors[i % doctors.length];
        await prisma.appointment.create({
            data: {
                doctorId: doc.id,
                patientId: patients[i].id,
                date: new Date(today.getTime() + Math.random()*86400000),
                time: "10:00 AM",
                tokenNumber: `OPD-${150+i}`,
                department: doc.specialization,
                status: i < 2 ? "Completed" : i < 4 ? "In Consultation" : "Waiting",
                visitType: i%3 === 0 ? "New" : "Follow-up",
                createdAt: new Date(),
            }
        });
    }

    // Week appointments for chart
    for(let i=0; i<30; i++) {
        const dayOffset = Math.floor(Math.random() * 7);
        const randomDate = new Date(startOfWeek);
        randomDate.setDate(randomDate.getDate() + dayOffset);
        await prisma.appointment.create({
            data: {
                doctorId: doctors[0].id,
                patientId: patients[0].id,
                date: randomDate,
                time: "10:00 AM",
                status: "Completed",
                visitType: "walk-in", // Some walk-ins
            }
        });
        await prisma.appointment.create({
            data: {
                doctorId: doctors[1].id,
                patientId: patients[1].id,
                date: randomDate,
                time: "11:00 AM",
                status: "Completed",
                visitType: "appointment",
            }
        });
    }

    // 5. Create Invoices (Revenue)
    // Today
    for(let i=0; i<10; i++) {
        await prisma.invoice.create({
            data: {
                patientId: patients[i].id,
                amount: Math.floor(Math.random() * 5000) + 1000,
                status: "paid",
                date: today,
                notes: ["OPD Collection", "IPD Collection", "Pharmacy Collection", "Other Collection"][i%4]
            }
        });
    }
    // Yesterday
    for(let i=0; i<8; i++) {
        await prisma.invoice.create({
            data: {
                patientId: patients[0].id,
                amount: Math.floor(Math.random() * 5000) + 1000,
                status: "paid",
                date: yesterday,
                notes: "OPD Collection"
            }
        });
    }

    console.log("Seeding done.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
