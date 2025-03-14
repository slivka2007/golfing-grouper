const express = require('express');
const router = express.Router();
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/authMiddleware');
const requestController = require('../controllers/requestController');

// Public routes
router.post('/', optionalAuthMiddleware, requestController.createRequest);

// Protected routes
router.get('/', authMiddleware, requestController.getUserRequests);
router.get('/:id', authMiddleware, requestController.getRequestById);
router.put('/:id', authMiddleware, requestController.updateRequest);
router.delete('/:id', authMiddleware, requestController.cancelRequest);

// Special routes
router.get('/status/:token', requestController.getRequestStatusByToken);

module.exports = router; 