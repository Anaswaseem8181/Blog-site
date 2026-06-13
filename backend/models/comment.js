module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
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