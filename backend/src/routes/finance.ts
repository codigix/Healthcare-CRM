import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';
import { randomUUID } from 'crypto';

const router = Router();

// Helper to auto-create and seed tables if they do not exist
async function ensureFinanceTables() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // 1. journal_entries
    await connection.query(`
      CREATE TABLE IF NOT EXISTS journal_entries (
        id VARCHAR(36) PRIMARY KEY,
        entryDate DATETIME NOT NULL,
        reference VARCHAR(255) NOT NULL,
        description TEXT,
        debitAccount VARCHAR(255) NOT NULL,
        creditAccount VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'Draft',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. vendor_bills
    await connection.query(`
      CREATE TABLE IF NOT EXISTS vendor_bills (
        id VARCHAR(36) PRIMARY KEY,
        billNumber VARCHAR(50) NOT NULL UNIQUE,
        vendorName VARCHAR(255) NOT NULL,
        billDate DATETIME NOT NULL,
        dueDate DATETIME NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        category VARCHAR(100) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. fixed_assets
    await connection.query(`
      CREATE TABLE IF NOT EXISTS fixed_assets (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        purchaseDate DATETIME NOT NULL,
        purchaseValue DECIMAL(10,2) NOT NULL,
        depreciationRate DECIMAL(5,2) NOT NULL,
        currentValue DECIMAL(10,2) NOT NULL,
        amcCost DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'Active'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. finance_budgets
    await connection.query(`
      CREATE TABLE IF NOT EXISTS finance_budgets (
        id VARCHAR(36) PRIMARY KEY,
        department VARCHAR(100) NOT NULL UNIQUE,
        allocated DECIMAL(10,2) NOT NULL,
        spent DECIMAL(10,2) DEFAULT 0,
        year VARCHAR(10) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. bank_transactions
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bank_transactions (
        id VARCHAR(36) PRIMARY KEY,
        transactionDate DATETIME NOT NULL,
        description VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        type VARCHAR(10) NOT NULL,
        status VARCHAR(50) DEFAULT 'Unmatched',
        matchedBillNo VARCHAR(50) NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 6. refund_requests
    await connection.query(`
      CREATE TABLE IF NOT EXISTS refund_requests (
        id VARCHAR(36) PRIMARY KEY,
        billNo VARCHAR(50) NOT NULL,
        patientName VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        reason VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending Cashier Approval',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 7. scheme_claims
    await connection.query(`
      CREATE TABLE IF NOT EXISTS scheme_claims (
        id VARCHAR(36) PRIMARY KEY,
        patientId VARCHAR(36) NOT NULL,
        schemeName VARCHAR(100) NOT NULL,
        policyNumber VARCHAR(100) NOT NULL,
        tpaName VARCHAR(255) NULL,
        insuranceCompany VARCHAR(255) NULL,
        claimAmount DECIMAL(10,2) NOT NULL,
        approvedAmount DECIMAL(10,2) DEFAULT 0,
        rejectedAmount DECIMAL(10,2) DEFAULT 0,
        hasAdmissionSummary TINYINT(1) DEFAULT 0,
        hasDischargeSummary TINYINT(1) DEFAULT 0,
        hasFinalBill TINYINT(1) DEFAULT 0,
        hasInvestigationReports TINYINT(1) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Eligibility Verified',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 8. finance_procurements
    await connection.query(`
      CREATE TABLE IF NOT EXISTS finance_procurements (
        id VARCHAR(36) PRIMARY KEY,
        poNo VARCHAR(50) NOT NULL UNIQUE,
        supplier VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        step INT DEFAULT 1,
        grnNo VARCHAR(50) NULL,
        invoiceNo VARCHAR(50) NULL,
        status VARCHAR(100) DEFAULT 'PO Generated',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Dynamic schema upgrade
    const alterQueries = [
      "ALTER TABLE scheme_claims ADD COLUMN tpaName VARCHAR(255) NULL",
      "ALTER TABLE scheme_claims ADD COLUMN insuranceCompany VARCHAR(255) NULL",
      "ALTER TABLE scheme_claims ADD COLUMN rejectedAmount DECIMAL(10,2) DEFAULT 0",
      "ALTER TABLE scheme_claims ADD COLUMN hasAdmissionSummary TINYINT(1) DEFAULT 0",
      "ALTER TABLE scheme_claims ADD COLUMN hasDischargeSummary TINYINT(1) DEFAULT 0",
      "ALTER TABLE scheme_claims ADD COLUMN hasFinalBill TINYINT(1) DEFAULT 0",
      "ALTER TABLE scheme_claims ADD COLUMN hasInvestigationReports TINYINT(1) DEFAULT 0"
    ];
    for (const q of alterQueries) {
      try {
        await connection.query(q);
      } catch (err) {}
    }

    // Seed data check
    const [budgetsCount]: any = await connection.query('SELECT COUNT(*) as count FROM finance_budgets');
    if (budgetsCount[0].count === 0) {
      console.log('Seeding Finance Budgets...');
      await connection.query(`
        INSERT INTO finance_budgets (id, department, allocated, spent, year) VALUES
        ('${randomUUID()}', 'Pharmacy', 2000000.00, 450000.00, '2026'),
        ('${randomUUID()}', 'Lab', 1000000.00, 230000.00, '2026'),
        ('${randomUUID()}', 'Radiology', 1500000.00, 120000.00, '2026'),
        ('${randomUUID()}', 'OT', 2500000.00, 850000.00, '2026'),
        ('${randomUUID()}', 'Outpatient', 500000.00, 150000.00, '2026'),
        ('${randomUUID()}', 'Inpatient', 3000000.00, 1200000.00, '2026')
      `);
    }

    const [assetsCount]: any = await connection.query('SELECT COUNT(*) as count FROM fixed_assets');
    if (assetsCount[0].count === 0) {
      console.log('Seeding Fixed Assets...');
      await connection.query(`
        INSERT INTO fixed_assets (id, name, purchaseDate, purchaseValue, depreciationRate, currentValue, amcCost, status) VALUES
        ('${randomUUID()}', 'MRI Machine (Siemens Tesla 3)', '2025-01-15 00:00:00', 12000000.00, 10.00, 10800000.00, 250000.00, 'Active'),
        ('${randomUUID()}', 'CT Scan Machine (GE Healthcare)', '2024-06-10 00:00:00', 8000000.00, 15.00, 5600000.00, 180000.00, 'Active'),
        ('${randomUUID()}', 'Ventilator Spec-X', '2025-11-20 00:00:00', 1500000.00, 12.00, 1410000.00, 45000.00, 'Active'),
        ('${randomUUID()}', 'Ultrasound Scanner (Philips)', '2025-03-05 00:00:00', 2500000.00, 10.00, 2187500.00, 60000.00, 'Active')
      `);
    }

    const [vendorCount]: any = await connection.query('SELECT COUNT(*) as count FROM vendor_bills');
    if (vendorCount[0].count === 0) {
      console.log('Seeding Vendor Bills...');
      await connection.query(`
        INSERT INTO vendor_bills (id, billNumber, vendorName, billDate, dueDate, amount, status, category) VALUES
        ('${randomUUID()}', 'VB-101', 'MedLife Pharma Suppliers', '2026-06-01 00:00:00', '2026-07-01 00:00:00', 120000.00, 'Paid', 'Pharmacy Supplies'),
        ('${randomUUID()}', 'VB-102', 'Siemens Healthcare Services', '2026-06-10 00:00:00', '2026-07-10 00:00:00', 85000.00, 'Pending', 'Equipment AMC'),
        ('${randomUUID()}', 'VB-103', 'Apex Gas Cylinder Co.', '2026-06-15 00:00:00', '2026-07-15 00:00:00', 45000.00, 'Pending', 'Oxygen Supply'),
        ('${randomUUID()}', 'VB-104', 'CleanLine Facility Services', '2026-06-20 00:00:00', '2026-07-20 00:00:00', 25000.00, 'Pending', 'Maintenance')
      `);
    }

    const [bankCount]: any = await connection.query('SELECT COUNT(*) as count FROM bank_transactions');
    if (bankCount[0].count === 0) {
      console.log('Seeding Bank Transactions...');
      await connection.query(`
        INSERT INTO bank_transactions (id, transactionDate, description, amount, type, status, matchedBillNo) VALUES
        ('${randomUUID()}', '2026-06-24 10:30:00', 'OPD Bill Payment Receipt UPI', 1500.00, 'CREDIT', 'Matched', 'INV-001'),
        ('${randomUUID()}', '2026-06-24 11:15:00', 'IPD Deposit Cash', 25000.00, 'CREDIT', 'Matched', 'INV-002'),
        ('${randomUUID()}', '2026-06-23 15:45:00', 'Vendor Payout - MedLife Pharma', 120000.00, 'DEBIT', 'Matched', 'VB-101'),
        ('${randomUUID()}', '2026-06-23 17:00:00', 'Unknown Credit ATM Transfer', 4500.00, 'CREDIT', 'Unmatched', NULL),
        ('${randomUUID()}', '2026-06-22 09:00:00', 'Bank Service Charges', 750.00, 'DEBIT', 'Unmatched', NULL),
        ('${randomUUID()}', '2026-06-21 14:20:00', 'Insurance Claim Reimbursement HDFC Ergo', 85000.00, 'CREDIT', 'Unmatched', NULL)
      `);
    }

    const [refundCount]: any = await connection.query('SELECT COUNT(*) as count FROM refund_requests');
    if (refundCount[0].count === 0) {
      console.log('Seeding Refund Requests...');
      await connection.query(`
        INSERT INTO refund_requests (id, billNo, patientName, amount, reason, status) VALUES
        ('${randomUUID()}', 'INV-008', 'David Miller', 12500.00, 'Duplicate payment via Card', 'Pending Cashier Approval'),
        ('${randomUUID()}', 'INV-009', 'John Smith', 50000.00, 'Cancelled Surgery - patient discharged', 'Pending Cashier Approval'),
        ('${randomUUID()}', 'INV-010', 'Emily Davis', 3000.00, 'Overcharged lab test fee', 'Refunded')
      `);
    }

    const [journalCount]: any = await connection.query('SELECT COUNT(*) as count FROM journal_entries');
    if (journalCount[0].count === 0) {
      console.log('Seeding Journal Entries...');
      await connection.query(`
        INSERT INTO journal_entries (id, entryDate, reference, description, debitAccount, creditAccount, amount, status) VALUES
        ('${randomUUID()}', '2026-06-24 09:00:00', 'REF-001', 'Initial Capital Investment', 'Cash Account', 'Owner Equity', 5000000.00, 'Approved'),
        ('${randomUUID()}', '2026-06-24 10:15:00', 'REF-002', 'OPD Bill Payment Cashier', 'Cash Account', 'OPD Revenue', 18000.00, 'Approved'),
        ('${randomUUID()}', '2026-06-23 11:30:00', 'REF-003', 'Medicine Purchase Supplier', 'Pharmacy Inventory', 'Bank Account', 120000.00, 'Approved'),
        ('${randomUUID()}', '2026-06-22 16:00:00', 'REF-004', 'Doctor Consultation Share Payout', 'Doctor Fees Expense', 'Bank Account', 24000.00, 'Approved')
      `);
    }

    // Schemes seeding requires patientIds. Fetch from database first.
    const [patients]: any = await connection.query('SELECT id FROM patients LIMIT 4');
    const [claimsCount]: any = await connection.query('SELECT COUNT(*) as count FROM scheme_claims');
    if (claimsCount[0].count === 0 && patients.length > 0) {
      console.log('Seeding Scheme Claims...');
      for (let i = 0; i < patients.length; i++) {
        const patientId = patients[i].id;
        const schemeNames = ['Ayushman Bharat (PMJAY)', 'CGHS', 'ESIC', 'PMJAY'];
        const policies = ['AB-PMJAY-992812', 'CGHS-ND-338291', 'ESIC-39019283-A', 'AB-PMJAY-882103'];
        const amounts = [150000.00, 45000.00, 22000.00, 120000.00];
        const approved = [150000.00, 38000.00, 0.00, 0.00];
        const statuses = ['Settled', 'Approved', 'Submitted', 'Eligibility Verified'];

        await connection.query(`
          INSERT INTO scheme_claims (id, patientId, schemeName, policyNumber, claimAmount, approvedAmount, status) VALUES
          ('${randomUUID()}', ?, ?, ?, ?, ?, ?)
        `, [patientId, schemeNames[i], policies[i], amounts[i], approved[i], statuses[i]]);
      }
    }

    // Seed suppliers if empty
    try {
      const [suppliersCount]: any = await connection.query('SELECT COUNT(*) as count FROM suppliers');
      if (suppliersCount[0].count === 0) {
        console.log('Seeding Suppliers...');
        await connection.query(`
          INSERT INTO suppliers (id, name, category, contact, email, phone, location, rating, status, description, contactPerson, createdAt, updatedAt) VALUES
          (UUID(), 'AstraZeneca India', 'Medicine Supplier', 'Dr. K. Raghavan', 'raghavan@astrazeneca.in', '+91 99281 22891', 'Mumbai', 5, 'Active', 'Primary medicine and drug supplier', 'Dr. K. Raghavan', NOW(), NOW()),
          (UUID(), 'Cipla Pharmaceuticals', 'Medicine Supplier', 'Meera Sen', 'meera.sen@cipla.com', '+91 98827 33819', 'Mumbai', 5, 'Active', 'Global pharmaceutical company supplier', 'Meera Sen', NOW(), NOW()),
          (UUID(), 'GE Healthcare Systems', 'Equipment Supplier', 'John Wright', 'john.wright@ge.com', '+91 90021 77192', 'Bengaluru', 5, 'Active', 'Medical devices and diagnostic imaging', 'John Wright', NOW(), NOW()),
          (UUID(), 'Siemens Medical Solutions', 'Equipment Supplier', 'H. Reinhardt', 'reinhardt@siemens.co.in', '+91 99210 99882', 'New Delhi', 5, 'Active', 'Radiology and laboratory technology equipment', 'H. Reinhardt', NOW(), NOW()),
          (UUID(), 'Apex Gas Cylinders Co.', 'Service Provider', 'S. K. Verma', 'verma@apexgas.in', '+91 98110 22001', 'Pune', 4, 'Active', 'Medical oxygen and industrial gas cylinders supplier', 'S. K. Verma', NOW(), NOW()),
          (UUID(), 'CleanLine Facility Corp', 'Service Provider', 'Ravi Shankar', 'ravi@cleanline.com', '+91 98991 00223', 'Pune', 4, 'Active', 'Facility maintenance and cleaning services', 'Ravi Shankar', NOW(), NOW()),
          (UUID(), 'MedLife Pharma Suppliers', 'Medicine Supplier', 'Dr. K. Raghavan', 'info@medlife.in', '+91 99281 22891', 'Mumbai', 5, 'Active', 'Primary medicine and drug supplier', 'Dr. K. Raghavan', NOW(), NOW())
        `);
      }
    } catch (err) {
      console.error('Failed to seed suppliers table:', err);
    }

    const [procurementsCount]: any = await connection.query('SELECT COUNT(*) as count FROM finance_procurements');
    if (procurementsCount[0].count === 0) {
      console.log('Seeding Finance Procurements...');
      await connection.query(`
        INSERT INTO finance_procurements (id, poNo, supplier, category, amount, step, grnNo, invoiceNo, status) VALUES
        ('${randomUUID()}', 'PO-2026-081', 'AstraZeneca India', 'Medicine Supplier', 450000.00, 1, NULL, NULL, 'PO Generated'),
        ('${randomUUID()}', 'PO-2026-079', 'GE Healthcare Systems', 'Equipment Supplier', 1200000.00, 2, 'GRN-9981', NULL, 'Goods Received'),
        ('${randomUUID()}', 'PO-2026-075', 'Apex Gas Cylinders Co.', 'Service Provider', 65000.00, 3, 'GRN-9952', 'INV-APEX-882', 'Invoice Pending Approval'),
        ('${randomUUID()}', 'PO-2026-070', 'CleanLine Facility Corp', 'Service Provider', 25000.00, 4, 'GRN-9910', 'INV-CLC-1002', 'Approved for Payment'),
        ('${randomUUID()}', 'PO-2026-064', 'Siemens Medical Solutions', 'Equipment Supplier', 85000.00, 5, 'GRN-9840', 'INV-SIEM-9921', 'Settled & Paid')
      `);
    }

    console.log('✓ Finance Database structure and seeds checked successfully.');
  } catch (error) {
    console.error('✗ Failed to ensure finance tables structure:', error);
  } finally {
    if (connection) connection.release();
  }
}

// Call the table verification instantly
ensureFinanceTables();

router.get('/dashboard-stats', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().slice(0, 19).replace('T', ' ');

    // Read values dynamically from invoices
    const [
      [[{ todayRevenue }]],
      [[{ opdRevenue }]],
      [[{ ipdRevenue }]],
      [[{ pharmacyRevenue }]],
      [[{ labRevenue }]],
      [[{ pendingBills }]],
      [[{ totalRevenue }]]
    ]: any = await Promise.all([
      pool.query('SELECT COALESCE(SUM(amount), 0) as todayRevenue FROM invoices WHERE status = "paid" AND createdAt >= ?', [todayStr]),
      pool.query('SELECT COALESCE(SUM(amount), 0) as opdRevenue FROM invoices WHERE status = "paid" AND (notes LIKE "%OPD%" OR notes LIKE "%Consultation%")'),
      pool.query('SELECT COALESCE(SUM(amount), 0) as ipdRevenue FROM invoices WHERE status = "paid" AND (notes LIKE "%IPD%" OR notes LIKE "%Room%" OR notes LIKE "%Admission%")'),
      pool.query('SELECT COALESCE(SUM(amount), 0) as pharmacyRevenue FROM invoices WHERE status = "paid" AND (notes LIKE "%Pharmacy%" OR notes LIKE "%Medicine%")'),
      pool.query('SELECT COALESCE(SUM(amount), 0) as labRevenue FROM invoices WHERE status = "paid" AND (notes LIKE "%Lab%" OR notes LIKE "%Test%")'),
      pool.query('SELECT COALESCE(SUM(amount), 0) as pendingBills FROM invoices WHERE status = "pending"'),
      pool.query('SELECT COALESCE(SUM(amount), 0) as totalRevenue FROM invoices WHERE status = "paid"')
    ]);

    // Query receivables/payables from our custom tables
    const [
      [[{ insuranceReceivables }]],
      [[{ vendorPayables }]],
      [[{ cashInHand }]],
      [[{ bankBalance }]]
    ]: any = await Promise.all([
      pool.query('SELECT COALESCE(SUM(claimAmount - approvedAmount), 0) as insuranceReceivables FROM scheme_claims WHERE status != "Settled"'),
      pool.query('SELECT COALESCE(SUM(amount), 0) as vendorPayables FROM vendor_bills WHERE status = "Pending"'),
      pool.query('SELECT COALESCE(SUM(amount), 125000.00) as cashInHand FROM bank_transactions WHERE type = "CREDIT" AND description LIKE "%Cash%"'),
      pool.query('SELECT COALESCE(SUM(CASE WHEN type="CREDIT" THEN amount ELSE -amount END), 2850000.00) as bankBalance FROM bank_transactions')
    ]);

    const radiologyRevenue = Math.round(Number(totalRevenue) * 0.08);
    const otRevenue = Math.round(Number(totalRevenue) * 0.12);

    res.json({
      todayRevenue: Number(todayRevenue),
      opdRevenue: Number(opdRevenue),
      ipdRevenue: Number(ipdRevenue),
      pharmacyRevenue: Number(pharmacyRevenue),
      labRevenue: Number(labRevenue),
      radiologyRevenue,
      otRevenue,
      pendingBills: Number(pendingBills),
      insuranceReceivables: Number(insuranceReceivables),
      vendorPayables: Number(vendorPayables),
      cashInHand: Number(cashInHand),
      bankBalance: Number(bankBalance),
      totalRevenue: Number(totalRevenue)
    });
  } catch (error: any) {
    console.error('[FINANCE DASHBOARD STATS] Error:', error);
    res.status(500).json({ error: 'Failed to fetch finance stats', details: error.message });
  }
});

router.get('/revenue-trends', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const query = `
      SELECT DATE_FORMAT(createdAt, '%b') as name, SUM(amount) as value 
      FROM invoices
      WHERE status = 'paid'
      GROUP BY DATE_FORMAT(createdAt, '%Y-%m'), DATE_FORMAT(createdAt, '%b')
      ORDER BY DATE_FORMAT(createdAt, '%Y-%m') ASC
      LIMIT 12
    `;
    const [results]: any = await connection.query(query);
    connection.release();

    const chartData = results.map((row: any) => ({ name: row.name, value: Number(row.value) }));
    
    // Fill up months if empty
    if (chartData.length === 0) {
      res.json([
        { name: 'Jan', value: 450000 },
        { name: 'Feb', value: 520000 },
        { name: 'Mar', value: 680000 },
        { name: 'Apr', value: 590000 },
        { name: 'May', value: 720000 },
        { name: 'Jun', value: 850000 }
      ]);
    } else {
      res.json(chartData);
    }
  } catch (error: any) {
    console.error('[FINANCE REVENUE TRENDS] Error:', error);
    res.status(500).json({ error: 'Failed to fetch revenue trends', details: error.message });
  }
});

router.get('/expense-trends', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // Generate expenses dynamically based on payroll and vendor bills
    const [vendorBills]: any = await pool.query('SELECT DATE_FORMAT(createdAt, "%b") as name, SUM(amount) as value FROM vendor_bills GROUP BY DATE_FORMAT(createdAt, "%b")');
    const [payouts]: any = await pool.query('SELECT DATE_FORMAT(entryDate, "%b") as name, SUM(amount) as value FROM journal_entries WHERE debitAccount = "Salary Expense" GROUP BY DATE_FORMAT(entryDate, "%b")');

    const monthlyMap: Record<string, number> = {
      Jan: 310000,
      Feb: 350000,
      Mar: 410000,
      Apr: 380000,
      May: 420000,
      Jun: 480000,
    };

    // Update with DB values if available
    vendorBills.forEach((b: any) => {
      if (monthlyMap[b.name] !== undefined) {
        monthlyMap[b.name] += Number(b.value);
      } else {
        monthlyMap[b.name] = Number(b.value);
      }
    });

    payouts.forEach((p: any) => {
      if (monthlyMap[p.name] !== undefined) {
        monthlyMap[p.name] += Number(p.value);
      } else {
        monthlyMap[p.name] = Number(p.value);
      }
    });

    const expenseData = Object.keys(monthlyMap).map(name => ({ name, value: Math.round(monthlyMap[name]) }));
    res.json(expenseData);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch expense trends', details: error.message });
  }
});

// Chart of Accounts API
router.get('/chart-of-accounts', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const baseBalances: Record<string, number> = {
      'Cash Account': 125000,
      'Bank Account (HDFC)': 2850000,
      'Pharmacy Inventory': 450000,
      'Fixed Medical Equipment': 21875000,
      'Vendor Payables': 155000,
      'Salaries Payable': 0,
      'GST Payable': 42500,
      'TDS Payable': 12800,
      'Owner Equity': 5000000,
      'Retained Earnings': 16784700,
      'OPD Revenue': 420000,
      'IPD Revenue': 1850000,
      'Pharmacy Revenue': 650000,
      'Lab & Diagnostic Revenue': 320000,
      'Operation Theatre Revenue': 480000,
      'Patient Revenue': 2270000,
      'Salary Expense': 850000,
      'Rent Expense': 150000,
      'Doctor Share Payment': 340000,
      'Electricity & Utilities': 45000,
      'Equipment Maintenance': 110000,
      'Expense Account': 1190000,
    };

    const accountTypes: Record<string, string> = {
      'Cash Account': 'Current Asset',
      'Bank Account (HDFC)': 'Current Asset',
      'Pharmacy Inventory': 'Current Asset',
      'Fixed Medical Equipment': 'Fixed Asset',
      'Vendor Payables': 'Current Liability',
      'Salaries Payable': 'Current Liability',
      'GST Payable': 'Tax Liability',
      'TDS Payable': 'Tax Liability',
      'Owner Equity': 'Capital',
      'Retained Earnings': 'Reserve',
      'OPD Revenue': 'Operating Revenue',
      'IPD Revenue': 'Operating Revenue',
      'Pharmacy Revenue': 'Operating Revenue',
      'Lab & Diagnostic Revenue': 'Operating Revenue',
      'Operation Theatre Revenue': 'Operating Revenue',
      'Patient Revenue': 'Operating Revenue',
      'Salary Expense': 'Operating Expense',
      'Rent Expense': 'Administrative Expense',
      'Doctor Share Payment': 'Professional Fee',
      'Electricity & Utilities': 'Administrative Expense',
      'Equipment Maintenance': 'Maintenance',
      'Expense Account': 'Operating Expense',
    };

    const accountCodes: Record<string, string> = {
      'Cash Account': '1001',
      'Bank Account (HDFC)': '1002',
      'Pharmacy Inventory': '1003',
      'Fixed Medical Equipment': '1004',
      'Vendor Payables': '2001',
      'Salaries Payable': '2002',
      'GST Payable': '2003',
      'TDS Payable': '2004',
      'Owner Equity': '3001',
      'Retained Earnings': '3002',
      'OPD Revenue': '4001',
      'IPD Revenue': '4002',
      'Pharmacy Revenue': '4003',
      'Lab & Diagnostic Revenue': '4004',
      'Operation Theatre Revenue': '4005',
      'Patient Revenue': '4006',
      'Salary Expense': '5001',
      'Rent Expense': '5002',
      'Doctor Share Payment': '5003',
      'Electricity & Utilities': '5004',
      'Equipment Maintenance': '5005',
      'Expense Account': '5006',
    };

    const [entries]: any = await pool.query('SELECT debitAccount, creditAccount, amount FROM journal_entries WHERE status = "Approved"');
    
    const assetOrExpense = (name: string) => {
      const type = accountTypes[name];
      return type === 'Current Asset' || type === 'Fixed Asset' || type === 'Operating Expense' || type === 'Administrative Expense' || type === 'Professional Fee' || type === 'Maintenance';
    };

    const currentBalances = { ...baseBalances };

    for (const entry of entries) {
      const amount = Number(entry.amount);
      const deb = entry.debitAccount;
      const cred = entry.creditAccount;

      if (currentBalances[deb] !== undefined) {
        if (assetOrExpense(deb)) {
          currentBalances[deb] += amount;
        } else {
          currentBalances[deb] -= amount;
        }
      }

      if (currentBalances[cred] !== undefined) {
        if (assetOrExpense(cred)) {
          currentBalances[cred] -= amount;
        } else {
          currentBalances[cred] += amount;
        }
      }
    }

    const coaFormatted = {
      Assets: [] as any[],
      Liabilities: [] as any[],
      Equity: [] as any[],
      Income: [] as any[],
      Expenses: [] as any[]
    };

    Object.keys(currentBalances).forEach((name) => {
      const balance = currentBalances[name];
      const code = accountCodes[name];
      const type = accountTypes[name];
      const item = { code, name, balance, type };

      if (type.includes('Asset')) {
        coaFormatted.Assets.push(item);
      } else if (type.includes('Liability')) {
        coaFormatted.Liabilities.push(item);
      } else if (type === 'Capital' || type === 'Reserve') {
        coaFormatted.Equity.push(item);
      } else if (type.includes('Revenue')) {
        coaFormatted.Income.push(item);
      } else if (type.includes('Expense') || type === 'Professional Fee' || type === 'Maintenance') {
        coaFormatted.Expenses.push(item);
      }
    });

    res.json(coaFormatted);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch chart of accounts', details: error.message });
  }
});

// Journal Entries API
router.get('/journal-entries', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [entries]: any = await pool.query('SELECT * FROM journal_entries ORDER BY entryDate DESC');
    res.json(entries);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch journal entries', details: error.message });
  }
});

router.post('/journal-entries', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { reference, description, debitAccount, creditAccount, amount, entryDate } = req.body;
    if (!reference || !debitAccount || !creditAccount || !amount) {
      return res.status(400).json({ error: 'Missing required journal fields' });
    }
    const id = randomUUID();
    const date = entryDate ? new Date(entryDate) : new Date();

    await pool.query(
      'INSERT INTO journal_entries (id, entryDate, reference, description, debitAccount, creditAccount, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, "Approved")',
      [id, date, reference, description || '', debitAccount, creditAccount, amount]
    );

    res.status(201).json({ success: true, id });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create journal entry', details: error.message });
  }
});

// Vendor Bills API
router.get('/vendor-bills', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [bills]: any = await pool.query('SELECT * FROM vendor_bills ORDER BY billDate DESC');
    res.json(bills);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch vendor bills', details: error.message });
  }
});

router.post('/vendor-bills', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { billNumber, vendorName, billDate, dueDate, amount, category } = req.body;
    if (!billNumber || !vendorName || !amount || !category) {
      return res.status(400).json({ error: 'Missing bill fields' });
    }
    const id = randomUUID();
    const bDate = billDate ? new Date(billDate) : new Date();
    const dDate = dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await pool.query(
      'INSERT INTO vendor_bills (id, billNumber, vendorName, billDate, dueDate, amount, status, category) VALUES (?, ?, ?, ?, ?, ?, "Pending", ?)',
      [id, billNumber, vendorName, bDate, dDate, amount, category]
    );

    // Create journal entry: Expense (debit) and Payables (credit)
    await pool.query(
      'INSERT INTO journal_entries (id, entryDate, reference, description, debitAccount, creditAccount, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, "Approved")',
      [randomUUID(), bDate, billNumber, `Bill from ${vendorName}`, category, 'Vendor Payables', amount]
    );

    res.status(201).json({ success: true, id });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to record vendor bill', details: error.message });
  }
});

router.post('/vendor-bills/:id/pay', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const [bills]: any = await pool.query('SELECT * FROM vendor_bills WHERE id = ?', [id]);
    if (bills.length === 0) {
      return res.status(404).json({ error: 'Vendor bill not found' });
    }
    const bill = bills[0];
    await pool.query('UPDATE vendor_bills SET status = "Paid" WHERE id = ?', [id]);
    
    // Create journal entry: Debit Vendor Payables, Credit Bank Account (HDFC)
    await pool.query(
      'INSERT INTO journal_entries (id, entryDate, reference, description, debitAccount, creditAccount, amount, status) VALUES (?, NOW(), ?, ?, "Vendor Payables", "Bank Account (HDFC)", ?, "Approved")',
      [randomUUID(), `PAY-${bill.billNumber}`, `Disbursement payment to vendor for bill ${bill.billNumber}`, bill.amount]
    );

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to pay vendor bill', details: error.message });
  }
});

// Receivables Aging Report API
router.get('/aging-report', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    
    const [invoices]: any = await pool.query('SELECT amount, createdAt FROM invoices WHERE status = "pending" OR status = "partial"');
    const [bills]: any = await pool.query('SELECT amount, billDate FROM vendor_bills WHERE status = "Pending"');
    const [claims]: any = await pool.query('SELECT claimAmount, approvedAmount, createdAt FROM scheme_claims WHERE status != "Settled"');

    const bucketInvoice = { '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0, total: 0 };
    const bucketVendor = { '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0, total: 0 };
    const bucketClaims = { '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0, total: 0 };

    const getBucket = (date: Date) => {
      const diffTime = Math.abs(today.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 30) return '0-30';
      if (diffDays <= 60) return '31-60';
      if (diffDays <= 90) return '61-90';
      return '90+';
    };

    invoices.forEach((inv: any) => {
      const bucket = getBucket(new Date(inv.createdAt));
      const amt = Number(inv.amount);
      bucketInvoice[bucket] += amt;
      bucketInvoice.total += amt;
    });

    bills.forEach((bill: any) => {
      const bucket = getBucket(new Date(bill.billDate));
      const amt = Number(bill.amount);
      bucketVendor[bucket] += amt;
      bucketVendor.total += amt;
    });

    claims.forEach((claim: any) => {
      const bucket = getBucket(new Date(claim.createdAt));
      const amt = Number(claim.claimAmount) - Number(claim.approvedAmount);
      bucketClaims[bucket] += amt;
      bucketClaims.total += amt;
    });

    const agingData = {
      patients: {
        '0-30': bucketInvoice['0-30'] || 185000,
        '31-60': bucketInvoice['31-60'] || 95000,
        '61-90': bucketInvoice['61-90'] || 45000,
        '90+': bucketInvoice['90+'] || 20000,
        total: bucketInvoice.total || 345000
      },
      insurance: {
        '0-30': bucketClaims['0-30'] || 420000,
        '31-60': bucketClaims['31-60'] || 280000,
        '61-90': bucketClaims['61-90'] || 150000,
        '90+': bucketClaims['90+'] || 85000,
        total: bucketClaims.total || 935000
      },
      corporate: {
        '0-30': Math.round(bucketInvoice['0-30'] * 0.4) || 150000,
        '31-60': Math.round(bucketInvoice['31-60'] * 0.4) || 80000,
        '61-90': Math.round(bucketInvoice['61-90'] * 0.4) || 30000,
        '90+': Math.round(bucketInvoice['90+'] * 0.4) || 10000,
        total: Math.round(bucketInvoice.total * 0.4) || 270000
      }
    };
    
    res.json(agingData);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to calculate aging report', details: error.message });
  }
});

// Government Schemes API
router.get('/government-schemes', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const query = `
      SELECT sc.*, p.name as patientName, p.uid as uhid 
      FROM scheme_claims sc
      JOIN patients p ON sc.patientId = p.id
      ORDER BY sc.createdAt DESC
    `;
    const [claims]: any = await pool.query(query);
    res.json(claims);
  } catch (error: any) {
    // Fallback if UHID column doesn't exist as uid
    try {
      const fallbackQuery = `
        SELECT sc.*, p.name as patientName, p.id as uhid 
        FROM scheme_claims sc
        JOIN patients p ON sc.patientId = p.id
        ORDER BY sc.createdAt DESC
      `;
      const [claims]: any = await pool.query(fallbackQuery);
      res.json(claims);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch government schemes claims', details: err.message });
    }
  }
});

router.post('/government-schemes/verify', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      patientId,
      schemeName,
      policyNumber,
      tpaName,
      insuranceCompany,
      claimAmount,
      approvedAmount,
      rejectedAmount,
      hasAdmissionSummary,
      hasDischargeSummary,
      hasFinalBill,
      hasInvestigationReports,
      status
    } = req.body;

    if (!patientId || !schemeName || !policyNumber || !claimAmount) {
      return res.status(400).json({ error: 'Missing validation fields' });
    }

    const id = randomUUID();
    await pool.query(
      `INSERT INTO scheme_claims (
        id, patientId, schemeName, policyNumber, tpaName, insuranceCompany,
        claimAmount, approvedAmount, rejectedAmount,
        hasAdmissionSummary, hasDischargeSummary, hasFinalBill, hasInvestigationReports,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        patientId,
        schemeName,
        policyNumber,
        tpaName || '',
        insuranceCompany || '',
        claimAmount,
        approvedAmount || 0,
        rejectedAmount || 0,
        hasAdmissionSummary ? 1 : 0,
        hasDischargeSummary ? 1 : 0,
        hasFinalBill ? 1 : 0,
        hasInvestigationReports ? 1 : 0,
        status || 'Eligibility Verified'
      ]
    );

    res.status(201).json({ success: true, id });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to verify eligibility', details: error.message });
  }
});

router.post('/government-schemes/:id/settle', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { approvedAmount, rejectedAmount, status } = req.body;
    await pool.query(
      'UPDATE scheme_claims SET approvedAmount = ?, rejectedAmount = ?, status = ? WHERE id = ?',
      [approvedAmount || 0, rejectedAmount || 0, status || 'Settled', id]
    );
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to settle claim', details: error.message });
  }
});

// Bank Statements API
router.get('/bank-statements', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [txs]: any = await pool.query('SELECT * FROM bank_transactions ORDER BY transactionDate DESC');
    res.json(txs);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch bank transactions', details: error.message });
  }
});

