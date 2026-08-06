const prisma = require('../config/prisma');

const monthMap = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
};

// GET /api/collector/disputes
const getDisputes = async (req, res) => {
  try {
    const disputeClient = prisma.paymentDispute || prisma.PaymentDispute || prisma.payment_dispute || prisma.paymentDisputes;
    const homeownerClient = prisma.homeowner || prisma.Homeowner;
    const userClient = prisma.user || prisma.User;

    let disputes = [];
    let homeownersMap = {};
    let usersMap = {};

    if (disputeClient && typeof disputeClient.findMany === 'function') {
      try {
        disputes = await disputeClient.findMany({
          orderBy: { createdAt: 'desc' }
        });
      } catch (err) {
        try {
          disputes = await disputeClient.findMany();
        } catch (innerErr) {
          console.error('>>> [BACKEND] Dispute table query failed:', innerErr.message);
        }
      }
    }

    if (homeownerClient && typeof homeownerClient.findMany === 'function') {
      try {
        const homeowners = await homeownerClient.findMany();
        homeowners.forEach(h => {
          const hid = h.homeownerId || h.homeowner_id || h.id;
          if (hid) {
            homeownersMap[hid] = h.userId || h.user_id;
          }
        });
      } catch (e) {}
    }

    if (userClient && typeof userClient.findMany === 'function') {
      try {
        const users = await userClient.findMany();
        users.forEach(u => {
          const uid = u.userId || u.user_id || u.id;
          if (uid) {
            usersMap[uid] = {
              firstName: u.firstName || u.first_name || '',
              lastName: u.lastName || u.last_name || ''
            };
          }
        });
      } catch (e) {}
    }

    const formattedDisputes = disputes.map(d => {
      const hid = d.homeownerId || d.homeowner_id;
      const uid = homeownersMap[hid];
      const userInfo = uid ? usersMap[uid] : {};
      const residentName = `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim() || hid || 'Resident';
      const statusVal = (d.status || d.disputeStatus || d.dispute_status || 'PENDING').toUpperCase();

      const disputeId = d.disputeId || d.dispute_id || d.id;
      const billingId = d.billingId || d.billing_id || 'N/A';
      const claimText = d.homeownerClaim || d.homeowner_claim || d.claim || 'No description provided';
      const periodVal = d.referenceMonth || d.reference_month || d.period || 'N/A';
      const evidenceVal = d.evidenceUrl || d.evidence_url || d.evidence || null;
      const createdAtVal = d.createdAt || d.created_at || new Date();

      return {
        id: disputeId,
        disputeId: disputeId,
        dispute_id: disputeId,
        homeownerId: hid,
        homeowner_id: hid,
        residentName: residentName,
        billingId: billingId,
        billing_id: billingId,
        claim: claimText,
        homeowner_claim: claimText,
        period: periodVal,
        reference_month: periodVal,
        evidenceUrl: evidenceVal,
        evidence_url: evidenceVal,
        status: statusVal,
        dispute_status: statusVal,
        createdAt: createdAtVal,
        created_at: createdAtVal
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedDisputes
    });
  } catch (error) {
    console.error('>>> [BACKEND] Error in getDisputes:', error);
    return res.status(200).json({ success: true, data: [] });
  }
};

// PUT / PATCH /api/collector/disputes/:id
const updateDisputeStatus = async (req, res) => {
  const { id } = req.params;
  const { status, dispute_status } = req.body;
  const finalStatus = (status || dispute_status || '').toUpperCase();

  try {
    const disputeClient = prisma.paymentDispute || prisma.PaymentDispute || prisma.payment_dispute || prisma.paymentDisputes;

    if (!disputeClient || !id) {
      return res.status(400).json({ success: false, message: 'Invalid dispute client or ID' });
    }

    let disputeRecord = null;
    try {
      disputeRecord = await disputeClient.findUnique({
        where: { disputeId: id }
      });
    } catch {
      try {
        disputeRecord = await disputeClient.findUnique({
          where: { id: id }
        });
      } catch (e) {}
    }

    if (!disputeRecord && typeof disputeClient.findFirst === 'function') {
      try {
        disputeRecord = await disputeClient.findFirst({
          where: {
            OR: [
              { disputeId: id },
              { id: id }
            ]
          }
        });
      } catch (e) {}
    }

    let updatedDispute = null;
    try {
      updatedDispute = await disputeClient.update({
        where: { disputeId: id },
        data: { status: finalStatus }
      });
    } catch {
      try {
        updatedDispute = await disputeClient.update({
          where: { id: id },
          data: { status: finalStatus }
        });
      } catch (innerErr) {
        try {
          await prisma.$executeRaw`
            UPDATE payment_disputes 
            SET status = ${finalStatus}, dispute_status = ${finalStatus} 
            WHERE dispute_id = ${id} OR id = ${id}
          `;
          updatedDispute = { disputeId: id, status: finalStatus };
        } catch (rawErr) {
          console.error('>>> [BACKEND] Failed to update dispute status:', rawErr);
          throw rawErr;
        }
      }
    }

    if (finalStatus === 'RESOLVED') {
      const billingId = disputeRecord?.billingId || disputeRecord?.billing_id;
      const referenceMonth = disputeRecord?.referenceMonth || disputeRecord?.reference_month || disputeRecord?.period;

      let billingMonthNum = null;
      let billingYearNum = null;

      if (referenceMonth) {
        const parts = referenceMonth.toString().trim().split(/\s+/);
        if (parts.length >= 2) {
          const mStr = parts[0].toLowerCase().substring(0, 3);
          billingMonthNum = monthMap[mStr] || null;
          billingYearNum = parseInt(parts[1], 10) || null;
        }
      }

      try {
        if (billingId && billingId !== 'N/A') {
          await prisma.$executeRaw`
            UPDATE accounts_receivables 
            SET billing_status = 'PAID', date_paid = CURRENT_DATE 
            WHERE billing_id = ${billingId}
          `;
        } else if (billingMonthNum && billingYearNum) {
          await prisma.$executeRaw`
            UPDATE accounts_receivables 
            SET billing_status = 'PAID', date_paid = CURRENT_DATE 
            WHERE billing_month = ${billingMonthNum} AND billing_year = ${billingYearNum}
          `;
        }
      } catch (arErr) {
        console.error('>>> [BACKEND] Failed to update accounts receivable via raw SQL:', arErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Dispute status successfully updated to ${finalStatus}`,
      data: updatedDispute
    });
  } catch (error) {
    console.error('>>> [BACKEND] Error in updateDisputeStatus:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDisputes, updateDisputeStatus };