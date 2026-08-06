const express = require('express');
const router = express.Router();
const runRScript = require('../utils/runRScript');

// Route for Complaint Forecasts
router.get('/complaint-forecast', async (req, res) => {
  try {
    const data = await runRScript('complaint_forecast.R');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Route for Financial Forecasts
router.get('/financial-forecast', async (req, res) => {
  try {
    const data = await runRScript('financial_forecast.R');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Route for Operational Insights
router.get('/operational-insights', async (req, res) => {
  try {
    const data = await runRScript('operational_insights.R');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// complaint heatmap
router.get('/complaint-heatmap', async (req, res) => {
  try {
    const data = await runRScript('complaint_heatmap.R');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Route for Complaint Status Map (per-lot ticket status, not density)
router.get('/complaint-status-map', async (req, res) => {
  try {
    const data = await runRScript('complaint_status_by_lot.R');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;