const express = require("express");
const router = express.Router();

// Import route modules
const v1Routes = require("./v1");

/**
 * Base API Routes Configuration
 */

// Welcome route
router.get("/", (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "Welcome to the Express API",
    version: "1.0.0",
    documentation: "/api/docs"
  });
});

// API version 1 routes
router.use("/api/v1", v1Routes);

// Global 404 handler
router.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Resource not found"
  });
});

// Global error handler
router.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

module.exports = router;