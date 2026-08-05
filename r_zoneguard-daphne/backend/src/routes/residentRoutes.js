const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');

// Existing get residents route
router.get('/', residentController.getResidents);

// New add resident route
router.post('/', residentController.addResident);

module.exports = router;