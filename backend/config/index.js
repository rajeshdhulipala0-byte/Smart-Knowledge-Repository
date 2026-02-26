/**
 * Application configuration
 */
module.exports = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-knowledge-repo',
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    expire: process.env.JWT_EXPIRE || '7d',
  },
  
  // Hugging Face
  huggingFace: {
    apiKey: process.env.HUGGINGFACE_API_KEY,
    models: {
      classifier: process.env.HF_CLASSIFIER_MODEL || 'facebook/bart-large-mnli',
      summary: process.env.HF_SUMMARY_MODEL || 'facebook/bart-large-cnn',
      keyword: process.env.HF_KEYWORD_MODEL || 'ml6team/keyphrase-extraction-distilbert-inspec',
    },
    timeout: parseInt(process.env.AI_REQUEST_TIMEOUT) || 30000,
    maxRetries: parseInt(process.env.AI_MAX_RETRIES) || 3,
    retryDelay: parseInt(process.env.AI_RETRY_DELAY) || 1000,
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Pagination
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },
  
  // Search
  search: {
    minScore: 0.5,
  },
};
