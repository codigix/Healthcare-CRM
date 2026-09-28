import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

// GET /api/bed-status  – full overview of all rooms + active allotments
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();

    // Fetch all rooms joined with their active (non-Discharged) allotment
    const [rooms]: any = await connection.query(`
      SELECT
        r.id,
        r.roomNumber,
        r.roomType,
        r.department,
        r.floor,
        r.status,
        r.capacity,
        ra.id           AS allotmentId,
        ra.patientId,
        ra.patientName,
        ra.patientPhone,
        ra.attendingDoctor,
        ra.allotmentDate,
        ra.expectedDischargeDate,
        ra.bed,
        ra.paymentMethod
      FROM rooms r
      LEFT JOIN room_allotments ra
        ON ra.roomId = r.id
        AND ra.status NOT IN ('Discharged', 'Released')
      ORDER BY r.department ASC, r.roomNumber ASC
    `);

    connection.release();

    // Compute summary stats
    const totalBeds      = rooms.length;
    const occupied       = rooms.filter((r: any) => r.status === 'Occupied').length;
    const available      = rooms.filter((r: any) => r.status === 'Available').length;
    const reserved       = rooms.filter((r: any) => r.status === 'Reserved').length;
    const outOfService   = rooms.filter((r: any) => r.status === 'Out of Service' || r.status === 'Maintenance').length;
    const occupancyRate  = totalBeds > 0 ? Math.round((occupied / totalBeds) * 100) : 0;

    // Group by department
    const deptMap: Record<string, any> = {};
    for (const room of rooms) {
      const dept = room.department || 'General';
      if (!deptMap[dept]) {
        deptMap[dept] = { department: dept, rooms: [], totalBeds: 0, occupied: 0, available: 0, reserved: 0, outOfService: 0 };
      }
      deptMap[dept].rooms.push(room);
      deptMap[dept].totalBeds++;
      if (room.status === 'Occupied')    deptMap[dept].occupied++;
      else if (room.status === 'Available') deptMap[dept].available++;
      else if (room.status === 'Reserved')  deptMap[dept].reserved++;
      else deptMap[dept].outOfService++;
    }

    const departments = Object.values(deptMap).map((d: any) => ({
      ...d,
      occupancyRate: d.totalBeds > 0 ? Math.round((d.occupied / d.totalBeds) * 100) : 0
    }));

    res.json({
      summary: { totalBeds, occupied, available, reserved, outOfService, occupancyRate },
      departments,
      rooms
    });
  } catch (error: any) {
    console.error('[BED STATUS] Error:', error);
    res.status(500).json({ error: 'Failed to fetch bed status', details: error.message });
  }
});

// GET /api/bed-status/department/:dept
router.get('/department/:dept', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { dept } = req.params;
    const connection = await pool.getConnection();

    const [rooms]: any = await connection.query(`
      SELECT
        r.id, r.roomNumber, r.roomType, r.department, r.floor, r.status, r.capacity,
        ra.id AS allotmentId, ra.patientId, ra.patientName, ra.attendingDoctor,
        ra.allotmentDate, ra.expectedDischargeDate, ra.bed
      FROM rooms r
      LEFT JOIN room_allotments ra ON ra.roomId = r.id AND ra.status NOT IN ('Discharged','Released')
      WHERE r.department = ?
      ORDER BY r.roomNumber ASC
    `, [dept]);

    connection.release();
    res.json({ department: dept, rooms });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch department bed status', details: error.message });
  }
});

export default router;
