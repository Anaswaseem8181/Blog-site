import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';
import { ArrowLeft, Calendar, MessageSquare, Send, Reply, Trash2, User } from 'lucide-react';
import Container from '../components/Container';
import Loader from '../components/Loader';
import useAsync from '../hooks/useAsync';

export default function PostDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  
  const [newCommentText, setNewCommentText] = useState('');
  const [replyTexts, setReplyTexts] = useState({});
  const [activeReplyId, setActiveReplyId] = useState(null);

  const { loading: fetchLoading, error: fetchError, execute: executeFetch } = useAsync();
  const { loading: actionLoading, execute: executeAction } = useAsync();

  useEffect(() => {
    fetchPostDetails();
  }, [id]);

  const fetchPostDetails = async () => {
    const { data } = await executeFetch(() => API.get(`/posts/${id}`));
    if (data) {
      setPost(data);
    }
  };

  const handleAddRootComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const { error } = await executeAction(() => API.post('/comments', {
      text: newCommentText,
      postId: parseInt(id),
      parentCommentId: null
    }));

    if (!error) {
      setNewCommentText('');
      fetchPostDetails();
    } else {
      alert(error);
    }
  };

  const handleAddReply = async (parentCommentId) => {
    const text = replyTexts[parentCommentId];
    if (!text || !text.trim()) return;

    const { error } = await executeAction(() => API.post('/comments', {
      text: text,
      postId: parseInt(id),
      parentCommentId: parentCommentId
    }));

    if (!error) {
      setReplyTexts({ ...replyTexts, [parentCommentId]: '' });
      setActiveReplyId(null);
      fetchPostDetails();
    } else {
      alert(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    const { error } = await executeAction(() => API.delete(`/comments/${commentId}`));
    if (!error) {
      fetchPostDetails();
    } else {
      alert(error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (fetchLoading) {
    return <Loader fullScreen />;
  }

  if (fetchError || !post) {
    return (
      <Container className="text-center py-20">
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-8 mb-8 inline-block max-w-md">
          {fetchError || 'Post not found'}
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

  let totalComments = 0;
  if (post.Comments) {
    post.Comments.forEach(c => {
      totalComments++;
      if (c.replies) {
        totalComments += c.replies.length;
        c.replies.forEach(r => {
          if (r.replies) totalComments += r.replies.length;
        });
      }
    });
  }

  return (
    <Container className="max-w-3xl pb-24">
      <div className="mb-10">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Back to feed
        </button>
      </div>

      <article className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 mb-12 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-8 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <User className="h-4 w-4 text-slate-400" />
            <span>{post.User?.username || 'anonymous'}</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-semibold text-slate-900 mb-8 leading-tight tracking-tight">
          {post.title}
        </h1>

        <div className="text-slate-700 leading-loose text-lg space-y-6 whitespace-pre-wrap font-serif">
          {post.content}
        </div>
      </article>

      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-slate-400" />
            Discussion ({totalComments})
          </h2>
        </div>

        {user ? (
          <form onSubmit={handleAddRootComment} className="mb-12">
            <div className="relative">
              <textarea
                rows="3"
                placeholder="Share your thoughts on this article..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4 pl-5 pr-16 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all resize-none"
              ></textarea>
              <button
                type="submit"
                disabled={actionLoading || !newCommentText.trim()}
                className="absolute right-3 bottom-3.5 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-200 disabled:text-slate-400 text-white p-2.5 rounded-xl transition-colors"
              >
                {actionLoading && activeReplyId === null && !newCommentText.trim() === false ? (
                  <span className="w-4 h-4 block border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center text-slate-500 mb-12 text-sm">
            Please <button onClick={() => navigate('/auth')} className="text-slate-900 font-medium hover:underline decoration-slate-300 mx-1">Sign in</button> to participate.
          </div>
        )}

        <div className="space-y-6">
          {post.Comments && post.Comments.length > 0 ? (
            post.Comments.map((comment) => (
              <div key={comment.id} className="border-b border-slate-100 pb-6 last:border-b-0 last:pb-0">
                {renderCommentNode(comment, 1)}

                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-4 sm:ml-10 mt-5 space-y-5 border-l-2 border-slate-100 pl-4 sm:pl-6">
                    {comment.replies.map((reply) => (
                      <div key={reply.id}>
                        {renderCommentNode(reply, 2)}

                        {reply.replies && reply.replies.length > 0 && (
                          <div className="ml-4 sm:ml-8 mt-5 space-y-5 border-l-2 border-slate-100/50 pl-4 sm:pl-6">
                            {reply.replies.map((grandReply) => (
                              <div key={grandReply.id}>
                                {renderCommentNode(grandReply, 3)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-slate-400 text-center py-8">No comments yet. Start the conversation!</p>
          )}
        </div>
      </section>
    </Container>
  );

  function renderCommentNode(comment, level) {
    const isAuthorOfComment = user && comment.userId === user.id;
    const isReplying = activeReplyId === comment.id;

    return (
      <div className="group/node relative transition-colors duration-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-900">
              {comment.User?.username || 'anonymous'}
            </span>
            {level > 1 && (
              <span className="text-[10px] text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded-md font-medium">
                Level {level}
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400">
            {formatDate(comment.createdAt)}
          </span>
        </div>

        <p className="text-slate-700 text-sm leading-relaxed mb-3">
          {comment.text}
        </p>

        <div className="flex items-center gap-4">
          {user && level < 3 && (
            <button
              onClick={() => {
                setActiveReplyId(isReplying ? null : comment.id);
                setReplyTexts({ ...replyTexts, [comment.id]: '' });
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium"
            >
              <Reply className="h-3.5 w-3.5" />
              <span>Reply</span>
            </button>
          )}

          {isAuthorOfComment && (
            <button
              onClick={() => handleDeleteComment(comment.id)}
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-600 transition-colors opacity-0 group-hover/node:opacity-100 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>
          )}
        </div>

        {isReplying && (
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder={`Reply to ${comment.User?.username || 'user'}...`}
              value={replyTexts[comment.id] || ''}
              onChange={(e) => setReplyTexts({ ...replyTexts, [comment.id]: e.target.value })}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleAddReply(comment.id)}
                disabled={actionLoading}
                className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center min-w-[70px] disabled:bg-slate-200"
              >
                {actionLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Post'}
              </button>
              <button
                onClick={() => setActiveReplyId(null)}
                className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
