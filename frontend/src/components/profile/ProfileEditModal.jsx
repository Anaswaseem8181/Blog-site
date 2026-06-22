import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function ProfileEditModal({ isOpen, onClose, initialData, onSave, loading, error }) {
  const [formData, setFormData] = useState({ username: '', bio: '' });

  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username || '',
        bio: initialData.bio || ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div 
        className="bg-white rounded-3xl w-full max-w-md shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 flex items-center gap-2 mb-6 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form id="profile-edit-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                required
                minLength={3}
                maxLength={50}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all font-medium"
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Must be unique. Alphanumeric characters only recommended.
              </p>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1.5">
                Bio
              </label>
              <textarea
                id="bio"
                rows="4"
                maxLength={500}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us a little bit about yourself..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all resize-none leading-relaxed"
              ></textarea>
              <div className="flex justify-end mt-1">
                <span className={`text-xs ${formData.bio.length > 480 ? 'text-amber-500 font-medium' : 'text-slate-400'}`}>
                  {formData.bio.length} / 500
                </span>
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="profile-edit-form"
            disabled={loading || !formData.username.trim()}
            className="px-6 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm hover:shadow disabled:opacity-50 flex items-center justify-center min-w-[100px]"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
