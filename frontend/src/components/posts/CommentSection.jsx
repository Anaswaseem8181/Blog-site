import { MessageSquare } from 'lucide-react';
import CommentInput from './CommentInput';
import CommentThread from './CommentThread';

/**
 * CommentSection is a pure orchestrator.
 * All state and logic lives in usePostComments (hook).
 * This component only maps data → UI.
 */
export default function CommentSection({
  user,
  comments = [],
  totalComments,
  // Root comment input
  newCommentText,
  onCommentTextChange,
  onAddComment,
  // Per-comment reply controls (passed down from hook)
  getReplyText,
  isReplying,
  onToggleReplyForm,
  onReplyTextChange,
  onSubmitReply,
  onDeleteComment,
  // Lazy reply loading
  onLoadMoreReplies,
  isLoadingReplies,
  hasMoreReplies,
  loading,
}) {
  return (
    <section
      className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm"
      aria-label="Comments"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 pb-5 border-b border-slate-100">
        <MessageSquare className="h-5 w-5 text-slate-400" aria-hidden="true" />
        <h2 className="text-base font-semibold text-slate-800">
          {totalComments > 0 ? `${totalComments} Comments` : 'Comments'}
        </h2>
      </div>

      {/* Root comment input */}
      <CommentInput
        user={user}
        value={newCommentText}
        onChange={onCommentTextChange}
        onSubmit={onAddComment}
        loading={loading}
      />

      {/* Comment list */}
      {comments.length > 0 ? (
        <ul className="mt-4 space-y-6 divide-y divide-slate-100" aria-label="Comment list">
          {comments.map((comment) => (
            <li key={comment.id} className="pt-5 first:pt-0">
              <CommentThread
                comment={comment}
                user={user}
                loading={loading}
                onDelete={onDeleteComment}
                replyText={getReplyText(comment.id)}
                isReplyingToRoot={isReplying(comment.id)}
                onToggleRootReply={onToggleReplyForm}
                onRootReplyTextChange={onReplyTextChange}
                onSubmitReply={onSubmitReply}
                onLoadMoreReplies={onLoadMoreReplies}
                isLoadingReplies={isLoadingReplies(comment.id)}
                hasMoreReplies={hasMoreReplies(comment.id, comment.replies?.length ?? 0)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-sm text-slate-400 py-10">
          No comments yet — be the first to share your thoughts!
        </p>
      )}
    </section>
  );
}
