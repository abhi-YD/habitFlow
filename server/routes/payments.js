const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const {
  createOrder,
  verifyPayment,
  getPlanStatus,
  cancelPlan
} = require('../controllers/paymentController');

router.post('/create-order',    auth, createOrder);
router.post('/verify',          auth, verifyPayment);
router.get('/status',           auth, getPlanStatus);
router.post('/cancel',          auth, cancelPlan);

module.exports = router;