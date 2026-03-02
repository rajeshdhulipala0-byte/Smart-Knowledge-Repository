import { useKnowledge, useDeleteKnowledge } from '../hooks/useKnowledge';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import KnowledgeCard from '../components/KnowledgeCard';
import SkeletonCard from '../components/SkeletonCard';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import { FiPlus, FiBookOpen, FiLayers, FiGrid } from 'react-icons/fi';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const { knowledge, pagination, loading, updateParams, refresh } = useKnowledge({
    page: 1,
    limit: 9,
  });
  const { deleteKnowledge } = useDeleteKnowledge();

  const handlePageChange = (page) => {
    updateParams({ page });
    window.scrollTo(0, 0);
  };

  const handleSearch = (searchParams) => {
    updateParams({ ...searchParams, page: 1 });
  };

  const handleDelete = async (id) => {
    const success = await deleteKnowledge(id);
    if (success) {
      refresh();
    }
  };

  return (
    <div className="fade-in">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 left-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      {/* Header */}
      <div className="mb-12 text-center relative z-10">
        <div className="inline-block mb-4">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className="w-1 h-1 bg-primary-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-widest">Premium Knowledge Hub</span>
            <div className="w-1 h-1 bg-primary-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <h1 className="text-6xl font-black bg-gradient-to-r from-gray-900 via-primary-800 to-purple-900 bg-clip-text text-transparent mb-6 leading-tight tracking-tight">
          Smart Knowledge
          <br />
          <span className="text-5xl">Repository</span>
        </h1>
        <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto leading-relaxed">
          Curate, discover, and amplify your learning journey with AI-powered insights
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} showFilters={true} />

      {/* Quick Stats */}
      {pagination && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 relative z-10">
          <div className="group bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full -mr-12 -mt-12"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <FiBookOpen className="text-primary-600 w-8 h-8" />
                <div className="text-xs font-semibold text-primary-600 uppercase tracking-wider">Total</div>
              </div>
              <div className="text-4xl font-black text-gray-900 mb-1">
                {pagination.totalItems}
              </div>
              <div className="text-gray-600 text-sm font-medium">Knowledge Articles</div>
            </div>
          </div>
          <div className="group bg-gradient-to-br from-white to-green-50/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -mr-12 -mt-12"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <FiLayers className="text-green-600 w-8 h-8" />
                <div className="text-xs font-semibold text-green-600 uppercase tracking-wider">Browse</div>
              </div>
              <div className="text-4xl font-black text-gray-900 mb-1">
                {pagination.totalPages}
              </div>
              <div className="text-gray-600 text-sm font-medium">Available Pages</div>
            </div>
          </div>
          <div className="group bg-gradient-to-br from-white to-purple-50/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full -mr-12 -mt-12"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <FiGrid className="text-purple-600 w-8 h-8" />
                <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Display</div>
              </div>
              <div className="text-4xl font-black text-gray-900 mb-1">
                {pagination.itemsPerPage}
              </div>
              <div className="text-gray-600 text-sm font-medium">Items Per Page</div>
            </div>
          </div>
        </div>
      )}

      {/* Create Button for Authenticated Users */}
      {user && (
        <div className="mb-10 flex justify-center relative z-10">
          <Link
            to="/create"
            className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl hover:from-primary-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 font-semibold"
          >
            <FiPlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>Create New Knowledge</span>
          </Link>
        </div>
      )}

      {/* Knowledge Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : knowledge.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {knowledge.map((item) => (
              <KnowledgeCard
                key={item._id}
                knowledge={item}
                onDelete={handleDelete}
                canEdit={isAdmin()}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </>
      ) : (
        <div className="text-center py-20 relative z-10">
          <div className="inline-block mb-6">
            <div className="text-8xl mb-4 transform hover:scale-110 transition-transform duration-300">📚</div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Your Knowledge Journey Begins Here
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
            Be the pioneer and contribute the first piece of wisdom to this repository
          </p>
          {user && (
            <Link
              to="/create"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl hover:from-primary-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 font-semibold"
            >
              <FiPlus className="w-5 h-5" />
              <span>Create Knowledge</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
