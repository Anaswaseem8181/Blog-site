const { Comment } = require("../models");

const createComment = async ({
  text,
  postId,
  parentCommentId,
  userId,
}) => {
  if (parentCommentId) {
    const parent = await Comment.findByPk(parentCommentId);

    if (!parent) {
      throw new Error("Parent comment not found");
    }
  }

  const comment = await Comment.create({
    text,
    postId,
    userId,
    parentCommentId: parentCommentId || null,
  });

  return comment;
};

const removeComment = async (commentId, userId) => {
  const comment = await Comment.findByPk(commentId);

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.userId !== userId) {
    throw new Error("Unauthorized");
  }

  await comment.destroy();

  return {
    message: "Comment deleted successfully",
  };
};

module.exports = {
  createComment,
  removeComment,
};