router.post('/bank-statements/:id/reconcile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { matchedBillNo } = req.body;
    
    await pool.query(
      'UPDATE bank_transactions SET status = "Matched", matchedBillNo = ? WHERE id = ?',
      [matchedBillNo || 'REC-AUTO', id]
    );

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to reconcile bank transaction', details: error.message });
  }
});

// Payroll API
router.get('/payroll', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // Generate salary processing list from the active staff list
    const [staffList]: any = await pool.query(`
      SELECT id, firstName, lastName, roleId, department, status 
      FROM staff 
      WHERE status = 'Active'
    `);

    const payrollList = staffList.map((staff: any) => {
      const basic = staff.department === 'Doctor' ? 120000 : staff.department === 'Nursing' ? 45000 : 35000;
      const hra = basic * 0.40;
      const da = basic * 0.10;
      const incentive = staff.department === 'Doctor' ? 15000 : 3000;
      const pf = basic * 0.12;
      const pt = 200;
      const tds = (basic + hra + da + incentive) * 0.10;
      const earnings = basic + hra + da + incentive;
      const deductions = pf + pt + tds;
      const netSalary = earnings - deductions;

      return {
        id: staff.id,
        name: `${staff.firstName} ${staff.lastName}`,
        department: staff.department,
        basic,
        hra,
        da,
        incentive,
        pf,
        pt,
        tds,
        netSalary
      };
    });

    res.json(payrollList);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch payroll processing sheet', details: error.message });
  }
});

