const asyncHandler = require("../middlewares/asyncHandler");
const AppError = require("../utils/AppError");

const authService = require("../services/authService");
const {
  registerSchema,
  loginSchema,
} = require("../validations/auth.validation");

exports.register = asyncHandler(async (req, res) => {
  const { error, value } = registerSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    throw new AppError(
      error.details.map((d) => d.message).join(", "),
      400
    );
  }

  const user = await authService.registerUser(value);

  res.status(201).json({
    message: "User registered successfully",
    user,
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { error, value } = loginSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    throw new AppError(
      error.details.map((d) => d.message).join(", "),
      400
    );
  }

 const result = await authService.loginUser(value);

res.cookie("token", result.accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
});

res.status(200).json({
  message: "Login successful",
  user: result.user,
});
});

exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    message: "Logout successful",
  });
});

exports.getMe = asyncHandler(async (req, res) => {
   const user = await authService.getUserById(req.user.id);

  res.json({ user });
});
