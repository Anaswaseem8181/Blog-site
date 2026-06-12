"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Comments", "parentCommentId", {
      type: Sequelize.INTEGER,
      allowNull: true,

      references: {
        model: "Comments",
        key: "id",
      },

      onDelete: "CASCADE",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Comments", "parentCommentId");
  },
};
