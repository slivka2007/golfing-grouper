const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:resetToken', userController.resetPassword);

// Protected routes
router.get('/me', authMiddleware, userController.getCurrentUser);
router.put('/me', authMiddleware, userController.updateCurrentUser);
router.get('/preferences', authMiddleware, userController.getUserPreferences);
router.put('/preferences', authMiddleware, userController.updateUserPreferences);

module.exports = router; 