const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Authentication middleware to protect routes
 */
const authMiddleware = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (exclude password)
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password_hash'] }
      });

      if (!req.user) {
        throw new Error('User not found');
      }

      next();
    } catch (error) {
      const err = new Error('Not authorized, token failed');
      err.statusCode = 401;
      next(err);
    }
  }

  if (!token) {
    const err = new Error('Not authorized, no token');
    err.statusCode = 401;
    next(err);
  }
};

/**
 * Optional authentication middleware
 * Authenticates if token is present but doesn't block if missing
 */
const optionalAuthMiddleware = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (exclude password)
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password_hash'] }
      });
    } catch (error) {
      // Just log the error but don't stop the request
      console.error('Token validation failed, continuing as unauthenticated');
    }
  }

  next();
};

module.exports = { authMiddleware, optionalAuthMiddleware }; 