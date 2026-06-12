const router = require("express").Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  addComment,
  deleteComment,
} = require("../controllers/commentController");

router.post("/", authMiddleware, addComment);

router.delete("/:id", authMiddleware, deleteComment);

module.exports = router;
