"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, {
        foreignKey: "userId",
      });

      Comment.belongsTo(models.Post, {
        foreignKey: "postId",
      });

      Comment.belongsTo(models.Comment, {
        foreignKey: "parentCommentId",
        as: "parentComment",
      });

      Comment.hasMany(models.Comment, {
        foreignKey: "parentCommentId",
        as: "replies",
      });
    }
  }

  Comment.init(
    {
      text: DataTypes.TEXT,
      userId: DataTypes.INTEGER,
      postId: DataTypes.INTEGER,
      parentCommentId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Comment",
    },
  );

  return Comment;
};
