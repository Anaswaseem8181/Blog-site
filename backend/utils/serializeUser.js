const serializeUser = (user) => {
  const data = user.toJSON ? user.toJSON() : user;

  return {
    id: data.id,
    username: data.username,
    email: data.email,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

module.exports = serializeUser;