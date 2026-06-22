const asyncHandler = require("../middlewares/asyncHandler");
const userService = require("../services/userService");
const Joi = require("joi");
const AppError = require("../utils/AppError");

const updateProfileSchema = Joi.object({
  username: Joi.string().min(3).max(50).optional(),
  bio: Joi.string().allow("").max(500).optional(),
  avatarUrl: Joi.string().uri().allow(null, "").optional(),
});

exports.getProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await userService.getPublicProfile(username);
  res.status(200).json({ user });
});

exports.getUserPosts = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 9;

  const result = await userService.getUserPosts(username, page, limit);
  res.status(200).json(result);
});

exports.getUserComments = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const result = await userService.getUserComments(username, page, limit);
  res.status(200).json(result);
});

exports.updateMyProfile = asyncHandler(async (req, res) => {
  const { error, value } = updateProfileSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    throw new AppError(
      error.details.map((d) => d.message).join(", "),
      400
    );
  }

  const updatedUser = await userService.updateProfile(req.user.id, value);

  res.status(200).json({
    message: "Profile updated successfully",
    user: updatedUser,
  });
});
