import { memo, useState, useEffect, useCallback } from 'react';
import Avatar from './comments/Avatar';
import CommentText from './comments/CommentText';
import ReplyInput from './comments/ReplyInput';
import CommentActions from './comments/CommentActions';
import ReplyList from './comments/ReplyList';

import { useNavigate } from 'react-router-dom';

/**
 * Renders a single root comment with its eagerly-loaded replies.
 * - Level-2 replies are flat (Instagram model); reply-to-reply mentions the user.
 * - Replies are hidden by default and toggled lazily.
 * - Memoized: only re-renders when its own data changes.
 */
const CommentThread = memo(function CommentThread({
  comment,
  user,
  loading,
  onDelete,
  // Reply form controls
  replyText,
  isReplyingToRoot,
  onToggleRootReply,
  onRootReplyTextChange,
  onSubmitReply,
  // Lazy load controls
  onLoadMoreReplies,
  isLoadingReplies,
  hasMoreReplies,
}) {
  const navigate = useNavigate();
  const [showReplies, setShowReplies] = useState(false);
  const [localReplies, setLocalReplies] = useState(comment.replies ?? []);

  // Sync local replies if comment.replies changes (after page refresh)
  useEffect(() => {
    setLocalReplies(comment.replies ?? []);
  }, [comment.replies]);

  const handleToggleReplies = useCallback(() => {
    setShowReplies((prev) => !prev);
  }, []);

  const handleLoadMore = useCallback(async () => {
    const newReplies = await onLoadMoreReplies(comment.id, localReplies.length);
    if (newReplies.length > 0) {
      setLocalReplies((prev) => [...prev, ...newReplies]);
    }
  }, [comment.id, localReplies.length, onLoadMoreReplies]);

  /**
   * When replying to a level-2 reply, we open the ROOT comment's reply form
   * and prefill with @username so the mention targets the reply's author.
   */
  const handleReplyToReply = useCallback(
    (replyAuthorUsername) => {
      onToggleRootReply(comment.id, `@${replyAuthorUsername} `);
    },
    [comment.id, onToggleRootReply]
  );

  const isOwner = user && comment.author?.id === user.id;
  const username = comment.author?.username ?? 'anonymous';
  const avatarUrl = comment.author?.avatarUrl ?? null;
  const replyCount = localReplies.length;

  const navigateToProfile = () => {
    if (comment.author?.username) {
      navigate(`/profile/${comment.author.username}`);
    }
  };

  return (
    <article className="flex gap-3" aria-label={`Comment by ${username}`}>
      {/* Left: Avatar */}
      <div className="flex flex-col items-center">
        <div onClick={navigateToProfile} className="cursor-pointer hover:opacity-80 transition-opacity">
          <Avatar username={username} avatarUrl={avatarUrl} />
        </div>
        {/* Vertical thread line (shows when replies are expanded) */}
        {showReplies && replyCount > 0 && (
          <div className="mt-1 flex-1 w-px bg-slate-200 min-h-[8px]" aria-hidden="true" />
        )}
      </div>

      {/* Right: Content */}
      <div className="flex-1 min-w-0">
        {/* Username + text inline (Instagram style) */}
        <div className="mb-0.5">
          <span 
            onClick={navigateToProfile} 
            className="text-sm font-semibold text-slate-900 mr-1.5 cursor-pointer hover:underline"
          >
            {username}
          </span>
          <CommentText text={comment.text} />
        </div>

        {/* Meta row: time · Like · Reply · Delete */}
        <CommentActions
          commentId={comment.id}
          createdAt={comment.createdAt}
          showReply={!!user}
          showDelete={isOwner}
          onReply={() => onToggleRootReply(comment.id, '')}
          onDelete={() => onDelete(comment.id)}
          loading={loading}
          replyAriaExpanded={isReplyingToRoot}
          replyAriaControls={`reply-form-${comment.id}`}
          initialIsLiked={comment.isLiked}
          initialLikesCount={comment.likesCount}
          isAuthenticated={!!user}
        />

        {/* Reply input for this root comment */}
        {isReplyingToRoot && (
          <div id={`reply-form-${comment.id}`}>
            <ReplyInput
              username={username}
              value={replyText}
              onChange={(text) => onRootReplyTextChange(comment.id, text)}
              onSubmit={() => onSubmitReply(comment.id, replyText)}
              onCancel={() => onToggleRootReply(comment.id, '')}
              loading={loading}
            />
          </div>
        )}

        {/* Expanded replies list & toggle */}
        <ReplyList
          commentId={comment.id}
          username={username}
          replies={localReplies}
          showReplies={showReplies}
          onToggle={handleToggleReplies}
          onLoadMore={handleLoadMore}
          isLoadingMore={isLoadingReplies}
          hasMore={hasMoreReplies}
          user={user}
          loading={loading}
          onReplyToReply={handleReplyToReply}
          onDelete={onDelete}
        />
      </div>
    </article>
  );
}, (prev, next) => {
  // Custom equality: skip re-render if nothing relevant changed
  return (
    prev.comment.id === next.comment.id &&
    prev.comment.text === next.comment.text &&
    prev.comment.replies?.length === next.comment.replies?.length &&
    prev.isReplyingToRoot === next.isReplyingToRoot &&
    prev.replyText === next.replyText &&
    prev.loading === next.loading &&
    prev.isLoadingReplies === next.isLoadingReplies &&
    prev.hasMoreReplies === next.hasMoreReplies
  );
});

CommentThread.displayName = 'CommentThread';
export default CommentThread;
