const { Like, Post, Comment } = require('../models');
const AppError = require('../utils/AppError');

const togglePostLike = async (postId, userId) => {
  const post = await Post.findByPk(postId);
  if (!post) throw new AppError('Post not found', 404);

  const existingLike = await Like.findOne({ where: { postId, userId } });

  if (existingLike) {
    await existingLike.destroy();
    return { isLiked: false };
  } else {
    await Like.create({ postId, userId });
    return { isLiked: true };
  }
};

const toggleCommentLike = async (commentId, userId) => {
  const comment = await Comment.findByPk(commentId);
  if (!comment) throw new AppError('Comment not found', 404);

  const existingLike = await Like.findOne({ where: { commentId, userId } });

  if (existingLike) {
    await existingLike.destroy();
    return { isLiked: false };
  } else {
    await Like.create({ commentId, userId });
    return { isLiked: true };
  }
};

module.exports = {
  togglePostLike,
  toggleCommentLike
};
