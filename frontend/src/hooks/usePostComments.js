import { useState, useCallback } from 'react';
import API from '../api/api';

// Helpers
// Creates a temporary optimistic comment node so the UI feels instant.
const createOptimisticComment = (text, user, extra = {}) => ({
  id: `temp-${Date.now()}`,
  text,
  createdAt: new Date().toISOString(),
  author: { id: user.id, username: user.username },
  replies: [],
  isOptimistic: true,
  ...extra,
});

// Hook
/**
 * Manages all comment interactions for a single post:
 * - Optimistic adds/deletes
 * - Paginated lazy-loading of replies per root comment
 * - Reply-form state per comment (text + visibility)
 */
export default function usePostComments(postId, user, onRefresh) {
  // Root-level comment input
  const [newCommentText, setNewCommentText] = useState('');

  // Per-comment reply state: { [commentId]: { text, isOpen } }
  const [replyState, setReplyState] = useState({});

  // Per-root-comment pagination: { [commentId]: { page, hasMore, loading } }
  const [replyPages, setReplyPages] = useState({});

  const [actionLoading, setActionLoading] = useState(false);

  // -------------------------------------------------------------------------
  // Reply form helpers
  // -------------------------------------------------------------------------

  /** Open/close the reply input for a comment and optionally prefill text */
  const toggleReplyForm = useCallback((commentId, defaultText = '') => {
    setReplyState(prev => {
      const current = prev[commentId] || {};
      const isOpen = !current.isOpen;
      return {
        ...prev,
        [commentId]: {
          ...current,
          isOpen,
          text: isOpen ? defaultText : '',
        },
      };
    });
  }, []);

  /** Update the text inside a reply input */
  const updateReplyText = useCallback((commentId, text) => {
    setReplyState(prev => ({
      ...prev,
      [commentId]: { ...(prev[commentId] || {}), text },
    }));
  }, []);

  // Convenience derived getters
  const getReplyText = (id) => replyState[id]?.text ?? '';
  const isReplying = (id) => replyState[id]?.isOpen ?? false;

  // -------------------------------------------------------------------------
  // Add root comment (with optimistic update)
  // -------------------------------------------------------------------------
  const addRootComment = useCallback(async (text) => {
    if (!text.trim() || !user) return;

    setActionLoading(true);
    setNewCommentText('');

    try {
      await API.post('/comments', {
        text,
        postId: parseInt(postId, 10),
      });
      onRefresh?.();
    } catch {
      // On failure, refresh to restore real state
      onRefresh?.();
    } finally {
      setActionLoading(false);
    }
  }, [postId, user, onRefresh]);

  // -------------------------------------------------------------------------
  // Add reply (with optimistic update, server-side flattening handles depth)
  // -------------------------------------------------------------------------
  const addReply = useCallback(async (parentCommentId, text) => {
    if (!text.trim() || !user) return;

    setActionLoading(true);

    // Close the reply form immediately (optimistic feel)
    setReplyState(prev => ({
      ...prev,
      [parentCommentId]: { isOpen: false, text: '' },
    }));

    try {
      await API.post('/comments', {
        text,
        postId: parseInt(postId, 10),
        parentCommentId,
      });
      onRefresh?.();
    } catch {
      onRefresh?.();
    } finally {
      setActionLoading(false);
    }
  }, [postId, user, onRefresh]);

  // -------------------------------------------------------------------------
  // Delete comment
  // -------------------------------------------------------------------------
  const deleteComment = useCallback(async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    setActionLoading(true);
    try {
      await API.delete(`/comments/${commentId}`);
      onRefresh?.();
    } catch {
      onRefresh?.();
    } finally {
      setActionLoading(false);
    }
  }, [onRefresh]);

  // -------------------------------------------------------------------------
  // Lazy-load more replies for a root comment (offset pagination)
  // -------------------------------------------------------------------------
  const loadMoreReplies = useCallback(async (rootCommentId, currentRepliesCount) => {
    setReplyPages(prev => ({
      ...prev,
      [rootCommentId]: { ...(prev[rootCommentId] || {}), loading: true },
    }));

    const LIMIT = 10;

    try {
      const { data } = await API.get(`/comments/${rootCommentId}/replies`, {
        params: { offset: currentRepliesCount, limit: LIMIT },
      });

      setReplyPages(prev => ({
        ...prev,
        [rootCommentId]: {
          loading: false,
          hasMore: data.hasMore,
        },
      }));

      return data.replies ?? [];
    } catch {
      setReplyPages(prev => ({
        ...prev,
        [rootCommentId]: { ...(prev[rootCommentId] || {}), loading: false },
      }));
      return [];
    }
  }, []);

  const isLoadingReplies = (id) => replyPages[id]?.loading ?? false;
  const hasMoreReplies = useCallback((id, initialCount = 0) => {
    if (replyPages[id] !== undefined) return replyPages[id].hasMore;
    return initialCount >= 3;
  }, [replyPages]);

  return {
    // Root comment input
    newCommentText,
    setNewCommentText,
    addRootComment,

    // Reply form
    getReplyText,
    updateReplyText,
    isReplying,
    toggleReplyForm,
    addReply,

    // Delete
    deleteComment,

    // Lazy replies
    loadMoreReplies,
    isLoadingReplies,
    hasMoreReplies,

    actionLoading,
  };
}
