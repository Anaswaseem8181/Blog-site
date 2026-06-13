const authService = require("../services/authService");
const {
  registerSchema,
  loginSchema,
} = require("../validations/auth.validation");

exports.register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(
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

    const user = await authService.registerUser(value);

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(
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

    const result = await authService.loginUser(value);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.json({
    message: "Logout successful",
  });
};

exports.getMe = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);

    res.json({ user });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
