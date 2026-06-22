'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Posts', 'coverImage', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    
    await queryInterface.addColumn('Posts', 'status', {
      type: Sequelize.ENUM('draft', 'published'),
      allowNull: false,
      defaultValue: 'published',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Posts', 'status');
    await queryInterface.removeColumn('Posts', 'coverImage');
  }
};
