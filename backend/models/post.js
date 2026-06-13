module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("Post", {
     title: {
      type: DataTypes.STRING,
      allowNull: false,

      validate: {
        notNull: {
          msg: "Title is required",
        },

        notEmpty: {
          msg: "Title cannot be empty",
        },

        len: {
          args: [3, 255],
          msg: "Title must be between 3 and 255 characters",
        },
      },
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,

      validate: {
        notNull: {
          msg: "Content is required",
        },

        notEmpty: {
          msg: "Content cannot be empty",
        },

        len: {
          args: [10, 50000],
          msg: "Content is too short",
        },
      },
    },

      userId: {
      type: DataTypes.INTEGER,
      allowNull: false,

      validate: {
        notNull: {
          msg: "User ID is required",
        },
      },
    },
  });

  return Post;
};