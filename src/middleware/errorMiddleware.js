/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error for server side debugging
  console.error(err.stack);

  // Default error status and message
  const status = err.statusCode || 500;
  const message = err.message || 'Something went wrong on the server';
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: err.message,
      data: null
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid token or not authenticated',
      data: null
    });
  }

  // Default error response
  return res.status(status).json({
    success: false,
    error: err.name || 'Server Error',
    message,
    data: null,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = { errorHandler }; 