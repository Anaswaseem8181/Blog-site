import { CalendarDays, Edit3, MessageSquare, FileText } from 'lucide-react';
import { getAvatarStyle, getInitials } from '../../utils/commentUtils';

export default function ProfileHeader({ profileData, isOwnProfile, onEditClick }) {
  if (!profileData) return null;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center shadow-sm relative overflow-hidden mb-8">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-slate-100 to-slate-50 border-b border-slate-100"></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Large Avatar */}
        <div
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl font-bold select-none border-4 border-white shadow-md mb-6"
          style={getAvatarStyle(profileData.username)}
        >
          {getInitials(profileData.username)}
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
          @{profileData.username}
        </h1>

        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-6">
          <CalendarDays className="w-4 h-4" />
          <span>Member since {formatDate(profileData.createdAt)}</span>
        </div>

        {profileData.bio && (
          <p className="text-slate-600 max-w-lg mx-auto text-center leading-relaxed mb-8">
            {profileData.bio}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
            <FileText className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-700">{profileData.postsCount || 0}</span>
            <span className="text-sm text-slate-500">Posts</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-700">{profileData.commentsCount || 0}</span>
            <span className="text-sm text-slate-500">Comments</span>
          </div>
        </div>

        {isOwnProfile && (
          <button
            onClick={onEditClick}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-full transition-all shadow-sm hover:shadow"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
