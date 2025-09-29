const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration with fallback
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'healthcare_crm',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  charset: 'utf8mb4',
  timezone: '+00:00'
};

// Connection config for single connections
const connectionConfig = {
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  charset: dbConfig.charset,
  timezone: dbConfig.timezone
};

// Create connection pool
let pool;

// Initialize database connection
const initializeConnection = async () => {
  try {
    // First try to connect without database
    const tempConnection = await mysql.createConnection(connectionConfig);
    
    // Create database if it doesn't exist
    await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await tempConnection.end();
    
    // Now connect with database
    pool = mysql.createPool(dbConfig);
    console.log('✅ Database connection established');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('💡 Please check your MySQL credentials in server/.env file');
    return false;
  }
};

// Test database connection
const testConnection = async () => {
  try {
    if (!pool) {
      await initializeConnection();
    }
    
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    console.log(`📊 Database: ${dbConfig.database}`);
    console.log(`🏠 Host: ${dbConfig.host}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    if (!pool) {
      const connected = await initializeConnection();
      if (!connected) {
        throw new Error('Could not connect to database');
      }
    }

    console.log('🚀 Initializing database tables...');

    // Users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'doctor', 'nurse', 'receptionist') NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        avatar VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role),
        INDEX idx_active (is_active)
      )
    `);

    // Departments table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS departments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        head_doctor_id INT,
        location VARCHAR(255),
        phone VARCHAR(20),
        email VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (head_doctor_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_name (name),
        INDEX idx_active (is_active)
      )
    `);

    // Patients table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS patients (
        id INT PRIMARY KEY AUTO_INCREMENT,
        patient_id VARCHAR(20) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        date_of_birth DATE,
        gender ENUM('male', 'female', 'other'),
        address TEXT,
        emergency_contact_name VARCHAR(100),
        emergency_contact_phone VARCHAR(20),
        blood_type VARCHAR(5),
        allergies TEXT,
        medical_history TEXT,
        insurance_provider VARCHAR(100),
        insurance_number VARCHAR(50),
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_patient_id (patient_id),
        INDEX idx_name (first_name, last_name),
        INDEX idx_email (email),
        INDEX idx_phone (phone)
      )
    `);

    // Doctors table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS doctors (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        department_id INT,
        specialization VARCHAR(100),
        license_number VARCHAR(50),
        experience_years INT,
        consultation_fee DECIMAL(10,2),
        availability_schedule JSON,
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_department (department_id),
        INDEX idx_specialization (specialization)
      )
    `);

    // Appointments table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        patient_id INT NOT NULL,
        doctor_id INT NOT NULL,
        department_id INT,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        duration_minutes INT DEFAULT 30,
        status ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
        type ENUM('consultation', 'follow_up', 'emergency', 'surgery') DEFAULT 'consultation',
        notes TEXT,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
        FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_patient (patient_id),
        INDEX idx_doctor (doctor_id),
        INDEX idx_date (appointment_date),
        INDEX idx_status (status),
        INDEX idx_type (type)
      )
    `);

    // Medical records table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS medical_records (
        id INT PRIMARY KEY AUTO_INCREMENT,
        patient_id INT NOT NULL,
        doctor_id INT NOT NULL,
        appointment_id INT,
        diagnosis TEXT,
        symptoms TEXT,
        treatment TEXT,
        prescription TEXT,
        vital_signs JSON,
        lab_results JSON,
        notes TEXT,
        follow_up_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
        FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
        INDEX idx_patient (patient_id),
        INDEX idx_doctor (doctor_id),
        INDEX idx_appointment (appointment_id),
        INDEX idx_date (created_at)
      )
    `);

    // AI Reports table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS ai_reports (
        id INT PRIMARY KEY AUTO_INCREMENT,
        report_type ENUM('patient_summary', 'department_analytics', 'financial_report', 'operational_report', 'custom') NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        parameters JSON,
        generated_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_type (report_type),
        INDEX idx_generated_by (generated_by),
        INDEX idx_date (created_at)
      )
    `);

    // Insert default data
    await insertDefaultData();

    console.log('✅ Database tables initialized successfully');
    console.log('📋 Default data inserted');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    return false;
  }
};

