const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

// Bulletproof context resolver: Gets both Homeowner AND Tenant properties
async function resolveUserContext(query) {
  try {
    let user = null;
    if (query.userId && query.userId !== 'undefined' && query.userId !== 'null') {
      user = await prisma.user.findUnique({ where: { id: String(query.userId) } });
    }
    if (!user) {
      user = await prisma.user.findFirst();
    }

    // 1. Fetch properties where user is the Homeowner
    const homeowner = await prisma.homeowner.findFirst({
      where: { userId: user.id },
      include: { user: true }
    });
    const ownedLots = homeowner ? await prisma.lot.findMany({
      where: { homeownerId: homeowner.id },
      include: { zone: true }
    }) : [];

    // 2. Fetch properties where user is a Tenant
    let tenantLots = [];
    try {
      const tenants = await prisma.tenant.findMany({
        where: { userId: user.id },
        include: { lot: { include: { zone: true } } }
      });
      tenantLots = tenants.map(t => {
        if (t.lot) t.lot.nameLabel = `Tenant Residence (${t.lot.street || 'NIA Village'})`;
        return t.lot;
      }).filter(Boolean);
    } catch (e) {
      console.error("Tenant table skipped/not found.");
    }

    // Combine all lots so all tabs render!
    const lots = [...ownedLots, ...tenantLots];

    let activeLot = lots.length > 0 ? lots[0] : null;
    if (query.propertyId && lots.length > 0) {
      const found = lots.find(l => l.id === String(query.propertyId));
      if (found) {
        activeLot = found;
      } else {
        const idx = Number(query.propertyId) - 1;
        if (!isNaN(idx) && lots[idx]) activeLot = lots[idx];
      }
    }

    return { user, homeowner, lots, activeLot };
  } catch (e) {
    console.error("Context Resolution Error:", e);
    return { user: null, homeowner: null, lots: [], activeLot: null };
  }
}

