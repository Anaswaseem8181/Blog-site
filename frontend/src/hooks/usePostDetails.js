import { useCallback, useEffect, useState } from 'react';
import API from '../api/api';
import useAsync from './useAsync';

/**
 * Custom hook to manage post details and comments
 * Handles fetching post and calculating total comments
 */
export default function usePostDetails(postId) {
  const [post, setPost] = useState(null);
  const [totalComments, setTotalComments] = useState(0);
  const { loading: fetchLoading, error: fetchError, execute: executeFetch } = useAsync();

  // Calculate total comments recursively
  const calculateTotalComments = useCallback((comments = []) => {
    let total = 0;
    comments.forEach(c => {
      total++;
      if (c.replies?.length) {
        total += calculateTotalComments(c.replies);
      }
    });
    return total;
  }, []);

  // Fetch post details
  const fetchPostDetails = useCallback(async () => {
    const { data } = await executeFetch(() => API.get(`/posts/${postId}`));
    if (data) {
      setPost(data);
      setTotalComments(calculateTotalComments(data.Comments));
    }
  }, [postId, executeFetch, calculateTotalComments]);

  useEffect(() => {
    if (postId) {
      fetchPostDetails();
    }
  }, [postId, fetchPostDetails]);

  return {
    post,
    setPost,
    totalComments,
    fetchLoading,
    fetchError,
    fetchPostDetails,
  };
}
