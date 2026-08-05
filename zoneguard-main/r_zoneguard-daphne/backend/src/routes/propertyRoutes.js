const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/properties/map
// Returns household parcel boundaries/markers with color-coded lot_standing
// for rendering on the Leaflet.js Color-Coded Property Map.
router.get('/map', requireAuth, async (req, res) => {
  // TODO: fetch property coordinates + standing status prepared via QGIS export
  res.json({ message: 'Property map data - not yet implemented' });
});

module.exports = router;
