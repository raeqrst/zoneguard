const express = require('express');
const router = express.Router();
const { getFinancials, getComplaints } = require('../controllers/directorController');

// GET /api/director/financials
router.get('/financials', getFinancials);

// GET /api/director/complaints
router.get('/complaints', getComplaints);

module.exports = router;