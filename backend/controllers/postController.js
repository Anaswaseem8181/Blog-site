const postService = require("../services/postService");
const {
  createPostSchema,
} = require("../validations/post.validation");

exports.createPost = async (req, res) => {
  try {
    const { error, value } = createPostSchema.validate(
      req.body,
      {
        abortEarly: false,
        stripUnknown: true,
      }
    );

    if (error) {
      return res.status(400).json({
        errors: error.details.map(
          (detail) => detail.message
        ),
      });
    }

    const post = await postService.createPost({
      ...value,
      userId: req.user.id,
    });

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const result = await postService.getAllPosts({
      search: req.query.search,
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 9,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getMyPosts = async (req, res) => {
  try {
    const result = await postService.getUserPosts({
      userId: req.user.id,
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 9,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await postService.updatePost(
      req.params.id,
      req.user.id,
      req.body
    );

    res.json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    if (error.message === "Post not found") {
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

exports.deletePost = async (req, res) => {
  try {
    const result = await postService.removePost(
      req.params.id,
      req.user.id
    );

    res.json(result);
  } catch (error) {
    if (error.message === "Post not found") {
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

exports.getPostById = async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);

    res.json(post);
  } catch (error) {
    if (error.message === "Post not found") {
      return res.status(404).json({
        message: error.message,
      });
    }

    res.status(500).json({
      error: error.message,
    });
  }
};