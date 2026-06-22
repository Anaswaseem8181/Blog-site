import { Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { timeAgo } from '../../utils/commentUtils';

/**
 * Displays post header with title, author, and date.
 * Uses the shared timeAgo utility — no prop needed for formatting.
 */
export default function PostDetailsHeader({ post }) {
  const navigate = useNavigate();

  return (
    <div className="mb-10">
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-8 border-b border-slate-100 pb-6">
        <div 
          className="flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900 hover:underline cursor-pointer transition-colors"
          onClick={() => {
            if (post.author?.username) {
              navigate(`/profile/${post.author.username}`);
            }
          }}
        >
          <User className="h-4 w-4 text-slate-400" />
          <span>{post.author?.username || 'anonymous'}</span>
        </div>
        <span className="text-slate-300">•</span>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-slate-400" />
          <time dateTime={post.createdAt}>{timeAgo(post.createdAt)}</time>
        </div>
      </div>

      <h1 className="text-3xl sm:text-5xl font-semibold text-slate-900 mb-8 leading-tight tracking-tight">
        {post.title}
      </h1>
    </div>
  );
}
