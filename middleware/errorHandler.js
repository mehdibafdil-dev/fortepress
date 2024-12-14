const log = require("log4js").getLogger("middleware:errorHandler");
log.level = "error";

/**
 * Custom error class for API errors
 */
class ErrorResponse extends Error {
  constructor(message, statusCode, errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.timestamp = new Date().toISOString();
    
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      success: false,
      statusCode: this.statusCode,
      errorCode: this.errorCode,
      message: this.message,
      timestamp: this.timestamp
    };
  }
}

/**
 * Handles different types of errors and formats them consistently
 */
const errorHandler = (err, req, res, next) => {
  // Clone the error object to avoid mutation
  let error = {
    ...err,
    message: err.message || 'Server Error',
    statusCode: err.statusCode || 500,
    errorCode: err.errorCode || 'INTERNAL_ERROR'
  };

  // Log error details
  log.error('Error Details:', {
    path: req.path,
    method: req.method,
    ip: req.ip,
    error: {
      message: error.message,
      stack: err.stack,
      statusCode: error.statusCode,
      errorCode: error.errorCode
    }
  });

  // Handle Axios errors
  if (err.response) {
    const axiosError = err.response.data;
    log.error('External API Error:', axiosError);
    
    return res.status(error.statusCode).json({
      success: false,
      message: axiosError.message || 'External Service Error',
      errorCode: axiosError.errorCode || 'EXTERNAL_API_ERROR',
      timestamp: new Date().toISOString()
    });
  }

  // Handle Validation Errors
  if (err.name === 'ValidationError') {
    error.statusCode = 400;
    error.errorCode = 'VALIDATION_ERROR';
  }

  // Handle Duplicate Key Errors
  if (err.code === 11000) {
    error.statusCode = 400;
    error.message = 'Duplicate field value entered';
    error.errorCode = 'DUPLICATE_ERROR';
  }

  // Handle Cast Errors
  if (err.name === 'CastError') {
    error.statusCode = 400;
    error.message = `Invalid ${err.path}: ${err.value}`;
    error.errorCode = 'INVALID_DATA';
  }

  // Send error response
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errorCode: error.errorCode,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Async error handler wrapper
 * @param {Function} fn - Async function to wrap
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { 
  ErrorResponse, 
  errorHandler,
  asyncHandler
};

/**
 * Usage examples:
 * 
 * // Throwing a custom error
 * throw new ErrorResponse('User not found', 404, 'USER_NOT_FOUND');
 * 
 * // Using async handler
 * router.get('/users', asyncHandler(async (req, res) => {
 *   // Your async code here
 * }));
 */