import { CheckCircle, AlertCircle } from 'lucide-react';
import EmojiPickerButton from '../common/EmojiPickerButton';

export default function DashboardForm({
  isEditing,
  editPostId,
  formData,
  onFieldChange,
  onSubmit,
  onCancel,
  loading,
  error,
  success,
}) {
  if (!isEditing) return null;

  return (
    <>
      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl p-4 flex items-center gap-2 mb-8 text-sm">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 flex items-center gap-2 mb-8 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-medium text-slate-900 mb-6">
          {editPostId ? 'Edit Article' : 'Write Article'}
        </h2>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
            <input
              type="text"
              required
              placeholder="Give your article a clear title"
              value={formData.title}
              onChange={(e) => onFieldChange('title', e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all font-medium"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">Content</label>
              <EmojiPickerButton 
                onEmojiSelect={(emoji) => onFieldChange('content', formData.content + emoji)} 
                positionClass="bottom-full mb-2 right-0"
              />
            </div>
            <textarea
              rows="14"
              required
              placeholder="Write your story here..."
              value={formData.content}
              onChange={(e) => onFieldChange('content', e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all resize-none leading-relaxed"
            ></textarea>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl py-2 px-5 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2 px-6 font-medium shadow-sm transition-colors flex items-center justify-center min-w-[100px] disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                editPostId ? 'Update' : 'Publish'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
