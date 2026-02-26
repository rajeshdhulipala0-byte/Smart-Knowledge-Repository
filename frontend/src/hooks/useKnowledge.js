import { useState, useEffect, useCallback } from 'react';
import knowledgeService from '../services/knowledgeService';
import { toast } from 'react-toastify';

/**
 * Hook for fetching all knowledge with pagination
 */
export const useKnowledge = (initialParams = {}) => {
  const [knowledge, setKnowledge] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchKnowledge = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use search endpoint if search parameters are provided
      const hasSearchParams = params.q || params.category || params.scopeType || params.tags;
      const response = hasSearchParams 
        ? await knowledgeService.search(params)
        : await knowledgeService.getAll(params);
      
      if (response.success) {
        setKnowledge(response.data);
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch knowledge');
      toast.error('Failed to fetch knowledge');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchKnowledge();
  }, [fetchKnowledge]);

  const refresh = () => {
    fetchKnowledge();
  };

  const updateParams = (newParams) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  return {
    knowledge,
    pagination,
    loading,
    error,
    refresh,
    updateParams,
  };
};

/**
 * Hook for fetching single knowledge by ID
 */
export const useKnowledgeById = (id) => {
  const [knowledge, setKnowledge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKnowledge = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await knowledgeService.getById(id);
        
        if (response.success) {
          setKnowledge(response.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch knowledge');
        toast.error('Failed to fetch knowledge details');
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledge();
  }, [id]);

  return { knowledge, loading, error };
};

/**
 * Hook for searching knowledge with debouncing
 */
export const useKnowledgeSearch = (initialParams = {}) => {
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const search = useCallback(async () => {
    if (!params.q && !params.category && !params.tags) {
      setResults([]);
      setPagination(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await knowledgeService.search(params);
      
      if (response.success) {
        setResults(response.data);
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      search();
    }, 300); // Debounce delay

    return () => clearTimeout(timeoutId);
  }, [search]);

  const updateSearchParams = (newParams) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  const clearSearch = () => {
    setParams({});
    setResults([]);
    setPagination(null);
  };

  return {
    results,
    pagination,
    loading,
    error,
    updateSearchParams,
    clearSearch,
  };
};

/**
 * Hook for creating knowledge
 */
export const useCreateKnowledge = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createKnowledge = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await knowledgeService.create(data);
      
      if (response.success) {
        toast.success('Knowledge created successfully!');
        return response.data;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create knowledge';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createKnowledge, loading, error };
};

/**
 * Hook for updating knowledge
 */
export const useUpdateKnowledge = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateKnowledge = async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await knowledgeService.update(id, data);
      
      if (response.success) {
        toast.success('Knowledge updated successfully!');
        return response.data;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update knowledge';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateKnowledge, loading, error };
};

/**
 * Hook for deleting knowledge
 */
export const useDeleteKnowledge = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteKnowledge = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await knowledgeService.delete(id);
      
      if (response.success) {
        toast.success('Knowledge deleted successfully!');
        return true;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete knowledge';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteKnowledge, loading, error };
};
