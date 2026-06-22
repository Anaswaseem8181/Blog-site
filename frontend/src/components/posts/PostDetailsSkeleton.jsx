import React from 'react';
import Container from '../common/Container';

export default function PostDetailsSkeleton() {
  return (
    <Container className="py-8 sm:py-12 animate-pulse">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl sm:border border-slate-100 sm:shadow-sm overflow-hidden">
        {/* Cover Image Skeleton */}
        <div className="w-full h-64 sm:h-96 bg-slate-200" />

        <div className="p-8 sm:p-12">
          {/* Header Skeleton */}
          <div className="mb-10">
            {/* Meta row */}
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="ml-auto h-8 w-16 bg-slate-200 rounded-full" />
            </div>

            {/* Title */}
            <div className="space-y-4 mb-8">
              <div className="h-10 w-full bg-slate-200 rounded" />
              <div className="h-10 w-3/4 bg-slate-200 rounded" />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="space-y-6">
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-4 w-11/12 bg-slate-100 rounded" />
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-4 w-4/5 bg-slate-100 rounded" />
            
            <div className="h-32 w-full bg-slate-100 rounded my-8" />
            
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-4 w-5/6 bg-slate-100 rounded" />
          </div>

          {/* Tags Skeleton */}
          <div className="flex gap-2 mt-12 pt-8 border-t border-slate-100">
            <div className="h-8 w-20 bg-slate-200 rounded-full" />
            <div className="h-8 w-24 bg-slate-200 rounded-full" />
            <div className="h-8 w-16 bg-slate-200 rounded-full" />
          </div>
        </div>
      </div>
    </Container>
  );
}
