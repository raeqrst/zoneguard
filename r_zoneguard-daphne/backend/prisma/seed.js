require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function readCsv(filenames) {
  if (!Array.isArray(filenames)) filenames = [filenames];
  let filePath = null;
  for (const f of filenames) {
    const p = path.join(__dirname, '..', 'datasets', f);
    if (fs.existsSync(p)) {
      filePath = p;
      break;
    }
  }
  if (!filePath) {
    console.warn(`Notice: Dataset file not found (skipping): ${filenames.join(' or ')}`);
    return [];
  }

  // Read raw buffer to safely handle UTF-16LE (Excel export default) vs UTF-8
  const buffer = fs.readFileSync(filePath);
  let fileContent = '';

  // Check UTF-16 LE BOM (0xFF 0xFE)
  if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xfe) {
    fileContent = buffer.toString('utf16le');
  } else {
    fileContent = buffer.toString('utf-8').replace(/^\uFEFF/, '');
  }

  fileContent = fileContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = fileContent.split('\n').filter(line => line.trim() !== '');

  // Log diagnostic info specifically for vehicle debugging
  if (filenames.some(f => f.includes('vehicle'))) {
    console.log(`\n--- [CSV DIAGNOSTIC: VEHICLES] ---`);
    console.log(`File matched: ${filePath}`);
    console.log(`Total non-empty lines found: ${lines.length}`);
    if (lines.length > 0) {
      console.log(`Header line: "${lines[0]}"`);
    }
    if (lines.length > 1) {
      console.log(`First data line: "${lines[1]}"`);
    } else {
      console.warn(`WARNING: File has 1 or 0 lines! Need headers + at least 1 row of data.`);
    }
    console.log(`-----------------------------------\n`);
  }

  if (lines.length <= 1) return [];

  // Auto-detect delimiter
  let delimiter = ',';
  if (lines[0].includes('\t')) delimiter = '\t';
  else if (!lines[0].includes(',') && lines[0].includes(';')) delimiter = ';';

  function parseLine(text, delim) {
    const row = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delim && !inQuotes) {
        row.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim().replace(/^"|"$/g, ''));
    return row;
  }

  const headers = parseLine(lines[0], delimiter);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i], delimiter);
    const obj = {};
    headers.forEach((h, index) => {
      const cleanHeader = h.trim();
      obj[cleanHeader] = values[index] !== undefined ? values[index] : null;
    });
    rows.push(obj);
  }
  return rows;
}

