const { V3 } = require("paseto");
const log = require('../config/logger').getLogger('utils:paseto');

// Configure logging
log.level = "info";

// Token configuration
const TOKEN_CONFIG = {
  DEFAULT_EXPIRY: "24h",
  MINIMUM_PAYLOAD_SIZE: 10,
  MAXIMUM_PAYLOAD_SIZE: 1024 * 10 // 10KB
};

/**
 * Generate PASETO token
 * @param {Object} payload - Data to be encrypted
 * @param {Object} options - Token generation options
 * @returns {Promise<Object>} Token generation result
 */
const generateToken = async (payload, options = {}) => {
  try {
    // Validate payload
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid payload provided');
    }

    // Validate payload size
    const payloadSize = Buffer.from(JSON.stringify(payload)).length;
    if (payloadSize < TOKEN_CONFIG.MINIMUM_PAYLOAD_SIZE) {
      throw new Error('Payload too small');
    }
    if (payloadSize > TOKEN_CONFIG.MAXIMUM_PAYLOAD_SIZE) {
      throw new Error('Payload too large');
    }

    // Validate secret key
    if (!process.env.PASETO_SECRET_KEY) {
      throw new Error('PASETO secret key not configured');
    }

    log.debug('Generating token for payload', {
      payloadSize,
      expiresIn: options.expiresIn || TOKEN_CONFIG.DEFAULT_EXPIRY
    });

    // Generate token
    const token = await V3.encrypt(
      payload,
      process.env.PASETO_SECRET_KEY,
      {
        expiresIn: options.expiresIn || TOKEN_CONFIG.DEFAULT_EXPIRY,
        ...options
      }
    );

    log.info('Token generated successfully');

    return {
      success: true,
      statusCode: 200,
      message: "Token generated successfully",
      data: token
    };
  } catch (error) {
    log.error('Token generation failed:', error);
    return {
      success: false,
      statusCode: 500,
      message: `Token generation failed: ${error.message}`,
      error: error.message
    };
  }
};

/**
 * Verify and decrypt PASETO token
 * @param {string} token - PASETO token to verify
 * @returns {Promise<Object>} Token verification result
 */
const verifyToken = async (token) => {
  try {
    // Validate token
    if (!token || typeof token !== 'string') {
      throw new Error('Invalid token provided');
    }

    // Validate secret key
    if (!process.env.PASETO_SECRET_KEY) {
      throw new Error('PASETO secret key not configured');
    }

    log.debug('Verifying token');

    // Decrypt and verify token
    const decoded = await V3.decrypt(token, process.env.PASETO_SECRET_KEY);

    log.info('Token verified successfully');

    return {
      success: true,
      statusCode: 200,
      message: "Token verified successfully",
      data: decoded
    };
  } catch (error) {
    log.error('Token verification failed:', error);
    return {
      success: false,
      statusCode: 401,
      message: "Invalid or expired token",
      error: error.message
    };
  }
};

/**
 * Generate new PASETO secret key
 * @returns {Promise<string>} Generated secret key
 */
const generateSecretKey = async () => {
  try {
    const secretKey = await V3.generateKey("local", { format: "paserk" });
    log.info('New secret key generated successfully');
    return secretKey;
  } catch (error) {
    log.error('Secret key generation failed:', error);
    throw error;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  generateSecretKey,
  TOKEN_CONFIG
};

/**
 * Usage example:
 * 
 * const { generateToken, verifyToken } = require('../utils/paseto');
 * 
 * // Generate token
 * const token = await generateToken({ userId: 123 }, { expiresIn: '1h' });
 * 
 * // Verify token
 * const verified = await verifyToken(token.data);
 */