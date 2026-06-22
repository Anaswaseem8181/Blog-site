const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary');

// Protected route for uploading images
router.post('/image', authMiddleware, upload.single('image'), uploadController.uploadImage);

module.exports = router;
