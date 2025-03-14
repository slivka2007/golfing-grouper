const express = require('express');
const router = express.Router();
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/authMiddleware');
const teeTimeController = require('../controllers/teeTimeController');

// Public routes
router.post('/', teeTimeController.createTeeTime);
router.get('/token/:token', teeTimeController.getTeeTimeByToken);

// Semi-protected routes (auth optional)
router.get('/:id', optionalAuthMiddleware, teeTimeController.getTeeTimeById);

// Protected routes
router.get('/', authMiddleware, teeTimeController.getAllTeeTimes);
router.put('/:id', authMiddleware, teeTimeController.updateTeeTime);
router.delete('/:id', authMiddleware, teeTimeController.deleteTeeTime);

module.exports = router; 