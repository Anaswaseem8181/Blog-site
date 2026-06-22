const asyncHandler = require("../middlewares/asyncHandler");
const AppError = require("../utils/AppError");

const postService = require("../services/postService");
const {
  createPostSchema,
  updatePostSchema,
} = require("../validations/post.validation");

exports.createPost = asyncHandler(async (req, res) => {
  const { error, value } = createPostSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    throw new AppError(
      error.details.map((d) => d.message),
      400,
    );
  }

  const post = await postService.createPost({
    ...value,
    userId: req.user.id,
  });

  res.status(201).json({
    message: "Post created successfully",
    post,
  });
});

exports.getPosts = asyncHandler(async (req, res) => {
  const result = await postService.getAllPosts({
    search: req.query.search,
    tag: req.query.tag,
    page: Math.max(parseInt(req.query.page, 10) || 1, 1),
    limit: parseInt(req.query.limit, 10) || 9,
    requestUserId: req.user?.id || null,  // optional – public route uses optional auth
  });

  res.json(result);
});

exports.getMyPosts = asyncHandler(async (req, res) => {
  const result = await postService.getUserPosts({
    userId: req.user.id,
    page: Math.max(parseInt(req.query.page, 10) || 1, 1),
    limit: parseInt(req.query.limit, 10) || 9,
  });

  res.json(result);
});

exports.getPostById = asyncHandler(async (req, res) => {
  const post = await postService.getPostById(req.params.id, req.user?.id || null);
  res.json(post);
});

exports.updatePost = asyncHandler(async (req, res) => {
  const { error, value } = updatePostSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    throw new AppError(
      error.details.map((d) => d.message),
      400,
    );
  }

  const post = await postService.updatePost(req.params.id, req.user.id, value);

  res.json({
    message: "Post updated successfully",
    post,
  });
});

exports.deletePost = asyncHandler(async (req, res) => {
  const result = await postService.removePost(req.params.id, req.user.id);

  res.json(result);
});
