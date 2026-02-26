const express = require('express');
const router = express.Router();

// Import route modules
const knowledgeRoutes = require('./knowledgeRoutes');
const authRoutes = require('./authRoutes');
const bookmarkRoutes = require('./bookmarkRoutes');

// Mount routes
router.use('/knowledge', knowledgeRoutes);
router.use('/auth', authRoutes);
router.use('/bookmarks', bookmarkRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
