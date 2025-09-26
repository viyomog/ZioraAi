const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getPaymentStatus, getPaymentHistory } = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

// Create order (protected)
router.post('/order', auth, createOrder);

// Verify payment (protected)
router.post('/verify', auth, verifyPayment);

// Get payment status (protected)
router.get('/status', auth, getPaymentStatus);

// Get payment history (protected)
router.get('/history', auth, getPaymentHistory);

module.exports = router;