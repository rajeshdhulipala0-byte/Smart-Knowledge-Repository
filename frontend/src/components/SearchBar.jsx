import { useState } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const categories = [
  'All',
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
];

const scopes = ['All', 'Beginner', 'Intermediate', 'Advanced', 'OutOfScope'];

const SearchBar = ({ onSearch, showFilters = true }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [scopeType, setScopeType] = useState('All');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    
    const searchParams = {
      q: query,
      category: category !== 'All' ? category : undefined,
      scopeType: scopeType !== 'All' ? scopeType : undefined,
    };

    onSearch(searchParams);
  };

  const handleReset = () => {
    setQuery('');
    setCategory('All');
    setScopeType('All');
    onSearch({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <form onSubmit={handleSearch}>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search knowledge base..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {showFilters && (
            <button
              type="button"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center space-x-2"
            >
              <FiFilter />
              <span className="hidden sm:inline">Filters</span>
            </button>
          )}

          <button
            type="submit"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Search
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && showFilterPanel && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
              <button
                type="button"
                onClick={() => setShowFilterPanel(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat === 'All' ? 'All' : cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scope Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={scopeType}
                  onChange={(e) => setScopeType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {scopes.map((scope) => (
                    <option key={scope} value={scope === 'All' ? 'All' : scope}>
                      {scope}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
