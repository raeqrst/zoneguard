const express = require('express');
const router = express.Router();
// Use shared Prisma instance to prevent initialization/driver crashes
const prisma = require('../prisma'); 

router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed (August = 7)

    // 1. REAL PENDING TENANTS
    const pendingTenants = await prisma.tenant.count({
      where: { approvalStatus: 'PENDING' }
    });

    // 2. REAL OPEN COMPLAINTS
    const openComplaints = await prisma.complaint.count({
      where: { status: { notIn: ['RESOLVED', 'DISMISSED'] } }
    });

    // 3. REAL ACTIVE TENANTS COUNT (Expected monthly billing count)
    const totalActiveTenants = await prisma.tenant.count({
      where: { delegationStatus: 'ACTIVE' }
    });

    // 4. REAL CURRENT-MONTH COLLECTION RATE
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    const verifiedThisMonth = await prisma.transaction.count({
      where: {
        paymentStatus: { in: ['VERIFIED', 'COMPLETED'] },
        transactionDate: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    // Collection Rate = (Verified Payments This Month / Total Active Tenants) * 100
    const collectionRate = totalActiveTenants > 0 
      ? Number(((verifiedThisMonth / totalActiveTenants) * 100).toFixed(1)) 
      : 0.0;

    // 5. REAL AVERAGE RESOLUTION TIME
    const resolvedComplaints = await prisma.complaint.findMany({
      select: {
        createdAt: true,
        updatedAt: true
      }
    });

    let avgDays = 0;
    if (resolvedComplaints.length > 0) {
      const totalMilliseconds = resolvedComplaints.reduce((acc, curr) => {
        const created = new Date(curr.createdAt);
        const updated = new Date(curr.updatedAt);
        return acc + (updated - created);
      }, 0);
      
      const avgMilliseconds = totalMilliseconds / resolvedComplaints.length;
      avgDays = (avgMilliseconds / (1000 * 60 * 60 * 24)).toFixed(1);
    }
    const avgResolution = `${avgDays} days`;

    // 6. REAL ISSUE CATEGORIZATION (Grouped from DB with chart color mapping)
    const categoryGroups = await prisma.complaint.groupBy({
      by: ['complaintCategory'],
      _count: { complaintCategory: true }
    });

    const palette = ['#BBF7D0', '#FBBF24', '#BAE6FD', '#FBCFE8', '#DDD6FE', '#FECDD3'];
    let issueCategorization = categoryGroups.map((group, idx) => ({
      category: group.complaintCategory,
      label: group.complaintCategory,
      count: group._count.complaintCategory,
      value: group._count.complaintCategory,
      color: palette[idx % palette.length]
    }));

    if (issueCategorization.length === 0) {
      issueCategorization = [{ category: 'No Data', label: 'No Data', count: 0, value: 0, color: '#E5E7EB' }];
    }

    // 7. REAL PAID OVERVIEW (Timezone-safe UTC 12-month breakdown)
    const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    const paidTransactions = await prisma.transaction.findMany({
      where: {
        paymentStatus: { in: ['VERIFIED', 'COMPLETED'] }
      },
      select: {
        transactionDate: true
      }
    });

    const monthlyCounts = new Array(12).fill(0);

    paidTransactions.forEach(t => {
      if (t.transactionDate) {
        const d = new Date(t.transactionDate);
        const monthIndex = d.getUTCMonth(); // Strict UTC extraction prevents shift
        if (monthIndex >= 0 && monthIndex < 12) {
          monthlyCounts[monthIndex]++;
        }
      }
    });

    const paidOverview = MONTH_LABELS.map((label, index) => ({
      month: label,
      value: monthlyCounts[index]
    }));

    // 8. REAL TENANT TURNOVER RATE (Timezone-safe UTC extraction)
    const allTenants = await prisma.tenant.findMany({
      select: { createdAt: true, updatedAt: true, delegationStatus: true }
    });

    const turnoverMap = {};
    MONTH_LABELS.forEach(m => { turnoverMap[m] = { moveIn: 0, moveOut: 0 }; });

    allTenants.forEach(tn => {
      if (tn.createdAt) {
        const dIn = new Date(tn.createdAt);
        const moveInMonth = MONTH_LABELS[dIn.getUTCMonth()];
        if (turnoverMap[moveInMonth]) turnoverMap[moveInMonth].moveIn++;
      }

      if (tn.delegationStatus === 'REVOKED' || tn.delegationStatus === 'INACTIVE') {
        if (tn.updatedAt) {
          const dOut = new Date(tn.updatedAt);
          const moveOutMonth = MONTH_LABELS[dOut.getUTCMonth()];
          if (turnoverMap[moveOutMonth]) turnoverMap[moveOutMonth].moveOut++;
        }
      }
    });

    const tenantTurnover = MONTH_LABELS.map(m => ({
      month: m,
      moveIn: turnoverMap[m].moveIn,
      moveOut: turnoverMap[m].moveOut
    }));

    const payload = {
      pendingTenants,
      openComplaints,
      collectionRate,
      avgResolution,
      issueCategorization,
      paidOverview,
      tenantTurnover
    };

    res.json({ success: true, data: payload, ...payload });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;