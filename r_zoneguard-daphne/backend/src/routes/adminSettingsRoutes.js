// adminSettingsRoutes.js
const express = require('express');
const router = express.Router();
const { getAdminSettings, updateAdminSettings } = require('../controllers/adminSettingsController');

router.get('/', getAdminSettings);
router.put('/', updateAdminSettings);

module.exports = router;