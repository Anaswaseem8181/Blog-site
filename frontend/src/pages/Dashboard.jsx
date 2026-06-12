import { useEffect, useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit3, Trash2, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import Container from '../components/Container';
import useAsync from '../hooks/useAsync';

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [success, setSuccess] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });

  const { loading: fetchLoading, error: fetchError, execute: executeFetch } = useAsync();
  const { loading: formLoading, error: formError, setError: setFormError, execute: executeForm } = useAsync();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchMyPosts();
  }, [user]);

  const fetchMyPosts = async (pageNum = 1, append = false) => {
    const { data } = await executeFetch(() => API.get('/posts/my-posts', { params: { page: pageNum, limit: 9 } }));
    if (data) {
      setHasMore(data.hasMore);
      if (append) {
        setPosts(prev => [...prev, ...data.posts]);
      } else {
        setPosts(data.posts);
      }
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMyPosts(nextPage, true);
  };

  const handleEditClick = (post) => {
    setIsEditing(true);
    setEditPostId(post.id);
    setFormData({ title: post.title, content: post.content });
    setSuccess('');
    setFormError('');
  };

  const handleCreateClick = () => {
    setIsEditing(true);
    setEditPostId(null);
    setFormData({ title: '', content: '' });
    setSuccess('');
    setFormError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditPostId(null);
    setFormData({ title: '', content: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
    setSuccess('');

    const action = editPostId
      ? () => API.put(`/posts/${editPostId}`, formData)
      : () => API.post('/posts', formData);

    const { error } = await executeForm(action);
    
    if (!error) {
      setSuccess(editPostId ? 'Article updated successfully.' : 'Article published successfully.');
      setIsEditing(false);
      setFormData({ title: '', content: '' });
      fetchMyPosts();
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    const { error } = await executeForm(() => API.delete(`/posts/${postId}`));
    if (!error) {
      setSuccess('Article deleted.');
      fetchMyPosts();
    }
  };

  return (
    <Container className="max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 font-light mt-1">Manage and publish your stories.</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleCreateClick}
            className="bg-slate-900 hover:bg-slate-800 text-white py-2 px-4 rounded-xl font-medium shadow-sm flex items-center gap-2 transition-colors"
          >
            <PlusCircle className="h-4 w-4" /> New Article
          </button>
        )}
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl p-4 flex items-center gap-2 mb-8 text-sm">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {(fetchError || formError) && (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 flex items-center gap-2 mb-8 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{fetchError || formError}</span>
        </div>
      )}

      {isEditing ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-medium text-slate-900 mb-6">
            {editPostId ? 'Edit Article' : 'Write Article'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
              <input
                type="text"
                required
                placeholder="Give your article a clear title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
              <textarea
                rows="14"
                required
                placeholder="Write your story here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all resize-none leading-relaxed"
              ></textarea>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl py-2 px-5 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2 px-6 font-medium shadow-sm transition-colors flex items-center justify-center min-w-[100px]"
              >
                {formLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  editPostId ? 'Update' : 'Publish'
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {fetchLoading && posts.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">Loading articles...</div>
          ) : posts.length > 0 ? (
            <>
              <div className="divide-y divide-slate-100">
                {posts.map((post) => (
                  <div key={post.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex-1 cursor-pointer" onClick={() => navigate(`/posts/${post.id}`)}>
                      <h3 className="text-lg font-medium text-slate-900 hover:text-slate-600 transition-colors line-clamp-1 mb-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Published on {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0">
                      <button
                        onClick={() => handleEditClick(post)}
                        className="text-slate-400 hover:text-slate-800 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Article"
                      >
                        <Edit3 className="h-4.5 w-4.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={formLoading}
                        className="text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete Article"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {hasMore && (
                <div className="p-6 text-center border-t border-slate-100 bg-slate-50/30">
                  <button
                    onClick={loadMore}
                    disabled={fetchLoading}
                    className="px-5 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-full hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {fetchLoading ? 'Loading...' : 'Load More Articles'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 px-6">
              <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-800 mb-1">No articles published</h3>
              <p className="text-slate-500 text-sm">Create your first blog post and share your knowledge.</p>
            </div>
          )}
        </div>
      )}
    </Container>
  );
}
