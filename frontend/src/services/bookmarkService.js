import api from '../config/api';

const bookmarkService = {
  /**
   * Get user bookmarks
   */
  getAll: async (params = {}) => {
    const response = await api.get('/bookmarks', { params });
    return response.data;
  },

  /**
   * Add bookmark
   */
  add: async (knowledgeId, data = {}) => {
    const response = await api.post(`/bookmarks/${knowledgeId}`, data);
    return response.data;
  },

  /**
   * Remove bookmark
   */
  remove: async (knowledgeId) => {
    const response = await api.delete(`/bookmarks/${knowledgeId}`);
    return response.data;
  },

  /**
   * Update bookmark
   */
  update: async (knowledgeId, data) => {
    const response = await api.put(`/bookmarks/${knowledgeId}`, data);
    return response.data;
  },

  /**
   * Check if bookmarked
   */
  check: async (knowledgeId) => {
    const response = await api.get(`/bookmarks/check/${knowledgeId}`);
    return response.data;
  },
};

export default bookmarkService;
