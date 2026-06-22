import { useEffect, useState } from 'react';
import Container from '../components/common/Container';
import Loader from '../components/common/Loader';
import HomeSearch from '../components/home/HomeSearch';
import HomePostsGrid from '../components/home/HomePostsGrid';
import HomeEmptyState from '../components/home/HomeEmptyState';
import useHomeSearch from '../hooks/useHomeSearch';
import useDebounce from '../hooks/useDebounce';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const homeSearch = useHomeSearch();
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Re-fetch posts when search term changes
  useEffect(() => {
    homeSearch.setPage(1);
    homeSearch.fetchPosts(debouncedSearch, 1, false);
  }, [debouncedSearch]);


  const handleLoadMore = () => {
    homeSearch.loadMore(homeSearch.page, debouncedSearch);
  };

  return (
    <Container>
      {/* Header */}
      <div className="mb-14 text-center sm:text-left mt-8">
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900 mb-4">
          Thoughts, stories and ideas.
        </h2>
        <p className="text-xl text-slate-500 max-w-2xl font-light leading-relaxed">
          A quiet space to explore developer insights, nesting conversations, and structured code architectures.
        </p>
      </div>

      {/* Search */}
      <HomeSearch value={searchTerm} onChange={setSearchTerm} />

      {/* Error Message */}
      {homeSearch.error && (
        <div className="bg-white border border-red-200 text-red-600 rounded-xl p-4 mb-8 text-sm">
          {homeSearch.error}
        </div>
      )}

      {/* Loading */}
      {homeSearch.loading && homeSearch.posts.length === 0 ? (
        <Loader />
      ) : homeSearch.posts.length > 0 ? (
        <HomePostsGrid
          posts={homeSearch.posts}
          hasMore={homeSearch.hasMore}
          loading={homeSearch.loading}
          onLoadMore={handleLoadMore}
        />
      ) : (
        <HomeEmptyState searchTerm={searchTerm} />
      )}
    </Container>
  );
}
