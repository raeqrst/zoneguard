<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');

// Existing get residents route
router.get('/', residentController.getResidents);

// New add resident route
router.post('/', residentController.addResident);
=======
const express = require("express");

const router = express.Router();

const residentController = require("../controllers/residentController");

router.get("/", residentController.getResidents);
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f

module.exports = router;