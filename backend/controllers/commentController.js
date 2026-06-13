const commentService = require("../services/commentService");
const {
  createCommentSchema,
} = require("../validations/comment.validation");

exports.createComment = async (req, res) => {
  try {
    const { error, value } =
      createCommentSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

    if (error) {
      return res.status(400).json({
        errors: error.details.map(
          (detail) => detail.message
        ),
      });
    }

    const comment =
      await commentService.createComment({
        ...value,
        userId: req.user.id,
      });

    return res.status(201).json({
      message: "Comment created successfully",
      comment,
    });
  } catch (error) {
    return res.status(500).json({
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