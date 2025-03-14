const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const paymentController = require('../controllers/paymentController');

// Public routes
router.post('/create-payment-intent', paymentController.createPaymentIntent);
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

// Protected routes
router.get('/methods', authMiddleware, paymentController.getPaymentMethods);
router.post('/methods', authMiddleware, paymentController.addPaymentMethod);
router.delete('/methods/:id', authMiddleware, paymentController.deletePaymentMethod);

module.exports = router; 