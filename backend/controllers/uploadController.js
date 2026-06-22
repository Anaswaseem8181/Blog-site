const catchAsync = require('../middlewares/asyncHandler');
const AppError = require('../utils/AppError');

// Handles image upload and returns Cloudinary URL
const uploadImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload an image', 400));
  }
  
  res.status(200).json({
    status: 'success',
    url: req.file.path,
  });
});

module.exports = {
  uploadImage,
};
