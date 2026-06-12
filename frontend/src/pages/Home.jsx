import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { Search, Layers } from 'lucide-react';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import Container from '../components/Container';
import useAsync from '../hooks/useAsync';
import useDebounce from '../hooks/useDebounce';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { loading, error, execute } = useAsync();

  // Wait 500ms after user stops typing before calling the API
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Re-fetch from backend whenever debounced search value changes
  useEffect(() => {
    setPage(1); // Reset page on new search
    fetchPosts(debouncedSearch, 1, false);
  }, [debouncedSearch]);

  const fetchPosts = async (search = '', pageNum = 1, append = false) => {
    const params = { params: { page: pageNum, limit: 9 } };
    if (search) params.params.search = search;
    
    const { data } = await execute(() => API.get('/posts', params));
    if (data) {
      setHasMore(data.hasMore);
      if (append) {
        setPosts(prev => [...prev, ...data.posts]);
      } else {
        setPosts(data.posts);
      }
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(debouncedSearch, nextPage, true);
  };

  return (
    <Container>
      <div className="mb-14 text-center sm:text-left mt-8">
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900 mb-4">
          Thoughts, stories and ideas.
        </h2>
        <p className="text-xl text-slate-500 max-w-2xl font-light leading-relaxed">
          A quiet space to explore developer insights, nesting conversations, and structured code architectures.
        </p>
      </div>

      <div className="relative mb-16 max-w-2xl">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search articles, topics, or authors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 shadow-sm transition-all"
        />
      </div>

      {error && (
        <div className="bg-white border border-red-200 text-red-600 rounded-xl p-4 mb-8 text-sm">
          {error}
        </div>
      )}

      {loading && posts.length === 0 ? (
        <Loader />
      ) : posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          {hasMore && (
            <div className="mt-12 text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-full hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-24 bg-white border border-slate-200 rounded-2xl">
          <Layers className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            {searchTerm ? `No results for "${searchTerm}"` : 'No articles found'}
          </h3>
          <p className="text-slate-500">
            {searchTerm ? 'Try a different keyword.' : 'Be the first to publish an article.'}
          </p>
        </div>
      )}
    </Container>
  );
}
