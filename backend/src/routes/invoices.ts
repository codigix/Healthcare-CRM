import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';
import PDFDocument from 'pdfkit';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, status, patientId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query = `
      SELECT i.*, p.name as patientName, p.phone as patientPhone, p.bloodGroup as patientBloodGroup
      FROM invoices i
      LEFT JOIN patients p ON i.patientId = p.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      query += ' AND i.status = ?';
      params.push(String(status));
    }

    if (patientId) {
      query += ' AND i.patientId = ?';
      params.push(String(patientId));
    }

    query += ' ORDER BY i.createdAt DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), skip);

    // Simple and robust count query construction
    const countSql = `
      SELECT COUNT(*) as total
      FROM invoices i
      WHERE 1=1
      ${status ? 'AND i.status = ?' : ''}
      ${patientId ? 'AND i.patientId = ?' : ''}
    `;
    const countParams: any[] = [];
    if (status) countParams.push(String(status));
    if (patientId) countParams.push(String(patientId));

    const connection = await pool.getConnection();
    const [invoices]: any = await connection.query(query, params);
    const [countResult]: any = await connection.query(countSql, countParams);
    const total = countResult[0].total;
    connection.release();

    const formatted = invoices.map((inv: any) => ({
      ...inv,
      patient: {
        name: inv.patientName || "Patient Walk-In",
        phone: inv.patientPhone,
        bloodGroup: inv.patientBloodGroup
      }
    }));

    res.json({ invoices: formatted, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error("Failed to fetch invoices:", error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

router.get('/:id/pdf', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [invoices]: any = await connection.query(`
      SELECT i.*, p.name as patientName, p.phone as patientPhone, p.email as patientEmail, p.address as patientAddress
      FROM invoices i
      LEFT JOIN patients p ON i.patientId = p.id
      WHERE i.id = ?
    `, [req.params.id]);

    if (invoices.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const invoice = invoices[0];

    // Dynamic prescription lookup using short RX ID
    const rxMatch = invoice.notes?.match(/RX-([A-F0-9]+)/i);
    let medicationsList: any[] = [];
    let prescriptionRef = 'N/A';

    if (rxMatch) {
      const shortId = rxMatch[1];
      prescriptionRef = `RX-${shortId.toUpperCase()}`;
      
      const [prescriptions]: any = await connection.query(`
        SELECT * FROM prescriptions 
        WHERE patientId = ? AND UPPER(id) LIKE ?
        LIMIT 1
      `, [invoice.patientId, `${shortId.toUpperCase()}%`]);

      if (prescriptions.length > 0) {
        try {
          medicationsList = JSON.parse(prescriptions[0].medications) || [];
          
          // Query the medicines table dynamically for each item to fetch actual selling price and tax
          for (const med of medicationsList) {
            const [medDb]: any = await connection.query(`
              SELECT sellingPrice, taxRate FROM medicines 
              WHERE LOWER(TRIM(name)) = LOWER(TRIM(?))
              LIMIT 1
            `, [med.name]);

            if (medDb.length > 0) {
              const basePrice = parseFloat(medDb[0].sellingPrice) || 0;
              const taxRate = parseFloat(medDb[0].taxRate) || 0;
              const priceWithTax = basePrice * (1 + taxRate / 100);
              const qtyVal = parseInt(String(med.qty || med.quantity || 1).replace(/[^0-9]/g, "")) || 1;
              med.unitPrice = priceWithTax;
              med.totalPrice = priceWithTax * qtyVal;
            } else {
              med.unitPrice = 0;
              med.totalPrice = 0;
            }
          }
        } catch (e) {
          console.error("Failed to parse medications JSON:", e);
        }
      }
    }

    connection.release();

    const doc = new PDFDocument({ margin: 50 });

    // Set response headers to force download as a PDF blob
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice_${invoice.id}.pdf`);

    doc.pipe(res);

    // Render beautiful corporate headers matching our MedixPro dark/emerald style
    doc.fillColor('#13141b').rect(0, 0, doc.page.width, 110).fill();

    doc.fillColor('#1abc9c')
       .fontSize(24)
       .text('MedixPro Medical CRM', 50, 30);
       
    doc.fillColor('#ffffff')
       .fontSize(10)
       .text('Advanced Healthcare & Pharmacy Billing Systems', 50, 60);

    doc.fillColor('#1abc9c')
       .fontSize(16)
       .text('PHARMACY INVOICE', 350, 35, { align: 'right' });

    // Metadata & Demographics Block
    doc.fillColor('#333333').fontSize(10);
    doc.text(`Receipt ID: ${invoice.id.toUpperCase()}`, 50, 135);
    doc.text(`Billing Date: ${new Date(invoice.date || invoice.createdAt).toLocaleDateString()}`, 50, 150);
    doc.text(`Prescription Ref: ${prescriptionRef}`, 50, 165);
    
    // Status Badge
    const rawStatus = String(invoice.status).toUpperCase();
    doc.text(`Payment Status: `, 50, 180);
    const textWidth = doc.widthOfString(`Payment Status: `);
    
    if (rawStatus === 'PAID') {
      doc.fillColor('#15803d').text('PAID (CONFIRMED)', 50 + textWidth, 180, { bold: true } as any);
    } else {
      doc.fillColor('#b45309').text('PENDING (DEFERRED LEDGER)', 50 + textWidth, 180, { bold: true } as any);
    }
    
    doc.fillColor('#333333');
    doc.text('Bill To (Outpatient/Inpatient):', 350, 135, { underline: true });
    doc.text(`Patient Name: ${invoice.patientName || 'Walk-In Patient'}`, 350, 150);
    doc.text(`Phone Contact: ${invoice.patientPhone || 'N/A'}`, 350, 165);
    doc.text(`Address Line: ${invoice.patientAddress || 'No Address Recorded'}`, 350, 180);

    // Separator line
    doc.moveTo(50, 210).lineTo(562, 210).strokeColor('#e5e7eb').stroke();

    // Table Column Headers
    doc.fontSize(10).fillColor('#13141b').text('Dispensation Itemized Medicines', 50, 230);
    doc.text('Dosage / Instructions', 250, 230);
    doc.text('Qty', 390, 230, { width: 50, align: 'right' });
    doc.text('Total Price', 480, 230, { width: 80, align: 'right' });

    doc.moveTo(50, 250).lineTo(562, 250).strokeColor('#e5e7eb').stroke();

    // Table Content Row
    let currentY = 270;
    if (medicationsList.length > 0) {
      medicationsList.forEach((med: any) => {
        doc.fontSize(9).fillColor('#4b5563').text(med.name, 50, currentY, { width: 190 });
        doc.text(med.instructions || med.dosage || 'None', 250, currentY, { width: 130 });
        doc.text(String(med.qty || 1), 390, currentY, { width: 50, align: 'right' });
        
        const priceStr = med.totalPrice > 0 
          ? `INR ${parseFloat(med.totalPrice).toFixed(2)}` 
          : 'INR 0.00';
        doc.fontSize(10).fillColor('#13141b').text(priceStr, 480, currentY, { width: 80, align: 'right' });
        currentY += 24;
      });
    } else {
      const noteText = invoice.notes || 'Dispensed Pharmacy Prescription Medications';
      doc.fontSize(9).fillColor('#4b5563').text(noteText, 50, currentY, { width: 280, lineGap: 4 });
      doc.text('1', 390, currentY, { width: 50, align: 'right' });
      doc.fontSize(10).fillColor('#13141b').text(`INR ${parseFloat(invoice.amount).toFixed(2)}`, 480, currentY, { width: 80, align: 'right' });
      currentY += 40;
    }

    doc.moveTo(50, currentY).lineTo(562, currentY).strokeColor('#e5e7eb').stroke();

    // Dynamic Summary positioning
    currentY += 20;
    const totalAmount = parseFloat(invoice.amount);
    const paidAmount = rawStatus === 'PAID' ? totalAmount : 0.00;
    const remainingAmount = rawStatus === 'PAID' ? 0.00 : totalAmount;

    doc.fontSize(11).fillColor('#13141b').text('Pharmacy Billing Ledger Summary:', 50, currentY);
    doc.fontSize(9).fillColor('#4b5563')
       .text(`Total Bill Gross Amount:`, 50, currentY + 25)
       .text(`INR ${totalAmount.toFixed(2)}`, 200, currentY + 25)
       .text(`Total Amount Settled (Paid):`, 50, currentY + 45)
       .text(`INR ${paidAmount.toFixed(2)}`, 200, currentY + 45)
       .text(`Remaining Balance Due:`, 50, currentY + 65)
       .text(`INR ${remainingAmount.toFixed(2)}`, 200, currentY + 65);

    // Draw bottom footer
    doc.moveTo(50, 680).lineTo(562, 680).strokeColor('#e5e7eb').stroke();
    doc.fontSize(8).fillColor('#9ca3af').text('MedixPro Medical Admin Dashboard • Automated Invoicing Module', 50, 695, { align: 'center' });
    doc.text('This is a computer-generated pharmacy receipt and does not require a physical signature.', 50, 710, { align: 'center' });

    doc.end();
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [invoices]: any = await connection.query(`
      SELECT i.*, p.name as patientName, p.phone as patientPhone, p.email as patientEmail, p.address as patientAddress
      FROM invoices i
      LEFT JOIN patients p ON i.patientId = p.id
      WHERE i.id = ?
    `, [req.params.id]);
    connection.release();

    if (invoices.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const inv = invoices[0];
    const formatted = {
      ...inv,
      patient: {
        name: inv.patientName || "Patient Walk-In",
        phone: inv.patientPhone,
        email: inv.patientEmail,
        address: inv.patientAddress
      }
    };

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { patientId, amount, status, dueDate, notes } = req.body;

    const connection = await pool.getConnection();
    const query = `INSERT INTO invoices (id, patientId, amount, status, dueDate, notes, createdAt, updatedAt)
                   VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), NOW())`;
    
    await connection.query(query, [patientId, parseFloat(amount), status || 'pending', dueDate ? new Date(dueDate) : null, notes]);

    const [invoice]: any = await connection.query('SELECT * FROM invoices WHERE patientId = ? ORDER BY createdAt DESC LIMIT 1', [patientId]);
    connection.release();

    res.status(201).json(invoice[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { amount, status, dueDate, notes } = req.body;
    const connection = await pool.getConnection();
    
    const updates: string[] = [];
    const values: any[] = [];

    if (amount !== undefined) { updates.push('amount = ?'); values.push(parseFloat(amount)); }
    if (status) { updates.push('status = ?'); values.push(status); }
    if (dueDate) { updates.push('dueDate = ?'); values.push(new Date(dueDate)); }
    if (notes !== undefined) { updates.push('notes = ?'); values.push(notes); }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updatedAt = NOW()');
    values.push(req.params.id);

    const query = `UPDATE invoices SET ${updates.join(', ')} WHERE id = ?`;
    await connection.query(query, values);
    
    const [invoice]: any = await connection.query('SELECT * FROM invoices WHERE id = ?', [req.params.id]);
    connection.release();

    res.json(invoice[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM invoices WHERE id = ?', [req.params.id]);
    connection.release();

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

export default router;
