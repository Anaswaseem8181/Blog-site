import { useState, useCallback } from "react";
import API from "../api/api";
import useAsync from "./useAsync";

export default function useUserProfile() {
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [postsPage, setPostsPage] = useState(1);
  const [commentsPage, setCommentsPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(false);

  const { loading: fetchProfileLoading, error: fetchProfileError, execute: executeProfileFetch } = useAsync();
  const { loading: fetchPostsLoading, error: fetchPostsError, execute: executePostsFetch } = useAsync();
  const { loading: fetchCommentsLoading, error: fetchCommentsError, execute: executeCommentsFetch } = useAsync();
  const { loading: updateLoading, error: updateError, execute: executeUpdate } = useAsync();

  const fetchProfile = useCallback(async (username) => {
    const { data } = await executeProfileFetch(() => API.get(`/users/${username}`));
    if (data) {
      setProfileData(data.user);
    }
  }, [executeProfileFetch]);

  const fetchPosts = useCallback(async (username, pageNum = 1, append = false) => {
    const { data } = await executePostsFetch(() => API.get(`/users/${username}/posts`, { params: { page: pageNum, limit: 9 } }));
    if (data) {
      setHasMorePosts(data.hasMore);
      setPosts(prev => append ? [...prev, ...data.posts] : data.posts);
    }
  }, [executePostsFetch]);

  const fetchComments = useCallback(async (username, pageNum = 1, append = false) => {
    const { data } = await executeCommentsFetch(() => API.get(`/users/${username}/comments`, { params: { page: pageNum, limit: 10 } }));
    if (data) {
      setHasMoreComments(data.hasMore);
      setComments(prev => append ? [...prev, ...data.comments] : data.comments);
    }
  }, [executeCommentsFetch]);

  const loadMorePosts = useCallback((username) => {
    const nextPage = postsPage + 1;
    setPostsPage(nextPage);
    fetchPosts(username, nextPage, true);
  }, [postsPage, fetchPosts]);

  const loadMoreComments = useCallback((username) => {
    const nextPage = commentsPage + 1;
    setCommentsPage(nextPage);
    fetchComments(username, nextPage, true);
  }, [commentsPage, fetchComments]);

  const updateProfile = useCallback(async (updateData) => {
    const { data, error } = await executeUpdate(() => API.put('/users/me', updateData));
    if (data && !error) {
       // Only update if editing own profile matches current viewed profile 
       // but typically we'll just refetch profile to be safe
       return true;
    }
    return false;
  }, [executeUpdate]);

  return {
    profileData,
    posts,
    comments,
    hasMorePosts,
    hasMoreComments,
    loading: {
      profile: fetchProfileLoading,
      posts: fetchPostsLoading,
      comments: fetchCommentsLoading,
      update: updateLoading
    },
    error: {
      profile: fetchProfileError,
      posts: fetchPostsError,
      comments: fetchCommentsError,
      update: updateError
    },
    fetchProfile,
    fetchPosts,
    fetchComments,
    loadMorePosts,
    loadMoreComments,
    updateProfile,
    setPostsPage,
    setCommentsPage
  };
}
