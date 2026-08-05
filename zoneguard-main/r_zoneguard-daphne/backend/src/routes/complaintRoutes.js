const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/complaints
router.get('/', requireAuth, async (req, res) => {
  // TODO: fetch complaints scoped to req.user (resident sees own; admin/director sees all)
  res.json({ message: 'List complaints - not yet implemented' });
});

// POST /api/complaints
router.post('/', requireAuth, async (req, res) => {
  // TODO: insert new complaint record, attach requesting user as filer
  res.status(201).json({ message: 'Create complaint - not yet implemented' });
});

module.exports = router;
