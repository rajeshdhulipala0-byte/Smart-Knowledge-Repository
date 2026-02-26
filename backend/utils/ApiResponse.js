/**
 * API Response Formatter
 * Standardizes API responses across the application
 */
class ApiResponse {
  /**
   * Success response
   * @param {Object} res - Express response object
   * @param {Number} statusCode - HTTP status code
   * @param {String} message - Response message
   * @param {*} data - Response data
   * @returns {Object}
   */
  static success(res, statusCode = 200, message = 'Success', data = null) {
    const response = {
      success: true,
      message,
      data,
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Error response
   * @param {Object} res - Express response object
   * @param {Number} statusCode - HTTP status code
   * @param {String} message - Error message
   * @param {Array} errors - Validation errors
   * @returns {Object}
   */
  static error(res, statusCode = 500, message = 'Error', errors = null) {
    const response = {
      success: false,
      message,
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Paginated response
   * @param {Object} res - Express response object
   * @param {Number} statusCode - HTTP status code
   * @param {String} message - Response message
   * @param {Array} data - Data array
   * @param {Object} pagination - Pagination info
   * @returns {Object}
   */
  static paginated(res, statusCode = 200, message = 'Success', data, pagination) {
    const response = {
      success: true,
      message,
      data,
      pagination,
    };

    return res.status(statusCode).json(response);
  }
}

module.exports = ApiResponse;
