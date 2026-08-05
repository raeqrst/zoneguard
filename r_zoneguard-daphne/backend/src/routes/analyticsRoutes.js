// backend/src/routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const { getAnalyticsData } = require('../controllers/analyticsController');

// Define the route with the properly imported function callback
router.get('/', getAnalyticsData);

module.exports = router;