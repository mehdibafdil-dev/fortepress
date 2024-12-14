require("pretty-error").start();
const { ErrorResponse } = require("../middleware/errorHandler");
const { verifyToken } = require("../utils/paseto");
const log = require("log4js").getLogger("middleware:auth");

// Configure logging
log.level = "info";

/**
 * Extract token from request headers
 * @param {Object} req - Express request object
 * @returns {string|null} - Bearer token or null
 */
const extractToken = (req) => {
  if (req.headers.authorization?.startsWith("Bearer")) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

/**
 * Authentication middleware
 * Verifies the JWT token and sets user data in request
 */
exports.protect = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      log.warn(`Authentication failed: No token provided - IP: ${req.ip}`);
      return next(new ErrorResponse("Authentication required", 401));
    }

    // Verify Paseto Token
    const decoded = await verifyToken(token);

    if (!decoded.success) {
      log.warn(`Invalid token detected - IP: ${req.ip}`);
      return next(new ErrorResponse("Invalid or expired token", 401));
    }

    // Set user data in request
    req.user = decoded.data;
    log.info(`User authenticated successfully - ID: ${decoded.data.id}`);

    next();
  } catch (error) {
    log.error(`Authentication error: ${error.message}`, {
      stack: error.stack,
      ip: req.ip
    });

    return next(new ErrorResponse("Authentication failed", 401));
  }
};

/**
 * Authorization middleware
 * Checks if user has required role
 * @param {...string} roles - Allowed roles
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        log.error("Authorization attempted without user data");
        return next(new ErrorResponse("User not authenticated", 401));
      }

      if (!roles.includes(req.user.role)) {
        log.warn(`Unauthorized access attempt - User: ${req.user.id}, Role: ${req.user.role}`);
        return next(new ErrorResponse(`Role '${req.user.role}' is not authorized`, 403));
      }

      log.info(`User authorized successfully - ID: ${req.user.id}, Role: ${req.user.role}`);
      next();
    } catch (error) {
      log.error(`Authorization error: ${error.message}`, {
        stack: error.stack,
        userId: req.user?.id
      });

      return next(new ErrorResponse("Authorization failed", 403));
    }
  };
};

/**
 * Example usage:
 * 
 * // Protect route
 * router.get('/protected', protect, (req, res) => {});
 * 
 * // Protect route and require admin role
 * router.get('/admin', protect, authorize('admin'), (req, res) => {});
 */