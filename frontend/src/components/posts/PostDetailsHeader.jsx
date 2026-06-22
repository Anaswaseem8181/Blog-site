import { Calendar, User, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { timeAgo } from '../../utils/commentUtils';
import useLike from '../../hooks/useLike';

/**
 * Displays post header with title, author, date, and Like button.
 */
export default function PostDetailsHeader({ post, currentUser }) {
  const navigate = useNavigate();
  const { isLiked, count, toggle, isLoading } = useLike({
    type: 'post',
    targetId: post.id,
    initialIsLiked: post.isLiked,
    initialCount: post.likesCount,
    isAuthenticated: !!currentUser,
  });

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

        {/* Like button – pushed to the right */}
        <div className="ml-auto">
          <button
            onClick={toggle}
            disabled={isLoading}
            title={currentUser ? (isLiked ? 'Unlike' : 'Like this post') : 'Login to like'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              isLiked
                ? 'bg-red-50 text-red-500 hover:bg-red-100'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
            } disabled:opacity-60`}
          >
            <Heart className={`w-4 h-4 transition-all duration-200 ${isLiked ? 'fill-red-500 text-red-500 scale-110' : ''}`} />
            <span>{count}</span>
          </button>
        </div>
      </div>

      <h1 className="text-3xl sm:text-5xl font-semibold text-slate-900 mb-8 leading-tight tracking-tight">
        {post.title}
      </h1>
    </div>
  );
}
