const { User, Post, Comment } = require("../models");
const { Op, Sequelize } = require("sequelize");
const AppError = require("../utils/AppError");

exports.getPublicProfile = async (username) => {
  const user = await User.findOne({
    where: { username },
    attributes: {
      include: [
        [
          Sequelize.literal(`(
            SELECT COUNT(*)::int
            FROM "Posts"
            WHERE "Posts"."userId" = "User"."id"
          )`),
          "postsCount",
        ],
        [
          Sequelize.literal(`(
            SELECT COUNT(*)::int
            FROM "Comments"
            WHERE "Comments"."userId" = "User"."id"
          )`),
          "commentsCount",
        ],
      ],
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

exports.updateProfile = async (userId, updateData) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Handle unique username validation
  if (updateData.username && updateData.username !== user.username) {
    const existingUser = await User.findOne({
      where: {
        username: updateData.username,
        id: { [Op.ne]: userId }
      }
    });
    
    if (existingUser) {
      throw new AppError("Username is already taken", 400);
    }
  }

  await user.update({
    username: updateData.username !== undefined ? updateData.username : user.username,
    bio: updateData.bio !== undefined ? updateData.bio : user.bio
  });

  return user;
};

exports.getUserPosts = async (username, page = 1, limit = 9) => {
  const offset = (page - 1) * limit;

  // First verify user exists
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const posts = await Post.findAll({
    where: { userId: user.id },
    limit: limit + 1,
    offset,
    attributes: {
      include: [
        [
          Sequelize.literal(`(
            SELECT COUNT(*)::int
            FROM "Comments"
            WHERE "Comments"."postId" = "Post"."id"
          )`),
          "commentsCount",
        ],
      ],
    },
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "username"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  const hasMore = posts.length > limit;
  if (hasMore) {
    posts.pop();
  }

  return { posts, hasMore };
};

exports.getUserComments = async (username, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const comments = await Comment.findAll({
    where: { userId: user.id },
    limit: limit + 1,
    offset,
    include: [
      {
        model: Post,
        as: "post",
        attributes: ["id", "title"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  const hasMore = comments.length > limit;
  if (hasMore) {
    comments.pop();
  }

  return { comments, hasMore };
};
