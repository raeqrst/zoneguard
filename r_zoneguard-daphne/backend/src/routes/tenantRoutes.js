const express = require('express');
const router = express.Router();

// Import Tenant Controllers
const { getDashboardOverview } = require('../controllers/tenantDashboardController');
const { getPaymentPageData, submitPaymentProof } = require('../controllers/tenantPaymentController');
const { getTenantComplaints, createComplaint } = require('../controllers/tenantComplaintController');
const { getProfile, updateProfile } = require('../controllers/tenantSettingsController');

// ==========================================
// 1. Dashboard Routes
// ==========================================
router.get('/dashboard/:tenantId', getDashboardOverview);

// ==========================================
// 2. Payments Routes
// ==========================================
router.get('/payments/:tenantId', getPaymentPageData);
router.post('/payment/:tenantId', submitPaymentProof);

// ==========================================
// 3. Complaints Routes
// ==========================================
router.get('/complaints/:tenantId', getTenantComplaints);
router.post('/complaints/:tenantId', createComplaint); // <-- Added /:tenantId here

// ==========================================
// 4. Account Settings Routes
// ==========================================
router.get('/settings/:tenantId', getProfile);
router.put('/settings/:tenantId', updateProfile);

module.exports = router;