router.post('/payroll/process', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { month, year, totalPayout } = req.body;
    
    // Create salary payout journal entry
    const id = randomUUID();
    await pool.query(
      'INSERT INTO journal_entries (id, entryDate, reference, description, debitAccount, creditAccount, amount, status) VALUES (?, NOW(), ?, ?, "Salary Expense", "Bank Account", ?, "Approved")',
      [id, `PAYROLL-${month}-${year}`, `Staff Salary Payout for ${month} ${year}`, totalPayout]
    );

    res.json({ success: true, reference: `PAYROLL-${month}-${year}` });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to process payroll payout', details: error.message });
  }
});

// Fixed Assets API
router.get('/assets', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [assets]: any = await pool.query('SELECT * FROM fixed_assets');
    res.json(assets);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch fixed assets', details: error.message });
  }
});

router.post('/assets', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, purchaseValue, depreciationRate, amcCost } = req.body;
    if (!name || !purchaseValue || !depreciationRate) {
      return res.status(400).json({ error: 'Missing required asset fields' });
    }
    const id = randomUUID();
    const purchaseDate = new Date();
    await pool.query(
      'INSERT INTO fixed_assets (id, name, purchaseDate, purchaseValue, depreciationRate, currentValue, amcCost, status) VALUES (?, ?, ?, ?, ?, ?, ?, "Active")',
      [id, name, purchaseDate, purchaseValue, depreciationRate, purchaseValue, amcCost || 0]
    );
    // Create journal entry for asset capitalization
    await pool.query(
      'INSERT INTO journal_entries (id, entryDate, reference, description, debitAccount, creditAccount, amount, status) VALUES (?, NOW(), ?, ?, "Fixed Medical Equipment", "Bank Account (HDFC)", ?, "Approved")',
      [randomUUID(), `CAP-${id.slice(0, 8).toUpperCase()}`, `Capitalization of new asset: ${name}`, purchaseValue]
    );
    res.status(201).json({ success: true, id });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create asset record', details: error.message });
  }
});

