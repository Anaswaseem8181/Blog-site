const router = require("express").Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  createComment,
  deleteComment,
  getReplies,
} = require("../controllers/commentController");

router.post("/", authMiddleware, createComment);

router.delete("/:id", authMiddleware, deleteComment);

router.get("/:parentCommentId/replies", getReplies);

module.exports = router;