// Insert default data
const insertDefaultData = async () => {
  try {
    // Insert default departments
    await pool.execute(`
      INSERT IGNORE INTO departments (name, description, location) VALUES
      ('Cardiology', 'Heart and cardiovascular system care', 'Floor 2, Wing A'),
      ('Neurology', 'Brain and nervous system disorders', 'Floor 3, Wing B'),
      ('Orthopedics', 'Bone, joint, and muscle care', 'Floor 1, Wing C'),
      ('Pediatrics', 'Medical care for children', 'Floor 2, Wing D'),
      ('Emergency Medicine', 'Emergency and urgent care', 'Ground Floor, Main Entrance'),
      ('Radiology', 'Medical imaging and diagnostics', 'Floor 1, Wing E'),
      ('Oncology', 'Cancer treatment and care', 'Floor 4, Wing A'),
      ('Dermatology', 'Skin, hair, and nail care', 'Floor 2, Wing F')
    `);

    // Insert default admin user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await pool.execute(`
      INSERT IGNORE INTO users (email, password, role, first_name, last_name) VALUES
      ('admin@hospital.com', ?, 'admin', 'System', 'Administrator')
    `, [hashedPassword]);

    // Insert sample doctor users
    const doctorPassword = await bcrypt.hash('doctor123', 10);
    await pool.execute(`
      INSERT IGNORE INTO users (email, password, role, first_name, last_name, phone) VALUES
      ('dr.smith@hospital.com', ?, 'doctor', 'John', 'Smith', '+1-555-0101'),
      ('dr.johnson@hospital.com', ?, 'doctor', 'Sarah', 'Johnson', '+1-555-0102'),
      ('dr.williams@hospital.com', ?, 'doctor', 'Michael', 'Williams', '+1-555-0103')
    `, [doctorPassword, doctorPassword, doctorPassword]);

    // Insert sample patients
    await pool.execute(`
      INSERT IGNORE INTO patients (patient_id, first_name, last_name, email, phone, date_of_birth, gender, address, emergency_contact_name, emergency_contact_phone, blood_type, allergies, medical_history, insurance_provider, insurance_number) VALUES
      ('PAT001', 'Alice', 'Johnson', 'alice.johnson@email.com', '+1-555-1001', '1985-03-15', 'female', '123 Main St, City, State 12345', 'Bob Johnson', '+1-555-1002', 'A+', 'Penicillin', 'Hypertension, Diabetes Type 2', 'Blue Cross Blue Shield', 'BC123456789'),
      ('PAT002', 'Robert', 'Smith', 'robert.smith@email.com', '+1-555-2001', '1978-07-22', 'male', '456 Oak Ave, City, State 12345', 'Mary Smith', '+1-555-2002', 'O+', 'None', 'Previous heart surgery', 'Aetna', 'AE987654321'),
      ('PAT003', 'Emily', 'Davis', 'emily.davis@email.com', '+1-555-3001', '1992-11-08', 'female', '789 Pine St, City, State 12345', 'David Davis', '+1-555-3002', 'B+', 'Shellfish', 'Asthma', 'Cigna', 'CI456789123')
    `);

    console.log('📊 Sample data inserted successfully');
  } catch (error) {
    console.error('Error inserting default data:', error.message);
  }
};

// Get database statistics
const getDatabaseStats = async () => {
  try {
    if (!pool) {
      await initializeConnection();
    }

    const [usersCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [patientsCount] = await pool.execute('SELECT COUNT(*) as count FROM patients');
    const [doctorsCount] = await pool.execute('SELECT COUNT(*) as count FROM doctors');
    const [appointmentsCount] = await pool.execute('SELECT COUNT(*) as count FROM appointments');
    const [departmentsCount] = await pool.execute('SELECT COUNT(*) as count FROM departments');
    const [reportsCount] = await pool.execute('SELECT COUNT(*) as count FROM ai_reports');

    return {
      users: usersCount[0].count,
      patients: patientsCount[0].count,
      doctors: doctorsCount[0].count,
      appointments: appointmentsCount[0].count,
      departments: departmentsCount[0].count,
      reports: reportsCount[0].count
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    return null;
  }
};

module.exports = {
  pool,
  testConnection,
  initializeDatabase,
  getDatabaseStats,
  initializeConnection
};