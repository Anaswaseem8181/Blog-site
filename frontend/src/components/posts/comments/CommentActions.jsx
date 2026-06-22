import { memo } from 'react';
import { Trash2, Heart } from 'lucide-react';
import { timeAgo } from '../../../utils/commentUtils';
import useLike from '../../../hooks/useLike';

/**
 * Action toolbar shown below every comment/reply row.
 * Responsibilities: display time, Like button, Reply button, Delete button.
 * All click handlers are injected — zero business logic except useLike for optimistic UI.
 */
const CommentActions = memo(({
  commentId,
  createdAt,
  showReply,
  showDelete,
  onReply,
  onDelete,
  loading,
  replyAriaExpanded,
  replyAriaControls,
  initialIsLiked = false,
  initialLikesCount = 0,
  isAuthenticated = false,
}) => {
  const { isLiked, count, toggle } = useLike({
    type: 'comment',
    targetId: commentId,
    initialIsLiked,
    initialCount: initialLikesCount,
    isAuthenticated,
  });

  return (
    <div
      className="flex items-center gap-4 mt-1.5"
      role="toolbar"
      aria-label="Comment actions"
    >
      <time dateTime={createdAt} className="text-xs text-slate-400">
        {timeAgo(createdAt)}
      </time>

      {/* Like button */}
      <button
        onClick={toggle}
        title={isAuthenticated ? (isLiked ? 'Unlike' : 'Like') : 'Login to like'}
        className={`flex items-center gap-1 text-xs font-semibold transition-colors ${
          isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'
        }`}
      >
        <Heart className={`w-3 h-3 transition-all duration-150 ${isLiked ? 'fill-red-500 scale-110' : ''}`} />
        {count > 0 && <span>{count}</span>}
      </button>

      {showReply && (
        <button
          onClick={onReply}
          aria-expanded={replyAriaExpanded}
          aria-controls={replyAriaControls}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          Reply
        </button>
      )}

      {showDelete && (
        <button
          onClick={onDelete}
          disabled={loading}
          aria-label="Delete"
          className="text-xs text-slate-400 hover:text-red-500 transition-colors disabled:opacity-40 flex items-center"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
});

CommentActions.displayName = 'CommentActions';
export default CommentActions;
