module.exports = (sequelize, DataTypes) => {
  const PostTag = sequelize.define(
    "PostTag",
    {
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Posts",
          key: "id",
        },
      },
      tagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Tags",
          key: "id",
        },
      },
    },
    {
      timestamps: true,
    }
  );

  // Set the composite primary key
  PostTag.removeAttribute('id');

  return PostTag;
};
