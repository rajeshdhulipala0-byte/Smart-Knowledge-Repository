const Knowledge = require('../models/Knowledge');
const logger = require('../config/logger');

/**
 * Knowledge Repository
 * Data access layer for Knowledge model
 */
class KnowledgeRepository {
  /**
   * Create new knowledge
   * @param {Object} knowledgeData
   * @returns {Promise<Knowledge>}
   */
  async create(knowledgeData) {
    try {
      const knowledge = new Knowledge(knowledgeData);
      await knowledge.save();
      return knowledge;
    } catch (error) {
      logger.error(`Error creating knowledge: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find knowledge by ID
   * @param {String} id
   * @returns {Promise<Knowledge>}
   */
  async findById(id) {
    try {
      return await Knowledge.findById(id);
    } catch (error) {
      logger.error(`Error finding knowledge by ID: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find all knowledge with pagination
   * @param {Object} options
   * @returns {Promise<Object>}
   */
  async findAll(options = {}) {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
      const skip = (page - 1) * limit;

      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const data = await Knowledge.find()
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await Knowledge.countDocuments();

      return {
        data,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
        },
      };
    } catch (error) {
      logger.error(`Error finding all knowledge: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update knowledge by ID
   * @param {String} id
   * @param {Object} updateData
   * @returns {Promise<Knowledge>}
   */
  async update(id, updateData) {
    try {
      const knowledge = await Knowledge.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      return knowledge;
    } catch (error) {
      logger.error(`Error updating knowledge: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete knowledge by ID
   * @param {String} id
   * @returns {Promise<Knowledge>}
   */
  async delete(id) {
    try {
      return await Knowledge.findByIdAndDelete(id);
    } catch (error) {
      logger.error(`Error deleting knowledge: ${error.message}`);
      throw error;
    }
  }

  /**
   * Search knowledge
   * @param {Object} searchOptions
   * @returns {Promise<Object>}
   */
  async search(searchOptions) {
    try {
      return await Knowledge.searchKnowledge(searchOptions);
    } catch (error) {
      logger.error(`Error searching knowledge: ${error.message}`);
      throw error;
    }
  }

  /**
   * Increment view count
   * @param {String} id
   * @returns {Promise<Knowledge>}
   */
  async incrementViews(id) {
    try {
      return await Knowledge.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
      );
    } catch (error) {
      logger.error(`Error incrementing views: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get knowledge by category
   * @param {String} category
   * @param {Object} options
   * @returns {Promise<Object>}
   */
  async findByCategory(category, options = {}) {
    try {
      const { page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;

      const data = await Knowledge.find({ category })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await Knowledge.countDocuments({ category });

      return {
        data,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
        },
      };
    } catch (error) {
      logger.error(`Error finding knowledge by category: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get trending tags
   * @param {Number} limit
   * @returns {Promise<Array>}
   */
  async getTrendingTags(limit = 10) {
    try {
      return await Knowledge.getTrendingTags(limit);
    } catch (error) {
      logger.error(`Error getting trending tags: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get category distribution
   * @returns {Promise<Array>}
   */
  async getCategoryDistribution() {
    try {
      return await Knowledge.getCategoryDistribution();
    } catch (error) {
      logger.error(`Error getting category distribution: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get scope distribution
   * @returns {Promise<Array>}
   */
  async getScopeDistribution() {
    try {
      return await Knowledge.getScopeDistribution();
    } catch (error) {
      logger.error(`Error getting scope distribution: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get analytics data
   * @returns {Promise<Object>}
   */
  async getAnalytics() {
    try {
      const [
        total,
        categoryDist,
        scopeDist,
        trendingTags,
        topViewed,
        recentlyAdded,
        aiConfidenceStats,
        growthData,
      ] = await Promise.all([
        Knowledge.countDocuments(),
        this.getCategoryDistribution(),
        this.getScopeDistribution(),
        this.getTrendingTags(15),
        Knowledge.find().sort({ views: -1 }).limit(10).lean(),
        Knowledge.find().sort({ createdAt: -1 }).limit(5).lean(),
        this.getAIConfidenceStats(),
        this.getGrowthData(),
      ]);

      return {
        total,
        categoryDistribution: categoryDist,
        scopeDistribution: scopeDist,
        trendingTags,
        topViewed,
        recentlyAdded,
        aiConfidenceStats,
        growthData,
      };
    } catch (error) {
      logger.error(`Error getting analytics: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get AI confidence statistics
   * @returns {Promise<Object>}
   */
  async getAIConfidenceStats() {
    try {
      const stats = await Knowledge.aggregate([
        { $match: { aiProcessed: true, aiConfidence: { $ne: null } } },
        {
          $group: {
            _id: null,
            avgConfidence: { $avg: '$aiConfidence' },
            minConfidence: { $min: '$aiConfidence' },
            maxConfidence: { $max: '$aiConfidence' },
            count: { $sum: 1 },
          },
        },
      ]);

      if (stats.length === 0) {
        return {
          avgConfidence: 0,
          minConfidence: 0,
          maxConfidence: 0,
          count: 0,
        };
      }

      return stats[0];
    } catch (error) {
      logger.error(`Error getting AI confidence stats: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get growth data (knowledge added over time)
   * @returns {Promise<Array>}
   */
  async getGrowthData() {
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const growthData = await Knowledge.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        {
          $project: {
            _id: 0,
            date: {
              $dateFromParts: {
                year: '$_id.year',
                month: '$_id.month',
                day: 1,
              },
            },
            count: 1,
          },
        },
      ]);

      return growthData;
    } catch (error) {
      logger.error(`Error getting growth data: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find knowledge that needs AI processing
   * @param {Number} limit
   * @returns {Promise<Array>}
   */
  async findNeedingAIProcessing(limit = 10) {
    try {
      return await Knowledge.find({ aiProcessed: false })
        .limit(limit)
        .lean();
    } catch (error) {
      logger.error(`Error finding knowledge needing AI processing: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new KnowledgeRepository();
