const prisma = require('../config/prisma');

// GET /api/tenant/payments/:tenantId
const getPaymentPageData = async (req, res) => {
  const { tenantId, userId } = req.params;
  const targetId = tenantId || userId;
  const { year = '2026', search = '' } = req.query;

  console.log('--> Payment page request received for ID:', targetId);

  if (!targetId || targetId === 'undefined' || targetId === 'null') {
    return res.status(400).json({ success: false, message: 'Missing or invalid tenant identifier.' });
  }

  try {
    let user = null;
    let tenantRecord = null;
    let lotRecord = null;

    const allUsers = await prisma.user.findMany({ include: { tenants: { include: { lot: true } } } }).catch(() => []);
    const allTenants = await prisma.tenant.findMany({ include: { user: true, lot: true } }).catch(() => []);
    const allLots = await prisma.lot.findMany().catch(() => []);

    user = allUsers.find(u => {
      const uId = u.userId || u.user_id || u.id;
      return uId && uId.toString().toLowerCase() === targetId.toString().toLowerCase();
    });

    if (!user) {
      tenantRecord = allTenants.find(t => {
        const tId = t.tenantId || t.tenant_id || t.userId || t.user_id || t.lotId || t.lot_id;
        return tId && tId.toString().toLowerCase() === targetId.toString().toLowerCase();
      });
      if (tenantRecord?.user) {
        user = allUsers.find(u => (u.userId || u.user_id || u.id) === (tenantRecord.user.userId || tenantRecord.user.user_id || tenantRecord.user.id));
      }
    } else {
      tenantRecord = allTenants.find(t => t.userId === (user.userId || user.user_id || user.id));
    }

    const dbUserId = user?.userId || user?.user_id || user?.id || null;
    const lotIdValue = tenantRecord?.lotId || tenantRecord?.lot_id || tenantRecord?.lot?.lotId || tenantRecord?.lot?.lot_id || user?.tenants?.[0]?.lotId || user?.tenants?.[0]?.lot?.lotId || null;

    if (lotIdValue) {
      lotRecord = allLots.find(l => (l.lotId || l.lot_id || l.id).toString().toLowerCase() === lotIdValue.toString().toLowerCase());
    }

    const firstName = user?.firstName || user?.first_name || tenantRecord?.firstName || tenantRecord?.first_name || 'Resident';
    const lastName = user?.lastName || user?.last_name || tenantRecord?.lastName || tenantRecord?.last_name || '';
    
    // Format name as "First Name + Last Initial." (e.g., John C.)
    const lastNameInitial = lastName ? `${lastName.charAt(0)}.` : '';
    const displayName = `${firstName} ${lastNameInitial}`.trim();
    
    const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || 'R';

    let receivables = [];
    if (prisma.accountsReceivable) {
      const allReceivables = await prisma.accountsReceivable.findMany().catch(() => []);
      receivables = allReceivables.filter(r => {
        const rLotId = (r.lot_id || r.lotId || '').toString().toLowerCase();
        const rUserId = (r.user_id || r.userId || '').toString().toLowerCase();
        const targetLotLower = (lotIdValue || '').toString().toLowerCase();
        const targetUserLower = (dbUserId || targetId || '').toString().toLowerCase();
        return (targetLotLower && rLotId === targetLotLower) || (targetUserLower && rUserId === targetUserLower);
      });
    }

    receivables.sort((a, b) => {
      const yearA = Number(a.billing_year || a.billingYear || 2026);
      const yearB = Number(b.billing_year || b.billingYear || 2026);
      if (yearA !== yearB) return yearB - yearA;
      const monthA = Number(a.billing_month || a.billingMonth || 1);
      const monthB = Number(b.billing_month || b.billingMonth || 1);
      return monthB - monthA;
    });

    const getStatus = (r) => (r.billing_status || r.billingStatus || r.payment_status || r.paymentStatus || 'UNPAID').toUpperCase();
    const getAmount = (r) => Number(r.base_amount || r.baseAmount || r.amount || 200.00);

    const unpaidReceivables = receivables.filter(r => getStatus(r) !== 'PAID');
    const currentBalance = unpaidReceivables.reduce((sum, r) => sum + getAmount(r), 0);

    const pendingReceivable = receivables.find(r => getStatus(r) === 'PENDING');
    const lastPaidRecord = receivables.find(r => getStatus(r) === 'PAID') || null;

    const lotStatus = (lotRecord?.status || lotRecord?.payment_status || '').toUpperCase();
    const isLotDelinquent = lotStatus.includes('DELINQ') || lotRecord?.is_delinquent || lotRecord?.isDelinquent || unpaidReceivables.length > 2;

    let paymentBadgeStatus = 'UP TO DATE';
    if (isLotDelinquent) {
      paymentBadgeStatus = 'DELINQUENT';
    } else if (pendingReceivable) {
      paymentBadgeStatus = 'PENDING PAYMENT';
    } else if (unpaidReceivables.length > 0) {
      paymentBadgeStatus = 'OVERDUE';
    }

    const targetYearNum = Number(year);
    const yearFilteredReceivables = receivables.filter(r => {
      const rYear = Number(r.billing_year || r.billingYear || 2026);
      return rYear === targetYearNum;
    });

    const finalLedgerRows = yearFilteredReceivables.map(r => ({
      id: r.id,
      period: r.period || `${getMonthName(r.billing_month || r.billingMonth || 6)} ${r.billing_year || r.billingYear || 2026}`,
      mode: r.payment_method || r.paymentMethod || 'Online Transfer',
      amount: getAmount(r),
      status: getStatus(r),
      datePaid: r.date_paid || r.datePaid || r.updated_at || r.updatedAt || 'N/A',
      referenceNumber: r.reference_number || r.referenceNumber || null
    }));

    const currentMonthRecord = receivables.find(r => Number(r.billing_month || r.billingMonth) === 6 && Number(r.billing_year || r.billingYear) === 2026) || unpaidReceivables[0] || null;

    return res.status(200).json({
      success: true,
      data: {
        user: {
          name: displayName,
          role: 'TENANT',
          initials: initials
        },
        summary: {
          currentBalance: currentBalance,
          standingStatus: paymentBadgeStatus,
          junePaymentStatus: currentMonthRecord ? getStatus(currentMonthRecord) : 'UNPAID',
          lastPaymentDate: lastPaidRecord ? (lastPaidRecord.date_paid || lastPaidRecord.datePaid || 'N/A') : 'N/A',
          paymentMethod: lastPaidRecord ? (lastPaidRecord.payment_method || lastPaidRecord.paymentMethod || 'Online Transfer') : 'N/A',
          nextBillingCycle: 'July 2026'
        },
        ledger: finalLedgerRows
      }
    });
  } catch (error) {
    console.error('Error in getPaymentPageData:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/tenant/payment/:tenantId
const submitPaymentProof = async (req, res) => {
  const { tenantId, userId } = req.params;
  const targetId = tenantId || userId;
  const { referenceNumber, amount, proofUrl } = req.body;

  try {
    const allUsers = await prisma.user.findMany();
    const user = allUsers.find(u => {
      const uId = u.userId || u.user_id || u.id;
      return uId && uId.toString().toLowerCase() === targetId.toString().toLowerCase();
    });

    const dbUserId = user ? (user.userId || user.user_id || user.id) : targetId;

    let tenantRecord = await prisma.tenant.findFirst({
      where: { OR: [{ userId: dbUserId }, { user_id: dbUserId }] },
      include: { lot: true }
    });

    const lotIdValue = tenantRecord?.lot?.lotId || tenantRecord?.lot?.lot_id || null;

    let existingReceivable = await prisma.accountsReceivable.findFirst({
      where: {
        OR: [
          ...(lotIdValue ? [{ lot_id: lotIdValue }, { lotId: lotIdValue }] : []),
          { user_id: dbUserId },
          { userId: dbUserId }
        ],
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
          base_amount: amount ? Number(amount) : existingReceivable.base_amount,
          baseAmount: amount ? Number(amount) : existingReceivable.baseAmount,
          proof_url: proofUrl || existingReceivable.proof_url || null,
          proofUrl: proofUrl || existingReceivable.proofUrl || null
        }
      });
    } else {
      paymentRecord = await prisma.accountsReceivable.create({
        data: {
          lot_id: lotIdValue,
          lotId: lotIdValue,
          user_id: dbUserId,
          userId: dbUserId,
          billing_month: 6,
          billingMonth: 6,
          billing_year: 2026,
          billingYear: 2026,
          base_amount: amount ? Number(amount) : 200.00,
          baseAmount: amount ? Number(amount) : 200.00,
          billing_status: 'PENDING',
          billingStatus: 'PENDING',
          payment_status: 'PENDING',
          paymentStatus: 'PENDING',
          reference_number: referenceNumber,
          referenceNumber: referenceNumber,
          proof_url: proofUrl || null,
          proofUrl: null
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

function getMonthName(monthNum) {
  const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[monthNum] || 'June';
}

module.exports = { getPaymentPageData, submitPaymentProof };