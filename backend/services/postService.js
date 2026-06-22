const { Post, User, Comment, Sequelize, sequelize } = require("../models");
const { Op } = require("sequelize");
const AppError = require("../utils/AppError");

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
          { '$author.username$': { [Op.iLike]: `%${search}%` } },
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
        as: "author",
        attributes: ["id", "username"],
      },
    ],
    subQuery: false,
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
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "username"],
      },
    ],
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
    throw new AppError("Post not found", 404);
  }

  if (post.userId !== userId) {
    throw new AppError("Unauthorized", 403);
  }

  if (data.title !== undefined) post.title = data.title;
  if (data.content !== undefined) post.content = data.content;

  await post.save();

  return post;
};

const removePost = async (postId, userId) => {
  const post = await Post.findByPk(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  if (post.userId !== userId) {
    throw new AppError("Unauthorized", 403);
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
        as: "author",
        attributes: ["id", "username"],
      },
    ],
  });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  // Fetch root comments sorted DESC (newest first)
  const rootComments = await Comment.findAll({
    where: {
      postId,
      parentCommentId: null,
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

  let commentsData = [];

  if (rootComments.length > 0) {
    const rootCommentIds = rootComments.map((c) => c.id);

    // Fetch only the first 3 replies (oldest first) per root comment using a Window Function (ROW_NUMBER) to avoid N+1 queries.
    const replies = await sequelize.query(
      `
      SELECT 
        c.id, 
        c.text, 
        c."parentCommentId", 
        c."createdAt", 
        c."postId",
        u.id as "author.id", 
        u.username as "author.username"
      FROM (
        SELECT *, ROW_NUMBER() OVER(PARTITION BY "parentCommentId" ORDER BY "createdAt" ASC) as rn
        FROM "Comments"
        WHERE "parentCommentId" IN (:rootCommentIds)
      ) c
      JOIN "Users" u ON c."userId" = u.id
      WHERE c.rn <= 3
      ORDER BY c."parentCommentId" ASC, c."createdAt" ASC
      `,
      {
        replacements: { rootCommentIds },
        type: Sequelize.QueryTypes.SELECT,
        nest: true,
      }
    );

    // Map replies to their parent comments
    const repliesMap = {};
    for (const reply of replies) {
      if (!repliesMap[reply.parentCommentId]) {
        repliesMap[reply.parentCommentId] = [];
      }
      repliesMap[reply.parentCommentId].push(reply);
    }

    commentsData = rootComments.map((comment) => {
      const plainComment = comment.get({ plain: true });
      plainComment.replies = repliesMap[comment.id] || [];
      return plainComment;
    });
  }

  const postData = post.get({ plain: true });
  postData.Comments = commentsData;

  return postData;
};

module.exports = {
  createPost,
  getAllPosts,
  getUserPosts,
  updatePost,
  removePost,
  getPostById,
};
