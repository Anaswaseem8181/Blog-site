const { Post, User, Comment, Tag, Like, Sequelize, sequelize } = require("../models");
const { Op } = require("sequelize");
const AppError = require("../utils/AppError");

const createPost = async ({ title, content, coverImage, status, tags, userId }) => {
  const transaction = await sequelize.transaction();
  try {
    const post = await Post.create({
      title,
      content,
      coverImage,
      status: status || 'published',
      userId,
    }, { transaction });

    if (tags && tags.length > 0) {
      const tagInstances = await Promise.all(
        tags.map(tagName => Tag.findOrCreate({
          where: { name: tagName.toLowerCase().trim() },
          transaction
        }))
      );
      await post.setTags(tagInstances.map(t => t[0]), { transaction });
    }

    await transaction.commit();
    return post;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getAllPosts = async ({ search, tag, page = 1, limit = 9, requestUserId = null }) => {
  const offset = (page - 1) * limit;

  // 1. If tag is provided, find matching post IDs first to avoid Sequelize subQuery bugs
  let tagPostIds = null;
  if (tag) {
    const tagObj = await Tag.findOne({ where: { name: tag.toLowerCase() } });
    if (!tagObj) {
      return { posts: [], hasMore: false };
    }
    const postsWithTag = await Post.findAll({
      attributes: ['id'],
      include: [{
        model: Tag,
        as: 'tags',
        attributes: [],
        where: { id: tagObj.id }
      }]
    });
    tagPostIds = postsWithTag.map(p => p.id);
    if (tagPostIds.length === 0) {
      return { posts: [], hasMore: false };
    }
  }

  // 2. Build the main where clause
  const searchFilter = { status: 'published' };
  
  if (tagPostIds) {
    searchFilter.id = { [Op.in]: tagPostIds };
  }

  if (search) {
    searchFilter[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { content: { [Op.iLike]: `%${search}%` } },
      { '$author.username$': { [Op.iLike]: `%${search}%` } },
    ];
  }

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
        [
          Sequelize.literal(`(
            SELECT COUNT(*)::int
            FROM "Likes"
            WHERE "Likes"."postId" = "Post"."id"
          )`),
          "likesCount",
        ],
        [
          Sequelize.literal(`(
            SELECT EXISTS(
              SELECT 1 FROM "Likes"
              WHERE "Likes"."postId" = "Post"."id"
              AND "Likes"."userId" = ${requestUserId || 0}
            )::boolean
          )`),
          "isLiked",
        ],
      ],
    },
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "username", "avatarUrl"],
      },
      {
        model: Tag,
        as: "tags",
        attributes: ["id", "name"],
        through: { attributes: [] }
      }
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
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "username", "avatarUrl"],
      },
      {
        model: Tag,
        as: "tags",
        attributes: ["id", "name"],
        through: { attributes: [] },
      }
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
        [
          Sequelize.literal(`(
            SELECT COUNT(*)::int
            FROM "Likes"
            WHERE "Likes"."postId" = "Post"."id"
          )`),
          "likesCount",
        ],
        [
          Sequelize.literal(`(
            SELECT EXISTS(
              SELECT 1 FROM "Likes"
              WHERE "Likes"."postId" = "Post"."id"
              AND "Likes"."userId" = ${userId || 0}
            )::boolean
          )`),
          "isLiked",
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

  const transaction = await sequelize.transaction();
  try {
    if (data.title !== undefined) post.title = data.title;
    if (data.content !== undefined) post.content = data.content;
    if (data.coverImage !== undefined) post.coverImage = data.coverImage;
    if (data.status !== undefined) post.status = data.status;

    await post.save({ transaction });

    if (data.tags !== undefined) {
      if (data.tags.length > 0) {
        const tagInstances = await Promise.all(
          data.tags.map(tagName => Tag.findOrCreate({
            where: { name: tagName.toLowerCase().trim() },
            transaction
          }))
        );
        await post.setTags(tagInstances.map(t => t[0]), { transaction });
      } else {
        await post.setTags([], { transaction });
      }
    }

    await transaction.commit();
    return post;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
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

const getPostById = async (postId, requestUserId = null) => {
  const userIdForQuery = requestUserId || 0;

  const post = await Post.findByPk(postId, {
    attributes: {
      include: [
        [
          Sequelize.literal(`(
            SELECT COUNT(*)::int FROM "Likes"
            WHERE "Likes"."postId" = "Post"."id"
          )`),
          "likesCount",
        ],
        [
          Sequelize.literal(`(
            SELECT EXISTS(
              SELECT 1 FROM "Likes"
              WHERE "Likes"."postId" = "Post"."id"
              AND "Likes"."userId" = ${userIdForQuery}
            )::boolean
          )`),
          "isLiked",
        ],
      ],
    },
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "username", "avatarUrl"],
      },
      {
        model: Tag,
        as: "tags",
        attributes: ["id", "name"],
        through: { attributes: [] },
      }
    ],
  });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  // Fetch root comments with their likes count and isLiked status
  const rootComments = await Comment.findAll({
    where: {
      postId,
      parentCommentId: null,
    },
    attributes: {
      include: [
        [
          Sequelize.literal(`(
            SELECT COUNT(*)::int FROM "Likes"
            WHERE "Likes"."commentId" = "Comment"."id"
          )`),
          "likesCount",
        ],
        [
          Sequelize.literal(`(
            SELECT EXISTS(
              SELECT 1 FROM "Likes"
              WHERE "Likes"."commentId" = "Comment"."id"
              AND "Likes"."userId" = ${userIdForQuery}
            )::boolean
          )`),
          "isLiked",
        ],
      ],
    },
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "username", "avatarUrl"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  let commentsData = [];

  if (rootComments.length > 0) {
    const rootCommentIds = rootComments.map((c) => c.id);

    // Fetch the first 3 replies per root comment using ROW_NUMBER window function (avoids N+1)
    const replies = await sequelize.query(
      `
      SELECT 
        c.id, 
        c.text, 
        c."parentCommentId", 
        c."createdAt", 
        c."postId",
        (SELECT COUNT(*)::int FROM "Likes" WHERE "Likes"."commentId" = c.id) as "likesCount",
        (SELECT EXISTS(SELECT 1 FROM "Likes" WHERE "Likes"."commentId" = c.id AND "Likes"."userId" = :requestUserId)::boolean) as "isLiked",
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
        replacements: { rootCommentIds, requestUserId: userIdForQuery },
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
