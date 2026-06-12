import { useNavigate } from 'react-router-dom';
import { Calendar, MessageSquare, User } from 'lucide-react';

export default function PostCard({ post }) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Backend directly provides commentsCount via COUNT(DISTINCT Comments.id) aggregation
  // We parse it to Number because Postgres COUNT often returns a string
  const commentsCount = Number(post.commentsCount || 0);

  return (
    <article
      onClick={() => navigate(`/posts/${post.id}`)}
      className="group flex flex-col justify-between bg-white border border-slate-200/60 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-md hover:border-slate-300"
    >
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 font-medium tracking-wide">
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            <span>@{post.User?.username || 'anonymous'}</span>
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

        <p className="text-sm text-slate-600 line-clamp-4 mb-6 leading-relaxed">
          {post.content}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
        <span className="text-sm font-medium text-slate-500 group-hover:text-slate-800 transition-colors">
          Read full post →
        </span>
        
        <div className="flex items-center gap-1.5 text-sm text-slate-400">
          <MessageSquare className="h-4 w-4" />
          <span>{commentsCount}</span>
        </div>
      </div>
    </article>
  );
}
