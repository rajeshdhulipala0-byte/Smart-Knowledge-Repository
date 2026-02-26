import api from '../config/api';

/**
 * Knowledge API Service
 */
const knowledgeService = {
  /**
   * Get all knowledge with pagination
   */
  getAll: async (params = {}) => {
    const response = await api.get('/knowledge', { params });
    return response.data;
  },

  /**
   * Get knowledge by ID
   */
  getById: async (id) => {
    const response = await api.get(`/knowledge/${id}`);
    return response.data;
  },

  /**
   * Search knowledge
   */
  search: async (params = {}) => {
    const response = await api.get('/knowledge/search', { params });
    return response.data;
  },

  /**
   * Get knowledge by category
   */
  getByCategory: async (category, params = {}) => {
    const response = await api.get(`/knowledge/category/${category}`, { params });
    return response.data;
  },

  /**
   * Create new knowledge
   */
  create: async (data) => {
    const response = await api.post('/knowledge', data);
    return response.data;
  },

  /**
   * Update knowledge
   */
  update: async (id, data) => {
    const response = await api.put(`/knowledge/${id}`, data);
    return response.data;
  },

  /**
   * Delete knowledge
   */
  delete: async (id) => {
    const response = await api.delete(`/knowledge/${id}`);
    return response.data;
  },

  /**
   * Get analytics (admin only)
   */
  getAnalytics: async () => {
    const response = await api.get('/knowledge/admin/analytics');
    return response.data;
  },

  /**
   * Batch process AI (admin only)
   */
  batchProcessAI: async (limit = 10) => {
    const response = await api.post('/knowledge/admin/batch-process-ai', { limit });
    return response.data;
  },
};

export default knowledgeService;
