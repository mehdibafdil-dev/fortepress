const express = require("express");
const router = express.Router();
const analyticController = require("../../controllers/analytic");
const { protect, authorize } = require("../../middleware/auth");

/**
 * Analytics Routes
 * @module routes/analytics
 */


// Error handling for this router
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Error in analytics routes",
    error: err.message
  });
});

module.exports = router;