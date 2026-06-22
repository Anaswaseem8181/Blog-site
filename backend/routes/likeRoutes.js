const express = require('express');
const { togglePostLike, toggleCommentLike } = require('../controllers/likeController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/posts/:id/like', protect, togglePostLike);
router.post('/comments/:id/like', protect, toggleCommentLike);

module.exports = router;
