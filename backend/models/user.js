const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      hooks: {
        async beforeCreate(user) {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },

        async beforeUpdate(user) {
          if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    },
  );

  User.prototype.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};