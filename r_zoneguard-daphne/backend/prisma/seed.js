const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 🛠️ HELPER 1: Read CSV (Destroys BOM characters, spaces, and empty cells)
function readCSV(fileName) {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(__dirname, '../datasets', fileName);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Warning: ${fileName} not found. Skipping.`);
      return resolve([]);
    }
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        const cleanRow = {};
        for (const key in data) {
          const cleanKey = key.replace(/^\uFEFF/, '').trim();
          let cleanValue = data[key];
          if (typeof cleanValue === 'string') {
            cleanValue = cleanValue.trim();
          }
          cleanRow[cleanKey] = cleanValue === '' ? null : cleanValue; 
        }
        results.push(cleanRow);
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

// 🛠️ HELPER 2: Data Converters
const parseBool = (val) => val === 'TRUE' || val === 'true' || val === '1';
const parseNum = (val) => (val ? parseFloat(val) : 0);
const parseDate = (val) => {
  if (!val) return new Date();
  const str = val.trim();
  
  if (str.includes('/')) {
    const parts = str.split(/[/\s:]/);
    if (parts.length >= 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; 
      const year = parseInt(parts[2], 10);
      const hours = parts[3] ? parseInt(parts[3], 10) : 0;
      const mins = parts[4] ? parseInt(parts[4], 10) : 0;
      
      if (year >= 2000) {
        return new Date(year, month, day, hours, mins);
      }
    }
  }
  return new Date(str);
};

async function main() {
  console.log('🌱 Starting ZoneGuard full database seed...');

  // ==========================================
  // LEVEL 1: INDEPENDENT TABLES
  // ==========================================
  
  console.log('1/12: Seeding Zones...');
  const zonesData = await readCSV('zone.csv');
  for (const row of zonesData) {
    await prisma.zone.upsert({
      where: { id: row.zone_id },
      update: {},
      create: {
        id: row.zone_id,
        name: row.zone_name,
        status: row.zone_status || 'ACTIVE',
      }
    });
  }

  // ==========================================
  // LEVEL 2: USERS (Track valid IDs)
  // ==========================================

  console.log('2/12: Seeding Users...');
  const userData = await readCSV('user.csv');
  const validUserIds = new Set();

  for (const row of userData) {
    const userId = row.user_id ? row.user_id.trim() : null;
    if (userId) validUserIds.add(userId);

    await prisma.user.upsert({
      where: { id: userId }, 
      update: {},
      create: {
        id: userId,
        zoneId: row.zone_id ? row.zone_id.trim() : null,
        firstName: row.first_name,
        lastName: row.last_name,
        middleName: row.middle_name || null,
        email: row.email || null,
        phoneNumber: row.phone_number || null,
        passwordHash: row.password_hash,
        systemRole: row.system_role || 'HOMEOWNER',
        accountStatus: row.account_status || 'ACTIVE',
      }
    });
  }

  // ==========================================
  // LEVEL 3: RESIDENTS & LOTS
  // ==========================================

  console.log('3/12: Seeding Homeowners...');
  const homeownerData = await readCSV('homeowner.csv');
  for (const row of homeownerData) {
    await prisma.homeowner.upsert({
      where: { id: row.homeowner_id },
      update: {},
      create: {
        id: row.homeowner_id,
        userId: row.user_id || null,
        streakCount: parseNum(row.streak_count),
        currentStarCount: parseNum(row.current_star_count),
        currentBadgeLevel: row.current_badge_level || null,
      }
    });
  }

  console.log('4/12: Seeding Lots...');
  const lotData = await readCSV('lot.csv');
  for (const row of lotData) {
    await prisma.lot.upsert({
      where: { id: row.lot_id },
      update: {},
      create: {
        id: row.lot_id,
        homeownerId: row.homeowner_id || null,
        zoneId: row.zone_id || null,
        houseNumber: row.house_number || null,
        blockNumber: row.block_number ? parseInt(row.block_number) : null,
        lotNumber: row.lot_number ? parseInt(row.lot_number) : null,
        street: row.street || null,
        longitude: row.longitude ? parseFloat(row.longitude) : null,
        latitude: row.latitude ? parseFloat(row.latitude) : null,
        isDelinquent: parseBool(row.is_delinquent),
        isPrimaryLot: parseBool(row.is_primary_lot),
        lotStanding: row.lot_standing || 'UNPAID',
        occupied: parseBool(row.occupied),
      }
    });
  }

  console.log('5/12: Seeding Tenants...');
  const tenantData = await readCSV('tenant.csv');
  for (const row of tenantData) {
    try {
      await prisma.tenant.upsert({
        where: { 
          id_lotId: { 
            id: row.tenant_id, 
            lotId: row.lot_id 
          } 
        },
        update: {},
        create: {
          id: row.tenant_id,
          lotId: row.lot_id,
          userId: row.user_id || null,
          permitUrl: row.permit_url || null,
          delegationStatus: row.delegation_status || 'ACTIVE',
          approvalStatus: row.approval_status || 'PENDING',
          approvedById: row.approved_by || null,
          rejectionReason: row.rejection_reason || null,
          canProcessPayment: parseBool(row.can_process_payment),
        }
      });
    } catch (err) {
      console.warn(`⚠️ Skipped tenant ${row.tenant_id}: ${err.message.split('\n')[0]}`);
    }
  }

  // ==========================================
  // LEVEL 4: FINANCIALS & ALLOCATIONS
  // ==========================================

  console.log('6/12: Seeding Accounts Receivable...');
  const arData = await readCSV('accounts_receivable.csv');
  const validBillingIds = new Set(); // <-- Add this tracking set

  for (const row of arData) {
    const billingId = row.billing_id ? row.billing_id.trim() : null;
    if (billingId) validBillingIds.add(billingId); // <-- Track valid IDs

    await prisma.accountsReceivable.upsert({
      where: { id: billingId || undefined },
      update: {},
      create: {
        id: billingId || undefined,
        billingMonth: parseInt(row.billing_month) || 1,
        billingYear: parseInt(row.billing_year) || 2026,
        baseAmount: parseNum(row.base_amount),
        isAnnualPayment: parseBool(row.is_annual_payment),
        billingStatus: row.billing_status || 'PENDING',
        lotId: row.lot_id ? row.lot_id.trim() : '',
        dueDate: parseDate(row.due_date),
      }
    });
  }

  console.log('7/12: Seeding Monthly Allocations...');
  const monthlyAllocData = await readCSV('monthly_allocations.csv');
  for (const row of monthlyAllocData) {
    await prisma.monthlyAllocation.upsert({
      where: { id: row.allocation_id ? row.allocation_id.trim() : undefined },
      update: {},
      create: {
        id: row.allocation_id ? row.allocation_id.trim() : undefined,
        directorId: row.director_id ? row.director_id.trim() : null,
        zoneId: row.zone_id ? row.zone_id.trim() : null,
        billingCycle: parseDate(row.billing_cycle), // Fixed with parseDate
        totalGrossCollections: parseNum(row.total_gross_collections),
        accruedCollectorIncentive: parseNum(row.accrued_collector_incentive),
        isLocked: parseBool(row.is_locked),
        dateLocked: parseDate(row.date_locked),
      }
    });
  }

  console.log('8/12: Seeding Allocation Details...');
  const allocDetailsData = await readCSV('allocation_details.csv');
  for (const row of allocDetailsData) {
    try {
      await prisma.allocationDetail.upsert({
        where: { id: row.detail_id ? row.detail_id.trim() : undefined },
        update: {},
        create: {
          id: row.detail_id ? row.detail_id.trim() : undefined,
          allocationId: row.allocation_id ? row.allocation_id.trim() : null,
          expenseCategory: row.expense_category || 'General',
          allocatedAmount: parseNum(row.allocated_amount),
          remittanceFlag: parseBool(row.remittance_flag),
        }
      });
    } catch (err) {
      console.warn(`⚠️ Skipped allocation detail ${row.detail_id}: ${err.message.split('\n')[0]}`);
    }
  }

  console.log('9/12: Seeding Transactions...');
  const trxData = await readCSV('transactions.csv');
  for (const row of trxData) {
    try {
      const rawProcessedBy = row.processed_by ? row.processed_by.trim() : null;
      const rawUserId = row.user_id ? row.user_id.trim() : null;

      const safeProcessedById = validUserIds.has(rawProcessedBy) ? rawProcessedBy : null;
      const safeUserId = validUserIds.has(rawUserId) ? rawUserId : null;

      await prisma.transaction.upsert({
        where: { id: row.transaction_id ? row.transaction_id.trim() : undefined },
        update: {},
        create: {
          id: row.transaction_id ? row.transaction_id.trim() : undefined,
          billingId: row.billing_id ? row.billing_id.trim() : null,
          zoneId: row.zone_id ? row.zone_id.trim() : null,
          amount: parseNum(row.amount),
          paymentCategory: row.payment_category ? row.payment_category.trim() : 'MONTHLY_DUES',
          productionShare: row.production_share ? parseNum(row.production_share) : null,
          hoaShare: row.hoa_share ? parseNum(row.hoa_share) : null,
          collectorIncentive: row.collector_incentive ? parseNum(row.collector_incentive) : null,
          paymentMethod: row.payment_method ? row.payment_method.trim() : 'DIGITAL',
          paymentStatus: row.payment_status ? row.payment_status.trim() : 'VERIFIED',
          paymentProof: row.payment_proof || null,
          processedById: safeProcessedById, 
          userId: safeUserId,
          referenceNo: row.reference_no || null,
          transactionDate: parseDate(row.transaction_date),
        }
      });
    } catch (err) {
      console.warn(`⚠️ Skipped transaction ${row.transaction_id} | Reason: ${err.message.split('\n')[0]}`);
    }
  }

  console.log('10/12: Seeding Payment Disputes...');
  const disputeData = await readCSV('payment_disputes.csv');
  for (const row of disputeData) {
    try {
      const rawCollectorId = row.collector_id ? row.collector_id.trim() : null;
      const safeCollectorId = validUserIds.has(rawCollectorId) ? rawCollectorId : null;

      const rawBillingId = row.billing_id ? row.billing_id.trim() : null;
      const safeBillingId = validBillingIds.has(rawBillingId) ? rawBillingId : null; // <-- Validate billing ID

      await prisma.paymentDispute.upsert({
        where: { id: row.dispute_id ? row.dispute_id.trim() : undefined },
        update: {},
        create: {
          id: row.dispute_id ? row.dispute_id.trim() : undefined,
          homeownerId: row.homeowner_id ? row.homeowner_id.trim() : null,
          collectorId: safeCollectorId,
          billingId: safeBillingId, // <-- Use safe validated billing ID
          referenceMonth: row.reference_month || null,
          homeownerClaim: row.homeowner_claim || null,
          evidenceUrl: row.evidence_url || null,
          status: row.dispute_status || 'REVIEWING',
          createdAt: parseDate(row.created_at),
          updatedAt: parseDate(row.updated_at),
        }
      });
    } catch (err) {
      console.warn(`⚠️ Skipped dispute ${row.dispute_id}:`, err.message);
    }
  }
  
  // ==========================================
  // LEVEL 5: OPERATIONS & LOGS
  // ==========================================

  console.log('11/12: Seeding Complaints...');
  const complaintData = await readCSV('complaint.csv');
  for (const row of complaintData) {
    try {
      await prisma.complaint.upsert({
        where: { id: row.ticket_id },
        update: {},
        create: {
          id: row.ticket_id,
          complaintCategory: row.complaint_category,
          complaintSubject: row.complaint_subject,
          complaintDesc: row.complaint_desc,
          evidenceImg: row.evidence_img || null,
          status: row.complaint_status || 'ACTIVE',
          assignedDirectorId: row.assigned_director_id || null,
          escalatedRemarks: row.escalation_remarks || null,
          userId: row.user_id || null,
        }
      });
    } catch (err) {
      console.warn(`⚠️ Skipped complaint ${row.ticket_id}: ${err.message.split('\n')[0]}`);
    }
  }

  console.log('12/12: Seeding Audit Logs...');
  const auditData = await readCSV('audit_logs.csv');
  for (const row of auditData) {
    try {
      const logId = row.log_id ? String(row.log_id).trim() : null;
      const rawUserId = row.user_id ? row.user_id.trim() : null;
      const safeUserId = validUserIds.has(rawUserId) ? rawUserId : null;

      if (!logId) continue;

      await prisma.auditLog.upsert({
        where: { id: logId },
        update: {},
        create: {
          id: logId,
          userId: safeUserId,
          actionCategory: row.action_category || 'ACTION',
          targetReference: row.target_reference || null,
          actionDetails: row.action_details || null,
          timestamp: parseDate(row.timestamp),
        }
      });
    } catch (err) {
      console.warn(`⚠️ Skipped audit log ${row.log_id}:`, err.message);
    }
  }

  console.log('🎉 ALL 12 TABLES SUCCESSFULLY SEEDED!');
}

main()
  .catch((e) => {
    console.error('Fatal Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });