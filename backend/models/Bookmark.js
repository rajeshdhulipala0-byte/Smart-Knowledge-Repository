const mongoose = require('mongoose');

/**
 * Bookmark Schema
 * Represents user bookmarks/favorites
 */
const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    knowledge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Knowledge',
      required: true,
      index: true,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index - user can only bookmark once per knowledge
bookmarkSchema.index({ user: 1, knowledge: 1 }, { unique: true });

// Index for query optimization
bookmarkSchema.index({ createdAt: -1 });

/**
 * Static method to get user's bookmarks with knowledge details
 */
bookmarkSchema.statics.getUserBookmarks = async function (userId, options = {}) {
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
  
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  
  const skip = (page - 1) * limit;
  
  const bookmarks = await this.find({ user: userId })
    .populate('knowledge')
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();
  
  const total = await this.countDocuments({ user: userId });
  
  return {
    data: bookmarks,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    },
  };
};

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;