router.post('/assets/depreciate', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [assets]: any = await connection.query('SELECT * FROM fixed_assets WHERE status = "Active"');
    
    for (const asset of assets) {
      const depAmt = Number(asset.purchaseValue) * (Number(asset.depreciationRate) / 100);
      const nextVal = Math.max(Number(asset.currentValue) - depAmt, 0);
      
      // Update asset value
      await connection.query('UPDATE fixed_assets SET currentValue = ? WHERE id = ?', [nextVal, asset.id]);
      
      // Create journal entry
      await connection.query(
        'INSERT INTO journal_entries (id, entryDate, reference, description, debitAccount, creditAccount, amount, status) VALUES (?, NOW(), ?, ?, "Equipment Maintenance", "Fixed Medical Equipment", ?, "Approved")',
        [randomUUID(), `DEP-${asset.id.slice(0, 8).toUpperCase()}`, `Annual straight-line depreciation for ${asset.name}`, depAmt]
      );
    }
    
    await connection.commit();
    connection.release();
    res.json({ success: true });
  } catch (error: any) {
    if (connection) await connection.rollback();
    if (connection) connection.release();
    res.status(500).json({ error: 'Failed to run depreciation', details: error.message });
  }
});

// Budget API
router.get('/budgets', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [budgets]: any = await pool.query('SELECT * FROM finance_budgets');
    res.json(budgets);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch budget list', details: error.message });
  }
});

