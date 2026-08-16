const express = require('express');
const router = express.Router();
const { getVehiclesOverview } = require('../controllers/registeredVehicleController');

// This handles the GET request for /api/registered-vehicles
router.get('/', getVehiclesOverview);

module.exports = router;