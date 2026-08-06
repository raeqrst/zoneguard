const express = require('express');
const router = express.Router();
const { getPendingPayments, updatePaymentStatus } = require('../controllers/collectorPaymentController');
const { getDisputes, updateDisputeStatus } = require('../controllers/collectorDisputeController');

router.get('/payments', getPendingPayments);
router.put('/payments/:id', updatePaymentStatus);
router.patch('/payments/:id', updatePaymentStatus);
router.patch('/payments', updatePaymentStatus);

router.get('/disputes', getDisputes);
router.put('/disputes/:id', updateDisputeStatus);
router.patch('/disputes/:id', updateDisputeStatus);

module.exports = router;