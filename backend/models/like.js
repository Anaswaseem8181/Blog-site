'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      Like.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Like.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });
      Like.belongsTo(models.Comment, { foreignKey: 'commentId', as: 'comment' });
    }
  }

  Like.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Like',
    validate: {
      mutuallyExclusive() {
        const hasPost = this.postId !== null && this.postId !== undefined;
        const hasComment = this.commentId !== null && this.commentId !== undefined;
        
        if ((hasPost && hasComment) || (!hasPost && !hasComment)) {
          throw new Error('A like must belong to either a post or a comment, but not both.');
        }
      }
    }
  });

  return Like;
};
