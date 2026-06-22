const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,

        validate: {
          notNull: {
            msg: "Username is required",
          },

          notEmpty: {
            msg: "Username cannot be empty",
          },

          len: {
            args: [3, 50],
            msg: "Username must be between 3 and 255 characters",
          },
        },
      },

      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: '',
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,

        validate: {
          notNull: {
            msg: "Email is required",
          },

          notEmpty: {
            msg: "Email cannot be empty",
          },

          isEmail: {
            msg: "Email is invalid",
          },
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,

        validate: {
          notNull: {
            msg: "Password is required",
          },

          notEmpty: {
            msg: "Password cannot be empty",
          },

          len: {
            args: [6, 255],
            msg: "Password must be at least 6 characters",
          },
        },
      },
    },
    {
      // password har query se hide ho jayega
      defaultScope: {
        attributes: {
          exclude: ["password"],
        },
      },

      // login ke liye password wapas lana ho to
      scopes: {
        withPassword: {
          attributes: { include: ["password"] },
        },
      },

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