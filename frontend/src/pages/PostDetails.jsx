import { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Container from '../components/common/Container';
import Loader from '../components/common/Loader';
import PostDetailsHeader from '../components/posts/PostDetailsHeader';
import PostDetailsContent from '../components/posts/PostDetailsContent';
import CommentSection from '../components/posts/CommentSection';
import PostDetailsSkeleton from '../components/posts/PostDetailsSkeleton';
import usePostDetails from '../hooks/usePostDetails';
import usePostComments from '../hooks/usePostComments';

export default function PostDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const postDetails = usePostDetails(id);

  // Pass user so the hook can build optimistic nodes with author info
  const postComments = usePostComments(id, user, () => postDetails.fetchPostDetails());

  const handleAddComment = useCallback(async (e) => {
    e.preventDefault();
    await postComments.addRootComment(postComments.newCommentText);
  }, [postComments]);

  if (postDetails.fetchLoading) return <PostDetailsSkeleton />;

  if (postDetails.fetchError || !postDetails.post) {
    return (
      <Container className="text-center py-20">
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-8 mb-8 inline-block max-w-md">
          {postDetails.fetchError || 'Post not found'}
        </div>
        <br />
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to feed
        </button>
      </Container>
    );
  }

  const { post } = postDetails;

  return (
    <Container className="max-w-3xl pb-24">
      {/* Back */}
      <div className="mb-10">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Back to feed
        </button>
      </div>

      {/* Post Article */}
      <article className="bg-white border border-slate-200 rounded-3xl overflow-hidden mb-10 shadow-sm">
        {post.coverImage && (
          <div className="w-full h-64 sm:h-96 relative bg-slate-100">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-8 sm:p-12">
          <PostDetailsHeader post={post} currentUser={user} />
          <PostDetailsContent content={post.content} />
          
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-8 border-t border-slate-100">
              <h4 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer" onClick={() => navigate(`/?tag=${tag.name}`)}>
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Comments */}
      <CommentSection
        user={user}
        comments={post.Comments ?? []}
        totalComments={postDetails.totalComments}
        // Root input
        newCommentText={postComments.newCommentText}
        onCommentTextChange={postComments.setNewCommentText}
        onAddComment={handleAddComment}
        // Per-comment reply controls
        getReplyText={postComments.getReplyText}
        isReplying={postComments.isReplying}
        onToggleReplyForm={postComments.toggleReplyForm}
        onReplyTextChange={postComments.updateReplyText}
        onSubmitReply={postComments.addReply}
        onDeleteComment={postComments.deleteComment}
        // Lazy loading
        onLoadMoreReplies={postComments.loadMoreReplies}
        isLoadingReplies={postComments.isLoadingReplies}
        hasMoreReplies={postComments.hasMoreReplies}
        loading={postComments.actionLoading}
      />
    </Container>
  );
}
