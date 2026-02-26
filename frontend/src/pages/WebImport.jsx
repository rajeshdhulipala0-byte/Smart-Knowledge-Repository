import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import {
  FiGlobe,
  FiLink,
  FiSearch,
  FiTrendingUp,
  FiExternalLink,
  FiDownload,
  FiEye,
  FiX,
  FiCheck,
  FiAlertCircle,
} from 'react-icons/fi';
import webImportService from '../services/webImportService';
import Spinner from '../components/Spinner';

const WebImport = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('url'); // url, search, trending
  const [loading, setLoading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [preview, setPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Tabs configuration
  const tabs = [
    { id: 'url', label: 'Import from URL', icon: FiLink },
    { id: 'search', label: 'Web Search', icon: FiSearch },
    { id: 'trending', label: 'Trending Topics', icon: FiTrendingUp },
  ];

  // Handle URL preview
  const handlePreviewUrl = async () => {
    if (!user) {
      toast.error('Please login to use web import features');
      navigate('/login');
      return;
    }

    if (!urlInput.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    // Validate URL format
    try {
      new URL(urlInput);
    } catch (e) {
      toast.error('Please enter a valid URL (e.g., https://example.com/article)');
      return;
    }

    setLoading(true);
    try {
      const response = await webImportService.previewUrl(urlInput);
      setPreview(response.data);
      setShowPreview(true);
      toast.success('URL content loaded successfully');
    } catch (error) {
      console.error('Preview error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to preview URL';
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again');
        navigate('/login');
      } else if (error.response?.status === 400) {
        toast.error(errorMsg + ' - This URL may not be accessible or supported');
      } else {
        toast.error(errorMsg + ' - Please try a different URL');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle URL import
  const handleImportUrl = async () => {
    if (!user) {
      toast.error('Please login to import content');
      navigate('/login');
      return;
    }

    if (!urlInput.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    setLoading(true);
    try {
      const response = await webImportService.importFromUrl(urlInput);
      toast.success('Knowledge imported successfully!');
      navigate(`/knowledge/${response.data._id}`);
    } catch (error) {
      console.error('Import error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to import from URL';
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again');
        navigate('/login');
      } else if (error.response?.status === 400) {
        toast.error(errorMsg + ' - Unable to extract content from this URL');
      } else {
        toast.error(errorMsg + ' - The URL may be blocked or inaccessible');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle import from preview
  const handleImportFromPreview = async () => {
    if (!user) {
      toast.error('Please login to import content');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await webImportService.importFromUrl(urlInput);
      toast.success('Knowledge imported successfully!');
      navigate(`/knowledge/${response.data._id}`);
    } catch (error) {
      console.error('Import error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to import';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
      setShowPreview(false);
    }
  };

  // Handle web search
  const handleWebSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setLoading(true);
    try {
      const response = await webImportService.searchWeb(searchQuery);
      setSearchResults(response.data);
    } catch (error) {
      toast.error('Failed to search web');
    } finally {
      setLoading(false);
    }
  };

  // Load trending topics
  const loadTrendingTopics = async () => {
    setLoading(true);
    try {
      const response = await webImportService.getTrendingTopics();
      setTrendingTopics(response.data);
    } catch (error) {
      toast.error('Failed to load trending topics');
    } finally {
      setLoading(false);
    }
  };

  // Import from search result or trending topic
  const handleImportFromUrl = async (url) => {
    setLoading(true);
    try {
      const response = await webImportService.importFromUrl(url);
      toast.success('Knowledge imported successfully!');
      navigate(`/knowledge/${response.data._id}`);
    } catch (error) {
      toast.error('Failed to import from URL');
    } finally {
      setLoading(false);
    }
  };

  // Load trending topics when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'trending' && trendingTopics.length === 0) {
      loadTrendingTopics();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-3 bg-primary-100 rounded-lg">
            <FiGlobe className="text-primary-600 text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Web Import</h1>
            <p className="text-gray-600">
              Import knowledge from the web - URLs, search results, or trending topics
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* URL Import Tab */}
        {activeTab === 'url' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Import from URL</h2>
            <p className="text-gray-600 mb-6">
              Enter a URL to automatically extract and import content as knowledge
            </p>

            <div className="space-y-4">
              {!user && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
                  <FiAlertCircle className="text-yellow-600 text-xl flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-900 mb-1">Login Required</h3>
                    <p className="text-sm text-yellow-800">
                      You need to be logged in to import content from URLs.{' '}
                      <button
                        onClick={() => navigate('/login')}
                        className="underline font-medium hover:text-yellow-900"
                      >
                        Login here
                      </button>
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter URL
                </label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/article"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    onClick={handlePreviewUrl}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
                  >
                    <FiEye />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={handleImportUrl}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                  >
                    {loading ? <Spinner size="small" /> : <FiDownload />}
                    <span>Import</span>
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Tips:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Works best with blog posts, articles, and documentation</li>
                  <li>• Automatically extracts title, content, metadata, and images</li>
                  <li>• Preview before importing to review the content</li>
                  <li>• Supports most public web pages</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Web Search Tab */}
        {activeTab === 'search' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Search the Web</h2>
            <p className="text-gray-600 mb-6">
              Search for content across the web and import relevant articles
            </p>

            <form onSubmit={handleWebSearch} className="mb-6">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for topics, technologies, tutorials..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                >
                  {loading ? <Spinner size="small" /> : <FiSearch />}
                  <span>Search</span>
                </button>
              </div>
            </form>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">
                  Search Results ({searchResults.length})
                </h3>
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {result.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {result.description}
                        </p>
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {result.source}
                          </span>
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-primary-600 hover:underline"
                          >
                            <FiExternalLink />
                            <span>View Original</span>
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => handleImportFromUrl(result.url)}
                        disabled={loading}
                        className="ml-4 px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                      >
                        Import
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchResults.length === 0 && !loading && (
              <div className="text-center py-12 text-gray-500">
                <FiSearch className="mx-auto text-4xl mb-2" />
                <p>Enter a search query to find content</p>
              </div>
            )}
          </div>
        )}

        {/* Trending Topics Tab */}
        {activeTab === 'trending' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Trending Topics</h2>
            <p className="text-gray-600 mb-6">
              Popular topics and articles in technology and development
            </p>

            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : trendingTopics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trendingTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="border border-gray-200 rounded-lg p-5 hover:border-primary-300 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {topic.category}
                      </span>
                      {topic.trending && (
                        <div className="flex items-center text-orange-600 text-xs">
                          <FiTrendingUp className="mr-1" />
                          <span>Trending</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2 text-lg">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {topic.description}
                    </p>
                    <div className="flex space-x-2">
                      <a
                        href={topic.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-primary-600 transition"
                      >
                        <FiExternalLink />
                        <span>View Source</span>
                      </a>
                      <button
                        onClick={() => handleImportFromUrl(topic.url)}
                        disabled={loading}
                        className="ml-auto px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                      >
                        Import Topic
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FiTrendingUp className="mx-auto text-4xl mb-2" />
                <p>No trending topics available</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && preview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Content Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <div className="p-6">
              {preview.imageUrl && (
                <img
                  src={preview.imageUrl}
                  alt={preview.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}

              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {preview.title}
              </h2>

              {preview.author && (
                <p className="text-sm text-gray-600 mb-2">
                  By {preview.author}
                </p>
              )}

              {preview.description && (
                <p className="text-gray-700 mb-4 italic">{preview.description}</p>
              )}

              {preview.tags && preview.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {preview.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">
                  {preview.content.substring(0, 1000)}
                  {preview.content.length > 1000 && '...'}
                </p>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportFromPreview}
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                >
                  {loading ? <Spinner size="small" /> : <FiCheck />}
                  <span>Import Knowledge</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebImport;
