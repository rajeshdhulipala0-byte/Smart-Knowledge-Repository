const Bookmark = require('../models/Bookmark');
const Knowledge = require('../models/Knowledge');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');

/**
 * @desc    Get user bookmarks
 * @route   GET /api/bookmarks
 * @access  Private
 */
exports.getBookmarks = asyncHandler(async (req, res, next) => {
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder || 'desc',
  };

  const result = await Bookmark.getUserBookmarks(req.user._id, options);

  return ApiResponse.paginated(
    res,
    200,
    'Bookmarks retrieved successfully',
    result.data,
    result.pagination
  );
});

/**
 * @desc    Add bookmark
 * @route   POST /api/bookmarks/:knowledgeId
 * @access  Private
 */
exports.addBookmark = asyncHandler(async (req, res, next) => {
  const { knowledgeId } = req.params;
  const { notes, tags } = req.body;

  // Check if knowledge exists
  const knowledge = await Knowledge.findById(knowledgeId);
  if (!knowledge) {
    throw new AppError('Knowledge not found', 404);
  }

  // Check if already bookmarked
  const existingBookmark = await Bookmark.findOne({
    user: req.user._id,
    knowledge: knowledgeId,
  });

  if (existingBookmark) {
    throw new AppError('Knowledge already bookmarked', 400);
  }

  // Create bookmark
  const bookmark = await Bookmark.create({
    user: req.user._id,
    knowledge: knowledgeId,
    notes: notes || '',
    tags: tags || [],
  });

  // Update user stats
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { 'stats.bookmarks': 1 },
  });

  const populatedBookmark = await Bookmark.findById(bookmark._id).populate('knowledge');

  return ApiResponse.success(
    res,
    201,
    'Bookmark added successfully',
    populatedBookmark
  );
});

/**
 * @desc    Remove bookmark
 * @route   DELETE /api/bookmarks/:knowledgeId
 * @access  Private
 */
exports.removeBookmark = asyncHandler(async (req, res, next) => {
  const { knowledgeId } = req.params;

  const bookmark = await Bookmark.findOneAndDelete({
    user: req.user._id,
    knowledge: knowledgeId,
  });

  if (!bookmark) {
    throw new AppError('Bookmark not found', 404);
  }

  // Update user stats
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { 'stats.bookmarks': -1 },
  });

  return ApiResponse.success(
    res,
    200,
    'Bookmark removed successfully',
    null
  );
});

/**
 * @desc    Update bookmark
 * @route   PUT /api/bookmarks/:knowledgeId
 * @access  Private
 */
exports.updateBookmark = asyncHandler(async (req, res, next) => {
  const { knowledgeId } = req.params;
  const { notes, tags } = req.body;

  const bookmark = await Bookmark.findOneAndUpdate(
    {
      user: req.user._id,
      knowledge: knowledgeId,
    },
    { notes, tags },
    { new: true, runValidators: true }
  ).populate('knowledge');

  if (!bookmark) {
    throw new AppError('Bookmark not found', 404);
  }

  return ApiResponse.success(
    res,
    200,
    'Bookmark updated successfully',
    bookmark
  );
});

/**
 * @desc    Check if knowledge is bookmarked
 * @route   GET /api/bookmarks/check/:knowledgeId
 * @access  Private
 */
exports.checkBookmark = asyncHandler(async (req, res, next) => {
  const { knowledgeId } = req.params;

  const bookmark = await Bookmark.findOne({
    user: req.user._id,
    knowledge: knowledgeId,
  });

  return ApiResponse.success(
    res,
    200,
    'Bookmark status retrieved',
    {
      isBookmarked: !!bookmark,
      bookmark: bookmark || null,
    }
  );
});
