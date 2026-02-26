const userRepository = require('../repositories/userRepository');
const logger = require('../config/logger');

/**
 * Authentication Service  
 * Business logic for user authentication
 */
class AuthService {
  /**
   * Register new user
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  async register(userData) {
    try {
      // Check if email already exists
      const emailExists = await userRepository.emailExists(userData.email);
      
      if (emailExists) {
        throw new Error('Email already registered');
      }

      // Create user
      const user = await userRepository.create(userData);

      // Generate token
      const token = user.generateAuthToken();

      return {
        user,
        token,
      };
    } catch (error) {
      logger.error(`Error registering user: ${error.message}`);
      throw error;
    }
  }

  /**
   * Login user
   * @param {String} email
   * @param {String} password
   * @returns {Promise<Object>}
   */
  async login(email, password) {
    try {
      // Find user by email
      const user = await userRepository.findByEmail(email);

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      await user.updateLastLogin();

      // Generate token
      const token = user.generateAuthToken();

      // Remove password from user object
      user.password = undefined;

      return {
        user,
        token,
      };
    } catch (error) {
      logger.error(`Error logging in user: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get user profile
   * @param {String} userId
   * @returns {Promise<Object>}
   */
  async getProfile(userId) {
    try {
      const user = await userRepository.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      logger.error(`Error getting user profile: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {String} userId
   * @param {Object} updateData
   * @returns {Promise<Object>}
   */
  async updateProfile(userId, updateData) {
    try {
      // Prevent updating sensitive fields
      delete updateData.password;
      delete updateData.role;
      delete updateData.email;

      const user = await userRepository.update(userId, updateData);

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      logger.error(`Error updating user profile: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new AuthService();
