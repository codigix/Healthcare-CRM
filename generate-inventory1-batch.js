const fs = require('fs');
const path = require('path');

const config = [
  // Item Master
  {
    path: 'inventory/master/items', title: 'Item Master', desc: 'Central catalog of all inventory items across the hospital.',
    cols: ['Item Code', 'Item Name', 'Category', 'Unit', 'Base Price', 'Status'],
    stats: [{ label: 'Total Items', val: '15,400', col: 'text-blue-400' }, { label: 'Active Items', val: '14,200', col: 'text-emerald-400' }, { label: 'Pending Approval', val: '15', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const categories = ['Surgical Consumables', 'Medical Equipment', 'Stationery', 'Housekeeping', 'Linen'];
      return { itemcode: 'ITM-' + (1001+i), itemname: 'Inventory Item ' + (i+1), category: categories[i], unit: 'Pieces', baseprice: '$' + (10+i*5), status: 'Active' };
    })`
  },
  {
    path: 'inventory/master/categories', title: 'Categories', desc: 'Hierarchical categorization of inventory items.',
    cols: ['Category ID', 'Category Name', 'Parent Category', 'Items Linked', 'Inventory Value', 'Status'],
    stats: [{ label: 'Total Categories', val: '45', col: 'text-blue-400' }, { label: 'Sub-Categories', val: '120', col: 'text-blue-400' }, { label: 'Highest Value', val: 'Surgicals', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const cats = ['Surgical Consumables', 'Medical Gases', 'Stationery', 'Housekeeping', 'Linen'];
      return { categoryid: 'CAT-' + (2001+i), categoryname: cats[i], parentcategory: 'General Inventory', itemslinked: (500+i*100).toString(), inventoryvalue: '$' + (50000-i*5000), status: 'Active' };
    })`
  },
  {
    path: 'inventory/master/subcategories', title: 'Sub Categories', desc: 'Detailed sub-classifications under main inventory categories.',
    cols: ['Sub ID', 'Sub Category Name', 'Parent Category', 'Items Linked', 'Manager', 'Status'],
    stats: [{ label: 'Total Sub-categories', val: '120', col: 'text-blue-400' }, { label: 'Newly Added', val: '4', col: 'text-emerald-400' }, { label: 'Empty Categories', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const subs = ['Syringes', 'Oxygen Cylinders', 'Printer Paper', 'Cleaning Liquids', 'Bed Sheets'];
      const parents = ['Surgical Consumables', 'Medical Gases', 'Stationery', 'Housekeeping', 'Linen'];
      return { subid: 'SUB-' + (3001+i), subcategoryname: subs[i], parentcategory: parents[i], itemslinked: (50+i*10).toString(), manager: 'Admin', status: 'Active' };
    })`
  },
  {
    path: 'inventory/master/units', title: 'Units of Measure', desc: 'Base units and conversion mapping (e.g., Box to Pieces).',
    cols: ['Unit Code', 'Unit Name', 'Base Unit', 'Conversion Rate', 'Used For', 'Status'],
    stats: [{ label: 'Total Units', val: '35', col: 'text-blue-400' }, { label: 'Conversion Rules', val: '85', col: 'text-emerald-400' }, { label: 'Pending Sync', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const units = ['Box (100)', 'Pack (50)', 'Dozen', 'Kilogram', 'Liter'];
      const bases = ['Piece', 'Piece', 'Piece', 'Gram', 'Milliliter'];
      const rates = ['1 Box = 100 Pcs', '1 Pack = 50 Pcs', '1 Doz = 12 Pcs', '1 Kg = 1000 g', '1 L = 1000 ml'];
      return { unitcode: 'UOM-' + (4001+i), unitname: units[i], baseunit: bases[i], conversionrate: rates[i], usedfor: 'Purchasing', status: 'Active' };
    })`
  },
  {
    path: 'inventory/master/brands', title: 'Brands', desc: 'Approved brands and manufacturers for inventory items.',
    cols: ['Brand ID', 'Brand Name', 'Manufacturer', 'Items Supplied', 'Avg Rating', 'Status'],
    stats: [{ label: 'Approved Brands', val: '450', col: 'text-blue-400' }, { label: 'Blacklisted', val: '12', col: 'text-red-400' }, { label: 'Pending Review', val: '8', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { brandid: 'BRD-' + (5001+i), brandname: 'BrandX ' + (i+1), manufacturer: 'Global Corp', itemssupplied: (15+i*5).toString(), avgrating: (4.5 - i*0.1).toFixed(1) + '/5', status: 'Approved' };
    })`
  },
  {
    path: 'inventory/master/manufacturers', title: 'Manufacturers', desc: 'Database of all OEMs and producers supplying to the hospital.',
    cols: ['Mfg ID', 'Company Name', 'Country', 'Brands Owned', 'Contracts Active', 'Status'],
    stats: [{ label: 'Total Manufacturers', val: '120', col: 'text-blue-400' }, { label: 'Domestic', val: '85', col: 'text-emerald-400' }, { label: 'International', val: '35', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { mfgid: 'MFG-' + (6001+i), companyname: 'MegaCorp ' + (i+1), country: i%2===0?'Domestic':'International', brandsowned: (2+i).toString(), contractsactive: 'Yes', status: 'Active' };
    })`
  },
  {
    path: 'inventory/master/mapping', title: 'Item Mapping', desc: 'Linking inventory items to specific departments, suppliers, or billing codes.',
    cols: ['Mapping ID', 'Item Name', 'Mapped Department', 'Preferred Supplier', 'Billing Code', 'Status'],
    stats: [{ label: 'Unmapped Items', val: '45', col: 'text-amber-400' }, { label: 'Fully Mapped', val: '15,355', col: 'text-emerald-400' }, { label: 'Supplier Conflicts', val: '2', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const depts = ['ICU', 'OT', 'General Ward', 'Laboratory', 'Radiology'];
      return { mappingid: 'MAP-' + (7001+i), itemname: 'Inventory Item ' + (i+1), mappeddepartment: depts[i], preferredsupplier: 'Supplier ' + (i+1), billingcode: 'BIL-' + (990+i), status: 'Mapped' };
    })`
  },
  {
    path: 'inventory/master/barcode', title: 'Barcode / QR Code', desc: 'Generation and management of inventory tracking barcodes.',
    cols: ['Item Code', 'Item Name', 'Barcode ID', 'Format', 'Last Printed', 'Status'],
    stats: [{ label: 'Barcodes Generated', val: '14,500', col: 'text-blue-400' }, { label: 'QR Codes', val: '3,200', col: 'text-emerald-400' }, { label: 'Missing Barcodes', val: '12', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { itemcode: 'ITM-' + (1001+i), itemname: 'Item ' + (i+1), barcodeid: 'BC-' + (8001+i), format: 'Code 128', lastprinted: '01 Jul 2026', status: 'Active' };
    })`
  },

  // Warehouse Management
  {
    path: 'inventory/warehouse/list', title: 'Warehouses', desc: 'List of all main stores, sub-stores, and off-site warehouses.',
    cols: ['Warehouse ID', 'Name', 'Location', 'Total Racks', 'Capacity Utilized', 'Status'],
    stats: [{ label: 'Total Facilities', val: '6', col: 'text-blue-400' }, { label: 'Avg Utilization', val: '78%', col: 'text-emerald-400' }, { label: 'At Capacity', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const stores = ['Main Central Store', 'OT Sub-store', 'ICU Consumables', 'Lab Store', 'General Ward Store'];
      const utilizations = ['85%', '92%', '60%', '75%', '98%'];
      const statuses = utilizations[i]==='98%'?'At Capacity':'Active';
      return { warehouseid: 'WH-' + (101+i), name: stores[i], location: 'Block ' + String.fromCharCode(65+i), totalracks: (10+i*5).toString(), capacityutilized: utilizations[i], status: statuses };
    })`
  },
  {
    path: 'inventory/warehouse/locations', title: 'Store Locations', desc: 'Detailed mapping of aisles and zones within a warehouse.',
    cols: ['Location ID', 'Warehouse', 'Zone/Aisle', 'Category Restricted', 'Current Items', 'Status'],
    stats: [{ label: 'Total Zones', val: '45', col: 'text-blue-400' }, { label: 'Cold Storage Zones', val: '4', col: 'text-emerald-400' }, { label: 'Audit Required', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { locationid: 'LOC-' + (201+i), warehouse: 'Main Central Store', zoneaisle: 'Aisle ' + (1+i), categoryrestricted: i===0?'Flammables':'None', currentitems: (500+i*100).toString(), status: 'Active' };
    })`
  },
  {
    path: 'inventory/warehouse/racks', title: 'Rack Management', desc: 'Configuration and capacity tracking of physical storage racks.',
    cols: ['Rack ID', 'Location', 'Rack Type', 'Max Weight', 'Utilization', 'Status'],
    stats: [{ label: 'Total Racks', val: '320', col: 'text-blue-400' }, { label: 'Overloaded', val: '0', col: 'text-emerald-400' }, { label: 'Maintenance', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['Heavy Duty', 'Standard Shelving', 'Cold Rack', 'Heavy Duty', 'Standard Shelving'];
      return { rackid: 'RCK-' + (301+i), location: 'Aisle 1', racktype: types[i], maxweight: '500 kg', utilization: (60+i*5) + '%', status: 'Active' };
    })`
  },
  {
    path: 'inventory/warehouse/bins', title: 'Bin Management', desc: 'Granular tracking of specific bins/boxes on racks for fast picking.',
    cols: ['Bin ID', 'Rack ID', 'Assigned Item', 'Current Qty', 'Bin Capacity', 'Status'],
    stats: [{ label: 'Total Bins', val: '2,400', col: 'text-blue-400' }, { label: 'Empty Bins', val: '145', col: 'text-amber-400' }, { label: 'Overfilled Bins', val: '4', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = i===3?'Empty':'In Use';
      return { binid: 'BIN-' + (4001+i), rackid: 'RCK-301', assigneditem: statuses==='Empty'?'-':'Item ' + (1+i), currentqty: statuses==='Empty'?'0':'45', bincapacity: '50', status: statuses };
    })`
  },

  // Stock Management
  {
    path: 'inventory/stock/current', title: 'Current Stock', desc: 'Real-time overview of inventory levels across all items and stores.',
    cols: ['Item Name', 'Warehouse', 'Current Qty', 'Unit', 'Total Value', 'Status'],
    stats: [{ label: 'Total Stock Value', val: '$1.2M', col: 'text-emerald-400' }, { label: 'Low Stock Items', val: '45', col: 'text-amber-400' }, { label: 'Out of Stock', val: '12', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const qty = (100 - i*25);
      const statuses = qty <= 0 ? 'Out of Stock' : (qty < 30 ? 'Low Stock' : 'In Stock');
      return { itemname: 'Inventory Item ' + (i+1), warehouse: 'Main Central Store', currentqty: qty.toString(), unit: 'Pcs', totalvalue: '$' + (qty*10), status: statuses };
    })`
  },
  {
    path: 'inventory/stock/ledger', title: 'Stock Ledger', desc: 'Detailed transaction history (in/out) for every inventory item.',
    cols: ['Date', 'Item Name', 'Transaction Type', 'Qty In', 'Qty Out', 'Balance'],
    stats: [{ label: 'Transactions Today', val: '450', col: 'text-blue-400' }, { label: 'Goods Received', val: '120', col: 'text-emerald-400' }, { label: 'Issues', val: '330', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const types = ['GRN Receipt', 'Dept Issue', 'Stock Transfer', 'Dept Issue', 'Adjustment'];
      const inqty = types[i]==='GRN Receipt'?'100':'-';
      const outqty = types[i].includes('Issue')?'20':'-';
      return { date: 'Today', itemname: 'Surgical Mask', transactiontype: types[i], qtyin: inqty, qtyout: outqty, balance: (500-i*20).toString() };
    })`
  },
  {
    path: 'inventory/stock/availability', title: 'Stock Availability Search', desc: 'Quick search tool to check item availability across multiple warehouses.',
    cols: ['Item Name', 'Main Store', 'OT Store', 'ICU Store', 'Ward Store', 'Status'],
    stats: [{ label: 'Searches Today', val: '1,200', col: 'text-blue-400' }, { label: 'Available Rate', val: '94%', col: 'text-emerald-400' }, { label: 'Not Found', val: '6%', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { itemname: 'Item ' + (i+1), mainstore: (50+i*10).toString(), otstore: (10+i).toString(), icustore: (5+i).toString(), wardstore: '0', status: 'Available' };
    })`
  },
  {
    path: 'inventory/stock/adjustment', title: 'Stock Adjustment', desc: 'Manual adjustments to align system records with physical counts.',
    cols: ['Adj ID', 'Item Name', 'Reason', 'System Qty', 'Adjusted Qty', 'Status'],
    stats: [{ label: 'Pending Approval', val: '8', col: 'text-amber-400' }, { label: 'Adjustments (Mo)', val: '45', col: 'text-blue-400' }, { label: 'Net Impact', val: '-$450', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Approved', 'Pending Approval', 'Approved', 'Rejected', 'Pending Approval'];
      return { adjid: 'ADJ-' + (1001+i), itemname: 'Item ' + (i+1), reason: 'Damage / Breakage', systemqty: '100', adjustedqty: '98', status: statuses[i] };
    })`
  },
  {
    path: 'inventory/stock/opening', title: 'Opening Stock', desc: 'Initial stock balances recorded at the start of a financial period.',
    cols: ['Period', 'Warehouse', 'Total Items', 'Total Value', 'Verified By', 'Status'],
    stats: [{ label: 'FY Opening Value', val: '$1.1M', col: 'text-emerald-400' }, { label: 'Stores Finalized', val: '6/6', col: 'text-blue-400' }, { label: 'Variances Pending', val: '0', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { period: 'FY 2026-27', warehouse: 'Store ' + (1+i), totalitems: (1200+i*100).toString(), totalvalue: '$' + (200000+i*10000), verifiedby: 'Auditor', status: 'Finalized' };
    })`
  },
  {
    path: 'inventory/stock/closing', title: 'Closing Stock', desc: 'Final stock balances and valuations at the end of a financial period.',
    cols: ['Period', 'Warehouse', 'Total Items', 'Total Value', 'Depreciation', 'Status'],
    stats: [{ label: 'Previous FY Closing', val: '$1.05M', col: 'text-emerald-400' }, { label: 'Draft Reports', val: '2', col: 'text-amber-400' }, { label: 'Finalized', val: '4', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Draft', 'Finalized', 'Finalized', 'Draft', 'Finalized'];
      return { period: 'FY 2025-26', warehouse: 'Store ' + (1+i), totalitems: (1100+i*100).toString(), totalvalue: '$' + (190000+i*10000), depreciation: '$' + (5000+i*500), status: statuses[i] };
    })`
  },
  {
    path: 'inventory/stock/reorder', title: 'Reorder Level Monitoring', desc: 'Monitoring items that have fallen below their defined reorder points.',
    cols: ['Item Name', 'Current Stock', 'Reorder Level', 'Suggested Order', 'Vendor', 'Status'],
    stats: [{ label: 'Items Below ROL', val: '85', col: 'text-red-400' }, { label: 'POs Generated', val: '40', col: 'text-emerald-400' }, { label: 'Pending Action', val: '45', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Pending PR', 'PR Raised', 'PO Generated', 'Pending PR', 'PO Generated'];
      return { itemname: 'Item ' + (1+i), currentstock: (10+i*2).toString(), reorderlevel: '20', suggestedorder: '100', vendor: 'Supplier X', status: statuses[i] };
    })`
  },
  {
    path: 'inventory/stock/min-max', title: 'Minimum & Maximum Stock', desc: 'Tracking inventory limits to prevent stockouts or overstocking.',
    cols: ['Item Name', 'Min Level', 'Max Level', 'Current Stock', 'Variance', 'Status'],
    stats: [{ label: 'Overstocked Items', val: '12', col: 'text-amber-400' }, { label: 'Understocked (Critical)', val: '5', col: 'text-red-400' }, { label: 'Optimal', val: '95%', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const current = (50 - i*15);
      const statuses = current < 10 ? 'Critical Low' : (current > 40 ? 'Overstocked' : 'Optimal');
      return { itemname: 'Item ' + (1+i), minlevel: '10', maxlevel: '40', currentstock: current.toString(), variance: statuses==='Optimal'?'0':(current-25).toString(), status: statuses };
    })`
  },

  // Batch & Expiry
  {
    path: 'inventory/batch/management', title: 'Batch Management', desc: 'Tracking multiple batches of items, particularly sterile consumables.',
    cols: ['Item Name', 'Batch No', 'Mfg Date', 'Expiry Date', 'Qty in Batch', 'Status'],
    stats: [{ label: 'Active Batches', val: '4,500', col: 'text-blue-400' }, { label: 'Quarantined', val: '8', col: 'text-red-400' }, { label: 'Consumed', val: '120 (Mo)', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Active', 'Active', 'Quarantined', 'Consumed', 'Active'];
      return { itemname: 'Sterile Glove', batchno: 'BTH-GLV-' + i, mfgdate: '01 Jan 2026', expirydate: '31 Dec 2027', qtyinbatch: (500-i*50).toString(), status: statuses[i] };
    })`
  },
  {
    path: 'inventory/batch/expiry', title: 'Expiry Monitoring', desc: 'Dashboard tracking items approaching expiration dates across all stores.',
    cols: ['Item Name', 'Batch No', 'Location', 'Expiry Date', 'Qty Left', 'Status'],
    stats: [{ label: 'Expired (Total)', val: '15 Items', col: 'text-red-400' }, { label: 'Value of Expired', val: '$350', col: 'text-red-400' }, { label: 'Action Required', val: '24', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = i<2?'Expired':'Expiring Soon';
      const dates = ['15 Jun 2026', '30 Jun 2026', '31 Jul 2026', '15 Aug 2026', '30 Aug 2026'];
      return { itemname: 'Item ' + (1+i), batchno: 'BTH-' + i, location: 'Main Store', expirydate: dates[i], qtyleft: (10+i*2).toString(), status: statuses };
    })`
  },
  {
    path: 'inventory/batch/near-expiry', title: 'Near Expiry Items', desc: 'Actionable list of items expiring in the next 3 to 6 months.',
    cols: ['Item Name', 'Batch No', 'Months to Expiry', 'Current Qty', 'Action Taken', 'Status'],
    stats: [{ label: 'Near Expiry Alerts', val: '45', col: 'text-amber-400' }, { label: 'Returned to Vendor', val: '12', col: 'text-emerald-400' }, { label: 'Pushed to Wards', val: '20', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const actions = ['Return to Vendor', 'Use First', 'Discount', 'Use First', 'None'];
      return { itemname: 'Item ' + (1+i), batchno: 'BTH-NX-' + i, monthstoexpiry: (2+i).toString(), currentqty: (50+i*10).toString(), actiontaken: actions[i], status: 'Monitoring' };
    })`
  },
  {
    path: 'inventory/batch/expired', title: 'Expired Items', desc: 'Log of fully expired items awaiting write-off or destruction.',
    cols: ['Item Name', 'Batch No', 'Expired On', 'Qty', 'Total Value', 'Status'],
    stats: [{ label: 'Pending Write-off', val: '15', col: 'text-amber-400' }, { label: 'Value Pending', val: '$350', col: 'text-red-400' }, { label: 'Destroyed (YTD)', val: '$1,200', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Pending Write-off', 'Written Off', 'Pending Write-off', 'Destroyed', 'Destroyed'];
      return { itemname: 'Item ' + (1+i), batchno: 'BTH-EX-' + i, expiredon: '30 Jun 2026', qty: (5+i).toString(), totalvalue: '$' + (50+i*10), status: statuses[i] };
    })`
  },
  {
    path: 'inventory/batch/recall', title: 'Recall Management', desc: 'Managing manufacturer recalls for specific batches of consumables.',
    cols: ['Recall ID', 'Item Name', 'Batch No', 'Affected Qty Located', 'Vendor Notified', 'Status'],
    stats: [{ label: 'Active Recalls', val: '2', col: 'text-red-400' }, { label: 'Quarantined Qty', val: '150', col: 'text-amber-400' }, { label: 'Resolved', val: '4', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Active Investigation', 'Quarantined', 'Returned to Vendor', 'Closed', 'Closed'];
      return { recallid: 'RCL-' + (1001+i), itemname: 'Recall Item ' + (1+i), batchno: 'BTH-REC-' + i, affectedqtylocated: (20+i*10).toString(), vendornotified: 'Yes', status: statuses[i] };
    })`
  },

  // Goods Receipt
  {
    path: 'inventory/grn/note', title: 'Goods Receipt Note (GRN)', desc: 'Creation of GRNs against Purchase Orders upon receiving vendor deliveries.',
    cols: ['GRN No', 'PO No', 'Vendor', 'Received Date', 'Total Value', 'Status'],
    stats: [{ label: 'GRNs Created Today', val: '18', col: 'text-blue-400' }, { label: 'Total Value', val: '$45,000', col: 'text-emerald-400' }, { label: 'Short Deliveries', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Draft', 'Pending QA', 'Stock Updated', 'Stock Updated', 'Draft'];
      return { grnno: 'GRN-' + (2001+i), pono: 'PO-' + (8001+i), vendor: 'Supplier ' + (1+i), receiveddate: 'Today', totalvalue: '$' + (1500+i*500), status: statuses[i] };
    })`
  },
  {
    path: 'inventory/grn/verification', title: 'GRN Verification', desc: 'Quality assurance and quantity verification for received goods.',
    cols: ['GRN No', 'Vendor', 'Items Checked', 'Discrepancies', 'Verified By', 'Status'],
    stats: [{ label: 'Pending Verification', val: '6', col: 'text-amber-400' }, { label: 'Verified Today', val: '12', col: 'text-emerald-400' }, { label: 'Rejected Lots', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Verified', 'Pending Verification', 'Rejected (Damage)', 'Verified', 'Verified'];
      return { grnno: 'GRN-' + (2001+i), vendor: 'Supplier ' + (1+i), itemschecked: (10+i*2).toString(), discrepancies: statuses[i].includes('Rejected')?'1 Box Damaged':'None', verifiedby: statuses[i].includes('Pending')?'-':'QA Team', status: statuses[i] };
    })`
  },
  {
    path: 'inventory/grn/history', title: 'GRN History', desc: 'Historical archive of all processed and finalized Goods Receipt Notes.',
    cols: ['GRN No', 'PO No', 'Vendor', 'Received Date', 'Invoice No', 'Status'],
    stats: [{ label: 'Total GRNs (YTD)', val: '1,450', col: 'text-blue-400' }, { label: 'Sent to Accounts', val: '1,440', col: 'text-emerald-400' }, { label: 'Pending Invoices', val: '10', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { grnno: 'GRN-' + (1001+i), pono: 'PO-' + (7001+i), vendor: 'Supplier ' + (1+i), receiveddate: '15 Jun 2026', invoiceno: 'INV-' + (9988+i), status: 'Finalized' };
    })`
  },
  {
    path: 'inventory/grn/pending', title: 'Pending GRN', desc: 'Deliveries that arrived but lack PO matching or are awaiting QA checks.',
    cols: ['Delivery ID', 'Carrier/Vendor', 'Gate Entry Date', 'Packages', 'Reason Pending', 'Status'],
    stats: [{ label: 'Pending at Gate', val: '4', col: 'text-amber-400' }, { label: 'PO Mismatch', val: '1', col: 'text-red-400' }, { label: 'Cleared Today', val: '15', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const reasons = ['Awaiting QA', 'No PO Reference', 'Awaiting QA', 'System Down', 'Awaiting QA'];
      return { deliveryid: 'DEL-' + (3001+i), carriervendor: 'Carrier ' + (1+i), gateentrydate: 'Today', packages: (5+i).toString(), reasonpending: reasons[i], status: 'Pending Review' };
    })`
  },

  // Department Issue
  {
    path: 'inventory/issue/request', title: 'Issue Request', desc: 'Material requisitions placed by wards, OT, and departments.',
    cols: ['Req No', 'Department', 'Requested Date', 'Total Items', 'Priority', 'Status'],
    stats: [{ label: 'New Requests', val: '24', col: 'text-blue-400' }, { label: 'Urgent', val: '3', col: 'text-red-400' }, { label: 'Processed Today', val: '45', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Pending', 'Approved', 'Pending', 'Processing', 'Approved'];
      return { reqno: 'REQ-' + (1001+i), department: 'Ward ' + (1+i), requesteddate: 'Today', totalitems: (10+i*2).toString(), priority: i===0?'Urgent':'Routine', status: statuses[i] };
    })`
  },
  {
    path: 'inventory/issue/pending', title: 'Pending Requests', desc: 'Requisitions awaiting approval or stock fulfillment.',
    cols: ['Req No', 'Department', 'Items Pending', 'Oldest Request', 'Bottleneck', 'Status'],
    stats: [{ label: 'Pending Fulfillment', val: '15', col: 'text-amber-400' }, { label: 'Partial Stock', val: '4', col: 'text-red-400' }, { label: 'Awaiting Auth', val: '5', col: 'text-blue-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const bottlenecks = ['Awaiting Stock', 'Pending HOD Auth', 'Awaiting Stock', 'Picking in Progress', 'Pending HOD Auth'];
      return { reqno: 'REQ-' + (1001+i), department: 'Dept ' + (1+i), itemspending: (5+i).toString(), oldestrequest: '2 Days Ago', bottleneck: bottlenecks[i], status: 'Pending' };
    })`
  },
  {
    path: 'inventory/issue/approved', title: 'Approved Issues', desc: 'Requisitions approved and ready for warehouse picking and dispatch.',
    cols: ['Req No', 'Department', 'Approved By', 'Pick Slip No', 'Assigned Picker', 'Status'],
    stats: [{ label: 'Ready to Pick', val: '12', col: 'text-blue-400' }, { label: 'Picking Active', val: '5', col: 'text-amber-400' }, { label: 'Ready for Dispatch', val: '8', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Ready to Pick', 'Picking', 'Ready to Pick', 'Ready for Dispatch', 'Picking'];
      return { reqno: 'REQ-' + (2001+i), department: 'Ward ' + (1+i), approvedby: 'Dr. Admin', pickslipno: 'PS-' + (101+i), assignedpicker: statuses[i]!=='Ready to Pick'?'Staff '+(1+i):'-', status: statuses[i] };
    })`
  },
  {
    path: 'inventory/issue/slip', title: 'Issue Slip', desc: 'Final document generated upon handover of items to the requesting department.',
    cols: ['Slip No', 'Req No', 'Department', 'Total Value Issued', 'Handed Over To', 'Status'],
    stats: [{ label: 'Slips Generated Today', val: '42', col: 'text-blue-400' }, { label: 'Total Value Issued', val: '$12,400', col: 'text-emerald-400' }, { label: 'Pending Signatures', val: '2', col: 'text-amber-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Issued', 'Issued', 'Pending Signature', 'Issued', 'Issued'];
      return { slipno: 'SLP-' + (3001+i), reqno: 'REQ-' + (1501+i), department: 'ICU ' + (1+i), totalvalueissued: '$' + (200+i*50), handedoverto: 'Nurse ' + (1+i), status: statuses[i] };
    })`
  },
  {
    path: 'inventory/issue/history', title: 'Issue History', desc: 'Complete historical log of all items issued to departments.',
    cols: ['Slip No', 'Date', 'Department', 'Items Issued', 'Total Value', 'Status'],
    stats: [{ label: 'Total Slips (YTD)', val: '4,500', col: 'text-blue-400' }, { label: 'Most Frequent Dept', val: 'General Ward', col: 'text-gray-400' }, { label: 'Total Value (YTD)', val: '$450K', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { slipno: 'SLP-' + (1001+i), date: '0' + (1+i) + ' Jul 2026', department: 'Dept ' + (1+i), itemsissued: (15+i*2).toString(), totalvalue: '$' + (300+i*100), status: 'Finalized' };
    })`
  },

  // Department Returns
  {
    path: 'inventory/returns/request', title: 'Return Requests', desc: 'Requests from departments to return excess or wrong items to the main store.',
    cols: ['Return Req No', 'Department', 'Reason', 'Total Items', 'Initiated By', 'Status'],
    stats: [{ label: 'Pending Requests', val: '8', col: 'text-amber-400' }, { label: 'Approved Today', val: '12', col: 'text-emerald-400' }, { label: 'Rejected', val: '1', col: 'text-red-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const reasons = ['Excess Stock', 'Wrong Item Ordered', 'Near Expiry', 'Excess Stock', 'Wrong Item Ordered'];
      const statuses = ['Pending Review', 'Approved', 'Pending Review', 'Approved', 'Rejected'];
      return { returnreqno: 'RTR-' + (1001+i), department: 'Ward ' + (1+i), reason: reasons[i], totalitems: (5+i).toString(), initiatedby: 'Nurse ' + (1+i), status: statuses[i] };
    })`
  },
  {
    path: 'inventory/returns/approval', title: 'Return Approval', desc: 'Inventory manager authorization for department returns and stock crediting.',
    cols: ['Return Req No', 'Department', 'Items', 'Est. Value', 'QA Required', 'Status'],
    stats: [{ label: 'Awaiting Auth', val: '5', col: 'text-amber-400' }, { label: 'QA Pending', val: '2', col: 'text-blue-400' }, { label: 'Stock Credited', val: '15', col: 'text-emerald-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const statuses = ['Awaiting Auth', 'Pending QA', 'Stock Credited', 'Awaiting Auth', 'Stock Credited'];
      return { returnreqno: 'RTR-' + (1001+i), department: 'OT ' + (1+i), items: (2+i).toString(), estvalue: '$' + (50+i*20), qarequired: i%2===0?'Yes':'No', status: statuses[i] };
    })`
  },
  {
    path: 'inventory/returns/history', title: 'Return History', desc: 'Historical log of all accepted department returns.',
    cols: ['Return ID', 'Date', 'Department', 'Reason', 'Credited Value', 'Status'],
    stats: [{ label: 'Total Returns (YTD)', val: '320', col: 'text-blue-400' }, { label: 'Total Value Credited', val: '$12,400', col: 'text-emerald-400' }, { label: 'Top Returning Dept', val: 'OT', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      return { returnid: 'RET-' + (2001+i), date: '0' + (1+i) + ' Jul 2026', department: 'Dept ' + (1+i), reason: 'Excess', creditedvalue: '$' + (100+i*50), status: 'Completed' };
    })`
  },
  {
    path: 'inventory/returns/damaged', title: 'Damaged Returns', desc: 'Specific handling for items returned by departments due to breakage or faults.',
    cols: ['Return ID', 'Department', 'Item Name', 'Fault Description', 'Action Taken', 'Status'],
    stats: [{ label: 'Damaged Items (Mo)', val: '18', col: 'text-red-400' }, { label: 'Pending Inspection', val: '4', col: 'text-amber-400' }, { label: 'Written Off', val: '12', col: 'text-gray-400' }],
    mockDataGenerator: `Array.from({ length: 5 }).map((_, i) => {
      const actions = ['Pending Inspection', 'Written Off', 'Sent for Repair', 'Written Off', 'Pending Inspection'];
      return { returnid: 'DRT-' + (3001+i), department: 'Lab', itemname: 'Thermometer', faultdescription: 'Broken Glass', actiontaken: actions[i], status: actions[i].includes('Pending')?'Under Review':'Resolved' };
    })`
  }
];

const template = (page, componentName) => {
  let columnsGen = "";
  page.cols.forEach(col => {
    const accessorKey = col.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (col === 'Status') {
      columnsGen += `
    { 
      header: '${col}', 
      accessor: (row: any) => {
        const val = row.${accessorKey};
        const isGood = val === 'Active' || val === 'Approved' || val === 'Mapped' || val === 'In Stock' || val === 'Available' || val === 'Finalized' || val === 'Optimal' || val === 'Stock Updated' || val === 'Verified' || val === 'Issued' || val === 'Stock Credited' || val === 'Completed' || val === 'Resolved';
        const isWarning = val === 'Pending Approval' || val === 'Pending Review' || val === 'Pending' || val === 'Processing' || val === 'Pending PR' || val === 'PR Raised' || val === 'PO Generated' || val === 'Low Stock' || val === 'Expiring Soon' || val === 'Monitoring' || val === 'Pending Write-off' || val === 'Active Investigation' || val === 'Quarantined' || val === 'Draft' || val === 'Pending QA' || val === 'Pending Verification' || val === 'Ready to Pick' || val === 'Picking' || val === 'Ready for Dispatch' || val === 'Pending Signature' || val === 'Awaiting Auth' || val === 'Under Review';
        const isNeutral = val === 'Written Off' || val === 'Consumed' || val === 'Destroyed' || val === 'Returned to Vendor' || val === 'Closed';
        const isDanger = val === 'At Capacity' || val === 'Out of Stock' || val === 'Critical Low' || val === 'Overstocked' || val === 'Expired' || val === 'Rejected' || val === 'Rejected (Damage)';
        
        let colorClass = 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
        if (isGood) colorClass = 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
        else if (isWarning) colorClass = 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
        else if (isNeutral) colorClass = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
        else if (isDanger) colorClass = 'bg-red-500/10 text-red-500 border border-red-500/20';

        return (
          <span className={"px-2 py-1 rounded text-xs font-medium " + colorClass}>
            {val}
          </span>
        )
      },
      sortable: true 
    },`;
    } else {
      columnsGen += `
    { header: '${col}', accessor: '${accessorKey}', sortable: true },`;
    }
  });


  let statsGen = "";
  page.stats.forEach(stat => {
    statsGen += `
        <div className="bg-dark-secondary rounded p-4 border border-gray-800">
          <p className="text-sm text-gray-400 font-medium">${stat.label}</p>
          <p className={"text-2xl font-bold mt-2 " + "${stat.col}"}>${stat.val}</p>
        </div>`;
  });

  return `"use client";

import React, { useState } from 'react';
import { Activity, LayoutGrid, FileText, CheckSquare, Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';
import DataTable from '@/components/UI/DataTable';

export default function ${componentName}Page() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [${columnsGen}
    { 
      header: 'Actions', 
      accessor: (row: any) => (
        <div className="flex justify-end gap-2">
          <button className="p-1.5 hover:bg-dark-tertiary rounded text-gray-400 hover:text-white transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      )
    }
  ];

  const mockData = ${page.mockDataGenerator};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={24} />
            ${page.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">${page.desc}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-dark-secondary border border-gray-700 rounded-lg text-sm font-medium hover:bg-dark-tertiary transition-colors text-white">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20 transition-all">
            <Plus size={16} /> Create New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">${statsGen}
      </div>

      <div className="">
        <div className="flex justify-between items-center my-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search records..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-white w-64 transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm hover:bg-gray-800 transition-colors text-white">
            <Filter size={16} /> Filter
          </button>
        </div>
        <DataTable 
          columns={columns} 
          data={mockData} 
          searchTerm={searchTerm} 
        />
      </div>
    </div>
  );
}`;
};

const uniqueConfig = config.filter((v, i, a) => a.findIndex(v2 => (v2.path === v.path)) === i);

uniqueConfig.forEach(page => {
  const dir = path.join(__dirname, 'frontend', 'src', 'app', ...page.path.split('/'));
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const componentName = page.title.replace(/[^a-zA-Z0-9]/g, '');
  fs.writeFileSync(path.join(dir, 'page.tsx'), template(page, componentName));
  console.log('Generated: ' + page.path);
});
