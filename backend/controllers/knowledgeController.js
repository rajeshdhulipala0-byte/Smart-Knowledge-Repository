const knowledgeService = require('../services/knowledgeService');
const webScraperService = require('../services/webScraperService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @desc    Create new knowledge
 * @route   POST /api/knowledge
 * @access  Private
 */
exports.createKnowledge = asyncHandler(async (req, res, next) => {
  const knowledgeData = {
    ...req.body,
    createdBy: req.user?._id,
  };

  const knowledge = await knowledgeService.createKnowledge(knowledgeData);

  return ApiResponse.success(
    res,
    201,
    'Knowledge created successfully',
    knowledge
  );
});

/**
 * @desc    Get all knowledge with pagination
 * @route   GET /api/knowledge
 * @access  Public
 */
exports.getAllKnowledge = asyncHandler(async (req, res, next) => {
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder || 'desc',
  };

  const result = await knowledgeService.getAllKnowledge(options);

  return ApiResponse.paginated(
    res,
    200,
    'Knowledge retrieved successfully',
    result.data,
    result.pagination
  );
});

/**
 * @desc    Get knowledge by ID
 * @route   GET /api/knowledge/:id
 * @access  Public
 */
exports.getKnowledgeById = asyncHandler(async (req, res, next) => {
  const knowledge = await knowledgeService.getKnowledgeById(req.params.id);

  if (!knowledge) {
    return next(new AppError('Knowledge not found', 404));
  }

  return ApiResponse.success(
    res,
    200,
    'Knowledge retrieved successfully',
    knowledge
  );
});

/**
 * @desc    Update knowledge
 * @route   PUT /api/knowledge/:id
 * @access  Private
 */
exports.updateKnowledge = asyncHandler(async (req, res, next) => {
  const knowledge = await knowledgeService.updateKnowledge(
    req.params.id,
    req.body
  );

  if (!knowledge) {
    return next(new AppError('Knowledge not found', 404));
  }

  return ApiResponse.success(
    res,
    200,
    'Knowledge updated successfully',
    knowledge
  );
});

/**
 * @desc    Delete knowledge
 * @route   DELETE /api/knowledge/:id
 * @access  Private/Admin
 */
exports.deleteKnowledge = asyncHandler(async (req, res, next) => {
  const knowledge = await knowledgeService.deleteKnowledge(req.params.id);

  if (!knowledge) {
    return next(new AppError('Knowledge not found', 404));
  }

  return ApiResponse.success(
    res,
    200,
    'Knowledge deleted successfully',
    null
  );
});

/**
 * @desc    Search knowledge
 * @route   GET /api/knowledge/search
 * @access  Public
 */
exports.searchKnowledge = asyncHandler(async (req, res, next) => {
  const searchOptions = {
    query: req.query.q || req.query.query,
    category: req.query.category,
    tags: req.query.tags ? req.query.tags.split(',') : undefined,
    scopeType: req.query.scopeType,
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    sortBy: req.query.sortBy || 'relevance',
  };

  const result = await knowledgeService.searchKnowledge(searchOptions);

  return ApiResponse.paginated(
    res,
    200,
    'Search completed successfully',
    result.data,
    result.pagination
  );
});

/**
 * @desc    Get knowledge by category
 * @route   GET /api/knowledge/category/:category
 * @access  Public
 */
exports.getKnowledgeByCategory = asyncHandler(async (req, res, next) => {
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
  };

  const result = await knowledgeService.getKnowledgeByCategory(
    req.params.category,
    options
  );

  return ApiResponse.paginated(
    res,
    200,
    'Knowledge retrieved successfully',
    result.data,
    result.pagination
  );
});

/**
 * @desc    Get analytics
 * @route   GET /api/knowledge/analytics
 * @access  Private/Admin
 */
exports.getAnalytics = asyncHandler(async (req, res, next) => {
  const analytics = await knowledgeService.getAnalytics();

  return ApiResponse.success(
    res,
    200,
    'Analytics retrieved successfully',
    analytics
  );
});

/**
 * @desc    Batch process AI for unprocessed knowledge
 * @route   POST /api/knowledge/batch-process-ai
 * @access  Private/Admin
 */
exports.batchProcessAI = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.body.limit) || 10;
  const results = await knowledgeService.batchProcessAI(limit);

  return ApiResponse.success(
    res,
    200,
    'Batch AI processing completed',
    results
  );
});

/**
 * @desc    Import knowledge from URL
 * @route   POST /api/knowledge/import-url
 * @access  Private
 */
exports.importFromUrl = asyncHandler(async (req, res, next) => {
  const { url } = req.body;

  if (!url) {
    return next(new AppError('URL is required', 400));
  }

  // Scrape content from URL
  const scrapedData = await webScraperService.scrapeUrl(url);

  if (!scrapedData.success) {
    return next(new AppError('Failed to import from URL', 400));
  }

  // Create knowledge from scraped data
  const knowledgeData = {
    title: scrapedData.data.title,
    description: scrapedData.data.description,
    content: scrapedData.data.content,
    tags: scrapedData.data.tags || [],
    sourceUrl: scrapedData.data.sourceUrl,
    createdBy: req.user._id,
    metadata: {
      author: scrapedData.data.author,
      publishedDate: scrapedData.data.publishedDate,
      imageUrl: scrapedData.data.imageUrl,
    },
  };

  const knowledge = await knowledgeService.createKnowledge(knowledgeData);

  return ApiResponse.success(
    res,
    201,
    'Knowledge imported successfully from URL',
    knowledge
  );
});

/**
 * @desc    Preview content from URL (without saving)
 * @route   POST /api/knowledge/preview-url
 * @access  Private
 */
exports.previewUrl = asyncHandler(async (req, res, next) => {
  const { url } = req.body;

  if (!url) {
    return next(new AppError('URL is required', 400));
  }

  const scrapedData = await webScraperService.scrapeUrl(url);

  if (!scrapedData.success) {
    return next(new AppError('Failed to preview URL', 400));
  }

  return ApiResponse.success(
    res,
    200,
    'URL preview retrieved successfully',
    scrapedData.data
  );
});

/**
 * @desc    Get trending topics
 * @route   GET /api/knowledge/trending
 * @access  Public
 */
exports.getTrendingTopics = asyncHandler(async (req, res, next) => {
  const trending = await webScraperService.getTrendingTopics();

  return ApiResponse.success(
    res,
    200,
    'Trending topics retrieved successfully',
    trending.data
  );
});

/**
 * @desc    Search web content
 * @route   GET /api/knowledge/web-search
 * @access  Public
 */
exports.searchWeb = asyncHandler(async (req, res, next) => {
  const { q, limit } = req.query;

  if (!q) {
    return next(new AppError('Search query is required', 400));
  }

  const results = await webScraperService.searchWeb(q, parseInt(limit) || 10);

  return ApiResponse.success(
    res,
    200,
    'Web search completed successfully',
    results.data
  );
});
