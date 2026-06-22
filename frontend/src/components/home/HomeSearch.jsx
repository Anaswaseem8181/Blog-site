import { Search } from 'lucide-react';

/**
 * Search input for home page
 */
export default function HomeSearch({ value, onChange }) {
  return (
    <div className="relative mb-16 max-w-2xl">
      <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
      <input
        type="text"
        placeholder="Search articles, topics, or authors..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 shadow-sm transition-all"
      />
    </div>
  );
}
