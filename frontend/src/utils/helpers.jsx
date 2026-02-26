/**
 * Highlight search matches in text
 * @param {string} text - Text to search in
 * @param {string} query - Search query
 * @returns {JSX.Element}
 */
export const highlightText = (text, query) => {
  if (!query || !text) return text;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));

  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} className="highlight">
        {part}
      </span>
    ) : (
      part
    )
  );
};

/**
 * Format date to readable string
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Date(date).toLocaleDateString('en-US', options);
};

/**
 * Format relative time
 * @param {string|Date} date
 * @returns {string}
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';

  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now - then) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
};

/**
 * Truncate text to specified length
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get scope badge color
 * @param {string} scope
 * @returns {string}
 */
export const getScopeBadgeColor = (scope) => {
  const colors = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-yellow-100 text-yellow-800',
    Advanced: 'bg-red-100 text-red-800',
    OutOfScope: 'bg-gray-100 text-gray-800',
  };
  return colors[scope] || colors.OutOfScope;
};

/**
 * Debounce function
 * @param {Function} func
 * @param {number} delay
 * @returns {Function}
 */
export const debounce = (func, delay = 500) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Calculate reading time
 * @param {string} text
 * @returns {number}
 */
export const calculateReadingTime = (text) => {
  if (!text) return 0;
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Get category color
 * @param {string} category
 * @returns {string}
 */
export const getCategoryColor = (category) => {
  const colors = {
    Technology: 'text-blue-600',
    Science: 'text-purple-600',
    Business: 'text-green-600',
    Health: 'text-red-600',
    Education: 'text-yellow-600',
    Arts: 'text-pink-600',
    Engineering: 'text-indigo-600',
    Mathematics: 'text-teal-600',
    Programming: 'text-cyan-600',
    'Data Science': 'text-orange-600',
    'AI/ML': 'text-violet-600',
    Other: 'text-gray-600',
  };
  return colors[category] || colors.Other;
};
