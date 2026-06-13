module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    text: {
      type: DataTypes.TEXT,
      allowNull: false,

      validate: {
        notNull: {
          msg: "Comment text is required",
        },
        
        notEmpty: {
          msg: "Comment text cannot be empty",
        },
        len: {
          args: [1, 1000],
          msg: "Comment text must be between 1 and 1000 characters",
        },
      },
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    parentCommentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  return Comment;
};