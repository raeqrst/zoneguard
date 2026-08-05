const express = require('express');
const router = express.Router();
const { getTenants, updateTenantStatus } = require('../controllers/tenantmanagementController');

// GET /api/tenant_management
router.get('/', getTenants);

// PATCH /api/tenant_management
router.patch('/', updateTenantStatus);

module.exports = router;