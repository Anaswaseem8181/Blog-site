const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { getProfile, getUserPosts, getUserComments, updateMyProfile } = require("../controllers/userController");

router.get("/:username", getProfile);
router.get("/:username/posts", getUserPosts);
router.get("/:username/comments", getUserComments);
router.put("/me", authMiddleware, updateMyProfile);

module.exports = router;