// GET /api/homeowner/properties
router.get('/properties', async (req, res) => {
  try {
    const { lots } = await resolveUserContext(req.query);
    const properties = lots.map((l, idx) => ({
      id: l.id,
      name: l.nameLabel ? l.nameLabel : (l.isPrimaryLot ? `Primary Residence (${l.street || 'NIA Village'})` : `Property ${idx + 1} (${l.street || 'NIA Village'})`)
    }));
    res.json({ properties });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// GET /api/homeowner/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const { user, homeowner, lots, activeLot } = await resolveUserContext(req.query);
    if (!activeLot) return res.status(404).json({ message: 'Property not found.' });

    let bills = await prisma.accountsReceivable.findMany({
      where: { lotId: activeLot.id }
    });

    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { transactionDate: 'desc' }
    });

    // 🌟 THE FIX: Only fetch ACTIVE disputes
    const disputes = homeowner ? await prisma.paymentDispute.findMany({
      where: { 
        homeownerId: homeowner.id,
        status: { in: ['PENDING', 'REVIEWING'] }
      }
    }).catch(() => []) : [];

    // Dynamically ensure current cycle bill is present if missing
    const currentDate = new Date();
    const CURRENT_MONTH = currentDate.getMonth() + 1;
    const CURRENT_YEAR = currentDate.getFullYear();

    const hasCurrentBill = bills.some(b => b.billingMonth === CURRENT_MONTH && b.billingYear === CURRENT_YEAR);
    if (!hasCurrentBill) {
      bills.push({
        id: `BIL-${CURRENT_YEAR}-${CURRENT_MONTH}-DYN`,
        billingMonth: CURRENT_MONTH,
        billingYear: CURRENT_YEAR,
        baseAmount: 200.00,
        billingStatus: 'PENDING'
      });
    }

    // Evaluate each bill exactly like the payments ledger
    const ledgerStatuses = bills.map(bill => {
      const billId = bill.id || bill.billing_id || bill.billingId;
      const tx = transactions.find(t => t.billingId === billId || t.billing_id === billId);
      const dispute = disputes.find(d => d.billingId === billId);
      
      const yearStr = bill.billingYear || CURRENT_YEAR;
      const isPastMonth = (yearStr < CURRENT_YEAR) || (yearStr === CURRENT_YEAR && bill.billingMonth < CURRENT_MONTH);
      const isVerifiedPaid = (bill.billingStatus === 'PAID') || (tx && tx.paymentStatus === 'VERIFIED');

      if (isVerifiedPaid) {
        return { type: 'paid' };
      } else if (dispute) {
        return { type: 'dispute', isArrears: isPastMonth };
      } else if (tx && (tx.paymentStatus === 'PENDING' || tx.paymentStatus === 'VALIDATING')) {
        return { type: 'pending', isArrears: isPastMonth };
      } else if (isPastMonth) {
        return { type: 'withArrears', isArrears: true };
      } else {
        return { type: 'unpaid', isArrears: false };
      }
    });

    // Balance counts anything that is NOT verified/paid (including pending and in-dispute)
    const unpaidOrPendingBills = ledgerStatuses.filter(s => s.type !== 'paid');
    const currentBalance = unpaidOrPendingBills.length * 200; 

    // Delinquent if there are past-due arrears, pending items from past months, or active disputes
    const delinquentBills = ledgerStatuses.filter(s => s.isArrears || s.type === 'dispute' || s.type === 'pending');
    const isDelinquent = delinquentBills.length > 0;

    const verifiedTxs = transactions.filter(t => t.paymentStatus === 'VERIFIED');
    let lastPaymentStr = 'None';
    let lastPaymentStatus = isDelinquent ? 'MISSED' : 'VERIFIED';

    if (verifiedTxs.length > 0) {
      const lastTxDate = new Date(verifiedTxs[0].transactionDate);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      lastPaymentStr = `${monthNames[lastTxDate.getMonth()]} ${lastTxDate.getDate().toString().padStart(2, '0')}, ${lastTxDate.getFullYear()}`;
      lastPaymentStatus = 'VERIFIED'; 
    }
    
    const complaintsList = user ? await prisma.complaint.findMany({ where: { userId: user.id } }) : [];
    
    res.json({
      userId: user?.id,
      homeownerName: user ? `${user.firstName} ${user.lastName}` : 'Homeowner',
      properties: lots.map((l, idx) => ({
        id: l.id,
        name: l.nameLabel ? l.nameLabel : (l.isPrimaryLot ? `Primary Residence (${l.street || 'NIA Village'})` : `Property ${idx + 1}`)
      })),
      activePropertyId: activeLot.id,
      dues: {
        balance: currentBalance,
        status: isDelinquent ? 'ARREARS' : 'IN GOOD STANDING',
        isDelinquent: isDelinquent,
        lastPaymentMonth: lastPaymentStr,
        lastPaymentStatus: lastPaymentStatus,
        nextBillingCycle: 'September 2026'
      },
      complaints: {
        activeTickets: complaintsList.filter(c => c.status === 'ACTIVE' || c.status === 'PENDING').length,
        investigatingCount: complaintsList.filter(c => c.status === 'INVESTIGATING').length
      },
      badge: {
        title: isDelinquent ? 'Action Required' : (homeowner?.currentBadgeLevel || 'Gold Badge Status'),
        text: isDelinquent ? 'Account is in arrears. Settle past dues to restore standing and community access.' : 'Payments cleared before the 15th earn maximum stars.',
        stars: isDelinquent ? '☆' : '★★★★★',
        color: isDelinquent ? '#6b7280' : '#f59e0b'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

// GET /api/homeowner/payments
router.get('/payments', async (req, res) => {
  try {
    const { user, homeowner, lots, activeLot } = await resolveUserContext(req.query);
    if (!activeLot) return res.status(404).json({ message: 'Property not found.' });

    let bills = await prisma.accountsReceivable.findMany({
      where: { lotId: activeLot.id },
      orderBy: [{ billingYear: 'desc' }, { billingMonth: 'desc' }]
    });

    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { transactionDate: 'desc' }
    });

    // 🌟 THE FIX: Only fetch ACTIVE disputes
    const disputes = homeowner ? await prisma.paymentDispute.findMany({
      where: { 
        homeownerId: homeowner.id,
        status: { in: ['PENDING', 'REVIEWING'] }
      }
    }).catch(() => []) : [];

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentDate = new Date();
    const CURRENT_MONTH = currentDate.getMonth() + 1;
    const CURRENT_YEAR = currentDate.getFullYear();

    // Dynamically ensure current cycle bill appears if missing
    const hasCurrentBill = bills.some(b => b.billingMonth === CURRENT_MONTH && b.billingYear === CURRENT_YEAR);
    if (!hasCurrentBill) {
      bills.unshift({
        id: `BIL-${CURRENT_YEAR}-${CURRENT_MONTH}-DYN`,
        billingMonth: CURRENT_MONTH,
        billingYear: CURRENT_YEAR,
        baseAmount: 200.00,
        billingStatus: 'PENDING'
      });
    }

    const ledgerRows = bills.map(bill => {
      const monthIdx = (bill.billingMonth || 1) - 1;
      const yearStr = bill.billingYear || CURRENT_YEAR;
      const periodStr = `${monthNames[monthIdx] || 'Jan'} ${yearStr}`;
      
      const billId = bill.id || bill.billing_id || bill.billingId;
      const tx = transactions.find(t => t.billingId === billId || t.billing_id === billId);
      const dispute = disputes.find(d => d.billingId === billId);
      
      let statusText = 'UNPAID';
      let statusType = 'unpaid';
      let datePaid = 'Current Cycle';
      let mode = '-';
      let actions = ['Pay Now', 'Dispute'];

      const isPastMonth = (yearStr < CURRENT_YEAR) || (yearStr === CURRENT_YEAR && bill.billingMonth < CURRENT_MONTH);

      // ONLY VERIFIED/PAID transactions clear the bill and remove it from the balance
      const isVerifiedPaid = (bill.billingStatus === 'PAID') || (tx && tx.paymentStatus === 'VERIFIED');

      if (isVerifiedPaid) {
        statusText = 'PAID';
        statusType = 'paid';
        datePaid = tx && tx.transactionDate ? new Date(tx.transactionDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Paid';
        mode = tx?.paymentMethod || 'Digital';
        actions = ['View AOR', 'Dispute'];
      } else if (dispute) {
        statusText = 'IN DISPUTE';
        statusType = 'dispute'; 
        datePaid = '-';
        mode = '-';
        actions = ['Status', 'Dispute'];
      } else if (tx && (tx.paymentStatus === 'PENDING' || tx.paymentStatus === 'VALIDATING')) {
        statusText = 'PENDING';
        statusType = 'pending'; 
        datePaid = 'Pending Approval';
        mode = tx.paymentMethod || 'Digital';
        actions = ['View Status', 'Dispute'];
      } else if (isPastMonth) {
        statusText = 'WITH ARREARS';
        statusType = 'withArrears';
        datePaid = 'Past Due';
        actions = ['Pay Now', 'Dispute'];
      } else {
        statusText = 'UNPAID';
        statusType = 'unpaid';
        datePaid = 'Current Cycle';
        actions = ['Pay Now', 'Dispute'];
      }

      return {
        id: billId,
        period: periodStr,
        year: yearStr.toString(),
        mode: mode,
        amount: `₱${Number(bill.baseAmount || 200).toFixed(2)}`,
        statusType: statusType,
        statusText: statusText,
        datePaid: datePaid,
        actions: actions,
        disputeInfo: dispute ? { reason: dispute.homeownerClaim, evidence: dispute.evidenceUrl } : null
      };
    });

    const outstandingBills = ledgerRows.filter(r => r.statusType !== 'paid');
    const currentBalance = outstandingBills.length * 200; 

    const arrearsBills = ledgerRows.filter(r => r.statusType === 'withArrears' || r.statusType === 'pending' || r.statusType === 'dispute');
    const isDelinquent = arrearsBills.length > 0;

    res.json({
      properties: lots.map((l, idx) => ({ id: l.id, name: l.nameLabel ? l.nameLabel : (l.isPrimaryLot ? 'Primary Residence' : `Property ${idx + 1}`) })),
      activePropertyId: activeLot.id,
      balance: currentBalance,
      isDelinquent,
      transactions: ledgerRows
    });

  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

// GET /api/homeowner/transactions/:billingId
router.get('/transactions/:billingId', async (req, res) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: { billingId: req.params.billingId },
      orderBy: { transactionDate: 'desc' }
    });
    if (!transaction) return res.status(404).json({ message: 'Transaction record not found.' });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction', error: error.message });
  }
});

// GET /api/homeowner/disputes/:billingId
router.get('/disputes/:billingId', async (req, res) => {
  try {
    const dispute = await prisma.paymentDispute.findFirst({
      where: { billingId: req.params.billingId },
      orderBy: { createdAt: 'desc' }
    });
    if (!dispute) return res.status(404).json({ message: 'Dispute record not found.' });
    res.json(dispute);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dispute', error: error.message });
  }
});

// POST /api/homeowner/payments
router.post('/payments', async (req, res) => {
  try {
    const { referenceNumber, propertyId, userId, billingId } = req.body;
    
    const { user, activeLot } = await resolveUserContext({ propertyId, userId });
    if (!user) {
      return res.status(400).json({ message: 'User context could not be resolved.' });
    }

    let targetBill = null;
    const currentDate = new Date();
    const CURRENT_MONTH = currentDate.getMonth() + 1;
    const CURRENT_YEAR = currentDate.getFullYear();
    
    // If it's a dynamic current cycle bill, create it dynamically in the DB with the proper dueDate
    if (billingId && String(billingId).includes('-DYN') && activeLot) {
      targetBill = await prisma.accountsReceivable.create({
        data: {
          lotId: activeLot.id,
          billingMonth: CURRENT_MONTH,
          billingYear: CURRENT_YEAR,
          baseAmount: 200.00,
          billingStatus: 'PENDING',
          dueDate: new Date(CURRENT_YEAR, CURRENT_MONTH, 0) // Dynamically set due date to end of billing month
        }
      });
    } else if (billingId) {
      targetBill = await prisma.accountsReceivable.findUnique({ 
        where: { id: String(billingId) } 
      }).catch(() => null);
    }
    
    if (!targetBill && activeLot) {
      targetBill = await prisma.accountsReceivable.findFirst({
        where: {
          lotId: activeLot.id,
          billingStatus: { in: ['PENDING', 'OVERDUE', 'UNPAID', 'WITH_ARREARS'] }
        }
      }).catch(() => null);
    }

    const transactionAmount = targetBill ? Number(targetBill.baseAmount || 200.00) : 200.00;
    const resolvedBillingId = targetBill ? (targetBill.id || targetBill.billing_id || targetBill.billingId) : null;

    // Create transaction record for the collector's approval queue
    const newTransaction = await prisma.transaction.create({
      data: {
        referenceNo: String(referenceNumber || 'QR-' + Date.now()),
        paymentStatus: 'PENDING',
        paymentCategory: 'MONTHLY_DUES',
        paymentMethod: 'DIGITAL',
        amount: transactionAmount,
        userId: user.id,
        billingId: resolvedBillingId ? String(resolvedBillingId) : null,
        zoneId: activeLot?.zoneId ? String(activeLot.zoneId) : null,
        hoaShare: 180.00,
        collectorIncentive: 20.00,
        transactionDate: new Date()
      }
    });

    return res.json({ 
      success: true, 
      message: 'Payment transaction recorded successfully for collector approval', 
      transaction: newTransaction 
    });

  } catch (error) {
    console.error("CRITICAL PAYMENT POST ERROR:", error);
    return res.status(500).json({ message: 'Failed to record payment', error: error.message });
  }
});

// POST /api/homeowner/disputes
router.post('/disputes', async (req, res) => {
  try {
    const { propertyId, userId, billingId, referenceMonth, homeownerClaim, evidenceUrl } = req.body;
    
    const { user, homeowner, activeLot } = await resolveUserContext({ propertyId, userId });
    if (!user) return res.status(400).json({ message: 'User context could not be resolved.' });

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const customId = `D-${randomNum}`;

    // 🌟 THE FIX: Remove '#' from dynamic frontend IDs to prevent P2003 foreign key constraint errors
    const cleanBillingId = billingId ? String(billingId).replace('#', '') : null;

    const newDispute = await prisma.paymentDispute.create({
      data: {
        id: customId,
        homeownerId: homeowner ? homeowner.id : null,
        collectorId: null,
        billingId: cleanBillingId,
        referenceMonth: referenceMonth || 'Current',
        homeownerClaim: homeownerClaim,
        evidenceUrl: evidenceUrl || null,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Dispute submitted successfully and routed for review.',
      dispute: newDispute
    });
  } catch (error) {
    console.error('DISPUTE SUBMISSION ERROR:', error);
    res.status(500).json({ message: 'Failed to submit dispute', error: error.message });
  }
});

// GET /api/homeowner/complaints
router.get('/complaints', async (req, res) => {
  try {
    const { user } = await resolveUserContext(req.query);
    if (!user) return res.status(400).json({ message: 'User context could not be resolved.' });

    const complaints = await prisma.complaint.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ complaints });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: 'Error fetching complaints', error: error.message });
  }
});

