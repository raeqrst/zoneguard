const express = require('express');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const prisma = require('../config/prisma');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    // 1. Fetch verified transactions for 2026
    const transactions = await prisma.transaction.findMany({
      where: {
        paymentStatus: 'VERIFIED',
        transactionDate: {
          gte: new Date('2026-01-01T00:00:00.000Z'),
          lt: new Date('2027-01-01T00:00:00.000Z')
        }
      }
    });

    const monthlyTotals = Array(12).fill(0);
    transactions.forEach(tx => {
      if (tx.transactionDate) {
        const monthIndex = new Date(tx.transactionDate).getMonth();
        monthlyTotals[monthIndex] += Number(tx.amount || 0);
      }
    });

    // 2. Fetch monthly allocations from your database table
    const allocations = await prisma.monthlyAllocation.findMany({
      where: {
        billingCycle: {
          gte: new Date('2026-01-01T00:00:00.000Z'),
          lt: new Date('2027-01-01T00:00:00.000Z')
        }
      }
    });

    const monthlyBudgets = Array(12).fill(0);
    allocations.forEach(alloc => {
      if (alloc.billingCycle) {
        const monthIndex = new Date(alloc.billingCycle).getMonth();
        monthlyBudgets[monthIndex] = Number(alloc.totalGrossCollections || 0);
      }
    });

    res.json({ success: true, monthlyTotals, monthlyBudgets });
  } catch (error) {
    console.error("Financial fetch error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/financials/ledger/:propertyId
router.get('/ledger/:propertyId', requireAuth, async (req, res) => {
  res.json({ message: 'Get ledger - not yet implemented' });
});

// POST /api/financials/payments
router.post('/payments', requireAuth, async (req, res) => {
  res.status(201).json({ message: 'Record payment - not yet implemented' });
});

// GET /api/financials/reports (Director/Admin only)
router.get('/reports', requireAuth, requireRole('admin', 'director'), async (req, res) => {
  res.json({ message: 'Financial reports - not yet implemented' });
});

module.exports = router;