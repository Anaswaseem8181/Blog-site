const { User } = require("../models");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const registerUser = async ({ username, email, password }) => {
  const existingUser = await User.findOne({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const user = await User.create({
  username,
  email,
  password,
});

  return user;
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateToken(
    {
      id: user.id,
      email: user.email,
    },
    "1d",
  );

  const refreshToken = generateToken(
    {
      id: user.id,
    },
    "30d",
  );

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: ["id", "username", "email", "createdAt"],
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
};