async function main() {
  console.log('Seeding database from all available datasets...');

  // 1. Zones
  const zones = readCsv(['zone.csv', 'zones.csv']);
  for (const z of zones) {
    if (!z.zone_id) continue;
    await prisma.zone.upsert({
      where: { id: z.zone_id },
      update: {},
      create: {
        id: z.zone_id,
        name: z.zone_name,
        status: z.zone_status || 'ACTIVE',
        createdAt: z.created_at ? new Date(z.created_at) : new Date(),
        updatedAt: z.updated_at ? new Date(z.updated_at) : new Date(),
      },
    });
  }
  console.log(`Processed ${zones.length} zones.`);

  // 2. Users
  const users = readCsv(['user.csv', 'users.csv']);
  for (const u of users) {
    const userId = u.user_id || u.id;
    if (!userId || !u.email) continue;
    const passwordHash = await bcrypt.hash('Password123!', 12);
    
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        zoneId: u.zone_id || null,
        firstName: u.first_name || 'Test',
        lastName: u.last_name || 'User',
        middleName: u.middle_name || null,
        email: u.email,
        phoneNumber: u.phone_number || null,
        dateOfBirth: u.date_of_birth ? new Date(u.date_of_birth) : null,
        passwordHash,
        systemRole: u.system_role || 'HOMEOWNER',
        accountStatus: u.account_status || 'ACTIVE',
      },
    });
  }
  console.log(`Processed ${users.length} users.`);

  // 3. Homeowners
  const homeowners = readCsv(['homeowner.csv', 'homeowners.csv']);
  const validHomeowners = new Set();
  for (const h of homeowners) {
    const hId = h.homeowner_id || h.id;
    if (!hId) continue;
    validHomeowners.add(hId);
    await prisma.homeowner.upsert({
      where: { id: hId },
      update: {},
      create: {
        id: hId,
        userId: h.user_id || null,
        streakCount: parseInt(h.streak_count) || 0,
        currentStarCount: parseInt(h.current_star_count) || 0,
        currentBadgeLevel: h.current_badge_level || 'BRONZE',
      },
    });
  }
  console.log(`Processed ${homeowners.length} homeowners.`);

  // 4. Lots
  const lots = readCsv(['lot.csv', 'lots.csv']);
  for (const l of lots) {
    const lotId = l.lot_id || l.id;
    if (!lotId) continue;
    await prisma.lot.upsert({
      where: { id: lotId },
      update: {},
      create: {
        id: lotId,
        homeownerId: l.homeowner_id || null,
        zoneId: l.zone_id || null,
        houseNumber: l.house_number || null,
        blockNumber: l.block_number ? parseInt(l.block_number) : null,
        lotNumber: l.lot_number ? parseInt(l.lot_number) : null,
        street: l.street || null,
        longitude: l.longitude ? parseFloat(l.longitude) : null,
        latitude: l.latitude ? parseFloat(l.latitude) : null,
        isDelinquent: l.is_delinquent === 'true' || l.is_delinquent === '1',
        isPrimaryLot: l.is_primary_lot !== 'false',
        lotStanding: l.lot_standing || 'UNPAID',
        occupied: l.occupied !== 'false',
      },
    });
  }
  console.log(`Processed ${lots.length} lots.`);

  // 5. Tenants
  const tenants = readCsv(['tenant.csv', 'tenants.csv']);
  for (const t of tenants) {
    const tId = t.tenant_id || t.id;
    const lId = t.lot_id;
    if (!tId || !lId) continue;

    const tenantData = {
      id: tId,
      lotId: lId,
      userId: t.user_id || null,
      permitUrl: t.permit_url || null,
      delegationStatus: t.delegation_status || 'ACTIVE',
      approvalStatus: t.approval_status || 'PENDING',
      approvedById: t.approved_by || null,
      approvedAt: t.approved_at ? new Date(t.approved_at) : null,
      rejectionReason: t.rejection_reason || null,
      canProcessPayment: t.can_process_payment === 'true' || t.can_process_payment === true,
      createdAt: t.created_at ? new Date(t.created_at) : new Date(),
      updatedAt: t.updated_at ? new Date(t.updated_at) : new Date(),
    };

    const existing = await prisma.tenant.findFirst({
      where: { id: tId },
    });

    if (existing) {
      await prisma.tenant.update({
        where: {
          id_lotId: {
            id: existing.id,
            lotId: existing.lotId,
          },
        },
        data: tenantData,
      });
    } else {
      await prisma.tenant.create({
        data: tenantData,
      });
    }
  }
  console.log(`Processed ${tenants.length} tenants.`);

  // 6. Complaints
  const complaints = readCsv(['complaint.csv', 'complaints.csv']);
  for (const c of complaints) {
    const cId = c.ticket_id || c.complaint_id || c.id;
    if (!cId) continue;
    await prisma.complaint.upsert({
      where: { id: cId },
      update: {},
      create: {
        id: cId,
        complaintCategory: c.complaint_category || 'General',
        complaintSubject: c.complaint_subject || c.subject || 'Inquiry',
        complaintDesc: c.complaint_desc || c.description || '',
        evidenceImg: c.evidence_img || null,
        status: c.status || 'ACTIVE',
        assignedDirectorId: c.assigned_director_id || null,
        escalatedRemarks: c.escalation_remarks || null,
        userId: c.user_id || null,
      },
    });
  }
  console.log(`Processed ${complaints.length} complaints.`);

  // 7. Accounts Receivables
  const receivables = readCsv(['accounts_receivable.csv', 'accounts_receivables.csv']);
  const validBillingIds = new Set();
  for (const r of receivables) {
    const rId = r.billing_id || r.id;
    if (!rId || !r.lot_id) continue;
    validBillingIds.add(rId);
    await prisma.accountsReceivable.upsert({
      where: { id: rId },
      update: {},
      create: {
        id: rId,
        billingMonth: parseInt(r.billing_month) || 1,
        billingYear: parseInt(r.billing_year) || 2026,
        baseAmount: parseFloat(r.base_amount) || 0,
        isAnnualPayment: r.is_annual_payment === 'true' || r.is_annual_payment === '1',
        billingStatus: r.billing_status || 'PENDING',
        lotId: r.lot_id,
        dueDate: r.due_date ? new Date(r.due_date) : new Date(),
      },
    });
  }
  console.log(`Processed ${receivables.length} accounts receivables.`);

  // 8. Transactions
  const transactions = readCsv(['transactions.csv', 'transaction.csv']);
  for (let i = 0; i < transactions.length; i++) {
    const tr = transactions[i];
    let trId = tr.transaction_id || tr.id;
    if (!trId || trId.startsWith('AR-')) {
      if (tr.payment_proof) {
        const match = tr.payment_proof.match(/(TRX-\d+)/i);
        trId = match ? match[1] : `TRX-2026-${String(i + 1).padStart(5, '0')}`;
      } else {
        trId = `TRX-2026-${String(i + 1).padStart(5, '0')}`;
      }
    }

    const safeBillingId = tr.billing_id && validBillingIds.has(tr.billing_id) ? tr.billing_id : null;

    await prisma.transaction.upsert({
      where: { id: trId },
      update: {},
      create: {
        id: trId,
        billingId: safeBillingId,
        ...(tr.zone_id && tr.zone_id.trim() !== '' ? { zone: { connect: { id: tr.zone_id } } } : {}),
        amount: parseFloat(tr.amount) || 0,
        paymentCategory: tr.payment_category || 'Dues',
        productionShare: tr.production_share ? parseFloat(tr.production_share) : null,
        hoaShare: tr.hoa_share ? parseFloat(tr.hoa_share) : null,
        collectorIncentive: tr.collector_incentive ? parseFloat(tr.collector_incentive) : null,
        paymentMethod: tr.payment_method || 'DIGITAL',
        paymentStatus: tr.payment_status || 'VERIFIED',
        paymentProof: tr.payment_proof || null,
        ...(tr.processed_by && tr.processed_by.trim() !== '' ? { processedBy: { connect: { id: tr.processed_by } } } : {}),
       transactionDate: tr.transaction_date ? new Date(tr.transaction_date) : new Date(),
        ...(tr.user_id && tr.user_id.trim() !== '' ? { user: { connect: { id: tr.user_id } } } : {}),
        referenceNo: tr.reference_no || null,
      },
    });
  }
  console.log(`Processed ${transactions.length} transactions.`);

  // 9. Monthly Allocations
  const allocations = readCsv(['monthly_allocations.csv', 'monthly_allocation.csv']);
  for (const ma of allocations) {
    const maId = ma.allocation_id || ma.id;
    if (!maId) continue;
    await prisma.monthlyAllocation.upsert({
      where: { id: maId },
      update: {},
      create: {
        id: maId,
        directorId: ma.director_id || null,
        zoneId: ma.zone_id || null,
        billingCycle: ma.billing_cycle ? new Date(ma.billing_cycle) : new Date(),
        totalGrossCollections: parseFloat(ma.total_gross_collections) || 0,
        accruedCollectorIncentive: parseFloat(ma.accrued_collector_incentive) || 0,
        isLocked: ma.is_locked !== 'false',
        dateLocked: ma.date_locked ? new Date(ma.date_locked) : null,
      },
    });
  }
  console.log(`Processed ${allocations.length} monthly allocations.`);

  // 10. Allocation Details
  const allocationDetails = readCsv(['allocation_details.csv', 'allocation_detail.csv']);
  for (const ad of allocationDetails) {
    const adId = ad.detail_id || ad.id;
    if (!adId || !ad.allocation_id) continue;
    await prisma.allocationDetail.upsert({
      where: { id: adId },
      update: {},
      create: {
        id: adId,
        allocationId: ad.allocation_id,
        expenseCategory: ad.expense_category || 'General',
        allocatedAmount: parseFloat(ad.allocated_amount) || 0,
        remittanceFlag: ad.remittance_flag === 'true' || ad.remittance_flag === '1',
      },
    });
  }
  console.log(`Processed ${allocationDetails.length} allocation details.`);

  // 11. Audit Logs
  const auditLogs = readCsv(['audit_logs.csv', 'audit_log.csv']);
  for (const al of auditLogs) {
    const alId = al.log_id || al.id;
    if (!alId) continue;
    await prisma.auditLog.upsert({
      where: { id: alId },
      update: {},
      create: {
        id: alId,
        userId: al.user_id || null,
        actionCategory: al.action_category || 'SYSTEM',
        targetReference: al.target_reference || null,
        actionDetails: al.action_details || null,
        timestamp: al.timestamp ? new Date(al.timestamp) : new Date(),
      },
    });
  }
  console.log(`Processed ${auditLogs.length} audit logs.`);

  // 12. Payment Disputes
  const disputes = readCsv(['payment_disputes.csv', 'payment_dispute.csv']);
  let disputeCount = 0;
  for (const pd of disputes) {
    const pdId = pd.dispute_id || pd.id;
    const hId = pd.homeowner_id;
    if (!pdId || !hId || !validHomeowners.has(hId)) continue;

    const safeBillingId = pd.billing_id && validBillingIds.has(pd.billing_id) ? pd.billing_id : null;

    await prisma.paymentDispute.upsert({
      where: { id: pdId },
      update: {},
      create: {
        id: pdId,
        homeownerId: hId,
        collectorId: pd.collector_id && pd.collector_id.trim() !== '' ? pd.collector_id : null,
        billingId: safeBillingId,
        referenceMonth: pd.reference_month || null,
        homeownerClaim: pd.homeowner_claim || '',
        evidenceUrl: pd.evidence_url || null,
        status: pd.status || 'REVIEWING',
      },
    });
    disputeCount++;
  }
  console.log(`Processed ${disputeCount} payment disputes.`);

  // 13. Vehicles
  const vehicles = readCsv(['vehicle.csv', 'vehicles.csv']);
  let vehicleCount = 0;

  for (const v of vehicles) {
    const vId = v.vehicle_id || v.id || v.vehicleId || v['Vehicle ID'];
    const plateNumber = v.plate_number || v.plateNumber || v.plate_no || v['Plate Number'];
    const userId = v.user_id || v.userId || v['User ID'];

    if (!vId || !plateNumber || !userId) {
      console.warn('Skipped vehicle row (missing key fields):', v);
      continue;
    }

    await prisma.vehicle.upsert({
      where: { id: vId },
      update: {},
      create: {
        id: vId,
        plateNumber: plateNumber,
        vehicleType: v.vehicle_type || v.vehicleType || 'PRIVATE',
        vehicleModel: v.vehicle_model || v.vehicleModel || 'Unknown',
        vehicleColor: v.vehicle_color || v.vehicleColor || 'Unknown',
        orImg: v.or_img || v.orImg || '',
        crImg: v.cr_img || v.crImg || '',
        vehicleStatus: v.vehicle_status || v.vehicleStatus || 'PENDING',
        userId: userId,
        createdAt: v.created_at ? new Date(v.created_at) : new Date(),
        updatedAt: v.updated_at ? new Date(v.updated_at) : new Date(),
      },
    });
    vehicleCount++;
  }
  console.log(`Processed ${vehicleCount} vehicles.`);

  console.log('Seeding complete for all datasets successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });