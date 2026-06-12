const { Post, User, Comment, Sequelize } = require("../models");
const { Op } = require("sequelize");

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await Post.create({
      title,
      content,
      userId: req.user.id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const { search } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const offset = (page - 1) * limit;

    // Build search filter — applies only when ?search= query param is present
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
      limit: limit + 1, // Fetch limit + 1 to check if there are more posts
      offset,
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT COUNT(*)::int
              FROM "Comments"
              WHERE "Comments"."postId" = "Post"."id"
            )`),
            "commentsCount"
          ]
        ]
      },
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    const hasMore = posts.length > limit;
    if (hasMore) {
      posts.pop(); // Remove the extra post we fetched just for the hasMore check
    }

    res.json({ posts, hasMore });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getMyPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const offset = (page - 1) * limit;

    const posts = await Post.findAll({
      where: {
        userId: req.user.id,
      },
      limit: limit + 1, // Fetch limit + 1 to check if there are more posts
      offset,
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT COUNT(*)::int
              FROM "Comments"
              WHERE "Comments"."postId" = "Post"."id"
            )`),
            "commentsCount"
          ]
        ]
      },
      order: [["createdAt", "DESC"]]
    });

    const hasMore = posts.length > limit;
    if (hasMore) {
      posts.pop();
    }

    res.json({ posts, hasMore });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // sirf owner update kar sakta hai
    if (post.userId !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const { title, content } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;

    await post.save();

    res.json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // sirf owner delete kar sakta hai
    if (post.userId !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await post.destroy();

    res.json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id, {
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
                    }
                  ]
                }
              ],
            },
          ],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

