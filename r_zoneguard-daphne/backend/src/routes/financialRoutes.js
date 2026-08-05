const express = require('express');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/financials/ledger/:propertyId
router.get('/ledger/:propertyId', requireAuth, async (req, res) => {
  // TODO: fetch invoices + payments for a property (lot_standing, transactions tables)
  res.json({ message: 'Get ledger - not yet implemented' });
});

// POST /api/financials/payments
router.post('/payments', requireAuth, async (req, res) => {
  // TODO: record GCash/Maya reference number, dedupe by reference at DB level
  res.status(201).json({ message: 'Record payment - not yet implemented' });
});

// GET /api/financials/reports (Director/Admin only)
router.get('/reports', requireAuth, requireRole('admin', 'director'), async (req, res) => {
  // TODO: aggregate financial reports for association officers
  res.json({ message: 'Financial reports - not yet implemented' });
});

module.exports = router;
