const morgan = require('morgan');
const logger = require('../config/logger');

/**
 * HTTP Request Logger
 */
const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  }
);

module.exports = requestLogger;
