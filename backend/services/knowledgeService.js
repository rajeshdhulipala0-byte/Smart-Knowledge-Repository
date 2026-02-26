const knowledgeRepository = require('../repositories/knowledgeRepository');
const aiService = require('./aiService');
const logger = require('../config/logger');

/**
 * Knowledge Service
 * Business logic layer for knowledge operations
 */
class KnowledgeService {
  /**
   * Create new knowledge with AI processing
   * @param {Object} knowledgeData
   * @returns {Promise<Object>}
   */
  async createKnowledge(knowledgeData) {
    try {
      // Create knowledge first
      const knowledge = await knowledgeRepository.create(knowledgeData);

      // Process with AI in background (non-blocking)
      this.processKnowledgeWithAI(knowledge._id, knowledgeData.content).catch((error) => {
        logger.error(`Background AI processing failed for knowledge ${knowledge._id}: ${error.message}`);
      });

      return knowledge;
    } catch (error) {
      logger.error(`Error creating knowledge: ${error.message}`);
      throw error;
    }
  }

  /**
   * Process knowledge with AI
   * @param {String} knowledgeId
   * @param {String} content
   * @returns {Promise<void>}
   */
  async processKnowledgeWithAI(knowledgeId, content) {
    try {
      logger.info(`Starting AI processing for knowledge ${knowledgeId}`);

      const aiResults = await aiService.analyzeKnowledge(content);

      // Update knowledge with AI results
      await knowledgeRepository.update(knowledgeId, {
        scopeType: aiResults.scopeType,
        aiSummary: aiResults.summary,
        aiKeywords: aiResults.keywords,
        aiConfidence: aiResults.confidence,
        aiProcessed: true,
      });

      logger.info(`AI processing completed for knowledge ${knowledgeId}`);
    } catch (error) {
      logger.error(`AI processing error for knowledge ${knowledgeId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get knowledge by ID with view increment
   * @param {String} id
   * @param {Boolean} incrementView
   * @returns {Promise<Object>}
   */
  async getKnowledgeById(id, incrementView = true) {
    try {
      let knowledge;
      
      if (incrementView) {
        knowledge = await knowledgeRepository.incrementViews(id);
      } else {
        knowledge = await knowledgeRepository.findById(id);
      }

      if (!knowledge) {
        throw new Error('Knowledge not found');
      }

      return knowledge;
    } catch (error) {
      logger.error(`Error getting knowledge by ID: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all knowledge with pagination
   * @param {Object} options
   * @returns {Promise<Object>}
   */
  async getAllKnowledge(options) {
    try {
      return await knowledgeRepository.findAll(options);
    } catch (error) {
      logger.error(`Error getting all knowledge: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update knowledge
   * @param {String} id
   * @param {Object} updateData
   * @returns {Promise<Object>}
   */
  async updateKnowledge(id, updateData) {
    try {
      const knowledge = await knowledgeRepository.findById(id);
      
      if (!knowledge) {
        throw new Error('Knowledge not found');
      }

      // If content changed, reprocess with AI
      if (updateData.content && updateData.content !== knowledge.content) {
        updateData.aiProcessed = false;
        
        const updated = await knowledgeRepository.update(id, updateData);
        
        // Reprocess with AI in background
        this.processKnowledgeWithAI(id, updateData.content).catch((error) => {
          logger.error(`Background AI reprocessing failed: ${error.message}`);
        });

        return updated;
      }

      return await knowledgeRepository.update(id, updateData);
    } catch (error) {
      logger.error(`Error updating knowledge: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete knowledge
   * @param {String} id
   * @returns {Promise<Object>}
   */
  async deleteKnowledge(id) {
    try {
      const knowledge = await knowledgeRepository.delete(id);
      
      if (!knowledge) {
        throw new Error('Knowledge not found');
      }

      return knowledge;
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
  async searchKnowledge(searchOptions) {
    try {
      return await knowledgeRepository.search(searchOptions);
    } catch (error) {
      logger.error(`Error searching knowledge: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get knowledge by category
   * @param {String} category
   * @param {Object} options
   * @returns {Promise<Object>}
   */
  async getKnowledgeByCategory(category, options) {
    try {
      return await knowledgeRepository.findByCategory(category, options);
    } catch (error) {
      logger.error(`Error getting knowledge by category: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get analytics data
   * @returns {Promise<Object>}
   */
  async getAnalytics() {
    try {
      return await knowledgeRepository.getAnalytics();
    } catch (error) {
      logger.error(`Error getting analytics: ${error.message}`);
      throw error;
    }
  }

  /**
   * Batch process unprocessed knowledge with AI
   * @param {Number} limit
   * @returns {Promise<Object>}
   */
  async batchProcessAI(limit = 10) {
    try {
      const unprocessed = await knowledgeRepository.findNeedingAIProcessing(limit);
      
      logger.info(`Found ${unprocessed.length} knowledge items needing AI processing`);

      const results = {
        total: unprocessed.length,
        successful: 0,
        failed: 0,
        errors: [],
      };

      for (const item of unprocessed) {
        try {
          await this.processKnowledgeWithAI(item._id, item.content);
          results.successful++;
        } catch (error) {
          results.failed++;
          results.errors.push({
            id: item._id,
            error: error.message,
          });
        }
      }

      logger.info(`Batch AI processing completed: ${results.successful} successful, ${results.failed} failed`);

      return results;
    } catch (error) {
      logger.error(`Error in batch AI processing: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new KnowledgeService();
