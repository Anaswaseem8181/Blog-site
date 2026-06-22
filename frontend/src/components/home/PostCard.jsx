import { useNavigate } from 'react-router-dom';
import { Calendar, MessageSquare, User, Heart } from 'lucide-react';
import useLike from '../../hooks/useLike';

export default function PostCard({ post, currentUser }) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Backend directly provides commentsCount via COUNT aggregation
  const commentsCount = Number(post.commentsCount || 0);

  const { isLiked, count: likesCount, toggle: toggleLike } = useLike({
    type: 'post',
    targetId: post.id,
    initialIsLiked: post.isLiked,
    initialCount: post.likesCount,
    isAuthenticated: !!currentUser,
  });

  const stripHtml = (html) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  return (
    <article
      onClick={() => navigate(`/posts/${post.id}`)}
      className="group flex flex-col justify-between bg-white border border-slate-200/60 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md hover:border-slate-300"
    >
      {post.coverImage && (
        <div className="w-full h-48 bg-slate-100 overflow-hidden relative border-b border-slate-100">
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 font-medium tracking-wide">
            <div 
              className="flex items-center gap-1 hover:text-slate-700 hover:underline cursor-pointer transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                if (post.author?.username) {
                  navigate(`/profile/${post.author.username}`);
                }
              }}
            >
              <User className="h-3.5 w-3.5" />
              <span>@{post.author?.username || 'anonymous'}</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-slate-700 transition-colors">
            {post.title}
          </h3>

          <p className="text-sm text-slate-600 line-clamp-4 mb-4 leading-relaxed">
            {stripHtml(post.content)}
          </p>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {post.tags.slice(0, 3).map(tag => (
                <span key={tag.id} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-blue-50 text-blue-600">
                  {tag.name}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-slate-50 text-slate-500">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
        <span className="text-sm font-medium text-slate-500 group-hover:text-slate-800 transition-colors">
          Read full post →
        </span>
        
        <div className="flex items-center gap-3">
          {/* Like button */}
          <button
            onClick={toggleLike}
            title={currentUser ? (isLiked ? 'Unlike' : 'Like') : 'Login to like'}
            className={`flex items-center gap-1 text-sm transition-colors ${
              isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'
            }`}
          >
            <Heart className={`h-4 w-4 transition-all duration-150 ${isLiked ? 'fill-red-500 scale-110' : ''}`} />
            <span>{likesCount}</span>
          </button>

          {/* Comments count */}
          <div className="flex items-center gap-1 text-sm text-slate-400">
            <MessageSquare className="h-4 w-4" />
            <span>{commentsCount}</span>
          </div>
        </div>
      </div>
      </div>
    </article>
  );
}
