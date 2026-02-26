const User = require('../models/User');
const logger = require('../config/logger');

/**
 * User Repository
 * Data access layer for User model
 */
class UserRepository {
  /**
   * Create new user
   * @param {Object} userData
   * @returns {Promise<User>}
   */
  async create(userData) {
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (error) {
      logger.error(`Error creating user: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find user by ID
   * @param {String} id
   * @returns {Promise<User>}
   */
  async findById(id) {
    try {
      return await User.findById(id);
    } catch (error) {
      logger.error(`Error finding user by ID: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find user by email
   * @param {String} email
   * @returns {Promise<User>}
   */
  async findByEmail(email) {
    try {
      return await User.findOne({ email }).select('+password');
    } catch (error) {
      logger.error(`Error finding user by email: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find all users
   * @param {Object} options
   * @returns {Promise<Array>}
   */
  async findAll(options = {}) {
    try {
      const { page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;

      const users = await User.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await User.countDocuments();

      return {
        data: users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
        },
      };
    } catch (error) {
      logger.error(`Error finding all users: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update user
   * @param {String} id
   * @param {Object} updateData
   * @returns {Promise<User>}
   */
  async update(id, updateData) {
    try {
      return await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      logger.error(`Error updating user: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete user
   * @param {String} id
   * @returns {Promise<User>}
   */
  async delete(id) {
    try {
      return await User.findByIdAndDelete(id);
    } catch (error) {
      logger.error(`Error deleting user: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check if email exists
   * @param {String} email
   * @returns {Promise<Boolean>}
   */
  async emailExists(email) {
    try {
      const user = await User.findOne({ email });
      return !!user;
    } catch (error) {
      logger.error(`Error checking email existence: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new UserRepository();
