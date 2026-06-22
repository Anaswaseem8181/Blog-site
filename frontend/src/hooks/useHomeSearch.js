import { useState, useCallback } from 'react';
import API from '../api/api';
import useAsync from './useAsync';

/**
 * Custom hook to manage home page search and pagination
 * Separates search/filter logic from UI concerns
 */
export default function useHomeSearch() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { loading, error, execute } = useAsync();

  // Fetch posts with search, tag, and pagination
  const fetchPosts = useCallback(async (search = '', tag = '', pageNum = 1, append = false) => {
    const params = { params: { page: pageNum, limit: 9 } };
    if (search) params.params.search = search;
    if (tag) params.params.tag = tag;

    const { data } = await execute(() => API.get('/posts', params));
    if (data) {
      setHasMore(data.hasMore);
      setPosts(prev => append ? [...prev, ...data.posts] : data.posts);
    }
  }, [execute]);

  // Load more posts for pagination
  const loadMore = useCallback((currentPage, search, tag) => {
    const nextPage = currentPage + 1;
    setPage(nextPage);
    fetchPosts(search, tag, nextPage, true);
  }, [fetchPosts]);

  return {
    posts,
    setPosts,
    page,
    setPage,
    hasMore,
    loading,
    error,
    fetchPosts,
    loadMore,
  };
}
