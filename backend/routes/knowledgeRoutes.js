const express = require('express');
const router = express.Router();
const knowledgeController = require('../controllers/knowledgeController');
const { protect, authorize } = require('../middleware/auth');
const { knowledgeValidation } = require('../validations/validation');

// Public routes
router.get('/search', knowledgeValidation.search, knowledgeController.searchKnowledge);
router.get('/category/:category', knowledgeController.getKnowledgeByCategory);
router.get('/', knowledgeController.getAllKnowledge);
router.get('/:id', knowledgeValidation.id, knowledgeController.getKnowledgeById);

// Protected routes
router.post(
  '/',
  protect,
  knowledgeValidation.create,
  knowledgeController.createKnowledge
);

router.put(
  '/:id',
  protect,
  knowledgeValidation.id,
  knowledgeValidation.update,
  knowledgeController.updateKnowledge
);

// Admin only routes
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  knowledgeValidation.id,
  knowledgeController.deleteKnowledge
);

router.get(
  '/admin/analytics',
  protect,
  authorize('admin'),
  knowledgeController.getAnalytics
);

router.post(
  '/admin/batch-process-ai',
  protect,
  authorize('admin'),
  knowledgeController.batchProcessAI
);

module.exports = router;
