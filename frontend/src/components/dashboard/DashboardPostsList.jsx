import { useNavigate } from "react-router-dom";
import { Edit3, Trash2 } from "lucide-react";

export default function DashboardPostsList({
  posts,
  loading,
  onEditClick,
  onDeleteClick,
  onLoadMore,
  hasMore,
  actionLoading,
}) {
  const navigate = useNavigate();

  if (loading && posts.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-12 text-center text-slate-400 text-sm">
        Loading articles...
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="divide-y divide-slate-100">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
          >
            <div
              className="flex-1 cursor-pointer"
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              <h3 className="text-lg font-medium text-slate-900 hover:text-slate-600 transition-colors line-clamp-1 mb-1 flex items-center gap-2">
                {post.title}
                {post.status === 'draft' && (
                  <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                    Draft
                  </span>
                )}
              </h3>
              <p className="text-sm text-slate-500 mb-2">
                Published on{" "}
                {new Date(post.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {post.tags.map(tag => (
                    <span key={tag.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0">
              <button
                onClick={() => onEditClick(post)}
                className="text-slate-400 hover:text-slate-800 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Edit Article"
              >
                <Edit3 className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => onDeleteClick(post.id)}
                disabled={actionLoading}
                className="text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Delete Article"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="p-6 text-center border-t border-slate-100 bg-slate-50/30">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-5 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-full hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More Articles"}
          </button>
        </div>
      )}
    </div>
  );
}
