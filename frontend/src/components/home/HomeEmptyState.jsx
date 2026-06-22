import { Layers } from 'lucide-react';

/**
 * Empty state for no posts found
 */
export default function HomeEmptyState({ searchTerm }) {
  return (
    <div className="text-center py-24 bg-white border border-slate-200 rounded-2xl">
      <Layers className="h-12 w-12 text-slate-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-slate-800 mb-2">
        {searchTerm ? `No results for "${searchTerm}"` : 'No articles found'}
      </h3>
      <p className="text-slate-500">
        {searchTerm ? 'Try a different keyword.' : 'Be the first to publish an article.'}
      </p>
    </div>
  );
}
