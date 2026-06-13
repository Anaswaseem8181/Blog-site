const commentService = require("../services/commentService");

exports.addComment = async (req, res) => {
  try {
    const comment = await commentService.createComment({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json(comment);
  } catch (error) {
    if (error.message === "Parent comment not found") {
      return res.status(404).json({
        message: error.message,
      });
    }

    res.status(500).json({
      error: error.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const result = await commentService.removeComment(
      req.params.id,
      req.user.id
    );

    res.json(result);
  } catch (error) {
    if (error.message === "Comment not found") {
      return res.status(404).json({
        message: error.message,
      });
    }

    if (error.message === "Unauthorized") {
      return res.status(403).json({
        message: error.message,
      });
    }

    res.status(500).json({
      error: error.message,
    });
  }
};