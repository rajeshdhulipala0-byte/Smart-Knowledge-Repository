import { useKnowledge, useDeleteKnowledge } from '../hooks/useKnowledge';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import KnowledgeCard from '../components/KnowledgeCard';
import SkeletonCard from '../components/SkeletonCard';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import { FiPlus } from 'react-icons/fi';

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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome to Smart Knowledge Repository
        </h1>
        <p className="text-gray-600 text-lg">
          Discover, learn, and share knowledge powered by AI
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} showFilters={true} />

      {/* Quick Stats */}
      {pagination && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-primary-600">
              {pagination.totalItems}
            </div>
            <div className="text-gray-600">Total Knowledge Items</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-green-600">
              {pagination.totalPages}
            </div>
            <div className="text-gray-600">Pages</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-purple-600">
              {pagination.itemsPerPage}
            </div>
            <div className="text-gray-600">Items Per Page</div>
          </div>
        </div>
      )}

      {/* Create Button for Authenticated Users */}
      {user && (
        <div className="mb-6">
          <Link
            to="/create"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-md"
          >
            <FiPlus size={20} />
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
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No knowledge found
          </h3>
          <p className="text-gray-500 mb-6">
            Be the first to add knowledge to the repository
          </p>
          {user && (
            <Link
              to="/create"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              <FiPlus />
              <span>Create Knowledge</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
