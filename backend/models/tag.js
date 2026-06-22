module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    "Tag",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: "Tag name is required",
          },
          notEmpty: {
            msg: "Tag name cannot be empty",
          },
        },
      },
    },
    {
      timestamps: true,
    }
  );

  return Tag;
};