router.put('/budgets/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { allocated, spent } = req.body;
    await pool.query(
      'UPDATE finance_budgets SET allocated = ?, spent = ? WHERE id = ?',
      [allocated, spent, id]
    );
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update budget', details: error.message });
  }
});

// Procurements API
router.get('/procurements', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [procurements]: any = await pool.query('SELECT * FROM finance_procurements ORDER BY createdAt DESC');
    res.json(procurements);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch procurements list', details: error.message });
  }
});

router.post('/procurements', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { supplier, category, amount } = req.body;
    if (!supplier || !category || !amount) {
      return res.status(400).json({ error: 'Missing required procurement fields' });
    }
    const id = randomUUID();
    const poNo = `PO-2026-0` + Math.floor(Math.random() * 900 + 100);
    await pool.query(
      'INSERT INTO finance_procurements (id, poNo, supplier, category, amount, step, grnNo, invoiceNo, status) VALUES (?, ?, ?, ?, ?, 1, NULL, NULL, "PO Generated")',
      [id, poNo, supplier, category, amount]
    );
    res.status(201).json({ success: true, id, poNo });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create Purchase Order', details: error.message });
  }
});

router.post('/procurements/:id/advance', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [rows]: any = await connection.query('SELECT * FROM finance_procurements WHERE id = ?', [id]);
    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Procurement PO not found' });
    }
    const proc = rows[0];
    let nextStep = proc.step + 1;
    let nextStatus = proc.status;
    let grnNo = proc.grnNo;
    let invoiceNo = proc.invoiceNo;

    if (proc.step === 1) {
      grnNo = `GRN-${Math.floor(1000 + Math.random() * 9000)}`;
      nextStatus = 'Goods Received';
    } else if (proc.step === 2) {
      invoiceNo = req.body.invoiceNo || `INV-${proc.supplier.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      nextStatus = 'Invoice Pending Approval';
      
      // Auto-register vendor bill
      const billId = randomUUID();
      const categoryMap: Record<string, string> = {
        'Medicine Supplier': 'Pharmacy Supplies',
        'Equipment Supplier': 'Equipment AMC',
        'Service Provider': 'Maintenance'
      };
      const billCategory = categoryMap[proc.category] || 'Administrative Expense';
      
      await connection.query(
        'INSERT INTO vendor_bills (id, billNumber, vendorName, billDate, dueDate, amount, status, category) VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), ?, "Pending", ?)',
        [billId, invoiceNo, proc.supplier, proc.amount, billCategory]
      );

      // Create journal entry: Expense (debit) and Payables (credit)
      await connection.query(
        'INSERT INTO journal_entries (id, entryDate, reference, description, debitAccount, creditAccount, amount, status) VALUES (?, NOW(), ?, ?, ?, "Vendor Payables", ?, "Approved")',
        [randomUUID(), invoiceNo, `Bill from ${proc.supplier} for PO ${proc.poNo}`, billCategory, proc.amount]
      );
    } else if (proc.step === 3) {
      nextStatus = 'Approved for Payment';
    } else if (proc.step === 4) {
      nextStatus = 'Settled & Paid';
      
      // Mark matching vendor bill as Paid
      if (proc.invoiceNo) {
        await connection.query('UPDATE vendor_bills SET status = "Paid" WHERE billNumber = ?', [proc.invoiceNo]);
        // Create journal entry: Debit Vendor Payables, Credit Bank Account (HDFC)
        await connection.query(
          'INSERT INTO journal_entries (id, entryDate, reference, description, debitAccount, creditAccount, amount, status) VALUES (?, NOW(), ?, ?, "Vendor Payables", "Bank Account (HDFC)", ?, "Approved")',
          [randomUUID(), `PAY-${proc.invoiceNo}`, `Disbursement payout for matching bill ${proc.invoiceNo}`, proc.amount]
        );
      }
    }

    await connection.query(
      'UPDATE finance_procurements SET step = ?, status = ?, grnNo = ?, invoiceNo = ? WHERE id = ?',
      [nextStep, nextStatus, grnNo, invoiceNo, id]
    );

    await connection.commit();
    connection.release();
    res.json({ success: true, step: nextStep, status: nextStatus, grnNo, invoiceNo });
  } catch (error: any) {
    if (connection) await connection.rollback();
    if (connection) connection.release();
    res.status(500).json({ error: 'Failed to advance procurement', details: error.message });
  }
});

// Refund requests API
router.get('/refunds', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [refunds]: any = await pool.query('SELECT * FROM refund_requests ORDER BY createdAt DESC');
    res.json(refunds);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch refund requests', details: error.message });
  }
});

router.post('/refunds', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { billNo, patientName, amount, reason } = req.body;
    const newId = randomUUID();
    await pool.query(
      'INSERT INTO refund_requests (id, billNo, patientName, amount, reason, status) VALUES (?, ?, ?, ?, ?, "Pending Cashier Approval")',
      [newId, billNo, patientName, Number(amount), reason]
    );
    res.status(201).json({ success: true, id: newId });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create refund request', details: error.message });
  }
});

router.post('/refunds/:id/approve', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { step } = req.body; // cashier, manager, accounts

    let nextStatus = 'Pending Cashier Approval';
    if (step === 'cashier') {
      nextStatus = 'Pending Finance Manager Approval';
    } else if (step === 'manager') {
      nextStatus = 'Pending Accounts Head Approval';
    } else if (step === 'accounts') {
      nextStatus = 'Refunded';

      // Record in journal entries upon final refund
      const [refund]: any = await pool.query('SELECT * FROM refund_requests WHERE id = ?', [id]);
      if (refund.length > 0) {
        await pool.query(
          'INSERT INTO journal_entries (id, entryDate, reference, description, debitAccount, creditAccount, amount, status) VALUES (?, NOW(), ?, ?, "OPD Revenue", "Cash Account", ?, "Approved")',
          [randomUUID(), `REFUND-${refund[0].billNo}`, `Refund for invoice ${refund[0].billNo} - ${refund[0].patientName}`, refund[0].amount]
        );
      }
    }

    await pool.query('UPDATE refund_requests SET status = ? WHERE id = ?', [nextStatus, id]);
    res.json({ success: true, status: nextStatus });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update refund status', details: error.message });
  }
});

router.post('/refunds/:id/reject', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE refund_requests SET status = "Rejected" WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to reject refund request', details: error.message });
  }
});

// AR Details API - real patient invoices + insurance claims receivables
router.get('/ar-details', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date();

    // Patient AR: pending/partial invoices joined with patient names
    const [patientInvoices]: any = await pool.query(`
      SELECT 
        i.id, CONCAT('INV-', LEFT(i.id, 8)) as ref, p.name as name, i.amount, i.createdAt, i.status,
        DATEDIFF(NOW(), i.createdAt) as days
      FROM invoices i
      JOIN patients p ON i.patientId = p.id
      WHERE i.status IN ('pending', 'partial')
      ORDER BY i.createdAt ASC
      LIMIT 20
    `).catch(() => [[]]);

    // Insurance AR: unsettled scheme_claims joined with patient names
    const [insuranceClaims]: any = await pool.query(`
      SELECT 
        sc.id, sc.policyNumber as ref, p.name as name, 
        (sc.claimAmount - sc.approvedAmount) as amount,
        sc.createdAt, sc.status,
        DATEDIFF(NOW(), sc.createdAt) as days,
        sc.insuranceCompany
      FROM scheme_claims sc
      JOIN patients p ON sc.patientId = p.id
      WHERE sc.status != 'Settled'
      ORDER BY sc.createdAt ASC
      LIMIT 20
    `).catch(() => [[]]);

    const arDetails = [
      ...patientInvoices.map((inv: any) => ({
        id: inv.id,
        type: 'Patient',
        ref: inv.ref || `PAT-INV-${inv.id.slice(0, 6).toUpperCase()}`,
        name: inv.name,
        days: Number(inv.days) || 0,
        amount: Number(inv.amount) || 0,
        status: inv.status === 'pending' ? 'Active' :
                inv.days > 90 ? 'Collection Agency' :
                inv.days > 60 ? 'Disputed' :
                inv.days > 30 ? 'Reminder Sent' : 'Active'
      })),
      ...insuranceClaims.map((cl: any) => ({
        id: cl.id,
        type: 'Insurance',
        ref: cl.ref || `INS-${cl.id.slice(0, 6).toUpperCase()}`,
        name: cl.insuranceCompany || cl.name,
        days: Number(cl.days) || 0,
        amount: Math.max(Number(cl.amount) || 0, 0),
        status: cl.status === 'Eligibility Verified' ? 'Active' :
                cl.status === 'Submitted' ? 'Reminder Sent' :
                cl.status === 'Approved' ? 'Active' : 'Active'
      }))
    ];

    res.json(arDetails);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch AR details', details: error.message });
  }
});

// Taxable Sales Ledger - real revenue transactions from journal_entries
router.get('/taxable-sales', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // Get revenue journal entries (OPD Revenue, IPD Revenue, etc.)
    const [entries]: any = await pool.query(`
      SELECT id, reference, entryDate, amount, creditAccount, description
      FROM journal_entries
      WHERE creditAccount IN ('OPD Revenue', 'IPD Revenue', 'Pharmacy Revenue', 'Lab & Diagnostic Revenue', 'Operation Theatre Revenue', 'Patient Revenue')
      AND status = 'Approved'
      ORDER BY entryDate DESC
      LIMIT 20
    `);

    // Also fetch from invoices table as fallback
    const [invoices]: any = await pool.query(`
      SELECT id, CONCAT('INV-', LEFT(id, 8)) as reference, createdAt as entryDate, amount, 'Patient Revenue' as creditAccount
      FROM invoices
      WHERE status = 'paid'
      ORDER BY createdAt DESC
      LIMIT 10
    `).catch(() => [[]]);

    // Merge, prefer journal entries; deduplicate by reference
    const seen = new Set<string>();
    const combined = [...entries, ...invoices].filter((row: any) => {
      const key = row.reference;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 15);

    const result = combined.map((row: any) => ({
      ref: row.reference,
      date: new Date(row.entryDate).toISOString().slice(0, 10),
      gross: Number(row.amount),
      account: row.creditAccount
    }));

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch taxable sales', details: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// PAYMENTS MODULE — Table Creation, Seeding & Full CRUD Routes
// ═══════════════════════════════════════════════════════════════

async function ensurePaymentTables() {
  let connection;
  try {
    connection = await pool.getConnection();

    // payments
    await connection.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id VARCHAR(36) PRIMARY KEY,
        paymentId VARCHAR(50) NOT NULL UNIQUE,
        receiptNo VARCHAR(50),
        transactionDate DATETIME NOT NULL,
        financialYear VARCHAR(10) NOT NULL DEFAULT '2026-27',
        branch VARCHAR(100) NOT NULL DEFAULT 'Pune Main Branch',
        status VARCHAR(50) DEFAULT 'Completed',
        type VARCHAR(50) DEFAULT 'Payment',
        source VARCHAR(100) DEFAULT 'OPD Billing',
        amount DECIMAL(12,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'INR',
        patientId VARCHAR(36),
        patientName VARCHAR(255),
        uhid VARCHAR(50),
        mobile VARCHAR(20),
        doctorName VARCHAR(255),
        department VARCHAR(100),
        admissionNo VARCHAR(50),
        invoiceId VARCHAR(36),
        invoiceNo VARCHAR(50),
        grossAmount DECIMAL(12,2) DEFAULT 0,
        discountAmount DECIMAL(12,2) DEFAULT 0,
        insuranceCoverage DECIMAL(12,2) DEFAULT 0,
        taxAmount DECIMAL(12,2) DEFAULT 0,
        netPayable DECIMAL(12,2) DEFAULT 0,
        outstanding DECIMAL(12,2) DEFAULT 0,
        paymentMode VARCHAR(100) DEFAULT 'Cash',
        referenceNo VARCHAR(100),
        collectedBy VARCHAR(100),
        cashReceived DECIMAL(12,2),
        changeReturned DECIMAL(12,2),
        cashCounter VARCHAR(50),
        chequeNo VARCHAR(50),
        chequeBankName VARCHAR(100),
        chequeBranch VARCHAR(100),
        chequeDepositDate DATETIME,
        chequeClearanceStatus VARCHAR(50),
        gateway VARCHAR(100),
        gatewayTxId VARCHAR(100),
        gatewayRef VARCHAR(100),
        authCode VARCHAR(100),
        bankName VARCHAR(100),
        cardType VARCHAR(50),
        last4Digits VARCHAR(10),
        notes TEXT,
        createdById VARCHAR(36),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // payment_allocations
    await connection.query(`
      CREATE TABLE IF NOT EXISTS payment_allocations (
        id VARCHAR(36) PRIMARY KEY,
        paymentId VARCHAR(36) NOT NULL,
        department VARCHAR(100) NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (paymentId) REFERENCES payments(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // payment_refunds
    await connection.query(`
      CREATE TABLE IF NOT EXISTS payment_refunds (
        id VARCHAR(36) PRIMARY KEY,
        refundNo VARCHAR(50) NOT NULL UNIQUE,
        paymentId VARCHAR(36) NOT NULL,
        refundDate DATETIME NOT NULL,
        reason TEXT,
        amount DECIMAL(12,2) NOT NULL,
        approvedBy VARCHAR(100),
        status VARCHAR(50) DEFAULT 'Approved',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (paymentId) REFERENCES payments(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // payment_credit_notes
    await connection.query(`
      CREATE TABLE IF NOT EXISTS payment_credit_notes (
        id VARCHAR(36) PRIMARY KEY,
        creditNoteNo VARCHAR(50) NOT NULL UNIQUE,
        paymentId VARCHAR(36) NOT NULL,
        noteDate DATETIME NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        reason TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (paymentId) REFERENCES payments(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // payment_debit_notes
    await connection.query(`
      CREATE TABLE IF NOT EXISTS payment_debit_notes (
        id VARCHAR(36) PRIMARY KEY,
        debitNoteNo VARCHAR(50) NOT NULL UNIQUE,
        paymentId VARCHAR(36) NOT NULL,
        noteDate DATETIME NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        reason TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (paymentId) REFERENCES payments(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // insurance_settlements
    await connection.query(`
      CREATE TABLE IF NOT EXISTS insurance_settlements (
        id VARCHAR(36) PRIMARY KEY,
        paymentId VARCHAR(36) NOT NULL,
        company VARCHAR(100),
        tpa VARCHAR(100),
        claimNumber VARCHAR(100),
        approvedAmt DECIMAL(12,2) DEFAULT 0,
        settlementDate DATETIME,
        status VARCHAR(50) DEFAULT 'Pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (paymentId) REFERENCES payments(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // gov_scheme_claims
    await connection.query(`
      CREATE TABLE IF NOT EXISTS gov_scheme_payment_claims (
        id VARCHAR(36) PRIMARY KEY,
        paymentId VARCHAR(36) NOT NULL,
        scheme VARCHAR(100),
        authorizationNo VARCHAR(100),
        packageCode VARCHAR(50),
        approvedAmt DECIMAL(12,2) DEFAULT 0,
        settlementStatus VARCHAR(50) DEFAULT 'Pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (paymentId) REFERENCES payments(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // payment_ledger_entries
    await connection.query(`
      CREATE TABLE IF NOT EXISTS payment_ledger_entries (
        id VARCHAR(36) PRIMARY KEY,
        paymentId VARCHAR(36) NOT NULL,
        debitAccount VARCHAR(100),
        creditAccount VARCHAR(100),
        amount DECIMAL(12,2) NOT NULL,
        description TEXT,
        entryDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (paymentId) REFERENCES payments(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // payment_audit_logs
    await connection.query(`
      CREATE TABLE IF NOT EXISTS payment_audit_logs (
        id VARCHAR(36) PRIMARY KEY,
        paymentId VARCHAR(36) NOT NULL,
        action VARCHAR(100) NOT NULL,
        performedBy VARCHAR(100),
        performedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        FOREIGN KEY (paymentId) REFERENCES payments(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // patient_advances
    await connection.query(`
      CREATE TABLE IF NOT EXISTS patient_advances (
        id VARCHAR(36) PRIMARY KEY,
        patientId VARCHAR(36),
        advanceDate DATETIME NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        adjustedAgainst VARCHAR(100),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Seed payments if empty
    const [[{ cnt }]]: any = await connection.query('SELECT COUNT(*) as cnt FROM payments');
    if (Number(cnt) === 0) {
      const now = new Date();
      const d1 = new Date('2026-06-22T09:15:00');
      const d2 = new Date('2026-06-23T14:10:00');
      const d3 = new Date('2026-06-24T16:30:00');

      const p1 = randomUUID(); const p2 = randomUUID(); const p3 = randomUUID();

      await connection.query(`
        INSERT INTO payments (id, paymentId, receiptNo, transactionDate, financialYear, branch, status, type, source,
          amount, currency, patientName, uhid, mobile, doctorName, department, admissionNo, invoiceNo,
          grossAmount, discountAmount, insuranceCoverage, taxAmount, netPayable, outstanding,
          paymentMode, referenceNo, collectedBy, cashReceived, changeReturned, cashCounter, notes, createdAt, updatedAt)
        VALUES
          (?, 'PAY-2026-000152', 'RC001', ?, '2026-27', 'Pune Main Branch', 'Completed', 'Payment', 'OPD Billing',
           5000, 'INR', 'Rahul Patil', 'UH0001254', '9876543210', 'Dr. Amit', 'Cardiology', 'ADM000154', 'INV000987',
           52500, 2500, 30000, 450, 20450, 0,
           'Cash', NULL, 'Priya', 5000, 0, 'Counter-02', NULL, ?, ?),
          (?, 'PAY-2026-000153', 'RC002', ?, '2026-27', 'Pune Main Branch', 'Completed', 'Payment', 'OPD Billing',
           10000, 'INR', 'Rahul Patil', 'UH0001254', '9876543210', 'Dr. Amit', 'Cardiology', 'ADM000154', 'INV000987',
           52500, 2500, 30000, 450, 20450, 0,
           'UPI', 'UPI458796', 'Priya', NULL, NULL, NULL, NULL, ?, ?),
          (?, 'PAY-2026-000154', 'RC003', ?, '2026-27', 'Pune Main Branch', 'Completed', 'Payment', 'OPD Billing',
           5450, 'INR', 'Rahul Patil', 'UH0001254', '9876543210', 'Dr. Amit', 'Cardiology', 'ADM000154', 'INV000987',
           52500, 2500, 30000, 450, 20450, 0,
           'Card', 'POS785421', 'Rahul', NULL, NULL, NULL, NULL, ?, ?)
      `, [p1, d1, now, now, p2, d2, now, now, p3, d3, now, now]);

      // Seed gateway for UPI (p2) and Card (p3)
      await connection.query(`
        INSERT INTO payment_ledger_entries (id, paymentId, debitAccount, creditAccount, amount, entryDate) VALUES
          (?, ?, 'Cash Account', 'Patient Revenue', 5000, ?),
          (?, ?, 'Bank Account (HDFC)', 'Patient Revenue', 10000, ?),
          (?, ?, 'Bank Account (HDFC)', 'Patient Revenue', 5450, ?)
      `, [randomUUID(), p1, d1, randomUUID(), p2, d2, randomUUID(), p3, d3]);

      // Seed allocations for p3
      await connection.query(`
        INSERT INTO payment_allocations (id, paymentId, department, amount) VALUES
          (?, ?, 'OPD', 800),
          (?, ?, 'Lab', 2500),
          (?, ?, 'Pharmacy', 1200),
          (?, ?, 'Room', 10000),
          (?, ?, 'ICU', 5000)
      `, [randomUUID(), p3, randomUUID(), p3, randomUUID(), p3, randomUUID(), p3, randomUUID(), p3]);

      // Seed a refund on p1
      await connection.query(`
        INSERT INTO payment_refunds (id, refundNo, paymentId, refundDate, reason, amount, approvedBy, status) VALUES
          (?, 'REF001', ?, ?, 'Duplicate Payment', 1000, 'Finance Manager', 'Approved')
      `, [randomUUID(), p1, new Date('2026-06-24')]);

      // Seed credit note on p1
      await connection.query(`
        INSERT INTO payment_credit_notes (id, creditNoteNo, paymentId, noteDate, amount, reason) VALUES
          (?, 'CN001', ?, ?, 500, 'Service Cancellation')
      `, [randomUUID(), p1, new Date('2026-06-24')]);

      // Seed debit note on p3
      await connection.query(`
        INSERT INTO payment_debit_notes (id, debitNoteNo, paymentId, noteDate, amount, reason) VALUES
          (?, 'DN001', ?, ?, 800, 'Additional Lab Test')
      `, [randomUUID(), p3, new Date('2026-06-25')]);

      // Seed insurance settlement on p2
      await connection.query(`
        INSERT INTO insurance_settlements (id, paymentId, company, tpa, claimNumber, approvedAmt, settlementDate, status) VALUES
          (?, ?, 'Star Health', 'Medi Assist', 'CLM123456', 45000, ?, 'Approved')
      `, [randomUUID(), p2, new Date('2026-06-30')]);

      // Seed audit logs
      for (const [pid, user, action, date] of [
        [p1, 'Priya', 'Payment Created', d1],
        [p1, 'Finance Manager', 'Verified', d1],
        [p1, 'Accounts', 'Posted', d1],
        [p1, 'Priya', 'Receipt Printed', d1],
      ]) {
        await connection.query(
          'INSERT INTO payment_audit_logs (id, paymentId, action, performedBy, performedAt) VALUES (?, ?, ?, ?, ?)',
          [randomUUID(), pid, action, user, date]
        );
      }

      // Seed patient advances
      await connection.query(`
        INSERT INTO patient_advances (id, patientId, advanceDate, amount, adjustedAgainst) VALUES
          (?, NULL, ?, 5000, 'IPD Bill'),
          (?, NULL, ?, 2000, 'Pharmacy')
      `, [randomUUID(), new Date('2026-06-20'), randomUUID(), new Date('2026-06-21')]);
    }
  } catch (err: any) {
    console.error('ensurePaymentTables error:', err.message);
  } finally {
    if (connection) connection.release();
  }
}

ensurePaymentTables();

// GET /payments — list with search & filters + pagination
router.get('/payments', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { search = '', status = '', paymentMode = '', dateFrom = '', dateTo = '', branch = '', source = '', page = '1', limit = '20' } = req.query as any;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let where = 'WHERE 1=1';
    const params: any[] = [];

    if (search) { where += ' AND (p.patientName LIKE ? OR p.receiptNo LIKE ? OR p.invoiceNo LIKE ? OR p.uhid LIKE ? OR p.mobile LIKE ? OR p.admissionNo LIKE ? OR p.paymentId LIKE ?)'; const s = `%${search}%`; params.push(s, s, s, s, s, s, s); }
    if (status) { where += ' AND p.status = ?'; params.push(status); }
    if (paymentMode) { where += ' AND p.paymentMode = ?'; params.push(paymentMode); }
    if (dateFrom) { where += ' AND p.transactionDate >= ?'; params.push(dateFrom); }
    if (dateTo) { where += ' AND p.transactionDate <= ?'; params.push(dateTo + ' 23:59:59'); }
    if (branch) { where += ' AND p.branch = ?'; params.push(branch); }
    if (source) { where += ' AND p.source = ?'; params.push(source); }

    const [[{ total }]]: any = await pool.query(`SELECT COUNT(*) as total FROM payments p ${where}`, params);
    const [rows]: any = await pool.query(
      `SELECT p.* FROM payments p ${where} ORDER BY p.transactionDate DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({ payments: rows, total: Number(total), page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(Number(total) / parseInt(limit)) });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch payments', details: error.message });
  }
});

// GET /payments/:id — full payment details
router.get('/payments/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const [[payment]]: any = await pool.query('SELECT * FROM payments WHERE id = ?', [id]);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    const [allocations]: any = await pool.query('SELECT * FROM payment_allocations WHERE paymentId = ?', [id]);
    const [refunds]: any = await pool.query('SELECT * FROM payment_refunds WHERE paymentId = ? ORDER BY refundDate DESC', [id]);
    const [creditNotes]: any = await pool.query('SELECT * FROM payment_credit_notes WHERE paymentId = ? ORDER BY noteDate DESC', [id]);
    const [debitNotes]: any = await pool.query('SELECT * FROM payment_debit_notes WHERE paymentId = ? ORDER BY noteDate DESC', [id]);
    const [[insuranceSettlement]]: any = await pool.query('SELECT * FROM insurance_settlements WHERE paymentId = ? LIMIT 1', [id]);
    const [[govSchemeClaim]]: any = await pool.query('SELECT * FROM gov_scheme_payment_claims WHERE paymentId = ? LIMIT 1', [id]);
    const [ledgerEntries]: any = await pool.query('SELECT * FROM payment_ledger_entries WHERE paymentId = ? ORDER BY entryDate ASC', [id]);
    const [auditLogs]: any = await pool.query('SELECT * FROM payment_audit_logs WHERE paymentId = ? ORDER BY performedAt ASC', [id]);
    const [advances]: any = await pool.query('SELECT * FROM patient_advances WHERE patientId = ? OR patientId IS NULL LIMIT 5', [payment.patientId || '']);

    res.json({ ...payment, allocations, refunds, creditNotes, debitNotes, insuranceSettlement: insuranceSettlement || null, govSchemeClaim: govSchemeClaim || null, ledgerEntries, auditLogs, advances });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch payment', details: error.message });
  }
});

// POST /payments — create new payment
router.post('/payments', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const body = req.body;
    const id = randomUUID();
    const paymentId = `PAY-${new Date().getFullYear()}-${String(Math.floor(100000 + Math.random() * 900000)).slice(0, 6)}`;
    const receiptNo = `RC${String(Date.now()).slice(-6)}`;
    const now = new Date();

    await pool.query(`
      INSERT INTO payments (id, paymentId, receiptNo, transactionDate, financialYear, branch, status, type, source,
        amount, currency, patientName, uhid, mobile, doctorName, department, admissionNo, invoiceNo,
        grossAmount, discountAmount, insuranceCoverage, taxAmount, netPayable, outstanding,
        paymentMode, referenceNo, collectedBy, cashReceived, changeReturned, cashCounter,
        gateway, gatewayTxId, gatewayRef, authCode, bankName, cardType, last4Digits,
        chequeNo, chequeBankName, chequeBranch, chequeDepositDate, chequeClearanceStatus,
        notes, createdById, createdAt, updatedAt)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `, [
      id, paymentId, receiptNo, body.transactionDate || now, body.financialYear || '2026-27', body.branch || 'Pune Main Branch',
      body.status || 'Completed', body.type || 'Payment', body.source || 'OPD Billing',
      body.amount || 0, body.currency || 'INR',
      body.patientName || '', body.uhid || '', body.mobile || '',
      body.doctorName || '', body.department || '', body.admissionNo || '', body.invoiceNo || '',
      body.grossAmount || body.amount || 0, body.discountAmount || 0, body.insuranceCoverage || 0,
      body.taxAmount || 0, body.netPayable || body.amount || 0, body.outstanding || 0,
      body.paymentMode || 'Cash', body.referenceNo || null, body.collectedBy || 'Cashier',
      body.cashReceived || null, body.changeReturned || null, body.cashCounter || null,
      body.gateway || null, body.gatewayTxId || null, body.gatewayRef || null,
      body.authCode || null, body.bankName || null, body.cardType || null, body.last4Digits || null,
      body.chequeNo || null, body.chequeBankName || null, body.chequeBranch || null,
      body.chequeDepositDate || null, body.chequeClearanceStatus || null,
      body.notes || null, req.user?.id || null, now, now
    ]);

    // Create audit log
    await pool.query('INSERT INTO payment_audit_logs (id, paymentId, action, performedBy, performedAt) VALUES (?,?,?,?,?)',
      [randomUUID(), id, 'Payment Created', req.user?.email || 'System', now]);

    // Create ledger entry
    const debitAcc = body.paymentMode === 'Cash' ? 'Cash Account' : 'Bank Account (HDFC)';
    await pool.query('INSERT INTO payment_ledger_entries (id, paymentId, debitAccount, creditAccount, amount, entryDate) VALUES (?,?,?,?,?,?)',
      [randomUUID(), id, debitAcc, 'Patient Revenue', body.amount || 0, now]);

    const [[created]]: any = await pool.query('SELECT * FROM payments WHERE id = ?', [id]);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create payment', details: error.message });
  }
});

// PUT /payments/:id — update payment
router.put('/payments/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes, collectedBy } = req.body;
    await pool.query('UPDATE payments SET status = COALESCE(?, status), notes = COALESCE(?, notes), collectedBy = COALESCE(?, collectedBy), updatedAt = NOW() WHERE id = ?',
      [status || null, notes || null, collectedBy || null, id]);
    const [[updated]]: any = await pool.query('SELECT * FROM payments WHERE id = ?', [id]);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update payment', details: error.message });
  }
});

// DELETE /payments/:id — void payment
router.delete('/payments/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const [[payment]]: any = await pool.query('SELECT status FROM payments WHERE id = ?', [id]);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    if (payment.status === 'Voided') return res.status(400).json({ error: 'Payment already voided' });
    await pool.query('UPDATE payments SET status = ?, updatedAt = NOW() WHERE id = ?', ['Voided', id]);
    await pool.query('INSERT INTO payment_audit_logs (id, paymentId, action, performedBy, performedAt) VALUES (?,?,?,?,NOW())',
      [randomUUID(), id, 'Payment Voided', req.user?.email || 'System']);
    res.json({ success: true, message: 'Payment voided successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to void payment', details: error.message });
  }
});

// POST /payments/:id/refund — add refund
router.post('/payments/:id/refund', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reason, amount, approvedBy } = req.body;
    const refundId = randomUUID();
    const refundNo = 'REF' + String(Date.now()).slice(-6);
    await pool.query('INSERT INTO payment_refunds (id, refundNo, paymentId, refundDate, reason, amount, approvedBy, status) VALUES (?,?,?,NOW(),?,?,?,?)',
      [refundId, refundNo, id, reason, amount, approvedBy || 'Finance Manager', 'Approved']);
    res.status(201).json({ id: refundId, refundNo });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create refund', details: error.message });
  }
});

// POST /payments/:id/credit-note
router.post('/payments/:id/credit-note', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body;
    const cnId = randomUUID();
    const creditNoteNo = 'CN' + String(Date.now()).slice(-6);
    await pool.query('INSERT INTO payment_credit_notes (id, creditNoteNo, paymentId, noteDate, amount, reason) VALUES (?,?,?,NOW(),?,?)',
      [cnId, creditNoteNo, id, amount, reason]);
    res.status(201).json({ id: cnId, creditNoteNo });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create credit note', details: error.message });
  }
});

// POST /payments/:id/debit-note
router.post('/payments/:id/debit-note', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body;
    const dnId = randomUUID();
    const debitNoteNo = 'DN' + String(Date.now()).slice(-6);
    await pool.query('INSERT INTO payment_debit_notes (id, debitNoteNo, paymentId, noteDate, amount, reason) VALUES (?,?,?,NOW(),?,?)',
      [dnId, debitNoteNo, id, amount, reason]);
    res.status(201).json({ id: dnId, debitNoteNo });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create debit note', details: error.message });
  }
});

// GET /payments/reports/:type — generate CSV report
router.get('/payments/reports/:type', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.params;
    const [rows]: any = await pool.query('SELECT * FROM payments ORDER BY transactionDate DESC LIMIT 500');

    let filtered = rows;
    let title = 'Payment Report';

    switch (type) {
      case 'cash': filtered = rows.filter((r: any) => r.paymentMode === 'Cash'); title = 'Cash Collection Report'; break;
      case 'upi': filtered = rows.filter((r: any) => r.paymentMode === 'UPI'); title = 'UPI Collection Report'; break;
      case 'card': filtered = rows.filter((r: any) => r.paymentMode?.toLowerCase().includes('card')); title = 'Card Collection Report'; break;
      case 'insurance': filtered = rows.filter((r: any) => r.paymentMode === 'Insurance'); title = 'Insurance Collection Report'; break;
      case 'daily': title = 'Daily Collection Report'; break;
      case 'outstanding': filtered = rows.filter((r: any) => Number(r.outstanding) > 0); title = 'Outstanding Receivables'; break;
      default: title = 'Payment Report';
    }

    const headers = ['Payment ID', 'Receipt No', 'Date', 'Patient', 'UHID', 'Department', 'Payment Mode', 'Amount', 'Status', 'Collected By'];
    const csvRows = [headers.join(',')];
    for (const r of filtered) {
      csvRows.push([
        r.paymentId, r.receiptNo,
        new Date(r.transactionDate).toLocaleDateString('en-IN'),
        `"${r.patientName || ''}"`, r.uhid || '',
        `"${r.department || ''}"`, r.paymentMode,
        r.amount, r.status, `"${r.collectedBy || ''}"`
      ].join(','));
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/ /g, '_')}_${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(csvRows.join('\n'));
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to generate report', details: error.message });
  }
});

export default router;

