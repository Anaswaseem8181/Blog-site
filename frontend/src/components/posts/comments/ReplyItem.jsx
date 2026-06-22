import { memo } from 'react';
import Avatar from './Avatar';
import CommentText from './CommentText';
import CommentActions from './CommentActions';

/**
 * A single level-2 reply row.
 * Pure display — receives all data and handlers as props.
 */
const ReplyItem = memo(({ reply, user, loading, onReply, onDelete }) => {
  const username = reply.author?.username ?? 'anonymous';
  const isOwner = user && reply.author?.id === user.id;

  return (
    <li className="flex gap-2.5">
      <Avatar username={username} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="mb-0.5">
          <span className="text-sm font-semibold text-slate-900 mr-1.5">{username}</span>
          <CommentText text={reply.text} />
        </div>
        <CommentActions
          createdAt={reply.createdAt}
          showReply={!!user}
          showDelete={isOwner}
          onReply={() => onReply(username)}
          onDelete={() => onDelete(reply.id)}
          loading={loading}
        />
      </div>
    </li>
  );
});

ReplyItem.displayName = 'ReplyItem';
export default ReplyItem;
