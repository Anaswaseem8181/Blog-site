import PostCard from './PostCard';

/**
 * Grid display of posts with load more button
 */
export default function HomePostsGrid({
  posts,
  hasMore,
  loading,
  onLoadMore,
}) {
  return (
    <>
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-full hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </>
  );
}
