const { Post, Comment, User } = require("../models");
const AppError = require("../utils/AppError");

const createComment = async ({ text, postId, parentCommentId, userId }) => {
  const post = await Post.findByPk(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  let resolvedParentId = null;

  if (parentCommentId) {
    const parent = await Comment.findByPk(parentCommentId);

    if (!parent) {
      throw new AppError("Parent comment not found", 404);
    }

    if (parent.postId !== postId) {
      throw new AppError("Parent comment belongs to another post", 400);
    }

    // Force 2-level nesting: if parent is already a reply, use its parentCommentId.
    // Otherwise, use parent's own ID as it is a root comment.
    resolvedParentId = parent.parentCommentId || parent.id;
  }

  const comment = await Comment.create({
    text,
    postId,
    userId,
    parentCommentId: resolvedParentId,
  });

  return comment;
};

const getRepliesForComment = async (parentCommentId, { page = 1, limit = 10, offset }) => {
  const calculatedOffset = offset !== undefined ? offset : (page - 1) * limit;

  const replies = await Comment.findAll({
    where: {
      parentCommentId,
    },
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "username", "avatarUrl"],
      },
    ],
    limit: limit + 1,
    offset: calculatedOffset,
    order: [["createdAt", "ASC"]],
  });

  const hasMore = replies.length > limit;
  if (hasMore) {
    replies.pop();
  }

  return { replies, hasMore };
};

const removeComment = async (commentId, userId) => {
  const comment = await Comment.findByPk(commentId);

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  if (comment.userId !== userId) {
    throw new AppError("Unauthorized", 403);
  }

  await comment.destroy();

  return {
    message: "Comment deleted successfully",
  };
};

module.exports = {
  createComment,
  getRepliesForComment,
  removeComment,
};