// POST /api/homeowner/complaints
router.post('/complaints', async (req, res) => {
  try {
    const { propertyId, userId, subject, category, details, evidenceUrl } = req.body;
    
    const { user } = await resolveUserContext({ propertyId, userId });
    if (!user) return res.status(400).json({ message: 'User context could not be resolved.' });

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `TKT-${randomNum}`;

    const newComplaint = await prisma.complaint.create({
      data: {
        id: ticketId,
        complaintCategory: String(category || 'GENERAL').toUpperCase(),
        complaintSubject: subject,
        complaintDesc: details,
        evidenceImg: evidenceUrl || null,
        status: 'PENDING', // Corrected field name matching your Prisma schema
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Complaint filed successfully.',
      complaint: newComplaint
    });
  } catch (error) {
    console.error('COMPLAINT SUBMISSION ERROR:', error);
    res.status(500).json({ message: 'Failed to submit complaint', error: error.message });
  }
});

// GET /api/homeowner/tenants
router.get('/tenants', async (req, res) => {
  try {
    const { activeLot } = await resolveUserContext(req.query);
    if (!activeLot) return res.status(404).json({ message: 'Property not found.' });

    const tenants = await prisma.tenant.findMany({
      where: { lotId: activeLot.id },
      include: { user: true }
    });

    res.json({ tenants });
  } catch (error) {
    console.error("Error fetching tenants:", error);
    res.status(500).json({ message: 'Error fetching tenants', error: error.message });
  }
});

// POST /api/homeowner/tenants
router.post('/tenants', async (req, res) => {
  try {
    const { propertyId, userId, firstName, middleName, lastName, email, birthDate, rentalPermit, permissions } = req.body;
    
    const { activeLot } = await resolveUserContext({ propertyId, userId });
    if (!activeLot) return res.status(404).json({ message: 'Active property not found.' });

    let tenantUser = await prisma.user.findUnique({ where: { email } }).catch(() => null);
    if (!tenantUser) {
      const userRandom = Math.floor(1000 + Math.random() * 9000);
      tenantUser = await prisma.user.create({
        data: {
          id: `USR-2026-${userRandom}`,
          firstName,
          middleName: middleName || '',
          lastName,
          email,
          dateOfBirth: birthDate ? new Date(birthDate) : null, // Mapped to dateOfBirth field
          systemRole: 'TENANT',
          passwordHash: 'TEMP_TENANT_PASS_HASH'
        }
      });
    }

    const tenantRandom = Math.floor(1000 + Math.random() * 9000);
    const newTenant = await prisma.tenant.create({
      data: {
        id: `TNT-2026-${tenantRandom}`,
        userId: tenantUser.id,
        lotId: activeLot.id,
        permitUrl: rentalPermit || null,
        canProcessPayment: permissions?.allowDuesPayment ?? true, // Updated to match schema
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: { user: true }
    });

    res.json({
      success: true,
      message: 'Tenant account created and linked successfully.',
      tenant: newTenant
    });
  } catch (error) {
    console.error('TENANT CREATION ERROR:', error);
    res.status(500).json({ message: 'Failed to create tenant', error: error.message });
  }
});

module.exports = router;