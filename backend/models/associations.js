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
    as: "user",
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
};