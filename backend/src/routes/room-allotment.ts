import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/allotments', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [allotments]: any = await connection.query(`
      SELECT ra.*, r.roomNumber, r.roomType, r.department 
      FROM room_allotments ra
      LEFT JOIN rooms r ON ra.roomId = r.id
      ORDER BY ra.createdAt DESC LIMIT 100
    `);
    connection.release();
    res.json({ 
      allotments: allotments.map((a: any) => ({
        ...a,
        room: {
          id: a.roomId,
          roomNumber: a.roomNumber,
          roomType: a.roomType,
          department: a.department
        }
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch room allotments' });
  }
});

router.post('/allotments', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { 
      patientId, patientName, patientPhone, roomId, attendingDoctor, 
      emergencyContact, specialRequirements, allotmentDate, 
      expectedDischargeDate, paymentMethod, insuranceDetails, additionalNotes, status 
    } = req.body;

    if (!patientId || !patientName || !roomId || !attendingDoctor || !allotmentDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await pool.getConnection();
    const query = `INSERT INTO room_allotments (
      id, patientId, patientName, patientPhone, roomId, attendingDoctor, 
      emergencyContact, specialRequirements, allotmentDate, 
      expectedDischargeDate, status, paymentMethod, insuranceDetails, additionalNotes, createdAt, updatedAt
    ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

    await connection.query(query, [
      patientId, patientName, patientPhone, roomId, attendingDoctor,
      emergencyContact, specialRequirements, new Date(allotmentDate),
      expectedDischargeDate ? new Date(expectedDischargeDate) : null,
      status || 'Occupied', paymentMethod, insuranceDetails, additionalNotes
    ]);

    const [allotment]: any = await connection.query(
      `SELECT ra.*, r.roomNumber, r.roomType, r.department FROM room_allotments ra
       LEFT JOIN rooms r ON ra.roomId = r.id WHERE ra.patientId = ? ORDER BY ra.createdAt DESC LIMIT 1`,
      [patientId]
    );
    connection.release();
    res.status(201).json(allotment[0]);
  } catch (error) {
    console.error('Error creating allotment:', error);
    res.status(500).json({ error: 'Failed to create room allotment' });
  }
});

router.put('/allotments/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status, expectedDischargeDate, additionalNotes } = req.body;
    const connection = await pool.getConnection();
    
    let updateQuery = 'UPDATE room_allotments SET updatedAt = NOW()';
    const params: any[] = [];

    if (status) {
      updateQuery += ', status = ?';
      params.push(status);
    }
    if (expectedDischargeDate) {
      updateQuery += ', expectedDischargeDate = ?';
      params.push(new Date(expectedDischargeDate));
    }
    if (additionalNotes !== undefined) {
      updateQuery += ', additionalNotes = ?';
      params.push(additionalNotes);
    }

    updateQuery += ' WHERE id = ?';
    params.push(req.params.id);

    await connection.query(updateQuery, params);
    const [allotment]: any = await connection.query(
      `SELECT ra.*, r.roomNumber, r.roomType, r.department FROM room_allotments ra
       LEFT JOIN rooms r ON ra.roomId = r.id WHERE ra.id = ?`,
      [req.params.id]
    );
    connection.release();
    res.json(allotment[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update room allotment' });
  }
});

router.delete('/allotments/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM room_allotments WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Room allotment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete room allotment' });
  }
});

router.get('/rooms', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [rooms]: any = await connection.query('SELECT * FROM rooms ORDER BY roomNumber ASC');
    connection.release();
    res.json({ rooms, total: rooms.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

router.post('/rooms', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      roomNumber, roomType, department, floor, capacity, pricePerDay,
      status, description, television, attachedBathroom, airConditioning,
      wheelchairAccessible, wifi, oxygenSupply, telephone, nursecallButton, additionalNotes
    } = req.body;

    if (!roomNumber || !roomType || !department || !floor || !capacity || !pricePerDay) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await pool.getConnection();
    const query = `INSERT INTO rooms (
      id, roomNumber, roomType, department, floor, capacity, pricePerDay,
      status, description, television, attachedBathroom, airConditioning,
      wheelchairAccessible, wifi, oxygenSupply, telephone, nursecallButton, additionalNotes, createdAt, updatedAt
    ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

    await connection.query(query, [
      roomNumber, roomType, department, floor, capacity, parseFloat(pricePerDay),
      status || 'Available', description, television || false, attachedBathroom || false,
      airConditioning || false, wheelchairAccessible || false, wifi || false,
      oxygenSupply || false, telephone || false, nursecallButton || false, additionalNotes
    ]);

    const [room]: any = await connection.query('SELECT * FROM rooms WHERE roomNumber = ?', [roomNumber]);
    connection.release();
    res.status(201).json(room[0]);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

router.put('/rooms/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const connection = await pool.getConnection();
    await connection.query('UPDATE rooms SET status = ?, updatedAt = NOW() WHERE id = ?', [status, req.params.id]);
    const [room]: any = await connection.query('SELECT * FROM rooms WHERE id = ?', [req.params.id]);
    connection.release();
    res.json(room[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update room' });
  }
});

router.delete('/rooms/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM rooms WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Room deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

router.get('/by-department/:dept', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { dept } = req.params;
    const connection = await pool.getConnection();

    const [rooms]: any = await connection.query(
      `SELECT r.*, GROUP_CONCAT(
        JSON_OBJECT(
          'id', ra.id, 'patientId', ra.patientId, 'patientName', ra.patientName,
          'attendingDoctor', ra.attendingDoctor, 'status', ra.status
        )
      ) as roomAllotments FROM rooms r
       LEFT JOIN room_allotments ra ON r.id = ra.roomId
       WHERE r.department = ? GROUP BY r.id ORDER BY r.roomNumber ASC`,
      [dept]
    );

    const processedRooms = rooms.map((room: any) => ({
      ...room,
      roomAllotments: room.roomAllotments ? JSON.parse(`[${room.roomAllotments}]`) : []
    }));

    const occupied = processedRooms.filter((r: any) => r.status === 'Occupied').length;
    const available = processedRooms.filter((r: any) => r.status === 'Available').length;

    connection.release();
    res.json({
      department: dept,
      totalRooms: processedRooms.length,
      occupied,
      available,
      rooms: processedRooms
    });
  } catch (error) {
    console.error('Error fetching department rooms:', error);
    res.status(500).json({ error: 'Failed to fetch department rooms' });
  }
});

export default router;
