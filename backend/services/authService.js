const { User } = require("../models");
const generateToken = require("../utils/generateToken");
const AppError = require("../utils/AppError");
const serializeUser = require("../utils/serializeUser");

const registerUser = async ({ username, email, password }) => {
  const existingUser = await User.findOne({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const user = await User.create({
  username,
  email,
  password,
});

  return serializeUser(user);
};

const loginUser = async ({ email, password }) => {
  const user = await User.scope("withPassword").findOne({
  where: { email },
});

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const accessToken = generateToken(
    {
      id: user.id,
      email: user.email,
    },
    "1d",
  );

  return {
    user: serializeUser(user),
    accessToken,
  };
};

const getUserById = async (id) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return serializeUser(user);
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
};
