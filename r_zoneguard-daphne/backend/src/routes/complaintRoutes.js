const express = require('express');
const complaintController = require('../controllers/complaintController');

const router = express.Router();

// GET /api/complaints
router.get('/', complaintController.getAllComplaints);

// POST /api/complaints
router.post('/', complaintController.createComplaint);

// PATCH /api/complaints/:id/status
router.patch('/:id/status', complaintController.updateComplaintStatus);

module.exports = router;