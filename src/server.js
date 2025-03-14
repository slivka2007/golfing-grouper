require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

/**
 * Import route modules
 * Each module handles a specific set of API endpoints
 */
const userRoutes = require('./routes/userRoutes');
const teeTimeRoutes = require('./routes/teeTimeRoutes');
const requestRoutes = require('./routes/requestRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

/**
 * Import middleware
 * These handle cross-cutting concerns like error handling and authentication
 */
const { errorHandler } = require('./middleware/errorMiddleware');
const { authMiddleware } = require('./middleware/authMiddleware');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

/**
 * Application Middleware
 * - express.json(): Parse JSON request bodies
 * - express.urlencoded(): Parse URL-encoded form data
 * - cors(): Enable Cross-Origin Resource Sharing
 * - helmet(): Set security-related HTTP headers
 * - morgan(): HTTP request logger
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

/**
 * API Routes
 * Mount the different route modules at their respective endpoints
 */
app.use('/api/users', userRoutes);
app.use('/api/tee-times', teeTimeRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/payments', paymentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

// Global error handler middleware - must be last
app.use(errorHandler);

/**
 * Start the server
 * Log the port number for debugging purposes
 */
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

/**
 * Handle unhandled promise rejections
 * Log the error and gracefully shut down the server
 */
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  console.error('Unhandled Rejection at:', promise, 'reason:', err);
  
  // Close server & exit process with failure code
  server.close(() => process.exit(1));
});

/**
 * Handle uncaught exceptions
 * Log the error and gracefully shut down the server
 */
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.error('Uncaught Exception:', err);
  
  // Close server & exit process with failure code
  server.close(() => process.exit(1));
});

// Export app for testing
module.exports = app; 