import { CheckCircle, AlertCircle, Image as ImageIcon, X } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { useRef, useState } from 'react';
import API from '../../api/api';

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
  const fileInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');

  if (!isEditing) return null;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await API.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onFieldChange('coverImage', response.data.url);
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleStatusSubmit = (e, status) => {
    e.preventDefault();
    onFieldChange('status', status);
    // Use a small timeout to allow state to update before submitting, or pass status directly to onSubmit
    setTimeout(() => {
      onSubmit(e, status);
    }, 0);
  };

  return (
    <>
      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl p-4 flex items-center gap-2 mb-8 text-sm">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {(error || uploadError) && (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 flex items-center gap-2 mb-8 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error || uploadError}</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-medium text-slate-900 mb-6">
          {editPostId ? 'Edit Article' : 'Write Article'}
        </h2>

        <form onSubmit={(e) => onSubmit(e, formData.status || 'published')} className="space-y-6">
          
          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Cover Image (Optional)</label>
            {formData.coverImage ? (
              <div className="relative rounded-xl overflow-hidden group aspect-video sm:aspect-[21/9] bg-slate-100 border border-slate-200">
                <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => onFieldChange('coverImage', null)}
                  className="absolute top-3 right-3 p-1.5 bg-white/90 text-slate-700 hover:text-red-600 rounded-full shadow-sm backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl p-8 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-slate-100 flex flex-col items-center justify-center gap-2"
              >
                <ImageIcon className="w-8 h-8 text-slate-400" />
                <div className="text-sm font-medium text-slate-600">
                  {uploadingImage ? 'Uploading...' : 'Click to upload cover image'}
                </div>
                <div className="text-xs text-slate-400">JPG, PNG, WEBP up to 5MB</div>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {/* Title */}
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

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
            <div className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 focus-within:ring-2 focus-within:ring-slate-200 focus-within:border-slate-300 transition-all flex flex-wrap gap-2 items-center min-h-[50px]">
              {formData.tags?.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => {
                      const newTags = formData.tags.filter((_, i) => i !== index);
                      onFieldChange('tags', newTags);
                    }}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={formData.tags?.length ? "Add another tag..." : "e.g. javascript, react (Press Enter to add)"}
                className="flex-1 bg-transparent border-none focus:outline-none min-w-[150px] text-sm text-slate-900 placeholder-slate-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    const newTag = e.target.value.trim().toLowerCase();
                    if (newTag && !(formData.tags || []).includes(newTag)) {
                      onFieldChange('tags', [...(formData.tags || []), newTag]);
                    }
                    e.target.value = '';
                  }
                }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">Press Enter or comma to add a tag. Maximum 5 tags.</p>
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
            <RichTextEditor 
              content={formData.content} 
              onChange={(html) => onFieldChange('content', html)} 
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl py-2 px-5 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={loading || uploadingImage}
              onClick={(e) => handleStatusSubmit(e, 'draft')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-transparent rounded-xl py-2 px-5 font-medium transition-colors disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              onClick={(e) => handleStatusSubmit(e, 'published')}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2 px-6 font-medium shadow-sm transition-colors flex items-center justify-center min-w-[100px] disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                editPostId ? 'Update Post' : 'Publish Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
