require("pretty-error").start();
const asyncHandler = require("express-async-handler");
const analyticService = require("../services/analytic");
const log = require("log4js").getLogger("controllers:analytic");
log.level = "debug";

// * @route GET /api/v1/analytics
// @desc    Get analytics data
// @access  Public
exports.getAnalytics = asyncHandler(async (req, res, next) => {
  try {
    const data = await analyticService.getAnalytic();
    
    // Log the successful retrieval of analytics data
    log.debug("Analytics data retrieved successfully:", data);
    
    return res.status(200).json({ success: true, data });
  } catch (error) {
    // Log the error for debugging purposes
    log.error("Error retrieving analytics data:", error);
    
    // Pass the error to the next middleware for centralized error handling
    return next(error);
  }
});