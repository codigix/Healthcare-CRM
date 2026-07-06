import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const startOfWeek = new Date(today);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);

        // 1. Top KPIs
        const opdToday = await prisma.patient.count({ where: { createdAt: { gte: today, lt: tomorrow } } });
        const opdYday = await prisma.patient.count({ where: { createdAt: { gte: yesterday, lt: today } } });

        const ipdToday = await prisma.roomAllotment.count({ where: { allotmentDate: { gte: today, lt: tomorrow } } });
        const ipdYday = await prisma.roomAllotment.count({ where: { allotmentDate: { gte: yesterday, lt: today } } });

        const apptToday = await prisma.appointment.count({ where: { date: { gte: today, lt: tomorrow } } });
        const apptYday = await prisma.appointment.count({ where: { date: { gte: yesterday, lt: today } } });

        const walkinToday = await prisma.appointment.count({ where: { date: { gte: today, lt: tomorrow }, visitType: 'walk-in' } });
        const walkinYday = await prisma.appointment.count({ where: { date: { gte: yesterday, lt: today }, visitType: 'walk-in' } });

        const dischargesToday = await prisma.roomAllotment.count({ where: { status: 'Discharged', updatedAt: { gte: today, lt: tomorrow } } });
        const dischargesYday = await prisma.roomAllotment.count({ where: { status: 'Discharged', updatedAt: { gte: yesterday, lt: today } } });

        const revenueTodayRes = await prisma.invoice.aggregate({ _sum: { amount: true }, where: { date: { gte: today, lt: tomorrow }, status: 'paid' } });
        const revenueYdayRes = await prisma.invoice.aggregate({ _sum: { amount: true }, where: { date: { gte: yesterday, lt: today }, status: 'paid' } });

        const revenueToday = Number(revenueTodayRes._sum.amount || 0);
        const revenueYday = Number(revenueYdayRes._sum.amount || 0);

        const calcPercent = (curr: number, prev: number) => {
            if (prev === 0) return curr > 0 ? 100 : 0;
            return Number((((curr - prev) / prev) * 100).toFixed(1));
        };

        const stats = {
            opd: { count: opdToday, percent: calcPercent(opdToday, opdYday) },
            ipd: { count: ipdToday, percent: calcPercent(ipdToday, ipdYday) },
            appointments: { count: apptToday, percent: calcPercent(apptToday, apptYday) },
            walkins: { count: walkinToday, percent: calcPercent(walkinToday, walkinYday) },
            discharges: { count: dischargesToday, percent: calcPercent(dischargesToday, dischargesYday) },
            revenue: { amount: revenueToday, percent: calcPercent(revenueToday, revenueYday) }
        };

        // 2. Queue (OPD vs Billing)
        const opdQueue = await prisma.appointment.findMany({
            where: { date: { gte: today, lt: tomorrow } },
            take: 10,
            orderBy: { time: 'asc' },
            include: { patient: true, doctor: true }
        });

        const billingQueue = await prisma.invoice.findMany({
            where: { status: 'pending', date: { gte: today, lt: tomorrow } },
            take: 10,
            include: { patient: true }
        });

        // 3. Today's Appointments (Detailed)
        const appointmentsList = await prisma.appointment.findMany({
            where: { date: { gte: today, lt: tomorrow } },
            take: 5,
            orderBy: { time: 'asc' },
            include: { patient: true, doctor: true }
        });

        // 4. Bed Availability
        const rooms = await prisma.room.findMany();
        const bedAvailability = {
            general: { total: 0, available: 0 },
            private: { total: 0, available: 0 },
            deluxe: { total: 0, available: 0 },
            icu: { total: 0, available: 0 },
            nicu: { total: 0, available: 0 }
        };

        rooms.forEach(room => {
            const type = room.roomType.toLowerCase();
            let key = null;
            if (type.includes('general')) key = 'general';
            else if (type.includes('private')) key = 'private';
            else if (type.includes('deluxe')) key = 'deluxe';
            else if (type.includes('nicu')) key = 'nicu';
            else if (type.includes('icu')) key = 'icu';

            if (key) {
                // @ts-ignore
                bedAvailability[key].total += room.capacity;
                // @ts-ignore
                if (room.status.toLowerCase() === 'available') bedAvailability[key].available += room.capacity;
            }
        });

        // 5. Walk-in vs Appointments (Line Chart)
        const walkInVsAppointments = [];
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        for (let i = 0; i < 7; i++) {
            const dStart = new Date(startOfWeek);
            dStart.setDate(dStart.getDate() + i);
            const dEnd = new Date(dStart);
            dEnd.setDate(dEnd.getDate() + 1);

            const walkin = await prisma.appointment.count({ where: { date: { gte: dStart, lt: dEnd }, visitType: 'walk-in' } });
            const appt = await prisma.appointment.count({ where: { date: { gte: dStart, lt: dEnd }, visitType: { not: 'walk-in' } } });

            walkInVsAppointments.push({
                day: days[i],
                walkIn: walkin,
                appointments: appt
            });
        }

        // 6. OPD by Department (Donut Chart)
        const opdByDepartmentRaw = await prisma.appointment.groupBy({
            by: ['department'],
            _count: { department: true },
            where: { date: { gte: startOfWeek } }
        });
        const opdByDepartment = opdByDepartmentRaw.map(d => ({
            name: d.department || 'General',
            value: d._count.department
        }));

        // 7. Recent Registrations
        const recentRegistrations = await prisma.patient.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' }
        });

        // 8. Payment Collection
        const invoicesToday = await prisma.invoice.findMany({
            where: { date: { gte: today, lt: tomorrow }, status: 'paid' }
        });
        
        let opdCol = 0, ipdCol = 0, pharmCol = 0, otherCol = 0;
        invoicesToday.forEach(inv => {
            const amt = Number(inv.amount);
            const notes = (inv.notes || '').toLowerCase();
            if (notes.includes('opd')) opdCol += amt;
            else if (notes.includes('ipd')) ipdCol += amt;
            else if (notes.includes('pharmacy')) pharmCol += amt;
            else otherCol += amt;
        });
        
        // Ensure revenue matches the sum if notes were missing
        if (opdCol + ipdCol + pharmCol + otherCol === 0) {
            opdCol = revenueToday;
        }

        const paymentCollection = {
            total: revenueToday,
            opd: opdCol,
            ipd: ipdCol,
            pharmacy: pharmCol,
            other: otherCol
        };

        // 9. Footer Stats
        const totalPatients = await prisma.patient.count();
        const malePatients = await prisma.patient.count({ where: { gender: 'Male' } });
        const femalePatients = await prisma.patient.count({ where: { gender: 'Female' } });
        const activeStaff = await prisma.staff.count({ where: { status: 'Active' } });

        res.json({
            stats,
            queue: { opd: opdQueue, billing: billingQueue },
            appointmentsList,
            bedAvailability,
            walkInVsAppointments,
            opdByDepartment,
            recentRegistrations,
            paymentCollection,
            footerStats: {
                totalPatients,
                male: { count: malePatients, percent: (malePatients/totalPatients*100).toFixed(1) },
                female: { count: femalePatients, percent: (femalePatients/totalPatients*100).toFixed(1) },
                activeStaff,
                avgWaitTime: 23 // mock
            }
        });

    } catch (error: any) {
        console.error('[DASHBOARD RECEPTION] Error:', error);
        res.status(500).json({ error: 'Failed to fetch reception dashboard', details: error.message });
    }
});

export default router;
