import { useState, useCallback } from "react";
import API from "../api/api";
import useAsync from "./useAsync";

/* Custom hook to manage dashboard posts fetching, pagination, and deletion
 * Separates data logic from UI concerns
 */
export default function useDashboardPosts() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const {
    loading: fetchLoading,
    error: fetchError,
    execute: executeFetch,
  } = useAsync();
  const {
    loading: actionLoading,
    error: actionError,
    execute: executeAction,
  } = useAsync();

  // Fetch posts with pagination support
  const fetchMyPosts = useCallback(
    async (pageNum = 1, append = false) => {
      const { data } = await executeFetch(() =>
        API.get("/posts/my-posts", { params: { page: pageNum, limit: 9 } }),
      );

      if (data) {
        setHasMore(data.hasMore);
        setPosts((prev) => (append ? [...prev, ...data.posts] : data.posts));
      }
    },
    [executeFetch],
  );

  // Load more posts for pagination
  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMyPosts(nextPage, true);
  }, [page, fetchMyPosts]);

  // Delete a post and refresh list
  const deletePost = useCallback(
    async (postId) => {
      if (!window.confirm("Are you sure you want to delete this article?"))
        return false;

      const { error } = await executeAction(() =>
        API.delete(`/posts/${postId}`),
      );
      if (!error) {
        fetchMyPosts(); // Refresh the list
        return true;
      }
      return false;
    },
    [fetchMyPosts, executeAction],
  );

  return {
    posts,
    setPosts,
    page,
    setPage,
    hasMore,
    fetchLoading,
    fetchError,
    actionLoading,
    actionError,
    fetchMyPosts,
    loadMore,
    deletePost,
  };
}
