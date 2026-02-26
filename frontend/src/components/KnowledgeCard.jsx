import { Link } from 'react-router-dom';
import { FiEye, FiEdit, FiTrash2, FiClock } from 'react-icons/fi';
import { 
  getScopeBadgeColor, 
  getCategoryColor, 
  formatRelativeTime, 
  truncateText,
  calculateReadingTime 
} from '../utils/helpers.jsx';

const KnowledgeCard = ({ knowledge, onDelete, canEdit = false, searchQuery = '' }) => {
  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this knowledge?')) {
      onDelete(knowledge._id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden card-hover">
      <Link to={`/knowledge/${knowledge._id}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-semibold text-gray-800 hover:text-primary-600 transition line-clamp-2">
              {knowledge.title}
            </h3>
          </div>

          {/* Content Preview */}
          <p className="text-gray-600 mb-4 line-clamp-3">
            {knowledge.aiSummary || truncateText(knowledge.content, 150)}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Category */}
            <span className={`text-sm font-medium ${getCategoryColor(knowledge.category)}`}>
              {knowledge.category}
            </span>

            {/* Scope Badge */}
            {knowledge.scopeType && (
              <span className={`text-xs px-2 py-1 rounded-full ${getScopeBadgeColor(knowledge.scopeType)}`}>
                {knowledge.scopeType}
              </span>
            )}

            {/* AI Confidence */}
            {knowledge.aiConfidence !== null && knowledge.aiConfidence !== undefined && (
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                AI: {(knowledge.aiConfidence * 100).toFixed(0)}%
              </span>
            )}
          </div>

          {/* Tags */}
          {knowledge.tags && knowledge.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {knowledge.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                >
                  #{tag}
                </span>
              ))}
              {knowledge.tags.length > 3 && (
                <span className="text-xs px-2 py-1 text-gray-500">
                  +{knowledge.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <FiEye className="mr-1" />
                {knowledge.views || 0}
              </span>
              <span className="flex items-center">
                <FiClock className="mr-1" />
                {calculateReadingTime(knowledge.content)} min read
              </span>
            </div>

            <span className="text-xs text-gray-400">
              {formatRelativeTime(knowledge.createdAt)}
            </span>
          </div>

          {/* Author */}
          {knowledge.author && (
            <div className="mt-2 text-sm text-gray-600">
              by {knowledge.author}
            </div>
          )}
        </div>
      </Link>

      {/* Action Buttons */}
      {canEdit && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end space-x-2">
          <Link
            to={`/edit/${knowledge._id}`}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded transition"
          >
            <FiEdit size={16} />
            <span>Edit</span>
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition"
          >
            <FiTrash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default KnowledgeCard;
