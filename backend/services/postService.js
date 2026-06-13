const { Post, User, Comment, Sequelize } = require("../models");
const { Op } = require("sequelize");

const createPost = async ({ title, content, userId }) => {
  return await Post.create({
    title,
    content,
    userId,
  });
};

const getAllPosts = async ({ search, page = 1, limit = 9 }) => {
  const offset = (page - 1) * limit;

  const searchFilter = search
    ? {
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },
          { content: { [Op.iLike]: `%${search}%` } },
        ],
      }
    : {};

  const posts = await Post.findAll({
    where: searchFilter,
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

const getUserPosts = async ({ userId, page = 1, limit = 9 }) => {
  const offset = (page - 1) * limit;

  const posts = await Post.findAll({
    where: { userId },
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
    order: [["createdAt", "DESC"]],
  });

  const hasMore = posts.length > limit;

  if (hasMore) {
    posts.pop();
  }

  return { posts, hasMore };
};

const updatePost = async (postId, userId, data) => {
  const post = await Post.findByPk(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.userId !== userId) {
    throw new Error("Unauthorized");
  }

  post.title = data.title || post.title;
  post.content = data.content || post.content;

  await post.save();

  return post;
};

const removePost = async (postId, userId) => {
  const post = await Post.findByPk(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.userId !== userId) {
    throw new Error("Unauthorized");
  }

  await post.destroy();

  return {
    message: "Post deleted successfully",
  };
};

const getPostById = async (postId) => {
  const post = await Post.findByPk(postId, {
    include: [
      {
        model: User,
        attributes: ["id", "username"],
      },
      {
        model: Comment,
        where: {
          parentCommentId: null,
        },
        required: false,
        include: [
          {
            model: User,
            attributes: ["id", "username"],
          },
          {
            model: Comment,
            as: "replies",
            include: [
              {
                model: User,
                attributes: ["id", "username"],
              },
              {
                model: Comment,
                as: "replies",
                include: [
                  {
                    model: User,
                    attributes: ["id", "username"],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });

  if (!post) {
    throw new Error("Post not found");
  }

  return post;
};

module.exports = {
  createPost,
  getAllPosts,
  getUserPosts,
  updatePost,
  removePost,
  getPostById,
};