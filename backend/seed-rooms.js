const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config({ path: '.env.production' });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Kale@1234',
  database: process.env.DB_NAME || 'medixpro',
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});

async function seedRoomData() {
  const connection = await pool.getConnection();

  try {
    console.log('🌱 Starting room data seed...');

    const roomsData = [
      {
        roomNumber: '101',
        roomType: 'Standard',
        department: 'General',
        floor: 1,
        capacity: 3,
        pricePerDay: 500,
      },
      {
        roomNumber: '102',
        roomType: 'Deluxe',
        department: 'General',
        floor: 1,
        capacity: 2,
        pricePerDay: 800,
      },
      {
        roomNumber: '103',
        roomType: 'ICU',
        department: 'ICU',
        floor: 2,
        capacity: 1,
        pricePerDay: 2000,
      },
      {
        roomNumber: '104',
        roomType: 'Standard',
        department: 'General',
        floor: 1,
        capacity: 3,
        pricePerDay: 500,
      },
      {
        roomNumber: '201',
        roomType: 'Deluxe',
        department: 'Surgery',
        floor: 2,
        capacity: 2,
        pricePerDay: 1000,
      },
      {
        roomNumber: '202',
        roomType: 'Standard',
        department: 'Surgery',
        floor: 2,
        capacity: 3,
        pricePerDay: 600,
      },
    ];

    for (const room of roomsData) {
      const roomId = uuidv4();
      const insertRoom = `INSERT INTO rooms (id, roomNumber, roomType, department, floor, capacity, pricePerDay, status, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Available', NOW(), NOW())`;

      await connection.query(insertRoom, [
        roomId,
        room.roomNumber,
        room.roomType,
        room.department,
        room.floor,
        room.capacity,
        room.pricePerDay,
      ]);

      console.log(`✅ Created room ${room.roomNumber}`);
    }

    console.log('🌱 Adding patient allocations to rooms...');

    const patientsData = [
      {
        roomNumber: '101',
        patientName: 'Vikram Desai',
        patientPhone: '9876543210',
        attendingDoctor: 'Dr. Sanika Mote',
        status: 'Occupied',
      },
      {
        roomNumber: '101',
        patientName: 'Aditi More',
        patientPhone: '9123456789',
        attendingDoctor: 'Dr. Sanika Mote',
        status: 'Occupied',
      },
      {
        roomNumber: '102',
        patientName: 'Chetana Kale',
        patientPhone: '9988776655',
        attendingDoctor: 'Dr. Rahul Singh',
        status: 'Occupied',
      },
      {
        roomNumber: '103',
        patientName: 'Suresh Patil',
        patientPhone: '9654321098',
        attendingDoctor: 'Dr. Priya Sharma',
        status: 'Occupied',
      },
      {
        roomNumber: '201',
        patientName: 'Anjali Kumar',
        patientPhone: '9876123456',
        attendingDoctor: 'Dr. Sanjay Gupta',
        status: 'Occupied',
      },
    ];

    const getRoomIdQuery = 'SELECT id FROM rooms WHERE roomNumber = ?';

    for (const patient of patientsData) {
      const [rooms] = await connection.query(getRoomIdQuery, [patient.roomNumber]);

      if (rooms.length > 0) {
        const roomId = rooms[0].id;
        const patientId = uuidv4();
        const allocId = uuidv4();

        const insertAllocation = `INSERT INTO room_allotments 
          (id, patientId, patientName, patientPhone, roomId, attendingDoctor, status, allotmentDate, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())`;

        await connection.query(insertAllocation, [
          allocId,
          patientId,
          patient.patientName,
          patient.patientPhone,
          roomId,
          patient.attendingDoctor,
          patient.status,
        ]);

        console.log(`✅ Allocated ${patient.patientName} to room ${patient.roomNumber}`);
      }
    }

    console.log('🎉 Room data seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding room data:', error.message);
  } finally {
    await connection.release();
    await pool.end();
  }
}

seedRoomData();
