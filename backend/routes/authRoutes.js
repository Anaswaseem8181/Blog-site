const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { register, login, logout, getMe } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, getMe);

module.exports = router;
