const express = require('express');
const OpenAI = require('openai');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate AI report
router.post('/generate-report', authenticateToken, [
  body('reportType').isIn(['patient_summary', 'department_analytics', 'financial_report', 'operational_report', 'custom']),
  body('title').notEmpty().trim(),
  body('parameters').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { reportType, title, parameters = {} } = req.body;

    let prompt = '';
    let data = {};

    switch (reportType) {
      case 'patient_summary':
        data = await getPatientSummaryData(parameters);
        prompt = generatePatientSummaryPrompt(data);
        break;
      
      case 'department_analytics':
        data = await getDepartmentAnalyticsData(parameters);
        prompt = generateDepartmentAnalyticsPrompt(data);
        break;
      
      case 'financial_report':
        data = await getFinancialReportData(parameters);
        prompt = generateFinancialReportPrompt(data);
        break;
      
      case 'operational_report':
        data = await getOperationalReportData(parameters);
        prompt = generateOperationalReportPrompt(data);
        break;
      
      case 'custom':
        prompt = parameters.customPrompt || 'Generate a custom healthcare report.';
        break;
      
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    // Generate AI report
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert healthcare analyst. Generate comprehensive, accurate, and professional medical reports based on the provided data. Use medical terminology appropriately and provide actionable insights."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    const aiContent = completion.choices[0].message.content;

    // Save report to database
    const [result] = await pool.execute(
      'INSERT INTO ai_reports (report_type, title, content, parameters, generated_by) VALUES (?, ?, ?, ?, ?)',
      [reportType, title, aiContent, JSON.stringify(parameters), req.user.id]
    );

    res.json({
      message: 'Report generated successfully',
      report: {
        id: result.insertId,
        title,
        content: aiContent,
        reportType,
        parameters,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('AI report generation error:', error);
    res.status(500).json({ message: 'Server error generating AI report' });
  }
});

// Get AI reports history
router.get('/reports', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [reports] = await pool.execute(
      `SELECT ar.*, u.first_name, u.last_name 
       FROM ai_reports ar
       LEFT JOIN users u ON ar.generated_by = u.id
       ORDER BY ar.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM ai_reports');
    const total = countResult[0].total;

    res.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get AI reports error:', error);
    res.status(500).json({ message: 'Server error fetching AI reports' });
  }
});

// Get specific AI report
router.get('/reports/:id', authenticateToken, async (req, res) => {
  try {
    const [reports] = await pool.execute(
      `SELECT ar.*, u.first_name, u.last_name 
       FROM ai_reports ar
       LEFT JOIN users u ON ar.generated_by = u.id
       WHERE ar.id = ?`,
      [req.params.id]
    );

    if (reports.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(reports[0]);
  } catch (error) {
    console.error('Get AI report error:', error);
    res.status(500).json({ message: 'Server error fetching AI report' });
  }
});

// AI Assistant Chat
router.post('/chat', authenticateToken, [
  body('message').notEmpty().trim(),
  body('context').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message, context = {} } = req.body;

    // Get relevant context based on user role
    let systemContext = `You are an AI assistant for a healthcare management system. The user is a ${req.user.role}. `;
    
    if (context.patientId) {
      const patientData = await getPatientContext(context.patientId);
      systemContext += `Patient context: ${JSON.stringify(patientData)} `;
    }

    if (context.departmentId) {
      const deptData = await getDepartmentContext(context.departmentId);
      systemContext += `Department context: ${JSON.stringify(deptData)} `;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemContext + "Provide helpful, accurate, and professional assistance with healthcare management tasks."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 1000,
      temperature: 0.5,
    });

    res.json({
      message: 'AI response generated',
      response: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ message: 'Server error with AI chat' });
  }
});

// Helper functions for data gathering
async function getPatientSummaryData(parameters) {
  const { patientId, dateRange } = parameters;
  
  const [patient] = await pool.execute(
    'SELECT * FROM patients WHERE id = ?',
    [patientId]
  );

  const [appointments] = await pool.execute(
    `SELECT a.*, d.first_name as doctor_first_name, d.last_name as doctor_last_name
     FROM appointments a
     JOIN doctors doc ON a.doctor_id = doc.id
     JOIN users d ON doc.user_id = d.id
     WHERE a.patient_id = ?
     ORDER BY a.appointment_date DESC`,
    [patientId]
  );

  const [medicalRecords] = await pool.execute(
    `SELECT mr.*, d.first_name as doctor_first_name, d.last_name as doctor_last_name
     FROM medical_records mr
     JOIN doctors doc ON mr.doctor_id = doc.id
     JOIN users d ON doc.user_id = d.id
     WHERE mr.patient_id = ?
     ORDER BY mr.created_at DESC`,
    [patientId]
  );

  return { patient: patient[0], appointments, medicalRecords };
}

async function getDepartmentAnalyticsData(parameters) {
  const { departmentId, dateRange } = parameters;
  
  const [department] = await pool.execute(
    'SELECT * FROM departments WHERE id = ?',
    [departmentId]
  );

  const [doctors] = await pool.execute(
    'SELECT d.*, u.first_name, u.last_name FROM doctors d JOIN users u ON d.user_id = u.id WHERE d.department_id = ?',
    [departmentId]
  );

  const [appointments] = await pool.execute(
    `SELECT COUNT(*) as total_appointments, 
            COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
            COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled
     FROM appointments 
     WHERE department_id = ?`,
    [departmentId]
  );

  return { department: department[0], doctors, appointments: appointments[0] };
}

async function getFinancialReportData(parameters) {
  // This would integrate with billing/payment data
  return { message: 'Financial data integration needed' };
}

async function getOperationalReportData(parameters) {
  const [totalPatients] = await pool.execute('SELECT COUNT(*) as total FROM patients');
  const [totalDoctors] = await pool.execute('SELECT COUNT(*) as total FROM doctors');
  const [totalAppointments] = await pool.execute('SELECT COUNT(*) as total FROM appointments');
  const [departments] = await pool.execute('SELECT COUNT(*) as total FROM departments');

  return {
    totalPatients: totalPatients[0].total,
    totalDoctors: totalDoctors[0].total,
    totalAppointments: totalAppointments[0].total,
    totalDepartments: departments[0].total
  };
}

// Prompt generation functions
function generatePatientSummaryPrompt(data) {
  return `Generate a comprehensive patient summary report based on the following data:

Patient Information:
- Name: ${data.patient.first_name} ${data.patient.last_name}
- Patient ID: ${data.patient.patient_id}
- Date of Birth: ${data.patient.date_of_birth}
- Gender: ${data.patient.gender}
- Medical History: ${data.patient.medical_history}
- Allergies: ${data.patient.allergies}

Appointments (${data.appointments.length} total):
${data.appointments.map(apt => `- ${apt.appointment_date} with Dr. ${apt.doctor_first_name} ${apt.doctor_last_name} (${apt.status})`).join('\n')}

Medical Records (${data.medicalRecords.length} total):
${data.medicalRecords.map(record => `- ${record.created_at}: ${record.diagnosis} - Treatment: ${record.treatment}`).join('\n')}

Please provide:
1. Patient overview and current health status
2. Recent medical activity summary
3. Key health trends and patterns
4. Recommendations for future care
5. Risk factors and alerts`;
}

function generateDepartmentAnalyticsPrompt(data) {
  return `Generate a department analytics report based on the following data:

Department: ${data.department.name}
Description: ${data.department.description}
Location: ${data.department.location}

Staff: ${data.doctors.length} doctors
Appointments: ${data.appointments.total_appointments} total, ${data.appointments.completed} completed, ${data.appointments.cancelled} cancelled

Please provide:
1. Department performance overview
2. Staff utilization analysis
3. Appointment efficiency metrics
4. Areas for improvement
5. Recommendations for optimization`;
}

function generateFinancialReportPrompt(data) {
  return `Generate a financial report for the healthcare facility. Include revenue analysis, cost breakdown, and financial recommendations.`;
}

function generateOperationalReportPrompt(data) {
  return `Generate an operational report based on the following metrics:

Total Patients: ${data.totalPatients}
Total Doctors: ${data.totalDoctors}
Total Appointments: ${data.totalAppointments}
Total Departments: ${data.totalDepartments}

Please provide:
1. Overall operational overview
2. Key performance indicators
3. Resource utilization analysis
4. Operational efficiency metrics
5. Strategic recommendations`;
}

async function getPatientContext(patientId) {
  const [patient] = await pool.execute('SELECT * FROM patients WHERE id = ?', [patientId]);
  return patient[0] || null;
}

async function getDepartmentContext(departmentId) {
  const [department] = await pool.execute('SELECT * FROM departments WHERE id = ?', [departmentId]);
  return department[0] || null;
}

module.exports = router;
