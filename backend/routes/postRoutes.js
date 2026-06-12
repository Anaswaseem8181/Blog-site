const router = require("express").Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  createPost,
  getPosts,
  getMyPosts,
  updatePost,
  deletePost,
  getPostById,
} = require("../controllers/postController");

router.post("/", authMiddleware, createPost);

router.get("/", getPosts);

router.get("/my-posts", authMiddleware, getMyPosts);

router.get("/:id", getPostById);

router.put("/:id", authMiddleware, updatePost);

router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
