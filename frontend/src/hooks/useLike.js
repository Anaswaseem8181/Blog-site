import { useState, useCallback } from 'react';
import API from '../api/api';

/**
 * Optimistic Like/Unlike hook.
 *
 * Instantly flips UI state on click, fires the API in the background,
 * and rolls back to the previous state if the request fails.
 *
 * @param {object} options
 * @param {'post' | 'comment'} options.type
 * @param {number} options.targetId  - postId or commentId
 * @param {boolean} options.initialIsLiked
 * @param {number} options.initialCount
 * @param {boolean} options.isAuthenticated
 */
export default function useLike({ type, targetId, initialIsLiked = false, initialCount = 0, isAuthenticated = false }) {
  const [isLiked, setIsLiked] = useState(Boolean(initialIsLiked));
  const [count, setCount] = useState(Number(initialCount));
  const [isLoading, setIsLoading] = useState(false);

  const toggle = useCallback(async (e) => {
    // Stop click from bubbling up to parent card / navigate actions
    e?.stopPropagation();
    e?.preventDefault();

    if (!isAuthenticated) {
      // Redirect or show hint – keep it simple for now
      return;
    }

    if (isLoading) return;

    // --- Optimistic update ---
    const prevIsLiked = isLiked;
    const prevCount = count;

    setIsLiked(!prevIsLiked);
    setCount(prevIsLiked ? prevCount - 1 : prevCount + 1);
    setIsLoading(true);

    try {
      const endpoint = type === 'post'
        ? `/posts/${targetId}/like`
        : `/comments/${targetId}/like`;

      await API.post(endpoint);
    } catch (err) {
      // --- Rollback on failure ---
      setIsLiked(prevIsLiked);
      setCount(prevCount);
      console.error('Like toggle failed:', err?.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  }, [type, targetId, isLiked, count, isLoading, isAuthenticated]);

  return { isLiked, count, toggle, isLoading };
}
