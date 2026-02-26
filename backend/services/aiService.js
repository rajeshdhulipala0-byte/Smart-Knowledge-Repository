const axios = require('axios');
const config = require('../config');
const logger = require('../config/logger');

/**
 * AI Service for Hugging Face Integration
 * Provides text classification, summarization, and keyword extraction
 */
class AIService {
  constructor() {
    this.apiKey = config.huggingFace.apiKey;
    this.baseURL = 'https://api-inference.huggingface.co/models/';
    this.timeout = config.huggingFace.timeout;
    this.maxRetries = config.huggingFace.maxRetries;
    this.retryDelay = config.huggingFace.retryDelay;
    
    // Model endpoints
    this.models = {
      classifier: config.huggingFace.models.classifier,
      summary: config.huggingFace.models.summary,
      keyword: config.huggingFace.models.keyword,
    };
  }

  /**
   * Make API request to Hugging Face with retry logic
   * @param {String} model - Model name
   * @param {Object} payload - Request payload
   * @param {Number} attempt - Current attempt number
   * @returns {Promise<Object>}
   */
  async makeRequest(model, payload, attempt = 1) {
    try {
      const startTime = Date.now();
      
      // Use the v1 inference API endpoint
      const url = `https://api-inference.huggingface.co/models/${model}`;
      
      const response = await axios.post(
        url,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'x-use-cache': 'false',
          },
          timeout: this.timeout,
        }
      );

      const duration = Date.now() - startTime;
      logger.info(`AI request to ${model} completed in ${duration}ms`);

