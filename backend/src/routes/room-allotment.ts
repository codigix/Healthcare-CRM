import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

router.get('/available', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [rooms]: any = await connection.query(
      'SELECT * FROM rooms WHERE status = ? ORDER BY roomNumber ASC LIMIT 10',
      ['Available']
    );
    connection.release();

    if (rooms.length === 0) {
      return res.status(404).json({ error: 'No rooms available right now', rooms: [] });
    }

    res.json({ success: true, rooms });
  } catch (error: any) {
    console.error('[ROOMS AVAILABLE] Error:', error);
    res.status(500).json({ error: 'Failed to fetch available rooms', details: error.message });
  }
});

router.get('/allotments', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { patientId } = req.query;
    const connection = await pool.getConnection();
    
    let query = `
      SELECT ra.*, r.roomNumber, r.roomType, r.department 
      FROM room_allotments ra
      LEFT JOIN rooms r ON ra.roomId = r.id
    `;
    const params: any[] = [];
    
    if (patientId) {
      query += ' WHERE ra.patientId = ?';
      params.push(String(patientId));
    }
    
    query += ' ORDER BY ra.createdAt DESC LIMIT 100';
    
    const [allotments]: any = await connection.query(query, params);
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
  let connection;
  try {
    const { 
      patientId, patientName, patientPhone, roomId, attendingDoctor, 
      emergencyContact, specialRequirements, allotmentDate, 
      expectedDischargeDate, paymentMethod, insuranceDetails, additionalNotes, status,
      bed, recordId
    } = req.body;

    if (!patientId || !patientName || !roomId || !attendingDoctor || !allotmentDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const query = `INSERT INTO room_allotments (
      id, patientId, patientName, patientPhone, roomId, attendingDoctor, 
      emergencyContact, specialRequirements, allotmentDate, 
      expectedDischargeDate, status, paymentMethod, insuranceDetails, additionalNotes, bed, createdAt, updatedAt
    ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

    await connection.query(query, [
      patientId, patientName, patientPhone, roomId, attendingDoctor,
      emergencyContact, specialRequirements, new Date(allotmentDate),
      expectedDischargeDate ? new Date(expectedDischargeDate) : null,
      status || 'Occupied', paymentMethod, insuranceDetails, additionalNotes, bed || null
    ]);

    // Update the room status to 'Occupied'
    await connection.query('UPDATE rooms SET status = "Occupied", updatedAt = NOW() WHERE id = ?', [roomId]);

    // Update patient status to 'Admitted'
    await connection.query('UPDATE patients SET status = "Admitted", updatedAt = NOW() WHERE id = ?', [patientId]);

    // If there is a recordId (Admission Request ID), update its status to 'Admitted'
    if (recordId) {
      await connection.query('UPDATE records SET status = "Admitted", updatedAt = NOW() WHERE id = ?', [recordId]);
    } else {
      await connection.query('UPDATE records SET status = "Admitted", updatedAt = NOW() WHERE patientName = ? AND type = "Admission Request" AND status = "Pending Review"', [patientName]);
    }

    await connection.commit();

    const [allotment]: any = await connection.query(
      `SELECT ra.*, r.roomNumber, r.roomType, r.department FROM room_allotments ra
       LEFT JOIN rooms r ON ra.roomId = r.id WHERE ra.patientId = ? ORDER BY ra.createdAt DESC LIMIT 1`,
      [patientId]
    );
    connection.release();
    res.status(201).json(allotment[0]);
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error('Error creating allotment:', error);
    res.status(500).json({ error: 'Failed to create room allotment' });
  }
});

router.put('/allotments/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { status, expectedDischargeDate, additionalNotes } = req.body;
    connection = await pool.getConnection();
    
    // Fetch allotment first
    const [allotments]: any = await connection.query('SELECT * FROM room_allotments WHERE id = ?', [req.params.id]);
    if (allotments.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Room allotment not found' });
    }
    const allotment = allotments[0];

    await connection.beginTransaction();
    
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

    // If status is updated to Discharged
    if (status === 'Discharged') {
      // 1. Update patient status back to Active
      await connection.query('UPDATE patients SET status = "Active", updatedAt = NOW() WHERE id = ?', [allotment.patientId]);
      
      // 2. Update related Admission Request status to Discharged
      await connection.query('UPDATE records SET status = "Discharged", updatedAt = NOW() WHERE patientName = ? AND type = "Admission Request" AND status = "Admitted"', [allotment.patientName]);

      // 3. Set the room status to Available if all active allotments for that room are discharged
      const [remainingActive]: any = await connection.query('SELECT COUNT(*) as count FROM room_allotments WHERE roomId = ? AND status = "Occupied"', [allotment.roomId]);
      if (remainingActive[0].count === 0) {
        await connection.query('UPDATE rooms SET status = "Available", updatedAt = NOW() WHERE id = ?', [allotment.roomId]);
      }
    }

    await connection.commit();

    const [updatedAllotment]: any = await connection.query(
      `SELECT ra.*, r.roomNumber, r.roomType, r.department FROM room_allotments ra
       LEFT JOIN rooms r ON ra.roomId = r.id WHERE ra.id = ?`,
      [req.params.id]
    );
    connection.release();
    res.json(updatedAllotment[0]);
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error('Error updating allotment:', error);
    res.status(500).json({ error: 'Failed to update room allotment' });
  }
});

router.delete('/allotments/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // Fetch allotment first
    const [allotments]: any = await connection.query('SELECT * FROM room_allotments WHERE id = ?', [req.params.id]);
    if (allotments.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Room allotment not found' });
    }
    const allotment = allotments[0];

    await connection.beginTransaction();

    await connection.query('DELETE FROM room_allotments WHERE id = ?', [req.params.id]);

    // Update patient status back to Active
    await connection.query('UPDATE patients SET status = "Active", updatedAt = NOW() WHERE id = ?', [allotment.patientId]);
    
    // Update related Admission Request status to Discharged
    await connection.query('UPDATE records SET status = "Discharged", updatedAt = NOW() WHERE patientName = ? AND type = "Admission Request" AND status = "Admitted"', [allotment.patientName]);

    // Set the room status to Available if no other active allotments exist
    const [remainingActive]: any = await connection.query('SELECT COUNT(*) as count FROM room_allotments WHERE roomId = ? AND status = "Occupied"', [allotment.roomId]);
    if (remainingActive[0].count === 0) {
      await connection.query('UPDATE rooms SET status = "Available", updatedAt = NOW() WHERE id = ?', [allotment.roomId]);
    }

    await connection.commit();
    connection.release();
    res.json({ message: 'Room allotment deleted' });
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
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
      wheelchairAccessible, wifi, oxygenSupply, telephone, nursecallButton,
      ventilator, patientMonitor, additionalNotes
    } = req.body;

    if (!roomNumber || !roomType || !department || !floor || !capacity || !pricePerDay) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await pool.getConnection();
    const query = `INSERT INTO rooms (
      id, roomNumber, roomType, department, floor, capacity, pricePerDay,
      status, description, television, attachedBathroom, airConditioning,
      wheelchairAccessible, wifi, oxygenSupply, telephone, nursecallButton,
      ventilator, patientMonitor, additionalNotes, createdAt, updatedAt
    ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

    await connection.query(query, [
      roomNumber, roomType, department, floor, capacity, parseFloat(pricePerDay),
      status || 'Available', description, television || false, attachedBathroom || false,
      airConditioning || false, wheelchairAccessible || false, wifi || false,
      oxygenSupply || false, telephone || false, nursecallButton || false,
      ventilator || false, patientMonitor || false, additionalNotes
    ]);

    const [room]: any = await connection.query('SELECT * FROM rooms WHERE roomNumber = ?', [roomNumber]);
    connection.release();
    res.status(201).json(room[0]);
  } catch (error: any) {
    console.error('Error creating room:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      const { roomNumber, floor } = req.body;
      return res.status(400).json({ error: `Room ${roomNumber} already exists on ${floor} floor.` });
    }
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
          'attendingDoctor', ra.attendingDoctor, 'status', ra.status, 'bed', ra.bed
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
