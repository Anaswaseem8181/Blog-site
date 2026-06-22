import { useState, useEffect, useRef } from 'react';
import { X, AlertCircle, Upload, Loader2 } from 'lucide-react';
import API from '../../api/api';
import Avatar from '../posts/comments/Avatar';

export default function ProfileEditModal({ isOpen, onClose, initialData, onSave, loading, error }) {
  const [formData, setFormData] = useState({ username: '', bio: '', avatarUrl: '' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username || '',
        bio: initialData.bio || '',
        avatarUrl: initialData.avatarUrl || ''
      });
      setUploadError(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setUploadError('Image must be less than 5MB');
      return;
    }

    setUploadError(null);
    setUploadingImage(true);

    try {
      const uploadData = new FormData();
      uploadData.append('image', file);
      
      const response = await API.post('/upload/image', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.url) {
        setFormData(prev => ({ ...prev, avatarUrl: response.data.url }));
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      setUploadError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

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
          {(error || uploadError) && (
            <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 flex items-center gap-2 mb-6 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error || uploadError}</span>
            </div>
          )}

          <div className="mb-6 flex flex-col items-center">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {formData.avatarUrl ? (
                <img 
                  src={formData.avatarUrl} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md">
                  {formData.username ? (
                    <Avatar username={formData.username} size="lg" />
                  ) : (
                    <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
                      <Upload className="w-8 h-8" />
                    </div>
                  )}
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {uploadingImage ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-white mb-1" />
                    <span className="text-white text-[10px] font-medium">Change</span>
                  </>
                )}
              </div>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
            
            <p className="text-xs text-slate-400 mt-3 text-center">
              Recommended: Square image, max 5MB.
            </p>
          </div>

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
            disabled={loading || uploadingImage}
            className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="profile-edit-form"
            disabled={loading || uploadingImage || !formData.username.trim()}
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
