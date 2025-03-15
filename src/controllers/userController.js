const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 * Register a new user
 * @route POST /api/users/register
 * @access Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, zip5, golfExperience, handicap, averageScore } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const error = new Error('User already exists');
      error.statusCode = 400;
      throw error;
    }
    
    // Create user
    const user = await User.create({
      first_name: firstName,
      last_name: lastName,
      email,
      password_hash: password,
      zip_5: zip5,
      golf_experience: golfExperience,
      handicap,
      average_score: averageScore,
      preferences: {}
    });
    
    // Generate token
    const token = user.getSignedJwtToken();
    
    // Return user data without password
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * @route POST /api/users/login
 * @access Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }
    
    // Generate token
    const token = user.getSignedJwtToken();
    
    // Return user data without password
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user
 * @route GET /api/users/me
 * @access Private
 */
const getCurrentUser = async (req, res, next) => {
  try {
    // User is already available in req.user from auth middleware
    res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        firstName: req.user.first_name,
        lastName: req.user.last_name,
        email: req.user.email,
        zip5: req.user.zip_5,
        golfExperience: req.user.golf_experience,
        handicap: req.user.handicap,
        averageScore: req.user.average_score
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update current user
 * @route PUT /api/users/me
 * @access Private
 */
const updateCurrentUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, zip5, golfExperience, handicap, averageScore } = req.body;
    
    // Get user
    const user = await User.findByPk(req.user.id);
    
    // Update user fields
    if (firstName) user.first_name = firstName;
    if (lastName) user.last_name = lastName;
    if (email) user.email = email;
    if (password) user.password_hash = password;
    if (zip5) user.zip_5 = zip5;
    if (golfExperience) user.golf_experience = golfExperience;
    if (handicap) user.handicap = handicap;
    if (averageScore) user.average_score = averageScore;
    
    // Save user
    await user.save();
    
    // Return updated user
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        zip5: user.zip_5,
        golfExperience: user.golf_experience,
        handicap: user.handicap,
        averageScore: user.average_score
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user preferences
 * @route GET /api/users/preferences
 * @access Private
 */
const getUserPreferences = async (req, res, next) => {
  try {
    // Get user
    const user = await User.findByPk(req.user.id);
    
    res.status(200).json({
      success: true,
      preferences: user.preferences || {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user preferences
 * @route PUT /api/users/preferences
 * @access Private
 */
const updateUserPreferences = async (req, res, next) => {
  try {
    const { preferences } = req.body;
    
    // Get user
    const user = await User.findByPk(req.user.id);
    
    // Update preferences
    user.preferences = preferences;
    
    // Save user
    await user.save();
    
    res.status(200).json({
      success: true,
      preferences: user.preferences
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Forgot password
 * @route POST /api/users/forgot-password
 * @access Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Get user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Don't reveal that user doesn't exist for security reasons
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a reset token will be sent'
      });
    }
    
    // Generate reset token
    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_RESET_SECRET,
      { expiresIn: '1h' }
    );
    
    // In a real application, we would send an email with the reset token
    // For now, we'll just return it in the response
    
    res.status(200).json({
      success: true,
      message: 'Reset token generated',
      resetToken
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password
 * @route POST /api/users/reset-password/:resetToken
 * @access Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;
    
    // Verify token
    const decoded = jwt.verify(resetToken, process.env.JWT_RESET_SECRET);
    
    // Get user
    const user = await User.findByPk(decoded.id);
    if (!user) {
      const error = new Error('Invalid token');
      error.statusCode = 400;
      throw error;
    }
    
    // Update password
    user.password_hash = password;
    
    // Save user
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      error.message = 'Invalid token';
      error.statusCode = 400;
    }
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updateCurrentUser,
  getUserPreferences,
  updateUserPreferences,
  forgotPassword,
  resetPassword
}; 