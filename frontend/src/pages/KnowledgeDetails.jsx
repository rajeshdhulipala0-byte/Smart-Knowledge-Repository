import { useParams, Link, useNavigate } from 'react-router-dom';
import { useKnowledgeById } from '../hooks/useKnowledge';
import { useAuth } from '../context/AuthContext';
import { 
  FiEye, 
  FiClock, 
  FiCalendar, 
  FiUser, 
  FiEdit, 
  FiArrowLeft 
} from 'react-icons/fi';
import {
  getScopeBadgeColor,
  getCategoryColor,
  formatDate,
  calculateReadingTime,
} from '../utils/helpers.jsx';
import Spinner from '../components/Spinner';

const KnowledgeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { knowledge, loading, error } = useKnowledgeById(id);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error || !knowledge) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Knowledge Not Found
        </h2>
        <p className="text-gray-600 mb-6">{error || 'The requested knowledge does not exist.'}</p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          <FiArrowLeft />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto fade-in">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-6"
      >
        <FiArrowLeft />
        <span>Back to Dashboard</span>
      </Link>

      {/* Main Content */}
      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-gray-200">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {knowledge.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <span className="flex items-center">
              <FiUser className="mr-1" />
              {knowledge.author}
            </span>
            <span className="flex items-center">
              <FiCalendar className="mr-1" />
              {formatDate(knowledge.createdAt)}
            </span>
            <span className="flex items-center">
              <FiEye className="mr-1" />
              {knowledge.views || 0} views
            </span>
            <span className="flex items-center">
              <FiClock className="mr-1" />
              {calculateReadingTime(knowledge.content)} min read
            </span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`text-sm font-medium ${getCategoryColor(knowledge.category)}`}>
              {knowledge.category}
            </span>

            {knowledge.scopeType && (
              <span
                className={`text-sm px-3 py-1 rounded-full ${getScopeBadgeColor(
                  knowledge.scopeType
                )}`}
              >
                {knowledge.scopeType}
              </span>
            )}

            {knowledge.aiConfidence !== null && (
              <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                AI Confidence: {(knowledge.aiConfidence * 100).toFixed(0)}%
              </span>
            )}
          </div>
        </div>

        {/* AI Summary */}
        {knowledge.aiSummary && (
          <div className="p-8 bg-blue-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
              <span className="mr-2">🤖</span> AI Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{knowledge.aiSummary}</p>
          </div>
        )}

        {/* Content */}
        <div className="p-8">
          <div className="prose max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {knowledge.content}
            </div>
          </div>
        </div>

        {/* AI Keywords */}
        {knowledge.aiKeywords && knowledge.aiKeywords.length > 0 && (
          <div className="p-8 bg-gray-50 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              AI Extracted Keywords
            </h2>
            <div className="flex flex-wrap gap-2">
              {knowledge.aiKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {knowledge.tags && knowledge.tags.length > 0 && (
          <div className="p-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {knowledge.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Edit Button for Admin */}
        {isAdmin() && (
          <div className="p-8 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={() => navigate(`/edit/${knowledge._id}`)}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              <FiEdit />
              <span>Edit Knowledge</span>
            </button>
          </div>
        )}
      </article>
    </div>
  );
};

export default KnowledgeDetails;
