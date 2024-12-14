const log = require("log4js").getLogger("repository:analytic");
log.level = "info";

/**
 * Get analytics data
 * @returns {Promise<number>} Total count records
 * @throws {Error} If database query fails
 */
exports.getAnalytics = async () => {
  try {
    log.debug('Fetching analytics data...');
  
    log.info(`Successfully retrieved`);
    return data;
  } catch (error) {
    log.error('Error fetching analytics data:', {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};