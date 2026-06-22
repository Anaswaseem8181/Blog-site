import { memo } from 'react';
import ReplyItem from './ReplyItem';

/**
 * Collapsed/expanded reply list with:
 * - View / Hide toggle button
 * - "Load more" pagination trigger
 *
 * Owns zero state — toggle + pagination state live in CommentThread.
 */
const ReplyList = memo(({
  commentId,
  username,
  replies,
  showReplies,
  onToggle,
  onLoadMore,
  isLoadingMore,
  hasMore,
  // passed through to ReplyItem
  user,
  loading,
  onReplyToReply,
  onDelete,
}) => {
  const count = replies.length;

  if (count === 0) return null;

  const toggleLabel = showReplies
    ? 'Hide replies'
    : `View ${count} repl${count === 1 ? 'y' : 'ies'}`;

  return (
    <div className="mt-1">
      {/* Toggle trigger */}
      <button
        onClick={onToggle}
        aria-expanded={showReplies}
        aria-controls={`replies-${commentId}`}
        className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors group"
      >
        <span className="w-6 h-px bg-slate-300 group-hover:bg-slate-500 transition-colors" aria-hidden="true" />
        {toggleLabel}
      </button>

      {/* Reply rows */}
      {showReplies && (
        <ul
          id={`replies-${commentId}`}
          className="mt-4 space-y-4"
          aria-label={`Replies to ${username}`}
        >
          {replies.map((reply) => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              user={user}
              loading={loading}
              onReply={onReplyToReply}
              onDelete={onDelete}
            />
          ))}

          {/* Load more */}
          {hasMore && (
            <li>
              <button
                onClick={onLoadMore}
                disabled={isLoadingMore}
                className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-50"
              >
                <span className="w-6 h-px bg-slate-300" aria-hidden="true" />
                {isLoadingMore ? 'Loading…' : 'Load more replies'}
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
});

ReplyList.displayName = 'ReplyList';
export default ReplyList;
