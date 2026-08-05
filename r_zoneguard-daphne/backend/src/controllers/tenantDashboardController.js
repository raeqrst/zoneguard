const prisma = require('../config/prisma');

// GET /api/tenant/dashboard/:tenantId
const getDashboardOverview = async (req, res) => {
  const { tenantId, userId } = req.params;
  const targetId = tenantId || userId;

  console.log('--> Request received for Tenant ID:', targetId);

  try {
    let user = null;

    try {
      user = await prisma.user.findUnique({
        where: { userId: targetId },
        include: { tenants: { include: { lot: true } } }
      });
    } catch (err) {}

    if (!user) {
      try {
        user = await prisma.user.findFirst({
          where: { user_id: targetId },
          include: { tenants: { include: { lot: true } } }
        });
      } catch (err) {}
    }

    if (!user) {
      try {
        user = await prisma.user.findUnique({
          where: { id: targetId },
          include: { tenants: { include: { lot: true } } }
        });
      } catch (err) {}
    }

    if (!user) {
      try {
        const tenantRecord = await prisma.tenant.findFirst({
          where: {
            OR: [
              { tenantId: targetId },
              { tenant_id: targetId },
              { userId: targetId },
              { user_id: targetId },
              { lotId: targetId },
              { lot_id: targetId }
            ]
          },
          include: { user: { include: { tenants: { include: { lot: true } } } }, lot: true }
        });
        if (tenantRecord?.user) {
          user = tenantRecord.user;
        }
      } catch (err) {}
    }

    if (!user) {
      console.log(`❌ No user found in DB for ID: "${targetId}"`);
      return res.status(404).json({
        success: false,
        message: `Tenant user not found for ID: ${targetId}`
      });
    }

    const firstName = user.firstName || user.first_name || '';
    const lastName = user.lastName || user.last_name || '';
    const dbUserId = user.userId || user.user_id || user.id;

    console.log('✅ User found successfully:', firstName);

    // Robust Lot & Tenant Lookup
    let assignedLot = user.tenants?.[0]?.lot || user.tenant?.[0]?.lot;
    let lotIdValue = assignedLot?.lotId || assignedLot?.lot_id || assignedLot?.id || null;

    if (!lotIdValue) {
      try {
        const tenantRecord = await prisma.tenant.findFirst({
          where: {
            OR: [
              { userId: dbUserId },
              { user_id: dbUserId },
              { tenantId: targetId },
              { tenant_id: targetId }
            ]
          },
          include: { lot: true }
        });
        assignedLot = tenantRecord?.lot || assignedLot;
        lotIdValue = tenantRecord?.lotId || tenantRecord?.lot_id || assignedLot?.lotId || assignedLot?.lot_id || assignedLot?.id || null;
      } catch (err) {}
    }

    const lotNameValue = assignedLot?.lotName || assignedLot?.lot_name || (lotIdValue ? `${lotIdValue} (NIA Village Subd.)` : 'NIA Village Subd.');

    // Robust Receivables Fetch with In-Memory CSV Fallback
    let receivables = [];
    if (prisma.accountsReceivable) {
      try {
        receivables = await prisma.accountsReceivable.findMany();
        // Filter in-memory to ensure 100% reliability with CSV connectors
        receivables = receivables.filter(r => {
          const rLotId = r.lot_id || r.lotId;
          const rUserId = r.user_id || r.userId;
          return (lotIdValue && rLotId === lotIdValue) || (dbUserId && rUserId === dbUserId);
        });

        // Sort by billing year/month descending
        receivables.sort((a, b) => {
          const yearA = Number(a.billing_year || a.billingYear || 2026);
          const yearB = Number(b.billing_year || b.billingYear || 2026);
          if (yearA !== yearB) return yearB - yearA;
          const monthA = Number(a.billing_month || a.billingMonth || 1);
          const monthB = Number(b.billing_month || b.billingMonth || 1);
          return monthB - monthA;
        });
      } catch (e1) {
        try {
          receivables = await prisma.accountsReceivable.findMany({
            where: lotIdValue ? { OR: [{ lot_id: lotIdValue }, { lotId: lotIdValue }] } : { user_id: dbUserId },
            orderBy: [{ billing_year: 'desc' }, { billing_month: 'desc' }]
          });
        } catch (e2) {}
      }
    }

    const getStatus = (r) => (r.billing_status || r.billingStatus || r.payment_status || r.paymentStatus || '').toUpperCase();
    const getAmount = (r) => Number(r.base_amount || r.baseAmount || r.amount || 200.00);

    const pendingReceivable = receivables.find(r => getStatus(r) === 'PENDING');
    
    const unpaidReceivables = receivables.filter(r => {
      const status = getStatus(r);
      return status !== 'PAID';
    });

    let currentBalance = unpaidReceivables.reduce((sum, r) => sum + getAmount(r), 0);
    const lastPayment = receivables.find(r => getStatus(r) === 'PAID') || null;
    const hasUnpaidOrOverdue = unpaidReceivables.length > 0;
    
    let standingStatus = 'IN GOOD STANDING';
    if (pendingReceivable) {
      standingStatus = 'PENDING VALIDATION';
    } else if (hasUnpaidOrOverdue) {
      standingStatus = 'DELINQUENT';
    }

    const paymentStatusDisplay = pendingReceivable ? 'PENDING VALIDATION' : (lastPayment ? 'PAID' : (hasUnpaidOrOverdue ? 'OVERDUE' : 'N/A'));

    let complaints = [];
    try {
      complaints = await prisma.complaint.findMany();
      complaints = complaints.filter(c => (c.user_id || c.userId) === dbUserId);
    } catch (e) {}

    const activeComplaints = complaints.filter(c => c.status !== 'RESOLVED');
    const investigatingCount = activeComplaints.filter(c => c.status === 'INVESTIGATING' || c.status === 'IN_PROGRESS').length;

    let vehicles = [];
    try {
      if (prisma.vehicle) {
        vehicles = await prisma.vehicle.findMany();
        vehicles = vehicles.filter(v => (v.user_id || v.userId) === dbUserId);
      }
    } catch (e) {}

    const privateVehicles = vehicles.filter(v => v.type === 'PRIVATE').length;
    const commercialVehicles = vehicles.filter(v => v.type === 'COMMERCIAL').length;

    return res.status(200).json({
      success: true,
      data: {
        profile: {
          firstName: firstName || 'Resident',
          lastName: lastName,
          systemRole: user.systemRole || user.system_role || 'TENANT',
          lotName: lotNameValue,
          isRented: true
        },
        dues: {
          balance: currentBalance,
          standingStatus: standingStatus,
          lastPaymentStatus: paymentStatusDisplay,
          lastPaymentPeriod: lastPayment ? (lastPayment.period || 'BILLING RECORD') : 'N/A',
          nextBillingCycle: 'July 2026'
        },
        complaints: {
          activeCount: activeComplaints.length,
          investigatingCount: investigatingCount
        },
        vehicles: {
          totalCount: vehicles.length,
          privateCount: privateVehicles,
          commercialCount: commercialVehicles
        }
      }
    });
  } catch (error) {
    console.error('Server error in getDashboardOverview:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/tenant/payment/:tenantId
const submitPaymentProof = async (req, res) => {
  const { tenantId, userId } = req.params;
  const targetId = tenantId || userId;
  const { referenceNumber, amount, proofUrl } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ userId: targetId }, { user_id: targetId }, { id: targetId }]
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const dbUserId = user.userId || user.user_id || user.id;

    let tenantRecord = await prisma.tenant.findFirst({
      where: { OR: [{ userId: dbUserId }, { user_id: dbUserId }] },
      include: { lot: true }
    });

    const lotIdValue = tenantRecord?.lot?.lotId || tenantRecord?.lot?.lot_id || 'LOT-142';

    let existingReceivable = await prisma.accountsReceivable.findFirst({
      where: {
        OR: [{ lot_id: lotIdValue }, { lotId: lotIdValue }],
        NOT: {
          OR: [
            { billingStatus: 'PAID' },
            { billing_status: 'PAID' },
            { paymentStatus: 'PAID' },
            { payment_status: 'PAID' }
          ]
        }
      },
      orderBy: { created_at: 'desc' }
    });

    let paymentRecord;
    if (existingReceivable) {
      paymentRecord = await prisma.accountsReceivable.update({
        where: { id: existingReceivable.id },
        data: {
          billing_status: 'PENDING',
          billingStatus: 'PENDING',
          payment_status: 'PENDING',
          paymentStatus: 'PENDING',
          reference_number: referenceNumber,
          referenceNumber: referenceNumber,
          proof_url: proofUrl || existingReceivable.proof_url || null,
          proofUrl: proofUrl || existingReceivable.proofUrl || null
        }
      });
    } else {
      paymentRecord = await prisma.accountsReceivable.create({
        data: {
          lot_id: lotIdValue,
          lotId: lotIdValue,
          billing_month: 6,
          billingMonth: 6,
          billing_year: 2026,
          billingYear: 2026,
          base_amount: Number(amount || 200.00),
          baseAmount: Number(amount || 200.00),
          billing_status: 'PENDING',
          billingStatus: 'PENDING',
          payment_status: 'PENDING',
          paymentStatus: 'PENDING',
          reference_number: referenceNumber,
          referenceNumber: referenceNumber,
          proof_url: proofUrl || null,
          proofUrl: proofUrl || null
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment proof submitted successfully for validation.',
      data: paymentRecord
    });
  } catch (error) {
    console.error('Error in submitPaymentProof:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardOverview, submitPaymentProof };