      return response.data;
    } catch (error) {
      // Handle rate limiting and model loading
      if (error.response?.status === 503 && attempt < this.maxRetries) {
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        logger.warn(`Model ${model} loading, retrying in ${delay}ms (attempt ${attempt}/${this.maxRetries})`);
        
        await this.sleep(delay);
        return this.makeRequest(model, payload, attempt + 1);
      }

      // Handle other errors with retry
      if (attempt < this.maxRetries && this.isRetryableError(error)) {
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        logger.warn(`Request to ${model} failed, retrying in ${delay}ms (attempt ${attempt}/${this.maxRetries})`);
        
        await this.sleep(delay);
        return this.makeRequest(model, payload, attempt + 1);
      }

      logger.error(`AI request to ${model} failed: ${error.message}`);
      throw this.handleError(error);
    }
  }

  /**
   * Check if error is retryable
   * @param {Error} error
   * @returns {Boolean}
   */
  isRetryableError(error) {
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    return (
      !error.response ||
      retryableStatuses.includes(error.response.status) ||
      error.code === 'ECONNABORTED'
    );
  }

  /**
   * Sleep utility
   * @param {Number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Handle API errors
   * @param {Error} error
   * @returns {Error}
   */
  handleError(error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error || error.message;

      if (status === 401) {
        return new Error('Invalid Hugging Face API key');
      } else if (status === 403) {
        return new Error('Access forbidden to Hugging Face model');
      } else if (status === 429) {
        return new Error('Rate limit exceeded for Hugging Face API');
      } else if (status === 503) {
        return new Error('Hugging Face model is currently loading');
      }

      return new Error(`Hugging Face API error: ${message}`);
    }

    if (error.code === 'ECONNABORTED') {
      return new Error('Request timeout - AI service took too long to respond');
    }

    return error;
  }

  /**
   * Perform zero-shot classification
   * @param {String} text - Text to classify
   * @returns {Promise<Object>}
   */
  async classifyScope(text) {
    try {
      const candidateLabels = ['Beginner', 'Intermediate', 'Advanced', 'OutOfScope'];
      
      const payload = {
        inputs: text.substring(0, 1000), // Limit input length
        parameters: {
          candidate_labels: candidateLabels,
        },
      };

      const result = await this.makeRequest(this.models.classifier, payload);

      // Extract classification results
      const labels = result.labels || [];
      const scores = result.scores || [];

      if (labels.length === 0) {
        throw new Error('No classification results returned');
      }

      return {
        scopeType: labels[0],
        confidence: scores[0],
        allScores: labels.reduce((acc, label, idx) => {
          acc[label] = scores[idx];
          return acc;
        }, {}),
      };
    } catch (error) {
      logger.error(`Classification error: ${error.message}`);
      // Use heuristic-based fallback classification
      return this.classifyScopeLocally(text);
    }
  }

  /**
   * Local heuristic-based classification (fallback)
   * @param {String} text
   * @returns {Object}
   */
  classifyScopeLocally(text) {
    const lowerText = text.toLowerCase();
    
    // Beginner indicators
    const beginnerKeywords = ['beginner', 'introduction', 'basics', 'simple', 'getting started', 
      'fundamental', 'basic', 'first step', 'easy', 'starter', 'tutorial', 'learn'];
    
    // Intermediate indicators
    const intermediateKeywords = ['intermediate', 'practical', 'application', 'implement', 
      'working with', 'how to', 'guide', 'techniques', 'methods', 'concepts'];
    
    // Advanced indicators
    const advancedKeywords = ['advanced', 'complex', 'optimization', 'architecture', 
      'deep dive', 'expert', 'sophisticated', 'algorithm', 'performance', 'scalability',
      'distributed', 'enterprise'];
    
    // Technical indicators (to differentiate from OutOfScope)
    const technicalKeywords = ['programming', 'code', 'software', 'development', 
      'technology', 'computer', 'data', 'system', 'application', 'algorithm', 
      'function', 'class', 'variable'];
    
    const beginnerCount = beginnerKeywords.filter(kw => lowerText.includes(kw)).length;
    const intermediateCount = intermediateKeywords.filter(kw => lowerText.includes(kw)).length;
    const advancedCount = advancedKeywords.filter(kw => lowerText.includes(kw)).length;
    const technicalCount = technicalKeywords.filter(kw => lowerText.includes(kw)).length;
    
    // Not technical content
    if (technicalCount === 0) {
      return {
        scopeType: 'OutOfScope',
        confidence: 0.7,
        allScores: { OutOfScope: 0.7, Beginner: 0.1, Intermediate: 0.1, Advanced: 0.1 },
        source: 'local-heuristic'
      };
    }
    
    // Determine scope by keyword counts
    const scores = {
      Beginner: beginnerCount * 0.3 + (technicalCount > 0 ? 0.2 : 0),
      Intermediate: intermediateCount * 0.3 + (technicalCount > 0 ? 0.3 : 0),
      Advanced: advancedCount * 0.3 + (technicalCount > 2 ? 0.2 : 0),
      OutOfScope: technicalCount === 0 ? 0.7 : 0.1
    };
    
    // Normalize scores
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    Object.keys(scores).forEach(key => {
      scores[key] = scores[key] / (total || 1);
    });
    
    // Get highest scored label
    const sortedLabels = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    
    return {
      scopeType: sortedLabels[0][0],
      confidence: sortedLabels[0][1],
      allScores: scores,
      source: 'local-heuristic'
    };
  }

  /**
   * Perform text summarization
   * @param {String} text - Text to summarize
   * @returns {Promise<String>}
   */
  async summarizeText(text) {
    try {
      // Limit input length for summarization
      const maxLength = 1024;
      const inputText = text.length > maxLength ? text.substring(0, maxLength) : text;

      const payload = {
        inputs: inputText,
        parameters: {
          max_length: 130,
          min_length: 30,
          do_sample: false,
        },
      };

      const result = await this.makeRequest(this.models.summary, payload);

      if (Array.isArray(result) && result.length > 0) {
        return result[0].summary_text || result[0].generated_text || '';
      }

      return result.summary_text || result.generated_text || '';
    } catch (error) {
      logger.error(`Summarization error: ${error.message}`);
      // Fallback: create extractive summary
      return this.createSimpleSummary(text);
    }
  }

  /**
   * Create simple extractive summary (fallback)
   * @param {String} text
   * @returns {String}
   */
  createSimpleSummary(text) {
    // Split into sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    // If short, return as is
    if (text.length <= 200) {
      return text;
    }
    
    // Get first 2-3 sentences or ~150-200 chars
    let summary = '';
    for (const sentence of sentences) {
      if (summary.length + sentence.length > 200) break;
      summary += sentence.trim() + ' ';
    }
    
    // If we got a good summary, return it
    if (summary.trim().length > 50) {
      return summary.trim();
    }
    
    // Otherwise, intelligently truncate at word boundary
    const words = text.split(/\s+/);
    summary = '';
    for (const word of words) {
      if (summary.length + word.length > 200) break;
      summary += word + ' ';
    }
    
    return summary.trim() + '...';
  }

  /**
   * Extract keywords from text
   * @param {String} text - Text to extract keywords from
   * @returns {Promise<Array>}
   */
  async extractKeywords(text) {
    try {
      const maxLength = 512;
      const inputText = text.length > maxLength ? text.substring(0, maxLength) : text;

      const payload = {
        inputs: inputText,
      };

      const result = await this.makeRequest(this.models.keyword, payload);

      // Extract keywords from result
      if (Array.isArray(result)) {
        // Handle array of objects with 'word' or 'text' property
        return result
          .map((item) => item.word || item.text || item)
          .filter((keyword) => typeof keyword === 'string')
          .slice(0, 10); // Limit to top 10 keywords
      }

      return [];
    } catch (error) {
      logger.error(`Keyword extraction error: ${error.message}`);
      // Fallback: extract simple word frequency
      return this.extractSimpleKeywords(text);
    }
  }

  /**
   * Fallback keyword extraction using simple word frequency
   * @param {String} text
   * @returns {Array}
   */
  extractSimpleKeywords(text) {
    try {
      // Remove common stop words and extract significant words
      const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'been', 'be',
        'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
        'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
      ]);

      const words = text
        .toLowerCase()
        .match(/\b\w{4,}\b/g) || []; // Words with 4+ characters

      const frequency = {};
      words.forEach((word) => {
        if (!stopWords.has(word)) {
          frequency[word] = (frequency[word] || 0) + 1;
        }
      });

      return Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word]) => word);
    } catch (error) {
      logger.error(`Simple keyword extraction error: ${error.message}`);
      return [];
    }
  }

  /**
   * Analyze knowledge content with all AI models
   * @param {String} content - Content to analyze
   * @returns {Promise<Object>}
   */
  async analyzeKnowledge(content) {
    try {
      logger.info('Starting AI analysis of knowledge content');

      if (!this.apiKey) {
        logger.warn('Hugging Face API key not configured, skipping AI analysis');
        return {
          scopeType: 'OutOfScope',
          confidence: 0,
          summary: content.substring(0, 200) + '...',
          keywords: this.extractSimpleKeywords(content),
          processed: false,
        };
      }

      // Execute all AI operations in parallel
      const [classification, summary, keywords] = await Promise.allSettled([
        this.classifyScope(content),
        this.summarizeText(content),
        this.extractKeywords(content),
      ]);

      // Extract results with fallbacks
      const scopeData = classification.status === 'fulfilled' 
        ? classification.value 
        : { scopeType: 'OutOfScope', confidence: 0 };

      const summaryText = summary.status === 'fulfilled'
        ? summary.value
        : content.substring(0, 200) + '...';

      const keywordList = keywords.status === 'fulfilled'
        ? keywords.value
        : this.extractSimpleKeywords(content);

      const result = {
        scopeType: scopeData.scopeType,
        confidence: scopeData.confidence,
        summary: summaryText,
        keywords: keywordList,
        processed: true,
      };

      logger.info(`AI analysis completed: scope=${result.scopeType}, confidence=${result.confidence.toFixed(2)}`);

      return result;
    } catch (error) {
      logger.error(`AI analysis error: ${error.message}`);
      
      // Return fallback results
      return {
        scopeType: 'OutOfScope',
        confidence: 0,
        summary: content.substring(0, 200) + '...',
        keywords: this.extractSimpleKeywords(content),
        processed: false,
        error: error.message,
      };
    }
  }

  /**
   * Validate AI service health
   * @returns {Promise<Boolean>}
   */
  async healthCheck() {
    try {
      if (!this.apiKey) {
        return false;
      }

      // Test with simple classification
      await this.classifyScope('This is a test');
      return true;
    } catch (error) {
      logger.error(`AI service health check failed: ${error.message}`);
      return false;
    }
  }
}

module.exports = new AIService();
