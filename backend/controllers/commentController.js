const { Comment } = require("../models");

exports.addComment = async (req, res) => {
  try {
    const {
      text,
      postId,
      parentCommentId
    } = req.body;

    if (parentCommentId) {

      const parent = await Comment.findByPk(parentCommentId);

      if (!parent) {
        return res.status(404).json({
          message: 'Parent comment not found'
        });
      }
    }

    const comment = await Comment.create({
      text,
      postId,
      userId: req.user.id,
      parentCommentId: parentCommentId || null

    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });

  }

};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // sirf owner delete kar sakta hai
    if (comment.userId !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await comment.destroy();

    res.json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
