import { FileText } from 'lucide-react';

export default function DashboardEmptyState() {
  return (
    <div className="text-center py-20 px-6">
      <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
      <h3 className="text-lg font-medium text-slate-800 mb-1">No articles published</h3>
      <p className="text-slate-500 text-sm">Create your first blog post and share your knowledge.</p>
    </div>
  );
}
