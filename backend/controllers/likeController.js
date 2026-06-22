const asyncHandler = require('../middlewares/asyncHandler');
const likeService = require('../services/likeService');

exports.togglePostLike = asyncHandler(async (req, res) => {
  const result = await likeService.togglePostLike(req.params.id, req.user.id);
  res.json({
    message: result.isLiked ? 'Post liked successfully' : 'Post unliked successfully',
    isLiked: result.isLiked
  });
});

exports.toggleCommentLike = asyncHandler(async (req, res) => {
  const result = await likeService.toggleCommentLike(req.params.id, req.user.id);
  res.json({
    message: result.isLiked ? 'Comment liked successfully' : 'Comment unliked successfully',
    isLiked: result.isLiked
  });
});
