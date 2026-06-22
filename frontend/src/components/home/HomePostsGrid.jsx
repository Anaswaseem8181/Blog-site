import { useEffect } from 'react';
import PostCard from './PostCard';
import PostCardSkeleton from './PostCardSkeleton';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

/**
 * Grid display of posts with automatic infinite scroll and skeleton loaders
 */
export default function HomePostsGrid({
  posts,
  hasMore,
  loading,
  onLoadMore,
  user,
  isInitialLoad = false,
}) {
  // Trigger 300px before reaching the bottom for a seamless experience
  const [bottomBoundaryRef, isIntersecting] = useIntersectionObserver({
    rootMargin: '300px',
  });

  useEffect(() => {
    if (isIntersecting && hasMore && !loading && !isInitialLoad) {
      onLoadMore();
    }
  }, [isIntersecting, hasMore, loading, isInitialLoad, onLoadMore]);

  // Initial full-page loading skeletons
  if (isInitialLoad) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        {Array.from({ length: 3 }).map((_, i) => (
          <PostCardSkeleton key={`initial-skeleton-${i}`} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} currentUser={user} />
        ))}
        
      {/* Loading more indicator skeletons at the bottom */}
        {loading && hasMore && (
          <>
            <PostCardSkeleton />
            <PostCardSkeleton />
          </>
        )}
      </div>

      {/* Invisible element to trigger intersection observer */}
      {hasMore && (
        <div ref={bottomBoundaryRef} className="h-10 w-full" aria-hidden="true" />
      )}

      {/* End of feed indicator */}
      {!hasMore && !isInitialLoad && posts.length > 0 && (
        <div className="mt-12 text-center text-sm font-medium text-slate-400">
          You've reached the end of the feed.
        </div>
      )}
    </>
  );
}
