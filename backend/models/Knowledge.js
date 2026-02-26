const mongoose = require('mongoose');

/**
 * Knowledge Schema
 * Represents a knowledge article with AI processing capabilities
 */
const knowledgeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [10, 'Content must be at least 10 characters'],
    },
    tags: {
      type: [String],
      default: [],
      index: true,
      validate: {
        validator: function (tags) {
          return tags.every((tag) => tag.length <= 30);
        },
        message: 'Each tag must be 30 characters or less',
      },
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Technology',
          'Science',
          'Business',
          'Health',
          'Education',
          'Arts',
          'Engineering',
          'Mathematics',
          'Programming',
          'Data Science',
          'AI/ML',
          'Other',
        ],
        message: '{VALUE} is not a valid category',
      },
      index: true,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      maxlength: [100, 'Author name cannot exceed 100 characters'],
    },
    scopeType: {
      type: String,
      enum: {
        values: ['Beginner', 'Intermediate', 'Advanced', 'OutOfScope'],
        message: '{VALUE} is not a valid scope type',
      },
      default: null,
    },
    aiSummary: {
      type: String,
      default: null,
    },
    aiKeywords: {
      type: [String],
      default: [],
    },
    aiConfidence: {
      type: Number,
      min: 0,
      max: 1,
      default: null,
    },
    aiProcessed: {
      type: Boolean,
      default: false,
      index: true,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
knowledgeSchema.index({ title: 'text', content: 'text' }, {
  weights: { title: 10, content: 5 },
  name: 'text_search_index',
});

knowledgeSchema.index({ category: 1, tags: 1 });
knowledgeSchema.index({ createdAt: -1 });
knowledgeSchema.index({ views: -1 });
knowledgeSchema.index({ scopeType: 1, aiProcessed: 1 });

// Virtual for reading time estimation (words per minute)
knowledgeSchema.virtual('readingTime').get(function () {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
});

// Pre-save middleware
knowledgeSchema.pre('save', function (next) {
  // Normalize tags
  if (this.isModified('tags')) {
    this.tags = this.tags.map((tag) => tag.toLowerCase().trim());
    // Remove duplicates
    this.tags = [...new Set(this.tags)];
  }

  // Normalize category
  if (this.isModified('category')) {
    this.category = this.category.trim();
  }

  next();
});

// Instance methods
/**
 * Increment view count
 * @returns {Promise<Knowledge>}
 */
knowledgeSchema.methods.incrementViews = async function () {
  this.views += 1;
  return this.save({ validateBeforeSave: false });
};

/**
 * Check if AI processing is needed
 * @returns {Boolean}
 */
knowledgeSchema.methods.needsAIProcessing = function () {
  return !this.aiProcessed;
};

/**
 * Update AI results
 * @param {Object} aiResults - AI processing results
 * @returns {Promise<Knowledge>}
 */
knowledgeSchema.methods.updateAIResults = async function (aiResults) {
  this.scopeType = aiResults.scopeType;
  this.aiSummary = aiResults.summary;
  this.aiKeywords = aiResults.keywords;
  this.aiConfidence = aiResults.confidence;
  this.aiProcessed = true;
  return this.save();
};

// Static methods
/**
 * Search knowledge with filters
 * @param {Object} options - Search options
 * @returns {Promise<Array>}
 */
knowledgeSchema.statics.searchKnowledge = async function (options) {
  const {
    query,
    category,
    tags,
    scopeType,
    page = 1,
    limit = 10,
    sortBy = 'relevance',
  } = options;

  const filter = {};
  let sort = {};

  // Text search
  if (query) {
    filter.$text = { $search: query };
  }

  // Category filter
  if (category && category !== 'all') {
    filter.category = category;
  }

  // Tags filter
  if (tags && Array.isArray(tags) && tags.length > 0) {
    filter.tags = { $in: tags };
  }

  // Scope filter
  if (scopeType && scopeType !== 'all') {
    filter.scopeType = scopeType;
  }

  // Sorting
  if (query && sortBy === 'relevance') {
    sort = { score: { $meta: 'textScore' } };
  } else if (sortBy === 'newest') {
    sort = { createdAt: -1 };
  } else if (sortBy === 'popular') {
    sort = { views: -1 };
  } else {
    sort = { createdAt: -1 };
  }

  const skip = (page - 1) * limit;

  const results = await this.find(filter, query ? { score: { $meta: 'textScore' } } : {})
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await this.countDocuments(filter);

  return {
    data: results,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    },
  };
};

/**
 * Get trending tags
 * @param {Number} limit - Number of tags to return
 * @returns {Promise<Array>}
 */
knowledgeSchema.statics.getTrendingTags = async function (limit = 10) {
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
    { $project: { tag: '$_id', count: 1, _id: 0 } },
  ]);
};

/**
 * Get category distribution
 * @returns {Promise<Array>}
 */
knowledgeSchema.statics.getCategoryDistribution = async function () {
  return this.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { category: '$_id', count: 1, _id: 0 } },
  ]);
};

/**
 * Get scope distribution
 * @returns {Promise<Array>}
 */
knowledgeSchema.statics.getScopeDistribution = async function () {
  return this.aggregate([
    { $match: { scopeType: { $ne: null } } },
    { $group: { _id: '$scopeType', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { scopeType: '$_id', count: 1, _id: 0 } },
  ]);
};

const Knowledge = mongoose.model('Knowledge', knowledgeSchema);

module.exports = Knowledge;
