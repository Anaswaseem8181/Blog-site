import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '../components/common/Container';
import Loader from '../components/common/Loader';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileEditModal from '../components/profile/ProfileEditModal';
import HomePostsGrid from '../components/home/HomePostsGrid';
import useUserProfile from '../hooks/useUserProfile';
import { FileText, MessageSquare } from 'lucide-react';
// We don't have a comment card component yet, so we'll just display comments simply or build a small one inline
import { getAvatarStyle, getInitials } from '../utils/commentUtils';

export default function UserProfile({ user }) {
  const { username } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    profileData,
    posts,
    comments,
    hasMorePosts,
    hasMoreComments,
    loading,
    error,
    fetchProfile,
    fetchPosts,
    fetchComments,
    loadMorePosts,
    loadMoreComments,
    updateProfile
  } = useUserProfile();

  const isOwnProfile = user && user.username === username;

  useEffect(() => {
    fetchProfile(username);
    fetchPosts(username);
    fetchComments(username);
    // Reset tabs on username change
    setActiveTab('posts');
  }, [username, fetchProfile, fetchPosts, fetchComments]);

  const handleEditSave = async (data) => {
    const success = await updateProfile(data);
    if (success) {
      setIsEditModalOpen(false);
      // If username changed, navigate to new URL
      if (data.username !== username) {
        navigate(`/profile/${data.username}`, { replace: true });
        // update user object in global state ideally, but a hard reload is safer here if they changed their own name
        window.location.reload(); 
      } else {
        fetchProfile(username); // refresh bio
      }
    }
  };

  if (loading.profile && !profileData) {
    return <Loader fullScreen />;
  }

  if (error.profile || !profileData) {
    return (
      <Container>
        <div className="mt-16 text-center text-slate-500 py-16 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <p className="text-xl font-medium mb-2">User not found</p>
          <p className="text-sm">The profile you are looking for does not exist.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="max-w-4xl pt-8 pb-16">
      <ProfileHeader 
        profileData={profileData} 
        isOwnProfile={isOwnProfile} 
        onEditClick={() => setIsEditModalOpen(true)}
      />

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-8">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 pb-4 px-6 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'posts' 
              ? 'border-slate-900 text-slate-900' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          Posts ({profileData.postsCount || 0})
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={`flex items-center gap-2 pb-4 px-6 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'comments' 
              ? 'border-slate-900 text-slate-900' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Comments ({profileData.commentsCount || 0})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'posts' && (
        <div>
          {loading.posts && posts.length === 0 ? (
            <Loader />
          ) : posts.length > 0 ? (
            <HomePostsGrid
              posts={posts}
              hasMore={hasMorePosts}
              loading={loading.posts}
              onLoadMore={() => loadMorePosts(username)}
            />
          ) : (
            <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed">
              <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No posts published yet.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'comments' && (
        <div>
          {loading.comments && comments.length === 0 ? (
            <Loader />
          ) : comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/posts/${comment.postId}`)}>
                  <div className="flex items-start gap-4 mb-3">
                    <div className="flex-1">
                       <p className="text-sm text-slate-500 mb-2 font-medium">
                         Commented on: <span className="text-slate-900 hover:underline">{comment.post?.title || 'Unknown Post'}</span>
                       </p>
                       <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{comment.content}</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    {new Date(comment.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
              
              {hasMoreComments && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => loadMoreComments(username)}
                    disabled={loading.comments}
                    className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-full hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {loading.comments ? 'Loading...' : 'Load More Comments'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed">
              <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No comments made yet.</p>
            </div>
          )}
        </div>
      )}

      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={profileData}
        onSave={handleEditSave}
        loading={loading.update}
        error={error.update}
      />
    </Container>
  );
}
