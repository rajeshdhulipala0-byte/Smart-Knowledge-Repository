require('dotenv').config();
const app = require('./app');
const database = require('./config/database');
const logger = require('./config/logger');
const config = require('./config');

/**
 * Server Entry Point
 */

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  logger.error(error.stack);
  process.exit(1);
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await database.connect();

    // Start listening
    const server = app.listen(config.port, () => {
      logger.info(`
╔═══════════════════════════════════════════════════════╗
║   Smart Knowledge Repository Server                  ║
║   Environment: ${config.nodeEnv.padEnd(37)}║
║   Port: ${String(config.port).padEnd(43)}║
║   Server running at http://localhost:${config.port}       ║
╚═══════════════════════════════════════════════════════╝
      `);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (error) => {
      logger.error(`Unhandled Rejection: ${error.message}`);
      logger.error(error.stack);
      
      // Close server gracefully
      server.close(() => {
        database.disconnect();
        process.exit(1);
      });
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        try {
          await database.disconnect();
          logger.info('Database connection closed');
          process.exit(0);
        } catch (error) {
          logger.error(`Error during shutdown: ${error.message}`);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown due to timeout');
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    logger.error(error.stack);
    process.exit(1);
  }
};

// Start the server
startServer();
