module.exports = (models) => {
  const { User, Post, Comment } = models;

  //  User ↔ Post
  User.hasMany(Post, {
    foreignKey: "userId",
    as: "posts",
  });

  Post.belongsTo(User, {
    foreignKey: "userId",
    as: "author",
  });

  //   User ↔ Comment

  User.hasMany(Comment, {
    foreignKey: "userId",
    as: "comments",
  });

  Comment.belongsTo(User, {
    foreignKey: "userId",
    as: "author",
  });


  //    | Post ↔ Comment

  Post.hasMany(Comment, {
    foreignKey: "postId",
    as: "comments",
  });

  Comment.belongsTo(Post, {
    foreignKey: "postId",
    as: "post",
  });


  //    | Comment ↔ Reply

  Comment.belongsTo(Comment, {
    foreignKey: "parentCommentId",
    as: "parentComment",
  });

  Comment.hasMany(Comment, {
    foreignKey: "parentCommentId",
    as: "replies",
  });

  // Post ↔ Tag (Many-to-Many)
  if (models.Tag && models.PostTag) {
    Post.belongsToMany(models.Tag, {
      through: models.PostTag,
      foreignKey: 'postId',
      as: 'tags'
    });

    models.Tag.belongsToMany(Post, {
      through: models.PostTag,
      foreignKey: 'tagId',
      as: 'posts'
    });
  }

  // Like associations
  if (models.Like) {
    User.hasMany(models.Like, { foreignKey: 'userId', as: 'likes' });
    models.Like.belongsTo(User, { foreignKey: 'userId', as: 'user' });

    Post.hasMany(models.Like, { foreignKey: 'postId', as: 'likes' });
    models.Like.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

    Comment.hasMany(models.Like, { foreignKey: 'commentId', as: 'likes' });
    models.Like.belongsTo(Comment, { foreignKey: 'commentId', as: 'comment' });
  }
};