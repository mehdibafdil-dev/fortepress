const analyticRepo = require("../repositories/analytic");
const log = require('../config/logger').getLogger('service:analytic');
const { ErrorResponse } = require("../middleware/errorHandler");

log.level = "debug";

/**
 * Analytics Service
 * Handles business logic for analytics data
 */
class AnalyticsService {
  /**
   * Get analytics data
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Analytics data
   */
  async getAnalytics(params = {}) {
    try {
      log.debug("Fetching analytics data with params:", params);

      const data = await analyticRepo.getAnalytics();
      
      log.info("Successfully retrieved analytics data");
      
      return {
        success: true,
        count: data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      log.error("Error in getAnalytics:", error);
      throw new ErrorResponse("Failed to fetch analytics data", 500);
    }
  }

  /**
   * Get detailed analytics with custom parameters
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Detailed analytics data
   */
  async getDetailedAnalytics(filters = {}) {
    try {
      log.debug("Fetching detailed analytics with filters:", filters);

      const data = await analyticRepo.getDetailedAnalytics(filters);
      
      log.info("Successfully retrieved detailed analytics");
      
      return {
        success: true,
        data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      log.error("Error in getDetailedAnalytics:", error);
      throw new ErrorResponse("Failed to fetch detailed analytics", 500);
    }
  }
}

module.exports = new AnalyticsService();