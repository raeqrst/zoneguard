// backend/src/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

// ==========================================
// ADMIN DASHBOARD HANDLER
// ==========================================
const handleAdminDashboard = async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // 1. Pending Tenants
    const pendingTenants = await prisma.tenant.count({
      where: { approvalStatus: 'PENDING' }
    });

    // 2. Open Complaints
    const openComplaints = await prisma.complaint.count({
      where: { status: { notIn: ['RESOLVED', 'DISMISSED'] } }
    });

    // 3. Active Unique Tenants Count
    const activeTenantsRows = await prisma.tenant.findMany({
      where: { delegationStatus: 'ACTIVE', userId: { not: null } },
      select: { userId: true }
    });
    const totalActiveTenants = new Set(activeTenantsRows.map(t => t.userId)).size;

    // 4. Current-Month Collection Rate
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    const verifiedThisMonth = await prisma.transaction.count({
      where: {
        paymentStatus: { in: ['VERIFIED', 'COMPLETED'] },
        transactionDate: { gte: startOfMonth, lte: endOfMonth }
      }
    });

    const collectionRate = totalActiveTenants > 0 
      ? Number(((verifiedThisMonth / totalActiveTenants) * 100).toFixed(1)) 
      : 0.0;

    // 5. Average Resolution Time
    const resolvedComplaints = await prisma.complaint.findMany({
      select: { createdAt: true, updatedAt: true }
    });

    let avgDays = "0.0";
    if (resolvedComplaints.length > 0) {
      const totalMilliseconds = resolvedComplaints.reduce((acc, curr) => {
        const created = new Date(curr.createdAt);
        const updated = new Date(curr.updatedAt);
        return acc + Math.max(0, updated - created);
      }, 0);
      avgDays = (totalMilliseconds / resolvedComplaints.length / (1000 * 60 * 60 * 24)).toFixed(1);
    }
    const avgResolution = `${avgDays} days`;

    // 6. Issue Categorization
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

    // 7. Paid Overview
    const paidTransactions = await prisma.transaction.findMany({
      where: { paymentStatus: { in: ['VERIFIED', 'COMPLETED'] } },
      select: { transactionDate: true }
    });

    const monthlyCounts = new Array(12).fill(0);
    paidTransactions.forEach(t => {
      if (t.transactionDate) {
        const d = new Date(t.transactionDate);
        const monthIndex = d.getUTCMonth();
        if (monthIndex >= 0 && monthIndex < 12) {
          monthlyCounts[monthIndex]++;
        }
      }
    });

    const paidOverview = MONTH_LABELS.map((label, index) => ({
      month: label,
      value: monthlyCounts[index]
    }));

    // 8. Tenant Turnover Rate
    const allTenants = await prisma.tenant.findMany({
      where: { approvalStatus: 'APPROVED', userId: { not: null } },
      select: { userId: true, createdAt: true, updatedAt: true, delegationStatus: true }
    });

    const userFirstMoveInMonth = new Map();
    const userFirstMoveOutMonth = new Map();

    allTenants.forEach(tn => {
      const uid = tn.userId;
      if (!uid) return;

      if (tn.createdAt) {
        const dIn = new Date(tn.createdAt);
        if (dIn.getUTCFullYear() === currentYear) {
          const monthIdx = dIn.getUTCMonth();
          if (monthIdx >= 0 && monthIdx < 12) {
            if (!userFirstMoveInMonth.has(uid) || monthIdx < userFirstMoveInMonth.get(uid)) {
              userFirstMoveInMonth.set(uid, monthIdx);
            }
          }
        }
      }

      if (['REVOKED', 'INACTIVE'].includes(tn.delegationStatus)) {
        const dOut = tn.updatedAt || tn.createdAt;
        if (dOut) {
          const d = new Date(dOut);
          if (d.getUTCFullYear() === currentYear) {
            const monthIdx = d.getUTCMonth();
            if (monthIdx >= 0 && monthIdx < 12) {
              if (!userFirstMoveOutMonth.has(uid) || monthIdx < userFirstMoveOutMonth.get(uid)) {
                userFirstMoveOutMonth.set(uid, monthIdx);
              }
            }
          }
        }
      }
    });

    const moveInCounts = Array(12).fill(0);
    const moveOutCounts = Array(12).fill(0);

    userFirstMoveInMonth.forEach(monthIdx => { moveInCounts[monthIdx]++; });
    userFirstMoveOutMonth.forEach(monthIdx => { moveOutCounts[monthIdx]++; });

    const tenantTurnover = MONTH_LABELS.map((m, index) => ({
      month: m,
      moveIn: moveInCounts[index],
      moveOut: moveOutCounts[index]
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

    return res.json({ success: true, data: payload, ...payload });

  } catch (error) {
    console.error("Admin Dashboard API Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// DIRECTOR DASHBOARD HANDLER
// ==========================================
const handleDirectorDashboard = async (req, res) => {
  try {
    const pendingApprovals = await prisma.tenant.count({
      where: { approvalStatus: "PENDING" }
    });

    const openComplaints = await prisma.complaint.count({
      where: { NOT: { status: "RESOLVED" } }
    });

    const paidResidents = await prisma.accountsReceivable.count({
      where: { billingStatus: "PAID" }
    });

    const totalResidents = (await prisma.homeowner.count()) + (await prisma.tenant.count());

    const paidPercentage = totalResidents === 0
      ? "0.0"
      : ((paidResidents / totalResidents) * 100).toFixed(1);

    const metrics = [
      { label: "Pending Approvals", value: pendingApprovals, detail: `${pendingApprovals} awaiting review`, tone: "green", icon: "◌" },
      { label: "Open Complaints", value: openComplaints, detail: "Current unresolved complaints", tone: "red", icon: "⚠" },
      { label: "Paid Residents", value: `${paidPercentage}%`, detail: "Collection compliance", tone: "blue", icon: "◎" },
      { label: "Average Resolution", value: "Live", detail: "Calculated from complaints", tone: "purple", icon: "◔" }
    ];

    const complaintGroups = await prisma.complaint.groupBy({
      by: ["complaintCategory"],
      _count: true
    });

    const colors = ["#b6f0c2", "#f9d6cf", "#f7ba1e", "#b8aedf", "#aadff4", "#88d8b0", "#f48fb1"];
    const issueCategories = complaintGroups.map((item, index) => ({
      label: item.complaintCategory,
      value: item._count,
      color: colors[index % colors.length]
    }));

    const zones = await prisma.zone.findMany({
      include: {
        users: {
          include: { complaints: true }
        }
      }
    });

    const complaintOverview = zones.map(zone => {
      let total = 0;
      zone.users.forEach(user => { total += user.complaints.length; });
      return { zone: zone.name, value: total };
    });

    const turnover = [];
    const currentYear = new Date().getFullYear();

    for (let month = 0; month < 12; month++) {
      const start = new Date(currentYear, month, 1);
      const end = new Date(currentYear, month + 1, 1);

      const moveIn = await prisma.tenant.count({
        where: { createdAt: { gte: start, lt: end } }
      });

      turnover.push({
        month: start.toLocaleString("default", { month: "short" }),
        moveIn,
        moveOut: 0
      });
    }

    return res.status(200).json({
      success: true,
      metrics,
      issueCategories,
      complaintOverview,
      turnover
    });

  } catch (err) {
    console.error("Director Dashboard API Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ==========================================
// ROUTE ALIASES (Catches all potential fetch paths)
// ==========================================

// Admin aliases
router.get('/', handleAdminDashboard);
router.get('/admin', handleAdminDashboard);
router.get('/admin/dashboard', handleAdminDashboard);

// Director aliases
router.get('/director', handleDirectorDashboard);
router.get('/director/dashboard', handleDirectorDashboard);

module.exports = router;