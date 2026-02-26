const mongoose = require('mongoose');
const logger = require('./logger');

/**
 * Database configuration and connection
 */
class Database {
  constructor() {
    this.connection = null;
  }

  /**
   * Connect to MongoDB
   * @returns {Promise<void>}
   */
  async connect() {
    try {
      const options = {
        maxPoolSize: 10,
        minPoolSize: 5,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 5000,
        family: 4, // Use IPv4
      };

      this.connection = await mongoose.connect(process.env.MONGODB_URI, options);

      logger.info(`MongoDB Connected: ${this.connection.connection.host}`);

      // Handle connection events
      mongoose.connection.on('error', (err) => {
        logger.error(`MongoDB connection error: ${err}`);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected. Attempting to reconnect...');
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB reconnected');
      });

      // Create indexes
      await this.createIndexes();

    } catch (error) {
      logger.error(`Error connecting to MongoDB: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * Create database indexes
   * @returns {Promise<void>}
   */
  async createIndexes() {
    try {
      // Indexes will be created via schema definitions
      logger.info('Database indexes created successfully');
    } catch (error) {
      logger.error(`Error creating indexes: ${error.message}`);
    }
  }

  /**
   * Disconnect from MongoDB
   * @returns {Promise<void>}
   */
  async disconnect() {
    try {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed');
    } catch (error) {
      logger.error(`Error disconnecting from MongoDB: ${error.message}`);
    }
  }
}

module.exports = new Database();
