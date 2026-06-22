const asyncHandler = require("../middlewares/asyncHandler");
const AppError = require("../utils/AppError");

const commentService = require("../services/commentService");
const {
  createCommentSchema,
} = require("../validations/comment.validation");

exports.createComment =asyncHandler(async (req, res) => {
   const { error, value } = createCommentSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    throw new AppError(
      error.details.map((d) => d.message).join(", "),
      400
    );
  }

  const comment = await commentService.createComment({
    ...value,
    userId: req.user.id,
  });

  res.status(201).json({
    message: "Comment created successfully",
    comment,
  });
});

exports.deleteComment = asyncHandler(async (req, res) => {
  const result = await commentService.removeComment(
    req.params.id,
    req.user.id
  );

  res.json(result);
});

exports.getReplies = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = parseInt(req.query.offset, 10);

  const result = await commentService.getRepliesForComment(req.params.parentCommentId, {
    page,
    limit,
    offset: !isNaN(offset) ? offset : undefined,
  });

  res.json(result);
});