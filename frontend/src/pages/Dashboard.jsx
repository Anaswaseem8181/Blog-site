import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import Container from '../components/common/Container';

// Hooks
import useDashboardPosts from '../hooks/useDashboardPosts';
import useDashboardForm from '../hooks/useDashboardForm';

// Components
import DashboardForm from '../components/dashboard/DashboardForm';
import DashboardPostsList from '../components/dashboard/DashboardPostsList';
import DashboardEmptyState from '../components/dashboard/DashboardEmptyState';

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  // Custom hook for posts fetching and deletion
  const {
    posts,
    hasMore,
    fetchLoading,
    fetchError,
    actionLoading,
    fetchMyPosts,
    loadMore,
    deletePost
  } = useDashboardPosts();

  // Custom hook for form state and submission
  const {
    isEditing,
    editPostId,
    formData,
    updateField,
    success,
    formLoading,
    formError,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm
  } = useDashboardForm(fetchMyPosts); // Pass fetchMyPosts to refresh list on success

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchMyPosts();
  }, [user?.id, fetchMyPosts, navigate]);

  return (
    <Container className="max-w-4xl pb-24">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 font-light mt-1">Manage and publish your stories.</p>
        </div>
        {!isEditing && (
          <button
            onClick={openCreateForm}
            className="bg-slate-900 hover:bg-slate-800 text-white py-2 px-4 rounded-xl font-medium shadow-sm flex items-center gap-2 transition-colors"
          >
            <PlusCircle className="h-4 w-4" /> Write Article
          </button>
        )}
      </div>

      {/* Global Errors from fetching data */}
      {fetchError && (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 mb-8 text-sm">
          Failed to load posts: {fetchError}
        </div>
      )}

      {/* Form Section */}
      {isEditing ? (
        <DashboardForm 
          isEditing={isEditing}
          editPostId={editPostId}
          formData={formData}
          onFieldChange={updateField}
          onSubmit={submitForm}
          onCancel={closeForm}
          loading={formLoading}
          error={formError}
          success={success}
        />
      ) : (
        /* Posts List Section */
        <DashboardPostsList 
          posts={posts}
          loading={fetchLoading}
          actionLoading={actionLoading}
          onEditClick={openEditForm}
          onDeleteClick={deletePost}
          onLoadMore={loadMore}
          hasMore={hasMore}
        />
      )}

      {/* Empty State */}
      {!isEditing && !fetchLoading && posts.length === 0 && (
        <DashboardEmptyState />
      )}
    </Container>
  );
}
