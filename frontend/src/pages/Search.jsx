import { useKnowledgeSearch } from '../hooks/useKnowledge';
import KnowledgeCard from '../components/KnowledgeCard';
import SkeletonCard from '../components/SkeletonCard';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../context/AuthContext';
import { useDeleteKnowledge } from '../hooks/useKnowledge';

const Search = () => {
  const { isAdmin } = useAuth();
  const { results, pagination, loading, updateSearchParams } = useKnowledgeSearch({
    page: 1,
    limit: 9,
  });
  const { deleteKnowledge } = useDeleteKnowledge();

  const handleSearch = (searchParams) => {
    updateSearchParams({ ...searchParams, page: 1 });
  };

  const handlePageChange = (page) => {
    updateSearchParams({ page });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    const success = await deleteKnowledge(id);
    if (success) {
      // Refresh search results
      updateSearchParams({});
    }
  };

  return (
    <div className="fade-in">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Search Knowledge Base
      </h1>

      <SearchBar onSearch={handleSearch} showFilters={true} />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="mb-4 text-gray-600">
            Found {pagination?.totalItems || 0} result(s)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item) => (
              <KnowledgeCard
                key={item._id}
                knowledge={item}
                onDelete={handleDelete}
                canEdit={isAdmin()}
              />
            ))}
          </div>

          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Results Found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search criteria or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;
