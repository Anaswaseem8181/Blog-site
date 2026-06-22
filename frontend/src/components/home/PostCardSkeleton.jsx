import React from 'react';

export default function PostCardSkeleton() {
  return (
    <article className="group bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm flex flex-col h-full animate-pulse">
      {/* Header: Author & Date */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-slate-200" />
        <div className="flex flex-col gap-2">
          <div className="h-3 w-24 bg-slate-200 rounded" />
          <div className="h-2 w-16 bg-slate-100 rounded" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col sm:flex-row gap-6 mb-6 flex-grow">
        {/* Text Section */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="space-y-3 mb-4">
            <div className="h-6 w-3/4 bg-slate-200 rounded" />
            <div className="h-6 w-1/2 bg-slate-200 rounded" />
          </div>
          {/* Excerpt */}
          <div className="space-y-2 mb-4">
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-4 w-5/6 bg-slate-100 rounded" />
            <div className="h-4 w-4/6 bg-slate-100 rounded" />
          </div>
          {/* Tags */}
          <div className="flex gap-2">
            <div className="h-5 w-14 bg-slate-100 rounded" />
            <div className="h-5 w-16 bg-slate-100 rounded" />
            <div className="h-5 w-12 bg-slate-100 rounded" />
          </div>
        </div>

        {/* Optional Cover Image Skeleton */}
        <div className="hidden sm:block shrink-0">
          <div className="w-32 h-32 rounded-xl bg-slate-200" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
        <div className="h-4 w-24 bg-slate-200 rounded" />
        <div className="flex items-center gap-3">
          <div className="h-4 w-8 bg-slate-200 rounded" />
          <div className="h-4 w-8 bg-slate-200 rounded" />
        </div>
      </div>
    </article>
  );
}
