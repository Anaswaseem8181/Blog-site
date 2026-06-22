import { memo } from 'react';
import { Trash2 } from 'lucide-react';
import { timeAgo } from '../../../utils/commentUtils';

/**
 * Action toolbar shown below every comment/reply row.
 * Responsibilities: display time, Reply button, Delete button.
 * All click handlers are injected — zero business logic here.
 */
const CommentActions = memo(({
  createdAt,
  showReply,
  showDelete,
  onReply,
  onDelete,
  loading,
  replyAriaExpanded,
  replyAriaControls,
}) => (
  <div
    className="flex items-center gap-4 mt-1.5"
    role="toolbar"
    aria-label="Comment actions"
  >
    <time dateTime={createdAt} className="text-xs text-slate-400">
      {timeAgo(createdAt)}
    </time>

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
));

CommentActions.displayName = 'CommentActions';
export default CommentActions;
