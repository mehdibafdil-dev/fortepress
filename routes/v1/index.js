const express = require('express');
const router = express.Router();

/**
 * API Routes Configuration
 * Version 1.0
 */

// Import route modules
const analyticRoutes = require('./analytic');

// API Documentation
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to API V1',
    version: '1.0',
    endpoints: {
      analytics: '/analytics',
    }
  });
});

// Analytics routes
router.use('/analytics', analyticRoutes);

// Error handling for v1 routes
router.use((err, req, res, next) => {
  console.error(`V1 Router Error: ${err.message}`);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler for v1 routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

module.exports = router;