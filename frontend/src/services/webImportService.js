import api from '../config/api';

const webImportService = {
  // Preview content from URL before importing
  previewUrl: async (url) => {
    const response = await api.post('/knowledge/preview-url', { url });
    return response.data;
  },

  // Import knowledge from URL
  importFromUrl: async (url) => {
    const response = await api.post('/knowledge/import-url', { url });
    return response.data;
  },

  // Get trending topics
  getTrendingTopics: async () => {
    const response = await api.get('/knowledge/trending');
    return response.data;
  },

  // Search web content
  searchWeb: async (query, limit = 10) => {
    const response = await api.get('/knowledge/web-search', {
      params: { q: query, limit },
    });
    return response.data;
  },
};

export default webImportService;
