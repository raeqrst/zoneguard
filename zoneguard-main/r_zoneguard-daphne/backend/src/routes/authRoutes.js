const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  res.status(501).json({
    message: 'Auth register scaffold - database-backed implementation not added yet',
  });
});

// POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;